---
name: Keboola MCP Server
digest: 將您的 AI 代理、MCP 客戶端（**Cursor**、**Claude**、**Windsurf**、**VS Code**...）和其他 AI 助手連接到 Keboola。公開數據、轉換、SQL 查詢和作業觸發器——無需黏合代碼。在代理需要時，為其提供正確的數據。
author: Keboola
repository: https://github.com/keboola/keboola-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 資料處理
  - 商業智慧
  - ETL
  - 自動化
icon: https://avatars.githubusercontent.com/u/1424387?s=200&v=4
createTime: 2025-08-21
---

> 將您的 AI 代理、MCP 客戶端（**Cursor**、**Claude**、**Windsurf**、**VS Code**...）和其他 AI 助手連接到 Keboola。公開數據、轉換、SQL 查詢和作業觸發器——無需黏合代碼。在代理需要時，為其提供正確的數據。

## 概述

Keboola MCP Server 是您的 Keboola 專案與現代 AI 工具之間的開源橋樑。它將 Keboola 功能（如儲存存取、SQL 轉換和作業觸發器）轉換為 Claude、Cursor、CrewAI、LangChain、Amazon Q 等可呼叫的工具。

## 🚀 快速開始：遠端 MCP 伺服器（最簡單的方式）

使用 Keboola MCP Server 最簡單的方式是透過我們的 **遠端 MCP 伺服器**。這個託管解決方案消除了本地設定、配置或安裝的需求。

### 什麼是遠端 MCP 伺服器？

我們的遠端伺服器託管在每個多租戶 Keboola 堆疊上，並支援 OAuth 身份驗證。您可以從任何支援遠端 SSE 連接和 OAuth 身份驗證的 AI 助手連接到它。

### 如何連接

1. **取得您的遠端伺服器 URL**：導航到您的 Keboola 專案設定 → `MCP Server` 標籤
2. **複製伺服器 URL**：它看起來像 `https://mcp.<YOUR_REGION>.keboola.com/sse`
3. **配置您的 AI 助手**：將 URL 貼到您 AI 助手的 MCP 設定中
4. **驗證**：系統將提示您使用 Keboola 帳戶進行驗證並選擇您的專案

### 支援的客戶端

