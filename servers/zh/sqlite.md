---
name: SQLite MCP 服务器
digest: 为 MCP 服务器提供数据库交互和商业智能功能
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - sqlite
  - database
icon: https://cdn.simpleicons.org/sqlite
createTime: 2024-12-06T00:00:00Z
---

一个提供 SQLite 数据库交互和商业智能功能的模型上下文协议(MCP)服务器实现。该服务器支持运行 SQL 查询、分析业务数据以及自动生成商业洞察备忘录。

## 组件

### 资源

该服务器提供一个动态资源:

- `memo://insights`: 持续更新的商业洞察备忘录,汇总分析过程中发现的洞察
  - 通过 append-insight 工具添加新洞察时自动更新

### 提示词

该服务器提供一个演示提示词:

- `mcp-demo`: 交互式提示词,引导用户进行数据库操作
  - 必需参数: `topic` - 要分析的业务领域
  - 生成适当的数据库模式和示例数据
  - 引导用户进行分析和洞察生成
  - 与商业洞察备忘录集成

### 工具

该服务器提供六个核心工具:

#### 查询工具

- `read-query`

  - 执行 SELECT 查询以读取数据库数据
  - 输入:
    - `query` (字符串): 要执行的 SELECT SQL 查询
  - 返回: 查询结果对象数组

- `write-query`

  - 执行 INSERT、UPDATE 或 DELETE 查询
  - 输入:
    - `query` (字符串): SQL 修改查询
  - 返回: `{ affected_rows: number }`

- `create-table`
  - 在数据库中创建新表
  - 输入:
    - `query` (字符串): CREATE TABLE SQL 语句
  - 返回: 表创建确认

#### 模式工具

- `list-tables`

  - 获取数据库中所有表的列表
  - 无需输入
  - 返回: 表名数组

- `describe-table`
  - 查看特定表的模式信息
  - 输入:
    - `table_name` (字符串): 要描述的表名
  - 返回: 包含列名和类型的列定义数组

#### Analysis Tools

- `append-insight`
  - 向备忘录资源添加新的商业洞察
  - 输入:
    - `insight` (字符串): 从数据分析中发现的商业洞察
  - 返回: 洞察添加确认
  - 触发 memo://insights 资源更新

## 在 Claude Desktop 中使用

```bash
# 将服务器添加到 claude_desktop_config.json
"mcpServers": {
  "sqlite": {
    "command": "uv",
    "args": [
      "--directory",
      "parent_of_servers_repo/servers/src/sqlite",
      "run",
      "mcp-server-sqlite",
      "--db-path",
      "~/test.db"
    ]
  }
}
```

## 许可证

该 MCP 服务器遵循 MIT 许可证。这意味着你可以自由地使用、修改和分发软件，前提是遵守 MIT 许可证的条款和条件。更多详细信息，请参阅项目仓库中的 LICENSE 文件。
