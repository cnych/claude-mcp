---
name: BrowserStack MCP
digest: BrowserStack MCP 服务器现已上线！在任何AI系统（包括聊天机器人、应用程序和自主代理）上充分利用BrowserStack测试平台的全部功能。
author: BrowserStack
homepage: https://www.browserstack.com
repository: https://github.com/browserstack/mcp-server
capabilities:
  resources: true
  tools: true
tags:
  - 测试
  - QA
icon: https://avatars.githubusercontent.com/u/1119453?s=200&v=4
createTime: 2025-04-29
---

# BrowserStack MCP 服务器

[![BrowserStack](https://static.claudemcp.com/images/browserstack-mcp-thumbnail.jpg)](https://www.youtube.com/watch?v=sLA7K9v7qZc)

为团队中的每位开发者和测试人员赋能，无论是进行手动测试、开启自动化测试之旅，还是扩展测试自动化规模。  
BrowserStack MCP 服务器让您可以直接从喜爱的 AI 工具中使用我们尖端的[测试平台](https://www.browserstack.com/test-platform)。

### 为什么选择 BrowserStack？

![BrowserStack](https://static.claudemcp.com/images/browserstack-overview.png)

## 💡 使用示例

### 📱 手动应用测试

使用以下指令在 BrowserStack 庞大的真实设备云上测试您的**移动应用**。告别模拟器！

```bash
# 在特定设备上打开应用
"在iPhone 15 Pro Max上打开我的应用"

# 调试应用崩溃
"我的应用在Android 14设备上崩溃了，能帮我调试吗？"
```

- 与模拟器不同，可在真实设备上测试应用的实际性能。通过先进的[应用性能分析功能](https://www.browserstack.com/docs/app-live/app-performance-testing)，实时调试崩溃和性能问题。
- 从我们的[设备矩阵](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)访问所有主流设备和操作系统版本。我们严格遵循 SLA，确保全球数据中心在[发布日](https://www.browserstack.com/blog/browserstack-launches-iphone-15-on-day-0-behind-the-scenes/)提供最新设备。

### 🌐 手动网页测试

与应用测试类似，您可以使用以下指令在 BrowserStack 庞大的真实浏览器和设备云上测试您的**网站**。本地没有安装 Edge 浏览器？我们为您解决！

```bash
# 测试本地网站
"在Edge浏览器上打开我本地3001端口的网站"
```

- 跨不同浏览器和设备测试网站。我们支持[所有主流浏览器](https://www.browserstack.com/list-of-browsers-and-platforms/live)和操作系统。
- 无缝测试本地托管的网站，无需部署到远程服务器！

### 🧪 自动化测试（Playwright、Selenium、无障碍测试等）

使用以下指令在 BrowserStack[测试平台](https://www.browserstack.com/test-platform)上运行/调试/修复您的**自动化测试**。

```bash
# 将测试套件迁移到BrowserStack
"在BrowserStack基础设施上运行我的测试套件"

# 调试测试失败
"我的测试套件失败了，能帮我修复新增的失败用例吗？"

# 无障碍测试
"检查www.mywebsite.com的无障碍访问问题"
```

- 利用行业领先的[测试可观测性](https://www.browserstack.com/docs/test-observability)功能修复 CI/CD 流水线报告的测试失败。更多信息请见[此处](https://www.browserstack.com/docs/test-observability/features/smart-tags)。
- 在 BrowserStack[测试平台](https://www.browserstack.com/test-platform)上运行 Jest、Playwright、Selenium 等编写的测试
- **无障碍测试**：通过我们的[无障碍测试工具](https://www.browserstack.com/accessibility-testing)确保符合 WCAG 和 ADA 标准

## 🛠️ 安装指南

1. **创建 BrowserStack 账户**
   - 如果尚未注册，请先[注册 BrowserStack](https://www.browserstack.com/signup)
   - ℹ️ 开源项目可申请[免费计划](https://www.browserstack.com/open-source)

![开源计划](https://static.claudemcp.com/images/browserstack-open-source.png)

- 注册后（并购买相应套餐），从[账户设置](https://www.browserstack.com/accounts/profile/details)记录您的`用户名`和`访问密钥`

2. 确保使用 Node 版本 >= `18.0`。通过`node --version`检查版本。推荐版本：`v22.15.0`（LTS）
3. **安装 MCP 服务器**

   - VSCode（Copilot 代理模式）：`.vscode/mcp.json`:

   ```json
   {
     "servers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<用户名>",
           "BROWSERSTACK_ACCESS_KEY": "<访问密钥>"
         }
       }
     }
   }
   ```

   - 在 VSCode 中，确保点击 MCP 服务器的`启动`按钮
     ![启动MCP服务器](https://static.claudemcp.com/images/browserstack-vscode.png)

   * Cursor 配置：`.cursor/mcp.json`:

   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<用户名>",
           "BROWSERSTACK_ACCESS_KEY": "<访问密钥>"
         }
       }
     }
   }
   ```

   - Claude 桌面版：`~/claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<用户名>",
           "BROWSERSTACK_ACCESS_KEY": "<访问密钥>"
         }
       }
     }
   }
   ```

## 🤝 推荐 MCP 客户端

- 自动化测试+调试场景推荐使用**Github Copilot 或 Cursor**
- 手动测试场景（实时测试）推荐使用**Claude 桌面版**

## ⚠️ 重要说明

- BrowserStack MCP 服务器正在积极开发中，目前支持 MCP 规范的部分功能。更多功能即将推出。
- 工具调用依赖 MCP 客户端，而客户端又依赖 LLM，因此可能存在非确定性行为导致意外结果。如有建议或反馈，请提交 issue 讨论。

## 📝 贡献指南

欢迎贡献！请提交 issue 讨论您希望做出的更改。  
👉 [**点击查看贡献指南**](https://github.com/browserstack/mcp-server/blob/main/CONTRIBUTING.md)

## 📞 技术支持

如需支持，请：

- 查阅我们的[文档](https://www.browserstack.com/docs)
- 在[GitHub 代码库](https://github.com/browserstack/mcp-server)提交 MCP 服务器相关问题
- 联系我们的[支持团队](https://www.browserstack.com/contact)处理其他查询

## 🚀 即将推出更多功能

敬请期待激动人心的更新！有任何建议？请提交 issue 讨论。

## 🔗 相关资源

- [BrowserStack 测试平台](https://www.browserstack.com/test-platform)
- [MCP 协议文档](https://modelcontextprotocol.io)
- [设备矩阵](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)
- [无障碍测试](https://www.browserstack.com/accessibility-testing)

## 📄 许可证

本项目采用[AGPL-3.0 许可证](https://www.gnu.org/licenses/agpl-3.0.html)。
