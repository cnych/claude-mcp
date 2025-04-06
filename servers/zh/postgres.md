---
name: PostgreSQL
digest: 只读数据库访问和架构检查
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - postgresql
  - 数据库
icon: https://cdn.simpleicons.org/postgresql
createTime: 2024-12-01T00:00:00Z
---

一个提供 PostgreSQL 数据库只读访问的模型上下文协议服务器。该服务器使 LLMs 能够检查数据库架构并执行只读查询。

## 组件

### 工具

- **query**
  - 对连接的数据库执行只读 SQL 查询
  - 输入: `sql` (字符串): 要执行的 SQL 查询
  - 所有查询都在只读事务中执行

### 资源

服务器为数据库中的每个表提供架构信息：

- **Table Schemas** (`postgres://<host>/<table>/schema`)
  - 每个表的 JSON 架构信息
  - 包括列名和数据类型
  - 从数据库元数据自动发现

## 在 Claude Desktop 中使用

要在 Claude Desktop 应用程序中使用此服务器，请将以下配置添加到 `claude_desktop_config.json` 的 "mcpServers" 部分：

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}
```

将 `/mydb` 替换为您的数据库名称。

## 许可证

该 MCP 服务器根据 MIT 许可证授权。这意味着您可以自由使用、修改和分发软件，但需遵守 MIT 许可证的条款和条件。更多详情，请参阅项目仓库中的 LICENSE 文件。
