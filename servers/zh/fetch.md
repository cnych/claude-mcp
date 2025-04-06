---
name: Fetch MCP 服务器
digest: Fetch 提供网页内容获取功能
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/fetch
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - fetch
createTime: 2024-12-01T00:00:00Z
---

一个提供网页内容获取功能的 Model Context Protocol 服务器。该服务器使 LLMs 能够检索和处理网页内容,将 HTML 转换为更易于使用的 markdown 格式。

fetch 工具会截断响应,但通过使用`start_index`参数,你可以指定从哪里开始提取内容。这让模型可以分块读取网页,直到找到所需的信息。

### 可用工具

- `fetch` - 从互联网获取 URL 并提取其内容为 markdown 格式。
  - `url` (字符串,必需): 要获取的 URL
  - `max_length` (整数,可选): 返回的最大字符数(默认:5000)
  - `start_index` (整数,可选): 从此字符索引开始提取内容(默认:0)
  - `raw` (布尔值,可选): 获取原始内容而不转换为 markdown(默认:false)

### 提示词

- **fetch**
  - 获取 URL 并提取其内容为 markdown 格式
  - 参数:
    - `url` (字符串,必需): 要获取的 URL

## 安装

可选:安装 node.js,这将使 fetch 服务器使用更稳健的 HTML 简化器。

### 使用 uv(推荐)

使用[`uv`](https://docs.astral.sh/uv/)时不需要特定安装。我们将使用[`uvx`](https://docs.astral.sh/uv/guides/tools/)直接运行*mcp-server-fetch*。

### 使用 PIP

或者你可以通过 pip 安装 `mcp-server-fetch`:

```
pip install mcp-server-fetch
```

安装后,你可以通过以下命令运行它:

```
python -m mcp_server_fetch
```

## 配置

### 配置为 Claude.app

添加到你的 Claude 设置中:

<details>
<summary>使用 uvx</summary>

```json
"mcpServers": {
  "fetch": {
    "command": "uvx",
    "args": ["mcp-server-fetch"]
  }
}
```

</details>

<details>
<summary>使用 pip 安装</summary>

```json
"mcpServers": {
  "fetch": {
    "command": "python",
    "args": ["-m", "mcp_server_fetch"]
  }
}
```

</details>

### 定制 - robots.txt

默认情况下,服务器会遵守网站的 robots.txt 文件,如果请求来自模型(通过工具),但不是来自用户(通过提示),则不会遵守。可以通过在配置中添加`--ignore-robots-txt`参数来禁用此功能。

### 定制 - User-agent

默认情况下,根据请求来自模型(通过工具)还是用户(通过提示),服务器将使用以下用户代理:

```
ModelContextProtocol/1.0 (Autonomous; +https://github.com/modelcontextprotocol/servers)
```

或者

```
ModelContextProtocol/1.0 (User-Specified; +https://github.com/modelcontextprotocol/servers)
```

可以通过在配置中添加`--user-agent=YourUserAgent`参数来定制。

## 调试

你可以使用 MCP 检查器来调试服务器。对于 uvx 安装:

```
npx @modelcontextprotocol/inspector uvx mcp-server-fetch
```

或者如果你在特定目录中安装了包或在开发中:

```
cd path/to/servers/src/fetch
npx @modelcontextprotocol/inspector uv run mcp-server-fetch
```

## 贡献

我们鼓励贡献来帮助扩展和改进 mcp-server-fetch。无论你是想添加新工具、增强现有功能还是改进文档,你的输入都是宝贵的。

有关其他 MCP 服务器和实现模式的示例,请参见:
[https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

我们欢迎贡献!请随时贡献新想法、错误修复或增强功能,使 mcp-server-fetch 更加强大和有用。

## License

mcp-server-fetch 根据 MIT 许可证授权。这意味着你可以自由使用、修改和分发软件,但需遵守 MIT 许可证的条款和条件。更多详情请参见项目仓库中的 LICENSE 文件。
