---
name: Intlayer MCP Server
digest: The Intlayer MCP server integrates AI assistance into your IDE for a smarter, context-aware development experience with Intlayer. It provides command-line access, in-project documentation, and intuitive AI help.
author: aymericzip
homepage: https://intlayer.org
repository: https://github.com/aymericzip/intlayer
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - intlayer
  - i18n
  - l10n
  - localization
  - translation
  - ide
  - automation
  - documentation
icon: https://intlayer.org/android-chrome-512x512.png
createTime: 2025-06-10
---

A Model Context Protocol (MCP) server that enhances development with **Intlayer** by providing IDE-aware documentation, CLI integration, and AI-powered context tools.

## Features

- AI-assisted suggestions and explanations for Intlayer usage
- Smart CLI integration to run and inspect `intlayer` commands directly from your IDE
- In-context documentation based on your project's actual Intlayer version
- Tool interface and prompt suggestions for real-time interaction
- Zero-config setup with `npx`

## Supported IDEs

- Cursor
- VS Code (via MCP)
- Any IDE supporting the Model Context Protocol (MCP)

## Setup

### Option 1: Quick Start with NPX

Add the following to your `.cursor/mcp.json` (or equivalent MCP config):

```json
{
  "mcpServers": {
    "intlayer": {
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

Then restart your IDE or MCP session.

### Option 2: VS Code Configuration

Create `.vscode/mcp.json`:

```json
{
  "servers": {
    "intlayer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

In the Command Palette:

- Enable **Agent Mode** via "Chat Mode"
- Use `#intlayer` to reference tools
- Manage tool confirmations and server sessions

## CLI Usage

You can also run the Intlayer MCP Server manually via CLI:

```bash
# Recommended: npx
npx @intlayer/mcp

# Dev Mode
npm run dev

# Custom entry
node dist/cjs/index.cjs
```

To inspect and debug:

```bash
npx @modelcontextprotocol/inspector npx @intlayer/mcp
```

## Available Features

| Feature                | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| Smart CLI              | Inline execution and doc lookup for `intlayer` commands              |
| Versioned Docs         | Auto-detects your installed Intlayer version and loads matching docs |
| Autocomplete + Prompts | AI-assisted prompt suggestions tailored to your file and context     |
| Agent Mode Tools       | Register and run custom tools inside Cursor and compatible IDEs      |

## Prerequisites

- Node.js
- An IDE that supports the MCP protocol (Cursor, VS Code, etc.)
- A project using [Intlayer](https://github.com/aymericzip/intlayer)

## License

Apache 2.0

---

## Useful Links

- [Intlayer GitHub Repository](https://github.com/aymericzip/intlayer)
- [Documentation](https://intlayer.org/doc/mcp-server)
