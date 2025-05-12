---
name: Illustrator MCP Server
digest: Adobe Illustrator 支持通过 JavaScript 脚本自动化复杂任务，实现高效的程序化内容生成。此集成方案特别适合机器人和自动化工作流。
author: spencerhhubert
homepage: https://github.com/spencerhhubert/illustrator-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - JavaScript
  - macOS
  - Illustrator
icon: https://avatars.githubusercontent.com/u/33559710?v=4
createTime: 2024-12-12
---
Adobe Illustrator 兼容 JavaScript。实际上，某些需要程序化生成的大型项目必须依赖这些脚本。机器人擅长处理 JavaScript。

该 MCP 服务器允许机器人直接将脚本发送至 Illustrator 并查看执行结果。

由于依赖 AppleScript，目前仅兼容 macOS 系统。且仅在 Claude Desktop 环境下完成测试。

## 配置方法

将以下内容添加至 Claude Desktop 配置文件：
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