---
name: Apify MCP 서버
digest: 모델 컨텍스트 프로토콜을 통해 웹 스크래핑, 데이터 추출 및 자동화 작업을 위한 Apify Actors를 배포하고 상호작용
author: Apify
repository: https://github.com/apify/actors-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - apify
  - scrape
  - automation
icon: https://avatars.githubusercontent.com/u/24586296?s=48&v=4
createTime: 2025-05-06T00:00:00Z
---

# Apify 모델 컨텍스트 프로토콜(MCP) 서버

[![Actors MCP 서버](https://apify.com/actor-badge?actor=apify/actors-mcp-server)](https://apify.com/apify/actors-mcp-server)
[![smithery 배지](https://smithery.ai/badge/@apify/actors-mcp-server)](https://smithery.ai/server/@apify/actors-mcp-server)

모든 [Apify Actors](https://apify.com/store)를 위한 MCP 서버 구현체입니다.
이 서버는 MCP 서버 구성에서 정의할 수 있는 5000개 이상의 Apify Actors 중 하나 이상과 상호작용할 수 있도록 합니다.

# 🎯 Apify MCP 서버의 기능은 무엇인가요?

MCP 서버 Actor는 AI 어시스턴트가 특정 작업 또는 작업 세트를 수행하기 위한 도구로 [Apify Actor](https://apify.com/store)를 사용할 수 있게 합니다.
예를 들어 다음과 같은 작업이 가능합니다:

- [Facebook 게시물 스크래퍼](https://apify.com/apify/facebook-posts-scraper)를 사용하여 여러 페이지/프로필의 Facebook 게시물에서 데이터 추출
- [Google Maps 이메일 추출기](https://apify.com/lukaskrivka/google-maps-with-contact-details)를 사용하여 Google Maps 연락처 정보 추출
- [Google 검색 결과 스크래퍼](https://apify.com/apify/google-search-scraper)를 사용하여 Google 검색 결과 페이지(SERPs) 스크래핑
- [Instagram 스크래퍼](https://apify.com/apify/instagram-scraper)를 사용하여 Instagram 게시물, 프로필, 장소, 사진 및 댓글 스크래핑
- [RAG 웹 브라우저](https://apify.com/apify/web-scraper)를 사용하여 웹 검색, 상위 N개 URL 스크래핑 및 해당 콘텐츠 반환

# MCP 클라이언트

Apify MCP 서버와 상호작용하기 위해 다음과 같은 MCP 클라이언트를 사용할 수 있습니다:

- [Claude Desktop](https://claude.ai/download) (Stdio 지원만 가능)
- [Visual Studio Code](https://code.visualstudio.com/) (Stdio 및 SSE 지원)
- [LibreChat](https://www.librechat.ai/) (Stdio 및 SSE 지원, 단 Authorization 헤더 없음)
- [Apify Tester MCP Client](https://apify.com/jiri.spilka/tester-mcp-client) (Authorization 헤더 포함 SSE 지원)
- 기타 클라이언트 [https://modelcontextprotocol.io/clients](https://modelcontextprotocol.io/clients)
- 추가 클라이언트 [https://glama.ai/mcp/clients](https://glama.ai/mcp/clients)

MCP 서버와 통합된 액터를 사용할 때 다음과 같은 요청을 할 수 있습니다:

- "웹을 검색하여 AI 에이전트에 대한 최신 트렌드를 요약해 줘"
- "샌프란시스코에서 상위 10개 이탈리안 레스토랑을 찾아 줘"
- "더 록의 인스타그램 프로필을 찾아 분석해 줘"
- "소스 URL과 함께 모델 컨텍스트 프로토콜 사용법 단계별 가이드를 제공해 줘"
- "사용할 수 있는 Apify 액터는 무엇이 있나요?"

다음 이미지는 Apify MCP 서버가 Apify 플랫폼 및 AI 클라이언트와 어떻게 상호작용하는지 보여줍니다:

![Actors-MCP-server](https://raw.githubusercontent.com/apify/actors-mcp-server/refs/heads/master/docs/actors-mcp-server.png)

MCP 테스터 클라이언트를 사용하면 액터를 동적으로 로드할 수 있지만, 아직 다른 MCP 클라이언트에서는 이 기능을 지원하지 않습니다.
더 많은 기능 추가를 계획 중이며, 자세한 내용은 [로드맵](#-로드맵-2025년-3월)을 참조하세요.

# 🤖 MCP 서버와 AI 에이전트의 관계는?

Apify MCP 서버는 MCP 프로토콜을 통해 Apify의 액터를 노출시켜, MCP 프로토콜을 구현한 AI 에이전트 또는 프레임워크가 데이터 추출, 웹 검색 등 다양한 작업을 위한 도구로 모든 Apify 액터에 접근할 수 있도록 합니다.

AI 에이전트에 대해 더 알아보려면 블로그 포스트 [AI 에이전트란 무엇인가요?](https://blog.apify.com/what-are-ai-agents/)를 확인하고 Apify의 선별된 [AI 에이전트 컬렉션](https://apify.com/store/collections/ai_agents)을 둘러보세요.
Apify에서 자신만의 AI 에이전트를 구축하고 수익화하는 데 관심이 있다면, Apify 플랫폼에서 AI 에이전트를 생성, 게시 및 수익화하는 방법에 대한 [단계별 가이드](https://blog.apify.com/how-to-build-an-ai-agent/)를 참조하세요.

# 🧱 컴포넌트

## 도구

### 액터

[Apify 액터](https://apify.com/store)는 모두 도구로 사용할 수 있습니다.
기본적으로 서버는 아래에 명시된 액터들로 사전 구성되어 있지만, 액터 입력을 제공하여 이를 재정의할 수 있습니다.

```text
'apify/instagram-scraper'
'apify/rag-web-browser'
'lukaskrivka/google-maps-with-contact-details'
```

MCP 서버는 액터 입력 스키마를 로드하고 해당 액터에 대응하는 MCP 도구를 생성합니다.
[RAG 웹 브라우저](https://apify.com/apify/rag-web-browser/input-schema)의 입력 스키마 예시를 참고하세요.

도구 이름은 반드시 `apify/rag-web-browser`와 같은 전체 액터 이름이어야 합니다.
MCP 도구의 인수는 액터의 입력 매개변수를 나타냅니다.
예를 들어, `apify/rag-web-browser` 액터의 인수는 다음과 같습니다.

```json
{
  "query": "restaurants in San Francisco",
  "maxResults": 3
}
```

입력 매개변수나 호출할 액터를 지정할 필요는 없으며, 모든 것은 LLM에 의해 관리됩니다.
도구가 호출되면 인수는 자동으로 LLM에 의해 액터로 전달됩니다.
사용 가능한 인수 목록은 해당 액터의 문서를 참조하세요.

### 헬퍼 도구

서버는 사용 가능한 액터를 탐색하고 세부 정보를 검색하기 위한 일련의 헬퍼 도구를 제공합니다.

- `get-actor-details`: 특정 액터에 대한 문서, 입력 스키마 및 세부 정보를 검색합니다.
- `discover-actors`: 키워드를 사용하여 관련 액터를 검색하고 그들의 세부 정보를 반환합니다.

또한 사용 가능한 도구 목록을 관리하는 도구도 있습니다. 그러나 도구를 동적으로 추가하고 제거하려면 MCP 클라이언트가 도구 목록을 업데이트할 수 있는 기능(`ToolListChangedNotificationSchema` 처리)이 필요하며, 일반적으로 이는 지원되지 않습니다.

[Apify Tester MCP Client](https://apify.com/jiri.spilka/tester-mcp-client) 액터를 사용하여 이 기능을 시험해 볼 수 있습니다.
활성화하려면 `enableActorAutoLoading` 매개변수를 설정하세요.

- `add-actor-as-tool`: 이름으로 액터를 사용 가능한 도구 목록에 추가하며, 나중에 실행하려면 사용자 동의가 필요합니다.
- `remove-actor-from-tool`: 더 이상 필요하지 않은 액터를 이름으로 사용 가능한 도구 목록에서 제거합니다.

## 프롬프트 및 리소스

서버는 어떠한 리소스와 프롬프트도 제공하지 않습니다.
향후 [Apify의 데이터셋](https://docs.apify.com/platform/storage/dataset)과 [키-값 저장소](https://docs.apify.com/platform/storage/key-value-store)를 리소스로 추가할 계획입니다.

# ⚙️ 사용 방법

Apify MCP 서버는 두 가지 방식으로 사용할 수 있습니다: **Apify 플랫폼에서 실행되는 Apify Actor**로 사용하거나, **로컬 머신에서 실행되는 서버**로 사용할 수 있습니다.

## 🇦 MCP 서버 Actor

### 대기 모드 웹 서버

이 Actor는 [**대기 모드**](https://docs.apify.com/platform/actors/running/standby)에서 실행되며, HTTP 요청을 수신하고 처리하는 웹 서버로 동작합니다.

기본 Actors로 서버를 시작하려면 [Apify API 토큰](https://console.apify.com/settings/integrations)과 함께 다음 URL로 HTTP GET 요청을 보내세요:

```
https://actors-mcp-server.apify.actor?token=<APIFY_TOKEN>
```

다른 Actors 세트로 MCP 서버를 시작하는 것도 가능합니다.
이를 위해서는 [태스크](https://docs.apify.com/platform/actors/running/tasks)를 생성하고 사용할 Actors 목록을 지정하세요.

그런 다음 선택한 Actors와 함께 대기 모드로 태스크를 실행하세요:

```shell
https://USERNAME--actors-mcp-server-task.apify.actor?token=<APIFY_TOKEN>
```

사용 가능한 모든 Actors 목록은 [Apify 스토어](https://apify.com/store)에서 확인할 수 있습니다.

#### 💬 SSE를 통해 MCP 서버와 상호작용

서버가 실행 중이면 Server-Sent Events(SSE)를 사용하여 서버에 메시지를 보내고 응답을 받을 수 있습니다.
가장 쉬운 방법은 Apify의 [Tester MCP Client](https://apify.com/jiri.spilka/tester-mcp-client)를 사용하는 것입니다.

[Claude Desktop](https://claude.ai/download)은 현재 SSE를 지원하지 않지만, Stdio 전송을 사용할 수 있습니다. 자세한 내용은 [로컬 호스트의 MCP 서버](#로컬-호스트에서-mcp-서버-실행하기)를 참조하세요.
참고: Claude Desktop의 무료 버전은 서버와의 연결이 간헐적으로 끊길 수 있습니다.

클라이언트 설정에서 서버 구성을 제공해야 합니다:

```json
{
  "mcpServers": {
    "apify": {
      "type": "sse",
      "url": "https://actors-mcp-server.apify.actor/sse",
      "env": {
        "APIFY_TOKEN": "your-apify-token"
      }
    }
  }
}
```

또는 [clientSse.ts](https://github.com/apify/actor-mcp-server/tree/main/src/examples/clientSse.ts) 스크립트를 사용하거나 `curl` </> 명령어로 서버를 테스트할 수 있습니다.

1. 서버-전송 이벤트(SSE)를 시작하려면 다음 URL로 GET 요청을 보내세요:

   ```
   curl https://actors-mcp-server.apify.actor/sse?token=<APIFY_TOKEN>
   ```

   서버는 `sessionId`로 응답하며, 이 ID를 사용하여 서버에 메시지를 보낼 수 있습니다:

   ```shell
   event: endpoint
   data: /message?sessionId=a1b
   ```

2. `sessionId`를 포함하여 POST 요청으로 서버에 메시지를 보내세요:

   ```shell
   curl -X POST "https://actors-mcp-server.apify.actor/message?token=<APIFY_TOKEN>&session_id=a1b" -H "Content-Type: application/json" -d '{
     "jsonrpc": "2.0",
     "id": 1,
     "method": "tools/call",
     "params": {
       "arguments": { "searchStringsArray": ["restaurants in San Francisco"], "maxCrawledPlacesPerSearch": 3 },
       "name": "lukaskrivka/google-maps-with-contact-details"
     }
   }'
   ```

   MCP 서버는 제공된 인수를 입력 매개변수로 사용하여 `lukaskrivka/google-maps-with-contact-details` 액터를 시작합니다.
   이 POST 요청에 대해 서버는 다음과 같이 응답합니다:

   ```text
   Accepted
   ```

3. 응답을 수신하세요. 서버는 지정된 액터를 도구로 호출하여 제공된 쿼리 매개변수를 사용하고, SSE를 통해 클라이언트로 응답을 스트리밍합니다.
   응답은 JSON 텍스트로 반환됩니다.

   ```text
   event: message
   data: {"result":{"content":[{"type":"text","text":"{\"searchString\":\"restaurants in San Francisco\",\"rank\":1,\"title\":\"Gary Danko\",\"description\":\"Renowned chef Gary Danko's fixed-price menus of American cuisine ... \",\"price\":\"$100+\"...}}]}}
   ```

## 로컬 호스트에서 MCP 서버 실행하기

Apify MCP 서버를 로컬 머신에서 실행하려면 Claude Desktop이나 다른 [MCP 클라이언트](https://modelcontextprotocol.io/clients)로 설정하면 됩니다.  
또는 [Smithery](https://smithery.ai/server/@apify/actors-mcp-server)를 사용해 서버를 자동으로 설치할 수도 있습니다.

### 필수 조건

- MacOS 또는 Windows
- 최신 버전의 Claude Desktop 설치 (또는 다른 MCP 클라이언트)
- [Node.js](https://nodejs.org/en) (v18 이상)
- [Apify API 토큰](https://docs.apify.com/platform/integrations/api#api-token) (`APIFY_TOKEN`)

`node`와 `npx`가 제대로 설치되었는지 확인하세요:

```bash
node -v
npx -v
```

설치되지 않았다면 다음 가이드를 참고하세요: [Node.js 및 npm 다운로드 및 설치](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

#### Claude Desktop 설정

MCP 서버와 연동하기 위해 Claude Desktop을 설정하려면 다음 단계를 따르세요. 자세한 내용은 [Claude Desktop 사용자 가이드](https://modelcontextprotocol.io/quickstart/user)를 참고하세요.

1. Claude 데스크톱 버전 다운로드
   - Windows와 macOS에서 사용 가능.
   - Linux 사용자는 [비공식 빌드 스크립트](https://github.com/aaddrick/claude-desktop-debian)로 Debian 패키지를 빌드할 수 있음.
2. Claude Desktop 앱을 열고 상단 왼쪽 메뉴 바에서 **개발자 모드**를 활성화.
3. 활성화 후, **설정**(상단 왼쪽 메뉴 바)에서 **개발자 옵션**으로 이동해 **구성 편집** 버튼을 클릭.
4. 다음 파일을 편집:

   - macOS: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "actors-mcp-server": {
         "command": "npx",
         "args": ["-y", "@apify/actors-mcp-server"],
         "env": {
           "APIFY_TOKEN": "your-apify-token"
         }
       }
     }
   }
   ```

   또는 `actors` 인수를 사용해 하나 이상의 Apify Actor를 선택할 수 있음:

   ```json
   {
     "mcpServers": {
       "actors-mcp-server": {
         "command": "npx",
         "args": [
           "-y",
           "@apify/actors-mcp-server",
           "--actors",
           "lukaskrivka/google-maps-with-contact-details,apify/instagram-scraper"
         ],
         "env": {
           "APIFY_TOKEN": "your-apify-token"
         }
       }
     }
   }
   ```

5. Claude Desktop 재시작

   - 완전히 종료(최소화나 닫기가 아님).
   - Claude Desktop을 다시 실행.
   - 🔌 아이콘으로 Actors MCP 서버 연결 확인.

6. Claude Desktop 채팅에서 "사용 가능한 Apify Actor는 무엇인가요?" 질문

   ![Claude-desktop-with-Actors-MCP-server](https://raw.githubusercontent.com/apify/actors-mcp-server/refs/heads/master/docs/claude-desktop.png)

7. 사용 예시

   Claude에게 다음과 같은 작업 요청 가능:

   ```text
   최신 LLM 연구 논문을 찾아 분석해줘.
   샌프란시스코에서 상위 10개 이탈리아 레스토랑을 찾아줘.
   더 록의 인스타그램 프로필을 찾아 분석해줘.
   ```

#### VS Code

원클릭 설치를 위해 아래 설치 버튼 중 하나를 클릭하세요:

[![Install with NPX in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=actors-mcp-server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40apify%2Factors-mcp-server%22%5D%2C%22env%22%3A%7B%22APIFY_TOKEN%22%3A%22%24%7Binput%3Aapify_token%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apify_token%22%2C%22description%22%3A%22Apify+API+Token%22%2C%22password%22%3Atrue%7D%5D) [![Install with NPX in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=actors-mcp-server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40apify%2Factors-mcp-server%22%5D%2C%22env%22%3A%7B%22APIFY_TOKEN%22%3A%22%24%7Binput%3Aapify_token%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apify_token%22%2C%22description%22%3A%22Apify+API+Token%22%2C%22password%22%3Atrue%7D%5D&quality=insiders)

##### 수동 설치

VS Code에서 Apify MCP 서버를 수동으로 설치하려면 위의 설치 버튼 중 하나를 클릭하여 원클릭 설치를 진행할 수 있습니다.

또는 VS Code 설정 파일에 다음 JSON 블록을 추가할 수 있습니다. `Ctrl + Shift + P`를 누르고 `Preferences: Open User Settings (JSON)`를 입력하여 설정 파일을 열 수 있습니다:

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apify_token",
        "description": "Apify API Token",
        "password": true
      }
    ],
    "servers": {
      "actors-mcp-server": {
        "command": "npx",
        "args": ["-y", "@apify/actors-mcp-server"],
        "env": {
          "APIFY_TOKEN": "${input:apify_token}"
        }
      }
    }
  }
}
```

또는 작업 공간의 `.vscode/mcp.json` 파일에 추가할 수도 있습니다. 이 경우 외부 `mcp {}` 키를 생략하면 됩니다. 이는 구성 파일을 다른 사람들과 공유하려는 경우 유용합니다.

로드할 액터를 지정하려면 `--actors` 인수를 추가할 수 있습니다:

```json
{
  "servers": {
    "actors-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@apify/actors-mcp-server",
        "--actors",
        "lukaskrivka/google-maps-with-contact-details,apify/instagram-scraper"
      ],
      "env": {
        "APIFY_TOKEN": "${input:apify_token}"
      }
    }
  }
}
```

#### @apify/actors-mcp-server 패키지를 @modelcontextprotocol/inspector로 디버깅하기

서버를 디버깅하려면 [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 도구를 사용하세요:

```shell
export APIFY_TOKEN=당신의-아피티-토큰
npx @modelcontextprotocol/inspector npx -y @apify/actors-mcp-server
```

### Smithery를 통한 설치

[Smithery](https://smithery.ai/server/@apify/actors-mcp-server)를 통해 Claude Desktop용 Apify Actors MCP Server를 자동으로 설치하려면:

```bash
npx -y @smithery/cli install @apify/actors-mcp-server --client claude
```

#### 표준 입출력 클라이언트

다음 내용으로 `.env` 환경 파일을 생성하세요:

```text
APIFY_TOKEN=당신의-아피티-토큰
```

`examples` 디렉토리에서 표준 입출력(stdio)을 통해 서버와 상호작용하는 예제 클라이언트를 찾을 수 있습니다:

- [`clientStdio.ts`](https://github.com/apify/actor-mcp-server/tree/main/src/examples/clientStdio.ts)
  이 클라이언트 스크립트는 두 개의 지정된 액터로 MCP 서버를 시작하고
  `apify/rag-web-browser` 도구를 쿼리와 함께 호출하여 결과를 기록합니다.
  MCP 서버에 연결하고, 사용 가능한 도구 목록을 확인하며, stdio 전송을 통해 특정 도구를 호출하는 방법을 보여줍니다.
  ```bash
  node dist/examples/clientStdio.js
  ```

# 👷 개발

## 요구사항

- [Node.js](https://nodejs.org/ko) (v18 이상)
- Python 3.9 이상

`.env` 환경 파일을 생성하세요:

```text
APIFY_TOKEN=당신의-아피티-토큰
```

actor-mcp-server 패키지 빌드:

```bash
npm run build
```

## 클라이언트 (SSE)

SSE 전송을 테스트하려면 `examples/clientSse.ts` 스크립트를 사용할 수 있습니다:
현재 Node.js 클라이언트는 커스텀 헤더가 있는 원격 서버에 연결하는 것을 지원하지 않습니다.
스크립트에서 서버 URL을 로컬 서버로 변경할 수 있습니다.

```bash
node dist/examples/clientSse.js
```

## 디버깅

MCP 서버는 stdio를 통해 실행되므로 디버깅이 어려울 수 있습니다.
최상의 디버깅 경험을 위해 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)를 사용하세요.

[`npm`](https://docs.npmjs.com/ko/downloading-and-installing-node-js-and-npm)을 사용하여 실행:

```bash
export APIFY_TOKEN=당신의-아피티-토큰
npx @modelcontextprotocol/inspector node ./dist/stdio.js
```

시작되면, 인스펙터는 브라우저에서 디버깅 인터페이스에 접근할 수 있는 URL을 표시합니다.

## ⓘ 제한 사항 및 피드백

액터 입력 스키마는 [JSON 스키마](https://json-schema.org/) 표준을 준수하면서 대부분의 MCP 클라이언트와 호환되도록 처리됩니다. 처리 과정에는 다음이 포함됩니다:

- **설명**은 500자로 제한됩니다(`MAX_DESCRIPTION_LENGTH`에 정의됨).
- **열거형 필드**는 모든 요소의 총 길이가 최대 200자로 제한됩니다(`ACTOR_ENUM_MAX_LENGTH`에 정의됨).
- **필수 필드**는 JSON 스키마를 제대로 처리하지 못할 수 있는 프레임워크와의 호환성을 위해 설명에 "REQUIRED" 접두사가 명시적으로 표시됩니다.
- **중첩 속성**은 프록시 구성 및 요청 목록 소스와 같은 특수한 경우에 대해 올바른 입력 구조를 보장하기 위해 구축됩니다.
- **배열 항목 유형**은 스키마에 명시적으로 정의되지 않은 경우 우선 순위에 따라 추론됩니다: 항목의 명시적 유형 > 미리 채우기 유형 > 기본값 유형 > 편집기 유형.
- **열거형 값 및 예제**는 클라이언트가 JSON 스키마를 완전히 지원하지 않더라도 가시성을 보장하기 위해 속성 설명에 추가됩니다.

각 액터의 메모리는 4GB로 제한됩니다.
무료 사용자는 8GB 제한이 있으며, `Actors-MCP-Server` 실행을 위해 128MB를 할당해야 합니다.

다른 기능이 필요하거나 피드백이 있는 경우, Apify 콘솔에서 [이슈를 제출](https://console.apify.com/actors/1lSvMAaRcadrM1Vgv/issues)하여 알려주세요.

# 🚀 로드맵 (2025년 3월)

- Apify의 데이터셋 및 키-값 저장소를 리소스로 추가.
- 디버깅을 위한 액터 로그 및 액터 실행과 같은 도구 추가.

# 🐛 문제 해결

- `node -v`를 실행하여 `node`가 설치되어 있는지 확인하세요.
- `APIFY_TOKEN` 환경 변수가 설정되어 있는지 확인하세요.
- `@apify/actors-mcp-server@latest`를 설정하여 항상 최신 버전의 MCP 서버를 사용하세요.

# 📚 더 알아보기

- [모델 컨텍스트 프로토콜](https://modelcontextprotocol.org/)
- [AI 에이전트란 무엇인가요?](https://blog.apify.com/what-are-ai-agents/)
- [MCP란 무엇이며 왜 중요한가요?](https://blog.apify.com/what-is-model-context-protocol/)
- [테스터 MCP 클라이언트](https://apify.com/jiri.spilka/tester-mcp-client)
- [AI 에이전트 워크플로우: Apify 데이터셋을 쿼리하는 에이전트 구축](https://blog.apify.com/ai-agent-workflow/)
- [MCP 클라이언트 개발 가이드](https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md)
- [Apify에서 AI 에이전트를 구축하고 수익화하는 방법](https://blog.apify.com/how-to-build-an-ai-agent/)
