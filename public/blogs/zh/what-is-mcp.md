---
title: 什么是 MCP？
excerpt: 本文将详细解析 MCP（Model Context Protocol，模型上下文协议）的工作原理、核心功能与实际应用，帮助你全面了解这项被誉为"AI 领域 USB 接口"的革命性技术。
date: 2025-04-16
slug: what-is-mcp
coverImage: https://static.claudemcp.com/images/blog/what-is-mcp-claude.jpg
featured: true
author:
  name: 阳明
  avatar: https://static.claudemcp.com/images/avatars/yangming.png
category: 技术
---

Claude 终于能联网搜索、访问本地文件和数据库了！这项突破性的技术背后是什么？本文将详细解析 [MCP（Model Context Protocol，模型上下文协议）](/) 的工作原理、核心功能与实际应用，帮助你全面了解这项被誉为"AI 领域 USB 接口"的革命性技术。

## MCP 的基本概念与背景

### 什么是 MCP？

MCP（Model Context Protocol，模型上下文协议）是由 Anthropic 公司于 2024 年 11 月开源的一种通信协议，旨在解决大型语言模型（LLM）与外部数据源及工具之间的无缝集成需求。通过标准化 AI 系统与数据源的交互方式，MCP 帮助模型获取更丰富的上下文信息，生成更准确、更相关的响应。

简单来说，MCP 就像给 AI 装上了一个"万能接口"，让 AI 能够与各种外部系统和数据源实现标准化的双向通信。正如 USB-C 提供了连接各种设备的标准化方式，MCP 也为连接 AI 模型和不同数据源提供了统一的方法。

### MCP 的开发背景

在 MCP 出现之前，即使是最先进的 AI 模型也面临与数据隔离的限制。每一个新的数据来源都需要专属的定制实现，这不仅增加了开发成本，还造成了效率低下和系统难以扩展的问题。

Anthropic 认为，随着 AI 助理获得主要采用，业界在模型功能上投入了大量资金，但就算是最复杂的模型也会受到与数据隔离的限制。MCP 正是为了解决这一挑战而推出的，它允许开发人员在数据来源及 AI 工具之间建立安全的双向连接。

## MCP 的核心架构与工作原理

### 客户端-服务器架构

