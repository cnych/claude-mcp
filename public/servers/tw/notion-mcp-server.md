---
name: Notion MCP Server
digest: Notion-MCP 是一個增強 Notion 功能的伺服器解決方案，提供更佳的性能、可靠性和自訂選項。它為使用 Notion 作為生產力平台的團隊提供無縫整合、更快的數據處理和更好的擴展性。該服務確保穩定的連接性和優化的工作流程。
author: makenotion
homepage: https://github.com/makenotion/notion-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - 伺服器
  - notion
icon: https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-e217db9f.jpg
createTime: 2025-03-11
---

此專案為 [Notion API](https://developers.notion.com/reference/intro) 實現了一個 [MCP 伺服器](https://www.claudemcp.com/tw/specification)。

![mcp-demo](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-329eb145.jpg)

## 安裝

### 在 Notion 中設定整合：

前往 [https://www.notion.so/profile/integrations](https://www.notion.so/profile/integrations) 並創建一個新的 **內部** 整合或選擇現有的整合。

![創建 Notion 整合令牌](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-ede5f671.png)

為了安全起見，您可以創建一個僅供讀取的整合令牌，只需在「配置」標籤中勾選「讀取內容」權限：

![顯示已勾選讀取內容的 Notion 整合令牌權限](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-d83f196f.png)

### 將 MCP 配置添加到您的客戶端：

#### 使用 npm：

將以下內容添加到您的 `.cursor/mcp.json` 或 `claude_desktop_config.json`：

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\" }"
      }
    }
  }
}
```

#### 使用 Docker：

構建 Docker 映像：

```bash
docker-compose build
```

然後添加到您的配置中：

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "OPENAPI_MCP_HEADERS={\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\"}",
        "notion-mcp-server-notion-mcp-server"
      ]
    }
  }
}
```

將 `ntn_****` 替換為您的整合密鑰：

![從開發者入口網站的配置標籤複製您的整合令牌](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-2c84281a.jpg)

### 將內容連接到整合：

訪問頁面/數據庫，並在 3 點選單中點擊「連接到整合」。

![將整合令牌添加到 Notion 連接](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-a69b7191.png)

## 範例

1. 在頁面上留言：

```
在頁面「Getting started」上留言「Hello MCP」
```

2. 創建新頁面：

```
在頁面「Development」中添加標題為「Notion MCP」的頁面
```

3. 通過 ID 獲取頁面內容：

```
獲取頁面 1a6b35e6e67f802fa7e1d27686f017f2 的內容
```

## 開發

構建：

```
npm run build
```

執行：

```
npx -y --prefix /path/to/local/notion-mcp-server @notionhq/notion-mcp-server
```

發布：

```
npm publish --access public
```
