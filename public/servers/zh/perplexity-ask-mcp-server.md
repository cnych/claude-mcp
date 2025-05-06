---
name: Perplexity Ask MCP Server
digest: 一个集成了Sonar API的MCP服务器，为Claude提供实时全网研究能力，使其能即时获取最新在线信息，从而生成全面准确的响应。
author: ppl-ai
homepage: https://github.com/ppl-ai/modelcontextprotocol
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - 网络
  - docker
icon: https://avatars.githubusercontent.com/u/110299016?v=4
createTime: 2025-03-11
featured: true
---

一个集成了 Sonar API 的 MCP 服务器实现，为 Claude 提供无与伦比的实时全网研究能力。

![演示](/images/perplexity_demo_screenshot.png)

## 工具

- **perplexity_ask**
  - 与 Sonar API 进行对话，执行实时网络搜索。
  - **输入参数:**
    - `messages` (数组): 对话消息数组。
      - 每条消息必须包含:
        - `role` (字符串): 消息角色（如`system`、`user`、`assistant`）。
        - `content` (字符串): 消息内容。

## 配置

### 第一步：

克隆本仓库：

```bash
git clone git@github.com:ppl-ai/modelcontextprotocol.git
```

进入`perplexity-ask`目录并安装依赖：

```bash
cd modelcontextprotocol/perplexity-ask && npm install
```

### 第二步：获取 Sonar API 密钥

1. 注册[Sonar API 账号](https://docs.perplexity.ai/guides/getting-started)
2. 按照账户设置指引，在开发者面板生成 API 密钥
3. 将 API 密钥设为环境变量`PERPLEXITY_API_KEY`

### 第三步：配置 Claude 桌面端

1. 下载 Claude 桌面端[点击此处](https://claude.ai/download)

2. 在`claude_desktop_config.json`中添加：

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "您的API密钥"
      }
    }
  }
}
```

### NPX 方式

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "server-perplexity-ask"],
      "env": {
        "PERPLEXITY_API_KEY": "您的API密钥"
      }
    }
  }
}
```

配置文件路径：

```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 第四步：构建 Docker 镜像

执行构建：

```bash
docker build -t mcp/perplexity-ask:latest -f Dockerfile .
```

### 第五步：测试

确保 Claude 桌面端能识别工具（查看锤子图标）：

![Claude工具视觉指示器](/images/perplexity-visual-indicator-mcp-tools.png)

点击锤子图标后应看到可用工具：

![可用集成](/images/perplexity_available_tools.png)

### 第六步：高级参数

当前使用默认搜索参数，可通过修改`index.ts`脚本调整 API 调用参数。详见官方[API 文档](https://docs.perplexity.ai/api-reference/chat-completions)。

### 故障排除

参考 Claude 官方[调试指南](https://modelcontextprotocol.io/docs/tools/debugging)，或通过api@perplexity.ai联系我们，也可[提交 issue](https://github.com/ppl-ai/api-discussion/issues)。

## 许可证

本 MCP 服务器采用 MIT 许可证。您可以自由使用、修改和分发软件，需遵守 MIT 许可证条款。详情参见项目仓库中的 LICENSE 文件。
