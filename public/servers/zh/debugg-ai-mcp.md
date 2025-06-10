---
name: Debugg AI MCP
digest: AI驱动的浏览器自动化与端到端测试服务器
author: Debugg AI
homepage: https://debugg.ai
repository: https://github.com/debugg-ai/debugg-ai-mcp
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - 测试
  - 自动化
  - 浏览器
icon: https://avatars.githubusercontent.com/u/203699926?s=48&v=4
createTime: 2025-06-02
---

# 🧪 Debugg AI 官方 MCP 服务器

**基于 AI 的浏览器自动化与端到端测试服务器**，采用[模型上下文协议(MCP)](/)，帮助 AI 代理测试 UI 变更、模拟用户行为、分析运行中 Web 应用的视觉输出——全程支持自然语言与 CLI 工具交互。

端到端测试曾是开发者的噩梦。不仅配置复杂，随着应用迭代更需持续维护。

Debugg AI 的 MCP 服务器带来**全新测试方案**：无需配置 Playwright、本地浏览器或代理，通过安全隧道连接远程托管浏览器，支持本地或远程服务器运行。

这意味着：  
✔️ 测试时不再弹出干扰性浏览器窗口  
✔️ 无需管理 Chrome 或 Playwright 版本  
✔️ 最关键是——**零配置**  
只需获取 API 密钥，即可将我们添加到您的 MCP 服务器列表。

如需在 CI/CD 流水线中复测或创建测试套件，所有历史结果尽在掌控——[Debugg.AI 控制台](https://debugg.ai)

---

## 🚀 核心功能

- 🧠 **MCP 协议支持**  
  完整 MCP 服务器实现，集成 CLI 与工具注册功能

- 🧪 **端到端测试自动化**  
  通过`debugg_ai_test_page_changes`工具，根据用户故事或自然语言描述触发 UI 测试

- 🌐 **本地 Web 应用集成**  
  在任意`localhost`端口测试开发中应用，支持用户流程模拟

- 🧾 **MCP 工具通知**  
  实时向客户端发送进度更新，包含步骤描述与 UI 状态目标

- 🧷 **截图支持**  
  为 LLM 捕获页面最终视觉状态，支持图像渲染

- 🧱 **标准输入输出兼容**  
  通过 stdin/stdout 接入任何 MCP 兼容客户端（如 Claude Desktop、LangChain 代理等）

---

## 案例演示

### 输入指令："测试账户注册及登录功能"

![测试注册登录流程](https://static-debugg-ai.s3.us-east-2.amazonaws.com/test-create-account-login.gif)

### 测试结果：

    **任务完成**
    - 耗时: 86.80秒
    - 最终结果: 成功使用邮箱'alice.wonderland1234@example.com'完成账户注册及登录
    - 状态: 成功

### 完整演示：

> 观看[完整用例演示视频](https://debugg.ai/demo)

---

## 🛠️ 快速开始

### 请先创建免费账户并获取 API 密钥 - [DebuggAI](https://debugg.ai)

### 方案一: NPX（本地开发）

```bash
npx -y @debugg-ai/debugg-ai-mcp
```

推荐用于 Claude Desktop 等工具的集成测试场景

### 方案二: Docker

```bash
docker run -i --rm --init \
  -e DEBUGGAI_API_KEY=your_api_key \
  -e TEST_USERNAME_EMAIL=your_test_email \
  -e TEST_USER_PASSWORD=your_password \
  -e DEBUGGAI_LOCAL_PORT=3000 \
  -e DEBUGGAI_LOCAL_REPO_NAME=your-org/your-repo \
  -e DEBUGGAI_LOCAL_BRANCH_NAME=main \
  -e DEBUGGAI_LOCAL_REPO_PATH=/app \
  -e DEBUGGAI_LOCAL_FILE_PATH=/app/index.ts \
  quinnosha/debugg-ai-mcp
```

---

## 🧰 MCP 工具: `debugg_ai_test_page_changes`

### 功能说明

对运行中的 Web 应用执行端到端测试，支持自然语言描述的 UI 功能或流程验证。使 AI 代理能快速评估代码变更，确保新功能符合预期。

### 输入参数

| 参数名        | 类型   | 必填 | 说明                         |
| ------------- | ------ | ---- | ---------------------------- |
| `description` | string | 是   | 测试功能描述（如"注册表单"） |
| `localPort`   | number | 否   | 应用运行端口（默认`3000`）   |
| `repoName`    | string | 否   | GitHub 仓库名                |
| `branchName`  | string | 否   | 当前分支                     |
| `repoPath`    | string | 否   | 仓库绝对路径                 |
| `filePath`    | string | 否   | 待测试文件路径               |

---

## 🧪 Claude Desktop 配置示例

```jsonc
{
  "mcpServers": {
    "debugg-ai-mcp": {
      "command": "npx",
      "args": ["-y", "@debugg-ai/debugg-ai-mcp"],
      "env": {
        "DEBUGGAI_API_KEY": "YOUR_API_KEY",
        "TEST_USERNAME_EMAIL": "test@example.com",
        "TEST_USER_PASSWORD": "supersecure",
        "DEBUGGAI_LOCAL_PORT": 3000,
        "DEBUGGAI_LOCAL_REPO_NAME": "org/project",
        "DEBUGGAI_LOCAL_BRANCH_NAME": "main",
        "DEBUGGAI_LOCAL_REPO_PATH": "/Users/you/project",
        "DEBUGGAI_LOCAL_FILE_PATH": "/Users/you/project/index.ts"
      }
    }
  }
}
```

---

## 🔐 环境变量

| 变量名                       | 说明                   | 必填 |
| ---------------------------- | ---------------------- | ---- |
| `DEBUGGAI_API_KEY`           | DebuggAI 后端 API 密钥 | 是   |
| `TEST_USERNAME_EMAIL`        | 测试账户邮箱           | 否   |
| `TEST_USER_PASSWORD`         | 测试账户密码           | 否   |
| `DEBUGGAI_LOCAL_PORT`        | 本地应用端口           | 是   |
| `DEBUGGAI_LOCAL_REPO_NAME`   | GitHub 仓库名          | 否   |
| `DEBUGGAI_LOCAL_BRANCH_NAME` | 分支名称               | 否   |
| `DEBUGGAI_LOCAL_REPO_PATH`   | 本地仓库根路径         | 否   |
| `DEBUGGAI_LOCAL_FILE_PATH`   | 待测试文件路径         | 否   |

---

## 🧑‍💻 本地开发

```bash
# 克隆仓库并安装依赖
npm install

# 复制测试配置文件并填写凭证
cp test-config-example.json test-config.json

# 本地运行MCP服务器
npx @modelcontextprotocol/inspector --config debugg-ai-mcp/test-config.json --server debugg-ai-mcp
```

---

## 📁 仓库结构

```
.
├── e2e-agents/             # 端到端测试执行器
├── services/               # DebuggAI API客户端
├── tunnels /               # 远程浏览器安全连接
├── index.ts                # MCP服务器主入口
├── Dockerfile              # Docker构建配置
└── README.md
```

---

## 🧱 技术栈

- [模型上下文协议 SDK](https://github.com/modelcontextprotocol)

---

## 💬 反馈与问题

如需提交 BUG、功能建议或集成咨询，请提交 issue 或直接联系 DebuggAI 团队。

---

## 🔒 许可证

MIT License © 2025 DebuggAI

---

<p style="padding-top: 20px; text-align: center;">旧金山倾情打造 🩸💦😭</p>
