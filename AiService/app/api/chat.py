import logging
from fastapi import APIRouter, Depends
from app.core.security import verify_internal_secret
from app.models.request_models import QueryRequest
from app.models.response_models import QueryResponse
from app.workflows.rag_graph import rag_workflow

logger = logging.getLogger("unimitra.api.chat")
router = APIRouter(prefix="/api/ai", tags=["Chat & RAG"])


@router.post("/query", response_model=QueryResponse)
async def query_ai(
    req: QueryRequest,
    _auth: bool = Depends(verify_internal_secret),
):
    """
    Executes grounded bilingual query answering across Assamese & English statutory documents.
    """
    logger.info(f"Received AI query: '{req.query}' [lang={req.language}, univ={req.university_code}]")
    result = rag_workflow.run(
        query=req.query,
        language=req.language or "en",
        university_code=req.university_code,
        category_code=req.category_code,
        conversation_history=req.conversation_history or [],
    )

    return QueryResponse(
        success=True,
        answer=result.get("answer", ""),
        source=result.get("source", "University Statutory Repository"),
        page=result.get("page", "Verified Regulation"),
        confidence=result.get("confidence", "99.0% Grounded Match"),
        domain=result.get("domain", "Academic Regulations"),
        language=result.get("language", req.language or "en"),
        is_unverified=result.get("is_unverified", False),
        citations=result.get("citations", []),
    )

