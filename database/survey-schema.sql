-- Survey System Tables

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  instructions TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_anonymous BOOLEAN DEFAULT true,
  max_responses INTEGER,
  allow_multiple_responses BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Survey questions table
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

-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES auth.users(id), -- NULL for anonymous responses
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  is_complete BOOLEAN DEFAULT false
);

-- Survey answers table
CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id UUID REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  answer_number NUMERIC,
  answer_options JSONB, -- For multiple selections
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data for surveys
INSERT INTO surveys (title, description, status, start_date, end_date, is_anonymous) VALUES
(
  '2024년 Wee 프로젝트 만족도 조사',
  'Wee 프로젝트 서비스 이용자를 대상으로 한 만족도 조사입니다.',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  true
),
(
  '학교생활 적응 실태 조사',
  '학생들의 학교생활 적응 정도와 어려움을 파악하기 위한 조사입니다.',
  'active',
  NOW(),
  NOW() + INTERVAL '45 days',
  false
),
(
  '상담 서비스 개선 방안 조사',
  '상담 서비스 질 향상을 위한 의견 수렴 조사입니다.',
  'draft',
  NULL,
  NULL,
  true
);

-- Sample questions for the first survey
INSERT INTO survey_questions (survey_id, question_text, question_type, options, is_required, order_index) VALUES
(
  (SELECT id FROM surveys WHERE title = '2024년 Wee 프로젝트 만족도 조사'),
  'Wee 프로젝트 서비스를 이용해 보신 적이 있나요?',
  'yes_no',
  NULL,
  true,
  1
),
(
  (SELECT id FROM surveys WHERE title = '2024년 Wee 프로젝트 만족도 조사'),
  '이용하신 서비스는 무엇인가요? (복수 선택 가능)',
  'multiple_choice',
  '["Wee 클래스", "Wee 센터", "Wee 스쿨", "온라인 상담", "전화 상담"]'::jsonb,
  true,
  2
),
(
  (SELECT id FROM surveys WHERE title = '2024년 Wee 프로젝트 만족도 조사'),
  '서비스 이용 목적은 무엇이었나요?',
  'single_choice',
  '["개인상담", "집단상담", "심리검사", "위기상담", "진로상담", "기타"]'::jsonb,
  true,
  3
),
(
  (SELECT id FROM surveys WHERE title = '2024년 Wee 프로젝트 만족도 조사'),
  '전반적인 서비스 만족도를 평가해 주세요.',
  'rating',
  '{"min": 1, "max": 5, "labels": ["매우 불만족", "불만족", "보통", "만족", "매우 만족"]}'::jsonb,
  true,
  4
),
(
  (SELECT id FROM surveys WHERE title = '2024년 Wee 프로젝트 만족도 조사'),
  '서비스 개선을 위한 의견이나 제안이 있다면 자유롭게 작성해 주세요.',
  'textarea',
  NULL,
  false,
  5
);

-- Sample questions for the second survey
INSERT INTO survey_questions (survey_id, question_text, question_type, options, is_required, order_index) VALUES
(
  (SELECT id FROM surveys WHERE title = '학교생활 적응 실태 조사'),
  '현재 학년을 선택해 주세요.',
  'single_choice',
  '["초등학교 1-3학년", "초등학교 4-6학년", "중학교 1학년", "중학교 2학년", "중학교 3학년", "고등학교 1학년", "고등학교 2학년", "고등학교 3학년"]'::jsonb,
  true,
  1
),
(
  (SELECT id FROM surveys WHERE title = '학교생활 적응 실태 조사'),
  '학교생활 전반에 대한 만족도는 어느 정도인가요?',
  'rating',
  '{"min": 1, "max": 5, "labels": ["매우 불만족", "불만족", "보통", "만족", "매우 만족"]}'::jsonb,
  true,
  2
),
(
  (SELECT id FROM surveys WHERE title = '학교생활 적응 실태 조사'),
  '학교생활에서 가장 어려운 점은 무엇인가요?',
  'single_choice',
  '["학업 스트레스", "교우관계", "교사와의 관계", "진로 고민", "가정 문제", "경제적 어려움", "기타"]'::jsonb,
  true,
  3
),
(
  (SELECT id FROM surveys WHERE title = '학교생활 적응 실태 조사'),
  '상담이 필요한 경우 어떤 방법을 선호하나요?',
  'multiple_choice',
  '["대면 상담", "전화 상담", "온라인 채팅", "이메일", "그룹 상담", "상담 불필요"]'::jsonb,
  true,
  4
);

-- Indexes
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_surveys_dates ON surveys(start_date, end_date);
CREATE INDEX idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX idx_survey_questions_order ON survey_questions(survey_id, order_index);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_submitted_at ON survey_responses(submitted_at);
CREATE INDEX idx_survey_answers_response_id ON survey_answers(response_id);
CREATE INDEX idx_survey_answers_question_id ON survey_answers(question_id);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read active surveys
CREATE POLICY "Public can view active surveys" ON surveys
  FOR SELECT USING (status = 'active');

-- Public can read questions for active surveys
CREATE POLICY "Public can view questions for active surveys" ON survey_questions
  FOR SELECT USING (
    survey_id IN (SELECT id FROM surveys WHERE status = 'active')
  );

-- Users can insert their own responses
CREATE POLICY "Users can submit responses" ON survey_responses
  FOR INSERT WITH CHECK (true);

-- Users can insert their own answers
CREATE POLICY "Users can submit answers" ON survey_answers
  FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admins can manage surveys" ON surveys
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Admins can view all responses" ON survey_responses
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Admins can view all answers" ON survey_answers
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles 
      WHERE role_id IN (
        SELECT id FROM roles WHERE name IN ('admin', 'manager')
      )
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();