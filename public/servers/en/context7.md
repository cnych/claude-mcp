---
name: Context7 MCP - Up-to-date Docs For Any Prompt
digest: Context7 MCP is a server that provides up-to-date documentation for LLMs and AI code editors.
author: upstash
repository: https://github.com/upstash/context7
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - context7
  - cursor
  - document
  - prompt
icon: https://avatars.githubusercontent.com/u/74989412?v=4
createTime: 2025-04-25
featured: true
---

## ❌ Without Context7

LLMs rely on outdated or generic information about the libraries you use. You get:

- ❌ Code examples are outdated and based on year-old training data
- ❌ Hallucinated APIs don't even exist
- ❌ Generic answers for old package versions

## ✅ With Context7

Context7 MCP pulls up-to-date, version-specific documentation and code examples straight from the source — and places them directly into your prompt.

Add `use context7` to your prompt in Cursor:

```txt
Create a basic Next.js project with app router. use context7
```

```txt
Create a script to delete the rows where the city is "" given PostgreSQL credentials. use context7
```

Context7 fetches up-to-date code examples and documentation right into your LLM's context.

- 1️⃣ Write your prompt naturally
- 2️⃣ Tell the LLM to `use context7`
- 3️⃣ Get working code answers

## 🛠️ Getting Started

### Requirements

- Node.js >= v18.0.0
- Cursor, Windsurf, Claude Desktop or another MCP Client

### Installing via Smithery

To install Context7 MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@upstash/context7-mcp):

```bash
npx -y @smithery/cli install @upstash/context7-mcp --client claude
```

### Install in Cursor

Go to: `Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

Pasting the following configuration into your Cursor `~/.cursor/mcp.json` file is the recommended approach.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Then enable Context7 MCP in Cursor.
![Context7 MCP in Cursor](/images/context7-cursor-settings.png)

Then, you can use Context7 MCP in Cursor by adding `use context7` to your prompt.

![Use Context7 MCP in Cursor](/images/context7-use-in-cursor.png)

### Install in Windsurf

Add this to your Windsurf MCP config file.

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Install in VS Code

Add this to your VS Code MCP config file.

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Install in Claude Code

Run this command.

```sh
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### Install in Claude Desktop

Add this to your Claude Desktop `claude_desktop_config.json` file.

```json
{
  "mcpServers": {
    "Context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Using Docker

If you prefer to run the MCP server in a Docker container:

1.  **Build the Docker Image:**

    First, create a `Dockerfile` in the project root:

    ```Dockerfile
    FROM node:18-alpine

    WORKDIR /app

    RUN npm install -g @upstash/context7-mcp@latest

    CMD ["context7-mcp"]
    ```

    Then, build the image:

    ```bash
    docker build -t context7-mcp .
    ```

2.  **Configure Your MCP Client:**

    Update your MCP client's configuration to use the Docker command.

    ```json
    {
      "mcpServers": {
        "Сontext7": {
          "autoApprove": [],
          "disabled": false,
          "timeout": 60,
          "command": "docker",
          "args": ["run", "-i", "--rm", "context7-mcp"],
          "transportType": "stdio"
        }
      }
    }
    ```

### Available Tools

- `resolve-library-id`: Resolves a general library name into a Context7-compatible library ID.
  - `libraryName` (required)
- `get-library-docs`: Fetches documentation for a library using a Context7-compatible library ID.
  - `context7CompatibleLibraryID` (required)
  - `topic` (optional): Focus the docs on a specific topic (e.g., "routing", "hooks")
  - `tokens` (optional, default 5000): Max number of tokens to return. Values less than 5000 are automatically increased to 5000.

## Development

Clone the project and install dependencies:

```bash
bun i
```

Build:

```bash
bun run build
```

### Local Configuration Example

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["tsx", "/path/to/folder/context7-mcp/src/index.ts"]
    }
  }
}
```

### Testing with MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector npx @upstash/context7-mcp@latest
```

## Troubleshooting

### ERR_MODULE_NOT_FOUND

If you see this error, try using `bunx` instead of `npx`.

```json
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### MCP Client Errors

1. Try removing `@latest` from the package name.
2. Try using `bunx` as an alternative.
3. Try using `deno` as an alternative.

## License

MIT
