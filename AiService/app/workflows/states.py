from typing import Any, Dict, List, Optional, TypedDict
from pydantic import BaseModel, Field


class RagGraphState(TypedDict):
    """
    Typed state representation for LangGraph cognitive agent workflow.
    """
    # User Input
    query: str
    language: str
    university_code: Optional[str]
    category_code: Optional[str]
    conversation_history: List[Dict[str, Any]]

    # Linguistic Interpretation & Intent
    clean_query: str
    detected_language: str
    is_romanized: bool
    is_external_univ: bool
    context_hint: str
    search_keywords: List[str]

    # Semantic Retrieval State
    query_vector: List[float]
    retrieved_chunks: List[Dict[str, Any]]

    # Grounded Synthesis Output
    answer: str
    source: str
    page: str
    confidence: str
    domain: str
    is_unverified: bool
    citations: List[Dict[str, Any]]
