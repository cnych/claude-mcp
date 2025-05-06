---
name: Perplexity Ask MCP Server
digest: MCP 서버는 Sonar API를 통합하여 Claude에게 실시간, 웹 전역 연구 기능을 제공하여 최신 온라인 정보에 즉시 접근할 수 있도록 하여 포괄적이고 정확한 응답을 가능하게 합니다.
author: ppl-ai
homepage: https://github.com/ppl-ai/modelcontextprotocol
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - 웹
  - docker
icon: https://avatars.githubusercontent.com/u/110299016?v=4
createTime: 2025-03-11
featured: true
---

Sonar API를 통합하여 Claude에게 탁월한 실시간 웹 전역 연구 기능을 제공하는 MCP 서버 구현.

![데모](/images/perplexity_demo_screenshot.png)

## 도구

- **perplexity_ask**
  - 실시간 웹 검색을 위해 Sonar API와 대화를 나눕니다.
  - **입력:**
    - `messages` (배열): 대화 메시지 배열.
      - 각 메시지는 다음을 포함해야 합니다:
        - `role` (문자열): 메시지의 역할 (예: `system`, `user`, `assistant`).
        - `content` (문자열): 메시지 내용.

## 설정

### 1단계:

이 저장소를 복제합니다:

```bash
git clone git@github.com:ppl-ai/modelcontextprotocol.git
```

`perplexity-ask` 디렉토리로 이동하여 필요한 종속성을 설치합니다:

```bash
cd modelcontextprotocol/perplexity-ask && npm install
```

### 2단계: Sonar API 키 얻기

1. [Sonar API 계정](https://docs.perplexity.ai/guides/getting-started)에 가입합니다.
2. 계정 설정 지침을 따르고 개발자 대시보드에서 API 키를 생성합니다.
3. 환경 변수에 API 키를 `PERPLEXITY_API_KEY`로 설정합니다.

### 3단계: Claude 데스크톱 설정

1. Claude 데스크톱을 [여기](https://claude.ai/download)에서 다운로드합니다.

2. `claude_desktop_config.json`에 다음을 추가합니다:

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "server-perplexity-ask"],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

파일에 접근하려면:

```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 4단계: Docker 이미지 빌드

Docker 빌드:

```bash
docker build -t mcp/perplexity-ask:latest -f Dockerfile .
```

### 5단계: 테스트

Claude 데스크톱이 `perplexity-ask` 서버에서 노출한 두 도구를 인식하는지 확인합니다. 망치 아이콘을 찾아 확인할 수 있습니다:

![Claude 시각적 도구](/images/perplexity-visual-indicator-mcp-tools.png)

망치 아이콘을 클릭한 후 Filesystem MCP 서버와 함께 제공되는 도구를 볼 수 있어야 합니다:

![사용 가능한 통합](/images/perplexity_available_tools.png)

### 6단계: 고급 매개변수

현재 사용된 검색 매개변수는 기본값입니다. `index.ts` 스크립트에서 직접 API 호출의 검색 매개변수를 수정할 수 있습니다. 이를 위해 공식 [API 문서](https://docs.perplexity.ai/api-reference/chat-completions)를 참조하세요.

### 문제 해결

Claude 문서는 참조할 수 있는 훌륭한 [문제 해결 가이드](https://modelcontextprotocol.io/docs/tools/debugging)를 제공합니다. 그러나 추가 지원이 필요하면 api@perplexity.ai로 문의하거나 [버그를 제출](https://github.com/ppl-ai/api-discussion/issues)할 수 있습니다.

## 라이선스

이 MCP 서버는 MIT 라이선스로 라이선스가 부여됩니다. 이는 소프트웨어를 사용, 수정 및 배포할 수 있음을 의미하며, MIT 라이선스의 조건에 따릅니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
