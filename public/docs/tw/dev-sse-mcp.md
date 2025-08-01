---
title: 開發 SSE 類型的 MCP 服務
description: 開發一個基於 SSE 類型的 MCP 智能商城助手服務
section: base-dev
prev: use-llm-dev-mcp
next: sampling-usage
pubDate: 2025-04-02
order: 4
---

# 開發一個基於 SSE 類型的 MCP 智能商城助手服務

[MCP](https://www.claudemcp.com/tw) 支援兩種通訊傳輸方法：`STDIO`（標準輸入/輸出）或 `SSE`（伺服器推送事件），兩者都使用 `JSON-RPC 2.0` 進行訊息格式化。`STDIO` 用於本地整合，而 `SSE` 用於基於網路的通訊。

比如我們想直接在命令列中使用 MCP 服務，那麼我們可以使用 `STDIO` 傳輸方法，如果我們要在 Web 頁面中使用 MCP 服務，那麼我們可以使用 `SSE` 傳輸方法。

接下來我們將為大家開發一個基於 MCP 的智能商城服務助手，使用 SSE 類型的 MCP 服務，具備以下核心功能：

- 即時存取產品資訊和庫存水平，支援客製化訂單。
- 根據客戶偏好和可用庫存推薦產品。
- 使用 MCP 工具伺服器與微服務進行即時互動。
- 在回答產品詢問時檢查即時庫存水平。
- 使用產品 ID 和數量促進產品購買。
- 即時更新庫存水平。
- 通過自然語言查詢提供訂單交易的臨時分析。

![](https://static.claudemcp.com/images/shop-ai-with-mcp.png)

> 這裡我們使用 Anthropic Claude 3.5 Sonnet 模型作為 MCP 服務的 AI 助手，當然也可以選擇其他支援工具調用的模型。

首先需要一個產品微服務，用於暴露一個產品列表的 API 介面。然後再提供一個訂單微服務，用於暴露一個訂單創建、庫存資訊等 API 介面。

接下來的核心就是核心的 MCP SSE 伺服器，用於向 LLM 暴露產品微服務和訂單微服務資料，作為使用 SSE 協議的工具。

最後就是使用 MCP 客戶端，通過 SSE 協議連接到 MCP SSE 伺服器，並使用 LLM 進行互動。

> 完整的專案程式碼請參考 [https://github.com/cnych/mcp-sse-demo](https://github.com/cnych/mcp-sse-demo)

## 微服務

接下來我們開始開發產品微服務和訂單微服務，並暴露 API 介面。

首先定義產品、庫存和訂單的類型。

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

然后我们可以用 Express 來暴露產品微服務和訂單微服務，並提供 API 介面。由於是模擬資料，所以我們這裡用更簡單的記憶體資料來模擬，直接把資料通過下面的這些函數暴露出去。（生產環境中，還是需要使用微服務加資料庫的方式來實現）

```typescript
// services/product-service.ts
import { Product, Inventory, Order } from "../types/index.js";

// 模擬資料儲存
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

// 模擬庫存資料
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
    throw new Error("请求无效：缺少客户名称或商品");
  }

  let totalAmount = 0;

  // 驗證庫存並計算總價
  for (const item of items) {
    const inventoryItem = inventory.find((i) => i.productId === item.productId);
    const product = products.find((p) => p.id === item.productId);

    if (!inventoryItem || !product) {
      throw new Error(`商品ID ${item.productId} 不存在`);
    }

    if (inventoryItem.quantity < item.quantity) {
      throw new Error(
        `商品 ${product.name} 库存不足. 可用: ${inventoryItem.quantity}`
      );
    }

    totalAmount += product.price * item.quantity;
  }

  // 創建訂單
  const order: Order = {
    id: orders.length + 1,
    customerName,
    items,
    totalAmount,
    orderDate: new Date().toISOString(),
  };

  // 更新庫存
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

然后我们可以通过 MCP 的工具來將這些 API 介面暴露出去，如下所示：

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
  description: "提供商品查询、库存管理和订单处理的MCP工具",
});

// 獲取產品列表工具
server.tool("getProducts", "獲取所有產品資訊", {}, async () => {
  console.log("獲取產品列表");
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

// 獲取庫存資訊工具
server.tool("getInventory", "獲取所有產品的庫存資訊", {}, async () => {
  console.log("獲取庫存資訊");
  const inventory = await getInventory();
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(inventory),
      },
    ],
  };
});

// 获取订单列表工具
server.tool("getOrders", "獲取所有訂單資訊", {}, async () => {
  console.log("獲取訂單列表");
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

// 購買商品工具
server.tool(
  "purchase",
  "購買商品",
  {
    items: z
      .array(
        z.object({
          productId: z.number().describe("商品ID"),
          quantity: z.number().describe("購買數量"),
        })
      )
      .describe("要購買的商品列表"),
    customerName: z.string().describe("客戶姓名"),
  },
  async ({ items, customerName }) => {
    console.log("處理購買請求", { items, customerName });
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

这里我们一共定义了 4 個工具，分別是：

- `getProducts`：獲取所有產品資訊
- `getInventory`：獲取所有產品的庫存資訊
- `getOrders`：獲取所有訂單資訊
- `purchase`：購買商品

如果是 Stdio 類型的 MCP 服務，那麼我們就可以直接在命令行中使用這些工具了，但是現在我們需要使用 SSE 類型的 MCP 服務，所以我們還需要一個 MCP SSE 伺服器來暴露這些工具。

## MCP SSE 伺服器

接下來我們開始開發 MCP SSE 伺服器，用於暴露產品微服務和訂單微服務資料，作為使用 SSE 協議的工具。

```typescript
// mcp-sse-server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { server as mcpServer } from "./mcp-server.js"; // 重命名以避免命名冲突

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 儲存活躍連接
const connections = new Map();

// 健康檢查端點
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connections: connections.size,
  });
});

