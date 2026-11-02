import io
import logging
from typing import Optional

logger = logging.getLogger("unimitra.tts.english")

# GitHub Open-Source TTS Engine: rany2/edge-tts (https://github.com/rany2/edge-tts)
# License: GNU LGPL v3.0 | Zero API charges | Python native server-side synthesis
DEFAULT_ENGLISH_VOICES = {
    "female": "en-IN-NeerjaNeural",
    "male": "en-IN-PrabhatNeural",
    "female_us": "en-US-JennyNeural",
    "male_us": "en-US-GuyNeural",
}


class EnglishGitHubTTS:
    """
    Open-Source GitHub TTS Implementation for English Speech.
    Library: edge-tts (GitHub: rany2/edge-tts)
    Produces natural neural speech audio without browser APIs or external billing.
    """

    def __init__(self):
        try:
            import edge_tts
            self._available = True
        except ImportError:
            self._available = False
            logger.warning("edge_tts package is not installed in the python environment.")

    def is_available(self) -> bool:
        return self._available

    async def synthesize_async(
        self,
        text: str,
        gender: str = "female",
        voice_override: Optional[str] = None,
    ) -> Optional[bytes]:
        """
        Synthesizes English text into MP3 neural audio bytes.
        """
        if not text or not text.strip():
            return None

        clean_text = text.strip()
        normalized_gender = (gender or "female").strip().lower()
        selected_voice = voice_override or DEFAULT_ENGLISH_VOICES.get(
            normalized_gender, DEFAULT_ENGLISH_VOICES["female"]
        )

        try:
            import edge_tts

            logger.info(
                f"GitHub English TTS Request: chars={len(clean_text)}, voice={selected_voice}"
            )
            communicate = edge_tts.Communicate(clean_text, selected_voice)
            audio_buffer = bytearray()

            async for chunk in communicate.stream():
                if chunk.get("type") == "audio":
                    audio_buffer.extend(chunk.get("data"))

            if audio_buffer:
                logger.info(f"GitHub English TTS Success: generated {len(audio_buffer)} bytes.")
                return bytes(audio_buffer)
            else:
                raise RuntimeError("Edge-TTS stream yielded no audio data.")

        except Exception as e:
            logger.error(f"GitHub English TTS error: {e}")
            raise RuntimeError(f"English TTS engine error: {e}")


english_tts = EnglishGitHubTTS()

