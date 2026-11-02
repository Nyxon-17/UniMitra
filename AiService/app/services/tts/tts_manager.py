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
    Centralized Dual-Engine TTS Manager:
    1. Language Routing:
       - Assamese (অসমীয়া) -> Bakbak API
       - English -> GitHub-based TTS (edge-tts)
    2. Credit Protection:
       - In-memory SHA-256 deduplication cache
       - Input validation & truncation
       - Zero duplicate calls to Bakbak for previously generated responses
    """

    def __init__(self):
        # Cache structure: hash(clean_text, lang, gender, voice) -> (audio_bytes, media_type)
        self._cache: Dict[str, Tuple[bytes, str]] = {}
        self._cache_keys: list = []

    def _get_cache_key(self, text: str, lang: str, gender: str, voice: Optional[str]) -> str:
        raw_key = f"{text.strip()}::{lang}::{gender}::{voice or ''}"
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
    ) -> Tuple[bytes, str, str, str]:
        """
        Coordinates dual-engine speech synthesis.
        Returns:
            (audio_bytes, media_type, provider_name, resolved_language)
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        # 1. Clean markdown and sanitize text
        clean_text = language_router.clean_text_for_speech(text)
        if not clean_text:
            raise ValueError("Text contains no speakable characters.")

        # 2. Detect primary language for routing
        primary_lang, confidence = language_router.detect_primary_language(clean_text, hint=language)
        logger.info(
            f"TTS Routing: resolved_lang='{primary_lang}' (confidence={confidence:.2f}) for text length={len(clean_text)}"
        )

        # 3. Apply phonetic normalization for Assamese TTS clarity
        if primary_lang == "as":
            clean_text = language_router.normalize_assamese_for_tts(clean_text)

        # 4. Check deduplication cache
        cache_key = self._get_cache_key(clean_text, primary_lang, gender, voice)
        if cache_key in self._cache:
            cached_bytes, cached_media = self._cache[cache_key]
            logger.info(f"TTS Cache Hit! Serving {len(cached_bytes)} bytes without calling API.")
            provider = "bakbak_cache" if primary_lang == "as" else "github_tts_cache"
            return cached_bytes, cached_media, provider, primary_lang

        # 5. Route to specific engine
        if primary_lang == "as":
            # Primary: Gemini TTS natively speaks Assamese + English mixed and Assinglish
            audio_bytes = await gemini_tts.synthesize_async(
                text=clean_text,
                gender=gender,
                voice_override=voice,
            )
            media_type = "audio/wav"
            provider = "gemini_tts"

            # Resilient Fallback to Bakbak API if Gemini TTS is unavailable or rate limited
            if not audio_bytes:
                logger.info("Falling back to Bakbak API for Assamese speech synthesis...")
                try:
                    audio_bytes = await bakbak_tts.synthesize_async(
                        text=clean_text,
                        gender=gender,
                        voice_override=voice,
                    )
                    if audio_bytes:
                        provider = "bakbak"
                except Exception as b_err:
                    logger.warning(f"Bakbak fallback also failed: {b_err}")
        else:
            # Engine 2: GitHub Open-Source English TTS (edge-tts)
            audio_bytes = await english_tts.synthesize_async(
                text=clean_text,
                gender=gender,
                voice_override=voice,
            )
            media_type = "audio/mpeg"
            provider = "github_english_tts"

        if not audio_bytes:
            raise RuntimeError(f"Speech synthesis failed with provider {provider}.")

        # 5. Cache result to protect credits
        self._store_cache(cache_key, audio_bytes, media_type)

        return audio_bytes, media_type, provider, primary_lang


tts_manager = TTSManager()

