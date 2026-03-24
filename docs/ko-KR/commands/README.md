# 커맨드 레퍼런스

**언어:** [English](../../COMMANDS.md) | 한국어

Gemini CLI 커맨드는 `.toml` 형식으로 정의됩니다. 슬래시(`/`)로 호출합니다.

---

## 핵심 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/plan` | 기능 구현 계획 수립 |
| `/tdd` | 테스트 주도 개발 워크플로우 |
| `/code-review` | 코드 품질 및 보안 리뷰 |
| `/build-fix` | 빌드 에러 자동 수정 |
| `/e2e` | E2E 테스트 생성 및 실행 |
| `/refactor-clean` | 사용하지 않는 코드 제거 |
| `/verify` | 검증 루프 실행 |
| `/eval` | 기준에 따른 평가 |

## Go 언어 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/go-build` | Go 빌드 에러 수정 |
| `/go-review` | Go 코드 리뷰 |
| `/go-test` | Go TDD 워크플로우 |

## Python 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/python-review` | Python 코드 리뷰 |

## Kotlin/Java 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/kotlin-build` | Kotlin/Gradle 빌드 에러 수정 |
| `/kotlin-review` | Kotlin 코드 리뷰 |
| `/kotlin-test` | Kotlin TDD 워크플로우 |

## Rust 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/rust-build` | Rust 빌드 에러 수정 |
| `/rust-review` | Rust 코드 리뷰 |
| `/rust-test` | Rust 테스팅 워크플로우 |

## C++ 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/cpp-build` | C++ CMake 빌드 에러 수정 |
| `/cpp-review` | C++ 코드 리뷰 |
| `/cpp-test` | C++ 테스팅 워크플로우 |

## 문서 및 유지보수

| 커맨드 | 설명 |
|--------|------|
| `/update-docs` | 문서 업데이트 |
| `/update-codemaps` | 코드맵 업데이트 |
| `/test-coverage` | 테스트 커버리지 분석 |
| `/checkpoint` | 검증 상태 저장 |

## 학습 및 진화

| 커맨드 | 설명 |
|--------|------|
| `/learn` | 세션에서 패턴 추출 |
| `/learn-eval` | 패턴 추출 및 평가 |
| `/evolve` | 인스팅트를 스킬로 클러스터링 |
| `/instinct-status` | 학습된 인스팅트 확인 |
| `/instinct-import` | 인스팅트 가져오기 |
| `/instinct-export` | 인스팅트 내보내기 |

## 멀티 에이전트 오케스트레이션

| 커맨드 | 설명 |
|--------|------|
| `/orchestrate` | 멀티 에이전트 조정 |
| `/multi-plan` | 멀티 에이전트 작업 분해 |
| `/multi-execute` | 오케스트레이션된 멀티 에이전트 워크플로우 |
| `/multi-backend` | 백엔드 멀티 서비스 오케스트레이션 |
| `/multi-frontend` | 프론트엔드 멀티 서비스 오케스트레이션 |
| `/multi-workflow` | 일반 멀티 서비스 워크플로우 |

## 세션 관리

| 커맨드 | 설명 |
|--------|------|
| `/sessions` | 세션 히스토리 관리 |
| `/save-session` | 세션 저장 |
| `/resume-session` | 세션 재개 |
| `/pm2` | PM2 서비스 라이프사이클 관리 |

## 스킬 관리

| 커맨드 | 설명 |
|--------|------|
| `/skill-create` | git 히스토리에서 스킬 생성 |
| `/skill-health` | 스킬 및 커맨드 품질 감사 |

---

## 커맨드 형식 예시

Gemini CLI 커맨드는 `.toml` 형식을 사용합니다:

```toml
description = "커맨드 설명"
prompt = '''
# 커맨드 제목

커맨드 내용...

1. 첫 번째 단계
2. 두 번째 단계
'''
```

Claude Code와 달리 Gemini CLI 커맨드에는 `model` 필드가 없습니다.
