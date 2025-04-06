---
name: 文件系统 MCP 服务器
digest: 用于文件系统操作的 Claude MCP 服务器
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - filesystem
createTime: 2024-12-01T00:00:00Z
---

实现模型上下文协议 Claude MCP 的 Node.js 服务器，用于文件系统操作。

## 功能特性

- 读写文件
- 创建/列出/删除目录
- 移动文件/目录
- 搜索文件
- 获取文件元数据

**注意**: 服务器只允许在通过 `args` 指定的目录内进行操作。

## API

### 资源

- `file://system`: 文件系统操作接口

### 工具

- **read_file**

  - 读取文件的完整内容
  - 输入: `path` (字符串)
  - 使用 UTF-8 编码读取完整文件内容

- **read_multiple_files**

  - 同时读取多个文件
  - 输入: `paths` (字符串数组)
  - 单个文件读取失败不会影响整个操作

- **write_file**

  - 创建新文件或覆盖现有文件(使用时需谨慎)
  - 输入:
    - `path` (字符串): 文件位置
    - `content` (字符串): 文件内容

- **create_directory**

  - 创建新目录或确保目录存在
  - 输入: `path` (字符串)
  - 如果需要会创建父目录
  - 如果目录已存在则静默成功

- **list_directory**

  - 列出目录内容,带有 [FILE] 或 [DIR] 前缀
  - 输入: `path` (字符串)

- **move_file**

  - 移动或重命名文件和目录
  - 输入:
    - `source` (字符串)
    - `destination` (字符串)
  - 如果目标已存在则失败

- **search_files**

  - 递归搜索文件/目录
  - 输入:
    - `path` (字符串): 起始目录
    - `pattern` (字符串): 搜索模式
  - 不区分大小写匹配
  - 返回匹配项的完整路径

- **get_file_info**

  - 获取详细的文件/目录元数据
  - 输入: `path` (字符串)
  - 返回:
    - 大小
    - 创建时间
    - 修改时间
    - 访问时间
    - 类型(文件/目录)
    - 权限

- **list_allowed_directories**

  - 列出服务器允许访问的所有目录
  - 无需输入
  - 返回:
    - 此服务器可以读写的目录

## 在 Claude Desktop 中使用

将以下内容添加到你的 `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/path/to/other/allowed/dir"
      ]
    }
  }
}
```

## License 许可证

此 MCP 服务器根据 MIT 许可证授权。这意味着你可以自由使用、修改和分发软件，但需遵守 MIT 许可证的条款和条件。更多详情请参见项目仓库中的 LICENSE 文件。
