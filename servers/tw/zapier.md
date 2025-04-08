---
name: Zapier MCP
digest: 為大型語言模型提供瀏覽器自動化能力的 Zapier 伺服器
author: zapier
homepage: https://zapier.com/mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - zapier
  - 自動化
icon: /images/zapier-icon.png
createTime: 2025-04-06
---

[Zapier](https://zapier.com) 是一個基於雲端的自動化工具，允許使用者透過「Zap」（自動化工作流程）串接喜愛的應用程式。每個 Zap 包含一個觸發器（啟動工作流程的事件）與一個或多個動作（執行的任務）。它支援超過 7,000 個應用程式與 30,000 多種 actions，適合整合各類服務，簡化業務流程。

![Zapier](/images/zapier-mcp.jpg)

## 什麼是 Zapier MCP？

[Zapier MCP](https://zapier.com/mcp) 是 Zapier 對模型上下文協議（Claude MCP）的實作。Zapier MCP 透過在複雜的 AI 系統（如 Claude）與 Zapier 的 7,000 多個應用程式和 30,000 多種 actions 整合的龐大生態系統之間建立無縫橋樑，擴展了這項技術。這種強大組合為自動化工作流程、上下文決策和強化的 AI 驅動應用程式解鎖了前所未有的能力，而無需大量開發資源或專業編碼知識。

Zapier MCP 讓 AI 助手能夠：

- 存取與操作資料：從資料庫、CRM、專案管理工具等讀取與寫入。
- 執行自動化：觸發預先定義的 Zap 或根據配置建立新 Zap。
- 與外部服務互動：透過 Zapier 支援的服務進行 API 呼叫，例如傳送訊息、建立檔案或更新記錄。
- 安全管理憑證：確保所有互動透過適當的認證與授權機制安全進行。
- 自訂動作：定義 AI 允許執行的操作，以控制資料使用。

本質上，Zapier MCP 作為一個專門的**中介層**，促進了 AI 系統與 Zapier 整合生態系統中數千個應用程式之間的結構化通訊。該協議透過遵循 OpenAPI 規範的 RESTful API 端點運作，使 AI 模型能夠：

- 透過模式定義發現可用工具
- 在執行前解析與驗證輸入參數
- 在連接的應用程式中執行操作
- 回傳結構化回應給 AI 模型

這種雙向通訊即時發生，讓 AI 助手能根據使用者請求、環境觸發或排程事件執行複雜任務。

Zapier MCP 的整體資料流回應流程如下所示：

```
┌─────────────┐     ┌───────────────┐     ┌─────────────────┐     ┌───────────────┐
│    AI 助手    │────▶│   MCP 端點     │────▶│   Zapier 平台   │────▶│      外部應用 │
└─────────────┘     └───────────────┘     └─────────────────┘     └───────────────┘
       ▲                                           │                      │
       └───────────────────────────────────────────┴──────────────────────┘
                            回應資料流
```

關鍵特性（擴展）：

- 進階 AI 整合 – 透過標準化協議實現與領先的 AI 平台相容，包括 OpenAI GPT-4/3.5、Claude、Anthropic、Cursor 和自訂 MCP 客戶端。
- 多層身份驗證 – 實施 OAuth 2.0 和 API 金鑰驗證方法，具有請求驗證、速率限制和稽核日誌，以確保企業級安全性。
- 全面應用支援 – 提供對 5,000 多個應用程式的存取，包括生產力套件 (Google Workspace、Microsoft 365)、CRM 平台 (Salesforce、HubSpot)、專案管理工具 (Asana、Trello、Jira) 和通訊系統 (Slack、Teams、Discord)。
- 開發者友善的實作 – 提供完整文件、熱門程式語言的 SDK 和除錯工具，以簡化整合。
- 版本化 API 支援 – 確保向後相容性和優雅的棄用路徑，以實現長期可靠性。

## 如何使用 Zapier MCP？

要使用 Zapier MCP，只需要四個步驟：

1. 產生你的 MCP 端點：取得你獨特、動態的 MCP 端點。這個端點將你的 AI 助手連接到 Zapier 的整合網路。
2. 設定你的 Actions：輕鬆選擇和設定 AI 可以執行的特定操作，例如傳送 Slack 訊息或管理 Google Calendar 事件，確保精確控制。
3. 連接你的 AI 助手：使用你產生的 MCP 端點無縫連接你的 AI 助手，並立即執行任務。
4. 測試與監控：測試你的 AI 助手，確保它按預期運作，並使用 Zapier 的監控工具追蹤其效能。

### 第一步：產生你的 Zapier MCP 端點

要產生你的 Zapier MCP 端點，請按照以下步驟操作：

1. 登入你的 Zapier 帳戶。
2. 導航至設定頁面：[https://actions.zapier.com/settings/mcp/](https://actions.zapier.com/settings/mcp/)

   ![Zapier MCP Settings](/images/zapier-mcp-settings.jpg)

   點擊 `Generate URL` 按鈕即可產生你的 Zapier MCP 端點。會產生一個類似 `https://actions.zapier.com/mcp/sk-ak-xxxxx/sse` 的 URL，這就是你的 Zapier MCP 端點。

### 第二步：設定你的 Actions

在上面產生的 Zapier MCP 端點頁面，URL 位址下方有一個 `Edit MCP Actions` 按鈕，點擊即可進入 [Actions 設定頁面](https://actions.zapier.com/mcp/actions/)。在 Actions 設定頁面，你可以看到所有可用的 Actions，選擇你想要啟用的 Action。

![Zapier MCP Actions](/images/zapier-mcp-actions.jpg)

也可以點擊 `Add a new Action` 按鈕新增 Action

![Zapier MCP Actions](/images/zapier-add-action.jpg)

### 第三步：連接你的 AI 助手

現在我們就可以去連接你的 AI 助手了。這裡我們可以使用一個 MCP 客戶端透過上面產生的 Zapier MCP 端點連接 Zapier。

例如我們這裡仍然選擇使用 Cursor，在 Cursor 設定頁面的 MCP 標籤頁中，點擊右上角 `Add new global MCP server` 按鈕，在彈出的 `mcp.json` 檔案中新增如下所示 MCP 設定：

```json
{
  "mcpServers": {
    "Zapier": {
      "url": "https://actions.zapier.com/mcp/<sk-ak-xxxx>/sse"
    }
  }
}
```

如果想只在專案中使用，可以在專案根目錄下面建立 `.cursor/mcp.json` 檔案，並新增上述設定即可。

設定完成後，在 Cursor MCP 中就可以看到 Zapier 標籤頁，記得要開啟，然後我們就可以看到 Zapier 提供的工具清單了。

![Zapier MCP Connect](/images/zapier-cursor-settings.png)

### 第四步：測試與監控

現在我們就可以在 Cursor 中去測試我們的 Zapier MCP 了，例如我們這裡讓其將一篇文章的內容進行總結並傳送到指定的信箱。

![Zapier MCP Test](/images/zapier-test.png)

這時候我們的信箱就會收到一封來自 Zapier 的郵件，內容就是我們剛剛測試的那篇文章的總結。

![Zapier MCP Test Result](/images/zapier-result.png)

## 總結

Zapier MCP 徹底改變了 AI 系統與數位生態系統的互動方式。它透過提供安全、標準化且可擴展的介面，將 AI 模型與數千個應用程式無縫連接，極大地拓展了 AI 的應用場景。現在，各類企業都能輕鬆實現複雜的自動化流程，而無需投入大量開發資源。

無論您是在開發面向客戶的智慧助手、提升內部效率的工具，還是建構複雜的資料處理系統，Zapier MCP 都能提供強大的基礎設施支援，有效連接智慧模型與商業應用。憑藉其廣泛的應用相容性、可靠的安全機制和便捷的開發體驗，Zapier MCP 已成為現代 AI 開發不可或缺的重要工具。
