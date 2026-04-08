**언어:** [English](../../en/contributing/COMMAND-AGENT-MAP.md) | **한국어**

# 커맨드 ↔ 에이전트 매핑

각 커맨드가 호출하는 에이전트를 빠르게 참조할 수 있는 테이블입니다.

| 커맨드 | 사용 에이전트 | 설명 |
|--------|-------------|------|
| `/ecc-plan` | planner | 기능 구현 계획 수립 |
| `/tdd` | tdd-guide | 테스트 주도 개발 |
| `/code-review` | code-reviewer | 코드 품질 리뷰 |
| `/build-fix` | build-error-resolver | 빌드 오류 수정 |
| `/e2e` | e2e-runner | E2E 테스트 생성 |
| `/refactor-clean` | refactor-cleaner | 불필요한 코드 제거 |
| `/update-docs` | doc-updater | 문서 동기화 |
| `/verify` | — | 검증 루프 스킬 실행 |
| `/eval` | — | 기준 대비 평가 |
| `/go-build` | go-build-resolver | Go 빌드 오류 수정 |
| `/go-review` | go-reviewer | Go 코드 리뷰 |
| `/go-test` | — | Go TDD 워크플로우 |
| `/python-review` | python-reviewer | Python 코드 리뷰 |
| `/kotlin-build` | kotlin-build-resolver | Kotlin 빌드 오류 |
| `/kotlin-review` | kotlin-reviewer | Kotlin 코드 리뷰 |
| `/rust-build` | rust-build-resolver | Rust 빌드 오류 |
| `/rust-review` | rust-reviewer | Rust 코드 리뷰 |
| `/cpp-build` | cpp-build-resolver | C++ 빌드 오류 |
| `/cpp-review` | cpp-reviewer | C++ 코드 리뷰 |
| `/orchestrate` | — | 멀티 에이전트 조율 |
| `/multi-plan` | planner | 멀티 에이전트 작업 분해 |
| `/sessions` | — | 세션 히스토리 관리 |
| `/skill-create` | — | git 히스토리에서 스킬 생성 |
| `/learn` | — | 세션에서 패턴 추출 |
| `/evolve` | — | 인스팅트를 스킬로 클러스터링 |
| `/checkpoint` | — | 검증 상태 저장 |

---

## 직접 에이전트 호출

전용 커맨드가 없는 에이전트는 직접 호출할 수 있습니다:

```bash
@security-reviewer "이 파일의 취약점을 감사해주세요"
@architect "마이크로서비스 시스템을 설계해주세요..."
@typescript-reviewer "이 TypeScript 코드를 리뷰해주세요"
@database-reviewer "이 SQL 쿼리를 확인해주세요"
@chief-of-staff "이메일을 분류해주세요"
@loop-operator "검증 루프를 실행해주세요"
```
