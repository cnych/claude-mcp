---
name: MarkItDown MCP
digest: MarkItDown-MCP은 파일 및 오피스 문서를 마크다운으로 변환하는 파이썬 도구입니다.
author: microsoft
homepage: https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - markdown
  - python
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4
createTime: 2025-04-21
featured: true
---

`markitdown-mcp` 패키지는 MarkItDown을 호출하기 위한 경량 STDIO 및 SSE MCP 서버를 제공합니다.

이 패키지는 `convert_to_markdown(uri)` 도구를 제공하며, 여기서 uri는 `http:`, `https:`, `file:`, 또는 `data:` URI 중 하나일 수 있습니다.

## 설치

패키지를 설치하려면 pip를 사용하세요:

```bash
pip install markitdown-mcp
```

## 사용 방법

MCP 서버를 실행하려면 STDIO(기본값)를 사용하여 다음 명령을 실행하세요:

```bash
markitdown-mcp
```

SSE를 사용하여 MCP 서버를 실행하려면 다음 명령을 실행하세요:

```bash
markitdown-mcp --sse --host 127.0.0.1 --port 3001
```

## Docker에서 실행

`markitdown-mcp`를 Docker에서 실행하려면 제공된 Dockerfile을 사용하여 이미지를 빌드하세요:

```bash
docker build -t markitdown-mcp:latest .
```

그리고 다음 명령으로 실행하세요:

```bash
docker run -it --rm markitdown-mcp:latest
```

이것은 원격 URI에 충분합니다. 로컬 파일에 액세스하려면 로컬 디렉토리를 컨테이너에 마운트해야 합니다. 예를 들어 `/home/user/data`의 파일에 액세스하려면 다음을 실행하세요:

```bash
docker run -it --rm -v /home/user/data:/workdir markitdown-mcp:latest
```

마운트되면 데이터 아래의 모든 파일은 컨테이너 내 `/workdir`에서 액세스할 수 있습니다. 예를 들어 `/home/user/data`에 `example.txt` 파일이 있다면 컨테이너 내 `/workdir/example.txt`에서 액세스할 수 있습니다.

## Claude Desktop에서 액세스

Claude Desktop용 MCP 서버를 실행할 때는 Docker 이미지를 사용하는 것이 좋습니다.

Claude의 `claude_desktop_config.json` 파일에 액세스하려면 [이 지침](https://modelcontextprotocol.io/quickstart/user#for-claude-desktop-users)을 따르세요.

다음 JSON 항목을 포함하도록 편집하세요:

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "markitdown-mcp:latest"]
    }
  }
}
```

디렉토리를 마운트하려면 다음과 같이 조정하세요:

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-v",
        "/home/user/data:/workdir",
        "markitdown-mcp:latest"
      ]
    }
  }
}
```

## 디버깅

MCP 서버를 디버깅하려면 `mcpinspector` 도구를 사용할 수 있습니다.

```bash
npx @modelcontextprotocol/inspector
```

그런 다음 지정된 호스트와 포트(예: `http://localhost:5173/`)를 통해 인스펙터에 연결할 수 있습니다.

STDIO를 사용하는 경우:

- 전송 유형으로 `STDIO`를 선택하고,
- 명령으로 `markitdown-mcp`를 입력한 다음,
- `연결`을 클릭하세요.

SSE를 사용하는 경우:

- 전송 유형으로 `SSE`를 선택하고,
- URL로 `http://127.0.0.1:3001/sse`를 입력한 다음,
- `연결`을 클릭하세요.

마지막으로:

- `도구` 탭을 클릭하고,
- `도구 목록`을 클릭하고,
- `convert_to_markdown`을 클릭한 다음,
- 유효한 URI에서 도구를 실행하세요.

## 보안 고려 사항

서버는 인증을 지원하지 않으며, 실행하는 사용자의 권한으로 실행됩니다. 따라서 SSE 모드로 실행할 때는 `localhost`(기본값)에 바인딩하여 실행하는 것이 좋습니다.

## 상표

이 프로젝트에는 프로젝트, 제품 또는 서비스에 대한 상표 또는 로고가 포함될 수 있습니다. Microsoft 상표 또는 로고의 승인된 사용은 [Microsoft의 상표 및 브랜드 지침](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general)을 준수해야 합니다. 이 프로젝트의 수정된 버전에서 Microsoft 상표 또는 로고를 사용하는 경우 혼동을 일으키거나 Microsoft의 후원을 암시해서는 안 됩니다. 타사 상표 또는 로고의 사용은 해당 타사의 정책을 따릅니다.