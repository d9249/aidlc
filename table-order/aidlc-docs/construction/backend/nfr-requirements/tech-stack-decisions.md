# Tech Stack Decisions

## Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| Python | 3.12+ | 런타임 |
| FastAPI | 0.115+ | 웹 프레임워크 |
| SQLAlchemy | 2.0+ | ORM |
| Alembic | 1.14+ | DB 마이그레이션 |
| PyMySQL | 1.1+ | MySQL 드라이버 |
| python-jose | 3.3+ | JWT 토큰 |
| passlib[bcrypt] | 1.7+ | 비밀번호 해싱 |
| pydantic | 2.0+ | 데이터 검증 (FastAPI 내장) |
| uvicorn | 0.34+ | ASGI 서버 |
| python-json-logger | 2.0+ | 구조화된 JSON 로깅 |
| pytest | 8.0+ | 테스트 프레임워크 |
| httpx | 0.28+ | 테스트용 HTTP 클라이언트 |

### 패키지 관리
- **도구**: pip + requirements.txt
- **파일**: `requirements.txt` (프로덕션), `requirements-dev.txt` (개발)

## Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 20 LTS+ | 런타임 |
| Next.js | 15+ | 프레임워크 |
| React | 19+ | UI 라이브러리 |
| TypeScript | 5.0+ | 타입 시스템 |
| Tailwind CSS | 4+ | 스타일링 |
| Jest | 29+ | 테스트 프레임워크 |
| React Testing Library | 16+ | 컴포넌트 테스트 |

### 패키지 관리
- **도구**: npm
- **파일**: `package.json`, `package-lock.json`

## Database

| 기술 | 버전 | 용도 |
|------|------|------|
| MySQL | 8.0+ | RDBMS |

## 개발 도구

| 도구 | 용도 |
|------|------|
| Alembic | DB 스키마 마이그레이션 |
| uvicorn --reload | 백엔드 핫 리로드 |
| next dev | 프론트엔드 핫 리로드 |
| FastAPI /docs | OpenAPI/Swagger 자동 문서화 |
