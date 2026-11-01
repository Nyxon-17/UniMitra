import json
import logging
from typing import Any, Dict, List, Optional
from app.core.database import execute_mutation, execute_query, get_db_connection

logger = logging.getLogger("unimitra.vector_store")


class VectorStoreService:
    @staticmethod
    def search_similar_chunks(
        query_embedding: List[float],
        university_code: Optional[str] = None,
        category_code: Optional[str] = None,
        match_count: int = 5,
        threshold: float = 0.55,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top matching document chunks from Supabase PostgreSQL using pgvector cosine distance.
        """
        vector_str = "[" + ",".join(f"{x:.6f}" for x in query_embedding) + "]"

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
                return results
        except Exception as e:
            logger.warning(f"RPC match_document_chunks notice: {e}. Executing direct pgvector query.")

        # 2. Fallback direct SQL query
        direct_sql = """
            SELECT id, document_id, chunk_index, page_number, clause_reference, 
                   content, 1 - (embedding <=> %s::vector) AS similarity, metadata
            FROM ai_document_chunks
            WHERE (%s IS NULL OR university_code = %s OR university_code = 'ALL')
              AND (%s IS NULL OR category_code = %s)
            ORDER BY embedding <=> %s::vector ASC
            LIMIT %s;
        """
        try:
            results = execute_query(
                direct_sql,
                (
                    vector_str,
                    university_code,
                    university_code,
                    category_code,
                    category_code,
                    vector_str,
                    match_count,
                ),
            )
            return [r for r in results if float(r.get("similarity", 0)) >= threshold]
        except Exception as err:
            logger.error(f"Vector search query error: {err}")
            return []

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
        """
        if not chunks or not embeddings or len(chunks) != len(embeddings):
            return 0

        conn = None
        inserted_count = 0
        try:
            conn = get_db_connection()
            with conn.cursor() as cur:
                # Remove prior chunks if re-indexing document
                cur.execute(
                    "DELETE FROM ai_document_chunks WHERE document_id = %s;",
                    (document_id,),
                )

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

                for chunk, emb in zip(chunks, embeddings):
                    vector_str = "[" + ",".join(f"{x:.6f}" for x in emb) + "]"
                    meta = {
                        **(doc_metadata or {}),
                        "page": chunk.get("page_number"),
                        "clause": chunk.get("clause_reference"),
                    }

                    cur.execute(
                        insert_sql,
                        (
                            document_id,
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
                    inserted_count += 1

            return inserted_count
        except Exception as e:
            logger.error(f"Error inserting document chunks: {e}")
            return inserted_count
        finally:
            if conn:
                conn.close()


vector_store = VectorStoreService()

