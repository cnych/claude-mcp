---
name: Brave 搜尋
digest: 使用 Brave API 搜尋網頁內容
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search
capabilities:
  resources: true
  tools: true
tags:
  - brave
  - 搜尋
  - api
icon: https://cdn.simpleicons.org/brave
createTime: 2024-12-01T00:00:00Z
---

一個整合了 Brave 搜尋 API 的 MCP 伺服器實作，提供網頁和本地搜尋功能。

## 功能特色

- **網頁搜尋**：支援一般查詢、新聞、文章，具有分頁和時效性控制
- **本地搜尋**：查找商家、餐廳和服務，提供詳細資訊
- **彈性過濾**：控制結果類型、安全等級和內容時效性
- **智慧回退**：當本地搜尋無結果時自動切換到網頁搜尋

## 工具

- **brave_web_search**

  - 執行帶分頁和過濾的網頁搜尋
  - 輸入參數：
    - `query` (字串)：搜尋關鍵字
    - `count` (數字，選填)：每頁結果數量（最大 20）
    - `offset` (數字，選填)：分頁偏移量（最大 9）

- **brave_local_search**
  - 搜尋本地商家和服務
  - 輸入參數：
    - `query` (字串)：本地搜尋關鍵字
    - `count` (數字，選填)：結果數量（最大 20）
  - 當無本地結果時自動切換到網頁搜尋

## 設定

### 取得 API 金鑰

1. 註冊 [Brave 搜尋 API 帳號](https://brave.com/search/api/)
2. 選擇方案（免費方案每月可查詢 2,000 次）
3. 在[開發者控制台](https://api.search.brave.com/app/keys)產生你的 API 金鑰

### 在 Claude Desktop 中使用

將以下內容添加到你的 `claude_desktop_config.json` 中：

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## License

本 MCP 伺服器基於 MIT 許可證發布。這意味著你可以自由地使用、修改和分發軟件，但需遵守 MIT 許可證中的條款和條件。更多詳細信息請參見項目倉庫中的 LICENSE 文件。
