---
name: Deepwiki MCP Server
digest: 📖 获取 deepwiki.com 内容并转换为 LLM 可读的 markdown
author: regenrek
repository: https://github.com/regenrek/deepwiki-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - deepwiki
  - markdown
  - api
icon: https://avatars.githubusercontent.com/u/5182020?v=4
createTime: 2025-04-28
---

这是一个**非官方的 Deepwiki MCP 服务器**

它通过 [MCP](/zh) 接收 Deepwiki URL，爬取所有相关页面，将其转换为 Markdown 格式，并返回单个文档或按页面分列的列表。

## 功能

- **域名安全**：仅处理来自 deepwiki.com 的 URL
- **HTML 净化**：去除页眉、页脚、导航栏、脚本和广告
- **链接重写**：调整链接以在 Markdown 中正常工作
- **多种输出格式**：获取单个文档或结构化页面
- **性能**：可调节并发数和深度的快速爬取

## 使用方法

```
{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki"]
    }
  }
}
```

### MCP 工具集成

该包注册了一个名为`deepwiki_fetch`的工具，可与任何兼容 MCP 的客户端一起使用：

```json
{
  "action": "deepwiki_fetch",
  "params": {
    "url": "https://deepwiki.com/user/repo",
    "mode": "aggregate",
    "maxDepth": "1"
  }
}
```

#### 参数

- `url`（必需）：Deepwiki 仓库的起始 URL
- `mode`（可选）：输出模式，"aggregate"为单个 Markdown 文档（默认），"pages"为结构化页面数据
- `maxDepth`（可选）：爬取页面的最大深度（默认：10）

### 响应格式

#### 成功响应（聚合模式）

```json
{
  "status": "ok",
  "data": "# 页面标题\n\n页面内容...\n\n---\n\n# 另一个页面\n\n更多内容...",
  "totalPages": 5,
  "totalBytes": 25000,
  "elapsedMs": 1200
}
```

#### 成功响应（页面模式）

```json
{
  "status": "ok",
  "data": [
    {
      "path": "index",
      "markdown": "# 首页\n\n欢迎来到仓库。"
    },
    {
      "path": "section/page1",
      "markdown": "# 第一页\n\n这是第一页的内容。"
    }
  ],
  "totalPages": 2,
  "totalBytes": 12000,
  "elapsedMs": 800
}
```

#### 错误响应

```json
{
  "status": "error",
  "code": "DOMAIN_NOT_ALLOWED",
  "message": "仅允许deepwiki.com域名"
}
```

#### 部分成功响应

```json
{
  "status": "partial",
  "data": "# 页面标题\n\n页面内容...",
  "errors": [
    {
      "url": "https://deepwiki.com/user/repo/page2",
      "reason": "HTTP错误：404"
    }
  ],
  "totalPages": 1,
  "totalBytes": 5000,
  "elapsedMs": 950
}
```

### 进度事件

使用工具时，爬取过程中会收到进度事件：

```
已获取 https://deepwiki.com/user/repo: 12500字节，耗时450ms（状态：200）
已获取 https://deepwiki.com/user/repo/page1: 8750字节，耗时320ms（状态：200）
已获取 https://deepwiki.com/user/repo/page2: 6200字节，耗时280ms（状态：200）
```

## 本地开发 - 安装

### 本地使用

```
{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "node",
      "args": ["./bin/cli.mjs"]
    }
  }
}
```

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/regenrek/mcp-deepwiki.git
cd mcp-deepwiki

# 安装依赖
npm install

# 构建包
npm run build
```

#### 直接 API 调用

对于 HTTP 传输，可以直接进行 API 调用：

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "req-1",
    "action": "deepwiki_fetch",
    "params": {
      "url": "https://deepwiki.com/user/repo",
      "mode": "aggregate"
    }
  }'
```

## 配置

### 环境变量

- `DEEPWIKI_MAX_CONCURRENCY`：最大并发请求数（默认：5）
- `DEEPWIKI_REQUEST_TIMEOUT`：请求超时时间（毫秒，默认：30000）
- `DEEPWIKI_MAX_RETRIES`：失败请求的最大重试次数（默认：3）
- `DEEPWIKI_RETRY_DELAY`：重试退避的基础延迟时间（毫秒，默认：250）

要配置这些变量，在项目根目录创建`.env`文件：

```
DEEPWIKI_MAX_CONCURRENCY=10
DEEPWIKI_REQUEST_TIMEOUT=60000
DEEPWIKI_MAX_RETRIES=5
DEEPWIKI_RETRY_DELAY=500
```

## Docker 部署（未测试）

构建并运行 Docker 镜像：

```bash
# 构建镜像
docker build -t mcp-deepwiki .

# 以stdio传输运行（开发用）
docker run -it --rm mcp-deepwiki

# 以HTTP传输运行（生产用）
docker run -d -p 3000:3000 mcp-deepwiki --http --port 3000

# 带环境变量运行
docker run -d -p 3000:3000 \
  -e DEEPWIKI_MAX_CONCURRENCY=10 \
  -e DEEPWIKI_REQUEST_TIMEOUT=60000 \
  mcp-deepwiki --http --port 3000
```

## 开发

```bash
# 安装依赖
pnpm install

# 以stdio模式运行开发环境
pnpm run dev-stdio

# 运行测试
pnpm test

# 运行代码检查
pnpm run lint

# 构建包
pnpm run build
```

## 故障排除

### 常见问题

1. **权限被拒绝**：如果运行 CLI 时遇到 EACCES 错误，确保二进制文件可执行：

   ```bash
   chmod +x ./node_modules/.bin/mcp-deepwiki
   ```

2. **连接被拒绝**：确保端口可用且未被防火墙阻止：

   ```bash
   # 检查端口是否被占用
   lsof -i :3000
   ```

3. **超时错误**：对于大型仓库，考虑增加超时时间和并发数：
   ```
   DEEPWIKI_REQUEST_TIMEOUT=60000 DEEPWIKI_MAX_CONCURRENCY=10 npx mcp-deepwiki
   ```

## 许可证

MIT
