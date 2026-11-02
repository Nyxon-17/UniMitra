# Re-export voice router for route compatibility
from app.api.voice import router, transcribe_voice, synthesize_speech

__all__ = ["router", "transcribe_voice", "synthesize_speech"]

