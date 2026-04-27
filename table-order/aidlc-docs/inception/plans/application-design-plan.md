# Application Design Plan

## 설계 계획

### Phase 1: 컴포넌트 식별
- [x] 백엔드 컴포넌트 식별 (API 라우터, 서비스, 리포지토리, 모델)
- [x] 프론트엔드 컴포넌트 식별 (고객용 페이지, 관리자용 페이지, 공통 컴포넌트)
- [x] 공유 모듈 식별 (인증, SSE, 에러 처리)

### Phase 2: 컴포넌트 메서드 정의
- [x] 각 백엔드 서비스의 메서드 시그니처 정의
- [x] 각 리포지토리의 데이터 접근 메서드 정의
- [x] API 엔드포인트 매핑

### Phase 3: 서비스 레이어 설계
- [x] 서비스 오케스트레이션 패턴 정의
- [x] 서비스 간 통신 방식 정의

### Phase 4: 컴포넌트 의존성 정의
- [x] 의존성 매트릭스 작성
- [x] 데이터 흐름 다이어그램 작성

### Phase 5: 설계 검증
- [x] 설계 완전성 및 일관성 검증

---

## 설계 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택한 옵션의 알파벳을 입력해 주세요.

---

## Question 1
백엔드 아키텍처 패턴으로 어떤 것을 선호하십니까?

A) Layered Architecture — Router → Service → Repository → Model (전통적 계층형)
B) Clean Architecture — UseCase 중심, 의존성 역전 원칙 적용
C) Simple MVC — 간단한 Controller → Model 구조
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
FastAPI 백엔드의 Python ORM으로 어떤 것을 사용하시겠습니까?

A) SQLAlchemy (동기) — 가장 널리 사용, 풍부한 생태계
B) SQLAlchemy + asyncio (비동기) — 비동기 지원, FastAPI와 자연스러운 통합
C) Tortoise ORM — 비동기 네이티브, Django ORM 스타일
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
프론트엔드(Next.js)의 상태 관리 방식은 어떻게 하시겠습니까?

A) React Context + useReducer (내장 기능만 사용, 간단)
B) Zustand (경량 상태 관리 라이브러리)
C) Redux Toolkit (대규모 상태 관리)
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
프론트엔드에서 서버 데이터 페칭 방식은 어떻게 하시겠습니까?

A) React Query (TanStack Query) — 서버 상태 캐싱, 자동 리페칭
B) SWR — Vercel 제공, 경량 데이터 페칭
C) Next.js Server Actions + fetch — Next.js 내장 기능 활용
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5
관리자 역할 구분(매니저/직원)에서 권한 차이는 어떻게 설정하시겠습니까?

A) 매니저: 모든 기능 접근 / 직원: 주문 모니터링 + 상태 변경만
B) 매니저: 모든 기능 접근 / 직원: 주문 모니터링만 (상태 변경 불가)
C) 매니저: 메뉴 관리 + 테이블 관리 + 주문 / 직원: 주문 모니터링 + 테이블 이용완료만
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6
API 설계 스타일은 어떻게 하시겠습니까?

A) RESTful API — 리소스 기반 URL, HTTP 메서드 활용
B) RESTful API + OpenAPI/Swagger 자동 문서화 (FastAPI 기본 제공)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 7
고객용과 관리자용 프론트엔드 구조는 어떻게 분리하시겠습니까?

A) 단일 Next.js 앱 내 라우트 분리 (/customer/*, /admin/*)
B) 별도 Next.js 앱 2개 (customer-app, admin-app)
C) 단일 Next.js 앱 + 레이아웃 분리 (동일 앱, 다른 레이아웃)
D) Other (please describe after [Answer]: tag below)

[Answer]: 
