---
name: Discord MCP
digest: Enable AI assistants to seamlessly interact with Discord, managing channels, messages, users, and webhooks via a Model Context Protocol server
author: SaseQ
homepage: https://github.com/SaseQ/discord-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - integrations
  - discord
  - mcp-server
  - automation
  - ai-assistants
icon: https://raw.githubusercontent.com/SaseQ/discord-mcp/dc02349a96a2a5b5ea3dc1c49c87fa57fe26baa3/assets/discord_mcp_icon.svg
createTime: 2025-07-30
featured: true
---

**Discord MCP** is a Model Context Protocol (MCP) server for the Discord API (JDA) that allows seamless integration of Discord bots with MCP‑compatible applications like Claude Desktop. It provides AI assistants with structured, secure access to Discord functionality—managing servers, channels, messages, users, categories, and webhooks—all through a single, standardized interface. :contentReference[oaicite:0]{index=0}

## 🔬 Installation

#### Clone the repository
```bash
git clone https://github.com/SaseQ/discord-mcp
```

#### Build the project
> NOTE: Maven installation is required to use the mvn command. Full instructions can be found [here](https://www.baeldung.com/install-maven-on-windows-linux-mac).
```bash
cd discord-mcp
mvn clean package # The jar file will be available in the /target directory
```

#### Configure AI client
Many code editors and other AI clients use a configuration file to manage MCP servers.

The Discord MPC server can be configured by adding the following to your configuration file.

> NOTE: You will need to create a Discord Bot token to use this server. Instructions on how to create a Discord Bot token can be found [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).
```json
{
  "mcpServers": {
    "discord-mcp": {
      "command": "java",
      "args": [
        "-jar",
        "/absolute/path/to/discord-mcp-0.0.1-SNAPSHOT.jar"
      ],
      "env": {
        "DISCORD_TOKEN": "YOUR_DISCORD_BOT_TOKEN",
        "DISCORD_GUILD_ID": "OPTIONAL_DEFAULT_SERVER_ID"
      }
    }
  }
}
```
The `DISCORD_GUILD_ID` environment variable is optional. When provided, it sets a default Discord server ID so any tool that accepts a `guildId` parameter can omit it.


## 🔧 GitMCP

Use Discord MCP remotely via [GitMCP](https://gitmcp.io/):
```json
{
  "mcpServers": {
    "discord-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://gitmcp.io/SaseQ/discord-mcp"
      ],
      "env": {
        "DISCORD_TOKEN": "YOUR_DISCORD_BOT_TOKEN",
        "DISCORD_GUILD_ID": "OPTIONAL_DEFAULT_SERVER_ID"
      }
    }
  }
}
```
Set `DISCORD_GUILD_ID` here as well if you want to automatically target a specific server.
More info and different configs [here](https://gitmcp.io/SaseQ/discord-mcp)


## ⚓ Smithery

Install Discord MCP Server automatically via [Smithery](https://smithery.ai/):
```bash
npx -y @smithery/cli@latest install @SaseQ/discord-mcp --client claude
```


## 🛠️ Available Tools

If `DISCORD_GUILD_ID` is set, the `guildId` parameter becomes optional for all tools below.

#### Server Information
- [`get_server_info`](): Get detailed discord server information

#### User Management
- [`get_user_id_by_name`](): Get a Discord user's ID by username in a guild for ping usage `<@id>`
- [`send_private_message`](): Send a private message to a specific user
- [`edit_private_message`](): Edit a private message from a specific user
- [`delete_private_message`](): Delete a private message from a specific user
- [`read_private_messages`](): Read recent message history from a specific user

#### Message Management
- [`send_message`](): Send a message to a specific channel
- [`edit_message`](): Edit a message from a specific channel
- [`delete_message`](): Delete a message from a specific channel
- [`read_messages`](): Read recent message history from a specific channel
- [`add_reaction`](): Add a reaction (emoji) to a specific message
- [`remove_reaction`](): Remove a specified reaction (emoji) from a message

#### Channel Management
- [`create_text_channel`](): Create text a channel
- [`delete_channel`](): Delete a channel
- [`find_channel`](): Find a channel type and ID using name and server ID
- [`list_channels`](): List of all channels

#### Category Management
- [`create_category`](): Create a new category for channels
- [`delete_category`](): Delete a category
- [`find_category`](): Find a category ID using name and server ID
- [`list_channels_in_category`](): List of channels in a specific category

#### Webhook Management
- [`create_webhook`](): Create a new webhook on a specific channel
- [`delete_webhook`](): Delete a webhook
- [`list_webhooks`](): List of webhooks on a specific channel
- [`send_webhook_message`](): Send a message via webhook

## About

**Discord MCP** bridges Discord’s rich API with any MCP‑compatible client, empowering AI agents with the ability to automate and orchestrate complex server interactions.

### Topics

`java` `ai` `discord` `mcp` `discord-bot` `claude` `mcp-server`

