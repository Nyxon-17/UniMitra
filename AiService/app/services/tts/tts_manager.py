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

        # 2. Classify text category for specialized routing
        category, primary_lang, confidence = language_router.classify_text_for_tts(clean_text, hint=language)
        logger.info(
            f"TTS Routing: category='{category}', resolved_lang='{primary_lang}' (confidence={confidence:.2f}) for text length={len(clean_text)}"
        )

        # 3. Apply phonetic normalization for Assamese TTS clarity
        if primary_lang == "as":
            clean_text = language_router.normalize_assamese_for_tts(clean_text)

        # 4. Check deduplication cache
        cache_key = self._get_cache_key(clean_text, category, gender, voice, speed)
        if cache_key in self._cache:
            cached_bytes, cached_media = self._cache[cache_key]
            logger.info(f"TTS Cache Hit! Serving {len(cached_bytes)} bytes from cache.")
            provider = f"{category}_cache"
            return cached_bytes, cached_media, provider, primary_lang

        # 5. Route to specific engine according to language and code-mixing
        if category == "pure_assamese":
            # Pure Assamese speech -> Native Bakbak Assamese Voice Engine
            logger.info("Routing pure Assamese text to native Bakbak Assamese TTS...")
            try:
                audio_bytes = await bakbak_tts.synthesize_async(
                    text=clean_text,
                    gender=gender,
                    voice_override=voice,
                    speed=speed,
                )
                media_type = "audio/wav"
                provider = "bakbak_pure_assamese"
            except Exception as b_err:
                logger.warning(f"Bakbak TTS error: {b_err}. Falling back to Gemini TTS...")
                audio_bytes = None

            # Resilient Fallback to Gemini TTS if Bakbak is unavailable
            if not audio_bytes:
                logger.info("Engaging Gemini TTS fallback for Assamese speech...")
                audio_bytes = await gemini_tts.synthesize_async(
                    text=clean_text,
                    gender=gender,
                    voice_override=voice,
                )
                if audio_bytes:
                    media_type = "audio/wav"
                    provider = "gemini_tts_fallback"

        elif category == "assamese_english":
            # English + Assamese (Code-mixed or Romanized Assamese) -> Gemini TTS
            logger.info("Routing English+Assamese code-mixed speech to Gemini TTS...")
            audio_bytes = await gemini_tts.synthesize_async(
                text=clean_text,
                gender=gender,
                voice_override=voice,
            )
            media_type = "audio/wav"
            provider = "gemini_tts_codemix"

            # Resilient Fallback to Bakbak API
            if not audio_bytes:
                logger.info("Falling back to Bakbak API for mixed Assamese-English...")
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
                    logger.warning(f"Bakbak fallback error: {b_err}")

        else:
            # Pure English -> GitHub Open-Source English TTS (edge-tts)
            logger.info("Routing pure English speech to GitHub edge-tts...")
            try:
                audio_bytes = await english_tts.synthesize_async(
                    text=clean_text,
                    gender=gender,
                    voice_override=voice,
                )
                media_type = "audio/mpeg"
                provider = "github_english_tts"
            except Exception as e_err:
                logger.warning(f"GitHub English TTS error: {e_err}. Falling back to Gemini TTS...")
                audio_bytes = None

            # Resilient Fallback to Gemini TTS if GitHub edge-tts is unavailable
            if not audio_bytes:
                logger.info("Falling back to Gemini TTS for English speech...")
                audio_bytes = await gemini_tts.synthesize_async(
                    text=clean_text,
                    gender=gender,
                    voice_override=voice,
                )
                if audio_bytes:
                    media_type = "audio/wav"
                    provider = "gemini_tts_fallback"

        if not audio_bytes:
            raise RuntimeError(f"Speech synthesis failed with provider {provider}.")

        # 5. Cache result to protect credits
        self._store_cache(cache_key, audio_bytes, media_type)

        return audio_bytes, media_type, provider, primary_lang


tts_manager = TTSManager()

