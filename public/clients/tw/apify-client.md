---
name: Apify Tester MCP 客戶端
digest: 此客戶端能將AI代理連接至Apify生態系統中5,000+個網頁爬取與自動化Actor，實現從網站、社交媒體、搜尋引擎及地圖提取資料。
author: Apify
homepage: https://apify.com/jiri.spilka/tester-mcp-client
docs: https://mcp.apify.com
icon: http://apify.com/ext/apify-symbol-512px.svg
windows: true
mac: true
linux: true
featured: true
tags:
  - 網頁爬取
  - Apify Actors
  - 整合
createTime: 2025-05-13
---

## 🚀 主要功能

- 🔌 透過伺服器推送事件(SSE)連接 MCP 伺服器
- 💬 提供對話式介面顯示工具呼叫與結果
- 🇦 連接至[Apify MCP 伺服器](https://apify.com/apify/actors-mcp-server)與多個 Apify Actor 互動
- 💥 根據情境與使用者查詢動態使用工具(需伺服器支援)
- 🔓 使用授權標頭與 API 金鑰確保連線安全
- 🪟 開源專案，可檢視、建議改進或自行修改

## 🎯 Tester MCP 客戶端能做什麼？

連接至[Actors-MCP-Server](https://apify.com/apify/actors-mcp-server)後，可透過互動對話介面：

- 「哪些 Actor 最適合爬取社交媒體？」
- 「示範 Instagram 爬蟲的最佳用法」
- 「該用哪個 Actor 提取 LinkedIn 資料？」
- 「如何爬取 Google 搜尋結果？」

![客戶端截圖](https://raw.githubusercontent.com/apify/tester-mcp-client/refs/heads/main/docs/chat-ui.png)

## 📖 運作原理

透過 SSE 連接 MCP 伺服器後：

- 建立 SSE 連線至 MCP 伺服器`/sse`端點
- 透過`POST /message`傳送使用者查詢
- 接收即時串流回應(經`GET /sse`)，內容可能包含 LLM 輸出與**工具使用**區塊
- 根據 LLM 回應協調工具呼叫並顯示對話歷程

## ⚙️ 使用方式

- 測試任何支援 SSE 的 MCP 伺服器
- 測試[Apify Actors MCP 伺服器](https://apify.com/apify/actors-mcp-server)動態選用 3,000+工具的能力

### 標準模式(於 Apify 平台)

在 Apify 執行此客戶端並連接至支援 SSE 的 MCP 伺服器。  
可透過 Apify UI 或 API 設定參數，如 MCP 伺服器 URL、系統提示與 API 金鑰。

執行後於日誌中查看客戶端 UI 連結(每次執行連結不同)：

```shell
INFO  請瀏覽 https://......runs.apify.net 與MCP伺服器互動
```

### 待機模式(於 Apify)

開發中 🚧

## 💰 計價

本客戶端免費使用，僅需支付 LLM 供應商費用與 Apify 平台資源消耗。

採用[按事件計費](https://docs.apify.com/sdk/js/docs/guides/pay-per-event)模式：

- Actor 啟動(依記憶體使用量，每 128MB 為單位計費)
- 執行時間(每 5 分鐘計費，每 128MB 為單位)
- 查詢回應(依使用模型計費，若自備 LLM API 金鑰則免)

使用自備 LLM 金鑰時，128MB 記憶體執行 1 小時約 0.06 美元。  
Apify 免費方案(無需信用卡 💳)每月可執行 80 小時，充分測試 MCP 伺服器！

## 📖 技術架構

```plaintext
瀏覽器 ← (SSE) → Tester MCP客戶端 ← (SSE) → MCP伺服器
```

此架構將自訂橋接邏輯保留在客戶端，保持 MCP 伺服器核心不變。  
瀏覽器透過 SSE 與客戶端通訊，客戶端再以 SSE 連接伺服器，利於維護與除錯。

1. 訪問`https://tester-mcp-client.apify.actor?token=您的API金鑰`(本地執行則為 http://localhost:3000)
2. 從`public/`目錄載入`index.html`與`client.js`
3. 瀏覽器透過`GET /sse`開啟 SSE 串流
4. 使用者查詢經`POST /message`傳送
5. 查詢處理流程：
   - 呼叫大型語言模型
   - 必要時呼叫工具
6. 每段結果透過`sseEmit(role, content)`傳送

### 本地開發

原始碼存放於[GitHub](https://github.com/apify/rag-web-browser)，可自由修改：

```bash
git clone https://github.com/apify/tester-mcp-client.git
cd tester-mcp-client
npm install
```

參照`.env.example`建立`.env`檔案：

```plaintext
APIFY_TOKEN=您的APIFY_TOKEN
LLM_PROVIDER_API_KEY=您的API金鑰
```

於`const.ts`調整預設設定值如`mcpUrl`、`systemPrompt`等。

啟動客戶端：

```bash
npm start
```

訪問[http://localhost:3000](http://localhost:3000)開始互動。

**盡情與 Apify Actors 對話吧！**

## ⓘ 限制與回饋

目前不支援完整 MCP 功能(如 Prompts 與 Resource)，且刷新頁面將清除對話紀錄。

## 參考資源

- [模型情境協定](https://modelcontextprotocol.org/)
- [Apify Actors MCP 伺服器](https://apify.com/apify/actors-mcp-server)
- [按事件計費模式](https://docs.apify.com/sdk/js/docs/guides/pay-per-event)
- [什麼是 AI 代理？](https://blog.apify.com/what-are-ai-agents/)
- [MCP 的重要性](https://blog.apify.com/what-is-model-context-protocol/)
