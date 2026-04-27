# NFR Requirements

## 1. 성능

| 항목 | 목표 |
|------|------|
| 일반 API 응답 시간 | 200ms 이내 |
| 주문 생성 API | 500ms 이내 |
| SSE 주문 알림 지연 | 2초 이내 |
| 동시 접속 | 단일 매장, 테이블 20개 + 관리자 5명 |

## 2. 보안

| 항목 | 구현 |
|------|------|
| 인증 | JWT 토큰 (16시간 만료) |
| 비밀번호 저장 | bcrypt (cost factor 12) |
| 로그인 제한 | 3회 실패 시 5분 잠금 |
| CORS | 모든 origin 허용 (MVP) |
| 입력 검증 | Pydantic 스키마 검증 |
| SQL Injection | SQLAlchemy ORM 파라미터 바인딩 |

## 3. 로깅

| 항목 | 구현 |
|------|------|
| 형식 | 구조화된 JSON 로깅 |
| 추적 | 요청별 추적 ID (X-Request-ID) |
| 수준 | INFO (요청/응답), ERROR (에러), WARNING (로그인 실패 등) |
| 출력 | stdout |

## 4. 에러 처리

| 항목 | 구현 |
|------|------|
| API 에러 응답 | 통일된 JSON 형식: `{detail, error_code}` |
| HTTP 상태 코드 | 400 (검증 실패), 401 (인증 실패), 403 (권한 없음), 404 (미존재), 423 (잠금), 500 (서버 에러) |
| 예외 처리 | FastAPI exception handler로 전역 처리 |

## 5. 가용성

| 항목 | 구현 |
|------|------|
| 배포 | 로컬/온프레미스 단일 서버 |
| DB 연결 | SQLAlchemy 커넥션 풀 |
| SSE 재연결 | 클라이언트 측 자동 재연결 (3초 간격) |

## 6. 테스트

| 항목 | 구현 |
|------|------|
| 단위 테스트 | pytest |
| 통합 테스트 | pytest + TestClient (FastAPI) |
| 프론트엔드 테스트 | Jest + React Testing Library |
| 커버리지 목표 | 핵심 비즈니스 로직 80% 이상 |
