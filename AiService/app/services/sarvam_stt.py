import logging
from typing import Any, Dict, Optional
import httpx
from app.config import settings
from app.services.embedding_service import normalize_assamese_unicode

logger = logging.getLogger("unimitra.sarvam_stt")

# Supported modes documented for Sarvam Saaras v4
VALID_SARVAM_MODES = {"transcribe", "translit", "codemix", "verbatim", "translate"}

# Supported BCP-47 language codes
VALID_SARVAM_LANGUAGES = {
    "as": "as-IN",
    "as-in": "as-IN",
    "as_in": "as-IN",
    "en": "en-IN",
    "en-in": "en-IN",
    "en_in": "en-IN",
    "unknown": "unknown",
    "auto": "unknown",
}

MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB max limit


class SarvamSTTService:
    """
    Official Sarvam AI Saaras V4 Speech-to-Text Integration for UniMitra.
    Supports Assamese (অসমীয়া), Romanized Assamese (Assinglish), and Indian English.
    Documentation: https://docs.sarvam.ai/api-reference-docs/speech-to-text/transcribe
    """

    def __init__(self):
        self.endpoint = f"{settings.SARVAM_BASE_URL.rstrip('/')}/speech-to-text"
        self.model = settings.SARVAM_STT_MODEL or "saaras:v4"

    def _get_api_key(self) -> Optional[str]:
        key = getattr(settings, "SARVAM_API_KEY", None)
        if not key or key.strip() in {"", "your_api_key", "MY_SARVAM_API_KEY"}:
            return None
        return key.strip()

    def resolve_language_code(self, lang_input: Optional[str]) -> str:
        """
        Maps user or frontend language identifiers to Sarvam BCP-47 codes.
        Defaults to 'as-IN' for Assamese contexts or 'unknown' for auto-detection.
        """
        if not lang_input:
            return "as-IN"
        normalized = lang_input.strip().lower()
        return VALID_SARVAM_LANGUAGES.get(normalized, "as-IN")

    def resolve_mode(self, mode_input: Optional[str], lang_input: Optional[str] = None) -> str:
        """
        Selects the appropriate Sarvam Saaras V4 transcription mode:
        - 'transcribe': Native-script transcription (Assamese Unicode).
        - 'translit': Romanized transcription (Latin/English script, e.g. 'mur hostel r bikhoye kowa').
        - 'codemix': Natural Assamese-English code-mixed transcription.
        """
        if mode_input and mode_input.lower() in VALID_SARVAM_MODES:
            return mode_input.lower()
        if mode_input in {"roman", "as_roman", "romanized"}:
            return "translit"
        if mode_input in {"script", "as_script", "unicode"}:
            return "transcribe"
        # When language is 'as' or Assamese with mixed English terms, 'codemix' provides the best code-mixing retention
        if lang_input and "roman" in lang_input.lower():
            return "translit"
        return "codemix"

    async def transcribe_async(
        self,
        audio_bytes: bytes,
        mime_type: str = "audio/webm",
        language: str = "as-IN",
        mode: str = "codemix",
        filename: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Transcribes recorded speech audio using the official Sarvam AI Saaras V4 STT API.
        """
        if not audio_bytes or len(audio_bytes) < 100:
            logger.warning("Empty or truncated audio received (<100 bytes).")
            return {
                "success": False,
                "transcript": "",
                "language_code": language,
                "mode": mode,
                "provider": "empty",
                "error": "Audio recording is empty or too short.",
            }

        if len(audio_bytes) > MAX_AUDIO_SIZE_BYTES:
            logger.warning(f"Audio file exceeds size limit ({len(audio_bytes)} bytes > {MAX_AUDIO_SIZE_BYTES}).")
            return {
                "success": False,
                "transcript": "",
                "language_code": language,
                "mode": mode,
                "provider": "error",
                "error": "Audio file exceeds maximum 25MB limit.",
            }

        api_key = self._get_api_key()
        if not api_key:
            logger.error("SARVAM_API_KEY is not configured in AiService/.env")
            return {
                "success": False,
                "transcript": "",
                "language_code": language,
                "mode": mode,
                "provider": "unconfigured",
                "error": "SARVAM_API_KEY is missing from environment.",
            }

        resolved_lang = self.resolve_language_code(language)
        resolved_mode = self.resolve_mode(mode, language)
        clean_mime = (mime_type or "audio/webm").split(";")[0].strip()

        # Build suitable filename extension for multipart upload
        ext = "webm"
        if "wav" in clean_mime:
            ext = "wav"
        elif "mp3" in clean_mime or "mpeg" in clean_mime:
            ext = "mp3"
        elif "ogg" in clean_mime or "opus" in clean_mime:
            ext = "ogg"
        elif "m4a" in clean_mime or "mp4" in clean_mime:
            ext = "m4a"

        upload_filename = filename or f"voice_input.{ext}"

        logger.info(
            f"Forwarding audio to Sarvam Saaras V4 [model={self.model}, mode={resolved_mode}, "
            f"lang={resolved_lang}, bytes={len(audio_bytes)}, file={upload_filename}]"
        )

        headers = {
            "api-subscription-key": api_key,
        }
        files = {
            "file": (upload_filename, audio_bytes, clean_mime),
        }
        data = {
            "model": self.model,
            "mode": resolved_mode,
            "language_code": resolved_lang,
        }

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                response = await client.post(
                    self.endpoint,
                    headers=headers,
                    files=files,
                    data=data,
                )

            if response.status_code == 200:
                result = response.json()
                raw_transcript = result.get("transcript", "") or ""
                detected_lang = result.get("language_code", resolved_lang)
                request_id = result.get("request_id", "")

                clean_transcript = normalize_assamese_unicode(raw_transcript.strip())
                logger.info(
                    f"Sarvam Saaras V4 Success [req_id={request_id}, lang={detected_lang}]: '{clean_transcript[:80]}'"
                )

                return {
                    "success": True,
                    "transcript": clean_transcript,
                    "language_code": detected_lang,
                    "mode": resolved_mode,
                    "request_id": request_id,
                    "provider": "sarvam_saaras_v4",
                    "error": None,
                }

            # Handle documented HTTP error codes safely
            status_code = response.status_code
            error_text = response.text[:300]
            logger.warning(f"Sarvam API error [HTTP {status_code}]: {error_text}")

            error_msg = f"Sarvam STT returned HTTP {status_code}"
            if status_code == 400:
                error_msg = "Invalid audio format or parameters sent to Sarvam API."
            elif status_code == 401 or status_code == 403:
                error_msg = "Sarvam API authentication failed. Verify SARVAM_API_KEY."
            elif status_code == 429:
                error_msg = "Sarvam API quota exceeded or rate limit reached."

            return {
                "success": False,
                "transcript": "",
                "language_code": resolved_lang,
                "mode": resolved_mode,
                "provider": "sarvam_saaras_v4",
                "error": error_msg,
            }

        except httpx.TimeoutException:
            logger.error("Sarvam API request timed out after 25s.")
            return {
                "success": False,
                "transcript": "",
                "language_code": resolved_lang,
                "mode": resolved_mode,
                "provider": "sarvam_saaras_v4",
                "error": "Sarvam API transcription timed out.",
            }
        except Exception as e:
            logger.error(f"Unexpected error communicating with Sarvam API: {e}")
            return {
                "success": False,
                "transcript": "",
                "language_code": resolved_lang,
                "mode": resolved_mode,
                "provider": "sarvam_saaras_v4",
                "error": str(e),
            }


sarvam_stt = SarvamSTTService()

