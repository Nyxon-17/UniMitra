import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.api.documents import router as documents_router
from app.api.health import router as health_router
from app.api.voice import router as voice_router
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("unimitra.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================")
    logger.info("UniMitra Bilingual AI Service Starting Up...")
    logger.info(f"Target Port: {settings.PORT} | Environment: {settings.ENVIRONMENT}")
    logger.info(f"LLM: {settings.GEMINI_MODEL} | Embeddings: {settings.EMBEDDING_MODEL}")
    logger.info("Connecting to Supabase PostgreSQL & pgvector...")
    logger.info("==================================================")
    yield
    logger.info("UniMitra Bilingual AI Service Shutting Down.")


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Autonomous Bilingual RAG, Assamese NLP, Speech AI, and pgvector engine for UniMitra University Assistant.",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5000",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(voice_router)


@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "health_check": "/health",
        "docs": "/docs",
    }

