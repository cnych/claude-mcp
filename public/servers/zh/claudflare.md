---
name: Cloudflare
digest: 在 Cloudflare 开发者平台上部署、配置和查询您的资源(如 Workers/KV/R2/D1)
author: Cloudflare
homepage: https://github.com/cloudflare/mcp-server-cloudflare
repository: https://github.com/cloudflare/mcp-server-cloudflare
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - cloudflare
  - workers
  - kv
  - r2
  - d1
icon: https://cdn.simpleicons.org/cloudflare
createTime: 2024-12-01T00:00:00Z
---

模型上下文协议(MCP)是一个[新的标准化协议](https://www.claudemcp.com)，用于管理大型语言模型(LLM)和外部系统之间的上下文。在这个仓库中，我们提供了一个安装程序以及一个用于[Cloudflare API](https://api.cloudflare.com)的 MCP 服务器。

这让您可以使用 Claude Desktop 或任何 MCP 客户端，通过自然语言在您的 Cloudflare 账户上完成各种任务，例如：

- `请为我部署一个带有示例持久对象的新 Worker。`
- `您能告诉我关于我的名为'...'的 D1 数据库中的数据信息吗？`
- `您能将我的 KV 命名空间'...'中的所有条目复制到我的 R2 存储桶'...'中吗？`

## 演示

[![演示新发布的 MCP 服务器以探索 Cloudflare 属性，如 Workers、KV 和 D1。](https://static.claudemcp.com/images/mcp-cloudflare-cover.jpg)](https://www.youtube.com/watch?v=vGajZpl_9yA)

## 设置

1. 运行 `npx @cloudflare/mcp-server-cloudflare init`

![示例控制台输出](https://static.claudemcp.com/images/mcp-cloudflare-init.jpg)

2. 重启 Claude Desktop，您应该会看到一个小 🔨 图标，显示以下可用工具：

![示例工具图标](https://static.claudemcp.com/images/mcp-cloudflare-tool-icon.jpg)

![示例工具列表](https://static.claudemcp.com/images/mcp-cloudflare-tool-list.jpg)

## 功能

### KV 存储管理

- `get_kvs`: 列出您账户中的所有 KV 命名空间
- `kv_get`: 从 KV 命名空间获取值
- `kv_put`: 在 KV 命名空间中存储值
- `kv_list`: 列出 KV 命名空间中的键
- `kv_delete`: 从 KV 命名空间删除键

### R2 存储管理

- `r2_list_buckets`: 列出您账户中的所有 R2 存储桶
- `r2_create_bucket`: 创建新的 R2 存储桶
- `r2_delete_bucket`: 删除 R2 存储桶
- `r2_list_objects`: 列出 R2 存储桶中的对象
- `r2_get_object`: 从 R2 存储桶获取对象
- `r2_put_object`: 将对象放入 R2 存储桶
- `r2_delete_object`: 从 R2 存储桶删除对象

### D1 数据库管理

- `d1_list_databases`: 列出您账户中的所有 D1 数据库
- `d1_create_database`: 创建新的 D1 数据库
- `d1_delete_database`: 删除 D1 数据库
- `d1_query`: 对 D1 数据库执行 SQL 查询

### Workers 管理

- `worker_list`: 列出您账户中的所有 Workers
- `worker_get`: 获取 Worker 的脚本内容
- `worker_put`: 创建或更新 Worker 脚本
- `worker_delete`: 删除 Worker 脚本

### 分析

- `analytics_get`: 检索您域名的分析数据
  - 包括请求、带宽、威胁和页面浏览量等指标
  - 支持日期范围过滤

## 开发

在当前项目文件夹中，运行：

```
pnpm install
pnpm build:watch
```

然后，在第二个终端中运行：

```
node dist/index.js init
```

这将使 Claude Desktop 与您本地安装的版本连接，以便您进行测试。

## 在 Claude 外部使用

要本地运行服务器，请运行 `node dist/index run <account-id>`。

如果您使用的是替代的 MCP 客户端，或者在本地测试，请发出 `tools/list` 命令以获取所有可用工具的最新列表。然后，您可以直接使用 `tools/call` 命令调用这些工具。

### Workers

```javascript
// 列出 Workers
worker_list();

// 获取 Worker 代码
worker_get({ name: "my-worker" });

// 更新 Worker
worker_put({
  name: "my-worker",
  script: "export default { async fetch(request, env, ctx) { ... }}",
  bindings: [
    {
      type: "kv_namespace",
      name: "MY_KV",
      namespace_id: "abcd1234",
    },
    {
      type: "r2_bucket",
      name: "MY_BUCKET",
      bucket_name: "my-files",
    },
  ],
  compatibility_date: "2024-01-01",
  compatibility_flags: ["nodejs_compat"],
});

// 删除 Worker
worker_delete({ name: "my-worker" });
```

### KV Store

```javascript
// 列出 KV 命名空间
get_kvs();

// 获取值
kv_get({
  namespaceId: "your_namespace_id",
  key: "myKey",
});

// 存储值
kv_put({
  namespaceId: "your_namespace_id",
  key: "myKey",
  value: "myValue",
  expirationTtl: 3600, // optional, in seconds
});

// 列出键
kv_list({
  namespaceId: "your_namespace_id",
  prefix: "app_", // optional
  limit: 10, // optional
});

// 删除键
kv_delete({
  namespaceId: "your_namespace_id",
  key: "myKey",
});
```

### R2 存储

```javascript
// 列出存储桶
r2_list_buckets();

// 创建存储桶
r2_create_bucket({ name: "my-bucket" });

// 删除存储桶
r2_delete_bucket({ name: "my-bucket" });

// 列出存储桶中的对象
r2_list_objects({
  bucket: "my-bucket",
  prefix: "folder/", // optional
  delimiter: "/", // optional
  limit: 1000, // optional
});

// 获取对象
r2_get_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
});

// 存储对象
r2_put_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
  content: "Hello, World!",
  contentType: "text/plain", // optional
});

// 删除对象
r2_delete_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
});
```

### D1 Database

```javascript
// 列出数据库
d1_list_databases();

// 创建数据库
d1_create_database({ name: "my-database" });

// 删除数据库
d1_delete_database({ databaseId: "your_database_id" });

// 执行单个查询
d1_query({
  databaseId: "your_database_id",
  query: "SELECT * FROM users WHERE age > ?",
  params: ["25"], // optional
});

// 创建表
d1_query({
  databaseId: "your_database_id",
  query: `
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,
});
```

### 分析

```javascript
// 获取今天的分析数据
analytics_get({
  zoneId: "your_zone_id",
  since: "2024-11-26T00:00:00Z",
  until: "2024-11-26T23:59:59Z",
});
```

## 贡献

欢迎贡献！请随时提交 Pull Request。
