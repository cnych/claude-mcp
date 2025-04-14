---
name: Supabase MCP Server
digest: 将您的Supabase项目与Cursor、Claude、Windsurf等AI工具连接，以增强开发工作流程。此集成可实现无缝数据访问和交互，通过在数据库环境中直接利用AI功能来提升生产力。
author: supabase-community
homepage: https://github.com/supabase-community/supabase-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - 数据库
  - 云服务
icon: https://avatars.githubusercontent.com/u/87650496?v=4
createTime: 2024-12-21
---
> 将您的Supabase项目连接到Cursor、Claude、Windsurf和其他AI助手。

![supabase-mcp-demo](https://static.claudemcp.com/servers/supabase-community/supabase-mcp/supabase-community-supabase-mcp-24a1d57e.jpg)

[模型上下文协议](https://modelcontextprotocol.io/introduction)（MCP）标准化了大型语言模型（LLMs）与Supabase等外部服务的通信方式。它直接将AI助手与您的Supabase项目连接，并允许它们执行诸如管理表、获取配置和查询数据等任务。

## 前提条件

您需要在机器上安装Node.js。可以通过运行以下命令来检查：

```shell
node -v
```

如果尚未安装Node.js，可以从[nodejs.org](https://nodejs.org/)下载。

## 设置

### 1. 个人访问令牌（PAT）

首先，前往您的[Supabase设置](https://supabase.com/dashboard/account/tokens)并创建一个个人访问令牌。为其命名以描述其用途，例如“Cursor MCP Server”。

这将用于验证MCP服务器与您的Supabase账户。请确保复制令牌，因为之后将无法再次查看。

### 2. 配置MCP客户端

接下来，配置您的MCP客户端（如Cursor）以使用此服务器。大多数MCP客户端将配置存储为以下格式的JSON：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

将`<personal-access-token>`替换为步骤1中创建的令牌。或者，您可以省略`--access-token`，而是将环境变量`SUPABASE_ACCESS_TOKEN`设置为您的个人访问令牌。

如果您使用的是Windows，需要在命令前添加`cmd /c`：

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

### 只读模式

如果您希望将Supabase MCP服务器限制为只读查询，请在CLI命令中设置`--read-only`标志：

```shell
npx -y @supabase/mcp-server-supabase@latest --access-token=<personal-access-token> --read-only
```

这会通过以只读Postgres用户身份执行SQL来防止对任何数据库的写操作。

## 工具

以下Supabase工具可供LLM使用：

#### 项目管理

- `list_projects`：列出用户的所有Supabase项目。
- `get_project`：获取项目的详细信息。
- `create_project`：创建一个新的Supabase项目。
- `pause_project`：暂停项目。
- `restore_project`：恢复项目。
- `list_organizations`：列出用户所属的所有组织。
- `get_organization`：获取组织的详细信息。

#### 数据库操作

- `list_tables`：列出指定模式中的所有表。
- `list_extensions`：列出数据库中的所有扩展。
- `list_migrations`：列出数据库中的所有迁移。
- `apply_migration`：将SQL迁移应用到数据库。
- `execute_sql`：在数据库中执行原始SQL。
- `get_logs`：按服务类型获取Supabase项目的日志。

#### 项目配置

- `get_project_url`：获取项目的API URL。
- `get_anon_key`：获取项目的匿名API密钥。

#### 分支（实验性，需要付费计划）

- `create_branch`：创建一个开发分支，包含生产分支的迁移。
- `list_branches`：列出所有开发分支。
- `delete_branch`：删除开发分支。
- `merge_branch`：将开发分支的迁移和边缘函数合并到生产分支。
- `reset_branch`：将开发分支的迁移重置到先前的版本。
- `rebase_branch`：将开发分支基于生产分支重新定位以处理迁移漂移。

#### 开发工具

- `generate_typescript_types`：基于数据库模式生成TypeScript类型。

#### 成本确认

- `get_cost`：获取组织的新项目或分支的成本。
- `confirm_cost`：确认用户对新项目或分支成本的理解。

## 其他MCP服务器

### `@supabase/mcp-server-postgrest`

PostgREST MCP服务器允许您通过REST API将自己的用户连接到您的应用程序。

## 资源

- [**模型上下文协议**](https://modelcontextprotocol.io/introduction)：了解更多关于MCP及其功能的信息。

## 许可证

本项目采用Apache 2.0许可证。