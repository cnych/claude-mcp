---
title: 什麼是 MCP？
excerpt: 本文將詳細解析 MCP（Model Context Protocol，模型上下文協議）的工作原理、核心功能與實際應用，幫助你全面了解這項被譽為「AI 領域 USB 介面」的革命性技術。
date: 2025-04-16
slug: what-is-mcp
coverImage: https://static.claudemcp.com/images/blog/what-is-mcp-claude.jpg
featured: true
author:
  name: 陽明
  avatar: https://static.claudemcp.com/images/avatars/yangming.png
category: 技術
---

Claude 終於能連網搜尋、存取本地檔案和資料庫了！這項突破性技術的背後是什麼？本文將詳細解析 [MCP（Model Context Protocol，模型上下文協議）](/) 的工作原理、核心功能與實際應用，幫助你全面了解這項被譽為「AI 領域 USB 介面」的革命性技術。

## MCP 的基本概念與背景

### 什麼是 MCP？

MCP（Model Context Protocol，模型上下文協議）是由 Anthropic 公司於 2024 年 11 月開源的一種通訊協議，旨在解決大型語言模型（LLM）與外部資料源及工具之間的無縫整合需求。通過標準化 AI 系統與資料源的互動方式，MCP 幫助模型獲取更豐富的上下文資訊，生成更準確、更相關的回應。

簡單來說，MCP 就像給 AI 裝上了一個「萬能介面」，讓 AI 能夠與各種外部系統和資料源實現標準化的雙向通訊。正如 USB-C 提供了連接各種設備的標準化方式，MCP 也為連接 AI 模型和不同資料源提供了統一的方法。

### MCP 的開發背景

在 MCP 出現之前，即使是最先進的 AI 模型也面臨與資料隔離的限制。每一個新的資料來源都需要專屬的客製化實現，這不僅增加了開發成本，還造成了效率低下和系統難以擴展的問題。

Anthropic 認為，隨著 AI 助理獲得主要採用，業界在模型功能上投入了大量資金，但就算是最複雜的模型也會受到與資料隔離的限制。MCP 正是為了解決這一挑戰而推出的，它允許開發人員在資料來源及 AI 工具之間建立安全的雙向連接。

## MCP 的核心架構與工作原理

### 客戶端-伺服器架構

