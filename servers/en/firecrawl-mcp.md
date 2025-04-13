---
name: Firecrawl MCP
digest: Firecrawl MCP server providing web crawling capabilities for large language models
author: mendableai
repository: https://github.com/mendableai/firecrawl-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - firecrawl
  - crawler
  - web extraction
icon: https://avatars.githubusercontent.com/u/135057108?s=48&v=4
createTime: 2025-04-09
featured: true
---

Firecrawl MCP is an MCP server implementation that utilizes [Firecrawl](https://firecrawl.dev/) for web crawling, providing advanced web scraping, content extraction, and data processing capabilities for Cursor, Claude, and other MCP clients. It seamlessly integrates with various MCP clients through the Model Context Protocol (MCP), enabling AI systems to directly access and process web content.

## Key Features

- **Advanced Web Crawling**: Supports content extraction from single URLs or batch processing of multiple URLs
- **Intelligent Content Extraction**: Automatically identifies and extracts primary content while filtering irrelevant elements like navigation bars and footers
- **Structured Data Extraction**: Uses LLMs to extract formatted structured data from web pages
- **Web Search**: Directly retrieves and processes search engine results
- **Website Crawling**: Supports recursive website crawling with configurable depth and scope
- **Deep Research**: Conducts in-depth research using intelligent crawling, searching, and LLM analysis
- **Automated LLMs.txt Generation**: Creates standardized LLMs.txt files for websites to define interaction protocols for LLMs
- **Automatic Rate Limit Handling**: Built-in exponential backoff retry mechanism
- **Parallel Processing**: Efficient batch operations and concurrent request handling

:::adsense 8781986491:::

## Installation & Configuration

### Running with npx

```bash
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

### Manual Installation

```bash
npm install -g firecrawl-mcp
```

### Configuring for Cursor 🖥️

Note: Requires Cursor version 0.45.6 or higher. For the latest MCP server configuration instructions, refer to Cursor's official documentation: [Cursor MCP Server Configuration Guide](https://cursor.sh/docs/mcp-server-configuration)

#### Configuring Firecrawl MCP in Cursor v0.45.6

1. Open Cursor Settings
2. Navigate to Features > MCP Servers
3. Click "+ Add New MCP Server"
4. Enter the following:
   - Name: "firecrawl-mcp" (or your preferred name)
   - Type: "command"
   - Command: `env FIRECRAWL_API_KEY=your-api-key npx -y firecrawl-mcp`

#### Configuring Firecrawl MCP in Cursor v0.48.6

1. Open Cursor Settings
2. Navigate to Features > MCP Servers
3. Click "+ Add new global MCP server"
4. Enter the following code:

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

For Windows users encountering issues, try: `cmd /c "set FIRECRAWL_API_KEY=your-api-key && npx -y firecrawl-mcp"`

Replace `your-api-key` with your Firecrawl API key. If you don't have one, create an account and obtain it from https://www.firecrawl.dev/app/api-keys.

After adding, refresh the MCP server list to see the new tool. The Composer Agent will automatically use Firecrawl MCP when appropriate, but you can also explicitly request it by describing your web scraping needs. Access Composer via Command+L (Mac), select "Agent" next to the submit button, and enter your query.

### Running with Windsurf

Add the following to your `./codeium/windsurf/model_config.json` file:

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### Installation via Smithery (Legacy Method)

Automatically install Firecrawl for Claude Desktop through Smithery:

```bash
npx -y @smithery/cli install @mendableai/mcp-server-firecrawl --client claude
```

### Configuration

#### Environment Variables

##### Cloud API Required Variables

- `FIRECRAWL_API_KEY`: Your Firecrawl API key

  - Required when using the cloud API (default)
  - Optional when using self-hosted instances with `FIRECRAWL_API_URL`

- `FIRECRAWL_API_URL` (optional): Custom API endpoint for self-hosted instances
  - Example: `https://firecrawl.your-domain.com`
  - If not provided, the cloud API will be used (requires API key)

##### Optional Configuration

**Retry Configuration**

- `FIRECRAWL_RETRY_MAX_ATTEMPTS`: Maximum retry attempts (default: 3)
- `FIRECRAWL_RETRY_INITIAL_DELAY`: Initial delay before first retry (ms) (default: 1000)
- `FIRECRAWL_RETRY_MAX_DELAY`: Maximum delay between retries (ms) (default: 10000)
- `FIRECRAWL_RETRY_BACKOFF_FACTOR`: Exponential backoff multiplier (default: 2)

**Credit Usage Monitoring**

- `FIRECRAWL_CREDIT_WARNING_THRESHOLD`: Credit usage warning threshold (default: 1000)
- `FIRECRAWL_CREDIT_CRITICAL_THRESHOLD`: Credit usage critical threshold (default: 100)

#### Configuration Examples

**Custom Retry and Credit Monitoring with Cloud API**:

```bash
# Required for cloud API
export FIRECRAWL_API_KEY=your-api-key

# Optional retry configuration
export FIRECRAWL_RETRY_MAX_ATTEMPTS=5        # Increase max retry attempts
export FIRECRAWL_RETRY_INITIAL_DELAY=2000    # Start with 2-second delay
export FIRECRAWL_RETRY_MAX_DELAY=30000       # Maximum 30-second delay
export FIRECRAWL_RETRY_BACKOFF_FACTOR=3      # More aggressive backoff

# Optional credit monitoring
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=2000    # Warn at 2000 credits
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=500    # Critical warning at 500 credits
```

**Self-Hosted Instance**:

```bash
# Required for self-hosted
export FIRECRAWL_API_URL=https://firecrawl.your-domain.com

# Optional authentication for self-hosted
export FIRECRAWL_API_KEY=your-api-key  # If your instance requires authentication

# Custom retry configuration
export FIRECRAWL_RETRY_MAX_ATTEMPTS=10
export FIRECRAWL_RETRY_INITIAL_DELAY=500     # Faster initial retry
```

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY_HERE",

        "FIRECRAWL_RETRY_MAX_ATTEMPTS": "5",
        "FIRECRAWL_RETRY_INITIAL_DELAY": "2000",
        "FIRECRAWL_RETRY_MAX_DELAY": "30000",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR": "3",

        "FIRECRAWL_CREDIT_WARNING_THRESHOLD": "2000",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD": "500"
      }
    }
  }
}
```

## Configuration Options

The Firecrawl MCP server offers various configurable options:

### Retry Configuration

```javascript
retry: {
  maxAttempts: 3,    // Number of retries for rate-limited requests
  initialDelay: 1000, // Initial delay before first retry (ms)
  maxDelay: 10000,    // Maximum delay between retries (ms)
  backoffFactor: 2,   // Exponential backoff factor
}
```

### Credit Monitoring

```javascript
credit: {
  warningThreshold: 1000, // Warning level for credit usage
  criticalThreshold: 100,  // Critical warning level for credit usage
}
```

These configurations control:

1. **Retry Behavior**

   - Automatic retries for rate-limited requests
   - Exponential backoff to prevent API flooding
   - Example: With default settings, retries will occur at:
     - First retry: 1-second delay
     - Second retry: 2-second delay
     - Third retry: 4-second delay (capped at maxDelay)

2. **Credit Monitoring**
   - Tracks cloud API credit consumption
   - Provides warnings at specified thresholds
   - Helps prevent unexpected service interruptions
   - Example: With default settings:
     - Warning at 1000 remaining credits
     - Critical warning at 100 remaining credits

## Rate Limiting & Batching

The server leverages Firecrawl's built-in rate limiting and batching capabilities:

- Automatic rate limit handling with exponential backoff
- Efficient parallel processing for batch operations
- Intelligent request queuing and throttling
- Automatic retries for transient errors

## Available Tools

### 1. Scrape Tool (`firecrawl_scrape`)

Extracts content from a single URL with advanced options.

```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "waitFor": 1000,
    "timeout": 30000,
    "mobile": false,
    "includeTags": ["article", "main"],
    "excludeTags": ["nav", "footer"],
    "skipTlsVerification": false
  }
}
```

### 2. Batch Scrape Tool (`firecrawl_batch_scrape`)

Efficiently extracts content from multiple URLs with built-in rate limiting and parallel processing.

```json
{
  "name": "firecrawl_batch_scrape",
  "arguments": {
    "urls": ["https://example1.com", "https://example2.com"],
    "options": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

Response includes an operation ID for status checking:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Batch operation queued with ID: batch_1. Use firecrawl_check_batch_status to check progress."
    }
  ],
  "isError": false
}
```

### 3. Check Batch Status (`firecrawl_check_batch_status`)

Checks the status of batch operations.

```json
{
  "name": "firecrawl_check_batch_status",
  "arguments": {
    "id": "batch_1"
  }
}
```

### 4. Search Tool (`firecrawl_search`)

Searches the web and optionally extracts content from results.

```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "your search query",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

