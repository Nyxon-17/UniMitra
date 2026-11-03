import hashlib
import logging
from typing import Dict, Optional, Tuple
from app.services.tts.language_router import language_router
from app.services.tts.gemini_tts import gemini_tts
from app.services.tts.bakbak_assamese import bakbak_tts
from app.services.tts.english_tts import english_tts

logger = logging.getLogger("unimitra.tts.manager")

# Maximum cached items in RAM to prevent memory leaks
MAX_CACHE_ENTRIES = 300


class TTSManager:
    """
    Unified Speech Synthesis (TTS) Manager:
    - Primary Engine: Google Gemini Native Audio TTS for ALL languages
      (English, Pure Assamese, Assamese-English code-mixed, and Romanized Assamese).
    - Uses Google Gemini TTS exclusively for all voice assistance queries.
    - Credit & Latency Protection:
      - In-memory SHA-256 deduplication cache
      - Zero redundant API calls for cached responses
    """

    def __init__(self):
        # Cache structure: hash(clean_text, lang, gender, voice, speed) -> (audio_bytes, media_type)
        self._cache: Dict[str, Tuple[bytes, str]] = {}
        self._cache_keys: list = []

    def _get_cache_key(self, text: str, lang: str, gender: str, voice: Optional[str], speed: Optional[float] = 1.0) -> str:
        speed_val = f"{speed:.2f}" if speed is not None else "1.00"
        raw_key = f"{text.strip()}::{lang}::{gender}::{voice or ''}::{speed_val}"
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    def _store_cache(self, key: str, audio_bytes: bytes, media_type: str) -> None:
        if len(self._cache_keys) >= MAX_CACHE_ENTRIES:
            oldest_key = self._cache_keys.pop(0)
            self._cache.pop(oldest_key, None)
        self._cache[key] = (audio_bytes, media_type)
        self._cache_keys.append(key)

    async def generate_speech(
        self,
        text: str,
        language: Optional[str] = None,
        gender: str = "female",
        voice: Optional[str] = None,
        speed: Optional[float] = None,
    ) -> Tuple[bytes, str, str, str]:
        """
        Synthesizes speech using Google Gemini TTS for all languages with resilient fallbacks.
        Returns:
            (audio_bytes, media_type, provider_name, resolved_language)
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        # 1. Clean markdown and sanitize text
        clean_text = language_router.clean_text_for_speech(text)
        if not clean_text:
            raise ValueError("Text contains no speakable characters.")

        # 2. Classify text category for language resolution
        category, primary_lang, confidence = language_router.classify_text_for_tts(clean_text, hint=language)
        logger.info(
            f"TTS Request: category='{category}', resolved_lang='{primary_lang}' (confidence={confidence:.2f}), length={len(clean_text)}"
        )

        # 3. Apply phonetic normalization for Assamese script clarity
        if primary_lang == "as":
            clean_text = language_router.normalize_assamese_for_tts(clean_text)

        # 4. Check deduplication cache
        cache_key = self._get_cache_key(clean_text, category, gender, voice, speed)
        if cache_key in self._cache:
            cached_bytes, cached_media = self._cache[cache_key]
            logger.info(f"TTS Cache Hit! Serving {len(cached_bytes)} bytes from cache.")
            provider = f"gemini_{category}_cache"
            return cached_bytes, cached_media, provider, primary_lang

        # 5. Primary Speech Synthesis Engine: Google Gemini Native Audio TTS for ALL languages
        # (Pure Assamese, Pure English, Assamese+English Code-mixed, and Romanized Assamese)
        logger.info(f"Synthesizing '{category}' ({primary_lang}) speech using primary Google Gemini TTS...")
        audio_bytes = None
        media_type = "audio/wav"
        provider = f"gemini_tts_{category}"

        try:
            audio_bytes = await gemini_tts.synthesize_async(
                text=clean_text,
                gender=gender,
                voice_override=voice,
            )
        except Exception as g_err:
            logger.warning(f"Primary Gemini TTS error for '{category}': {g_err}")
            audio_bytes = None

        # 6. Resilient Fallbacks (engaged ONLY if Gemini TTS quota is temporarily exhausted)
        if not audio_bytes:
            logger.info(f"Gemini TTS unavailable; engaging resilient fallback for '{category}' ({primary_lang})...")
            if category in ("pure_assamese", "assamese_english") or primary_lang == "as":
                try:
                    audio_bytes = await bakbak_tts.synthesize_async(
                        text=clean_text,
                        gender=gender,
                        voice_override=voice,
                        speed=speed,
                    )
                    if audio_bytes:
                        media_type = "audio/wav"
                        provider = "bakbak_fallback"
                except Exception as b_err:
                    logger.warning(f"Bakbak fallback notice: {b_err}")

            if not audio_bytes:
                try:
                    audio_bytes = await english_tts.synthesize_async(
                        text=clean_text,
                        gender=gender,
                        voice_override=voice,
                    )
                    if audio_bytes:
                        media_type = "audio/mpeg"
                        provider = "github_english_fallback"
                except Exception as e_err:
                    logger.warning(f"GitHub fallback notice: {e_err}")

        if not audio_bytes:
            raise RuntimeError(f"All speech synthesis engines exhausted for category '{category}' ({primary_lang}).")

        # 7. Cache result to protect credits and avoid duplicate calls
        self._store_cache(cache_key, audio_bytes, media_type)

        return audio_bytes, media_type, provider, primary_lang


tts_manager = TTSManager()

