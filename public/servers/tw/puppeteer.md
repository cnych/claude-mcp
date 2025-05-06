---
name: Puppeteer
digest: 使用 Puppeteer 提供瀏覽器自動化能力的 MCP 伺服器。該伺服器使 LLMs 能夠與網頁互動、截圖和在真實瀏覽器環境中執行 JavaScript。
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - puppeteer
  - 瀏覽器
  - 爬蟲
icon: https://cdn.simpleicons.org/puppeteer
createTime: 2024-12-01T00:00:00Z
---

使用 Puppeteer 提供瀏覽器自動化能力的 MCP 伺服器。該伺服器使 LLMs 能夠與網頁互動、截圖和在真實瀏覽器環境中執行 JavaScript。

## 組件

### 工具

- **puppeteer_navigate**

  - 導航到瀏覽器中的任何 URL
  - 輸入: `url` (string)

- **puppeteer_screenshot**

  - 捕獲整個頁面或特定元素的截圖
  - 輸入:
    - `name` (string, required): 截圖名稱
    - `selector` (string, optional): CSS 選擇器，用於截圖元素
    - `width` (number, optional, default: 800): 截圖寬度
    - `height` (number, optional, default: 600): 截圖高度

- **puppeteer_click**

  - 點擊頁面上的元素
  - 輸入: `selector` (string): CSS 選擇器，用於點擊元素

- **puppeteer_hover**

  - 懸停頁面上的元素
  - 輸入: `selector` (string): CSS 選擇器，用於懸停元素

- **puppeteer_fill**

  - 填充輸入欄位
  - 輸入:
    - `selector` (string): CSS 選擇器，用於輸入欄位
    - `value` (string): 要填充的值

- **puppeteer_select**

  - 選擇帶有 SELECT 標籤的元素
  - 輸入:
    - `selector` (string): CSS 選擇器，用於選擇元素
    - `value` (string): 要選擇的值

- **puppeteer_evaluate**

  - 在瀏覽器控制台中執行 JavaScript
  - 輸入: `script` (string): 要執行的 JavaScript 程式碼

### 資源

伺服器提供兩種類型的資源：

1. **Console Logs** (`console://logs`)

   - 瀏覽器控制台輸出文字格式
   - 包括瀏覽器中的所有控制台訊息

2. **Screenshots** (`screenshot://<name>`)
   - PNG 圖像的截圖
   - 通過捕獲時指定的截圖名稱訪問

## 關鍵功能

- 瀏覽器自動化
- 控制台日誌監控
- 截圖功能
- JavaScript 執行
- 基本的網頁互動（導航、點擊、表單填充）

## 使用 Puppeteer 服务器的配置

## 關鍵功能

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

## 使用 Puppeteer 伺服器的配置

以下是使用 Puppeteer 伺服器的 Claude Desktop 配置：

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

## 許可證

該 MCP 伺服器根據 MIT 許可證授權。這意味著您可以自由使用、修改和分發軟件，但需遵守 MIT 許可證的條款和條件。更多詳情，請參閱項目倉庫中的 LICENSE 文件。
