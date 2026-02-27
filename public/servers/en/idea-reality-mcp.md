---
name: Idea Reality MCP
digest: Pre-build reality check for AI coding agents. Scans GitHub, HN, npm, PyPI & Product Hunt before you build — returns a 0-100 reality signal.
author: mnemox-ai
homepage: https://mnemox.ai/check
repository: https://github.com/mnemox-ai/idea-reality-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - idea validation
  - market research
  - developer tools
  - pre-build check
  - mcp
icon: https://avatars.githubusercontent.com/u/263367191?s=48&v=4
createTime: 2026-02-25T00:00:00Z
featured: false
---

# Idea Reality MCP

A workflow-native pre-build reality check designed for AI coding agents. Before you spend hours building something, Idea Reality MCP scans five major developer platforms and tells you what already exists, how crowded the space is, and where to differentiate.

## How It Works

Idea Reality MCP exposes a single MCP tool called `idea_check`. Pass in a natural-language description of what you want to build, and it searches across developer platforms in real time, scores competition density, and returns structured results your AI agent can reason about.

### Tool: `idea_check`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idea_text` | string | Yes | Natural-language description of your idea |
| `depth` | string | No | `"quick"` (default) or `"deep"` |

### Two Modes

- **Quick mode** (default): Searches GitHub and Hacker News. Fast, lightweight, good for initial screening.
- **Deep mode**: Searches all five sources in parallel — GitHub, Hacker News, npm, PyPI, and Product Hunt. More comprehensive competitive picture.

### Response

The tool returns a structured result containing:

- **reality_signal** (0-100): Competition density score. Higher means more existing projects in the space.
- **evidence**: List of similar projects found, with names, descriptions, URLs, and relevance scores.
- **pivot_hints**: Actionable suggestions on how to differentiate if the space is crowded.
- **source_breakdown**: Per-source match counts and scores.

## Installation

### Using uvx (recommended)

```bash
uvx idea-reality-mcp
```

### Using pip

```bash
pip install idea-reality-mcp
```

## Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "idea-reality": {
      "command": "uvx",
      "args": ["idea-reality-mcp"],
      "env": {
        "GITHUB_TOKEN": "<your-github-token>"
      }
    }
  }
}
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token. Increases rate limit from 10 to 30 requests/min. |
| `PRODUCTHUNT_TOKEN` | No | Product Hunt API token. Enables Product Hunt source in deep mode. Skipped gracefully if not set. |

## Example Usage

Once configured, ask your AI agent:

```
Check if "a CLI tool that converts Figma designs to React components" already exists
```

```
idea_check with depth=deep: "real-time collaborative markdown editor with AI suggestions"
```

The agent will call `idea_check`, receive the reality signal and evidence, and advise you on whether to proceed, pivot, or find a niche.

## Features

- **Zero storage**: Does not store any user input by default.
- **Parallel search**: Deep mode queries all five sources concurrently via `asyncio.gather`.
- **Chinese language support**: 150+ Chinese technical term mappings for accurate keyword extraction from Chinese input.
- **Graceful degradation**: If any source fails or times out, partial results are still returned.
- **Explainable scoring**: The reality signal formula is transparent and deterministic, not ML-based.

## Links

- [GitHub Repository](https://github.com/mnemox-ai/idea-reality-mcp)
- [PyPI Package](https://pypi.org/project/idea-reality-mcp/)
- [Live Demo](https://mnemox.ai/check)
