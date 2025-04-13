---
name: MCP K8S Go
digest: MCP K8S Go는 자동화와 간소화된 워크플로우를 통해 쿠버네티스 클러스터 운영을 단순화하는 관리 도구입니다. 핵심 가치는 효율적인 리소스 관리, 쉬운 배포, 그리고 클라우드 네이티브 애플리케이션의 확장성에 있습니다. 이 플랫폼은 개발자들이 인프라 관리보다 애플리케이션 구축에 집중할 수 있도록 합니다.
author: strowk
homepage: https://github.com/strowk/mcp-k8s-go
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - kubernetes
  - go
icon: https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-4e7474d6.png
createTime: 2024-12-01
featured: true
---

![MCP K8S Go 로고](https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-4e7474d6.png)

## 기능

MCP 💬 프롬프트 🗂️ 리소스 🤖 도구

- 🗂️🤖 쿠버네티스 컨텍스트 목록 조회
- 💬🤖 쿠버네티스 네임스페이스 목록 조회
- 🤖 모든 쿠버네티스 리소스 조회 및 가져오기
  - 파드, 서비스, 디플로이먼트와 같은 리소스에 대한 커스텀 매핑 포함, 모든 리소스를 조회하고 가져올 수 있음
- 🤖 쿠버네티스 노드 목록 조회
- 💬 쿠버네티스 파드 목록 조회
- 🤖 쿠버네티스 이벤트 가져오기
- 🤖 쿠버네티스 파드 로그 가져오기
- 🤖 쿠버네티스 파드에서 명령 실행

## 인스펙터로 탐색하기

인스펙터와 함께 최신 버전을 사용하려면 다음을 실행하세요:

```bash
npx @modelcontextprotocol/inspector npx @strowk/mcp-k8s
```

## Claude와 함께 사용하기

다음은 Claude 데스크톱과의 채팅으로, 특정 컨텍스트를 리소스로 선택한 후 kube-system 네임스페이스에서 오류가 있는 파드 로그를 확인하도록 요청한 모습을 보여줍니다:

![Claude 데스크톱](https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-8eb1730a.png)

Claude 데스크톱(또는 다른 클라이언트)에서 이 MCP 서버를 사용하려면 설치 방법을 선택해야 할 수 있습니다.

### Smithery 사용

[Smithery](https://smithery.ai/server/@strowk/mcp-k8s)를 통해 Claude 데스크톱용 MCP K8S Go를 자동으로 설치하려면:

```bash
npx -y @smithery/cli install @strowk/mcp-k8s --client claude
```

### mcp-get 사용

[mcp-get](https://mcp-get.com/packages/%40strowk%2Fmcp-k8s)을 통해 Claude 데스크톱용 MCP K8S Go를 자동으로 설치하려면:

```bash
npx @michaellatman/mcp-get@latest install @strowk/mcp-k8s
```

### 수동으로 사전 빌드된 바이너리 사용

#### npm에서 사전 빌드된 버전

npm이 설치되어 있고 사전 빌드된 바이너리를 사용하려면:

```bash
npm install -g @strowk/mcp-k8s
```

그런 다음 `mcp-k8s --version`을 실행하여 버전을 확인하고, 설치된 버전이 출력되면 `claude_desktop_config.json` 파일에 구성을 추가하세요:

```json
{
  "mcpServers": {
    "mcp_k8s": {
      "command": "mcp-k8s",
      "args": []
    }
  }
}
```

또는 `npx`와 함께 모든 클라이언트에서 사용:

```bash
npx @strowk/mcp-k8s
```

예를 들어 Claude의 경우:

```json
{
  "mcpServers": {
    "mcp_k8s": {
      "command": "npx",
      "args": ["@strowk/mcp-k8s"]
    }
  }
}
```

#### GitHub 릴리스에서

[GitHub 릴리스](https://github.com/strowk/mcp-k8s-go/releases)로 이동하여 사용 중인 플랫폼에 대한 최신 릴리스를 다운로드하세요.

아카이브를 풀면 `mcp-k8s-go`라는 바이너리가 포함되어 있습니다. 이 바이너리를 PATH에 있는 곳에 넣고 `claude_desktop_config.json` 파일에 다음 구성을 추가하세요:

```json
{
  "mcpServers": {
    "mcp_k8s": {
      "command": "mcp-k8s-go",
      "args": []
    }
  }
}
```

### 소스에서 빌드하기

이 프로젝트를 빌드하려면 Golang이 설치되어 있어야 합니다:

```bash
go get github.com/strowk/mcp-k8s-go
go install github.com/strowk/mcp-k8s-go
```

그런 다음 `claude_desktop_config.json` 파일에 다음 구성을 추가하세요:

```json
{
  "mcpServers": {
    "mcp_k8s_go": {
      "command": "mcp-k8s-go",
      "args": []
    }
  }
}
```

### Docker 사용하기

이 서버는 0.3.1-beta.2 릴리스부터 Docker Hub에 빌드 및 게시되었으며, linux/amd64 및 linux/arm64 아키텍처에 대한 멀티-아크 이미지를 사용할 수 있습니다.

다음과 같이 최신 태그를 사용할 수 있습니다:

```bash
docker run -i -v ~/.kube/config:/home/nonroot/.kube/config --rm mcpk8s/server:latest
```

Windows 사용자는 최소한 Git Bash에서 `~/.kube/config`를 `//c/Users/<username>/.kube/config`로 바꿔야 할 수 있습니다.

Claude의 경우:

```json
{
  "mcpServers": {
    "mcp_k8s_go": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "-v",
        "~/.kube/config:/home/nonroot/.kube/config",
        "--rm",
        "mcpk8s/server:latest"
      ]
    }
  }
}
```

### 환경 변수 및 명령줄 옵션

다음 환경 변수가 MCP 서버에서 사용됩니다:

- `KUBECONFIG`: 쿠버네티스 구성 파일 경로 (선택 사항, 기본값은 ~/.kube/config)

다음 명령줄 옵션이 지원됩니다:

- `--allowed-contexts=<ctx1,ctx2,...>`: 사용자가 접근할 수 있는 허용된 쿠버네티스 컨텍스트의 쉼표로 구분된 목록. 지정하지 않으면 모든 컨텍스트가 허용됩니다.
- `--help`: 도움말 정보 표시
- `--version`: 버전 정보 표시
