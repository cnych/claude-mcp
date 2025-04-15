---
name: EdgeOne Pages MCP
digest: MCP服務可快速將HTML內容部署至EdgeOne Pages，並生成公開URL以便輕鬆存取與分享。透過簡化設定，讓內容發佈更加便捷。
author: TencentEdgeOne
repository: https://github.com/TencentEdgeOne/edgeone-pages-mcp
homepage: https://edgeone.ai/document/162227908259442688
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 無伺服器
  - 邊緣運算
  - 騰訊
icon: https://avatars.githubusercontent.com/u/176978739?v=4
createTime: 2025-03-25
---

一項 MCP 服務，用於將 HTML 內容部署至 EdgeOne Pages 並取得可公開存取的 URL。

## 示範

![騰訊 EdgeOne Pages MCP 示範](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-ef5005b0.gif)

## 需求

- Node.js 18 或更高版本

## 配置 MCP

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "command": "npx",
      "args": ["edgeone-pages-mcp"]
    }
  }
}
```

## 架構

![EdgeOne Pages MCP架構圖](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-4f131d90.svg)

架構圖說明工作流程：

1. 大型語言模型生成 HTML 內容
2. 內容傳送至 EdgeOne Pages MCP 伺服器
3. MCP 伺服器將內容部署至 EdgeOne Pages 邊緣函數
4. 內容儲存於 EdgeOne KV 儲存以實現快速邊緣存取
5. MCP 伺服器回傳公開 URL
6. 使用者可透過瀏覽器存取已部署內容，享受快速邊緣傳遞

## 功能

- MCP 協議可快速將 HTML 內容部署至 EdgeOne Pages
- 自動生成可公開存取的 URL

## 實作

此 MCP 服務整合 EdgeOne Pages Functions 以部署靜態 HTML 內容。實作採用：

1. **EdgeOne Pages Functions** - 一個無伺服器運算平台，允許在邊緣執行 JavaScript/TypeScript 程式碼。

2. **關鍵實作細節**：

   - 使用 EdgeOne Pages KV 儲存來儲存與提供 HTML 內容
   - 自動為每次部署生成公開 URL
   - 透過適當錯誤訊息處理 API 錯誤

3. **運作方式**：

   - MCP 伺服器透過`deploy-html`工具接收 HTML 內容
   - 連接 EdgeOne Pages API 取得基礎 URL
   - 使用 EdgeOne Pages KV API 部署 HTML 內容
   - 回傳已部署內容的可公開存取 URL

4. **使用範例**：
   - 提供 HTML 內容至 MCP 服務
   - 立即取得可存取的公開 URL

更多資訊請參閱[EdgeOne Pages Functions 文件](https://edgeone.ai/document/162227908259442688)與[EdgeOne Pages KV 儲存指南](https://edgeone.ai/document/162227803822321664)。
