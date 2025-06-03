---
name: Bright Data
digest: Access public web data through the Bright Data API
author: Bright Data
homepage: https://brightdata.com
repository: https://github.com/brightdata/brightdata-mcp
capabilities:
  resources: true
  tools: true
tags:
  - crawler
  - data-collection
  - api
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
---

Official Bright Data MCP server that enables LLMs to access public web data. This server allows MCP clients like Claude Desktop, Cursor, Windsurf, OpenAI Agents and others make decisions based on the information available on the web.


## 🌟 Overview

Welcome to the official Bright Data Model Context Protocol (MCP) server, enabling LLMs, agents and apps to access, discover and extract web data in real-time. This server allows MCP clients, such as Claude Desktop, Cursor, Windsurf and others, to seamlessly search the web, navigate websites, take action and retrieve data - without getting blocked - perfect for scraping tasks.

![MCP](https://github.com/user-attachments/assets/b949cb3e-c80a-4a43-b6a5-e0d6cec619a7)

## 🎬 Demo

The videos below demonstrate a minimal use case for Claude Desktop:

https://github.com/user-attachments/assets/59f6ebba-801a-49ab-8278-1b2120912e33

https://github.com/user-attachments/assets/61ab0bee-fdfa-4d50-b0de-5fab96b4b91d 

For YouTube tutorials and demos: [Demo](https://github.com/brightdata-com/brightdata-mcp/blob/main/examples/README.md)

## ✨ Features

- **Real-time Web Access**: Access up-to-date information directly from the web
- **Bypass Geo-restrictions**: Access content regardless of location constraints
- **Web Unlocker**: Navigate websites with bot detection protection
- **Browser Control**: Optional remote browser automation capabilities
- **Seamless Integration**: Works with all MCP-compatible AI assistants

## 🚀 Quickstart with Claude Desktop

1. Install `nodejs` to get the `npx` command (node.js module runner). Installation instructions can be found on the [node.js website](https://nodejs.org/en/download)

2. Go to Claude > Settings > Developer > Edit Config > claude_desktop_config.json to include the following:

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<insert-your-api-token-here>",
        "WEB_UNLOCKER_ZONE": "<optional if you want to override the default mcp_unlocker zone name>",
        "BROWSER_ZONE": "<optional browser zone name, defaults to mcp_browser>"
      }
    }
  }
}
```
## 🔧 Available Tools

[List of Available Tools](https://github.com/brightdata-com/brightdata-mcp/blob/main/assets/Tools.md)

## ⚠️ Security Best Practices

**Important:** Always treat scraped web content as untrusted data. Never use raw scraped content directly in LLM prompts to avoid potential prompt injection risks. 
Instead:
- Filter and validate all web data before processing
- Use structured data extraction rather than raw text (web_data tools)

## 🔧 Account Setup

1. Make sure you have an account on [brightdata.com](https://brightdata.com) (new users get free credit for testing, and pay as you go options are available)

2. Get your API key from the [user settings page](https://brightdata.com/cp/setting/users)

3. (Optional) Create a custom Web Unlocker zone 
   - By default, we create a Web Unlocker zone automatically using your API token
   - For more control, you can create your own Web Unlocker zone in your [control panel](https://brightdata.com/cp/zones) and specify it with the `WEB_UNLOCKER_ZONE` environment variable

4. (Optional) To enable browser control tools:
   - By default, the MCP tries to fetch credentials of `mcp_browser` zone.
   - If you don't have an `mcp_browser` zone, you can :
     - Create a Browser API zone in your [control panel](https://brightdata.com/cp/zones) or use an existing one and specify its name using the `BROWSER_ZONE` environment variable

![Browser API Setup](https://github.com/user-attachments/assets/cb494aa8-d84d-4bb4-a509-8afb96872afe)

## 🔌 Other MCP Clients

To use this MCP server with other agent types, you should adapt the following to your specific software:

- The full command to run the MCP server is `npx @brightdata/mcp`
- The environment variable `API_TOKEN=<your-token>` must exist when running the server
- (Optional) Set `BROWSER_ZONE=<zone-name>` to specify a custom Browser API zone name (defaults to `mcp_browser`)

## 🔄 Breaking Changes

### Browser Authentication Update

**BREAKING CHANGE:** The `BROWSER_AUTH` environment variable has been replaced with `BROWSER_ZONE`.

- **Before:** Users needed to provide `BROWSER_AUTH="user:pass"` from the Browser API zone
- **Now:** Users only need to specify the browser zone name with `BROWSER_ZONE="zone_name"`
- **Default:** If not specified, the system uses `mcp_browser` zone automatically
- **Migration:** Replace `BROWSER_AUTH` with `BROWSER_ZONE` in your configuration and specify your Browser API zone name if `mcp_browser` doesn't exists

## 🔄 Changelog

[CHANGELOG.md](https://github.com/brightdata-com/brightdata-mcp/blob/main/CHANGELOG.md)

## 🎮 Try Bright Data MCP Playgrounds

Want to try Bright Data MCP without setting up anything? 

Check out this playground on [Smithery](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools):

[![2025-05-06_10h44_20](https://github.com/user-attachments/assets/52517fa6-827d-4b28-b53d-f2020a13c3c4)](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)

This platform provide an easy way to explore the capabilities of Bright Data MCP without any local setup. Just sign in and start experimenting with web data collection!

## 💡 Usage Examples

Some example queries that this MCP server will be able to help with:

- "Google some movies that are releasing soon in [your area]"
- "What's Tesla's current market cap?"
- "What's the Wikipedia article of the day?"
- "What's the 7-day weather forecast in [your location]?"
- "Of the 3 highest paid tech CEOs, how long have their careers been?"

## ⚠️ Troubleshooting

### Timeouts when using certain tools

Some tools can involve reading web data, and the amount of time needed to load the page can vary by quite a lot in extreme circumstances.

To ensure that your agent will be able to consume the data, set a high enough timeout in your agent settings.

A value of `180s` should be enough for 99% of requests, but some sites load slower than others, so tune this to your needs.

### spawn npx ENOENT

This error occurs when your system cannot find the `npx` command. To fix it:

#### Finding npm/Node Path

**macOS:**

```
which node
```

Shows path like `/usr/local/bin/node`

**Windows:**

```
where node
```

Shows path like `C:\Program Files\nodejs\node.exe`

#### Update your MCP configuration:

Replace the `npx` command with the full path to Node, for example, on mac, it will look as follows:

```
"command": "/usr/local/bin/node"
```

## 📞 Support

If you encounter any issues or have questions, please reach out to the Bright Data support team or open an issue in the repository.
