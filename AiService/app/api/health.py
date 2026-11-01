from fastapi import APIRouter
from app.config import settings
from app.core.database import execute_query
from app.models.response_models import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Public health probe returning service and model operational status.
    """
    # Check database reachability
    db_status = "connected"
    try:
        res = execute_query("SELECT 1 AS ok;")
        if not res or res[0].get("ok") != 1:
            db_status = "degraded"
    except Exception:
        db_status = "unreachable"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        service="UniMitra Bilingual AI Service",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        models={
            "llm": settings.GEMINI_MODEL,
            "embeddings": settings.EMBEDDING_MODEL,
            "vector_dimension": settings.EMBEDDING_DIM,
            "stt": "Google Gemini Multi-modal Audio (Assamese & English)",
            "tts": "Edge-TTS Neural & gTTS (Assamese & English)",
        },
        database=f"{db_status} (pgvector 0.8.2)",
    )

