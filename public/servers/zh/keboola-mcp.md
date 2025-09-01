---
name: Keboola MCP Server
digest: 将您的 AI 代理、MCP 客户端（**Cursor**、**Claude**、**Windsurf**、**VS Code**...）和其他 AI 助手连接到 Keboola。公开数据、转换、SQL 查询和作业触发器——无需胶水代码。在代理需要时，为它提供正确的数据。
author: Keboola
repository: https://github.com/keboola/keboola-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 数据处理
  - 商业智能
  - ETL
  - 自动化
icon: https://avatars.githubusercontent.com/u/1424387?s=200&v=4
createTime: 2025-08-21
---

> 连接您的 AI 智能体、MCP 客户端（**Cursor**、**Claude**、**Windsurf**、**VS Code** 等）和其他 AI 助手到 Keboola。公开数据、转换、SQL 查询和作业触发器——无需胶水代码。在需要时将正确的数据传递给智能体。

## 概述

Keboola MCP 服务器是您的 Keboola 项目与现代 AI 工具之间的开源桥梁。它将 Keboola 功能（如存储访问、SQL 转换和作业触发器）转换为可供 Claude、Cursor、CrewAI、LangChain、Amazon Q 等调用的工具。

## 🚀 快速开始：远程 MCP 服务器（最简单的方式）

使用 Keboola MCP 服务器最简单的方式是通过我们的**远程 MCP 服务器**。这个托管解决方案无需本地设置、配置或安装。

### 什么是远程 MCP 服务器？

我们的远程服务器托管在每个多租户 Keboola 堆栈上，支持 OAuth 身份验证。您可以从任何支持远程 SSE 连接和 OAuth 身份验证的 AI 助手连接到它。

### 如何连接

1. **获取您的远程服务器 URL**：导航到您的 Keboola 项目设置 → `MCP Server` 选项卡
2. **复制服务器 URL**：它看起来像 `https://mcp.<YOUR_REGION>.keboola.com/sse`
3. **配置您的 AI 助手**：将 URL 粘贴到您的 AI 助手的 MCP 设置中
4. **身份验证**：系统将提示您使用 Keboola 账户进行身份验证并选择您的项目

### 支持的客户端

