---
title: MCP Streamable HTTP 新协议使用
description: Streamable HTTP 是 MCP 的传输协议之一，它结合了 HTTP 和 Server-Sent Events (SSE) 技术，为现代分布式系统提供了灵活的双向通信能力，本节将为大家介绍如何使用 Streamable HTTP 协议。
section: base-dev
prev: sampling-usage
next: dev-sse-mcp
pubDate: 2025-04-24
order: 6
---

# MCP Streamable HTTP 新协议的使用

在前面我们已经介绍了 MCP 在[最新的 2025-03-26 版本](/zh/docs/transports-2025-03-26)中，为我们提供了一种新的传输协议：Streamable HTTP，它结合了 HTTP 和 Server-Sent Events (SSE) 技术，为现代分布式系统提供了灵活的双向通信能力。而 MCP Typescript SDK 在 [1.10.0 版本](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/1.10.0)中已经正式支持该协议。本节我们将来详细介绍如何使用 Streamable HTTP 协议。

## MCP 服务器实现

首先我们来看看如何实现一个简单的 Streamable HTTP 服务器，安装配置 Streamable HTTP 传输协议方式，可以同时处理客户端请求和从服务器到客户端的通知。这里我们使用 `Express` 框架来实现。

首先使用如下所示的命令初始化项目：

```bash
npx @modelcontextprotocol/create-server streamable-demo
```

然后进入项目根目录，修改 `package.json` 文件中的 MCP SDK 依赖版本为 `1.10.0`。

