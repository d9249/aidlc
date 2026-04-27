# Unit of Work Plan

## 분해 계획

### Phase 1: 유닛 식별
- [x] 시스템을 개발 유닛으로 분해
- [x] 각 유닛의 책임 범위 정의
- [x] 유닛 간 경계 확정

### Phase 2: 유닛 의존성 정의
- [x] 유닛 간 의존성 매트릭스 작성
- [x] 개발 순서 결정

### Phase 3: 기능 매핑
- [x] 요구사항(FR)을 유닛에 매핑
- [x] 모든 요구사항이 유닛에 할당되었는지 검증

### Phase 4: 코드 구조 정의
- [x] Greenfield 프로젝트 디렉토리 구조 정의
- [x] 유닛별 파일/폴더 구조 확정

### Phase 5: 검증
- [x] 유닛 경계 및 의존성 검증
- [x] 모든 요구사항 커버리지 확인

---

## 유닛 분해 질문

## Question 1
시스템 분해 전략으로 어떤 접근을 선호하십니까?

A) 기술 계층별 분해 — 백엔드 유닛 1개 + 프론트엔드 유닛 1개 (총 2개 유닛)
B) 기능 도메인별 분해 — 인증, 메뉴, 주문, 테이블 각각 유닛 (백엔드+프론트엔드 포함, 총 4~5개 유닛)
C) 혼합 — 백엔드 1개 유닛 + 프론트엔드를 고객용/관리자용으로 분리 (총 3개 유닛)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
유닛 간 개발 순서는 어떻게 하시겠습니까?

A) 백엔드 먼저 완성 → 프론트엔드 개발 (순차적)
B) 백엔드와 프론트엔드 병렬 개발 (API 스펙 기반)
C) 핵심 기능(주문 흐름) 먼저 수직 슬라이스로 개발 → 나머지 기능 추가
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3
데이터베이스 스키마 및 마이그레이션은 어떤 유닛에서 관리하시겠습니까?

A) 백엔드 유닛에 포함 (SQLAlchemy 모델 + Alembic 마이그레이션)
B) 별도 데이터베이스 유닛으로 분리
C) Other (please describe after [Answer]: tag below)

[Answer]: A
