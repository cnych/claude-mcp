---
name: EmblemAI
digest: 200+ crypto tools for AI agents across 7 blockchains — Bitcoin, Solana, Ethereum, Base, BSC, Polygon, Hedera
author: EmblemCompany
homepage: https://emblemvault.ai
repository: https://github.com/EmblemCompany/Agent-skills
capabilities:
  resources: false
  tools: true
  prompts: false
tags:
  - crypto
  - defi
  - nft
  - wallet
  - trading
  - blockchain
  - bitcoin
  - ethereum
  - solana
  - base
  - hedera
  - polymarket
icon: https://github.com/EmblemCompany.png
createTime: 2026-05-11
featured: false
---

EmblemAI is a hosted Model Context Protocol server that gives AI agents a full-featured crypto wallet plus 200+ tools for trading, DeFi, NFTs, and on-chain analytics across 7 blockchains.

## Features

- **7-chain wallet** — Bitcoin, Solana, Ethereum, Base, BSC, Polygon, Hedera. Native sends, ERC-20 / SPL / Runes / Ordinals / Counterparty asset transfers, and chain-specific NFT operations from a single MCP surface.
- **Token swaps** — best-route quoting and execution across each chain's primary liquidity venues.
- **Conditional orders** — limit, stop-loss, and take-profit orders managed off-chain with on-chain settlement.
- **DeFi yield discovery** — TVL, protocol data, and yield farming opportunities.
- **Prediction markets** — full Polymarket integration: browse events, view positions, place market orders, redeem winnings.
- **Bitcoin Ordinals + Runes + Stamps + Alkanes** — inscription discovery, rune balances, BRC-20 / SRC-20 markets.
- **Market intelligence** — trending tokens, smart-money flows, rug-pull checks, sentiment, on-chain analytics.
- **Multiple auth surfaces** — API key, OAuth 2.0 with RFC 7591 Dynamic Client Registration, and x402 per-tool-call micropayments.
- **Configurable transactional opt-in** — read-only by default; opt into state-changing tools with a single header or env var.

## Connecting

### Hosted MCP (recommended)

```bash
claude mcp add --transport http emblemai \
  https://emblemvault.ai/api/mcp \
  --header "x-api-key: YOUR_API_KEY"
```

For OAuth-capable hosts, the same endpoint advertises RFC 9728 protected-resource metadata and supports browser-driven OAuth 2.0 + PKCE.

### Stdio bridge

A thin stdio bridge is published as the `@emblemvault/mcp` package. It forwards JSON-RPC to the hosted endpoint and exposes an `EMBLEMAI_TOOLS_FILTER` env var for restricting the exposed surface to a specialised slice (e.g. `bitcoin*`, `solana*,base*`).

```json
{
  "mcpServers": {
    "emblemai": {
      "command": "npx",
      "args": ["-y", "@emblemvault/mcp"],
      "env": { "EMBLEMAI_API_KEY": "YOUR_API_KEY" }
    }
  }
}
```

### Enabling transactional tools

State-changing tools (sends, swaps, mints, conditional-trade creates) require explicit opt-in:

- HTTP: add `-H 'x-mcp-transactions: enabled'`
- Stdio: set `EMBLEMAI_TRANSACTIONS=enabled`

## Getting an API Key

Sign in at [emblemvault.ai](https://emblemvault.ai) → Settings → Vault Access Key. The same vault can be reused across MCP, REST API, and the EmblemAI web app.

## Categories

Trading (Solana, Ethereum, Base, BSC, Polygon, Hedera, cross-chain) · DeFi yield · NFTs (OpenSea, Magic Eden, collection-floor lookups) · Bitcoin (Ordinals, Runes, BRC-20, Stamps / SRC-20, Alkanes) · Prediction markets (Polymarket) · Market analytics · Research / web search.
