---
name: Dify MCP Server
digest: 此MCP伺服器實現透過整合MCP工具來執行Dify工作流程，提供一個簡單的方式透過MCP功能觸發和管理Dify流程。
author: YanxingLiu
homepage: https://github.com/YanxingLiu/dify-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 伺服器
  - 工作流程
  - 工具
  - dify
icon: https://avatars.githubusercontent.com/u/42299757?v=4
createTime: 2024-12-25
---

這是一個簡單的 MCP 伺服器實現，用於使用[dify](https://github.com/langgenius/dify)。它通過調用 MCP 的工具來實現 Dify 工作流程的調用。

## 安裝

伺服器可以通過[Smithery](https://smithery.ai/server/dify-mcp-server)或手動安裝。兩種方法都需要 config.yaml。

### 準備 config.yaml

在使用 mcp 伺服器之前，您應該準備一個 config.yaml 來保存您的 dify_base_url 和 dify_sks。示例配置如下：

```yaml
dify_base_url: "https://cloud.dify.ai/v1"
dify_app_sks:
  - "app-sk1"
  - "app-sk2"
```

您可以在終端中運行以下命令快速創建配置檔案：

```bash
mkdir -p ~/tools && cat > ~/tools/config.yaml <<EOF
dify_base_url: "https://cloud.dify.ai/v1"
dify_app_sks:
  - "app-sk1"
  - "app-sk2"
EOF
```

不同的 SK 對應不同的 dify 工作流程。

### 通過 Smithery 安裝

[smithery](https://smithery.ai)是一個自動安裝 dify mcp 伺服器的工具。

```bash
npx -y @smithery/cli install dify-mcp-server --client claude
```

除了`claude`，還支持`cline, windsurf, roo-cline, witsy, enconvo, cursor`。

### 手動安裝

#### 方法 1：使用 uv（本地克隆+uv 啟動）

客戶端配置格式：

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

#### 方法 2：使用 uvx（無需克隆代碼，推薦）

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

### 開始使用

最後，您可以在任何支持 mcp 的客戶端中使用 dify 工具。
