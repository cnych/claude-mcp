---
name: Open-WebSearch MCP 伺服器
digest: 一個基於多引擎搜尋結果的模型上下文協議（MCP）伺服器，支援免費網路搜尋，不需要 API 金鑰。
author: Aas-ee
repository: https://github.com/Aas-ee/open-webSearch
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - web-search
  - search
  - web
icon: https://avatars.githubusercontent.com/u/81606643?s=48&v=4
createTime: 2025-06-10
---

一個基於多引擎搜尋結果的模型上下文協議（MCP）伺服器，支援免費網路搜尋，**不需要 API 金鑰**。

## 功能特色

- 基於多個搜尋引擎結果進行網路檢索：

  - Bing
  - 百度
  - ~~linux.do~~（暫不支援）
  - CSDN
  - DuckDuckGo
  - Exa
  - Brave

- 支援 HTTP 代理設定，輕鬆解決網路存取限制問題
- 無需 API 金鑰或身份驗證
- 回傳包含標題、URL 和描述的結構化結果
- 可自訂每次搜尋返回的結果數量
- 可指定預設搜尋引擎
- 支援抓取單篇文章內容（目前支援 CSDN）

## TODO

- ✅ 已支援：Bing、DuckDuckGo、Exa、Brave
- 待支援：Google 及更多搜尋引擎
- 支援更多部落格平台、論壇、社交媒體網站
- 優化文章內容擷取功能，增加更多網站支援

## 安裝說明

### 本機安裝

1. 複製或下載此專案
2. 安裝依賴：

```bash
npm install
```

3. 建構伺服器：

```bash
npm run build
```

4. 將伺服器加入 MCP 設定：

**Cherry Studio：**

```json
{
  "mcpServers": {
    "web-search": {
      "name": "Web Search MCP",
      "type": "streamableHttp",
      "description": "多引擎搜尋並支援文章擷取",
      "isActive": true,
      "baseUrl": "http://localhost:3000/mcp"
    }
  }
}
```

**VSCode（Claude 開發擴充套件）：**

```json
{
  "mcpServers": {
    "web-search": {
      "transport": {
        "type": "streamableHttp",
        "url": "http://localhost:3000/mcp"
      }
    },
    "web-search-sse": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

**Claude 桌面版：**

```json
{
  "mcpServers": {
    "web-search": {
      "transport": {
        "type": "streamableHttp",
        "url": "http://localhost:3000/mcp"
      }
    },
    "web-search-sse": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

### Docker 部署

使用 Docker Compose 快速部署：

```bash
docker-compose up -d
```

或直接使用 Docker 指令：

```bash
docker run -d --name web-search -p 3000:3000 -e ENABLE_CORS=true -e CORS_ORIGIN=* ghcr.io/aas-ee/open-web-search:latest
```

環境變數說明：

```bash
# 啟用 CORS（預設：false）
ENABLE_CORS=true

# CORS 來源設定（預設：*）
CORS_ORIGIN=*

# 預設搜尋引擎（可選：bing、duckduckgo、exa、brave，預設為 bing）
DEFAULT_SEARCH_ENGINE=duckduckgo

# 是否啟用 HTTP 代理（預設：false）
USE_PROXY=true

# 代理伺服器網址（預設：http://127.0.0.1:10809）
PROXY_URL=http://your-proxy-server:port
```

然後在 MCP 客戶端中配置：

```json
{
  "mcpServers": {
    "web-search": {
      "name": "Web Search MCP",
      "type": "streamableHttp",
      "description": "多引擎搜尋並支援文章擷取",
      "isActive": true,
      "baseUrl": "http://localhost:3000/mcp"
    },
    "web-search-sse": {
      "transport": {
        "name": "Web Search MCP",
        "type": "sse",
        "description": "多引擎搜尋並支援文章擷取",
        "isActive": true,
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

## 使用說明

伺服器提供三個工具：`search`、`fetchLinuxDoArticle` 與 `fetchCsdnArticle`。

### `search` 工具使用說明

```ts
{
  "query": string,        // 搜尋關鍵字
  "limit": number,        // 可選：回傳結果數（預設：10）
  "engines": string[]     // 可選：使用的搜尋引擎（支援：bing、baidu、linuxdo、csdn、duckduckgo、exa、brave；預設：bing）
}
```

使用範例：

```ts
use_mcp_tool({
  server_name: "web-search",
  tool_name: "search",
  arguments: {
    query: "搜尋內容",
    limit: 3,
    engines: ["bing", "csdn", "duckduckgo", "exa", "brave"],
  },
});
```

回傳範例：

```json
[
  {
    "title": "示例搜尋結果",
    "url": "https://example.com",
    "description": "描述文字...",
    "source": "來源",
    "engine": "使用的搜尋引擎"
  }
]
```

### `fetchCsdnArticle` 工具使用說明

用來獲取 CSDN 文章完整內容。

```ts
{
  "url": string    // 從 search 查到的 csdn 文章連結
}
```

範例：

```ts
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchCsdnArticle",
  arguments: {
    url: "https://blog.csdn.net/xxx/article/details/xxx",
  },
});
```

回傳範例：

```json
[
  {
    "content": "完整文章內容..."
  }
]
```

### `fetchLinuxDoArticle` 工具使用說明

用來獲取 Linux.do 論壇文章內容。

```ts
{
  "url": string    // 從 search 查到的 linuxdo 文章連結
}
```

範例：

```ts
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchLinuxDoArticle",
  arguments: {
    url: "https://xxxx.json",
  },
});
```

回傳範例：

```json
[
  {
    "content": "完整文章內容..."
  }
]
```

## 使用限制說明

由於本工具是透過爬蟲取得搜尋引擎結果，使用時請注意以下限制：

1. **頻率限制**：

   - 若短時間內大量請求，可能導致搜尋引擎封鎖
   - 建議：

     - 控制搜尋頻率
     - 合理使用 `limit` 參數
     - 必要時增加搜尋間的延遲

2. **結果正確性**：

   - 結果依賴搜尋引擎網頁結構，如有改版可能失效
   - 某些結果可能缺乏描述等欄位
   - 複雜搜尋語法可能無法完整支援

3. **法律與使用條款**：

   - 僅供個人用途
   - 請遵守各搜尋引擎的使用條款
   - 建議依實際情況控制存取頻率

4. **預設搜尋引擎設定**：

   - 可透過 `DEFAULT_SEARCH_ENGINE` 環境變數設定
   - 支援：bing、duckduckgo、exa、brave
   - 若指定網站無特定引擎，會自動使用預設搜尋引擎

5. **代理設定支援**：

   - 若某些搜尋引擎在當地不可用，可配置 HTTP 代理
   - 透過 `USE_PROXY=true` 啟用代理
   - 使用 `PROXY_URL` 設定代理伺服器地址
