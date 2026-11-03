import logging
from fastapi import APIRouter, HTTPException, Response, status
from app.models.request_models import TTSGenerateRequest
from app.services.tts.tts_manager import tts_manager

logger = logging.getLogger("unimitra.api.tts")
router = APIRouter(prefix="/api/tts", tags=["Text-to-Speech"])


@router.post("/generate")
async def generate_speech_endpoint(req: TTSGenerateRequest):
    """
    Unified Speech Synthesis (TTS) Endpoint:
    - Primary Engine: Google Gemini Native Audio TTS for ALL languages (English, Assamese, Code-Mixed)
    - Exclusively uses Google Gemini TTS for all voice assistant responses.
    Includes in-memory deduplication caching to minimize external API consumption.
    """
    if not req.text or not req.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text payload cannot be empty.",
        )

    try:
        audio_bytes, media_type, provider, resolved_lang = await tts_manager.generate_speech(
            text=req.text,
            language=req.language,
            gender=req.gender or "female",
            voice=req.voice,
            speed=req.speed,
        )

        filename = f"unimitra_{resolved_lang}.{'wav' if 'wav' in media_type else 'mp3'}"
        return Response(
            content=audio_bytes,
            media_type=media_type,
            headers={
                "Content-Length": str(len(audio_bytes)),
                "Content-Disposition": f"inline; filename={filename}",
                "X-TTS-Provider": provider,
                "X-TTS-Language": resolved_lang,
            },
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except RuntimeError as re:
        logger.error(f"TTS Generation failed: {re}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(re),
        )
    except Exception as e:
        logger.error(f"Unexpected TTS generation error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech synthesis error: {e}",
        )

