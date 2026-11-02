import logging
from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status
from app.core.security import verify_internal_secret
from app.models.request_models import VoiceSynthesizeRequest
from app.models.response_models import VoiceTranscribeResponse
from app.services.stt_service import stt_service
from app.services.tts_service import tts_service

logger = logging.getLogger("unimitra.api.voice")
router = APIRouter(prefix="/api/ai/voice", tags=["Voice AI"])


@router.post("/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_voice(
    language: str = Form("as"),
    audio: UploadFile = File(...),
    _auth: bool = Depends(verify_internal_secret),
):
    """
    Speech-to-Text transcription for Assamese and English speech audio.
    """
    logger.info(f"Transcribing audio [lang={language}, filename={audio.filename}, content_type={audio.content_type}]")
    try:
        audio_bytes = await audio.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read audio stream: {e}",
        )

    res = stt_service.transcribe(
        audio_bytes=audio_bytes,
        mime_type=audio.content_type or "audio/webm",
        language=language,
    )

    return VoiceTranscribeResponse(
        success=True,
        transcript=res.get("transcript", ""),
        language=res.get("language", language),
        confidence=res.get("confidence", 0.95),
    )


@router.post("/synthesize")
async def synthesize_speech(
    req: VoiceSynthesizeRequest,
    _auth: bool = Depends(verify_internal_secret),
):
    """
    Text-to-Speech synthesis returning high-fidelity neural audio for Assamese and English.
    Supports male voice for chatbot text listen and female voice for voice assistant.
    """
    gender = req.gender or "male"
    logger.info(f"Synthesizing speech [lang={req.language}, gender={gender}, length={len(req.text)}]")
    audio_bytes = await tts_service.synthesize_async(
        text=req.text,
        language=req.language or "as",
        gender=gender,
        voice=req.voice,
    )

    if not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Speech synthesis engine temporarily unavailable.",
        )

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "Content-Length": str(len(audio_bytes)),
            "Content-Disposition": "inline; filename=unimitra_voice.mp3",
        },
    )
