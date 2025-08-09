---
name: MCP CosmosDB - Azure CosmosDB MCP Server
digest: A comprehensive MCP server for Azure CosmosDB database operations.
author: Hendrick Castro
tags:
  - database
  - nosql
  - azure
repository: https://github.com/hendrickcastro/MCPCosmosDB
capabilities:
  prompts: false
  resources: false
  tools: true
createTime: 2025-07-09T00:00:00Z
---

A comprehensive **Model Context Protocol (MCP)** server for **Azure CosmosDB** database operations. This server provides 8 powerful tools for document database analysis, container discovery, and data querying through the MCP protocol.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Azure CosmosDB database with connection string
- MCP-compatible client (like Claude Desktop, Cursor IDE, or any MCP client)

### Installation & Configuration

#### Option 1: Using npx from GitHub (Recommended)

No installation needed! Just configure your MCP client to run directly from the GitHub repository:

**For Claude Desktop (`claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    "mcp-cosmosdb": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPCosmosDB"],
      "env": {
        "OCONNSTRING": "AccountEndpoint=https://your-cosmos-account.documents.azure.com:443/;AccountKey=your-account-key-here;",
        "COSMOS_DATABASE_ID": "your-database-name"
      }
    }
  }
}
```

**For Cursor IDE (`~/.cursor/mcp.json`):**

```json
{
  "mcp-cosmosdb": {
    "command": "npx",
    "args": ["-y", "hendrickcastro/MCPCosmosDB"],
    "description": "Servidor MCP para interactuar con Azure CosmosDB.",
    "disabled": false,
    "env": {
      "OCONNSTRING": "AccountEndpoint=https://your-cosmos-account.documents.azure.com:443/;AccountKey=your-account-key-here;",
      "COSMOS_DATABASE_ID": "your-database-name"
    }
  }
}
```

#### Option 2: Local Development Installation

1. **Clone and setup:**

```bash
git clone <your-repo-url>
cd MCPCosmosDB
npm install
npm run build
```

2. **Configure CosmosDB connection:**
   Create a `.env` file with your CosmosDB credentials:

```bash
# CosmosDB Connection String from Azure Portal
OCONNSTRING=AccountEndpoint=https://your-cosmos-account.documents.azure.com:443/;AccountKey=your-account-key-here;

# Database ID to connect to
COSMOS_DATABASE_ID=your-database-name
```

3. **Configure MCP client with local path:**

```json
{
  "mcpServers": {
    "mcp-cosmosdb": {
      "command": "node",
      "args": ["path/to/MCPCosmosDB/dist/server.js"],
      "env": {
        "OCONNSTRING": "AccountEndpoint=https://your-cosmos-account.documents.azure.com:443/;AccountKey=your-account-key-here;",
        "COSMOS_DATABASE_ID": "your-database-name"
      }
    }
  }
}
```

## 🛠️ Available Tools

MCP CosmosDB provides 8 comprehensive tools for Azure CosmosDB operations:

### 1. 🗄️ **List Databases** - `mcp_list_databases`

List all databases in the CosmosDB account.

### 2. 📦 **List Containers** - `mcp_list_containers`

List all containers in the current database.

### 3. 📋 **Container Information** - `mcp_container_info`

Get detailed information about a specific container including partition key, indexing policy, and throughput settings.

### 4. 📊 **Container Statistics** - `mcp_container_stats`

Get statistics about a container including document count, size estimation, and partition key distribution.

### 5. 🔍 **Execute SQL Query** - `mcp_execute_query`

Execute SQL queries against CosmosDB containers with parameters and performance metrics.

### 6. 📄 **Get Documents** - `mcp_get_documents`

Retrieve documents from containers with optional filtering and partition key targeting.

### 7. 🎯 **Get Document by ID** - `mcp_get_document_by_id`

Retrieve a specific document by its ID and partition key.

### 8. 🏗️ **Schema Analysis** - `mcp_analyze_schema`

Analyze document schema structure in containers to understand data patterns.

## 📋 Usage Examples

### Container Analysis

```typescript
// List all containers
const containers = await mcp_list_containers();

// Get container information
const containerInfo = await mcp_container_info({
  container_id: "users",
});

// Get container statistics
const stats = await mcp_container_stats({
  container_id: "users",
  sample_size: 1000,
});
```

### Querying Data

```typescript
// Execute SQL query
const result = await mcp_execute_query({
  container_id: "products",
  query: "SELECT * FROM c WHERE c.category = @category AND c.price > @minPrice",
  parameters: { category: "electronics", minPrice: 100 },
  max_items: 50,
});

// Get documents with filters
const documents = await mcp_get_documents({
  container_id: "orders",
  filter_conditions: { status: "completed", year: 2024 },
  limit: 100,
});
```

### Document Operations

```typescript
// Get specific document
const document = await mcp_get_document_by_id({
  container_id: "users",
  document_id: "user-123",
  partition_key: "user-123",
});

// Analyze schema
const schema = await mcp_analyze_schema({
  container_id: "products",
  sample_size: 500,
});
```

## 🔧 Environment Variables & Configuration

### Required Environment Variables

| Variable             | Description                                  | Example                                       |
| -------------------- | -------------------------------------------- | --------------------------------------------- |
| `OCONNSTRING`        | CosmosDB connection string from Azure Portal | `AccountEndpoint=https://...;AccountKey=...;` |
| `COSMOS_DATABASE_ID` | Database ID to connect to                    | `MyDatabase`                                  |

### Optional Configuration

| Variable                              | Description                         | Default |
| ------------------------------------- | ----------------------------------- | ------- |
| `COSMOS_ENABLE_ENDPOINT_DISCOVERY`    | Enable automatic endpoint discovery | `true`  |
| `COSMOS_MAX_RETRY_ATTEMPTS`           | Maximum retry attempts for requests | `9`     |
| `COSMOS_MAX_RETRY_WAIT_TIME`          | Maximum retry wait time (ms)        | `30000` |
| `COSMOS_ENABLE_CROSS_PARTITION_QUERY` | Enable cross-partition queries      | `true`  |

## 🔧 Configuration Examples

### 1. 🌐 Azure CosmosDB (Production)

```json
{
  "mcpServers": {
    "mcp-cosmosdb": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPCosmosDB"],
      "env": {
        "OCONNSTRING": "AccountEndpoint=https://mycompany-prod.documents.azure.com:443/;AccountKey=your-production-key;",
        "COSMOS_DATABASE_ID": "ProductionDB"
      }
    }
  }
}
```

### 2. 🏠 CosmosDB Emulator (Local Development)

```json
{
  "mcpServers": {
    "mcp-cosmosdb": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPCosmosDB"],
      "env": {
        "OCONNSTRING": "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==;",
        "COSMOS_DATABASE_ID": "TestDB"
      }
    }
  }
}
```

### 3. ⚙️ Advanced Configuration

```json
{
  "mcpServers": {
    "mcp-cosmosdb": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPCosmosDB"],
      "env": {
        "OCONNSTRING": "AccountEndpoint=https://mycompany.documents.azure.com:443/;AccountKey=your-key;",
        "COSMOS_DATABASE_ID": "MyDatabase",
        "COSMOS_MAX_RETRY_ATTEMPTS": "15",
        "COSMOS_MAX_RETRY_WAIT_TIME": "60000",
        "COSMOS_ENABLE_CROSS_PARTITION_QUERY": "true"
      }
    }
  }
}
```

## 🚨 Troubleshooting Common Issues

### Connection Issues

- **"Invalid connection string"**: Verify your OCONNSTRING format and ensure it contains both AccountEndpoint and AccountKey
- **"Database not found"**: Check that COSMOS_DATABASE_ID matches an existing database
- **"Request timeout"**: Increase COSMOS_MAX_RETRY_WAIT_TIME or check network connectivity

### Query Issues

- **"Cross partition query required"**: Set `enable_cross_partition: true` in query parameters
- **"Query timeout"**: Reduce sample sizes or add more specific filters
- **"Partition key required"**: Specify partition_key parameter for single-partition operations

### CosmosDB Emulator Setup

1. Download and install Azure CosmosDB Emulator
2. Start the emulator and ensure it's running on default port 8081
3. Use the default emulator connection string in your configuration
4. Create a database and containers for testing

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Build the project:

```bash
npm run build
```

Start in development mode:

```bash
npm start
```

## 🏗️ Architecture

### Project Structure

```
MCPCosmosDB/
├── src/
│   ├── tools/                  # Tool implementations
│   │   ├── containerAnalysis.ts    # Container operations
│   │   ├── dataOperations.ts       # Data queries and operations
│   │   ├── types.ts                # Type definitions
│   │   └── index.ts                # Tool exports
│   ├── db.ts                   # CosmosDB connection management
│   ├── server.ts               # MCP server setup and handlers
│   ├── tools.ts                # Tool definitions and schemas
│   ├── mcp-server.ts           # Tool re-exports
│   └── utils.ts                # Utility functions
├── dist/                       # Compiled JavaScript output
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

### Key Features

- ⚡ **Connection Management**: Efficient CosmosDB client management with retry logic
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- 📊 **Performance Metrics**: Query performance tracking with request charges
- 🔧 **Flexible Configuration**: Environment-based configuration
- 📋 **Schema Analysis**: Intelligent document schema discovery

## 📝 Important Notes

- **Container IDs**: Use exact container names as they appear in CosmosDB
- **Partition Keys**: Required for single-document operations and optimal performance
- **Cross-Partition Queries**: Can be expensive; use filters when possible
- **Request Charges**: Monitor RU consumption through query statistics
- **Connection Management**: Automatic connection pooling and retry logic
- **Security**: Connection strings contain sensitive keys; store securely

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
- Uses [@azure/cosmos](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cosmosdb/cosmos) for CosmosDB connectivity
- Inspired by [MCPQL](https://github.com/hendrickcastro/MCPQL) for SQL Server

## 🏷️ Tags & Keywords

**Database:** `cosmosdb` `azure-cosmosdb` `nosql` `document-database` `database-analysis` `database-tools` `azure` `database-management` `database-operations` `data-analysis`

**MCP & AI:** `model-context-protocol` `mcp-server` `mcp-tools` `ai-tools` `claude-desktop` `cursor-ide` `anthropic` `llm-integration` `ai-database` `intelligent-database`

**Technology:** `typescript` `nodejs` `npm-package` `cli-tool` `database-client` `nosql-client` `database-sdk` `rest-api` `json-api` `database-connector`

**Features:** `container-analysis` `document-operations` `sql-queries` `schema-analysis` `query-execution` `database-search` `data-exploration` `database-insights` `partition-management` `throughput-analysis`

**Use Cases:** `database-development` `data-science` `business-intelligence` `database-migration` `schema-documentation` `performance-analysis` `data-governance` `database-monitoring` `troubleshooting` `automation`

---

**🎯 MCP CosmosDB provides comprehensive Azure CosmosDB database analysis and manipulation capabilities through the Model Context Protocol. Perfect for developers, data analysts, and anyone working with CosmosDB databases!** 🚀
