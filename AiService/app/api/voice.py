import logging
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile, status
from app.core.security import verify_internal_secret
from app.models.request_models import VoiceSynthesizeRequest
from app.models.response_models import VoiceTranscribeResponse
from app.services.sarvam_stt import MAX_AUDIO_SIZE_BYTES
from app.services.stt_service import stt_service
from app.services.tts.tts_manager import tts_manager

logger = logging.getLogger("unimitra.api.voice")
router = APIRouter(tags=["Voice AI"])

ALLOWED_AUDIO_EXTENSIONS = {".webm", ".wav", ".mp3", ".ogg", ".opus", ".m4a", ".mp4", ".aac", ".flac"}


@router.post("/api/voice/transcribe", response_model=VoiceTranscribeResponse)
@router.post("/api/ai/voice/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_voice(
    audio: UploadFile = File(...),
    language: str = Form("as-IN"),
    mode: str = Form("codemix"),
    _auth: bool = Depends(verify_internal_secret),
):
    """
    Speech-to-Text transcription powered by Sarvam AI Saaras V4.
    Supports Assamese (অসমীয়া), Romanized Assamese (Assinglish), and Indian English.
    Modes:
      - 'transcribe': Native-script transcription
      - 'translit': Romanized Latin transcription (e.g. 'mur hostel r bikhoye kowa')
      - 'codemix': Assamese-English mixed transcription
    """
    logger.info(
        f"Transcribe request received [filename={audio.filename}, content_type={audio.content_type}, "
        f"lang={language}, mode={mode}]"
    )

    # 1. Validate File Presence and MIME / Extension
    filename = (audio.filename or "voice_input.webm").lower()
    content_type = (audio.content_type or "audio/webm").lower()

    has_audio_ext = any(filename.endswith(ext) for ext in ALLOWED_AUDIO_EXTENSIONS)
    is_audio_mime = "audio" in content_type or "webm" in content_type or "octet-stream" in content_type

    if not (has_audio_ext or is_audio_mime):
        logger.warning(f"Unsupported audio format: filename={filename}, content_type={content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported audio format. Supported formats include WebM, WAV, MP3, OGG, M4A, FLAC.",
        )

    # 2. Read and Validate Audio File Size
    try:
        audio_bytes = await audio.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read uploaded audio: {e}",
        )

    if not audio_bytes or len(audio_bytes) < 100:
        logger.warning("Empty or truncated audio recording received.")
        return VoiceTranscribeResponse(
            success=False,
            transcript="",
            language=language,
            confidence=0.0,
            provider="sarvam_saaras_v4",
            mode=mode,
            error="Audio recording is empty or too short. Please speak into the microphone.",
        )

    if len(audio_bytes) > MAX_AUDIO_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Audio file exceeds the maximum allowed size of 25 MB.",
        )

    # 3. Transcribe via Sarvam AI Saaras V4 (with Gemini fallback)
    res = await stt_service.transcribe_async(
        audio_bytes=audio_bytes,
        mime_type=content_type,
        language=language,
        mode=mode,
        filename=audio.filename or "voice_input.webm",
    )

    return VoiceTranscribeResponse(
        success=res.get("success", True),
        transcript=res.get("transcript", ""),
        language=res.get("language", language),
        confidence=res.get("confidence", 0.99),
        provider=res.get("provider", "sarvam_saaras_v4"),
        mode=res.get("mode", mode),
        request_id=res.get("request_id"),
        error=res.get("error"),
    )


@router.post("/api/voice/synthesize")
@router.post("/api/ai/voice/synthesize")
@router.post("/api/ai/voice/speech")
async def synthesize_speech(
    req: VoiceSynthesizeRequest,
    _auth: bool = Depends(verify_internal_secret),
):
    """
    Text-to-Speech synthesis returning high-fidelity neural audio for Assamese and English.
    Supports male voice for chatbot text listen and female voice for voice assistant.
    """
    gender = req.gender or "female"
    logger.info(f"Synthesizing speech via Dual-Engine TTS [lang={req.language}, gender={gender}, length={len(req.text)}]")
    try:
        audio_bytes, media_type, provider, resolved_lang = await tts_manager.generate_speech(
            text=req.text,
            language=req.language,
            gender=gender,
            voice=req.voice,
        )
    except Exception as e:
        logger.error(f"TTS synthesis failure: {e}")
        audio_bytes = None

    if not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Speech synthesis engine temporarily unavailable.",
        )

    return Response(
        content=audio_bytes,
        media_type=media_type,
        headers={
            "Content-Length": str(len(audio_bytes)),
            "Content-Disposition": f"inline; filename=unimitra_voice.{'wav' if 'wav' in media_type else 'mp3'}",
            "X-TTS-Provider": provider,
            "X-TTS-Language": resolved_lang,
        },
    )
