---
title: "MCP 網頁搜尋與資料擷取：賦能 AI 智能代理，實現即時網路智慧"
excerpt: 本文介紹 Model Context Protocol（MCP）這個標準化介面，讓 AI 智能代理能夠存取即時網路資料。內容涵蓋 MCP 架構、主要特色、如何串接 Bright Data MCP 伺服器，以及在 Claude Desktop 和 Cursor IDE 上的實際設定教學。
date: 2025-09-01
slug: mcp-for-web-search-and-data-extraction
coverImage: https://picdn.youdianzhishi.com/images/1752739758301.png
featured: true
author:
  name: 陽明
  avatar: https://static.claudemcp.com/images/avatars/yangming.png
category: 技術
---

本文將介紹 Model Context Protocol（MCP）這個標準化介面，讓 AI 智能代理能夠存取即時網路資料。你會看到 MCP 的架構、主要功能、如何串接 Bright Data MCP 伺服器，以及在 Claude Desktop 和 Cursor IDE 上的實際設定步驟。MCP + Bright Data 支援多引擎搜尋、JavaScript 渲染、防封鎖與結構化資料擷取，讓 AI 智能代理在 RAG、商業情報、自動化等場景中發揮強大即時能力。

---

網際網路正從靜態、以人為本的「文件網」進化為動態、以機器為主的「代理網」。在這個新時代，自主 AI 智能代理會協作、溝通，並代表使用者行動。但有個問題：大型語言模型（LLM）訓練於靜態資料，缺乏即時感知能力。
要彌補這個落差，AI 智能代理必須能存取即時、可用的資料。這正是 Model Context Protocol（MCP）發揮作用的地方。

## 什麼是 MCP？

你可以把 MCP 想像成 AI 世界的「USB-C」——一個通用、標準化的協定，連接 AI 智能代理（host）與外部工具或資料來源（server）。不論是網頁爬蟲、檔案系統還是搜尋 API，MCP 都能讓代理與真實世界安全、無縫且可擴展地溝通。

## 為什麼重要？

LLM 很強大，但沒有即時資料就像「蒙著眼飛行」。MCP 讓代理能夠：

- 即時搜尋網頁
- 從動態網站擷取結構化資料
- 存取 API 與資料庫
- 安全地與外部工具互動

這讓 AI 智能代理從被動回應者，變成主動的數位工作者。

## MCP 如何運作：簡單架構

MCP 採用 host-client-server 架構：

- Host：AI 智能代理平台（如 Claude Desktop、Cursor IDE）
- Client：負責連線管理與訊息路由的中介軟體
- Server：外部工具（如 Bright Data 的網路智慧平台）

通訊採用 JSON-RPC 2.0 標準，支援 HTTP 或 Streamable HTTP 的高效雙向訊息傳遞。

## 核心設計原則

- 安全性：Server 無法存取完整對話內容，也無法互相監控。所有上下文流動都由 host 控制。
- 模組化：每個 server 只提供單一明確功能。host 可像積木一樣組合多個 server。
- 能力協商：client 與 server 在初始化時宣告支援功能，確保相容性與未來擴充。

## MCP 與其他協定的差異

Google 的 A2A、IBM 的 ACP 等協定著重於代理對代理的溝通，而 MCP 則專注於代理與工具的整合。兩者結合後，能打造強大且協作的 AI 系統協定堆疊。

## Bright Data + MCP：AI 智能代理的即時網路智慧

Bright Data 的 MCP 伺服器讓 AI 智能代理能即時存取結構化、乾淨、可用於決策的網路資料。其特色如下：

1. **多引擎搜尋整合**

可即時查詢 Google、Bing、DuckDuckGo 等多個搜尋引擎。代理一次呼叫即可搜尋並擷取結果。

2. **AI 驅動的資料擷取**

不用再寫脆弱的 CSS selector。Bright Data 透過 AI 理解網頁語意，直接擷取結構化資料（如商品名稱、價格、評論），支援 JSON 或 Markdown 格式。

3. **完整 JavaScript 渲染**

現代網站高度依賴 JS。Bright Data 透過無頭瀏覽器（如 Puppeteer、Playwright）渲染頁面、執行腳本、模擬使用者行為。

4. **精準地理定位**

利用 Bright Data 全球代理網路，精確存取特定地區內容，細緻到城市或郵遞區號等級。

5. **進階防封鎖技術**

可繞過 CAPTCHA、指紋辨識、行為分析，包含：

- IP 輪換（住宅、行動、資料中心）
- 指紋偽裝
- 擬人化自動操作
- 自動解 CAPTCHA

6. **企業級基礎建設**

- 全球分散式架構，低延遲高吞吐
- 可擴展至每日數百萬頁面
- 完整資料品質流程（驗證、清洗、格式化、監控）
- 通過 SOC 2 & ISO 27001 安全認證

## 實際應用場景

