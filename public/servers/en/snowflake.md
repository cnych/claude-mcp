---
name: Snowflake MCP Server
digest: Connect to Snowflake data warehouse for advanced data analytics and SQL operations
author: Patrick Freyer (BCG)
homepage: https://github.com/patrickfreyer/mcp-server-snowflake
repository: https://github.com/patrickfreyer/mcp-server-snowflake
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - snowflake
  - database
  - data-warehouse
  - analytics
  - sql
icon: https://cdn.simpleicons.org/snowflake
createTime: 2025-09-16T00:00:00Z
---

A Model Context Protocol (MCP) server implementation for Snowflake data warehouse integration. This server enables seamless interaction with Snowflake databases, allowing you to execute SQL queries, explore database schemas, and perform advanced data analytics operations directly through MCP-compatible clients like Claude Desktop.

## Features

### Core Capabilities

- **Secure Connection**: Connect to Snowflake using standard authentication with account, warehouse, database, and schema configuration
- **Query Execution**: Run SELECT queries to retrieve and analyze data from Snowflake tables
- **Schema Exploration**: Browse databases, schemas, and tables to understand data structure
- **Table Inspection**: Get detailed information about table columns, data types, and constraints
- **Performance Optimized**: Leverages Snowflake's warehouse compute resources for efficient query processing

### Tools

The server provides five essential tools for Snowflake interaction:

#### Data Query Tool

- `read_query`
  - Execute SELECT queries on Snowflake
  - Input:
    - `query` (string): The SELECT query to execute
  - Returns: Query results as structured data
  - Note: Column names must be enclosed in double quotes for proper referencing

#### Schema Exploration Tools

- `list_databases`

  - List all available databases in the Snowflake account
  - Returns: Array of database names

- `list_schemas`

  - List all schemas in a specified database
  - Input:
    - `database` (string, optional): Database name (uses current if not specified)
  - Returns: Array of schema names

- `list_tables`

  - List all tables in a specified schema
  - Input:
    - `database` (string, optional): Database name
    - `schema` (string, optional): Schema name
  - Returns: Array of table names with metadata

- `describe_table`
  - Get detailed schema information for a specific table
  - Input:
    - `table_name` (string): Table name (can include database.schema.table)
  - Returns: Column definitions with data types and constraints

## Installation

### Prerequisites

- Node.js 16.0.0 or higher
- Valid Snowflake account with appropriate permissions
- MCP-compatible client (e.g., Claude Desktop)

### Quick Start with MCPB Package

The easiest way to install is using the pre-built MCPB package:

1. Download the `snowflake-mcp.mcpb` file
2. Double-click to install in Claude Desktop
3. Configure your Snowflake credentials when prompted

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/patrickfreyer/mcp-server-snowflake.git
cd mcp-server-snowflake

# Install dependencies
npm install

# Build the server
npm run build

# Configure environment variables
cp .env.example .env
# Edit .env with your Snowflake credentials
```

## Configuration

### Environment Variables

Create a `.env` file with your Snowflake credentials:

```env
SNOWFLAKE_ACCOUNT=your_account.region.cloud_provider
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_ROLE=your_role
SNOWFLAKE_DATABASE=default_database
SNOWFLAKE_SCHEMA=default_schema
```

### Claude Desktop Configuration

Add the server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "snowflake": {
      "command": "node",
      "args": ["/path/to/mcp-server-snowflake/dist/index.js"],
      "env": {
        "SNOWFLAKE_ACCOUNT": "your_account.region.cloud_provider",
        "SNOWFLAKE_WAREHOUSE": "your_warehouse",
        "SNOWFLAKE_USER": "your_username",
        "SNOWFLAKE_PASSWORD": "your_password",
        "SNOWFLAKE_ROLE": "your_role",
        "SNOWFLAKE_DATABASE": "default_database",
        "SNOWFLAKE_SCHEMA": "default_schema"
      }
    }
  }
}
```

## Usage Examples

### Basic Query Execution

```sql
-- List all customers from a specific region
SELECT "customer_id", "customer_name", "region"
FROM "customers"
WHERE "region" = 'North America'
LIMIT 100;
```

### Schema Exploration

```javascript
// List all databases
await list_databases();

// List schemas in a database
await list_schemas({ database: "SALES_DB" });

// List tables in a schema
await list_tables({
  database: "SALES_DB",
  schema: "TRANSACTIONS",
});

// Get table structure
await describe_table({
  table_name: "SALES_DB.TRANSACTIONS.ORDERS",
});
```

### Advanced Analytics Query

```sql
-- Calculate monthly revenue trends
SELECT
  DATE_TRUNC('month', "order_date") as "month",
  SUM("total_amount") as "revenue",
  COUNT(DISTINCT "customer_id") as "unique_customers"
FROM "sales"."orders"
WHERE "order_date" >= DATEADD('month', -12, CURRENT_DATE())
GROUP BY 1
ORDER BY 1 DESC;
```

## Security Best Practices

1. **Never commit credentials**: Always use environment variables for sensitive information
2. **Use role-based access**: Configure Snowflake roles with minimal required permissions
3. **Rotate credentials regularly**: Update passwords and API keys periodically
4. **Monitor query activity**: Review Snowflake query history for unauthorized access
5. **Use secure connections**: Ensure all connections to Snowflake use encrypted protocols

## Performance Tips

- Use appropriate warehouse sizes for your workload
- Leverage Snowflake's result caching for frequently run queries
- Include LIMIT clauses when exploring large tables
- Use column pruning to select only needed fields
- Consider clustering keys for frequently filtered columns

## Troubleshooting

### Common Issues

1. **Authentication Failed**: Verify account format includes region and cloud provider
2. **Query Timeout**: Check warehouse size and query complexity
3. **Permission Denied**: Ensure role has necessary privileges on target objects
4. **Column Not Found**: Remember to use double quotes around column names

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=mcp:snowflake
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/patrickfreyer/mcp-server-snowflake/issues).
