---
name: Context7 MCP - Up-to-date Docs For Any Prompt
digest: Context7 MCP 伺服器是一個為大語言模型和 AI 程式碼編輯器提供最新文件的 MCP 伺服器。
author: upstash
homepage: https://github.com/upstash/context7
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - context7
  - cursor
  - 文件
  - 提示詞
icon: https://avatars.githubusercontent.com/u/74989412?v=4
createTime: 2025-04-25
featured: true
---

## ❌ 沒有 Context7 的情況

大型語言模型依賴於您使用的函式庫的過時或通用資訊。您會遇到：

- ❌ 程式碼範例已過時，基於一年前的訓練數據
- ❌ 虛構的 API 根本不存在
- ❌ 針對舊版套件的通用回答

## ✅ 使用 Context7 的情況

Context7 MCP 直接從源頭獲取最新的、特定版本的文件和程式碼範例，並將它們直接放入您的提示中。

在 Cursor 的提示中加入 `use context7`：

```txt
Create a basic Next.js project with app router. use context7
```

```txt
Create a script to delete the rows where the city is "" given PostgreSQL credentials. use context7
```

Context7 會將最新的程式碼範例和文件直接獲取到大型語言模型的上下文中。

- 1️⃣ 自然地撰寫您的提示
- 2️⃣ 告訴大型語言模型 `use context7`
- 3️⃣ 獲得可運行的程式碼答案

## 🛠️ 開始使用

### 需求

- Node.js >= v18.0.0
- Cursor、Windsurf、Claude Desktop 或其他 MCP 客戶端

### 透過 Smithery 安裝

要透過 [Smithery](https://smithery.ai/server/@upstash/context7-mcp) 自動為 Claude Desktop 安裝 Context7 MCP Server：

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### 在 Cursor 中安裝

前往：`Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

將以下配置貼到您的 Cursor `~/.cursor/mcp.json` 檔案中是推薦的方法。

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

在 Cursor 中啟用 Context7 MCP。

![Context7 MCP in Cursor](/images/context7-cursor-settings.png)

在 Cursor 中使用 Context7 MCP 的方法是，在提示中加入 `use context7`。

![Use Context7 MCP in Cursor](/images/context7-use-in-cursor.png)

### 在 Windsurf 中安裝

將以下內容加入您的 Windsurf MCP 配置檔案。

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### 在 VS Code 中安裝

將以下內容加入您的 VS Code MCP 配置檔案。

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### 在 Claude Code 中安裝

執行以下指令。

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### 在 Claude Desktop 中安裝

將以下內容加入您的 Claude Desktop `claude_desktop_config.json` 檔案。

```json
{
  "mcpServers": {
    "Context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### 使用 Docker

如果您偏好使用 Docker 容器運行 MCP 伺服器：

1.  **建立 Docker 映像：**

    首先，在專案根目錄建立一個 `Dockerfile`：

    ```Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    RUN npm install -g @upstash/context7-mcp@latest

    CMD ["context7-mcp"]
    ```

    然後，建立映像：

    ```bash
    docker build -t context7-mcp .
    ```

2.  **配置您的 MCP 客戶端：**

    更新您的 MCP 客戶端配置以使用 Docker 指令。

    ```json
    {
      "mcpServers": {
        "Сontext7": {
          "autoApprove": [],
          "disabled": false,
          "timeout": 60,
          "command": "docker",
          "args": ["run", "-i", "--rm", "context7-mcp"],
          "transportType": "stdio"
        }
      }
    }
    ```

### 可用工具

- `resolve-library-id`：將通用函式庫名稱解析為 Context7 相容的函式庫 ID。
  - `libraryName`（必填）
- `get-library-docs`：使用 Context7 相容的函式庫 ID 獲取函式庫文件。
  - `context7CompatibleLibraryID`（必填）
  - `topic`（選填）：將文件聚焦於特定主題（例如 "routing"、"hooks"）
  - `tokens`（選填，預設 5000）：返回的最大 token 數量。小於 5000 的值會自動增加到 5000。

## 開發

克隆專案並安裝依賴：

```bash
bun i
```

建置：

```bash
bun run build
```

### 本地配置範例

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["tsx", "/path/to/folder/context7-mcp/src/index.ts"]
    }
  }
}
```

### 使用 MCP Inspector 測試

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## 疑難排解

### ERR_MODULE_NOT_FOUND

如果看到此錯誤，請嘗試使用 `bunx` 而非 `npx`。

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### MCP 客戶端錯誤

1. 嘗試從套件名稱中移除 `@latest`。
2. 嘗試使用 `bunx` 作為替代方案。
3. 嘗試使用 `deno` 作為替代方案。

## 授權

MIT
