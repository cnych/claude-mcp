---
name: Backlinks MCP
digest: 通过使用 Ahrefs 数据检索任何域名的反链信息的 MCP 服务器
author: cnych
repository: https://github.com/cnych/backlinks-mcp
homepage: https://www.claudemcp.com/servers/backlinks-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - 反链
icon: https://avatars.githubusercontent.com/u/3094973?s=48&v=4
createTime: 2025-04-12
---

这个 MCP 服务器使用 Ahrefs 的数据检索任何域名的反链信息。

## 功能

- 🔍 检索任何域名的反链信息
- 🔒 自动解决 Cloudflare Turnstile 验证码
- 💾 签名缓存以提高性能和减少 API 成本
- 🚀 快速且高效的数据检索
- 🧹 简化输出，只保留最相关的反链信息

## 安装

> 这个 MCP 服务器仅用于学习目的，请不要滥用它，否则后果自负。这个项目受 `@哥飞社群` 的启发。

## 功能

- 🔍 检索任何域名的反链信息
- 🔒 自动解决 Cloudflare Turnstile 验证码
- 💾 签名缓存以提高性能和减少 API 成本
- 🚀 快速且高效的数据检索
- 🧹 简化输出，只保留最相关的反链信息

## 安装

### 先决条件

- Python 3.8 或更高版本
- 一个 CapSolver 账户和 API 密钥（注册 [这里](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0)）
- `uv` 安装（在 macOS 上，你可能需要使用 `brew install uv` 安装）

### 手动安装

1. 克隆仓库:

   ```bash
   git clone https://github.com/cnych/backlinks-mcp.git
   cd backlinks-mcp
   ```

2. 使用 uv 安装 FastMCP:

   ```bash
   uv pip install fastmcp
   ```

3. 设置你的 CapSolver API 密钥:
   ```bash
   export CAPSOLVER_API_KEY="your-capsolver-api-key"
   ```

## 使用

### 运行服务

你可以使用 FastMCP 以几种方式运行服务:

#### 在 Claude Desktop 中安装

在 Claude Desktop 中安装这个服务器并立即与之交互:

```bash
fastmcp install src/backlinks_mcp/server.py
```

#### 使用 MCP 检查器测试

用于开发和测试:

```bash
fastmcp dev src/backlinks_mcp/server.py
```

#### 在 Cursor IDE 中安装

在 Cursor 设置中，切换到 MCP 标签，点击 `+Add new global MCP server` 按钮，然后输入以下内容:

```json
{
  "mcpServers": {
    "Backlink MCP": {
      "command": "uvx",
      "args": ["backlinks-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

你也可以在项目根目录创建一个 `.cursor/mcp.json` 文件，并输入上述内容，这样它就是一个项目特定的 MCP 服务器。

> `CAPSOLVER_API_KEY` 环境变量可以从 [这里](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0) 获取。

接下来，我们可以在 Cursor 中使用这个 MCP:

![Use Backlinks MCP on Cursor](/images/backlinks-mcp-on-cursor.png)

### API 参考

这个服务暴露了以下 MCP 工具:

#### `get_backlinks_list(domain: str)`

检索指定域名的反链列表。

**参数:**

- `domain` (string): 要查询的域名 (e.g., "example.com")

**返回:**

一个反链对象列表，每个对象包含:

- `anchor`: 反链的锚文本
- `domainRating`: 域名评分 (0-100)
- `title`: 链接页面的标题
- `urlFrom`: 包含反链的页面 URL
- `urlTo`: 被链接的 URL
- `edu`: 是否来自教育网站
- `gov`: 是否来自政府网站

**示例响应:**

```json
[
  {
    "anchor": "example link",
    "domainRating": 76,
    "title": "Useful Resources",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

## 开发

用于开发目的，你可以克隆仓库并安装开发依赖:

```bash
git clone https://github.com/cnych/backlinks-mcp.git
cd backlinks-mcp
uv sync
```

## 工作原理

1. 服务首先尝试检索域名的缓存签名
2. 如果没有有效的缓存，它:
   - 使用 CapSolver 解决 Cloudflare Turnstile 验证码
   - 从 Ahrefs 获取签名和有效期
   - 缓存此信息以供将来使用
3. 使用签名检索反链数据
4. 处理并返回简化后的反链信息

## 故障排除

- **CapSolver API Key Error**: 确保你的 `CAPSOLVER_API_KEY` 环境变量设置正确
- **Rate Limiting**: 如果你遇到速率限制，请尝试更少地使用服务
- **No Results**: 某些域名可能没有反链或未被 Ahrefs 索引
- **Issues**: 如果你遇到 Backlinks MCP 的问题，请检查 [Backlinks MCP GitHub 仓库](https://github.com/cnych/backlinks-mcp) 获取故障排除指南

## 许可证

这个项目受 MIT 许可证的约束 - 详情请参阅 LICENSE 文件。
