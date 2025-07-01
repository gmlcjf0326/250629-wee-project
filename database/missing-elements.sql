-- Missing Elements SQL Script for Supabase
-- This file contains only the missing tables, columns, constraints, and indexes
-- that are not present in the existing Supabase database

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- MISSING TABLES
-- ===========================

-- 1. Community Board Tables (from community-schema.sql)
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name VARCHAR(255),
  category VARCHAR(50) DEFAULT 'general',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_notice BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name VARCHAR(255),
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Survey Questions and Answers Tables (from survey-schema.sql)
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN (
    'multiple_choice', 'single_choice', 'text', 'textarea', 'rating', 'yes_no', 'number'
  )),
  options JSONB, -- For multiple choice questions
  is_required BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_number NUMERIC,
  answer_options JSONB, -- For multiple selections
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Wee Content Tables (from wee-content-schema.sql)
CREATE TABLE IF NOT EXISTS wee_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  metadata JSONB,
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wee_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  author VARCHAR(255),
  posted_date DATE,
  views INTEGER DEFAULT 0,
  attachments TEXT[],
  category VARCHAR(100) NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wee_institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('class', 'center', 'school')),
  region VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  services TEXT[],
  coordinates JSONB,
  operating_hours VARCHAR(255),
  capacity INTEGER,
  staff_count INTEGER,
  source_url TEXT,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wee_newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  issue_number VARCHAR(100),
  issue_date DATE,
  content TEXT,
  pdf_url TEXT,
  thumbnail_url TEXT,
  highlights TEXT[],
  download_count INTEGER DEFAULT 0,
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wee_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  file_url TEXT,
  file_size VARCHAR(50),
  file_type VARCHAR(50),
  version VARCHAR(50),
  author VARCHAR(255),
  published_date DATE,
  download_count INTEGER DEFAULT 0,
  tags TEXT[],
  source_url TEXT NOT NULL,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wee_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL,
  metric_value NUMERIC,
  metric_unit VARCHAR(50),
  category VARCHAR(100),
  year INTEGER,
  month INTEGER,
  region VARCHAR(100),
  metadata JSONB,
  source_url TEXT,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- MISSING COLUMNS (if tables exist)
-- ===========================

-- Add missing columns to existing tables if they exist
-- Note: These commands will fail silently if columns already exist

-- For users table (from auth-schema.sql)
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'full_name') THEN
    ALTER TABLE public.users ADD COLUMN full_name VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
    ALTER TABLE public.users ADD COLUMN phone VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'organization') THEN
    ALTER TABLE public.users ADD COLUMN organization VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'department') THEN
    ALTER TABLE public.users ADD COLUMN department VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'position') THEN
    ALTER TABLE public.users ADD COLUMN position VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'epki_cert_id') THEN
    ALTER TABLE public.users ADD COLUMN epki_cert_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'epki_verified') THEN
    ALTER TABLE public.users ADD COLUMN epki_verified BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_active') THEN
    ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login_at') THEN
    ALTER TABLE public.users ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- For surveys table (from survey-schema.sql)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'instructions') THEN
    ALTER TABLE surveys ADD COLUMN instructions TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'status') THEN
    ALTER TABLE surveys ADD COLUMN status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'is_anonymous') THEN
    ALTER TABLE surveys ADD COLUMN is_anonymous BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'max_responses') THEN
    ALTER TABLE surveys ADD COLUMN max_responses INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'surveys' AND column_name = 'allow_multiple_responses') THEN
    ALTER TABLE surveys ADD COLUMN allow_multiple_responses BOOLEAN DEFAULT false;
  END IF;
END $$;

-- For survey_responses table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'ip_address') THEN
    ALTER TABLE survey_responses ADD COLUMN ip_address INET;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'survey_responses' AND column_name = 'user_agent') THEN
    ALTER TABLE survey_responses ADD COLUMN user_agent TEXT;
  END IF;
END $$;

-- ===========================
-- MISSING INDEXES
-- ===========================

