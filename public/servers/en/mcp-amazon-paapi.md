---
name: Amazon Product Advertising
digest: Wraps Amazon’s Product Advertising API 5.0, providing keyword search and ASIN lookup endpoints that return products with your Associate partner-tagged URLs.
author: jademind
repository: https://github.com/jademind/mcp-amazon-paapi
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - amzaon
  - affiliate
  - pa-api
icon: https://www.svgrepo.com/show/475634/amazon-color.svg
createTime: 2025-06-19
---

## What is this project?

Amazon PA-API MCP is a micro-service that exposes a tiny, opinionated slice of the [Amazon Product Advertising API 5.0](https://webservices.amazon.com/paapi5/documentation/) as two simple MCP endpoints.  
Its goal is to let bots, scripts, or other MCP clients fetch Amazon product data without touching the raw PA-API SDK or signing any AWS requests. All the heavy lifting—authentication, request signing, pagination, and partner-tag handling—happens inside the service.

### Why would I use it?

- **Affiliate ready** – Every `Item` the service returns already contains a clickable product URL with your Associate partner tag, so you can drop the link straight into a chat or web page and start earning referral fees.
- **Zero SDK boilerplate** – Call it like any other MCP tool: pass a search term or an ASIN and get a typed Python object back. No need to learn Amazon’s PA-API request schema, hashing rules, or error codes.
- **Isolated runtime** – The service runs under `uv`, meaning it spins up in its own virtual environment. It never pollutes your system Python and remains reproducible in CI.

### How does it work?

Internally the MCP maps directly to two PA-API operations:

| MCP function   | PA-API operation | Purpose                                                                                                                                |
| -------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `search_items` | **SearchItems**  | Full-text search across any marketplace. Accepts keywords, optional category, result-count limit, and sort order.                      |
| `get_item`     | **GetItems**     | Retrieves the complete catalog record for one ASIN, including title, images, pricing, ratings, and the partner-tagged detail page URL. |

### Requirements

- Python 3.11 or newer
- A valid Amazon Product Advertising API account (access key, secret key, and associate tag)
- uv to launch the isolated runtime

## Integration in Claude & Cursor

For configuring host, region and markeplace, consult the [Locale Reference for Product Advertising API](https://webservices.amazon.com/paapi5/documentation/locale-reference.html) documentation.

```json
{
  "mcpServers": {
    "amazon-paapi": {
      "command": "uvx",
      "args": ["mcp-amazon-paapi"],
      "env": {
        "PAAPI_ACCESS_KEY": "your-access-key",
        "PAAPI_SECRET_KEY": "your-secret-key",
        "PAAPI_PARTNER_TAG": "your-partner-tag",
        "PAAPI_HOST": "webservices.amazon.de",
        "PAAPI_REGION": "eu-west-1",
        "PAAPI_MARKETPLACE": "www.amazon.de"
      }
    }
  }
}
```
