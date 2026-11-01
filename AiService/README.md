# UniMitra — Bilingual AI Service (Python FastAPI & pgvector)

The UniMitra AI Service provides bilingual Retrieval-Augmented Generation (RAG), Assamese and English Natural Language Processing, Speech AI (STT/TTS), and vector search powered by **Google Gemini**, **Multilingual E5 embeddings**, and **Supabase PostgreSQL pgvector**.

---

## Architecture & Core Capabilities

1. **Bilingual RAG Engine**:
   - Assamese script (`\u0980-\u09FF`) Unicode normalization (NFC) preserving complex conjuncts (যুক্তাক্ষৰ) and vowels.
   - Dual-language query embedding using `intfloat/multilingual-e5-base` with asymmetric `query: ` and `passage: ` prefixes.
   - Supabase PostgreSQL `pgvector` with HNSW cosine distance indexing (`vector_cosine_ops`) and `match_document_chunks` RPC.
   - Grounded answer generation via Google Gemini (`gemini-3.8-flash`) with strict statutory source citations.
   - Out-of-scope detection returning official unverified notices without hallucinations.
   - Resilient statutory benchmark fallback ensuring sub-second response times even during upstream LLM delays.

2. **Speech AI (Voice Assistant)**:
   - **Speech-to-Text (STT)**: Multi-modal audio transcription natively supporting Assamese and English.
   - **Text-to-Speech (TTS)**: High-fidelity natural neural speech synthesis with Edge-TTS (`bn-IN-TanishaaNeural`, `en-IN-NeerjaNeural`) and gTTS fallback.

3. **Statutory Document Ingestion**:
   - PyMuPDF (`fitz`) page-by-page extraction preserving Assamese Unicode and section boundaries.
   - Scanned PDF detection.
   - Statutory clause and section boundary preservation.
   - Batch 768-dimensional vector indexing into `ai_document_chunks` with metadata and page links.

---

## Directory Structure

```
AiService/
├── app/
│   ├── api/
│   │   ├── chat.py           # POST /api/ai/query
│   │   ├── documents.py      # POST /api/ai/documents/ingest
│   │   ├── health.py         # GET /health
│   │   └── voice.py          # POST /api/ai/voice/transcribe & /synthesize
│   ├── core/
│   │   ├── database.py       # Supabase PostgreSQL psycopg2 connection pooler
│   │   └── security.py       # X-Internal-Secret authentication guard
│   ├── models/
│   │   ├── request_models.py # Pydantic input schemas
│   │   └── response_models.py# Pydantic response schemas
│   ├── services/
│   │   ├── document_parser.py# PyMuPDF parser & statutory chunker
│   │   ├── embedding_service.py # Multilingual E5 normalization & dense vectors
│   │   ├── gemini_service.py # Google GenAI SDK & statutory grounding
│   │   ├── stt_service.py    # Speech-to-text audio transcription
│   │   ├── tts_service.py    # Edge-TTS & gTTS speech synthesis
│   │   └── vector_store.py   # pgvector insertion & RPC similarity retrieval
│   ├── workflows/
│   │   ├── rag_graph.py      # LangGraph stateful RAG pipeline
│   │   └── states.py         # TypedDict graph states
│   ├── config.py             # Pydantic settings & environment loader
│   └── main.py               # FastAPI application entrypoint
├── tests/
│   ├── test_live_ai_service.py # Integration test suite
│   ├── test_similarity_score.py# pgvector similarity test
│   └── test_tts_speed.py     # TTS voice test
├── requirements.txt          # Python dependencies
└── README.md
```

---

## Environment Variables (`AiService/.env`)

```ini
DATABASE_URL="postgresql://postgres.your_project_ref:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@db.your_project_ref.supabase.co:5432/postgres"
SUPABASE_URL="https://your_project_ref.supabase.co"
SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
AI_SERVICE_SECRET="unimitra_internal_ai_secret_2026"
GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-3.8-flash"
EMBEDDING_MODEL="intfloat/multilingual-e5-base"
PORT=8000
ENVIRONMENT=development
```

---

## Running the Service

```bash
cd AiService
.\.venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000
```

---

## API Endpoints

- `GET /health`: Health probe & model status.
- `POST /api/ai/query`: Grounded bilingual RAG query answering (`X-Internal-Secret` required).
- `POST /api/ai/documents/ingest`: PDF multipart upload for chunking & pgvector indexing (`X-Internal-Secret` required).
- `POST /api/ai/voice/transcribe`: Multi-modal audio transcription (STT).
- `POST /api/ai/voice/synthesize`: Text-to-Speech audio streaming (TTS) returning `audio/mpeg`.
