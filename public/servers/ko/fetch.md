---
name: Fetch MCP 서버
digest: Fetch는 웹 콘텐츠 가져오기 기능을 제공합니다
author: Claude 팀
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/fetch
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - fetch
createTime: 2024-12-01T00:00:00Z
---

웹 콘텐츠 가져오기 기능을 제공하는 모델 컨텍스트 프로토콜 서버입니다. 이 서버는 LLM이 웹 페이지에서 콘텐츠를 검색하고 처리할 수 있게 하며, HTML을 마크다운으로 변환하여 더 쉽게 소비할 수 있도록 합니다.

fetch 도구는 응답을 잘라내지만, `start_index` 인수를 사용하여 콘텐츠 추출을 시작할 위치를 지정할 수 있습니다. 이를 통해 모델이 필요한 정보를 찾을 때까지 웹페이지를 청크 단위로 읽을 수 있습니다.

### 사용 가능한 도구

- `fetch` - 인터넷에서 URL을 가져와 그 내용을 마크다운으로 추출합니다.
  - `url` (문자열, 필수): 가져올 URL
  - `max_length` (정수, 선택): 반환할 최대 문자 수 (기본값: 5000)
  - `start_index` (정수, 선택): 이 문자 인덱스부터 콘텐츠 시작 (기본값: 0)
  - `raw` (불리언, 선택): 마크다운 변환 없이 원시 콘텐츠 가져오기 (기본값: false)

### 프롬프트

- **fetch**
  - Fetch a URL and extract its contents as markdown
  - Arguments:
    - `url` (string, required): URL to fetch

## Installation

Optionally: Install node.js, this will cause the fetch server to use a different HTML simplifier that is more robust.

### Using uv (recommended)

선택 사항: node.js를 설치하면 fetch 서버가 더 강력한 다른 HTML 단순화 도구를 사용하게 됩니다.

### uv 사용 (권장)

[`uv`](https://docs.astral.sh/uv/)를 사용할 때는 특별한 설치가 필요하지 않습니다. *mcp-server-fetch*를 직접 실행하기 위해 [`uvx`](https://docs.astral.sh/uv/guides/tools/)를 사용할 것입니다.

### PIP 사용

또는 pip를 통해 `mcp-server-fetch`를 설치할 수 있습니다:

<details>
<summary>Using uvx</summary>

```json
"mcpServers": {
  "fetch": {
    "command": "uvx",
    "args": ["mcp-server-fetch"]
  }
}
```

</details>

<details>
<summary>Using pip installation</summary>

```json
"mcpServers": {
  "fetch": {
    "command": "python",
    "args": ["-m", "mcp_server_fetch"]
  }
}
```

</details>

### 사용자 지정 - robots.txt

기본적으로 서버는 모델(도구를 통해)에서 요청이 왔을 때 웹사이트의 robots.txt 파일을 따르지만, 사용자 초기화된 요청(프롬프트를 통해)에서는 따르지 않습니다. 이를 비활성화하려면 구성에서 `args` 목록에 `--ignore-robots-txt` 인수를 추가하세요.

### 사용자 지정 - User-agent

기본적으로 요청이 모델(도구를 통해)에서 왔는지 아니면 사용자 초기화된 요청(프롬프트를 통해)에서 왔는지에 따라 서버는 다음 중 하나를 사용합니다:

```bash
ModelContextProtocol/1.0 (Autonomous; +https://github.com/modelcontextprotocol/servers)
```

또는

```bash
ModelContextProtocol/1.0 (User-Specified; +https://github.com/modelcontextprotocol/servers)
```

이는 구성에서 `args` 목록에 `--user-agent=YourUserAgent` 인수를 추가하여 사용자 지정할 수 있습니다.

## 디버깅

MCP 검사기를 사용하여 서버를 디버깅할 수 있습니다. uvx 설치의 경우:

```bash
npx @modelcontextprotocol/inspector uvx mcp-server-fetch
```

또는 패키지가 특정 디렉토리에 설치되어 있거나 개발 중인 경우:

```bash
cd path/to/servers/src/fetch
npx @modelcontextprotocol/inspector uv run mcp-server-fetch
```

## 기여

mcp-server-fetch를 확장하고 개선하는 데 도움을 주고 싶습니다. 새로운 도구를 추가하거나 기존 기능을 향상시키거나 문서를 개선하고 싶다면 자유롭게 기여해 주세요.

다른 MCP 서버와 구현 패턴의 예시는 다음을 참조하세요:
[https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

Pull requests는 환영합니다! mcp-server-fetch를 더 강력하고 유용하게 만들기 위해 새로운 아이디어, 버그 수정, 개선 사항을 기여해 주세요.

## 라이선스

mcp-server-fetch는 MIT 라이선스로 배포됩니다. 이는 당신이 자유롭게 소프트웨어를 사용, 수정, 배포할 수 있으며, MIT 라이선스의 조건에 따라 이용할 수 있습니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
