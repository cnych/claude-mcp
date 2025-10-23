# Claude MCP Community Website

![MCP Logo](/public/logo.png)

This repository contains the source code for [claudemcp.com](https://www.claudemcp.com), a community website for the Model Context Protocol (MCP). The site serves as a hub for MCP documentation, server directory, client information, and community resources.

## 📋 MCP Servers and Clients

### Featured MCP Servers

The following MCP servers are currently documented on the website:

- **[Apify MCP](https://www.claudemcp.com/servers/apify-mcp)** - Deploy and interact with Apify Actors for web scraping, data extraction, and automation tasks through the Model Context Protocol
- **[Backlinks MCP](https://www.claudemcp.com/servers/backlinks-mcp)** - Server for retrieving backlinks information for domains
- **[Blender MCP](https://github.com/ahujasid/blender-mcp)** - Integration with Blender 3D modeling software
- **[Brave Search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)** - Web search capabilities using Brave's search engine
- **[Claudflare](https://www.claudemcp.com/servers/cloudflare)** - Integration with Cloudflare services
- **[Crawlbase MCP](https://github.com/crawlbase/crawlbase-mcp)** - Connects AI agents and LLMs with real-time web data using Crawlbase’s battle-tested scraping, JavaScript rendering, and anti-bot protection. Supports `crawl`, `crawl_markdown`, and `crawl_screenshot` commands. SDKs available in Node.js, Python, Java, PHP, and .NET.
- **[Fetch](https://www.claudemcp.com/servers/fetch)** - Web content fetching and processing
- **[Figma Context](https://github.com/glips/figma-context-mcp)** - Access and manipulation of Figma designs
- **[Firecrawl](https://github.com/mendableai/firecrawl-mcp-server)** - Advanced web scraping and crawling capabilities
- **Filesystem** - Secure file system operations with configurable access
- **Git** - Git repository operations and management
- **GitHub** - GitHub API integration for repository management
- **Google Drive** - Access and management of Google Drive files
- **[Hive Intelligence](https://github.com/hive-intel/hive-crypto-mcp)** - Ultimate cryptocurrency MCP for AI assistants with unified access to crypto, DeFi, and Web3 analytics
- **[Linked API MCP](https://github.com/Linked-API/linkedapi-mcp)** - MCP server that lets AI assistants control LinkedIn accounts and retrieve real-time data
- **[Keboola MCP](https://www.claudemcp.com/servers/keboola-mcp)** - 
- **Playwright** - Browser automation and testing
- **PostgreSQL** - PostgreSQL database interactions
- **Puppeteer** - Headless browser automation
- **SQLite** - SQLite database interactions
- **Zapier** - Integration with thousands of web services through Zapier
- **[Oracle OCI](https://github.com/jopsis/mcp-server-oci)** - Implements a MCP server for Oracle Cloud Infrastructure, allowing to interact directly with OCI resources

### Featured MCP Clients

The website features information about these MCP client applications:

- **Claude Desktop** - Official desktop application by Anthropic
- **Continue** - AI-powered software development environment
- **Cursor** - Code editor with AI assistant capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/cnych/claude-mcp.git
cd claude-mcp
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Structure

- `/src/app/[locale]` - Application routes with internationalization support
- `/src/components` - Reusable UI components
- `/src/i18n` - Internationalization configuration
- `/src/messages` - Translation files for multiple languages
- `/servers` - Content files for MCP servers
- `/clients` - Content files for MCP clients
- `/docs` - Documentation content files
- `/blogs` - Blog post content files

## 🌐 Internationalization

The website supports the following languages:

- English (en)
- Korean (ko)
- Simplified Chinese (zh)
- Traditional Chinese (tw)

To add content in a specific language, place your files in the corresponding language directory under the content folders.

## 🤝 Contributing

We welcome contributions to the Claude MCP Community website! Here are ways you can contribute:

### Contributing Servers

1. Fork the repository
2. Create a new file in the `/servers/{locale}` directory following the existing format
3. Submit a pull request with your server information

Alternatively, use the "Submit a Server" button on the [Servers page](https://www.claudemcp.com/servers) to create a pull request directly.

### Contributing to the Website

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

### Translation Contributions

We appreciate help with translations. To contribute:

1. Check the `/src/messages` directory for translation files
2. Add or improve translations for your language
3. Submit a pull request with your changes