![Update MCP SDK](https://static.claudemcp.com/images/streamable-demo-update-sdk.png)

然后接下来安装依赖：

```bash
npm i express zod && npm i --save-dev @types/express && npm i
```

新建 `src/server/simpleStreamableHttp.ts` 文件。

首先我们导入依赖包并初始化 Express 应用：

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

然后根据 Streamable HTTP 协议我们需要实现一个 `/mcp` 的 POST 端点，用于处理 MCP 请求，代码如下所示：

```typescript
// 按 session ID 存储 transports
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

app.post("/mcp", async (req: Request, res: Response) => {
  console.log("Received MCP request:", req.body);
  try {
    // 检查是否存在 session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // 重用现有的 transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // 新的初始化请求
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore, // 启用可恢复性
        onsessioninitialized: (sessionId) => {
          // 当 session 初始化时，按 session ID 存储 transport
          // 这避免了在 session 存储之前可能发生的请求竞争条件
          console.log(`Session initialized with ID: ${sessionId}`);
          transports[sessionId] = transport;
        },
      });

      // 设置 onclose 处理程序以在关闭时清理 transport
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          );
          delete transports[sid];
        }
      };

      // 在处理请求之前将 transport 连接到 MCP 服务器
      // 这样响应可以流回同一个 transport
      const server = getServer();
      await server.connect(transport);

      await transport.handleRequest(req, res, req.body);
      return; // 已经处理
    } else {
      // 无效请求 - 没有 session ID 或不是初始化请求
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

    // 使用现有的 transport 处理请求 - 不需要重新连接
    // 现有的 transport 已经连接到服务器
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

在上面代码中我们首先定义了一个 `transports` 对象，用于存储每个 session 的 transport 实例。然后我们实现了一个 `/mcp` 的 POST 端点，用于处理 MCP 请求，根据协议要求，如果请求中包含 `mcp-session-id` 头，则表示是一个重试请求，我们使用已有的 transport 实例，如果没有该请求头，那么需要判断是否一个新的初始化请求，如果是则创建一个新的 transport 实例，拿到了 transport 实例之后，我们就可以直接调用 `transport.handleRequest(req, res, req.body);` 方法来处理请求了。

这里的重点当然就是初始化 transport 实例，这里我们使用 `StreamableHTTPServerTransport` 类来实现，它提供了 `sessionIdGenerator` 方法来生成 session ID，`eventStore` 方法来存储事件，`onsessioninitialized` 方法来在 session 初始化时存储 transport 实例。

这里我们简单实现了一个基于内存的 `InMemoryEventStore` 类来存储事件，完整代码如下所示：

```typescript
// src/inMemoryEventStore.ts
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { EventStore } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

/**
 * 简单实现 EventStore 接口的内存实现，用于恢复
 * 主要用于示例和测试，不适用于生产环境，需要使用持久化存储解决方案
 */
export class InMemoryEventStore implements EventStore {
  private events: Map<string, { streamId: string; message: JSONRPCMessage }> =
    new Map();

  /**
   * 生成一个唯一的 event ID 给定 stream ID
   */
  private generateEventId(streamId: string): string {
    return `${streamId}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  }

  /**
   * 从 event ID 提取 stream ID
   */
  private getStreamIdFromEventId(eventId: string): string {
    const parts = eventId.split("_");
    return parts.length > 0 ? parts[0] : "";
  }

  /**
   * 存储一个带有生成 event ID 的事件
   * Implements EventStore.storeEvent
   */
  async storeEvent(streamId: string, message: JSONRPCMessage): Promise<string> {
    const eventId = this.generateEventId(streamId);
    this.events.set(eventId, { streamId, message });
    return eventId;
  }

  /**
   * 重放发生在特定 event ID 之后的事件
   * Implements EventStore.replayEventsAfter
   */
  async replayEventsAfter(
    lastEventId: string,
    {
      send,
    }: { send: (eventId: string, message: JSONRPCMessage) => Promise<void> }
  ): Promise<string> {
    if (!lastEventId || !this.events.has(lastEventId)) {
      return "";
    }

    // 从 event ID 提取 stream ID
    const streamId = this.getStreamIdFromEventId(lastEventId);
    if (!streamId) {
      return "";
    }

    let foundLastEvent = false;

    // 按 eventId 排序事件以进行时间顺序排序
    const sortedEvents = [...this.events.entries()].sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    for (const [
      eventId,
      { streamId: eventStreamId, message },
    ] of sortedEvents) {
      // 只包含来自同一 stream 的事件
      if (eventStreamId !== streamId) {
        continue;
      }

      // 找到 lastEventId 后开始发送事件
      if (eventId === lastEventId) {
        foundLastEvent = true;
        continue;
      }

      if (foundLastEvent) {
        await send(eventId, message);
      }
    }
    return streamId;
  }
}
```

`EventStore` 是一个用于支持恢复的事件存储接口，它定义了两个方法：

- `storeEvent`：存储一个事件以便稍后检索
- `replayEventsAfter`：重放发生在特定事件 ID 之后的事件

上面的 `InMemoryEventStore` 类实现了 `EventStore` 接口，主要用于示例和测试，不适用于生产环境，需要使用持久化存储解决方案。这样 `transport` 实例就可以使用该事件存储对象来存储和恢复事件了。

到这里我们就将 `transport` 实例初始化好了，接下来我们还需要配置一个 `onclose` 处理程序，当 transport 关闭时，我们需要清理 `transports` 对象中的 transport 实例，代码如下所示：

```typescript
// 设置 onclose 处理程序以在关闭时清理 transport
transport.onclose = () => {
  const sid = transport.sessionId;
  if (sid && transports[sid]) {
    console.log(
      `Transport closed for session ${sid}, removing from transports map`
    );
    delete transports[sid];
  }
};
```

接下来就是最重要部分了，我们需要将 MCP 服务器实例和 transport 实例连接起来，这样响应可以流回同一个 transport：

```typescript
// 在处理请求之前将 transport 连接到 MCP 服务器
// 这样响应可以流回同一个 transport
const server = getServer();
await server.connect(transport);

await transport.handleRequest(req, res, req.body);
return; // 已经处理
```

所以接下来我们还需要实现一个 `getServer` 函数，它用于创建一个 MCP 服务器实例，并注册一些工具和资源等（可以参考 [MCP 服务器实现](/zh/docs/write-ts-server)），代码如下所示：

```typescript
// 创建一个 MCP 服务器
const getServer = () => {
  const server = new McpServer(
    {
      name: "simple-streamable",
      version: "1.0.0",
    },
    { capabilities: { logging: {} } }
  );

  // 注册一个简单的工具，返回问候
  server.tool(
    "greet",
    "一个简单的问候工具",
    {
      name: z.string().describe("要问候的名字"),
    },
    async ({ name }): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${name}!`,
          },
        ],
      };
    }
  );

  // 注册一个工具，发送多个问候
  server.tool(
    "multi-greet",
    "一个工具，发送不同的问候，并在它们之间有延迟",
    {
      name: z.string().describe("要问候的名字"),
    },
    async ({ name }, { sendNotification }): Promise<CallToolResult> => {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // 发送通知
      await sendNotification({
        method: "notifications/message",
        params: { level: "debug", data: `开始多个问候 ${name}` },
      });

      await sleep(1000); // 等待 1 秒再发送第一个问候

      await sendNotification({
        method: "notifications/message",
        params: { level: "info", data: `发送第一个问候给 ${name}` },
      });

      await sleep(1000); // 等待 1 秒再发送第二个问候

      await sendNotification({
        method: "notifications/message",
        params: { level: "info", data: `发送第二个问候给 ${name}` },
      });

      return {
        content: [
          {
            type: "text",
            text: `早上好, ${name}!`,
          },
        ],
      };
    }
  );

  // 注册一个工具，专门用于测试恢复
  server.tool(
    "start-notification-stream",
    "开始发送周期性通知以测试恢复",
    {
      interval: z.number().describe("通知之间的间隔（毫秒）").default(100),
      count: z.number().describe("要发送的通知数量（0 表示 100）").default(50),
    },
    async (
      { interval, count },
      { sendNotification }
    ): Promise<CallToolResult> => {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      let counter = 0;

      while (count === 0 || counter < count) {
        counter++;
        try {
          await sendNotification({
            method: "notifications/message",
            params: {
              level: "info",
              data: `周期性通知 #${counter} 在 ${new Date().toISOString()}`,
            },
          });
        } catch (error) {
          console.error("Error sending notification:", error);
        }
        // 等待指定的间隔
        await sleep(interval);
      }

      return {
        content: [
          {
            type: "text",
            text: `开始每 ${interval}ms 发送周期性通知`,
          },
        ],
      };
    }
  );

  // 注册一个简单的提示词
  server.prompt(
    "greeting-template",
    "一个简单的问候提示模板",
    {
      name: z.string().describe("Name to include in greeting"),
    },
    async ({ name }): Promise<GetPromptResult> => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `请用友好的方式问候 ${name}。`,
            },
          },
        ],
      };
    }
  );

  // 创建一个固定 URI 的简单资源
  server.resource(
    "greeting-resource",
    "https://www.claudemcp.com/docs",
    { mimeType: "text/plain" },
    async (): Promise<ReadResourceResult> => {
      return {
        contents: [
          {
            uri: "https://www.claudemcp.com/docs",
            text: "Hello, world!",
          },
        ],
      };
    }
  );
  return server;
};
```

上面代码中我们实现了 3 个工具，一个提示词和资源，其中：

- `greet` 工具：一个简单的问候工具，返回问候信息，和以前我们实现的工具类似
- `multi-greet` 工具：发送多个问候，并在它们之间有延迟
- `start-notification-stream` 工具：开始发送周期性通知以测试恢复
- `greeting-template` 提示词：一个简单的问候提示模板
- `greeting-resource` 资源：一个固定 URI 的简单资源

接下来我们还需要实现一个 `/mcp` 的 GET 端点，处理通过 SSE 从服务器到客户端的通知的 GET 请求，
以及实现一个 `/mcp` 的 DELETE 端点，用于处理终止会话的删除请求（根据 MCP 规范），代码如下所示：

```typescript
// 可重用的 GET 和 DELETE 请求处理程序
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// 处理通过 SSE 从服务器到客户端的通知的 GET 请求
app.get("/mcp", handleSessionRequest);

