import hashlib
import json
import logging
import time
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from app.core.database import execute_mutation, execute_query
from app.core.security import verify_internal_secret
from app.models.response_models import DocumentIngestResponse
from app.services.document_parser import document_parser
from app.services.embedding_service import embedding_service
from app.services.gemini_service import gemini_service
from app.services.vector_store import resolve_document_uuid, vector_store

logger = logging.getLogger("unimitra.api.documents")
router = APIRouter(prefix="/api/ai/documents", tags=["Documents Ingestion"])


def ensure_document_record(
    doc_uuid: str,
    custom_id: str,
    filename: str,
    file_bytes: bytes,
    pages_count: int,
    ocr_needed: bool,
    meta_dict: dict,
) -> str:
    """
    Guarantees that a parent record exists in the documents table before
    foreign key operations in ai_document_chunks and document_processing_jobs.
    """
    try:
        existing = execute_query(
            "SELECT id FROM documents WHERE id = %s OR custom_id = %s LIMIT 1;",
            (doc_uuid, custom_id),
        )
        if existing and existing[0].get("id"):
            return str(existing[0]["id"])
    except Exception as e:
        logger.warning(f"Error checking existing document: {e}")

    title = meta_dict.get("title") or filename or "University Document"
    as_title = meta_dict.get("asTitle") or meta_dict.get("title") or title
    univ_name = meta_dict.get("university") or meta_dict.get("universityName") or "Nivoraya University"
    cat_name = meta_dict.get("category") or meta_dict.get("categoryName") or "General Taxonomy"
    dept = meta_dict.get("department") or "Academic Department"
    acad_year = meta_dict.get("academicYear") or "2024-2025"
    summary = meta_dict.get("summary") or "Official university academic document."
    citation = meta_dict.get("citation") or f"{title}, {univ_name}"
    sha256 = hashlib.sha256(file_bytes).hexdigest()

    insert_sql = """
        INSERT INTO documents (
            id, custom_id, title, as_title, university_name, category_name,
            department, academic_year, pages, file_name, storage_path, sha256, chunks_count,
            uploader_role, uploader_name, uploader_email, status, approval_status,
            available_to_chatbot, processing_stage, ocr_applied, summary, citation, created_at, updated_at
        ) VALUES (
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s, %s,
            %s, %s, %s, 'Indexed'::"DocStatus", 'approved'::"ApprovalStatus",
            true, 'Vector Ingesting', %s, %s, %s, NOW(), NOW()
        ) ON CONFLICT (id) DO NOTHING RETURNING id;
    """
    try:
        res = execute_query(
            insert_sql,
            (
                doc_uuid,
                custom_id,
                title,
                as_title,
                univ_name,
                cat_name,
                dept,
                acad_year,
                pages_count,
                filename,
                f"docs/{doc_uuid}_{filename}",
                sha256,
                0,
                meta_dict.get("uploaderRole") or "admin",
                meta_dict.get("uploaderName") or "Administrator",
                meta_dict.get("uploaderEmail") or "admin@nivoraya.ac.in",
                ocr_needed,
                summary,
                citation,
            ),
        )
        if res and res[0].get("id"):
            return str(res[0]["id"])
    except Exception as err:
        logger.warning(f"Notice during ensure_document_record insert: {err}")
    return doc_uuid


