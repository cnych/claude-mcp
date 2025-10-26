---
name: Claude MCP Server Gateway
digest: Intelligent gateway for dynamic MCP server loading with 97% token reduction
author: bzsasson
homepage: https://github.com/bzsasson/claude-mcp-server-gateway
repository: https://github.com/bzsasson/claude-mcp-server-gateway
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - gateway
  - optimization
  - infrastructure
  - token-management
  - dynamic-loading
  - context-management
  - python
icon: https://cdn.simpleicons.org/python
createTime: 2025-10-26T00:00:00Z
---

A Python-based intelligent gateway that implements dynamic loading for Model Context Protocol servers. Instead of loading 100+ tools from multiple MCPs at startup (consuming 87% of Claude's context), the gateway loads only 3 tools (~600 tokens). MCP servers load on-demand only when Claude needs them, reducing startup token usage by 97% (from ~21,600 to ~50 tokens).

## Overview

When you connect Claude Desktop to multiple MCP servers like GitHub, Slack, Google Drive, Filesystem, and Postgres, something terrible happens before you even ask a question:

- GitHub MCP: 51 tools → 10,200 tokens
- Slack MCP: 20 tools → 4,000 tokens
- Google Drive MCP: 15 tools → 3,000 tokens
- Filesystem MCP: 12 tools → 2,400 tokens
- Postgres MCP: 10 tools → 2,000 tokens

**Total: 108 tools consuming 21,600 tokens — that's 87% of Claude's 25,000 token context window.**

The Claude MCP Server Gateway solves this by acting as a master MCP server that manages all other MCP servers dynamically.

### Traditional vs Gateway Approach

- **Traditional MCP Setup**: Claude → 108 tools loaded → 87% context consumed
- **Gateway Approach**: Claude → 3 gateway tools → MCP servers load as needed → 97% context available

## Key Features

- **97% Token Reduction**: From ~21,600 tokens → ~50 tokens at startup
- **Dynamic Loading**: MCP servers load only when their tools are needed
- **Three-Tier Progressive Loading**:
  1. **Server Discovery**: Lists available MCPs (~50 tokens)
  2. **Tool Summaries**: Loads brief descriptions (~300 tokens)
  3. **Full Execution**: Loads complete schemas only when calling tools
- **Universal Compatibility**: Works with any MCP server (Python, Node.js, TypeScript, Docker, HTTP+SSE)
- **Pre-configured Servers**: GitHub, Slack, Google Drive, Memory, Filesystem, Postgres, DataForSEO, Google Analytics, and more
- **Multi-Platform Support**: Claude Desktop, Claude API, and Claude Code
- **Intelligent Management**: Automatic connection lifecycle and error handling
- **Service Mesh Pattern**: Implements service discovery, load balancing, and circuit breaking for MCP servers

## How It Works

### Three-Tier Architecture

**Level 1 - Server Discovery** (~50 tokens)
```
Available MCP Servers:
- github: Repository management, issues, pull requests, code analysis
- slack: Team communication, channels, message history
- google-drive: File storage, document access, search
```

**Level 2 - Tool Summaries** (~300 tokens)
```
GitHub MCP Tools (51 total):
- search_repositories: Find GitHub repositories by query
- create_issue: Create new issues in repositories
- get_pull_request: Retrieve PR details and status
...
```

**Level 3 - Full Execution** (~10,200 tokens for GitHub)
```json
{
  "name": "create_issue",
  "description": "Create a new issue in a GitHub repository.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "owner": {"type": "string"},
      "repo": {"type": "string"},
      "title": {"type": "string"}
    }
  }
}
```

### Real-World Example

When you ask: "Find all open issues in the microsoft/vscode repository with the 'bug' label"

1. Claude checks available servers (50 tokens used)
2. Loads GitHub tool summaries (350 tokens total)
3. Executes `list_issues` tool (10,550 tokens total)
4. Returns results

**Without Gateway**: 21,600 tokens used immediately before you even start
**With Gateway**: 10,550 tokens used only when actually needed

## Tools

1. `list_available_mcps`
   - List all available MCP servers and their capabilities
   - No inputs required
   - Returns: List of MCP servers with descriptions and status

2. `load_mcp_tools`
   - Load and list available tools from a specific MCP server
   - Inputs:
     - `mcp_name` (string): Name of the MCP server
   - Returns: List of available tools with descriptions

3. `call_mcp_tool`
   - Call a specific tool from an MCP server
   - Inputs:
     - `mcp_name` (string): Name of the MCP server
     - `tool_name` (string): Name of the tool to call
     - `arguments` (object, optional): Arguments to pass to the tool
   - Returns: Result from the tool execution

## Pre-configured MCP Servers

The gateway comes with popular MCP servers pre-configured:

- **GitHub**: Complete GitHub integration (51 tools)
- **Context7**: Current code documentation lookup
- **DataForSEO**: SERP data, keyword research, backlink analysis
- **Google Analytics**: Analytics reporting and metrics
- **Google Search Console**: Search performance and indexing
- **Google Workspace**: Gmail, Drive, Calendar, Docs, Sheets integration
- **Slack**: Team communication and channel management
- **Memory Extension Pro**: Persistent memory with semantic search
- **Apify Actors**: Web scraping and automation workflows

## Installation

### Prerequisites

- Python 3.11+
- Claude Desktop, Claude API access, or Claude Code
- MCP servers you want to use (with appropriate API keys)

### Quick Start

```bash
# 1. Clone the gateway repository
git clone https://github.com/bzsasson/claude-mcp-server-gateway.git
cd claude-mcp-server-gateway

# 2. Set up Python environment
python3.11 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure your MCP servers
cp .env.example .env
# Edit .env with your API keys

# 5. Configure Claude Desktop (see below)
```

### Environment Configuration

Create a `.env` file with your MCP server credentials:

```bash
# GitHub MCP Server
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token

# Slack MCP Server
SLACK_BOT_TOKEN=your_slack_token

# Google Workspace (if using)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Add any other MCP server credentials
```

### Claude Desktop Configuration

Add to your `claude_desktop_config.json`:

**Location**:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Configuration**:
```json
{
  "mcpServers": {
    "claude-mcp-server-gateway": {
      "command": "/path/to/your/.venv/bin/python",
      "args": ["/path/to/claude-mcp-server-gateway/dcl_wrapper.py"],
      "env": {}
    }
  }
}
```

**Important**: 
1. Update paths to match your actual installation location
2. Remove all other MCP server entries - the gateway manages them
3. Completely restart Claude Desktop after configuration

## Adding Custom MCP Servers

Extend the gateway with any MCP server by editing `dcl_wrapper.py`:

```python
MCP_SERVERS = {
    "your-mcp-server": {
        "command": "npx",  # or python path
        "args": ["-y", "your-mcp-package"],
        "env": {
            "API_KEY": os.getenv("YOUR_API_KEY", "")
        },
        "description": "Your MCP server description"
    }
}
```

## Performance Comparison

### Startup Tokens (3 MCP servers)

| Metric | Without Gateway | With Gateway | Savings |
|--------|----------------|--------------|----------|
| Startup | 16,600 tokens | 50 tokens | 16,550 (99.7%) |
| First Tool Use | 0 (preloaded) | ~300 tokens | +300 |
| Active Server | 0 (preloaded) | ~10,200 tokens | +10,200 |
| **Typical Session** | **16,600** | **~4,000** | **12,600 (76%)** |

### Enterprise Setup (8 MCP servers, ~150 tools)

| Metric | Without Gateway | With Gateway | Improvement |
|--------|----------------|--------------|-------------|
| Context Available | 5% | 99.8% | +94.8% |
| Response Time | Slow (100+ tools) | Fast (3 tools) | ~50x faster |
| Token Efficiency | Poor | Excellent | 97% reduction |

## Use Cases

- **Multi-Server Environments**: Managing 5+ MCP servers without context saturation
- **Enterprise Workflows**: Development workflows requiring GitHub, Slack, Drive, and databases
- **Context-Critical Tasks**: Any scenario where preserving context window is essential
- **Performance Optimization**: Reducing Claude's tool processing overhead
- **Resource Management**: Efficient handling of multiple external integrations

## Configuration Options

Customize timeouts via environment variables:

```bash
# Operation timeout (default: 300 seconds)
GATEWAY_OPERATION_TIMEOUT=300

# Initialization timeout (default: 30 seconds)
GATEWAY_INIT_TIMEOUT=30
```

## Troubleshooting

### Gateway Not Appearing in Claude

1. Verify the gateway path in `claude_desktop_config.json`
2. Check Python path points to virtual environment
3. Restart Claude Desktop completely (not just close window)

### MCP Server Connection Failed

1. Check API credentials in `.env` file
2. Verify MCP server package is installed
3. Check network connectivity
4. View logs at `~/.claude-mcp-gateway/logs/`

### Still Seeing 100+ Tools

1. Ensure you've replaced ALL MCP server entries with just the gateway
2. Start a NEW conversation (gateway doesn't affect existing chats)
3. Verify Claude Desktop was fully restarted

### Timeout Errors

Increase timeouts in your `.env`:
```bash
GATEWAY_OPERATION_TIMEOUT=600
GATEWAY_INIT_TIMEOUT=60
```

## Technical Architecture

The gateway implements a lightweight service mesh pattern:

- **Service Discovery**: Dynamic MCP server registration and discovery
- **Load Balancing**: Intelligent routing to appropriate MCP servers
- **Circuit Breaking**: Automatic failure handling and recovery
- **Connection Pooling**: Efficient resource management

### MCP Protocol Compatibility

Fully implements Model Context Protocol specification (v2025-06-18):
- Standard MCP handshake and capability negotiation
- Tool discovery and invocation protocol
- Error handling and timeout management
- Compatible with all MCP transport types (stdio, HTTP+SSE)

### Supported Server Types

- **Python MCP Servers**: Native support via subprocess
- **Node.js MCP Servers**: Full compatibility via npx
- **TypeScript MCP Servers**: Compiled or ts-node execution
- **Docker MCP Servers**: Container-based MCP servers
- **Remote MCP Servers**: HTTP+SSE based servers

## Advanced Usage

### With Claude API

The gateway works with Claude API. Configure similarly to Claude Desktop but use the API client.

### With Claude Code

The gateway is compatible with Claude Code for command-line agentic coding workflows.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](https://github.com/bzsasson/claude-mcp-server-gateway/blob/main/CONTRIBUTING.md) for guidelines.

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [Claude Desktop Download](https://claude.ai/download)
- [Anthropic MCP Guide](https://docs.anthropic.com/mcp)
- [Gateway Wiki](https://github.com/bzsasson/claude-mcp-server-gateway/wiki)
- [Configuration Examples](https://github.com/bzsasson/claude-mcp-server-gateway/tree/main/examples)

## License

MIT License - see [LICENSE](https://github.com/bzsasson/claude-mcp-server-gateway/blob/main/LICENSE) file for details.

## Keywords

Python MCP server gateway, Claude MCP Server Gateway, Model Context Protocol gateway, Claude Desktop MCP integration, MCP server manager, token optimization for Claude, dynamic MCP loading, Claude AI gateway, Anthropic MCP tools, context window management, MCP server Python, claude-mcp-server, server gateway architecture
