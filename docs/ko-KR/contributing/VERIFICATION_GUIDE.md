**언어:** [English](../../en/contributing/VERIFICATION_GUIDE.md) | **한국어**

# Gemini CLI 확장 설치 검증 가이드

이 가이드는 `everything-gemini-code` 확장이 올바르게 설치되고 정상 작동하는지 확인하는 방법을 설명합니다.

## 1. 설치 확인

`gemini extensions install https://github.com/Jamkris/everything-gemini-code` 실행 후 다음을 확인하세요:

### 1단계: 확장 디렉토리 확인

확장 파일이 존재하는지 확인합니다:

```bash
ls ~/.gemini/extensions/everything-gemini-code
# agents, skills, scripts, commands 등이 표시되어야 합니다
```

### 2단계: 세션 시작 트리거 (중요)

확장은 세션이 시작될 때 자동으로 커맨드 별칭(shim)을 설정합니다.
확장을 방금 설치했다면 **세션을 한 번 시작해야** 합니다.

아무 명령이나 실행하여 세션을 시작하세요:

```bash
gemini run "echo '세션 초기화 중...'"
```

### 3단계: 커맨드 확인

커맨드가 올바르게 로드되었는지 확인합니다:

```bash
# Gemini CLI 내에서
/egc-tdd
```

TDD 가이드 에이전트가 로드되어야 합니다.

## 2. 기능 검증

### `/egc-tdd` 커맨드 테스트

1. Gemini 세션 시작: `gemini`
2. `/egc-tdd` 입력 후 Enter
3. **TDD Guide** 에이전트가 확장에서 로드되어야 합니다

### 훅 테스트

1. 더미 `.ts` 파일 생성: `touch test.ts`
2. Gemini가 `suggest-compact` 등의 훅을 트리거해야 합니다
3. `~/.gemini/scripts/hooks/` 확인 — 확장의 훅을 로드하려고 시도해야 합니다

## 문제 해결

`/egc-tdd` 커맨드가 없거나 작동하지 않는 경우:

1. **로그 확인:**
   출력에서 `[SessionStart]` 오류를 확인하세요.

2. **수동 설치 (대안):**
   자동 설정이 실패하면 설치 스크립트를 수동으로 실행하세요:
   ```bash
   cd ~/.gemini/extensions/everything-gemini-code
   ./scripts/install.sh --cli
   ```
