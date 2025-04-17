---
name: Bright Data
digest: Access public web data through the Bright Data API
author: Bright Data 
homepage: https://brightdata.com
repository: https://github.com/luminati-io/brightdata-mcp
capabilities:
  resources: true
  tools: true
tags:
  - web-scraping
  - data-collection
  - api
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
featured: true
---
Official Bright Data MCP server that enables LLMs to access public web data. This server allows MCP clients like Claude Desktop, Cursor, Windsurf, OpenAI Agents and others make decisions based on the information available on the web.

## Features
- **Web Data Access**: Retrieve information from public websites and web services
- **Browser Control**: Optional browser automation for complex web interactions
- **Smart Data Extraction**: Efficiently process and return relevant web content

## Tools
#### Web Search & Scraping
- **search_engine**: Search Google, Bing, or Yandex and get results in markdown format
- **scrape_as_markdown**: Extract webpage content as Markdown
- **scrape_as_html**: Extract webpage content as HTML
- **session_stats**: View tool usage statistics for the current session

#### Structured Data Extraction
- **web_data_amazon_product**: Extract structured Amazon product data
- **web_data_amazon_product_reviews**: Extract Amazon product reviews
- **web_data_linkedin_person_profile**: Extract LinkedIn person profiles
- **web_data_linkedin_company_profile**: Extract LinkedIn company profiles

#### Browser Control Tools (with BROWSER_AUTH)
- **scraping_browser_navigate**: Navigate to a URL
- **scraping_browser_go_back**: Go back to the previous page
- **scraping_browser_go_forward**: Go forward to the next page
- **scraping_browser_links**: Get all links on the current page
- **scraping_browser_click**: Click on an element
- **scraping_browser_type**: Type text into an element
- **scraping_browser_wait_for**: Wait for an element to appear
- **scraping_browser_screenshot**: Take a screenshot
- **scraping_browser_get_html**: Get the HTML content of the page
- **scraping_browser_get_text**: Get the text content of the page

## Configuration
### Getting an API Key
1. Make sure you have an account on [brightdata.com](https://brightdata.com) (new users get free credit for testing)
2. Get your API key from the [user settings page](https://brightdata.com/cp/setting/users)
3. Create a Web Unlocker proxy zone called `mcp_unlocker` in your [control panel](https://brightdata.com/cp/zones)
    - You can override this zone with the env variable `WEB_UNLOCKER_ZONE`
4. (Optional) For browser control tools:
   - Create a "scraping browser" zone in your Brightdata control panel
   - Copy the authentication string from the Scraping Browser overview tab

### Usage with Claude Desktop
Add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<insert-your-api-token-here>",
        "WEB_UNLOCKER_ZONE": "<optional override for zone name>",
        "BROWSER_AUTH": "<optional for browser control tools>"
      }
    }
  }
}
```
---
## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
