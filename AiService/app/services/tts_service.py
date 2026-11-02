import asyncio
import io
import logging
from typing import Optional, List

# Ensure static_ffmpeg binary paths are initialized for pydub and sound processing
try:
    import static_ffmpeg
    static_ffmpeg.add_paths()
except Exception:
    pass

try:
    import tts_accelerator as tts_acc
    from tts_accelerator.core import split_and_merge, generate_audio
    HAS_TTS_ACCELERATOR = True
except Exception as e:
    HAS_TTS_ACCELERATOR = False

logger = logging.getLogger("unimitra.tts")


class TextToSpeechService:
    @staticmethod
    def clean_text(text: str) -> str:
        """Removes markdown symbols and technical artifacts for clean voice rendering."""
        if not text:
            return ""
        return (
            text.replace("*", "")
            .replace("#", "")
            .replace("=", " ")
            .replace("/", " or ")
            .replace("`", "")
            .replace("~", "")
            .strip()
        )

    @classmethod
    def get_neural_voice(cls, language: str = "as", gender: str = "male", voice_override: Optional[str] = None) -> str:
        """
        Maps language mode and gender to the best natural sounding neural voice.
        
        Requirements:
        1. Chatbot Text Listen feature -> MALE voice:
           - Assamese: "bn-IN-BashkarNeural"
           - English / Romanized Assamese: "en-IN-PrabhatNeural"
           
        2. Voice Assistant -> FEMALE voice:
           - Assamese: "bn-IN-TanishaaNeural"
           - English / Romanized Assamese: "en-IN-NeerjaNeural"
        """
        if voice_override:
            return voice_override

        is_assamese = language in ("as", "as_script")
        is_female = bool(gender and gender.strip().lower() == "female")

        if is_female:
            # Voice Assistant -> Female Voice
            return "bn-IN-TanishaaNeural" if is_assamese else "en-IN-NeerjaNeural"
        else:
            # Chatbot Text Listen Feature -> Male Voice
            return "bn-IN-BashkarNeural" if is_assamese else "en-IN-PrabhatNeural"

    @classmethod
    def speak_text(cls, text: str, voice: Optional[str] = None, gender: str = "male", language: str = "en") -> None:
        """
        Hardware/local playback using TTS-Accelerator (producer-consumer pipeline).
        Plays directly to speakers via sounddevice with ultra-fast latency.
        """
        if not text or not text.strip():
            return
        clean = cls.clean_text(text)
        selected_voice = voice or cls.get_neural_voice(language=language, gender=gender)
        if HAS_TTS_ACCELERATOR:
            tts_acc.speak_text(clean, selected_voice)
        else:
            logger.warning("tts_accelerator not available for local playback")

    @classmethod
    async def synthesize_async(
        cls,
        text: str,
        language: str = "as",
        gender: str = "male",
        voice: Optional[str] = None
    ) -> Optional[bytes]:
        """
        Synthesizes text into high-fidelity neural audio bytes.
        Leverages TTS-Accelerator split-and-pipeline principles:
        1. Fast chunking: initial fragment generated immediately in RAM.
        2. Concurrent fragment synthesis for long responses (up to 16,000+ chars).
        3. Memory-based streaming without disk I/O.
        4. Configurable male (text listen) vs female (voice assistant) voices.
        5. Multi-level fallback (Edge-TTS -> gTTS).
        """
        if not text or not text.strip():
            return None

        clean_text = cls.clean_text(text)
        if not clean_text:
            return None

        selected_voice = voice or cls.get_neural_voice(language=language, gender=gender)

        # 1. Try Accelerated Edge-TTS in-memory synthesis
        try:
            import edge_tts

            # If text is short (< 300 chars), synthesize directly in single shot
            if len(clean_text) < 300 or not HAS_TTS_ACCELERATOR:
                communicate = edge_tts.Communicate(clean_text, selected_voice)
                audio_buffer = bytearray()
                async for chunk in communicate.stream():
                    if chunk.get("type") == "audio":
                        audio_buffer.extend(chunk.get("data"))
                if audio_buffer:
                    return bytes(audio_buffer)

            # Accelerated Pipeline for longer texts:
            # Use split_and_merge to segment text into fast initial chunk + sentence chunks
            try:
                fragments = split_and_merge(clean_text)
            except Exception:
                fragments = [clean_text]

            if len(fragments) <= 1:
                communicate = edge_tts.Communicate(clean_text, selected_voice)
                audio_buffer = bytearray()
                async for chunk in communicate.stream():
                    if chunk.get("type") == "audio":
                        audio_buffer.extend(chunk.get("data"))
                return bytes(audio_buffer) if audio_buffer else None

            # Concurrently synthesize fragments in RAM using asyncio.gather
            async def _synthesize_fragment(frag: str) -> bytes:
                if not frag or not frag.strip():
                    return b""
                stream = edge_tts.Communicate(frag, selected_voice)
                frag_buf = bytearray()
                async for chunk in stream.stream():
                    if chunk.get("type") == "audio":
                        frag_buf.extend(chunk.get("data"))
                return bytes(frag_buf)

            # Parallel synthesis of all chunks
            results: List[bytes] = await asyncio.gather(
                *[_synthesize_fragment(frag) for frag in fragments],
                return_exceptions=True
            )

            combined_buffer = bytearray()
            for res in results:
                if isinstance(res, bytes) and res:
                    combined_buffer.extend(res)

            if combined_buffer:
                return bytes(combined_buffer)

        except Exception as e:
            logger.warning(f"Accelerated Edge-TTS synthesis notice: {e}. Trying fallback...")

        # 2. Fallback to gTTS
        try:
            from gtts import gTTS

            tts_lang = "bn" if language in ("as", "as_script") else "en"
            tts = gTTS(text=clean_text[:600], lang=tts_lang, slow=False)
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return fp.read()
        except Exception as e:
            logger.error(f"gTTS fallback error: {e}")

        return None


tts_service = TextToSpeechService()
