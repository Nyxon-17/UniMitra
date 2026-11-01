# UniMitra — Backend Gateway & Multi-University Knowledge Engine

**Bilingual AI-Powered Smart University Assistant**  
*Your University. Your Language. Your AI Assistant.*

---

## 🏛️ Architecture Overview

The UniMitra backend is a high-performance Node.js & Express API gateway engineered to coordinate with:
1. **Supabase PostgreSQL** as the single unified source of truth for user profiles, institutional documents, chat sessions, saved bookmarks, notices, notifications, audit logs, and vector embeddings (`pgvector`).
2. **Python FastAPI AI Service** (`AiService/`) for LangChain/LangGraph RAG pipelines, multilingual E5 embeddings, Gemini response grounding, and speech STT/TTS processing.
3. **React Frontend** (`Frontend/`) with zero-friction bilingual (Assamese `as` & English `en`) language switching.

```
                          ┌──────────────────────────┐
                          │   React Frontend (UI)    │
                          │   Bilingual (As / En)    │
                          └─────────────┬────────────┘
                                        │ (HTTP / WS)
                                        ▼
                          ┌──────────────────────────┐
                          │  UniMitra API Gateway    │
                          │   (Express.js + Prisma)  │
                          └──────┬────────────┬──────┘
                                 │            │
            ┌────────────────────┘            └────────────────────┐
            ▼                                                      ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│     Supabase PostgreSQL       │              │     Python FastAPI AI Service │
│ - Profiles & RBAC             │◄─────────────┤ - Gemini 1.5 Pro / Flash      │
│ - Multi-University Documents  │   (pgvector  │ - LangChain & LangGraph RAG   │
│ - Chat Sessions & Messages    │   cosine 1024│ - Assamese & English STT/TTS  │
│ - Notices & Notifications     │   embeddings)│ - PDF layout extraction       │
└───────────────────────────────┘              └───────────────────────────────┘
```

---

## 🚀 Key Features Implemented

### 1. Robust Authentication & RBAC
- **Student Authentication**: Register, Login, Session validation (`GET /api/v1/auth/me`), Logout.
- **Faculty Multi-Step Verification**: Registration generates unique Member ID (`UM-FAC-XXXX`), password verification + 6-digit OTP step.
- **Admin Authentication**: Credentials verification (`admin@unimitra.edu.in` / `admin@unimitra`) with 2FA OTP verification.
- **Security**: JWT authentication (HTTP-only cookies + Bearer token header), `bcryptjs` password hashing, Helmet security headers, rate limiters, and Zod schema validations.

### 2. Multi-University Statutory Knowledge Base
- **Universal Multi-University Knowledge**: Students can query across Dibrugarh University (`DU`), Gauhati University (`GU`), Tezpur University (`TU`), Assam University (`AU`), Cotton University (`CU`), and Bodoland University (`BU`).
- **Standard Document Categories**:
  - `REG-ORD`: Regulations & Ordinances
  - `EXAM-EVAL`: Examinations & Evaluation Guidelines
  - `ADM-ELIG`: Admission Procedures & Eligibility Criteria
  - `CURR-SYLL`: Curricula, Syllabus & Course Frameworks
  - `SCHOL-AID`: Scholarships, Grants & Financial Aid
  - `CAMP-FACIL`: Campus Facilities & Student Services
  - `ACAD-CAL`: Academic Calendars & Timelines
  - `POL-PROC`: Institutional Policies & Procedures
- **Side-by-Side University Comparison**: Compare attendance criteria, FYUGP frameworks, passing rules, and hostel eligibility across universities.

### 3. Document Lifecycle & Workflow
- **Faculty Submissions**: Enter `'Pending Admin Approval'` state (`availableToChatbot = false`).
- **Admin Verification**: Admins review, approve, reject, or archive documents with feedback notes.
- **Storage**: Streams to Supabase Storage (`unimitra-documents`) and triggers async vector indexing.

### 4. Bilingual Grounded AI Chatbot
- **Full Assamese & English Language Detection**: Detects Assamese Unicode `[\u0980-\u09FF]` automatically.
- **Exact Statutory Citations**: Every answer provides Document Title, University Name, Clause, Page Number, and Confidence Score.
- **Unanswered Query Queue**: If an answer falls below confidence threshold or has no statutory source, it is logged in `unanswered_queries` for administrator review.
- **Bookmarks & Feedback**: Users can bookmark answers and report inaccuracies.

