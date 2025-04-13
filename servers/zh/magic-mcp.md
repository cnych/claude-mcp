---
name: 21st.dev Magic AI Agent
digest: Magic MCP 是一款强大的前端开发工具，它将像 v0 一样的功能集成到 Cursor/WindSurf/Cline 中。21st dev Magic MCP 服务器让您能够像使用魔法一样处理前端开发工作
author: 21st-dev
repository: https://github.com/21st-dev/magic-mcp
homepage: https://21st.dev/magic/
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - ui
  - ide
icon: https://avatars.githubusercontent.com/u/199367026?s=48&v=4
createTime: 2025-02-19
featured: true
---

![MCP横幅](https://static.claudemcp.com/servers/21st-dev/magic-mcp/21st-dev-magic-mcp-6c24c56a.png)

Magic 组件平台(MCP)是一款由 AI 驱动的强大工具，开发者通过自然语言描述即可快速创建美观现代的 UI 组件。它能无缝集成主流 IDE，为 UI 开发提供高效工作流。

## 核心功能

- **AI 生成 UI**：用自然语言描述即可创建 UI 组件
- **多 IDE 支持**：
  - [Cursor](https://cursor.com) IDE 集成
  - [Windsurf](https://windsurf.ai) 支持
  - [VSCode + Cline](https://cline.bot) 集成(测试版)
- **现代组件库**：访问受[21st.dev](https://21st.dev)启发的海量预制可定制组件
- **实时预览**：创建时即时查看组件效果
- **TypeScript 支持**：完整的类型安全开发支持
- **SVGL 集成**：访问专业品牌资产与标志库
- **组件增强**：为现有组件添加高级功能与动画(即将推出)

## 工作原理

1. **描述需求**

   - 在 AI 助手聊天框输入`/ui`并描述所需组件
   - 示例：`/ui 创建一个响应式设计的现代导航栏`

2. **魔法生成**

   - IDE 会提示使用 Magic 功能
   - 立即生成精美 UI 组件
   - 组件设计灵感源自 21st.dev 组件库

3. **无缝集成**
   - 组件自动加入项目
   - 即刻使用新 UI 组件
   - 所有组件完全可定制

## 快速开始

### 环境要求

- Node.js(推荐最新 LTS 版本)
- 支持以下任一 IDE：
  - Cursor
  - Windsurf
  - VSCode(需安装 Cline 扩展)

### 安装指南

1. **获取 API 密钥**

   - 访问[21st.dev 控制台](https://21st.dev/magic/console)
   - 生成新 API 密钥

2. **选择安装方式**

#### 方式一：CLI 安装(推荐)

单命令完成 IDE 配置：

```bash
npx @21st-dev/cli@latest install <客户端> --api-key <密钥>
```

支持客户端：cursor, windsurf, cline, claude

#### 方式二：手动配置

如需手动设置，在 IDE 配置文件中添加：

```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest", "API_KEY=\"你的API密钥\""]
    }
  }
}
```

配置文件路径：

- Cursor: `~/.cursor/mcp.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`
- Cline: `~/.cline/mcp_config.json`
- Claude: `~/.claude/mcp_config.json`

## 常见问题

### 如何处理我的代码库？

Magic AI 助手仅修改与生成组件相关的文件。它会遵循项目代码风格与结构，在不影响其他功能的前提下无缝集成。

### 能否自定义生成组件？

当然！所有生成组件均可自由编辑，代码结构清晰。您可以像修改普通 React 组件一样调整样式、功能和行为。

### 生成次数用尽怎么办？

超出月度限额后会提示升级方案。现有组件仍可正常使用，随时升级即可继续生成新组件。

### 新组件何时加入 21st.dev 库？

作者可随时发布组件到 21st.dev，Magic 助手会立即同步。这意味着您总能获取社区最新的组件与设计模式。

### 组件复杂度是否有限制？

本助手可处理从简单按钮到复杂交互表单等各种组件。但对于特别复杂的 UI，建议拆分为多个小组件以获得最佳效果。

## 开发说明

### 项目结构

```
mcp/
├── app/
│   └── components/     # 核心UI组件
├── types/             # TypeScript类型定义
├── lib/              # 工具函数
└── public/           # 静态资源
```

### 关键组件

- `IdeInstructions`：各 IDE 设置指南
- `ApiKeySection`：API 密钥管理界面
- `WelcomeOnboarding`：新用户引导流程

## 许可协议

MIT 许可证
