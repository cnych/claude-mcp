---
name: RenooLab
digest: Find and contact building tradespeople across France, or create a free professional profile.
author: RenooLab
homepage: https://renoolab.fr/mcp/
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - renovation
  - construction
  - france
  - local-services
  - search
icon: https://renoolab.fr/logo.png
createTime: 2026-07-25
---

# RenooLab

RenooLab is an official remote MCP server for the French renovation market. It helps people find building tradespeople by trade and city, submit a moderated contact request, and lets professionals create a free inactive profile for later activation.

## Remote MCP endpoint

```text
https://mcp.renoolab.fr/mcp
```

- **Transport:** Streamable HTTP
- **Authentication:** OAuth 2.1 with Dynamic Client Registration and PKCE
- **Official MCP Registry name:** `fr.renoolab/mcp`
- **Availability:** France

## Available tools

- `rechercher_artisans` — find public tradesperson profiles by trade and city within the real service radius.
- `contacter_artisan` — create a moderated contact request. Nothing is sent to the tradesperson before RenooLab review.
- `creer_profil_artisan` — create an inactive, non-searchable professional profile and send its activation email.

## Example prompts

- “Find a plumber in Marseille.”
- “Contact this tradesperson about a kitchen leak.”
- “Create my RenooLab professional profile as an electrician in Lyon.”

## Links

- [MCP documentation](https://renoolab.fr/mcp/)
- [RenooLab](https://renoolab.fr/)
- [Privacy policy](https://renoolab.fr/privacy/)
- [Support](https://renoolab.fr/support/)

RenooLab is free to use for finding and contacting tradespeople and does not charge a commission on the work.