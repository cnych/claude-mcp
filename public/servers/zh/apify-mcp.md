---
name: Apify MCP服务器
digest: 通过模型上下文协议部署并调用Apify执行器，实现网页抓取、数据提取及自动化任务
author: Apify
repository: https://github.com/apify/actors-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - apify
  - 爬虫
  - 自动化
icon: https://avatars.githubusercontent.com/u/24586296?s=48&v=4
createdAt: 2025-05-06T00:00:00Z
---

# Apify 模型上下文协议(MCP)服务器

[![执行器MCP服务器](https://apify.com/actor-badge?actor=apify/actors-mcp-server)](https://apify.com/apify/actors-mcp-server)  
[![smithery认证](https://smithery.ai/badge/@apify/actors-mcp-server)](https://smithery.ai/server/@apify/actors-mcp-server)

为所有[Apify 执行器](https://apify.com/store)实现的 MCP 服务器。通过配置 MCP 服务器，可调用一个或多个 Apify 执行器（总计超过 5000 个）进行交互。

# 🎯 功能概述

MCP 服务器允许 AI 助手将任意[Apify 执行器](https://apify.com/store)作为工具调用，典型场景包括：

- 使用[Facebook 帖子抓取器](https://apify.com/apify/facebook-posts-scraper)采集多页面/个人号的帖子数据
- 通过[谷歌地图邮箱提取器](https://apify.com/lukaskrivka/google-maps-with-contact-details)获取商家联系方式
- 调用[谷歌搜索结果抓取器](https://apify.com/apify/google-search-scraper)采集搜索引擎结果页(SERPs)
- 运用[Instagram 采集器](https://apify.com/apify/instagram-scraper)获取帖子、账号、地点及评论数据
- 使用[RAG 网页浏览器](https://apify.com/apify/web-scraper)检索网页并返回指定数量的 URL 内容

# MCP 客户端

可通过以下客户端与 Apify MCP 服务器交互：

- [Claude 桌面版](https://claude.ai/download)（仅支持 Stdio）
- [Visual Studio Code](https://code.visualstudio.com/)（支持 Stdio 和 SSE）
- [LibreChat](https://www.librechat.ai/)（支持 Stdio/SSE，无认证头）
- [Apify MCP 测试客户端](https://apify.com/jiri.spilka/tester-mcp-client)（支持 SSE 及认证头）
- [模型上下文协议官网客户端列表](https://modelcontextprotocol.io/clients)
- [Glama.ai 更多客户端](https://glama.ai/mcp/clients)

集成 MCP 服务器后，您可以提出诸如：

- "检索并总结近期 AI 代理的发展趋势"
- "找出旧金山评分前十的意大利餐厅"
- "分析巨石强森的 Instagram 账号数据"
- "提供模型上下文协议的带源码使用指南"
- "有哪些可用的 Apify 执行器？"

下图展示 MCP 服务器与 Apify 平台及 AI 客户端的交互流程：

![执行器-MCP服务器](https://raw.githubusercontent.com/apify/actors-mcp-server/refs/heads/master/docs/actors-mcp-server.png)

注：当前仅 MCP 测试客户端支持动态加载执行器，其他客户端暂未支持。更多功能规划详见[路线图](#-2025年3月路线图)。

# 🤖 与 AI 代理的关联

Apify MCP 服务器通过 MCP 协议开放所有执行器，使支持该协议的 AI 代理或框架能调用 Apify 工具集进行数据采集、网页检索等操作。

扩展阅读：

- [AI 代理详解](https://blog.apify.com/what-are-ai-agents/)
- [Apify 精选 AI 代理集](https://apify.com/store/collections/ai_agents)
- [构建 AI 代理指南](https://blog.apify.com/how-to-build-an-ai-agent/)（含发布与盈利教程）

# 🧱 组件模块

## 工具集

### 执行器工具

任何[Apify 平台上的执行器](https://apify.com/store)均可作为工具使用。默认情况下，服务器已预配置下列指定执行器，但可通过提供执行器输入参数进行覆盖配置。

```text
'apify/instagram-scraper'
'apify/rag-web-browser'
'lukaskrivka/google-maps-with-contact-details'
```

MCP 服务器会加载执行器输入模式，并创建与之对应的 MCP 工具。具体可参考[RAG 网页浏览器](https://apify.com/apify/rag-web-browser/input-schema)的输入模式示例。

工具名称必须始终使用执行器全称，例如`apify/rag-web-browser`。MCP 工具的参数即代表该执行器的输入参数。以`apify/rag-web-browser`执行器为例，其参数格式为：

```json
{
  "query": "旧金山餐厅推荐",
  "maxResults": 3
}
```

用户无需手动指定输入参数或调用哪个执行器，这些均由大语言模型自动处理。当工具被调用时，参数会通过大语言模型自动传递给执行器。具体可用参数列表可查阅对应执行器的技术文档。

### 辅助工具

服务器提供以下辅助工具用于发现可用执行器及获取详情：

- `get-actor-details`：获取特定执行器的文档说明、输入模式及详细信息
- `discover-actors`：通过关键词搜索相关执行器并返回详情信息

另提供工具列表管理功能。但需注意，动态增减工具要求 MCP 客户端具备更新工具列表的能力（需支持处理`ToolListChangedNotificationSchema`协议），该功能通常不被支持。

可通过[Apify 测试用 MCP 客户端](https://apify.com/jiri.spilka/tester-mcp-client)执行器体验此功能。启用时需设置`enableActorAutoLoading`参数。

- `add-actor-as-tool`：将指定名称的执行器添加至可用工具列表（不立即执行），后续运行需获得用户确认
- `remove-actor-from-tool`：当不再需要时，从可用工具列表中移除指定执行器

## 提示与资源

当前服务器未提供任何预设资源和提示模板。未来计划将[Apify 数据集](https://docs.apify.com/platform/storage/dataset)和[键值存储](https://docs.apify.com/platform/storage/key-value-store)纳入资源体系。

# ⚙️ 使用方式

Apify MCP 服务器可通过两种方式运行：作为**Apify 平台上的 Actor**运行，或作为**本地服务器**在您的机器上运行。

## 🇦 MCP 服务器 Actor

### 待机网络服务器

该 Actor 以[**待机模式**](https://docs.apify.com/platform/actors/running/standby)运行，内置 HTTP 服务器用于接收和处理请求。

要启动包含默认 Actor 的服务器，请向以下 URL 发送携带[Apify API 令牌](https://console.apify.com/settings/integrations)的 HTTP GET 请求：

```
https://actors-mcp-server.apify.actor?token=<APIFY_TOKEN>
```

您也可以使用自定义 Actor 集合启动 MCP 服务器。为此需要先创建[任务](https://docs.apify.com/platform/actors/running/tasks)，并指定要使用的 Actor 列表。

然后以待机模式运行包含选定 Actor 的任务：

```shell
https://USERNAME--actors-mcp-server-task.apify.actor?token=<APIFY_TOKEN>
```

所有可用 Actor 列表可在[Apify 商店](https://apify.com/store)查看。

#### 💬 通过 SSE 与 MCP 服务器交互

服务器运行后，您可以通过服务器推送事件(SSE)发送消息并接收响应。最简单的方法是使用 Apify 平台上的[Tester MCP Client](https://apify.com/jiri.spilka/tester-mcp-client)。

[Claude 桌面版](https://claude.ai/download)目前不支持 SSE，但可通过 Stdio 传输协议交互（详见[本地主机运行 MCP 服务器](#本地主机上的mcp服务器)）。注意：免费版 Claude 桌面端可能会出现间歇性连接问题。

客户端配置需提供服务器参数：

```json
{
  "mcpServers": {
    "apify": {
      "type": "sse",
      "url": "https://actors-mcp-server.apify.actor/sse",
      "env": {
        "APIFY_TOKEN": "您的apify令牌"
      }
    }
  }
}
```

您也可以使用[clientSse.ts](https://github.com/apify/actor-mcp-server/tree/main/src/examples/clientSse.ts)脚本或通过`curl`命令测试服务器。

1. 发送 GET 请求初始化服务器推送事件(SSE)：

   ```
   curl https://actors-mcp-server.apify.actor/sse?token=<APIFY_TOKEN>
   ```

   服务器将返回用于消息通信的`sessionId`：

   ```shell
   event: endpoint
   data: /message?sessionId=a1b
   ```

2. 使用`sessionId`发送 POST 请求：

   ```shell
   curl -X POST "https://actors-mcp-server.apify.actor/message?token=<APIFY_TOKEN>&session_id=a1b" -H "Content-Type: application/json" -d '{
     "jsonrpc": "2.0",
     "id": 1,
     "method": "tools/call",
     "params": {
       "arguments": { "searchStringsArray": ["旧金山餐厅"], "maxCrawledPlacesPerSearch": 3 },
       "name": "lukaskrivka/google-maps-with-contact-details"
     }
   }'
   ```

   MCP 服务器将启动`lukaskrivka/google-maps-with-contact-details` Actor 并传入参数。对于该 POST 请求，服务器将响应：

   ```text
   已接收
   ```

3. 获取响应。服务器将通过 SSE 流式返回 JSON 格式的执行结果：

   ```text
   event: message
   data: {"result":{"content":[{"type":"text","text":"{\"searchString\":\"旧金山餐厅\",\"rank\":1,\"title\":\"Gary Danko\",\"description\":\"名厨Gary Danko提供的固定价格美式料理菜单...\",\"price\":\"$100+\"...}}]}}
   ```

## 本地主机上的 MCP 服务器

您可以通过 Claude 桌面版或任意[MCP 客户端](https://modelcontextprotocol.io/clients)配置运行 Apify MCP 服务器。也可以使用[Smithery](https://smithery.ai/server/@apify/actors-mcp-server)自动安装服务器。

### 环境要求

- MacOS 或 Windows 系统
- 已安装最新版 Claude 桌面版（或其他 MCP 客户端）
- [Node.js](https://nodejs.org/en)（v18 或更高版本）
- [Apify API 密钥](https://docs.apify.com/platform/integrations/api#api-token)（`APIFY_TOKEN`）

确保已正确安装`node`和`npx`：

```bash
node -v
npx -v
```

若未安装，请参考指南：[Node.js 与 npm 安装说明](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### Claude 桌面版配置

配置 Claude 桌面版连接 MCP 服务器的步骤如下，详细指南请参阅[Claude 桌面版用户手册](https://modelcontextprotocol.io/quickstart/user)

1. 下载桌面版 Claude
   - 支持 Windows 和 macOS 系统
   - Linux 用户可使用[非官方构建脚本](https://github.com/aaddrick/claude-desktop-debian)创建 Debian 安装包
2. 打开 Claude 应用，从左上角菜单栏启用**开发者模式**
3. 进入**设置**→**开发者选项**，点击**编辑配置**按钮
4. 修改配置文件：

   - macOS：`~/Library/Application\ Support/Claude/claude_desktop_config.json`
   - Windows：`%APPDATA%/Claude/claude_desktop_config.json`
   - Linux：`~/.config/Claude/claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "actors-mcp-server": {
         "command": "npx",
         "args": ["-y", "@apify/actors-mcp-server"],
         "env": {
           "APIFY_TOKEN": "您的Apify密钥"
         }
       }
     }
   }
   ```

   或指定特定 Apify 执行器：

   ```json
   {
     "mcpServers": {
       "actors-mcp-server": {
         "command": "npx",
         "args": [
           "-y",
           "@apify/actors-mcp-server",
           "--actors",
           "lukaskrivka/google-maps-with-contact-details,apify/instagram-scraper"
         ],
         "env": {
           "APIFY_TOKEN": "您的Apify密钥"
         }
       }
     }
   }
   ```

5. 重启 Claude 应用

   - 完全退出程序（确保非最小化状态）
   - 重新启动后，观察 🔌 图标确认服务器连接状态

6. 在聊天窗口输入："我能使用哪些 Apify 执行器？"

   ![Claude桌面版与执行器MCP服务器](https://raw.githubusercontent.com/apify/actors-mcp-server/refs/heads/master/docs/claude-desktop.png)

7. 使用示例

   可要求 Claude 执行以下任务：

   ```text
   查找并分析最近关于大语言模型的研究论文
   找出旧金山排名前10的意大利餐厅
   查找并分析巨石强森的Instagram资料
   ```

#### VS Code

一键安装请点击下方按钮：

[![在VS Code中通过NPX安装](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=actors-mcp-server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40apify%2Factors-mcp-server%22%5D%2C%22env%22%3A%7B%22APIFY_TOKEN%22%3A%22%24%7Binput%3Aapify_token%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apify_token%22%2C%22description%22%3A%22Apify+API+Token%22%2C%22password%22%3Atrue%7D%5D) [![在VS Code Insiders中通过NPX安装](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=actors-mcp-server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40apify%2Factors-mcp-server%22%5D%2C%22env%22%3A%7B%22APIFY_TOKEN%22%3A%22%24%7Binput%3Aapify_token%7D%22%7D%7D&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22apify_token%22%2C%22description%22%3A%22Apify+API+Token%22%2C%22password%22%3Atrue%7D%5D&quality=insiders)

##### 手动安装

您可以在 VS Code 中手动安装 Apify MCP 服务器。首先点击本节顶部的任意安装按钮进行一键安装。

或者，将以下 JSON 代码块添加到 VS Code 的用户设置(JSON)文件中。您可以通过按下`Ctrl + Shift + P`并输入`Preferences: Open User Settings (JSON)`来实现。

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "apify_token",
        "description": "Apify API Token",
        "password": true
      }
    ],
    "servers": {
      "actors-mcp-server": {
        "command": "npx",
        "args": ["-y", "@apify/actors-mcp-server"],
        "env": {
          "APIFY_TOKEN": "${input:apify_token}"
        }
      }
    }
  }
}
```

您也可以将其添加到工作区的`.vscode/mcp.json`文件中——只需省略顶层的`mcp {}`键。这样便于与他人共享配置。

如需指定加载哪些 Actor，可添加`--actors`参数：

```json
{
  "servers": {
    "actors-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@apify/actors-mcp-server",
        "--actors",
        "lukaskrivka/google-maps-with-contact-details,apify/instagram-scraper"
      ],
      "env": {
        "APIFY_TOKEN": "${input:apify_token}"
      }
    }
  }
}
```

#### 使用@modelcontextprotocol/inspector 调试 NPM 包@apify/actors-mcp-server

调试服务器时请使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)工具：

```shell
export APIFY_TOKEN=你的apify令牌
npx @modelcontextprotocol/inspector npx -y @apify/actors-mcp-server
```

### 通过 Smithery 安装

如需通过[Smithery](https://smithery.ai/server/@apify/actors-mcp-server)为 Claude Desktop 自动安装 Apify Actors MCP Server：

```bash
npx -y @smithery/cli install @apify/actors-mcp-server --client claude
```

#### 标准输入输出客户端

创建包含以下内容的`.env`环境文件：

```text
APIFY_TOKEN=你的apify令牌
```

在`examples`目录中可找到通过标准输入输出(stdio)与服务器交互的示例客户端：

- [`clientStdio.ts`](https://github.com/apify/actor-mcp-server/tree/main/src/examples/clientStdio.ts)
  该客户端脚本会启动带两个指定 Actor 的 MCP 服务器
  随后调用`apify/rag-web-browser`工具执行查询并打印结果
  演示了如何连接 MCP 服务器、列出可用工具及使用 stdio 传输调用特定工具
  ```bash
  node dist/examples/clientStdio.js
  ```

# 👷 开发指南

## 环境要求

- [Node.js](https://nodejs.org/en) (v18 或更高版本)
- Python 3.9 或更高版本

创建包含以下内容的`.env`环境文件：

```text
APIFY_TOKEN=你的apify令牌
```

构建 actor-mcp-server 包：

```bash
npm run build
```

## 本地客户端(SSE)

测试 SSE 传输协议时可以使用`examples/clientSse.ts`脚本：
当前 Node.js 客户端暂不支持通过自定义标头连接远程服务器
需在脚本中修改为本地服务器 URL

```bash
node dist/examples/clientSse.js
```

## 调试说明

由于 MCP 服务器通过标准输入输出(stdio)运行，调试较为困难
推荐使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)获得最佳调试体验

可通过[`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)运行以下命令启动调试器：

```bash
export APIFY_TOKEN=你的apify令牌
npx @modelcontextprotocol/inspector node ./dist/stdio.js
```

启动后，检查器将显示可在浏览器中访问的调试 URL

## ⓘ 限制说明与反馈机制

为确保与多数 MCP 客户端兼容并符合[JSON Schema](https://json-schema.org/)规范，我们对执行者输入模式进行了标准化处理：

- **描述字段**截断为 500 字符（由`MAX_DESCRIPTION_LENGTH`定义）
- **枚举字段**所有元素总长度不超过 200 字符（由`ACTOR_ENUM_MAX_LENGTH`定义）
- **必填字段**在描述中明确标注"REQUIRED"前缀，适配不完善支持 JSON 模式的框架
- **嵌套属性**针对代理配置、请求列表源等特殊场景构建，确保输入结构正确性
- **数组类型推断**当模式未明确定义时，按优先级推断：显式条目类型 > 预填充类型 > 默认值类型 > 编辑器类型
- **枚举值与示例**直接写入属性描述，确保在不完全支持 JSON 模式的客户端中可见

每个执行者内存限制为 4GB。免费用户总内存上限 8GB，其中需预留 128MB 用于运行`Actors-MCP-Server`。

如需其他功能或提交反馈，请通过[提交工单](https://console.apify.com/actors/1lSvMAaRcadrM1Vgv/issues)告知我们。

# 🚀 2025 年 3 月路线图

- 新增 Apify 数据集和键值存储作为资源类型
- 集成执行者日志、运行记录等调试工具

# 🐛 故障排查指南

- 执行`node -v`确认已安装 Node.js 环境
- 检查是否设置`APIFY_TOKEN`环境变量
- 始终通过`@apify/actors-mcp-server@latest`使用最新版 MCP 服务

# 📚 扩展阅读

- [模型上下文协议规范](https://modelcontextprotocol.org/)
- [AI 代理深度解析](https://blog.apify.com/what-are-ai-agents/)
- [MCP 协议的核心价值](https://blog.apify.com/what-is-model-context-protocol/)
- [MCP 客户端测试工具](https://apify.com/jiri.spilka/tester-mcp-client)
- [AI 代理实战：查询 Apify 数据集](https://blog.apify.com/ai-agent-workflow/)
- [MCP 客户端开发指南](https://github.com/cyanheads/model-context-protocol-resources/blob/main/guides/mcp-client-development-guide.md)
- [Apify 平台 AI 代理构建与变现指南](https://blog.apify.com/how-to-build-an-ai-agent/)
