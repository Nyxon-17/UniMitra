import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    # Service Information
    APP_NAME: str = "UniMitra Bilingual AI Service"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Security
    AI_SERVICE_SECRET: str = "unimitra_internal_ai_secret_2026"

    # Supabase & PostgreSQL
    DATABASE_URL: str = ""
    DIRECT_URL: str = ""
    SUPABASE_URL: str = "https://kbrhnwyxyiiifmwpfnfm.supabase.co"
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Generative AI & Embeddings
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-flash-lite-latest"
    EMBEDDING_MODEL: str = "intfloat/multilingual-e5-base"
    EMBEDDING_DIM: int = 768

    # Bakbak Assamese Voice TTS API Key (Litwiz Labs / Raya Voice AI)
    BAKBAK_API_KEY: str = "eX2lWnCNyy6JtU6KgUhBC4rpE6o8Bluw"
    BAKBAK_BASE_URL: str = "https://hub.getraya.app/v1"
    BAKBAK_VOICE_ID: str = "d4e5f6a7-b8c9-4a01-d345-e6f7a8b9c012"
    BAKBAK_MODEL: str = "standard"
    BAKBAK_SPEED: float = 1.0
    BAKBAK_TIMEOUT: float = 30.0

    # Sarvam AI Saaras V4 Speech-to-Text API Key
    SARVAM_API_KEY: str = ""
    SARVAM_BASE_URL: str = "https://api.sarvam.ai"
    SARVAM_STT_MODEL: str = "saaras:v4"

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
