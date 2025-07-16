---
name: Microsoft Playwright MCP
digest: 为大语言模型提供浏览器自动化能力的 Playwright MCP 服务器
author: microsoft
homepage: https://www.npmjs.com/package/@playwright/mcp
repository: https://github.com/microsoft/playwright-mcp
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - playwright
  - 浏览器
  - 自动化
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4
createTime: 2025-04-05
---

通过基于 [Playwright](https://playwright.dev) 的 Calude MCP 服务器，为大语言模型解锁强大的网页交互能力。这一创新解决方案通过结构化的无障碍快照实现 LLM 与网页的无缝通信 - **无需截图或视觉模型**。

## 什么是 Playwright？

`Playwright` 是由微软开发的开源浏览器自动化工具，它使测试人员和开发者能够跨多种浏览器和平台自动化与 Web 应用的交互。与传统自动化工具不同，`Playwright` 专为现代 Web 应用设计，支持动态内容、实时交互甚至网络监控，帮助团队更快更有效地测试应用。

![Playwright](https://static.claudemcp.com/images/playwright.png)

在现代软件开发中，自动化浏览器测试已成为不可或缺的环节，它确保 Web 应用能在不同浏览器和环境中流畅运行。如果你曾使用过 `Playwright`，你就了解它在自动化 Web 交互方面的强大能力。但当多个测试脚本、调试工具或自动化服务需要同时与同一 `Playwright` 实例交互时，`Playwright` 多客户端协议(MCP)服务器应运而生。

## Playwright 核心特性

### 多浏览器支持

`Playwright` 能无缝支持 Chromium、Firefox 和 WebKit，确保跨主要浏览器的兼容性。这意味着单个测试脚本可以在不同浏览器中执行，减少重复工作并确保一致的用户体验。

### 无头和有头执行模式

`Playwright` 可以在无头模式(无 UI)下运行以加快测试执行速度，这对 CI/CD 流程特别理想。同时，它也支持有头模式，供开发者进行调试和交互式测试，可视化检查测试运行过程。

### 并行测试执行

`Playwright` 的最大优势之一是能够同时执行多个测试。并行执行减少了总体测试运行时间，成为需要频繁快速测试的大型应用的理想解决方案。

### 高级调试工具

`Playwright` 内置的工具大大简化了测试失败的调试工作。它提供了：

- 轨迹查看器 – 测试执行的分步可视化展示
- 视频录制 – 捕获测试运行过程便于故障排查
- 屏幕截图 – 帮助检测 UI 不一致问题

### 强大的 Web 交互 API

`Playwright` 支持广泛的用户交互，包括：

- 点击按钮、填写表单和滚动操作
- 捕获网络请求和响应
- 处理认证流程和 Cookie
- 自动化文件上传和下载

## Playwright MCP 服务器

Playwright MCP 服务器是基于 Playwright 的 MCP 服务器，它使测试人员和开发者能够跨多种浏览器和平台自动化与 Web 应用的交互。这个服务器使大型语言模型（LLM）能够通过结构化的可访问性快照与网页交互，无需依赖截图或视觉调整的模型。具有以下核心功能：

- **让 LLM 具备浏览器自动化能力**：通过 MCP 连接 LLM，让 AI 能够直接操作网页。适用于 Claude、GPT-4o、DeepSeek 等大语言模型。
- **支持与网页交互**：支持常见的网页操作，包括点击按钮、填写表单、滚动页面等。
- **截取网页截图**：可以通过 Playwright MCP Server 获取网页的屏幕截图，分析当前页面的 UI 和内容。
- **执行 JavaScript 代码**：支持在浏览器环境中运行 JavaScript，与网页进行更复杂的交互。
- **集成便捷工具**：支持 Smithery 和 mcp-get 等工具，简化安装和配置过程。

适用于自动化测试、信息抓取、SEO 竞品分析、AI 智能代理等任务。如果你希望让 AI 更智能地处理网页任务，或者需要一个高效的自动化工具，不妨试试 Playwright MCP Server。

### 在 Cursor 中安装

在 Cursor Settings 中，切换到 MCP 标签页，点击右上角的 `Add new global MCP server` 按钮，输入以下配置：

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp"
      ]
    }
  }
}
```

如果不想全局范围启用，那么可以在项目根目录下面的 `.cursor/mcp.json` 文件中添加上面的配置。

⚠️ 注意：官方文档中给的命令是 `npx @playwright/mcp@latest`，但是我在使用的时候会报错，一直配置不上：

```bash
$ npx @playwright/mcp@latest


