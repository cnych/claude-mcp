---
name: bitcoin-mcp
digest: Bitcoin MCP server with 43 tools for fee intelligence, mempool analysis, transaction decoding, mining economics, and Lightning invoice decoding. Zero config — works with the free Satoshi API or your own Bitcoin node.
author: Bortlesboat
homepage: https://github.com/Bortlesboat/bitcoin-mcp
repository: https://github.com/Bortlesboat/bitcoin-mcp
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - bitcoin
  - cryptocurrency
  - blockchain
  - finance
  - lightning
icon: https://cdn.simpleicons.org/bitcoin
createTime: 2025-03-09
---

A comprehensive Bitcoin MCP server providing 43 tools, 6 prompts, and 7 resources for interacting with the Bitcoin network. Zero configuration required — automatically connects to the free [Satoshi API](https://bitcoinsapi.com) when no local Bitcoin node is available.

## Features

- **Fee Intelligence**: Smart fee estimates, fee recommendations, and transaction cost estimation that saves money on every Bitcoin transaction
- **Mempool Analysis**: Real-time mempool info, transaction tracking, and next-block analysis
- **Transaction Tools**: Decode raw transactions, analyze transaction details, send raw transactions
- **Mining Economics**: Mining info, difficulty adjustments, halving countdown, pool rankings
- **Blockchain Data**: Block analysis, block comparison, chain statistics, UTXO set info
- **Lightning Network**: Decode BOLT11 invoices
- **Market Data**: BTC price, market sentiment, supply info
- **Cryptography**: Key pair generation, address validation, script explanation
- **Zero Config**: Works out of the box with the free Satoshi API — no node required

## Installation

### Using pip

```bash
pip install bitcoin-mcp
```

### Using uvx

```bash
uvx bitcoin-mcp
```

## Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bitcoin": {
      "command": "uvx",
      "args": ["bitcoin-mcp"]
    }
  }
}
```

To use with your own Bitcoin Core node:

```json
{
  "mcpServers": {
    "bitcoin": {
      "command": "uvx",
      "args": ["bitcoin-mcp"],
      "env": {
        "BITCOIN_RPC_URL": "http://localhost:8332",
        "BITCOIN_RPC_USER": "your_rpc_user",
        "BITCOIN_RPC_PASSWORD": "your_rpc_password"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
| --- | --- |
| `get_blockchain_info` | Get current blockchain state |
| `get_block_count` | Get current block height |
| `get_block_stats` | Get detailed block statistics |
| `analyze_block` | Analyze a specific block |
| `compare_blocks` | Compare two blocks |
| `search_blocks` | Search blocks by criteria |
| `get_fee_estimates` | Get fee estimates for different targets |
| `get_fee_recommendation` | Get smart fee recommendation |
| `estimate_smart_fee` | Estimate fee for confirmation target |
| `estimate_transaction_cost` | Estimate cost for a transaction |
| `compare_fee_estimates` | Compare fees across sources |
| `get_mempool_info` | Get mempool statistics |
| `get_mempool_entry` | Get details of a mempool transaction |
| `get_mempool_ancestors` | Get ancestors of a mempool transaction |
| `analyze_mempool` | Analyze current mempool state |
| `analyze_next_block` | Predict next block contents |
| `analyze_transaction` | Analyze a confirmed transaction |
| `decode_raw_transaction` | Decode a raw transaction hex |
| `send_raw_transaction` | Broadcast a raw transaction |
| `get_mining_info` | Get current mining information |
| `get_difficulty_adjustment` | Get difficulty adjustment info |
| `get_halving_countdown` | Get next halving countdown |
| `get_mining_pool_rankings` | Get mining pool rankings |
| `get_network_info` | Get network information |
| `get_peer_info` | Get connected peer info |
| `get_node_status` | Get node status summary |
| `get_chain_tips` | Get chain tips |
| `get_chain_tx_stats` | Get chain transaction statistics |
| `get_supply_info` | Get Bitcoin supply information |
| `get_utxo_set_info` | Get UTXO set statistics |
| `check_utxo` | Check if a UTXO is unspent |
| `get_address_utxos` | Get UTXOs for an address |
| `get_btc_price` | Get current BTC price |
| `get_market_sentiment` | Get market sentiment indicators |
| `validate_address` | Validate a Bitcoin address |
| `generate_keypair` | Generate a new key pair |
| `explain_script` | Explain a Bitcoin script |
| `decode_bolt11_invoice` | Decode a Lightning BOLT11 invoice |
| `search_blockchain` | Search across the blockchain |
| `get_situation_summary` | Get Bitcoin network summary |
| `describe_rpc_command` | Describe an RPC command |
| `list_rpc_commands` | List available RPC commands |
| `query_remote_api` | Query a remote Bitcoin API |

## License

This MCP server is licensed under the Apache-2.0 License.