- **[Cursor](https://cursor.com)**：在您项目的 MCP Server 设置中使用"在 Cursor 中安装"按钮，或点击此按钮
  [![安装 MCP 服务器](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC51cy1lYXN0NC5nY3Aua2Vib29sYS5jb20vc3NlIn0%3D)
- **[Claude Desktop](https://claude.ai)**：通过设置 → 集成添加集成
- **[Windsurf](https://windsurf.ai)**：使用远程服务器 URL 进行配置
- **[Make](https://make.com)**：使用远程服务器 URL 进行配置
- **其他 MCP 客户端**：使用远程服务器 URL 进行配置

有关详细设置说明和特定区域的 URL，请参阅我们的[远程服务器设置文档](https://help.keboola.com/ai/mcp-server/#remote-server-setup)。

---

## 功能特性

- **存储**：直接查询表格并管理表格或存储桶描述
- **组件**：创建、列出和检查提取器、写入器、数据应用程序和转换配置
- **SQL**：使用自然语言创建 SQL 转换
- **作业**：运行组件和转换，并检索作业执行详细信息
- **元数据**：使用自然语言搜索、读取和更新项目文档和对象元数据

## 准备工作

确保您具备以下条件：

- [ ] 已安装 Python 3.10+
- [ ] 拥有具有管理员权限的 Keboola 项目访问权限
- [ ] 您首选的 MCP 客户端（Claude、Cursor 等）

**注意**：确保您已安装 `uv`。MCP 客户端将使用它来自动下载和运行 Keboola MCP 服务器。

**安装 uv**：

_macOS/Linux_：

```bash
# 如果您的机器上未安装 homebrew，请使用：
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 使用 Homebrew 安装
brew install uv
```

_Windows_：

```powershell
# 使用安装程序脚本
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用 pip
pip install uv

# 或使用 winget
winget install --id=astral-sh.uv -e
```

有关更多安装选项，请参阅[官方 uv 文档](https://docs.astral.sh/uv/getting-started/installation/)。

在设置 MCP 服务器之前，您需要三个关键信息：

### KBC_STORAGE_TOKEN

这是您的 Keboola 身份验证令牌：

有关如何创建和管理 Storage API 令牌的说明，请参阅[官方 Keboola 文档](https://help.keboola.com/management/project/tokens/)。

**注意**：如果您希望 MCP 服务器具有有限访问权限，请使用自定义存储令牌；如果您希望 MCP 访问项目中的所有内容，请使用主令牌。

### KBC_WORKSPACE_SCHEMA

这标识您在 Keboola 中的工作空间，用于 SQL 查询。但是，**只有在您使用自定义存储令牌而不是主令牌时才需要**：

- 如果使用[主令牌](https://help.keboola.com/management/project/tokens/#master-tokens)：工作空间在后台自动创建
- 如果使用[自定义存储令牌](https://help.keboola.com/management/project/tokens/#limited-tokens)：按照此[Keboola 指南](https://help.keboola.com/tutorial/manipulate/workspace/)获取您的 KBC_WORKSPACE_SCHEMA

**注意**：手动创建工作空间时，请勾选"授予对所有项目数据的只读访问权限"选项

**注意**：在 BigQuery 工作空间中，KBC_WORKSPACE_SCHEMA 称为数据集名称，您只需点击连接并复制数据集名称

### Keboola 区域

您的 Keboola API URL 取决于您的部署区域。您可以通过登录 Keboola 项目时浏览器中的 URL 来确定您的区域：

| 区域              | API URL                                             |
| ----------------- | --------------------------------------------------- |
| AWS 北美          | `https://connection.keboola.com`                    |
| AWS 欧洲          | `https://connection.eu-central-1.keboola.com`       |
| Google Cloud 欧盟 | `https://connection.europe-west3.gcp.keboola.com`   |
| Google Cloud 美国 | `https://connection.us-east4.gcp.keboola.com`       |
| Azure 欧盟        | `https://connection.north-europe.azure.keboola.com` |

## 运行 Keboola MCP 服务器

根据您的需求，有四种使用 Keboola MCP 服务器的方式：

### 选项 A：集成模式（推荐）

在此模式下，Claude 或 Cursor 会自动为您启动 MCP 服务器。**您无需在终端中运行任何命令**。

1. 使用适当的设置配置您的 MCP 客户端（Claude/Cursor）
2. 客户端将在需要时自动启动 MCP 服务器

#### Claude Desktop 配置

1. 转到 Claude（屏幕左上角）-> 设置 → 开发者 → 编辑配置（如果您没有看到 claude_desktop_config.json，请创建它）
2. 添加以下配置：
3. 重新启动 Claude 桌面以使更改生效

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": ["keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

配置文件位置：

- **macOS**：`~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**：`%APPDATA%\Claude\claude_desktop_config.json`

#### Cursor 配置

1. 转到设置 → MCP
2. 点击"+ 添加新的全局 MCP 服务器"
3. 使用以下设置进行配置：

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": ["keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

**注意**：为 MCP 服务器使用简短、描述性的名称。由于完整的工具名称包括服务器名称且必须保持在约 60 个字符以下，较长的名称可能在 Cursor 中被过滤掉并且不会显示给智能体。

#### Windows WSL 的 Cursor 配置

当从带有 Cursor AI 的 Windows Linux 子系统运行 MCP 服务器时，请使用此配置：

```json
{
  "mcpServers": {
    "keboola": {
      "command": "wsl.exe",
      "args": [
        "bash",
        "-c '",
        "export KBC_STORAGE_API_URL=https://connection.YOUR_REGION.keboola.com &&",
        "export KBC_STORAGE_TOKEN=your_keboola_storage_token &&",
        "export KBC_WORKSPACE_SCHEMA=your_workspace_schema &&",
        "/snap/bin/uvx keboola_mcp_server",
        "'"
      ]
    }
  }
}
```

### 选项 B：本地开发模式

对于在 MCP 服务器代码本身上工作的开发者：

1. 克隆仓库并设置本地环境
2. 配置 Claude/Cursor 使用您的本地 Python 路径：

```json
{
  "mcpServers": {
    "keboola": {
      "command": "/absolute/path/to/.venv/bin/python",
      "args": ["-m", "keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

### 选项 C：手动 CLI 模式（仅用于测试）

您可以在终端中手动运行服务器进行测试或调试：

```bash
# 设置环境变量
export KBC_STORAGE_API_URL=https://connection.YOUR_REGION.keboola.com
export KBC_STORAGE_TOKEN=your_keboola_storage_token
export KBC_WORKSPACE_SCHEMA=your_workspace_schema

uvx keboola_mcp_server --transport sse
```

> **注意**：此模式主要用于调试或测试。对于 Claude 或 Cursor 的正常使用，您无需手动运行服务器。

> **注意**：服务器将使用 SSE 传输并在 `localhost:8000` 监听传入的 SSE 连接。您可以使用 `--port` 和 `--host` 参数使其在其他地方监听。

### 选项 D：使用 Docker

```shell
docker pull keboola/mcp-server:latest

docker run \
  --name keboola_mcp_server \
  --rm \
  -it \
  -p 127.0.0.1:8000:8000 \
  -e KBC_STORAGE_API_URL="https://connection.YOUR_REGION.keboola.com" \
  -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
  -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
  keboola/mcp-server:latest \
  --transport sse \
  --host 0.0.0.0
```

> **注意**：服务器将使用 SSE 传输并在 `localhost:8000` 监听传入的 SSE 连接。您可以更改 `-p` 将容器的端口映射到其他地方。

### 我需要自己启动服务器吗？

| 场景               | 需要手动运行？      | 使用此设置             |
| ------------------ | ------------------- | ---------------------- |
| 使用 Claude/Cursor | 否                  | 在应用设置中配置 MCP   |
| 本地开发 MCP       | 否（Claude 启动它） | 将配置指向 python 路径 |
| 手动测试 CLI       | 是                  | 使用终端运行           |
| 使用 Docker        | 是                  | 运行 docker 容器       |

## 使用 MCP 服务器

配置并运行 MCP 客户端（Claude/Cursor）后，您可以开始查询您的 Keboola 数据：

### 验证您的设置

您可以从一个简单的查询开始，以确认一切正常工作：

```text
我的 Keboola 项目中有哪些存储桶和表格？
```

### 您可以做什么的示例

**数据探索：**

- "哪些表格包含客户信息？"
- "运行查询找出按收入排名前 10 的客户"

**数据分析：**

- "分析我上季度按地区划分的销售数据"
- "找出客户年龄与购买频率之间的相关性"

**数据管道：**

- "创建一个连接客户和订单表的 SQL 转换"
- "启动我的 Salesforce 组件的数据提取作业"

## 兼容性

### MCP 客户端支持

| **MCP 客户端**        | **支持状态** | **连接方法**      |
| --------------------- | ------------ | ----------------- |
| Claude（桌面和 Web）  | ✅ 已支持    | stdio             |
| Cursor                | ✅ 已支持    | stdio             |
| Windsurf、Zed、Replit | ✅ 已支持    | stdio             |
| Codeium、Sourcegraph  | ✅ 已支持    | HTTP+SSE          |
| 自定义 MCP 客户端     | ✅ 已支持    | HTTP+SSE 或 stdio |

## 支持的工具

**注意：** 您的 AI 智能体将自动适应新工具。

| 类别     | 工具                        | 描述                                       |
| -------- | --------------------------- | ------------------------------------------ |
| **项目** | `get_project_info`          | 返回关于您的 Keboola 项目的结构化信息      |
| **存储** | `get_bucket`                | 获取特定存储桶的详细信息                   |
|          | `get_table`                 | 获取特定表的详细信息，包括数据库标识符和列 |
|          | `list_buckets`              | 检索项目中的所有存储桶                     |
|          | `list_tables`               | 检索特定存储桶中的所有表                   |
|          | `update_description`        | 更新存储桶、表或列的描述                   |
| **SQL**  | `query_data`                | 对底层数据库执行 SELECT 查询               |
| **组件** | `add_config_row`            | 为组件配置创建配置行                       |
|          | `create_config`             | 创建根组件配置                             |
|          | `create_sql_transformation` | 从一个或多个 SQL 代码块创建 SQL 转换       |
|          | `find_component_id`         | 查找匹配自然语言查询的组件 ID              |
|          | `get_component`             | 通过 ID 检索组件的详细信息                 |
|          | `get_config`                | 检索特定的组件/转换配置                    |
|          | `get_config_examples`       | 检索组件的示例配置                         |
|          | `list_configs`              | 列出项目中的配置，可选过滤                 |
|          | `list_transformations`      | 列出项目中的转换配置                       |
|          | `update_config`             | 更新根组件配置                             |
|          | `update_config_row`         | 更新组件配置行                             |
|          | `update_sql_transformation` | 更新现有 SQL 转换配置                      |
| **流程** | `create_conditional_flow`   | 创建条件流程 (`keboola.flow`)              |
|          | `create_flow`               | 创建传统流程 (`keboola.orchestrator`)      |
|          | `get_flow`                  | 检索特定流程配置的详细信息                 |
|          | `get_flow_examples`         | 检索有效流程配置的示例                     |
|          | `get_flow_schema`           | 返回指定流程类型的 JSON 架构               |
|          | `list_flows`                | 列出项目中的流程配置                       |
|          | `update_flow`               | 更新现有流程配置                           |
| **作业** | `get_job`                   | 检索特定作业的详细信息                     |
|          | `list_jobs`                 | 列出作业，可选过滤、排序和分页             |
|          | `run_job`                   | 为组件或转换启动作业                       |
| **文档** | `docs_query`                | 使用 Keboola 文档作为源回答问题            |
| **其他** | `create_oauth_url`          | 为组件配置生成 OAuth 授权 URL              |
|          | `search`                    | 按名称前缀在项目中搜索项目                 |

## 故障排除

### 常见问题

| 问题             | 解决方案                             |
| ---------------- | ------------------------------------ |
| **身份验证错误** | 验证 `KBC_STORAGE_TOKEN` 是否有效    |
| **工作空间问题** | 确认 `KBC_WORKSPACE_SCHEMA` 是否正确 |
| **连接超时**     | 检查网络连接                         |

## 开发

### 安装

基本设置：

```bash
uv sync --extra dev
```

使用基本设置，您可以使用 `uv run tox` 运行测试并检查代码样式。

推荐设置：

```bash
uv sync --extra dev --extra tests --extra integtests --extra codestyle
```

使用推荐设置，将安装测试和代码样式检查的包，这允许像 VsCode 或 Cursor 这样的 IDE 在开发期间检查代码或运行测试。

### 集成测试

要在本地运行集成测试，请使用 `uv run tox -e integtests`。
注意：您需要设置以下环境变量：

- `INTEGTEST_STORAGE_API_URL`
- `INTEGTEST_STORAGE_TOKEN`
- `INTEGTEST_WORKSPACE_SCHEMA`

为了获得这些值，您需要一个专用的 Keboola 项目用于集成测试。

### 更新 `uv.lock`

如果您添加或删除了依赖项，请更新 `uv.lock` 文件。在创建发布时也要考虑使用较新的依赖项版本更新锁文件 (`uv lock --upgrade`)。

### 更新工具文档

当您对任何工具描述进行更改（工具函数中的文档字符串）时，您必须重新生成 `TOOLS.md` 文档文件以反映这些更改：

```bash
uv run python -m src.keboola_mcp_server.generate_tool_docs
```

## 支持和反馈

**⭐ 获得帮助、报告错误或请求功能的主要方式是[在 GitHub 上开启一个议题](https://github.com/keboola/mcp-server/issues/new)。⭐**

开发团队积极监控议题并会尽快回应。有关 Keboola 的一般信息，请使用以下资源。

## 资源

- [用户文档](https://help.keboola.com/)
- [开发者文档](https://developers.keboola.com/)
- [Keboola 平台](https://www.keboola.com)
- [议题跟踪器](https://github.com/keboola/mcp-server/issues/new) ← **MCP 服务器的主要联系方式**

## 连接

- [LinkedIn](https://www.linkedin.com/company/keboola)
- [Twitter](https://x.com/keboola)
- [更新日志](https://changelog.keboola.com/)
