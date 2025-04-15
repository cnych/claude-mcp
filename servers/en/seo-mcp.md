---
name: SEO MCP
digest: MCP is a free SEO tool powered by Ahrefs data, offering key features like backlink analysis and keyword research to help optimize websites and improve search rankings.
author: cnych
homepage: https://github.com/cnych/seo-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - Ahrefs
  - backlinks
  - keywords
icon: https://avatars.githubusercontent.com/u/3094973?v=4
createTime: 2025-04-14
featured: true
---

A free SEO tool MCP (Model Control Protocol) service based on Ahrefs data. Includes features such as backlinks, keyword ideas, and more. The project is for learning purposes only. Please do not abuse it, or you will bear the consequences.

## Overview

This service provides APIs to retrieve SEO data for websites. It handles the entire process, including captcha solving, authentication, and fetching data from Ahrefs.

> This MCP service is for learning purposes only. Please do not abuse it, or you will bear the consequences. This project was inspired by the `@GoFei Community`.

## Features

- Retrieve backlink data for any domain
- Get keyword ideas and SEO suggestions
- Automatically solve captchas using CapSolver
- Signature caching to reduce API calls
- Fast and efficient data retrieval
- Simplified output providing the most relevant SEO information

## Installation

### Prerequisites

- Python 3.10 or higher
- CapSolver account and API key
- `pip` or `uv` installed (on macOS, you may need to install with `brew install uv`)

### Install from PyPI

```bash
pip install seo-mcp
```

Or use `uv`:

```bash
uv pip install seo-mcp
```

### Manual Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cnych/seo-mcp.git
   cd seo-mcp
   ```

2. Install dependencies using pip or uv:

   ```bash
   pip install -e .
   # or
   uv pip install -e .
   ```

3. Set the CapSolver API key:

   ```bash
   export CAPSOLVER_API_KEY="your-capsolver-api-key"
   ```

## Usage

### Running the service

You can run the service in several ways:

#### Install in Claude Desktop

```bash
fastmcp install src/seo_mcp/server.py
```

#### Use MCP Inspector for testing

```bash
fastmcp dev src/seo_mcp/server.py
```

#### Install in Cursor IDE

In the Cursor settings, switch to the MCP tab, click the `+ Add new global MCP service` button, and then input the following content:

```json
{
  "mcpServers": {
    "SEO MCP": {
      "command": "uvx",
      "args": ["--python 3.10", "seo-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

![Use SEO MCP Backlinks Tool on Cursor](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-03c59e1e.png)

![Use SEO MCP Keyword Tool on Cursor](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-a188f668.png)

### API Reference

The service exposes the following MCP tools:

#### `get_backlinks_list(domain: str)`

Retrieve the backlink list for a specified domain.

**Parameters:**

- `domain` (string): The domain to query (e.g. "example.com")

**Returns:**

A list of backlink objects, each containing:

- `anchor`：The anchor text of the backlink
- `domainRating`：The domain rating (0-100)
- `title`：The title of the linked page
- `urlFrom`：The URL of the page containing the backlink
- `urlTo`：The URL of the page being linked to
- `edu`：A boolean value indicating whether the backlink is from an educational website
- `gov`：A boolean value indicating whether the backlink is from a government website

**Example Response:**

```json
[
  {
    "anchor": "Example link",
    "domainRating": 76,
    "title": "Useful resource",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

#### `keyword_generator(keyword: str, country: str = "us", search_engine: str = "Google")`

Get creative and SEO suggestions for a specified keyword.

**Parameters:**

- `keyword` (string): The keyword to query
- `country` (string): The country code (e.g. "us")
- `search_engine` (string): The search engine (e.g. "Google")

**Returns:**

- A list of keyword ideas, containing two types:

  - `keyword ideas`：Regular keyword suggestions, containing keyword, country, difficulty, volume, and update time
  - `question ideas`：Question-based keyword suggestions, with the same format

  Each keyword object contains:

  - `keyword`：The keyword text
  - `country`：The country code
  - `difficulty`：The difficulty rating (Easy, Medium, Hard, or Unknown)
  - `volume`：The search volume level (e.g. MoreThanOneHundred, MoreThanOneThousand)
  - `updatedAt`：The data update time

## Development

For development purposes, you can clone the repository and install the development dependencies:

```bash
git clone https://github.com/cnych/seo-mcp.git
cd seo-mcp
uv sync  # or use pip install -e .
```

## How it works

1. The service first attempts to retrieve the cached signature of the domain
2. If no valid cache exists, it will:
   - Use CapSolver to solve the Cloudflare Turnstile captcha
   - Retrieve the signature and expiration date from Ahrefs
   - Cache this information for future use
3. Use the signature to retrieve SEO data
4. Process and return simplified SEO information

## Troubleshooting

- **CapSolver API key error**：Ensure the `CAPSOLVER_API_KEY` environment variable is correctly set
- **Rate limiting**：If you encounter rate limiting, try reducing the frequency of using the service
- **No results**：Some domains may have no backlinks or not indexed by Ahrefs

## License

This project is licensed under the MIT License - see the LICENSE file for details.
