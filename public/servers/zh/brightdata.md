---
name: Bright Data
digest: 通过 Bright Data API 获取公共网络数据
author: Bright Data
homepage: https://brightdata.com
repository: https://github.com/brightdata/brightdata-mcp
pinned: true
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - 网络爬虫
  - 数据采集
  - API
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
featured: true
---

Bright Data 官方 MCP 服务器，赋能大语言模型实时获取网络公开数据。该服务器支持 Claude Desktop、Cursor、Windsurf、OpenAI Agents 等 MCP 客户端基于网络信息进行决策。

## 🌟 产品概览

欢迎使用 Bright Data 官方模型上下文协议(MCP)服务器，为 LLM、智能体和应用程序提供实时网络数据访问与提取能力。本服务器支持 Claude Desktop、Cursor、Windsurf 等 MCP 客户端无缝执行网页搜索、网站导航、操作执行和数据抓取——全程防封禁，是网络爬取任务的理想解决方案。

![MCP架构图](https://github.com/user-attachments/assets/b949cb3e-c80a-4a43-b6a5-e0d6cec619a7)

## 🎬 演示视频

以下视频展示 Claude Desktop 的基础应用场景：

<video src="https://github.com/user-attachments/assets/59f6ebba-801a-49ab-8278-1b2120912e33" controls></video>

<video src="https://github.com/user-attachments/assets/61ab0bee-fdfa-4d50-b0de-5fab96b4b91d" controls></video>

YouTube 教程与演示请访问：[演示专区](https://github.com/brightdata-com/brightdata-mcp/blob/main/examples/README.md)

## ✨ 核心功能

- **实时网络访问**：获取最新网络信息
- **突破地域限制**：无视内容区域封锁
- **智能防封技术**：规避机器人检测机制
- **浏览器控制**：可选远程浏览器自动化功能
- **无缝集成**：兼容所有 MCP 协议 AI 助手

## 🚀 Claude Desktop 快速入门

1. 安装`nodejs`获取`npx`命令模块运行器，安装指南详见[node.js 官网](https://nodejs.org/en/download)

2. 在 Claude > 设置 > 开发者 > 编辑配置 > claude_desktop_config.json 中添加：

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<在此填入您的API密钥>",
        "WEB_UNLOCKER_ZONE": "<如需覆盖默认mcp_unlocker区域名称>",
        "BROWSER_ZONE": "<可选浏览器区域名称，默认为mcp_browser>"
      }
    }
  }
}
```

## 🔧 可用工具列表

[工具目录](https://github.com/brightdata-com/brightdata-mcp/blob/main/assets/Tools.md)

## ⚠️ 安全最佳实践

**重要提示**：所有爬取内容应视为不可信数据源。切勿直接将原始内容输入 LLM 提示词，避免潜在注入风险。建议：

- 处理前过滤验证所有网络数据
- 采用结构化数据提取而非原始文本（推荐 web_data 工具）

## 🔧 账户配置

1. 确保已注册[brightdata.com](https://brightdata.com)账号（新用户享测试额度，支持按量付费）

2. 从[用户设置页](https://brightdata.com/cp/setting/users)获取 API 密钥

3. (可选)创建自定义 Web Unlocker 区域

   - 系统默认通过 API 令牌自动创建
   - 如需自定义，请在[控制面板](https://brightdata.com/cp/zones)创建后通过`WEB_UNLOCKER_ZONE`环境变量指定

4. (可选)启用浏览器控制工具：
   - 默认尝试获取`mcp_browser`区域凭证
   - 若无该区域，您可：
     - 在[控制面板](https://brightdata.com/cp/zones)创建 Browser API 区域
     - 或通过`BROWSER_ZONE`指定现有区域名称

![浏览器API配置](https://github.com/user-attachments/assets/cb494aa8-d84d-4bb4-a509-8afb96872afe)

## 🔌 其他 MCP 客户端接入

适配其他代理软件时需配置以下参数：

- 运行命令：`npx @brightdata/mcp`
- 必须环境变量：`API_TOKEN=<您的密钥>`
- (可选)通过`BROWSER_ZONE=<区域名>`指定浏览器 API 区域（默认`mcp_browser`）

## 🔄 重大变更说明

### 浏览器认证更新

**重要变更**：`BROWSER_AUTH`环境变量已由`BROWSER_ZONE`替代

- **旧版**：需提供 Browser API 区域的`BROWSER_AUTH="用户名:密码"`
- **新版**：仅需指定区域名称`BROWSER_ZONE="区域名"`
- **默认**：未指定时自动使用`mcp_browser`区域
- **迁移**：配置中替换为`BROWSER_ZONE`，若`mcp_browser`不存在则需指定有效区域

## 🔄 更新日志

[更新记录](https://github.com/brightdata-com/brightdata-mcp/blob/main/CHANGELOG.md)

## 🎮 MCP 在线体验平台

无需本地配置即可体验 Bright Data MCP：

访问[Smithery](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)平台：

[![2025-05-06_10h44_20](https://github.com/user-attachments/assets/52517fa6-827d-4b28-b53d-f2020a13c3c4)](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)

该平台提供零配置的 MCP 能力探索环境，登录即可开始网络数据采集实验！

## 💡 应用场景示例

本 MCP 服务器可协助处理的典型查询：

- "搜索[您所在地区]即将上映的电影"
- "特斯拉当前市值是多少？"
- "今日维基百科特色条目是什么？"
- "[您的位置]未来 7 天天气预报"
- "薪酬最高的 3 位科技公司 CEO 职业生涯时长对比"

## ⚠️ 故障排查

### 工具调用超时

部分工具涉及网页数据加载，极端情况下耗时差异较大。建议在代理设置中配置充足超时阈值：

- 常规请求推荐设置`180秒`
- 特殊站点可酌情延长

### spawn npx ENOENT 错误

系统未找到`npx`命令时的解决方案：

#### 查找 Node 路径

**Mac 系统:**

```
which node
```

返回路径示例：`/usr/local/bin/node`

**Windows 系统:**

```
where node
```

返回路径示例：`C:\Program Files\nodejs\node.exe`

#### 更新 MCP 配置

将`npx`替换为 Node 完整路径，Mac 示例：

```
"command": "/usr/local/bin/node"
```

## 📞 技术支持

如遇问题或咨询，请联系 Bright Data 技术支持团队或在代码库提交 issue。
