# Component Methods

## 백엔드 API 엔드포인트 및 메서드

### BE-01: Auth Controller

| Method | Endpoint | Purpose | Input | Output |
|--------|----------|---------|-------|--------|
| POST | `/api/auth/admin/login` | 관리자 로그인 | `{store_id, username, password}` | `{access_token, role}` |
| POST | `/api/auth/table/login` | 테이블 로그인 | `{store_id, table_number, password}` | `{access_token, table_id, session_id}` |
| GET | `/api/auth/me` | 현재 인증 정보 조회 | JWT header | `{user_info, role}` |

### BE-02: Menu Controller

| Method | Endpoint | Purpose | Input | Output |
|--------|----------|---------|-------|--------|
| GET | `/api/categories` | 카테고리 목록 조회 | `store_id` (query) | `Category[]` |
| GET | `/api/menus` | 메뉴 목록 조회 | `store_id, category_id?` (query) | `MenuItem[]` |
| GET | `/api/menus/{menu_id}` | 메뉴 상세 조회 | `menu_id` (path) | `MenuItem` |
| POST | `/api/menus` | 메뉴 등록 | `{name, price, description, category_id, image_url}` | `MenuItem` |
| PUT | `/api/menus/{menu_id}` | 메뉴 수정 | `{name?, price?, description?, category_id?, image_url?}` | `MenuItem` |
| DELETE | `/api/menus/{menu_id}` | 메뉴 삭제 | `menu_id` (path) | `{success}` |
| PUT | `/api/menus/reorder` | 메뉴 순서 변경 | `{menu_ids: int[]}` | `{success}` |
| POST | `/api/categories` | 카테고리 등록 | `{name, sort_order}` | `Category` |
| PUT | `/api/categories/{category_id}` | 카테고리 수정 | `{name?, sort_order?}` | `Category` |
| DELETE | `/api/categories/{category_id}` | 카테고리 삭제 | `category_id` (path) | `{success}` |

### BE-03: Order Controller

| Method | Endpoint | Purpose | Input | Output |
|--------|----------|---------|-------|--------|
| POST | `/api/orders` | 주문 생성 | `{store_id, table_id, session_id, items: [{menu_id, quantity}]}` | `Order` |
| GET | `/api/orders` | 주문 목록 조회 | `store_id, table_id?, session_id?` (query) | `Order[]` |
| GET | `/api/orders/{order_id}` | 주문 상세 조회 | `order_id` (path) | `Order` |
| PATCH | `/api/orders/{order_id}/status` | 주문 상태 변경 | `{status: "pending"\|"preparing"\|"completed"}` | `Order` |
| DELETE | `/api/orders/{order_id}` | 주문 삭제 (관리자) | `order_id` (path) | `{success}` |

### BE-04: Table Controller

| Method | Endpoint | Purpose | Input | Output |
|--------|----------|---------|-------|--------|
| POST | `/api/tables` | 테이블 등록/설정 | `{store_id, table_number, password}` | `Table` |
| GET | `/api/tables` | 테이블 목록 조회 | `store_id` (query) | `Table[]` |
| POST | `/api/tables/{table_id}/complete` | 이용 완료 처리 | `table_id` (path) | `{success}` |
| GET | `/api/tables/{table_id}/history` | 과거 주문 내역 | `table_id, date?` (query) | `OrderHistory[]` |

### BE-05: SSE Controller

| Method | Endpoint | Purpose | Input | Output |
|--------|----------|---------|-------|--------|
| GET | `/api/sse/orders` | 주문 실시간 스트림 | `store_id` (query), JWT header | SSE stream |

---

## 프론트엔드 Server Actions

### Customer Actions

| Action | Purpose | Input | Output |
|--------|---------|-------|--------|
| `loginTable` | 테이블 로그인 | `{storeId, tableNumber, password}` | `{token, tableId, sessionId}` |
| `fetchMenus` | 메뉴 목록 조회 | `{storeId, categoryId?}` | `MenuItem[]` |
| `fetchCategories` | 카테고리 조회 | `{storeId}` | `Category[]` |
| `createOrder` | 주문 생성 | `{storeId, tableId, sessionId, items}` | `Order` |
| `fetchOrders` | 주문 내역 조회 | `{storeId, tableId, sessionId}` | `Order[]` |

### Admin Actions

| Action | Purpose | Input | Output |
|--------|---------|-------|--------|
| `loginAdmin` | 관리자 로그인 | `{storeId, username, password}` | `{token, role}` |
| `updateOrderStatus` | 주문 상태 변경 | `{orderId, status}` | `Order` |
| `deleteOrder` | 주문 삭제 | `{orderId}` | `{success}` |
| `completeTable` | 이용 완료 | `{tableId}` | `{success}` |
| `fetchTableHistory` | 과거 내역 | `{tableId, date?}` | `OrderHistory[]` |
| `createMenu` | 메뉴 등록 | `MenuItem` | `MenuItem` |
| `updateMenu` | 메뉴 수정 | `MenuItem` | `MenuItem` |
| `deleteMenu` | 메뉴 삭제 | `{menuId}` | `{success}` |
| `reorderMenus` | 메뉴 순서 변경 | `{menuIds}` | `{success}` |
