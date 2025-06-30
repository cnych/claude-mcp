# itemit-mcp

**itemit-mcp** is an [MCP](https://mcp.umin.ai) server for asset tracking, providing a bridge between the [itemit](https://itemit.com) asset management API and the Model Context Protocol (MCP) ecosystem.

Built and maintained by the [uminai MCP](https://mcp.umin.ai) team.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Obtaining itemit API Credentials](#obtaining-itemit-api-credentials)
- [Installation & Build](#installation--build)
- [MCP Client Configuration](#mcp-client-configuration)
- [Environment Variables](#environment-variables)
- [Available MCP Tools](#available-mcp-tools)
- [Example Usage](#example-usage)
- [Response Format](#response-format)
- [Credits & Further Resources](#credits--further-resources)

---

## Overview

itemit-mcp exposes a set of tools for interacting with the [itemit](https://itemit.com) asset management platform via the MCP protocol. It allows you to search, create, and manage assets and locations programmatically, making it easy to integrate itemit with other MCP-enabled systems. Following tools available:
- Get List of items
- Get item by name search
- Create item
- Location Search (With item list on it)

---

## Prerequisites

- Node.js (v16+ recommended)
- Access to an [itemit](https://itemit.com) account (to obtain API credentials)
- MCP Client (see [uminai MCP](https://mcp.umin.ai) for more info)

---

## Obtaining itemit API Credentials

To use this MCP server, you need API credentials from [itemit](https://itemit.com):

- `ITEMIT_API_KEY`
- `ITEMIT_USER_ID`
- `ITEMIT_USER_TOKEN`
- `ITEMIT_WORKSPACE_ID`

You can obtain these by signing up or logging in at [itemit](https://itemit.com) and following their API documentation or contacting their support.

---

## Installation & Build

Clone this repository and install dependencies:

```sh
npm install
```

Build the project:

```sh
npm run build
```

---

## MCP Client Configuration

Add the following to your MCP Client configuration (e.g., `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "itemit-mcp": {
      "disabled": false,
      "timeout": 60,
      "type": "stdio",
      "command": "node",
      "args": [
        "/Users/<user>/Documents/itemit-mcp/build/index.js"
      ],
      "env": {
        "ITEMIT_API_KEY": "<YOUR_API_KEY>",
        "ITEMIT_USER_ID": "<YOUR_USER_ID>",
        "ITEMIT_USER_TOKEN": "<YOUR_USER_TOKEN>",
        "ITEMIT_WORKSPACE_ID": "<YOUR_WORKSPACE_ID>"
      }
    }
  }
}
```

Replace the placeholder values with your actual itemit credentials.

---

## Environment Variables

- `ITEMIT_API_KEY`: Your itemit API key
- `ITEMIT_USER_ID`: Your itemit user ID
- `ITEMIT_USER_TOKEN`: Your itemit user token
- `ITEMIT_WORKSPACE_ID`: Your itemit workspace ID

These can be set in your environment or in a `.env` file.

---

## Available MCP Tools

### 1. `get-location-by-name`

- **Description:** Get locations by name in itemit.
- **Parameters:**
  - `name` (string, required): Name of the location to search for
  - `limit` (integer, optional): Number of locations to retrieve (default 25, max 100)
  - `skip` (integer, optional): Number of locations to skip (default 0)
- **Example:**
  ```json
  {
    "name": "Warehouse"
  }
  ```

---

### 2. `search-item-by-name`

- **Description:** Search for items by name in itemit.
- **Parameters:**
  - `name` (string, required): Name of the item to search for
  - `size` (integer, optional): Number of items to retrieve (default 15, max 100)
  - `page` (integer, optional): Page number (default 1)
- **Example:**
  ```json
  {
    "name": "Laptop"
  }
  ```

---

### 3. `create-item`

- **Description:** Create an item in itemit.
- **Parameters:**
  - `name` (string, required): Name of the item
  - `description` (string, required): Description of the item
  - `serial` (string, required): Serial number of the item
- **Example:**
  ```json
  {
    "name": "Projector",
    "description": "Epson HD Projector",
    "serial": "SN123456"
  }
  ```

---

### 4. `get-reminders`

- **Description:** Get reminders from itemit.
- **Parameters:** None

---

### 5. `get-items`

- **Description:** Get items from itemit.
- **Parameters:**
  - `size` (integer, optional): Number of items to retrieve (default 15, max 100)
- **Example:**
  ```json
  {
    "size": 10
  }
  ```

---

## Example Usage

Use your MCP Client to invoke these tools. For example, to search for an item:

```json
{
  "tool": "search-item-by-name",
  "arguments": {
    "name": "Laptop"
  }
}
```

---

## Response Format

All responses are returned as structured text or JSON, matching the itemit API's data model. For example, a successful search might return:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Search results for \"Laptop\" (size=15):\n1. Dell XPS 13 (ID: 1234)\n2. MacBook Pro (ID: 5678)\n..."
    }
  ]
}
```

---

## Credits & Further Resources

- Project by the [uminai MCP](https://mcp.umin.ai) team.
- Powered by [itemit](https://itemit.com).
- Discover more MCP servers and integrations at [mcp.umin.ai](https://mcp.umin.ai).

---
