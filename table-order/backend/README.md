# Table Order Backend

FastAPI 기반 테이블오더 서비스 API 서버

## 요구사항
- Python 3.12+
- MySQL 8.0+

## 설정

```bash
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements-dev.txt
```

## 환경 변수 (.env)

```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/table_order
JWT_SECRET_KEY=your-secret-key
DEBUG=true
```

## 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
alembic revision --autogenerate -m "initial"

# 마이그레이션 실행
alembic upgrade head
```

## 실행

```bash
uvicorn app.main:app --reload --port 8000
```

## API 문서
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 테스트

```bash
pytest -v
pytest --cov=app
```
