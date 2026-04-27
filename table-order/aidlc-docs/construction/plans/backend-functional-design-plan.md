# Functional Design Plan — Unit 1: Backend

## 설계 계획

### Phase 1: 도메인 엔티티 설계
- [x] 핵심 엔티티 정의 (Store, Admin, Table, TableSession, Category, MenuItem, Order, OrderItem, OrderHistory)
- [x] 엔티티 간 관계 정의
- [x] 필드 타입 및 제약 조건 정의

### Phase 2: 비즈니스 로직 모델링
- [x] 인증 흐름 (관리자 로그인, 테이블 로그인)
- [x] 주문 생성 흐름
- [x] 주문 상태 전이 로직
- [x] 테이블 세션 라이프사이클
- [x] SSE 이벤트 발행 로직

### Phase 3: 비즈니스 규칙 정의
- [x] 인증/인가 규칙
- [x] 주문 관련 규칙
- [x] 테이블 세션 규칙
- [x] 메뉴 관리 규칙
- [x] 데이터 검증 규칙

### Phase 4: 검증
- [x] 모든 요구사항 커버리지 확인
- [x] 비즈니스 규칙 일관성 검증

---

## 설계 질문

## Question 1
주문 상태 전이 규칙은 어떻게 하시겠습니까?

A) 단방향만 허용: 대기중 → 준비중 → 완료 (역방향 불가)
B) 유연한 전이: 대기중 ↔ 준비중 → 완료 (완료만 되돌리기 불가)
C) 완전 자유: 어떤 상태에서든 다른 상태로 변경 가능
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2
테이블 세션 시작 시점은 언제입니까?

A) 첫 주문 생성 시 자동으로 세션 시작 (요구사항 명시)
B) 관리자가 수동으로 세션 시작 후 주문 가능
C) 테이블 로그인 시 자동으로 세션 시작
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
주문 삭제 시 관련 데이터 처리는 어떻게 하시겠습니까?

A) Hard Delete — 주문 데이터 완전 삭제
B) Soft Delete — 삭제 플래그만 설정, 데이터 보존
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
이용 완료 시 과거 이력 저장 방식은 어떻게 하시겠습니까?

A) 별도 OrderHistory 테이블에 복사 후 원본 Order 유지 (상태만 변경)
B) 별도 OrderHistory 테이블에 복사 후 원본 Order 삭제
C) 동일 Order 테이블에서 상태/플래그로 구분 (별도 테이블 없음)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
메뉴 가격 범위 검증의 기준은 어떻게 하시겠습니까?

A) 최소 100원 ~ 최대 1,000,000원
B) 최소 0원(무료 가능) ~ 최대 제한 없음
C) 최소 1원 ~ 최대 10,000,000원
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
로그인 시도 제한 정책은 어떻게 하시겠습니까?

A) 5회 실패 시 15분 잠금
B) 10회 실패 시 30분 잠금
C) 3회 실패 시 5분 잠금
D) Other (please describe after [Answer]: tag below)

[Answer]: C
