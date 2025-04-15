---
name: 反向連結 MCP
digest: 透過使用 Ahrefs 資料擷取任何網域反向連結資訊的 MCP 伺服器
author: cnych
repository: https://github.com/cnych/backlinks-mcp
homepage: https://www.claudemcp.com/servers/backlinks-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - Ahrefs
  - 反向連結
icon: https://avatars.githubusercontent.com/u/3094973?s=48&v=4
createTime: 2025-04-12
---

這個 MCP 伺服器使用 Ahrefs 的資料擷取任何網域的反向連結資訊。

> 注意 ⚠️：這個 MCP 已經合併到了 [SEO MCP](/tw/servers/seo-mcp) 中，請使用 [SEO MCP](/tw/servers/seo-mcp) 替代，會有更多功能。

## 功能

- 🔍 擷取任何網域的反向連結資訊
- 🔒 自動解決 Cloudflare Turnstile 驗證碼
- 💾 簽章快取以提升效能並降低 API 成本
- 🚀 快速且高效的資料擷取
- 🧹 簡化輸出，僅保留最相關的反向連結資訊

## 安裝

> 此 MCP 伺服器僅供學習用途，請勿濫用，否則後果自負。本專案靈感來自 `@哥飛社群`。

## 功能

- 🔍 擷取任何網域的反向連結資訊
- 🔒 自動解決 Cloudflare Turnstile 驗證碼
- 💾 簽章快取以提升效能並降低 API 成本
- 🚀 快速且高效的資料擷取
- 🧹 簡化輸出，僅保留最相關的反向連結資訊

## 安裝

### 必要條件

- Python 3.8 或更新版本
- CapSolver 帳號及 API 金鑰（註冊 [此處](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0)）
- `uv` 安裝（macOS 上可能需要使用 `brew install uv` 安裝）

### 手動安裝

1. 複製儲存庫:

   ```bash
   git clone https://github.com/cnych/backlinks-mcp.git
   cd backlinks-mcp
   ```

2. 使用 uv 安裝 FastMCP:

   ```bash
   uv pip install fastmcp
   ```

3. 設定 CapSolver API 金鑰:
   ```bash
   export CAPSOLVER_API_KEY="your-capsolver-api-key"
   ```

## 使用

### 執行服務

您可以使用 FastMCP 以多種方式執行服務:

#### 在 Claude Desktop 中安裝

於 Claude Desktop 中安裝此伺服器並立即互動:

```bash
fastmcp install src/backlinks_mcp/server.py
```

#### 使用 MCP 檢查器測試

用於開發與測試:

```bash
fastmcp dev src/backlinks_mcp/server.py
```

#### 在 Cursor IDE 中安裝

於 Cursor 設定中，切換至 MCP 標籤，點擊 `+新增全域 MCP 伺服器` 按鈕，然後輸入以下內容:

```json
{
  "mcpServers": {
    "反向連結 MCP": {
      "command": "uvx",
      "args": ["backlinks-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

您也可在專案根目錄建立 `.cursor/mcp.json` 檔案，並輸入上述內容，如此即成為專案專屬的 MCP 伺服器。

> `CAPSOLVER_API_KEY` 環境變數可從 [此處](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0) 取得。

接下來，我們可在 Cursor 中使用此 MCP:

![在 Cursor 使用反向連結 MCP](/images/backlinks-mcp-on-cursor.png)

### API 參考

此服務提供以下 MCP 工具:

#### `get_backlinks_list(domain: str)`

擷取指定網域的反向連結清單。

**參數:**

- `domain` (字串): 欲查詢的網域 (例如 "example.com")

**回傳:**

反向連結物件清單，每個物件包含:

- `anchor`: 反向連結的錨點文字
- `domainRating`: 網域評分 (0-100)
- `title`: 連結頁面的標題
- `urlFrom`: 包含反向連結的頁面 URL
- `urlTo`: 被連結的 URL
- `edu`: 是否來自教育網站
- `gov`: 是否來自政府網站

**範例回應:**

```json
[
  {
    "anchor": "範例連結",
    "domainRating": 76,
    "title": "實用資源",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

## 開發

用於開發目的，您可複製儲存庫並安裝開發依賴:

```bash
git clone https://github.com/cnych/backlinks-mcp.git
cd backlinks-mcp
uv sync
```

## 運作原理

1. 服務首先嘗試擷取網域的快取簽章
2. 若無有效快取，則:
   - 使用 CapSolver 解決 Cloudflare Turnstile 驗證碼
   - 從 Ahrefs 取得簽章與有效期限
   - 快取此資訊供後續使用
3. 使用簽章擷取反向連結資料
4. 處理並回傳簡化後的反向連結資訊

## 疑難排解

- **CapSolver API 金鑰錯誤**: 確認 `CAPSOLVER_API_KEY` 環境變數設定正確
- **速率限制**: 若遇到速率限制，請嘗試減少服務使用頻率
- **無結果**: 某些網域可能無反向連結或未被 Ahrefs 索引
- **問題**: 若遇到反向連結 MCP 問題，請查閱 [反向連結 MCP GitHub 儲存庫](https://github.com/cnych/backlinks-mcp) 取得疑難排解指南

## 授權

本專案採用 MIT 授權條款 - 詳情請參閱 LICENSE 檔案。
