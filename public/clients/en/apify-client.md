---
name: Apify Tester MCP Client
digest: A Client that connects AI agents to Apify's ecosystem of 5,000+ web scraping and automation Actors, enabling data extraction from websites, social media, search engines, and maps.
author: Apify
homepage: https://apify.com/jiri.spilka/tester-mcp-client
docs: https://mcp.apify.com
icon: https://apify.com/ext/apify-symbol-512px.svg
windows: true
mac: true
linux: true
featured: true
tags:
  - Web scraping
  - Apify Actors
  - Integration
createTime: 2025-05-13
---


## 🚀 Main features

- 🔌 Connects to an MCP server using Server-Sent Events (SSE)
- 💬 Provides a chat-like UI for displaying tool calls and results
- 🇦 Connects to an [Apify MCP Server](https://apify.com/apify/actors-mcp-server) for interacting with one or more Apify Actors
- 💥 Dynamically uses tools based on context and user queries (if supported by a server)
- 🔓 Use Authorization headers and API keys for secure connections
- 🪟 Open source, so you can review it, suggest improvements, or modify it

## 🎯 What does Tester MCP Client do?

When connected to [Actors-MCP-Server](https://apify.com/apify/actors-mcp-server) the Tester MCP Client provides an interactive chat interface where you can:

- "What are the most popular Actors for social media scraping?"
- "Show me the best way to use the Instagram Scraper"
- "Which Actor should I use to extract data from LinkedIn?"
- "Can you help me understand how to scrape Google search results?"

![Tester-MCP-client-screenshot](https://raw.githubusercontent.com/apify/tester-mcp-client/refs/heads/main/docs/chat-ui.png)

## 📖 How does it work?

The Apify MCP Client connects to a running MCP server over Server-Sent Events (SSE) and it does the following:

- Initiates an SSE connection to the MCP server `/sse`.
- Sends user queries to the MCP server via `POST /message`.
- Receives real-time streamed responses (via `GET /sse`) that may include LLM output, and **tool usage** blocks
- Based on the LLM response, orchestrates tool calls and displays the conversation
- Displays the conversation

## ⚙️ Usage

- Test any MCP server over SSE
- Test [Apify Actors MCP Server](https://apify.com/apify/actors-mcp-server) and ability to dynamically select amongst 3000+ tools

### Normal Mode (on Apify)

You can run the Tester MCP Client on Apify and connect it to any MCP server that supports SSE.
Configuration can be done via the Apify UI or API by specifying parameters such as the MCP server URL, system prompt, and API key.

Once you run Actor, check the logs for a link to the Tester MCP Client UI, where you can interact with the MCP server:
The URL will look like this and will be different from run to run:
```shell
INFO  Navigate to https://......runs.apify.net in your browser to interact with an MCP server.
```

### Standby Mode (on Apify)

In progress 🚧

## 💰 Pricing

The Apify MCP Client is free to use. You only pay for LLM provider usage and resources consumed on the Apify platform.

This Actor uses a modern and flexible approach for AI Agents monetization and pricing called [Pay-per-event](https://docs.apify.com/sdk/js/docs/guides/pay-per-event).

Events charged:
- Actor start (based on memory used, charged per 128 MB unit)
- Running time (charged every 5 minutes, per 128 MB unit)
- Query answered (depends on the model used, not charged if you provide your own API key for LLM provider)

When you use your own LLM provider API key, running the MCP Client for 1 hour with 128 MB memory costs approximately $0.06.
With the Apify Free tier (no credit card required 💳), you can run the MCP Client for 80 hours per month.
Definitely enough to test your MCP server!

## 📖 How it works

```plaintext
Browser ← (SSE) → Tester MCP Client  ← (SSE) → MCP Server
```
We create this chain to keep any custom bridging logic inside the Tester MCP Client, while leaving the main MCP Server unchanged.
The browser uses SSE to communicate with the Tester MCP Client, and the Tester MCP Client relies on SSE to talk to the MCP Server.
This separates extra client-side logic from the core server, making it easier to maintain and debug.

1. Navigate to `https://tester-mcp-client.apify.actor?token=YOUR-API-TOKEN` (or http://localhost:3000 if you are running it locally).
2. Files `index.html` and `client.js` are served from the `public/` directory.
3. Browser opens SSE stream via `GET /sse`.
4. The user's query is sent with `POST /message`.
5. Query processing:
    - Calls Large Language Model.
    - Optionally calls tools if required using
6. For each result chunk, `sseEmit(role, content)`


### Local development

The Tester MCP Client Actor is open source and available on [GitHub](https://github.com/apify/rag-web-browser), allowing you to modify and develop it as needed.

Download the source code:

```bash
git clone https://github.com/apify/tester-mcp-client.git
cd tester-mcp-client
```
Install the dependencies:
```shell
npm install
```

Create a `.env` file with the following content (refer to the `.env.example` file for guidance):

```plaintext
APIFY_TOKEN=YOUR_APIFY_TOKEN
LLM_PROVIDER_API_KEY=YOUR_API_KEY
```

Default values for settings such as `mcpUrl`, `systemPrompt`, and others are defined in the `const.ts` file. You can adjust these as needed for your development.

Run the client locally

```bash
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser to interact with the MCP server.

**Happy chatting with Apify Actors!**

## ⓘ Limitations and feedback

The client does not support all MCP features, such as Prompts and Resource.
Also, it does not store the conversation, so refreshing the page will clear the chat history.

## References

- [Model Context Protocol](https://modelcontextprotocol.org/)
- [Apify Actors MCP Server](https://apify.com/apify/actors-mcp-server)
- [Pay-per-event pricing model](https://docs.apify.com/sdk/js/docs/guides/pay-per-event)
- [What are AI Agents?](https://blog.apify.com/what-are-ai-agents/)
- [What is MCP and why does it matter?](https://blog.apify.com/what-is-model-context-protocol/)
