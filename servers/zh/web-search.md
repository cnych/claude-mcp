---
name: 网络搜索 MCP 服务器
digest: MCP服务器通过利用谷歌搜索结果提供免费的网络搜索功能，无需API密钥，为获取在线信息提供了一个简单易用的解决方案。
author: pskill9
repository: https://github.com/pskill9/web-search
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 搜索
  - 网络
  - 服务器
icon: https://avatars.githubusercontent.com/u/188422281?s=48&v=4
createTime: 2024-12-30
---

一个基于模型上下文协议（MCP）的服务器，支持使用谷歌搜索结果进行免费网络搜索，无需 API 密钥。

## 功能特性

- 通过谷歌搜索结果进行网络搜索
- 无需 API 密钥或身份验证
- 返回结构化结果（包含标题、URL 和描述）
- 可配置每次搜索返回的结果数量

## 安装指南

1. 克隆或下载本仓库
2. 安装依赖项：

```bash
npm install
```

3. 构建服务器：

```bash
npm run build
```

4. 将服务器添加到您的 MCP 配置中：

VSCode 版（Claude 开发扩展）：

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search/build/index.js"]
    }
  }
}
```

桌面版 Claude：

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search/build/index.js"]
    }
  }
}
```

## 使用说明

服务器提供一个名为`search`的工具，接收以下参数：

```typescript
{
  "query": string,    // 搜索关键词
  "limit": number     // 可选参数：返回结果数量（默认值：5，最大值：10）
}
```

使用示例：

```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "search",
  arguments: {
    query: "您的搜索内容",
    limit: 3, // 可选参数
  },
});
```

响应示例：

```json
[
  {
    "title": "示例搜索结果",
    "url": "https://example.com",
    "description": "搜索结果描述..."
  }
]
```

## 使用限制

由于本工具采用谷歌搜索结果网页爬取技术，请注意以下重要限制：

1. **速率限制**：短时间内执行过多搜索可能导致谷歌临时屏蔽请求。建议：

   - 保持合理的搜索频率
   - 谨慎使用 limit 参数
   - 必要时可在搜索间添加延迟

2. **结果准确性**：

   - 依赖谷歌 HTML 结构（可能发生变化）
   - 部分结果可能缺失描述等元数据
   - 复杂搜索运算符可能无法正常使用

3. **法律注意事项**：
   - 本工具仅限个人使用
   - 请遵守谷歌服务条款
   - 建议根据实际使用场景实施适当的速率限制
