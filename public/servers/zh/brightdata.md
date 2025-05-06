---
name: Bright Data
digest: 通过Bright Data API获取公开网络数据
author: Bright Data
homepage: https://brightdata.com
repository: https://github.com/luminati-io/brightdata-mcp
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - 爬虫
  - 数据采集
  - API
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
---

Bright Data 官方 MCP 服务器，赋能大语言模型获取公开网络数据。该服务器支持 Claude Desktop、Cursor、Windsurf、OpenAI Agents 等 MCP 客户端基于网络信息进行决策。

## 核心功能

- **网络数据获取**: 从公开网站及网络服务提取信息
- **浏览器控制**: 可选浏览器自动化功能，处理复杂网页交互
- **智能数据提取**: 高效处理并返回相关网页内容

## 工具集

#### 网页搜索与抓取

- **搜索引擎**: 支持 Google/Bing/Yandex 搜索，返回 Markdown 格式结果
- **网页转 Markdown**: 将网页内容提取为 Markdown 格式
- **网页转 HTML**: 获取网页完整 HTML 内容
- **会话统计**: 查看当前会话的工具使用数据

#### 结构化数据提取

- **亚马逊商品数据**: 提取标准化商品信息
- **亚马逊商品评价**: 获取商品评论数据
- **领英个人档案**: 提取个人职业资料
- **领英企业档案**: 获取公司公开信息

#### 浏览器控制工具(需 BROWSER_AUTH 授权)

- **页面跳转**: 导航至指定 URL
- **页面回退**: 返回上一页面
- **页面前进**: 进入下一页
- **链接提取**: 获取当前页所有链接
- **元素点击**: 点击指定页面元素
- **文本输入**: 向元素输入文本
- **元素等待**: 等待特定元素加载
- **页面截图**: 截取当前屏幕
- **HTML 获取**: 提取页面 HTML 源码
- **文本提取**: 获取页面文本内容

## 配置指南

### 获取 API 密钥

1. 注册[brightdata.com](https://brightdata.com)账号（新用户享测试额度）
2. 在[用户设置页](https://brightdata.com/cp/setting/users)获取 API 密钥
3. 于[控制面板](https://brightdata.com/cp/zones)创建名为`mcp_unlocker`的 Web Unlocker 代理区域
   - 可通过环境变量`WEB_UNLOCKER_ZONE`覆盖默认区域
4. (可选)浏览器工具配置：
   - 在控制面板创建"scraping browser"区域
   - 从 Scraping Browser 概览页复制认证字符串

### Claude Desktop 集成配置

在`claude_desktop_config.json`中添加：

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<插入您的API密钥>",
        "WEB_UNLOCKER_ZONE": "<可选区域名称覆盖>",
        "BROWSER_AUTH": "<浏览器工具授权字符串>"
      }
    }
  }
}
```

---

## 许可协议

本 MCP 服务器采用 MIT 许可协议。您可自由使用、修改及分发本软件，须遵守 MIT 协议条款。详见项目代码库中的 LICENSE 文件。
