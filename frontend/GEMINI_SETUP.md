# Gemini API 설정 가이드

가상 투어에서 AI 기반 대화 응답을 사용하려면 Gemini API를 설정해야 합니다.

## 설정 방법

1. **Gemini API 키 발급**
   - [Google AI Studio](https://aistudio.google.com/app/apikey) 방문
   - Google 계정으로 로그인
   - "Create API Key" 클릭
   - API 키 복사

2. **.env 파일 수정**
   ```bash
   # frontend/.env 파일 열기
   VITE_GEMINI_API_KEY=your_gemini_api_key_here  # 이 부분을 실제 API 키로 교체
   ```

3. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

## 기능

Gemini API가 설정되면:
- 캐릭터와의 대화가 더 자연스럽고 다양해집니다
- 질문에 대한 답변이 더 구체적이고 맥락에 맞게 생성됩니다
- 각 캐릭터의 성격과 역할에 맞는 개성 있는 답변을 제공합니다
- Gemini 1.5 Flash 모델을 사용하여 빠르고 효율적인 응답을 제공합니다

## 주의사항

- API 키는 절대 Git에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 프로덕션 환경에서는 환경 변수로 안전하게 관리하세요

## 문제 해결

API가 작동하지 않는 경우:
1. 콘솔에서 에러 메시지 확인
2. API 키가 올바르게 설정되었는지 확인
3. 네트워크 연결 상태 확인
4. Google AI Studio에서 API 사용량 제한 확인