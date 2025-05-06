---
name: MCPControl
digest: The Windows control server for Model Context Protocol enables programmatic automation of system operations like mouse/keyboard input, window management, and screen capture, streamlining workflow control.
author: Cheffromspace
repository: https://github.com/Cheffromspace/MCPControl
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - windows
  - automation
  - control
icon: https://avatars.githubusercontent.com/u/21370528?v=4
createTime: 2024-12-04
---

A [Model Context Protocol (MCP)](/) Windows control server, providing programmatic control over system operations including mouse, keyboard, window management, and screen capture functionality.

> **Note**: This project currently supports Windows only.

## ⚠️ IMPORTANT DISCLAIMER

**THIS SOFTWARE IS EXPERIMENTAL AND POTENTIALLY DANGEROUS**

By using this software, you acknowledge and accept that:

- Giving AI models direct control over your computer through this tool is inherently risky
- This software can control your mouse, keyboard, and other system functions which could potentially cause unintended consequences
- You are using this software entirely at your own risk
- The creators and contributors of this project accept NO responsibility for any damage, data loss, or other consequences that may arise from using this software
- This tool should only be used in controlled environments with appropriate safety measures in place

## Features

- **Window Management**

  - List all windows
  - Get active window information
  - Get window titles
  - Get window size and position
  - Focus windows
  - Resize windows
  - Reposition windows

- **Mouse Control**

  - Mouse movement
  - Click operations
  - Scroll functionality
  - Drag operations
  - Cursor position tracking

- **Keyboard Control**

  - Text input
  - Key combinations
  - Key press/release operations
  - Hold key functionality

- **Screen Operations**

  - Screen capture
  - Screen size retrieval
  - Active window detection

- **Clipboard Integration**
  - Get clipboard content
  - Set clipboard content
  - Clear clipboard
  - Check clipboard state

## Usage

Simply configure your Claude MCP settings to use MCPControl as shown in the [MCP Server Configuration](#mcp-server-configuration) section. No installation needed!

### Building From Source

#### Development Requirements

To build this project for development, you'll need:

1. Windows operating system (required for the keysender dependency)
2. Node.js 18 or later (install using the official Windows installer which includes build tools)
3. npm package manager
4. Native build tools:
   - node-gyp: `npm install -g node-gyp`
   - cmake-js: `npm install -g cmake-js`

## MCP Server Configuration

To use this project, you'll need the necessary build tools:

1. Install Node.js using the official Windows installer, which includes necessary build tools
2. Install additional required tools:

```
npm install -g node-gyp
npm install -g cmake-js
```

Then, add the following configuration to your MCP settings:

```json
{
  "mcpServers": {
    "MCPControl": {
      "command": "npx",
      "args": ["--no-cache", "-y", "mcp-control"]
    }
  }
}
```

## Project Structure

- `/src`
  - `/handlers` - Request handlers and tool management
  - `/tools` - Core functionality implementations
  - `/types` - TypeScript type definitions
  - `index.ts` - Main application entry point

## Dependencies

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - MCP SDK for protocol implementation
- [keysender](https://www.npmjs.com/package/keysender) - Windows-only UI automation library
- [clipboardy](https://www.npmjs.com/package/clipboardy) - Clipboard handling
- [sharp](https://www.npmjs.com/package/sharp) - Image processing
- [uuid](https://www.npmjs.com/package/uuid) - UUID generation

## Known Limitations

- Window minimize/restore operations are currently unsupported
- Multiple screen functions may not work as expected, depending on setup
- The get_screenshot utility does not work with the VS Code Extension Cline
- Some operations may require elevated permissions depending on the target application
- Only Windows is supported
- Click accuracy is currently working best at 1280x720 resolution, single screen

## License

MIT License.
