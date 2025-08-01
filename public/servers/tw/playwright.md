---
name: Microsoft Playwright MCP
digest: 為大型語言模型提供瀏覽器自動化能力的 Playwright MCP 伺服器
author: microsoft
homepage: https://www.npmjs.com/package/@playwright/mcp
repository: https://github.com/microsoft/playwright-mcp
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - playwright
  - 瀏覽器
  - 自動化
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4
createTime: 2025-04-05
---

透過基於 [Playwright](https://playwright.dev) 的 Claude MCP 伺服器，為大型語言模型解鎖強大的網頁互動能力。這項創新解決方案透過結構化的無障礙快照實現 LLM 與網頁的無縫通訊 - **無需截圖或視覺模型**。

## 什麼是 Playwright？

`Playwright` 是由微軟開發的開源瀏覽器自動化工具，它讓測試人員和開發者能夠跨多種瀏覽器和平台自動化與 Web 應用的互動。與傳統自動化工具不同，`Playwright` 專為現代 Web 應用設計，支援動態內容、即時互動甚至網路監控，幫助團隊更快更有效地測試應用。

![Playwright](https://static.claudemcp.com/images/playwright.png)

在現代軟體開發中，自動化瀏覽器測試已成為不可或缺的環節，它確保 Web 應用能在不同瀏覽器和環境中流暢運作。如果你曾使用過 `Playwright`，你就了解它在自動化 Web 互動方面的強大能力。但當多個測試腳本、偵錯工具或自動化服務需要同時與同一 `Playwright` 實例互動時，`Playwright` 多客戶端協定(MCP)伺服器應運而生。

## Playwright 核心特性

### 多瀏覽器支援

`Playwright` 能無縫支援 Chromium、Firefox 和 WebKit，確保跨主要瀏覽器的相容性。這意味著單個測試腳本可以在不同瀏覽器中執行，減少重複工作並確保一致的使用者體驗。

### 無頭和有頭執行模式

`Playwright` 可以在無頭模式(無 UI)下執行以加快測試執行速度，這對 CI/CD 流程特別理想。同時，它也支援有頭模式，供開發者進行偵錯和互動式測試，視覺化檢查測試執行過程。

### 平行測試執行

`Playwright` 的最大優勢之一是能夠同時執行多個測試。平行執行減少了總體測試執行時間，成為需要頻繁快速測試的大型應用的理想解決方案。

### 進階偵錯工具

`Playwright` 內建的工具大大簡化了測試失敗的偵錯工作。它提供了：

- 軌跡檢視器 – 測試執行的分步視覺化展示
- 影片錄製 – 捕獲測試執行過程便於故障排除
- 螢幕截圖 – 幫助檢測 UI 不一致問題

### 強大的 Web 互動 API

`Playwright` 支援廣泛的使用者互動，包括：

- 點擊按鈕、填寫表單和捲動操作
- 捕獲網路請求和回應
- 處理認證流程和 Cookie
- 自動化檔案上傳和下載

## Playwright MCP 伺服器

Playwright MCP 伺服器是基於 Playwright 的 MCP 伺服器，它讓測試人員和開發者能夠跨多種瀏覽器和平台自動化與 Web 應用的互動。這個伺服器使大型語言模型（LLM）能夠透過結構化的可存取性快照與網頁互動，無需依賴截圖或視覺調整的模型。具有以下核心功能：

- **讓 LLM 具備瀏覽器自動化能力**：透過 MCP 連接 LLM，讓 AI 能夠直接操作網頁。適用於 Claude、GPT-4o、DeepSeek 等大型語言模型。
- **支援與網頁互動**：支援常見的網頁操作，包括點擊按鈕、填寫表單、捲動頁面等。
- **截取網頁截圖**：可以透過 Playwright MCP Server 取得網頁的螢幕截圖，分析當前頁面的 UI 和內容。
- **執行 JavaScript 程式碼**：支援在瀏覽器環境中執行 JavaScript，與網頁進行更複雜的互動。
- **整合便捷工具**：支援 Smithery 和 mcp-get 等工具，簡化安裝和設定過程。

適用於自動化測試、資訊抓取、SEO 競品分析、AI 智慧代理等任務。如果你希望讓 AI 更智慧地處理網頁任務，或者需要一個高效的自動化工具，不妨試試 Playwright MCP Server。

### 在 Cursor 中安裝

在 Cursor Settings 中，切換到 MCP 標籤頁，點擊右上角的 `Add new global MCP server` 按鈕，輸入以下設定：

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

如果不想全域範圍啟用，那麼可以在專案根目錄下面的 `.cursor/mcp.json` 檔案中添加上面的設定。

⚠️ 注意：官方文件中給的命令是 `npx @playwright/mcp@latest`，但是我在使用的時候會報錯，一直設定不上：

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

將 `npx @playwright/mcp@latest` 替換為 `npx @playwright/mcp` 即可。

設定完成後在 Cursor 設定頁面的 MCP 標籤頁中正常就可以看到 Playwright MCP 伺服器已經設定成功：

![](https://static.claudemcp.com/images/cursor-playwright-mcp.png)

### VS Code 安裝

```bash
# 針對VS Code
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'

# 針對VS Code Insiders
code-insiders --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'
```

安裝完成後，Playwright MCP 伺服器將立即可用於 VS Code 中的 GitHub Copilot 代理。

## 進階設定

### 瀏覽器選項

我們還可以在 `args` 中添加一些參數來自訂瀏覽器：

- `--browser <browser>`: 可選:
  - 標準瀏覽器: `chrome`, `firefox`, `webkit`, `msedge`
  - Chrome 變體: `chrome-beta`, `chrome-canary`, `chrome-dev`
  - Edge 變體: `msedge-beta`, `msedge-canary`, `msedge-dev`
  - 預設: `chrome`
- `--cdp-endpoint <endpoint>`: 連接到現有 Chrome DevTools 協定端點
- `--executable-path <path>`: 指定自訂瀏覽器可執行檔
- `--headless`: 無介面執行(預設有介面)
- `--port <port>`: 設定 SSE 傳輸監聽埠
- `--user-data-dir <path>`: 自訂使用者資料目錄
- `--vision`: 啟用基於截圖的互動模式

### 設定檔管理

Playwright MCP 在以下位置建立專用瀏覽器設定檔:

- Windows: `%USERPROFILE%\AppData\Local\ms-playwright\mcp-chrome-profile`
- macOS: `~/Library/Caches/ms-playwright/mcp-chrome-profile`
- Linux: `~/.cache/ms-playwright/mcp-chrome-profile`

在會話之間刪除這些目錄可清除瀏覽狀態。

## 操作模式

### 無介面操作(推薦用於自動化)

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

### 在無介面系統上進行有介面操作

對於沒有顯示器的 Linux 系統或 IDE 工作進程，我們可以使用 SSE 傳輸啟動伺服器，首先使用下面的命令啟動伺服器：

```bash
npx @playwright/mcp --port 8931
```

然後設定 MCP 用戶端即可：

```js
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/sse"
    }
  }
}
```

## 互動模式

一旦伺服器執行並連接到代理，代理可以呼叫 MCP 提供的特定工具來控制瀏覽器。可用的工具取決於伺服器是執行在快照模式還是視覺模式。

### 快照模式(推薦)

這是預設的模式，使用無障礙快照獲得最佳效能和可靠性。提供的 MCP 工具主要使用可存取性樹進行操作，一個常見的工作流程包括：

1. 使用 `browser_snapshot` 取得可存取性樹的當前狀態。
2. 代理分析快照（結構化文字/JSON）以理解頁面內容並識別目標元素。快照中的每個可互動元素通常都有一個唯一的 ref（引用識別碼）。
3. 代理呼叫互動工具，如 `browser_click` 或 `browser_type`，提供目標元素的 ref。

Playwright MCP 提供了一套用於瀏覽器自動化的工具。以下是所有可用的工具：

- **browser_navigate**: 導航到 URL
  - 參數:
    - url (string): 要導航的 URL
- **browser_go_back**: 返回上一頁
  - 參數: 無
- **browser_go_forward**: 前進到下一頁
  - 參數: 無
- **browser_click**: 點擊元素
  - 參數:
    - element (string): 要點擊的元素描述
    - ref (string): 頁面快照中精確的目標元素引用
- **browser_hover**: 懸停元素
  - 參數:
    - element (string): 要懸停的元素描述
    - ref (string): 頁面快照中精確的目標元素引用
- **browser_drag**: 拖放元素
  - 參數:
    - startElement (string): 要拖放的元素描述
    - startRef (string): 頁面快照中精確的源元素引用
    - endElement (string): 要拖放的目標元素描述
    - endRef (string): 頁面快照中精確的目標元素引用
- **browser_type**: 文字輸入(可選提交)
  - 參數:
    - element (string): 要輸入的元素描述
    - ref (string): 頁面快照中精確的目標元素引用
- **browser_hover**: 懸停元素
  - 參數:
    - element (string): 要懸停的元素描述
    - ref (string): 頁面快照中精確的目標元素引用
- **browser_drag**: 拖放元素
  - 參數:
    - startElement (string): 要拖放的元素描述
    - startRef (string): 頁面快照中精確的源元素引用
    - endElement (string): 要拖放的目標元素描述
    - endRef (string): 頁面快照中精確的目標元素引用
- **browser_type**: 文字輸入(可選提交)
  - 參數:
    - element (string): 要輸入的元素描述
    - ref (string): 頁面快照中精確的目標元素引用
    - text (string): 要輸入的文字
    - submit (boolean): 是否提交輸入的文字(按下 Enter 鍵後)
- **browser_select_option**: 選擇下拉選項
  - 參數:
    - element (string): 要選擇的元素描述
    - ref (string): 頁面快照中精確的目標元素引用
    - values (array): 要選擇的下拉選項值
- **browser_choose_file**: 選擇檔案
  - 參數:
    - paths (array): 要上傳的檔案的絕對路徑。可以是單個檔案或多個檔案。
- **browser_press_key**: 按下鍵盤上的一個鍵
  - 參數:
    - key (string): 要按下的鍵的名稱或字元，例如 ArrowLeft 或 a
- **browser_snapshot**: 捕獲當前頁面的無障礙快照(比截圖更好)
  - 參數: 無
- **browser_save_as_pdf**: 將頁面儲存為 PDF
  - 參數: 無
- **browser_take_screenshot**: 捕獲頁面截圖
  - 參數: 無
- **browser_wait**: 等待指定時間
  - 參數:
    - time (number): 等待的時間(最大為 10 秒)
- **browser_close**: 關閉頁面
  - 參數: 無
- **browser_close**: 關閉頁面
  - 參數: 無

### 視覺模式

用於基於截圖的視覺互動，啟用方法:

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

視覺模式提供的 MCP 工具依賴於從截圖中得出的座標，一個典型的工作流程包括：

1. 使用 `browser_screenshot` 捕獲當前視圖。
2. Agent 代理（可能需要視覺處理能力）分析截圖以識別目標位置（X，Y 座標）。
3. Agent 代理使用確定的座標呼叫互動工具，如 `browser_click` 或 `browser_type`。

Vision Mode 提供了一套用於基於截圖的視覺互動的工具，以下是所有可用的工具：

- **browser_navigate**: 導航到 URL
  - 參數:
    - url (string): 要導航的 URL
- **browser_go_back**: 返回上一頁
  - 參數: 無
- **browser_go_forward**: 前進到下一頁
  - 參數: 無
- **browser_screenshot**: 捕獲頁面截圖
  - 參數: 無
- **browser_move_mouse**: 移動滑鼠到指定座標
  - 參數:
    - x (number): X 座標
    - y (number): Y 座標
- **browser_click**: 點擊元素
  - 參數:
    - x (number): X 座標
    - y (number): Y 座標
- **browser_drag**: 拖放元素
  - 參數:
    - startX (number): 開始 X 座標
    - startY (number): 開始 Y 座標
    - endX (number): 結束 X 座標
    - endY (number): 結束 Y 座標
- **browser_type**: 文字輸入(可選提交)
  - 參數:
    - x (number): X 座標
    - y (number): Y 座標
    - text (string): 要輸入的文字
    - submit (boolean): 是否提交輸入的文字(按下 Enter 鍵後)
- **browser_press_key**: 按下鍵盤上的一個鍵
  - 參數:
    - key (string): 要按下的鍵的名稱或字元，例如 ArrowLeft 或 a
- **browser_choose_file**: 選擇檔案
  - 參數:
    - paths (array): 要上傳的檔案的絕對路徑。可以是單個檔案或多個檔案。
- **browser_save_as_pdf**: 將頁面儲存為 PDF
  - 參數: 無
- **browser_wait**: 等待指定時間
  - 參數:
    - time (number): 等待的時間(最大為 10 秒)
- **browser_close**: 關閉頁面
  - 參數: 無

## 自訂實作入門

除了設定檔和透過 IDE 自動啟動之外，Playwright MCP 可以直接整合到您的 Node.js 應用程式中。這提供了對伺服器設定和通訊傳輸的更多控制。

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

這種自訂方法允許進行細粒度控制、自訂傳輸層（超出預設機制或 SSE），並將 MCP 功能直接嵌入到更大的應用程式或代理框架中。

## 最佳實務

1. 大多數情況下首選快照模式 - 更快更可靠
2. 僅在絕對需要視覺辨識時使用視覺模式
3. 在敏感會話之間清除使用者設定檔
4. 利用無介面模式實現自動化工作流程
5. 結合 LLM 的自然語言能力實現強大的自動化

## 總結

Microsoft Playwright MCP 提供了一種強大而高效的方式，讓 LLMs 和 AI 代理與網路進行互動。透過利用瀏覽器的可存取性樹，在其預設快照模式下，它提供了一種快速、可靠且文字友善的瀏覽器自動化方法，非常適合常見任務，如導航、資料擷取和表單填寫。可選的視覺模式為需要與視覺元素進行座標互動的場景提供了後備方案。

透過 npx 進行簡單安裝，或深度整合到像 Cursor 這樣的 Claude MCP 用戶端中，以及包括無頭操作和自訂傳輸在內的靈活配置選項，Playwright MCP 是開發人員建構下一代網路感知 AI 代理的多功能工具。透過理解其核心概念和可用工具，您可以有效地賦能您的應用程式和代理，以便在廣闊的網際網路中導航和互動。
