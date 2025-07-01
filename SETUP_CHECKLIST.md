# WEE 프로젝트 설정 체크리스트

## ✅ 이미 해결된 사항
1. **환경변수 설정** - Backend와 Frontend 모두 .env 파일이 설정되어 있음
2. **인증 오류 수정완료**:
   - localStorage 키 불일치 수정
   - Supabase admin signOut 오류 수정
   - 이메일 중복 체크 오류 핸들링 개선
3. **데이터베이스 트리거 수정 스크립트 생성**

## ⚠️ 반드시 실행해야 할 작업

### 1. 데이터베이스 스키마 적용
Supabase SQL Editor에서 다음 순서대로 실행:
```bash
1. database/schema.sql
2. database/auth-schema.sql
3. database/community-schema.sql
4. database/survey-schema.sql
5. database/wee-content-schema.sql
6. database/fix-duplicate-email-trigger.sql  # 중요! 이메일 중복 오류 해결
```

### 2. Storage 버킷 생성
Supabase Dashboard > Storage에서:
- 버킷 이름: `uploads`
- Public bucket 체크

### 3. 관리자 계정 생성
```bash
cd backend
npm run create:admin
```
- 기본 관리자 이메일: `admin@weeproject.com`
- 기본 비밀번호: `Admin123!@#`
- **중요**: 첫 로그인 후 비밀번호 변경 필수!

### 4. 의존성 패키지 설치 (이미 설치되었을 수 있음)
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🔍 추가 확인사항

### 1. Supabase RLS (Row Level Security) 정책
개발 단계에서는 SUPABASE_SETUP.md의 기본 정책 사용 가능하지만, 운영 환경에서는 보안 강화 필요

### 2. CORS 설정
현재 backend에 CORS가 설정되어 있지만, Supabase Dashboard에서도 확인:
- Settings > API > CORS에 `http://localhost:5173` 추가

### 3. 파일 업로드 디렉토리 권한
`backend/uploads` 폴더가 쓰기 가능한지 확인

## 🚀 실행 방법
```bash
# Backend 실행
cd backend
npm run dev

# Frontend 실행 (새 터미널)
cd frontend
npm run dev
```

## 🧪 테스트 순서
1. http://localhost:5173 접속
2. 회원가입 시도 → 이메일 중복 체크 작동 확인
3. 로그인 → 로그아웃 → localStorage 정리 확인
4. 관리자 로그인 후 기능 테스트

## ❗ 주의사항
- `.env` 파일의 API 키들이 노출되지 않도록 주의
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 프론트엔드에 노출 금지
- 운영 환경 배포 시 환경변수 재설정 필요