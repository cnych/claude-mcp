---
name: Intlayer MCP 服务器
digest: Intlayer MCP 服务器将 AI 辅助功能集成到您的 IDE 中，通过 Intlayer 提供更智能、具有上下文感知能力的开发体验。它提供命令行访问、项目内文档和直观的 AI 帮助。
author: aymericzip
homepage: https://intlayer.org
repository: https://github.com/aymericzip/intlayer
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - i18n
  - 本地化
  - 翻译
  - 自动化
icon: https://intlayer.org/android-chrome-512x512.png
createTime: 2025-06-10
featured: true
---

一个模型上下文协议（MCP）服务器，通过提供 IDE 感知的文档、CLI 集成和 AI 驱动的上下文工具来增强 **Intlayer** 的开发体验。

## 特性

- 为 Intlayer 使用提供 AI 辅助的建议和解释
- 智能 CLI 集成，可直接在您的 IDE 中运行和检查 `intlayer` 命令
- 基于您项目实际 Intlayer 版本的上下文文档
- 用于实时交互的工具界面和提示建议
- 使用 `npx` 实现零配置设置

## 支持的 IDE

- Cursor
- VS Code (通过 MCP)
- 任何支持模型上下文协议（MCP）的 IDE

## 设置

### 选项 1：使用 NPX 快速启动

将以下内容添加到您的 `.cursor/mcp.json`（或等效的 MCP 配置）中：

```json
{
  "mcpServers": {
    "intlayer": {
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

然后重新启动您的 IDE 或 MCP 会话。

### 选项 2：VS Code 配置

创建 `.vscode/mcp.json`：

```json
{
  "servers": {
    "intlayer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

在命令面板中：

- 通过“聊天模式”启用 **代理模式**
- 使用 `#intlayer` 来引用工具
- 管理工具确认和服务器会话

## CLI 用法

您也可以通过 CLI 手动运行 Intlayer MCP 服务器：

```bash
# 推荐：npx
npx @intlayer/mcp

# 开发模式
npm run dev

# 自定义入口
node dist/cjs/index.cjs
```

要进行检查和调试：

```bash
npx @modelcontextprotocol/inspector npx @intlayer/mcp
```

## 可用功能

| 功能            | 描述                                           |
| --------------- | ---------------------------------------------- |
| 智能 CLI        | `intlayer` 命令的内联执行和文档查询            |
| 版本化文档      | 自动检测您安装的 Intlayer 版本并加载匹配的文档 |
| 自动完成 + 提示 | 针对您的文件和上下文量身定制的 AI 辅助提示建议 |
| 代理模式工具    | 在 Cursor 和兼容的 IDE 中注册并运行自定义工具  |

## 先决条件

- Node.js
- 支持 MCP 协议的 IDE（Cursor、VS Code 等）
- 使用 [Intlayer](https://github.com/aymericzip/intlayer) 的项目

## 许可证

Apache 2.0

---

## 有用链接

- [Intlayer GitHub 仓库](https://github.com/aymericzip/intlayer)
- [文档](https://intlayer.org/doc/mcp-server)
