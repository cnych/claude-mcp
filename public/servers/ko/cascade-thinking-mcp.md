---
name: Cascade Thinking MCP 서버
digest: 선형 문제 해결을 진정한 분기와 지능적인 사고 관리를 통한 풍부한 다차원 탐색으로 변환
author: Drew Llewellyn
homepage: https://github.com/drewdotpro/cascade-thinking-mcp
repository: https://github.com/drewdotpro/cascade-thinking-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - reasoning
  - problem-solving
  - analysis
  - thinking
  - branching
createTime: 2025-01-25T00:00:00Z
---

선형 문제 해결을 진정한 분기와 지능적인 사고 관리를 통한 풍부한 다차원 탐색으로 변환합니다.

## 기능

- **진정한 분기**: 자동으로 새 시퀀스를 시작하는 별도의 탐색 경로 생성
- **사고 수정**: 이해가 발전함에 따라 이전의 통찰력 업데이트
- **동적 확장**: 필요시 사고 공간을 50% 또는 최소 3개 이상 확장
- **다중 도구 통합**: `toolSource` 추적을 통한 도구 간 지속적인 상태 유지
- **유연한 출력**: 최소, 표준 또는 상세 응답 모드로 상세도 제어
- **이중 번호 시스템**: 시퀀스 상대 위치(S{n})와 절대 위치(A{n})로 사고 추적

## 왜 Cascade Thinking인가?

기존의 문제 해결 도구는 모호성 앞에서 무너집니다. Cascade Thinking MCP를 사용하면:
- 별도의 시퀀스를 생성하는 진정한 분기로 대안 탐색
- 완전한 추적 가능성으로 이전 사고 수정
- 지속적인 상태로 에이전트와 도구 간 컨텍스트 유지
- 탐색 중 복잡성을 발견했을 때 동적으로 확장

## API

### 도구

- **cascade_thinking**
  - 동적 분기 및 수정 기능을 갖춘 상세하고 단계별 사고 프로세스 촉진
  - 주요 입력:
    - `thought` (문자열): 현재 사고 단계
    - `nextThoughtNeeded` (불린): 다른 사고 단계가 필요한지 여부
    - `thoughtNumber` (문자열): 시퀀스의 현재 위치 (예: "S1", "S2", "S3")
    - `totalThoughts` (정수): 예상되는 총 사고 수
    - `branchFromThought` (선택사항): 지정된 사고에서 새 분기 생성
    - `needsMoreThoughts` (선택사항): totalThoughts를 동적으로 확장
    - `responseMode` (선택사항): 상세도 제어 (minimal/standard/verbose)

## 고유 기능

### 이중 번호 시스템
- **S{n}**: 시퀀스 상대 위치 (분기별로 재설정)
- **A{n}**: 모든 사고의 절대 위치 (재설정되지 않음)

### 진정한 분기
분기를 생성하면 도구는:
1. 자동으로 새 시퀀스 생성
2. 새 분기에서 번호를 S1로 재설정
3. 부모 시퀀스에서 관련 컨텍스트 복사
4. 탐색을 위한 분기 관계 추적

### 동적 확장
`needsMoreThoughts: true`를 설정하면:
1. totalThoughts를 50% 또는 최소 3개 사고 증가
2. ⚡ 이모지를 포함한 시각적 표시 표시
3. 새 총계로 응답 업데이트
4. 확장을 나타내는 힌트 텍스트 추가

## Claude Desktop에서 사용

`claude_desktop_config.json`에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "cascade-thinking-mcp"
      ]
    }
  }
}
```

## Docker 사용

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/cascade-thinking"
      ]
    }
  }
}
```

## 사용 예시

탐색 시작:
```json
{
  "thought": "API의 인증 옵션 분석",
  "thoughtNumber": "S1",
  "totalThoughts": 3,
  "nextThoughtNeeded": true
}
```

OAuth 탐색을 위한 분기:
```json
{
  "thought": "OAuth2 구현을 탐색해보겠습니다",
  "thoughtNumber": "S1",
  "branchFromThought": "A1",
  "branchId": "oauth-exploration",
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}
```

## 라이선스

이 MCP 서버는 MIT 라이선스에 따라 라이선스가 부여됩니다. 이는 MIT 라이선스의 조건에 따라 소프트웨어를 자유롭게 사용, 수정 및 배포할 수 있음을 의미합니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.