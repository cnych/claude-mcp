---
name: Notion MCP Server
digest: Notion-MCP 是一款增强 Notion 功能的服务器解决方案，提供更优性能、可靠性和定制化选项。该服务为使用 Notion 作为生产力平台的团队实现无缝集成、更快数据处理和更强扩展性，确保稳定连接并优化工作流程。
author: makenotion
homepage: https://github.com/makenotion/notion-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - 服务器
  - notion
icon: https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-e217db9f.jpg
createTime: 2025-03-11
---

本项目为 [Notion API](https://developers.notion.com/reference/intro) 实现了 [MCP 服务器](https://www.claudemcp.com/zh/specification)。

![mcp-demo](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-329eb145.jpg)

## 安装指南

### 在 Notion 中设置集成：

访问 [https://www.notion.so/profile/integrations](https://www.notion.so/profile/integrations) 创建新的**内部**集成或选择现有集成。

![创建 Notion 集成令牌](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-ede5f671.png)

出于安全考虑，您可以通过在"配置"标签页仅勾选"读取内容"权限来创建只读集成令牌：

![显示已勾选读取内容的 Notion 集成令牌权限](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-d83f196f.png)

### 向客户端添加 MCP 配置：

#### 使用 npm：

在 `.cursor/mcp.json` 或 `claude_desktop_config.json` 中添加以下内容：

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\" }"
      }
    }
  }
}
```

#### 使用 Docker：

构建 Docker 镜像：

```bash
docker-compose build
```

然后在配置中添加：

```javascript
{
  "mcpServers": {
    "notionApi": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "OPENAPI_MCP_HEADERS={\"Authorization\": \"Bearer ntn_****\", \"Notion-Version\": \"2022-06-28\"}",
        "notion-mcp-server-notion-mcp-server"
      ]
    }
  }
}
```

将 `ntn_****` 替换为您的集成密钥：

![从开发者门户配置标签页复制集成令牌](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-2c84281a.jpg)

### 将内容关联到集成：

访问页面/数据库，在三点菜单中选择"关联到集成"。

![向 Notion 连接添加集成令牌](https://static.claudemcp.com/servers/makenotion/notion-mcp-server/makenotion-notion-mcp-server-a69b7191.png)

## 使用示例

1. 在页面添加评论：

```
在"入门指南"页面上评论"Hello MCP"
```

2. 创建新页面：

```
在"开发"页面下添加标题为"Notion MCP"的新页面
```

3. 通过 ID 获取页面内容：

```
获取ID为1a6b35e6e67f802fa7e1d27686f017f2的页面内容
```

## 开发指南

构建：

```
npm run build
```

运行：

```
npx -y --prefix /path/to/local/notion-mcp-server @notionhq/notion-mcp-server
```

发布：

```
npm publish --access public
```
