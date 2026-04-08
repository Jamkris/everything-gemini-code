**언어:** [English](../../en/mcp-configs/README.md) | **한국어**

# MCP 서버 설정 모음

이 디렉토리에는 Gemini-CLI 및 Antigravity가 외부 도구 및 데이터 소스와 연결될 수 있도록 해주는 **Model Context Protocol (MCP)** 서버 설정 항목들이 포함되어 있습니다.

## MCP 서버 사용 가이드

Gemini CLI를 사용하면 MCP 서버를 쉽게 통합할 수 있습니다. 전역 설정(`~/.gemini.json`)이나 프로젝트 로컬 설정(`.gemini/settings.json`)에 서버를 정의할 수 있습니다.

### 1. 설정 파일 (Template)

`mcp-configs/mcp-servers.json` 파일에는 다음과 같은 다양한 서버 통합 예시가 종합적으로 마련되어 있습니다:

- **Stdio 방식 서버** (Python/Node)
- **Docker 기반 보조 서버**
- **HTTP / SSE 스트리밍 서버** (사용자 지정 인증 헤더 및 IAP/SA 계정 가장 지원)
- **도구 필터링** (`includeTools` / `excludeTools`를 통한 특정 기능 제어)

필요한 서버 블록을 복사하여 여러분의 환경 설정 파일의 `mcpServers` 항목에 붙여넣어 사용하세요.

### 2. 사용 가능한 명령어

CLI나 대화 모드에서 `/mcp` 명령어를 통해 서버 상태를 관리할 수 있습니다:

- `/mcp list` : 현재 연결된 서버 목록, 상태, 그리고 사용 가능한 도구들을 확인합니다.
- `/mcp add <이름> <명령어> [인수...]` : 새로운 stdio 서버를 즉석에서 추가합니다.
- `/mcp remove <이름>` : 서버 설정을 삭제합니다.
- `/mcp enable <이름>` / `/mcp disable <이름>` : 특정 서버를 일시적으로 활성화하거나 비활성화합니다.

### 3. 작동 방식

서버가 연결되고 도구가 등록(Discovery)되면, Gemini는 대화 문맥에 맞춰 연결된 도구를 **자동으로 판단하여 실행**합니다. 사용자가 명시적으로 복잡한 도구 호출 명령을 내릴 필요가 없습니다.