@router.post("/ingest", response_model=DocumentIngestResponse)
async def ingest_document(
    document_id: str = Form(...),
    metadata: str = Form("{}"),
    file: UploadFile = File(...),
    _auth: Optional[bool] = None,
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

    # Resolve doc_uuid and ensure parent document row exists in PostgreSQL
    doc_uuid = resolve_document_uuid(document_id)

    # 3. Bilingual Language Identification & Assamese Translation
    sample_text = " ".join(c.get("content", "") for c in chunks[:3])
    is_assamese_doc = gemini_service.is_assamese(sample_text)
    orig_lang = "as" if is_assamese_doc else "en"

    doc_title = meta_dict.get("title") or file.filename or "University Document"
    as_title = meta_dict.get("asTitle") or meta_dict.get("as_title")

    for idx, c in enumerate(chunks):
        c["chunk_index"] = idx
        c["language"] = orig_lang
        c["cleaned_content"] = c.get("content", "")
        meta = c.get("metadata") or {}
        meta["language"] = orig_lang
        meta["page"] = c.get("page_number", 1)
        meta["clause"] = c.get("clause_reference")
        meta["title"] = doc_title
        if as_title:
            meta["as_title"] = as_title
        c["metadata"] = meta

    as_chunks = []
    if orig_lang == "en":
        try:
            logger.info(f"Translating {len(chunks)} English chunks into Assamese using Gemini API...")
            as_chunks, gen_as_title = gemini_service.translate_chunks_to_assamese(
                chunks=chunks,
                title=doc_title,
            )
            if gen_as_title and not as_title:
                as_title = gen_as_title
                meta_dict["asTitle"] = gen_as_title
                meta_dict["as_title"] = gen_as_title
                for c in chunks:
                    c["metadata"]["as_title"] = as_title
        except Exception as trans_err:
            logger.warning(f"Bilingual translation notice: {trans_err}")

    # Combine original chunks and translated Assamese chunks
    all_chunks = list(chunks) + list(as_chunks)
    logger.info(f"Total indexing payload: {len(all_chunks)} chunks ({len(chunks)} original {orig_lang}, {len(as_chunks)} translated Assamese)")

    doc_uuid = ensure_document_record(
        doc_uuid=doc_uuid,
        custom_id=document_id,
        filename=file.filename or "academic_document.pdf",
        file_bytes=file_bytes,
        pages_count=len(pages),
        ocr_needed=ocr_needed,
        meta_dict=meta_dict,
    )

    # 4. Generate Multilingual E5 Embeddings ('passage: ' prefix)
    passages = [c["content"] for c in all_chunks]
    embeddings = embedding_service.embed_passages(passages)

    # 5. Store Chunks & Vectors in Supabase PostgreSQL
    inserted_count = vector_store.insert_document_chunks(
        document_id=doc_uuid,
        university_code=univ_code,
        category_code=cat_code,
        chunks=all_chunks,
        embeddings=embeddings,
        doc_metadata=meta_dict,
    )

    # 6. Record Job in document_processing_jobs
    job_sql = """
        INSERT INTO document_processing_jobs (
            document_id, stage, progress_percentage, pages_total, 
            chunks_indexed, ocr_applied, completed_at
        ) VALUES (%s, %s, %s, %s, %s, %s, NOW());
    """
    execute_mutation(job_sql, (doc_uuid, "COMPLETED", 100, len(pages), inserted_count, ocr_needed))

    # 7. Update document status in documents table
    update_doc_sql = """
        UPDATE documents 
        SET chunks_count = %s, pages = %s, processing_stage = 'Vector Indexed (100%%)', 
            status = 'Indexed'::"DocStatus", approval_status = 'approved'::"ApprovalStatus",
            available_to_chatbot = true, as_title = COALESCE(%s, as_title), updated_at = NOW()
        WHERE id = %s OR custom_id = %s;
    """
    execute_mutation(update_doc_sql, (inserted_count, len(pages), as_title, doc_uuid, document_id))

    duration = round(time.time() - start_time, 2)
    logger.info(f"Ingestion complete: {inserted_count} chunks indexed in {duration}s.")

    full_extracted_text = "\n\n".join(p.get("text", "") for p in pages if p.get("text"))
    return DocumentIngestResponse(
        success=True,
        document_id=doc_uuid,
        pages_extracted=len(pages),
        chunks_created=inserted_count,
        ocr_applied=ocr_needed,
        vector_dimension=768,
        status="Indexed",
        processing_stage="Vector Indexed (100%)",
        duration_seconds=duration,
        text_content=full_extracted_text,
        chunks=chunks,
    )


@router.delete("/{document_id}")
async def delete_document_endpoint(
    document_id: str,
    _: bool = Depends(verify_internal_secret),
):
    """
    Deletes document chunks, embeddings, processing jobs, and parent records from the database.
    """
    logger.info(f"Received request to delete document: {document_id}")
    success = vector_store.delete_document(document_id)
    return {
        "success": success,
        "deleted_document_id": document_id,
        "message": f"Document {document_id} and associated vector embeddings purged from database."
    }
