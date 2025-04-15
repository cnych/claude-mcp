---
name: EdgeOne Pages MCP
digest: MCP服务支持快速将HTML内容部署至EdgeOne Pages，并生成可公开访问的URL以便轻松分享。通过极简配置简化内容发布流程。
author: TencentEdgeOne
repository: https://github.com/TencentEdgeOne/edgeone-pages-mcp
homepage: https://edgeone.ai/document/162227908259442688
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 无服务器
  - 边缘计算
  - 腾讯
icon: https://avatars.githubusercontent.com/u/176978739?v=4
createTime: 2025-03-25
---

用于将 HTML 内容部署至 EdgeOne Pages 并获取可公开访问 URL 的 MCP 服务。

## 演示

![腾讯 EdgeOne Pages MCP 演示](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-ef5005b0.gif)

## 环境要求

- Node.js 18 或更高版本

## 配置 MCP

```json
{
  "mcpServers": {
    "edgeone-pages-mcp-server": {
      "command": "npx",
      "args": ["edgeone-pages-mcp"]
    }
  }
}
```

## 架构设计

![EdgeOne Pages MCP架构图](https://static.claudemcp.com/servers/TencentEdgeOne/edgeone-pages-mcp/TencentEdgeOne-edgeone-pages-mcp-4f131d90.svg)

架构图展示工作流程：

1. 大语言模型生成 HTML 内容
2. 内容发送至 EdgeOne Pages MCP 服务端
3. MCP 服务端将内容部署至 EdgeOne Pages 边缘函数
4. 内容存储于 EdgeOne KV 存储实现快速边缘访问
5. MCP 服务端返回公开 URL
6. 用户可通过浏览器访问已部署内容，享受边缘加速

## 核心特性

- 基于 MCP 协议实现 HTML 内容快速部署至 EdgeOne Pages
- 自动生成可公开访问的 URL

## 实现原理

本 MCP 服务集成 EdgeOne Pages Functions 实现静态 HTML 内容部署，关键技术包括：

1. **EdgeOne Pages Functions** - 支持在边缘节点运行 JavaScript/TypeScript 代码的无服务器计算平台

2. **关键实现细节**：

   - 使用 EdgeOne Pages KV 存储托管 HTML 内容
   - 自动为每次部署生成公开 URL
   - 通过规范化错误处理机制反馈 API 异常

3. **工作流程**：

   - MCP 服务端通过`deploy-html`工具接收 HTML 内容
   - 连接 EdgeOne Pages API 获取基础 URL
   - 通过 EdgeOne Pages KV API 部署 HTML 内容
   - 返回可立即访问的内容部署 URL

4. **使用示例**：
   - 向 MCP 服务提交 HTML 内容
   - 获取即时可用的公开访问 URL

更多信息请参阅[EdgeOne Pages Functions 文档](https://edgeone.ai/document/162227908259442688)与[EdgeOne Pages KV 存储指南](https://edgeone.ai/document/162227803822321664)。