// 处理终止会话的 DELETE 请求
app.delete("/mcp", handleSessionRequest);
```

最后启动 Express 应用即可，代码如下所示：

```typescript
// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`MCP Streamable HTTP Server listening on port ${PORT}`);
});

// 处理服务器关闭
process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  // 关闭所有活跃的 transports 以清理资源
  for (const sessionId in transports) {
    try {
      console.log(`Closing transport for session ${sessionId}`);
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
  console.log("Server shutdown complete");
  process.exit(0);
});
```

## MCP Streamable HTTP 客户端实现

上面我们实现了一个简单的 MCP Streamable HTTP 服务器，接下来我们来看看如何实现一个 MCP Streamable HTTP 客户端，

这里我们使用 `@modelcontextprotocol/sdk/client/mcp.js` 中的 `StreamableHTTPClient` 类来实现，
它是一个全功能的交互式客户端，连接到 Streamable HTTP 服务器，演示如何：

- 建立和管理到 MCP 服务器的连接
- 列出和调用带有参数的工具
- 通过 SSE 流处理通知
- 列出和获取带有参数的提示词
- 列出可用资源
- 处理会话终止和重新连接
- 支持 Last-Event-ID 跟踪进行恢复

```typescript
// src/client/simpleStreamableHttp.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createInterface } from "node:readline";
import {
  ListToolsRequest,
  ListToolsResultSchema,
  CallToolRequest,
  CallToolResultSchema,
  ListPromptsRequest,
  ListPromptsResultSchema,
  GetPromptRequest,
  GetPromptResultSchema,
  ListResourcesRequest,
  ListResourcesResultSchema,
  LoggingMessageNotificationSchema,
  ResourceListChangedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create readline interface for user input
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 跟踪接收的通知以进行调试恢复
let notificationCount = 0;

// 全局客户端和 Transport 对象用于交互命令
let client: Client | null = null;
let transport: StreamableHTTPClientTransport | null = null;
let serverUrl = "http://localhost:3000/mcp";
let notificationsToolLastEventId: string | undefined = undefined;
let sessionId: string | undefined = undefined;

async function main(): Promise<void> {
  console.log("MCP Interactive Client");
  console.log("=====================");

  // 立即使用默认设置连接到服务器
  await connect();

  // 打印帮助并开始命令循环
  printHelp();
  commandLoop();
}

function printHelp(): void {
  console.log("\nAvailable commands:");
  console.log(
    "  connect [url]              - Connect to MCP server (default: http://localhost:3000/mcp)"
  );
  console.log("  disconnect                 - Disconnect from server");
  console.log("  terminate-session          - Terminate the current session");
  console.log("  reconnect                  - Reconnect to the server");
  console.log("  list-tools                 - List available tools");
  console.log(
    "  call-tool <name> [args]    - Call a tool with optional JSON arguments"
  );
  console.log("  greet [name]               - Call the greet tool");
  console.log(
    "  multi-greet [name]         - Call the multi-greet tool with notifications"
  );
  console.log(
    "  start-notifications [interval] [count] - Start periodic notifications"
  );
  console.log("  list-prompts               - List available prompts");
  console.log(
    "  get-prompt [name] [args]   - Get a prompt with optional JSON arguments"
  );
  console.log("  list-resources             - List available resources");
  console.log("  help                       - Show this help");
  console.log("  quit                       - Exit the program");
}

function commandLoop(): void {
  readline.question("\n> ", async (input) => {
    const args = input.trim().split(/\s+/);
    const command = args[0]?.toLowerCase();

    try {
      switch (command) {
        case "connect":
          await connect(args[1]);
          break;

        case "disconnect":
          await disconnect();
          break;

        case "terminate-session":
          await terminateSession();
          break;

        case "reconnect":
          await reconnect();
          break;

        case "list-tools":
          await listTools();
          break;

        case "call-tool":
          if (args.length < 2) {
            console.log("Usage: call-tool <name> [args]");
          } else {
            const toolName = args[1];
            let toolArgs = {};
            if (args.length > 2) {
              try {
                toolArgs = JSON.parse(args.slice(2).join(" "));
              } catch {
                console.log("Invalid JSON arguments. Using empty args.");
              }
            }
            await callTool(toolName, toolArgs);
          }
          break;

        case "greet":
          await callGreetTool(args[1] || "MCP User");
          break;

        case "multi-greet":
          await callMultiGreetTool(args[1] || "MCP User");
          break;

        case "start-notifications": {
          const interval = args[1] ? parseInt(args[1], 10) : 2000;
          const count = args[2] ? parseInt(args[2], 10) : 10;
          await startNotifications(interval, count);
          break;
        }

        case "list-prompts":
          await listPrompts();
          break;

        case "get-prompt":
          if (args.length < 2) {
            console.log("Usage: get-prompt <name> [args]");
          } else {
            const promptName = args[1];
            let promptArgs = {};
            if (args.length > 2) {
              try {
                promptArgs = JSON.parse(args.slice(2).join(" "));
              } catch {
                console.log("Invalid JSON arguments. Using empty args.");
              }
            }
            await getPrompt(promptName, promptArgs);
          }
          break;

        case "list-resources":
          await listResources();
          break;

        case "help":
          printHelp();
          break;

        case "quit":
        case "exit":
          await cleanup();
          return;

        default:
          if (command) {
            console.log(`Unknown command: ${command}`);
          }
          break;
      }
    } catch (error) {
      console.error(`Error executing command: ${error}`);
    }

    // Continue the command loop
    commandLoop();
  });
}

async function connect(url?: string): Promise<void> {
  if (client) {
    console.log("Already connected. Disconnect first.");
    return;
  }

  if (url) {
    serverUrl = url;
  }

  console.log(`Connecting to ${serverUrl}...`);

  try {
    // Create a new client
    client = new Client({
      name: "example-client",
      version: "1.0.0",
    });
    client.onerror = (error) => {
      console.error("\x1b[31mClient error:", error, "\x1b[0m");
    };

    transport = new StreamableHTTPClientTransport(new URL(serverUrl), {
      sessionId: sessionId,
    });

    // Set up notification handlers
    client.setNotificationHandler(
      LoggingMessageNotificationSchema,
      (notification) => {
        notificationCount++;
        console.log(
          `\nNotification #${notificationCount}: ${notification.params.level} - ${notification.params.data}`
        );
        // Re-display the prompt
        process.stdout.write("> ");
      }
    );

    client.setNotificationHandler(
      ResourceListChangedNotificationSchema,
      async (_) => {
        console.log(`\nResource list changed notification received!`);
        try {
          if (!client) {
            console.log("Client disconnected, cannot fetch resources");
            return;
          }
          const resourcesResult = await client.request(
            {
              method: "resources/list",
              params: {},
            },
            ListResourcesResultSchema
          );
          console.log(
            "Available resources count:",
            resourcesResult.resources.length
          );
        } catch {
          console.log("Failed to list resources after change notification");
        }
        // Re-display the prompt
        process.stdout.write("> ");
      }
    );

    // Connect the client
    await client.connect(transport);
    sessionId = transport.sessionId;
    console.log("Transport created with session ID:", sessionId);
    console.log("Connected to MCP server");
  } catch (error) {
    console.error("Failed to connect:", error);
    client = null;
    transport = null;
  }
}

async function disconnect(): Promise<void> {
  if (!client || !transport) {
    console.log("Not connected.");
    return;
  }

  try {
    await transport.close();
    console.log("Disconnected from MCP server");
    client = null;
    transport = null;
  } catch (error) {
    console.error("Error disconnecting:", error);
  }
}

async function terminateSession(): Promise<void> {
  if (!client || !transport) {
    console.log("Not connected.");
    return;
  }

  try {
    console.log("Terminating session with ID:", transport.sessionId);
    await transport.terminateSession();
    console.log("Session terminated successfully");

    // Check if sessionId was cleared after termination
    if (!transport.sessionId) {
      console.log("Session ID has been cleared");
      sessionId = undefined;

      // Also close the transport and clear client objects
      await transport.close();
      console.log("Transport closed after session termination");
      client = null;
      transport = null;
    } else {
      console.log(
        "Server responded with 405 Method Not Allowed (session termination not supported)"
      );
      console.log("Session ID is still active:", transport.sessionId);
    }
  } catch (error) {
    console.error("Error terminating session:", error);
  }
}

async function reconnect(): Promise<void> {
  if (client) {
    await disconnect();
  }
  await connect();
}

async function listTools(): Promise<void> {
  if (!client) {
    console.log("Not connected to server.");
    return;
  }

  try {
    const toolsRequest: ListToolsRequest = {
      method: "tools/list",
      params: {},
    };
    const toolsResult = await client.request(
      toolsRequest,
      ListToolsResultSchema
    );

    console.log("Available tools:");
    if (toolsResult.tools.length === 0) {
      console.log("  No tools available");
    } else {
      for (const tool of toolsResult.tools) {
        console.log(`  - ${tool.name}: ${tool.description}`);
      }
    }
  } catch (error) {
    console.log(`Tools not supported by this server (${error})`);
  }
}

async function callTool(
  name: string,
  args: Record<string, unknown>
): Promise<void> {
  if (!client) {
    console.log("Not connected to server.");
    return;
  }

  try {
    const request: CallToolRequest = {
      method: "tools/call",
      params: {
        name,
        arguments: args,
      },
    };

    console.log(`Calling tool '${name}' with args:`, args);
    const onLastEventIdUpdate = (event: string) => {
      notificationsToolLastEventId = event;
    };
    const result = await client.request(request, CallToolResultSchema, {
      // resumptionToken: notificationsToolLastEventId, // bug，不能每次都传递，应该需要重连的时候再传递
      onresumptiontoken: onLastEventIdUpdate,
    });

    console.log("Tool result:");
    result.content.forEach((item) => {
      if (item.type === "text") {
        console.log(`  ${item.text}`);
      } else {
        console.log(`  ${item.type} content:`, item);
      }
    });
  } catch (error) {
    console.log(`Error calling tool ${name}: ${error}`);
  }
}

async function callGreetTool(name: string): Promise<void> {
  await callTool("greet", { name });
}

async function callMultiGreetTool(name: string): Promise<void> {
  console.log("Calling multi-greet tool with notifications...");
  await callTool("multi-greet", { name });
}

async function startNotifications(
  interval: number,
  count: number
): Promise<void> {
  console.log(
    `Starting notification stream: interval=${interval}ms, count=${
      count || "unlimited"
    }`
  );
  await callTool("start-notification-stream", { interval, count });
}

async function listPrompts(): Promise<void> {
  if (!client) {
    console.log("Not connected to server.");
    return;
  }

  try {
    const promptsRequest: ListPromptsRequest = {
      method: "prompts/list",
      params: {},
    };
    const promptsResult = await client.request(
      promptsRequest,
      ListPromptsResultSchema
    );
    console.log("Available prompts:");
    if (promptsResult.prompts.length === 0) {
      console.log("  No prompts available");
    } else {
      for (const prompt of promptsResult.prompts) {
        console.log(`  - ${prompt.name}: ${prompt.description}`);
      }
    }
  } catch (error) {
    console.log(`Prompts not supported by this server (${error})`);
  }
}

async function getPrompt(
  name: string,
  args: Record<string, unknown>
): Promise<void> {
  if (!client) {
    console.log("Not connected to server.");
    return;
  }

  try {
    const promptRequest: GetPromptRequest = {
      method: "prompts/get",
      params: {
        name,
        arguments: args as Record<string, string>,
      },
    };

    const promptResult = await client.request(
      promptRequest,
      GetPromptResultSchema
    );
    console.log("Prompt template:");
    promptResult.messages.forEach((msg, index) => {
      console.log(`  [${index + 1}] ${msg.role}: ${msg.content.text}`);
    });
  } catch (error) {
    console.log(`Error getting prompt ${name}: ${error}`);
  }
}

async function listResources(): Promise<void> {
  if (!client) {
    console.log("Not connected to server.");
    return;
  }

  try {
    const resourcesRequest: ListResourcesRequest = {
      method: "resources/list",
      params: {},
    };
    const resourcesResult = await client.request(
      resourcesRequest,
      ListResourcesResultSchema
    );

    console.log("Available resources:");
    if (resourcesResult.resources.length === 0) {
      console.log("  No resources available");
    } else {
      for (const resource of resourcesResult.resources) {
        console.log(`  - ${resource.name}: ${resource.uri}`);
      }
    }
  } catch (error) {
    console.log(`Resources not supported by this server (${error})`);
  }
}

async function cleanup(): Promise<void> {
  if (client && transport) {
    try {
      // First try to terminate the session gracefully
      if (transport.sessionId) {
        try {
          console.log("Terminating session before exit...");
          await transport.terminateSession();
          console.log("Session terminated successfully");
        } catch (error) {
          console.error("Error terminating session:", error);
        }
      }

      // Then close the transport
      await transport.close();
    } catch (error) {
      console.error("Error closing transport:", error);
    }
  }

  process.stdin.setRawMode(false);
  readline.close();
  console.log("\nGoodbye!");
  process.exit(0);
}

// Set up raw mode for keyboard input to capture Escape key
process.stdin.setRawMode(true);
process.stdin.on("data", async (data) => {
  // Check for Escape key (27)
  if (data.length === 1 && data[0] === 27) {
    console.log("\nESC key pressed. Disconnecting from server...");

    // Abort current operation and disconnect from server
    if (client && transport) {
      await disconnect();
      console.log("Disconnected. Press Enter to continue.");
    } else {
      console.log("Not connected to server.");
    }

    // Re-display the prompt
    process.stdout.write("> ");
  }
});

// Handle Ctrl+C
process.on("SIGINT", async () => {
  console.log("\nReceived SIGINT. Cleaning up...");
  await cleanup();
});

// Start the interactive client
main().catch((error: unknown) => {
  console.error("Error running MCP client:", error);
  process.exit(1);
});
```

上面代码较长，核心是使用 `StreamableHTTPClientTransport` 来创建一个 Streamable HTTP 客户端：

```typescript
transport = new StreamableHTTPClientTransport(new URL(serverUrl), {
  sessionId: sessionId,
});
```

然后初始化 MCP 客户端，为该客户端设置消息通知处理器，然后将该客户端和 transport 连接起来。其他就是一些交互命令，比如 `list-tools`、`call-tool`、`list-prompts`、`list-resources` 等。

不过需要注意在 `callTool` 里面使用 client.request 的时候，配置了 `resumptionToken`，表示在重连的时候，可以传递上一次的 `Event ID`，但是这里直接这样传递的话就会每次去进行重连，就会触发 BUG，所以我们可以先注释掉，后续再解决这个 BUG。

```typescript
const onLastEventIdUpdate = (event: string) => {
  notificationsToolLastEventId = event;
};
const result = await client.request(request, CallToolResultSchema, {
  // resumptionToken: notificationsToolLastEventId, // bug，不能每次都传递，应该需要重连的时候再传递
  onresumptiontoken: onLastEventIdUpdate,
});
```

## 测试

我们可以在 `package.json` 中添加两个脚本：

```json
"scripts": {
  "build-server": "tsc && node -e \"require('fs').chmodSync('build/server/simpleStreamableHttp.js', '755')\"",
  "build-client": "tsc && node -e \"require('fs').chmodSync('build/client/simpleStreamableHttp.js', '755')\"",
}
```

然后我们就可以使用 `npm run build-server` 和 `npm run build-client` 来分别构建服务端和客户端。

然后我们就可以使用 `node build/server/simpleStreamableHttp.js` 来运行服务端，使用 `node build/client/simpleStreamableHttp.js` 来运行客户端。

```bash
$ node build/client/simpleStreamableHttp.js
MCP Interactive Client
=====================
Connecting to http://localhost:3000/mcp...
Transport created with session ID: a0fdb476-a82f-47bb-927f-58fcc332b5ea
Connected to MCP server

Available commands:
  connect [url]              - Connect to MCP server (default: http://localhost:3000/mcp)
  disconnect                 - Disconnect from server
  terminate-session          - Terminate the current session
  reconnect                  - Reconnect to the server
  list-tools                 - List available tools
  call-tool <name> [args]    - Call a tool with optional JSON arguments
  greet [name]               - Call the greet tool
  multi-greet [name]         - Call the multi-greet tool with notifications
  start-notifications [interval] [count] - Start periodic notifications
  list-prompts               - List available prompts
  get-prompt [name] [args]   - Get a prompt with optional JSON arguments
  list-resources             - List available resources
  help                       - Show this help
  quit                       - Exit the program

> list-tools
Available tools:
  - greet: A simple greeting tool
  - multi-greet: A tool that sends different greetings with delays between them
  - start-notification-stream: Starts sending periodic notifications for testing resumability

> greet james
Calling tool 'greet' with args: { name: 'james' }
Tool result:
  Hello, james!

> multi-greet claudemcp.com
Calling multi-greet tool with notifications...
Calling tool 'multi-greet' with args: { name: 'claudemcp.com' }

Notification #1: debug - Starting multi-greet for claudemcp.com
>
Notification #2: info - Sending first greeting to claudemcp.com
>
Notification #3: info - Sending second greeting to claudemcp.com
> Tool result:
  Good morning, claudemcp.com!

> start-notifications 1000 5
Starting notification stream: interval=1000ms, count=5
Calling tool 'start-notification-stream' with args: { interval: 1000, count: 5 }

Notification #4: info - Periodic notification #1 at 2025-04-24T11:30:54.650Z
>
Notification #5: info - Periodic notification #2 at 2025-04-24T11:30:55.652Z
>
Notification #6: info - Periodic notification #3 at 2025-04-24T11:30:56.655Z
>
Notification #7: info - Periodic notification #4 at 2025-04-24T11:30:57.656Z
>
Notification #8: info - Periodic notification #5 at 2025-04-24T11:30:58.658Z
> Tool result:
  Started sending periodic notifications every 1000ms

>
```

## 总结

上面我们就使用 MCP 最新的 TypeScript SDK 实现了一个简单的 Streamable HTTP 服务端和客户端。当然我们还可以去实现兼容 SSE 方式的 Streamable HTTP 服务端和客户端。

- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/examples/server/simpleStreamableHttp.ts
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/examples/client/simpleStreamableHttp.ts
