---
name: Illustrator MCP Server
digest: Adobe Illustrator supports JavaScript for automating complex tasks through scripts, enabling efficient programmatic content generation. This integration is ideal for bots and automation workflows.
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
Adobe Illustrator is compatible with JavaScript. In fact, some super big stuff you need to programmatically generate with these scripts. Bots are good at JavaScript.

This MCP server lets bots send scripts straight to Illustrator and look at the result.

Since it depends on AppleScript, it's only compatible with MacOS. and I've only tested it with Claude Desktop.

## Configuration

Add this to your Claude Desktop config file:
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