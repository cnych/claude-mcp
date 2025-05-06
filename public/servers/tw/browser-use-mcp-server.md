---
name: browser-use-mcp-server
digest: MCP伺服器允許AI代理透過browser-use工具控制網頁瀏覽器，實現自動化網頁互動與任務執行。它為AI提供無縫介面，能高效導覽、操作網頁並擷取資料。
author: co-browser
repository: https://github.com/co-browser/browser-use-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 瀏覽器
  - 自動化
  - browser-use
icon: https://github.com/user-attachments/assets/45bc5bee-418d-4182-94f5-db84b4fc0b3a
createTime: 2025-03-06
featured: true
---

一個讓 AI 代理能透過[browser-use](https://github.com/browser-use/browser-use)控制網頁瀏覽器的 MCP 伺服器。

## 必要條件

- [uv](https://github.com/astral-sh/uv) - 快速 Python 套件管理工具
- [Playwright](https://playwright.dev/) - 瀏覽器自動化框架
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - stdio 模式必備元件

```bash
# 安裝必要套件
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install mcp-proxy
uv tool update-shell
```

## 環境設定

建立`.env`檔案：

```bash
OPENAI_API_KEY=您的API金鑰
CHROME_PATH=選填/chrome/路徑
PATIENT=false  # 設為true可讓API呼叫等待任務完成
```

## 安裝步驟

```bash
# 安裝相依套件
uv sync
uv pip install playwright
uv run playwright install --with-deps --no-shell chromium
```

## 使用方式

### SSE 模式

```bash
# 直接從原始碼執行
uv run server --port 8000
```

### stdio 模式

```bash
# 1. 建置並全域安裝
uv build
uv tool uninstall browser-use-mcp-server 2>/dev/null || true
uv tool install dist/browser_use_mcp_server-*.whl

# 2. 使用stdio傳輸模式執行
browser-use-mcp-server run server --port 8000 --stdio --proxy-port 9000
```

## 客戶端設定

### SSE 模式客戶端設定

```json
{
  "mcpServers": {
    "browser-use-mcp-server": {
      "url": "http://localhost:8000/sse"
    }
  }
}
```

### stdio 模式客戶端設定

```json
{
  "mcpServers": {
    "browser-server": {
      "command": "browser-use-mcp-server",
      "args": [
        "run",
        "server",
        "--port",
        "8000",
        "--stdio",
        "--proxy-port",
        "9000"
      ],
      "env": {
        "OPENAI_API_KEY": "您的API金鑰"
      }
    }
  }
}
```

### 設定檔路徑

| 客戶端           | 設定檔路徑                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Cursor           | `./.cursor/mcp.json`                                              |
| Windsurf         | `~/.codeium/windsurf/mcp_config.json`                             |
| Claude (Mac)     | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude (Windows) | `%APPDATA%\Claude\claude_desktop_config.json`                     |

## 功能特色

- [x] **瀏覽器自動化**：透過 AI 代理控制瀏覽器
- [x] **雙傳輸協議**：支援 SSE 與 stdio 通訊協定
- [x] **VNC 串流**：即時觀看瀏覽器自動化過程
- [x] **非同步任務**：非同步執行瀏覽器操作

## 本地開發

進行本地開發與測試：

1. 建置可分發的 wheel 套件：

   ```bash
   # 在專案根目錄執行
   uv build
   ```

2. 安裝為全域工具：

   ```bash
   uv tool uninstall browser-use-mcp-server 2>/dev/null || true
   uv tool install dist/browser_use_mcp_server-*.whl
   ```

3. 從任意目錄執行：

   ```bash
   # 設定當前工作階段的OpenAI API金鑰
   export OPENAI_API_KEY=您的API金鑰

   # 或直接內嵌金鑰執行單次任務
   OPENAI_API_KEY=您的API金鑰 browser-use-mcp-server run server --port 8000 --stdio --proxy-port 9000
   ```

4. 修改後重新建置安裝：
   ```bash
   uv build
   uv tool uninstall browser-use-mcp-server
   uv tool install dist/browser_use_mcp_server-*.whl
   ```

## Docker 容器化

使用 Docker 可提供穩定且隔離的執行環境。

```bash
# 建置Docker映像檔
docker build -t browser-use-mcp-server .

# 執行容器（預設VNC密碼為"browser-use"）
# --rm參數確保容器停止時自動移除
# -p 8000:8000 映射伺服器埠
# -p 5900:5900 映射VNC埠
docker run --rm -p8000:8000 -p5900:5900 browser-use-mcp-server

# 使用自訂VNC密碼（從檔案讀取）
# 建立密碼檔案（例如vnc_password.txt）僅包含密碼
echo "您的安全密碼" > vnc_password.txt
# 將密碼檔案以secret形式掛載至容器內
docker run --rm -p8000:8000 -p5900:5900 \
  -v $(pwd)/vnc_password.txt:/run/secrets/vnc_password:ro \
  browser-use-mcp-server
```

### VNC 檢視器

```bash
# 瀏覽器版檢視器
git clone https://github.com/novnc/noVNC
cd noVNC
./utils/novnc_proxy --vnc localhost:5900
```

預設密碼：`browser-use`（除非使用自訂密碼方法覆寫）

![VNC畫面截圖](https://github.com/user-attachments/assets/45bc5bee-418d-4182-94f5-db84b4fc0b3a)

![VNC畫面截圖](https://github.com/user-attachments/assets/7db53f41-fc00-4e48-8892-f7108096f9c4)

## 範例操作

嘗試對您的 AI 下達指令：

```text
開啟 https://news.ycombinator.com 並回傳排名第一的文章
```
