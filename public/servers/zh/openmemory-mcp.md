---
name: OpenMemory MCP
digest: OpenMemory 是由 Mem0 驱动的本地记忆基础设施，让您的记忆数据能在任意 AI 应用间流转。它提供与您相伴的统一记忆层，使智能代理和助手能在跨应用场景中记住重要信息。
author: mem0ai
homepage: https://mem0.ai/openmemory-mcp
repository: https://github.com/mem0ai/mem0/tree/main/openmemory
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - server
  - 记忆
icon: https://avatars.githubusercontent.com/u/137054526?s=48&v=4
createTime: 2025-05-14
featured: true
---

OpenMemory 是由 Mem0 驱动的本地记忆基础设施，让您的记忆数据能在任意 AI 应用间流转。它提供与您相伴的统一记忆层，使智能代理和助手能在跨应用场景中记住重要信息。

![OpenMemory MCP](https://static.claudemcp.com/images/openmemory-mcp.png)

今日我们发布首个核心组件：[OpenMemory MCP 服务器](/zh/servers/openmemory-mcp)——这是一款内置可视化界面的私有化本地优先记忆层，兼容所有 MCP 协议客户端。

## OpenMemory MCP 服务器是什么

**OpenMemory MCP 服务器**是私有化的本地优先记忆服务，为兼容 MCP 的工具创建共享的持久化记忆层。它完全运行在您的本地设备上，实现工具间的无缝上下文传递。无论您在开发、规划还是调试环境间切换，AI 助手都能获取相关记忆而无需重复指令。

该服务器确保所有记忆数据保持**本地化、结构化且完全由您掌控**，无需云端同步或外部存储。

## 工作原理

基于**模型上下文协议（MCP）**构建的服务器提供标准化记忆工具集：

- `add_memories`：存储新记忆对象
- `search_memory`：检索相关记忆
- `list_memories`：查看所有存储记忆
- `delete_all_memories`：彻底清空记忆

任何兼容 MCP 的工具均可连接服务器，通过这些 API 实现记忆的持久化存取。

## 核心价值

1. **跨客户端记忆共享**：在 Cursor 中存储的上下文，后续可在 Claude 或 Windsurf 中直接调用，无需重复交代
2. **全本地化存储**：所有记忆数据仅存于本地设备，绝不上传云端，您始终拥有完整控制权
3. **统一记忆管理界面**：内置仪表盘提供全局视图，可直接管理记忆的增删查改及客户端访问权限

## 兼容客户端

支持模型上下文协议的所有客户端均可接入，包括但不限于：

- **Cursor**
- **Claude 桌面版**
- **Windsurf**
- **Cline 等**

随着更多 AI 系统采用 MCP 协议，您的私有记忆库将愈发增值。

---

## 安装指南

只需几分钟即可在本地完成部署：

```bash
# 克隆仓库
git clone <https://github.com/mem0ai/mem0.git>
cd openmemory

# 创建后端环境变量文件
cd api
touch .env
echo "OPENAI_API_KEY=your_key_here" > .env

# 返回项目根目录构建镜像
cd ..
make build

# 启动所有服务（API服务/向量数据库/MCP服务组件）
make up

# 启动前端界面
cp ui/.env.example ui/.env
make ui
```

**客户端配置**  
连接 Cursor、Claude 桌面版等 MCP 客户端时需提供用户 ID，可通过以下命令获取：

```bash
whoami
```

随后在客户端添加配置（将`your-username`替换为实际用户名）：

```bash
npx install-mcp i "http://localhost:8765/mcp/<mcp-client>/sse/<your-username>" --client <mcp-client>
```

通过 `http://localhost:3000` 访问控制面板，可查看记忆库状态及管理客户端连接。所有数据仅在本地运行，确保隐私安全的同时实现跨客户端记忆共享。

### 功能演示 🎥

我们准备了简短演示视频展示实际效果：

<video
src="https://mem0.ai/blog/content/media/2025/05/Mem0-openMemory.mp4"
poster="https://img.spacergif.org/v1/3340x2160/0a/spacer.png"
width="3340"
height="2160"
controls
playsinline
preload="metadata"
style="background: transparent url('https://mem0.ai/blog/content/media/2025/05/Mem0-openMemory_thumb.jpg') 50% 50% / cover no-repeat;"></video>

## 应用场景

**场景一：跨工具项目流**

在 Claude 桌面版定义项目技术需求 → 通过 Cursor 开发实现 → 使用 Windsurf 调试问题，全程共享 OpenMemory 传递的上下文。

**场景二：持久化偏好设置**

在任一工具设置代码风格或对话语气，切换其他 MCP 客户端时自动继承配置。

**场景三：项目知识库**

一次性保存关键项目信息，后续所有兼容 AI 工具均可直接调用，告别重复解释。

## 展望未来

OpenMemory MCP 服务器在**保持控制权与隐私性**的前提下，为兼容工具赋予记忆能力。它解决了现代大语言模型工作流的根本缺陷——跨工具、会话及环境的上下文丢失问题。

通过标准化记忆操作与全本地化存储，既降低 token 消耗提升性能，更为日益丰富的 AI 助手生态开启更智能的交互可能。

这仅是开端。MCP 服务器作为 OpenMemory 平台的首个核心层，标志着我们让记忆数据在 AI 系统间实现可移植、私有化且互操作的长期愿景。

选择 OpenMemory MCP，让您的 AI 记忆始终私有、便携、可控，真正实现数据主权。
