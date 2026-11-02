import logging
from typing import Optional
from app.services.tts.tts_manager import tts_manager
from app.services.tts.language_router import language_router

logger = logging.getLogger("unimitra.tts")


class TextToSpeechService:
    @staticmethod
    def clean_text(text: str) -> str:
        """Removes markdown symbols and technical artifacts for clean voice rendering."""
        return language_router.clean_text_for_speech(text)

    @classmethod
    async def synthesize_async(
        cls,
        text: str,
        language: str = "as",
        gender: str = "female",
        voice: Optional[str] = None
    ) -> Optional[bytes]:
        """
        Synthesizes text using the Dual-Engine TTS system:
        - Assamese (অসমীয়া) -> Bakbak API (WAV)
        - English -> GitHub-based Open-Source TTS (edge-tts MP3)
        """
        if not text or not text.strip():
            return None

        try:
            audio_bytes, media_type, provider, resolved_lang = await tts_manager.generate_speech(
                text=text,
                language=language,
                gender=gender,
                voice=voice,
            )
            return audio_bytes
        except Exception as e:
            logger.error(f"TextToSpeechService error: {e}")
            return None


tts_service = TextToSpeechService()
