---
title: Using the New MCP Streamable HTTP Protocol
description: Streamable HTTP is one of MCP's transport protocols, combining HTTP and Server-Sent Events (SSE) technologies to provide flexible bidirectional communication for modern distributed systems. This section will introduce how to use the Streamable HTTP protocol.
section: base-dev
prev: sampling-usage
next: dev-sse-mcp
pubDate: 2025-04-24
order: 6
---

# Using the New MCP Streamable HTTP Protocol

Earlier, we introduced a new transport protocol provided by MCP in its latest [2025-03-26 release](/docs/transports-2025-03-26): Streamable HTTP. This protocol combines HTTP and Server-Sent Events (SSE) technologies to enable flexible bidirectional communication for modern distributed systems. The MCP TypeScript SDK has officially supported this protocol since [version 1.10.0](https://github.com/modelcontextprotocol/typescript-sdk/releases/tag/1.10.0). In this section, we will delve into how to use the Streamable HTTP protocol.

## MCP Server Implementation

First, let's explore how to implement a simple Streamable HTTP server, configure the Streamable HTTP transport protocol, and handle both client requests and server-to-client notifications. Here, we'll use the `Express` framework for implementation.

Start by initializing the project with the following command:

```bash
npx @modelcontextprotocol/create-server streamable-demo
```

Then, navigate to the project root directory and update the MCP SDK dependency version in `package.json` to `1.10.0`.

![Update MCP SDK](https://static.claudemcp.com/images/streamable-demo-update-sdk.png)

Next, install the dependencies:

```bash
npm i express zod && npm i --save-dev @types/express && npm i
```

Create a new file `src/server/simpleStreamableHttp.ts`.

First, import the dependencies and initialize the Express application:

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

Next, implement a `/mcp` POST endpoint to handle MCP requests according to the Streamable HTTP protocol:

```typescript
// Store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

app.post("/mcp", async (req: Request, res: Response) => {
  console.log("Received MCP request:", req.body);
  try {
    // Check for session ID
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore, // Enable recoverability
        onsessioninitialized: (sessionId) => {
          // Store transport by session ID when initialized
          // Avoids race conditions before session storage
          console.log(`Session initialized with ID: ${sessionId}`);
          transports[sessionId] = transport;
        },
      });

      // Set onclose handler to clean up transport on closure
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          );
          delete transports[sid];
        }
      };

      // Connect transport to MCP server before handling the request
      // Ensures responses stream back through the same transport
      const server = getServer();
      await server.connect(transport);

      await transport.handleRequest(req, res, req.body);
      return; // Already handled
    } else {
      // Invalid request - no session ID or not an initialization request
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

    // Handle request with existing transport - no need to reconnect
    // Existing transport is already connected to the server
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

In the code above, we first define a `transports` object to store transport instances for each session. Then, we implement a `/mcp` POST endpoint to handle MCP requests. According to the protocol, if the request includes an `mcp-session-id` header, it is a retry request, and we reuse the existing transport instance. If not, we check if it's a new initialization request and create a new transport instance if so. Once we have the transport instance, we call `transport.handleRequest(req, res, req.body);` to process the request.

The key part here is initializing the transport instance using the `StreamableHTTPServerTransport` class, which provides methods like `sessionIdGenerator` to generate session IDs, `eventStore` to store events, and `onsessioninitialized` to store the transport instance upon session initialization.

For simplicity, we implement an `InMemoryEventStore` class to store events in memory. The full code is as follows:

```typescript
// src/inMemoryEventStore.ts
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { EventStore } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

/**
 * A simple in-memory implementation of the EventStore interface for recovery
 * Primarily for examples and testing; not suitable for production (use a persistent storage solution)
 */
export class InMemoryEventStore implements EventStore {
  private events: Map<string, { streamId: string; message: JSONRPCMessage }> =
    new Map();

  /**
   * Generate a unique event ID for a given stream ID
   */
  private generateEventId(streamId: string): string {
    return `${streamId}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;
  }

  /**
   * Extract stream ID from event ID
   */
  private getStreamIdFromEventId(eventId: string): string {
    const parts = eventId.split("_");
    return parts.length > 0 ? parts[0] : "";
  }

  /**
   * Store an event with a generated event ID
   * Implements EventStore.storeEvent
   */
  async storeEvent(streamId: string, message: JSONRPCMessage): Promise<string> {
    const eventId = this.generateEventId(streamId);
    this.events.set(eventId, { streamId, message });
    return eventId;
  }

  /**
   * Replay events occurring after a specific event ID
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

    // Extract stream ID from event ID
    const streamId = this.getStreamIdFromEventId(lastEventId);
    if (!streamId) {
      return "";
    }

    let foundLastEvent = false;

    // Sort events by eventId for chronological order
    const sortedEvents = [...this.events.entries()].sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    for (const [
      eventId,
      { streamId: eventStreamId, message },
    ] of sortedEvents) {
      // Only include events from the same stream
      if (eventStreamId !== streamId) {
        continue;
      }

      // Start sending events after lastEventId
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

The `EventStore` interface supports event recovery with two methods:

- `storeEvent`: Stores an event for later retrieval.
- `replayEventsAfter`: Replays events occurring after a specific event ID.

The `InMemoryEventStore` class implements this interface for demonstration and testing purposes. For production, a persistent storage solution should be used.

Next, configure an `onclose` handler to clean up the transport instance when it closes:

```typescript
// Set onclose handler to clean up transport on closure
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

The most critical step is connecting the MCP server instance to the transport instance to ensure responses stream back through the same transport:

```typescript
// Connect transport to MCP server before handling the request
const server = getServer();
await server.connect(transport);

await transport.handleRequest(req, res, req.body);
return; // Already handled
```

Finally, implement the `getServer` function to create an MCP server instance and register tools and resources (refer to [MCP Server Implementation](/zh/docs/write-ts-server)):

```typescript
// Create an MCP server
const getServer = () => {
  const server = new McpServer(
    {
      name: "simple-streamable",
      version: "1.0.0",
    },
    { capabilities: { logging: {} } }
  );

  // Register a simple greeting tool
  server.tool(
    "greet",
    "A simple greeting tool",
    {
      name: z.string().describe("Name to greet"),
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

  // Register a tool to send multiple greetings
  server.tool(
    "multi-greet",
    "A tool to send staggered greetings with delays",
    {
      name: z.string().describe("Name to greet"),
    },
    async ({ name }, { sendNotification }): Promise<CallToolResult> => {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Send notifications
      await sendNotification({
        method: "notifications/message",
        params: {
          level: "debug",
          data: `Starting multiple greetings for ${name}`,
        },
      });

      await sleep(1000); // Wait 1 second before the first greeting

      await sendNotification({
        method: "notifications/message",
        params: { level: "info", data: `Sending first greeting to ${name}` },
      });

      await sleep(1000); // Wait 1 second before the second greeting

      await sendNotification({
        method: "notifications/message",
        params: { level: "info", data: `Sending second greeting to ${name}` },
      });

      return {
        content: [
          {
            type: "text",
            text: `Good morning, ${name}!`,
          },
        ],
      };
    }
  );

  // Register a tool for testing recovery
  server.tool(
    "start-notification-stream",
    "Start sending periodic notifications to test recovery",
    {
      interval: z
        .number()
        .describe("Interval between notifications (ms)")
        .default(100),
      count: z
        .number()
        .describe("Number of notifications to send (0 for 100)")
        .default(50),
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
              data: `Periodic notification #${counter} at ${new Date().toISOString()}`,
            },
          });
        } catch (error) {
          console.error("Error sending notification:", error);
        }
        // Wait for the specified interval
        await sleep(interval);
      }

      return {
        content: [
          {
            type: "text",
            text: `Started sending periodic notifications every ${interval}ms`,
          },
        ],
      };
    }
  );

  // Register a simple prompt template
  server.prompt(
    "greeting-template",
    "A simple greeting prompt template",
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
              text: `Please greet ${name} in a friendly manner.`,
            },
          },
        ],
      };
    }
  );

  // Create a simple resource with a fixed URI
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

