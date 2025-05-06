---
name: MarkItDown MCP  
digest: MarkItDown-MCP 是一款将文件和办公文档转换为Markdown的Python工具  
author: microsoft  
homepage: https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp  
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - markdown
  - python
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4  
createTime: 2025-04-21  
featured: true  
---

`markitdown-mcp`包提供了一个轻量级的STDIO和SSE MCP服务器，用于调用MarkItDown转换功能。

该工具提供`convert_to_markdown(uri)`方法，其中uri可以是任意`http:`、`https:`、`file:`或`data:`协议的URI。

## 安装

使用pip安装该包：

```bash
pip install markitdown-mcp
```

## 使用说明

以STDIO模式（默认）运行MCP服务器：

```bash
markitdown-mcp
```

以SSE模式运行MCP服务器：

```bash
markitdown-mcp --sse --host 127.0.0.1 --port 3001
```

## Docker运行

使用提供的Dockerfile构建镜像：

```bash
docker build -t markitdown-mcp:latest .
```

运行容器：

```bash
docker run -it --rm markitdown-mcp:latest
```

如需访问本地文件，需挂载本地目录。例如挂载`/home/user/data`目录：

```bash
docker run -it --rm -v /home/user/data:/workdir markitdown-mcp:latest
```

挂载后，容器内可通过`/workdir`路径访问所有文件。例如本地`/home/user/data/example.txt`在容器内对应路径为`/workdir/example.txt`。

## Claude桌面版接入

建议为Claude桌面版使用Docker镜像运行MCP服务。

参照[快速入门指南](https://modelcontextprotocol.io/quickstart/user#for-claude-desktop-users)修改`claude_desktop_config.json`文件，添加以下配置：

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "markitdown-mcp:latest"]
    }
  }
}
```

如需挂载目录，配置示例如下：

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-v",
        "/home/user/data:/workdir",
        "markitdown-mcp:latest"
      ]
    }
  }
}
```

## 调试

可使用`mcpinspector`工具进行调试：

```bash
npx @modelcontextprotocol/inspector
```

通过指定地址（如`http://localhost:5173/`）连接检查器。

STDIO模式配置：
- 选择`STDIO`传输类型
- 输入`markitdown-mcp`作为命令
- 点击`连接`

SSE模式配置：
- 选择`SSE`传输类型
- 输入`http://127.0.0.1:3001/sse`作为URL
- 点击`连接`

操作步骤：
1. 点击`工具`标签页
2. 点击`列出工具`
3. 选择`convert_to_markdown`
4. 对任意有效URI执行工具

## 安全须知

本服务不支持身份验证，运行时将继承执行用户的权限。因此SSE模式建议仅绑定`localhost`（默认配置）。

## 商标声明

本项目可能包含项目、产品或服务的商标标识。微软商标的使用必须遵循[微软商标使用规范](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general)。对本项目的修改若涉及微软商标，不得造成混淆或暗示微软赞助。第三方商标的使用遵循其所属方的政策。