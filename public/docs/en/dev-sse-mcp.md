---
title: Develop an SSE-based MCP Service
description: Developing an SSE-based MCP intelligent shopping assistant service
section: typescript
prev: use-llm-dev-mcp
next: sampling-usage
pubDate: 2025-04-02
order: 4
---

# Develop an SSE MCP AI Shopping Assistant Service

[MCP](https://www.claudemcp.com/) supports two communication transport methods: `STDIO` (Standard Input/Output) or `SSE` (Server-Sent Events), both using `JSON-RPC 2.0` for message formatting. `STDIO` is used for local integration, while `SSE` is used for network-based communication.

For example, if we want to use an MCP service directly in the command line, we can use the `STDIO` transport method. If we want to use an MCP service in a web page, we can use the `SSE` transport method.

Next, we'll develop an MCP-based intelligent shopping service assistant using an SSE-type MCP service with the following core features:

- Real-time access to product information and inventory levels, supporting customized orders.
- Product recommendations based on customer preferences and available inventory.
- Real-time interaction with microservices using the MCP tool server.
- Checking real-time inventory levels when answering product inquiries.
- Facilitating product purchases using product IDs and quantities.
- Real-time inventory level updates.
- Ad-hoc analysis of order transactions through natural language queries.

![](/images/shop-ai-with-mcp.png)

> Here we use the Anthropic Claude 3.5 Sonnet model as the AI assistant for the MCP service, though other models that support tool calling can also be used.

First, we need a product microservice to expose an API interface for a product list. Then we'll provide an order microservice to expose API interfaces for order creation, inventory information, etc.

The core component is the MCP SSE server, which exposes data from the product and order microservices to the LLM as tools using the SSE protocol.

Finally, we'll use an MCP client to connect to the MCP SSE server via the SSE protocol and interact with the LLM.

> For the complete project code, please refer to [https://github.com/cnych/mcp-sse-demo](https://github.com/cnych/mcp-sse-demo)

## Microservices

Let's start developing the product and order microservices and expose their API interfaces.

First, we'll define the types for products, inventory, and orders.

```typescript
// types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface Inventory {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: number;
  customerName: string;
  items: Array<{ productId: number; quantity: number }>;
  totalAmount: number;
  orderDate: string;
}
```

Then we can use Express to expose the product and order microservices and provide API interfaces. Since it's a simulation, we'll use simpler in-memory data here, and expose the data through the following functions. (In a production environment, you still need to use a microservice plus a database to implement it.)

```typescript
// services/product-service.ts
import { Product, Inventory, Order } from "../types/index.js";

// Simulate data storage
let products: Product[] = [
  {
    id: 1,
    name: "智能手表Galaxy",
    price: 1299,
    description: "健康监测，运动追踪，支持多种应用",
  },
  {
    id: 2,
    name: "无线蓝牙耳机Pro",
    price: 899,
    description: "主动降噪，30小时续航，IPX7防水",
  },
  {
    id: 3,
    name: "便携式移动电源",
    price: 299,
    description: "20000mAh大容量，支持快充，轻薄设计",
  },
  {
    id: 4,
    name: "华为MateBook X Pro",
    price: 1599,
    description: "14.2英寸全面屏，3:2比例，100% sRGB色域",
  },
];

// Simulate inventory data
let inventory: Inventory[] = [
  { productId: 1, quantity: 100 },
  { productId: 2, quantity: 50 },
  { productId: 3, quantity: 200 },
  { productId: 4, quantity: 150 },
];

let orders: Order[] = [];

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getInventory(): Promise<Inventory[]> {
  return inventory.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });
}

export async function getOrders(): Promise<Order[]> {
  return [...orders].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );
}

export async function createPurchase(
  customerName: string,
  items: { productId: number; quantity: number }[]
): Promise<Order> {
  if (!customerName || !items || items.length === 0) {
    throw new Error("Invalid request: missing customer name or items");
  }

  let totalAmount = 0;

  // Verify inventory and calculate total price
  for (const item of items) {
    const inventoryItem = inventory.find((i) => i.productId === item.productId);
    const product = products.find((p) => p.id === item.productId);

    if (!inventoryItem || !product) {
      throw new Error(`Product ID ${item.productId} does not exist`);
    }

    if (inventoryItem.quantity < item.quantity) {
      throw new Error(
        `Product ${product.name} has insufficient inventory. Available: ${inventoryItem.quantity}`
      );
    }

    totalAmount += product.price * item.quantity;
  }

  // Create order
  const order: Order = {
    id: orders.length + 1,
    customerName,
    items,
    totalAmount,
    orderDate: new Date().toISOString(),
  };

  // Update inventory
  items.forEach((item) => {
    const inventoryItem = inventory.find(
      (i) => i.productId === item.productId
    )!;
    inventoryItem.quantity -= item.quantity;
  });

  orders.push(order);
  return order;
}
```

Then we can expose these API interfaces through MCP tools, as shown below:

```typescript
// mcp-server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getProducts,
  getInventory,
  getOrders,
  createPurchase,
} from "./services/product-service.js";

export const server = new McpServer({
  name: "mcp-sse-demo",
  version: "1.0.0",
  description:
    "MCP tools for product query, inventory management, and order processing",
});

// Get product list tool
server.tool("getProducts", "Get all product information", {}, async () => {
  console.log("Getting product list");
  const products = await getProducts();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(products),
      },
    ],
  };
});

// Get inventory information tool
server.tool(
  "getInventory",
  "Get all product inventory information",
  {},
  async () => {
    console.log("Getting inventory information");
    const inventory = await getInventory();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(inventory),
        },
      ],
    };
  }
);

// Get order list tool
server.tool("getOrders", "Get all order information", {}, async () => {
  console.log("Getting order list");
  const orders = await getOrders();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(orders),
      },
    ],
  };
});

// Purchase product tool
server.tool(
  "purchase",
  "Purchase product",
  {
    items: z
      .array(
        z.object({
          productId: z.number().describe("Product ID"),
          quantity: z.number().describe("Purchase quantity"),
        })
      )
      .describe("List of products to purchase"),
    customerName: z.string().describe("Customer name"),
  },
  async ({ items, customerName }) => {
    console.log("Processing purchase request", { items, customerName });
    try {
      const order = await createPurchase(customerName, items);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(order),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message }),
          },
        ],
      };
    }
  }
);
```

Here we define 4 tools:

- `getProducts`: Retrieve all product information
- `getInventory`: Get inventory information for all products
- `getOrders`: Retrieve all order information
- `purchase`: Purchase products

If it's a Stdio-type MCP service, we can use these tools directly in the command line, but now we need to use an SSE-type MCP service, so we also need an MCP SSE server to expose these tools.

## MCP SSE Server

Next, we'll develop an MCP SSE server to expose the product and order microservice data as tools using the SSE protocol.

```typescript
// mcp-sse-server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { server as mcpServer } from "./mcp-server.js"; // Rename to avoid naming conflict

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Store active connections
const connections = new Map();

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connections: connections.size,
  });
});

// SSE connection establishment endpoint
app.get("/sse", async (req, res) => {
  // Instantiate SSE transport object
  const transport = new SSEServerTransport("/messages", res);
  // Get sessionId
  const sessionId = transport.sessionId;
  console.log(
    `[${new Date().toISOString()}] New SSE connection established: ${sessionId}`
  );

  // Register connection
  connections.set(sessionId, transport);

  // Connection interruption handling
  req.on("close", () => {
    console.log(
      `[${new Date().toISOString()}] SSE connection closed: ${sessionId}`
    );
    connections.delete(sessionId);
  });

  // Connect the transport object to the MCP server
  await mcpServer.connect(transport);
  console.log(
    `[${new Date().toISOString()}] MCP server connection successful: ${sessionId}`
  );
});

// Endpoint for receiving client messages
app.post("/messages", async (req: Request, res: Response) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Received client message:`,
      req.query
    );
    const sessionId = req.query.sessionId as string;

    // Find the corresponding SSE connection and process the message
    if (connections.size > 0) {
      const transport: SSEServerTransport = connections.get(
        sessionId
      ) as SSEServerTransport;
      // Use transport to process messages
      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        throw new Error("No active SSE connection");
      }
    } else {
      throw new Error("No active SSE connection");
    }
  } catch (error: any) {
    console.error(
      `[${new Date().toISOString()}] Failed to process client message:`,
      error
    );
    res
      .status(500)
      .json({ error: "Failed to process message", message: error.message });
  }
});

