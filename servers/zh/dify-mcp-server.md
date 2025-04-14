---
name: Dify MCP Server
digest: 该MCP服务器实现通过集成MCP工具支持Dify工作流执行，提供了一种通过MCP功能触发和管理Dify流程的便捷方式。
author: YanxingLiu
homepage: https://github.com/YanxingLiu/dify-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 服务器
  - 工作流
  - 工具
  - dify
icon: https://avatars.githubusercontent.com/u/42299757?v=4
createTime: 2024-12-25
---

一个简单的 MCP 服务器实现，用于使用[dify](https://github.com/langgenius/dify)。它通过调用 MCP 工具实现了 Dify 工作流的调用。

## 安装

该服务器可以通过[Smithery](https://smithery.ai/server/dify-mcp-server)或手动安装。两种方法都需要 config.yaml 文件。

### 准备 config.yaml

在使用 mcp 服务器之前，您应该准备一个 config.yaml 文件来保存您的 dify_base_url 和 dify_sks。示例配置如下：

```yaml
dify_base_url: "https://cloud.dify.ai/v1"
dify_app_sks:
  - "app-sk1"
  - "app-sk2"
```

您可以在终端中运行以下命令快速创建配置文件：

```bash
mkdir -p ~/tools && cat > ~/tools/config.yaml <<EOF
dify_base_url: "https://cloud.dify.ai/v1"
dify_app_sks:
  - "app-sk1"
  - "app-sk2"
EOF
```

不同的 SK 对应不同的 dify 工作流。

### 通过 Smithery 安装

[smithery](https://smithery.ai)是一个自动安装 dify mcp 服务器的工具。

```bash
npx -y @smithery/cli install dify-mcp-server --client claude
```

除了`claude`，还支持`cline, windsurf, roo-cline, witsy, enconvo, cursor`。

### 手动安装

#### 方法 1：使用 uv（本地克隆+uv 启动）

客户端配置格式：

```json
{
  "mcpServers": {
    "mcp-server-rag-web-browser": {
      "command": "uv",
      "args": [
        "--directory",
        "${DIFY_MCP_SERVER_PATH}",
        "run",
        "dify_mcp_server"
      ],
      "env": {
        "CONFIG_PATH": "$CONFIG_PATH"
      }
    }
  }
}
```

示例配置：

```json
{
  "mcpServers": {
    "dify-mcp-server": {
      "command": "uv",
      "args": [
        "--directory",
        "/Users/lyx/Downloads/dify-mcp-server",
        "run",
        "dify_mcp_server"
      ],
      "env": {
        "CONFIG_PATH": "/Users/lyx/Downloads/config.yaml"
      }
    }
  }
}
```

#### 方法 2：使用 uvx（无需克隆代码，推荐）

```json
"mcpServers": {
  "dify-mcp-server": {
    "command": "uvx",
      "args": [
        "--from","git+https://github.com/YanxingLiu/dify-mcp-server","dify_mcp_server"
      ],
    "env": {
       "CONFIG_PATH": "/Users/lyx/Downloads/config.yaml"
    }
  }
}
```

### 开始使用

最后，您可以在任何支持 mcp 的客户端中使用 dify 工具。
