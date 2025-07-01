# Wee Project 관리자 계정 정보

## 기본 관리자 계정

### 1. 시스템 관리자 (Admin)
- **이메일**: admin@weeproject.kr
- **비밀번호**: WeeAdmin2024!@#
- **역할**: admin (모든 권한)
- **권한**: 
  - 시스템 전체 관리
  - 사용자 관리
  - 콘텐츠 관리
  - 설문조사 관리
  - 통계 조회 및 내보내기

### 2. 매니저 계정 (선택사항)
- **이메일**: manager@weeproject.kr
- **비밀번호**: WeeManager2024!
- **역할**: manager
- **권한**:
  - 콘텐츠 읽기/쓰기
  - 설문조사 관리
  - 통계 조회

### 3. 상담사 계정 (선택사항)
- **이메일**: counselor@weeproject.kr
- **비밀번호**: WeeCounselor2024!
- **역할**: counselor
- **권한**:
  - 콘텐츠 읽기
  - 상담 내역 작성
  - 학생 정보 조회

## 계정 생성 방법

### Supabase Dashboard를 통한 생성 (권장)

1. Supabase Dashboard 접속
2. Authentication > Users 탭으로 이동
3. "Add user" 버튼 클릭
4. 위의 이메일과 비밀번호 입력
5. "Create user" 클릭

### SQL을 통한 역할 업데이트

사용자 생성 후 SQL Editor에서 다음 쿼리 실행:

```sql
-- 관리자 역할 부여
UPDATE public.users 
SET 
    role = 'admin',
    full_name = 'System Administrator',
    organization = 'Wee Project',
    position = 'System Admin'
WHERE email = 'admin@weeproject.kr';
```

## 보안 권장사항

1. **즉시 비밀번호 변경**: 첫 로그인 후 반드시 비밀번호를 변경하세요
2. **강력한 비밀번호 사용**: 최소 12자 이상, 대소문자, 숫자, 특수문자 포함
3. **2단계 인증 활성화**: 가능한 경우 2FA를 활성화하세요
4. **정기적인 비밀번호 변경**: 3개월마다 비밀번호를 변경하세요
5. **계정 공유 금지**: 관리자 계정은 절대 공유하지 마세요

## 문제 해결

### 로그인이 안 되는 경우
1. Supabase Dashboard에서 사용자가 생성되었는지 확인
2. public.users 테이블에서 role이 올바르게 설정되었는지 확인
3. 백엔드 서버가 실행 중인지 확인 (`npm run dev`)

### 권한이 없다고 나오는 경우
1. localStorage의 토큰을 삭제하고 다시 로그인
2. public.users 테이블의 role 필드 확인
3. RLS 정책이 올바르게 설정되었는지 확인