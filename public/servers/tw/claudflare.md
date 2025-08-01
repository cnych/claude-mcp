---
name: Cloudflare
digest: 在 Cloudflare 開發者平台上部署、配置和查詢您的資源（如 Workers/KV/R2/D1）
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

模型上下文協定（MCP）是一個[新的標準化協定](https://www.claudemcp.com)，用於管理大型語言模型（LLM）和外部系統之間的上下文。在這個倉庫中，我們提供了一個安裝程式以及一個用於[Cloudflare API](https://api.cloudflare.com)的 MCP 伺服器。

這讓您可以使用 Claude Desktop 或任何 MCP 客戶端，透過自然語言在您的 Cloudflare 帳戶上完成各種任務，例如：

- `請為我部署一個帶有範例持久物件的新 Worker。`
- `您能告訴我關於我的名為'...'的 D1 資料庫中的資料資訊嗎？`
- `您能將我的 KV 命名空間'...'中的所有條目複製到我的 R2 儲存桶'...'中嗎？`

## 演示

[![演示新發布的 MCP 伺服器以探索 Cloudflare 屬性，如 Workers、KV 和 D1。](https://static.claudemcp.com/images/mcp-cloudflare-cover.jpg)](https://www.youtube.com/watch?v=vGajZpl_9yA)

## 設定

1. 執行 `npx @cloudflare/mcp-server-cloudflare init`

![範例控制台輸出](https://static.claudemcp.com/images/mcp-cloudflare-init.jpg)

2. 重新啟動 Claude Desktop，您應該會看到一個小 🔨 圖示，顯示以下可用工具：

![範例工具圖示](https://static.claudemcp.com/images/mcp-cloudflare-tool-icon.jpg)

![範例工具清單](https://static.claudemcp.com/images/mcp-cloudflare-tool-list.jpg)

## 功能

### KV 儲存管理

- `get_kvs`: 列出您帳戶中的所有 KV 命名空間
- `kv_get`: 從 KV 命名空間取得值
- `kv_put`: 在 KV 命名空間中儲存值
- `kv_list`: 列出 KV 命名空間中的鍵
- `kv_delete`: 從 KV 命名空間刪除鍵

### R2 儲存管理

- `r2_list_buckets`: 列出您帳戶中的所有 R2 儲存桶
- `r2_create_bucket`: 建立新的 R2 儲存桶
- `r2_delete_bucket`: 刪除 R2 儲存桶
- `r2_list_objects`: 列出 R2 儲存桶中的物件
- `r2_get_object`: 從 R2 儲存桶取得物件
- `r2_put_object`: 將物件放入 R2 儲存桶
- `r2_delete_object`: 從 R2 儲存桶刪除物件

### D1 資料庫管理

- `d1_list_databases`: 列出您帳戶中的所有 D1 資料庫
- `d1_create_database`: 建立新的 D1 資料庫
- `d1_delete_database`: 刪除 D1 資料庫
- `d1_query`: 對 D1 資料庫執行 SQL 查詢

### Workers 管理

- `worker_list`: 列出您帳戶中的所有 Workers
- `worker_get`: 取得 Worker 的腳本內容
- `worker_put`: 建立或更新 Worker 腳本
- `worker_delete`: 刪除 Worker 腳本

### 分析

- `analytics_get`: 取得您網域的分析資料
  - 包含請求、頻寬、威脅和頁面瀏覽量等指標
  - 支援日期範圍篩選

## 開發

在目前專案資料夾中，執行：

```
pnpm install
pnpm build:watch
```

然後，在第二個終端機中執行：

```
node dist/index.js init
```

這將使 Claude Desktop 與您本地安裝的版本連接，以便您進行測試。

## 在 Claude 外部使用

要本地運行伺服器，請執行 `node dist/index run <account-id>`。

如果您使用的是替代的 MCP 客戶端，或者在本地測試，請發出 `tools/list` 命令以獲取所有可用工具的最新列表。然後，您可以直接使用 `tools/call` 命令調用這些工具。

### Workers

```javascript
// 列出所有 Workers
worker_list();

// 取得 Worker 代碼
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
// 列出 KV 命名空間
get_kvs();

// 取得值
kv_get({
  namespaceId: "your_namespace_id",
  key: "myKey",
});

// 儲存值
kv_put({
  namespaceId: "your_namespace_id",
  key: "myKey",
  value: "myValue",
  expirationTtl: 3600, // 選填，單位為秒
});

// 列出鍵值
kv_list({
  namespaceId: "your_namespace_id",
  prefix: "app_", // 選填
  limit: 10, // 選填
});

// 刪除鍵值
kv_delete({
  namespaceId: "your_namespace_id",
  key: "myKey",
});
```

### R2 儲存

```javascript
// 列出儲存桶
r2_list_buckets();

// 建立儲存桶
r2_create_bucket({ name: "my-bucket" });

// 刪除儲存桶
r2_delete_bucket({ name: "my-bucket" });

// 列出儲存桶中的物件
r2_list_objects({
  bucket: "my-bucket",
  prefix: "folder/", // optional
  delimiter: "/", // optional
  limit: 1000, // optional
});

// 獲取物件
r2_get_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
});

// 儲存物件
r2_put_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
  content: "Hello, World!",
  contentType: "text/plain", // optional
});

// 刪除物件
r2_delete_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
});
```

### D1 Database

```javascript
// 列出資料庫
d1_list_databases();

// 建立資料庫
d1_create_database({ name: "my-database" });

// 刪除資料庫
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
// 取得今日的分析資料
analytics_get({
  zoneId: "your_zone_id",
  since: "2024-11-26T00:00:00Z",
  until: "2024-11-26T23:59:59Z",
});
```

## 貢獻

歡迎貢獻！請隨時提交 Pull Request。
