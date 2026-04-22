**언어:** [English](../../README.md) | **한국어** | [简体中文](../zh-CN/README.md)

> **출처:** 이 프로젝트는 [@affaan-m](https://github.com/affaan-m)의 [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)를 Gemini CLI 생태계로 마이그레이션하여 만들었습니다. 원본 프로젝트에 감사드립니다.

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)
![Shell](https://img.shields.io/badge/-Shell-4EAA25?logo=gnu-bash&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white)

**Gemini CLI / Antigravity를 위한 종합 설정 및 에이전트 시스템.**

단순한 설정 파일 모음이 아닙니다. 에이전트, 스킬, 훅, 커맨드, 룰, MCP 설정을 아우르는 완전한 시스템입니다.
실제 프로덕트를 만들며 매일 집중적으로 사용해 발전시킨 프로덕션 레벨의 설정이 포함되어 있습니다.

**Gemini CLI**, **Antigravity** 등 다양한 AI 에이전트 환경에서 사용할 수 있습니다.

---

## 🚀 빠른 시작

### 1단계: Gemini CLI 설치

```bash
npm install -g @google/gemini-cli@latest
```

### 2단계: API 키 설정

1. [Google AI Studio](https://aistudio.google.com/)에서 API 키를 발급받으세요.
2. 환경 변수로 설정하세요:

```bash
export GEMINI_API_KEY="your_api_key_here"
```

### 3단계: 확장 설치 (권장)

```bash
gemini extensions install https://github.com/Jamkris/everything-gemini-code
```

Antigravity 사용자는 스크립트를 사용하세요:

```bash
# Antigravity용 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Jamkris/everything-gemini-code/main/scripts/install.sh)" -- --antigravity

# CLI + Antigravity 모두 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Jamkris/everything-gemini-code/main/scripts/install.sh)" -- --all
```

### 4단계: 사용 시작

```bash
# 기능 구현 계획
/egc-plan "사용자 인증 추가"

# TDD 워크플로우 시작
/egc-tdd "사용자 서비스 생성"

# 코드 리뷰 실행
/egc-code-review

# 에이전트 직접 호출
@architect "마이크로서비스 아키텍처 설계"
@security-reviewer "이 파일의 인젝션 취약점 감사"
```

> **Antigravity 사용자 참고:** 워크플로우는 bare name 으로 설치됩니다
> (예: `/tdd`, `/code-review`, `/build-fix`). Antigravity 내장 `/plan` 과
> 충돌하는 `/egc-plan` 에만 `egc-` 프리픽스가 붙습니다. Gemini CLI 에서는
> 내장 커맨드 충돌 방지를 위해 모든 커맨드가 `egc-` 프리픽스를 사용합니다.

✨ **완료!** 이제 28개 에이전트, 125개 스킬, 60개 커맨드를 사용할 수 있습니다.

---

## 📦 구성 요소

이 확장은 완전한 개발 환경 설정을 제공합니다:

```
everything-gemini-code/
├── gemini-extension.json  # 확장 매니페스트
│
├── agents/                # 전문 서브에이전트 (28개)
│   ├── planner.md           # 기능 구현 계획
│   ├── architect.md         # 시스템 설계 의사결정
│   ├── tdd-guide.md         # 테스트 주도 개발
│   ├── code-reviewer.md     # 품질 및 보안 리뷰
│   ├── security-reviewer.md # 취약점 분석
│   ├── build-error-resolver.md  # 빌드 에러 해결
│   ├── e2e-runner.md        # Playwright E2E 테스팅
│   ├── refactor-cleaner.md  # 사용하지 않는 코드 정리
│   ├── doc-updater.md       # 문서 동기화
│   ├── docs-lookup.md       # 문서/API 조회
│   ├── chief-of-staff.md    # 커뮤니케이션 관리 및 초안 작성
│   ├── loop-operator.md     # 자율 루프 실행
│   ├── harness-optimizer.md # 하네스 설정 튜닝
│   ├── cpp-reviewer.md      # C++ 코드 리뷰
│   ├── cpp-build-resolver.md   # C++ 빌드 에러 해결
│   ├── go-reviewer.md       # Go 코드 리뷰
│   ├── go-build-resolver.md # Go 빌드 에러 해결
│   ├── python-reviewer.md   # Python 코드 리뷰
│   ├── database-reviewer.md # 데이터베이스 리뷰
│   ├── typescript-reviewer.md  # TypeScript/JavaScript 코드 리뷰
│   ├── java-reviewer.md     # Java/Spring Boot 코드 리뷰
│   ├── java-build-resolver.md  # Java/Maven/Gradle 빌드 에러
│   ├── kotlin-reviewer.md   # Kotlin/Android/KMP 코드 리뷰
│   ├── kotlin-build-resolver.md # Kotlin/Gradle 빌드 에러
│   ├── rust-reviewer.md     # Rust 코드 리뷰
│   ├── rust-build-resolver.md  # Rust 빌드 에러 해결
│   └── pytorch-build-resolver.md # PyTorch/CUDA 훈련 에러
│
├── skills/                # 워크플로우 정의 및 도메인 지식 (125개)
│   ├── coding-standards/          # 언어 모범 사례
│   ├── backend-patterns/          # API, 데이터베이스, 캐싱 패턴
│   ├── frontend-patterns/         # React, Next.js 패턴
│   ├── continuous-learning/       # 세션에서 패턴 자동 추출
│   ├── continuous-learning-v2/    # 신뢰도 점수가 있는 직관 기반 학습
│   ├── tdd-workflow/              # TDD 방법론
│   ├── security-review/           # 보안 체크리스트
│   ├── eval-harness/              # 검증 루프 평가
│   ├── verification-loop/         # 지속적 검증
│   ├── golang-patterns/           # Go 관용구 및 모범 사례
│   ├── golang-testing/            # Go 테스팅 패턴
│   ├── python-patterns/           # Python 관용구 및 모범 사례
│   ├── python-testing/            # pytest 테스팅 패턴
│   ├── java-coding-standards/     # Java 코딩 스탠다드
│   ├── kotlin-patterns/           # Kotlin/Android 패턴
│   ├── rust-patterns/             # Rust 패턴
│   ├── cpp-coding-standards/      # C++ 코딩 스탠다드
│   ├── springboot-patterns/       # Java Spring Boot 패턴
│   ├── django-patterns/           # Django 패턴
│   ├── laravel-patterns/          # Laravel 아키텍처 패턴
│   ├── docker-patterns/           # Docker Compose, 컨테이너 패턴
│   ├── database-migrations/       # 마이그레이션 패턴 (Prisma, Drizzle 등)
│   ├── api-design/                # REST API 설계
│   ├── deployment-patterns/       # CI/CD, Docker, 헬스체크
│   ├── e2e-testing/               # Playwright E2E 패턴
│   ├── search-first/              # 리서치-먼저 개발 워크플로우
│   └── 그 외 100개+ 스킬...
│
├── commands/              # Gemini CLI 커맨드 (.toml, 60개)
│   ├── plan.toml            # /egc-plan - 구현 계획
│   ├── tdd.toml             # /egc-tdd - 테스트 주도 개발
│   ├── code-review.toml     # /egc-code-review - 코드 리뷰
│   ├── build-fix.toml       # /egc-build-fix - 빌드 에러 수정
│   ├── e2e.toml             # /egc-e2e - E2E 테스트 생성
│   ├── refactor-clean.toml  # /egc-refactor-clean - 코드 정리
│   ├── security-scan.toml   # /security-scan - 보안 스캔 (AgentShield)
│   ├── update-docs.toml     # /egc-update-docs - 문서 업데이트
│   └── 그 외 50개+ 커맨드...
│
├── workflows/             # Antigravity 워크플로우 (.md)
│
├── templates/             # GEMINI.md 규칙 템플릿
│   ├── GEMINI_GLOBAL.md     # 공통 규칙
│   ├── GEMINI_TS.md         # TypeScript/JavaScript 전용
│   ├── GEMINI_PYTHON.md     # Python 전용
│   └── GEMINI_GO.md         # Go 전용
│
├── hooks/                 # 자동화 트리거 (hooks.json)
│
└── mcp-configs/           # MCP 서버 설정
```

---

## 🌐 크로스 플랫폼 지원

이 확장은 **Gemini CLI** 및 **Antigravity**를 완벽하게 지원합니다.

| 플랫폼 | 경로 | 설치 방법 |
|--------|------|----------|
| **Gemini CLI** | `~/.gemini/` | `gemini extensions install` |
| **Antigravity** | `~/.gemini/antigravity/` | `install.sh --antigravity` |
| **수동** | 직접 복사 | `git clone` + 수동 복사 |

---

## 🔧 수동 설치

설치할 항목을 직접 선택하고 싶다면:

```bash
# 저장소 클론
git clone https://github.com/Jamkris/everything-gemini-code.git

# 에이전트 복사
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# 커맨드 복사 (Gemini CLI)
cp everything-gemini-code/commands/*.toml ~/.gemini/commands/

# 스킬 복사
cp -r everything-gemini-code/skills/* ~/.gemini/skills/

```

> **규칙 설치:** 규칙은 `install.sh`를 통해 `~/.gemini/GEMINI.md`에 통합됩니다.
> 수동 설치 시: `cp everything-gemini-code/templates/GEMINI_GLOBAL.md ~/.gemini/GEMINI.md`
> TypeScript 규칙 추가: `cat everything-gemini-code/templates/GEMINI_TS.md >> ~/.gemini/GEMINI.md`
>
> **Antigravity 사용자:**
> Antigravity용으로 수동 설치 시 `~/.gemini/antigravity/` 하위 디렉토리(`global_agents`, `global_skills`)에 복사하는 것을 권장합니다. `install.sh` 스크립트가 이를 자동으로 처리합니다.

---

## 🎯 핵심 개념

### 에이전트

서브에이전트가 제한된 범위 내에서 위임된 작업을 처리합니다. 예시:

```markdown
---
name: code-reviewer
description: 코드의 품질, 보안, 유지보수성을 리뷰합니다
tools: ["read_file", "run_shell_command"]
---

당신은 시니어 코드 리뷰어입니다...
```

### 스킬

스킬은 커맨드나 에이전트에 의해 호출되는 워크플로우 정의입니다:

```markdown
# TDD 워크플로우

1. 인터페이스를 먼저 정의
2. 실패하는 테스트 작성 (RED)
3. 최소한의 코드 구현 (GREEN)
4. 리팩토링 (IMPROVE)
5. 80% 이상 커버리지 확인
```

### 커맨드 (.toml 형식)

Gemini CLI 커맨드는 `.toml` 형식을 사용합니다:

```toml
description = "Fix TypeScript and build errors"
prompt = '''
# Build and Fix

Incrementally fix build errors:
1. Run build, parse errors
2. Fix one error at a time
3. Verify after each fix
'''
```

---

## 🗺️ 어떤 에이전트를 사용해야 할까?

| 하고 싶은 것 | 사용할 커맨드 | 사용되는 에이전트 |
|-------------|-------------|--------------------|
| 새 기능 계획하기 | `/egc-plan "인증 추가"` | planner |
| 시스템 아키텍처 설계 | `@architect "설계해줘"` | architect |
| 테스트를 먼저 작성하며 코딩 | `/egc-tdd` | tdd-guide |
| 방금 작성한 코드 리뷰 | `/egc-code-review` | code-reviewer |
| 빌드 실패 수정 | `/egc-build-fix` | build-error-resolver |
| E2E 테스트 실행 | `/egc-e2e` | e2e-runner |
| 보안 취약점 찾기 | `@security-reviewer "감사해줘"` | security-reviewer |
| 사용하지 않는 코드 제거 | `/egc-refactor-clean` | refactor-cleaner |
| 문서 업데이트 | `/egc-update-docs` | doc-updater |
| Go 코드 리뷰 | `/egc-go-review` | go-reviewer |
| Python 코드 리뷰 | `/egc-python-review` | python-reviewer |
| TypeScript 코드 리뷰 | `@typescript-reviewer` | typescript-reviewer |
| 데이터베이스 쿼리 감사 | `@database-reviewer` | database-reviewer |

### 일반적인 워크플로우

**새로운 기능 시작:**
```
/egc-plan "OAuth를 사용한 사용자 인증 추가"
                                → planner가 구현 청사진 작성
/egc-tdd                            → tdd-guide가 테스트 먼저 작성 강제
/egc-code-review                    → code-reviewer가 코드 검토
```

**버그 수정:**
```
/egc-tdd                            → tdd-guide: 버그를 재현하는 실패 테스트 작성
                                → 수정 구현, 테스트 통과 확인
/egc-code-review                    → code-reviewer: 회귀 검사
```

**프로덕션 준비:**
```
@security-reviewer "보안 감사"   → OWASP Top 10 감사
/egc-e2e                            → e2e-runner: 핵심 사용자 흐름 테스트
/egc-test-coverage                  → 80% 이상 커버리지 확인
```

---

## ❓ FAQ

<details>
<summary><b>Gemini CLI vs Antigravity 어떤 걸 써야 하나요?</b></summary>

- **Gemini CLI**: 터미널 기반 사용. 커맨드는 `.toml` 형식.
- **Antigravity**: VS Code/Cursor IDE 내에서 사용. 워크플로우는 `.md` 형식.
- 두 환경 모두 에이전트와 스킬은 공유합니다.

</details>

<details>
<summary><b>스킬 충돌 경고가 나타나요</b></summary>

이전에 수동으로 설치한 스킬과 충돌이 발생하는 것입니다. 로컬 버전을 제거하고 확장의 관리 스킬을 사용하세요:

```bash
rm -rf ~/.gemini/skills/* ~/.gemini/commands/*
```

</details>

<details>
<summary><b>일부 컴포넌트만 사용할 수 있나요?</b></summary>

네. 수동 설치를 사용하여 필요한 것만 복사하세요:

```bash
# 에이전트만
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# 커맨드만
cp everything-gemini-code/commands/*.toml ~/.gemini/commands/
```

각 컴포넌트는 완전히 독립적입니다.

</details>

<details>
<summary><b>새 스킬이나 에이전트를 기여하고 싶어요</b></summary>

기여를 환영합니다! 간단히 말하면:
1. 저장소를 포크
2. `skills/your-skill-name/SKILL.md`에 스킬 생성
3. 또는 `agents/your-agent.md`에 에이전트 생성
4. 명확한 설명과 함께 PR 제출

</details>

---

## 토큰 최적화

Gemini API 사용 비용이 부담된다면 토큰 소비를 관리해야 합니다.

### 권장 설정

`~/.gemini/settings.json`에 추가:

```json
{
  "model": "gemini-2.0-flash",
  "contextWindowSize": "medium"
}
```

### 일상 워크플로우 팁

| 상황 | 권장 사항 |
|------|----------|
| 대부분의 코딩 작업 | `gemini-2.0-flash` 사용 |
| 복잡한 아키텍처 설계 | `gemini-2.5-pro` 사용 |
| MCP 서버 | 프로젝트别로 필요한 것만 활성화 |
| 컨텍스트 관리 | 관련 없는 작업 시 새 세션 시작 |

---

## ⚠️ 문제 해결

### 스킬 충돌

이전에 수동으로 설치한 스킬과의 충돌:
```bash
rm -rf ~/.gemini/skills/* ~/.gemini/commands/*
# 그 후 다시 설치
gemini extensions install https://github.com/Jamkris/everything-gemini-code
```

### API 키 오류

```bash
# API 키 확인
echo $GEMINI_API_KEY

# .env 파일에 저장 (선택사항)
echo 'export GEMINI_API_KEY="your_key"' >> ~/.zshrc
source ~/.zshrc
```

### 에이전트 찾을 수 없음

```bash
# 에이전트 위치 확인
ls ~/.gemini/agents/

# 없으면 수동 복사
cp /path/to/everything-gemini-code/agents/*.md ~/.gemini/agents/
```

---

## 🤝 기여하기

**기여를 환영합니다.**

이 저장소는 커뮤니티 리소스로 만들어졌습니다.

기여 아이디어:
- 언어별 스킬 및 코딩 스탠다드
- 프레임워크별 패턴 (Rails, FastAPI, NestJS 등)
- DevOps 에이전트 (Kubernetes, Terraform, AWS)
- MCP 서버 설정
- 다국어 번역

---

## 🔗 링크

- **Gemini CLI 공식 문서:** [Google Gemini CLI](https://github.com/google-gemini/gemini-cli)
- **Google AI Studio:** [aistudio.google.com](https://aistudio.google.com/)
- **Antigravity:** IDE 통합 환경

---

## 📄 라이선스

MIT - 자유롭게 사용하고, 필요에 따라 수정하고, 가능하다면 기여해 주세요.

---

**이 저장소가 도움이 되었다면 Star를 눌러주세요. 멋진 것을 만드세요.**
