import json
import logging
import uuid
from typing import Any, Dict, List, Optional
from app.core.database import execute_mutation, execute_query, get_db_connection

logger = logging.getLogger("unimitra.vector_store")


def resolve_document_uuid(raw_id: str) -> str:
    """
    Ensures raw_id is a valid UUID string for PostgreSQL UUID columns.
    If a custom identifier (e.g. DOC-ADM-8195) is passed, checks documents table
    or deterministically generates a version 5 UUID from it.
    """
    if not raw_id:
        return str(uuid.uuid4())
    try:
        return str(uuid.UUID(str(raw_id)))
    except (ValueError, AttributeError):
        pass

    try:
        rows = execute_query(
            "SELECT id FROM documents WHERE custom_id = %s LIMIT 1;",
            (str(raw_id),)
        )
        if rows and rows[0].get("id"):
            return str(rows[0]["id"])
    except Exception:
        pass

    return str(uuid.uuid5(uuid.NAMESPACE_DNS, str(raw_id)))


class VectorStoreService:
    @staticmethod
    def search_similar_chunks(
        query_embedding: List[float],
        university_code: Optional[str] = None,
        category_code: Optional[str] = None,
        match_count: int = 10,
        threshold: float = 0.20,
        query_text: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Hybrid Document Retrieval:
        1. Multilingual pgvector dense semantic search with forgiving threshold (0.20)
        2. Full-text keyword/entity search for exact ranks, toppers, numbers, merit lists, and clauses
        3. Deduplication and reciprocal rank fusion to ensure relevant context is never lost.
        """
        vector_str = "[" + ",".join(f"{x:.6f}" for x in query_embedding) + "]"
        vector_results: List[Dict[str, Any]] = []

        # 1. Try match_document_chunks RPC function first
        rpc_sql = """
            SELECT id, document_id, chunk_index, page_number, clause_reference, 
                   content, similarity, metadata
            FROM match_document_chunks(
                %s::vector,
                %s::float,
                %s::int,
                %s::varchar,
                %s::varchar
            );
        """
        try:
            results = execute_query(
                rpc_sql,
                (vector_str, threshold, match_count, university_code, category_code),
            )
            if results:
                vector_results = results
        except Exception as e:
            logger.warning(f"RPC match_document_chunks notice: {e}. Executing direct pgvector query.")

        # 2. Fallback direct SQL query if RPC returned empty or failed
        if not vector_results:
            direct_sql = """
                SELECT c.id, c.document_id, c.chunk_index, c.page_number, c.clause_reference, 
                       c.content, 1 - (c.embedding <=> %s::vector) AS similarity, c.metadata
                FROM ai_document_chunks c
                JOIN documents d ON d.id = c.document_id
                WHERE d.status = 'Indexed'::"DocStatus"
                  AND d.approval_status = 'approved'::"ApprovalStatus"
                  AND d.available_to_chatbot = true
                ORDER BY c.embedding <=> %s::vector ASC
                LIMIT %s;
            """
            try:
                results = execute_query(
                    direct_sql,
                    (
                        vector_str,
                        vector_str,
                        match_count,
                    ),
                )
                min_thresh = min(threshold, 0.20)
                filtered = [r for r in results if float(r.get("similarity", 0)) >= min_thresh]
                vector_results = filtered if filtered else results
            except Exception as err:
                logger.error(f"Vector search query error: {err}")
                vector_results = []

        # 3. Keyword / Hybrid Search for specific entities, ordinals & ranks (e.g., 2nd topper, rank 2, merit)
        keyword_results: List[Dict[str, Any]] = []
        if query_text:
            import re
            raw_tokens = re.findall(r'[a-zA-Z0-9\u0980-\u09FF]+', query_text.lower())
            stop_words = {
                "give", "me", "the", "a", "an", "what", "is", "of", "in", "for", "to",
                "and", "or", "who", "whom", "which", "tell", "show", "can", "you",
                "please", "about", "kowa", "kuwa", "muk", "ki", "kun", "hoi"
            }
            salient_tokens = [t for t in raw_tokens if len(t) >= 2 and t not in stop_words]

            # Ordinal & topper expansions
            expanded_tokens = list(salient_tokens)
            for t in salient_tokens:
                if t in ("2nd", "second", "dui", "দ্বিতীয়"):
                    expanded_tokens.extend(["2nd", "second", "rank 2", "merit", "topper", "2."])
                elif t in ("1st", "first", "first topper", "প্রথম"):
                    expanded_tokens.extend(["1st", "first", "rank 1", "topper", "1."])
                elif t in ("3rd", "third", "তৃতীয়"):
                    expanded_tokens.extend(["3rd", "third", "rank 3", "3."])
                elif t in ("topper", "toppers", "শীৰ্ষ", "মেধা"):
                    expanded_tokens.extend(["topper", "merit", "rank", "marks", "result", "grade", "cgpa", "percentage"])

            # Deduplicate tokens
            unique_tokens = []
            for ut in expanded_tokens:
                if ut not in unique_tokens:
                    unique_tokens.append(ut)

            if unique_tokens:
                like_clauses = []
                params = []
                for tok in unique_tokens[:8]:
                    like_clauses.append("content ILIKE %s")
                    params.append(f"%{tok}%")

                kw_sql = f"""
                    SELECT c.id, c.document_id, c.chunk_index, c.page_number, c.clause_reference,
                           c.content, 0.88 AS similarity, c.metadata
                    FROM ai_document_chunks c
                    JOIN documents d ON d.id = c.document_id
                    WHERE d.status = 'Indexed'::"DocStatus"
                      AND d.approval_status = 'approved'::"ApprovalStatus"
                      AND d.available_to_chatbot = true
                      AND ({' OR '.join(like_clauses)})
                    LIMIT {match_count};
                """
                try:
                    kw_res = execute_query(kw_sql, tuple(params))
                    if kw_res:
                        keyword_results = kw_res
                        logger.info(f"Hybrid keyword search found {len(keyword_results)} matching chunks for tokens: {unique_tokens[:4]}")
                except Exception as kw_err:
                    logger.debug(f"Keyword search notice: {kw_err}")

        # 4. Merge, Deduplicate & Rank Fusion
        chunk_map: Dict[str, Dict[str, Any]] = {}

        # Add vector chunks
        for c in vector_results:
            c_key = f"{c.get('document_id')}_{c.get('chunk_index')}"
            chunk_map[c_key] = dict(c)

        # Merge keyword chunks with boost
        for kc in keyword_results:
            c_key = f"{kc.get('document_id')}_{kc.get('chunk_index')}"
            if c_key in chunk_map:
                # If matched both semantically and via keyword, boost relevance
                chunk_map[c_key]["similarity"] = max(float(chunk_map[c_key].get("similarity", 0)), 0.95)
            else:
                chunk_map[c_key] = dict(kc)

        combined_chunks = list(chunk_map.values())
        combined_chunks.sort(key=lambda x: float(x.get("similarity", 0.0)), reverse=True)

        # Active Document Validation: verify that every chunk strictly belongs to an active, approved document
        if combined_chunks:
            doc_ids_to_check = tuple(set(str(c.get("document_id")) for c in combined_chunks if c.get("document_id")))
            if doc_ids_to_check:
                placeholders = ",".join(["%s"] * len(doc_ids_to_check))
                active_docs = execute_query(
                    f"""SELECT id FROM documents WHERE id IN ({placeholders}) AND status = 'Indexed'::"DocStatus" AND approval_status = 'approved'::"ApprovalStatus" AND available_to_chatbot = true;""",

                    doc_ids_to_check
                )
                valid_doc_ids = set(str(row["id"]) for row in active_docs if row.get("id"))
                combined_chunks = [c for c in combined_chunks if str(c.get("document_id")) in valid_doc_ids]

        return combined_chunks[:match_count]

    @staticmethod
    def insert_document_chunks(
        document_id: str,
        university_code: str,
        category_code: str,
        chunks: List[Dict[str, Any]],
        embeddings: List[List[float]],
        doc_metadata: Optional[Dict[str, Any]] = None,
    ) -> int:
        """
        Batch inserts document chunks with 768-dim embeddings into ai_document_chunks.
        Safely resolves document_id to a valid UUID for PostgreSQL UUID foreign keys.
        """
        if not chunks or not embeddings or len(chunks) != len(embeddings):
            return 0

        doc_uuid = resolve_document_uuid(document_id)
        conn = None
        inserted_count = 0
        try:
            conn = get_db_connection()
            with conn.cursor() as cur:
                # Remove prior chunks if re-indexing or replacing document
                cur.execute("DELETE FROM ai_document_chunks WHERE document_id = %s OR document_id = %s;", (doc_uuid, document_id))
                try:
                    cur.execute("DELETE FROM document_chunks WHERE document_id = %s;", (doc_uuid,))
                except Exception:
                    pass

                insert_sql = """
                    INSERT INTO ai_document_chunks (
                        document_id,
                        university_code,
                        category_code,
                        chunk_index,
                        page_number,
                        clause_reference,
                        content,
                        token_count,
                        embedding,
                        metadata
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s::vector, %s::jsonb);
                """

                insert_doc_chunks_sql = """
                    INSERT INTO document_chunks (
                        id, document_id, chunk_index, page_number, clause_reference,
                        content, token_count, metadata, created_at
                    ) VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s::jsonb, NOW());
                """

                for chunk, emb in zip(chunks, embeddings):
                    vector_str = "[" + ",".join(f"{x:.6f}" for x in emb) + "]"
                    meta = {
                        **(doc_metadata or {}),
                        "custom_id": document_id,
                        "document_id": doc_uuid,
                        "page": chunk.get("page_number"),
                        "clause": chunk.get("clause_reference"),
                    }

                    cur.execute(
                        insert_sql,
                        (
                            doc_uuid,
                            university_code,
                            category_code,
                            chunk.get("chunk_index", 0),
                            chunk.get("page_number"),
                            chunk.get("clause_reference"),
                            chunk.get("content", ""),
                            chunk.get("token_count", 0),
                            vector_str,
                            json.dumps(meta),
                        ),
                    )
                    try:
                        cur.execute(
                            insert_doc_chunks_sql,
                            (
                                doc_uuid,
                                chunk.get("chunk_index", 0),
                                chunk.get("page_number"),
                                chunk.get("clause_reference"),
                                chunk.get("content", ""),
                                chunk.get("token_count", 0),
                                json.dumps(meta),
                            )
                        )
                    except Exception:
                        pass
                    inserted_count += 1

            return inserted_count
        except Exception as e:
            logger.error(f"Error inserting document chunks: {e}")
            return inserted_count
        finally:
            if conn:
                conn.close()


    @staticmethod
    def delete_document(document_id: str) -> bool:
        """
        Permanently deletes all vectors, chunks, processing jobs, and document records
        associated with a given document identifier (UUID or customId).
        """
        if not document_id:
            return False
        doc_uuid = resolve_document_uuid(document_id)
        try:
            execute_mutation(
                "DELETE FROM ai_document_chunks WHERE document_id = %s OR document_id = %s;",
                (doc_uuid, document_id)
            )
            execute_mutation(
                "DELETE FROM document_processing_jobs WHERE document_id = %s OR document_id = %s;",
                (doc_uuid, document_id)
            )
            execute_mutation(
                "DELETE FROM document_chunks WHERE document_id = %s;",
                (doc_uuid,)
            )
            execute_mutation(
                "DELETE FROM documents WHERE id = %s OR custom_id = %s;",
                (doc_uuid, document_id)
            )
            logger.info(f"Successfully purged vector data and database records for document: {document_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting document {document_id} from vector store: {e}")
            return False


vector_store = VectorStoreService()
