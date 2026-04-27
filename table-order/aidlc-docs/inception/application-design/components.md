# Components

## 백엔드 컴포넌트 (FastAPI)

### BE-01: Auth Controller
- **목적**: 인증/인가 처리
- **책임**: 관리자 로그인, 테이블 로그인, JWT 토큰 발급/검증, 역할 기반 접근 제어
- **인터페이스**: REST API (`/api/auth/*`)

### BE-02: Menu Controller
- **목적**: 메뉴 CRUD 관리
- **책임**: 메뉴 조회(카테고리별), 등록, 수정, 삭제, 노출 순서 조정
- **인터페이스**: REST API (`/api/menus/*`, `/api/categories/*`)

### BE-03: Order Controller
- **목적**: 주문 처리
- **책임**: 주문 생성, 주문 조회(테이블 세션별), 주문 상태 변경, 주문 삭제
- **인터페이스**: REST API (`/api/orders/*`)

### BE-04: Table Controller
- **목적**: 테이블 및 세션 관리
- **책임**: 테이블 초기 설정, 세션 시작/종료(이용 완료), 과거 내역 조회
- **인터페이스**: REST API (`/api/tables/*`)

### BE-05: SSE Controller
- **목적**: 실시간 이벤트 스트리밍
- **책임**: 주문 이벤트 SSE 스트림 제공 (관리자용)
- **인터페이스**: SSE endpoint (`/api/sse/orders`)

### BE-06: Models
- **목적**: 데이터베이스 모델 정의
- **책임**: SQLAlchemy ORM 모델 (Store, Admin, Table, TableSession, Category, MenuItem, Order, OrderItem, OrderHistory)

### BE-07: Database
- **목적**: 데이터베이스 연결 및 세션 관리
- **책임**: MySQL 연결, SQLAlchemy 세션 팩토리, 마이그레이션

---

## 프론트엔드 컴포넌트 (Next.js)

### FE-01: Customer - Menu Page
- **목적**: 고객 메뉴 조회 화면 (기본 화면)
- **책임**: 카테고리별 메뉴 표시, 카드 레이아웃, 장바구니 추가
- **경로**: `/customer/[storeId]/[tableId]`

### FE-02: Customer - Cart
- **목적**: 장바구니 관리
- **책임**: 메뉴 추가/삭제, 수량 조절, 총 금액 계산, localStorage 저장
- **경로**: `/customer/[storeId]/[tableId]/cart`

### FE-03: Customer - Order Confirmation
- **목적**: 주문 확정 및 결과 표시
- **책임**: 주문 확정, 성공 시 주문번호 표시 + 5초 후 리다이렉트, 실패 시 에러 표시

### FE-04: Customer - Order History
- **목적**: 현재 세션 주문 내역 조회
- **책임**: 주문 목록 표시 (시간순), 상태 표시
- **경로**: `/customer/[storeId]/[tableId]/orders`

### FE-05: Customer - Table Login
- **목적**: 테이블 초기 설정 화면
- **책임**: 매장 ID, 테이블 번호, 비밀번호 입력 → 자동 로그인 설정
- **경로**: `/customer/login`

### FE-06: Admin - Login Page
- **목적**: 관리자 로그인
- **책임**: 매장 식별자, 사용자명, 비밀번호 입력
- **경로**: `/admin/login`

### FE-07: Admin - Dashboard (Order Monitor)
- **목적**: 실시간 주문 모니터링 대시보드
- **책임**: 테이블별 그리드 카드, SSE 실시간 업데이트, 주문 상태 변경, 신규 주문 강조
- **경로**: `/admin/dashboard`

### FE-08: Admin - Table Management
- **목적**: 테이블 관리
- **책임**: 테이블 설정, 주문 삭제, 이용 완료 처리, 과거 내역 조회
- **경로**: `/admin/tables`

### FE-09: Admin - Menu Management
- **목적**: 메뉴 관리
- **책임**: 메뉴 CRUD, 카테고리 관리, 노출 순서 조정
- **경로**: `/admin/menus`

### FE-10: Shared - Auth Context
- **목적**: 인증 상태 관리 (React Context)
- **책임**: JWT 토큰 저장/갱신, 로그인 상태, 역할 정보

### FE-11: Shared - Cart Context
- **목적**: 장바구니 상태 관리 (React Context)
- **책임**: 장바구니 아이템, 수량, 총 금액, localStorage 동기화
