---
name: MCPQL - SQL Server MCP Server
digest: A comprehensive Model Context Protocol server for SQL Server database operations. This server provides 10 powerful tools for database analysis, object discovery, and data manipulation through the MCP protocol.
author: hendrickcastro
repository: https://github.com/hendrickcastro/MCPQL
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - mssql
  - sql
  - database
icon: https://avatars.githubusercontent.com/u/8320893?s=48&v=4
createTime: 2025-07-10
---

A comprehensive **Model Context Protocol (MCP)** server for **SQL Server** database operations. This server provides 10 powerful tools for database analysis, object discovery, and data manipulation through the MCP protocol.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- SQL Server database with appropriate connection credentials
- MCP-compatible client (like Claude Desktop, Cursor IDE, or any MCP client)

### Installation & Configuration

#### Option 1: Using npx from GitHub (Recommended)

No installation needed! Just configure your MCP client:

**For Claude Desktop (`claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "sql",
        "DB_SERVER": "your_server",
        "DB_NAME": "your_database",
        "DB_USER": "your_username",
        "DB_PASSWORD": "your_password",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

**For Cursor IDE:**

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "sql",
        "DB_SERVER": "your_server",
        "DB_NAME": "your_database",
        "DB_USER": "your_username",
        "DB_PASSWORD": "your_password",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

#### Option 2: Local Development Installation

1. **Clone and setup:**

```bash
git clone https://github.com/hendrickcastro/MCPQL.git
cd MCPQL
npm install
npm run build
```

2. **Configure database connection:**
   Create a `.env` file with your database credentials:

```bash
# Basic SQL Server connection
DB_AUTHENTICATION_TYPE=sql
DB_SERVER=localhost
DB_NAME=MyDatabase
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

3. **Configure MCP client with local path:**

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "node",
      "args": ["path/to/MCPQL/dist/server.js"]
    }
  }
}
```

## 🛠️ Available Tools

MCPQL provides 10 comprehensive tools for SQL Server database operations:

### 1. 🏗️ **Table Analysis** - `mcp_table_analysis`

Complete table structure analysis including columns, keys, indexes, and constraints.

### 2. 📋 **Stored Procedure Analysis** - `mcp_sp_structure`

Analyze stored procedure structure including parameters, dependencies, and source code.

### 3. 👀 **Data Preview** - `mcp_preview_data`

Preview table data with optional filtering and row limits.

### 4. 📊 **Column Statistics** - `mcp_get_column_stats`

Get comprehensive statistics for a specific column.

### 5. ⚙️ **Execute Stored Procedure** - `mcp_execute_procedure`

Execute stored procedures with parameters and return results.

### 6. 🔍 **Execute SQL Query** - `mcp_execute_query`

Execute custom SQL queries with full error handling.

### 7. ⚡ **Quick Data Analysis** - `mcp_quick_data_analysis`

Quick statistical analysis including row count, column distributions, and top values.

### 8. 🔎 **Comprehensive Search** - `mcp_search_comprehensive`

Search across database objects by name and definition with configurable criteria.

### 9. 🔗 **Object Dependencies** - `mcp_get_dependencies`

Get dependencies for database objects (tables, views, stored procedures, etc.).

### 10. 🎯 **Sample Values** - `mcp_get_sample_values`

Get sample values from a specific column in a table.

## 📋 Usage Examples

### Analyzing a Table

```typescript
// Get complete table structure
const analysis = await mcp_table_analysis({
  table_name: "dbo.Users",
});

// Get quick data overview
const overview = await mcp_quick_data_analysis({
  table_name: "dbo.Users",
  sample_size: 500,
});

// Preview table data with filters
const data = await mcp_preview_data({
  table_name: "dbo.Users",
  filters: { Status: "Active", Department: "IT" },
  limit: 25,
});
```

### Finding Database Objects

```typescript
// Find all objects containing "User"
const objects = await mcp_search_comprehensive({
  pattern: "User",
  search_in_names: true,
  search_in_definitions: false,
});

// Find procedures that query a specific table
const procedures = await mcp_search_comprehensive({
  pattern: "FROM Users",
  object_types: ["PROCEDURE"],
  search_in_definitions: true,
});
```

### Analyzing Stored Procedures

```typescript
// Get complete stored procedure analysis
const spAnalysis = await mcp_sp_structure({
  sp_name: "dbo.usp_GetUserData",
});

// Execute a stored procedure
const result = await mcp_execute_procedure({
  sp_name: "dbo.usp_GetUserById",
  params: { UserId: 123, IncludeDetails: true },
});
```

### Data Analysis

```typescript
// Get column statistics
const stats = await mcp_get_column_stats({
  table_name: "dbo.Users",
  column_name: "Age",
});

