---
name: MCPFirestoreDB
digest: A comprehensive **Model Context Protocol (MCP)** server for **Google Cloud Firestore** database operations. This server provides 12 powerful tools for document database management, collection operations, and data querying through the MCP protocol.
author: hendrickcastro
repository: https://github.com/hendrickcastro/MCPFirestoreDB
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - firestore
  - nosql
  - cloud
  - google
  - database
icon: https://avatars.githubusercontent.com/u/8320893?s=48&v=4
createTime: 2025-09-22
---

A comprehensive Model Context Protocol (MCP) server for Google Cloud Firestore database operations. This server provides 12 powerful tools for document database management, collection operations, and data querying through the MCP protocol.

## 🎯 Tool Overview

### Available Tools (17 Total)
This MCP server provides **17 optimized tools** with short, intuitive names for efficient Firestore operations:

**📝 Document Operations (5 tools):**
- `create_doc` - Create new documents
- `get_doc` - Retrieve specific documents
- `get_docs` - Query multiple documents with filtering
- `update_doc` - Update existing documents
- `delete_doc` - Remove documents

**🔄 Batch Operations (3 tools):**
- `batch_create` - Create multiple documents at once
- `batch_update` - Update multiple documents simultaneously
- `batch_delete` - Delete multiple documents in batch

**📊 Collection Management (4 tools):**
- `list_collections` - List all available collections
- `collection_stats` - Get detailed collection statistics
- `analyze_schema` - Analyze document schemas and structure
- `delete_collection` - Remove entire collections (with caution)

**🔍 Index Management (5 tools):**
- `create_index` - Generate composite index configurations
- `list_indexes` - Get guidance on listing existing indexes
- `get_index_status` - Check index building status and information
- `parse_index_error` - Parse Firestore error messages for index creation
- `generate_indexes_config` - Generate firestore.indexes.json for deployment

### 🚀 Key Capabilities
- **Real-time Operations**: Direct Firestore database access
- **Advanced Querying**: Filtering, sorting, and pagination support
- **Batch Processing**: High-performance bulk operations
- **Schema Analysis**: Intelligent document structure analysis
- **Production Ready**: Comprehensive error handling and validation

## ⚙️ Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON file | `/path/to/service-account.json` |
| `FIREBASE_PROJECT_ID` | Firebase/GCP Project ID | `my-project-id` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FIRESTORE_DATABASE_ID` | Firestore database ID | `(default)` |
| `FIRESTORE_EMULATOR_HOST` | Firestore emulator host for local development | `localhost:8080` |
| `DEBUG_FIRESTORE` | Enable debug logging | `false` |

### Installation Options

#### Option 1: NPX (Recommended)
No installation needed! Configure your MCP client:

```json
{
  "mcpServers": {
    "mcp-firestoredb": {
      "command": "npx",
      "args": [
        "-y",
        "hendrickcastro/MCPFirestoreDB"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "D:/_Keys/my-firebase-project.json",
        "FIREBASE_PROJECT_ID": "my-firebase-project",
        "FIRESTORE_DATABASE_ID": "(default)"
      }
    }
  }
}
```

#### Option 2: Local Development
```bash
git clone <your-repo-url>
cd MCPFirestoreDB
npm install && npm run build
```

Then configure with local path:
```json
{
  "mcpServers": {
    "mcp-firestoredb": {
      "command": "node",
      "args": ["path/to/MCPFirestoreDB/dist/server.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account.json",
        "FIREBASE_PROJECT_ID": "your-project-id"
      }
    }
  }
}
```

## 🛠️ Available Tools

MCP FirestoreDB provides 12 comprehensive tools for Google Cloud Firestore operations:

### CRUD Operations

### 1. 📝 **Create Document** - `create_doc`
Create a new document in a Firestore collection.

**Parameters:**
- `collection_path`: Collection path (e.g., "users" or "users/123/orders")
- `document_id`: Optional document ID (auto-generated if not provided)
- `data`: Document data object

### 2. 📖 **Get Document** - `get_doc`
Retrieve a specific document by ID from a collection.

**Parameters:**
- `collection_path`: Collection path
- `document_id`: Document ID to retrieve

### 3. 📚 **Get Documents** - `get_docs`
Get multiple documents with optional filtering and pagination.

**Parameters:**
- `collection_path`: Collection path
- `limit`: Maximum number of documents (default: 100)
- `order_by`: Field to order by
- `order_direction`: Order direction ("asc" or "desc")
- `where_conditions`: Array of where conditions [field, operator, value]
- `start_after`: Document ID for pagination

### 4. ✏️ **Update Document** - `update_doc`
Update an existing document in a collection.

**Parameters:**
- `collection_path`: Collection path
- `document_id`: Document ID to update
- `data`: Data to update (partial update supported)
- `merge`: Whether to merge with existing data (default: true)

### 5. 🗑️ **Delete Document** - `delete_doc`
Delete a document from a collection.

**Parameters:**
- `collection_path`: Collection path
- `document_id`: Document ID to delete

### Batch Operations

### 6. 📝📝 **Batch Create Documents** - `batch_create`
Create multiple documents in a single batch operation.

### 7. ✏️✏️ **Batch Update Documents** - `batch_update`
Update multiple documents in a single batch operation.

### 8. 🗑️🗑️ **Batch Delete Documents** - `batch_delete`
Delete multiple documents in a single batch operation.

### Collection Operations

### 9. 📋 **List Collections** - `list_collections`
List all collections in the Firestore database.

**Parameters:**
- `parent_path`: Optional parent document path for subcollections

### 10. 📊 **Get Collection Stats** - `collection_stats`
Get statistics about a Firestore collection.

**Parameters:**
- `collection_path`: Collection path
- `sample_size`: Number of documents to sample (default: 100)

### 11. 🏗️ **Analyze Collection Schema** - `analyze_schema`
Analyze the schema of documents in a collection.

**Parameters:**
- `collection_path`: Collection path
- `sample_size`: Number of documents to sample (default: 100)

### 12. 🗑️📁 **Delete Collection** - `delete_collection`
Delete an entire collection and all its documents (use with caution).

**Parameters:**
- `collection_path`: Collection path to delete
- `batch_size`: Documents to delete per batch (default: 100)

## 📋 Usage Examples

### Document Operations
```typescript
// Create a document
const newDoc = await create_doc({
  collection_path: "users",
  document_id: "user-123",
  data: {
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date()
  }
});

