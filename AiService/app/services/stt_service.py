import logging
from typing import Any, Dict
from google import genai
from google.genai import types
from app.config import settings
from app.services.embedding_service import normalize_assamese_unicode

logger = logging.getLogger("unimitra.stt")

# Prioritized Gemini multimodal models for speech audio transcription
GEMINI_STT_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-lite-latest",
]


class SpeechToTextService:
    @staticmethod
    def transcribe(audio_bytes: bytes, mime_type: str = "audio/webm", language: str = "auto") -> Dict[str, Any]:
        """
        Transcribes speech audio using Google Gemini Multimodal Audio intelligence.
        Natively transcribes Assamese (অসমীয়া), Romanized Assamese (Assinglish), and English without phonetic loss.
        """
        if not audio_bytes or len(audio_bytes) < 100:
            return {
                "transcript": "",
                "language": language or "en",
                "confidence": 0.0,
                "provider": "empty"
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
                        "confidence": 0.99,
                        "provider": f"gemini_{model_name}"
                    }
            except Exception as e:
                logger.warning(f"Gemini STT model '{model_name}' notice: {e}. Trying next candidate...")

        logger.error("All Gemini STT models failed to transcribe audio.")
        return {
            "transcript": "",
            "language": language or "auto",
            "confidence": 0.0,
            "provider": "failed"
        }


stt_service = SpeechToTextService()
