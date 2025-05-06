---
name: mcp-server-webcrawl
digest: Search and retrieval for web crawler content. Connect to your crawls to using advanced filtering and content retrieval.
author: pragmar
repository: https://github.com/pragmar/mcp_server_webcrawl
homepage: https://pragmar.com/mcp-server-webcrawl/
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - crawler
  - search
  - indexing
icon: https://pragmar.com/media/static/images/home/mcp-server-webcrawl.png
createTime: 2025-03-26
---

A Model Context Protocol (MCP) server that provides search and retrieval capabilities for web crawlers. This server enables MCP clients to search and access web content across crawled sites using advanced filtering.

## Features

🔍 **Fulltext Search**. Filter web content for keywords, tags, CSS classes, and more.

🔬 **Advanced Search**. Search by status, content types, and/or website.

🕸️ **Multicrawler Support**. Support for WARC, wget, InterroBot, Katana, and SiteOne crawlers.

✂️ **API Context Shaping**. Field option determining API returns allows for lighter contexts in LLM interactions.

## Installation

Requires Python 3.10 or higher.

### Using pip

Install the package with pip:

```bash
pip install mcp-server-webcrawl
```

## Configuration

Configuration varies by crawler. Be sure to replace --datasource example with your target path.

### wget Configuration

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "wget", "--datasrc", "/path/to/wget/archives/"]
    }
  }
}
```

**Tested wget commands:**

```bash
# --adjust-extension for file extensions, e.g. *.html
wget --mirror https://example.com
wget --mirror https://example.com --adjust-extension
```

### WARC Configuration

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "warc", "--datasrc", "/path/to/warc/archives/"]
    }
  }
}
```

**Tested wget commands for WARC:**

```bash
wget --warc-file=example --recursive https://example.com
wget --warc-file=example --recursive --page-requisites https://example.com
```

### InterroBot Configuration

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": [
        "--crawler",
        "interrobot",
        "--datasrc",
        "/home/user/Documents/InterroBot/interrobot.v2.db"
      ]
    }
  }
}
```

**Notes:**

- Crawls must be run from within InterroBot (windowed)
- macOS/Windows: --datasource path is provided on InterroBot options page

### Katana Configuration

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "katana", "--datasrc", "/path/to/katana/crawls/"]
    }
  }
}
```

**Tested Katana command:**

```bash
# -store-response to save crawl contents
# -store-response-dir allows for many site crawls in one dir
katana -u https://example.com -store-response -store-response-dir crawls/
```

### SiteOne Configuration

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": [
        "--crawler",
        "siteone",
        "--datasrc",
        "/path/to/siteone/archives/"
      ]
    }
  }
}
```

**Notes:**

- Crawls must be run from within SiteOne (windowed)
- "Generate offline website" must be checked

## Available Tools

### `webcrawl_sites`

Retrieves a list of sites (project websites or crawl directories).

**Optional Parameters**

- `fields` (array of strings, optional): Additional fields to include in the response beyond the defaults (id, url). Options include:
- `ids` (array of integers, optional): List of project IDs to filter by. Leave empty for all projects.

**Optional Fields**

- `modified` ISO 8601 timestamp of last modification
- `created` ISO 8601 timestamp of creation
- `robots` Robots.txt information (limited support)

**Example Usage**

List all crawled sites, "Can you list web crawls?"

Get basic crawl information for a site, "Can you get web crawl info for example.com?"

### `webcrawl_search`

Searches for resources (webpages, CSS, PDF, etc.) across projects and retrieves specified fields.

**Optional Parameters:**

- `query` (string, optional): Fulltext search query string. Supports fulltext and boolean operators, syntax consistent with SQLite FTS5 in boolean mode (AND, OR, NOT, quoted phrases, suffix wildcards).
- `sites` (array of integers, optional): List of project IDs to filter search results to specific sites.
- `limit` (integer, optional): Maximum number of results to return. Default is 20, max is 100.
- `offset` (integer, optional): Number of results to skip for pagination. Default is 0.
- `sort` (string, optional): Sort order for results. Prefixed with `+` for ascending, `-` for descending.
- `statuses` (array of integers, optional): Filter by HTTP status codes (e.g., [200] for successful responses, [404, 500] for errors).
- `types` (array of strings, optional): Filter for specific resource types.
- `thumbnails` (boolean, optional): Enable base64 encoded data for image thumbnails. Default is false.
- `fields` (array of strings, optional): Additional fields to include in the response beyond the defaults (id, URL, status). Empty list means default fields only. The content field can lead to large results and should be used judiciously with LIMIT.:
- `ids` (array of integers, optional): Retrieve specific resources directly by their IDs.

**Optional Fields**

- `created`: ISO 8601 timestamp of creation
- `modified`: ISO 8601 timestamp of last modification
- `content`: The actual content of the resource, if text/\* (HTML/CSS/JS/plain)
- `name`: Resource name or title information
- `size`: File size information
- `time`: Time-related metrics for the resource (support varies by crawler type)
- `headers`: HTTP headers associated with the resource (support varies by crawler type)

**Sort Options**

- `+id`, `-id`: Sort by resource ID
- `+url`, `-url`: Sort by resource URL
- `+status`, `-status`: Sort by HTTP status code
- `?`: Random sort (useful for statistical sampling)

**Example Usage:**

Search a website for keyword, "Can you search the example.com crawl for keyword?"

Search and summarize filtered content, "Can you search web crawls for keyword, collect content, and summarize?"

Get image information, "Can you list images in the example.com web crawl?"

Find 404 errors with keyword (WARC/Katana/InterroBot), "Can you search the example.com crawl for 404 errors?"

## License

This project is licensed under the MPL 2.0 License. See the LICENSE file in the repository for details.
