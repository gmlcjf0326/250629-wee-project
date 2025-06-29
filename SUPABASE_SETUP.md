# Supabase 프로젝트 설정 가이드

## 1. Supabase 프로젝트 생성

1. [https://supabase.com](https://supabase.com) 접속
2. 로그인 또는 회원가입
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - Organization: 기존 조직 선택 또는 새로 생성
   - Project name: `wee-project`
   - Database Password: 강력한 비밀번호 설정 (저장 필수!)
   - Region: `Northeast Asia (Seoul)` 선택
   - Pricing Plan: Free tier 선택

## 2. 프로젝트 생성 후 설정 정보 확인

프로젝트 생성 완료 후 Settings > API 메뉴에서 다음 정보 확인:

- **Project URL**: `https://[your-project-ref].supabase.co`
- **Project API keys**:
  - `anon public`: 프론트엔드에서 사용
  - `service_role secret`: 백엔드에서 사용 (보안 주의!)

## 3. 환경 변수 설정

### Backend (.env 파일)
```bash
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Supabase Configuration
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend (.env 파일)
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Supabase Configuration
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. 데이터베이스 테이블 생성

1. Supabase Dashboard에서 SQL Editor 탭 클릭
2. "New query" 클릭
3. `/database/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 클릭하여 실행

## 5. Storage 버킷 생성

1. Storage 탭으로 이동
2. "New bucket" 클릭
3. 버킷 이름: `uploads`
4. Public bucket 옵션 체크 (공개 파일용)
5. "Create bucket" 클릭

## 6. Row Level Security (RLS) 설정

### 기본 정책 (개발 단계)
```sql
-- Allow public read access to services
CREATE POLICY "Enable read access for all users" ON services
FOR SELECT USING (true);

-- Allow public insert for contact inquiries
CREATE POLICY "Enable insert for all users" ON contact_inquiries
FOR INSERT WITH CHECK (true);

-- Allow public insert for survey responses
CREATE POLICY "Enable insert for all users" ON survey_responses
FOR INSERT WITH CHECK (true);

-- Allow public read for active surveys
CREATE POLICY "Enable read access for active surveys" ON surveys
FOR SELECT USING (is_active = true);
```

## 7. 연결 테스트

### Backend 테스트
```bash
cd backend
npm run dev
# 브라우저에서 http://localhost:5000/api 접속
```

### Frontend 테스트
```bash
cd frontend
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

## 8. 문제 해결

### CORS 에러 발생 시
Supabase Dashboard > Settings > API > CORS에서 허용된 도메인 추가:
- `http://localhost:5173`
- `http://localhost:5000`

### 연결 실패 시
1. 환경 변수가 올바르게 설정되었는지 확인
2. Supabase 프로젝트가 활성화되었는지 확인
3. API 키가 정확한지 재확인

## 주의사항

- **service_role** 키는 절대 프론트엔드에 노출하지 마세요
- .env 파일은 .gitignore에 포함되어야 합니다
- 프로덕션 환경에서는 더 엄격한 RLS 정책을 설정해야 합니다