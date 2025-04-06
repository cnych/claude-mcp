---
name: Puppeteer
digest: 浏览器自动化和网页爬取
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - puppeteer
  - 浏览器
  - 爬虫
icon: https://cdn.simpleicons.org/puppeteer
createTime: 2024-12-01T00:00:00Z
---

使用 Puppeteer 提供浏览器自动化能力的 MCP 服务器。该服务器使 LLMs 能够与网页交互、截图和在真实浏览器环境中执行 JavaScript。

## 组件

### 工具

- **puppeteer_navigate**

  - 导航到浏览器中的任何 URL
  - 输入: `url` (string)

- **puppeteer_screenshot**

  - 捕获整个页面或特定元素的截图
  - 输入:
    - `name` (string, required): 截图名称
    - `selector` (string, optional): CSS 选择器，用于截图元素
    - `width` (number, optional, default: 800): 截图宽度
    - `height` (number, optional, default: 600): 截图高度

- **puppeteer_click**

  - 点击页面上的元素
  - 输入: `selector` (string): CSS 选择器，用于点击元素

- **puppeteer_hover**

  - 悬停页面上的元素
  - 输入: `selector` (string): CSS 选择器，用于悬停元素

- **puppeteer_fill**

  - 填充输入字段
  - 输入:
    - `selector` (string): CSS 选择器，用于输入字段
    - `value` (string): 要填充的值

- **puppeteer_select**

  - 选择带有 SELECT 标签的元素
  - 输入:
    - `selector` (string): CSS 选择器，用于选择元素
    - `value` (string): 要选择的值

- **puppeteer_evaluate**

  - 在浏览器控制台中执行 JavaScript
  - 输入: `script` (string): 要执行的 JavaScript 代码

### 资源

服务器提供两种类型的资源：

1. **Console Logs** (`console://logs`)

   - 浏览器控制台输出文本格式
   - 包括浏览器中的所有控制台消息

2. **Screenshots** (`screenshot://<name>`)
   - PNG 图像的截图
   - 通过捕获时指定的截图名称访问

## 关键功能

- 浏览器自动化
- 控制台日志监控
- 截图功能
- JavaScript 执行
- 基本的网页交互（导航、点击、表单填充）

## 使用 Puppeteer 服务器的配置

以下是使用 Puppeteer 服务器的 Claude Desktop 配置：

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

## 许可证

该 MCP 服务器根据 MIT 许可证授权。这意味着您可以自由使用、修改和分发软件，但需遵守 MIT 许可证的条款和条件。更多详情，请参阅项目仓库中的 LICENSE 文件。
