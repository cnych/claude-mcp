---
name: Supabase MCP Server
digest: 將您的Supabase專案與Cursor、Claude、Windsurf等AI工具連結，以增強開發工作流程。此整合實現了無縫數據存取與互動，透過直接在資料庫環境中運用AI能力來提升生產力。
author: supabase-community
homepage: https://github.com/supabase-community/supabase-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - 資料庫
  - 雲端
icon: https://avatars.githubusercontent.com/u/87650496?v=4
createTime: 2024-12-21
featured: true
---

> 將您的 Supabase 專案連接至 Cursor、Claude、Windsurf 及其他 AI 助手。

![supabase-mcp-demo](https://static.claudemcp.com/servers/supabase-community/supabase-mcp/supabase-community-supabase-mcp-24a1d57e.jpg)

[模型上下文協定](https://modelcontextprotocol.io/introduction) (MCP) 標準化了大型語言模型(LLMs)與 Supabase 等外部服務的溝通方式。它直接將 AI 助手與您的 Supabase 專案連接，並允許它們執行管理表格、獲取配置及查詢數據等任務。

## 先決條件

您需要在機器上安裝 Node.js。可透過執行以下指令檢查：

```shell
node -v
```

若未安裝 Node.js，可從[nodejs.org](https://nodejs.org/)下載。

## 設定

### 1. 個人存取權杖(PAT)

首先，前往您的[Supabase 設定](https://supabase.com/dashboard/account/tokens)並建立一個個人存取權杖。為其命名以描述用途，例如「Cursor MCP Server」。

此權杖將用於驗證 MCP 伺服器與您的 Supabase 帳戶。請務必複製權杖，因為之後將無法再次查看。

### 2. 配置 MCP 客戶端

接著，配置您的 MCP 客戶端（如 Cursor）以使用此伺服器。多數 MCP 客戶端以下列 JSON 格式儲存配置：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

將`<personal-access-token>`替換為步驟 1 建立的權杖。或者，您可以省略`--access-token`，改為將環境變數`SUPABASE_ACCESS_TOKEN`設為您的個人存取權杖。

若您使用 Windows，需在指令前加上`cmd /c`：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

### 唯讀模式

若希望將 Supabase MCP 伺服器限制為唯讀查詢，請在 CLI 指令中設定`--read-only`標記：

```shell
npx -y @supabase/mcp-server-supabase@latest --access-token=<personal-access-token> --read-only
```

這將透過以唯讀 Postgres 用戶執行 SQL，防止對任何資料庫進行寫入操作。

## 工具

以下 Supabase 工具可供 LLM 使用：

#### 專案管理

- `list_projects`: 列出用戶的所有 Supabase 專案。
- `get_project`: 獲取專案詳細資訊。
- `create_project`: 建立新 Supabase 專案。
- `pause_project`: 暫停專案。
- `restore_project`: 恢復專案。
- `list_organizations`: 列出用戶所屬的所有組織。
- `get_organization`: 獲取組織詳細資訊。

#### 資料庫操作

- `list_tables`: 列出指定架構中的所有表格。
- `list_extensions`: 列出資料庫中的所有擴充功能。
- `list_migrations`: 列出資料庫中的所有遷移。
- `apply_migration`: 將 SQL 遷移應用到資料庫。
- `execute_sql`: 在資料庫中執行原始 SQL。
- `get_logs`: 按服務類型獲取 Supabase 專案的日誌。

#### 專案配置

- `get_project_url`: 獲取專案的 API URL。
- `get_anon_key`: 獲取專案的匿名 API 金鑰。

#### 分支功能（實驗性，需付費方案）

- `create_branch`: 建立包含生產分支遷移的開發分支。
- `list_branches`: 列出所有開發分支。
- `delete_branch`: 刪除開發分支。
- `merge_branch`: 將開發分支的遷移和邊緣功能合併至生產分支。
- `reset_branch`: 將開發分支的遷移重置至先前版本。
- `rebase_branch`: 在生產分支上重新建立開發分支以處理遷移偏差。

#### 開發工具

- `generate_typescript_types`: 根據資料庫架構生成 TypeScript 類型。

#### 成本確認

- `get_cost`: 獲取組織中新專案或分支的成本。
- `confirm_cost`: 確認用戶對新專案或分支成本的理解。

## 其他 MCP 伺服器

### `@supabase/mcp-server-postgrest`

PostgREST MCP 伺服器允許您透過 REST API 將自己的用戶連接至應用程式。

## 資源

- [**模型上下文協定**](https://modelcontextprotocol.io/introduction): 深入了解 MCP 及其功能。

## 授權

本專案採用 Apache 2.0 授權。
