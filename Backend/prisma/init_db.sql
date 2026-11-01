-- ====================================================================
-- UNIMITRA DATABASE INITIALIZATION SCRIPT (SUPABASE POSTGRESQL)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doc_status AS ENUM ('Indexed', 'Pending Admin Approval', 'Archived', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE approval_status AS ENUM ('approved', 'pending', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Tables

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    department VARCHAR(255),
    designation VARCHAR(255),
    member_id VARCHAR(64) UNIQUE,
    faculty_id VARCHAR(64),
    phone VARCHAR(32),
    preferred_lang VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    notification_preferences JSONB DEFAULT '{"regulations": true, "exams": true, "scholarships": true, "admissions": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Universities
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    as_name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(16) NOT NULL,
    motto TEXT,
    as_motto TEXT,
    established_year INT,
    campus_type VARCHAR(255),
    as_campus_type VARCHAR(255),
    campus_area VARCHAR(255),
    location VARCHAR(255),
    as_location VARCHAR(255),
    chancellor VARCHAR(255),
    vice_chancellor VARCHAR(255),
    registrar VARCHAR(255),
    helpline VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(255),
    naac_accreditation VARCHAR(64),
    nirf_rank VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Categories
CREATE TABLE IF NOT EXISTS public.document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    as_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    custom_id VARCHAR(64) UNIQUE,
    title VARCHAR(512) NOT NULL,
    as_title VARCHAR(512),
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    university_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES public.document_categories(id) ON DELETE SET NULL,
    category_name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    academic_year VARCHAR(32),
    publication_date DATE,
    pages INT DEFAULT 1,
    file_size VARCHAR(32),
    file_type VARCHAR(16) DEFAULT 'PDF',
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    source_url TEXT,
    sha256 VARCHAR(64) NOT NULL,
    chunks_count INT DEFAULT 0,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    uploader_role VARCHAR(32) NOT NULL,
    uploader_name VARCHAR(255) NOT NULL,
    uploader_email VARCHAR(255) NOT NULL,
    status doc_status NOT NULL DEFAULT 'Pending Admin Approval',
    approval_status approval_status NOT NULL DEFAULT 'pending',
    available_to_chatbot BOOLEAN DEFAULT FALSE,
    processing_stage VARCHAR(128) DEFAULT 'Awaiting Processing',
    ocr_applied BOOLEAN DEFAULT FALSE,
    summary TEXT,
    citation TEXT,
    admin_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Chunks (Vector Store for Python AI Service)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    page_number INT,
    clause_reference VARCHAR(255),
    content TEXT NOT NULL,
    token_count INT,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HNSW Vector Index for Cosine Distance
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding 
ON public.document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Chat Sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'New Consultation',
    language VARCHAR(10) DEFAULT 'en',
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(16) NOT NULL,
    text TEXT NOT NULL,
    source_name VARCHAR(255),
    page_reference VARCHAR(128),
    citation TEXT,
    confidence VARCHAR(64),
    domain VARCHAR(128),
    is_unverified BOOLEAN DEFAULT FALSE,
    is_voice BOOLEAN DEFAULT FALSE,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Answers (Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    answer TEXT NOT NULL,
    source VARCHAR(255),
    page VARCHAR(128),
    category VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unanswered Queries
CREATE TABLE IF NOT EXISTS public.unanswered_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    query TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(32) DEFAULT 'Unanswered',
    resolution_answer TEXT,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Submissions
CREATE TABLE IF NOT EXISTS public.feedback_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    user_role VARCHAR(32),
    type VARCHAR(128) NOT NULL,
    university_name VARCHAR(255),
    rating INT,
    comments TEXT,
    answer_snippet TEXT,
    status VARCHAR(64) DEFAULT 'Pending Admin Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    university_name VARCHAR(255) NOT NULL,
    title VARCHAR(512) NOT NULL,
    as_title VARCHAR(512),
    description TEXT,
    as_description TEXT,
    category VARCHAR(128),
    publication_date DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE,
    importance VARCHAR(32) DEFAULT 'Normal',
    target_audience JSONB NOT NULL,
    attachment_url TEXT,
    file_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE,
    title VARCHAR(512) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) DEFAULT 'circular',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role VARCHAR(32),
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64),
    entity_id VARCHAR(64),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Essential Indexes
CREATE INDEX IF NOT EXISTS idx_documents_chatbot ON public.documents(available_to_chatbot, approval_status);
CREATE INDEX IF NOT EXISTS idx_documents_university ON public.documents(university_id);
CREATE INDEX IF NOT EXISTS idx_messages_session ON public.chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notices_active ON public.notices(university_id, is_active);