node:internal/modules/cjs/loader:646
      throw e;
      ^

Error: Cannot find module '/Users/cnych/.npm/_npx/9833c18b2d85bc59/node_modules/yaml/dist/index.js'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:1285:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:1273:15)
    at resolveExports (node:internal/modules/cjs/loader:639:14)
    at Module._findPath (node:internal/modules/cjs/loader:747:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1234:27)
    at Module._load (node:internal/modules/cjs/loader:1074:27)
    at TracingChannel.traceSync (node:diagnostics_channel:315:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:217:24)
    at Module.require (node:internal/modules/cjs/loader:1339:12)
    at require (node:internal/modules/helpers:135:16) {
  code: 'MODULE_NOT_FOUND',
  path: '/Users/cnych/.npm/_npx/9833c18b2d85bc59/node_modules/yaml/package.json'
}

Node.js v22.8.0
```

将 `npx @playwright/mcp@latest` 替换为 `npx @playwright/mcp` 即可。

配置完成后在 Cursor 设置页面的 MCP 标签页中正常就可以看到 Playwright MCP 服务器已经配置成功：

![](https://static.claudemcp.com/images/cursor-playwright-mcp.png)

### VS Code 安装

```bash
# 针对VS Code
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'

# 针对VS Code Insiders
code-insiders --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'
```

安装完成后，Playwright MCP 服务器将立即可用于 VS Code 中的 GitHub Copilot 代理。

## 高级配置

### 浏览器选项

我们还可以在 `args` 中添加一些参数来自定义浏览器：

- `--browser <browser>`: 可选:
  - 标准浏览器: `chrome`, `firefox`, `webkit`, `msedge`
  - Chrome 变体: `chrome-beta`, `chrome-canary`, `chrome-dev`
  - Edge 变体: `msedge-beta`, `msedge-canary`, `msedge-dev`
  - 默认: `chrome`
- `--cdp-endpoint <endpoint>`: 连接到现有 Chrome DevTools 协议端点
- `--executable-path <path>`: 指定自定义浏览器可执行文件
- `--headless`: 无界面运行(默认有界面)
- `--port <port>`: 设置 SSE 传输监听端口
- `--user-data-dir <path>`: 自定义用户数据目录
- `--vision`: 启用基于截图的交互模式

### 配置文件管理

Playwright MCP 在以下位置创建专用浏览器配置文件:

- Windows: `%USERPROFILE%\AppData\Local\ms-playwright\mcp-chrome-profile`
- macOS: `~/Library/Caches/ms-playwright/mcp-chrome-profile`
- Linux: `~/.cache/ms-playwright/mcp-chrome-profile`

在会话之间删除这些目录可清除浏览状态。

## 操作模式

### 无界面操作(推荐用于自动化)

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless"
      ]
    }
  }
}
```

### 在无界面系统上进行有界面操作

对于没有显示器的 Linux 系统或 IDE 工作进程，我们可以使用 SSE 传输启动服务器，首先使用下面的命令启动服务器：

```bash
npx @playwright/mcp --port 8931
```

然后配置 MCP 客户端即可：

```js
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/sse"
    }
  }
}
```

## 交互模式

一旦服务器运行并连接到代理，代理可以调用 MCP 提供的特定工具来控制浏览器。可用的工具取决于服务器是运行在快照模式还是视觉模式。

### 快照模式(推荐)

这是默认的模式，使用无障碍快照获得最佳性能和可靠性。提供的 MCP 工具主要使用可访问性树进行操作，一个常见的工作流程包括：

