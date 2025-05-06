---
name: Dify MCP Server
digest: 이 MCP 서버 구현은 MCP 도구와 통합하여 Dify 워크플로우 실행을 가능하게 하며, MCP의 기능을 통해 Dify 프로세스를 쉽게 트리거하고 관리할 수 있는 방법을 제공합니다.
author: YanxingLiu
homepage: https://github.com/YanxingLiu/dify-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 서버
  - 워크플로우
  - 도구
  - dify
icon: https://avatars.githubusercontent.com/u/42299757?v=4
createTime: 2024-12-25
---

[dify](https://github.com/langgenius/dify)를 사용하기 위한 간단한 MCP 서버 구현입니다. 이 서버는 MCP 도구를 호출하여 Dify 워크플로우의 실행을 가능하게 합니다.

## 설치

이 서버는 [Smithery](https://smithery.ai/server/dify-mcp-server)를 통해 또는 수동으로 설치할 수 있습니다. 두 방법 모두 config.yaml 파일이 필요합니다.

### config.yaml 준비

MCP 서버를 사용하기 전에 dify_base_url과 dify_sks를 저장할 config.yaml 파일을 준비해야 합니다. 예시 config는 다음과 같습니다:

```yaml
dify_base_url: "https://cloud.dify.ai/v1"
dify_app_sks:
  - "app-sk1"
  - "app-sk2"
```

터미널에서 다음 명령어를 실행하여 빠르게 설정 파일을 생성할 수 있습니다:

```bash
mkdir -p ~/tools && cat > ~/tools/config.yaml <<EOF
dify_base_url: "https://cloud.dify.ai/v1"
dify_app_sks:
  - "app-sk1"
  - "app-sk2"
EOF
```

서로 다른 SK는 서로 다른 Dify 워크플로우에 대응합니다.

### Smithery를 통한 설치

[smithery](https://smithery.ai)는 dify mcp 서버를 자동으로 설치하는 도구입니다.

```bash
npx -y @smithery/cli install dify-mcp-server --client claude
```

`claude` 외에도 `cline, windsurf, roo-cline, witsy, enconvo, cursor`가 지원됩니다.

### 수동 설치

#### 방법 1: uv 사용 (로컬 클론 + uv 시작)

클라이언트 설정 형식:

```json
{
  "mcpServers": {
    "mcp-server-rag-web-browser": {
      "command": "uv",
      "args": [
        "--directory",
        "${DIFY_MCP_SERVER_PATH}",
        "run",
        "dify_mcp_server"
      ],
      "env": {
        "CONFIG_PATH": "$CONFIG_PATH"
      }
    }
  }
}
```

예시 설정:

```json
{
  "mcpServers": {
    "dify-mcp-server": {
      "command": "uv",
      "args": [
        "--directory",
        "/Users/lyx/Downloads/dify-mcp-server",
        "run",
        "dify_mcp_server"
      ],
      "env": {
        "CONFIG_PATH": "/Users/lyx/Downloads/config.yaml"
      }
    }
  }
}
```

#### 방법 2: uvx 사용 (코드 클론 없이 사용 가능, 권장)

```json
"mcpServers": {
  "dify-mcp-server": {
    "command": "uvx",
      "args": [
        "--from","git+https://github.com/YanxingLiu/dify-mcp-server","dify_mcp_server"
      ],
    "env": {
       "CONFIG_PATH": "/Users/lyx/Downloads/config.yaml"
    }
  }
}
```

### 사용하기

마지막으로, MCP를 지원하는 모든 클라이언트에서 dify 도구를 사용할 수 있습니다.
