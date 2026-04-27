# Component Dependencies

## 의존성 매트릭스

### 백엔드 의존성

| Component | Depends On |
|-----------|-----------|
| Auth Controller | AuthService, Models |
| Menu Controller | Models |
| Order Controller | OrderService, TableSessionService, Models |
| Table Controller | TableSessionService, Models |
| SSE Controller | SSEManager |
| AuthService | Models (Admin, Store), JWT library, bcrypt |
| OrderService | Models (Order, OrderItem, MenuItem), SSEManager |
| TableSessionService | Models (Table, TableSession, Order, OrderHistory), SSEManager |
| SSEManager | (독립 — 인메모리 연결 관리) |
| Models | SQLAlchemy, MySQL |

### 프론트엔드 의존성

| Component | Depends On |
|-----------|-----------|
| Customer - Menu Page | Cart Context, Server Actions (fetchMenus, fetchCategories) |
| Customer - Cart | Cart Context, Server Actions (createOrder) |
| Customer - Order Confirmation | Cart Context |
| Customer - Order History | Auth Context, Server Actions (fetchOrders) |
| Customer - Table Login | Auth Context, Server Actions (loginTable) |
| Admin - Login Page | Auth Context, Server Actions (loginAdmin) |
| Admin - Dashboard | Auth Context, SSE (EventSource), Server Actions (updateOrderStatus) |
| Admin - Table Management | Auth Context, Server Actions (completeTable, deleteOrder, fetchTableHistory) |
| Admin - Menu Management | Auth Context, Server Actions (createMenu, updateMenu, deleteMenu, reorderMenus) |
| Auth Context | localStorage (JWT 토큰 저장) |
| Cart Context | localStorage (장바구니 저장) |

---

## 데이터 흐름

```
+------------------+     HTTP/REST      +------------------+     SQLAlchemy     +-------+
|                  | -----------------> |                  | -----------------> |       |
|   Next.js App    |                    |   FastAPI Server |                    | MySQL |
|                  | <----------------- |                  | <----------------- |       |
| - Customer Pages |     JSON Response  | - Controllers    |     ORM Query      |       |
| - Admin Pages    |                    | - Services       |                    |       |
| - Server Actions |     SSE Stream     | - Models         |                    |       |
|                  | <================= | - SSEManager     |                    |       |
+------------------+                    +------------------+                    +-------+
```

### 주문 생성 흐름
```
Customer UI → Server Action (createOrder) → POST /api/orders
  → Order Controller → OrderService
    → 메뉴 유효성 검증 (MenuItem Model)
    → 세션 확인/시작 (TableSessionService)
    → 주문 저장 (Order, OrderItem Model)
    → SSE 이벤트 발행 (SSEManager → Admin Dashboard)
  → 응답 반환 → Customer UI (주문 번호 표시)
```

### 이용 완료 흐름
```
Admin UI → Server Action (completeTable) → POST /api/tables/{id}/complete
  → Table Controller → TableSessionService
    → 현재 세션 주문 → OrderHistory로 이동
    → 테이블 현재 주문/총액 리셋
    → 세션 종료
    → SSE 이벤트 발행 (SSEManager → Admin Dashboard)
  → 응답 반환 → Admin UI (테이블 리셋 반영)
```
