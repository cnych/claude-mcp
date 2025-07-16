---
name: Figma Context MCP
digest: Figma와 MCP 클라이언트 간의 연결을 구축하여 AI 에이전트를 통해 빠르게 디자인을 구현하고, 디자인에서 코드로의 원활한 전환을 가능하게 합니다.
author: glips
repository: https://github.com/glips/figma-context-mcp
homepage: https://www.framelink.ai
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - figma
  - 디자인
icon: /icons/figma-context-mcp-icon.png
createTime: 2025-04-11
featured: true
---

[Figma Context MCP](/servers/figma-context-mcp)는 강력한 [MCP Server](/servers)로, 개발자가 Figma 디자인에서 직접 정보를 추출하고 AI 에이전트를 통해 빠르게 디자인을 구현할 수 있도록 도와줍니다. 예를 들어 Cursor에서 프롬프트를 사용해 AI 에이전트가 Figma 디자인 데이터에 접근하여 코드를 생성하도록 할 수 있습니다. 스크린샷을 직접 붙여넣는 것보다 훨씬 더 나은 결과를 얻을 수 있습니다.

![Figma Context MCP](https://static.claudemcp.com/images/figma-context-mcp.png)

## Figma 액세스 토큰 획득

Figma Context MCP 서버를 사용하기 전에 Figma 액세스 토큰을 생성해야 합니다. 다음은 토큰을 얻는 단계입니다:

1. Figma에 로그인한 후, 왼쪽 상단의 프로필 아이콘을 클릭하고 드롭다운 메뉴에서 "설정"(`Settings`)을 선택합니다.
2. 설정 메뉴에서 "보안"(`Security`) 탭을 선택합니다.
3. "개인 액세스 토큰"(`Personal access tokens`) 섹션으로 스크롤한 후 "새 토큰 생성"(`Generate new token`)을 클릭합니다.
4. 토큰 이름(예: "Figma MCP")을 입력하고 `File content`와 `Dev resources`에 대한 읽기 권한이 있는지 확인합니다.

   ![Figma 액세스 토큰 생성](https://static.claudemcp.com/images/figma-context-mcp-generate-token.png)

5. "토큰 생성"(`Generate token`) 버튼을 클릭합니다.

> **중요**: 생성된 토큰을 즉시 복사하여 안전한 곳에 저장하세요. 이 페이지를 닫으면 토큰을 다시 볼 수 없습니다.

더 자세한 안내는 [Figma 액세스 토큰 공식 문서](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)를 참조하세요.

## Figma Context MCP 서버 구성

대부분의 MCP 클라이언트는 JSON을 통해 MCP 서버를 구성할 수 있습니다. MCP 클라이언트에서 MCP 구성 파일을 업데이트하면 MCP 서버가 자동으로 다운로드되고 활성화됩니다.

운영 체제에 따라 적절한 구성 방법을 선택하세요:

**MacOS / Linux:**

```json
{
  "mcpServers": {
    "Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

**Windows:**

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

> **중요**: 구성에서 `YOUR-KEY`를 첫 단계에서 생성한 Figma 액세스 토큰으로 바꾸세요.

각 [MCP 클라이언트](/clients)의 구성 단계는 약간 다를 수 있습니다. 여기서는 Cursor에서의 구성 방법을 중점적으로 설명합니다:

1. Cursor 설정 열기(CMD+, 또는 Ctrl+,)
2. MCP 구성 섹션으로 이동
3. 오른쪽 상단의 `+ Add new global MCP server` 버튼 클릭
4. 위에서 제공한 구성 JSON 붙여넣기

또한 프로젝트 루트 디렉토리에 `.cursor/mcp.json` 파일을 생성하고 위 구성을 추가하면 해당 MCP 서버는 현재 프로젝트에서만 활성화됩니다.

![Cursor MCP 구성](https://static.claudemcp.com/images/figma-context-mcp-cursor-settings.png)

이제 MCP 서버 구성이 완료되었습니다.

## 첫 번째 디자인 구현

MCP 클라이언트를 구성한 후, 첫 번째 디자인을 구현할 준비가 되었습니다.

### Figma 프레임 또는 그룹 링크 복사

MCP 서버는 Figma API에서 받은 데이터를 90%까지 압축하지만, 복잡한 디자인은 여전히 AI 에이전트가 정보 과부하로 인해 문제를 일으킬 수 있습니다(토큰 제한 초과).

**에디터에서 전체 디자인을 구현하도록 시도할 수 있지만, 가장 일관된 결과를 얻으려면 한 번에 한 부분씩 처리하는 것이 좋습니다.**

구체적인 방법: **구현하려는 프레임 또는 그룹을 우클릭한 후 "복사/붙여넣기"(`Copy/Paste as`)를 선택하고 "선택 항목 링크 복사"(`Copy link to selection`)를 선택합니다.**

![Figma 프레임 또는 그룹 링크 복사](https://static.claudemcp.com/images/figma-context-mcp-copy-figma-link.png)

### 링크를 에디터에 붙여넣기

Figma 프레임 또는 그룹의 링크를 얻은 후, 에디터의 AI 에이전트에 요청을 보낼 수 있습니다.

예를 들어 Cursor에 `Implement this Figma frame for me. https://www.figma.com/design/....`라고 입력할 때, 앞서 얻은 Figma 링크를 Cursor 입력창에 직접 붙여넣으면 자동으로 링크로 인식되어 Cursor가 해당 링크의 페이지 내용을 직접 가져오려고 시도합니다. 이는 우리가 원하는 바가 아닙니다. 우리는 이 링크를 통해 MCP 서버가 Figma 디자인 데이터를 가져오기를 원할 뿐이므로, URL 링크 주소를 클릭한 후 `Unlink` 버튼을 클릭하여 Cursor가 이 링크를 일반 텍스트로 인식하도록 해야 합니다.

![링크를 에디터에 붙여넣기](https://static.claudemcp.com/images/figma-context-mcp-paste-link.png)

엔터를 누르면 Cursor는 의미 분석을 거쳐 MCP 서버의 `get_figma_data` 도구를 호출하여 해당 디자인 데이터를 가져옵니다. 이미지가 있는 경우 `download_figma_images` 도구를 호출하여 이미지를 다운로드한 후, 이 데이터를 기반으로 에이전트가 코드를 생성합니다.

![Figma MCP 도구 호출](https://static.claudemcp.com/images/figma-context-mcp-call-tool.png)

최종적으로 생성된 페이지는 다음과 같습니다:

![최종 생성된 페이지 효과](https://static.claudemcp.com/images/figma-context-mcp-final-result.png)

디자인과 매우 유사하지만, 몇 가지 세부 사항은 직접 조정해야 합니다.

물론 프롬프트를 통해 AI 에이전트에게 사용할 기술 스택, 명명 규칙 또는 특정 요구 사항 등을 알려줄 수도 있습니다. 더 많은 컨텍스트를 제공하면 일반적으로 최상의 결과를 얻을 수 있습니다.

```bash
이 Figma 디자인을 기반으로 반응형 페이지를 구현해 주세요:

https://www.figma.com/file/xxxxx

기술 스택 요구 사항:
- HTML/CSS
- Tailwind CSS 프레임워크 사용
- 모바일 장치에서도 정상적으로 표시되도록 보장
```

이제 첫 번째 디자인 구현이 완료되었습니다. 매우 간단하지 않나요?

## 모범 사례

Figma Context MCP를 최대한 활용하기 위해 다음 모범 사례를 참고할 수 있습니다:

**Figma에서**

일반적으로 Figma 파일을 이해하고 구현하기 쉽도록 구조화해야 합니다.

- 자동 레이아웃 사용 — MCP는 현재 부유 또는 절대 위치 지정 요소를 잘 처리하지 못합니다.
- 프레임과 그룹에 이름 지정
- 팁: Figma의 AI를 사용하여 자동으로 이름을 생성해 보세요.

**에디터에서**

LLM을 사용할 때 올바른 컨텍스트를 제공하는 것이 중요합니다. 예를 들어:

- 사용 가능한 리소스(예: Tailwind, React)를 에이전트에게 알리기
- 코드베이스의 주요 파일을 참조하여 추가 컨텍스트 제공
- Figma 원본 데이터 외에도 디자인 세부 사항 제공
- 컨텍스트 크기 관리 — 전체 파일이 아닌 프레임과 그룹의 링크 제공(토큰 제한 초과 방지)
- AI 생성 코드를 항상 검토하여 표준과 기대에 부합하는지 확인.

## SSE 구성 방식

앞서 소개한 구성 방식 외에도 Figma MCP는 SSE 방식을 통해 클라이언트에 스트리밍 응답을 지원합니다.

**MCP 서버 시작**

`npx` 명령을 사용하여 MCP 서버를 시작할 수 있습니다.

```bash
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
# Initializing Figma MCP Server in HTTP mode on port 3333...
# HTTP server listening on port 3333
# SSE endpoint available at http://localhost:3333/sse
# Message endpoint available at http://localhost:3333/messages
```

**MCP 클라이언트 구성**

다음으로 MCP 클라이언트에서 MCP 서버를 구성해야 합니다. 구체적인 구성 방법은 다음과 같습니다:

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "url": "http://localhost:3333/sse",
      "env": {
        "FIGMA_API_KEY": "<your-figma-api-key>"
      }
    }
  }
}
```

## 자주 묻는 질문 및 문제 해결

Figma Context MCP 사용 중 문제가 발생하면 다음 일반적인 문제와 해결 방법을 참조하세요:

### 문제: MCP 서버에 연결할 수 없음

**해결 방법**:

- Figma 액세스 토큰이 올바르게 구성되었는지 확인
- 네트워크 연결 확인
- IDE 재시작
- npx 명령 사용 가능 확인(Node.js 설치 필요)

### 문제: 생성된 코드가 기대와 다름

**해결 방법**:

- 더 구체적인 지침 제공 시도
- 더 작은 디자인 부분 사용
- Figma 디자인이 명확하게 조직화되고 이름이 지정되었는지 확인
- 다른 프롬프트 방식 시도

### 문제: 액세스 토큰 권한 오류

**해결 방법**:

- 액세스 토큰에 필요한 권한(`File content` 및 `Dev resources` 읽기 권한)이 있는지 확인
- 필요한 경우 새 액세스 토큰 생성

## 결론

Figma Context MCP는 매우 강력한 MCP 서버로, Figma와 Cursor 간의 연결을 완전히 구축하여 Figma 디자인에서 데이터를 쉽게 가져오고 AI 에이전트를 통해 빠르게 디자인을 구현할 수 있게 합니다. 디자인에서 코드로의 원활한 전환을 가능하게 하는 매우 추천할 만한 도구입니다.