![MCP 架构图](https://static.claudemcp.com/images/blog/what-is-mcp.png)

MCP 采用经典的客户端-服务器架构：

1. **MCP 主机(Host)**：通常是发起连接的 LLM 应用程序，如 Claude Desktop 或其他 AI 工具。它负责管理 MCP Client 与 Server 的连线。

2. **MCP 客户端(Client)**：在主机应用程序内部与服务器保持 1:1 连接，负责协议通信。它负责 AI 和 MCP Server 之间的沟通。

3. **MCP 服务器(Server)**：轻量级程序，负责暴露特定的数据源或工具功能，并通过标准化协议与客户端交互。它管理本地数据库要输出的内容指令，让 Client 可以自选指令来运作。

### 通信流程

MCP 的通信基于 JSON-RPC 2.0，支持请求、响应和通知三种消息类型，确保通信的标准化和一致性。

整个流程如下：

1. 用户通过 AI 应用发送请求
2. AI 应用（主机）通过 MCP 客户端向 MCP 服务器发送请求
3. MCP 服务器处理请求，访问相应的数据源或执行工具功能
4. 服务器将结果返回给客户端
5. 客户端将信息传递给 AI 模型
6. AI 模型基于这些信息生成响应

## MCP 的四大核心功能

![MCP 四大核心功能](https://static.claudemcp.com/images/blog/mcp-core-components.png)

MCP 提供了四种核心原语（服务器端原语），用于规范客户端和服务器之间的交互：

### 1. 资源(Resources)

资源表示 MCP 服务器想要向客户端提供的任何类型数据，可包括：

- 文件内容
- 数据库记录
- API 响应
- 实时系统数据
- 截图和图片
- 日志文件

每个资源由唯一的 URI 标识，并且可以包含文本或二进制数据。

### 2. 提示(Prompts)

MCP 中的提示是预定义的模板，可以：

- 接受动态参数
- 上下文
- 链接多个交互
- 指导特定工作流程
- 表面作为 UI 元素（如斜线命令）

### 3. 工具(Tools)

MCP 中的工具允许服务器公开可由客户端调用的可执行函数。工具的关键方面包括：

- 发现(tools/list)：客户端可以列出可用的工具
- 调用(tools/call)：服务器执行请求的操作并返回结果
- 灵活性：工具范围从简单的计算到复杂的 API 交互

### 4. 采样(Sampling)

采样是 MCP 的一项强大功能，允许服务器通过客户端请求 LLM 完成，从而实现复杂的代理行为，同时保持安全性和隐私性。这种人机交互设计确保用户可以控制 LLM 所看到和生成的内容。

## MCP 如何扩展 Claude AI 的能力

### 突破模型限制

在 MCP 出现之前，Claude 等 AI 模型存在一些固有的限制：

- 无法访问最新的实时数据
- 无法直接执行计算或运行代码
- 无法与外部系统和服务交互

MCP 通过提供标准化的接口，打破了这些限制，使 Claude AI 等模型能够：

- 访问最新的网络数据和信息
- 执行复杂的计算和数据分析
- 调用各种专业工具和服务
- 与企业内部系统无缝集成

### MCP 为 Claude 带来的实际改变

MCP 使 Claude AI 能够动态连接外部工具和数据源，大大扩展了其应用场景和解决问题的能力。例如，通过 MCP，Claude AI 现在可以：

- 直接查询最新的网络信息，提供更及时的回答
- 分析用户上传的文档和数据
- 执行代码并返回结果
- 与企业内部系统集成，提供定制化的业务支持

## MCP 的实际应用场景

### 1. 互联网搜索集成

通过 MCP，Claude 可以连接到搜索引擎 API，实现实时网络搜索功能。例如，使用 Brave Search 的 API，可以让 Claude 获取最新的网络信息。

配置示例：

```json
"mcpServers": {
  "brave-search": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-brave-search"
    ],
    "env": {
      "BRAVE_API_KEY": "YOUR_API_KEY"
    }
  }
}
```

这使得 Claude 能够回答关于最新事件、实时数据或网络信息的查询。

### 2. 数据库访问能力

MCP 允许 Claude 连接到本地或远程数据库，如 SQLite、PostgreSQL 等。

配置示例：

```json
"mcpServers": {
  "sqlite": {
    "command": "uvx",
    "args": ["mcp-server-sqlite", "--db-path", "/Users/YOUR_USERNAME/test.db"]
  }
}
```

这使 Claude 能够执行数据查询、分析和管理任务，将自然语言转换为 SQL 查询。

### 3. 文件系统集成

通过 MCP，Claude 可以访问用户本地文件系统中的指定文件夹。

配置示例：

```json
"mcpServers": {
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/Users/YOUR_USERNAME/Desktop"
    ]
  }
}
```

这让 Claude 能够读取、分析文件内容，甚至创建或修改文件。

### 4. 网页抓取功能

MCP 使 Claude 能够抓取和分析网页内容。只要给 Claude 提供网页 URL，它就能提取网页内容，并进行翻译、总结等操作。

### 5. 创意应用开发

有开发者已经展示了利用 MCP 让 Claude 创建功能齐全的绘图应用程序。Pietro Schirano 展示的原型证明，利用 AI 制作视觉和交互工具变得非常简单，Claude+MCP 完全可以达到 Cursor 的功能效果。

## 如何开始使用 MCP

### Claude Desktop 配置指南

1. **安装必要软件**：

   - 安装 Claude 桌面应用
   - 安装 Node.js（版本 20.16.0 或更高）
   - 安装 Python（3.10 或更高版本）
   - 安装 uv 和其他依赖项

2. **配置 Claude**：

   - 找到或创建 Claude 的配置文件：`/Library/Application Support/Claude/claude_desktop_config.json`
   - 添加需要的 MCP 服务器配置
   - 重启 Claude 桌面应用使配置生效

3. **开启开发者模式**：
   - 打开 Claude 桌面应用
   - 点击菜单栏中的"Claude"
   - 选择"Settings"
   - 在"Developer"选项卡中勾选"Enable Developer Mode"

### 常见 MCP 服务器推荐

除了上述提到的服务器外，还有许多其他 MCP 服务器可以使用：

- [Google Drive 服务器](/zh/servers/gdrive)：搜索 Google Drive 云端数据
- Slack 服务器：集成 Slack 的 Channel 管理和消息功能
- Memory 服务器：知识图形的持久内存系统
- Google Maps 服务器：位置服务、路线和地点细节
- [Fetch 服务器](/zh/servers/fetch)：网页内容获取和处理

### 开发自定义 MCP 服务器

开发者可以创建自定义的 MCP 服务器，以满足特定需求。官方提供了 Python 和 TypeScript 的 SDK 和示例，可以参考这些资源来开发自己的 MCP 服务器。

## MCP 的优势与未来展望

### MCP 的核心优势

1. **标准化**：MCP 提供了一种统一的通信协议，减少为每个数据源单独开发连接器的需求。

2. **灵活性**：MCP 使 AI 应用可连接到各种数据源和工具，增强功能。

3. **安全性**：MCP 确保数据传输加密，实施严格的权限控制，用户可配置访问范围。

4. **开放性**：作为开放协议，MCP 允许任何开发者为其产品创建 MCP 服务器。

### 潜在影响与挑战

MCP 有望成为 AI 领域的"HTTP 协议"，推动 LLM 应用的标准化和去中心化。随着生态系统的成熟，AI 系统在不同工具及数据集之间移动时，都能维持上下文，以更永续的架构来取代当前零散的整合方式。

## 结语

MCP 代表了 AI 集成领域的重大突破，为 Claude 等大型语言模型赋予了与外部世界交互的能力。它不仅简化了开发过程，还提高了安全性和可扩展性，使 AI 能够更好地融入各种工作流程和应用场景。

随着更多开发者和企业采用 MCP，我们可以期待看到更多创新的 AI 应用和服务出现，进一步推动 AI 技术的发展和普及。MCP 不仅是一个技术协议，更是 AI 领域向更开放、更连接未来迈进的重要一步。