// Graceful shutdown of all connections
async function closeAllConnections() {
  console.log(
    `[${new Date().toISOString()}] Closing all connections (${
      connections.size
    }个)`
  );
  for (const [id, transport] of connections.entries()) {
    try {
      // Send shutdown event
      transport.res.write(
        'event: server_shutdown\ndata: {"reason": "Server is shutting down"}\n\n'
      );
      transport.res.end();
      console.log(`[${new Date().toISOString()}] Connection closed: ${id}`);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Failed to close connection: ${id}`,
        error
      );
    }
  }
  connections.clear();
}

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Unhandled exception:`, err);
  res.status(500).json({ error: "Server internal error" });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log(
    `[${new Date().toISOString()}] Received SIGTERM signal, preparing to close`
  );
  await closeAllConnections();
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed`);
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log(
    `[${new Date().toISOString()}] Received SIGINT signal, preparing to close`
  );
  await closeAllConnections();
  process.exit(0);
});

// Start server
const port = process.env.PORT || 8083;
const server = app.listen(port, () => {
  console.log(
    `[${new Date().toISOString()}] Smart shopping MCP SSE server started, address: http://localhost:${port}`
  );
  console.log(`- SSE connection endpoint: http://localhost:${port}/sse`);
  console.log(
    `- Message processing endpoint: http://localhost:${port}/messages`
  );
  console.log(`- Health check endpoint: http://localhost:${port}/health`);
});
```

Here we use Express to expose an SSE connection endpoint `/sse`, for receiving client messages. We use `SSEServerTransport` to create an SSE transport object and specify the message processing endpoint as `/messages`.

```typescript
const transport = new SSEServerTransport("/messages", res);
```

After the transport object is created, we can connect the transport object to the MCP server, as shown below:

```typescript
// Connect the transport object to the MCP server
await mcpServer.connect(transport);
```

Then we can receive client messages through the SSE connection endpoint `/sse`, and use the message processing endpoint `/messages` to process client messages. When a client message is received, we need to use the `transport` object to handle the client message in the `/messages` endpoint:

```typescript
// Use transport to process messages
await transport.handlePostMessage(req, res);
```

This is the same as the operation of listing tools and calling tools.

## MCP Client

Next, we'll develop an MCP client to connect to the MCP SSE server and interact with the LLM. We can develop a command line client or a web client.

For the command line client, we've already introduced it, the only difference is that now we need to use the SSE protocol to connect to the MCP SSE server.

```typescript
// Create MCP client
const mcpClient = new McpClient({
  name: "mcp-sse-demo",
  version: "1.0.0",
});