- **[Cursor](https://cursor.com)**：使用您專案 MCP Server 設定中的「Install In Cursor」按鈕或點擊此按鈕
- **[Claude Desktop](https://claude.ai)**：透過設定 → 整合添加整合
- **[Windsurf](https://windsurf.ai)**：使用遠端伺服器 URL 配置
- **[Make](https://make.com)**：使用遠端伺服器 URL 配置
- **其他 MCP 客戶端**：使用遠端伺服器 URL 配置

有關詳細的設定說明和特定地區的 URL，請參閱我們的[遠端伺服器設定文件](https://help.keboola.com/ai/mcp-server/#remote-server-setup)。

---

## 功能

- **儲存**：直接查詢表格並管理表格或儲存桶描述
- **元件**：建立、列出和檢查提取器、寫入器、數據應用程式和轉換配置
- **SQL**：使用自然語言建立 SQL 轉換
- **作業**：執行元件和轉換，並檢索作業執行詳細資訊
- **元數據**：使用自然語言搜尋、讀取和更新專案文件和物件元數據

## 準備事項

確保您有：

- [ ] 已安裝 Python 3.10+
- [ ] 具有管理員權限的 Keboola 專案存取權
- [ ] 您偏好的 MCP 客戶端（Claude、Cursor 等）

**注意**：確保您已安裝 `uv`。MCP 客戶端將使用它自動下載和執行 Keboola MCP Server。

**安裝 uv**：

_macOS/Linux_：

```bash
# 如果您的機器上未安裝 homebrew，請使用：
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 使用 Homebrew 安裝
brew install uv
```

_Windows_：

```powershell
# 使用安裝程式腳本
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用 pip
pip install uv

# 或使用 winget
winget install --id=astral-sh.uv -e
```

更多安裝選項，請參閱[官方 uv 文件](https://docs.astral.sh/uv/getting-started/installation/)。

在設定 MCP 伺服器之前，您需要三個關鍵資訊：

### KBC_STORAGE_TOKEN

這是您對 Keboola 的身份驗證令牌：

有關如何建立和管理 Storage API 令牌的說明，請參閱[官方 Keboola 文件](https://help.keboola.com/management/project/tokens/)。

**注意**：如果您希望 MCP 伺服器具有有限存取權限，請使用自訂儲存令牌；如果您希望 MCP 存取專案中的所有內容，請使用主令牌。

### KBC_WORKSPACE_SCHEMA

這識別您在 Keboola 中的工作區，用於 SQL 查詢。但是，**僅在您使用自訂儲存令牌而非主令牌時才需要**：

- 如果使用[主令牌](https://help.keboola.com/management/project/tokens/#master-tokens)：工作區會在後台自動建立
- 如果使用[自訂儲存令牌](https://help.keboola.com/management/project/tokens/#limited-tokens)：請遵循此 [Keboola 指南](https://help.keboola.com/tutorial/manipulate/workspace/)取得您的 KBC_WORKSPACE_SCHEMA

**注意**：手動建立工作區時，請勾選「授予對所有專案數據的唯讀存取權限」選項

**注意**：在 BigQuery 工作區中，KBC_WORKSPACE_SCHEMA 稱為資料集名稱，您只需點擊連接並複製資料集名稱

### Keboola 地區

您的 Keboola API URL 取決於您的部署地區。您可以透過登入 Keboola 專案時瀏覽器中的 URL 來確定您的地區：

| 地區            | API URL                                             |
| --------------- | --------------------------------------------------- |
| AWS 北美        | `https://connection.keboola.com`                    |
| AWS 歐洲        | `https://connection.eu-central-1.keboola.com`       |
| Google Cloud EU | `https://connection.europe-west3.gcp.keboola.com`   |
| Google Cloud US | `https://connection.us-east4.gcp.keboola.com`       |
| Azure EU        | `https://connection.north-europe.azure.keboola.com` |

## 執行 Keboola MCP Server

根據您的需求，有四種使用 Keboola MCP Server 的方式：

### 選項 A：整合模式（推薦）

在此模式下，Claude 或 Cursor 會自動為您啟動 MCP 伺服器。**您無需在終端機中執行任何命令**。

1. 使用適當的設定配置您的 MCP 客戶端（Claude/Cursor）
2. 客戶端會在需要時自動啟動 MCP 伺服器

#### Claude Desktop 配置

1. 前往 Claude（螢幕左上角）→ 設定 → 開發者 → 編輯配置（如果您看不到 claude_desktop_config.json，請建立它）
2. 添加以下配置：
3. 重新啟動 Claude desktop 以使變更生效

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": ["keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

配置檔案位置：

- **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**：`%APPDATA%\Claude\claude_desktop_config.json`

#### Cursor 配置

1. 前往設定 → MCP
2. 點擊「+ Add new global MCP Server」
3. 使用以下設定配置：

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": ["keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

**注意**：為 MCP 伺服器使用簡短、描述性的名稱。由於完整的工具名稱包含伺服器名稱且必須保持在 ~60 個字元以下，較長的名稱可能會在 Cursor 中被過濾掉，並且不會顯示給代理。

#### Windows WSL 的 Cursor 配置

在 Windows Subsystem for Linux 中使用 Cursor AI 執行 MCP 伺服器時，請使用此配置：

```json
{
  "mcpServers": {
    "keboola": {
      "command": "wsl.exe",
      "args": [
        "bash",
        "-c '",
        "export KBC_STORAGE_API_URL=https://connection.YOUR_REGION.keboola.com &&",
        "export KBC_STORAGE_TOKEN=your_keboola_storage_token &&",
        "export KBC_WORKSPACE_SCHEMA=your_workspace_schema &&",
        "/snap/bin/uvx keboola_mcp_server",
        "'"
      ]
    }
  }
}
```

### 選項 B：本地開發模式

針對正在開發 MCP 伺服器程式碼本身的開發者：

1. 複製儲存庫並設定本地環境
2. 配置 Claude/Cursor 使用您的本地 Python 路徑：

```json
{
  "mcpServers": {
    "keboola": {
      "command": "/absolute/path/to/.venv/bin/python",
      "args": ["-m", "keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

### 選項 C：手動 CLI 模式（僅限測試）

您可以在終端機中手動執行伺服器進行測試或偵錯：

```bash
# 設定環境變數
export KBC_STORAGE_API_URL=https://connection.YOUR_REGION.keboola.com
export KBC_STORAGE_TOKEN=your_keboola_storage_token
export KBC_WORKSPACE_SCHEMA=your_workspace_schema

uvx keboola_mcp_server --transport sse
```

> **注意**：此模式主要用於偵錯或測試。對於與 Claude 或 Cursor 的正常使用，您無需手動執行伺服器。

> **注意**：伺服器將使用 SSE 傳輸並在 `localhost:8000` 監聽傳入的 SSE 連接。您可以使用 `--port` 和 `--host` 參數使其在其他地方監聽。

### 選項 D：使用 Docker

```shell
docker pull keboola/mcp-server:latest

docker run \
  --name keboola_mcp_server \
  --rm \
  -it \
  -p 127.0.0.1:8000:8000 \
  -e KBC_STORAGE_API_URL="https://connection.YOUR_REGION.keboola.com" \
  -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
  -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
  keboola/mcp-server:latest \
  --transport sse \
  --host 0.0.0.0
```

> **注意**：伺服器將使用 SSE 傳輸並在 `localhost:8000` 監聽傳入的 SSE 連接。您可以變更 `-p` 以將容器的埠對應到其他地方。

### 我需要自己啟動伺服器嗎？

| 情境               | 需要手動執行？      | 使用此設定               |
| ------------------ | ------------------- | ------------------------ |
| 使用 Claude/Cursor | 否                  | 在應用程式設定中配置 MCP |
| 本地開發 MCP       | 否（Claude 會啟動） | 將配置指向 python 路徑   |
| 手動測試 CLI       | 是                  | 使用終端機執行           |
| 使用 Docker        | 是                  | 執行 docker 容器         |

## 使用 MCP Server

一旦您的 MCP 客戶端（Claude/Cursor）配置並執行，您就可以開始查詢您的 Keboola 數據：

### 驗證您的設定

您可以從簡單的查詢開始，以確認一切正常運作：

```text
我的 Keboola 專案中有哪些儲存桶和表格？
```

### 您可以做什麼的例子

**數據探索：**

- 「哪些表格包含客戶資訊？」
- 「執行查詢以找出營收前 10 名的客戶」

**數據分析：**

- 「分析我上季按地區的銷售數據」
- 「找出客戶年齡與購買頻率之間的相關性」

**數據管道：**

- 「建立一個連接客戶和訂單表格的 SQL 轉換」
- 「為我的 Salesforce 元件啟動數據提取作業」

## 相容性

### MCP 客戶端支援

| **MCP 客戶端**           | **支援狀態** | **連接方法**      |
| ------------------------ | ------------ | ----------------- |
| Claude（桌面版和網頁版） | ✅ 支援      | stdio             |
| Cursor                   | ✅ 支援      | stdio             |
| Windsurf、Zed、Replit    | ✅ 支援      | stdio             |
| Codeium、Sourcegraph     | ✅ 支援      | HTTP+SSE          |
| 自訂 MCP 客戶端          | ✅ 支援      | HTTP+SSE 或 stdio |

## 支援的工具

**注意：** 您的 AI 代理將自動適應新工具。

| 類別     | 工具                        | 描述                                         |
| -------- | --------------------------- | -------------------------------------------- |
| **專案** | `get_project_info`          | 返回關於您 Keboola 專案的結構化資訊          |
| **儲存** | `get_bucket`                | 取得特定儲存桶的詳細資訊                     |
|          | `get_table`                 | 取得特定表格的詳細資訊，包括 DB 識別符和欄位 |
|          | `list_buckets`              | 檢索專案中的所有儲存桶                       |
|          | `list_tables`               | 檢索特定儲存桶中的所有表格                   |
|          | `update_description`        | 更新儲存桶、表格或欄位的描述                 |
| **SQL**  | `query_data`                | 對底層資料庫執行 SELECT 查詢                 |
| **元件** | `add_config_row`            | 為元件配置建立配置行                         |
|          | `create_config`             | 建立根元件配置                               |
|          | `create_sql_transformation` | 從一個或多個 SQL 程式碼區塊建立 SQL 轉換     |
|          | `find_component_id`         | 找出符合自然語言查詢的元件 ID                |
|          | `get_component`             | 透過 ID 檢索元件詳細資訊                     |
|          | `get_config`                | 檢索特定元件/轉換配置                        |
|          | `get_config_examples`       | 檢索元件的範例配置                           |
|          | `list_configs`              | 列出專案中的配置，可選擇性過濾               |
|          | `list_transformations`      | 列出專案中的轉換配置                         |
|          | `update_config`             | 更新根元件配置                               |
|          | `update_config_row`         | 更新元件配置行                               |
|          | `update_sql_transformation` | 更新現有的 SQL 轉換配置                      |
| **流程** | `create_conditional_flow`   | 建立條件流程（`keboola.flow`）               |
|          | `create_flow`               | 建立舊版流程（`keboola.orchestrator`）       |
|          | `get_flow`                  | 檢索特定流程配置的詳細資訊                   |
|          | `get_flow_examples`         | 檢索有效流程配置的範例                       |
|          | `get_flow_schema`           | 返回指定流程類型的 JSON 模式                 |
|          | `list_flows`                | 列出專案中的流程配置                         |
|          | `update_flow`               | 更新現有的流程配置                           |
| **作業** | `get_job`                   | 檢索特定作業的詳細資訊                       |
|          | `list_jobs`                 | 列出作業，可選擇性過濾、排序和分頁           |
|          | `run_job`                   | 為元件或轉換啟動作業                         |
| **文件** | `docs_query`                | 使用 Keboola 文件作為來源回答問題            |
| **其他** | `create_oauth_url`          | 為元件配置生成 OAuth 授權 URL                |
|          | `search`                    | 透過名稱前綴搜尋專案中的項目                 |

## 疑難排解

### 常見問題

| 問題             | 解決方案                             |
| ---------------- | ------------------------------------ |
| **身份驗證錯誤** | 驗證 `KBC_STORAGE_TOKEN` 是否有效    |
| **工作區問題**   | 確認 `KBC_WORKSPACE_SCHEMA` 是否正確 |
| **連接逾時**     | 檢查網路連接                         |

## 開發

### 安裝

基本設定：

```bash
uv sync --extra dev
```

使用基本設定，您可以使用 `uv run tox` 執行測試並檢查程式碼風格。

推薦設定：

```bash
uv sync --extra dev --extra tests --extra integtests --extra codestyle
```

使用推薦設定，將安裝用於測試和程式碼風格檢查的套件，這允許像 VsCode 或 Cursor 這樣的 IDE 在開發期間檢查程式碼或執行測試。

### 整合測試

要在本地執行整合測試，請使用 `uv run tox -e integtests`。
注意：您需要設定以下環境變數：

- `INTEGTEST_STORAGE_API_URL`
- `INTEGTEST_STORAGE_TOKEN`
- `INTEGTEST_WORKSPACE_SCHEMA`

為了取得這些值，您需要一個專門用於整合測試的 Keboola 專案。

### 更新 `uv.lock`

如果您已添加或移除依賴項，請更新 `uv.lock` 檔案。在建立發佈時，也要考慮使用較新的依賴項版本更新鎖定（`uv lock --upgrade`）。

### 更新工具文件

當您對任何工具描述（工具函數中的 docstrings）進行變更時，您必須重新生成 `TOOLS.md` 文件檔案以反映這些變更：

```bash
uv run python -m src.keboola_mcp_server.generate_tool_docs
```

## 支援和回饋

**⭐ 取得幫助、回報錯誤或請求功能的主要方式是[在 GitHub 上開啟問題](https://github.com/keboola/mcp-server/issues/new)。⭐**

開發團隊會積極監控問題並儘快回應。有關 Keboola 的一般資訊，請使用以下資源。

## 資源

- [使用者文件](https://help.keboola.com/)
- [開發者文件](https://developers.keboola.com/)
- [Keboola 平台](https://www.keboola.com)
- [問題追蹤器](https://github.com/keboola/mcp-server/issues/new) ← **MCP Server 的主要聯絡方法**

## 連接

- [LinkedIn](https://www.linkedin.com/company/keboola)
- [Twitter](https://x.com/keboola)
- [變更日誌](https://changelog.keboola.com/)