// Get sample values from a column
const samples = await mcp_get_sample_values({
  table_name: "dbo.Users",
  column_name: "Department",
  limit: 15,
});
```

## 🔧 Environment Variables & Connection Types

MCPQL supports multiple SQL Server connection types with comprehensive configuration options:

### 🔐 Authentication Types

Set `DB_AUTHENTICATION_TYPE` to one of:

- `sql` - SQL Server Authentication (default)
- `windows` - Windows Authentication
- `azure-ad` - Azure Active Directory Authentication

### 📋 Complete Environment Variables

| Variable                      | Description                                | Default      | Required For                       |
| ----------------------------- | ------------------------------------------ | ------------ | ---------------------------------- |
| **Basic Connection**          |
| `DB_AUTHENTICATION_TYPE`      | Authentication type (sql/windows/azure-ad) | sql          | All                                |
| `DB_SERVER`                   | SQL Server hostname/IP                     | -            | All                                |
| `DB_NAME`                     | Database name                              | -            | All                                |
| `DB_PORT`                     | SQL Server port                            | 1433         | All                                |
| `DB_TIMEOUT`                  | Connection timeout (ms)                    | 30000        | All                                |
| `DB_REQUEST_TIMEOUT`          | Request timeout (ms)                       | 30000        | All                                |
| **SQL Server Authentication** |
| `DB_USER`                     | SQL Server username                        | -            | SQL Auth                           |
| `DB_PASSWORD`                 | SQL Server password                        | -            | SQL Auth                           |
| **Windows Authentication**    |
| `DB_DOMAIN`                   | Windows domain                             | -            | Windows Auth                       |
| `DB_USER`                     | Windows username                           | current user | Windows Auth                       |
| `DB_PASSWORD`                 | Windows password                           | -            | Windows Auth                       |
| **Azure AD Authentication**   |
| `DB_USER`                     | Azure AD username                          | -            | Azure AD (Password)                |
| `DB_PASSWORD`                 | Azure AD password                          | -            | Azure AD (Password)                |
| `DB_AZURE_CLIENT_ID`          | Azure AD App Client ID                     | -            | Azure AD (Service Principal)       |
| `DB_AZURE_CLIENT_SECRET`      | Azure AD App Client Secret                 | -            | Azure AD (Service Principal)       |
| `DB_AZURE_TENANT_ID`          | Azure AD Tenant ID                         | -            | Azure AD (Service Principal)       |
| **SQL Server Express**        |
| `DB_INSTANCE_NAME`            | Named instance (e.g., SQLEXPRESS)          | -            | Express instances                  |
| **Security Settings**         |
| `DB_ENCRYPT`                  | Enable encryption                          | false        | All                                |
| `DB_TRUST_SERVER_CERTIFICATE` | Trust server certificate                   | false        | All                                |
| `DB_ENABLE_ARITH_ABORT`       | Enable arithmetic abort                    | true         | All                                |
| `DB_USE_UTC`                  | Use UTC for dates                          | true         | All                                |
| **Connection Pool**           |
| `DB_POOL_MAX`                 | Maximum connections                        | 10           | All                                |
| `DB_POOL_MIN`                 | Minimum connections                        | 0            | All                                |
| `DB_POOL_IDLE_TIMEOUT`        | Idle timeout (ms)                          | 30000        | All                                |
| **Advanced Settings**         |
| `DB_CANCEL_TIMEOUT`           | Cancel timeout (ms)                        | 5000         | All                                |
| `DB_PACKET_SIZE`              | Packet size (bytes)                        | 4096         | All                                |
| `DB_CONNECTION_STRING`        | Complete connection string                 | -            | Alternative to individual settings |

## 🔧 Connection Configuration Examples

### 1. 🏠 SQL Server Local (SQL Authentication)

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "sql",
        "DB_SERVER": "localhost",
        "DB_NAME": "MyDatabase",
        "DB_USER": "sa",
        "DB_PASSWORD": "YourPassword123!",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

### 2. 🏢 SQL Server Express (Named Instance)

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "sql",
        "DB_SERVER": "localhost",
        "DB_INSTANCE_NAME": "SQLEXPRESS",
        "DB_NAME": "MyDatabase",
        "DB_USER": "sa",
        "DB_PASSWORD": "YourPassword123!",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

### 3. 🪟 Windows Authentication

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "windows",
        "DB_SERVER": "MYSERVER",
        "DB_NAME": "MyDatabase",
        "DB_DOMAIN": "MYDOMAIN",
        "DB_USER": "myuser",
        "DB_PASSWORD": "mypassword",
        "DB_ENCRYPT": "false",
        "DB_TRUST_SERVER_CERTIFICATE": "true"
      }
    }
  }
}
```

### 4. ☁️ Azure SQL Database (Azure AD Password)

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "azure-ad",
        "DB_SERVER": "myserver.database.windows.net",
        "DB_NAME": "MyDatabase",
        "DB_USER": "user@domain.com",
        "DB_PASSWORD": "userpassword",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "true",
        "DB_TRUST_SERVER_CERTIFICATE": "false"
      }
    }
  }
}
```

### 5. 🔐 Azure SQL Database (Service Principal)

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_AUTHENTICATION_TYPE": "azure-ad",
        "DB_SERVER": "myserver.database.windows.net",
        "DB_NAME": "MyDatabase",
        "DB_AZURE_CLIENT_ID": "your-client-id",
        "DB_AZURE_CLIENT_SECRET": "your-client-secret",
        "DB_AZURE_TENANT_ID": "your-tenant-id",
        "DB_PORT": "1433",
        "DB_ENCRYPT": "true",
        "DB_TRUST_SERVER_CERTIFICATE": "false"
      }
    }
  }
}
```

