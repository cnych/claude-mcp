---
name: SEO MCP
digest: MCP 是一款基於 Ahrefs 數據的免費 SEO 工具，提供反向連結分析和關鍵字研究等核心功能，協助優化網站並提升搜尋排名。
author: cnych
homepage: https://github.com/cnych/seo-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - Ahrefs
  - 反鏈
  - 關鍵字
icon: https://avatars.githubusercontent.com/u/3094973?v=4
createTime: 2025-04-14
featured: true
---

一個基於 Ahrefs 數據的免費 SEO 工具 MCP（Model Control Protocol）服務。包含反向連結、關鍵字建議等功能，後續會添加更多工具。

## 概述

此服務提供 API 來獲取網站的 SEO 數據。它處理整個流程，包括驗證碼破解、身份驗證和從 Ahrefs 獲取數據。

> 此 MCP 服務僅供學習使用。請勿濫用，否則後果自負。本專案靈感來自 `@GoFei 社群`。

## 功能

- 獲取任何網域的反向連結數據
- 取得關鍵字建議和 SEO 提示
- 使用 CapSolver 自動破解驗證碼
- 簽名快取以減少 API 呼叫
- 快速高效的數據獲取
- 簡化輸出，提供最相關的 SEO 資訊

## 安裝

### 先決條件

- Python 3.10 或更高版本
- CapSolver 帳號和 API 金鑰
- 已安裝 `pip` 或 `uv`（在 macOS 上，可能需要使用 `brew install uv` 安裝）

### 從 PyPI 安裝

```bash
pip install seo-mcp
```

或使用 `uv`：

```bash
uv pip install seo-mcp
```

### 手動安裝

1. 克隆儲存庫：

   ```bash
   git clone https://github.com/cnych/seo-mcp.git
   cd seo-mcp
   ```

2. 使用 pip 或 uv 安裝依賴項：

   ```bash
   pip install -e .
   # 或
   uv pip install -e .
   ```

3. 設定 CapSolver API 金鑰：

   ```bash
   export CAPSOLVER_API_KEY="您的-capsolver-api-金鑰"
   ```

## 使用方式

### 運行服務

您可以通過以下幾種方式運行服務：

#### 在 Claude Desktop 中安裝

```bash
fastmcp install src/seo_mcp/server.py
```

#### 使用 MCP Inspector 進行測試

```bash
fastmcp dev src/seo_mcp/server.py
```

#### 在 Cursor IDE 中安裝

在 Cursor 設定中，切換到 MCP 標籤，點擊 `+ 新增全域 MCP 服務` 按鈕，然後輸入以下內容：

```json
{
  "mcpServers": {
    "SEO MCP": {
      "command": "uvx",
      "args": ["--python 3.10", "seo-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

![在 Cursor 上使用 SEO MCP 反向連結工具](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-03c59e1e.png)

![在 Cursor 上使用 SEO MCP 關鍵字工具](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-a188f668.png)

### API 參考

該服務提供以下 MCP 工具：

#### `get_backlinks_list(domain: str)`

獲取指定網域的反向連結列表。

**參數：**

- `domain` (字串)：要查詢的網域（例如 "example.com"）

**返回：**

反向連結物件列表，每個物件包含：

- `anchor`：反向連結的錨點文字
- `domainRating`：網域評分（0-100）
- `title`：連結頁面的標題
- `urlFrom`：包含反向連結的頁面 URL
- `urlTo`：被連結的頁面 URL
- `edu`：布林值，表示反向連結是否來自教育網站
- `gov`：布林值，表示反向連結是否來自政府網站

**範例回應：**

```json
[
  {
    "anchor": "範例連結",
    "domainRating": 76,
    "title": "有用的資源",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

#### `keyword_generator(keyword: str, country: str = "us", search_engine: str = "Google")`

獲取指定關鍵字的創意和 SEO 建議。

**參數：**

- `keyword` (字串)：要查詢的關鍵字
- `country` (字串)：國家代碼（例如 "us"）
- `search_engine` (字串)：搜尋引擎（例如 "Google"）

**返回：**

- 關鍵字建議列表，包含兩種類型：

  - `keyword ideas`：常規關鍵字建議，包含關鍵字、國家、難度、流量和更新時間
  - `question ideas`：基於問題的關鍵字建議，格式相同

  每個關鍵字物件包含：

  - `keyword`：關鍵字文字
  - `country`：國家代碼
  - `difficulty`：難度評級（Easy、Medium、Hard 或 Unknown）
  - `volume`：搜尋流量等級（例如 MoreThanOneHundred、MoreThanOneThousand）
  - `updatedAt`：數據更新時間

## 開發

出於開發目的，您可以克隆儲存庫並安裝開發依賴項：

```bash
git clone https://github.com/cnych/seo-mcp.git
cd seo-mcp
uv sync  # 或使用 pip install -e .
```

## 運作原理

1. 服務首先嘗試獲取網域的緩存簽名
2. 如果沒有有效的緩存，它將：
   - 使用 CapSolver 破解 Cloudflare Turnstile 驗證碼
   - 從 Ahrefs 獲取簽名和過期日期
   - 緩存此資訊以供將來使用
3. 使用簽名獲取 SEO 數據
4. 處理並返回簡化的 SEO 資訊

## 疑難排解

- **CapSolver API 金鑰錯誤**：確保 `CAPSOLVER_API_KEY` 環境變數正確設定
- **速率限制**：如果遇到速率限制，請嘗試降低使用服務的頻率
- **無結果**：某些網域可能沒有反向連結或未被 Ahrefs 索引

## 授權

本專案採用 MIT 授權 - 詳見 LICENSE 檔案。
