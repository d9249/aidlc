# Business Logic Model — Unit 1: Backend

## 1. 인증 흐름

### 1.1 관리자 로그인
```
Input: store_identifier, username, password
  1. Store 조회 (store_identifier) → 없으면 401
  2. Admin 조회 (store_id, username) → 없으면 401
  3. 잠금 상태 확인 (locked_until > now) → 잠금이면 423 + 남은 시간 반환
  4. bcrypt 비밀번호 검증 → 실패 시:
     a. failed_login_attempts += 1
     b. 3회 도달 시 locked_until = now + 5분
     c. 401 반환
  5. 성공 시:
     a. failed_login_attempts = 0, locked_until = NULL
     b. JWT 토큰 발급 (payload: admin_id, store_id, role, exp=16h)
     c. {access_token, role} 반환
```

### 1.2 테이블 로그인
```
Input: store_identifier, table_number, password
  1. Store 조회 (store_identifier) → 없으면 401
  2. Table 조회 (store_id, table_number) → 없으면 401
  3. bcrypt 비밀번호 검증 → 실패 시 401
  4. 성공 시:
     a. 현재 활성 세션 확인 (current_session_id)
     b. JWT 토큰 발급 (payload: table_id, store_id, session_id?, exp=16h)
     c. {access_token, table_id, session_id} 반환
```

---

## 2. 주문 생성 흐름

```
Input: store_id, table_id, session_id?, items[{menu_id, quantity}]
  1. Table 존재 확인 → 없으면 404
  2. 각 menu_id 유효성 검증:
     a. MenuItem 존재 확인 → 없으면 400
     b. is_available 확인 → 불가면 400
     c. 동일 store_id 확인 → 다르면 400
  3. 세션 처리:
     a. 활성 세션 있으면 → 해당 세션 사용
     b. 활성 세션 없으면 → 새 TableSession 생성 (첫 주문 시 자동 시작)
     c. Table.current_session_id 업데이트
  4. 주문 생성:
     a. order_number 생성 (YYYYMMDD-XXXX 형식)
     b. Order 레코드 생성 (status='pending')
     c. 각 item에 대해 OrderItem 생성 (menu_name, unit_price 스냅샷 저장)
     d. total_amount 계산 (sum of subtotals)
  5. 세션 총액 업데이트:
     a. TableSession.total_amount += order.total_amount
  6. SSE 이벤트 발행: new_order
  7. Order 반환
```

---

## 3. 주문 상태 전이

```
허용 전이:
  pending → preparing  ✅
  preparing → pending   ✅ (되돌리기 가능)
  pending → completed   ✅
  preparing → completed ✅
  completed → pending   ❌ (완료 후 되돌리기 불가)
  completed → preparing ❌ (완료 후 되돌리기 불가)

Input: order_id, new_status
  1. Order 조회 (is_deleted=FALSE) → 없으면 404
  2. 현재 상태가 'completed'이면 → 400 (변경 불가)
  3. 상태 업데이트
  4. SSE 이벤트 발행: order_status_changed
  5. 업데이트된 Order 반환
```

---

## 4. 주문 삭제 (Soft Delete)

```
Input: order_id (관리자 매니저 권한 필요)
  1. Order 조회 → 없으면 404
  2. is_deleted = TRUE 설정
  3. 세션 총액 재계산:
     a. TableSession.total_amount -= order.total_amount
  4. SSE 이벤트 발행: order_deleted
  5. 성공 반환
```

---

## 5. 테이블 세션 라이프사이클

### 5.1 세션 시작 (자동)
```
Trigger: 첫 주문 생성 시 (활성 세션 없을 때)
  1. TableSession 생성 (is_active=TRUE, total_amount=0)
  2. Table.current_session_id = new_session.id
```

### 5.2 이용 완료 (관리자 수동)
```
Input: table_id (관리자 매니저 권한 필요)
  1. Table 조회 → 없으면 404
  2. 활성 세션 확인 → 없으면 400 (이미 완료)
  3. 해당 세션의 모든 주문 (is_deleted=FALSE) → OrderHistory에 복사:
     a. 각 Order + OrderItems를 JSON으로 직렬화
     b. OrderHistory 레코드 생성 (completed_at=now)
  4. 원본 Order 상태 유지 (삭제하지 않음)
  5. 세션 종료:
     a. TableSession.is_active = FALSE
     b. TableSession.completed_at = now
     c. Table.current_session_id = NULL
  6. SSE 이벤트 발행: table_completed
  7. 성공 반환
```

---

## 6. SSE 이벤트 모델

### 이벤트 타입
| Event | Trigger | Payload |
|-------|---------|---------|
| new_order | 주문 생성 | {order_id, table_id, table_number, items, total_amount} |
| order_status_changed | 상태 변경 | {order_id, table_id, old_status, new_status} |
| order_deleted | 주문 삭제 | {order_id, table_id, amount_change} |
| table_completed | 이용 완료 | {table_id, table_number, session_id} |

### SSEManager 동작
```
- 매장별 연결 관리: Dict[store_id, List[Queue]]
- 관리자 연결 시: store_id 기반 큐 등록
- 이벤트 발생 시: 해당 store_id의 모든 큐에 이벤트 push
- 연결 해제 시: 큐 제거
```

---

## 7. 주문 번호 생성 규칙

```
Format: YYYYMMDD-XXXX
  - YYYYMMDD: 주문 날짜
  - XXXX: 해당 매장의 당일 순번 (0001부터 시작)
  - 예: 20260427-0001, 20260427-0002
```
