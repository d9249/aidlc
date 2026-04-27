# Backend Code Summary

## 생성된 파일 (40개)

### 프로젝트 설정 (6)
- `requirements.txt`, `requirements-dev.txt`, `app/__init__.py`, `app/config.py`, `app/database.py`, `app/main.py`

### 모델 (6)
- `models/__init__.py`, `models/store.py`, `models/admin.py`, `models/table.py`, `models/menu.py`, `models/order.py`
- 9개 엔티티: Store, Admin, Table, TableSession, Category, MenuItem, Order, OrderItem, OrderHistory

### 스키마 (5)
- `schemas/__init__.py`, `schemas/auth.py`, `schemas/menu.py`, `schemas/order.py`, `schemas/table.py`

### 서비스 (5)
- `services/__init__.py`, `services/auth_service.py`, `services/order_service.py`, `services/table_session_service.py`, `services/sse_manager.py`

### 미들웨어/의존성 (5)
- `middleware/__init__.py`, `middleware/request_id.py`, `middleware/logging_middleware.py`, `dependencies.py`, `exceptions.py`

### 컨트롤러 (6)
- `controllers/__init__.py`, `controllers/auth.py`, `controllers/menu.py`, `controllers/order.py`, `controllers/table.py`, `controllers/sse.py`
- 20개 API 엔드포인트

### Alembic (3)
- `alembic.ini`, `alembic/env.py`, `alembic/script.py.mako`

### 테스트 (9)
- `tests/__init__.py`, `tests/conftest.py`
- 단위: `test_auth_service.py`, `test_order_service.py`, `test_table_session_service.py`
- 통합: `test_auth_api.py`, `test_menu_api.py`, `test_order_api.py`, `test_table_api.py`

### 문서 (1)
- `README.md`
