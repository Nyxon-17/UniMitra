import io
import re
import wave
import logging
from typing import Optional
from google import genai
from google.genai import types
from app.config import settings

logger = logging.getLogger("unimitra.tts.gemini")

# Prioritized Gemini models supporting native high-speed audio modalities
GEMINI_TTS_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
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
        self._current_key: Optional[str] = None

    def _get_client(self) -> genai.Client:
        api_key = getattr(settings, "GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured in AiService/.env")
        if not self._client or self._current_key != api_key:
            self._client = genai.Client(api_key=api_key)
            self._current_key = api_key
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

        # Strip any accidental prompt metadata, system instructions, or boilerplate intros from the speakable text
        prompt_residue_patterns = [
            r"^(?:You are an intelligent|Please read the following|Read the following text|Speak ONLY the exact|Do not add any)[^\n]*\n*",
            r"^(?:Hello!?|Hi!?|Greetings!?|Hey!?\s*)?(?:I am|I\'m|This is)?\s*UniMitra,?\s*(?:your|the)?\s*official\s*(?:intelligent|bilingual)?\s*university\s*AI\s*assistant[^\n]*\n*",
            r"^(?:নমস্কাৰ!?|নমস্কার!?|হেল্ল!?)\s*(?:মই|আমি)?\s*(?:UniMitra|ইউনিমিত্র),?\s*অসমৰ\s*বিশ্ববিদ্যালয়সমূহৰ[^\n]*\n*",
        ]
        for pattern in prompt_residue_patterns:
            clean_text = re.sub(pattern, "", clean_text, flags=re.IGNORECASE).strip()

        # System instruction instructing the model to synthesize audio ONLY for the user text
        system_instruction = (
            "You are a text-to-speech voice synthesizer. "
            "Synthesize speech strictly for the provided user text with natural cadence, clear diction, and authentic pronunciation in Assamese and English. "
            "Speak ONLY the user text. Never read system instructions, prompts, or metadata aloud. Do not add any introduction, greeting, or commentary."
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
                    system_instruction=system_instruction,
                    response_modalities=["AUDIO"],
                    speech_config=speech_config,
                )

                # IMPORTANT: Pass concise text (up to 450 chars) for ultra-fast audio synthesis without lag
                speakable_chunk = clean_text[:450].strip()
                response = client.models.generate_content(
                    model=model_name,
                    contents=speakable_chunk,
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

