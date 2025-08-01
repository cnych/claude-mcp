---
name: 支付寶 MCP
digest: 支付寶 MCP Server 是支付寶開放平台提供的 MCP Server，讓你可以輕鬆將支付寶開放平台提供的交易創建、查詢、退款等能力集成到你的 LLM 應用中，並進一步創建具備支付能力的智能工具。
author: 支付寶開放平台
homepage: https://www.npmjs.com/package/@alipay/mcp-server-alipay
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 支付寶
  - 支付
icon: https://static.claudemcp.com/images/alipay.png
createTime: 2025-04-15
featured: true
---

`@alipay/mcp-server-alipay` 是支付寶開放平台提供的 MCP Server，讓你可以輕鬆將支付寶開放平台提供的交易創建、查詢、退款等能力集成到你的 LLM 應用中，並進一步創建具備支付能力的智能工具。

以下是一個虛構的簡化使用場景，用於方便理解工具能力：

> 一位插畫師希望通過提供定製的原創插畫服務謀取收入。傳統方式下，他/她需要和每位客戶反復溝通需求、確定價格，並發送支付鏈接，然後再人工確認支付情況，這個過程繁瑣且費時。
>
> 現在，插畫師利用支付寶 MCP Server 與智能 Agent 工具，通過 Agent 搭建平台，開發了一個智能聊天應用（網頁或小程序）。客戶只需在應用中描述自己的繪畫需求（如風格偏好、插畫用途、交付時間等），AI 就會自動分析需求，快速生成準確且合理的定製報價，並通過工具即時創建出專用的支付寶支付鏈接。
>
> 客戶點擊並支付後，創作者立即收到通知，進入創作環節。無需人工往返對話確認交易狀態或支付情況，整個流程不僅便捷順暢，還能顯著提高交易效率和客戶滿意度，讓插畫師更專注於自己的創作本身，實現更輕鬆的個性化服務商業模式。

```bash
最終用戶設備                     Agent 運行環境
+---------------------+        +--------------------------+      +-------------------+
|                     |  交流  |   支付寶 MCP Server +    |      |                   |
|    小程序/WebApp    |<------>|   其他 MCP Server +      |<---->|     支付服務      |
|                     |  支付  |   Agent 開發工具         |      |   交易/退款/查詢  |
+---------------------+        +--------------------------+      +-------------------+
     創作服務買家                     智能工具開發者                   支付寶開放平台
      (最終用戶)                         (創作者)
```

