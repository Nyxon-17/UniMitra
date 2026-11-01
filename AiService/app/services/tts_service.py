import asyncio
import io
import logging
from typing import Optional

logger = logging.getLogger("unimitra.tts")


class TextToSpeechService:
    @staticmethod
    async def synthesize_async(text: str, language: str = "as") -> Optional[bytes]:
        """
        Synthesizes text into high quality natural speech audio bytes.
        Uses Edge-TTS Neural voices with fallback to gTTS.
        """
        if not text or not text.strip():
            return None

        clean_text = text.replace("*", "").replace("#", "").replace("`", "").strip()
        # Truncate to first 400 characters for snappy voice response
        if len(clean_text) > 400:
            clean_text = clean_text[:400] + "..."

        # 1. Try edge-tts for high quality neural voice with 8s timeout
        try:
            import edge_tts

            voice = "bn-IN-TanishaaNeural" if language == "as" else "en-IN-NeerjaNeural"

            async def _run_edge_tts():
                communicate = edge_tts.Communicate(clean_text, voice)
                audio_buffer = bytearray()
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        audio_buffer.extend(chunk["data"])
                return bytes(audio_buffer) if audio_buffer else None

            result = await asyncio.wait_for(_run_edge_tts(), timeout=8.0)
            if result:
                return result
        except Exception as e:
            logger.warning(f"edge-tts synthesis notice: {e}. Trying gTTS fallback...")

        # 2. Fallback to gTTS
        try:
            from gtts import gTTS

            tts_lang = "bn" if language == "as" else "en"
            tts = gTTS(text=clean_text, lang=tts_lang, slow=False)
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return fp.read()
        except Exception as e:
            logger.error(f"gTTS fallback error: {e}")

        return None


tts_service = TextToSpeechService()

