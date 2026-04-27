# NFR Design Plan

## 설계 계획

### Phase 1: 보안 패턴 설계
- [ ] JWT 미들웨어 설계
- [ ] 역할 기반 접근 제어 데코레이터 설계
- [ ] 로그인 시도 제한 구현 패턴

### Phase 2: 성능 패턴 설계
- [ ] DB 커넥션 풀 설정
- [ ] SSE 연결 관리 패턴

### Phase 3: 로깅/에러 처리 패턴
- [ ] 구조화된 로깅 미들웨어 설계
- [ ] 전역 에러 핸들러 설계

### Phase 4: 논리적 컴포넌트 정의
- [ ] 미들웨어 체인 정의
- [ ] 크로스커팅 관심사 정리

---

## NFR Design 질문

아래 질문에 답변해 주세요.

---

## Question 1
JWT 토큰 저장 방식 (프론트엔드)은 어떻게 하시겠습니까?

A) localStorage에 저장 + Authorization 헤더로 전송 (간단, XSS 취약)
B) httpOnly 쿠키로 저장 (XSS 방어, CSRF 고려 필요)
C) MVP에서는 localStorage, 향후 httpOnly 쿠키로 전환
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
에러 응답에 스택 트레이스를 포함하시겠습니까?

A) 개발 환경에서만 포함, 프로덕션에서는 제외
B) 항상 제외 (보안 우선)
C) 항상 포함 (디버깅 편의)
D) Other (please describe after [Answer]: tag below)

[Answer]: 
