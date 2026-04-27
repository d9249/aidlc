# Build Instructions

## 시스템 요구사항
- Python 3.12+
- Node.js 20+
- MySQL 8.0+

## 1. Backend 빌드

### 1.1 의존성 설치
```bash
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements-dev.txt
```

### 1.2 환경 설정
```bash
# backend/.env 파일 생성
cat > .env << 'EOF'
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/table_order
JWT_SECRET_KEY=your-secret-key-change-in-production
DEBUG=true
EOF
```

### 1.3 데이터베이스 설정
```bash
# MySQL에서 데이터베이스 생성
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS table_order CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Alembic 마이그레이션 생성 및 실행
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

### 1.4 서버 실행
```bash
uvicorn app.main:app --reload --port 8000
```

### 1.5 빌드 검증
- http://localhost:8000/health → `{"status": "ok"}`
- http://localhost:8000/docs → Swagger UI 표시

## 2. Frontend 빌드

### 2.1 의존성 설치
```bash
cd frontend
npm install
```

### 2.2 환경 설정
```bash
# frontend/.env.local 파일 생성
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### 2.3 개발 서버 실행
```bash
npm run dev
```

### 2.4 프로덕션 빌드
```bash
npm run build
npm start
```

### 2.5 빌드 검증
- http://localhost:3000 → 고객 로그인 페이지 리다이렉트
- http://localhost:3000/admin/login → 관리자 로그인 페이지

## 트러블슈팅

### MySQL 연결 실패
- MySQL 서비스 실행 확인: `mysql.server status`
- DATABASE_URL 환경 변수 확인
- 사용자 권한 확인

### Python 패키지 설치 실패
- Python 버전 확인: `python --version` (3.12+ 필요)
- venv 활성화 확인

### npm install 실패
- Node.js 버전 확인: `node --version` (20+ 필요)
- `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install`
