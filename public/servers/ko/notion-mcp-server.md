---
name: Notion MCP Server
digest: Notion-MCP는 Notion의 기능을 향상시키는 서버 솔루션으로, 향상된 성능, 안정성 및 사용자 정의 옵션을 제공합니다. Notion을 생산성 플랫폼으로 사용하는 팀을 위한 원활한 통합, 빠른 데이터 처리 및 더 나은 확장성을 제공합니다. 이 서비스는 안정적인 연결성과 최적화된 워크플로를 보장합니다.
author: makenotion
homepage: https://github.com/makenotion/notion-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - server
  - notion
icon: https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-e217db9f.jpg
createTime: 2025-03-11
---

이 프로젝트는 [Notion API](https://developers.notion.com/reference/intro)를 위한 [MCP 서버](https://www.claudemcp.com/ko/specification)를 구현합니다.

![mcp-demo](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-329eb145.jpg)

## 설치

### Notion에서 통합 설정하기:

[https://www.notion.so/profile/integrations](https://www.notion.so/profile/integrations)로 이동하여 새로운 **내부** 통합을 생성하거나 기존 통합을 선택하세요.

![Notion 통합 토큰 생성](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-ede5f671.png)

보안을 위해 "구성" 탭에서 "콘텐츠 읽기" 권한만 부여하여 읽기 전용 통합 토큰을 생성할 수 있습니다:

![읽기 콘텐츠 권한이 체크된 Notion 통합 토큰 기능](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-d83f196f.png)

### 클라이언트에 MCP 구성 추가:

#### npm 사용:

`.cursor/mcp.json` 또는 `claude_desktop_config.json`에 다음을 추가하세요:

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\" }"
      }
    }
  }
}
```

#### Docker 사용:

Docker 이미지 빌드:

```bash
docker-compose build
```

그런 다음 구성에 추가:

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "OPENAPI_MCP_HEADERS={\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\"}",
        "notion-mcp-server-notion-mcp-server"
      ]
    }
  }
}
```

`ntn_****`를 통합 시크릿으로 교체하세요:

![개발자 포털의 구성 탭에서 통합 토큰 복사](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-2c84281a.jpg)

### 콘텐츠를 통합에 연결:

페이지/데이터베이스를 방문하고 3점 메뉴에서 "통합에 연결"을 클릭하세요.

![Notion 연결에 통합 토큰 추가](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-a69b7191.png)

## 예시

1. 페이지에 댓글 달기:

```
"Getting started" 페이지에 "Hello MCP" 댓글 달기
```

2. 새 페이지 생성:

```
"Development" 페이지에 "Notion MCP" 제목의 페이지 추가
```

3. ID로 페이지 콘텐츠 가져오기:

```
1a6b35e6e67f802fa7e1d27686f017f2 페이지의 콘텐츠 가져오기
```

## 개발

빌드:

```
npm run build
```

실행:

```
npx -y --prefix /path/to/local/notion-mcp-server @notionhq/notion-mcp-server
```

배포:

```
npm publish --access public
```