### 6. 🔗 Using Connection String

```json
{
  "mcpServers": {
    "mcpql": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/mcpql"],
      "env": {
        "DB_CONNECTION_STRING": "Server=localhost;Database=MyDatabase;User Id=sa;Password=YourPassword123!;Encrypt=false;TrustServerCertificate=true;"
      }
    }
  }
}
```

## 🚨 Troubleshooting Common Issues

### Connection Issues

- **"Login failed"**: Check username/password. For Windows auth, ensure `DB_AUTHENTICATION_TYPE=windows`
- **"Server was not found"**: Verify server name and port. For SQL Express, add `DB_INSTANCE_NAME`
- **"Certificate" errors**: For local development, set `DB_TRUST_SERVER_CERTIFICATE=true`
- **Timeout errors**: Increase `DB_TIMEOUT` or check network connectivity

### SQL Server Express Setup

1. Enable TCP/IP protocol in SQL Server Configuration Manager
2. Set a static port (usually 1433) or use dynamic port with Browser Service
3. Configure Windows Firewall to allow SQL Server traffic
4. Use `DB_INSTANCE_NAME=SQLEXPRESS` for default Express installations

### Azure SQL Database Setup

1. Create server firewall rules to allow client IP
2. Use format: `server.database.windows.net` for server name
3. Always set `DB_ENCRYPT=true` and `DB_TRUST_SERVER_CERTIFICATE=false`
4. For Service Principal auth, register app in Azure AD and assign permissions

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

The test suite includes comprehensive testing of all 10 tools with real database testing and complete coverage.

## 🏗️ Architecture

### Project Structure

```
MCPQL/
├── src/
│   ├── __tests__/          # Comprehensive test suite
│   ├── tools/              # Modular tool implementations
│   │   ├── tableAnalysis.ts      # Table analysis tools
│   │   ├── storedProcedureAnalysis.ts  # SP analysis tools
│   │   ├── dataOperations.ts     # Data operation tools
│   │   ├── objectSearch.ts       # Search and discovery tools
│   │   ├── types.ts              # Type definitions
│   │   └── index.ts              # Tool exports
│   ├── db.ts               # Database connection management
│   ├── server.ts           # MCP server setup and handlers
│   ├── tools.ts            # Tool definitions and schemas
│   └── mcp-server.ts       # Tool re-exports
├── dist/                   # Compiled JavaScript output
└── package.json           # Dependencies and scripts
```

### Key Features

- ⚡ **Connection Pooling**: Efficient database connection management
- 🛡️ **Robust Error Handling**: Comprehensive error handling and validation
- 📋 **Rich Metadata**: Detailed results with comprehensive database information
- 🔧 **Flexible Configuration**: Environment-based configuration
- 📊 **Optimized Queries**: Efficient SQL queries for all operations

## 📝 Important Notes

- **Object Names**: Always use schema-qualified names (e.g., `dbo.Users`, `api.Idiomas`)
- **Error Handling**: All tools return structured responses with success/error indicators
- **Type Safety**: Full TypeScript support with proper type definitions
- **Connection Management**: Automatic connection pooling and retry logic
- **Security**: Parameterized queries to prevent SQL injection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Uses [mssql](https://github.com/tediousjs/node-mssql) for SQL Server connectivity
- Comprehensive testing with [Jest](https://jestjs.io/)

## 🏷️ Tags & Keywords

**Database:** `sql-server` `azure-sql` `database-analysis` `database-tools` `mssql` `t-sql` `database-management` `database-administration` `database-operations` `data-analysis`

**MCP & AI:** `model-context-protocol` `mcp-server` `mcp-tools` `ai-tools` `claude-desktop` `cursor-ide` `anthropic` `llm-integration` `ai-database` `intelligent-database`

**Technology:** `typescript` `nodejs` `npm-package` `cli-tool` `database-client` `sql-client` `database-sdk` `rest-api` `json-api` `database-connector`

**Features:** `table-analysis` `stored-procedures` `data-preview` `column-statistics` `query-execution` `database-search` `object-dependencies` `schema-analysis` `data-exploration` `database-insights`

**Deployment:** `docker` `azure-deployment` `cloud-ready` `enterprise-ready` `production-ready` `scalable` `secure` `authenticated` `encrypted` `configurable`

**Use Cases:** `database-development` `data-science` `business-intelligence` `database-migration` `schema-documentation` `performance-analysis` `data-governance` `database-monitoring` `troubleshooting` `automation`

---

**🎯 MCPQL provides comprehensive SQL Server database analysis and manipulation capabilities through the Model Context Protocol. Perfect for database administrators, developers, and anyone working with SQL Server databases!** 🚀
