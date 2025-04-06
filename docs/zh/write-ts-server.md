---
title: 编写 MCP 服务器
description: 如何编写我们的第一个 TypeScript MCP 服务器
section: typescript
prev: quickstart
next: write-ts-client
pubDate: 2024-12-03
order: 1
---

# 编写一个 TypeScript MCP 服务器

在前面我们已经通过 [快速入门](./quickstart) 了解了如何使用 MCP 协议，但是我们都是直接使用的 Claude Desktop 官方内置支持的 MCP 服务器，那么如果我们要自己编写一个 MCP 服务器，该如何实现呢？

接下来我们将通过一个 TypeScript 的 MCP 服务器示例来演示如何编写一个 MCP 服务器。我们将创建一个天气服务器，提供当前天气数据作为资源，并让 Claude 使用工具获取天气预报。

这里我们需要使用 [OpenWeatherMap API](https://openweathermap.org/api) 来获取天气数据，直接注册然后在 [API keys](https://home.openweathermap.org/api_keys) 页面即可获取一个免费的 API 密钥。

## 环境准备

我们需要准备一个 TypeScript 的开发环境，所以需要安装 [Node.js](https://nodejs.org) 和 [npm](https://www.npmjs.com)。

```bash
# 检查 Node.js 版本，需要 v18 或更高版本
node --version

# 检查 npm 版本
npm --version
```

接下来我们可以直接使用 `@modelcontextprotocol/create-server` 这个工具来创建一个 MCP 服务器的脚手架：

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

然后安装依赖：

```bash
npm install --save axios dotenv
```

接下来我们需要设置环境变量，创建 `.env` 文件：

```
OPENWEATHER_API_KEY=your-api-key-here
```

确保将 `.env` 文件添加到 `.gitignore` 文件中。

项目创建完成后，我们可以看到项目结构如下：
​
![MCP 服务器项目结构](/images/claude-write-ts-server-layout.png)

## 模板分析

我们使用脚手架创建的项目，默认为我们创建了一个 MCP 服务器的模板，这个模板实现了一个简单的笔记系统，它通过以下方式来说明了资源和工具等核心 MCP 概念：

- 将笔记列为资源
- 阅读个人笔记
- 通过工具创建新笔记
- 通过提示总结所有笔记

我们在编写自己的 MCP 服务器之前，我们可以先来学习下这个笔记系统是如何实现的，然后我们再基于这个模板来实现我们自己的 MCP 服务器。

首先我们看下导入的依赖包：

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

第一行代码其实就是从 MCP 的 SDK 里面导入了 `Server` 这个对象，这个对象就表示一个 MCP 服务器，该服务器将自动响应来自客户端发起的初始化流程。后面我们还会看到导入了 `ListResourcesRequestSchema`、`ReadResourceRequestSchema` 等对象，这些对象就表示 MCP 协议中定义的请求类型。

比如模板中通过 `Server` 创建了一个 MCP 服务器：

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

该段代码创建了一个具有资源(用于列出/读取笔记)、工具(用于创建新笔记)和提示词(用于总结笔记)功能的 MCP 服务器，并指定了服务器的名称和版本。

当服务器初始化完成后，我们就可以通过 `Server` 对象的 `setRequestHandler` 方法来注册处理器了，当协议对象收到指定方法的请求时会被调用，这个过程其实就相当于我们编写了一个 HTTP 服务器，当收到指定 HTTP 方法的请求时，会调用我们注册的处理器。

在模板中，可以看到注册了几个处理器：

### 资源 Resources

这里我们需要对 `Resources` 资源进行一些说明，资源是 MCP 协议中的一种概念，它表示一个可以被读取和操作的对象，我们可以将服务器中的数据和内容作为资源暴露给 LLM，然后 LLM 就可以通过工具来操作这些资源。比如我们可以将一个笔记、一个文件、一个数据库表等作为资源。

> ⚠️ 需要注意的是资源被设计为由应用程序控制，这意味着客户端应用程序可以决定如何以及何时使用它们。不同的 MCP 客户端可能以不同的方式处理资源。例如：
>
> - Claude Desktop 目前要求用户在使用资源之前显式选择资源
> - 其他客户端可能会自动选择资源
> - 有些实现甚至可能允许 AI 模型本身来确定要使用哪些资源
>
> 所以服务器开发者在实现资源支持时应该准备好处理任何这些交互模式。为了自动将数据暴露给模型，服务器作者应该使用模型控制的原语，例如工具。

资源代表 MCP 服务器希望向客户端提供的任何类型的数据，可以包括如下类型：

- 文件内容
- 数据库记录
- API 响应
- 实时系统数据
- 屏幕截图和图像
- 日志文件
- 还有更多

每个资源都由唯一的 `URI` 标识，并且可以包含文本或二进制数据。

模板中将所有的笔记资源作为资源暴露给了客户端，通过 `setRequestHandler` 注册了处理器来处理客户端的 `resources/list` 请求：

```typescript
/**
 * 用于列出可用笔记作为资源的处理程序。
 * 每个笔记都作为具有以下特征的资源公开:
 * - note:// URI scheme
 * - MIME 类型
 * - 人类可读的名称和描述(包括笔记标题)
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

#### 资源 URI

资源使用遵循以下格式的 URI 进行标识：

```
[protocol]://[host]/[path]
```

例如：

- `file:///home/user/documents/report.pdf`
- `postgres://database/customers/schema`
- `screen://localhost/display1`

其中 `protocol` 协议和 `path` 路径结构由 MCP 服务器实现定义，当然服务器可以定义自己的自定义 URI 方案。

#### 资源类型

资源可以包含两种类型的内容：

**文本资源**

文本资源包含 UTF-8 编码的文本数据，这些适用于：

- 源代码
- 配置文件
- 日志文件
- JSON/XML 数据
- 纯文本

**二进制资源**

二进制资源包含以 `base64` 编码的原始二进制数据，这些适用于：

- 图片
- PDF 文件
- 音频文件
- 视频文件
- 其他非文本格式

#### 资源发现

客户端可以通过两种主要方法发现可用资源：

**直接资源**

服务器通过 `resources/list` 端点公开暴露具体资源的列表。每个资源包括：

```json
{
  uri: string;           // 资源的唯一标识符
  name: string;          // 人类可读的名称
  description?: string;  // 可选描述
  mimeType?: string;     // 可选的 MIME 类型
}
```

**资源模板**

对于动态资源，服务器可以暴露 **URI 模板**，客户端可以使用该模板来构造有效的资源 URI：

```json
{
  uriTemplate: string;   // 遵循 RFC 6570 的 URI 模板
  name: string;          // 该类型的人类可读名称
  description?: string;  // 可选描述
  mimeType?: string;     // 所有匹配资源的可选 MIME 类型
}
```

#### 读取资源

要读取资源，客户端用资源 URI 发出 `resources/read` 请求。服务器响应如下所示的资源内容列表：

```json
{
  contents: [
    {
      uri: string;        // 资源的 URI
      mimeType?: string;  // 可选的 MIME 类型
      // 其中之一：
      text?: string;      // 对于文本资源
      blob?: string;      // 对于二进制资源 (base64 编码)
    }
  ]
}
```

服务器可能会返回多个资源来响应一个 `resources/read` 请求，比如在读取目录时返回目录内的文件列表。

比如模板中读取笔记的处理器实现如下：

```typescript
/**
 * 用于读取指定笔记内容的处理程序。
 * 接受一个 note:// URI 并返回笔记内容作为纯文本。
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

#### 资源更新

MCP 通过两种机制支持资源的实时更新：

**列表变更**

当可用资源列表发生变化时，服务器可以通过 `notification/resources/list_changed` 通知客户端。

**内容变更**

客户端可以订阅指定资源的更新：

- 客户端使用资源 URI 发送 `resources/subscribe` 请求
- 当资源发生变化时服务器发送 `notification/resources/update` 通知
- 客户端可以通过 `resources/read` 来获取最新内容
- 客户端可以取消订阅资源/取消订阅

### 工具 Tools

工具使 LLM 能够通过你的服务器执行操作，Tools 使服务器能够向客户端暴露可执行功能，通过工具，LLM 可以与外部系统交互、执行计算并在现实世界中执行操作。工具从服务器暴露给客户端，目的是 AI 模型能够自动调用它们（授予批准）。

MCP 中的工具允许服务器暴露可执行函数，这些函数可以被客户端调用，并被 LLM 用来执行操作，实现工具主要包含以下几个方面：

- **发现**：客户端可以通过 `tools/list` 端点列出可用的工具调用
- **调用**：使用 `tools/call` 端点调用工具，服务器在其中执行请求操作并返回结果
- **灵活性**：工具的范围可以从简单的计算到复杂的 API 交互

与资源一样，工具由唯一名称标识，并且可以包含描述来标识其用途，但是与资源不同，工具代表可以修改状态或与外部系统交互的动态操作。

每个工具都定义有以下结构：

```json
{
  name: string;          // 工具的唯一标识符
  description?: string;  // 人类可读的描述
  inputSchema: { // 工具参数的 JSON Schema
    type: "object";
    properties: { ... } // 工具特定参数
  }
}
```

比如在模板代码中就通过 `setRequestHandler` 注册了工具列表处理器，代码如下所示：

```typescript
/**
 * 用于列出可用工具的处理程序。
 * 暴露一个 "create_note" 工具，让客户端创建新笔记。
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

上面代码根据前面定义的工具结构定义了一个名为 `create_note` 的工具，该工具表示用来创建新笔记，并且需要接收两个参数：`title` 和 `content`，也就是笔记的标题和内容，这样客户端就知道有 `create_note` 这个工具可以调用，并且知道调用该工具需要传入 `title` 和 `content` 参数。

上面这个注册器只是列出了所有可用的工具，要真正调用实现工具，还需要注册工具调用处理器，代码如下所示：

```typescript
/**
 * 用于创建新笔记的处理程序。
 * 使用提供的标题和内容创建新笔记，并返回成功消息。
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

上面代码实现很简单，就是根据工具名称 `create_note` 来创建新笔记，并返回成功消息，当客户端调用 `create_note` 工具时，就会触发上面处理器代码。

### 提示词 Prompts

`Prompts` 提示词是 MCP 协议中用于定义可重复使用的提示词模板和工作流程的机制，客户可以轻松地向用户和 LLM 展示这些模板和工作流程。提示词被设计为由用户控制，这意味着它们从服务器暴露给客户端，以便用户能够显式选择使用它们。

MCP 中的提示词是预定义的模板，可以：

- 接受动态参数
- 从资源中包含上下文
- 链多个交互
- 指导特定工作流程
- 作为 UI 元素（如斜杠命令）

每个 Prompt 定义包含以下结构：

```json
{
  name: string;              // 提示词的唯一标识符
  description?: string;      // 人类可读的描述
  arguments?: [              // 可选的参数列表
    {
      name: string;          // 参数的标识符
      description?: string;  // 参数的描述
      required?: boolean;    // 是否必须
    }
  ]
}
```

客户端可以通过 `prompts/list` 端点来发现所有可用的提示词，比如发起如下所示的请求：

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

然后可以通过 `prompts/get` 端点来获取指定提示词的详细信息：

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

比如模板中通过 `setRequestHandler` 注册了提示词列表处理器，代码如下所示：

```typescript
/**
 * 用于列出可用提示词的处理程序。
 * 暴露一个 "summarize_notes" 提示词，用于总结所有笔记。
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

可以看到模板中注册了一个名为 `summarize_notes` 的提示词，该提示词用于总结所有笔记，但是这个提示词并没有定义任何参数，所以客户端在调用该提示词时不需要传入任何参数。

然后要获取提示词的详细信息，可以通过 `prompts/get` 端点来获取，同样模板中也通过 `setRequestHandler` 注册了提示词获取处理器，代码如下所示：

```typescript
/**
 * 用于总结所有笔记的提示词处理器。
 * 返回一个提示词，请求总结所有笔记，并将笔记内容作为资源嵌入。
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

从上面代码可以看到，在生成提示词时，会将所有笔记内容嵌入到提示词中，这样上下文就有了笔记的相关内容了。

### 启动服务器

到这里，我们就实现了一个简单的 MCP 服务器，并且注册了资源、工具、提示词等处理器。当然最后我们还需要启动服务器，这样我们编写的服务器才能真正运行起来。

模板中通过 `stdio` 传输启动服务器，代码如下所示：

```typescript
/**
 * 使用 stdio 传输启动服务器。
 * 允许服务器通过标准输入/输出流进行通信。
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

`stdio` 传输支持通过标准输入输出流进行通信，这对于本地集成和命令行工具特别有用，我们可以在以下情况下使用 `stdio`：

- 构建命令行工具
- 实施本地集成
- 需要简单的进程通信
- 使用 shell 脚本

除了 `stdio` 传输，MCP 还支持基于 HTTP 的服务器发送事件 (`SSE`) 传输，SSE 传输支持通过 HTTP POST 请求进行服务器到客户端流式传输，以进行客户端到服务器通信。在以下情况下我们可以使用 `SSE`：

- 只需要服务器到客户端的流式传输
- 使用受限网络
- 实施简单的更新

## 编写代码

上面我们分析了 MCP 服务器的实现，接下来我们就可以根据我们的需求来编写代码了。我们的需求是提供一个天气查询服务，这里我们就可以将天气数据作为资源，然后暴露了一个查询天气的工具即可。

首先我们定义下天气资源的类型，代码如下所示：

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

// 类型保护函数，用于检查 GetForecastArgs 类型
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

这里的类型定义主要是根据 OpenWeather API 的响应数据类型来定义的，这样我们就可以方便地使用这些类型了。

然后编写下面的基础代码，替换模板 `src/index.ts` 中的代码：

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

这里代码我们在模板的基础上做了一点小小的封装，通过类的方式来定义，主要做了以下几件事：

- 定义了天气资源的类型
- 初始化了一个 MCP 服务器实例
- 注册了资源和工具处理器
- 启动了服务器

其中资源和工具处理器我们通过 `TODO` 标记了，接下来我们就可以实现这些处理器了。

### 实现资源处理器

在 `setupResourceHandlers` 方法中，我们来实现资源处理器，先添加一个列出资源的处理器，然后添加一个读取资源的处理器，代码如下所示：

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

列出资源的处理器实现很简单，这里我们自定义 `weather` 的协议，然后的数据类型是 JSON 格式的。在获取资源时，我们先通过 `axios` 请求 OpenWeather API 获取当前天气数据，然后将其转换为 `WeatherData` 类型并返回即可。

### 实现工具处理器

资源处理器实现后，我们就可以实现工具处理器了。工具处理器主要用于实现一些工具函数，这里我们实现一个查询未来天气预报的工具，代码如下所示：

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

同样需要先实现列出工具的处理器，然后实现调用工具的处理器。这里我们只定义了一个名为 `get_forecast` 的工具，该工具用于获取指定城市的天气预报，需要接收两个参数 `city` 和 `days`，其中 `city` 是城市名称，`days` 是查询的天数，默认是 3 天，当然数据还是通过请求 OpenWeather API 获取的。

其实上面我们定义的资源可以直接通过工具来获取，我们添加一个获取当前天气的工具即可，因为数据都是通过 OpenWeather API 获取的，所以不定义资源也是可以的，只是这里为了演示 MCP 的用法，所以我们定义了资源。

### 测试

到这里我们就实现了一个简单的天气 MCP 服务，接下来我们就可以测试了。

首先我们需要构建项目：

```bash
npm run build
```

然后需要需要重新更新下 Claude Desktop 的配置:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

将我们的天气服务添加到配置中，如下所示：

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

其中 `args` 是我们构建后的文件路径，`env` 是我们需要配置的 OpenWeather API 的 key。配置完成后重启 Claude Desktop 即可。

### 测试

接下来我们就可以测试了，点击 Claude Desktop 输入框右下角的数字按钮，里面就会列出我们定义的 `get_forecast` 工具。

![Claude Weather Tools](/images/claude-weather-tools.png)

接下来我们就可以测试了，比如我们询问 Claude 未来 5 天的天气预报：

```bash
Can you get me a 5-day forecast for Beijing and tell me if I should pack an umbrella?
```

![Claude Weather Current](/images/claude-weather-forecast.png)

可以看到会调用 `get_forecast` 工具（需要授权）并显示结果。

### 调试

如果我们在测试过程中遇到问题，可以通过一些方式来调试，比如查看 MCP 的详细日志：

```bash
# 实时查看日志
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

这里的日志会捕获服务器连接事件、配置问题、运行时错误、消息交换等信息。

除了日志外，我们还可以通过 `Chrome DevTools` 来进行调试，在 Claude Desktop 中访问 Chrome 的开发人员工具以查看客户端错误。可以在文件 `~/Library/Application\ Support/Claude/developer_settings.json` 中添加如下配置开启 DevTools：

```json
{
  "allowDevTools": true
}
```

然后使用快捷键 `Command+Option+Shift+i` 就可以打开 DevTools 了，和在 Chrome 浏览器中调试一样的。

![Claude DevTools](/images/claude-devtools.png)

除了上面这些常规的调试方式之外，Claude MCP 官方还提供了一个 `Inspector` 工具，**MCP Inspector** 是一种用于测试和调试 MCP 服务器的交互式开发人员工具。

直接通过 `npx` 命令就可以使用，不需要安装：

```bash
npx @modelcontextprotocol/inspector <command>
# 或者
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

如果服务器包来自 NPM，则可以使用下面的方式来启动：

```bash
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# 例如
npx -y @modelcontextprotocol/inspector npx server-postgres postgres://127.0.0.1/testdb
```

如果是本地构建的包，则可以使用下面的方式来启动：

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

比如我们上面构建的天气服务，则可以使用下面的方式来启动：

```bash
npx @modelcontextprotocol/inspector node /Users/cnych/src/weather-server/build/index.js
```

`Inspector` 工具启动后，会在 `localhost:5173` 启动一个 Web 页面，我们就可以在上面测试和调试我们的天气服务了。

![MCP Inspector](/images/claude-inspector-ui.png)

这里需要注意，我们需要点击右侧的 `Environment Variables` 按钮，然后添加 `OPENWEATHER_API_KEY` 环境变量，值为我们申请的 OpenWeather API 的 key，然后点击 `Connect` 按钮即可连接到天气服务。

连接成功后，我们就可以在右侧主窗口可以看到天气服务的资源和工具了，我们就可以测试和调试了，点击 `List Resources` 按钮就可以列出天气服务的资源，点击列出的资源就可以读取并显示资源内容了。

![MCP Inspector 资源](/images/claude-inspector-resources.png)

同样我们也可以测试 Tools，可以点击 `List Tools` 按钮列出天气服务的工具，然后点击具体的某个工具，输入参数后点击 `Run Tool` 按钮即可调用工具并显示结果。

![MCP Inspector 工具](/images/claude-inspector-tools.png)

当然除了 Resources 和 Tools 之外，还可以测试 Prompts、Sampling 等。

到这里我们就实现了一个简单的天气 MCP 服务。