-- Community tables indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Survey tables indexes
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_dates ON surveys(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_questions_order ON survey_questions(survey_id, order_index);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_survey_answers_response_id ON survey_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_survey_answers_question_id ON survey_answers(question_id);

-- Wee content tables indexes
CREATE INDEX IF NOT EXISTS idx_wee_contents_category ON wee_contents(category);
CREATE INDEX IF NOT EXISTS idx_wee_contents_scraped_at ON wee_contents(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_wee_announcements_posted_date ON wee_announcements(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_wee_announcements_category ON wee_announcements(category);
CREATE INDEX IF NOT EXISTS idx_wee_institutions_type ON wee_institutions(type);
CREATE INDEX IF NOT EXISTS idx_wee_institutions_region ON wee_institutions(region);
CREATE INDEX IF NOT EXISTS idx_wee_newsletters_issue_date ON wee_newsletters(issue_date DESC);
CREATE INDEX IF NOT EXISTS idx_wee_resources_category ON wee_resources(category);
CREATE INDEX IF NOT EXISTS idx_wee_resources_published_date ON wee_resources(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_wee_statistics_year_month ON wee_statistics(year, month);
CREATE INDEX IF NOT EXISTS idx_wee_statistics_metric_name ON wee_statistics(metric_name);

-- Auth schema indexes (if not exist)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_epki_cert_id ON public.users(epki_cert_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_epki_certificates_user_id ON epki_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_epki_certificates_cert_id ON epki_certificates(cert_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Schema.sql indexes (if not exist)
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_centers_type ON centers(type);
CREATE INDEX IF NOT EXISTS idx_centers_region ON centers(region);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_published ON notices(is_published);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_entity ON file_uploads(entity_type, entity_id);

-- ===========================
-- MISSING FUNCTIONS AND TRIGGERS
-- ===========================

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create handle_new_user function for auth trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'user')
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create update_post_counts function for community
CREATE OR REPLACE FUNCTION update_post_counts() RETURNS TRIGGER AS $$
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

-- ===========================
-- MISSING TRIGGERS
-- ===========================

-- Auth triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Community triggers
CREATE TRIGGER IF NOT EXISTS update_post_comment_count
AFTER INSERT OR DELETE ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER IF NOT EXISTS update_community_posts_updated_at 
BEFORE UPDATE ON community_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_community_comments_updated_at 
BEFORE UPDATE ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Wee content triggers
CREATE TRIGGER IF NOT EXISTS update_wee_contents_updated_at 
BEFORE UPDATE ON wee_contents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_wee_announcements_updated_at 
BEFORE UPDATE ON wee_announcements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_wee_institutions_updated_at 
BEFORE UPDATE ON wee_institutions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_wee_newsletters_updated_at 
BEFORE UPDATE ON wee_newsletters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_wee_resources_updated_at 
BEFORE UPDATE ON wee_resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Schema.sql triggers (if not exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_project_info_updated_at') THEN
    CREATE TRIGGER update_project_info_updated_at BEFORE UPDATE ON project_info 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_services_updated_at') THEN
    CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contact_inquiries_updated_at') THEN
    CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_centers_updated_at') THEN
    CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON centers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notices_updated_at') THEN
    CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_resources_updated_at') THEN
    CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_surveys_updated_at') THEN
    CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_survey_responses_updated_at') THEN
    CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ===========================
-- ENABLE ROW LEVEL SECURITY
-- ===========================

-- Enable RLS on all tables
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

-- ===========================
-- ROW LEVEL SECURITY POLICIES
-- ===========================

-- Community RLS Policies
CREATE POLICY "Public can view active posts" ON community_posts
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view active comments" ON community_comments
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can like posts" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

-- Survey RLS Policies
CREATE POLICY "Public can view questions for active surveys" ON survey_questions
  FOR SELECT USING (
    survey_id IN (SELECT id FROM surveys WHERE status = 'active')
  );

CREATE POLICY "Users can submit answers" ON survey_answers
  FOR INSERT WITH CHECK (true);

-- Wee Content RLS Policies
CREATE POLICY "Public read access for wee_contents" ON wee_contents
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_announcements" ON wee_announcements
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_institutions" ON wee_institutions
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_newsletters" ON wee_newsletters
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_resources" ON wee_resources
  FOR SELECT USING (true);

CREATE POLICY "Public read access for wee_statistics" ON wee_statistics
  FOR SELECT USING (true);

-- Admin write policies for Wee content tables
CREATE POLICY "Admin write access for wee_contents" ON wee_contents
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admin write access for wee_announcements" ON wee_announcements
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'manager')
    )
  );

-- ===========================
-- DEFAULT DATA INSERTS
-- ===========================

-- Only insert if not exists to avoid duplicates
INSERT INTO user_roles (name, description, permissions) VALUES
('admin', '시스템 관리자', '["*"]'),
('manager', '매니저', '["read:*", "write:content", "write:survey", "read:stats"]'),
('counselor', '상담사', '["read:content", "write:consultation", "read:student"]'),
('user', '일반 사용자', '["read:content", "write:survey_response"]')
ON CONFLICT (name) DO NOTHING;

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

-- Insert initial project info
INSERT INTO project_info (title, description, vision, mission)
VALUES (
    '위(Wee) 프로젝트',
    'We(우리들) + Education(교육) + Emotion(감성)의 합성어로, 학생들의 건강하고 즐거운 학교생활을 위해 학교, 교육청, 지역사회가 연계하여 학생들의 학교생활 적응을 돕는 다중 통합지원 서비스망입니다.',
    '모든 학생이 행복한 학교생활을 영위할 수 있는 교육환경 조성',
    '학생 개개인의 특성과 요구에 맞는 맞춤형 상담 및 교육 서비스 제공'
) ON CONFLICT DO NOTHING;

-- Insert initial services
INSERT INTO services (name, description, category, features, order_index) VALUES
('Wee 클래스', '학교 내 설치된 상담실로, 전문상담교사가 상주하여 학생들의 심리·정서적 지원을 제공합니다.', 'wee-class', '["개인 상담 및 집단 상담", "심리검사 및 해석", "위기 상황 개입", "학교 적응 프로그램 운영"]'::jsonb, 1),
('Wee 센터', '교육지원청 단위로 설치된 전문적인 상담 기관으로, 학교에서 해결하기 어려운 사례를 지원합니다.', 'wee-center', '["전문적인 심리 상담", "정신과 자문의 지원", "학부모 상담 및 교육", "교사 컨설팅"]'::jsonb, 2),
('Wee 스쿨', '장기 위탁교육 기관으로, 학교 부적응 학생들을 위한 대안교육을 제공합니다.', 'wee-school', '["개별화된 교육과정", "진로·직업 교육", "치료 프로그램", "기숙형 운영"]'::jsonb, 3),
('가정형 Wee 센터', '가정과 같은 환경에서 치료와 교육을 병행하는 기숙형 대안교육 시설입니다.', 'home-wee', '["24시간 보호 및 지원", "개별 맞춤형 치료", "가족 상담", "사회 적응 훈련"]'::jsonb, 4)
ON CONFLICT DO NOTHING;