1. 使用 `browser_snapshot` 获取可访问性树的当前状态。
2. 代理分析快照（结构化文本/JSON）以理解页面内容并识别目标元素。快照中的每个可交互元素通常都有一个唯一的 ref（引用标识符）。
3. 代理调用交互工具，如 `browser_click` 或 `browser_type`，提供目标元素的 ref。

Playwright MCP 提供了一套用于浏览器自动化的工具。以下是所有可用的工具：

- **browser_navigate**: 导航到 URL
  - Parameters:
    - url (string): 要导航的 URL
- **browser_go_back**: 返回上一页
  - Parameters: None
- **browser_go_forward**: 前进到下一页
  - Parameters: None
- **browser_click**: 点击元素
  - Parameters:
    - element (string): 要点击的元素描述
    - ref (string): 页面快照中精确的目标元素引用
- **browser_hover**: 悬停元素
  - Parameters:
    - element (string): 要悬停的元素描述
    - ref (string): 页面快照中精确的目标元素引用
- **browser_drag**: 拖放元素
  - Parameters:
    - startElement (string): 要拖放的元素描述
    - startRef (string): 页面快照中精确的源元素引用
    - endElement (string): 要拖放的目标元素描述
    - endRef (string): 页面快照中精确的目标元素引用
- **browser_type**: 文本输入(可选提交)
  - Parameters:
    - element (string): 要输入的元素描述
    - ref (string): 页面快照中精确的目标元素引用
- **browser_hover**: 悬停元素
  - Parameters:
    - element (string): 要悬停的元素描述
    - ref (string): 页面快照中精确的目标元素引用
- **browser_drag**: 拖放元素
  - Parameters:
    - startElement (string): 要拖放的元素描述
    - startRef (string): 页面快照中精确的源元素引用
    - endElement (string): 要拖放的目标元素描述
    - endRef (string): 页面快照中精确的目标元素引用
- **browser_type**: 文本输入(可选提交)
  - Parameters:
    - element (string): 要输入的元素描述
    - ref (string): 页面快照中精确的目标元素引用
    - text (string): 要输入的文本
    - submit (boolean): 是否提交输入的文本(按下回车键后)
- **browser_select_option**: 选择下拉选项
  - Parameters:
    - element (string): 要选择的元素描述
    - ref (string): 页面快照中精确的目标元素引用
    - values (array): 要选择的下拉选项值
- **browser_choose_file**: 选择文件
  - Parameters:
    - paths (array): 要上传的文件的绝对路径。可以是单个文件或多个文件。
- **browser_press_key**: 按下键盘上的一个键
  - Parameters:
    - key (string): 要按下的键的名称或字符，例如 ArrowLeft 或 a
- **browser_snapshot**: 捕获当前页面的无障碍快照(比截图更好)
  - Parameters: None
- **browser_save_as_pdf**: 将页面保存为 PDF
  - Parameters: None
- **browser_take_screenshot**: 捕获页面截图
  - Parameters: None
- **browser_wait**: 等待指定时间
  - Parameters:
    - time (number): 等待的时间(最大为 10 秒)
- **browser_close**: 关闭页面
  - Parameters: None
- **browser_close**: 关闭页面
  - Parameters: None

### 视觉模式

