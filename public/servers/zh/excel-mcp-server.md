---
name: Excel MCP Server
digest: 一个模型上下文协议(MCP)服务器，无需安装 Microsoft Excel 即可操作 Excel 文件。通过您的 AI 智能体创建、读取和修改 Excel 工作簿。
author: haris-musa
repository: https://github.com/haris-musa/excel-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - excel
  - server
  - python
icon: https://avatars.githubusercontent.com/u/79357181?v=4
createTime: 2025-02-12
---

一个[模型上下文协议(MCP)](/zh)服务器，无需安装 Microsoft Excel 即可操作 Excel 文件。通过您的 AI 智能体创建、读取和修改 Excel 工作簿。

## 功能特性

- 📊 创建和修改 Excel 工作簿
- 📝 读写数据
- 🎨 应用格式和样式
- 📈 创建图表和可视化
- 📊 生成数据透视表
- 🔄 管理工作表和范围

## 快速开始

### 先决条件

- Python 3.10 或更高版本

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/haris-musa/excel-mcp-server.git
cd excel-mcp-server
```

2. 使用 uv 安装：

```bash
uv pip install -e .
```

### 运行服务器

启动服务器（默认端口 8000）：

```bash
uv run excel-mcp-server
```

自定义端口（例如 8080）：

```bash
# Bash/Linux/macOS
export FASTMCP_PORT=8080 && uv run excel-mcp-server

# Windows PowerShell
$env:FASTMCP_PORT = "8080"; uv run excel-mcp-server
```

## 与 AI 工具集成

### Cursor IDE

1. 在 Cursor 中添加此配置：

```json
{
  "mcpServers": {
    "excel": {
      "url": "http://localhost:8000/sse",
      "env": {
        "EXCEL_FILES_PATH": "/path/to/excel/files"
      }
    }
  }
}
```

2. Excel 工具将通过您的 AI 助手提供。

### 远程托管与传输协议

本服务器使用服务器发送事件(SSE)传输协议。针对不同使用场景：

1. **与 Claude Desktop 配合使用（需要 stdio）：**

   - 使用[Supergateway](https://github.com/supercorp-ai/supergateway)将 SSE 转换为 stdio

2. **托管您的 MCP 服务器：**
   - [远程 MCP 服务器指南](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)

## 环境变量

- `FASTMCP_PORT`: 服务器端口（默认：8000）
- `EXCEL_FILES_PATH`: Excel 文件目录（默认：`./excel_files`）

## 许可证

MIT 许可证。
