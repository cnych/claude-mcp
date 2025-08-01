---
name: Figma Context MCP
digest: 建立 Figma 與 MCP 客戶端之間的橋樑，透過 AI 代理快速實現設計，無縫轉換設計稿為程式碼。
author: glips
repository: https://github.com/glips/figma-context-mcp
homepage: https://www.framelink.ai
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - figma
  - 設計
icon: /icons/figma-context-mcp-icon.png
createTime: 2025-04-11
featured: true
---

[Figma Context MCP](/servers/figma-context-mcp) 是一個強大的 [MCP Server](/servers)，能幫助開發者直接從 Figma 設計稿提取資訊，並透過 AI 代理快速實現設計。例如在 Cursor 中可透過提示詞讓 AI Agent 存取您的 Figma 設計資料，並產生程式碼。比起直接貼上螢幕截圖，最終呈現效果要好得多。

![Figma Context MCP](https://static.claudemcp.com/images/figma-context-mcp.png)

## 取得 Figma 存取權杖

開始使用 Figma Context MCP 伺服器前，您需要產生 Figma 存取權杖。以下是取得權杖的詳細步驟：

1. 登入 Figma，點擊左上角個人資料圖示，從下拉選單選擇「設定」(Settings)。
2. 在設定選單中，選擇「安全性」(Security) 分頁。
3. 向下捲動至「個人存取權杖」(Personal access tokens) 區塊，點擊「產生新權杖」(Generate new token)。
4. 為權杖輸入名稱（如「Figma MCP」），並確保您擁有 File content 和 Dev resources 的讀取權限。

   ![產生 Figma 存取權杖](https://static.claudemcp.com/images/figma-context-mcp-generate-token.png)

5. 點擊「產生權杖」(Generate token) 按鈕。

> **重要提示**：請立即複製並安全儲存產生的權杖。關閉此頁面後，您將無法再次查看完整權杖。

如需更詳細指引，可查閱 [Figma 關於存取權杖的官方文件](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)。

## 設定 Figma Context MCP 伺服器

多數 MCP 客戶端都支援透過 JSON 設定 MCP 伺服器，更新 MCP 客戶端中的設定檔後，MCP 伺服器會自動下載並啟用。

根據您的作業系統，選擇合適的設定方式：

**MacOS / Linux:**

```json
{
  "mcpServers": {
    "Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

**Windows:**

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

> **重要提示**：將設定中的 YOUR-KEY 替換為您第一步產生的 Figma 存取權杖。

各種 [MCP 客戶端](/clients) 的具體設定步驟可能略有不同。這裡我們重點介紹 Cursor 的設定方法：

1. 開啟 Cursor 設定 (CMD+, 或 Ctrl+,)
2. 導覽至 MCP 設定區塊
3. 點擊右上角 + Add new global MCP server 按鈕
4. 貼上提供的設定 JSON

此外也可在專案根目錄建立 .cursor/mcp.json 檔案，新增上述設定，這樣該 MCP Server 就只會對當前專案生效。

![Cursor MCP 設定](https://static.claudemcp.com/images/figma-context-mcp-cursor-settings.png)

至此我們已完成該 MCP server 的設定。

## 實現您的第一個設計

設定好 MCP 客戶端後，接下來我們可以開始實現您的第一個設計。

### 複製 Figma 框架或群組的連結

MCP 伺服器會將從 Figma API 接收的資料壓縮近 90%，但複雜設計仍可能讓 AI 代理因資訊過多而出現問題（超出 Token 限制）。

**雖然您可以嘗試讓編輯器為您實現整個設計，但為獲得最一致的結果，建議一次處理一個部分。**

具體操作方法：**右鍵點擊您想實現的框架或群組，選擇「複製/貼上為」(Copy/Paste as)，然後選擇「複製選取內容的連結」(Copy link to selection)。**

![複製 Figma 框架或群組的連結](https://static.claudemcp.com/images/figma-context-mcp-copy-figma-link.png)

### 將連結貼到編輯器中

取得 Figma 框架或群組的連結後，我們就可以向編輯器的 AI 代理發出請求。

例如在 Cursor 輸入 Implement this Figma frame for me. https://www.figma.com/design/....，注意將 Figma 連結直接貼到 Cursor 輸入框時，它會自動識別為連結，導致 Cursor 直接獲取該連結頁面內容，這並非我們期望的。我們希望透過 MCP 伺服器獲取 Figma 設計稿資料，因此需要點擊 URL 連結，然後點擊 Unlink 按鈕，讓 Cursor 將連結識別為普通文字。

![將連結貼到編輯器中](https://static.claudemcp.com/images/figma-context-mcp-paste-link.png)

按 Enter 後 Cursor 會透過語意分析呼叫 MCP 伺服器的 get_figma_data 工具獲取設計稿資料，若有圖片則呼叫 download_figma_images 工具下載圖片，最後根據這些資料透過 Agent 產生對應程式碼。

![呼叫 Figma MCP 工具](https://static.claudemcp.com/images/figma-context-mcp-call-tool.png)

最終產生的頁面效果如下：

![最終產生的頁面效果](https://static.claudemcp.com/images/figma-context-mcp-final-result.png)

與設計圖已非常相似，當然還有一些細節需要自行調整。

我們也可透過提示詞告訴 AI 代理想使用的技術堆疊、命名慣例或特定要求等，提供更多上下文通常有助獲得最佳結果。

```bash
請基於這個 Figma 設計實現響應式頁面：

https://www.figma.com/file/xxxxx

技術堆疊要求：
- HTML/CSS
- 使用 Tailwind CSS 框架
- 確保在行動裝置上正常顯示
```

至此我們已完成第一個設計，是不是非常簡單呢？

## 最佳實踐

為充分發揮 Figma Context MCP 的效用，以下是一些值得參考的最佳實踐方式：

**在 Figma 中**

通常您需要將 Figma 檔案結構化，以便理解和實現。

- 使用自動佈局 — MCP 目前還無法很好處理浮動或絕對定位元素
- 為 Frame 和 Group 命名
- 提示：嘗試使用 Figma 的 AI 自動產生名稱

**在編輯器中**

使用 LLM 的關鍵是提供正確上下文，例如：

- 告訴代理您有哪些可用資源（如 Tailwind、React）
- 參考程式碼庫中的關鍵檔案以提供額外上下文
- 除 Figma 原始資料外，還提供設計細節
- 管理上下文大小 — 提供 Frame 和 Group 的連結，而非整個檔案（會超出 Token 限制）
- 始終審查 AI 產生的程式碼，確保符合您的標準和期望。

## SSE 設定方式

除了前面介紹的設定方式外，Figma MCP 還支援透過 SSE 方式向客戶端串流回應。

**啟動 MCP 伺服器**

我們可使用 npx 指令啟動 MCP 伺服器。

```bash
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
# Initializing Figma MCP Server in HTTP mode on port 3333...
# HTTP server listening on port 3333
# SSE endpoint available at http://localhost:3333/sse
# Message endpoint available at http://localhost:3333/messages
```

**設定 MCP 客戶端**

接下來我們需要在 MCP 客戶端中設定 MCP 伺服器，具體設定方式如下：

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "url": "http://localhost:3333/sse",
      "env": {
        "FIGMA_API_KEY": "<your-figma-api-key>"
      }
    }
  }
}
```

## 常見問題與疑難排解

若使用 Figma Context MCP 時遇到問題，以下是一些常見問題與解決方案：

### 問題：MCP 伺服器無法連接

**解決方案**：

- 確認已正確設定 Figma 存取權杖
- 檢查網路連線
- 重新啟動 IDE
- 確認 npx 指令可用（需安裝 Node.js）

### 問題：產生的程式碼不符合預期

**解決方案**：

- 嘗試提供更具體的指引
- 使用更小的設計部分
- 確保 Figma 設計有清晰的組織和命名
- 嘗試不同的提示方式

### 問題：存取權杖權限錯誤

**解決方案**：

- 確保存取權杖具有必要權限（File content 和 Dev resources 的讀取權限）
- 如有需要，產生新的存取權杖

## 總結

Figma Context MCP 是一個非常強大的 MCP Server，徹底打通 Figma 與 Cursor 之間的橋樑，讓我們能更輕鬆從 Figma 設計稿獲取資料，並透過 AI 代理快速實現設計。實現從設計到程式碼的無縫轉換。這是一個非常值得推薦的好工具。
