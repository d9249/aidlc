# Integration Test Instructions

## 목적
Backend API 엔드포인트 간 상호작용 및 Frontend ↔ Backend 통합 검증

## Backend API 통합 테스트

### 실행 (Backend 단위 테스트에 포함)
```bash
cd backend
pytest tests/test_*_api.py -v
```

통합 테스트는 FastAPI TestClient를 사용하여 실제 HTTP 요청/응답을 테스트합니다. SQLite 인메모리 DB를 사용하므로 MySQL 불필요.

## Frontend ↔ Backend 수동 통합 테스트

### 환경 설정
```bash
# 터미널 1: Backend 실행
cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# 터미널 2: Frontend 실행
cd frontend && npm run dev
```

### 시나리오 1: 고객 주문 흐름
1. http://localhost:3000/customer/login 접속
2. 매장 식별자, 테이블 번호, 비밀번호 입력 → 로그인
3. 메뉴 페이지에서 카테고리 선택 → 메뉴 카드 표시 확인
4. "담기" 버튼 클릭 → 헤더 장바구니 배지 증가 확인
5. 장바구니 페이지 이동 → 수량 조절, 총 금액 확인
6. "주문하기" 클릭 → 주문 번호 표시 → 5초 후 메뉴 리다이렉트
7. 주문내역 페이지 → 방금 주문 표시 확인

### 시나리오 2: 관리자 주문 관리
1. http://localhost:3000/admin/login 접속
2. 매장 식별자, 사용자명, 비밀번호 입력 → 로그인
3. 대시보드에서 테이블 카드 그리드 확인
4. 고객이 주문 시 → SSE로 실시간 카드 업데이트 확인
5. 테이블 카드 클릭 → 모달에서 주문 상세 확인
6. 상태 변경 (대기중 → 준비중 → 완료) 확인
7. 주문 삭제 (매니저만) → 확인 팝업 → 삭제 확인
8. 이용 완료 → 확인 팝업 → 테이블 리셋 확인

### 시나리오 3: 메뉴 관리
1. 관리자 로그인 (매니저 계정)
2. 메뉴관리 페이지 이동
3. 메뉴 등록 → 목록에 표시 확인
4. 메뉴 수정 → 변경 반영 확인
5. 메뉴 삭제 → 확인 팝업 → 삭제 확인
6. 고객 메뉴 페이지에서 변경 반영 확인
