# 요구사항 검증 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택한 옵션의 알파벳을 입력해 주세요.
선택지 중 맞는 것이 없으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
백엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Spring Boot (Java/Kotlin)
C) FastAPI / Django (Python)
D) Go (Gin/Echo)
E) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (JavaScript/TypeScript)
B) Vue.js
C) Next.js (React 기반 풀스택)
D) Svelte / SvelteKit
E) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL / MariaDB
C) MongoDB (NoSQL)
D) DynamoDB (AWS NoSQL)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
배포 환경은 어떻게 계획하고 계십니까?

A) AWS (EC2, ECS, Lambda 등)
B) 로컬/온프레미스 서버
C) Docker Compose 기반 로컬 개발 환경만 우선 구축
D) Vercel / Netlify (프론트) + AWS (백엔드)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
동시 접속 매장 수 및 테이블 규모를 어떻게 예상하십니까?

A) 소규모 — 단일 매장, 테이블 20개 이하
B) 중규모 — 1~5개 매장, 매장당 테이블 50개 이하
C) 대규모 — 다수 매장(10+), 매장당 테이블 100개 이상
D) MVP는 단일 매장으로 시작하되, 향후 다중 매장 확장 고려
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
관리자 계정 관리 방식은 어떻게 하시겠습니까?

A) 매장당 1개의 관리자 계정 (단순)
B) 매장당 다수 관리자 계정 + 역할 구분 (매니저/직원)
C) 슈퍼 관리자 + 매장별 관리자 계층 구조
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 7
메뉴 이미지 관리 방식은 어떻게 하시겠습니까?

A) 외부 이미지 URL 직접 입력 (이미지 호스팅은 별도)
B) 서버에 이미지 업로드 기능 포함
C) AWS S3 등 클라우드 스토리지에 업로드
D) MVP에서는 이미지 URL만 지원, 향후 업로드 기능 추가
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 8
고객용 인터페이스의 접근 방식은 어떻게 하시겠습니까?

A) QR 코드 스캔으로 웹 페이지 접근 (테이블별 고유 URL)
B) 태블릿에 고정 설치된 웹 브라우저 (키오스크 모드)
C) QR 코드 + 태블릿 모두 지원
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 9
프로젝트의 모노레포/멀티레포 구조는 어떻게 하시겠습니까?

A) 모노레포 — 프론트엔드 + 백엔드를 하나의 저장소에서 관리
B) 멀티레포 — 프론트엔드와 백엔드를 별도 저장소로 분리
C) 모노레포 + 워크스페이스 (npm/yarn workspaces, turborepo 등)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
테스트 전략은 어떻게 하시겠습니까?

A) 단위 테스트 + 통합 테스트 (기본)
B) 단위 테스트 + 통합 테스트 + E2E 테스트 (포괄적)
C) MVP에서는 핵심 비즈니스 로직 단위 테스트만
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes — 모든 보안 규칙을 블로킹 제약으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 모든 보안 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 12: Property-Based Testing Extension
이 프로젝트에 속성 기반 테스트(PBT) 규칙을 적용하시겠습니까?

A) Yes — 모든 PBT 규칙을 블로킹 제약으로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 라운드트립에만 PBT 규칙 적용 (알고리즘 복잡도가 제한적인 프로젝트에 적합)
C) No — 모든 PBT 규칙 건너뛰기 (단순 CRUD, UI 전용, 비즈니스 로직이 적은 프로젝트에 적합)
D) Other (please describe after [Answer]: tag below)

[Answer]: C
