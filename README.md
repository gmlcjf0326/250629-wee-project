# 위(Wee) 프로젝트 홈페이지

## 프로젝트 개요
위(Wee) 프로젝트 홈페이지 전환 사업의 구현 프로젝트입니다.

- **주관기관**: 한국청소년정책연구원
- **사업기간**: 계약일 ~ 2025.12.31
- **목적**: 기존 위(Wee) 프로젝트 홈페이지를 클라우드 환경으로 전환하고 현대적인 UI/UX로 개선

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- React Router v6 (라우팅)
- Axios (API 통신)
- React Query (상태 관리)

### Backend (예정)
- Node.js + Express
- TypeScript
- Supabase (1-4단계)
- PostgreSQL (5단계)

## 프로젝트 구조
```
wee-project/
├── frontend/          # React 프론트엔드
├── backend/           # Express 백엔드 (예정)
├── docker/            # Docker 설정 (예정)
└── docs/              # 프로젝트 문서
    ├── 계획문서.md
    └── 히스토리.md
```

## 시작하기

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn

### Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

개발 서버가 http://localhost:5173 에서 실행됩니다.

### 빌드
```bash
cd frontend
npm run build
```

## 개발 단계
1. **1단계**: 기본 구조 및 핵심 기능 구현 ✅
2. **2단계**: 백엔드 API 및 데이터베이스 연동
3. **3단계**: Supabase 통합 및 설문조사 시스템 구축
4. **4단계**: 인증 시스템 및 관리자 기능
5. **5단계**: 프로덕션 배포 및 최적화

## 주요 기능
- 사업소개 (소개, 추진체계, 연혁, 조직, BI)
- 기관찾기 (이용안내, FAQ)
- 자료실 (매뉴얼, 프로그램 자료, 우수사례집)
- 뉴스레터
- 알림 (공지사항, 설문조사)

## 문의
- 담당자: 이정민 부연구위원 (044-415-2242)
- 담당자: 주예찬 위촉연구원 (044-415-2157)#   2 5 0 6 2 9 - w e e - p r o j e c t  
 