### 5. Voice Assistant Gateway
- **Speech-to-Text (STT)**: Audio uploads (WebM, WAV, MP3) proxied to AI Service STT.
- **Text-to-Speech (TTS)**: Synthesizes responses in Assamese and English.
- **Full Voice Query Pipeline**: `POST /api/v1/voice/query` processes Audio -> Transcript -> Grounded Answer -> Synthesized Speech Audio.

### 6. Official University Notices & Notifications
- **Admin Notice Publishing**: Pin urgent circulars, upload official attachments.
- **Student & Faculty Feeds**: Filter notices by university and category.
- **User Notifications**: In-app notifications with read/unread tracking.

### 7. Administrator Console Backend
- Real-time usage analytics (total queries, Assamese vs English queries, hallucination rejection rate).
- User management (role update, account activate/deactivate).
- System settings and audit log tracking.

---

## 🛠️ Setup & Running

### Prerequisites
- Node.js v18+ or v20+
- PostgreSQL or Supabase Account

### 1. Environment Configuration
Copy `.env.example` to `.env` in the `Backend/` directory:
```bash
cp .env.example .env
```
Fill in your Supabase connection strings:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

SUPABASE_URL="https://[PROJECT_REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

JWT_SECRET="your_secure_random_jwt_secret"
AI_SERVICE_URL="http://localhost:8000"
AI_SERVICE_SECRET="unimitra_internal_service_secret_key_2024"
```

### 2. Database Migration & Prisma Generation
Initialize database schema in Supabase:
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma db push
```
*(Alternatively, execute `prisma/init_db.sql` directly in Supabase SQL Editor).*

### 3. Seed Database
Seed default universities, document categories, Super Admin, and system settings:
```bash
node src/scripts/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

### 5. Automated Verification & Testing
```bash
# Verify syntax of all 46 backend files
node src/scripts/verify.js

# Run integration probe tests
node src/scripts/probe.js
```

---

## 📡 API Endpoint Reference Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | Server health check & uptime | Public |
| `POST` | `/api/v1/auth/student/register` | Student registration | Public |
| `POST` | `/api/v1/auth/student/login` | Student login | Public |
| `POST` | `/api/v1/auth/faculty/register` | Faculty registration | Public |
| `POST` | `/api/v1/auth/faculty/login` | Faculty credentials login (Step 1) | Public |
| `POST` | `/api/v1/auth/faculty/verify-otp` | Faculty OTP verification (Step 2) | Public |
| `POST` | `/api/v1/auth/admin/login` | Admin credentials login (Step 1) | Public |
| `POST` | `/api/v1/auth/admin/verify-otp` | Admin OTP verification (Step 2) | Public |
| `GET` | `/api/v1/auth/me` | Current profile | Authenticated |
| `POST` | `/api/v1/chat/query` | Grounded bilingual RAG query | Public / Auth |
| `GET` | `/api/v1/chat/sessions` | User conversation sessions | Authenticated |
| `POST` | `/api/v1/chat/save-answer` | Bookmark answer | Authenticated |
| `POST` | `/api/v1/chat/feedback` | Report inaccuracy or accuracy | Public / Auth |
| `POST` | `/api/v1/voice/query` | Full audio voice assistant pipeline | Public / Auth |
| `POST` | `/api/v1/voice/transcribe` | Speech-to-Text transcription | Public / Auth |
| `POST` | `/api/v1/voice/synthesize` | Text-to-Speech synthesis | Public / Auth |
| `GET` | `/api/v1/documents` | Multi-university documents list | Public / Auth |
| `POST` | `/api/v1/documents/upload` | Upload institutional document | Faculty / Admin |
| `PATCH`| `/api/v1/documents/:id/approval`| Approve or reject document | Admin |
| `GET` | `/api/v1/documents/categories` | Document taxonomy categories | Public |
| `GET` | `/api/v1/universities` | All university profiles | Public |
| `GET` | `/api/v1/universities/compare` | Compare two universities | Public |
| `GET` | `/api/v1/universities/:code` | University profile & statutory knowledge | Public |
| `GET` | `/api/v1/notices` | Official university circulars | Public |
| `POST` | `/api/v1/notices` | Publish official circular | Admin |
| `GET` | `/api/v1/admin/analytics` | System usage analytics & query metrics | Admin |
| `GET` | `/api/v1/admin/unanswered` | Unanswered questions review queue | Admin |
| `GET` | `/api/v1/admin/feedback` | User feedback submissions | Admin |
| `GET` | `/api/v1/admin/users` | User management | Admin |
| `PATCH`| `/api/v1/admin/users/:id/role` | Update user role | Admin |

