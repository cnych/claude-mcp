---
name: Roundtable
digest: Your AI Board of Directors — run multi-model debates and get synthesized insights
author: Deadpixel
homepage: https://roundtable.now
repository: https://github.com/deadpixel/roundtable-dashboard
capabilities:
  resources: false
  tools: true
  prompts: false
tags:
  - ai
  - multi-model
  - debate
  - reasoning
  - code-review
  - architecture
icon: https://roundtable.now/logo-512.png
createTime: 2026-03-01
---

An MCP server that gives you access to a multi-model AI board of directors. Run structured debates where GPT-4o, Claude, Gemini, DeepSeek, and 200+ other models discuss your question, then a moderator synthesizes all perspectives into actionable insight.

## Features

- **Multi-Model Reasoning**: Get diverse perspectives from 200+ AI models on any question
- **Structured Debates**: Models discuss, critique, and build on each other's ideas
- **Moderator Synthesis**: A dedicated moderator distills all perspectives into clear recommendations
- **6 Specialized Tools**: Purpose-built tools for different use cases

## Tools

- **consult**
  - Run a full roundtable debate with multiple AI models
  - Inputs:
    - `prompt` (string): Your question or topic for discussion

- **review_code**
  - Get multi-model code review from different perspectives
  - Inputs:
    - `code` (string): The code to review
    - `context` (string, optional): Additional context about the code

- **debug**
  - Collaborative multi-model debugging session
  - Inputs:
    - `issue` (string): Description of the bug or issue
    - `code` (string, optional): Relevant code snippets

- **architect**
  - Multi-model system design discussion
  - Inputs:
    - `requirements` (string): System requirements and constraints

- **plan_implementation**
  - Get implementation plans from multiple model perspectives
  - Inputs:
    - `task` (string): The feature or task to plan

- **assess_tradeoffs**
  - Multi-model tradeoff analysis for technical decisions
  - Inputs:
    - `decision` (string): The decision and options to evaluate

## Configuration

### Usage with Claude Desktop / Claude Code

Add this to your MCP configuration:

```json
{
  "mcpServers": {
    "roundtable": {
      "url": "https://mcp.roundtable.now/mcp",
      "headers": {
        "X-API-Key": "YOUR_API_KEY"
      }
    }
  }
}
```

### Getting an API Key

1. Visit [roundtable.now/settings](https://roundtable.now/settings)
2. Navigate to API Keys
3. Generate a new key

## License

This MCP server is proprietary. See the [Roundtable website](https://roundtable.now) for terms of service.
