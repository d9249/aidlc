# Unit of Work

## 분해 전략
- **접근**: 기술 계층별 분해 (2개 유닛)
- **개발 순서**: 수직 슬라이스 — 주문 흐름 먼저 → 나머지 기능 추가
- **DB 관리**: 백엔드 유닛에 포함

---

## Unit 1: Backend (table-order-backend)

### 개요
- **유형**: FastAPI REST API 서버
- **기술**: Python, FastAPI, SQLAlchemy, MySQL, Alembic
- **책임**: 모든 비즈니스 로직, 데이터 접근, 인증, SSE

### 포함 컴포넌트
- Auth Controller (BE-01)
- Menu Controller (BE-02)
- Order Controller (BE-03)
- Table Controller (BE-04)
- SSE Controller (BE-05)
- Models (BE-06)
- Database (BE-07)
- AuthService (SVC-01)
- OrderService (SVC-02)
- TableSessionService (SVC-03)
- SSEManager (SVC-04)

### 개발 슬라이스 순서
1. **Slice 1 — 핵심 주문 흐름**: Models(Store, Table, TableSession, Category, MenuItem, Order, OrderItem) + Menu Controller(조회) + Order Controller(생성/조회) + Auth Controller(테이블 로그인) + DB 설정
2. **Slice 2 — 관리자 기능**: Auth Controller(관리자 로그인) + Order Controller(상태변경/삭제) + Table Controller(이용완료/과거내역) + SSE Controller + Admin 모델
3. **Slice 3 — 메뉴 관리**: Menu Controller(CRUD/순서변경) + Category CRUD + OrderHistory 모델
4. **Slice 4 — 보안/마무리**: 로그인 시도 제한, 역할 기반 접근 제어, 입력 검증

---

## Unit 2: Frontend (table-order-frontend)

### 개요
- **유형**: Next.js 웹 애플리케이션
- **기술**: Next.js, React, TypeScript, Server Actions
- **책임**: 고객용 UI + 관리자용 UI, 상태 관리, SSE 수신

### 포함 컴포넌트
- Customer - Table Login (FE-05)
- Customer - Menu Page (FE-01)
- Customer - Cart (FE-02)
- Customer - Order Confirmation (FE-03)
- Customer - Order History (FE-04)
- Admin - Login Page (FE-06)
- Admin - Dashboard (FE-07)
- Admin - Table Management (FE-08)
- Admin - Menu Management (FE-09)
- Auth Context (FE-10)
- Cart Context (FE-11)

### 개발 슬라이스 순서
1. **Slice 1 — 핵심 주문 흐름**: Table Login + Menu Page + Cart + Order Confirmation + Auth Context + Cart Context
2. **Slice 2 — 관리자 기능**: Admin Login + Dashboard(SSE 실시간 모니터링) + Table Management(이용완료/주문삭제)
3. **Slice 3 — 나머지 기능**: Order History(고객) + Menu Management(관리자) + 과거 내역 조회
4. **Slice 4 — UI 마무리**: 반응형 레이아웃, 에러 처리, 로딩 상태, 접근성

---

## 코드 구조 (Greenfield)

```
table-order/                          # 워크스페이스 루트
├── backend/                          # Unit 1: Backend
│   ├── app/
│   │   ├── main.py                   # FastAPI 앱 진입점
│   │   ├── config.py                 # 설정
│   │   ├── database.py               # DB 연결/세션
│   │   ├── models/                   # SQLAlchemy 모델
│   │   │   ├── store.py
│   │   │   ├── admin.py
│   │   │   ├── table.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   └── order_history.py
│   │   ├── controllers/              # API 라우터
│   │   │   ├── auth.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   ├── table.py
│   │   │   └── sse.py
│   │   ├── services/                 # 비즈니스 로직
│   │   │   ├── auth_service.py
│   │   │   ├── order_service.py
│   │   │   ├── table_session_service.py
│   │   │   └── sse_manager.py
│   │   └── schemas/                  # Pydantic 스키마
│   │       ├── auth.py
│   │       ├── menu.py
│   │       ├── order.py
│   │       └── table.py
│   ├── alembic/                      # DB 마이그레이션
│   ├── tests/                        # 테스트
│   ├── requirements.txt
│   └── alembic.ini
├── frontend/                         # Unit 2: Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── customer/             # 고객용 라우트
│   │   │   │   ├── login/
│   │   │   │   └── [storeId]/[tableId]/
│   │   │   │       ├── page.tsx      # 메뉴 (기본)
│   │   │   │       ├── cart/
│   │   │   │       └── orders/
│   │   │   ├── admin/                # 관리자용 라우트
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── tables/
│   │   │   │   └── menus/
│   │   │   └── layout.tsx
│   │   ├── contexts/                 # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── actions/                  # Server Actions
│   │   ├── components/               # 공유 UI 컴포넌트
│   │   └── lib/                      # 유틸리티
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
├── aidlc-docs/                       # 문서 (코드 아님)
└── requirements/                     # 요구사항 원본
```
