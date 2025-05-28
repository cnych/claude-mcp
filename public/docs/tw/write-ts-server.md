---
title: 編寫 MCP 伺服器
description: 如何編寫我們的第一個 TypeScript MCP 伺服器
section: base-dev
prev: quickstart
next: write-ts-client
pubDate: 2024-12-03
order: 1
---

# 編寫一個 TypeScript MCP 伺服器

在前面我們已經通過 [快速入門](./quickstart) 瞭解了如何使用 MCP 協議，但是我們都是直接使用的 Claude Desktop 官方內置支持的 MCP 伺服器，那麼如果我們要自己編寫一個 MCP 伺服器，該如何實現呢？

接下來我們將通過一個 TypeScript 的 MCP 伺服器示例來演示如何編寫一個 MCP 伺服器。我們將創建一個天氣伺服器，提供當前天氣數據作為資源，並讓 Claude 使用工具獲取天氣預報。

這裡我們需要使用 [OpenWeatherMap API](https://openweathermap.org/api) 來獲取天氣數據，直接註冊然後在 [API keys](https://home.openweathermap.org/api_keys) 頁面即可獲取一個免費的 API 密鑰。

## 環境準備

我們需要準備一個 TypeScript 的開發環境，所以需要安裝 [Node.js](https://nodejs.org) 和 [npm](https://www.npmjs.com)。

```bash
# 檢查 Node.js 版本，需要 v18 或更高版本
node --version

# 檢查 npm 版本
npm --version
```

接下來我們可以直接使用 `@modelcontextprotocol/create-server` 這個工具來創建一個 MCP 伺服器的腳手架：

```bash
$ npx @modelcontextprotocol/create-server weather-server
Need to install the following packages:
@modelcontextprotocol/create-server@0.3.1
Ok to proceed? (y) y

? What is the name of your MCP server? y
? What is the description of your server? A Model Context Protocol server
? Would you like to install this server for Claude.app? Yes
✔ MCP server created successfully!
✓ Successfully added MCP server to Claude.app configuration

Next steps:
  cd weather-server
  npm install
  npm run build  # or: npm run watch
  npm link       # optional, to make available globally

$ cd weather-server
```

然後安裝依賴：

```bash
npm install --save axios dotenv
```

接下來我們需要設置環境變量，創建 `.env` 文件：

```
OPENWEATHER_API_KEY=your-api-key-here
```

確保將 `.env` 文件添加到 `.gitignore` 文件中。

項目創建完成後，我們可以看到項目結構如下：

![MCP 伺服器項目結構](/images/claude-write-ts-server-layout.png)

## 模板分析

我們使用腳手架創建的項目，默認為我們創建了一個 MCP 伺服器的模板，這個模板實現了一個簡單的筆記系統，它通過以下方式來說明資源和工具等核心 MCP 概念：

- 將筆記列為資源
- 閱讀個人筆記
- 通過工具創建新筆記
- 通過提示總結所有筆記

我們在編寫自己的 MCP 伺服器之前，可以先來學習下這個筆記系統是如何實現的，然後我們再基於這個模板來實現我們自己的 MCP 伺服器。

首先我們看下導入的依賴包：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
```

第一行代碼其實就是從 MCP 的 SDK 裡面導入了 `Server` 這個對象，這個對象就表示一個 MCP 伺服器，該伺服器將自動響應來自客戶端發起的初始化流程。後面我們還會看到導入了 `ListResourcesRequestSchema`、`ReadResourceRequestSchema` 等對象，這些對象就表示 MCP 協議中定義的請求類型。

比如模板中通過 `Server` 創建了一個 MCP 伺服器：

```typescript
const server = new Server(
  {
    name: "weather-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);
```

該段代碼創建了一個具有資源(用於列出/讀取筆記)、工具(用於創建新筆記)和提示詞(用於總結筆記)功能的 MCP 伺服器，並指定了伺服器的名稱和版本。

當伺服器初始化完成後，我們就可以通過 `Server` 對象的 `setRequestHandler` 方法來註冊處理器了，當協議對象收到指定方法的請求時會被調用，這個過程其實就相當於我們編寫了一個 HTTP 伺服器，當收到指定 HTTP 方法的請求時，會調用我們註冊的處理器。

在模板中，可以看到註冊了幾個處理器：

### 資源 Resources

這裡我們需要對 `Resources` 資源進行一些說明，資源是 MCP 協議中的一種概念，它表示一個可以被讀取和操作的對象，我們可以將伺服器中的資料和內容作為資源暴露給 LLM，然後 LLM 就可以通過工具來操作這些資源。比如我們可以將一個筆記、一個檔案、一個資料庫表等作為資源。

> ⚠️ 需要注意的是資源被設計為由應用程式控制，這意味著客戶端應用程式可以決定如何以及何時使用它們。不同的 MCP 客戶端可能以不同的方式處理資源。例如：
>
> - Claude Desktop 目前要求用戶在使用資源之前顯式選擇資源
> - 其他客戶端可能會自動選擇資源
> - 有些實現甚至可能允許 AI 模型本身來確定要使用哪些資源
>
> 所以伺服器開發者在實現資源支持時應該準備好處理任何這些交互模式。為了自動將資料暴露給模型，伺服器作者應該使用模型控制的語言，例如工具。

資源代表 MCP 伺服器希望向客戶端提供的任何類型的資料，可以包括如下類型：

- 文件內容
- 資料庫記錄
- API 響應
- 實時系統資料
- 屏幕截圖和圖像
- 日誌文件
- 還有更多

每個資源都由唯一的 `URI` 標識，並且可以包含文本或二進制資料。

模板中將所有的筆記資源作為資源暴露給了客戶端，通過 `setRequestHandler` 註冊了處理器來處理客戶端的 `resources/list` 請求：

```typescript
/**
 * 用於列出可用筆記作為資源的處理程序。
 * 每個筆記都作為具有以下特徵的資源公開：
 * - note:// URI 方案
 * - MIME 類型
 * - 人類可讀的名稱和描述（包含筆記標題）
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(notes).map(([id, note]) => ({
      uri: `note:///${id}`,
      mimeType: "text/plain",
      name: note.title,
      description: `A text note: ${note.title}`,
    })),
  };
});
```

#### 資源 URI

資源使用遵循以下格式的 URI 進行標識：

```
[protocol]://[host]/[path]
```

例如：

- `file:///home/user/documents/report.pdf`
- `postgres://database/customers/schema`
- `screen://localhost/display1`

其中 `protocol` 協議和 `path` 路徑結構由 MCP 伺服器實現定義，當然伺服器可以定義自己的自定義 URI 方案。

#### 資源類型

資源可以包含兩種類型的內容：

**文本資源**

文本資源包含 UTF-8 編碼的文本資料，這些適用於：

- 源代碼
- 配置文件
- 日誌文件
- JSON/XML 資料
- 純文本

**二進制資源**

二進制資源包含以 `base64` 編碼的原始二進制資料，這些適用於：

- 圖片
- PDF 文件
- 音頻文件
- 視頻文件
- 其他非文本格式

#### 資源發現

客戶端可以通過兩種主要方法發現可用資源：

**直接資源**

伺服器通過 `resources/list` 端點公開暴露具體資源的列表。每個資源包括：

```json
{
  uri: string;           // 資源的唯一標識符
  name: string;          // 人類可讀的名称
  description?: string;  // 可選描述
  mimeType?: string;     // 可選的 MIME 類型
}
```

**資源模板**

對於動態資源，伺服器可以暴露 **URI 模板**，客戶端可以使用該模板來構造有效的資源 URI：

```json
{
  uriTemplate: string;   // 遵循 RFC 6570 的 URI 模板
  name: string;          // 該類型的人類可讀名稱
  description?: string;  // 可選描述
  mimeType?: string;     // 所有匹配資源的可選 MIME 類型
}
```

#### 讀取資源

要讀取資源，客戶端用資源 URI 發出 `resources/read` 請求。伺服器響應如下所示的資源內容列表：

```json
{
  contents: [
    {
      uri: string;        // 資源的 URI
      mimeType?: string;  // 可選的 MIME 類型
      // 其中之一：
      text?: string;      // 針對文字資源
      blob?: string;      // 針對二進位資源 (base64 編碼)
    }
  ]
}
```

伺服器可能會返回多個資源來響應一個 `resources/read` 請求，比如在讀取目錄時返回目錄內的文件列表。

比如模板中讀取筆記的處理器實現如下：

```typescript
/**
 * 用於讀取指定筆記內容的處理程序。
 * 接受一個 note:// URI 並返回筆記內容作為純文本。
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, "");
  const note = notes[id];

  if (!note) {
    throw new Error(`Note ${id} not found`);
  }

  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "text/plain",
        text: note.content,
      },
    ],
  };
});
```

#### 資源更新

MCP 通過兩種機制支持資源的實時更新：

**列表變更**

當可用資源列表發生變化時，伺服器可以通過 `notification/resources/list_changed` 通知客戶端。

**內容變更**

客戶端可以訂閱指定資源的更新：

- 客戶端使用資源 URI 發送 `resources/subscribe` 請求
- 當資源發生變化時伺服器發送 `notification/resources/update` 通知
- 客戶端可以通過 `resources/read` 來獲取最新內容
- 客戶端可以取消訂閱資源/取消訂閱

### 工具 Tools

工具使 LLM 能够通过你的伺服器執行操作，Tools 使伺服器能够向客戶端暴露可執行功能，通過工具，LLM 可以與外部系統交互、執行計算並在現實世界中執行操作。工具從伺服器暴露給客戶端，目的是 AI 模型能夠自動調用它們（授予批准）。

MCP 中的工具允許伺服器暴露可執行函數，這些函數可以被客戶端調用，並被 LLM 用來執行操作，實現工具主要包含以下幾個方面：

- **發現**：客戶端可以通過 `tools/list` 端點列出可用的工具調用
- **調用**：使用 `tools/call` 端點調用工具，伺服器在其中執行請求操作並返回結果
- **靈活性**：工具的範圍可以從簡單的計算到複雜的 API 交互

與資源一樣，工具由唯一名稱標識，並且可以包含描述來標識其用途，但是與資源不同，工具代表可以修改狀態或與外部系統交互的動態操作。

每個工具都定義有以下結構：

```json
{
  name: string;          // 工具的唯一識別碼
  description?: string;  // 人類可讀的描述
  inputSchema: { // 工具參數的 JSON Schema
    type: "object";
    properties: { ... } // 工具特定參數
  }
}
```

比如在模板代碼中就通過 `setRequestHandler` 註冊了工具列表處理器，代碼如下所示：

```typescript
/**
 * 用於列出可用工具的處理程序。
 * 提供一個 "create_note" 工具，讓客戶端可以建立新筆記。
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_note",
        description: "Create a new note",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note",
            },
            content: {
              type: "string",
              description: "Text content of the note",
            },
          },
          required: ["title", "content"],
        },
      },
    ],
  };
});
```

上面代碼根據前面定義的工具結構定義了一個名為 `create_note` 的工具，該工具表示用來創建新筆記，並且需要接收兩個參數：`title` 和 `content`，也就是筆記的標題和內容，這樣客戶端就知道有 `create_note` 這個工具可以調用，並且知道調用該工具需要傳入 `title` 和 `content` 參數。

上面這個註冊器只是列出了所有可用的工具，要真正調用實現工具，還需要註冊工具調用處理器，代碼如下所示：

```typescript
/**
 * 用於創建新筆記的處理程序。
 * 使用提供的標題和內容創建新筆記，並返回成功消息。
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "create_note": {
      const title = String(request.params.arguments?.title);
      const content = String(request.params.arguments?.content);
      if (!title || !content) {
        throw new Error("Title and content are required");
      }

      const id = String(Object.keys(notes).length + 1);
      notes[id] = { title, content };

      return {
        content: [
          {
            type: "text",
            text: `Created note ${id}: ${title}`,
          },
        ],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});
```

上面代碼實現很簡單，就是根據工具名稱 `create_note` 來創建新筆記，並返回成功消息，當客戶端調用 `create_note` 工具時，就會觸發上面處理器代碼。

### 提示詞 Prompts

`Prompts` 提示詞是 MCP 協議中用於定義可重複使用的提示詞模板和工作流程的機制，客戶可以輕鬆地向用戶和 LLM 展示這些模板和工作流程。提示詞被設計為由用戶控制，這意味著它們從伺服器暴露給客戶端，以便用戶能夠顯式選擇使用它們。

MCP 中的提示詞是預定義的模板，可以：

- 接受動態參數
- 從資源中包含上下文
- 鏈多個交互
- 指導特定工作流程
- 作為 UI 元素（如斜杠命令）

每個提示詞定義包含以下結構：

```json
{
  name: string;              // 提示詞的唯一識別符
  description?: string;      // 人類可讀的描述
  arguments?: [              // 可選的參數列表
    {
      name: string;          // 參數的識別符
      description?: string;  // 參數的描述
      required?: boolean;    // 是否必填
    }
  ]
}
```

客戶端可以通過 `prompts/list` 端點來發現所有可用的提示詞，比如發起如下所示的請求：

```json
// Request
{
  method: "prompts/list"
}

// Response
{
  prompts: [
    {
      name: "analyze-code",
      description: "Analyze code for potential improvements",
      arguments: [
        {
          name: "language",
          description: "Programming language",
          required: true
        }
      ]
    }
  ]
}
```

然後可以通過 `prompts/get` 端點來獲取指定提示詞的詳細信息：

````json
// Request
{
  "method": "prompts/get",
  "params": {
    "name": "analyze-code",
    "arguments": {
      "language": "python"
    }
  }
}

// Response
{
  "description": "Analyze Python code for potential improvements",
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Please analyze the following Python code for potential improvements:\n\n```python\ndef calculate_sum(numbers):\n    total = 0\n    for num in numbers:\n        total = total + num\n    return total\n\nresult = calculate_sum([1, 2, 3, 4, 5])\nprint(result)\n```"
      }
    }
  ]
}
````

比如模板中通過 `setRequestHandler` 註冊了提示詞列表處理器，代碼如下所示：

```typescript
/**
 * 用於列出可用提示詞的處理程序。
 * 暴露一個 "summarize_notes" 提示詞，用於總結所有筆記。
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "summarize_notes",
        description: "Summarize all notes",
      },
    ],
  };
});
```

可以看到模板中註冊了一個名為 `summarize_notes` 的提示詞，該提示詞用於總結所有筆記，但是這個提示詞並沒有定義任何參數，所以客戶端在調用該提示詞時不需要傳入任何參數。

然後要獲取提示詞的詳細信息，可以通過 `prompts/get` 端點來獲取，同樣模板中也通過 `setRequestHandler` 註冊了提示詞獲取處理器，代碼如下所示：

```typescript
/**
 * 用於總結所有筆記的提示詞處理器。
 * 返回一個提示詞，請求總結所有筆記，並將筆記內容作為資源嵌入。
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "summarize_notes") {
    throw new Error("Unknown prompt");
  }

  const embeddedNotes = Object.entries(notes).map(([id, note]) => ({
    type: "resource" as const,
    resource: {
      uri: `note:///${id}`,
      mimeType: "text/plain",
      text: note.content,
    },
  }));

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Please summarize the following notes:",
        },
      },
      ...embeddedNotes.map((note) => ({
        role: "user" as const,
        content: note,
      })),
      {
        role: "user",
        content: {
          type: "text",
          text: "Provide a concise summary of all the notes above.",
        },
      },
    ],
  };
});
```

從上面代碼可以看到，在生成提示詞時，會將所有筆記內容嵌入到提示詞中，這樣上下文就有了筆記的相關內容了。

### 啟動伺服器

到這裡，我們就實現了一個簡單的 MCP 伺服器，並且註冊了資源、工具、提示詞等處理器。當然最後我們還需要啟動伺服器，這樣我們編寫的伺服器才能真正運行起來。

模板中通過 `stdio` 傳輸啟動伺服器，代碼如下所示：

```typescript
/**
 * 使用 stdio 傳輸啟動伺服器。
 * 允許伺服器透過標準輸入/輸出串流進行通訊。
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

`stdio` 傳輸支援透過標準輸入輸出串流進行通訊，這對於本機整合和命令列工具特別有用，我們可以在以下情況下使用 `stdio`：

- 建置命令列工具
- 實作本機整合
- 需要簡單的行程通訊
- 使用 shell 腳本

除了 `stdio` 傳輸，MCP 還支援基於 HTTP 的伺服器傳送事件 (`SSE`) 傳輸，SSE 傳輸支援透過 HTTP POST 請求進行伺服器到客戶端串流傳輸，以進行客戶端到伺服器通訊。在以下情況下我們可以使用 `SSE`：

- 只需要伺服器到客戶端的串流傳輸
- 使用受限網路
- 實作簡單的更新

## 撰寫程式碼

上面我們分析了 MCP 伺服器的實作，接下來我們就可以根據我們的需求來撰寫程式碼了。我們的需求是提供一個天氣查詢服務，這裡我們就可以將天氣資料作為資源，然後暴露一個查詢天氣的工具即可。

首先我們定義一下天氣資源的型別，程式碼如下所示：

```typescript
// src/types/weather.ts
export interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
  dt_txt?: string;
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  humidity: number;
  wind_speed: number;
  timestamp: string;
}

export interface ForecastDay {
  date: string;
  temperature: number;
  conditions: string;
}

export interface GetForecastArgs {
  city: string;
  days?: number;
}

// 型別保護函式，用於檢查 GetForecastArgs 型別
export function isValidForecastArgs(args: any): args is GetForecastArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "city" in args &&
    typeof args.city === "string" &&
    (args.days === undefined || typeof args.days === "number")
  );
}
```

這裡的型別定義主要是根據 OpenWeather API 的響應資料型別來定義的，這樣我們就可以方便地使用這些型別了。

然後編寫下面的基礎程式碼，替換模板 `src/index.ts` 中的程式碼：

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import {
  WeatherData,
  ForecastDay,
  OpenWeatherResponse,
  isValidForecastArgs,
} from "./types.js";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("OPENWEATHER_API_KEY environment variable is required");
}

const API_CONFIG = {
  BASE_URL: "http://api.openweathermap.org/data/2.5",
  DEFAULT_CITY: "San Francisco",
  ENDPOINTS: {
    CURRENT: "weather",
    FORECAST: "forecast",
  },
} as const;

class WeatherServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: "weather-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // 配置 axios 实例
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      params: {
        appid: API_KEY,
        units: "metric",
      },
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers(): void {
    // TODO: 实现资源处理器
  }

  private setupToolHandlers(): void {
    // TODO: 实现工具处理器
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error("Weather MCP server running on stdio");
  }
}

const server = new WeatherServer();
server.run().catch(console.error);
```

這段程式碼我們在模板的基礎上做了一些封裝，透過類別的方式來定義，主要完成了以下幾件事：

- 定義了天氣資源的型別
- 初始化了一個 MCP 伺服器實例
- 註冊了資源和工具處理器
- 啟動了伺服器

其中資源和工具處理器我們透過 `TODO` 標記了，接下來我們就可以實作這些處理器了。

### 實作資源處理器

在 `setupResourceHandlers` 方法中，我們來實作資源處理器，先新增一個列出資源的處理器，然後新增一個讀取資源的處理器，程式碼如下所示：

```typescript
private setupResourceHandlers(): void {
  this.server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => ({
      resources: [{
        uri: `weather://${API_CONFIG.DEFAULT_CITY}/current`,
        name: `Current weather in ${API_CONFIG.DEFAULT_CITY}`,
        mimeType: "application/json",
        description: "Real-time weather data including temperature, conditions, humidity, and wind speed"
      }]
    })
  );

  this.server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request) => {
      const city = API_CONFIG.DEFAULT_CITY;
      if (request.params.uri !== `weather://${city}/current`) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Unknown resource: ${request.params.uri}`
        );
      }

      try {
        const response = await this.axiosInstance.get<OpenWeatherResponse>(
          API_CONFIG.ENDPOINTS.CURRENT,
          {
            params: { q: city }
          }
        );

        const weatherData: WeatherData = {
          temperature: response.data.main.temp,
          conditions: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          wind_speed: response.data.wind.speed,
          timestamp: new Date().toISOString()
        };

        return {
          contents: [{
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(weatherData, null, 2)
          }]
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Weather API error: ${error.response?.data.message ?? error.message}`
          );
        }
        throw error;
      }
    }
  );
}
```

資源處理器的實作相當簡單，這裡我們自訂了 `weather` 的協定，資料格式採用 JSON。在取得資源時，我們會先透過 `axios` 向 OpenWeather API 請求取得當前天氣資料，然後將其轉換為 `WeatherData` 型別並回傳。

### 實作工具處理器

完成資源處理器的實作後，我們就可以來實作工具處理器了。工具處理器主要用於實作一些工具函式，這裡我們實作了一個查詢未來天氣預報的工具，程式碼如下所示：

```typescript
private setupToolHandlers(): void {
  this.server.setRequestHandler(
    ListToolsRequestSchema,
    async () => ({
      tools: [{
        name: "get_forecast",
        description: "Get weather forecast for a city",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "City name"
            },
            days: {
              type: "number",
              description: "Number of days (1-5)",
              minimum: 1,
              maximum: 5
            }
          },
          required: ["city"]
        }
      }]
    })
  );

  this.server.setRequestHandler(
    CallToolRequestSchema,
    async (request) => {
      if (request.params.name !== "get_forecast") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isValidForecastArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Invalid forecast arguments"
        );
      }

      const city = request.params.arguments.city;
      const days = Math.min(request.params.arguments.days || 3, 5);

      try {
        const response = await this.axiosInstance.get<{
          list: OpenWeatherResponse[]
        }>(API_CONFIG.ENDPOINTS.FORECAST, {
          params: {
            q: city,
            cnt: days * 8 // API 返回 3 小时间隔的数据
          }
        });

        const forecasts: ForecastDay[] = [];
        for (let i = 0; i < response.data.list.length; i += 8) {
          const dayData = response.data.list[i];
          forecasts.push({
            date: dayData.dt_txt?.split(' ')[0] ?? new Date().toISOString().split('T')[0],
            temperature: dayData.main.temp,
            conditions: dayData.weather[0].description
          });
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify(forecasts, null, 2)
          }]
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [{
              type: "text",
              text: `Weather API error: ${error.response?.data.message ?? error.message}`
            }],
            isError: true,
          }
        }
        throw error;
      }
    }
  );
}
```

同樣需要先實作列出工具的處理器，然後實作呼叫工具的處理器。這裡我們只定義了一個名為 `get_forecast` 的工具，該工具用於取得指定城市的天氣預報，需要接收兩個參數 `city` 和 `days`，其中 `city` 是城市名稱，`days` 是查詢的天數，預設是 3 天，當然資料還是透過請求 OpenWeather API 取得。

其實上面我們定義的資源可以直接透過工具來取得，我們新增一個取得目前天氣的工具即可，因為資料都是透過 OpenWeather API 取得，所以不定義資源也是可以的，只是這裡為了示範 MCP 的用法，所以我們定義了資源。

### 測試

到這裡我們就實作了一個簡單的天氣 MCP 服務，接下來我們就可以測試了。

首先我們需要建置專案：

```json
{
  "mcpServers": {
    //...... 其他服务器配置
    "weather": {
      "command": "node",
      "args": ["/Users/cnych/src/weather-server/build/index.js"],
      "env": {
        "OPENWEATHER_API_KEY": "your_openweather_api_key"
      }
    }
  }
}
```

其中 `args` 是我們建置後的文件路徑，`env` 是我們需要配置的 OpenWeather API 的 key。配置完成後重新啟動 Claude Desktop 即可。

### 測試

接下來我們就可以測試了，點擊 Claude Desktop 輸入框右下角的數字按鈕，裡面就會列出我們定義的 `get_forecast` 工具。

![Claude Weather Tools](/images/claude-weather-tools.png)

接下來我們就可以測試了，比如我們詢問 Claude 未來 5 天的天氣預報：

```bash
Can you get me a 5-day forecast for Beijing and tell me if I should pack an umbrella?
```

![Claude Weather Current](/images/claude-weather-forecast.png)

可以看到會調用 `get_forecast` 工具（需要授權）並顯示結果。

### 調試

如果我們在測試過程中遇到問題，可以通過一些方式來調試，比如查看 MCP 的詳細日誌：

```bash
# 實時查看日誌
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

這裡的日誌會捕獲伺服器連接事件、配置問題、運行時錯誤、消息交換等信息。

除了日誌外，我們還可以通過 `Chrome DevTools` 來進行調試，在 Claude Desktop 中訪問 Chrome 的開發人員工具以查看客戶端錯誤。可以在文件 `~/Library/Application\ Support/Claude/developer_settings.json` 中添加如下配置開啟 DevTools：

```json
{
  "allowDevTools": true
}
```

然後使用快捷鍵 `Command+Option+Shift+i` 就可以打開 DevTools 了，和在 Chrome 瀏覽器中調試一樣的。

![Claude DevTools](/images/claude-devtools.png)

除了上面這些常規的調試方式之外，Claude MCP 官方還提供了一個 `Inspector` 工具，**MCP Inspector** 是一種用於測試和調試 MCP 服務器的交互式開發人員工具。

直接通過 `npx` 命令就可以使用，不需要安裝：

```bash
npx @modelcontextprotocol/inspector <command>
# 或者
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

如果伺服器包來自 NPM，則可以使用下面的方式來啟動：

```bash
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# 例如
npx -y @modelcontextprotocol/inspector npx server-postgres postgres://127.0.0.1/testdb
```

如果是本地建置的包，則可以使用下面的方式來啟動：

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

比如我們上面建置的氣象服務，則可以使用下面的方式來啟動：

```bash
npx @modelcontextprotocol/inspector node /Users/cnych/src/weather-server/build/index.js
```

`Inspector` 工具啟動後，會在 `localhost:5173` 啟動一個 Web 頁面，我們就可以在上面測試和調試我們的氣象服務了。

![MCP Inspector](/images/claude-inspector-ui.png)

這裡需要注意，我們需要點擊右側的 `Environment Variables` 按鈕，然後添加 `OPENWEATHER_API_KEY` 環境變量，值為我們申請的 OpenWeather API 的 key，然後點擊 `Connect` 按鈕即可連接到氣象服務。

連接成功後，我們就可以在右側主窗口可以看到氣象服務的資源和工具了，我們就可以測試和調試了，點擊 `List Resources` 按鈕就可以列出氣象服務的資源，點擊列出的資源就可以讀取並顯示資源內容了。

![MCP Inspector 資源](/images/claude-inspector-resources.png)

同樣我們也可以測試 Tools，可以點擊 `List Tools` 按鈕列出氣象服務的工具，然後點擊具體的某個工具，輸入參數後點擊 `Run Tool` 按鈕即可調用工具並顯示結果。

![MCP Inspector 工具](/images/claude-inspector-tools.png)

除了資源（Resources）和工具（Tools）之外，我們還可以測試提示詞（Prompts）、取樣（Sampling）等功能。

至此，我們已經完成了一個簡易的天氣 MCP 服務的實作。
