# Frontend Code Summary

## 생성된 파일 (27개)

### 프로젝트 설정 (5)
- `package.json`, `tsconfig.json`, `next.config.js`, `postcss.config.js`, `src/app/globals.css`

### 공통 유틸리티 (2)
- `src/lib/api.ts` — API 클라이언트
- `src/lib/types.ts` — 공유 타입 정의

### Context (2)
- `src/contexts/AuthContext.tsx` — 인증 상태 (JWT + localStorage)
- `src/contexts/CartContext.tsx` — 장바구니 상태 (localStorage)

### Server Actions (4)
- `src/actions/auth.ts`, `src/actions/menu.ts`, `src/actions/order.ts`, `src/actions/table.ts`

### 공유 컴포넌트 (3)
- `src/components/StatusBadge.tsx`, `src/components/ConfirmDialog.tsx`, `src/components/LoadingSpinner.tsx`

### 고객용 페이지 (7)
- `src/app/layout.tsx` — 루트 레이아웃
- `src/app/page.tsx` — 홈 리다이렉트
- `src/app/customer/login/page.tsx` — 테이블 로그인
- `src/app/customer/[storeId]/[tableId]/layout.tsx` — 고객 레이아웃 (헤더+사이드바)
- `src/app/customer/[storeId]/[tableId]/page.tsx` — 메뉴 페이지
- `src/app/customer/[storeId]/[tableId]/cart/page.tsx` — 장바구니
- `src/app/customer/[storeId]/[tableId]/orders/page.tsx` — 주문 내역

### 관리자용 페이지 (3)
- `src/app/admin/login/page.tsx` — 관리자 로그인
- `src/app/admin/dashboard/page.tsx` — 대시보드 (SSE 실시간 + 모달)
- `src/app/admin/menus/page.tsx` — 메뉴 관리 (CRUD)

### 문서 (1)
- `README.md`
