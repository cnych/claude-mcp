---
name: EdgeOne Pages MCP
digest: The MCP service enables quick deployment of HTML content to EdgeOne Pages, generating a public URL for easy access and sharing. It simplifies content publishing with minimal setup.
author: TencentEdgeOne
repository: https://github.com/TencentEdgeOne/edgeone-pages-mcp
homepage: https://edgeone.ai/products/pages
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - serverless
  - edge
  - tencent
icon: https://avatars.githubusercontent.com/u/176978739?v=4
createTime: 2025-03-25
---

An MCP service for deploying HTML content to EdgeOne Pages and obtaining a publicly accessible URL.

## Demo

![](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-ef5005b0.gif)

## Requirements

- Node.js 18 or higher

## Configure MCP

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "command": "npx",
      "args": ["edgeone-pages-mcp"]
    }
  }
}
```

## Architecture

![EdgeOne Pages MCP Architecture](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-4f131d90.svg)

The architecture diagram illustrates the workflow:

1. Large Language Model generates HTML content
2. Content is sent to the EdgeOne Pages MCP Server
3. MCP Server deploys the content to EdgeOne Pages Edge Functions
4. Content is stored in EdgeOne KV Store for fast edge access
5. MCP Server returns a public URL
6. Users can access the deployed content via browser with fast edge delivery

## Features

- MCP protocol for rapid deployment of HTML content to EdgeOne Pages
- Automatic generation of publicly accessible URLs

## Implementation

This MCP service integrates with EdgeOne Pages Functions to deploy static HTML content. The implementation uses:

1. **EdgeOne Pages Functions** - A serverless computing platform that allows execution of JavaScript/TypeScript code at the edge.

2. **Key Implementation Details** :

   - Uses EdgeOne Pages KV store to store and serve the HTML content
   - Automatically generates a public URL for each deployment
   - Handles API errors with appropriate error messages

3. **How it works** :

   - The MCP server accepts HTML content through the `deploy-html` tool
   - It connects to EdgeOne Pages API to get the base URL
   - Deploys the HTML content using the EdgeOne Pages KV API
   - Returns a publicly accessible URL to the deployed content

4. **Usage Example** :
   - Provide HTML content to the MCP service
   - Receive a public URL that can be accessed immediately

For more information, see the [EdgeOne Pages Functions documentation](https://edgeone.ai/document/162227908259442688) and [EdgeOne Pages KV Storage Guide](https://edgeone.ai/document/162227803822321664).