## MCP Streamable HTTP Client Implementation

After implementing a simple MCP Streamable HTTP server, let's now look at how to implement a client to communicate with it.

We'll use the `StreamableHTTPClient` class from `@modelcontextprotocol/sdk/client/mcp.js` to implement a fully functional interactive client that connects to the Streamable HTTP server. This client demonstrates:

- Establishing and managing connections to the MCP server
- Listing and calling tools with parameters
- Handling notifications through SSE streams
- Listing and retrieving prompts with parameters
- Listing available resources
- Managing session termination and reconnection
- Supporting Last-Event-ID tracking for recovery

The full implementation of the client is as follows:

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

// Track received notifications for recovery debugging
let notificationCount = 0;

// Global client and Transport objects for interactive commands
let client: Client | null = null;
let transport: StreamableHTTPClientTransport | null = null;
let serverUrl = "http://localhost:3000/mcp";
let notificationsToolLastEventId: string | undefined = undefined;
let sessionId: string | undefined = undefined;

async function main(): Promise<void> {
  console.log("MCP Interactive Client");
  console.log("=====================");

  // Connect to server immediately with default settings
  await connect();

  // Print help and start command loop
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
      // resumptionToken: notificationsToolLastEventId, // bug: don't pass this every time, only when reconnecting
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

The core functionality is creating a Streamable HTTP client using the `StreamableHTTPClientTransport` class:

```typescript
transport = new StreamableHTTPClientTransport(new URL(serverUrl), {
  sessionId: sessionId,
});
```

Then we initialize the MCP client, set up notification handlers, and connect the client to the transport. The rest consists of interactive commands like `list-tools`, `call-tool`, `list-prompts`, `list-resources`, etc.

Note that in the `callTool` function, we've commented out the `resumptionToken` line because passing it with every request would trigger reconnection. This is a bug that should be fixed in a future release:

```typescript
const onLastEventIdUpdate = (event: string) => {
  notificationsToolLastEventId = event;
};
const result = await client.request(request, CallToolResultSchema, {
  // resumptionToken: notificationsToolLastEventId, // bug: don't pass this every time, only when reconnecting
  onresumptiontoken: onLastEventIdUpdate,
});
```

## Testing

We can add two scripts to our `package.json` file to build the server and client separately:

```json
"scripts": {
  "build-server": "tsc && node -e \"require('fs').chmodSync('build/server/simpleStreamableHttp.js', '755')\"",
  "build-client": "tsc && node -e \"require('fs').chmodSync('build/client/simpleStreamableHttp.js', '755')\"",
}
```

This allows us to use `npm run build-server` and `npm run build-client` to build the server and client, respectively.

Then we can run the server using `node build/server/simpleStreamableHttp.js` and the client using `node build/client/simpleStreamableHttp.js`.

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

Notification #1: debug - Starting multiple greetings for claudemcp.com
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

## Conclusion

We've implemented a simple Streamable HTTP server and client using the latest MCP TypeScript SDK. The Streamable HTTP protocol enables bidirectional communication through standard HTTP and SSE technologies, making it well-suited for modern distributed systems.

For more examples, you can check out:

- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/examples/server/simpleStreamableHttp.ts
- https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/examples/client/simpleStreamableHttp.ts
