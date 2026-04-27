# Application Design — 테이블오더 서비스

## 설계 결정 요약

| 항목 | 결정 |
|------|------|
| 백엔드 아키텍처 | Simple MVC (Controller → Service → Model) |
| ORM | SQLAlchemy (동기) |
| 프론트엔드 상태 관리 | React Context + useReducer |
| 데이터 페칭 | Next.js Server Actions + fetch |
| 관리자 권한 | 매니저: 전체 / 직원: 주문 모니터링 + 상태 변경 |
| API 스타일 | RESTful + OpenAPI/Swagger (FastAPI 기본 제공) |
| 프론트엔드 구조 | 단일 Next.js 앱 라우트 분리 (/customer/*, /admin/*) |

---

## 시스템 아키텍처 개요

```
+------------------+     HTTP/REST      +------------------+     SQLAlchemy     +-------+
|                  | -----------------> |                  | -----------------> |       |
|   Next.js App    |                    |   FastAPI Server |                    | MySQL |
|                  | <----------------- |                  | <----------------- |       |
| /customer/*      |     JSON Response  | /api/auth/*      |     ORM Query      |       |
| /admin/*         |                    | /api/menus/*     |                    |       |
|                  |     SSE Stream     | /api/orders/*    |                    |       |
|                  | <================= | /api/tables/*    |                    |       |
|                  |                    | /api/sse/*       |                    |       |
+------------------+                    +------------------+                    +-------+
```

---

## 컴포넌트 구성

### 백엔드 (FastAPI) — 7개 컴포넌트
- **Auth Controller**: 관리자/테이블 인증, JWT 발급
- **Menu Controller**: 메뉴 CRUD, 카테고리 관리
- **Order Controller**: 주문 생성/조회/상태변경/삭제
- **Table Controller**: 테이블 설정, 세션 관리, 이용 완료
- **SSE Controller**: 실시간 주문 이벤트 스트림
- **Models**: SQLAlchemy ORM 모델 (9개 엔티티)
- **Database**: MySQL 연결, 세션 관리

### 프론트엔드 (Next.js) — 11개 컴포넌트
- **고객용 (5개)**: Table Login, Menu Page, Cart, Order Confirmation, Order History
- **관리자용 (4개)**: Login, Dashboard, Table Management, Menu Management
- **공유 (2개)**: Auth Context, Cart Context

### 서비스 레이어 — 4개 서비스
- **AuthService**: 인증/인가, JWT, bcrypt, 로그인 제한
- **OrderService**: 주문 처리, 금액 계산, 상태 전이, SSE 이벤트 발행
- **TableSessionService**: 세션 라이프사이클, 이용 완료, 이력 이동
- **SSEManager**: SSE 연결 관리, 이벤트 브로드캐스트

---

## API 엔드포인트 요약

| Group | Endpoints | Auth |
|-------|-----------|------|
| Auth | 3개 (admin login, table login, me) | Public / JWT |
| Menu | 7개 (CRUD + reorder + categories) | Public(조회) / Admin(관리) |
| Order | 5개 (create, list, detail, status, delete) | Table(생성/조회) / Admin(상태/삭제) |
| Table | 4개 (create, list, complete, history) | Admin |
| SSE | 1개 (order stream) | Admin |

**총 20개 API 엔드포인트**

---

## 역할 기반 접근 제어

| 기능 | 매니저 | 직원 |
|------|--------|------|
| 주문 모니터링 | ✅ | ✅ |
| 주문 상태 변경 | ✅ | ✅ |
| 주문 삭제 | ✅ | ❌ |
| 메뉴 관리 | ✅ | ❌ |
| 테이블 관리 | ✅ | ❌ |
| 이용 완료 처리 | ✅ | ❌ |
| 과거 내역 조회 | ✅ | ❌ |

---

## 상세 설계 문서

- [components.md](components.md) — 컴포넌트 정의 및 책임
- [component-methods.md](component-methods.md) — 메서드 시그니처 및 API 엔드포인트
- [services.md](services.md) — 서비스 정의 및 오케스트레이션
- [component-dependency.md](component-dependency.md) — 의존성 및 데이터 흐름