![MCP 架構圖](https://static.claudemcp.com/images/blog/what-is-mcp.png)

MCP 採用經典的客戶端-伺服器架構：

1. **MCP 主機(Host)**：通常是發起連接的 LLM 應用程式，如 Claude Desktop 或其他 AI 工具。它負責管理 MCP Client 與 Server 的連線。

2. **MCP 客戶端(Client)**：在主機應用程式內部與伺服器保持 1:1 連接，負責協議通訊。它負責 AI 和 MCP Server 之間的溝通。

3. **MCP 伺服器(Server)**：輕量級程式，負責暴露特定的資料源或工具功能，並通過標準化協議與客戶端互動。它管理本地資料庫要輸出的內容指令，讓 Client 可以自選指令來運作。

### 通訊流程

MCP 的通訊基於 JSON-RPC 2.0，支援請求、回應和通知三種訊息類型，確保通訊的標準化和一致性。

整個流程如下：

1. 用戶通過 AI 應用發送請求
2. AI 應用（主機）通過 MCP 客戶端向 MCP 伺服器發送請求
3. MCP 伺服器處理請求，存取相應的資料源或執行工具功能
4. 伺服器將結果返回給客戶端
5. 客戶端將資訊傳遞給 AI 模型
6. AI 模型基於這些資訊生成回應

## MCP 的四大核心功能

![MCP 四大核心功能](https://static.claudemcp.com/images/blog/mcp-core-components.png)

MCP 提供了四種核心原語（伺服器端原語），用於規範客戶端和伺服器之間的互動：

### 1. 資源(Resources)

資源表示 MCP 伺服器想要向客戶端提供的任何類型資料，可包括：

- 檔案內容
- 資料庫記錄
- API 回應
- 即時系統資料
- 截圖和圖片
- 日誌檔案

每個資源由唯一的 URI 標識，並且可以包含文字或二進位資料。

### 2. 提示(Prompts)

MCP 中的提示是預定義的範本，可以：

- 接受動態參數
- 上下文
- 連結多個互動
- 指導特定工作流程
- 表面作為 UI 元素（如斜線命令）

### 3. 工具(Tools)

MCP 中的工具允許伺服器公開可由客戶端呼叫的可執行函數。工具的關鍵方面包括：

- 發現(tools/list)：客戶端可以列出可用的工具
- 呼叫(tools/call)：伺服器執行請求的操作並返回結果
- 靈活性：工具範圍從簡單的計算到複雜的 API 互動

### 4. 採樣(Sampling)

採樣是 MCP 的一項強大功能，允許伺服器通過客戶端請求 LLM 完成，從而實現複雜的代理行為，同時保持安全性和隱私性。這種人機互動設計確保用戶可以控制 LLM 所看到和生成的內容。

## MCP 如何擴展 Claude AI 的能力

### 突破模型限制

在 MCP 出現之前，Claude 等 AI 模型存在一些固有的限制：

- 無法存取最新的即時資料
- 無法直接執行計算或運行代碼
- 無法與外部系統和服務互動

MCP 通過提供標準化的介面，打破了這些限制，使 Claude AI 等模型能夠：

- 存取最新的網路資料和資訊
- 執行複雜的計算和資料分析
- 呼叫各種專業工具和服務
- 與企業內部系統無縫整合

### MCP 為 Claude 帶來的實際改變

MCP 使 Claude AI 能夠動態連接外部工具和資料源，大大擴展了其應用場景和解決問題的能力。例如，通過 MCP，Claude AI 現在可以：

- 直接查詢最新的網路資訊，提供更及時的回答
- 分析用戶上傳的文件和資料
- 執行代碼並返回結果
- 與企業內部系統整合，提供客製化的業務支援

## MCP 的實際應用場景

### 1. 網際網路搜尋整合

通過 MCP，Claude 可以連接到搜尋引擎 API，實現即時網路搜尋功能。例如，使用 Brave Search 的 API，可以讓 Claude 獲取最新的網路資訊。

配置範例：

```json
"mcpServers": {
  "brave-search": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-brave-search"
    ],
    "env": {
      "BRAVE_API_KEY": "YOUR_API_KEY"
    }
  }
}
```

這使得 Claude 能夠回答關於最新事件、即時資料或網路資訊的查詢。

### 2. 資料庫存取能力

MCP 允許 Claude 連接到本地或遠端資料庫，如 SQLite、PostgreSQL 等。

配置範例：

```json
"mcpServers": {
  "sqlite": {
    "command": "uvx",
    "args": ["mcp-server-sqlite", "--db-path", "/Users/YOUR_USERNAME/test.db"]
  }
}
```

這使 Claude 能夠執行資料查詢、分析和管理任務，將自然語言轉換為 SQL 查詢。

### 3. 檔案系統整合

通過 MCP，Claude 可以存取用戶本地檔案系統中的指定資料夾。

配置範例：

```json
"mcpServers": {
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/YOUR_USERNAME/Desktop"
    ]
  }
}
```

這讓 Claude 能夠讀取、分析檔案內容，甚至建立或修改檔案。

### 4. 網頁抓取功能

MCP 使 Claude 能夠抓取和分析網頁內容。只要給 Claude 提供網頁 URL，它就能提取網頁內容，並進行翻譯、總結等操作。

### 5. 創意應用開發

有開發者已經展示了利用 MCP 讓 Claude 建立功能齊全的繪圖應用程式。Pietro Schirano 展示的原型證明，利用 AI 製作視覺和互動工具變得非常簡單，Claude+MCP 完全可以達到 Cursor 的功能效果。

## 如何開始使用 MCP

### Claude Desktop 配置指南

1. **安裝必要軟體**：

   - 安裝 Claude 桌面應用
   - 安裝 Node.js（版本 20.16.0 或更高）
   - 安裝 Python（3.10 或更高版本）
   - 安裝 uv 和其他依賴項

2. **配置 Claude**：

   - 找到或建立 Claude 的設定檔：`/Library/Application Support/Claude/claude_desktop_config.json`
   - 添加需要的 MCP 伺服器配置
   - 重啟 Claude 桌面應用使配置生效

3. **開啟開發者模式**：
   - 打開 Claude 桌面應用
   - 點擊選單欄中的「Claude」
   - 選擇「Settings」
   - 在「Developer」選項卡中勾選「Enable Developer Mode」

### 常見 MCP 伺服器推薦

除了上述提到的伺服器外，還有許多其他 MCP 伺服器可以使用：

- [Google Drive 伺服器](/tw/servers/gdrive)：搜尋 Google Drive 雲端資料
- Slack 伺服器：整合 Slack 的 Channel 管理和訊息功能
- Memory 伺服器：知識圖形的持久記憶體系統
- Google Maps 伺服器：位置服務、路線和地點細節
- [Fetch 伺服器](/tw/servers/fetch)：網頁內容獲取和處理

### 開發自訂 MCP 伺服器

開發者可以建立自訂的 MCP 伺服器，以滿足特定需求。官方提供了 Python 和 TypeScript 的 SDK 和範例，可以參考這些資源來開發自己的 MCP 伺服器。

## MCP 的優勢與未來展望

### MCP 的核心優勢

1. **標準化**：MCP 提供了一種統一的通訊協議，減少為每個資料源單獨開發連接器的需求。

2. **靈活性**：MCP 使 AI 應用可連接到各種資料源和工具，增強功能。

3. **安全性**：MCP 確保資料傳輸加密，實施嚴格的權限控制，用戶可配置存取範圍。

4. **開放性**：作為開放協議，MCP 允許任何開發者為其產品建立 MCP 伺服器。

### 潛在影響與挑戰

MCP 有望成為 AI 領域的「HTTP 協議」，推動 LLM 應用的標準化和去中心化。隨著生態系統的成熟，AI 系統在不同工具及資料集之間移動時，都能維持上下文，以更永續的架構來取代當前零散的整合方式。

## 結語

MCP 代表了 AI 整合領域的重大突破，為 Claude 等大型語言模型賦予了與外部世界互動的能力。它不僅簡化了開發過程，還提高了安全性和可擴展性，使 AI 能夠更好地融入各種工作流程和應用場景。

隨著更多開發者和企業採用 MCP，我們可以期待看到更多創新的 AI 應用和服務出現，進一步推動 AI 技術的發展和普及。MCP 不僅是一個技術協議，更是 AI 領域向更開放、更連接未來邁進的重要一步。
