# Frontend Components — Unit 2: Frontend

## 설계 결정 요약
- **스타일링**: Tailwind CSS
- **주문 상세 보기**: 모달/다이얼로그 팝업
- **장바구니 접근**: 상단 헤더 아이콘 + 수량 배지
- **카테고리 네비게이션**: 좌측 사이드바 고정 메뉴

---

## 1. 페이지 레이아웃 구조

### 고객용 레이아웃 (`/customer/*`)
```
+--------------------------------------------------+
| Header: 매장명 | [주문내역] [장바구니 🛒 (3)]     |
+----------+---------------------------------------+
| Category | Menu Cards Grid                       |
| Sidebar  |                                       |
|          | [카드] [카드] [카드]                   |
| - 전체   | [카드] [카드] [카드]                   |
| - 메인   |                                       |
| - 사이드 |                                       |
| - 음료   |                                       |
+----------+---------------------------------------+
```

### 관리자용 레이아웃 (`/admin/*`)
```
+--------------------------------------------------+
| Header: 매장명 | [대시보드] [메뉴관리] [로그아웃]  |
+--------------------------------------------------+
| Dashboard: Table Grid                            |
|                                                  |
| [Table 1 Card] [Table 2 Card] [Table 3 Card]    |
| [Table 4 Card] [Table 5 Card] ...               |
|                                                  |
+--------------------------------------------------+
```

---

## 2. 컴포넌트 계층

### 고객용 컴포넌트

#### CustomerLayout
- **Props**: `{storeId, tableId, storeName}`
- **책임**: 헤더 + 사이드바 + 콘텐츠 영역 레이아웃
- **자식**: Header, CategorySidebar, children(페이지 콘텐츠)

#### Header (고객용)
- **Props**: `{storeName, cartItemCount, storeId, tableId}`
- **책임**: 매장명 표시, 주문내역/장바구니 링크
- **장바구니 배지**: cartItemCount > 0일 때 수량 표시

#### CategorySidebar
- **Props**: `{categories, selectedCategoryId, onSelect}`
- **책임**: 카테고리 목록 표시, 선택 시 메뉴 필터링
- **상태**: 선택된 카테고리 하이라이트

#### MenuGrid
- **Props**: `{menuItems}`
- **책임**: 메뉴 카드 그리드 레이아웃 (반응형)

#### MenuCard
- **Props**: `{menuItem, onAddToCart}`
- **책임**: 메뉴 이미지, 이름, 가격, 설명 표시 + 장바구니 추가 버튼
- **UI**: 카드 형태, 최소 44x44px 터치 영역

#### CartPage
- **Props**: (Cart Context에서 상태 소비)
- **책임**: 장바구니 아이템 목록, 수량 조절, 삭제, 총 금액, 주문하기 버튼
- **자식**: CartItem, OrderSummary

#### CartItem
- **Props**: `{item, onUpdateQuantity, onRemove}`
- **책임**: 개별 장바구니 아이템 표시, 수량 +/- 버튼

#### OrderConfirmation
- **Props**: `{orderNumber}`
- **책임**: 주문 성공 시 주문번호 표시, 5초 카운트다운 후 메뉴 페이지 리다이렉트

#### OrderHistoryPage
- **Props**: (Server Action으로 데이터 페칭)
- **책임**: 현재 세션 주문 목록 (시간순), 상태 배지 표시

#### TableLoginPage
- **Props**: none
- **책임**: 매장 식별자, 테이블 번호, 비밀번호 입력 폼
- **동작**: 로그인 성공 시 정보 localStorage 저장 + 메뉴 페이지 리다이렉트

### 관리자용 컴포넌트

#### AdminLayout
- **Props**: `{storeName, role}`
- **책임**: 헤더 + 네비게이션 + 콘텐츠 영역
- **네비게이션**: 대시보드, 메뉴관리 (매니저만: 테이블관리)

#### DashboardPage
- **Props**: (SSE로 실시간 데이터 수신)
- **책임**: 테이블별 그리드 카드, 필터링
- **자식**: TableCard, OrderDetailModal

#### TableCard
- **Props**: `{table, orders, totalAmount, onCardClick}`
- **책임**: 테이블 번호, 총 주문액, 최신 주문 미리보기 (최대 3개)
- **강조**: 신규 주문 시 2초간 하이라이트 애니메이션

#### OrderDetailModal
- **Props**: `{table, orders, isOpen, onClose, onStatusChange, onDelete, onComplete}`
- **책임**: 전체 주문 목록 상세, 상태 변경 버튼, 삭제 버튼 (매니저), 이용 완료 버튼 (매니저)
- **확인 팝업**: 삭제/이용완료 시 확인 다이얼로그