關於本工具的更多介紹和使用指南，包括準備收款商戶身份等前置流程，請參考支付寶開放平台上的 [支付 MCP 服務文件](https://opendocs.alipay.com/open/0go80l) 。

## 使用和配置

要使用工具的大部分支付能力，你需要先成為支付寶開放平台的收款商戶，獲取商戶私鑰。 之後，你可以直接在主流的 MCP Client 上使用支付寶 MCP Server：

### 在 Cursor 中使用

在 Cursor 項目中的 `.cursor/mcp.json` 加入如下配置：

```json
{
  "mcpServers": {
    "mcp-server-alipay": {
      "command": "npx",
      "args": ["-y", "@alipay/mcp-server-alipay"],
      "env": {
        "AP_APP_ID": "2014...222",
        "AP_APP_KEY": "MIIE...DZdM=",
        "AP_PUB_KEY": "MIIB...DAQAB",
        "AP_RETURN_URL": "https://success-page",
        "AP_NOTIFY_URL": "https://your-own-server",
        "...其他参数": "...其他值"
      }
    },
    "其他工具": {
      "...": "..."
    }
  }
}
```

### 在 Cline 中使用

在你的 Cline 設置中找到 `cline_mcp_settings.json` 配置文件，並加入如下配置：

```json
{
  "mcpServers": {
    "mcp-server-alipay": {
      "command": "npx",
      "args": ["-y", "@alipay/mcp-server-alipay"],
      "env": {
        "AP_APP_ID": "2014...222",
        "AP_APP_KEY": "MIIE...DZdM=",
        "AP_PUB_KEY": "MIIB...DAQAB",
        "AP_RETURN_URL": "https://success-page",
        "AP_NOTIFY_URL": "https://your-own-server",
        "...其他参数": "...其他值"
      },
      "disable": false,
      "autoApprove": []
    },
    "其他工具": {
      "...": "..."
    }
  }
}
```

### 在其他 MCP Client 中使用

你也可以在任何其它 MCP Client 中使用，合理配置 Server 進程啟動方式 `npx -y @alipay/mcp-server-alipay`，並按下文介紹設置環境參數即可。

### 所有參數

支付寶 MCP Server 通過環境變量接收參數。參數和默認值包括:

```shell
# 支付宝开放平台配置

AP_APP_ID=2014...222                    # 商戶在開放平台申請的應用 ID（APPID）。必需。
AP_APP_KEY=MIIE...DZdM=                 # 商戶在開放平台申請的應用私鑰。必需。
AP_PUB_KEY=MIIB...DAQAB                 # 用於驗證支付寶服務端數據簽名的支付寶公鑰，在開放平台獲取。必需。
AP_RETURN_URL=https://success-page      # 網頁支付完成後對付款用戶展示的「同步結果返回地址」。
AP_NOTIFY_URL=https://your-own-server   # 支付完成後，用於告知開發者支付結果的「異步結果通知地址」。
AP_ENCRYPTION_ALGO=RSA2                 # 商戶在開放平台配置的參數簽名方式。可選值為 "RSA2" 或 "RSA"。缺省值為 "RSA2"。
AP_CURRENT_ENV=prod                     # 連接的支付寶開放平台環境。可選值為 "prod"（線上環境）或 "sandbox"（沙箱環境）。缺省值為 "prod"。

# MCP Server 配置

AP_SELECT_TOOLS=all                      # 允許使用的工具。可選值為 "all" 或逗號分隔的工具名稱列表。工具名稱包括 `mobilePay`, `webPagePay`, `queryPay`, `refundPay`, `refundQuery`。缺省值為 "all"。
AP_LOG_ENABLED=true                      # 是否在 $HOME/mcp-server-alipay.log 中記錄日誌。默認值為 true。
```

## 使用 MCP Inspector 調試

你可以使用 MCP Inspector 來調試和了解支付寶 MCP Server 的功能：

1. 通過 `export` 設置各環境變量；
2. 執行 `npx -y @modelcontextprotocol/inspector npx -y @alipay/mcp-server-alipay` 啟動 MCP Inspector；
3. 在 MCP Inspector WebUI 中調試即可。

## 支持的能力

以下表格列出了所有可用的支付工具能力：

| 名稱                                               | `AP_SELECT_TOOLS` 中的工具名稱   | 描述                                                                                                                                                 | 參數                                        | 輸出                           |
| -------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------ |
| `create-mobile-alipay-payment`                     | `mobilePay`                      | 創建一筆支付寶訂單，返回帶有支付鏈接的 Markdown 文本，該鏈接在手機瀏覽器中打開後可跳轉到支付寶或直接在瀏覽器中支付。本工具適用於移動網站或移動 App。 | \- outTradeNo: 商戶訂單號，最長 64 個字符   |                                |
| \- totalAmount: 支付金額，單位：元，最小 0.01      |                                  |                                                                                                                                                      |                                             |                                |
| \- orderTitle: 訂單標題，最長 256 個字符           | \- url: 支付鏈接的 markdown 文本 |                                                                                                                                                      |                                             |                                |
| `create-web-page-alipay-payment`                   | `webPagePay`                     | 創建一筆支付寶訂單，返回帶有支付鏈接的 Markdown 文本，該鏈接在電腦瀏覽器中打開後會展示支付二維碼，用戶可掃碼支付。本工具適用於桌面網站或電腦客戶端。 | \- outTradeNo: 商戶訂單號，最長 64 個字符   |                                |
| \- totalAmount: 支付金額，單位：元，最小 0.01      |                                  |                                                                                                                                                      |                                             |                                |
| \- orderTitle: 訂單標題，最長 256 個字符           | \- url: 支付鏈接的 markdown 文本 |                                                                                                                                                      |                                             |                                |
| `query-alipay-payment`                             | `queryPay`                       | 查詢一筆支付寶訂單，並返回帶有訂單信息的文本                                                                                                         | \- outTradeNo: 商戶訂單號，最長 64 個字符   | \- tradeStatus: 訂單的交易狀態 |
| \- totalAmount: 訂單的交易金額                     |                                  |                                                                                                                                                      |                                             |                                |
| \- tradeNo: 支付寶交易號                           |                                  |                                                                                                                                                      |                                             |                                |
| `refund-alipay-payment`                            | `refundPay`                      | 對交易發起退款，並返回退款狀態和退款金額                                                                                                             | \- outTradeNo: 商戶訂單號，最長 64 個字符   |                                |
| \- refundAmount: 退款金額，單位：元，最小 0.01     |                                  |                                                                                                                                                      |                                             |                                |
| \- outRequestNo: 退款請求號，最長 64 個字符        |                                  |                                                                                                                                                      |                                             |                                |
| \- refundReason: 退款原因，最長 256 個字符（可選） | \- tradeNo: 支付寶交易號         |                                                                                                                                                      |                                             |                                |
| \- refundResult: 退款結果                          |                                  |                                                                                                                                                      |                                             |                                |
| `query-alipay-refund`                              | `refundQuery`                    | 查詢一筆支付寶退款，並返回退款狀態和退款金額                                                                                                         | \- outRequestNo: 退款請求號，最長 64 個字符 |                                |
| \- outTradeNo: 商戶訂單號，最長 64 個字符          | \- tradeNo: 支付寶交易號         |                                                                                                                                                      |                                             |                                |
| \- refundAmount: 退款金額                          |                                  |                                                                                                                                                      |                                             |                                |
| \- refundStatus: 退款狀態                          |                                  |                                                                                                                                                      |                                             |                                |

## 如何選擇合適的支付方式

在開發過程中，為了讓 LLM 能更準確地選擇合適的支付方式，建議在 Prompt 中清晰說明你的產品使用場景：

- **掃碼支付（`webPagePay`）**：適用於用戶在電腦屏幕上看到支付界面的場景。如果您的應用或網站主要運行在桌面端（PC），你可以在 Prompt 中說明："我的應用是桌面軟件/PC 網站，需要在電腦上展示支付二維碼"。
- **手機支付（`mobilePay`）**：適用於用戶在手機瀏覽器內發起支付的場景。如果您的應用是手機 H5 頁面或移動端網站，你可以在 Prompt 中說明："我的頁面是手機網頁，需要直接在手機上喚起支付寶支付"。

我們會在未來提供更多適合 AI 應用的支付方式，敬請期待。

## 注意事项

- 支付寶 MCP 服務目前處於發布早期階段，相關能力和配套設施正在持續完善中。如有問題反饋、使用體驗或建議，歡迎在 [支付寶開發者社區](https://open.alipay.com/portal/forum) 參與討論。
- 部署和使用智能體服務時，請務必妥善保管自己的商戶私鑰，防止泄露。如需要，可參考 [支付寶開放平台-如何修改密鑰](https://opendocs.alipay.com/support/01rav9) 的說明讓已有密鑰失效。
- 在開發任何使用 MCP Server 的智能體服務，並提供給用戶使用時，請了解必要的安全知識，防範 AI 應用特有的 Prompt 攻擊、MCP Server 任意命令執行等安全風險。
- 更多注意事項和最佳實踐，請參考支付寶開放平台上 [關於支付 MCP 服務](https://opendocs.alipay.com/open/0go80l) 的說明。

## 使用协议

本工具是支付寶開放平台能力的組成部分。使用期間，請遵守 [支付寶開放平台開發者服務協議](https://ds.alipay.com/fd-ifz2dlhv/index.html) 及相關商業行為法規。
