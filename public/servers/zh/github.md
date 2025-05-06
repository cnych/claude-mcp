---
name: GitHub MCP 服务器
digest: 用于 GitHub API 的 Claude MCP 服务器
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/github
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - github
  - git
icon: https://cdn.simpleicons.org/github
createTime: 2024-12-06T00:00:00Z
---

用于 GitHub API 的 MCP 服务器，支持文件操作、仓库管理、搜索功能等。

### 特性

- **自动创建分支**: 在创建/更新文件或推送更改时，如果分支不存在则自动创建
- **全面的错误处理**: 对常见问题提供清晰的错误信息
- **保留 Git 历史**: 操作保持适当的 Git 历史记录，不使用强制推送
- **批量操作**: 支持单文件和多文件操作
- **高级搜索**: 支持搜索代码、问题/PR 和用户

## 工具

1. `create_or_update_file`

   - 在仓库中创建或更新单个文件
   - 输入:
     - `owner` (字符串): 仓库所有者(用户名或组织)
     - `repo` (字符串): 仓库名称
     - `path` (字符串): 创建/更新文件的路径
     - `content` (字符串): 文件内容
     - `message` (字符串): 提交信息
     - `branch` (字符串): 创建/更新文件的分支
     - `sha` (可选字符串): 被替换文件的 SHA (用于更新)
   - 返回: 文件内容和提交详情

2. `push_files`

   - 在单次提交中推送多个文件
   - 输入:
     - `owner` (字符串): 仓库所有者
     - `repo` (字符串): 仓库名称
     - `branch` (字符串): 推送的目标分支
     - `files` (数组): 要推送的文件，每个包含 `path` 和 `content`
     - `message` (字符串): 提交信息
   - 返回: 更新后的分支引用

3. `search_repositories`

   - 搜索 GitHub 仓库
   - 输入:
     - `query` (字符串): 搜索查询
     - `page` (可选数字): 分页页码
     - `perPage` (可选数字): 每页结果数量(最大 100)
   - 返回: 仓库搜索结果

4. `create_repository`

   - 创建新的 GitHub 仓库
   - 输入:
     - `name` (字符串): 仓库名称
     - `description` (可选字符串): 仓库描述
     - `private` (可选布尔值): 是否为私有仓库
     - `autoInit` (可选布尔值): 是否使用 README 初始化
   - 返回: 创建的仓库详情

5. `get_file_contents`

   - 获取文件或目录的内容
   - 输入:
     - `owner` (字符串): 仓库所有者
     - `repo` (字符串): 仓库名称
     - `path` (字符串): 文件/目录路径
     - `branch` (可选字符串): 获取内容的分支
   - 返回: 文件/目录内容

6. `create_issue`

   - 创建新问题
   - 输入:
     - `owner` (字符串): 仓库所有者
     - `repo` (字符串): 仓库名称
     - `title` (字符串): 问题标题
     - `body` (可选字符串): 问题描述
     - `assignees` (可选字符串[]): 要分配的用户名
     - `labels` (可选字符串[]): 要添加的标签
     - `milestone` (可选数字): 里程碑编号
   - 返回: 创建的问题详情

7. `create_pull_request`

   - 创建新的拉取请求
   - 输入:
     - `owner` (字符串): 仓库所有者
     - `repo` (字符串): 仓库名称
     - `title` (字符串): PR 标题
     - `body` (可选字符串): PR 描述
     - `head` (字符串): 包含更改的分支
     - `base` (字符串): 要合并到的分支
     - `draft` (可选布尔值): 是否创建为草稿 PR
     - `maintainer_can_modify` (可选布尔值): 是否允许维护者编辑
   - 返回: 创建的拉取请求详情

8. `fork_repository`

   - 复刻仓库
   - 输入:
     - `owner` (字符串): 仓库所有者
     - `repo` (字符串): 仓库名称
     - `organization` (可选字符串): 复刻到的组织
   - 返回: 复刻的仓库详情

9. `create_branch`

   - 创建新分支
   - 输入:
     - `owner` (字符串): 仓库所有者
     - `repo` (字符串): 仓库名称
     - `branch` (字符串): 新分支名称
     - `from_branch` (可选字符串): 源分支(默认为仓库默认分支)
   - 返回: 创建的分支引用

10. `list_issues`

    - 列出和筛选仓库问题
    - 输入:
      - `owner` (字符串): 仓库所有者
      - `repo` (字符串): 仓库名称
      - `state` (可选字符串): 按状态筛选('open', 'closed', 'all')
      - `labels` (可选字符串[]): 按标签筛选
      - `sort` (可选字符串): 排序方式('created', 'updated', 'comments')
      - `direction` (可选字符串): 排序方向('asc', 'desc')
      - `since` (可选字符串): 按日期筛选(ISO 8601 时间戳)
      - `page` (可选数字): 页码
      - `per_page` (可选数字): 每页结果数
    - 返回: 问题详情数组