#### MenuManagementPage
- **Props**: (Server Action으로 데이터 페칭)
- **책임**: 메뉴 CRUD, 카테고리 관리, 순서 조정
- **자식**: MenuForm, CategoryForm

#### MenuForm
- **Props**: `{menu?, onSubmit, onCancel}`
- **책임**: 메뉴 등록/수정 폼 (이름, 가격, 설명, 카테고리, 이미지 URL)
- **검증**: 필수 필드, 가격 ≥ 0

#### ConfirmDialog
- **Props**: `{title, message, isOpen, onConfirm, onCancel}`
- **책임**: 삭제/이용완료 등 위험 작업 확인 팝업

### 공유 컴포넌트

#### StatusBadge
- **Props**: `{status: 'pending'|'preparing'|'completed'}`
- **책임**: 주문 상태 색상 배지 (대기중: 노랑, 준비중: 파랑, 완료: 초록)

#### LoadingSpinner
- **Props**: `{size?}`
- **책임**: 로딩 상태 표시

#### ErrorMessage
- **Props**: `{message, onRetry?}`
- **책임**: 에러 메시지 표시 + 재시도 버튼

---

## 3. 상태 관리

### AuthContext
```typescript
interface AuthState {
  token: string | null;
  userType: 'admin' | 'table' | null;
  storeId: number | null;
  tableId: number | null;
  sessionId: number | null;
  role: 'manager' | 'staff' | null;
  storeName: string | null;
}

// Actions
type AuthAction =
  | { type: 'LOGIN_ADMIN'; payload: { token, storeId, role, storeName } }
  | { type: 'LOGIN_TABLE'; payload: { token, storeId, tableId, sessionId, storeName } }
  | { type: 'UPDATE_SESSION'; payload: { sessionId } }
  | { type: 'LOGOUT' };

// 저장: localStorage (브라우저 새로고침 시 유지)
// 만료: JWT exp 체크 → 만료 시 자동 LOGOUT
```

### CartContext
```typescript
interface CartItem {
  menuId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { menuId } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuId, quantity } }
  | { type: 'CLEAR_CART' };

// 저장: localStorage (키: cart_{storeId}_{tableId})
// 주문 확정 시: CLEAR_CART
```

### SSE 연결 (관리자 대시보드)
```typescript
// useSSE 커스텀 훅
// - EventSource 연결: /api/sse/orders?store_id={storeId}
// - Authorization 헤더: JWT 토큰
// - 이벤트 수신: new_order, order_status_changed, order_deleted, table_completed
// - 자동 재연결: 연결 끊김 시 3초 후 재시도
// - 컴포넌트 언마운트 시 연결 해제
```

---

## 4. 사용자 인터랙션 흐름

### 고객 주문 흐름
```
TableLogin → (자동 로그인 or 수동 입력)
  → Menu Page (기본 화면)
    → 카테고리 선택 (사이드바)
    → 메뉴 카드 탭 → 장바구니 추가 (토스트 알림)
    → 헤더 장바구니 아이콘 탭
  → Cart Page
    → 수량 조절 / 삭제
    → "주문하기" 버튼
    → 주문 확인 다이얼로그
    → Server Action: createOrder
  → Order Confirmation (5초 카운트다운)
  → Menu Page (자동 리다이렉트)
```

### 관리자 주문 관리 흐름
```
Admin Login → Dashboard
  → SSE 연결 (실시간 주문 수신)
  → 테이블 카드 그리드 표시
  → 신규 주문 → 카드 하이라이트 애니메이션
  → 카드 클릭 → OrderDetailModal
    → 상태 변경 (pending ↔ preparing → completed)
    → 주문 삭제 (매니저만, 확인 팝업)
    → 이용 완료 (매니저만, 확인 팝업)
  → 모달 닫기 → 대시보드 복귀
```

---

## 5. 클라이언트 측 검증

| 폼 | 필드 | 검증 규칙 |
|----|------|-----------|
| 테이블 로그인 | 매장 식별자 | 필수, 공백 불가 |
| 테이블 로그인 | 테이블 번호 | 필수, 양의 정수 |
| 테이블 로그인 | 비밀번호 | 필수 |
| 관리자 로그인 | 매장 식별자 | 필수, 공백 불가 |
| 관리자 로그인 | 사용자명 | 필수, 공백 불가 |
| 관리자 로그인 | 비밀번호 | 필수 |
| 메뉴 등록/수정 | 메뉴명 | 필수, 1~100자 |
| 메뉴 등록/수정 | 가격 | 필수, 0 이상 정수 |
| 메뉴 등록/수정 | 카테고리 | 필수 선택 |
| 메뉴 등록/수정 | 설명 | 선택, 최대 1000자 |
| 메뉴 등록/수정 | 이미지 URL | 선택, URL 형식 |
| 장바구니 | 수량 | 1~99 정수 |
