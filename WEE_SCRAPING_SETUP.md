# Wee 웹사이트 크롤링 시스템 구현

## 개요
공식 Wee 프로젝트 웹사이트(https://www.wee.go.kr)에서 콘텐츠를 크롤링하여 Supabase 데이터베이스에 저장하는 시스템을 구현했습니다.

## 구현된 기능

### 1. 웹 크롤링 분석
- **대상 사이트**: https://www.wee.go.kr/home/main/main.do
- **분석 내용**:
  - 메인 페이지 구조 분석
  - 네비게이션 메뉴 구조 파악
  - 콘텐츠 섹션 식별
  - 기관 정보 구조 분석

### 2. 데이터베이스 스키마 설계
**새로운 테이블들**:
- `wee_contents`: 일반 콘텐츠 (페이지별)
- `wee_announcements`: 공지사항/뉴스
- `wee_institutions`: 기관 정보 (클래스, 센터, 스쿨)
- `wee_newsletters`: 뉴스레터
- `wee_resources`: 자료실 (매뉴얼, 프로그램 등)
- `wee_statistics`: 통계/지표 데이터

### 3. 백엔드 크롤링 엔진
**파일**: `backend/src/scrapers/wee-scraper.ts`
- **WeeScraper 클래스**:
  - `scrapeMainPage()`: 메인 페이지 크롤링
  - `scrapeAboutPage()`: 사업소개 페이지 크롤링
  - `scrapeInstitutions()`: 기관 정보 크롤링
  - `saveToSupabase()`: 데이터베이스 저장

**기술 스택**:
- **axios**: HTTP 요청
- **cheerio**: HTML 파싱 (서버사이드 jQuery)
- **@supabase/supabase-js**: 데이터베이스 연동

### 4. API 엔드포인트
**파일**: `backend/src/routes/scraper.routes.ts`

**주요 API**:
- `POST /api/scraper/scrape/wee`: 크롤링 실행 (관리자 전용)
- `GET /api/scraper/stats`: 크롤링 통계
- `GET /api/scraper/content/:category`: 카테고리별 콘텐츠 조회
- `GET /api/scraper/institutions`: 기관 정보 조회

### 5. 프론트엔드 관리 인터페이스
**파일**: `frontend/src/pages/Admin/ScrapedContent.tsx`

**기능**:
- 크롤링 실행 버튼
- 크롤링 통계 대시보드
- 카테고리별 콘텐츠 조회
- 원본 사이트 링크

## 사용 방법

### 1. 의존성 설치
```bash
# 백엔드
cd backend
npm install axios cheerio

# 프론트엔드는 기존 의존성 사용
```

### 2. 데이터베이스 스키마 생성
```sql
-- Supabase SQL 에디터에서 실행
-- 파일: database/wee-content-schema.sql 내용 실행
```

### 3. 크롤링 실행 방법

#### A. 관리자 패널에서 실행
1. 관리자로 로그인
2. `/admin/scraped-content` 페이지 이동
3. "크롤링 시작" 버튼 클릭

#### B. API로 직접 실행
```bash
curl -X POST http://localhost:5000/api/scraper/scrape/wee \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### C. 테스트 스크립트 실행
```bash
cd backend
npx ts-node src/scrapers/test-scraper.ts --save
```

### 4. 크롤링된 데이터 조회
```bash
# 통계 조회
GET /api/scraper/stats

# 메인 페이지 콘텐츠 조회
GET /api/scraper/content/main

# 사업소개 콘텐츠 조회
GET /api/scraper/content/about

# 기관 정보 조회
GET /api/scraper/institutions?type=center&region=서울
```

## 크롤링 대상 콘텐츠

### 현재 구현된 크롤링
1. **메인 페이지**:
   - 배너 콘텐츠
   - 퀵 메뉴 링크
   - 주요 공지사항

2. **사업소개 페이지**:
   - 페이지 제목 및 주요 내용
   - 섹션별 정보

3. **기관 정보**:
   - Wee 클래스/센터/스쿨 목록
   - 지역별 분류
   - 연락처 정보

### 확장 가능한 크롤링
향후 추가할 수 있는 크롤링 대상:
- 공지사항 목록
- 뉴스레터 아카이브
- 자료실 파일 목록
- 통계 데이터

## 보안 및 권한

### 권한 관리
- 크롤링 실행: `manage_content` 권한 필요
- 데이터 조회: 일반 사용자도 가능
- 관리자 패널: `admin` 또는 `manager` 역할 필요

### 데이터 보호
- Row Level Security (RLS) 적용
- 개인정보 제외한 공개 정보만 크롤링
- 원본 사이트 출처 정보 보존

## 주의사항

### 1. 크롤링 주기
- 수동 실행 권장 (과도한 요청 방지)
- 필요시 cron job으로 자동화 가능

### 2. 에러 처리
- 네트워크 오류 시 재시도 로직 구현
- 실패한 항목 별도 로깅

### 3. 데이터 중복 방지
- `source_url` + `scraped_at`으로 중복 체크
- 기존 데이터 업데이트 vs 새로 삽입 정책 수립

## 샘플 데이터 구조

### wee_contents 테이블 예시
```json
{
  "id": "uuid",
  "title": "Wee 프로젝트 소개",
  "content": "학생들의 건강하고 즐거운 학교생활을 지원...",
  "category": "main",
  "subcategory": "banner",
  "source_url": "https://www.wee.go.kr/home/main/main.do",
  "scraped_at": "2024-06-27T12:00:00Z"
}
```

### wee_institutions 테이블 예시
```json
{
  "id": "uuid",
  "name": "서울시교육청 Wee 센터",
  "type": "center",
  "region": "서울",
  "address": "서울특별시 종로구...",
  "phone": "02-123-4567",
  "services": ["개인상담", "집단상담", "심리검사"],
  "scraped_at": "2024-06-27T12:00:00Z"
}
```

## 향후 개선 사항

1. **실시간 모니터링**: 크롤링 진행 상황 실시간 표시
2. **스케줄링**: 정기적 자동 크롤링 설정
3. **데이터 검증**: 크롤링된 데이터 품질 검사
4. **알림 시스템**: 크롤링 완료/실패 알림
5. **백업/복원**: 크롤링 데이터 백업 시스템

이 시스템을 통해 Wee 공식 웹사이트의 최신 정보를 자동으로 수집하고 관리할 수 있습니다.