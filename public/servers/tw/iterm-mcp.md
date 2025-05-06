---
name: iterm-mcp
digest: MCP 伺服器讓您能遠端存取 iTerm 終端機工作階段，從不同位置安全地控制和管理命令列介面。
author: ferrislucas
homepage: https://github.com/ferrislucas/iterm-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 終端機
  - 整合
  - 命令列介面
icon: https://avatars.githubusercontent.com/u/678152?v=4
createTime: 2025-01-09
---
一個提供存取您 iTerm 工作階段的 Model Context Protocol 伺服器。

![主圖像](https://static.claudemcp.com/servers/ferrislucas/iterm-mcp/ferrislucas-iterm-mcp-633bb741.gif)

### 功能

**高效使用 Token：** iterm-mcp 讓模型僅能檢查其感興趣的輸出內容。即使是長時間執行的命令，模型通常也只需要查看最後幾行輸出。

**自然整合：** 您與模型共享 iTerm。您可以詢問螢幕上顯示的內容，或將任務委派給模型並觀察它執行每個步驟。

**完整的終端控制與 REPL 支援：** 模型可以啟動並與 REPL 互動，也能發送控制字元如 ctrl-c、ctrl-z 等。

**依賴性低：** iterm-mcp 以最少的依賴建構，並可透過 npx 執行。設計上易於加入 Claude Desktop 和其他 MCP 客戶端。應該能直接運作。

## 安全考量

* 使用者需負責安全使用此工具。
* 無內建限制：iterm-mcp 不會評估執行命令的安全性。
* 模型可能出現意外行為。使用者應監控活動並在適當時中止。
* 對於多步驟任務，若模型偏離軌道，您可能需要中斷它。建議先從小型、聚焦的任務開始，直到熟悉模型行為。

### 工具
- `write_to_terminal` - 寫入當前活動的 iTerm 終端，常用於執行命令。返回命令產生的輸出行數。
- `read_terminal_output` - 從當前活動的 iTerm 終端讀取指定行數的輸出。
- `send_control_character` - 發送控制字元到當前活動的 iTerm 終端。

### 需求

* 必須運行 iTerm2
* Node 版本 18 或更高

## 安裝

要在 Claude Desktop 中使用，請加入伺服器設定：

在 macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`
在 Windows：`%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "iterm-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "iterm-mcp"
      ]
    }
  }
}
```

### 透過 Smithery 安裝

透過 [Smithery](https://smithery.ai/server/iterm-mcp) 自動為 Claude Desktop 安裝 iTerm：

```bash
npx -y @smithery/cli install iterm-mcp --client claude
```

## 開發

安裝依賴：
```bash
yarn install
```

建構伺服器：
```bash
yarn run build
```

開發時自動重建：
```bash
yarn run watch
```

### 除錯

由於 MCP 伺服器透過 stdio 通訊，除錯可能具有挑戰性。建議使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector)，可透過套件腳本使用：

```bash
yarn run inspector
yarn debug <command>
```

Inspector 將提供 URL 以便在瀏覽器中存取除錯工具。