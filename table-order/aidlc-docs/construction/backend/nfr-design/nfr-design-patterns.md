# NFR Design Patterns

## 1. 인증/인가 패턴

### JWT 미들웨어
```
Request → JWT Middleware → Route Handler
           |
           ├─ 토큰 없음 → 401 Unauthorized
           ├─ 토큰 만료 → 401 Unauthorized
           ├─ 토큰 유효 → request.state.user에 payload 저장 → 다음 핸들러
           └─ 토큰 변조 → 401 Unauthorized
```
- FastAPI `Depends()` 기반 의존성 주입
- `get_current_user`: JWT 디코딩 → user 정보 반환
- `get_current_admin`: get_current_user + user_type='admin' 검증
- `get_current_table`: get_current_user + user_type='table' 검증

### 역할 기반 접근 제어
```
get_current_admin → require_role('manager') → Route Handler
```
- `require_role(role)`: 데코레이터/의존성으로 역할 검증
- 매니저: 모든 관리자 기능
- 직원: 주문 모니터링 + 상태 변경만

### 로그인 시도 제한
```
Login Request → Check locked_until → Verify Password
                    |                      |
                    ├─ 잠금 중 → 423       ├─ 성공 → 리셋 + JWT 발급
                    └─ 잠금 아님 → 계속    └─ 실패 → attempts++ → 3회 시 잠금
```
- DB 기반 (Admin.failed_login_attempts, Admin.locked_until)
- 인메모리 캐시 불필요 (소규모)

### JWT 토큰 저장 (프론트엔드)
- localStorage에 저장
- API 요청 시 `Authorization: Bearer {token}` 헤더 전송
- 페이지 로드 시 토큰 존재 확인 + exp 검증 → 만료 시 로그아웃

---

## 2. 성능 패턴

### DB 커넥션 풀
```python
# SQLAlchemy 커넥션 풀 설정
pool_size=5          # 기본 연결 수
max_overflow=10      # 추가 허용 연결 수
pool_recycle=3600    # 1시간마다 연결 재생성
pool_pre_ping=True   # 연결 유효성 사전 확인
```

### SSE 연결 관리
```
Admin Connect → SSEManager.subscribe(store_id, queue)
                    |
Event Trigger → SSEManager.broadcast(store_id, event)
                    |
                    └─ 모든 구독 큐에 이벤트 push
                    
Admin Disconnect → SSEManager.unsubscribe(store_id, queue)
```
- 인메모리 `asyncio.Queue` 기반 (소규모 적합)
- 매장별 구독자 리스트 관리
- 연결 끊김 감지 시 자동 정리

---

## 3. 로깅 패턴

### 구조화된 JSON 로깅 미들웨어
```
Request In → Generate X-Request-ID → Log Request → Route Handler → Log Response
```

로그 형식:
```json
{
  "timestamp": "2026-04-27T12:00:00Z",
  "level": "INFO",
  "request_id": "uuid",
  "method": "POST",
  "path": "/api/orders",
  "status_code": 201,
  "duration_ms": 45,
  "client_ip": "192.168.1.1"
}
```

- `python-json-logger` 사용
- FastAPI 미들웨어로 요청/응답 자동 로깅
- 에러 시 ERROR 레벨 + 에러 상세

---

## 4. 에러 처리 패턴

### 전역 에러 핸들러
```
Exception → Global Handler → Structured Error Response
               |
               ├─ ValidationError → 400 + field errors
               ├─ AuthError → 401/403
               ├─ NotFoundError → 404
               ├─ LockedError → 423
               └─ Unhandled → 500 + log stack trace
```

응답 형식:
```json
{
  "detail": "사용자 친화적 메시지",
  "error_code": "ORDER_NOT_FOUND",
  "stack_trace": "..." // 개발 환경에서만 포함
}
```

- 커스텀 예외 클래스 정의 (AppError 기반)
- 환경 변수 `DEBUG=true`일 때만 stack_trace 포함

---

## 5. 미들웨어 체인

```
Request
  → CORS Middleware
  → Request ID Middleware (X-Request-ID 생성)
  → Logging Middleware (요청 로깅)
  → JWT Auth (Depends, 라우트별)
  → Role Check (Depends, 라우트별)
  → Route Handler
  → Logging Middleware (응답 로깅)
Response
```
