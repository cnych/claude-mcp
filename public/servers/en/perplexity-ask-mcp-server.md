---
name: Perplexity Ask MCP Server
digest: An MCP server integrates the Sonar API to give Claude real-time, web-wide research capabilities, enabling instant access to up-to-date online information for comprehensive, accurate responses.
author: ppl-ai
homepage: https://github.com/ppl-ai/modelcontextprotocol
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - web
  - docker
icon: https://avatars.githubusercontent.com/u/110299016?v=4
createTime: 2025-03-11
featured: true
---

An MCP server implementation that integrates the Sonar API to provide Claude with unparalleled real-time, web-wide research.

![Demo](/images/perplexity_demo_screenshot.png)

## Tools

- **perplexity_ask**
  - Engage in a conversation with the Sonar API for live web searches.
  - **Inputs:**
    - `messages` (array): An array of conversation messages.
      - Each message must include:
        - `role` (string): The role of the message (e.g., `system`, `user`, `assistant`).
        - `content` (string): The content of the message.

## Configuration

### Step 1:

Clone this repository:

```bash
git clone git@github.com:ppl-ai/modelcontextprotocol.git
```

Navigate to the `perplexity-ask` directory and install the necessary dependencies:

```bash
cd modelcontextprotocol/perplexity-ask && npm install
```

### Step 2: Get a Sonar API Key

1. Sign up for a [Sonar API account](https://docs.perplexity.ai/guides/getting-started).
2. Follow the account setup instructions and generate your API key from the developer dashboard.
3. Set the API key in your environment as `PERPLEXITY_API_KEY`.

### Step 3: Configure Claude Desktop

1. Download Claude desktop [here](https://claude.ai/download).

2. Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "server-perplexity-ask"],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

You can access the file using:

```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Step 4: Build the Docker Image

Docker build:

```bash
docker build -t mcp/perplexity-ask:latest -f Dockerfile .
```

### Step 5: Testing

Let's make sure Claude for Desktop is picking up the two tools we've exposed in our `perplexity-ask` server. You can do this by looking for the hammer icon:

![Claude Visual Tools](/images/perplexity-visual-indicator-mcp-tools.png)

After clicking on the hammer icon, you should see the tools that come with the Filesystem MCP Server:

![Available Integration](/images/perplexity_available_tools.png)

### Step 6: Advanced parameters

Currently, the search parameters used are the default ones. You can modify any search parameter in the API call directly in the `index.ts` script. For this, please refer to the official [API documentation](https://docs.perplexity.ai/api-reference/chat-completions).

### Troubleshooting

The Claude documentation provides an excellent [troubleshooting guide](https://modelcontextprotocol.io/docs/tools/debugging) you can refer to. However, you can still reach out to us at api@perplexity.ai for any additional support or [file a bug](https://github.com/ppl-ai/api-discussion/issues).

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
