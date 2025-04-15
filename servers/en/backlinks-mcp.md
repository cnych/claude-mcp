---
name: Backlinks MCP
digest: An MCP server that retrieves backlink information for any domain using Ahrefs data
author: cnych
repository: https://github.com/cnych/backlinks-mcp
homepage: https://www.claudemcp.com/servers/backlinks-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - Ahrefs
  - Backlinks
icon: https://avatars.githubusercontent.com/u/3094973?s=48&v=4
createTime: 2025-04-12
---

This MCP server retrieves backlink information for any domain using Ahrefs data.

> Note ⚠️: This MCP has been merged into [SEO MCP](/servers/seo-mcp). Please use [SEO MCP](/servers/seo-mcp) instead for more features.

## Features

- 🔍 Retrieve backlink information for any domain
- 🔒 Automatically solve Cloudflare Turnstile CAPTCHAs
- 💾 Signature caching for improved performance and reduced API costs
- 🚀 Fast and efficient data retrieval
- 🧹 Streamlined output with only the most relevant backlink details

## Installation

> This MCP server is for educational purposes only. Please refrain from misuse, as you assume full responsibility for any consequences. Inspired by the `@Gofei Community`.

## Features

- 🔍 Retrieve backlink information for any domain
- 🔒 Automatically solve Cloudflare Turnstile CAPTCHAs
- 💾 Signature caching for improved performance and reduced API costs
- 🚀 Fast and efficient data retrieval
- 🧹 Streamlined output with only the most relevant backlink details

## Installation

### Prerequisites

- Python 3.8 or later
- A CapSolver account and API key (register [here](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0))
- `uv` installation (on macOS, you may need `brew install uv`)

### Manual Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cnych/backlinks-mcp.git
   cd backlinks-mcp
   ```

2. Install FastMCP using uv:

   ```bash
   uv pip install fastmcp
   ```

3. Set your CapSolver API key:
   ```bash
   export CAPSOLVER_API_KEY="your-capsolver-api-key"
   ```

## Usage

### Running the Service

You can run the service with FastMCP in several ways:

#### Install in Claude Desktop

Install this server in Claude Desktop for immediate interaction:

```bash
fastmcp install src/backlinks_mcp/server.py
```

#### Test with MCP Inspector

For development and testing:

```bash
fastmcp dev src/backlinks_mcp/server.py
```

#### Install in Cursor IDE

In Cursor settings, switch to the MCP tab, click `+Add new global MCP server`, and enter:

```json
{
  "mcpServers": {
    "Backlink MCP": {
      "command": "uvx",
      "args": ["backlinks-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

Alternatively, create a `.cursor/mcp.json` file in the project root with the above content for project-specific MCP servers.

> Obtain the `CAPSOLVER_API_KEY` environment variable [here](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0).

Usage in Cursor:

![Use Backlinks MCP on Cursor](/images/backlinks-mcp-on-cursor.png)

### API Reference

This service exposes the following MCP tool:

#### `get_backlinks_list(domain: str)`

Retrieves a list of backlinks for the specified domain.

**Parameters:**

- `domain` (string): Target domain (e.g., "example.com")

**Returns:**

A list of backlink objects, each containing:

- `anchor`: Backlink anchor text
- `domainRating`: Domain Rating (0-100)
- `title`: Title of the linking page
- `urlFrom`: URL of the page containing the backlink
- `urlTo`: Linked URL
- `edu`: Whether from an educational site
- `gov`: Whether from a government site

**Example Response:**

```json
[
  {
    "anchor": "example link",
    "domainRating": 76,
    "title": "Useful Resources",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

## Development

For development, clone the repository and install dependencies:

```bash
git clone https://github.com/cnych/backlinks-mcp.git
cd backlinks-mcp
uv sync
```

## How It Works

1. The service first attempts to retrieve cached domain signatures.
2. If no valid cache exists, it:
   - Uses CapSolver to bypass Cloudflare Turnstile CAPTCHAs
   - Obtains signatures and validity periods from Ahrefs
   - Caches this information for future use
3. Retrieves backlink data using the signature
4. Processes and returns streamlined backlink information

## Troubleshooting

- **CapSolver API Key Error**: Ensure the `CAPSOLVER_API_KEY` environment variable is correctly set
- **Rate Limiting**: Reduce usage frequency if encountering rate limits
- **No Results**: Some domains may lack backlinks or remain unindexed by Ahrefs
- **Issues**: For troubleshooting, refer to the [Backlinks MCP GitHub repository](https://github.com/cnych/backlinks-mcp)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
