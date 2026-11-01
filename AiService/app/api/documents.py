import json
import logging
import time
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from app.core.database import execute_mutation
from app.core.security import verify_internal_secret
from app.models.response_models import DocumentIngestResponse
from app.services.document_parser import document_parser
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store

logger = logging.getLogger("unimitra.api.documents")
router = APIRouter(prefix="/api/ai/documents", tags=["Documents Ingestion"])


@router.post("/ingest", response_model=DocumentIngestResponse)
async def ingest_document(
    document_id: str = Form(...),
    metadata: str = Form("{}"),
    file: UploadFile = File(...),
    _auth: bool = Depends(verify_internal_secret),
):
    """
    Parses PDF/DOCX, performs statutory chunking, computes multilingual E5 embeddings,
    and indexes vectors into Supabase PostgreSQL pgvector.
    """
    start_time = time.time()
    logger.info(f"Ingesting document ID: {document_id}, filename: {file.filename}")

    # Parse metadata JSON
    meta_dict = {}
    try:
        if metadata:
            meta_dict = json.loads(metadata)
    except Exception:
        meta_dict = {}

    univ_code = meta_dict.get("university") or meta_dict.get("universityCode") or "UNIVERSAL"
    cat_code = meta_dict.get("category") or meta_dict.get("categoryCode") or "GENERAL"

    # Read binary bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file buffer: {e}",
        )

    # 1. Parse PDF with PyMuPDF
    pages, ocr_needed = document_parser.parse_pdf(file_bytes)
    if not pages:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unable to extract text layers from document.",
        )

    # 2. Chunk statutory document
    chunks = document_parser.chunk_document(pages)
    if not chunks:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Document contained no extractable textual content.",
        )

    # 3. Generate Multilingual E5 Embeddings ('passage: ' prefix)
    passages = [c["content"] for c in chunks]
    embeddings = embedding_service.embed_passages(passages)

    # 4. Store Chunks & Vectors in Supabase PostgreSQL
    inserted_count = vector_store.insert_document_chunks(
        document_id=document_id,
        university_code=univ_code,
        category_code=cat_code,
        chunks=chunks,
        embeddings=embeddings,
        doc_metadata=meta_dict,
    )

    # 5. Record Job in document_processing_jobs
    job_sql = """
        INSERT INTO document_processing_jobs (
            document_id, stage, progress_percentage, pages_total, 
            chunks_indexed, ocr_applied, completed_at
        ) VALUES (%s, %s, %s, %s, %s, %s, NOW());
    """
    execute_mutation(job_sql, (document_id, "COMPLETED", 100, len(pages), inserted_count, ocr_needed))

    # 6. Update document status in documents table
    update_doc_sql = """
        UPDATE documents 
        SET chunks_count = %s, pages = %s, processing_stage = 'Vector Indexed (100%%)', 
            status = 'Indexed', available_to_chatbot = true, updated_at = NOW()
        WHERE id = %s;
    """
    execute_mutation(update_doc_sql, (inserted_count, len(pages), document_id))

    duration = round(time.time() - start_time, 2)
    logger.info(f"Ingestion complete: {inserted_count} chunks indexed in {duration}s.")

    return DocumentIngestResponse(
        success=True,
        document_id=document_id,
        pages_extracted=len(pages),
        chunks_created=inserted_count,
        ocr_applied=ocr_needed,
        vector_dimension=768,
        status="Indexed",
        processing_stage="Vector Indexed (100%)",
        duration_seconds=duration,
    )