// SSE 連接建立端點
app.get("/sse", async (req, res) => {
  // 實例化SSE傳輸對象
  const transport = new SSEServerTransport("/messages", res);
  // 獲取sessionId
  const sessionId = transport.sessionId;
  console.log(`[${new Date().toISOString()}] 新的SSE連接建立: ${sessionId}`);

  // 註冊連接
  connections.set(sessionId, transport);

  // 連接中斷處理
  req.on("close", () => {
    console.log(`[${new Date().toISOString()}] SSE連接關閉: ${sessionId}`);
    connections.delete(sessionId);
  });

  // 將傳輸對象與MCP伺服器連接
  await mcpServer.connect(transport);
  console.log(`[${new Date().toISOString()}] MCP伺服器連接成功: ${sessionId}`);
});

// 接收客戶端消息的端點
app.post("/messages", async (req: Request, res: Response) => {
  try {
    console.log(`[${new Date().toISOString()}] 收到客戶端消息:`, req.query);
    const sessionId = req.query.sessionId as string;

    // 查找對應的SSE連接並處理消息
    if (connections.size > 0) {
      const transport: SSEServerTransport = connections.get(
        sessionId
      ) as SSEServerTransport;
      // 使用transport處理消息
      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        throw new Error("沒有活躍的SSE連接");
      }
    } else {
      throw new Error("沒有活躍的SSE連接");
    }
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] 處理客戶端消息失敗:`, error);
    res.status(500).json({ error: "處理消息失敗", message: error.message });
  }
});

// 优雅关闭所有连接
async function closeAllConnections() {
  console.log(
    `[${new Date().toISOString()}] 關閉所有連接 (${connections.size}個)`
  );
  for (const [id, transport] of connections.entries()) {
    try {
      // 发送关闭事件
      transport.res.write(
        'event: server_shutdown\ndata: {"reason": "Server is shutting down"}\n\n'
      );
      transport.res.end();
      console.log(`[${new Date().toISOString()}] 已關閉連接: ${id}`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] 關閉連接失敗: ${id}`, error);
    }
  }
  connections.clear();
}

// 错误处理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] 未處理的異常:`, err);
  res.status(500).json({ error: "伺服器內部錯誤" });
});