11. `update_issue`

    - 更新现有问题
    - 输入:
      - `owner` (字符串): 仓库所有者
      - `repo` (字符串): 仓库名称
      - `issue_number` (数字): 要更新的问题编号
      - `title` (可选字符串): 新标题
      - `body` (可选字符串): 新描述
      - `state` (可选字符串): 新状态('open' 或 'closed')
      - `labels` (可选字符串[]): 新标签
      - `assignees` (可选字符串[]): 新受理人
      - `milestone` (可选数字): 新里程碑编号
    - 返回: 更新后的问题详情

12. `add_issue_comment`

    - 为问题添加评论
    - 输入:
      - `owner` (字符串): 仓库所有者
      - `repo` (字符串): 仓库名称
      - `issue_number` (数字): 要评论的问题编号
      - `body` (字符串): 评论文本
    - 返回: 创建的评论详情

13. `search_code`

    - 在 GitHub 仓库中搜索代码
    - 输入:
      - `q` (字符串): 使用 GitHub 代码搜索语法的搜索查询
      - `sort` (可选字符串): 排序字段(仅'indexed')
      - `order` (可选字符串): 排序顺序('asc' 或 'desc')
      - `per_page` (可选数字): 每页结果数(最大 100)
      - `page` (可选数字): 页码
    - 返回: 带仓库上下文的代码搜索结果

14. `search_issues`

    - 搜索问题和拉取请求
    - 输入:
      - `q` (字符串): 使用 GitHub 问题搜索语法的搜索查询
      - `sort` (可选字符串): 排序字段(comments, reactions, created 等)
      - `order` (可选字符串): 排序顺序('asc' 或 'desc')
      - `per_page` (可选数字): 每页结果数(最大 100)
      - `page` (可选数字): 页码
    - 返回: 问题和拉取请求搜索结果

15. `search_users`

    - 搜索 GitHub 用户
    - 输入:
      - `q` (字符串): 使用 GitHub 用户搜索语法的搜索查询
      - `sort` (可选字符串): 排序字段(followers, repositories, joined)
      - `order` (可选字符串): 排序顺序('asc' 或 'desc')
      - `per_page` (可选数字): 每页结果数(最大 100)
      - `page` (可选数字): 页码
    - 返回: 用户搜索结果

16. `list_commits`

- 获取仓库分支的提交记录
- 输入:
  - `owner` (字符串): 仓库所有者
  - `repo` (字符串): 仓库名称
  - `page` (可选字符串): 页码
  - `per_page` (可选字符串): 每页记录数
  - `sha` (可选字符串): 分支名称
- 返回: 提交列表

## 搜索查询语法

### 代码搜索

- `language:javascript`: 按编程语言搜索
- `repo:owner/name`: 在特定仓库中搜索
- `path:app/src`: 在特定路径中搜索
- `extension:js`: 按文件扩展名搜索
- 示例: `q: "import express" language:typescript path:src/`

### 问题搜索

- `is:issue` 或 `is:pr`: 按类型筛选
- `is:open` 或 `is:closed`: 按状态筛选
- `label:bug`: 按标签搜索
- `author:username`: 按作者搜索
- 示例: `q: "memory leak" is:issue is:open label:bug`

### 用户搜索

- `type:user` 或 `type:org`: 按账户类型筛选
- `followers:>1000`: 按关注者数筛选
- `location:London`: 按位置搜索
- 示例: `q: "fullstack developer" location:London followers:>100`

有关详细的搜索语法，请参阅 [GitHub 的搜索文档](https://docs.github.com/en/search-github/searching-on-github)。

### 个人访问令牌

- 转到 [个人访问令牌](https://github.com/settings/tokens) (在 GitHub 设置 > 开发者设置中)
- 选择此令牌可以访问的仓库(公开、全部或选择)
- 创建一个具有 `repo` 作用域的令牌("完全控制私有仓库")
  - 或者，如果只使用公共仓库，仅选择 `public_repo` 作用域
- 复制生成的令牌

### 使用 Claude Desktop

要使用此服务器与 Claude Desktop，请将以下内容添加到 `claude_desktop_config.json` 中：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## 许可证

此 MCP 服务器基于 MIT 许可证发布。这意味着您可以自由使用、修改和分发软件，但需遵守 MIT 许可证的条款和条件。更多详情请参阅项目仓库中的 LICENSE 文件。
