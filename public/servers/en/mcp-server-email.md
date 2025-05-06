---
name: MCP Email Server
digest: 📧 A Model Context Protocol server that provides email functionality. This server enables LLMs to compose and send emails, as well as search for attachments within specified directories.
author: Shy2593666979
repository: https://github.com/Shy2593666979/mcp-server-email
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - email
  - smtp
  - search
icon: https://avatars.githubusercontent.com/u/105286202?v=4
createTime: 2025-03-23
---

A [Model Context Protocol](/) server that provides email functionality. This server enables LLMs to compose and send emails, as well as search for attachments within specified directories.

![1742711978001](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-3f2f5e52.jpg)

![1742712768132](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-8d59fdeb.jpg)

## Features

- Send emails with multiple recipients
- Support for email attachments
- Search for files in directories based on pattern matching
- Secure email transmission using SMTP

### Available Tools

- `send_email` - Sends emails based on the provided subject, body, and receiver.

  - `receiver` (array of strings, required): List of recipient email addresses
  - `body` (string, required): The main content of the email
  - `subject` (string, required): The subject line of the email
  - `attachments` (array of strings or string, optional): Email attachments (filenames)

- `search_attachments` - Searches for files in a specified directory that match a given pattern.
  - `pattern` (string, required): The text pattern to search for in file names

### Prompts

- **send_email**

  - Send an email with optional attachments
  - Arguments:
    - `receiver` (required): The list of recipient email addresses
    - `body` (required): The main content of the email
    - `subject` (required): The subject line of the email
    - `attachments` (optional): Email attachments

- **search_attachments**
  - Search for files matching a pattern
  - Arguments:
    - `pattern` (required): The text pattern to search for in file names

## Installation

### Using pip

Install the required dependencies:

```bash
pip install pydantic python-dotenv
```

### Email Configuration

An `email.json` file with SMTP server configurations:

```json
[
  {
    "domain": "@gmail.com",
    "server": "smtp.gmail.com",
    "port": 587
  },
  {
    "domain": "@outlook.com",
    "server": "smtp.office365.com",
    "port": 587
  },
  {
    "domain": "@yahoo.com",
    "server": "smtp.mail.yahoo.com",
    "port": 587
  }
]
```

## Usage

### Running the Server

Start the MCP Email Server with:

```bash
python -m mcp_email_server (--dir /path/to/attachment/directory)
```

### Configure for Claude.app

Add to your Claude settings:

#### Conda

```json
{
  "mcpServers": {
    "email": {
      "command": "D:\\conda\\envs\\mcp\\python.exe",
      "args": [
        "C:\\Users\\YourUserName\\Desktop\\servers\\src\\email\\src\\mcp_server_email",
        "--dir",
        "C:\\Users\\YourUserName\\Desktop"
      ],
      "env": {
        "SENDER": "2593666979q@gmail.com",
        "PASSWORD": "tuogk......."
      }
    }
  }
}
```

#### UV

```json
{
  "mcpServers": {
    "email": {
      "command": "uv",
      "args": [
        "~\\servers\\src\\email\\src\\mcp_server_email",
        "--dir",
        "C:\\Users\\YourUserName\\Desktop"
      ],
      "env": {
        "SENDER": "2593666979q@gmail.com",
        "PASSWORD": "tuogk......."
      }
    }
  }
}
```

## Security Notes

- For Gmail and other services, you may need to use an app-specific password
- The server supports a limited set of attachment file types for security reasons

## Supported File Types

The server supports the following attachment file types:

- Documents: doc, docx, xls, xlsx, ppt, pptx, pdf
- Archives: zip, rar, 7z, tar, gz
- Text files: txt, log, csv, json, xml
- Images: jpg, jpeg, png, gif, bmp
- Other: md

## Example Usage

### Sending an Email

```json
{
  "receiver": ["recipient@example.com"],
  "subject": "Test Email from MCP Server",
  "body": "This is a test email sent via the MCP Email Server.",
  "attachments": ["document.pdf", "image.jpg"]
}
```

### Searching for Attachments

```json
{
  "pattern": "report"
}
```

## License

MCP Email Server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License.
