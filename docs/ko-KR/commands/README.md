**언어:** [English](../../en/commands/README.md) | **한국어** | [简体中文](../../zh-CN/COMMANDS.md)

# Gemini CLI 확장 명령어

`everything-gemini-code`에서 제공하는 명령어 목록입니다.

| 명령어             | 설명                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/build-fix`       | 빌드 오류를 분석하고 `build-error-resolver` 에이전트로 자동 수정을 시도합니다.                                                          |
| `/checkpoint`      | 모든 변경 사항을 스테이징하고 AI 생성 메시지로 커밋합니다.                                                                               |
| `/code-review`     | `code-reviewer` 에이전트를 사용하여 현재 변경 사항에 대한 종합 코드 리뷰를 수행합니다.                                                    |
| `/e2e`             | Playwright로 E2E 테스트를 생성하고 실행합니다.                                                                                           |
| `/ecc-plan`        | 요구 사항을 재검토하고 단계별 구현 계획을 수립합니다. (별칭: `/everything-gemini-code:plan`)                                               |
| `/ecc-docs`        | Context7을 통해 라이브러리 또는 주제의 최신 문서를 조회합니다. (별칭: `/everything-gemini-code:docs`)                                      |
| `/eval`            | Eval 기반 개발 워크플로우를 관리합니다.                                                                                                  |
| `/evolve`          | 관련 인스팅트를 스킬, 커맨드 또는 에이전트로 클러스터링합니다.                                                                            |
| `/go-build`        | Go 빌드 오류, go vet 경고 및 린터 문제를 점진적으로 수정합니다.                                                                           |
| `/go-review`       | Go 코드 리뷰 — 관용 패턴, 동시성 안전성, 에러 처리, 보안 점검.                                                                           |
| `/go-test`         | Go TDD 워크플로우. 테이블 기반 테스트 먼저 작성 후 구현.                                                                                  |
| `/instinct-export` | 학습된 인스팅트를 파일로 내보냅니다.                                                                                                     |
| `/instinct-import` | 파일 또는 외부 소스에서 인스팅트를 가져옵니다.                                                                                            |
| `/instinct-status` | 현재 학습된 모든 인스팅트와 신뢰도를 표시합니다.                                                                                          |
| `/learn`           | 현재 세션에서 재사용 가능한 패턴을 추출합니다.                                                                                            |
| `/multi-backend`   | 백엔드 중심 멀티 에이전트 워크플로우.                                                                                                    |
| `/multi-execute`   | 여러 전문 에이전트를 사용하여 멀티 페이즈 계획을 실행합니다.                                                                              |
| `/multi-frontend`  | 프론트엔드 중심 멀티 에이전트 워크플로우.                                                                                                |
| `/multi-plan`      | 여러 에이전트를 사용하여 종합적인 구현 계획을 수립합니다.                                                                                 |
| `/multi-workflow`  | 멀티 모델 협업 개발 워크플로우.                                                                                                          |
| `/orchestrate`     | 복잡한 멀티 스텝 작업을 위한 상위 오케스트레이션.                                                                                         |
| `/pm2`             | 프로젝트를 분석하고 PM2 서비스 명령을 자동 생성합니다.                                                                                    |
| `/python-review`   | PEP 8, 타입 힌트, 보안에 대한 종합 Python 코드 리뷰.                                                                                     |
| `/refactor-clean`  | 불필요한 코드, 미사용 임포트 및 레거시 아티팩트를 식별하고 제거합니다.                                                                     |
| `/sessions`        | 활성 Gemini 세션을 관리하고 나열합니다.                                                                                                  |
| `/setup-pm`        | 선호하는 패키지 매니저(npm/pnpm/yarn/bun)를 설정합니다.                                                                                  |
| `/skill-create`    | 로컬 git 히스토리를 분석하여 코딩 패턴을 추출하고 `SKILL.md` 파일을 생성합니다.                                                           |
| `/tdd`             | 테스트 주도 개발 워크플로우를 적용합니다.                                                                                                |
| `/test-coverage`   | 현재 테스트 커버리지를 분석하고 개선 방안을 제안합니다.                                                                                   |
| `/update-codemaps` | 코드베이스 맵을 새로 고쳐 최신 컨텍스트를 반영합니다.                                                                                     |
| `/update-docs`     | 최근 코드 변경에 따라 문서를 업데이트합니다.                                                                                              |
| `/verify`          | 전체 검증 스위트(린트, 빌드, 테스트)를 실행합니다.                                                                                        |

---

## 핵심 커맨드

### /ecc-plan

요구 사항을 재검토하고, 위험을 평가하며, 단계별 구현 계획을 수립합니다. 코드 작성 전 사용자 확인을 기다립니다.

### /tdd

테스트 주도 개발 워크플로우. 인터페이스 스캐폴딩, 테스트 먼저 생성, 최소 코드 구현. 80%+ 커버리지 보장.

### /code-review

커밋되지 않은 변경 사항에 대한 종합 보안 및 품질 리뷰.

### /build-fix

TypeScript 및 빌드 오류를 점진적으로 수정합니다.

### /refactor-clean

테스트 검증을 통해 불필요한 코드를 안전하게 식별하고 제거합니다.

### /e2e

Playwright로 E2E 테스트를 생성하고 실행합니다. 테스트 여정 생성, 스크린샷/비디오/트레이스 캡처.

---

## 멀티 에이전트 커맨드

### /multi-plan

멀티 모델 협업 계획 — 컨텍스트 검색 + 이중 모델 분석.

### /multi-execute

멀티 모델 협업 실행 — 프로토타입, 리팩토링 및 구현, 감사 및 전달.

### /multi-backend

백엔드 중심 워크플로우 (조사, 아이디어, 계획, 실행, 최적화, 리뷰).

### /multi-frontend

프론트엔드 중심 워크플로우 (조사, 아이디어, 계획, 실행, 최적화, 리뷰).

### /multi-workflow

멀티 모델 협업 개발 워크플로우. 프론트엔드는 Gemini, 백엔드는 Codex로 지능적 라우팅.

### /orchestrate

복잡한 작업을 위한 순차적 에이전트 워크플로우.

### /pm2

프로젝트를 분석하고 PM2 서비스 명령을 자동 생성합니다.

---

## 언어별 커맨드

### /go-build, /go-review, /go-test

Go 빌드 오류 수정, 코드 리뷰, TDD 워크플로우.

### /python-review

PEP 8, 타입 힌트, 보안에 대한 종합 Python 코드 리뷰.

### /kotlin-build, /kotlin-review, /kotlin-test

Kotlin 빌드 오류 수정, 코드 리뷰, TDD 워크플로우.

### /cpp-build, /cpp-review, /cpp-test

C++ 빌드 오류 수정, 코드 리뷰, TDD 워크플로우.

### /rust-build, /rust-review, /rust-test

Rust 빌드 오류 수정, 코드 리뷰, TDD 워크플로우.

### /gradle-build

Gradle/Android 빌드 오류 및 의존성 문제 수정.

---

## 학습 및 진화 커맨드

### /learn

현재 세션을 분석하여 스킬로 저장할 만한 패턴을 추출합니다.

### /skill-create

로컬 git 히스토리를 분석하여 코딩 패턴을 추출하고 SKILL.md 파일을 생성합니다.

### /evolve

관련 인스팅트를 스킬, 커맨드 또는 에이전트로 클러스터링합니다.

### /instinct-import, /instinct-export, /instinct-status

인스팅트 가져오기, 내보내기, 조회.

### /learn-eval

자체 평가를 통한 재사용 가능한 패턴 추출.

### /promote, /prune, /projects

인스팅트 글로벌 승격, 저신뢰도 인스팅트 정리, 알려진 프로젝트 목록.

---

## 유틸리티 커맨드

### /setup-pm

선호하는 패키지 매니저(npm/pnpm/yarn/bun)를 설정합니다.

### /update-docs, /update-codemaps

문서 동기화 및 코드베이스 아키텍처 맵 새로 고침.

### /verify, /checkpoint, /eval

검증 스위트, 워크플로우 체크포인트, eval 기반 개발.

### /sessions, /save-session, /resume-session

세션 관리 — 나열, 저장, 불러오기, 별칭 설정.

### /ecc-docs

Context7을 통해 라이브러리 또는 주제의 최신 문서를 조회합니다.

### /context-budget

컨텍스트 윈도우 사용량을 모니터링하고 관리합니다.

### /model-route

작업 복잡도에 따라 최적 모델로 라우팅합니다.
