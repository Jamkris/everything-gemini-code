**언어:** [English](../../en/contributing/TERMINOLOGY.md) | **한국어**

# Gemini CLI & Everything Gemini Code — 용어 사전

이 문서는 프로젝트 전반에서 사용되는 핵심 용어를 정의합니다.

---

## 핵심 용어

### 에이전트 (Agent)

위임된 작업을 제한된 범위 내에서 처리하는 전문화된 서브에이전트입니다. Gemini CLI에서 `@agent-name` 구문으로 호출됩니다.

- **frontmatter**: `name`, `description`, `tools` 필드로 정의
- **도구**: `read_file`, `run_shell_command`, `write_file` 등 Gemini 도구 사용
- **위치**: `agents/*.md` (저장소), `~/.gemini/agents/` (설치 후)

### 스킬 (Skill)

워크플로우 정의 및 도메인 지식의 모음입니다. 에이전트나 커맨드에 의해 참조됩니다.

- **큐레이티드 스킬**: `skills/<skill-name>/SKILL.md`에 위치 (저장소에 포함)
- **학습된 스킬**: `~/.gemini/skills/learned/`에 위치 (배포 안 됨)
- **임포트된 스킬**: `~/.gemini/skills/imported/`에 위치 (배포 안 됨)

### 커맨드 (Command)

빠른 실행을 위한 슬래시 커맨드입니다. Gemini CLI는 `.toml` 형식을 사용합니다.

```toml
description = "커맨드 설명"
prompt = '''
# 커맨드 내용
...
'''
```

- **Gemini CLI**: `.toml` 파일, `~/.gemini/commands/`에 위치
- **Antigravity**: `.md` 파일, 워크플로우로 사용

### 훅 (Hook)

도구 이벤트에 반응하여 자동으로 실행되는 트리거입니다. `hooks/hooks.json`에 정의됩니다.

### 룰 (Rule)

AI가 항상 따라야 하는 코딩 가이드라인입니다. `GEMINI.md`나 `~/.gemini/rules/`에 위치합니다.

---

## 도구 이름 매핑

Gemini CLI와 Claude Code는 도구 이름이 다릅니다:

| Claude Code | Gemini CLI |
|-------------|------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace_in_file` |
| `Bash` | `run_shell_command` |
| `Grep` | `search_files` |
| `Glob` | `list_directory` |

---

## 인스톨 경로

| 컴포넌트 | Gemini CLI | Antigravity |
|---------|-----------|------------|
| 에이전트 | `~/.gemini/agents/` | `~/.gemini/antigravity/global_agents/` |
| 스킬 | `~/.gemini/skills/` | `~/.gemini/antigravity/global_skills/` |
| 커맨드 | `~/.gemini/commands/` | (워크플로우 사용) |
| 룰 | `~/.gemini/rules/` | `~/.gemini/antigravity/global_rules/` |

---

## 하네스 (Harness)

AI 에이전트를 실행하는 환경 또는 플랫폼입니다:
- **Gemini CLI**: 터미널 기반
- **Antigravity**: IDE 통합형 (VS Code, Cursor)

---

## 프로비넌스 (Provenance)

학습되거나 임포트된 스킬의 출처 정보입니다. `.provenance.json` 파일에 기록됩니다.

필수 필드:
- `source`: 출처 (URL, 경로, 식별자)
- `created_at`: ISO 8601 타임스탬프
- `confidence`: 0–1 신뢰도 점수
- `author`: 스킬 생성자
