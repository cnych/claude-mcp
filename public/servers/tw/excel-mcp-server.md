---
name: Excel MCP Server
digest: 一個 Model Context Protocol (MCP) 伺服器，讓您無需安裝 Microsoft Excel 即可操作 Excel 檔案。透過您的 AI 代理建立、讀取和修改 Excel 工作簿。
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

一個 [Model Context Protocol (MCP)](/tw) 伺服器，讓您無需安裝 Microsoft Excel 即可操作 Excel 檔案。透過您的 AI 代理建立、讀取和修改 Excel 工作簿。

## 功能

- 📊 建立和修改 Excel 工作簿
- 📝 讀取和寫入資料
- 🎨 套用格式和樣式
- 📈 建立圖表和視覺化
- 📊 產生樞紐分析表
- 🔄 管理工作表和範圍

## 快速開始

### 必要條件

- Python 3.10 或更高版本

### 安裝

1. 複製儲存庫：

```bash
git clone https://github.com/haris-musa/excel-mcp-server.git
cd excel-mcp-server
```

2. 使用 uv 安裝：

```bash
uv pip install -e .
```

### 執行伺服器

啟動伺服器（預設埠號 8000）：

```bash
uv run excel-mcp-server
```

自訂埠號（例如 8080）：

```bash
# Bash/Linux/macOS
export FASTMCP_PORT=8080 && uv run excel-mcp-server

# Windows PowerShell
$env:FASTMCP_PORT = "8080"; uv run excel-mcp-server
```

## 與 AI 工具搭配使用

### Cursor IDE

1. 將此配置加入 Cursor：

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

2. Excel 工具將透過您的 AI 助手提供使用。

### 遠端託管與傳輸協定

此伺服器使用 Server-Sent Events (SSE) 傳輸協定。針對不同使用情境：

1. **與 Claude Desktop 搭配使用（需要 stdio）：**

   - 使用 [Supergateway](https://github.com/supercorp-ai/supergateway) 將 SSE 轉換為 stdio

2. **託管您的 MCP 伺服器：**
   - [遠端 MCP 伺服器指南](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)

## 環境變數

- `FASTMCP_PORT`: 伺服器埠號（預設：8000）
- `EXCEL_FILES_PATH`: Excel 檔案目錄（預設：`./excel_files`）

## 授權

MIT 授權。
