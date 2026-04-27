# Logical Components

## 크로스커팅 컴포넌트

### LC-01: CORS Middleware
- **위치**: FastAPI 앱 레벨
- **설정**: 모든 origin 허용 (MVP)
- **구현**: `fastapi.middleware.cors.CORSMiddleware`

### LC-02: Request ID Middleware
- **위치**: FastAPI 미들웨어
- **동작**: 요청마다 UUID 생성 → `X-Request-ID` 헤더 + request.state에 저장
- **용도**: 로그 추적, 에러 디버깅

### LC-03: Logging Middleware
- **위치**: FastAPI 미들웨어
- **동작**: 요청/응답 JSON 로깅 (method, path, status, duration, request_id)
- **라이브러리**: `python-json-logger`

### LC-04: Global Exception Handler
- **위치**: FastAPI exception_handler
- **동작**: 모든 예외를 통일된 JSON 응답으로 변환
- **환경 분기**: DEBUG=true 시 stack_trace 포함

### LC-05: JWT Auth Dependency
- **위치**: FastAPI Depends()
- **변형**: `get_current_user`, `get_current_admin`, `get_current_table`
- **동작**: Authorization 헤더 → JWT 디코딩 → user payload 반환

### LC-06: Role Check Dependency
- **위치**: FastAPI Depends()
- **동작**: `require_role('manager')` → admin.role 검증
- **실패 시**: 403 Forbidden

### LC-07: DB Session Dependency
- **위치**: FastAPI Depends()
- **동작**: SQLAlchemy 세션 생성 → yield → 커밋/롤백 → 세션 닫기
- **패턴**: `get_db()` 제너레이터

### LC-08: SSEManager (Singleton)
- **위치**: 앱 레벨 싱글톤
- **동작**: 매장별 asyncio.Queue 관리, 이벤트 브로드캐스트
- **생명주기**: 앱 시작 시 생성, 앱 종료 시 정리

---

## 컴포넌트 통합 다이어그램

```
+------------------------------------------------------------------+
|                        FastAPI Application                        |
|                                                                  |
|  Middleware Chain:                                                |
|  [CORS] → [Request ID] → [Logging] → [Route Handler]            |
|                                                                  |
|  Dependencies (per-route):                                       |
|  [DB Session] [JWT Auth] [Role Check]                            |
|                                                                  |
|  Services:                                                       |
|  [AuthService] [OrderService] [TableSessionService]              |
|                                                                  |
|  Singleton:                                                      |
|  [SSEManager]                                                    |
|                                                                  |
|  Error Handling:                                                 |
|  [Global Exception Handler]                                      |
+------------------------------------------------------------------+
         |                                          |
         v                                          v
+------------------+                    +------------------+
|     MySQL        |                    |   SSE Clients    |
|  (Connection     |                    |  (Admin Browser) |
|   Pool: 5+10)    |                    |                  |
+------------------+                    +------------------+
```
