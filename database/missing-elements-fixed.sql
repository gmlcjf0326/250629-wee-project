-- Missing Database Elements for Wee Project
-- This file contains all missing tables, columns, indexes, and other database objects
-- Safe to run on existing database - uses IF NOT EXISTS and conditional checks

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- MISSING TABLES
-- =====================================================

-- Community Board System Tables (5 tables)
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    view_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_likes (
    user_id UUID NOT NULL REFERENCES users(id),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
    user_id UUID NOT NULL REFERENCES users(id),
    comment_id UUID NOT NULL REFERENCES community_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE IF NOT EXISTS post_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Survey Detail Tables (2 tables)
CREATE TABLE IF NOT EXISTS survey_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options JSONB,
    is_required BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS survey_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    response_id UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES survey_questions(id),
    answer_text TEXT,
    answer_number NUMERIC,
    answer_date DATE,
    answer_options JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wee Content Management Tables (6 tables)
CREATE TABLE IF NOT EXISTS wee_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    author VARCHAR(100),
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wee_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    importance VARCHAR(20) DEFAULT 'normal',
    target_audience VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wee_institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(10),
    phone VARCHAR(50),
    fax VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    director_name VARCHAR(100),
    services JSONB DEFAULT '[]',
    facilities JSONB DEFAULT '[]',
    operating_hours JSONB,
    coordinates JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wee_newsletters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    issue_number VARCHAR(50),
    publish_date DATE NOT NULL,
    content TEXT,
    file_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wee_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500),
    file_size INTEGER,
    file_type VARCHAR(50),
    thumbnail_url VARCHAR(500),
    author VARCHAR(100),
    publication_date DATE,
    tags JSONB DEFAULT '[]',
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wee_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER,
    stat_type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    value NUMERIC NOT NULL,
    unit VARCHAR(20),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add missing columns to surveys table
DO $$ 
BEGIN
    -- Add instructions column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'surveys' 
                   AND column_name = 'instructions') THEN
        ALTER TABLE surveys ADD COLUMN instructions TEXT;
    END IF;
    
    -- Add status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'surveys' 
                   AND column_name = 'status') THEN
        ALTER TABLE surveys ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
    END IF;
    
    -- Add is_anonymous column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'surveys' 
                   AND column_name = 'is_anonymous') THEN
        ALTER TABLE surveys ADD COLUMN is_anonymous BOOLEAN DEFAULT false;
    END IF;
    
    -- Add max_responses column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'surveys' 
                   AND column_name = 'max_responses') THEN
        ALTER TABLE surveys ADD COLUMN max_responses INTEGER;
    END IF;
    
    -- Add allow_multiple_responses column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'surveys' 
                   AND column_name = 'allow_multiple_responses') THEN
        ALTER TABLE surveys ADD COLUMN allow_multiple_responses BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add missing columns to survey_responses table
DO $$ 
BEGIN
    -- Add ip_address column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'survey_responses' 
                   AND column_name = 'ip_address') THEN
        ALTER TABLE survey_responses ADD COLUMN ip_address VARCHAR(45);
    END IF;
    
    -- Add user_agent column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'survey_responses' 
                   AND column_name = 'user_agent') THEN
        ALTER TABLE survey_responses ADD COLUMN user_agent TEXT;
    END IF;
END $$;

-- =====================================================
-- CREATE MISSING INDEXES
-- =====================================================

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_epki_cert_id ON users(epki_cert_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- EPKI certificate indexes
CREATE INDEX IF NOT EXISTS idx_epki_certificates_user_id ON epki_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_epki_certificates_cert_id ON epki_certificates(cert_id);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Community board indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author_id ON community_comments(author_id);

-- Survey indexes
CREATE INDEX IF NOT EXISTS idx_surveys_is_active ON surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_surveys_created_by ON surveys(created_by);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_response_id ON survey_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_question_id ON survey_answers(question_id);

-- Wee content indexes
CREATE INDEX IF NOT EXISTS idx_wee_contents_category ON wee_contents(category);
CREATE INDEX IF NOT EXISTS idx_wee_contents_type ON wee_contents(type);
CREATE INDEX IF NOT EXISTS idx_wee_institutions_region ON wee_institutions(region);
CREATE INDEX IF NOT EXISTS idx_wee_institutions_type ON wee_institutions(type);
CREATE INDEX IF NOT EXISTS idx_wee_resources_category ON wee_resources(category);
CREATE INDEX IF NOT EXISTS idx_wee_statistics_year ON wee_statistics(year);
CREATE INDEX IF NOT EXISTS idx_wee_statistics_stat_type ON wee_statistics(stat_type);

-- =====================================================
-- CREATE MISSING FUNCTIONS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Handle new user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'user')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update post counts function
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE MISSING TRIGGERS
-- =====================================================

