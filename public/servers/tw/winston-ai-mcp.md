---
name: Winston AI MCP 伺服器
digest: 具備業界領先的文字與圖像 AI 偵測準確率的 AI 偵測 MCP 伺服器。Winston AI MCP 伺服器同時提供強大的抄襲檢測功能，協助維護內容完整性。
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

# Winston AI MCP 伺服器 ⚡️

> **Winston AI 的 Model Context Protocol (MCP) 伺服器** — 最精準的 AI 偵測器。輕鬆偵測 AI 生成內容、抄襲並比較文本。

## ✨ 功能特色

### 🔍 AI 文字偵測
- **人類 vs AI 分類**：判斷文字是人類或 AI 撰寫
- **信心分數**：以百分比呈現信心指標
- **句子級分析**：找出最像 AI 的句子
- **多語系支援**：可處理多國語言文字
- **點數消耗**：每字 1 點

### 🖼️ AI 圖像偵測
- **圖像分析**：透過先進機器學習模型偵測 AI 生成圖像
- **中繼資料驗證**：分析圖像的中繼資料與 EXIF
- **浮水印偵測**：識別 AI 浮水印及其發行者
- **多格式支援**：支援 JPG、JPEG、PNG、WEBP
- **點數消耗**：每張 300 點

### 📝 抄襲偵測
- **全網掃描**：與數十億網頁進行比對
- **來源識別**：尋找並列出原始來源
- **詳細報告**：提供完整的抄襲分析報告
- **學術與專業適用**：適合內容驗證
- **點數消耗**：每字 2 點

### 🔄 文字比對
- **相似度分析**：比較兩段文字的相似度
- **字詞級匹配**：詳細顯示匹配內容
- **百分比評分**：提供精確的相似度百分比
- **雙向分析**：進行雙向比較
- **點數消耗**：總字數的一半點數

## 🚀 快速開始

### 先決條件
- Node.js 18+

## 🛠️ 開發

### 使用 npx 執行 🔋

```bash
env WINSTONAI_API_KEY=your-api-key npx -y winston-ai-mcp
```

### 以 stdio 在本地啟動 MCP 伺服器 💻

在專案根目錄建立 `.env` 檔：

```env
WINSTONAI_API_KEY=your_actual_api_key_here
```

```bash
# 下載儲存庫
git clone https://github.com/gowinston-ai/winston-ai-mcp-server.git
cd winston-ai-mcp-server

# 安裝相依套件
npm install

# 編譯並啟動伺服器
npm run mcp-start
```

## 📦 Docker 支援

透過 Docker 建置並執行：

```bash
# 建置映像檔
docker build -t winston-ai-mcp .

# 執行容器
docker run -e WINSTONAI_API_KEY=your_api_key winston-ai-mcp
```

## 📋 可用腳本

- `npm run build` - 將 TypeScript 編譯成 JavaScript
- `npm start` - 啟動 MCP 伺服器
- `npm run mcp-start` - 編譯 TypeScript 並啟動 MCP 伺服器
- `npm run lint` - 執行 ESLint 進行程式碼品質檢查
- `npm run format` - 使用 Prettier 格式化程式碼

## 🔧 設定

### Claude Desktop

在 `claude_desktop_config.json` 中加入：

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

在 Cursor 設定中加入：

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

## 透過 API 存取 MCP 伺服器 🌐

MCP 伺服器部署於 `https://api.gowinston.ai/mcp/v1`，可透過 HTTPS 請求存取。

#### 範例：列出工具

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

#### 範例：AI 文字偵測

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
      "text": "要分析的文字（至少 300 字）",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 範例：AI 圖像偵測

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

#### 範例：抄襲偵測

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
      "text": "要檢查抄襲的文字（至少 100 字）",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 範例：文字比對

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
      "first_text": "第一段文字",
      "second_text": "第二段文字",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

**注意：** 請將 `your-winston-ai-api-key` 替換為您的實際 Winston AI API 金鑰。可於 [https://dev.gowinston.ai](https://dev.gowinston.ai) 取得。

## 📋 API 參考

### AI 文字偵測
```typescript
{
  "text": "要分析的文字（建議 600 字以上）",
  "file": "(選填) 要掃描的檔案。若提供檔案，API 會分析檔案內容。僅支援 .pdf、.doc、.docx。",
  "website": "(選填) 要掃描的網站 URL。網站需為公開可存取頁面。"
}
```

### AI 圖像偵測
```typescript
{
  "url": "https://example.com/image.jpg"
}
```

### 抄襲偵測
```typescript
{
  "text": "要檢查抄襲的文字",
  "language": "zh", // 選填，預設 "en"
  "country": "tw"   // 選填，預設 "us"
}
```

### 文字比對
```typescript
{
  "first_text": "第一段文字",
  "second_text": "第二段文字"
}
```

## 🤝 貢獻

非常歡迎！

1. Fork 此儲存庫
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交修改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 建立 Pull Request

## 📄 授權

本專案採用 MIT 授權，詳見 LICENSE。

## 🔗 相關連結

- **Winston AI MCP NPM 套件**：<https://www.npmjs.com/package/winston-ai-mcp>
- **Winston AI 官方網站**：<https://gowinston.ai>
- **API 文件**：<https://dev.gowinston.ai>
- **MCP 協定**：<https://modelcontextprotocol.io>
- **GitHub 儲存庫**：<https://github.com/gowinston-ai/winston-ai-mcp-server>

## ⭐️ 支援

如果本專案對您有幫助，請到 GitHub 給我們一顆星！

---

**Winston AI 團隊 ❤️ 製作**
