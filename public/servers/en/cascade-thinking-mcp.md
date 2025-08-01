---
name: Cascade Thinking MCP Server
digest: Transform linear problem-solving into rich, multi-dimensional exploration with true branching and intelligent thought management
author: Drew Llewellyn
homepage: https://github.com/drewdotpro/cascade-thinking-mcp
repository: https://github.com/drewdotpro/cascade-thinking-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - reasoning
  - problem-solving
  - analysis
  - thinking
  - branching
createTime: 2025-01-25T00:00:00Z
---

Transform linear problem-solving into rich, multi-dimensional exploration with true branching and intelligent thought management.

## Features

- **True Branching**: Create separate exploration paths that automatically start new sequences
- **Thought Revision**: Update earlier insights as understanding evolves
- **Dynamic Expansion**: Expand thinking space by 50% or at least 3 more thoughts when needed
- **Multi-Tool Integration**: Persistent state across tools with `toolSource` tracking
- **Flexible Output**: Control verbosity with minimal, standard, or verbose response modes
- **Dual Numbering System**: Track thoughts with both sequence-relative (S{n}) and absolute (A{n}) positions

## Why Cascade Thinking?

Traditional problem-solving tools break under ambiguity. Cascade Thinking MCP lets you:
- Explore alternatives with true branching that creates separate sequences
- Revise previous thoughts with full traceability
- Maintain context across agents and tools with persistent state
- Expand dynamically when you discover complexity mid-exploration

## API

### Tools

- **cascade_thinking**
  - Facilitates a detailed, step-by-step thinking process with dynamic branching and revision capabilities
  - Key inputs:
    - `thought` (string): The current thinking step
    - `nextThoughtNeeded` (boolean): Whether another thought step is needed
    - `thoughtNumber` (string): Current position in sequence (e.g., "S1", "S2", "S3")
    - `totalThoughts` (integer): Estimated total thoughts needed
    - `branchFromThought` (optional): Create a new branch from specified thought
    - `needsMoreThoughts` (optional): Dynamically expand totalThoughts
    - `responseMode` (optional): Control verbosity (minimal/standard/verbose)

## Unique Features

### Dual Numbering System
- **S{n}**: Sequence-relative position (resets per branch)
- **A{n}**: Absolute position across all thoughts (never resets)

### True Branching
When you branch, the tool:
1. Creates a new sequence automatically
2. Resets numbering to S1 in the new branch
3. Copies relevant context from the parent sequence
4. Tracks the branch relationship for navigation

### Dynamic Expansion
When you set `needsMoreThoughts: true`:
1. Increases totalThoughts by 50% or minimum 3 thoughts
2. Shows visual indicators including ⚡ emoji
3. Updates response with new total
4. Adds hint text to indicate expansion

## Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "cascade-thinking-mcp"
      ]
    }
  }
}
```

## Usage with Docker

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/cascade-thinking"
      ]
    }
  }
}
```

## Example Usage

Start exploring:
```json
{
  "thought": "Analyzing authentication options for our API",
  "thoughtNumber": "S1",
  "totalThoughts": 3,
  "nextThoughtNeeded": true
}
```

Branch to explore OAuth:
```json
{
  "thought": "Let me explore OAuth2 implementation",
  "thoughtNumber": "S1",
  "branchFromThought": "A1",
  "branchId": "oauth-exploration",
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.