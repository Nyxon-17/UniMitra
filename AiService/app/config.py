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
    GEMINI_MODEL: str = "gemini-3.8-flash"
    EMBEDDING_MODEL: str = "intfloat/multilingual-e5-base"
    EMBEDDING_DIM: int = 768

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

