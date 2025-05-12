---
name: Illustrator MCP Server
digest: Adobe Illustrator 支援透過 JavaScript 腳本自動化複雜任務，實現高效的程式化內容生成。此整合特別適合機器人與自動化工作流程。
author: spencerhhubert
homepage: https://github.com/spencerhhubert/illustrator-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - javascript
  - macos
  - illustrator
icon: https://avatars.githubusercontent.com/u/33559710?v=4
createTime: 2024-12-12
---
Adobe Illustrator 與 JavaScript 相容。事實上，某些大型內容需要透過這些腳本進行程式化生成。機器人擅長處理 JavaScript。

此 MCP 伺服器讓機器人直接將腳本傳送至 Illustrator 並查看結果。

由於依賴 AppleScript，僅相容於 MacOS 系統。目前僅在 Claude Desktop 環境中測試過。

## 設定配置

將以下內容加入您的 Claude Desktop 設定檔：
`~/Library/Application\ Support/Claude/claude_desktop_config.json`

```json
{
    "mcpServers": {
        "illustrator": {
            "command": "uv",
            "args": [
                "--directory",
                "/Users/you/code/mcp/illustrator-mcp-server",
                "run",
                "illustrator"
            ]
        }
    }
}
```