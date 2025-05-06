---
name: Context7 MCP - Up-to-date Docs For Any Prompt
digest: Context7 MCP 服务器是一个为大语言模型和 AI 代码编辑器提供最新文档的 MCP 服务器。
author: upstash
homepage: https://github.com/upstash/context7
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - context7
  - cursor
  - 文档
  - 提示词
icon: https://avatars.githubusercontent.com/u/74989412?v=4
createTime: 2025-04-25
featured: true
---

## ❌ 不使用 Context7 的情况

大语言模型依赖关于您使用库的过时或通用信息。您将面临：

- ❌ 代码示例基于一年前的训练数据，已经过时
- ❌ 虚构的 API 根本不存在
- ❌ 针对旧版软件包的通用回答

## ✅ 使用 Context7 的优势

Context7 MCP 直接从源头获取最新、特定版本的文档和代码示例，并将其直接注入您的提示词中。

在 Cursor 的提示词中添加 `use context7`：

```txt
创建一个使用 app router 的基础 Next.js 项目。use context7
```

```txt
编写根据 PostgreSQL 凭证删除 city 列为空值的脚本。use context7
```

Context7 会将最新代码示例和文档直接送入大语言模型的上下文。

- 1️⃣ 自然编写您的提示词
- 2️⃣ 添加 `use context7` 指令
- 3️⃣ 获取可运行的代码答案

## 🛠️ 快速开始

### 系统要求

- Node.js >= v18.0.0
- Cursor、Windsurf、Claude Desktop 或其他 MCP 客户端

### 通过 Smithery 安装

通过 [Smithery](https://smithery.ai/server/@upstash/context7-mcp) 为 Claude Desktop 自动安装 Context7 MCP 服务端：

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### 在 Cursor 中安装

前往：`设置` -> `Cursor 设置` -> `MCP` -> `添加全局 MCP 服务器`

推荐将以下配置粘贴到 Cursor 的 `~/.cursor/mcp.json` 文件中：

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

在 Cursor 中启用 Context7 MCP。

![Context7 MCP in Cursor](/images/context7-cursor-settings.png)

然后，您可以通过在提示词中添加 `use context7` 来在 Cursor 中使用 Context7 MCP。

![Use Context7 MCP in Cursor](/images/context7-use-in-cursor.png)

### 在 Windsurf 中安装

将以下内容添加到 Windsurf 的 MCP 配置文件中：

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

### 在 VS Code 中安装

将以下内容添加到 VS Code 的 MCP 配置文件中：

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

### 在 Claude Code 中安装

运行以下命令：

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### 在 Claude Desktop 中安装

将以下内容添加到 Claude Desktop 的 `claude_desktop_config.json` 文件中：

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

如需在 Docker 容器中运行 MCP 服务器：

1.  **构建 Docker 镜像：**

    首先在项目根目录创建 `Dockerfile`：

    ```Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    RUN npm install -g @upstash/context7-mcp@latest

    CMD ["context7-mcp"]
    ```

    然后构建镜像：

    ```bash
    docker build -t context7-mcp .
    ```

2.  **配置 MCP 客户端：**

    更新 MCP 客户端配置以使用 Docker 命令：

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

- `resolve-library-id`：将通用库名称解析为 Context7 兼容的库 ID
  - `libraryName`（必填）
- `get-library-docs`：使用 Context7 兼容的库 ID 获取文档
  - `context7CompatibleLibraryID`（必填）
  - `topic`（可选）：聚焦特定主题的文档（如 "routing"、"hooks"）
  - `tokens`（可选，默认 5000）：返回的最大 token 数。小于 5000 的值会自动提升至 5000

## 开发指南

克隆项目并安装依赖：

```bash
bun i
```

构建项目：

```bash
bun run build
```

### 本地配置示例

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

### 使用 MCP 检查器测试

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## 故障排除

### ERR_MODULE_NOT_FOUND 错误

若出现此错误，可尝试用 `bunx` 替代 `npx`：

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

### MCP 客户端错误

1. 尝试移除包名中的 `@latest`
2. 尝试使用 `bunx` 作为替代方案
3. 尝试使用 `deno` 作为替代方案

## 许可协议

MIT
