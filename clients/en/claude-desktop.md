---
name: Claude Desktop
digest: A powerful desktop application that interacts with Claude AI through the Model Context Protocol.
author: Anthropic
homepage: https://claude.ai/download
icon: /icons/claude-desktop.webp
windows: true
mac: true
linux: false
ios: true
android: true
featured: true
tags:
  - Official
  - Desktop Application
  - anthropic
createTime: 2023-11-28
---

# Claude Desktop

Claude Desktop is the official client software released by Anthropic, enabling seamless interaction with Claude AI models through the Model Context Protocol (MCP). As a powerful AI assistant tool, it not only provides a native desktop experience but also supports various advanced features to help users improve efficiency in their daily work.

![Claude Desktop UI](/images/claude-desktop-ui.webp)

## Core Features

### Native Desktop Experience

Claude Desktop has been specifically optimized for different operating systems, providing a smoother user experience than the web version:

- **Keyboard shortcut support**: Offers a rich set of shortcut combinations for creating new conversations, searching content, undoing operations, and more
- **System integration**: Deep integration with the operating system, supporting notification push, clipboard operations, and other system functions
- **Offline session storage**: Conversation history is saved locally, ensuring data security and quick access

### Model Context Protocol (MCP) Support

As the official client implementing MCP, Claude Desktop supports extending AI capabilities through the protocol:

- **Server connections**: Can be configured to connect to various MCP servers, expanding Claude's functionality
- **Tool usage**: Supports calling various tools through the MCP protocol, such as file system operations, web searches, etc.
- **Context management**: Effectively manages conversation context to improve model comprehension

### Multi-Model Support

Claude Desktop provides access to Anthropic's full range of models:

- **Claude 3 Opus**: The most powerful model, suitable for complex reasoning and creative work
- **Claude 3 Sonnet**: A model that balances performance and speed
- **Claude 3 Haiku**: The fastest responding model, ideal for everyday conversations

### File Processing Capabilities

Claude Desktop supports processing multiple file formats:

- **Document reading**: Supports uploading and analyzing PDF, Word, Excel, and other documents
- **Image processing**: Can understand and describe the content of uploaded images
- **Code analysis**: Supports code understanding and optimization in multiple programming languages
- **Batch processing**: Can upload and analyze multiple files simultaneously

## Installation and Setup Guide

### Download and Installation

1. Visit the [official download page](https://claude.ai/download) to get the installer
2. Choose the appropriate version for your operating system:
   - **Windows**: Download and run the .exe installation file
   - **macOS**: Download the .dmg file and drag the application to your Applications folder
3. Follow the wizard to complete account login and initial setup during first launch

### Configuring MCP Servers

The unique advantage of Claude Desktop lies in its ability to extend functionality through MCP server configuration:

1. Open the Claude menu and select "Settings"
2. Choose "Developer" from the left panel of the settings
3. Click "Edit Configuration" to open the configuration file
4. Configuration file location:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

#### File System Server Example Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/用户名/桌面",
        "/Users/用户名/下载"
      ]
    }
  }
}
```

After completing the configuration, restart the Claude desktop application. You will see a tool icon in the bottom right corner of the input box, indicating that the server has successfully connected.

## Advanced Usage Tips

### Tool Invocation

After enabling the MCP server, Claude can perform various operations:

- **File operations**: Read, create, move, or delete files
- **File search**: Find specific files in designated directories
- **Code generation**: Save generated code directly to files
- **Data processing**: Analyze data in local files and generate reports

Before each tool invocation, Claude will request your confirmation to ensure security.

### Session Management

The Claude desktop application provides efficient session management features:

- **Multi-session support**: Maintain multiple independent conversations simultaneously
- **Session export**: Export conversation content in various formats
- **History search**: Quickly retrieve historical conversation content
- **Conversation continuation**: Resume previous conversation contexts at any time

### Keyboard Shortcuts

Master the following shortcuts to improve efficiency:

- **Ctrl+N**: Create a new conversation
- **Ctrl+S**: Save the current conversation
- **Ctrl+F**: Search conversation content
- **Ctrl+Z**: Undo the last operation
- **Ctrl+/+?**: Display keyboard shortcut help

## Application Scenarios

### Development Assistance

- Code review and optimization
- API documentation generation
- Debugging problem analysis
- Project architecture design

### Content Creation

- Article writing and editing
- Creative ideation and brainstorming
- Content translation and localization
- Marketing copywriting

### Data Analysis

- Local data file analysis
- Data visualization suggestions
- Report generation and summarization
- Data insight extraction

### Learning Assistance

- Concept explanation and learning guidance
- Research material summarization
- Learning plan development
- Knowledge graph construction

## System Requirements

### Windows

- Windows 10 or newer (64-bit)
- 4GB RAM (8GB or more recommended)
- 500MB available storage space
- Broadband internet connection

### macOS

- macOS 11 (Big Sur) or newer
- 4GB RAM (8GB or more recommended)
- 500MB available storage space
- Broadband internet connection

### Development Environment Requirements (for MCP servers)

- Node.js environment
- NPM package manager

## Conclusion

The Claude desktop application, by implementing the Model Context Protocol, seamlessly integrates AI assistant capabilities with local systems, providing users with a powerful and flexible intelligent assistant tool. Whether for daily work, development programming, or creative writing, it significantly improves efficiency and experience. Through proper configuration and use of MCP servers, you can further extend Claude's capabilities according to your needs, creating more possibilities.
