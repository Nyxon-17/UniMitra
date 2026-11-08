import io
import re
import wave
import logging
from typing import Optional, List
from google import genai
from google.genai import types
from app.config import settings

logger = logging.getLogger("unimitra.tts.gemini")

# Assamese script Unicode block: U+0980 to U+09FF
ASSAMESE_SCRIPT_REGEX = re.compile(r"[\u0980-\u09FF]")

# Prioritized Gemini models supporting native high-speed audio modalities
def get_gemini_tts_models() -> List[str]:
    configured = (getattr(settings, "GEMINI_TTS_MODEL", "") or "").strip()
    candidates = [
        configured,
        "gemini-3.8-flash-tts",
        "gemini-3.8-flash-lite-tts",
        "gemini-2.5-flash-preview-tts",
        "gemini-3.1-flash-tts-preview",
        "gemini-2.0-flash",
        "gemini-2.5-flash",
    ]
    seen = set()
    return [m for m in candidates if m and not (m in seen or seen.add(m))]

DEFAULT_VOICE_NAMES = {
    "female": "Kore",
    "female_alt": "Aoede",
    "male": "Puck",
    "male_alt": "Fenrir",
}


def resolve_voice_name(gender: str = "female", voice_override: Optional[str] = None) -> str:
    if voice_override and voice_override.strip():
        return voice_override.strip()
    norm_gender = (gender or "female").strip().lower()
    configured_voice = (getattr(settings, "GEMINI_TTS_VOICE", "") or "").strip()
    if norm_gender in ("female", "woman", "girl"):
        return configured_voice or DEFAULT_VOICE_NAMES["female"]
    elif norm_gender in ("female_alt", "alt_female"):
        return DEFAULT_VOICE_NAMES["female_alt"]
    elif norm_gender in ("male", "man", "boy"):
        return DEFAULT_VOICE_NAMES["male"]
    elif norm_gender in ("male_alt", "alt_male"):
        return DEFAULT_VOICE_NAMES["male_alt"]
    return configured_voice or DEFAULT_VOICE_NAMES["female"]


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
        Synthesizes crystal-clear Assamese and multilingual speech using Google Gemini native audio output.
        Returns standard WAV audio bytes.
        """
        if not text or not text.strip():
            return None

        clean_text = text.strip()
        client = self._get_client()

        selected_voice = resolve_voice_name(gender, voice_override)

        # Strip any accidental prompt metadata, system instructions, or boilerplate intros from the speakable text
        prompt_residue_patterns = [
            r"^(?:You are an intelligent|Please read the following|Read the following text|Speak ONLY the exact|Do not add any)[^\n]*\n*",
            r"^(?:Hello!?|Hi!?|Greetings!?|Hey!?\s*)?(?:I am|I\'m|This is)?\s*UniMitra,?\s*(?:your|the)?\s*official\s*(?:intelligent|bilingual)?\s*university\s*AI\s*assistant[^\n]*\n*",
            r"^(?:নমস্কাৰ!?|নমস্কার!?|হেল্ল!?)\s*(?:মই|আমি)?\s*(?:UniMitra|ইউনিমিত্র),?\s*অসমৰ\s*বিশ্ববিদ্যালয়সমূহৰ[^\n]*\n*",
        ]
        for pattern in prompt_residue_patterns:
            clean_text = re.sub(pattern, "", clean_text, flags=re.IGNORECASE).strip()

        # Import phonetic normalizer and audio text cleaners
        try:
            from app.services.tts.language_router import language_router
            clean_text = language_router.clean_text_for_speech(clean_text)
            if ASSAMESE_SCRIPT_REGEX.search(clean_text):
                clean_text = language_router.normalize_assamese_for_tts(clean_text)
        except Exception as norm_err:
            logger.debug(f"Assamese phonetic normalization skipped: {norm_err}")

        # Choose natural sentence/word boundary for speakable chunk up to ~450 characters
        if len(clean_text) > 450:
            last_space = clean_text.rfind(" ", 0, 450)
            speakable_chunk = clean_text[:last_space].strip() if last_space > 200 else clean_text[:450].strip()
        else:
            speakable_chunk = clean_text

        models = get_gemini_tts_models()
        for model_name in models:
            try:
                logger.info(
                    f"Gemini TTS Attempt: model={model_name}, voice={selected_voice}, chars={len(speakable_chunk)}"
                )
                speech_config = types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=selected_voice
                        )
                    )
                )

                # GenerateContentConfig without system_instruction (TTS models do not support Developer instructions)
                config = types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=speech_config,
                )

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

