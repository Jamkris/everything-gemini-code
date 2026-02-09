**언어:** [English](README.md) | **한국어** | [简体中文](README.zh-CN.md) | [繁體中文](docs/zh-TW/README.md)

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Anthropic 해커톤 우승팀의 Gemini CLI 설정 모음집입니다.**

실제 프로덕트 개발에 매일 사용하며 발전시킨 에이전트, 스킬, 훅, 명령어, 규칙 및 MCP 설정들이 포함되어 있습니다.

---

## 🚀 빠른 시작

2분 안에 설정을 완료하세요:

### 1단계: 플러그인 설치 (권장)

```bash
# 마켓플레이스 추가
/plugin marketplace add Jamkris/everything-gemini-code

# 플러그인 설치
/plugin install everything-gemini-code@everything-gemini-code
```

### 2단계: 규칙(Rules) 설치 (필수)

> ⚠️ **중요:** Gemini CLI 플러그인은 `rules`를 자동으로 배포하지 못합니다. 수동으로 설치해야 합니다:

```bash
# 리포지토리 클론
git clone https://github.com/Jamkris/everything-gemini-code.git

# 공통 규칙 설치 (필수)
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/

# 언어별 규칙 설치 (사용하는 스택 선택)
cp -r everything-gemini-code/rules/typescript/* ~/.gemini/rules/
cp -r everything-gemini-code/rules/python/* ~/.gemini/rules/
cp -r everything-gemini-code/rules/golang/* ~/.gemini/rules/
```

### 3단계: 사용 시작

```bash
# 명령어 시도
/plan "사용자 인증 기능 추가"

# 사용 가능한 명령어 확인
/plugin list everything-gemini-code@everything-gemini-code
```

---

## 📦 구성 요소

이 저장소는 **Gemini CLI 플러그인**입니다. 직접 설치하거나 필요한 컴포넌트만 수동으로 복사하여 사용할 수 있습니다.

```
everything-gemini-code/
├── gemini-extension.json # 플러그인 메타데이터
├── agents/               # 특정 작업을 위한 서브 에이전트
│   ├── planner.md        # 기능 구현 계획
│   ├── architect.md      # 시스템 설계
│   ├── code-reviewer.md  # 코드 리뷰
│   └── ...
├── skills/               # 워크플로우 정의 및 도메인 지식
│   ├── coding-standards/ # 언어별 모범 사례
│   ├── backend-patterns/ # 백엔드 패턴
│   └── ...
├── commands/             # 슬래시 명령어 (/plan, /tdd 등)
├── rules/                # 항시 적용되는 가이드라인 (Common + 언어별)
├── hooks/                # 자동화 트리거 (hooks.json)
└── mcp-configs/          # MCP 서버 설정 (GitHub, Supabase 등)
```

## 🎯 주요 개념

### 에이전트 (Agents)

제한된 범위를 가진 서브 에이전트가 위임된 작업을 처리합니다. 예: `code-reviewer`, `security-reviewer`.

### 스킬 (Skills)

명령어 또는 에이전트에 의해 호출되는 워크플로우 정의입니다. 예: `TDD Workflow`, `Security Review`.

### 훅 (Hooks)

도구 사용 이벤트에 따라 실행됩니다. 예: `console.log` 사용 시 경고 표시.

### 규칙 (Rules)

항상 따러야 할 가이드라인입니다. `common/` (언어 무관)과 언어별 디렉토리로 구성됩니다.

---

## 🤝 기여하기

**기여는 언제나 환영합니다.**

유용한 에이전트, 스킬, 훅, MCP 설정 등이 있다면 공유해주세요! 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 확인하세요.

## 📄 라이선스

MIT - 자유롭게 사용하고 수정하세요.
