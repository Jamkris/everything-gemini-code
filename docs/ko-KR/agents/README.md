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
| [csharp-reviewer](csharp-reviewer.md) | C# .NET 규칙, async, nullable |
| [dart-build-resolver](dart-build-resolver.md) | Dart/Flutter 빌드 에러 |

## 분석 에이전트

| 에이전트 | 설명 |
|---------|------|
| [code-architect](code-architect.md) | 기능 아키텍처 및 구현 블루프린트 |
| [code-explorer](code-explorer.md) | 코드베이스 분석 및 패턴 발견 |
| [code-simplifier](code-simplifier.md) | 코드 명확성 및 리팩토링 |
| [comment-analyzer](comment-analyzer.md) | PR 코멘트 및 대화 분석 |
| [conversation-analyzer](conversation-analyzer.md) | 세션 동작 분석 (훅 생성용) |
| [performance-optimizer](performance-optimizer.md) | 성능 프로파일링 및 최적화 |
| [silent-failure-hunter](silent-failure-hunter.md) | 숨겨진 에러 및 무음 실패 탐지 |
| [type-design-analyzer](type-design-analyzer.md) | 타입 시스템 설계 리뷰 |
| [pr-test-analyzer](pr-test-analyzer.md) | PR 테스트 커버리지 분석 |

## GAN 하네스 에이전트

| 에이전트 | 설명 |
|---------|------|
| [gan-evaluator](gan-evaluator.md) | GAN 하네스 평가 에이전트 |
| [gan-generator](gan-generator.md) | GAN 하네스 생성 에이전트 |
| [gan-planner](gan-planner.md) | GAN 하네스 계획 에이전트 |

## 오픈소스 에이전트

| 에이전트 | 설명 |
|---------|------|
| [opensource-forker](opensource-forker.md) | 저장소 포크 및 오픈소스용 정리 |
| [opensource-packager](opensource-packager.md) | 오픈소스 패키징 생성 |
| [opensource-sanitizer](opensource-sanitizer.md) | 시크릿 및 민감 데이터 제거 |

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
| [healthcare-reviewer](healthcare-reviewer.md) | 헬스케어/HIPAA 규정 준수 리뷰 |
| [seo-specialist](seo-specialist.md) | SEO 분석 및 최적화 |