- 市場情報：即時追蹤競爭對手價格、庫存、產品上架
- 潛在客戶開發：從 LinkedIn 等平台擷取公開資料，建立高品質 B2B 名單
- 電商分析：監控各大零售商的數位貨架（價格、評論、庫存）
- RAG 系統：為 LLM 提供最新、相關內容，強化檢索增強生成

## 業界級效能

- 複雜網站成功率超過 99%
- 比傳統爬蟲快 10 倍
- 以 JSON Schema 擷取，準確率達 98.7%
- 比自建方案節省 58% 成本

## 實作教學：MCP 伺服器串接 AI 智能代理

以下提供具體步驟與程式碼範例，教你如何將 MCP 網路智慧平台串接到主流 AI 智能代理開發環境（如 Claude Desktop、Cursor IDE）。

### 串接 Claude Desktop

Anthropic 的 Claude Desktop 支援透過 MCP 與外部工具互動，實現即時網路存取。以下是串接 Bright Data MCP 伺服器的標準流程：

1. **準備 Bright Data 帳號與金鑰**：

   - 前往 [https://get.brightdata.com/o-mcpserver](https://get.brightdata.com/o-mcpserver) 註冊並登入帳號。
   - 進入頁面後，點選 **Start free trial**。

     ![Start free trial](https://picdn.youdianzhishi.com/images/1755930984954.png)

   - 在用戶後台的「API & Integrations」區塊取得 API Token。
   - （選填）在「Proxies & Scraping Infrastructure」後台可建立自訂的「Web Unlocker」與「Browser API」zone，並記下名稱。進階解鎖或完整瀏覽器模擬時會用到。

2. **找到並編輯 Claude 設定檔**：

   - 開啟 Claude Desktop 應用程式。
   - 找到並打開設定檔 `claude-desktop-config.json`，不同作業系統路徑如下：
     - **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
     - **Windows**：`%APPDATA%\\Claude\\claude_desktop_config.json`
     - **Linux**：`~/.config/Claude/claude_desktop_config.json`

3. **新增 MCP 伺服器設定**：

   - 在設定檔中加入以下 JSON 區塊，並將金鑰等資訊換成你自己的。

   ```json
   {
     "mcpServers": {
       "Bright Data": {
         "command": "npx",
         "args": ["@brightdata/mcp"],
         "env": {
           "API_TOKEN": "<請填入你的 API Token>",
           "WEB_UNLOCKER_ZONE": "<選填，若要自訂 mcp_unlocker zone 名稱>",
           "BROWSER_ZONE": "<選填，瀏覽器 zone 名稱>"
         }
       }
     }
   }
   ```

4. **重啟並驗證**：
   - 儲存設定檔後，請完全關閉並重新啟動 Claude Desktop。
   - 重新開啟後，在 Claude 聊天介面應會看到 Bright Data 工具已啟用。你可以直接用自然語言下指令，例如：「幫我查 Google 最近上映的電影」、「特斯拉目前市值是多少？」等。

### 串接 Cursor IDE

Cursor 是 AI 為核心的程式編輯器，原生支援 MCP 伺服器，能輕鬆整合外部工具，提升寫程式與研究效率。以下是設定 Bright Data MCP 伺服器的步驟：

1. **取得 Bright Data API Token**：請先從 Bright Data 帳號取得 API Token。
2. **開啟 Cursor 設定**：在 Cursor 編輯器中進入「Settings」。
3. **進入 MCP 伺服器設定**：在設定頁面找到「MCP」分頁，點右上角「+ Add new global MCP server」。
4. **新增 MCP 伺服器**：此時會自動打開 `~/.cursor/mcp.json` 檔案，請在此加入伺服器設定。
5. **輸入設定程式碼**：在 `mcp.json` 中貼上以下 JSON，並將 `<請填入你的 API Token>` 換成你的金鑰。

   ```json
   {
     "mcpServers": {
       "Bright Data": {
         "command": "npx",
         "args": ["@brightdata/mcp"],
         "env": {
           "API_TOKEN": "<請填入你的 API Token>",
           "WEB_UNLOCKER_ZONE": "<選填，若要自訂 mcp_unlocker zone 名稱>"
         }
       }
     }
   }
   ```

6. **儲存並啟用**：儲存檔案後，Cursor 會自動偵測並啟動 Bright Data MCP 伺服器。之後你在 Cursor 與 AI 對話時，就能直接呼叫 Bright Data 工具協助你的工作。

## 結語：AI 智能代理的未來，從現在開始

MCP 是 AI 智能代理與即時網路之間的最後一塊拼圖。結合 Bright Data 企業級網路智慧平台，將開啟新一代自主、數據驅動的應用時代。

AI 智能代理現在可以：

- 監控全球趨勢
- 分析競爭對手
- 彙整研究資料
- 即時採取行動

這不只是資料存取，更是打造智慧、自主數位工作者的基礎。

準備好讓你的 AI 智能代理升級即時網路智慧了嗎？

[立即免費試用 & 查看更多文件](https://get.brightdata.com/y-mcpserver)。

讓我們一起打造智慧代理的未來吧！
