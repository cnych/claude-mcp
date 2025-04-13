---
name: Firecrawl MCP
digest: 為大型語言模型提供網頁爬取能力的 Firecrawl MCP 伺服器
author: mendableai
repository: https://github.com/mendableai/firecrawl-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - firecrawl
  - 爬蟲
  - 網頁擷取
icon: https://avatars.githubusercontent.com/u/135057108?s=48&v=4
createTime: 2025-04-09
featured: true
---

Firecrawl MCP 是使用 [Firecrawl](https://firecrawl.dev/) 來爬取網頁的 MCP 伺服器實作，為 Cursor、Claude 以及其他 MCP 客戶端提供了進階的網頁爬取、內容擷取和資料處理能力。它透過 Model Context Protocol (MCP) 與各種 MCP 客戶端無縫整合，使 AI 能夠直接存取和處理網路內容。

## 主要特性

- **進階網頁爬取**：支援從單一 URL 或多個 URL 批次爬取內容
- **智慧內容擷取**：自動識別和擷取主要內容，過濾導覽列、頁尾等無關元素
- **結構化資料擷取**：使用 LLM 從網頁中擷取格式化的結構化資料
- **網路搜尋**：直接從搜尋引擎取得結果並處理
- **網站爬取**：支援遞迴爬取網站，可控制深度和範圍
- **深度研究**：使用智慧爬取、搜尋和 LLM 分析進行深入研究
- **自動生成 LLMs.txt**：為網站建立標準化的 LLMs.txt 檔案，定義 LLM 如何與網站互動
- **自動化速率限制處理**：內建指數退避重試機制
- **平行處理**：高效的批次操作和並行請求處理

## 安裝與設定

### 使用 npx 執行

```bash
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

### 手動安裝

```bash
npm install -g firecrawl-mcp
```

### 在 Cursor 上設定執行

#### 設定 Cursor 🖥️

注意：需要 Cursor 版本 0.45.6 或更高。有關設定 MCP 伺服器的最新說明，請參閱 Cursor 官方文件：[Cursor MCP 伺服器設定指南](https://cursor.sh/docs/mcp-server-configuration)

##### 在 Cursor v0.45.6 中設定 Firecrawl MCP

1. 開啟 Cursor 設定
2. 前往 Features > MCP Servers
3. 點擊 "+ Add New MCP Server"
4. 輸入以下內容：
   - 名稱："firecrawl-mcp"（或您喜歡的名稱）
   - 類型："command"
   - 指令：`env FIRECRAWL_API_KEY=your-api-key npx -y firecrawl-mcp`

##### 在 Cursor v0.48.6 中設定 Firecrawl MCP

1. 開啟 Cursor 設定
2. 前往 Features > MCP Servers
3. 點擊 "+ Add new global MCP server"
4. 輸入以下程式碼：

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

如果您使用的是 Windows 系統並遇到問題，請嘗試使用：`cmd /c "set FIRECRAWL_API_KEY=your-api-key && npx -y firecrawl-mcp"`

用您的 Firecrawl API 金鑰替換 `your-api-key`。如果您還沒有金鑰，可以建立帳戶並從 https://www.firecrawl.dev/app/api-keys 取得。

新增後，重新整理 MCP 伺服器列表以查看新工具。Composer Agent 會在適當時自動使用 Firecrawl MCP，但您也可以透過描述您的網頁爬取需求來明確請求它。透過 Command+L（Mac）存取 Composer，在提交按鈕旁邊選擇"Agent"，然後輸入您的查詢。

### 在 Windsurf 上執行

將以下內容新增到您的 `./codeium/windsurf/model_config.json` 檔案中：

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### 透過 Smithery 安裝（傳統方式）

透過 Smithery 自動為 Claude Desktop 安裝 Firecrawl：

```bash
npx -y @smithery/cli install @mendableai/mcp-server-firecrawl --client claude
```

### 設定

#### 環境變數

##### 雲端 API 必要變數

- `FIRECRAWL_API_KEY`：您的 Firecrawl API 金鑰

  - 使用雲端 API 時必要（預設）
  - 使用帶有 `FIRECRAWL_API_URL` 的自託管實例時可選

- `FIRECRAWL_API_URL`（可選）：自託管實例的自訂 API 端點
  - 範例：`https://firecrawl.your-domain.com`
  - 如果未提供，將使用雲端 API（需要 API 金鑰）

##### 可選設定

**重試設定**

- `FIRECRAWL_RETRY_MAX_ATTEMPTS`：最大重試嘗試次數（預設：3）
- `FIRECRAWL_RETRY_INITIAL_DELAY`：首次重試前的初始延遲（毫秒）（預設：1000）
- `FIRECRAWL_RETRY_MAX_DELAY`：重試之間的最大延遲（毫秒）（預設：10000）
- `FIRECRAWL_RETRY_BACKOFF_FACTOR`：指數退避乘數（預設：2）

**信用額度使用監控**

- `FIRECRAWL_CREDIT_WARNING_THRESHOLD`：信用額度使用警告閾值（預設：1000）
- `FIRECRAWL_CREDIT_CRITICAL_THRESHOLD`：信用額度使用臨界閾值（預設：100）

#### 設定範例

**使用雲端 API 的自訂重試和信用監控**：

```bash
# 雲端 API 必要
export FIRECRAWL_API_KEY=your-api-key

# 可選重試設定
export FIRECRAWL_RETRY_MAX_ATTEMPTS=5        # 增加最大重試次數
export FIRECRAWL_RETRY_INITIAL_DELAY=2000    # 以 2 秒延遲開始
export FIRECRAWL_RETRY_MAX_DELAY=30000       # 最大 30 秒延遲
export FIRECRAWL_RETRY_BACKOFF_FACTOR=3      # 更激進的退避

# 可選信用監控
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=2000    # 2000 信用額度時發出警告
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=500    # 500 信用額度時臨界警告
```

**自託管實例**：

```bash
# 自託管必要
export FIRECRAWL_API_URL=https://firecrawl.your-domain.com

# 自託管可選身份驗證
export FIRECRAWL_API_KEY=your-api-key  # 如果您的實例需要身份驗證

# 自訂重試設定
export FIRECRAWL_RETRY_MAX_ATTEMPTS=10
export FIRECRAWL_RETRY_INITIAL_DELAY=500     # 更快開始重試
```

### 與 Claude Desktop 一起使用

將以下內容新增到您的 `claude_desktop_config.json` 檔案：

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY_HERE",

        "FIRECRAWL_RETRY_MAX_ATTEMPTS": "5",
        "FIRECRAWL_RETRY_INITIAL_DELAY": "2000",
        "FIRECRAWL_RETRY_MAX_DELAY": "30000",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR": "3",

        "FIRECRAWL_CREDIT_WARNING_THRESHOLD": "2000",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD": "500"
      }
    }
  }
}
```

## 設定選項

Firecrawl MCP 伺服器提供了多種設定選項，可以根據需要進行調整：

### 重試設定

```javascript
retry: {
  maxAttempts: 3,    // 速率限制請求的重試次數
  initialDelay: 1000, // 首次重試前的初始延遲（毫秒）
  maxDelay: 10000,    // 重試之間的最大延遲（毫秒）
  backoffFactor: 2,   // 指數退避因子
}
```

### 信用額度監控

```javascript
credit: {
  warningThreshold: 1000, // 信用額度使用達到此級別時發出警告
  criticalThreshold: 100,  // 信用額度使用達到此級別時發出嚴重警告
}
```

這些設定控制：

1. **重試行為**

   - 自動重試因速率限制而失敗的請求
   - 使用指數退避避免過度請求 API
   - 範例：使用預設設定，重試將在以下時間點嘗試：
     - 第一次重試：1 秒延遲
     - 第二次重試：2 秒延遲
     - 第三次重試：4 秒延遲（上限為 maxDelay）

2. **信用額度監控**
   - 追蹤雲端 API 的信用額度消耗
   - 在指定閾值提供警告
   - 幫助防止服務意外中斷
   - 範例：使用預設設定：
     - 剩餘 1000 信用額度時發出警告
     - 剩餘 100 信用額度時發出嚴重警告

## 速率限制和批次處理

伺服器利用 Firecrawl 內建的速率限制和批次處理功能：

- 自動速率限制處理，帶有指數退避策略
- 批次操作的高效平行處理
- 智慧請求佇列和節流
- 自動重試暫時性錯誤

## 可用工具

### 1. 爬取工具 (`firecrawl_scrape`)

從單一 URL 爬取內容，支援進階選項。

```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "waitFor": 1000,
    "timeout": 30000,
    "mobile": false,
    "includeTags": ["article", "main"],
    "excludeTags": ["nav", "footer"],
    "skipTlsVerification": false
  }
}
```

### 2. 批次爬取工具 (`firecrawl_batch_scrape`)

高效地從多個 URL 爬取內容，內建速率限制和平行處理。

```json
{
  "name": "firecrawl_batch_scrape",
  "arguments": {
    "urls": ["https://example1.com", "https://example2.com"],
    "options": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

回應包含用於狀態檢查的操作 ID：

```json
{
  "content": [
    {
      "type": "text",
      "text": "Batch operation queued with ID: batch_1. Use firecrawl_check_batch_status to check progress."
    }
  ],
  "isError": false
}
```

### 3. 檢查批次狀態 (`firecrawl_check_batch_status`)

檢查批次操作的狀態。

```json
{
  "name": "firecrawl_check_batch_status",
  "arguments": {
    "id": "batch_1"
  }
}
```

### 4. 搜尋工具 (`firecrawl_search`)

搜尋網路並可選擇性地從搜尋結果中擷取內容。

```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "your search query",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

### 5. 爬取工具 (`firecrawl_crawl`)

啟動具有進階選項的非同步爬取。

```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
```

### 6. 擷取工具 (`firecrawl_extract`)

使用 LLM 功能從網頁中擷取結構化資訊。支援雲端 AI 和自託管 LLM 擷取。

```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "擷取產品資訊，包括名稱、價格和描述",
    "systemPrompt": "你是一個幫助擷取產品資訊的助手",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
```

範例回應：

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "name": "範例產品",
        "price": 99.99,
        "description": "這是一個範例產品描述"
      }
    }
  ],
  "isError": false
}
```

#### 擷取工具選項：

- `urls`：要從中擷取資訊的 URL 陣列
- `prompt`：LLM 擷取的自訂提示
- `systemPrompt`：引導 LLM 的系統提示
- `schema`：結構化資料擷取的 JSON 模式
- `allowExternalLinks`：允許從外部連結擷取
- `enableWebSearch`：啟用網路搜尋以取得額外上下文
- `includeSubdomains`：在擷取中包含子網域

使用自託管實例時，擷取將使用您設定的 LLM。對於雲端 API，它使用 Firecrawl 的託管 LLM 服務。

### 7. 深度研究工具 (`firecrawl_deep_research`)

使用智慧爬取、搜尋和 LLM 分析對查詢進行深度網路研究。

```json
{
  "name": "firecrawl_deep_research",
  "arguments": {
    "query": "碳捕獲技術是如何工作的？",
    "maxDepth": 3,
    "timeLimit": 120,
    "maxUrls": 50
  }
}
```

參數：

- query（字串，必要）：要探索的研究問題或主題。
- maxDepth（數字，可選）：爬取/搜尋的最大遞迴深度（預設：3）。
- timeLimit（數字，可選）：研究會話的時間限制（以秒為單位）（預設：120）。
- maxUrls（數字，可選）：要分析的最大 URL 數量（預設：50）。

返回：

- 基於研究由 LLM 生成的最終分析。(data.finalAnalysis)
- 可能還包括研究過程中使用的結構化活動和來源。

### 8. 生成 LLMs.txt 工具 (`firecrawl_generate_llmstxt`)

為給定網域名稱生成標準化的 `llms.txt` 檔案，此檔案定義了大型語言模型應如何與網站互動。

```json
{
  "name": "firecrawl_generate_llmstxt",
  "arguments": {
    "url": "https://example.com",
    "maxUrls": 20,
    "showFullText": true
  }
}
```

參數：

- url（字串，必要）：要分析的網站基本 URL。
- maxUrls（數字，可選）：要包含的最大 URL 數量（預設：10）。
- showFullText（布林值，可選）：是否在回應中包含 llms-full.txt 內容。

返回：

- 生成的 `llms.txt` 檔案內容，可選擇性地包含 `llms-full.txt`（`data.llmstxt` 和/或 `data.llmsfulltxt`）

## 日誌系統

伺服器包含全面的日誌記錄：

- 操作狀態和進度
- 效能指標
- 信用額度使用監控
- 速率限制追蹤
- 錯誤情況

範例日誌訊息：

```
[INFO] Firecrawl MCP Server 成功初始化
[INFO] 開始爬取 URL: https://example.com
[INFO] 批次操作已加入佇列，ID: batch_1
[WARNING] 信用額度使用已達到警告閾值
[ERROR] 超過速率限制，將在 2 秒後重試...
```

## 錯誤處理

伺服器提供完善的錯誤處理機制：

- 自動重試暫時性錯誤
- 採用退避策略處理速率限制
- 詳細的錯誤訊息
- 信用額度使用警告
- 網路容錯能力

錯誤回應範例：

```json
{
  "content": [
    {
      "type": "text",
      "text": "錯誤：超過速率限制。將在 2 秒後重試..."
    }
  ],
  "isError": true
}
```

## 開發

```bash
# 安裝相依套件
npm install

# 建置專案
npm run build

# 執行測試
npm test
```

### 貢獻指南

1. 複製專案儲存庫
2. 建立功能分支
3. 執行測試：`npm test`
4. 提交拉取請求

## 授權條款

MIT 授權 - 詳見 LICENSE 檔案
