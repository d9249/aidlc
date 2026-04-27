# Unit Test Execution

## Backend 단위 테스트

### 실행
```bash
cd backend
source venv/bin/activate
pytest -v
```

### 커버리지 포함 실행
```bash
pytest --cov=app --cov-report=term-missing -v
```

### 테스트 파일 목록
| 파일 | 테스트 내용 | 예상 테스트 수 |
|------|-----------|--------------|
| `test_auth_service.py` | 비밀번호 해싱/검증, JWT 생성/디코딩 | 2 |
| `test_order_service.py` | 주문 생성, 메뉴 검증, 자동 세션, 상태 전이, soft delete | 6 |
| `test_table_session_service.py` | 이용 완료, 이력 생성, 세션 없는 경우 | 2 |
| `test_auth_api.py` | 관리자/테이블 로그인 API, /me 엔드포인트 | 4 |
| `test_menu_api.py` | 카테고리 조회, 메뉴 CRUD API | 5 |
| `test_order_api.py` | 주문 생성/조회/상태변경 API | 3 |
| `test_table_api.py` | 테이블 생성/조회 API | 2 |

### 예상 결과
- **총 테스트**: 24개
- **통과**: 24개
- **실패**: 0개
- **커버리지 목표**: 핵심 비즈니스 로직 80%+

### 테스트 실패 시
1. 실패 테스트 출력 확인
2. SQLite 테스트 DB 사용 확인 (MySQL 불필요)
3. 코드 수정 후 재실행
