import io
import wave
import logging
from typing import Optional
from google import genai
from google.genai import types
from app.config import settings

logger = logging.getLogger("unimitra.tts.gemini")

# Prioritized Gemini models supporting native audio modalities
GEMINI_TTS_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-flash-lite-latest",
]

DEFAULT_VOICE_NAMES = {
    "female": "Kore",
    "female_alt": "Aoede",
    "male": "Puck",
    "male_alt": "Fenrir",
}


class GeminiTTS:
    """
    Google Gemini Speech Synthesis (TTS) Engine.
    Natively speaks Assamese, Assamese-English mixed, and Assinglish speech.
    Produces high-fidelity audio with natural human inflection.
    """

    def __init__(self):
        self._client: Optional[genai.Client] = None

    def _get_client(self) -> genai.Client:
        if not self._client:
            api_key = getattr(settings, "GEMINI_API_KEY", "")
            if not api_key:
                raise ValueError("GEMINI_API_KEY is not configured in AiService/.env")
            self._client = genai.Client(api_key=api_key)
        return self._client

    @staticmethod
    def _pcm_to_wav(pcm_data: bytes, sample_rate: int = 24000, channels: int = 1, sample_width: int = 2) -> bytes:
        """Converts raw 24kHz 16-bit mono PCM into standard WAV audio container."""
        wav_io = io.BytesIO()
        with wave.open(wav_io, "wb") as wav_file:
            wav_file.setnchannels(channels)
            wav_file.setsampwidth(sample_width)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(pcm_data)
        return wav_io.getvalue()

    async def synthesize_async(
        self,
        text: str,
        gender: str = "female",
        voice_override: Optional[str] = None,
        timeout: float = 25.0,
    ) -> Optional[bytes]:
        """
        Synthesizes Assamese + English speech using Gemini native audio output.
        Returns WAV audio bytes.
        """
        if not text or not text.strip():
            return None

        clean_text = text.strip()
        client = self._get_client()

        norm_gender = (gender or "female").strip().lower()
        selected_voice = voice_override or DEFAULT_VOICE_NAMES.get(norm_gender, "Kore")

        prompt = (
            "You are an intelligent bilingual university voice assistant. "
            "Read the following text aloud with natural human cadence, clear pronunciation in Assamese and English. "
            "Speak ONLY the exact words provided. Do not add any greeting, preamble, commentary, or outro:\n\n"
            f"{clean_text[:3000]}"
        )

        for model_name in GEMINI_TTS_MODELS:
            try:
                logger.info(
                    f"Gemini TTS Attempt: model={model_name}, voice={selected_voice}, chars={len(clean_text)}"
                )
                speech_config = types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=selected_voice
                        )
                    )
                )

                config = types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=speech_config,
                    temperature=0.3,
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config,
                )

                if response and response.candidates:
                    candidate = response.candidates[0]
                    if candidate.content and candidate.content.parts:
                        for part in candidate.content.parts:
                            if hasattr(part, "inline_data") and part.inline_data:
                                data = part.inline_data.data
                                mime = getattr(part.inline_data, "mime_type", "") or ""
                                if data:
                                    logger.info(
                                        f"Gemini TTS Success via {model_name} (mime={mime}, size={len(data)} bytes)"
                                    )
                                    if "pcm" in mime.lower() or not data.startswith(b"RIFF"):
                                        return self._pcm_to_wav(data)
                                    return data

            except Exception as e:
                logger.warning(f"Gemini TTS with model {model_name} failed: {e}. Trying next model...")

        logger.error("All Gemini TTS models exhausted.")
        return None


gemini_tts = GeminiTTS()

