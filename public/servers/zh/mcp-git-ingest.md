---
name: MCP Git Ingest
digest: MCP服务器通过分析GitHub仓库，提取关键文件与结构，清晰呈现项目组织架构与核心组件，简化仓库导航与理解流程。
author: adhikasp
homepage: https://github.com/adhikasp/mcp-git-ingest
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - git
  - 服务器
  - python
icon: https://avatars.githubusercontent.com/u/6151302?v=4
createTime: 2024-12-15
---
一个帮助读取GitHub仓库结构和重要文件的模型上下文协议(MCP)服务器。

灵感来源于[gitingest](https://gitingest.com/)。

## 配置

```json
{
    "mcpServers": {
        "mcp-git-ingest": {
            "command": "uvx",
            "args": ["--from", "git+https://github.com/adhikasp/mcp-git-ingest", "mcp-git-ingest"],
        }
    }
}
```

## 使用方式

通过[mcp-client-cli](https://github.com/adhikasp/mcp-client-cli)使用：

```
$ llm read https://github.com/adhikasp/mcp-git-ingest and determine how the code technically works

我将帮助您理解mcp-git-ingest仓库的技术细节。首先获取目录结构，然后读取重要文件来分析代码工作原理。

工具调用：
  github_directory_structure
  参数：
    repo_url: https://github.com/adhikasp/mcp-git-ingest

现在我将读取重要文件来理解技术实现：

工具调用：
  github_read_important_files
  参数：
    repo_url: https://github.com/adhikasp/mcp-git-ingest
    file_paths: ['README.md', 'src/mcp_git_ingest/main.py', 'pyproject.toml']

以下是代码的技术实现解析：

1. 功能定位：
`mcp-git-ingest`是一个模型上下文协议(MCP)服务器，主要用于：
- `github_directory_structure`：生成仓库目录树状结构
- `github_read_important_files`：读取指定文件内容

2. 技术实现：

a. 依赖项：
- 使用`fastmcp`构建MCP服务器
- 通过`gitpython`操作Git仓库
- 要求Python 3.8+

b. 核心函数：

`clone_repo(repo_url: str) -> str`：
- 基于仓库URL哈希创建确定性临时目录
- 检查是否已克隆仓库
- 处理错误场景和清理工作
- 返回克隆仓库路径

`get_directory_tree(path: str, prefix: str = "") -> str`：
- 递归生成树状目录结构
- 跳过.git目录
- 使用Unicode制表符创建可视化树结构
- 处理条目排序

`github_directory_structure(repo_url: str) -> str`：
- 克隆仓库
- 生成目录树
- 处理完成后清理临时仓库
- 返回树结构或错误信息

`github_read_important_files(repo_url: str, file_paths: List[str]) -> dict[str, str]`：
- 克隆仓库
- 读取指定文件
- 返回文件路径与内容的映射字典
- 处理文件读取错误
- 清理临时仓库

3. 错误处理：
- 使用try-except块处理克隆和文件读取错误
- 通过finally块确保清理临时目录
- 返回描述性错误信息

4. 性能优化：
- 哈希命名的临时目录实现复用
- 克隆前检查现有仓库
- 实现清理机制防止临时文件堆积

5. 独特功能：
- 确定性临时目录创建
- Unicode树状展示
- 带错误处理的灵活文件读取

6. 执行方式：
- 可通过CLI工具`mcp-git-ingest`运行
- 通过`pyproject.toml`配置
- 依赖`fastmcp`实现MCP服务功能

该代码是一个健壮、灵活的GitHub仓库探索工具，特别注重错误处理和代码整洁性。

需要我详细说明任何具体实现细节吗？
```