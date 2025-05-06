---
name: Deepwiki MCP Server
digest: 📖 获取 deepwiki.com 内容并转换为 LLM 可读的 markdown
author: regenrek
repository: https://github.com/regenrek/deepwiki-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - deepwiki
  - markdown
  - api
icon: https://avatars.githubusercontent.com/u/5182020?v=4
createTime: 2025-04-28
---

這是一個**非官方的 Deepwiki MCP 伺服器**

它透過 [MCP](/tw) 接收 Deepwiki 網址，爬取所有相關頁面，將其轉換為 Markdown 格式，並返回單一文檔或按頁面分類的清單。

## 功能

- **網域安全性**：僅處理來自 deepwiki.com 的網址
- **HTML 淨化**：移除頁首、頁尾、導覽列、腳本與廣告
- **連結重寫**：調整連結以在 Markdown 中正常運作
- **多種輸出格式**：取得單一文檔或結構化頁面資料
- **高效能**：可調整並發數與深度的快速爬取

## 使用方式

```
{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki"]
    }
  }
}
```

### MCP 工具整合

此套件註冊了一個名為`deepwiki_fetch`的工具，可與任何 MCP 相容客戶端搭配使用：

```json
{
  "action": "deepwiki_fetch",
  "params": {
    "url": "https://deepwiki.com/user/repo",
    "mode": "aggregate",
    "maxDepth": "1"
  }
}
```

#### 參數

- `url`（必填）：Deepwiki 儲存庫的起始網址
- `mode`（選填）：輸出模式，"aggregate"表示單一 Markdown 文件（預設），"pages"表示結構化頁面資料
- `maxDepth`（選填）：爬取頁面的最大深度（預設：10）

### 回應格式

#### 成功回應（Aggregate 模式）

```json
{
  "status": "ok",
  "data": "# 頁面標題\n\n頁面內容...\n\n---\n\n# 另一頁面\n\n更多內容...",
  "totalPages": 5,
  "totalBytes": 25000,
  "elapsedMs": 1200
}
```

#### 成功回應（Pages 模式）

```json
{
  "status": "ok",
  "data": [
    {
      "path": "index",
      "markdown": "# 首頁\n\n歡迎來到儲存庫。"
    },
    {
      "path": "section/page1",
      "markdown": "# 第一頁\n\n這是第一頁的內容。"
    }
  ],
  "totalPages": 2,
  "totalBytes": 12000,
  "elapsedMs": 800
}
```

#### 錯誤回應

```json
{
  "status": "error",
  "code": "DOMAIN_NOT_ALLOWED",
  "message": "僅允許deepwiki.com網域"
}
```

#### 部分成功回應

```json
{
  "status": "partial",
  "data": "# 頁面標題\n\n頁面內容...",
  "errors": [
    {
      "url": "https://deepwiki.com/user/repo/page2",
      "reason": "HTTP錯誤：404"
    }
  ],
  "totalPages": 1,
  "totalBytes": 5000,
  "elapsedMs": 950
}
```

### 進度事件

使用工具時，爬取過程中會收到進度事件：

```
已取得 https://deepwiki.com/user/repo：12500位元組，耗時450ms（狀態：200）
已取得 https://deepwiki.com/user/repo/page1：8750位元組，耗時320ms（狀態：200）
已取得 https://deepwiki.com/user/repo/page2：6200位元組，耗時280ms（狀態：200）
```

## 本地開發 - 安裝

### 本地使用

```
{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "node",
      "args": ["./bin/cli.mjs"]
    }
  }
}
```

### 從原始碼安裝

```bash
# 複製儲存庫
git clone https://github.com/regenrek/mcp-deepwiki.git
cd mcp-deepwiki

# 安裝相依套件
npm install

# 建置套件
npm run build
```

#### 直接 API 呼叫

若使用 HTTP 傳輸，可直接呼叫 API：

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "req-1",
    "action": "deepwiki_fetch",
    "params": {
      "url": "https://deepwiki.com/user/repo",
      "mode": "aggregate"
    }
  }'
```

## 設定

### 環境變數

- `DEEPWIKI_MAX_CONCURRENCY`：最大並發請求數（預設：5）
- `DEEPWIKI_REQUEST_TIMEOUT`：請求逾時時間（毫秒，預設：30000）
- `DEEPWIKI_MAX_RETRIES`：失敗請求的最大重試次數（預設：3）
- `DEEPWIKI_RETRY_DELAY`：重試退避基礎延遲（毫秒，預設：250）

若要設定這些變數，請在專案根目錄建立`.env`檔案：

```
DEEPWIKI_MAX_CONCURRENCY=10
DEEPWIKI_REQUEST_TIMEOUT=60000
DEEPWIKI_MAX_RETRIES=5
DEEPWIKI_RETRY_DELAY=500
```

## Docker 部署（未測試）

建置並執行 Docker 映像：

```bash
# 建置映像
docker build -t mcp-deepwiki .

# 以stdio傳輸執行（開發用）
docker run -it --rm mcp-deepwiki

# 以HTTP傳輸執行（生產用）
docker run -d -p 3000:3000 mcp-deepwiki --http --port 3000

# 帶環境變數執行
docker run -d -p 3000:3000 \
  -e DEEPWIKI_MAX_CONCURRENCY=10 \
  -e DEEPWIKI_REQUEST_TIMEOUT=60000 \
  mcp-deepwiki --http --port 3000
```

## 開發

```bash
# 安裝相依套件
pnpm install

# 以stdio模式執行開發版本
pnpm run dev-stdio

# 執行測試
pnpm test

# 執行程式碼檢查
pnpm run lint

# 建置套件
pnpm run build
```

## 疑難排解

### 常見問題

1. **權限不足**：若執行 CLI 時出現 EACCES 錯誤，請確保二進位檔具有可執行權限：

   ```bash
   chmod +x ./node_modules/.bin/mcp-deepwiki
   ```

2. **連線被拒**：確認連接埠可用且未被防火牆阻擋：

   ```bash
   # 檢查連接埠是否被佔用
   lsof -i :3000
   ```

3. **逾時錯誤**：對於大型儲存庫，建議增加逾時時間與並發數：
   ```
   DEEPWIKI_REQUEST_TIMEOUT=60000 DEEPWIKI_MAX_CONCURRENCY=10 npx mcp-deepwiki
   ```

## 授權條款

MIT
