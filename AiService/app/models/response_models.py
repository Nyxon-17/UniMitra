from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CitationItem(BaseModel):
    document_id: Optional[str] = None
    document_title: Optional[str] = None
    page_number: Optional[int] = None
    clause_reference: Optional[str] = None
    similarity_score: Optional[float] = None
    snippet: Optional[str] = None


class QueryResponse(BaseModel):
    success: bool = True
    answer: str
    source: str = "University Statutory Repository"
    page: Optional[Any] = "Verified Regulation"
    confidence: str = "99.0% Grounded Match"
    domain: str = "Academic Regulations"
    language: str = "en"
    is_unverified: bool = False
    citations: List[CitationItem] = Field(default_factory=list)


class DocumentIngestResponse(BaseModel):
    success: bool = True
    document_id: str
    pages_extracted: int
    chunks_created: int
    ocr_applied: bool = False
    vector_dimension: int = 768
    status: str = "Indexed"
    processing_stage: str = "Vector Indexed (100%)"
    duration_seconds: float = 0.0
    text_content: Optional[str] = None
    chunks: Optional[List[Dict[str, Any]]] = None


class VoiceTranscribeResponse(BaseModel):
    success: bool = True
    transcript: str
    language: str
    confidence: float = 0.95
    provider: Optional[str] = "sarvam_saaras_v4"
    mode: Optional[str] = "codemix"
    request_id: Optional[str] = None
    error: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "UniMitra Bilingual AI Service"
    version: str = "1.0.0"
    environment: str = "development"
    models: Dict[str, Any]
    database: str = "connected"

