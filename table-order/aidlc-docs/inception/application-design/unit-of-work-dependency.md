# Unit of Work Dependencies

## 의존성 매트릭스

| From → To | Backend | Frontend |
|-----------|---------|----------|
| **Backend** | — | 없음 |
| **Frontend** | REST API + SSE 의존 | — |

- **Frontend → Backend**: Frontend는 Backend의 REST API와 SSE 엔드포인트에 의존
- **Backend → Frontend**: Backend는 Frontend에 의존하지 않음 (독립 실행 가능)

---

## 개발 순서 (수직 슬라이스)

```
Slice 1: 핵심 주문 흐름
+------------------+          +------------------+
| Backend Slice 1  |  ------> | Frontend Slice 1 |
| DB + Models +    |  REST    | Table Login +    |
| Menu(조회) +     |  API     | Menu + Cart +    |
| Order(생성/조회) |          | Order Confirm    |
| + Table Login    |          | + Contexts       |
+------------------+          +------------------+

Slice 2: 관리자 기능
+------------------+          +------------------+
| Backend Slice 2  |  ------> | Frontend Slice 2 |
| Admin Auth +     |  REST    | Admin Login +    |
| Order(상태/삭제) |  + SSE   | Dashboard(SSE) + |
| + Table(완료) +  |          | Table Mgmt       |
| SSE Controller   |          |                  |
+------------------+          +------------------+

Slice 3: 메뉴 관리 + 나머지
+------------------+          +------------------+
| Backend Slice 3  |  ------> | Frontend Slice 3 |
| Menu CRUD +      |  REST    | Order History +  |
| Category CRUD +  |  API     | Menu Mgmt +      |
| OrderHistory     |          | 과거 내역        |
+------------------+          +------------------+

Slice 4: 마무리
+------------------+          +------------------+
| Backend Slice 4  |          | Frontend Slice 4 |
| 보안 강화 +      |          | UI 마무리 +      |
| 입력 검증        |          | 에러/로딩/접근성 |
+------------------+          +------------------+
```

### 슬라이스별 개발 규칙
- 각 슬라이스에서 Backend를 먼저 구현한 후 Frontend 구현
- 슬라이스 1 완료 후 슬라이스 2 진행 (순차)
- 각 슬라이스 완료 시 해당 기능의 통합 테스트 수행

---

## 통신 인터페이스

| 인터페이스 | 프로토콜 | 방향 | 용도 |
|-----------|----------|------|------|
| REST API | HTTP/JSON | Frontend → Backend | CRUD 작업, 인증 |
| SSE | HTTP/EventStream | Backend → Frontend | 실시간 주문 알림 (관리자) |

## 공유 리소스

| 리소스 | 소유 유닛 | 사용 유닛 |
|--------|-----------|-----------|
| MySQL DB | Backend | Backend only |
| JWT 토큰 스펙 | Backend (발급) | Frontend (저장/전송) |
| API 스펙 (OpenAPI) | Backend (생성) | Frontend (소비) |
