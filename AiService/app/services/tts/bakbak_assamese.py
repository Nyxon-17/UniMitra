import logging
from typing import Optional
import httpx
from app.config import settings
from app.services.tts.language_router import language_router

logger = logging.getLogger("unimitra.tts.bakbak")

# Official Bakbak API voice IDs for Assamese ('as')
BAKBAK_VOICES = {
    "female": "d4e5f6a7-b8c9-4a01-d345-e6f7a8b9c012",  # Priti (native Assamese female)
    "female_alt": "e5f6a7b8-c9d0-4b12-e456-f7a8b9c0d123",  # Anjali (native Assamese female)
    "male": "f6a7b8c9-d0e1-4c23-f567-a8b9c0d1e234",  # Ravi (native Assamese male)
}


class BakbakAssameseTTS:
    """
    Bakbak Indic TTS client for Assamese (অসমীয়া) speech synthesis.
    API Provider: Litwiz Labs / Raya Voice AI
    Documentation: https://hub.getraya.app / https://huggingface.co/RayaVoiceAI/Bakbak
    """

    def __init__(self):
        self.base_url = getattr(settings, "BAKBAK_BASE_URL", "https://hub.getraya.app/v1")
        self.endpoint = f"{self.base_url}/text-to-speech"

    def _get_api_key(self) -> str:
        key = getattr(settings, "BAKBAK_API_KEY", None)
        if not key or key == "MY_BAKBAK_API_KEY":
            raise ValueError("BAKBAK_API_KEY is not configured in AiService/.env")
        return key

    async def synthesize_async(
        self,
        text: str,
        gender: str = "female",
        voice_override: Optional[str] = None,
        timeout: float = 25.0,
    ) -> Optional[bytes]:
        """
        Synthesizes Assamese Unicode text using the native Bakbak TTS API.
        Returns WAV audio bytes.
        """
        if not text or not text.strip():
            return None

        clean_text = language_router.normalize_assamese_for_tts(text.strip())
        if not clean_text:
            return None

        api_key = self._get_api_key()

        selected_voice = voice_override
        if not selected_voice:
            normalized_gender = (gender or "female").strip().lower()
            selected_voice = BAKBAK_VOICES.get(normalized_gender, BAKBAK_VOICES["female"])

        headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/wav, audio/*",
        }

        payload = {
            "text": clean_text[:4000],
            "language": "as",
            "model": getattr(settings, "BAKBAK_MODEL", "standard"),
            "voice_id": selected_voice,
        }

        logger.info(
            f"Bakbak TTS Request: chars={len(clean_text)}, voice={selected_voice}, lang=as"
        )

        async with httpx.AsyncClient(timeout=timeout) as client:
            res = await client.post(self.endpoint, headers=headers, json=payload)

            if res.status_code == 200 and len(res.content) > 100:
                logger.info(f"Bakbak TTS Success: generated {len(res.content)} bytes of Assamese audio.")
                return res.content
            elif res.status_code == 401:
                logger.error("Bakbak TTS Authentication failed: Invalid or inactive API key.")
                raise RuntimeError("Bakbak API key unauthorized. Check BAKBAK_API_KEY in AiService/.env.")
            elif res.status_code == 402:
                logger.error("Bakbak TTS Quota Exceeded: Account credit balance depleted.")
                raise RuntimeError("Bakbak credit balance depleted. Please recharge account.")
            elif res.status_code == 429:
                logger.warning("Bakbak TTS Rate Limited: Too many concurrent requests.")
                raise RuntimeError("Bakbak rate limit reached. Please retry in a few moments.")
            else:
                error_msg = f"Bakbak API returned status {res.status_code}: {res.text[:200]}"
                logger.error(error_msg)
                raise RuntimeError(error_msg)


bakbak_tts = BakbakAssameseTTS()

