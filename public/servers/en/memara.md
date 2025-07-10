---
name: Memara MCP Server
digest: AI memory management across platforms - store, search, and sync memories
author: Memara Team
homepage: https://memara.io
repository: https://github.com/memara-memory/mcp
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - memory
  - storage
  - search
  - sync
icon: https://memara.io/favicon.ico
createTime: 2024-12-20T00:00:00Z
---

Give your AI assistants perfect memory across all platforms. Memara MCP Server enables AI assistants to store, search, and access memories consistently across Claude Desktop, Cursor, and other MCP-compatible applications.

## Features

- **Cross-Platform Memory**: Sync memories between different AI tools
- **Intelligent Search**: Find relevant memories using semantic search
- **Organized Storage**: Use tags and spaces to organize memories
- **Secure Access**: Authentication via bearer tokens
- **Real-time Sync**: Memories update across all connected platforms

## Components

### Resources

- `memory://insights`: Access to stored memories and insights
- `memory://stats`: Memory usage statistics and analytics

### Tools

#### Memory Management

- **store_memory**
  - Store new memories with optional tags and metadata
  - Input:
    - `content` (string): The memory content to store
    - `tags` (optional string[]): Tags for categorization
    - `space` (optional string): Organization space
  - Returns: Confirmation with memory ID

- **search_memories**
  - Search through stored memories using semantic search
  - Input:
    - `query` (string): Search query
    - `tags` (optional string[]): Filter by tags
    - `space` (optional string): Filter by space
    - `limit` (optional number): Maximum results to return
  - Returns: Array of matching memories

- **get_memory**
  - Retrieve a specific memory by ID
  - Input:
    - `memory_id` (string): Unique memory identifier
  - Returns: Memory details and content

- **update_memory**
  - Update existing memory content or metadata
  - Input:
    - `memory_id` (string): Memory to update
    - `content` (optional string): New content
    - `tags` (optional string[]): New tags
  - Returns: Updated memory details

- **delete_memory**
  - Remove a memory permanently
  - Input:
    - `memory_id` (string): Memory to delete
  - Returns: Deletion confirmation

#### Organization Tools

- **list_tags**
  - Get all available tags
  - No input required
  - Returns: Array of tag names with usage counts

- **list_spaces**
  - Get all organization spaces
  - No input required
  - Returns: Array of space names

- **get_stats**
  - Get memory usage statistics
  - No input required
  - Returns: Total memories, tags, spaces, and usage metrics

## Setup

### Claude Desktop

1. Create integration in Memara dashboard
2. Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memara": {
      "command": "npx",
      "args": [
        "@memara/mcp-server"
      ],
      "env": {
        "MEMARA_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Cursor

1. Create integration in Memara dashboard
2. Add server in Cursor MCP settings:
   - **Name**: Memara
   - **URL**: Server URL from Memara dashboard
   - **Token**: Authentication token from Memara dashboard

### Environment Variables

- `MEMARA_API_TOKEN`: Your Memara API authentication token
- `MEMARA_SERVER_URL` (optional): Custom server URL (defaults to https://api.memara.io)

## Usage Examples

### Store a Memory

```
Store this memory: "Meeting with Sarah about project X scheduled for next Tuesday"
```

### Search Memories

```
Search my memories for: "project meetings"
Find memories about: "Sarah"
What do I remember about: "project X"
```

### Organize with Tags

```
Store this memory: "Product launch timeline updated" with tags ["project", "timeline", "launch"]
```

### Get Statistics

```
Show my memory stats
How many memories do I have?
```

## Supported Platforms

| Platform | Status | Setup Time |
|----------|--------|------------|
| Claude Desktop | ✅ Ready | 2 minutes |
| Cursor | ✅ Ready | 2 minutes |
| Claude Code CLI | ✅ Ready | 1 minute |
| Other MCP Apps | ✅ Ready | 3 minutes |

## Troubleshooting

### Authentication Issues

1. Verify your API token is correctly set
2. Check token hasn't expired in Memara dashboard
3. Ensure proper environment variable configuration

### Connection Problems

1. Confirm Memara service is running
2. Check network connectivity
3. Verify server URL configuration

### Memory Not Found

1. Check memory ID is correct
2. Ensure you have access to the memory space
3. Verify memory wasn't deleted

## Support

- **Help Center**: [help.memara.io](https://help.memara.io)
- **Live Chat**: Available in Memara dashboard
- **Email**: support@memara.io

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository. 