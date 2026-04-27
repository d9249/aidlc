# Code Generation Plan — Unit 2: Frontend

## Unit Context
- **유닛**: Frontend (table-order-frontend)
- **기술**: Next.js 15+, React 19+, TypeScript, Tailwind CSS 4+
- **위치**: `frontend/` (워크스페이스 루트 기준)

## 코드 생성 단계

### Step 1: 프로젝트 설정
- [ ] `frontend/package.json`
- [ ] `frontend/tsconfig.json`
- [ ] `frontend/next.config.js`
- [ ] `frontend/tailwind.config.ts`
- [ ] `frontend/postcss.config.js`

### Step 2: 공통 유틸리티 및 타입
- [ ] `frontend/src/lib/api.ts` — API 클라이언트
- [ ] `frontend/src/lib/types.ts` — 공유 타입 정의

### Step 3: Context (상태 관리)
- [ ] `frontend/src/contexts/AuthContext.tsx`
- [ ] `frontend/src/contexts/CartContext.tsx`

### Step 4: Server Actions
- [ ] `frontend/src/actions/auth.ts`
- [ ] `frontend/src/actions/menu.ts`
- [ ] `frontend/src/actions/order.ts`
- [ ] `frontend/src/actions/table.ts`

### Step 5: 공유 UI 컴포넌트
- [ ] `frontend/src/components/StatusBadge.tsx`
- [ ] `frontend/src/components/ConfirmDialog.tsx`
- [ ] `frontend/src/components/LoadingSpinner.tsx`

### Step 6: 고객용 페이지
- [ ] `frontend/src/app/layout.tsx` — 루트 레이아웃
- [ ] `frontend/src/app/page.tsx` — 홈 리다이렉트
- [ ] `frontend/src/app/customer/login/page.tsx`
- [ ] `frontend/src/app/customer/[storeId]/[tableId]/layout.tsx`
- [ ] `frontend/src/app/customer/[storeId]/[tableId]/page.tsx` — 메뉴
- [ ] `frontend/src/app/customer/[storeId]/[tableId]/cart/page.tsx`
- [ ] `frontend/src/app/customer/[storeId]/[tableId]/orders/page.tsx`

### Step 7: 관리자용 페이지
- [ ] `frontend/src/app/admin/login/page.tsx`
- [ ] `frontend/src/app/admin/dashboard/page.tsx`
- [ ] `frontend/src/app/admin/menus/page.tsx`

### Step 8: 글로벌 스타일
- [ ] `frontend/src/app/globals.css`

### Step 9: 문서
- [ ] `frontend/README.md`
- [ ] `aidlc-docs/construction/frontend/code/code-summary.md`
