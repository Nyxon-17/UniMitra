# UniMitra – Bilingual AI-Powered Smart University Assistant (CampusIQ)

UniMitra is an institutional AI assistant designed for universities across Assam and the North-East region. Built for the PS-01 CampusIQ hackathon challenge, UniMitra provides grounded, bilingual question answering across university regulations, syllabus frameworks, hostel rules, exam notifications, and admissions using retrieval-augmented generation (RAG).

The system seamlessly understands English, Standard Assamese script (অসমীয়া), and Romanized Assamese (Assamese written using the English alphabet).

---

## Key Features

1. **Bilingual RAG Pipeline**
   - Automatically parses multi-page university PDFs (PyMuPDF).
   - Translates English document chunks into Standard Assamese via Google Gemini.
   - Indexes both original English chunks and translated Assamese chunks using 768-dimensional Multilingual E5 embeddings (`intfloat/multilingual-e5-base`).
   - Stores dense vectors in Supabase PostgreSQL with `pgvector`.

2. **Cross-Lingual Search & Retrieval**
   - Ask questions in Assamese script and receive grounded answers from English PDFs.
   - Ask in Romanized Assamese (e.g. `Mur hostel admission r babe ki lagibo?`) and receive natural Romanized answers.
   - Ask in English and receive authoritative answers citing specific document clauses and page numbers.

3. **Active Document Validation & Synchronized Deletion**
   - When an administrator deletes a document, all original text chunks, Assamese translations, and vector embeddings are permanently purged from Supabase.
   - The vector search engine filters against active, approved documents so deleted documents can never leak into chatbot responses.
   - If an answer is not in the uploaded documents, the AI clearly discloses that no information is available rather than hallucinating.

4. **Role-Based Portals**
   - **Student Portal**: Interactive chat interface, voice synthesis (Dipannita Assamese female voice), session history, and PDF viewer.
   - **Faculty Portal**: Upload syllabus, examination notices, and departmental documents with approval workflows.
   - **Administrator Console**: Full control to approve, verify, re-index, or delete institutional documents, inspect chunks, and monitor indexing jobs.

---

## System Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide icons, Web Speech API. Runs on `http://localhost:5173`.
- **Backend Gateway**: Node.js, Express, Prisma ORM, Supabase Storage and Authentication. Runs on `http://localhost:5000`.
- **AI Service**: Python FastAPI, LangGraph, LangChain, PyMuPDF, Sentence-Transformers (Multilingual E5), Google Gemini Flash Cascade. Runs on `http://localhost:8000`.
- **Database**: Remote Supabase PostgreSQL with `pgvector` and HNSW vector index.

---

## Getting Started & Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher) with pip and virtual environment
- Git

### 1. AI Service Setup (Python FastAPI)
Open a terminal in the project root:
```bash
cd AiService
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
```
Verify the `.env` file inside `AiService/.env` has the necessary keys (`GEMINI_API_KEY`, `DATABASE_URL`, `AI_SERVICE_SECRET`).

Start the AI Service:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The AI Service will be live at `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### 2. Backend Gateway Setup (Node.js)
Open a second terminal in the project root:
```bash
cd Backend
npm install
```
Ensure `Backend/.env` contains your database connection string and configuration.

Start the Backend Gateway:
```bash
npm run dev
# or: node src/server.js
```
The Backend will be live at `http://localhost:5000`.

### 3. Frontend Setup (React + Vite)
Open a third terminal in the project root:
```bash
cd Frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## How to Use the Site

### 1. Student Portal (Chatbot & Information Discovery)
1. Navigate to `http://localhost:5173` and click on **Student Dashboard** or **AI Assistant**.
2. **Select Language**: You can query in any of the three formats:
   - **English**: `What is the minimum attendance required to sit for semester examinations?`
   - **Assamese Script**: `পৰীক্ষাৰ মাচুল কিমান আৰু পলম মাচুল কিমান?`
   - **Romanized Assamese**: `Mur exam r late fine kiman lagibo?`
3. **Inspect Citations**: Every response displays the document title, clause reference, page number, and confidence score. Click **View PDF** to open the source document.
4. **Voice Interaction**: Click the microphone icon to speak, or click **Listen** on any AI message to hear the response read aloud with the Dipannita Assamese female voice.
5. **Session Management**: Start a new chat, switch between previous sessions, or delete history from the sidebar.

### 2. Faculty Portal (Document Contribution)
1. Log in or switch to the **Faculty Workspace**.
2. Go to **Upload Documents**.
3. Choose a PDF file (e.g. syllabus revision, exam routine, departmental guidelines).
4. Enter the title, academic year, category, and department.
5. Submit the upload. The document enters the **Pending Admin Approval** queue. Once approved by an administrator, it is automatically vectorized and made available to the chatbot.

### 3. Administrator Console (Governance & Vector Control)
1. Log in to the **Admin Console** (default demo email: `admin@unimitra.edu.in`).
2. Go to **Document Management**:
   - **Upload**: Upload statutory university notifications and acts directly. The AI Service immediately extracts text, generates Assamese translations, computes Multilingual E5 embeddings, and stores them in `pgvector`.
   - **Verify & Approve**: Review pending documents uploaded by faculty members and grant approval.
   - **Synchronized Deletion**: Click **Delete** on any document. The system will atomically delete the file from storage, remove all chunks and vectors from Supabase, and purge the retrieval cache.
3. Verify that deleted documents immediately cease to appear in student query responses.

---

## Example Queries to Test

| Language Mode | Example Query | Expected Behavior |
|---|---|---|
| Assamese Script | পৰীক্ষাৰ মাচুল কিমান আৰু পলম মাচুল কিমান? | Responds in pure Assamese script citing exact fee numbers from the uploaded regulation. |
| Romanized Assamese | Hostel seat paboloi durutto kiman lagibo? | Responds in natural Romanized Assamese citing hostel allotment distance bylaws. |
| English | What is the minimum attendance requirement? | Responds in English with exact percentages and clause references. |
| Missing / Deleted Info | What is the syllabus for Marine Engineering? | Responds with an explicit grounding notice that no information was found in uploaded documents. |

---

## License & Hackathon Notice

Developed for **DU Hackathon 2026 – Problem Statement PS-01: CampusIQ**.
UniMitra is built strictly to serve universities and colleges with verified, hallucination-free bilingual intelligence.
