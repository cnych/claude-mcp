---
name: Bright Data
digest: 透過Bright Data API存取公開網路資料
author: Bright Data
homepage: https://brightdata.com
repository: https://github.com/brightdata/brightdata-mcp
pinned: true
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - 爬蟲
  - 資料收集
  - API
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
featured: true
---

官方 Bright Data MCP 伺服器，讓 LLM 能存取公開網路資料。此伺服器允許 MCP 客戶端如 Claude Desktop、Cursor、Windsurf、OpenAI Agents 等根據網路上的資訊做出決策。

## 🌟 概覽

歡迎使用官方 Bright Data 模型上下文協定(MCP)伺服器，讓 LLM、代理程式和應用程式能即時存取、探索和擷取網路資料。此伺服器允許 MCP 客戶端如 Claude Desktop、Cursor、Windsurf 等無縫搜尋網路、瀏覽網站、執行操作和擷取資料 - 完全不會被封鎖 - 最適合網頁爬取任務。

![MCP](https://github.com/user-attachments/assets/b949cb3e-c80a-4a43-b6a5-e0d6cec619a7)

## 🎬 示範

以下影片展示 Claude Desktop 的基本使用案例:

<video src="https://github.com/user-attachments/assets/59f6ebba-801a-49ab-8278-1b2120912e33" controls></video>

<video src="https://github.com/user-attachments/assets/61ab0bee-fdfa-4d50-b0de-5fab96b4b91d" controls></video>

YouTube 教學與示範: [示範](https://github.com/brightdata-com/brightdata-mcp/blob/main/examples/README.md)

## ✨ 功能

- **即時網路存取**: 直接從網路取得最新資訊
- **突破地理限制**: 不受位置限制存取內容
- **網頁解鎖器**: 在具有機器人偵測保護的網站上瀏覽
- **瀏覽器控制**: 可選的遠端瀏覽器自動化功能
- **無縫整合**: 與所有 MCP 相容的 AI 助手配合使用

## 🚀 快速開始使用 Claude Desktop

1. 安裝`nodejs`以取得`npx`命令(node.js 模組執行器)。安裝說明可在[node.js 網站](https://nodejs.org/en/download)找到

2. 前往 Claude > 設定 > 開發者 > 編輯設定 > claude_desktop_config.json 並加入以下內容:

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<在此插入您的API權杖>",
        "WEB_UNLOCKER_ZONE": "<若想覆蓋預設mcp_unlocker區域名稱則選填>",
        "BROWSER_ZONE": "<選填瀏覽器區域名稱，預設為mcp_browser>"
      }
    }
  }
}
```

## 🔧 可用工具

[可用工具清單](https://github.com/brightdata-com/brightdata-mcp/blob/main/assets/Tools.md)

## ⚠️ 安全最佳實踐

**重要:** 請始終將爬取的網頁內容視為不可信資料。切勿直接將原始爬取內容用於 LLM 提示，以避免潛在的提示注入風險。
建議做法:

- 在處理前過濾和驗證所有網路資料
- 使用結構化資料擷取而非原始文字(web_data 工具)

## 🔧 帳戶設定

1. 確保您在[brightdata.com](https://brightdata.com)擁有帳戶(新用戶可獲得測試用免費額度，並提供隨用隨付方案)

2. 從[用戶設定頁面](https://brightdata.com/cp/setting/users)取得您的 API 金鑰

3. (選填)建立自訂網頁解鎖器區域

   - 預設情況下，我們會使用您的 API 權杖自動建立網頁解鎖器區域
   - 如需更多控制，您可以在[控制面板](https://brightdata.com/cp/zones)建立自己的網頁解鎖器區域，並透過`WEB_UNLOCKER_ZONE`環境變數指定

4. (選填)啟用瀏覽器控制工具:
   - 預設情況下，MCP 會嘗試取得`mcp_browser`區域的憑證
   - 若您沒有`mcp_browser`區域，您可以:
     - 在[控制面板](https://brightdata.com/cp/zones)建立瀏覽器 API 區域，或使用現有區域並透過`BROWSER_ZONE`環境變數指定其名稱

![瀏覽器API設定](https://github.com/user-attachments/assets/cb494aa8-d84d-4bb4-a509-8afb96872afe)

## 🔌 其他 MCP 客戶端

要將此 MCP 伺服器用於其他代理類型，您應根據特定軟體調整以下內容:

- 執行 MCP 伺服器的完整命令為`npx @brightdata/mcp`
- 執行伺服器時必須存在環境變數`API_TOKEN=<您的權杖>`
- (選填)設定`BROWSER_ZONE=<區域名稱>`以指定自訂瀏覽器 API 區域名稱(預設為`mcp_browser`)

## 🔄 重大變更

### 瀏覽器驗證更新

**重大變更:** `BROWSER_AUTH`環境變數已替換為`BROWSER_ZONE`。

- **之前:** 用戶需從瀏覽器 API 區域提供`BROWSER_AUTH="用戶:密碼"`
- **現在:** 用戶只需透過`BROWSER_ZONE="區域名稱"`指定瀏覽器區域名稱
- **預設:** 若未指定，系統會自動使用`mcp_browser`區域
- **遷移:** 在設定中將`BROWSER_AUTH`替換為`BROWSER_ZONE`，若`mcp_browser`不存在則指定您的瀏覽器 API 區域名稱

## 🔄 變更日誌

[變更日誌.md](https://github.com/brightdata-com/brightdata-mcp/blob/main/CHANGELOG.md)

## 🎮 試用 Bright Data MCP 遊樂場

想不設定任何東西就試用 Bright Data MCP 嗎？

查看[Smithery](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)上的這個遊樂場:

[![2025-05-06_10h44_20](https://github.com/user-attachments/assets/52517fa6-827d-4b28-b53d-f2020a13c3c4)](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)

此平台提供簡易方式探索 Bright Data MCP 功能，無需任何本地設定。只需登入即可開始實驗網路資料收集！

## 💡 使用範例

此 MCP 伺服器能協助處理的一些查詢範例:

- "Google 一下[您所在地區]即將上映的電影"
- "特斯拉目前的市值是多少？"
- "今天的維基百科特色文章是什麼？"
- "[您所在地點]的 7 天天氣預報如何？"
- "收入最高的 3 位科技公司 CEO，他們的職業生涯有多長？"

## ⚠️ 疑難排解

### 使用某些工具時發生逾時

某些工具可能涉及讀取網路資料，而在極端情況下，載入頁面所需的時間可能差異很大。

為確保您的代理程式能使用資料，請在代理設定中設定足夠高的逾時值。

`180秒`的值應能滿足 99%的請求，但某些網站載入較慢，請根據需求調整。

### spawn npx ENOENT

此錯誤發生在系統找不到`npx`命令時。解決方法:

#### 尋找 npm/Node 路徑

**macOS:**

```
which node
```

顯示路徑如`/usr/local/bin/node`

**Windows:**

```
where node
```

顯示路徑如`C:\Program Files\nodejs\node.exe`

#### 更新您的 MCP 設定:

將`npx`命令替換為 Node 的完整路徑，例如在 mac 上會如下所示:

```
"command": "/usr/local/bin/node"
```

## 📞 支援

若遇到任何問題或有疑問，請聯繫 Bright Data 支援團隊或在程式庫中提出問題。
