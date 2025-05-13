---
name: Apify MCP 伺服器
digest: 透過模型上下文協定部署並操作Apify Actors，執行網路爬取、資料擷取與自動化任務
author: Apify
repository: https://github.com/apify/actors-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - apify
  - 爬蟲
  - 自動化
icon: https://avatars.githubusercontent.com/u/24586296?s=48&v=4
createdAt: 2025-05-06T00:00:00Z
---

# Apify 模型上下文協定 (MCP) 伺服器

[![Actors MCP 伺服器](https://apify.com/actor-badge?actor=apify/actors-mcp-server)](https://apify.com/apify/actors-mcp-server)  
[![smithery 徽章](https://smithery.ai/badge/@apify/actors-mcp-server)](https://smithery.ai/server/@apify/actors-mcp-server)

為所有 [Apify Actors](https://apify.com/store) 實作的 MCP 伺服器。  
此伺服器可與一個或多個 Apify Actors 互動，總計超過 5000 個 Actors，皆可於 MCP 伺服器設定中定義。

# 🎯 Apify MCP 伺服器能做什麼？

MCP 伺服器 Actor 允許 AI 助手使用任何 [Apify Actor](https://apify.com/store) 作為工具來執行特定任務或任務集。  
例如，它可以：

- 使用 [Facebook 貼文爬取器](https://apify.com/apify/facebook-posts-scraper) 從多個頁面/個人檔案擷取 Facebook 貼文資料
- 使用 [Google 地圖郵件擷取器](https://apify.com/lukaskrivka/google-maps-with-contact-details) 擷取 Google 地圖聯絡資訊
- 使用 [Google 搜尋結果爬取器](https://apify.com/apify/google-search-scraper) 爬取 Google 搜尋引擎結果頁面 (SERPs)
- 使用 [Instagram 爬取器](https://apify.com/apify/instagram-scraper) 爬取 Instagram 貼文、個人檔案、地點、照片與留言
- 使用 [RAG 網頁瀏覽器](https://apify.com/apify/web-scraper) 搜尋網路、爬取前 N 個網址並回傳其內容

# MCP 用戶端

要與 Apify MCP 伺服器互動，您可以使用以下 MCP 用戶端：

- [Claude 桌面版](https://claude.ai/download)（僅支援 Stdio）
- [Visual Studio Code](https://code.visualstudio.com/)（支援 Stdio 與 SSE）
- [LibreChat](https://www.librechat.ai/)（支援 Stdio 與 SSE，但不含授權標頭）
- [Apify MCP 測試用戶端](https://apify.com/jiri.spilka/tester-mcp-client)（支援 SSE 與授權標頭）
- 其他用戶端請見 [https://modelcontextprotocol.io/clients](https://modelcontextprotocol.io/clients)
- 更多用戶端請見 [https://glama.ai/mcp/clients](https://glama.ai/mcp/clients)

當您將 Actors 與 MCP 伺服器整合後，可以詢問：

- 「搜尋網路並摘要近期關於 AI 代理人的趨勢」
- 「找出舊金山前十名最佳義大利餐廳」
- 「搜尋並分析巨石強森的 Instagram 個人檔案」
- 「提供使用 Model Context Protocol 的逐步指南，附來源網址」
- 「我可以使用哪些 Apify Actors？」

下圖展示 Apify MCP 伺服器如何與 Apify 平台及 AI 用戶端互動：

![Actors-MCP-server](https://raw.githubusercontent.com/apify/actors-mcp-server/refs/heads/master/docs/actors-mcp-server.png)

透過 MCP 測試用戶端可動態載入 Actors，但此功能尚未被其他 MCP 用戶端支援。
我們也計劃新增更多功能，詳見[發展藍圖](#發展藍圖2025年3月)。

# 🤖 MCP 伺服器與 AI 代理人的關聯為何？

Apify MCP 伺服器透過 MCP 協定公開 Apify 的 Actors，讓實作 MCP 協定的 AI 代理人或框架能將所有 Apify Actors 作為工具，用於資料擷取、網路搜尋等任務。

想深入了解 AI 代理人？請參閱我們的部落格文章：[什麼是 AI 代理人？](https://blog.apify.com/what-are-ai-agents/)，並瀏覽 Apify 精選的[AI 代理人集合](https://apify.com/store/collections/ai_agents)。
有興趣在 Apify 上建立並營利自己的 AI 代理人嗎？查看我們的[逐步指南](https://blog.apify.com/how-to-build-an-ai-agent/)，了解如何在 Apify 平台創建、發布並營利 AI 代理人。

# 🧱 組件

## 工具

### 執行器

任何[Apify 執行器](https://apify.com/store)均可作為工具使用。
預設情況下，伺服器已配置以下指定執行器，但可透過提供執行器輸入參數覆寫此設定。

```text
'apify/instagram-scraper'
'apify/rag-web-browser'
'lukaskrivka/google-maps-with-contact-details'
```

MCP 伺服器會載入執行器輸入架構，並建立對應的 MCP 工具。
參見[RAG 網頁瀏覽器](https://apify.com/apify/rag-web-browser/input-schema)的輸入架構範例。

工具名稱必須始終使用完整執行器名稱，例如`apify/rag-web-browser`。
MCP 工具的參數即代表該執行器的輸入參數。
以`apify/rag-web-browser`執行器為例，其參數為：

```json
{
  "query": "restaurants in San Francisco",
  "maxResults": 3
}
```

無需手動指定輸入參數或呼叫哪個執行器，一切由 LLM 自動管理。
當工具被呼叫時，LLM 會自動將參數傳遞給執行器。
具體參數清單請參閱各執行器的說明文件。

### 輔助工具

伺服器提供一組輔助工具，用於探索可用執行器及獲取其詳情：

- `get-actor-details`：獲取特定執行器的說明文件、輸入架構及詳細資訊
- `discover-actors`：透過關鍵字搜尋相關執行器並返回其詳情

另提供管理工具清單的功能。但需注意，動態增刪工具需 MCP 客戶端具備更新工具清單的能力（能處理`ToolListChangedNotificationSchema`），此功能通常不被支援。

您可使用[Apify 測試用 MCP 客戶端](https://apify.com/jiri.spilka/tester-mcp-client)執行器試用此功能。
啟用時請設定`enableActorAutoLoading`參數。

- `add-actor-as-tool`：依名稱將執行器加入可用工具清單（不立即執行），後續執行需取得使用者同意
- `remove-actor-from-tool`：當不再需要時，依名稱從工具清單中移除執行器

## 提示與資源

本伺服器目前不提供任何資源與提示模板。
未來計畫將[Apify 資料集](https://docs.apify.com/platform/storage/dataset)與[鍵值儲存庫](https://docs.apify.com/platform/storage/key-value-store)納入資源系統。

# ⚙️ 使用方式

Apify MCP 伺服器可透過兩種方式運作：作為運行於 Apify 平台上的**Actor 服務**，或是作為運行於本機的**本地伺服器**。

## 🇦 MCP 伺服器 Actor 模式

### 待命網路伺服器

此 Actor 以[**待命模式**](https://docs.apify.com/platform/actors/running/standby)運行，內建 HTTP 網路伺服器接收並處理請求。

要啟動預設 Actor 伺服器，請將包含[Apify API 令牌](https://console.apify.com/settings/integrations)的 HTTP GET 請求發送至以下網址：

```
https://actors-mcp-server.apify.actor?token=<APIFY_TOKEN>
```

亦可指定不同組合的 Actors 啟動 MCP 伺服器。
請先建立[任務](https://docs.apify.com/platform/actors/running/tasks)並設定欲使用的 Actors 清單。

接著以待命模式執行該任務：

```shell
https://USERNAME--actors-mcp-server-task.apify.actor?token=<APIFY_TOKEN>
```

所有可用 Actors 清單請參閱 [Apify 商店](https://apify.com/store)。

#### 💬 透過 SSE 與 MCP 伺服器互動

伺服器啟動後，可使用伺服器推送事件(SSE)發送訊息並接收回應。
最簡便的方式是使用 Apify 平台上的 [Tester MCP Client](https://apify.com/jiri.spilka/tester-mcp-client)。

[Claude Desktop](https://claude.ai/download)目前不支援 SSE，但可透過 Stdio 傳輸協定互動，詳見[本地主機運行 MCP 伺服器](#本地主機上的-mcp-伺服器)。
注意：免費版 Claude Desktop 可能與伺服器出現間歇性連線問題。

客戶端需設定伺服器參數：

```json
{
  "mcpServers": {
    "apify": {
      "type": "sse",
      "url": "https://actors-mcp-server.apify.actor/sse",
      "env": {
        "APIFY_TOKEN": "您的-apify-token"
      }
    }
  }
}
```

亦可使用 [clientSse.ts](https://github.com/apify/actor-mcp-server/tree/main/src/examples/clientSse.ts) 腳本，或透過 `curl` </> 指令測試：

1. 發送 GET 請求初始化伺服器推送事件：

   ```
   curl https://actors-mcp-server.apify.actor/sse?token=<APIFY_TOKEN>
   ```

   伺服器將回傳用於後續通訊的 `sessionId`：

   ```shell
   event: endpoint
   data: /message?sessionId=a1b
   ```

2. 使用 POST 請求發送訊息至伺服器：

   ```shell
   curl -X POST "https://actors-mcp-server.apify.actor/message?token=<APIFY_TOKEN>&session_id=a1b" -H "Content-Type: application/json" -d '{
     "jsonrpc": "2.0",
     "id": 1,
     "method": "tools/call",
     "params": {
       "arguments": { "searchStringsArray": ["舊金山餐廳"], "maxCrawledPlacesPerSearch": 3 },
       "name": "lukaskrivka/google-maps-with-contact-details"
     }
   }'
   ```

   MCP 伺服器將以輸入參數啟動 `lukaskrivka/google-maps-with-contact-details` Actor。
   伺服器將回應：

   ```text
   已接受請求
   ```

3. 接收回應。伺服器將透過 SSE 串流傳回 JSON 格式的執行結果：

   ```text
   event: message
   data: {"result":{"content":[{"type":"text","text":"{\"searchString\":\"舊金山餐廳\",\"rank\":1,\"title\":\"Gary Danko\",\"description\":\"名廚 Gary Danko 提供的美式料理套餐...\",\"price\":\"$100+\"...}}]}}
   ```

## 本地主機上的 MCP 伺服器

您可以透過 Claude Desktop 或任何其他 [MCP 客戶端](https://modelcontextprotocol.io/clients) 在本地機器上運行 Apify MCP 伺服器。您也可以使用 [Smithery](https://smithery.ai/server/@apify/actors-mcp-server) 自動安裝伺服器。

### 必要條件

- MacOS 或 Windows 作業系統
- 必須安裝最新版本的 Claude Desktop（或其他 MCP 客戶端）
- [Node.js](https://nodejs.org/en)（v18 或更高版本）
- [Apify API 令牌](https://docs.apify.com/platform/integrations/api#api-token)（`APIFY_TOKEN`）

請確認已正確安裝 `node` 和 `npx`：

```bash
node -v
npx -v
```

若未安裝，請遵循此指南安裝 Node.js：[下載並安裝 Node.js 和 npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)。

#### Claude Desktop

要配置 Claude Desktop 與 MCP 伺服器協作，請按照以下步驟操作。詳細指南請參閱 [Claude Desktop 使用者指南](https://modelcontextprotocol.io/quickstart/user)。

1. 下載 Claude Desktop
   - 提供 Windows 和 macOS 版本。
   - Linux 使用者可使用此[非官方建置腳本](https://github.com/aaddrick/claude-desktop-debian)建立 Debian 套件。
2. 開啟 Claude Desktop 應用程式，從左上角選單列啟用 **開發者模式**。
3. 啟用後，開啟 **設定**（同樣位於左上角選單列），導航至 **開發者選項**，您會看到 **編輯設定檔** 按鈕。
4. 開啟設定檔並編輯以下檔案：

   - macOS：`~/Library/Application\ Support/Claude/claude_desktop_config.json`
   - Windows：`%APPDATA%/Claude/claude_desktop_config.json`
   - Linux：`~/.config/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "actors-mcp-server": {
         "command": "npx",
         "args": ["-y", "@apify/actors-mcp-server"],
         "env": {
           "APIFY_TOKEN": "您的-apify-token"
         }
       }
     }
   }
   ```

   或者，您可以使用 `actors` 參數選擇一個或多個 Apify Actors：

   ```json
   {
     "mcpServers": {
       "actors-mcp-server": {
         "command": "npx",
         "args": [
           "-y",
           "@apify/actors-mcp-server",
           "--actors",
           "lukaskrivka/google-maps-with-contact-details,apify/instagram-scraper"
         ],
         "env": {
           "APIFY_TOKEN": "您的-apify-token"
         }
       }
     }
   }
   ```

5. 重新啟動 Claude Desktop

   - 完全退出 Claude Desktop（確保不僅僅是最小化或關閉視窗）。
   - 重新啟動 Claude Desktop。
   - 尋找 🔌 圖示以確認 Actors MCP 伺服器已連接。

6. 開啟 Claude Desktop 聊天視窗並詢問「我可以使用哪些 Apify Actors？」

   ![Claude-desktop-with-Actors-MCP-server](https://raw.githubusercontent.com/apify/actors-mcp-server/refs/heads/master/docs/claude-desktop.png)

7. 範例

   您可以要求 Claude 執行任務，例如：

   ```text
   尋找並分析最近關於 LLM 的研究論文。
   找出舊金山前十名最佳義大利餐廳。
   尋找並分析巨石強森的 Instagram 個人資料。
   ```

#### VS Code

一鍵安裝請點擊下方按鈕：

[![在VS Code中通過NPX安裝](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=actors-mcp-server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40apify%2Factors-mcp-server%22%5D%2C%22env%22%3A%7B%22APIFY_TOKEN%22%3A%22%24%7Binput%3Aapify_token%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apify_token%22%2C%22description%22%3A%22Apify+API+Token%22%2C%22password%22%3Atrue%7D%5D) [![在VS Code Insiders中通過NPX安裝](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=actors-mcp-server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40apify%2Factors-mcp-server%22%5D%2C%22env%22%3A%7B%22APIFY_TOKEN%22%3A%22%24%7Binput%3Aapify_token%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apify_token%22%2C%22description%22%3A%22Apify+API+Token%22%2C%22password%22%3Atrue%7D%5D&quality=insiders)

##### 手動安裝

您可以在 VS Code 中手動安裝 Apify MCP 伺服器。首先點擊本節頂部的任意安裝按鈕進行一鍵安裝。

或者，將以下 JSON 代碼塊添加到 VS Code 的用戶設置(JSON)文件中。您可以通過按下`Ctrl + Shift + P`並輸入`Preferences: Open User Settings (JSON)`來實現。

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apify_token",
        "description": "Apify API Token",
        "password": true
      }
    ],
    "servers": {
      "actors-mcp-server": {
        "command": "npx",
        "args": ["-y", "@apify/actors-mcp-server"],
        "env": {
          "APIFY_TOKEN": "${input:apify_token}"
        }
      }
    }
  }
}
```

您也可以將其添加到工作區的`.vscode/mcp.json`文件中——只需省略頂層的`mcp {}`鍵。這樣便於與他人共享配置。

如需指定載入哪些 Actor，可添加`--actors`參數：

```json
{
  "servers": {
    "actors-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@apify/actors-mcp-server",
        "--actors",
        "lukaskrivka/google-maps-with-contact-details,apify/instagram-scraper"
      ],
      "env": {
        "APIFY_TOKEN": "${input:apify_token}"
      }
    }
  }
}
```

#### 使用@modelcontextprotocol/inspector 調試 NPM 包@apify/actors-mcp-server

調試服務器時請使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)工具：

```shell
export APIFY_TOKEN=你的apify令牌
npx @modelcontextprotocol/inspector npx -y @apify/actors-mcp-server
```

### 通過 Smithery 安裝

如需通過[Smithery](https://smithery.ai/server/@apify/actors-mcp-server)為 Claude Desktop 自動安裝 Apify Actors MCP Server：

```bash
npx -y @smithery/cli install @apify/actors-mcp-server --client claude
```

#### 標準輸入輸出客戶端

創建包含以下內容的`.env`環境文件：

```text
APIFY_TOKEN=你的apify令牌
```

在`examples`目錄中可找到通過標準輸入輸出(stdio)與服務器交互的示例客戶端：

- [`clientStdio.ts`](https://github.com/apify/actor-mcp-server/tree/main/src/examples/clientStdio.ts)
  該客戶端腳本會啟動帶兩個指定 Actor 的 MCP 服務器
  隨後調用`apify/rag-web-browser`工具執行查詢並打印結果
  演示了如何連接 MCP 服務器、列出可用工具及使用 stdio 傳輸調用特定工具
  ```bash
  node dist/examples/clientStdio.js
  ```

# 👷 開發指南

## 環境要求

- [Node.js](https://nodejs.org/en) (v18 或更高版本)
- Python 3.9 或更高版本

創建包含以下內容的`.env`環境文件：

```text
APIFY_TOKEN=你的apify令牌
```

構建 actor-mcp-server 包：

```bash
npm run build
```

## 本地客戶端(SSE)

測試 SSE 傳輸協議時可以使用`examples/clientSse.ts`腳本：
當前 Node.js 客戶端暫不支持通過自定義標頭連接遠程服務器
需在腳本中修改為本地服務器 URL

```bash
node dist/examples/clientSse.js
```

## 調試說明

由於 MCP 服務器通過標準輸入輸出(stdio)運行，調試較為困難
推薦使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)獲得最佳調試體驗

可通過[`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)運行以下命令啟動調試器：

```bash
export APIFY_TOKEN=你的apify令牌
npx @modelcontextprotocol/inspector node ./dist/stdio.js
```

啟動後，檢查器將顯示可在瀏覽器中訪問的調試 URL

## ⓘ 限制條件與意見回饋

Actor 輸入架構經過處理以兼容多數 MCP 客戶端，同時遵循[JSON Schema](https://json-schema.org/)標準。處理流程包含：

- **描述文字**截斷至 500 字元（由`MAX_DESCRIPTION_LENGTH`定義）
- **枚舉欄位**所有元素的總長度上限為 200 字元（由`ACTOR_ENUM_MAX_LENGTH`定義）
- **必填欄位**在描述中明確標註「REQUIRED」前綴，以兼容可能無法正確處理 JSON 架構的框架
- **嵌套屬性**針對代理配置、請求列表來源等特殊情況構建，確保輸入結構正確
- **陣列項目類型**當架構未明確定義時，依優先順序推斷：items 中的顯式類型 > 預填類型 > 默認值類型 > 編輯器類型
- **枚舉值與範例**加入屬性描述，確保即使客戶端不完全支援 JSON 架構仍可視覺化

每個 Actor 的記憶體限制為 4GB。
免費用戶有 8GB 限制，其中需分配 128MB 用於運行`Actors-MCP-Server`。

如需其他功能或有任何建議，請於[Apify 控制台提交問題](https://console.apify.com/actors/1lSvMAaRcadrM1Vgv/issues)。

# 🚀 發展藍圖（2025 年 3 月）

- 新增 Apify 資料集與鍵值存儲作為資源
- 加入 Actor 日誌、Actor 運行等除錯工具

# 🐛 疑難排解

- 執行`node -v`確認已安裝`node`
- 確認已設定`APIFY_TOKEN`環境變數
- 始終使用最新版 MCP 伺服器，設定為`@apify/actors-mcp-server@latest`

# 📚 延伸閱讀

- [模型上下文協定](https://modelcontextprotocol.org/)
- [什麼是 AI 代理？](https://blog.apify.com/what-are-ai-agents/)
- [MCP 是什麼？為何重要？](https://blog.apify.com/what-is-model-context-protocol/)
- [MCP 客戶端測試工具](https://apify.com/jiri.spilka/tester-mcp-client)
- [AI 代理工作流：建立查詢 Apify 資料集的代理](https://blog.apify.com/ai-agent-workflow/)
- [MCP 客戶端開發指南](https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md)
- [如何在 Apify 上建立並營利 AI 代理](https://blog.apify.com/how-to-build-an-ai-agent/)
