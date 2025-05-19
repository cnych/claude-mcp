---
name: Apify 测试版 MCP 客户端
digest: 该客户端将 AI 智能体接入 Apify 生态系统中 5000+个网页抓取与自动化执行器（Actors），支持从网站、社交媒体、搜索引擎及地图中提取数据。
author: Apify
homepage: https://apify.com/jiri.spilka/tester-mcp-client
docs: https://mcp.apify.com
icon: http://apify.com/ext/apify-symbol-512px.svg
windows: true
mac: true
linux: true
tags:
  - 网页抓取
  - Apify 执行器
  - 系统集成
createTime: 2025-05-13
---

## 🚀 核心功能

- 🔌 通过服务器推送事件(SSE)连接 MCP 服务器
- 💬 提供类聊天界面展示工具调用与结果
- 🇦 连接[Apify MCP 服务器](https://apify.com/apify/actors-mcp-server)以调用多个 Apify 执行器
- 💥 根据上下文动态选用工具（需服务器支持）
- 🔓 采用授权头与 API 密钥保障安全连接
- 🪟 开源项目，可审查代码或提交改进

## 🎯 功能场景

连接[执行器-MCP-服务器](https://apify.com/apify/actors-mcp-server)后，您可通过交互式聊天界面：

- 查询"最受欢迎的社交媒体抓取执行器"
- 获取"Instagram 爬虫最佳使用方案"
- 咨询"提取 LinkedIn 数据该选用哪个执行器"
- 了解"如何抓取谷歌搜索结果"

![客户端界面截图](https://raw.githubusercontent.com/apify/tester-mcp-client/refs/heads/main/docs/chat-ui.png)

## 📖 工作原理

客户端通过 SSE 协议连接 MCP 服务器并实现以下功能：

- 通过`/sse`端点建立 SSE 连接
- 通过`POST /message`发送用户查询
- 实时接收流式响应（通过`GET /sse`），内容可能包含：
  - 大语言模型输出
  - **工具调用**模块
- 根据响应协调工具调用并展示对话流

## ⚙️ 使用方式

### 标准模式（Apify 平台）

在 Apify 平台运行客户端并连接任意支持 SSE 的 MCP 服务器。通过 UI 或 API 配置以下参数：

- MCP 服务器 URL
- 系统提示词
- API 密钥

运行后日志将生成动态访问链接（每次运行不同）：

```shell
INFO  请访问 https://......runs.apify.net 与MCP服务器交互
```

### 待机模式（Apify 平台）

开发中 🚧

## 💰 计费方案

客户端完全免费，仅需支付：

- LLM 服务商使用费
- Apify 平台资源消耗费

采用[按事件计费](https://docs.apify.com/sdk/js/docs/guides/pay-per-event)模式：

- 执行器启动费（按 128MB 内存单元计费）
- 运行时长费（每 5 分钟/128MB 单元计费）
- 查询应答费（根据模型计费，自带 API 密钥可免除）

使用自有 LLM 密钥时，128MB 内存运行 1 小时约$0.06。  
Apify 免费版（无需信用卡 💳）每月可运行 80 小时——充分满足测试需求！

## 📖 技术架构

```plaintext
浏览器 ← (SSE) → 测试客户端 ← (SSE) → MCP服务器
```

该链路将定制化桥接逻辑封装在客户端内，保持 MCP 服务器纯净。

1. 访问`https://tester-mcp-client.apify.actor?token=API密钥`（本地开发则用 http://localhost:3000）
2. 从`public/`目录加载`index.html`和`client.js`
3. 浏览器通过`GET /sse`建立 SSE 流
4. 用户查询通过`POST /message`提交
5. 查询处理流程：
   - 调用大语言模型
   - 按需调用工具
6. 通过`sseEmit(role, content)`返回分块结果

### 本地开发

客户端已开源至[GitHub](https://github.com/apify/rag-web-browser)，可按需修改：

```bash
git clone https://github.com/apify/tester-mcp-client.git
cd tester-mcp-client
npm install
```

参照`.env.example`创建配置文件：

```plaintext
APIFY_TOKEN=您的令牌
LLM_PROVIDER_API_KEY=您的密钥
```

运行开发服务器：

```bash
npm start
```

访问[http://localhost:3000](http://localhost:3000)即可开始测试。

**祝您与 Apify 执行器畅快对话！**

## ⓘ 注意事项

当前版本暂不支持：

- Prompts 和 Resource 等 MCP 高级功能
- 对话历史存储（刷新页面将清空记录）

## 参考资源

- [模型上下文协议](https://modelcontextprotocol.org/)
- [Apify 执行器 MCP 服务器](https://apify.com/apify/actors-mcp-server)
- [按事件计费说明](https://docs.apify.com/sdk/js/docs/guides/pay-per-event)
- [AI 智能体详解](https://blog.apify.com/what-are-ai-agents/)
- [MCP 协议核心价值](https://blog.apify.com/what-is-model-context-protocol/)
