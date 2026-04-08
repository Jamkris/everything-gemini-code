# 기여 가이드

**언어:** [English](../../en/contributing/README.md) | **한국어**

Everything Gemini Code에 기여해 주셔서 감사합니다!

## 관련 문서

- [커맨드-에이전트 매핑](../../en/contributing/COMMAND-AGENT-MAP.md) — 각 커맨드가 호출하는 에이전트
- [스킬 배치 정책](../../en/contributing/SKILL-PLACEMENT-POLICY.md) — 스킬 파일 배치 규칙
- [토큰 최적화](../../en/contributing/token-optimization.md) — 토큰 사용량 관리
- [설치 검증 가이드](../../en/contributing/VERIFICATION_GUIDE.md) — 확장 설치 검증
- [용어 사전](TERMINOLOGY.md) — 프로젝트 용어 정의

---

## 기여 방법

### 새 에이전트 추가

1. `agents/your-agent.md` 파일을 생성하세요
2. Gemini CLI frontmatter 형식을 사용하세요:

```markdown
---
name: your-agent
description: 에이전트 설명. 언제 사용하는지 명시하세요.
tools: ["read_file", "run_shell_command"]
---

에이전트 내용...
```

**중요:** Gemini CLI는 `model` 필드를 지원하지 않으며, 도구 이름은 Gemini 형식을 사용합니다 (`read_file`, `run_shell_command` 등).

### 새 스킬 추가

1. `skills/your-skill-name/` 디렉토리를 생성하세요
2. `SKILL.md` 파일을 생성하세요:

```markdown
---
name: your-skill
description: 스킬 설명
---

# 스킬 제목

스킬 내용...
```

### 새 커맨드 추가

Gemini CLI 커맨드는 `.toml` 형식을 사용합니다:

1. `commands/your-command.toml` 파일을 생성하세요:

```toml
description = "커맨드 설명"
prompt = '''
# 커맨드 제목

커맨드 내용...
'''
```

---

## 품질 기준

### 에이전트 체크리스트

- [ ] 명확한 `description` (언제 사용하는지 포함)
- [ ] 올바른 Gemini 도구 이름 사용
- [ ] `model` 필드 없음
- [ ] 실행 가능한 지침 포함

### 스킬 체크리스트

- [ ] `SKILL.md`에 명확한 frontmatter
- [ ] 구체적이고 실행 가능한 워크플로우
- [ ] 예제 포함
- [ ] 800줄 미만

### 커맨드 체크리스트

- [ ] `.toml` 형식 사용
- [ ] 명확한 `description`
- [ ] `prompt` 필드에 완전한 지침

---

## PR 제출 방법

1. 저장소 포크
2. 기능 브랜치 생성: `git checkout -b feat/your-feature`
3. 변경사항 커밋: `git commit -m "feat: add your-feature"`
4. 브랜치 푸시: `git push origin feat/your-feature`
5. PR 제출

---

## 도구 이름 변환 (Claude → Gemini)

Claude Code 에이전트를 변환하는 경우:

| Claude Code | Gemini CLI |
|-------------|------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace_in_file` |
| `Bash` | `run_shell_command` |
| `Grep` | `search_files` |
| `Glob` | `list_directory` |
| `WebSearch` | `google_web_search` |

또한 `model: opus/sonnet` 필드를 제거하고, `Claude` 언급을 `Gemini`로 변경하세요.
