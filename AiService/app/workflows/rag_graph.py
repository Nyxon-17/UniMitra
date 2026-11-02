import logging
from typing import Any, Dict
from app.services.embedding_service import embedding_service, normalize_assamese_unicode
from app.services.gemini_service import gemini_service, detect_language_mode
from app.services.vector_store import vector_store
from app.workflows.states import RagGraphState

logger = logging.getLogger("unimitra.rag_graph")


class RagWorkflow:
    @staticmethod
    def run(
        query: str,
        language: str = "en",
        university_code: str = None,
        category_code: str = None,
        conversation_history: list = None,
    ) -> Dict[str, Any]:
        """
        Executes the LangGraph RAG pipeline:
        Validate -> Detect Language -> Embed Query -> pgvector Search -> Relevance Check -> Gemini Grounded Generation.
        """
        from app.services.assamese_understanding import assamese_understanding

        # Node 1: Validate & Normalize with Assamese Input Understanding Layer
        understanding = assamese_understanding.interpret_query(query, language)
        clean_text = normalize_assamese_unicode(understanding.normalized_query)

        # Node 2: Detect Language Mode (Strict Language Matching: as_script | as_roman | en)
        detected_lang = understanding.language_mode

        # Node 3: Embed Query (Multilingual E5 Base with 'query: ' prefix)
        search_text = clean_text
        if understanding.is_romanized and understanding.search_keywords:
            search_text = f"{clean_text} {' '.join(understanding.search_keywords)}"
        query_vector = embedding_service.embed_query(search_text)

        # Node 4: pgvector Semantic Retrieval
        retrieved_chunks = vector_store.search_similar_chunks(
            query_embedding=query_vector,
            university_code=university_code,
            category_code=category_code,
            match_count=5,
            threshold=0.55,
        )

        logger.info(f"Retrieved {len(retrieved_chunks)} statutory chunks for query.")

        # Node 5 & 6: Grounded Generation with Gemini 1.5
        result = gemini_service.generate_grounded_answer(
            query=clean_text,
            retrieved_chunks=retrieved_chunks,
            target_language=detected_lang,
            conversation_history=conversation_history or [],
        )

        return result


rag_workflow = RagWorkflow()

