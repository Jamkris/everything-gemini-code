# 에이전트 레퍼런스

**언어:** [English](../agents/) | 한국어

전문화된 서브에이전트 목록입니다. Gemini CLI에서 `@agent-name` 구문으로 호출하세요.

---

## 핵심 에이전트

| 에이전트 | 설명 | 언제 사용 |
|---------|------|----------|
| [planner](planner.md) | 복잡한 기능 및 리팩토링을 위한 구현 계획 수립 | 새 기능 시작 전, 리팩토링 계획 시 |
| [architect](architect.md) | 시스템 설계 및 기술 의사결정 | 아키텍처 결정, 대규모 리팩토링 |
| [tdd-guide](tdd-guide.md) | 테스트 주도 개발 워크플로우 | 새 기능 또는 버그 수정 |
| [code-reviewer](code-reviewer.md) | 코드 품질, 보안, 유지보수성 리뷰 | 코드 작성/수정 후 |
| [security-reviewer](security-reviewer.md) | 취약점 분석 | 커밋 전, 프로덕션 배포 전 |

## 빌드 에러 해결

| 에이전트 | 설명 |
|---------|------|
| [build-error-resolver](build-error-resolver.md) | TypeScript/Node.js 빌드 에러 |
| [go-build-resolver](go-build-resolver.md) | Go 빌드 에러 |
| [cpp-build-resolver](cpp-build-resolver.md) | C++ CMake/컴파일 에러 |
| [java-build-resolver](java-build-resolver.md) | Java/Maven/Gradle 에러 |
| [kotlin-build-resolver](kotlin-build-resolver.md) | Kotlin/Gradle 에러 |
| [rust-build-resolver](rust-build-resolver.md) | Rust 컴파일 에러 |
| [pytorch-build-resolver](pytorch-build-resolver.md) | PyTorch/CUDA 훈련 에러 |

## 코드 리뷰

| 에이전트 | 설명 |
|---------|------|
| [go-reviewer](go-reviewer.md) | Go 관용구, 동시성, 에러 처리 |
| [python-reviewer](python-reviewer.md) | Python 코드 품질 및 안전성 |
| [typescript-reviewer](typescript-reviewer.md) | TypeScript/JavaScript 타입 안전성 |
| [java-reviewer](java-reviewer.md) | Java/Spring Boot 모범 사례 |
| [kotlin-reviewer](kotlin-reviewer.md) | Kotlin/Android/KMP 코드 |
| [rust-reviewer](rust-reviewer.md) | Rust 메모리 안전성, 소유권 |
| [cpp-reviewer](cpp-reviewer.md) | C++ 메모리 안전성, 현대적 관용구 |
| [database-reviewer](database-reviewer.md) | SQL 쿼리, 인덱스, RLS |
| [flutter-reviewer](flutter-reviewer.md) | Flutter/Dart 코드 리뷰 |

## 워크플로우 에이전트

| 에이전트 | 설명 |
|---------|------|
| [e2e-runner](e2e-runner.md) | Playwright E2E 테스트 생성 및 실행 |
| [refactor-cleaner](refactor-cleaner.md) | 사용하지 않는 코드 정리 |
| [doc-updater](doc-updater.md) | 문서 동기화 및 업데이트 |
| [docs-lookup](docs-lookup.md) | 문서 및 API 레퍼런스 조회 |

## 특수 에이전트

| 에이전트 | 설명 |
|---------|------|
| [chief-of-staff](chief-of-staff.md) | 이메일, Slack, LINE 등 커뮤니케이션 관리 |
| [loop-operator](loop-operator.md) | 자율 루프 실행 |
| [harness-optimizer](harness-optimizer.md) | 에이전트 하네스 설정 최적화 |
