---
name: Notion MCP Server
digest: Notion-MCP is a server solution that enhances Notion's functionality, offering improved performance, reliability, and customization options. It provides seamless integration, faster data processing, and better scalability for teams using Notion as their productivity platform. The service ensures stable connectivity and optimized workflows.
author: makenotion
homepage: https://github.com/makenotion/notion-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - server
  - notion
icon: https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-e217db9f.jpg
createTime: 2025-03-11
---

This project implements an [MCP server](https://www.claudemcp.com/specification) for the [Notion API](https://developers.notion.com/reference/intro).

![mcp-demo](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-329eb145.jpg)

## Installation

### Setting up Integration in Notion:

Go to [https://www.notion.so/profile/integrations](https://www.notion.so/profile/integrations) and create a new **internal** integration or select an existing one.

![Creating a Notion Integration token](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-ede5f671.png)

For security, you can create a read-only integration token by giving only "Read content" access from the "Configuration" tab:

![Notion Integration Token Capabilities showing Read content checked](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-d83f196f.png)

### Adding MCP config to your client:

#### Using npm:

Add the following to your `.cursor/mcp.json` or `claude_desktop_config.json`:

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\" }"
      }
    }
  }
}
```

#### Using Docker:

Build the Docker image:

```bash
docker-compose build
```

Then add to your config:

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "OPENAPI_MCP_HEADERS={\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\"}",
        "notion-mcp-server-notion-mcp-server"
      ]
    }
  }
}
```

Replace `ntn_****` with your integration secret:

![Copying your Integration token from the Configuration tab in the developer portal](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-2c84281a.jpg)

### Connecting content to integration:

Visit pages/databases and click "Connect to integration" in the 3-dot menu.

![Adding Integration Token to Notion Connections](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-a69b7191.png)

## Examples

1. Comment on a page:

```
Comment "Hello MCP" on page "Getting started"
```

2. Create a new page:

```
Add a page titled "Notion MCP" to page "Development"
```

3. Get page content by ID:

```
Get the content of page 1a6b35e6e67f802fa7e1d27686f017f2
```

## Development

Build:

```
npm run build
```

Execute:

```
npx -y --prefix /path/to/local/notion-mcp-server @notionhq/notion-mcp-server
```

Publish:

```
npm publish --access public
```
