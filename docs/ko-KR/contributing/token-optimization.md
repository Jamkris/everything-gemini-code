**언어:** [English](../../en/contributing/token-optimization.md) | **한국어**

# 토큰 최적화 가이드

## 개요

Gemini CLI에서 토큰 사용량을 관리하는 것은 비용과 성능 모두에 중요합니다.

## 모델 선택

### 권장 모델

| 작업 | 모델 | 이유 |
|------|------|------|
| 대부분의 코딩 작업 | `gemini-2.0-flash` | 빠르고 비용 효율적 |
| 복잡한 아키텍처 | `gemini-2.5-pro` | 심층 추론 |
| 간단한 쿼리 | `gemini-2.0-flash-lite` | 최소 비용 |

### 설정

`~/.gemini/settings.json`에서 기본 모델을 설정하세요:

```json
{
  "model": "gemini-2.0-flash"
}
```

또는 환경 변수로 세션별 설정:

```bash
export GEMINI_MODEL=gemini-2.5-pro
```

## 컨텍스트 윈도우 관리

### MCP 서버 최적화

각 활성 MCP 서버는 컨텍스트 토큰을 소비합니다. 모범 사례:

- 프로젝��당 10개 미만의 MCP 서버 활성화
- 사용하지 않는 서버는 프로젝트 설정에서 비활성화
- `mcp-configs/`에서 프로젝트별 MCP 설정 사용

### 세션 관리

- 관련 없는 작업은 새 세션에서 시작
- 컨텍스트 집약적 작업 전에 `/checkpoint`으로 상태 저장
- `/sessions`으��� 과거 세션을 확인하고 재개

## 스킬 로딩 최적화

스킬은 참조될 때 온디맨드로 로드됩니다. 최적화 방법:

1. **구체적으로**: 필요한 스킬만 참조
2. **핵심 스킬 사용**: `coding-standards`, `backend-patterns`, `tdd-workflow`로 대부분 커버
3. **니치 스킬은 나중에**: 해당 언어로 작업할 때만 언어별 스킬 로드

## 훅 런타임 제어

오버헤드를 줄이기 위해 실행되는 훅을 제어하세요:

```bash
# 최소 훅 (가장 빠름)
export ECC_HOOK_PROFILE=minimal

# 표준 훅 (권장)
export ECC_HOOK_PROFILE=standard

# 특정 훅 비활성화
export ECC_DISABLED_HOOKS="hook-id-1,hook-id-2"
```

## 실용적 팁

| 상황 | 조치 |
|------|------|
| 대규모 코드베이스 리뷰 | 대상 에이전트 사용 (전체 리뷰 대신 `@go-reviewer`) |
| 반복적인 빌드 수정 | 언어별 리졸버 사용 (일반 대신 `/go-build`) |
| 문서 업데이트 | 수동 프롬프트 대신 `/update-docs` 사용 |
| 아키텍처 결정 | 명확한 범위 경계와 함께 `@architect` 사용 |

## 토큰 효율을 위한 지속적 학습

`/learn` 커맨드는 세션에서 패턴을 추출하여 재사용 가능한 스킬로 저장합니다. 향후 세션에서 컨텍스트를 다시 설명할 필요가 줄어듭니다:

```bash
/learn          # 현재 세션에서 패턴 추출
/evolve         # 인스팅트를 효율적인 스킬로 클러스터링
```
