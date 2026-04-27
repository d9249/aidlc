# Services

## 서비스 정의

Simple MVC 패턴에서 Controller가 직접 Model(ORM)을 호출하는 구조이나, 복잡한 비즈니스 로직은 서비스 함수로 분리합니다.

---

### SVC-01: AuthService
- **책임**: 인증/인가 비즈니스 로직
- **주요 기능**:
  - 관리자 비밀번호 검증 (bcrypt)
  - JWT 토큰 생성/검증
  - 로그인 시도 제한 관리
  - 역할 기반 접근 제어 (매니저/직원)
- **사용처**: Auth Controller

### SVC-02: OrderService
- **책임**: 주문 처리 비즈니스 로직
- **주요 기능**:
  - 주문 생성 (메뉴 유효성 검증, 금액 계산)
  - 주문 상태 전이 관리 (대기중 → 준비중 → 완료)
  - 주문 삭제 시 총 주문액 재계산
  - SSE 이벤트 발행 (신규 주문, 상태 변경)
- **사용처**: Order Controller, SSE Controller

### SVC-03: TableSessionService
- **책임**: 테이블 세션 라이프사이클 관리
- **주요 기능**:
  - 세션 시작 (첫 주문 시 자동)
  - 이용 완료 처리 (주문 이력 이동, 현재 데이터 리셋)
  - 세션별 주문 그룹화
- **사용처**: Table Controller, Order Controller

### SVC-04: SSEManager
- **책임**: SSE 연결 및 이벤트 브로드캐스트 관리
- **주요 기능**:
  - 클라이언트 연결 관리 (매장별)
  - 이벤트 브로드캐스트 (new_order, order_status_changed, order_deleted, table_completed)
- **사용처**: SSE Controller, OrderService, TableSessionService

---

## 서비스 오케스트레이션 패턴

```
Controller → Service Function → SQLAlchemy Model → MySQL
                |
                +→ SSEManager (이벤트 발행)
```

- Controller는 요청 파싱, 응답 포맷팅 담당
- Service 함수는 비즈니스 로직 및 트랜잭션 관리
- Model은 데이터 접근 (SQLAlchemy ORM)
- SSEManager는 실시간 이벤트 브로드캐스트
