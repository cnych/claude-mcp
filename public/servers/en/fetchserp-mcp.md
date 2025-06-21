
# FetchSERP MCP Server

A Model Context Protocol (MCP) server that exposes the FetchSERP API for SEO, SERP analysis, web scraping, and keyword research.

## Features

This MCP server provides access to all FetchSERP API endpoints:

### SEO & Analysis
- **Domain Analysis**: Get backlinks, domain info (DNS, WHOIS, SSL, tech stack)
- **Keyword Research**: Search volume, suggestions, long-tail keyword generation
- **SEO Analysis**: Comprehensive webpage SEO analysis
- **AI Analysis**: AI-powered webpage analysis with custom prompts
- **Moz Integration**: Domain authority and Moz metrics

### SERP & Search
- **Search Results**: Get SERP results from Google, Bing, Yahoo, DuckDuckGo
- **AI Overview**: Google's AI overview with JavaScript rendering
- **Enhanced Results**: SERP with HTML or text content
- **Ranking Check**: Domain ranking for specific keywords
- **Indexation Check**: Verify if pages are indexed

### Web Scraping
- **Basic Scraping**: Scrape webpages without JavaScript
- **JS Scraping**: Execute custom JavaScript on pages
- **Proxy Scraping**: Scrape with country-specific proxies
- **Domain Scraping**: Scrape multiple pages from a domain

### User Management
- **Account Info**: Check API credits and user information

## Installation

**No installation required!** This MCP server runs directly from GitHub using npx.

**Get your FetchSERP API token**: Sign up at [https://www.fetchserp.com](https://www.fetchserp.com) to get your API token. New users get 250 free credits to get started!

## Usage

### Configuration

Add this server to your MCP client configuration. For example, in Claude Desktop:

```json
{
  "mcpServers": {
    "fetchserp": {
      "command": "npx",
      "args": [
        "github:fetchSERP/fetchserp-mcp-server-node"
      ],
      "env": {
        "FETCHSERP_API_TOKEN": "your_fetchserp_api_token_here"
      }
    }
  }
}
```

## Available Tools

### Domain & SEO Analysis

#### `get_backlinks`
Get backlinks for a domain
- **domain** (required): Target domain
- **search_engine**: google, bing, yahoo, duckduckgo (default: google)
- **country**: Country code (default: us)
- **pages_number**: Pages to search 1-30 (default: 15)

#### `get_domain_info`
Get comprehensive domain information
- **domain** (required): Target domain

#### `get_domain_emails`
Extract emails from a domain
- **domain** (required): Target domain
- **search_engine**: Search engine (default: google)
- **country**: Country code (default: us)
- **pages_number**: Pages to search 1-30 (default: 1)

#### `get_webpage_seo_analysis`
Comprehensive SEO analysis of a webpage
- **url** (required): URL to analyze

#### `get_webpage_ai_analysis`
AI-powered webpage analysis
- **url** (required): URL to analyze
- **prompt** (required): Analysis prompt

#### `get_moz_analysis`
Get Moz domain authority and metrics
- **domain** (required): Target domain

### Keyword Research

#### `get_keywords_search_volume`
Get search volume for keywords
- **keywords** (required): Array of keywords
- **country**: Country code

#### `get_keywords_suggestions`
Get keyword suggestions
- **url**: URL to analyze (optional if keywords provided)
- **keywords**: Array of seed keywords (optional if url provided)
- **country**: Country code

#### `get_long_tail_keywords`
Generate long-tail keywords
- **keyword** (required): Seed keyword
- **search_intent**: informational, commercial, transactional, navigational (default: informational)
- **count**: Number to generate 1-500 (default: 10)

### SERP & Search

#### `get_serp_results`
Get search engine results
- **query** (required): Search query
- **search_engine**: google, bing, yahoo, duckduckgo (default: google)
- **country**: Country code (default: us)
- **pages_number**: Pages to search 1-30 (default: 1)

#### `get_serp_html`
Get SERP results with HTML content
- Same parameters as `get_serp_results`

#### `get_serp_text`
Get SERP results with text content
- Same parameters as `get_serp_results`

#### `get_serp_js_start`
Start AI Overview SERP job (returns UUID)
- **query** (required): Search query
- **country**: Country code (default: us)
- **pages_number**: Pages to search 1-10 (default: 1)

#### `get_serp_js_result`
Get AI Overview SERP results
- **uuid** (required): UUID from start job

#### `check_page_indexation`
Check if domain is indexed for keyword
- **domain** (required): Target domain
- **keyword** (required): Search keyword

#### `get_domain_ranking`
Get domain ranking for keyword
- **keyword** (required): Search keyword
- **domain** (required): Target domain
- **search_engine**: Search engine (default: google)
- **country**: Country code (default: us)
- **pages_number**: Pages to search 1-30 (default: 10)

### Web Scraping

#### `scrape_webpage`
Scrape webpage without JavaScript
- **url** (required): URL to scrape

#### `scrape_domain`
Scrape multiple pages from domain
- **domain** (required): Target domain
- **max_pages**: Maximum pages to scrape, up to 200 (default: 10)

#### `scrape_webpage_js`
Scrape webpage with custom JavaScript
- **url** (required): URL to scrape
- **js_script** (required): JavaScript code to execute

#### `scrape_webpage_js_proxy`
Scrape webpage with JavaScript and proxy
- **url** (required): URL to scrape
- **country** (required): Proxy country
- **js_script** (required): JavaScript code to execute

### User Management

#### `get_user_info`
Get user information and API credits
- No parameters required

## API Token

You need a FetchSERP API token to use this server. 

**Getting your API token:**
1. Sign up at [https://www.fetchserp.com](https://www.fetchserp.com)
2. New users automatically receive **250 free credits** to get started
3. Your API token will be available in your dashboard

Set the token as an environment variable:
```bash
export FETCHSERP_API_TOKEN="your_token_here"
```

## Error Handling

The server includes comprehensive error handling:
- Missing API token validation
- API response error handling
- Input validation
- Proper MCP error responses

## Requirements

- Node.js 18+
- FetchSERP API token
- Internet connection

## License

MIT License

## Support

For API-related questions, contact FetchSERP at contact@fetchserp.com
For MCP server issues, please create an issue in this repository. 
