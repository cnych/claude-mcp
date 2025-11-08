---
name: Civic Nexus
digest: Zero-setup MCP gateway securely connecting AI to your tools with authentication and workflows
author: Civic
repository: https://github.com/civicteam/civic-mcp
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - gateway
  - aggregator
  - authentication
  - oauth
  - authorization
  - workflow
icon: https://docs.civic.com/favicon.ico
createTime: 2025-01-15T00:00:00Z
---

# Civic Nexus - MCP Gateway

Civic Nexus is a zero-setup MCP gateway that securely connects AI assistants to your tools with built-in authentication and workflows. It acts as an aggregator, exposing multiple MCP servers through a single unified interface while providing OAuth-based authentication and authorization controls.

## 🎯 What does Civic Nexus do?

Civic Nexus provides a secure gateway between AI assistants and various MCP servers, enabling:

- **Unified Access**: Connect to multiple MCP servers through a single endpoint
- **Authentication**: Built-in OAuth 2.0 authentication using Civic Auth
- **Authorization**: Fine-grained access controls and request/response constraints
- **Workflow Automation**: Pre-configured workflows combining multiple tools
- **Zero Setup**: Remote-hosted service - no local installation required

## 🌐 Remote MCP Server

Civic Nexus is available as a remote MCP server, meaning you don't need to install or run anything locally. Simply configure your MCP client to connect to:

```
https://nexus.civic.com/hub/mcp
```

## ⚙️ Configuration

### Claude Desktop

Add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "civic-nexus": {
      "type": "sse",
      "url": "https://nexus.civic.com/hub/mcp"
    }
  }
}
```

### Other MCP Clients

Civic Nexus uses the SSE (Server-Sent Events) transport protocol. Configure your MCP client to connect to the endpoint above using SSE transport.

## 🔐 Authentication

Civic Nexus uses OAuth 2.0 for secure authentication:

1. When you first connect, you'll be prompted to authenticate via Civic Auth
2. Grant the necessary permissions for the tools you want to access
3. Your session will be securely maintained for subsequent requests

## 🧱 Features

### Gateway Architecture

- **Multi-Server Aggregation**: Access multiple MCP servers through a single connection
- **Request Routing**: Intelligent routing of tool calls to the appropriate backend server
- **Response Transformation**: Unified response format across different servers

### Security

- **OAuth 2.0 Authentication**: Industry-standard authentication flow
- **Authorization Controls**: Fine-grained permissions for each tool and resource
- **Request Constraints**: Validate and filter requests to prevent unauthorized access
- **Response Constraints**: Filter sensitive data from responses

### Workflow Engine

- **Pre-configured Workflows**: Common task automation patterns
- **Tool Chaining**: Combine multiple tools into cohesive workflows
- **Error Handling**: Robust error recovery and retry logic

## 📚 Learn More

- [Documentation](https://docs.civic.com/nexus)
- [Quick Start Guide](https://docs.civic.com/nexus/quickstart)
- [Company Website](https://civic.com)
- [GitHub Repository](https://github.com/civicteam/civic-mcp)

## 🆘 Support

For questions or issues:
- Email: support@civic.com
- Documentation: https://docs.civic.com

## 🏢 About Civic

Civic provides secure identity and access management solutions, helping organizations protect user data while enabling seamless authentication experiences.
