---
name: Brave 搜索
digest: 使用 Brave API 搜索网页内容
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search
capabilities:
  resources: true
  tools: true
tags:
  - brave
  - 搜索
  - api
icon: https://cdn.simpleicons.org/brave
createTime: 2024-12-01T00:00:00Z
featured: true
---

一个集成了 Brave 搜索 API 的 MCP 服务器实现，提供网页和本地搜索功能。

## 功能特点

- **网页搜索**：支持常规查询、新闻、文章，具有分页和时效性控制
- **本地搜索**：查找商家、餐厅和服务，提供详细信息
- **灵活过滤**：控制结果类型、安全级别和内容时效性
- **智能回退**：当本地搜索无结果时自动切换到网页搜索

## 工具

- **brave_web_search**

  - 执行带分页和过滤的网页搜索
  - 输入参数：
    - `query` (字符串)：搜索关键词
    - `count` (数字，可选)：每页结果数量（最大 20）
    - `offset` (数字，可选)：分页偏移量（最大 9）

- **brave_local_search**
  - 搜索本地商家和服务
  - 输入参数：
    - `query` (字符串)：本地搜索关键词
    - `count` (数字，可选)：结果数量（最大 20）
  - 当无本地结果时自动切换到网页搜索

## 配置

### 获取 API 密钥

1. 注册 [Brave 搜索 API 账号](https://brave.com/search/api/)
2. 选择套餐（免费套餐每月可查询 2,000 次）
3. 在[开发者控制台](https://api.search.brave.com/app/keys)生成你的 API 密钥

### 在 Claude Desktop 中使用

将以下内容添加到你的 `claude_desktop_config.json` 中：

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## License

本 MCP 服务器基于 MIT 许可证发布。这意味着你可以自由地使用、修改和分发软件，但需遵守 MIT 许可证中的条款和条件。更多详细信息请参见项目仓库中的 LICENSE 文件。
