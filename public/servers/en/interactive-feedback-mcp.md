---
name: Interactive Feedback MCP
digest: The MCP Server enables human-in-the-loop workflows for AI development tools like Cursor, Cline, and Windsurf. It allows running commands, viewing outputs, and providing direct textual feedback to AI systems during development processes.
author: noopstudios
homepage: https://github.com/noopstudios/interactive-feedback-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - server
  - workflow
icon: https://avatars.githubusercontent.com/u/74713198?v=4
createTime: 2025-05-09
---
Simple [MCP Server](https://modelcontextprotocol.io/) to enable a human-in-the-loop workflow in AI-assisted development tools like [Cursor](https://www.cursor.com). This server allows you to run commands, view their output, and provide textual feedback directly to the AI. It is also compatible with [Cline](https://cline.bot) and [Windsurf](https://windsurf.com).

![Interactive Feedback UI - Main View](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-1a5be5d2.jpg?raw=true)
![Interactive Feedback UI - Command Section Open](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-051f81d1.jpg)

## Prompt Engineering

For the best results, add the following to your custom prompt in your AI assistant, you should add it on a rule or directly in the prompt (e.g., Cursor):

> Whenever you want to ask a question, always call the MCP `interactive_feedback`.  
> Whenever you're about to complete a user request, call the MCP `interactive_feedback` instead of simply ending the process.
> Keep calling MCP until the user's feedback is empty, then end the request.

## Why Use This?
By guiding the assistant to check in with the user instead of branching out into speculative, high-cost tool calls, this module can drastically reduce the number of premium requests (e.g., OpenAI tool invocations) on platforms like Cursor. In some cases, it helps consolidate what would be up to 25 tool calls into a single, feedback-aware request — saving resources and improving performance.

## Configuration

This MCP server uses Qt's `QSettings` to store configuration on a per-project basis. This includes:
*   The command to run.
*   Whether to execute the command automatically on the next startup for that project (see "Execute automatically on next run" checkbox).
*   The visibility state (shown/hidden) of the command section (this is saved immediately when toggled).
*   Window geometry and state (general UI preferences).

These settings are typically stored in platform-specific locations (e.g., registry on Windows, plist files on macOS, configuration files in `~/.config` or `~/.local/share` on Linux) under an organization name "FabioFerreira" and application name "InteractiveFeedbackMCP", with a unique group for each project directory.

## Installation (Cursor)

![Instalation on Cursor](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-060e8911.jpg?raw=true)

1.  **Prerequisites:**
    *   Python 3.11 or newer.
    *   [uv](https://github.com/astral-sh/uv) (Python package manager). Install it with:
        *   Windows: `pip install uv`
        *   Linux/Mac: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2.  **Get the code:**
    *   Clone this repository:
        `git clone https://github.com/noopstudios/interactive-feedback-mcp.git`
    *   Or download the source code.
3.  **Navigate to the directory:**
    *   `cd path/to/interactive-feedback-mcp`
4.  **Install dependencies:**
    *   `uv sync` (this creates a virtual environment and installs packages)
5.  **Run the MCP Server:**
    *   `uv run server.py`
6.  **Configure in Cursor:**
    *   **Manual Configuration (e.g., via `mcp.json`)**
        **Remember to change the `/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp` path to the actual path where you cloned the repository on your system.**

        ```json
        {
          "mcpServers": {
            "interactive-feedback-mcp": {
              "command": "uv",
              "args": [
                "--directory",
                "/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp",
                "run",
                "server.py"
              ],
              "timeout": 600,
              "autoApprove": [
                "interactive_feedback"
              ]
            }
          }
        }
        ```

### For Cline / Windsurf

Similar setup principles apply. You would configure the server command (e.g., `uv run server.py` with the correct `--directory` argument pointing to the project directory) in the respective tool's MCP settings, using `interactive-feedback-mcp` as the server identifier.

## Development

To run the server in development mode with a web interface for testing:

```sh
uv run fastmcp dev server.py
```

## Available tools

Here's an example of how the AI assistant would call the `interactive_feedback` tool:

```xml
<use_mcp_tool>
  <server_name>interactive-feedback-mcp</server_name>
  <tool_name>interactive_feedback</tool_name>
  <arguments>
    {
      "project_directory": "/path/to/your/project",
      "summary": "I've implemented the changes you requested and refactored the main module."
    }
  </arguments>
</use_mcp_tool>
```