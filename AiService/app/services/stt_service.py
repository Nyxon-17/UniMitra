import asyncio
import logging
from typing import Any, Dict, Optional
from google import genai
from google.genai import types
from app.config import settings
from app.services.embedding_service import normalize_assamese_unicode
from app.services.sarvam_stt import sarvam_stt

logger = logging.getLogger("unimitra.stt")

# Prioritized Gemini multimodal models for speech audio fallback
GEMINI_STT_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-lite-latest",
]


class SpeechToTextService:
    """
    Unified Speech-to-Text Service for UniMitra.
    Primary Engine: Sarvam AI Saaras V4 (Assamese, Romanized Assamese, Code-Mixed, Indian English)
    Fallback Engine: Google Gemini Multimodal Audio
    """

    async def transcribe_async(
        self,
        audio_bytes: bytes,
        mime_type: str = "audio/webm",
        language: str = "as",
        mode: str = "codemix",
        filename: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Transcribes speech audio asynchronously using Sarvam Saaras V4 with Gemini Multimodal fallback.
        """
        if not audio_bytes or len(audio_bytes) < 100:
            return {
                "success": False,
                "transcript": "",
                "language": language or "as",
                "confidence": 0.0,
                "provider": "empty",
                "error": "Audio recording is empty or too short.",
            }

        # 1. Primary: Sarvam AI Saaras V4
        try:
            sarvam_res = await sarvam_stt.transcribe_async(
                audio_bytes=audio_bytes,
                mime_type=mime_type,
                language=language,
                mode=mode,
                filename=filename,
            )
            if sarvam_res.get("success") and sarvam_res.get("transcript"):
                return {
                    "success": True,
                    "transcript": sarvam_res["transcript"],
                    "language": sarvam_res.get("language_code", language),
                    "confidence": 0.99,
                    "provider": "sarvam_saaras_v4",
                    "request_id": sarvam_res.get("request_id"),
                    "mode": sarvam_res.get("mode", mode),
                    "error": None,
                }
            logger.warning(
                f"Sarvam STT returned without transcript (error: {sarvam_res.get('error')}). "
                "Engaging Gemini Multimodal STT fallback..."
            )
        except Exception as e:
            logger.warning(f"Sarvam STT exception: {e}. Engaging Gemini Multimodal STT fallback...")

        # 2. Resilient Fallback: Google Gemini Multimodal Audio
        gemini_res = self.transcribe_gemini(
            audio_bytes=audio_bytes,
            mime_type=mime_type,
            language=language,
        )
        if gemini_res.get("transcript"):
            return {
                "success": True,
                "transcript": gemini_res["transcript"],
                "language": gemini_res.get("language", language),
                "confidence": 0.95,
                "provider": gemini_res.get("provider", "gemini_multimodal"),
                "mode": mode,
                "error": None,
            }

        return {
            "success": False,
            "transcript": "",
            "language": language,
            "confidence": 0.0,
            "provider": "failed",
            "error": "Transcription failed across all engines.",
        }

    def transcribe(
        self,
        audio_bytes: bytes,
        mime_type: str = "audio/webm",
        language: str = "as",
        mode: str = "codemix",
        filename: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Synchronous wrapper for transcribe_async.
        """
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # In an active event loop, run as task or fallback
                import nest_asyncio
                nest_asyncio.apply()
                return loop.run_until_complete(
                    self.transcribe_async(audio_bytes, mime_type, language, mode, filename)
                )
            return loop.run_until_complete(
                self.transcribe_async(audio_bytes, mime_type, language, mode, filename)
            )
        except Exception:
            return asyncio.run(
                self.transcribe_async(audio_bytes, mime_type, language, mode, filename)
            )

    @staticmethod
    def transcribe_gemini(
        audio_bytes: bytes,
        mime_type: str = "audio/webm",
        language: str = "auto",
    ) -> Dict[str, Any]:
        """
        Transcribes speech audio using Google Gemini Multimodal Audio intelligence.
        Natively transcribes Assamese (অসমীয়া), Romanized Assamese (Assinglish), and English without phonetic loss.
        """
        if not audio_bytes or len(audio_bytes) < 100:
            return {
                "transcript": "",
                "language": language or "en",
                "confidence": 0.0,
                "provider": "empty",
            }

        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        prompt = (
            "You are a native bilingual speech recognition engine for Assamese and English. "
            "Listen to this audio recording and transcribe it with 100% precision. "
            "Rules:\n"
            "1. If the speaker spoke in Assamese script or dialect, transcribe in clean Assamese Unicode or accurate words.\n"
            "2. If the speaker spoke in Romanized Assamese (Assinglish, e.g. 'mur hostel r bikhoye kowa'), transcribe their spoken words accurately.\n"
            "3. If the speaker spoke in English or mixed Assamese-English, transcribe each word accurately.\n"
            "4. Return ONLY the transcribed text. Do NOT add preamble, quotes, explanations, or labels."
        )

        clean_mime = (mime_type or "audio/webm").split(";")[0].strip()
        part = types.Part.from_bytes(
            data=audio_bytes,
            mime_type=clean_mime if clean_mime else "audio/webm",
        )

        for model_name in GEMINI_STT_MODELS:
            try:
                logger.info(f"Attempting Gemini STT transcription with model '{model_name}', audio_size={len(audio_bytes)} bytes")
                response = client.models.generate_content(
                    model=model_name,
                    contents=[part, prompt],
                )
                if response and response.text and response.text.strip():
                    raw_text = response.text.strip()
                    clean_transcript = normalize_assamese_unicode(raw_text)
                    logger.info(f"Gemini STT Success [{model_name}]: '{clean_transcript[:80]}'")
                    return {
                        "transcript": clean_transcript,
                        "language": language or "auto",
                        "confidence": 0.95,
                        "provider": f"gemini_{model_name}",
                    }
            except Exception as e:
                logger.warning(f"Gemini STT model '{model_name}' notice: {e}. Trying next candidate...")

        logger.error("All Gemini STT models failed to transcribe audio.")
        return {
            "transcript": "",
            "language": language or "auto",
            "confidence": 0.0,
            "provider": "failed",
        }


stt_service = SpeechToTextService()
