---
name: SEO MCP
digest: MCP 是一款基于 Ahrefs 数据的免费 SEO 工具，提供反向链接分析和关键词研究等核心功能，助力网站优化与搜索排名提升。
author: cnych
homepage: https://github.com/cnych/seo-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - Ahrefs
  - 反链
  - 关键词
icon: https://avatars.githubusercontent.com/u/3094973?v=4
createTime: 2025-04-14
featured: true
---

基于 Ahrefs 数据的免费 SEO 工具 MCP 服务。包含反向链接、关键词创意等功能，后续会添加更多工具。

## 概述

本服务提供获取网站 SEO 数据的 API 接口，完整处理验证码破解、身份认证及 Ahrefs 数据抓取全流程。

> 本 MCP 服务仅限学习用途，严禁滥用，否则后果自负。本项目灵感来源于`@GoFei社区`。

## 功能特性

- 获取任意域名的反向链接数据
- 获取关键词创意与 SEO 建议
- 使用 CapSolver 自动破解验证码
- 签名缓存机制减少 API 调用
- 快速高效的数据获取
- 简化输出仅保留核心 SEO 信息

## 安装指南

### 环境要求

- Python 3.10 或更高版本
- CapSolver 账号及 API 密钥
- 已安装`pip`或`uv`（macOS 用户可能需要通过`brew install uv`安装）

### 通过 PyPI 安装

```bash
pip install seo-mcp
```

或使用`uv`：

```bash
uv pip install seo-mcp
```

### 手动安装

1. 克隆代码库：

   ```bash
   git clone https://github.com/cnych/seo-mcp.git
   cd seo-mcp
   ```

2. 使用 pip 或 uv 安装依赖：

   ```bash
   pip install -e .
   # 或
   uv pip install -e .
   ```

3. 设置 CapSolver API 密钥：

   ```bash
   export CAPSOLVER_API_KEY="您的capsolver-api-key"
   ```

## 使用说明

### 运行服务

可通过多种方式运行服务：

#### 在 Claude Desktop 中安装

```bash
fastmcp install src/seo_mcp/server.py
```

#### 使用 MCP 检查器测试

```bash
fastmcp dev src/seo_mcp/server.py
```

#### 在 Cursor IDE 中安装

在 Cursor 设置中切换至 MCP 标签页，点击`+ 添加全局MCP服务`按钮，输入以下内容：

```json
{
  "mcpServers": {
    "SEO MCP": {
      "command": "uvx",
      "args": ["--python 3.10", "seo-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

![在Cursor中使用SEO MCP反向链接工具](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-03c59e1e.png)

![在Cursor中使用SEO MCP关键词工具](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-a188f668.png)

### API 参考

服务提供以下 MCP 工具接口：

#### `get_backlinks_list(domain: str)`

获取指定域名的反向链接列表。

**参数：**

- `domain` (字符串)：待查询域名（如"example.com"）

**返回值：**

包含反向链接对象的列表，每个对象包含：

- `anchor`：反向链接锚文本
- `domainRating`：域名评级（0-100）
- `title`：被链接页面标题
- `urlFrom`：包含反向链接的源页面 URL
- `urlTo`：被链接的目标页面 URL
- `edu`：标识是否来自教育类网站
- `gov`：标识是否来自政府类网站

**响应示例：**

```json
[
  {
    "anchor": "示例链接",
    "domainRating": 76,
    "title": "实用资源",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

#### `keyword_generator(keyword: str, country: str = "us", search_engine: str = "Google")`

获取指定关键词的创意建议与 SEO 数据。

**参数：**

- `keyword` (字符串)：待查询关键词
- `country` (字符串)：国家代码（如"us"）
- `search_engine` (字符串)：搜索引擎（如"Google"）

**返回值：**

- 包含两类关键词创意的列表：

  - `keyword ideas`：常规关键词建议，包含关键词、国家、难度、流量及更新时间
  - `question ideas`：问题型关键词建议，格式相同

  每个关键词对象包含：

  - `keyword`：关键词文本
  - `country`：国家代码
  - `difficulty`：难度评级（简单、中等、困难或未知）
  - `volume`：搜索流量级别（如超过 100 次、超过 1000 次）
  - `updatedAt`：数据更新时间

## 开发指南

开发时可通过以下方式克隆代码库并安装开发依赖：

```bash
git clone https://github.com/cnych/seo-mcp.git
cd seo-mcp
uv sync  # 或使用 pip install -e .
```

## 工作原理

1. 服务首先尝试获取域名的缓存签名
2. 若无有效缓存则：
   - 使用 CapSolver 破解 Cloudflare Turnstile 验证码
   - 从 Ahrefs 获取签名及过期时间
   - 缓存该信息供后续使用
3. 使用签名获取 SEO 数据
4. 处理并返回简化版 SEO 信息

## 故障排查

- **CapSolver API 密钥错误**：确认`CAPSOLVER_API_KEY`环境变量设置正确
- **速率限制**：若遇限流问题，请降低服务使用频率
- **无结果返回**：部分域名可能无反向链接或未被 Ahrefs 收录

## 许可协议

本项目采用 MIT 许可证，详见 LICENSE 文件。
