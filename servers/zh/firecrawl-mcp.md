---
name: Firecrawl MCP
digest: 为大语言模型提供网页抓取能力的 Firecrawl MCP 服务器
author: mendableai
repository: https://github.com/mendableai/firecrawl-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - firecrawl
  - 爬虫
  - 网页提取
icon: https://avatars.githubusercontent.com/u/135057108?s=48&v=4
createTime: 2025-04-09
---

Firecrawl MCP 是使用 [Firecrawl](https://firecrawl.dev/) 来抓取网页的 MCP 服务器实现，为 Cursor、Claude 以及其他 MCP 客户端提供了高级的网页抓取、内容提取和数据处理能力。它通过 Model Context Protocol (MCP) 与各种 MCP 客户端无缝集成，使 AI 能够直接访问和处理网络内容。

## 主要特性

- **高级网页抓取**：支持从单个 URL 或多个 URL 批量抓取内容
- **智能内容提取**：自动识别和提取主要内容，过滤导航栏、页脚等无关元素
- **结构化数据提取**：使用 LLM 从网页中提取格式化的结构化数据
- **网络搜索**：直接从搜索引擎获取结果并处理
- **网站爬取**：支持递归爬取网站，可控制深度和范围
- **深度研究**：使用智能爬取、搜索和 LLM 分析进行深入研究
- **自动生成 LLMs.txt**：为网站创建标准化的 LLMs.txt 文件，定义 LLM 如何与网站交互
- **自动化速率限制处理**：内置指数退避重试机制
- **并行处理**：高效的批量操作和并行请求处理

:::adsense 8781986491:::

## 安装与配置

### 使用 npx 运行

```bash
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

### 手动安装

```bash
npm install -g firecrawl-mcp
```

### 在 Cursor 上配置运行

#### 配置 Cursor 🖥️

注意：需要 Cursor 版本 0.45.6 或更高。有关配置 MCP 服务器的最新说明，请参阅 Cursor 官方文档：[Cursor MCP 服务器配置指南](https://cursor.sh/docs/mcp-server-configuration)

##### 在 Cursor v0.45.6 中配置 Firecrawl MCP

1. 打开 Cursor 设置
2. 转到 Features > MCP Servers
3. 点击 "+ Add New MCP Server"
4. 输入以下内容：
   - 名称："firecrawl-mcp"（或您喜欢的名称）
   - 类型："command"
   - 命令：`env FIRECRAWL_API_KEY=your-api-key npx -y firecrawl-mcp`

##### 在 Cursor v0.48.6 中配置 Firecrawl MCP

1. 打开 Cursor 设置
2. 转到 Features > MCP Servers
3. 点击 "+ Add new global MCP server"
4. 输入以下代码：

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

如果您使用的是 Windows 系统并遇到问题，请尝试使用：`cmd /c "set FIRECRAWL_API_KEY=your-api-key && npx -y firecrawl-mcp"`

用您的 Firecrawl API 密钥替换 `your-api-key`。如果您还没有密钥，可以创建账户并从 https://www.firecrawl.dev/app/api-keys 获取。

添加后，刷新 MCP 服务器列表以查看新工具。Composer Agent 会在适当时自动使用 Firecrawl MCP，但您也可以通过描述您的网页抓取需求来明确请求它。通过 Command+L（Mac）访问 Composer，在提交按钮旁边选择"Agent"，然后输入您的查询。

### 在 Windsurf 上运行

将以下内容添加到您的 `./codeium/windsurf/model_config.json` 文件中：

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### 通过 Smithery 安装（传统方式）

通过 Smithery 自动为 Claude Desktop 安装 Firecrawl：

```bash
npx -y @smithery/cli install @mendableai/mcp-server-firecrawl --client claude
```

### 配置

#### 环境变量

##### 云 API 必需变量

- `FIRECRAWL_API_KEY`：您的 Firecrawl API 密钥

  - 使用云 API 时必需（默认）
  - 使用带有 `FIRECRAWL_API_URL` 的自托管实例时可选

- `FIRECRAWL_API_URL`（可选）：自托管实例的自定义 API 端点
  - 示例：`https://firecrawl.your-domain.com`
  - 如果未提供，将使用云 API（需要 API 密钥）

##### 可选配置

**重试配置**

- `FIRECRAWL_RETRY_MAX_ATTEMPTS`：最大重试尝试次数（默认：3）
- `FIRECRAWL_RETRY_INITIAL_DELAY`：首次重试前的初始延迟（毫秒）（默认：1000）
- `FIRECRAWL_RETRY_MAX_DELAY`：重试之间的最大延迟（毫秒）（默认：10000）
- `FIRECRAWL_RETRY_BACKOFF_FACTOR`：指数退避乘数（默认：2）

**信用额度使用监控**

- `FIRECRAWL_CREDIT_WARNING_THRESHOLD`：信用额度使用警告阈值（默认：1000）
- `FIRECRAWL_CREDIT_CRITICAL_THRESHOLD`：信用额度使用临界阈值（默认：100）

#### 配置示例

**使用云 API 的自定义重试和信用监控**：

```bash
# 云 API 必需
export FIRECRAWL_API_KEY=your-api-key

# 可选重试配置
export FIRECRAWL_RETRY_MAX_ATTEMPTS=5        # 增加最大重试次数
export FIRECRAWL_RETRY_INITIAL_DELAY=2000    # 以 2 秒延迟开始
export FIRECRAWL_RETRY_MAX_DELAY=30000       # 最大 30 秒延迟
export FIRECRAWL_RETRY_BACKOFF_FACTOR=3      # 更激进的退避

# 可选信用监控
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=2000    # 2000 信用额度时发出警告
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=500    # 500 信用额度时临界警告
```

**自托管实例**：

```bash
# 自托管必需
export FIRECRAWL_API_URL=https://firecrawl.your-domain.com

# 自托管可选身份验证
export FIRECRAWL_API_KEY=your-api-key  # 如果您的实例需要身份验证

# 自定义重试配置
export FIRECRAWL_RETRY_MAX_ATTEMPTS=10
export FIRECRAWL_RETRY_INITIAL_DELAY=500     # 更快开始重试
```

### 与 Claude Desktop 一起使用

将以下内容添加到您的 `claude_desktop_config.json` 文件：

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY_HERE",

        "FIRECRAWL_RETRY_MAX_ATTEMPTS": "5",
        "FIRECRAWL_RETRY_INITIAL_DELAY": "2000",
        "FIRECRAWL_RETRY_MAX_DELAY": "30000",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR": "3",

        "FIRECRAWL_CREDIT_WARNING_THRESHOLD": "2000",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD": "500"
      }
    }
  }
}
```

## 配置选项

Firecrawl MCP 服务器提供了多种配置选项，可以根据需要进行调整：

### 重试配置

```javascript
retry: {
  maxAttempts: 3,    // 速率限制请求的重试次数
  initialDelay: 1000, // 首次重试前的初始延迟（毫秒）
  maxDelay: 10000,    // 重试之间的最大延迟（毫秒）
  backoffFactor: 2,   // 指数退避因子
}
```

### 信用额度监控

```javascript
credit: {
  warningThreshold: 1000, // 信用额度使用达到此级别时发出警告
  criticalThreshold: 100,  // 信用额度使用达到此级别时发出严重警告
}
```

这些配置控制：

1. **重试行为**

   - 自动重试因速率限制而失败的请求
   - 使用指数退避避免过度请求 API
   - 示例：使用默认设置，重试将在以下时间点尝试：
     - 第一次重试：1 秒延迟
     - 第二次重试：2 秒延迟
     - 第三次重试：4 秒延迟（上限为 maxDelay）

2. **信用额度监控**
   - 跟踪云 API 的信用额度消耗
   - 在指定阈值提供警告
   - 帮助防止服务意外中断
   - 示例：使用默认设置：
     - 剩余 1000 信用额度时发出警告
     - 剩余 100 信用额度时发出严重警告

## 速率限制和批处理

服务器利用 Firecrawl 内置的速率限制和批处理功能：

- 自动速率限制处理，带有指数退避策略
- 批量操作的高效并行处理
- 智能请求队列和节流
- 自动重试临时错误

## 可用工具

### 1. 抓取工具 (`firecrawl_scrape`)

从单个 URL 抓取内容，支持高级选项。

```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "waitFor": 1000,
    "timeout": 30000,
    "mobile": false,
    "includeTags": ["article", "main"],
    "excludeTags": ["nav", "footer"],
    "skipTlsVerification": false
  }
}
```

### 2. 批量抓取工具 (`firecrawl_batch_scrape`)

高效地从多个 URL 抓取内容，内置速率限制和并行处理。

```json
{
  "name": "firecrawl_batch_scrape",
  "arguments": {
    "urls": ["https://example1.com", "https://example2.com"],
    "options": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

响应包含用于状态检查的操作 ID：

```json
{
  "content": [
    {
      "type": "text",
      "text": "Batch operation queued with ID: batch_1. Use firecrawl_check_batch_status to check progress."
    }
  ],
  "isError": false
}
```

### 3. 检查批量状态 (`firecrawl_check_batch_status`)

检查批量操作的状态。

```json
{
  "name": "firecrawl_check_batch_status",
  "arguments": {
    "id": "batch_1"
  }
}
```

### 4. 搜索工具 (`firecrawl_search`)

搜索网络并可选择性地从搜索结果中提取内容。

```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "your search query",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

### 5. 爬取工具 (`firecrawl_crawl`)

启动具有高级选项的异步爬取。

```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
```

### 6. 提取工具 (`firecrawl_extract`)

使用 LLM 功能从网页中提取结构化信息。支持云 AI 和自托管 LLM 提取。

```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "提取产品信息，包括名称、价格和描述",
    "systemPrompt": "你是一个帮助提取产品信息的助手",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
```

示例响应：

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "name": "示例产品",
        "price": 99.99,
        "description": "这是一个示例产品描述"
      }
    }
  ],
  "isError": false
}
```

#### 提取工具选项：

- `urls`：要从中提取信息的 URL 数组
- `prompt`：LLM 提取的自定义提示
- `systemPrompt`：引导 LLM 的系统提示
- `schema`：结构化数据提取的 JSON 模式
- `allowExternalLinks`：允许从外部链接提取
- `enableWebSearch`：启用网络搜索以获取额外上下文
- `includeSubdomains`：在提取中包含子域名

使用自托管实例时，提取将使用您配置的 LLM。对于云 API，它使用 Firecrawl 的托管 LLM 服务。

### 7. 深度研究工具 (`firecrawl_deep_research`)

使用智能爬取、搜索和 LLM 分析对查询进行深度网络研究。

```json
{
  "name": "firecrawl_deep_research",
  "arguments": {
    "query": "碳捕获技术是如何工作的？",
    "maxDepth": 3,
    "timeLimit": 120,
    "maxUrls": 50
  }
}
```

参数：

- query（字符串，必需）：要探索的研究问题或主题。
- maxDepth（数字，可选）：爬取/搜索的最大递归深度（默认：3）。
- timeLimit（数字，可选）：研究会话的时间限制（以秒为单位）（默认：120）。
- maxUrls（数字，可选）：要分析的最大 URL 数量（默认：50）。

返回：

- 基于研究由 LLM 生成的最终分析。(data.finalAnalysis)
- 可能还包括研究过程中使用的结构化活动和来源。

### 8. 生成 LLMs.txt 工具 (`firecrawl_generate_llmstxt`)

为给定域名生成标准化的 `llms.txt` 文件，此文件定义了大型语言模型应如何与网站交互。

```json
{
  "name": "firecrawl_generate_llmstxt",
  "arguments": {
    "url": "https://example.com",
    "maxUrls": 20,
    "showFullText": true
  }
}
```

参数：

- url（字符串，必需）：要分析的网站基本 URL。
- maxUrls（数字，可选）：要包含的最大 URL 数量（默认：10）。
- showFullText（布尔值，可选）：是否在响应中包含 llms-full.txt 内容。

返回：

- 生成的 `llms.txt` 文件内容，可选择性地包含 `llms-full.txt`（`data.llmstxt` 和/或 `data.llmsfulltxt`）

## 日志系统

服务器包含全面的日志记录：

- 操作状态和进度
- 性能指标
- 信用额度使用监控
- 速率限制跟踪
- 错误情况

示例日志消息：

```
[INFO] Firecrawl MCP Server 成功初始化
[INFO] 开始抓取 URL: https://example.com
[INFO] 批量操作已加入队列，ID: batch_1
[WARNING] 信用额度使用已达到警告阈值
[ERROR] 超过速率限制，将在 2 秒后重试...
```

## 错误处理

服务器提供了强大的错误处理：

- 自动重试临时错误
- 使用退避策略处理速率限制
- 详细的错误消息
- 信用额度使用警告
- 网络弹性

错误响应示例：

```json
{
  "content": [
    {
      "type": "text",
      "text": "错误：超过速率限制。将在 2 秒后重试..."
    }
  ],
  "isError": true
}
```

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test
```

### 贡献

1. Fork 仓库
2. 创建您的功能分支
3. 运行测试：`npm test`
4. 提交拉取请求

## 许可证

MIT 许可证 - 详情请参阅 LICENSE 文件
