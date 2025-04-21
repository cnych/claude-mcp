---
name: MarkItDown MCP
digest: MarkItDown-MCP 係一款用 Python 寫嘅工具，專門將檔案同辦公室文件轉換成 Markdown 格式。
author: microsoft
homepage: https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - markdown
  - python
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4
createTime: 2025-04-21
featured: true
---

`markitdown-mcp` 套件提供輕量級 STDIO 同 SSE MCP 伺服器，用嚟呼叫 MarkItDown 功能。

佢提供一個工具：`convert_to_markdown(uri)`，其中 uri 可以係任何 `http:`、`https:`、`file:` 或 `data:` 嘅 URI。

## 安裝

要安裝呢個套件，請用 pip：

```bash
pip install markitdown-mcp
```

## 使用方式

要行 MCP 伺服器（預設用 STDIO），請用以下指令：

```bash
markitdown-mcp
```

要行 MCP 伺服器（用 SSE），請用以下指令：

```bash
markitdown-mcp --sse --host 127.0.0.1 --port 3001
```

## 喺 Docker 入面行

要用 Docker 行 `markitdown-mcp`，請用提供嘅 Dockerfile 建立 Docker 映像：

```bash
docker build -t markitdown-mcp:latest .
```

然後用以下指令執行：

```bash
docker run -it --rm markitdown-mcp:latest
```

咁樣已經足夠處理遠端 URI。要存取本地檔案，你需要將本地目錄掛載到容器入面。例如你想存取 `/home/user/data` 嘅檔案，可以咁行：

```bash
docker run -it --rm -v /home/user/data:/workdir markitdown-mcp:latest
```

掛載之後，data 底下所有檔案都會喺容器嘅 `/workdir` 入面搵到。例如你喺 `/home/user/data` 有個 `example.txt` 檔案，咁喺容器入面就會係 `/workdir/example.txt`。

## 從 Claude Desktop 存取

建議用 Docker 映像嚟行 MCP 伺服器俾 Claude Desktop 用。

跟住[呢啲指示](https://modelcontextprotocol.io/quickstart/user#for-claude-desktop-users)搵 Claude 嘅 `claude_desktop_config.json` 檔案。

編輯佢加入以下 JSON 項目：

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "markitdown-mcp:latest"]
    }
  }
}
```

如果你想掛載目錄，就要相應調整：

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-v",
        "/home/user/data:/workdir",
        "markitdown-mcp:latest"
      ]
    }
  }
}
```

## 除錯

要用 `mcpinspector` 工具嚟除錯 MCP 伺服器。

```bash
npx @modelcontextprotocol/inspector
```

然後你可以透過指定嘅主機同埠（例如 `http://localhost:5173/`）連接到檢查器。

如果用 STDIO：

- 揀 `STDIO` 做傳輸類型
- 輸入 `markitdown-mcp` 做指令
- 撳 `Connect`

如果用 SSE：

- 揀 `SSE` 做傳輸類型
- 輸入 `http://127.0.0.1:3001/sse` 做 URL
- 撳 `Connect`

最後：

- 撳 `Tools` 分頁
- 撳 `List Tools`
- 撳 `convert_to_markdown`
- 對任何有效 URI 執行工具

## 安全考量

伺服器唔支援驗證，會用執行佢嘅使用者權限運行。因此，用 SSE 模式時建議綁定到 `localhost`（預設值）運行。

## 商標

呢個專案可能包含專案、產品或服務嘅商標或標誌。授權使用微軟商標或標誌必須遵守[微軟商標與品牌指南](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general)。喺修改版專案中使用微軟商標或標誌時，不得造成混淆或暗示微軟贊助。任何第三方商標或標誌嘅使用均受該第三方政策約束。
