---
name: Git MCP 服务器
digest: 用于 git 操作的 Claude MCP 服务器
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/git
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - git
icon: https://cdn.simpleicons.org/git
createTime: 2024-12-01T00:00:00Z
---

一个用于 Git 仓库交互和自动化的模型上下文协议服务器。该服务器提供工具，通过大语言模型来读取、搜索和操作 Git 仓库。

请注意，mcp-server-git 目前处于早期开发阶段。随着我们继续开发和改进服务器，其功能和可用工具可能会发生变化和扩展。

### 工具

1. `git_status`

   - 显示工作树状态
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
   - 返回: 工作目录的当前状态文本输出

2. `git_diff_unstaged`

   - 显示工作目录中尚未暂存的更改
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
   - 返回: 未暂存更改的差异输出

3. `git_diff_staged`

   - 显示已暂存待提交的更改
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
   - 返回: 已暂存更改的差异输出

4. `git_commit`

   - 记录对仓库的更改
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
     - `message` (字符串): 提交信息
   - 返回: 带有新提交哈希的确认信息

5. `git_add`

   - 将文件内容添加到暂存区
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
     - `files` (字符串[]): 要暂存的文件路径数组
   - 返回: 已暂存文件的确认信息

6. `git_reset`

   - 取消所有已暂存的更改
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
   - 返回: 重置操作的确认信息

7. `git_log`

   - 显示提交日志
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
     - `max_count` (数字, 可选): 显示的最大提交数量(默认: 10)
   - 返回: 包含哈希、作者、日期和消息的提交条目数组

8. `git_create_branch`
   - 创建新分支
   - 输入:
     - `repo_path` (字符串): Git 仓库路径
     - `branch_name` (字符串): 新分支的名称
     - `start_point` (字符串, 可选): 新分支的起始点
   - 返回: 分支创建的确认信息

## 安装

### 使用 uv (推荐)

使用 [`uv`](https://docs.astral.sh/uv/) 时不需要特定安装。我们将使用 [`uvx`](https://docs.astral.sh/uv/guides/tools/) 直接运行 _mcp-server-git_。

### 使用 PIP

你也可以通过 pip 安装 `mcp-server-git`:

```
pip install mcp-server-git
```

安装后，你可以通过以下命令运行它:

```
python -m mcp_server_git
```

## 配置

### 使用 Claude Desktop

将以下内容添加到你的 `claude_desktop_config.json`:

<details>
<summary>使用 uvx</summary>

```json
"mcpServers": {
  "git": {
    "command": "uvx",
    "args": ["mcp-server-git", "--repository", "path/to/git/repo"]
  }
}
```

</details>

<details>
<summary>使用 pip 安装</summary>

```json
"mcpServers": {
  "git": {
    "command": "python",
    "args": ["-m", "mcp_server_git", "--repository", "path/to/git/repo"]
  }
}
```

</details>

### 使用 Zed

将以下内容添加到你的 Zed settings.json:

<details>
<summary>使用 uvx</summary>

```json
"context_servers": [
  "mcp-server-git": {
    "command": {
      "path": "uvx",
      "args": ["mcp-server-git"]
    }
  }
],
```

</details>

<details>
<summary>使用 pip 安装</summary>

```json
"context_servers": {
  "mcp-server-git": {
    "command": {
      "path": "python",
      "args": ["-m", "mcp_server_git"]
    }
  }
},
```

</details>

## Debugging

你可以使用 MCP 检查器来调试服务器。对于 uvx 安装:

```
npx @modelcontextprotocol/inspector uvx mcp-server-git
```

或者如果你在特定目录中安装了包或正在开发:

```
cd path/to/servers/src/git
npx @modelcontextprotocol/inspector uv run mcp-server-git
```

运行 `tail -n 20 -f ~/Library/Logs/Claude/mcp*.log` 将显示服务器的日志，并可能帮助你调试任何问题。

## 开发

如果你正在进行本地开发，有两种方法可以测试你的更改:

1. 运行 MCP 检查器来测试你的更改。请参阅[调试](#debugging)以获取运行说明。

2. 使用 Claude 桌面应用程序测试。将以下内容添加到你的 `claude_desktop_config.json`:

```json
"git": {
  "command": "uv",
  "args": [
    "--directory",
    "/<path to mcp-servers>/mcp-servers/src/git",
    "run",
    "mcp-server-git"
  ]
}
```

## 许可证

此 MCP 服务器根据 MIT 许可证授权。这意味着你可以自由使用、修改和分发软件，但需遵守 MIT 许可证的条款和条件。有关更多详细信息，请参阅项目仓库中的 LICENSE 文件。
