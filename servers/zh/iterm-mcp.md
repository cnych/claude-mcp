---
name: iterm-mcp
digest: MCP服务器支持远程访问您的iTerm终端会话，实现跨地域安全管控命令行界面。
author: ferrislucas
homepage: https://github.com/ferrislucas/iterm-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 终端
  - 集成
  - 命令行
icon: https://avatars.githubusercontent.com/u/678152?v=4
createTime: 2025-01-09
---
一个提供iTerm会话访问能力的模型上下文协议服务器。

![主界面](https://static.claudemcp.com/servers/ferrislucas/iterm-mcp/ferrislucas-iterm-mcp-633bb741.gif)

### 功能特性

**高效令牌使用**：iterm-mcp使模型仅能查看其关注的输出内容。对于长时间运行的命令，模型通常只需查看最后几行输出。

**自然集成**：您可与模型共享iTerm界面。既能询问屏幕内容，也可将任务委托给模型并观察其逐步执行过程。

**完整终端控制与REPL支持**：模型可启动并交互式操作REPL环境，同时支持发送ctrl-c、ctrl-z等控制字符。

**轻量依赖**：采用最小化依赖设计，支持通过npx直接运行。可便捷集成至Claude Desktop等MCP客户端，开箱即用。

## 安全须知

* 用户需自行确保工具使用安全
* 无内置限制：iterm-mcp不会评估执行命令的安全性
* 模型行为可能存在不可预期性，用户应监控活动并在适当时终止
* 处理多步骤任务时，若模型偏离轨道需及时中断。建议从小型聚焦任务开始，逐步熟悉模型行为模式

### 工具集
- `write_to_terminal` - 向活跃iTerm终端写入内容（通常用于执行命令），返回命令产生的输出行数
- `read_terminal_output` - 从活跃iTerm终端读取指定行数的输出
- `send_control_character` - 向活跃iTerm终端发送控制字符

### 运行要求

* 需运行iTerm2终端
* Node版本18或更高

## 安装指南

在Claude Desktop中添加服务器配置：

macOS系统：`~/Library/Application Support/Claude/claude_desktop_config.json`
Windows系统：`%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "iterm-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "iterm-mcp"
      ]
    }
  }
}
```

### 通过Smithery安装

使用[Smithery](https://smithery.ai/server/iterm-mcp)为Claude Desktop自动安装：

```bash
npx -y @smithery/cli install iterm-mcp --client claude
```

## 开发指南

安装依赖：
```bash
yarn install
```

构建服务器：
```bash
yarn run build
```

开发模式（自动重建）：
```bash
yarn run watch
```

### 调试方法

由于MCP服务器通过stdio通信，调试较为困难。推荐使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)工具包：

```bash
yarn run inspector
yarn debug <command>
```

Inspector将提供浏览器访问调试工具的URL链接。