// Create SSE transport object
const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

// Connect to MCP server
await mcpClient.connect(transport);
```

Then the other operations are the same as the command line client we introduced earlier, which is to list all tools, then send the user's question and tools to the LLM for processing. After the LLM returns the result, we then call the tools based on the result, and send the tool call results and history messages back to the LLM for processing to get the final result.

For the web client, it's basically the same as the command line client, except that now we implement these processing steps in some interfaces, and then call these interfaces through the web page.

We first need to initialize the MCP client, then get all tools, and convert the tool format to the array form required by Anthropic, then create the Anthropic client.

```typescript
// Initialize MCP client
async function initMcpClient() {
  if (mcpClient) return;

  try {
    console.log("Connecting to MCP server...");
    mcpClient = new McpClient({
      name: "mcp-client",
      version: "1.0.0",
    });

    const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

    await mcpClient.connect(transport);
    const { tools } = await mcpClient.listTools();
    // Convert tool format to the array form required by Anthropic
    anthropicTools = tools.map((tool: any) => {
      return {
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      };
    });
    // Create Anthropic client
    aiClient = createAnthropicClient(config);

    console.log("MCP client and tools initialized");
  } catch (error) {
    console.error("Failed to initialize MCP client:", error);
    throw error;
  }
}
```

Then we can develop API interfaces according to our own needs, for example, we develop a chat interface here to receive the user's question, then call the MCP client's tools, send the tool call results and history messages back to the LLM for processing to get the final result, as shown below:

```typescript
// API: Chat request
apiRouter.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      console.warn("请求中消息为空");
      return res.status(400).json({ error: "消息不能为空" });
    }

    // Build message history
    const messages = [...history, { role: "user", content: message }];

    // Call AI
    const response = await aiClient.messages.create({
      model: config.ai.defaultModel,
      messages,
      tools: anthropicTools,
      max_tokens: 1000,
    });

    // Process tool calls
    const hasToolUse = response.content.some(
      (item) => item.type === "tool_use"
    );

    if (hasToolUse) {
      // Process all tool calls
      const toolResults = [];

      for (const content of response.content) {
        if (content.type === "tool_use") {
          const name = content.name;
          const toolInput = content.input as
            | { [x: string]: unknown }
            | undefined;

          try {
            // Call MCP tool
            if (!mcpClient) {
              console.error("MCP client not initialized");
              throw new Error("MCP client not initialized");
            }
            console.log(`Calling MCP tool: ${name}`);
            const toolResult = await mcpClient.callTool({
              name,
              arguments: toolInput,
            });

            toolResults.push({
              name,
              result: toolResult,
            });
          } catch (error: any) {
            console.error(`Tool call failed: ${name}`, error);
            toolResults.push({
              name,
              error: error.message,
            });
          }
        }
      }

      // Send tool results back to AI to get the final response
      const finalResponse = await aiClient.messages.create({
        model: config.ai.defaultModel,
        messages: [
          ...messages,
          {
            role: "user",
            content: JSON.stringify(toolResults),
          },
        ],
        max_tokens: 1000,
      });

      const textResponse = finalResponse.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");

      res.json({
        response: textResponse,
        toolCalls: toolResults,
      });
    } else {
      // Return AI response directly
      const textResponse = response.content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");

      res.json({
        response: textResponse,
        toolCalls: [],
      });
    }
  } catch (error: any) {
    console.error("Chat request processing failed:", error);
    res.status(500).json({ error: error.message });
  }
});
```

The core implementation is also relatively simple, and is basically the same as the command line client, except that now we implement these processing steps in some interfaces.

## Usage

Here is an example of using the command line client:

![](/images/shop-ai-with-mcp-cli.png)

We can also use it in Cursor, create a `.cursor/mcp.json` file, and add the following content:

```json
{
  "mcpServers": {
    "products-sse": {
      "url": "http://localhost:8083/sse"
    }
  }
}
```

Then we can see this MCP service in the Cursor settings page, and then we can use this MCP service in Cursor.

![](/images/shop-ai-with-mcp-cursor.png)

Here is an example of using the web client we developed:

![](/images/shop-ai-with-mcp-web1.png)

![](/images/shop-ai-with-mcp-web2.png)

## Debugging

We can use the `npx @modelcontextprotocol/inspector` command to debug our SSE service:

```bash
$ npx @modelcontextprotocol/inspector
Starting MCP inspector...
⚙️ Proxy server listening on port 6277
🔍 MCP Inspector is up and running at http://127.0.0.1:6274 🚀
```

Then o8pen the above address in the browser, select SSE, and configure our SSE address to test:

![](/images/shop-ai-with-mcp-inspector.png)

## Summary

When LLM decides to trigger a tool call for a user, the quality of tool descriptions is crucial:

- **Precise Description**：Ensure each tool's description is clear and specific, including keywords to help LLM correctly identify when to use the tool
- **Avoid Conflicts**：Do not provide multiple tools with similar functionality, which can lead to LLM selecting the wrong tool
- **Testing Validation**：Test tool call accuracy using various user query scenarios before deployment

MCP servers can be implemented using various technologies:

- Python SDK
- TypeScript/JavaScript
- Other programming languages

The choice should be based on the team's familiarity and existing technology stack.

Integrating an AI assistant with an MCP server into an existing microservice architecture has the following advantages:

1. **Real-time Data**: Provide real-time or near-real-time updates through SSE (Server-Sent Events), which is particularly important for dynamic data such as inventory information and order status
2. **Scalability**: Different parts of the system can be scaled independently, for example, frequently used inventory check services can be scaled separately
3. **Resilience**: Failure of a single microservice does not affect the operation of the entire system, ensuring system stability
4. **Flexibility**: Different teams can handle different parts of the system independently, using different technology stacks when necessary
5. **Efficient Communication**: SSE is more efficient than continuous polling, sending updates only when data changes
6. **Enhanced User Experience**: Real-time updates and quick responses improve customer satisfaction
7. **Simplified Client**: Client code is more concise, without complex polling mechanisms, only needing to listen for server events

If we want to use it in a production environment, we also need to consider the following points:

- Perform thorough testing to identify potential errors
- Design a fault recovery mechanism
- Implement a monitoring system to track tool call performance and accuracy
- Consider adding a caching layer to reduce the load on backend services

Through these practices, we can build an efficient and reliable MCP-based intelligent shopping service assistant that provides users with real-time, personalized shopping experiences.
