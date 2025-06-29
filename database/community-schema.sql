-- Community Board Tables

-- Community posts table
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

-- Community comments table
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

-- Post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Post attachments table
CREATE TABLE IF NOT EXISTS post_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  file_name VARCHAR(500) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data
INSERT INTO community_posts (title, content, author_name, category, view_count, like_count, comment_count) VALUES
(
  'Wee 프로젝트 활용 후기 공유합니다',
  '안녕하세요. 올해 처음으로 Wee 클래스를 운영하게 된 교사입니다.
  
  처음에는 어떻게 시작해야 할지 막막했는데, 매뉴얼과 프로그램 자료집을 참고하니 큰 도움이 되었습니다.
  특히 학생들이 편안하게 상담받을 수 있는 공간을 만드는 것이 중요하다는 것을 알게 되었어요.
  
  저희 학교 학생들도 처음에는 어색해했지만, 지금은 자발적으로 찾아오는 학생들이 많아졌습니다.
  다른 선생님들께서도 좋은 경험 있으시면 공유해주세요!',
  '김교사',
  'general',
  234,
  18,
  5
),
(
  '중학생 대상 진로상담 프로그램 추천해주세요',
  '중학교 2학년 담임을 맡고 있는데요, 학생들이 진로에 대해 고민이 많은 것 같습니다.
  
  Wee 프로젝트에서 제공하는 진로상담 프로그램 중에 효과적인 것이 있을까요?
  실제로 운영해보신 선생님들의 조언을 듣고 싶습니다.',
  '박상담사',
  'question',
  156,
  7,
  12
),
(
  '[공지] 2024년 하반기 Wee 프로젝트 연수 일정 안내',
  '2024년 하반기 Wee 프로젝트 관련 연수 일정을 안내드립니다.
  
  1. 기초과정: 7월 15-17일 (3일간)
  2. 심화과정: 8월 5-7일 (3일간)
  3. 전문가과정: 9월 2-4일 (3일간)
  
  자세한 내용은 공지사항을 참고해주세요.',
  '관리자',
  'notice',
  523,
  0,
  0
),
(
  '게임 과몰입 학생 상담 사례 공유',
  '최근 게임 과몰입으로 학교생활에 어려움을 겪는 학생을 상담하게 되었습니다.
  
  처음에는 어떻게 접근해야 할지 몰라 막막했는데, Wee 센터의 전문상담사님과 협력하여 
  단계적으로 접근한 결과 많은 개선이 있었습니다.
  
  1단계: 라포 형성 (2주)
  2단계: 게임의 의미 탐색 (3주)
  3단계: 대안 활동 찾기 (4주)
  4단계: 부모 상담 병행 (지속)
  
  비슷한 경험이 있으신 분들과 의견을 나누고 싶습니다.',
  '이상담교사',
  'case',
  412,
  32,
  8
);

-- Sample comments
INSERT INTO community_comments (post_id, author_name, content) VALUES
(
  (SELECT id FROM community_posts WHERE title = 'Wee 프로젝트 활용 후기 공유합니다' LIMIT 1),
  '최교사',
  '좋은 경험 공유해주셔서 감사합니다. 저도 이번에 처음 시작하는데 많은 도움이 되었어요!'
),
(
  (SELECT id FROM community_posts WHERE title = 'Wee 프로젝트 활용 후기 공유합니다' LIMIT 1),
  '정상담사',
  '학생들이 자발적으로 찾아온다니 정말 좋네요. 저희 학교도 그런 분위기를 만들고 싶습니다.'
);

-- Indexes
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_community_comments_parent_id ON community_comments(parent_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);

-- Enable RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read active posts
CREATE POLICY "Public can view active posts" ON community_posts
  FOR SELECT USING (status = 'active');

-- Public can read active comments
CREATE POLICY "Public can view active comments" ON community_comments
  FOR SELECT USING (status = 'active');

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Users can like posts
CREATE POLICY "Users can like posts" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

-- Triggers
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

CREATE TRIGGER update_post_comment_count
AFTER INSERT OR DELETE ON community_comments
FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Update timestamps trigger
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();