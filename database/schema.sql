-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Project Info Table
CREATE TABLE IF NOT EXISTS project_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    vision TEXT,
    mission TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Centers Table
CREATE TABLE IF NOT EXISTS centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    services JSONB DEFAULT '[]',
    operating_hours JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notices Table
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    author VARCHAR(255),
    is_pinned BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500),
    file_size INTEGER,
    download_count INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Surveys Table (for Stage 3)
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    target_audience VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_required BOOLEAN DEFAULT false,
    questions JSONB NOT NULL,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Survey Responses Table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    respondent_id VARCHAR(255),
    respondent_info JSONB,
    answers JSONB NOT NULL,
    is_complete BOOLEAN DEFAULT false,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File Uploads Table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id UUID,
    uploaded_by VARCHAR(255),
    is_public BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_centers_type ON centers(type);
CREATE INDEX idx_centers_region ON centers(region);
CREATE INDEX idx_notices_category ON notices(category);
CREATE INDEX idx_notices_published ON notices(is_published);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_surveys_active ON surveys(is_active);
CREATE INDEX idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_project_info_updated_at BEFORE UPDATE ON project_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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