---
title: MCP Streamable HTTP 신규 프로토콜 사용
description: Streamable HTTP는 MCP의 전송 프로토콜 중 하나로, HTTP와 Server-Sent Events(SSE) 기술을 결합하여 현대 분산 시스템에 유연한 양방향 통신 기능을 제공합니다. 이번 섹션에서는 Streamable HTTP 프로토콜 사용 방법을 소개합니다.
section: base-dev
prev: sampling-usage
next: dev-sse-mcp
pubDate: 2025-04-24
order: 6
---

# MCP Streamable HTTP 신규 프로토콜 사용 방법

앞서 설명드린 바와 같이, MCP는 최신 2025-03-26 버전에서 HTTP와 Server-Sent Events(SSE) 기술을 결합한 새로운 전송 프로토콜인 Streamable HTTP를 제공합니다. 이는 현대 분산 시스템에 유연한 양방향 통신 기능을 제공합니다. MCP Typescript SDK는 [1.10.0 버전](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/1.10.0)에서 이 프로토콜을 공식 지원합니다. 이번 섹션에서는 Streamable HTTP 프로토콜의 상세 사용 방법을 설명드리겠습니다.

## MCP 서버 구현

먼저 간단한 Streamable HTTP 서버를 구현하는 방법을 살펴보겠습니다. Streamable HTTP 전송 프로토콜을 설치 및 구성하는 방식으로, 클라이언트 요청과 서버에서 클라이언트로의 알림을 동시에 처리할 수 있습니다. 여기서는 `Express` 프레임워크를 사용하여 구현하겠습니다.

먼저 아래 명령어로 프로젝트를 초기화합니다:

```bash
npx @modelcontextprotocol/create-server streamable-demo
```

그런 다음 프로젝트 루트 디렉토리로 이동하여 `package.json` 파일의 MCP SDK 의존성 버전을 `1.10.0`으로 수정합니다.

![Update MCP SDK](https://static.claudemcp.com/images/streamable-demo-update-sdk.png)

이어서 의존성을 설치합니다:

```bash
npm i express zod && npm i --save-dev @types/express && npm i
```

`src/server/simpleStreamableHttp.ts` 파일을 새로 생성합니다.

먼저 의존성 패키지를 임포트하고 Express 애플리케이션을 초기화합니다:

```typescript
import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolResult,
  GetPromptResult,
  isInitializeRequest,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { InMemoryEventStore } from "../inMemoryEventStore.js";

const app = express();
app.use(express.json());
```

Streamable HTTP 프로토콜에 따라 MCP 요청을 처리하기 위한 `/mcp` POST 엔드포인트를 구현해야 합니다:

```typescript
// 세션 ID별 transport 저장
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

app.post("/mcp", async (req: Request, res: Response) => {
  console.log("Received MCP request:", req.body);
  try {
    // 세션 ID가 존재하는지 확인
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // 기존 transport 재사용
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // 새로운 초기화 요청
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore, // 복구 가능성 활성화
        onsessioninitialized: (sessionId) => {
          // 세션 초기화 시 세션 ID로 transport 저장
          // 세션 저장 전에 발생할 수 있는 요청 경합 조건 방지
          console.log(`Session initialized with ID: ${sessionId}`);
          transports[sessionId] = transport;
        },
      });

      // 닫힐 때 transport를 정리하기 위한 onclose 핸들러 설정
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          );
          delete transports[sid];
        }
      };

      // 요청을 처리하기 전에 transport를 MCP 서버에 연결
      // 이로써 응답이 동일한 transport를 통해 스트리밍 가능
      const server = getServer();
      await server.connect(transport);

      await transport.handleRequest(req, res, req.body);
      return; // 이미 처리됨
    } else {
      // 유효하지 않은 요청 - 세션 ID가 없거나 초기화 요청이 아님
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // 기존 transport로 요청 처리 - 재연결 불필요
    // 기존 transport는 이미 서버에 연결되어 있음
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});
```

## MCP Streamable HTTP 클라이언트 구현

간단한 MCP Streamable HTTP 서버를 구현한 후, 이제 이와 통신할 클라이언트를 구현하는 방법을 살펴보겠습니다.

`@modelcontextprotocol/sdk/client/mcp.js`의 `StreamableHTTPClient` 클래스를 사용하여 Streamable HTTP 서버에 연결하는 전체 기능을 갖춘 대화형 클라이언트를 구현할 것입니다. 이 클라이언트는 다음을 시연합니다:

- MCP 서버와의 연결 설정 및 관리
- 매개변수가 있는 도구 목록 조회 및 호출
- SSE 스트림을 통한 알림 처리
- 매개변수가 있는 프롬프트 목록 조회 및 가져오기
- 사용 가능한 리소스 목록 조회
- 세션 종료 및 재연결 관리
- 복구를 위한 Last-Event-ID 추적 지원

## 테스트

프로젝트의 `package.json` 파일에 서버와 클라이언트를 각각 빌드하기 위한 두 개의 스크립트를 추가할 수 있습니다:

```json
"scripts": {
  "build-server": "tsc && node -e \"require('fs').chmodSync('build/server/simpleStreamableHttp.js', '755')\"",
  "build-client": "tsc && node -e \"require('fs').chmodSync('build/client/simpleStreamableHttp.js', '755')\"",
}
```

이렇게 하면 `npm run build-server`와 `npm run build-client`를 사용하여 서버와 클라이언트를 각각 빌드할 수 있습니다.

그런 다음 `node build/server/simpleStreamableHttp.js`로 서버를 실행하고 `node build/client/simpleStreamableHttp.js`로 클라이언트를 실행할 수 있습니다.

## 결론

최신 MCP TypeScript SDK를 사용하여, 간단한 Streamable HTTP 서버와 클라이언트를 구현했습니다. Streamable HTTP 프로토콜은 표준 HTTP와 SSE 기술을 통해 양방향 통신을 가능하게 하므로 현대 분산 시스템에 적합합니다.

더 많은 예제는 다음에서 확인할 수 있습니다:

- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/examples/server/simpleStreamableHttp.ts
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/examples/client/simpleStreamableHttp.ts
