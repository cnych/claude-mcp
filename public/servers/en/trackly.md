---
name: Trackly
digest: AI job search MCP server with 128K+ openings across 1,900+ companies. 10 tools for jobs, applications, contacts, and referrals. Hosted streamable-http with OAuth 2.1 or local stdio.
author: kevinastuhuaman
repository: https://github.com/kevinastuhuaman/trackly-cli
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - jobs
  - job-search
  - career
  - productivity
  - oauth
icon: https://avatars.githubusercontent.com/u/246380376?v=4
createTime: 2026-05-06
---

[Trackly](https://usetrackly.app) is an AI recruiting agent that turns Claude, ChatGPT, Cursor, Windsurf, and Codex into your personal job-search copilot. Search 128K+ live openings across 1,900+ companies (40+ ATS platforms — Greenhouse, Lever, Ashby, Workday, and more), pull contacts, draft referral messages, and update application status — all from your AI client of choice.

Two ways to connect:

- **Hosted (recommended)** — `https://mcp.usetrackly.app/api/mcp` over streamable-http with OAuth 2.1 + dynamic client registration. Works in **Claude co-work** ("Add custom connector"), **Claude Desktop**, and **ChatGPT** without installing anything.
- **Local** — `npx trackly-cli mcp` over stdio. Works in **Cursor**, **Windsurf**, and **Claude Code**.

## Installation

### Hosted (Claude co-work / ChatGPT / Claude Desktop)

In Claude co-work or Claude Desktop, click **"Add custom connector"** and paste:

```
https://mcp.usetrackly.app/api/mcp
```

You'll be redirected through Google Sign-In once. After that, all 10 Trackly tools are available.

### Local (Cursor / Windsurf / Claude Code)

```bash
npm install -g trackly-cli
trackly login          # opens Google Sign-In in your browser
```

Then add to your MCP client config:

```json
{
  "mcpServers": {
    "trackly": {
      "command": "trackly",
      "args": ["mcp"]
    }
  }
}
```

Claude Code shortcut:

```bash
claude mcp add --scope user trackly -- trackly mcp
```

## Tools

| Tool | Description |
| --- | --- |
| `trackly_search_jobs` | Filter 128K+ jobs by title, company, function, location, posted-since |
| `trackly_get_job` | Full job posting with description, salary, requirements |
| `trackly_search_companies` | Semantic search across 1,900+ tracked companies |
| `trackly_list_companies` | Browse companies by tag, size, or sector |
| `trackly_get_stats` | Your application funnel: applied / saved / dismissed / interviewing |
| `trackly_update_status` | Move a job to applied / saved / dismissed |
| `trackly_ask` | Natural-language search ("senior PM roles at Series B fintechs in NYC") |
| `trackly_get_job_brief` | AI-generated brief tailored to your background |
| `trackly_contacts_at_company` | List contacts you have at a target company |
| `trackly_get_company_workspace` | Open jobs, contacts, and active referral campaigns at a company |

## Example prompts

- *"Find me senior product roles at AI-first companies posted in the last 7 days."*
- *"Who do I know at OpenAI, and what jobs are open there?"*
- *"Draft a referral ask for the Stripe Solutions Engineering role."*
- *"Mark the Anthropic PM role as applied."*
