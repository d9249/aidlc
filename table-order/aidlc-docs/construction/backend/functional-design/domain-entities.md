# Domain Entities — Unit 1: Backend

## Entity Relationship Overview

```
Store 1──* Admin
Store 1──* Table
Store 1──* Category
Table 1──* TableSession
TableSession 1──* Order
Category 1──* MenuItem
Order 1──* OrderItem
OrderItem *──1 MenuItem
Store 1──* OrderHistory
```

---

## Entities

### Store (매장)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 매장 고유 ID |
| name | VARCHAR(100) | NOT NULL | 매장명 |
| store_identifier | VARCHAR(50) | NOT NULL, UNIQUE | 매장 식별자 (로그인용) |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 생성 시각 |
| updated_at | DATETIME | NOT NULL, ON UPDATE NOW | 수정 시각 |

### Admin (관리자)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 관리자 고유 ID |
| store_id | INT | FK → Store.id, NOT NULL | 소속 매장 |
| username | VARCHAR(50) | NOT NULL | 사용자명 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| role | ENUM('manager','staff') | NOT NULL, DEFAULT 'staff' | 역할 |
| failed_login_attempts | INT | NOT NULL, DEFAULT 0 | 연속 로그인 실패 횟수 |
| locked_until | DATETIME | NULLABLE | 잠금 해제 시각 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 생성 시각 |

**UNIQUE**: (store_id, username)

### Table (테이블)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 테이블 고유 ID |
| store_id | INT | FK → Store.id, NOT NULL | 소속 매장 |
| table_number | INT | NOT NULL | 테이블 번호 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 해시 비밀번호 |
| current_session_id | INT | FK → TableSession.id, NULLABLE | 현재 활성 세션 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 생성 시각 |

**UNIQUE**: (store_id, table_number)

### TableSession (테이블 세션)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 세션 고유 ID |
| table_id | INT | FK → Table.id, NOT NULL | 테이블 |
| store_id | INT | FK → Store.id, NOT NULL | 매장 |
| started_at | DATETIME | NOT NULL, DEFAULT NOW | 세션 시작 시각 |
| completed_at | DATETIME | NULLABLE | 이용 완료 시각 |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | 활성 여부 |
| total_amount | INT | NOT NULL, DEFAULT 0 | 총 주문 금액 |

### Category (카테고리)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 카테고리 고유 ID |
| store_id | INT | FK → Store.id, NOT NULL | 소속 매장 |
| name | VARCHAR(50) | NOT NULL | 카테고리명 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 노출 순서 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 생성 시각 |

**UNIQUE**: (store_id, name)

### MenuItem (메뉴 항목)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 메뉴 고유 ID |
| store_id | INT | FK → Store.id, NOT NULL | 소속 매장 |
| category_id | INT | FK → Category.id, NOT NULL | 카테고리 |
| name | VARCHAR(100) | NOT NULL | 메뉴명 |
| price | INT | NOT NULL, >= 0 | 가격 (원) |
| description | TEXT | NULLABLE | 메뉴 설명 |
| image_url | VARCHAR(500) | NULLABLE | 이미지 URL |
| sort_order | INT | NOT NULL, DEFAULT 0 | 노출 순서 |
| is_available | BOOLEAN | NOT NULL, DEFAULT TRUE | 판매 가능 여부 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 생성 시각 |
| updated_at | DATETIME | NOT NULL, ON UPDATE NOW | 수정 시각 |

### Order (주문)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 주문 고유 ID |
| store_id | INT | FK → Store.id, NOT NULL | 매장 |
| table_id | INT | FK → Table.id, NOT NULL | 테이블 |
| session_id | INT | FK → TableSession.id, NOT NULL | 세션 |
| order_number | VARCHAR(20) | NOT NULL, UNIQUE | 주문 번호 (표시용) |
| status | ENUM('pending','preparing','completed') | NOT NULL, DEFAULT 'pending' | 주문 상태 |
| total_amount | INT | NOT NULL | 총 주문 금액 |
| is_deleted | BOOLEAN | NOT NULL, DEFAULT FALSE | Soft Delete 플래그 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 주문 시각 |
| updated_at | DATETIME | NOT NULL, ON UPDATE NOW | 수정 시각 |

### OrderItem (주문 항목)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 주문 항목 고유 ID |
| order_id | INT | FK → Order.id, NOT NULL | 주문 |
| menu_item_id | INT | FK → MenuItem.id, NOT NULL | 메뉴 |
| menu_name | VARCHAR(100) | NOT NULL | 주문 시점 메뉴명 (스냅샷) |
| quantity | INT | NOT NULL, >= 1 | 수량 |
| unit_price | INT | NOT NULL, >= 0 | 주문 시점 단가 (스냅샷) |
| subtotal | INT | NOT NULL | 소계 (quantity * unit_price) |

### OrderHistory (과거 주문 이력)
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | 이력 고유 ID |
| store_id | INT | FK → Store.id, NOT NULL | 매장 |
| table_id | INT | NOT NULL | 테이블 ID |
| table_number | INT | NOT NULL | 테이블 번호 (스냅샷) |
| session_id | INT | NOT NULL | 세션 ID |
| order_id | INT | NOT NULL | 원본 주문 ID |
| order_number | VARCHAR(20) | NOT NULL | 주문 번호 |
| order_data | JSON | NOT NULL | 주문 상세 (메뉴 목록, 수량, 금액) |
| total_amount | INT | NOT NULL | 주문 금액 |
| ordered_at | DATETIME | NOT NULL | 원본 주문 시각 |
| completed_at | DATETIME | NOT NULL | 이용 완료 시각 |
| created_at | DATETIME | NOT NULL, DEFAULT NOW | 이력 생성 시각 |
