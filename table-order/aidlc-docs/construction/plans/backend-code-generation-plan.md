# Code Generation Plan — Unit 1: Backend

## Unit Context
- **유닛**: Backend (table-order-backend)
- **기술**: Python 3.12+, FastAPI 0.115+, SQLAlchemy 2.0+, MySQL, Alembic
- **위치**: `backend/` (워크스페이스 루트 기준)
- **요구사항**: FR-C01, FR-C02, FR-C04, FR-C05, FR-A01~A04, NFR-01~05

## 코드 생성 단계

### Step 1: 프로젝트 구조 및 설정 파일
- [x] `backend/requirements.txt`
- [x] `backend/requirements-dev.txt`
- [x] `backend/app/__init__.py`
- [x] `backend/app/config.py`
- [x] `backend/app/database.py`
- [x] `backend/app/main.py`

### Step 2: SQLAlchemy 모델
- [x] `backend/app/models/__init__.py`
- [x] `backend/app/models/store.py`
- [x] `backend/app/models/admin.py`
- [x] `backend/app/models/table.py`
- [x] `backend/app/models/menu.py`
- [x] `backend/app/models/order.py`

### Step 3: Pydantic 스키마
- [x] `backend/app/schemas/__init__.py`
- [x] `backend/app/schemas/auth.py`
- [x] `backend/app/schemas/menu.py`
- [x] `backend/app/schemas/order.py`
- [x] `backend/app/schemas/table.py`

### Step 4: 서비스 레이어
- [x] `backend/app/services/__init__.py`
- [x] `backend/app/services/auth_service.py`
- [x] `backend/app/services/order_service.py`
- [x] `backend/app/services/table_session_service.py`
- [x] `backend/app/services/sse_manager.py`

### Step 5: 미들웨어 및 의존성
- [x] `backend/app/middleware/__init__.py`
- [x] `backend/app/middleware/request_id.py`
- [x] `backend/app/middleware/logging_middleware.py`
- [x] `backend/app/dependencies.py`
- [x] `backend/app/exceptions.py`

### Step 6: API 컨트롤러 (라우터)
- [x] `backend/app/controllers/__init__.py`
- [x] `backend/app/controllers/auth.py`
- [x] `backend/app/controllers/menu.py`
- [x] `backend/app/controllers/order.py`
- [x] `backend/app/controllers/table.py`
- [x] `backend/app/controllers/sse.py`

### Step 7: Alembic 마이그레이션 설정
- [x] `backend/alembic.ini`
- [x] `backend/alembic/env.py`
- [x] `backend/alembic/versions/`

### Step 8: 단위 테스트
- [x] `backend/tests/__init__.py`
- [x] `backend/tests/conftest.py`
- [x] `backend/tests/test_auth_service.py`
- [x] `backend/tests/test_order_service.py`
- [x] `backend/tests/test_table_session_service.py`

### Step 9: 통합 테스트
- [x] `backend/tests/test_auth_api.py`
- [x] `backend/tests/test_menu_api.py`
- [x] `backend/tests/test_order_api.py`
- [x] `backend/tests/test_table_api.py`

### Step 10: 문서 및 배포
- [x] `backend/README.md`
- [ ] `aidlc-docs/construction/backend/code/code-summary.md`