// Get a specific document
const document = await get_doc({
  collection_path: "users",
  document_id: "user-123"
});

// Update a document
const updated = await update_doc({
  collection_path: "users",
  document_id: "user-123",
  data: { lastLogin: new Date() },
  merge: true
});
```

### Querying Data
```typescript
// Get documents with filtering
const activeUsers = await get_docs({
  collection_path: "users",
  where_conditions: [
    ["status", "==", "active"],
    ["createdAt", ">", "2024-01-01"]
  ],
  order_by: "createdAt",
  order_direction: "desc",
  limit: 50
});

// Get documents with pagination
const nextPage = await get_docs({
  collection_path: "users",
  limit: 10,
  start_after: "last-document-id"
});
```

### Batch Operations
```typescript
// Batch create multiple documents
const batchCreate = await batch_create({
  operations: [
    {
      collection_path: "products",
      document_id: "prod-1",
      data: { name: "Product 1", price: 100 }
    },
    {
      collection_path: "products",
      document_id: "prod-2",
      data: { name: "Product 2", price: 200 }
    }
  ]
});
```

### Collection Analysis
```typescript
// List all collections
const collections = await list_collections();

// Get collection statistics
const stats = await collection_stats({
  collection_path: "users",
  sample_size: 1000
});

// Analyze collection schema
const schema = await analyze_schema({
  collection_path: "products",
  sample_size: 500
});
```

## 🔧 Configuration Examples

**Production Environment:**
```json
{
  "mcpServers": {
    "mcp-firestoredb": {
      "command": "node",
      "args": ["path/to/MCPFirestoreDB/dist/server.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/production-service-account.json",
        "FIREBASE_PROJECT_ID": "my-production-project"
      }
    }
  }
}
```

**Development with Emulator:**
```json
{
  "mcpServers": {
    "mcp-firestoredb": {
      "command": "node",
      "args": ["path/to/MCPFirestoreDB/dist/server.js"],
      "env": {
        "FIREBASE_PROJECT_ID": "demo-project",
        "FIRESTORE_EMULATOR_HOST": "localhost:8080",
        "DEBUG_FIRESTORE": "true"
      }
    }
  }
}
```

**Multiple Databases:**
```json
{
  "mcpServers": {
    "mcp-firestoredb-main": {
      "command": "node",
      "args": ["path/to/MCPFirestoreDB/dist/server.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account.json",
        "FIREBASE_PROJECT_ID": "my-project",
        "FIRESTORE_DATABASE_ID": "(default)"
      }
    },
    "mcp-firestoredb-analytics": {
      "command": "node",
      "args": ["path/to/MCPFirestoreDB/dist/server.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account.json",
        "FIREBASE_PROJECT_ID": "my-project",
        "FIRESTORE_DATABASE_ID": "analytics-db"
      }
    }
  }
}
```

## 🚨 Troubleshooting

**Authentication Issues:**
- **Service account not found**: Verify GOOGLE_APPLICATION_CREDENTIALS path
- **Permission denied**: Ensure service account has Firestore permissions
- **Project not found**: Check FIREBASE_PROJECT_ID matches your GCP project

**Connection Issues:**
- **Emulator connection failed**: Ensure Firestore emulator is running on specified port
- **Network timeout**: Check firewall settings and network connectivity
- **Database not found**: Verify FIRESTORE_DATABASE_ID exists

**Query Issues:**
- **Invalid where condition**: Check field names and operator syntax
- **Query timeout**: Reduce sample sizes or add more specific filters
- **Index required**: Create composite indexes for complex queries

**Firestore Emulator Setup:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Start emulator: `firebase emulators:start --only firestore`
3. Set FIRESTORE_EMULATOR_HOST environment variable
4. Use demo project ID for testing

## 🔍 Index Management Operations

Firestore index management tools help you handle composite indexes efficiently:

### Creating Index Configurations
```javascript
// Generate index configuration for complex queries
{
  "collection_path": "users",
  "fields": [
    {"field": "status", "order": "ASCENDING"},
    {"field": "created_at", "order": "DESCENDING"}
  ]
}
```

### Index Error Parsing
```javascript
// Parse Firestore error messages to extract index creation links
{
  "error_message": "The query requires an index. You can create it here: https://console.firebase.google.com/..."
}
```

### Index Status Monitoring
```javascript
// Check index building progress
{
  "collection_path": "products",
  "index_fields": ["category", "price"]
}
```

**Important Notes:**
- Index creation requires Firebase Console or CLI due to security restrictions
- Tools provide configuration generation and guidance for manual creation
- Monitor index building status to ensure query performance
- Use `firestore.indexes.json` for deployment automation

## 🧪 Development

```bash
npm install       # Install dependencies
npm run build     # Build project
npm test          # Run tests
npm start         # Development mode
```

## 🏗️ Architecture

**Project Structure:**
```
src/
├── tools/                      # Tool implementations
│   ├── crudOperations.ts       # CRUD operations
│   ├── collectionOperations.ts # Collection management
│   ├── indexOperations.ts      # Index management operations
│   ├── types.ts                # Type definitions
│   └── index.ts                # Tool exports
├── db.ts                       # Firestore connection
├── server.ts                   # MCP server setup
└── tools.ts                    # Tool definitions
```

**Key Features:**
- ⚡ Efficient connection management with optimized performance
- 🛡️ Comprehensive error handling and validation
- 📊 Advanced collection statistics and schema analysis
- 🔧 Flexible environment-based configuration
- 🚀 High-performance batch operations
- 📋 Intelligent schema analysis with detailed insights
- 🔍 Advanced querying capabilities with filtering and pagination
- 🎯 Shortened tool names for improved usability
- 🔄 Real-time database operations
- 📈 Production-ready with extensive testing

## 📝 Important Notes

- **Collection Paths**: Use forward slashes for nested collections (e.g., "users/123/orders")
- **Document IDs**: Auto-generated if not provided in create operations
- **Batch Operations**: Limited to 500 operations per batch
- **Security Rules**: Ensure proper Firestore security rules are configured
- **Indexes**: Create composite indexes for complex queries
- **Costs**: Monitor Firestore usage to manage costs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Make changes and add tests
4. Ensure tests pass (`npm test`)
5. Commit changes (`git commit -m 'Add feature'`)
6. Push and open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏷️ Tags & Keywords

**Database:** `firestore` `google-cloud-firestore` `nosql` `document-database` `database-analysis` `database-tools` `google-cloud` `database-management` `database-operations` `data-analysis`

**MCP & AI:** `model-context-protocol` `mcp-server` `mcp-tools` `ai-tools` `claude-desktop` `cursor-ide` `anthropic` `llm-integration` `ai-database` `intelligent-database`

**Technology:** `typescript` `nodejs` `npm-package` `cli-tool` `database-client` `nosql-client` `database-sdk` `rest-api` `json-api` `database-connector`

**Features:** `collection-analysis` `document-operations` `batch-operations` `schema-analysis` `query-execution` `database-search` `data-exploration` `database-insights` `crud-operations` `real-time-database`

**Use Cases:** `database-development` `data-science` `business-intelligence` `database-migration` `schema-documentation` `performance-analysis` `data-governance` `database-monitoring` `troubleshooting` `automation`

## 🙏 Acknowledgments

- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- [@google-cloud/firestore](https://github.com/googleapis/nodejs-firestore)
- Inspired by [MCPCosmosDB](https://github.com/hendrickcastro/MCPCosmosDB)

**🎯 MCP FirestoreDB provides comprehensive Google Cloud Firestore database management through the Model Context Protocol. Perfect for developers and data analysts working with Firestore!** 🚀