### 5. Crawl Tool (`firecrawl_crawl`)

Initiates asynchronous crawling with advanced options.

```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
```

### 6. Extract Tool (`firecrawl_extract`)

Extracts structured information from web pages using LLM capabilities. Supports both cloud AI and self-hosted LLM extraction.

```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "Extract product information including name, price, and description",
    "systemPrompt": "You are an assistant helping extract product information",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
```

Sample response:

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "name": "Sample Product",
        "price": 99.99,
        "description": "This is a sample product description"
      }
    }
  ],
  "isError": false
}
```

#### Extract Tool Options:

- `urls`: Array of URLs to extract information from
- `prompt`: Custom prompt for LLM extraction
- `systemPrompt`: System prompt to guide the LLM
- `schema`: JSON schema for structured data extraction
- `allowExternalLinks`: Allow extraction from external links
- `enableWebSearch`: Enable web search for additional context
- `includeSubdomains`: Include subdomains in extraction

When using self-hosted instances, extraction will utilize your configured LLM. For cloud API, it uses Firecrawl's managed LLM service.

### 7. Deep Research Tool (`firecrawl_deep_research`)

Conducts in-depth web research on queries using intelligent crawling, searching, and LLM analysis.

```json
{
  "name": "firecrawl_deep_research",
  "arguments": {
    "query": "How does carbon capture technology work?",
    "maxDepth": 3,
    "timeLimit": 120,
    "maxUrls": 50
  }
}
```

Parameters:

- query (string, required): The research question or topic to explore.
- maxDepth (number, optional): Maximum recursive depth for crawling/searching (default: 3).
- timeLimit (number, optional): Time limit for research session in seconds (default: 120).
- maxUrls (number, optional): Maximum number of URLs to analyze (default: 50).

Returns:

- Final analysis generated by LLM based on research (data.finalAnalysis)
- May also include structured activities and sources used during research

### 8. Generate LLMs.txt Tool (`firecrawl_generate_llmstxt`)

Generates a standardized `llms.txt` file for a given domain, defining how large language models should interact with the website.

```json
{
  "name": "firecrawl_generate_llmstxt",
  "arguments": {
    "url": "https://example.com",
    "maxUrls": 20,
    "showFullText": true
  }
}
```

Parameters:

- url (string, required): Base URL of website to analyze.
- maxUrls (number, optional): Maximum number of URLs to include (default: 10).
- showFullText (boolean, optional): Whether to include llms-full.txt content in response.

Returns:

- Generated `llms.txt` file content, optionally including `llms-full.txt` (`data.llmstxt` and/or `data.llmsfulltxt`)

## Logging System

The server includes comprehensive logging:

- Operation status and progress
- Performance metrics
- Credit usage monitoring
- Rate limit tracking
- Error conditions

Sample log messages:

```
[INFO] Firecrawl MCP Server successfully initialized
[INFO] Beginning scrape for URL: https://example.com
[INFO] Batch operation queued with ID: batch_1
[WARNING] Credit usage has reached warning threshold
[ERROR] Rate limit exceeded, retrying in 2 seconds...
```

## Error Handling

The server provides robust error handling:

- Automatic retries for transient errors
- Rate limit handling with backoff strategy
- Detailed error messages
- Credit usage warnings
- Network resilience

Error response example:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Rate limit exceeded. Retrying in 2 seconds..."
    }
  ],
  "isError": true
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

### Contributing

1. Fork the repository
2. Create your feature branch
3. Run tests: `npm test`
4. Submit a pull request

## License

MIT License - See LICENSE file for details
