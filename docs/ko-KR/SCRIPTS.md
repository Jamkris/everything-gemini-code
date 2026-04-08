# 스크립트 레퍼런스

**언어:** [English](../en/SCRIPTS.md) | **한국어**

이 디렉토리는 Everything Gemini Code 저장소를 유지 관리하기 위한 유틸리티 스크립트 모음입니다.

> **참고:**
> 이전 Claude Code 시절의 레거시 설치 스크립트(`ecc.js`, `claw.js`, `install-plan.js` 등)는 완전히 제거되었습니다. Gemini CLI는 자체 Extension 시스템(`gemini extensions`)을 통해 환경, 컨텍스트 및 설치 상태를 기본적으로 관리합니다.

---

## 사용 가능한 스크립트

### 거버넌스 및 품질

| 스크립트 | 설명 |
|----------|------|
| `harness-audit.js` | 핵심 Gemini CLI 규칙에 대한 저장소 상태를 검사(Audit)합니다. 토큰/컨텍스트 최적화 가이드 제공 여부, 훅 구성 파일, Eval 커버리지, 보안 가드레일 등을 평가합니다. <br><br> **사용법:** `node scripts/harness-audit.js --scope repo` |
| `release.sh` | `package.json`, `gemini-extension.json`, `.gemini-plugin/plugin.json` 세 파일의 버전을 동기화하고, 커밋 및 버전 태그(`v*`)를 생성합니다. <br><br> **사용법:** `./scripts/release.sh <version>` |

### 문서 자동 생성

| 스크립트 | 설명 |
|----------|------|
| `generate-docs.js` | `skills/` 디렉토리를 스캔하여 메인 `README.md`에 지원하는 스킬 및 커맨드 목록을 자동으로 렌더링하고 동기화합니다. <br><br> **사용법:** `node scripts/generate-docs.js` |
| `generate-command-docs.js` | `commands/` 디렉토리 내의 `.toml` 명령 파일들을 스캔하여 마크다운 레퍼런스 인덱스 문서를 생성하거나 업데이트합니다. <br><br> **사용법:** `node scripts/generate-command-docs.js` |

### 마이그레이션 및 포매팅

| 스크립트 | 설명 |
|----------|------|
| `migrate-commands.js` | 과거 Claude 기반의 `.md` 형식 명령어들을 Gemini CLI에서 요구하는 `.toml` 형식으로 변환하는 과정을 도와줍니다. <br><br> **사용법:** `node scripts/migrate-commands.js <source-dir> <dest-dir>` |
| `setup-package-manager.js` | 저장소 관리에 일관된 패키지 매니저(예: `npm`, `pnpm` 등)와 올바른 Node 버전이 사용되도록 강제하여 잠금 파일(`package-lock.json`) 변경 시 충돌을 방지합니다. <br><br> **사용법:** `node scripts/setup-package-manager.js` |
| `skill-create-output.js` | Git 변경 내역을 바탕으로 새로운 `SKILL.md`를 자동 생성할 때 LLM의 응답 출력 포맷을 검증하고, 불필요한 마크다운을 린팅하는 포매터입니다. |

---

## 새 스크립트 기여 방법

이 디렉토리에 새로운 스크립트를 추가하시려면 아래 규칙을 따라주세요.
1. Gemini CLI의 기본 동작(명령어 교체 상태 관리, 파일 조작 핫스와핑, 전용 REPL 등)을 흉내내거나 중복 구현하려 시도하지 마세요.
2. 독립적으로 실행 가능한 Node.js 단위 스크립트여야 합니다.
3. 스크립트의 실행 방법과 목적을 이 `ko-KR/README.md` 문서와 영문 `README.md` 문서에 각각 업데이트해 주세요.
