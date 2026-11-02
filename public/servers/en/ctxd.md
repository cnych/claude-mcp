---
name: ctxd
digest: Context infrastructure between agents and data
author: Team CTXD
homepage: https://ctxd.dev
repository: https://github.com/ctxd-dev/ctxd
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - context
  - filesystem
  - developer-tools
createTime: 2026-11-02T00:00:00Z
---

ctxd is open-source context infrastructure between agents and data. Its tracker synchronizes source content into ctxfs, so agents can inspect paths and read current source material.

### MCP tools

- Inspect paths: `ls`, `tree`, `glob`, `stat`.
- Read source content: `read`, `read_lines`.
- Updates come from the tracker. Edit a source, synchronize it, then read the changed content.

Python and the CLI also provide exact text search.

### Local setup

On your Linux workstation as your normal user, use Python 3.11 or 3.12 and ensure the system `ps` command is available. In your Python environment:

```bash
pip install ctxd
ctxd backend set ctxfs
ctxd folders add /path/to/your/source --name Source
python -m ctxd.tracker_service sync-once
ctxd tracker start
```

Replace `/path/to/your/source` with the folder you want to track. Start your MCP client as the same user. With `uv` installed, use this server configuration:

```json
{
  "mcpServers": {
    "ctxd": {
      "command": "uvx",
      "args": ["--python", "3.12", "--from", "ctxd", "ctxd-mcp"]
    }
  }
}
```

The bridge uses local standard input/output (stdio). No hosted account or API key is needed. Start with `tree`, then pass a returned path to `read` or `read_lines`.

[Get started with ctxd](https://ctxd.dev/?utm_source=github&utm_medium=listing&utm_content=pvx) · [Source and GitHub stars](https://github.com/ctxd-dev/ctxd)

The package is free and MIT-licensed: https://github.com/ctxd-dev/ctxd/blob/main/LICENSE
