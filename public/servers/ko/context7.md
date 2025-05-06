---
name: Context7 MCP - 모든 프롬프트에 대한 최신 문서
digest: Context7 MCP 서버는 대규모 언어 모델 및 AI 코드 에디터에 최신 문서를 제공하는 MCP 서버입니다.
author: upstash
homepage: https://github.com/upstash/context7
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - context7
  - cursor
  - 문서
  - 프롬프트
icon: https://avatars.githubusercontent.com/u/74989412?v=4
createTime: 2025-04-25
featured: true
---

## ❌ Context7 없이

LLM은 사용하는 라이브러리에 대한 오래되거나 일반적인 정보에 의존합니다. 다음과 같은 문제가 발생합니다:

- ❌ 코드 예제는 오래되었고 1년 전 훈련 데이터를 기반으로 합니다
- ❌ 존재하지도 않는 API가 환상적으로 생성됩니다
- ❌ 오래된 패키지 버전에 대한 일반적인 답변을 제공합니다

## ✅ Context7와 함께

Context7 MCP는 최신 버전별 문서와 코드 예제를 소스에서 직접 가져와 프롬프트에 바로 삽입합니다.

Cursor에서 프롬프트에 `use context7`를 추가하세요:

```txt
Create a basic Next.js project with app router. use context7
```

```txt
Create a script to delete the rows where the city is "" given PostgreSQL credentials. use context7
```

Context7는 최신 코드 예제와 문서를 LLM의 컨텍스트로 바로 가져옵니다.

- 1️⃣ 자연스럽게 프롬프트 작성
- 2️⃣ LLM에게 `use context7`라고 지시
- 3️⃣ 작동하는 코드 답변 얻기

## 🛠️ 시작하기

### 요구 사항

- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop 또는 다른 MCP 클라이언트

### Smithery를 통한 설치

[Smithery](https://smithery.ai/server/@upstash/context7-mcp)를 통해 Claude Desktop용 Context7 MCP 서버를 자동으로 설치하려면:

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### Cursor에 설치

`Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`로 이동하세요.

Cursor의 `~/.cursor/mcp.json` 파일에 다음 구성을 붙여넣는 것이 권장되는 방법입니다.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Cursor에서 Context7 MCP를 활성화하세요.

![Cursor에서의 Context7 MCP 설정](/images/context7-cursor-settings.png)

이제 프롬프트에 `use context7`를 추가하여 Cursor에서 Context7 MCP를 사용할 수 있습니다.

![Cursor에서 Context7 MCP 사용 예시](/images/context7-use-in-cursor.png)

### Windsurf에 설치

Windsurf MCP 구성 파일에 다음을 추가하세요.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### VS Code에 설치

VS Code MCP 구성 파일에 다음을 추가하세요.

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Claude Code에 설치

다음 명령을 실행하세요.

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### Claude Desktop에 설치

Claude Desktop의 `claude_desktop_config.json` 파일에 다음을 추가하세요.

```json
{
  "mcpServers": {
    "Context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Docker 사용

Docker 컨테이너에서 MCP 서버를 실행하려면:

1.  **Docker 이미지 빌드:**

    프로젝트 루트에 `Dockerfile`을 생성하세요:

    ```Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    RUN npm install -g @upstash/context7-mcp@latest

    CMD ["context7-mcp"]
    ```

    그런 다음 이미지를 빌드하세요:

    ```bash
    docker build -t context7-mcp .
    ```

2.  **MCP 클라이언트 구성:**

    Docker 명령을 사용하도록 MCP 클라이언트 구성을 업데이트하세요.

    ```json
    {
      "mcpServers": {
        "Сontext7": {
          "autoApprove": [],
          "disabled": false,
          "timeout": 60,
          "command": "docker",
          "args": ["run", "-i", "--rm", "context7-mcp"],
          "transportType": "stdio"
        }
      }
    }
    ```

### 사용 가능한 도구

- `resolve-library-id`: 일반 라이브러리 이름을 Context7 호환 라이브러리 ID로 변환합니다.
  - `libraryName` (필수)
- `get-library-docs`: Context7 호환 라이브러리 ID를 사용하여 라이브러리 문서를 가져옵니다.
  - `context7CompatibleLibraryID` (필수)
  - `topic` (선택 사항): 특정 주제(예: "routing", "hooks")에 대한 문서를 집중합니다.
  - `tokens` (선택 사항, 기본값 5000): 반환할 최대 토큰 수. 5000보다 작은 값은 자동으로 5000으로 증가합니다.

## 개발

프로젝트를 클론하고 종속성을 설치하세요:

```bash
bun i
```

빌드:

```bash
bun run build
```

### 로컬 구성 예시

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["tsx", "/path/to/folder/context7-mcp/src/index.ts"]
    }
  }
}
```

### MCP Inspector로 테스트

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## 문제 해결

### ERR_MODULE_NOT_FOUND

이 오류가 발생하면 `npx` 대신 `bunx`를 사용해 보세요.

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### MCP 클라이언트 오류

1. 패키지 이름에서 `@latest`를 제거해 보세요.
2. 대안으로 `bunx`를 사용해 보세요.
3. 대안으로 `deno`를 사용해 보세요.

## 라이선스

MIT
