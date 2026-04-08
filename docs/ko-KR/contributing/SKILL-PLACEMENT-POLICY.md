**언어:** [English](../../en/contributing/SKILL-PLACEMENT-POLICY.md) | **한국어**

# 스킬 배치 및 출처 정책

이 문서는 생성된 스킬, 임포트된 스킬, 큐레이팅된 스킬이 어디에 배치되고, 어떻게 식별되며, 확장과 함께 배포되는 항목이 무엇인지 정의합니다.

## 스킬 유형 및 배치

| 유형 | 경로 | 배포 여부 | 출처 정보 |
|------|------|----------|----------|
| 큐레이팅 | `skills/` (저장소) | 예 | 불필요 |
| 학습됨 | `~/.gemini/skills/learned/` | 아니오 | 필수 |
| 임포트됨 | `~/.gemini/skills/imported/` | 아니오 | 필수 |
| 진화됨 | `~/.gemini/skills/evolved/` | 아니오 | 인스팅트 출처 상속 |

큐레이팅된 스킬은 저장소의 `skills/` 아래에 위치합니다. 설치 매니페스트는 큐레이팅된 경로만 참조합니다. 생성되거나 임포트된 스킬은 사용자 홈 디렉토리에 위치하며 배포되지 않습니다.

## 큐레이팅된 스킬

위치: `skills/<skill-name>/`에 `SKILL.md` 파일 포함.

- 확장 매니페스트에 포함됨
- CI에서 검증됨
- 출처 파일 불필요. 기여 표시는 SKILL.md frontmatter의 `origin` 필드 사용

## 학습된 스킬

위치: `~/.gemini/skills/learned/<skill-name>/`

지속적 학습(evaluate-session 훅, `/learn` 커맨드)에 의해 생성됨.

- 저장소에 없음. 배포 안 됨
- `SKILL.md` 옆에 `.provenance.json` 파일 필수
- 디렉토리가 존재할 때 런타임에 로드됨

## 임포트된 스킬

위치: `~/.gemini/skills/imported/<skill-name>/`

외부 소스(URL, 파일 복사 등)에서 사용자가 설치한 스킬.

- 저장소에 없음. 배포 안 됨
- `SKILL.md` 옆에 `.provenance.json` 파일 필수

## 진화된 스킬 (지속적 학습 v2)

위치: `~/.gemini/skills/evolved/`

`/evolve` 커맨드에 의해 클러스터링된 인스팅트에서 생성됨.

- 저장소에 없음. 배포 안 됨
- 출처는 소스 인스팅트에서 상속됨. 별도 `.provenance.json` 불필요

## 출처 메타데이터

학습된 스킬과 임포트된 스킬에 필수. 파일: 스킬 디렉토리 내 `.provenance.json`

필수 필드:

| 필드 | 타입 | 설명 |
|------|------|------|
| source | string | 출처 (URL, 경로, 식별자) |
| created_at | string | ISO 8601 타임스탬프 |
| confidence | number | 0–1 신뢰도 |
| author | string | 스킬 생성자 |

## 배포 가능 vs 로컬 전용

| 배포 가능 | 로컬 전용 |
|----------|----------|
| `skills/*` (큐레이팅) | `~/.gemini/skills/learned/*` |
| | `~/.gemini/skills/imported/*` |
| | `~/.gemini/skills/evolved/*` |

큐레이팅된 스킬만 설치 매니페스트에 포함되고 설치 시 복사됩니다.

## Gemini CLI 도구 이름 차이

Claude Code에서 스킬 참조를 변환할 때 도구 이름이 다릅니다:

| Claude Code | Gemini CLI |
|-------------|------------|
| `Read` | `read_file` |
| `Write` | `write_file` |
| `Edit` | `replace_in_file` |
| `Bash` | `run_shell_command` |
| `Grep` | `search_files` |
| `Glob` | `list_directory` |
