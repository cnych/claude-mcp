---
name: Sharpe MCP Server
digest: MCP server for crypto market intelligence across funding, futures, options, arbitrage, narratives, token risk, and exchange listings.
author: Sharpe AI
homepage: https://www.sharpe.ai/docs/mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - finance
  - crypto
  - market-data
  - trading
  - risk
createTime: 2026-05-14
---

Sharpe MCP Server connects MCP-compatible clients to Sharpe's crypto market intelligence. It is built for agents and analysts that need live context across derivatives positioning, DEX flow, arbitrage, narratives, token risk, exchange listings, and market news.

## Features

- Access crypto market intelligence through MCP tools
- Review funding, futures, options, arbitrage, narrative, and listings context
- Include token risk and rug-check context in agent workflows
- Use with clients such as Claude Desktop, Cursor, and other MCP-compatible tools

## Installation

Install and run the server with `uvx`:

```bash
uvx sharpe-mcp
```

For Claude Desktop or Cursor, add a server entry like this:

```json
{
  "mcpServers": {
    "sharpe": {
      "command": "uvx",
      "args": ["sharpe-mcp"]
    }
  }
}
```

## Use Cases

- Ask an agent to compare funding and derivatives positioning across crypto markets
- Add token risk checks before reviewing a new memecoin or contract
- Pull narrative, exchange listing, arbitrage, and news context into research workflows
- Give trading and research agents a structured crypto market data source

## Resources

- [Sharpe MCP Server documentation](https://www.sharpe.ai/docs/mcp-server)
- [Sharpe Terminal](https://www.sharpe.ai/)
