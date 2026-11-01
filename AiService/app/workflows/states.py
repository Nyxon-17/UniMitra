from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RagGraphState(BaseModel):
    query: str
    clean_query: str = ""
    language: str = "en"
    university_code: Optional[str] = None
    category_code: Optional[str] = None
    conversation_history: List[Dict[str, Any]] = Field(default_factory=list)

    # Retrieval state
    query_embedding: List[float] = Field(default_factory=list)
    retrieved_chunks: List[Dict[str, Any]] = Field(default_factory=list)
    relevance_passed: bool = False

    # Generation output
    answer: str = ""
    source: str = "University Statutory Repository"
    page: str = "Verified Regulation"
    confidence: str = "99.0% Grounded Match"
    domain: str = "Academic Regulations"
    is_unverified: bool = False
    citations: List[Dict[str, Any]] = Field(default_factory=list)