// 优雅关闭
process.on("SIGTERM", async () => {
  console.log(`[${new Date().toISOString()}] 接收到SIGTERM信号，准备关闭`);
  await closeAllConnections();
  server.close(() => {
    console.log(`[${new Date().toISOString()}] 伺服器已關閉`);
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log(`[${new Date().toISOString()}] 接收到SIGINT信号，准备关闭`);
  await closeAllConnections();
  process.exit(0);
});

// 启动服务器
const port = process.env.PORT || 8083;
const server = app.listen(port, () => {
  console.log(
    `[${new Date().toISOString()}] 智能商城 MCP SSE 伺服器已啟動，地址: http://localhost:${port}`
  );
  console.log(`- SSE 連接端點: http://localhost:${port}/sse`);
  console.log(`- 消息處理端點: http://localhost:${port}/messages`);
  console.log(`- 健康檢查端點: http://localhost:${port}/health`);
});
```

这里我们使用 Express 來暴露一個 SSE 連接端點 `/sse`，用於接收客戶端消息。使用 `SSEServerTransport` 來創建一個 SSE 傳輸對象，並指定消息處理端點為 `/messages`。

```typescript
const transport = new SSEServerTransport("/messages", res);
```

傳輸對象創建後，我們就可以將傳輸對象與 MCP 伺服器連接起來，如下所示：

```typescript
// 將傳輸對象與MCP伺服器連接
await mcpServer.connect(transport);
```

這樣我們就可以通過 SSE 連接端點 `/sse` 來接收客戶端消息，並使用消息處理端點 `/messages` 來處理客戶端消息，當接收到客戶端消息後，在 `/messages` 端點中，我們需要使用 `transport` 對象來處理客戶端消息：

```typescript
// 使用transport處理消息
await transport.handlePostMessage(req, res);
```

也就是我們常說的列出工具、調用工具等操作。

## MCP 客戶端

接下來我們開始開發 MCP 客戶端，用於連接到 MCP SSE 伺服器，並使用 LLM 進行交互。客戶端我們可以開發一個命令行客戶端，也可以開發一個 Web 客戶端。

對於命令行客戶端前面我們已經介紹過了，唯一不同的是現在我們需要使用 SSE 協議來連接到 MCP SSE 伺服器。

```typescript
// 创建MCP客户端
const mcpClient = new McpClient({
  name: "mcp-sse-demo",
  version: "1.0.0",
});

// 创建SSE传输对象
const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

// 連接到MCP伺服器
await mcpClient.connect(transport);
```

然後其他操作和前面介紹的命令行客戶端是一樣的，也就是列出所有工具，然後將用戶的問題和工具一起發給 LLM 進行處理。LLM 返回結果後，我們再根據結果來調用工具，將調用工具結果和歷史消息一起發給 LLM 進行處理，得到最終結果。

對於 Web 客戶端來說，和命令行客戶端也基本一致，只是現在我們將這些處理過程放到一些接口裡面去實現，然後通過 Web 頁面來調用這些接口即可。

我們首先要初始化 MCP 客戶端，然後獲取所有工具，並轉換工具格式為 Anthropic 所需的數組形式，然後創建 Anthropic 客戶端。

```typescript
// 初始化MCP客户端
async function initMcpClient() {
  if (mcpClient) return;

  try {
    console.log("正在連接到MCP伺服器...");
    mcpClient = new McpClient({
      name: "mcp-client",
      version: "1.0.0",
    });

    const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

    await mcpClient.connect(transport);
    const { tools } = await mcpClient.listTools();
    // 转换工具格式为Anthropic所需的数组形式
    anthropicTools = tools.map((tool: any) => {
      return {
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      };
    });
    // 创建Anthropic客户端
    aiClient = createAnthropicClient(config);

    console.log("MCP客户端和工具已初始化完成");
  } catch (error) {
    console.error("初始化MCP客户端失败:", error);
    throw error;
  }
}
```

接著就根據我們自身的需求來開發 API 接口，比如我們這裡開發一個聊天接口，用於接收用戶的問題，然後調用 MCP 客戶端的工具，將工具調用結果和歷史消息一起發給 LLM 進行處理，得到最終結果，代碼如下所示：

```typescript
// API: 聊天请求
apiRouter.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      console.warn("请求中消息为空");
      return res.status(400).json({ error: "消息不能为空" });
    }

    // 构建消息历史
    const messages = [...history, { role: "user", content: message }];

    // 调用AI
    const response = await aiClient.messages.create({
      model: config.ai.defaultModel,
      messages,
      tools: anthropicTools,
      max_tokens: 1000,
    });

    // 处理工具调用
    const hasToolUse = response.content.some(
      (item) => item.type === "tool_use"
    );

    if (hasToolUse) {
      // 处理所有工具调用
      const toolResults = [];

      for (const content of response.content) {
        if (content.type === "tool_use") {
          const name = content.name;
          const toolInput = content.input as
            | { [x: string]: unknown }
            | undefined;

          try {
            // 调用MCP工具
            if (!mcpClient) {
              console.error("MCP客户端未初始化");
              throw new Error("MCP客户端未初始化");
            }
            console.log(`开始调用MCP工具: ${name}`);
            const toolResult = await mcpClient.callTool({
              name,
              arguments: toolInput,
            });

            toolResults.push({
              name,
              result: toolResult,
            });
          } catch (error: any) {
            console.error(`工具调用失败: ${name}`, error);
            toolResults.push({
              name,
              error: error.message,
            });
          }
        }
      }

      // 将工具结果发送回AI获取最终回复
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
      // 直接返回AI回复
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
    console.error("聊天请求处理失败:", error);
    res.status(500).json({ error: error.message });
  }
});
```

這裡的核心實現也比較簡單，和命令行客戶端基本一致，只是現在我們將這些處理過程放到一些接口裡面去實現了而已。

## 使用

下面是命令行客戶端的使用示例：

![](https://static.claudemcp.com/images/shop-ai-with-mcp-cli.png)

當然我們也可以在 Cursor 中來使用，創建 `.cursor/mcp.json` 文件，然後添加如下內容：

```json
{
  "mcpServers": {
    "products-sse": {
      "url": "http://localhost:8083/sse"
    }
  }
}
```

然後在 Cursor 的設置頁面我們就可以看到這個 MCP 服務，然後就可以在 Cursor 中來使用這個 MCP 服務了。

![](https://static.claudemcp.com/images/shop-ai-with-mcp-cursor.png)

下面是我們開發的 Web 客戶端的使用示例：

![](https://static.claudemcp.com/images/shop-ai-with-mcp-web1.png)

![](https://static.claudemcp.com/images/shop-ai-with-mcp-web2.png)

## 調試

同樣我們可以使用 `npx @modelcontextprotocol/inspector` 命令來調試我們的 SSE 服務：

```bash
$ npx @modelcontextprotocol/inspector
Starting MCP inspector...
⚙️ Proxy server listening on port 6277
🔍 MCP Inspector is up and running at http://127.0.0.1:6274 🚀
```

然後在瀏覽器中打開上面地址即可，選擇 SSE，配置上我們的 SSE 地址即可測試：

![](https://static.claudemcp.com/images/shop-ai-with-mcp-inspector.png)

## 總結

當 LLM 決定觸發對用戶工具的調用時，工具描述的質量至關重要：

- **精確描述**：確保每個工具的描述清晰明確，包含關鍵詞以便 LLM 正確識別何時使用該工具
- **避免衝突**：不要提供多個功能相似的工具，這可能導致 LLM 選擇錯誤
- **測試驗證**：在部署前使用各種用戶查詢場景測試工具調用的準確性

MCP 伺服器可以使用多種技術實現：

- Python SDK
- TypeScript/JavaScript
- 其他编程语言

選擇應基於團隊熟悉度和現有技術棧。

另外將 AI 助手與 MCP 伺服器集成到現有微服務架構中具有以下優勢：

1. **實時數據**：通過 SSE（伺服器發送事件）提供實時或近實時更新，對庫存信息、訂單狀態等動態數據尤為重要
2. **可擴展性**：系統各部分可獨立擴容，例如頻繁使用的庫存檢查服務可單獨擴容
3. **韌性**：單個微服務失敗不會影響整個系統運行，確保系統穩定性
4. **靈活性**：不同團隊可獨立處理系統各部分，必要時使用不同技術棧
5. **高效通信**：SSE 比持續輪詢更高效，只在數據變化時發送更新
6. **用戶體驗提升**：實時更新和快速響應提高客戶滿意度
7. **簡化客戶端**：客戶端代碼更簡潔，無需複雜輪詢機制，只需監聽伺服器事件

當然如果想要在生產環境中使用，那麼我們還需要考慮以下幾點：

- 進行全面測試以識別潛在錯誤
- 設計故障恢復機制
- 實現監控系統跟踪工具調用性能和準確性
- 考慮添加緩存層減輕後端服務負擔

通過以上實踐，我們可以構建一個高效、可靠的基於 MCP 的智能商城服務助手，為用戶提供實時、個性化的購物體驗。
