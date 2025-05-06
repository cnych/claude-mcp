---
name: EdgeOne Pages MCP
digest: MCP 서비스는 HTML 콘텐츠를 EdgeOne Pages에 빠르게 배포하고, 쉽게 접근하고 공유할 수 있는 공개 URL을 생성합니다. 최소한의 설정으로 콘텐츠 게시 과정을 간소화합니다.
author: TencentEdgeOne
homepage: https://edgeone.ai/products/pages
repository: https://github.com/TencentEdgeOne/edgeone-pages-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 서버리스
  - 엣지
  - 텐센트
icon: https://avatars.githubusercontent.com/u/176978739?v=4
createTime: 2025-03-25
---

HTML 콘텐츠를 EdgeOne Pages에 배포하고 공개적으로 접근 가능한 URL을 얻기 위한 MCP 서비스입니다.

## 데모

![텐센트 EdgeOne Pages MCP 데모](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-ef5005b0.gif)

## 요구사항

- Node.js 18 이상

## MCP 구성

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "command": "npx",
      "args": ["edgeone-pages-mcp"]
    }
  }
}
```

## 아키텍처

![EdgeOne Pages MCP 아키텍처](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-4f131d90.svg)

아키텍처 다이어그램은 다음 작업 흐름을 보여줍니다:

1. 대형 언어 모델이 HTML 콘텐츠를 생성
2. 콘텐츠가 EdgeOne Pages MCP 서버로 전송
3. MCP 서버가 EdgeOne Pages Edge Functions에 콘텐츠 배포
4. 콘텐츠가 빠른 엣지 액세스를 위해 EdgeOne KV 저장소에 저장
5. MCP 서버가 공개 URL 반환
6. 사용자가 브라우저를 통해 배포된 콘텐츠에 접근할 수 있으며, 빠른 엣지 전송을 통해 콘텐츠를 제공

## 기능

- EdgeOne Pages에 HTML 콘텐츠를 빠르게 배포하기 위한 MCP 프로토콜
- 공개적으로 접근 가능한 URL을 자동으로 생성

## 구현

이 MCP 서비스는 EdgeOne Pages Functions을 통해 정적 HTML 콘텐츠를 배포합니다. 구현에는 다음이 사용됩니다:

1. **EdgeOne Pages Functions** - 엣지에서 JavaScript/TypeScript 코드를 실행할 수 있는 서버리스 컴퓨팅 플랫폼입니다.

2. **중요한 구현 세부 사항** :

   - EdgeOne Pages KV 저장소를 사용하여 HTML 콘텐츠를 저장하고 제공
   - 각 배포에 대해 공개 URL을 자동으로 생성
   - 적절한 오류 메시지로 API 오류 처리

3. **작동 방식** :

   - MCP 서버가 `deploy-html` 도구를 통해 HTML 콘텐츠를 수락
   - EdgeOne Pages API에 연결하여 기본 URL을 가져옵니다.
   - EdgeOne Pages KV API를 사용하여 HTML 콘텐츠 배포
   - 배포된 콘텐츠에 대한 공개 URL 반환

4. **사용 예제** :

   - MCP 서비스에 HTML 콘텐츠 제공
   - 즉시 액세스할 수 있는 공개 URL 수신

더 많은 정보는 [EdgeOne Pages Functions 문서](https://edgeone.ai/document/162227908259442688)와 [EdgeOne Pages KV 저장소 가이드](https://edgeone.ai/document/162227803822321664)를 참조하세요.
