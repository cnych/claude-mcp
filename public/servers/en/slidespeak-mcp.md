---
name: slidespeak-mcp
digest: An MCP to create, edit and generate presentations and PowerPoints.
author: slidespeak
repository: https://github.com/SlideSpeak/slidespeak-mcp
homepage: https://slidespeak.co
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - presentations
  - powerpoint
  - reports
icon: https://slidespeak.co/wp-content/uploads/2025/07/slidespeak-charles-logo.png
createTime: 2025-07-21
---

SlideSpeak MCP enables you to create, edit and modify presentations using the MCP protocol. Use AI to make presentation fully automated. SlideSpeak MCP designs slides for you and you can download your presentations as PowerPoint (pptx).

## Features

**Generate Presentations**. Supported export format are PDF and PPTX.

**Edit Presentations**. Modify presentations using SlideSpeak MCP. Edit text, remove slides or update existing slides.

## Installation

Requires Nodejs

## Configuration

Add this to your Claude Desktop or Cursor config file:

```json
{
  "mcpServers": {
    "slidespeak": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.slidespeak.co/mcp",
        "--header",
        "Authorization: Bearer YOUR-SLIDESPEAK-API-KEY-HERE"
      ],
      "timeout": 300000
    }
  }
}
```

## License

This project is licensed under the MIT License.
