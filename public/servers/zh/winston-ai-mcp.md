---
name: Winston AI MCP 服务器
digest: 拥有行业领先的文本与图像 AI 检测准确率的 AI 检测 MCP 服务器，同时提供强大的抄袭检测功能，帮助维护内容完整性。
author: Winston AI
repository: https://github.com/gowinston-ai/winston-ai-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai-detector
  - ai-tools
  - plagiarism
  - plagiarism-checker
  - text-compare
  - typescript
  - server
icon: https://winston-app-production-public.s3.us-east-1.amazonaws.com/winston-ai-favicon-light.svg
createTime: 2025-07-24
---

# Winston AI MCP 服务器 ⚡️

> **Winston AI 的 Model Context Protocol (MCP) 服务器** — 最精准的 AI 检测器。轻松检测 AI 生成内容、抄袭并比较文本。

## ✨ 功能亮点

### 🔍 AI 文本检测
- **人类 vs AI 分类**：判断文本是人类还是 AI 撰写
- **置信度评分**：以百分比形式返回置信度
- **句子级分析**：识别最可能由 AI 撰写的句子
- **多语言支持**：可处理多种语言的文本
- **积分消耗**：每个单词 1 积分

### 🖼️ AI 图像检测
- **图像分析**：使用高级机器学习模型检测 AI 生成图像
- **元数据核验**：分析图像元数据与 EXIF 信息
- **水印检测**：识别 AI 水印及其发行方
- **多格式支持**：支持 JPG、JPEG、PNG、WEBP
- **积分消耗**：每张 300 积分

### 📝 抄袭检测
- **全网扫描**：与数十亿网页进行比对
- **来源识别**：查找并列出原始来源
- **详尽报告**：生成全面的抄袭分析报告
- **学术与专业场景**：适用于内容合规审查
- **积分消耗**：每个单词 2 积分

### 🔄 文本比较
- **相似度分析**：比较两段文本的相似度
- **词级匹配**：提供详细匹配信息
- **百分比评分**：返回精准相似度百分比
- **双向分析**：双向比较两段文本
- **积分消耗**：总字数的一半积分

## 🚀 快速开始

### 前置条件
- Node.js 18+

## 🛠️ 开发

### 使用 npx 运行 🔋

```bash
env WINSTONAI_API_KEY=your-api-key npx -y winston-ai-mcp
```

### 通过 stdio 在本地启动 MCP 服务器 💻

在项目根目录创建 `.env` 文件：

```env
WINSTONAI_API_KEY=your_actual_api_key_here
```

```bash
# 克隆仓库
git clone https://github.com/gowinston-ai/winston-ai-mcp-server.git
cd winston-ai-mcp-server

# 安装依赖
npm install

# 构建并启动服务器
npm run mcp-start
```

## 📦 Docker 支持

使用 Docker 构建并运行：

```bash
# 构建镜像
docker build -t winston-ai-mcp .

# 运行容器
docker run -e WINSTONAI_API_KEY=your_api_key winston-ai-mcp
```

## 📋 可用脚本

- `npm run build` - 将 TypeScript 编译为 JavaScript
- `npm start` - 启动 MCP 服务器
- `npm run mcp-start` - 编译 TypeScript 并启动 MCP 服务器
- `npm run lint` - 运行 ESLint 进行代码质量检查
- `npm run format` - 使用 Prettier 格式化代码

## 🔧 配置

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "winston-ai-mcp": {
      "command": "npx",
      "args": ["-y", "winston-ai-mcp"],
      "env": {
        "WINSTONAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor IDE

在 Cursor 设置中添加：

```json
{
  "mcpServers": {
    "winston-ai-mcp": {
      "command": "npx",
      "args": ["-y", "winston-ai-mcp"],
      "env": {
        "WINSTONAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 通过 API 调用 MCP 服务器 🌐

MCP 服务器部署在 `https://api.gowinston.ai/mcp/v1`，可通过 HTTPS 请求访问。

#### 示例：列出工具

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--header 'jsonrpc: 2.0' \
--data '{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}'
```

#### 示例：AI 文本检测

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "ai-text-detection",
    "arguments": {
      "text": "待分析文本（至少 300 字）",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 示例：AI 图像检测

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "ai-image-detection",
    "arguments": {
      "url": "https://example.com/image.jpg",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 示例：抄袭检测

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "plagiarism-detection",
    "arguments": {
      "text": "待检测文本（至少 100 字）",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 示例：文本比较

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "text-compare",
    "arguments": {
      "first_text": "第一段文本",
      "second_text": "第二段文本",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

**注意：** 请将 `your-winston-ai-api-key` 替换为您的实际 Winston AI API 密钥。可在 [https://dev.gowinston.ai](https://dev.gowinston.ai) 获取。

## 📋 API 参考

### AI 文本检测
```typescript
{
  "text": "待分析文本（建议 600 字以上）",
  "file": "(可选) 要扫描的文件。若提供文件，API 会分析文件内容。仅支持 .pdf、.doc、.docx 格式。",
  "website": "(可选) 要扫描的网站 URL，应为公开可访问页面。"
}
```

### AI 图像检测
```typescript
{
  "url": "https://example.com/image.jpg"
}
```

### 抄袭检测
```typescript
{
  "text": "待检测文本",
  "language": "zh", // 可选，默认 "en"
  "country": "cn"   // 可选，默认 "us"
}
```

### 文本比较
```typescript
{
  "first_text": "第一段文本",
  "second_text": "第二段文本"
}
```

## 🤝 贡献

欢迎参与！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证发布，详见 LICENSE。

## 🔗 链接

- **Winston AI MCP NPM 包**：<https://www.npmjs.com/package/winston-ai-mcp>
- **Winston AI 官网**：<https://gowinston.ai>
- **API 文档**：<https://dev.gowinston.ai>
- **MCP 协议**：<https://modelcontextprotocol.io>
- **GitHub 仓库**：<https://github.com/gowinston-ai/winston-ai-mcp-server>

## ⭐️ 支持

如果本项目对您有帮助，请在 GitHub 上为我们点颗星！

---

**由 Winston AI 团队 ❤️ 倾情打造**
