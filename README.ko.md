**Language:** [English](README.md) | **한국어** | [简体中文](README.zh-CN.md)

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Gemini CLI / Antigravity를 위한 종합 설정 스위트입니다.**

이 확장은 Gemini 개발 워크플로우를 강력하게 만들어줄 프로덕션 레벨의 에이전트, 스킬, 훅, 명령어, 규칙, 그리고 MCP 설정을 제공합니다.

---

## 🚀 빠른 시작

2분 안에 설정을 완료하세요:

### 사전 요구 사항 (Prerequisites)

최신 공식 Gemini CLI가 설치되어 있는지 확인하세요:

```bash
npm install -g @google/gemini-cli@latest
# 또는
npm update -g @google/gemini-cli
```

### 옵션 1: Gemini CLI를 통한 설치 (권장)

가장 간편한 설치 방법입니다. Gemini CLI용 확장이 자동으로 설정됩니다.

```bash
gemini extensions install https://github.com/Jamkris/everything-gemini-code
```

### 옵션 2: 스크립트를 통한 설치 (Antigravity 및 고급 사용자용)

**Antigravity** (VS Code / Cursor)를 사용하거나 설치를 커스터마이징해야 하는 경우 권장됩니다.

```bash
# 저장소 복제
git clone https://github.com/Jamkris/everything-gemini-code.git

# 설치 스크립트 실행
cd everything-gemini-code
./install.sh

# 대화형 프롬프트를 따라 설치 환경을 선택하세요:
# 1) Gemini CLI (표준)
# 2) Antigravity (VS Code / Cursor)
# 3) Both (둘 다)
```

### 옵션 2: 수동 설치 (고급)

직접 제어하거나 특정 컴포넌트만 커스터마이징하고 싶다면:

```bash
# 저장소 복제
git clone https://github.com/Jamkris/everything-gemini-code.git

# 에이전트 복사
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# 명령어 복사 (Gemini CLI 용)
cp everything-gemini-code/commands/*.toml ~/.gemini/commands/

# 워크플로우 복사 (Antigravity 용)
# 참고: Antigravity는 ~/.gemini/antigravity/global_workflows/ 경로를 사용합니다.
cp everything-gemini-code/workflows/*.md ~/.gemini/antigravity/global_workflows/

# 스킬 복사
cp -r everything-gemini-code/skills/* ~/.gemini/skills/

# 규칙 설치 (두 설치 방법 모두 필수)
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/
```

> **Antigravity 사용자 참고:**
> Antigravity를 위해 수동 설치하는 경우, 호환성을 위해 `~/.gemini/antigravity/` 하위 디렉토리(`global_agents`, `global_skills`, `global_rules`)에 복사하는 것이 좋습니다. `install.sh` 스크립트는 이를 자동으로 처리합니다.

### 옵션 3: Gemini CLI 확장 프로그램으로 설치 (개발자 모드)

이 저장소를 Gemini CLI 확장 프로그램으로 직접 링크할 수 있습니다. 이를 통해 변경 사항을 실시간으로 개발하고 테스트할 수 있습니다.

```bash
# 저장소 복제
git clone https://github.com/Jamkris/everything-gemini-code.git
cd everything-gemini-code

# 확장 프로그램 링크
gemini extensions link .
```

> ⚠️ **참고:** 규칙(Rules)은 확장 프로그램으로 자동 배포되지 않으므로 `~/.gemini/rules/` 또는 `~/.gemini/antigravity/global_rules/` 경로에 수동으로 설치해야 합니다.

---

## 💻 사용법

설치가 완료되면 Gemini CLI에서 새로운 기능들을 바로 사용할 수 있습니다.

### 슬래시 명령어 (Slash Commands)

커스텀 명령어로 워크플로우를 자동화하세요:

```bash
# 기능 구현 계획 수립
/plan "JWT 사용자 인증 기능 추가"

# TDD 워크플로우 시작
/tdd "사용자 서비스 생성"

# 코드 리뷰 실행
/code-review
```

### 에이전트 (Agents)

복잡한 작업을 전문 에이전트에게 위임하세요:

```bash
# 시스템 설계를 위한 아키텍트 에이전트 사용
@architect "마이크로서비스 아키텍처 설계해줘..."

# 보안 취약점 점검을 위한 보안 리뷰어 사용
@security-reviewer "이 파일의 인젝션 취약점 점검해줘"
```

### 스킬 (Skills)

Gemini는 "TDD 워크플로우"나 "백엔드 패턴"과 같이 요청과 관련된 스킬을 자동으로 활용합니다.

---

## 📦 구성 요소

이 확장은 완전한 개발 환경 설정을 포함합니다:

```
everything-gemini-code/
├── gemini-extension.json  # 확장 프로그램 매니페스트
├── agents/                # 전문 서브 에이전트 (@planner, @architect 등)
├── skills/                # 워크플로우 정의 (TDD, 패턴 등)
├── commands/              # Gemini CLI 명령어 (.toml)
├── workflows/             # Antigravity 워크플로우 (.md)
├── rules/                 # 코딩 가이드라인 (TypeScript, Python, Go)
├── hooks/                 # 자동화 트리거 (hooks.json)
└── mcp-configs/           # MCP 서버 설정
```

---

## 🤝 기여하기

**기여는 언제나 환영합니다!**

유용한 에이전트, 스킬, 설정이 있다면 Pull Request를 보내주세요.

---

## 📄 라이선스

MIT - 자유롭게 사용하고 수정하세요.
