# Claude MCP 社区网站

![MCP Logo](/public/logo.png)

本仓库包含 [claudemcp.com](https://www.claudemcp.com) 的源代码，这是一个模型上下文协议（MCP）的社区网站。该网站作为 MCP 文档、服务器目录、客户端信息和社区资源的中心枢纽。

## 📋 MCP 服务器和客户端

### 精选 MCP 服务器

以下 MCP 服务器目前在网站上有文档记录：

- **[Backlinks MCP](https://www.claudemcp.com/servers/backlinks-mcp)** - 用于检索域名反向链接信息的服务器
- **[Blender MCP](https://github.com/ahujasid/blender-mcp)** - 与 Blender 3D 建模软件的集成
- **[Brave Search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)** - 使用 Brave 搜索引擎的网络搜索功能
- **Claudflare** - 与 Cloudflare 服务的集成
- **Fetch** - 网络内容获取和处理
- **[Figma Context](https://github.com/glips/figma-context-mcp)** - Figma 设计的访问和操作
- **[Firecrawl](https://github.com/mendableai/firecrawl-mcp-server)** - 高级网络抓取和爬行功能
- **Filesystem** - 具有可配置访问权限的安全文件系统操作
- **Git** - Git 仓库操作和管理
- **GitHub** - GitHub API 集成，用于仓库管理
- **Google Drive** - Google Drive 文件的访问和管理
- **Playwright** - 浏览器自动化和测试
- **PostgreSQL** - PostgreSQL 数据库交互
- **Puppeteer** - 无头浏览器自动化
- **SQLite** - SQLite 数据库交互
- **[Zapier](https://zapier.com/mcp)** - 通过 Zapier 与数千个网络服务集成

### 精选 MCP 客户端

该网站提供有关这些 MCP 客户端应用程序的信息：

- **Claude Desktop** - Anthropic 官方桌面应用程序
- **Continue** - AI 驱动的软件开发环境
- **Cursor** - 具有 AI 助手功能的代码编辑器

## 🚀 入门指南

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn

### 开发设置

1. 克隆仓库：

```bash
git clone https://github.com/cnych/claude-mcp.git
cd claude-mcp
```

2. 安装依赖：

```bash
npm install
# 或者
yarn install
```

3. 启动开发服务器：

```bash
npm run dev
# 或者
yarn dev
```

4. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 项目结构

- `/src/app/[locale]` - 具有国际化支持的应用程序路由
- `/src/components` - 可重用的 UI 组件
- `/src/i18n` - 国际化配置
- `/src/messages` - 多语言翻译文件
- `/servers` - MCP 服务器内容文件
- `/clients` - MCP 客户端内容文件
- `/docs` - 文档内容文件
- `/blogs` - 博客文章内容文件

## 🌐 国际化

该网站支持以下语言：

- 英语 (en)
- 韩语 (ko)
- 简体中文 (zh)
- 繁体中文 (tw)

要在特定语言中添加内容，请将文件放置在内容文件夹下的相应语言目录中。

## 🤝 贡献

我们欢迎对 Claude MCP 社区网站的贡献！以下是您可以贡献的方式：

### 贡献服务器

1. Fork 仓库
2. 在 `/public/servers/{locale}` 目录下创建一个新文件，遵循现有格式
3. 提交一个包含您的服务器信息的 PR 请求

或者，使用 [Servers 页面](https://www.claudemcp.com/servers) 上的 "Submit a Server" 按钮直接创建一个 PR。

### 贡献网站

1. Fork 仓库
2. 创建一个功能分支：`git checkout -b feature/amazing-feature`
3. Commit 您的更改：`git commit -m 'Add some amazing feature'`
4. Push 到分支：`git push origin feature/amazing-feature`
5. 打开一个 PR

### 翻译贡献

我们感谢翻译的帮助，要贡献：

1. 检查 `/src/messages` 目录中的翻译文件
2. 为您的语言添加或改进翻译
3. 提交一个包含您的更改的 PR
