---
name: Xquik MCP Server
digest: Search and monitor public X data through a remote MCP endpoint
author: Xquik
homepage: https://docs.xquik.com/mcp/overview
repository: https://github.com/Xquik-dev/x-twitter-scraper
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - x
  - twitter
  - search
  - monitoring
  - webhooks
  - api
icon: https://xquik.com/icons/mcp/xquik.png
createTime: 2026-07-10T00:00:00Z
---

Xquik provides a remote Streamable HTTP MCP server for public X data workflows.
Its MCP tools expose API discovery and execution for search, extraction,
monitoring, webhooks, and approved write actions.

## Connect

Use the remote endpoint with an Xquik API key:

```json
{
  "mcpServers": {
    "xquik": {
      "url": "https://xquik.com/mcp",
      "headers": {
        "x-api-key": "${XQUIK_API_KEY}"
      }
    }
  }
}
```

Keep `XQUIK_API_KEY` in your MCP client's secret store or environment
configuration. Do not commit it to a repository.

## Workflow Guidance

- Start with read-only discovery, search, extraction, and monitoring calls.
- Review endpoint schemas before supplying parameters.
- Require explicit user approval before posting, replying, uploading media, or
  changing account state.
- Preserve source URLs, handles, timestamps, and collection times when using
  public posts as evidence.

## Links

- [MCP setup documentation](https://docs.xquik.com/mcp/overview)
- [MCP discovery metadata](https://xquik.com/.well-known/mcp.json)
- [Source repository](https://github.com/Xquik-dev/x-twitter-scraper)