-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_post_comment_count ON community_comments;
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
DROP TRIGGER IF EXISTS update_community_comments_updated_at ON community_comments;
DROP TRIGGER IF EXISTS update_survey_questions_updated_at ON survey_questions;
DROP TRIGGER IF EXISTS update_wee_contents_updated_at ON wee_contents;
DROP TRIGGER IF EXISTS update_wee_announcements_updated_at ON wee_announcements;
DROP TRIGGER IF EXISTS update_wee_institutions_updated_at ON wee_institutions;
DROP TRIGGER IF EXISTS update_wee_newsletters_updated_at ON wee_newsletters;
DROP TRIGGER IF EXISTS update_wee_resources_updated_at ON wee_resources;
DROP TRIGGER IF EXISTS update_wee_statistics_updated_at ON wee_statistics;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_post_comment_count
    AFTER INSERT OR DELETE ON community_comments
    FOR EACH ROW 
    EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER update_community_posts_updated_at 
    BEFORE UPDATE ON community_posts
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at 
    BEFORE UPDATE ON community_comments
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_questions_updated_at 
    BEFORE UPDATE ON survey_questions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_contents_updated_at 
    BEFORE UPDATE ON wee_contents
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_announcements_updated_at 
    BEFORE UPDATE ON wee_announcements
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_institutions_updated_at 
    BEFORE UPDATE ON wee_institutions
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_newsletters_updated_at 
    BEFORE UPDATE ON wee_newsletters
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_resources_updated_at 
    BEFORE UPDATE ON wee_resources
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wee_statistics_updated_at 
    BEFORE UPDATE ON wee_statistics
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE wee_statistics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Community posts policies
CREATE POLICY "Anyone can view active posts" ON community_posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON community_posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON community_posts
    FOR DELETE USING (auth.uid() = author_id);

-- Community comments policies
CREATE POLICY "Anyone can view non-deleted comments" ON community_comments
    FOR SELECT USING (is_deleted = false);

CREATE POLICY "Users can create comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON community_comments
    FOR UPDATE USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Anyone can view post likes" ON post_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can like posts" ON post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their likes" ON post_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Survey policies
CREATE POLICY "Anyone can view active surveys" ON surveys
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage surveys" ON surveys
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- Wee content policies
CREATE POLICY "Anyone can view published content" ON wee_contents
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage content" ON wee_contents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default roles if not exists
INSERT INTO user_roles (name, description, permissions) VALUES
('admin', '시스템 관리자', '["*"]'),
('manager', '매니저', '["read:*", "write:content", "write:survey", "read:stats"]'),
('counselor', '상담사', '["read:content", "write:consultation", "read:student"]'),
('user', '일반 사용자', '["read:content", "write:survey_response"]')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions if not exists
INSERT INTO permissions (resource, action, description) VALUES
('content', 'read', '콘텐츠 읽기'),
('content', 'write', '콘텐츠 작성/수정'),
('content', 'delete', '콘텐츠 삭제'),
('user', 'read', '사용자 정보 조회'),
('user', 'write', '사용자 정보 수정'),
('user', 'delete', '사용자 삭제'),
('survey', 'read', '설문조사 조회'),
('survey', 'write', '설문조사 생성/수정'),
('survey', 'delete', '설문조사 삭제'),
('survey_response', 'read', '설문 응답 조회'),
('survey_response', 'write', '설문 응답 작성'),
('consultation', 'read', '상담 내역 조회'),
('consultation', 'write', '상담 내역 작성'),
('stats', 'read', '통계 조회'),
('stats', 'export', '통계 내보내기'),
('system', 'admin', '시스템 관리')
ON CONFLICT (resource, action) DO NOTHING;

-- =====================================================
-- UPDATE ADMIN USER
-- =====================================================

-- Finally, update the admin user
UPDATE public.users 
SET role = 'admin',
    full_name = 'Administrator',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'gmlcjf0326@hanmail.net';

-- Verify the update
SELECT id, email, role, full_name, created_at, updated_at
FROM public.users 
WHERE email = 'gmlcjf0326@hanmail.net';