---
name: Talk to Your PC MCP Server
digest: A Model Context Protocol (MCP) server that helps troubleshooting and diagnosis of your PC through AI assistants like Claude, ChatGPT, or any MCP-compatible tool.
author: Irene-123
homepage: https://github.com/Irene-123/talk-to-your-pc-mcp-server
repository: https://github.com/Irene-123/talk-to-your-pc-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - pc
icon: https://avatars.githubusercontent.com/u/58950467?s=48&v=4
createTime: 2025-09-16T00:00:00Z
---

A Model Context Protocol (MCP) server that helps troubleshooting and diagnosis of your PC through AI assistants like Claude, ChatGPT, or any MCP-compatible tool.

## Features

- **System Diagnosis**: Automatically diagnose computer issues and performance problems
- **PC Settings Management**: Check volume, WiFi networks, battery status, system information, and more
- **Safe Troubleshooting**: Execute system repair commands with built-in safety checks
- **Cross-Platform Support**: Works on Windows (PowerShell), macOS, and Linux (bash)
- **Multiple LLM Support**: Compatible with OpenAI, Claude/Anthropic, and Azure OpenAI
- **Security-First**: Built-in command validation and dangerous operation blocking

## Tools

### `run_diagnosis`

Run system diagnosis to identify probable issues with your computer.

**Example usage:**

- "Why is my computer running slow?"
- "Check my network connectivity"
- "Diagnose memory usage problems"

### `get_pc_settings`

Get PC settings and system information like volume, WiFi, battery, etc.

**Example usage:**

- "What WiFi network am I connected to?"
- "Show me my battery percentage"
- "What's my current IP address?"
- "Check my disk space"

### `execute_troubleshooting`

Execute troubleshooting commands to fix system issues safely.

**Example usage:**

- "Fix my DNS issues"
- "Reset my network adapter"
- "Clear system cache"
- "Restart audio services"

## Installation

### Method 1: PyPI (Recommended)

```bash
pip install talk-to-pc-mcp==0.1.1
```

### Method 2: From Source

```bash
git clone https://github.com/Irene-123/talk-to-your-pc-mcp-server.git
cd talk-to-your-pc-mcp-server
pip install -e .
```

## Configuration

### LLM API Setup

Set up your preferred LLM provider by setting the appropriate environment variables:

#### OpenAI

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-4"  # optional, defaults to gpt-3.5-turbo
```

#### Claude/Anthropic

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export ANTHROPIC_MODEL="claude-3-haiku-20240307"  # optional
```

#### Azure OpenAI

```bash
export AZURE_OPENAI_API_KEY="your-key"
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
export AZURE_OPENAI_DEPLOYMENT_NAME="gpt-35-turbo"
export AZURE_OPENAI_API_VERSION="2024-02-15-preview"  # optional
```

### Claude Desktop Integration

Add to your `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "talk-to-pc": {
      "command": "talk-to-your-pc-mcp-server",
      "env": {
        "ANTHROPIC_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### VS Code Integration

For VS Code with GitHub Copilot, add to your VS Code settings or MCP configuration:

```json
{
  "mcp.servers": {
    "talk-to-pc": {
      "command": "talk-to-your-pc-mcp-server"
    }
  }
}
```

## Usage Examples

Once configured, you can interact with your PC using natural language through your AI assistant:

### System Diagnosis

- "My computer is running slowly, can you diagnose the issue?"
- "Check why my internet connection is unstable"
- "Analyze my system performance"

### PC Settings

- "What WiFi networks are available?"
- "Show me my current system specs"
- "What's my battery level?"
- "Check my audio volume settings"

### Troubleshooting

- "My WiFi isn't working, please fix it"
- "Clear my DNS cache"
- "Restart my audio services"
- "Fix network connectivity issues"

## Security Features

- **Command Validation**: All commands are validated before execution
- **Dangerous Command Blocking**: Prevents execution of potentially harmful commands like `rm -rf`, `format`, `del /f`
- **Timeout Protection**: Commands are automatically terminated after 15 seconds
- **Cross-Platform Safety**: OS-specific safety checks for Windows, macOS, and Linux
- **User Transparency**: All executed commands and outputs are shown to users for verification

## Platform-Specific Behavior

### Windows

- Uses PowerShell for command execution
- Supports Windows-specific diagnostics (Event Viewer, WMI, etc.)
- Network management via `netsh` commands

### macOS/Linux

- Uses bash for command execution
- Supports Unix-style system tools (`ps`, `netstat`, `iwconfig`, etc.)
- Package manager integration where appropriate

## Development

### Running from Source

```bash
# Clone the repository
git clone https://github.com/Irene-123/talk-to-your-pc-mcp-server.git
cd talk-to-your-pc-mcp-server

# Install dependencies
pip install -r requirements.txt

# Set your API key
export ANTHROPIC_API_KEY="your-key-here"

# Run the server
python server.py
```

### Testing

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector python server.py

# Or test individual functions
python -c "
import asyncio
from server import get_pc_settings
result = asyncio.run(get_pc_settings('check WiFi status'))
print(result)
"
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all dependencies are installed with `pip install -r requirements.txt`
2. **LLM API Errors**: Verify your API keys are set correctly and have sufficient credits
3. **Permission Errors**: Some system commands may require elevated privileges
4. **Command Timeouts**: Long-running diagnostics are automatically terminated after 15 seconds for safety

### Debug Logging

Enable debug logging to troubleshoot issues:

```bash
export LOG_LEVEL=DEBUG
python server.py
```

**Note**: This MCP server executes system commands on your local machine. While comprehensive safety measures are in place, always review the commands being executed and ensure you trust the AI assistant you're using with system-level access.
