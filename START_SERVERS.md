# 서버 실행 가이드

## 빠른 시작

### 1. 백엔드 서버 실행 (필수)
새 터미널을 열고 다음 명령어를 실행하세요:

```bash
cd backend
npm install  # 처음 실행하는 경우만
npm run dev
```

백엔드 서버가 성공적으로 실행되면:
- http://localhost:5000/api 에서 API 정보를 확인할 수 있습니다
- "Wee Project API" 메시지가 표시됩니다

### 2. 프론트엔드 서버 실행
다른 터미널을 열고 다음 명령어를 실행하세요:

```bash
cd frontend
npm install  # 처음 실행하는 경우만
npm run dev
```

프론트엔드가 성공적으로 실행되면:
- http://localhost:5173 에서 웹사이트에 접속할 수 있습니다

## 문제 해결

### "Route not found" 오류가 발생하는 경우
1. **백엔드 서버가 실행 중인지 확인**
   - 터미널에서 백엔드 서버 로그 확인
   - http://localhost:5000/api 접속 시도

2. **환경 변수 확인**
   - backend/.env 파일이 있는지 확인
   - SUPABASE_URL, SUPABASE_ANON_KEY 등이 설정되어 있는지 확인

3. **포트 충돌 확인**
   - 5000 포트가 이미 사용 중인 경우 다른 포트로 변경
   - backend/.env 파일에서 PORT 변경

### 백엔드 서버가 시작되지 않는 경우
1. **Node.js 버전 확인**
   ```bash
   node --version  # v16 이상 필요
   ```

2. **의존성 재설치**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript 컴파일 확인**
   ```bash
   npm run build
   ```

### Windows에서 실행하는 경우
PowerShell 또는 Command Prompt를 관리자 권한으로 실행하고:

```bash
# 백엔드
cd backend
npm run dev:windows

# 프론트엔드 (새 터미널)
cd frontend
npm run dev
```

## 서버 상태 확인

### 백엔드 API 확인
```bash
curl http://localhost:5000/api
# 또는 브라우저에서 http://localhost:5000/api 접속
```

### 헬스 체크
```bash
curl http://localhost:5000/health
# 또는 브라우저에서 http://localhost:5000/health 접속
```

## 중요 사항
- **반드시 백엔드 서버를 먼저 실행**한 후 프론트엔드를 실행하세요
- 두 서버 모두 실행 중이어야 정상적으로 작동합니다
- 서버를 종료하려면 각 터미널에서 Ctrl+C를 누르세요