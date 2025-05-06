---
name: Google Drive
digest: 用于 Google Drive 的 Claude MCP 服务器
author: Claude 团队
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - gdrive
  - google
  - 云
icon: https://cdn.simpleicons.org/google
createTime: 2024-12-06T00:00:00Z
---

一个用于 Google Drive 的模型上下文协议服务器。该服务器与 Google Drive 集成，允许列出、读取和搜索文件。

## 组件

### 工具

- **search**
  - 在 Google Drive 中搜索文件
  - 输入：`query`（字符串）：搜索查询
  - 返回匹配文件的文件名和 MIME 类型

### 资源

服务器提供对 Google Drive 文件的访问：

- **文件**（`gdrive:///<file_id>`）
  - 支持所有文件类型
  - Google Workspace 文件自动导出为：
    - 文档 → Markdown
    - 表格 → CSV
    - 演示文稿 → 纯文本
    - 绘图 → PNG
  - 其他文件以其原生格式提供

## 入门指南

1. [创建新的 Google Cloud 项目](https://console.cloud.google.com/projectcreate)
2. [启用 Google Drive API](https://console.cloud.google.com/workspace-api/products)
3. [配置 OAuth 许可界面](https://console.cloud.google.com/apis/credentials/consent)（测试时选择"内部"即可）
4. 添加 OAuth 范围 `https://www.googleapis.com/auth/drive.readonly`
5. [创建 OAuth 客户端 ID](https://console.cloud.google.com/apis/credentials/oauthclient)，应用类型选择"桌面应用"
6. 下载客户端 OAuth 密钥的 JSON 文件
7. 将密钥文件重命名为 `gcp-oauth.keys.json` 并放置在此仓库的根目录（即 `servers/gcp-oauth.keys.json`）

确保使用 `npm run build` 或 `npm run watch` 构建服务器。

### 与桌面应用集成

要进行身份验证并保存凭据：

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"]
    }
  }
}
```

## 许可证

此 MCP 服务器根据 MIT 许可证授权。这意味着您可以自由使用、修改和分发软件，但需遵守 MIT 许可证的条款和条件。有关更多详细信息，请参阅项目仓库中的 LICENSE 文件。