用于基于截图的视觉交互，启用方法:

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp",
        "--vision"
      ]
    }
  }
}
```

视觉模式提供的 MCP 工具依赖于从截图中得出的坐标，一个典型的工作流程包括：

1. 使用 `browser_screenshot` 捕获当前视图。
2. Agent 代理（可能需要视觉处理能力）分析截图以识别目标位置（X，Y 坐标）。
3. Agent 代理使用确定的坐标调用交互工具，如 `browser_click` 或 `browser_type`。

Vision Mode 提供了一套用于基于截图的视觉交互的工具，以下是所有可用的工具：

- **browser_navigate**: 导航到 URL
  - Parameters:
    - url (string): 要导航的 URL
- **browser_go_back**: 返回上一页
  - Parameters: None
- **browser_go_forward**: 前进到下一页
  - Parameters: None
- **browser_screenshot**: 捕获页面截图
  - Parameters: None
- **browser_move_mouse**: 移动鼠标到指定坐标
  - Parameters:
    - x (number): X 坐标
    - y (number): Y 坐标
- **browser_click**: 点击元素
  - Parameters:
    - x (number): X 坐标
    - y (number): Y 坐标
- **browser_drag**: 拖放元素
  - Parameters:
    - startX (number): 开始 X 坐标
    - startY (number): 开始 Y 坐标
    - endX (number): 结束 X 坐标
    - endY (number): 结束 Y 坐标
- **browser_type**: 文本输入(可选提交)
  - Parameters:
    - x (number): X 坐标
    - y (number): Y 坐标
    - text (string): 要输入的文本
    - submit (boolean): 是否提交输入的文本(按下回车键后)
- **browser_press_key**: 按下键盘上的一个键
  - Parameters:
    - key (string): 要按下的键的名称或字符，例如 ArrowLeft 或 a
- **browser_choose_file**: 选择文件
  - Parameters:
    - paths (array): 要上传的文件的绝对路径。可以是单个文件或多个文件。
- **browser_save_as_pdf**: 将页面保存为 PDF
  - Parameters: None
- **browser_wait**: 等待指定时间
  - Parameters:
    - time (number): 等待的时间(最大为 10 秒)
- **browser_close**: 关闭页面
  - Parameters: None

## 自定义实现入门

除了配置文件和通过 IDE 自动启动之外，Playwright MCP 可以直接集成到您的 Node.js 应用程序中。这提供了对服务器设置和通信传输的更多控制。

```js
import { createServer } from "@playwright/mcp";
// Import necessary transport classes, e.g., from '@playwright/mcp/lib/sseServerTransport';
// Or potentially implement your own transport mechanism.

async function runMyMCPServer() {
  // Create the MCP server instance
  const server = createServer({
    // You can pass Playwright launch options here
    launchOptions: {
      headless: true,
      // other Playwright options...
    },
    // You might specify other server options if available
  });

  // Example using SSE transport (requires appropriate setup like an HTTP server)
  // This part is conceptual and depends on your specific server framework (e.g., Express, Node http)
  /*
  const http = require('http');
  const { SSEServerTransport } = require('@playwright/mcp/lib/sseServerTransport'); // Adjust path as needed

  const httpServer = http.createServer((req, res) => {
    if (req.url === '/messages' && req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      const transport = new SSEServerTransport("/messages", res); // Pass the response object
      server.connect(transport); // Connect the MCP server to this transport

      req.on('close', () => {
        // Handle client disconnect if necessary
        server.disconnect(transport);
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  httpServer.listen(8931, () => {
    console.log('MCP Server with SSE transport listening on port 8931');
  });
  */

  // For simpler non-web transport, you might use other mechanisms
  // server.connect(yourCustomTransport);

  console.log("Playwright MCP server started programmatically.");

  // Keep the server running, handle connections, etc.
  // Add cleanup logic for server shutdown.
}

runMyMCPServer().catch(console.error);
```

这种自定义方法允许进行细粒度控制、自定义传输层（超出默认机制或 SSE），并将 MCP 功能直接嵌入到更大的应用程序或代理框架中。

## 最佳实践

1. 大多数情况下首选快照模式 - 更快更可靠
2. 仅在绝对需要视觉识别时使用视觉模式
3. 在敏感会话之间清除用户配置文件
4. 利用无界面模式实现自动化工作流
5. 结合 LLM 的自然语言能力实现强大的自动化

## 总结

Microsoft Playwright MCP 提供了一种强大而高效的方式，让 LLMs 和 AI 代理与网络进行交互。通过利用浏览器的可访问性树，在其默认快照模式下，它提供了一种快速、可靠且文本友好的浏览器自动化方法，非常适合常见任务，如导航、数据提取和表单填写。可选的视觉模式为需要与视觉元素进行坐标交互的场景提供了后备方案。

通过 npx 进行简单安装，或深度集成到像 Cursor 这样的 Claude MCP 客户端中，以及包括无头操作和自定义传输在内的灵活配置选项，Playwright MCP 是开发人员构建下一代网络感知 AI 代理的多功能工具。通过理解其核心概念和可用工具，您可以有效地赋能您的应用程序和代理，以便在广阔的互联网中导航和交互。
