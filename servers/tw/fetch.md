---
name: Fetch MCP 伺服器
digest: Fetch 提供網頁內容擷取功能
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/fetch
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - fetch
createTime: 2024-12-01T00:00:00Z
---

一個提供網頁內容擷取功能的 Model Context Protocol 伺服器。該伺服器使 LLMs 能夠擷取和處理網頁內容，將 HTML 轉換為更易於使用的 markdown 格式。

fetch 工具會截斷回應，但透過使用`start_index`參數，你可以指定從哪裡開始擷取內容。這讓模型可以分塊讀取網頁，直到找到所需的資訊。

### 可用工具

- `fetch` - 從網際網路擷取 URL 並提取其內容為 markdown 格式。
  - `url` (字串，必填): 要擷取的 URL
  - `max_length` (整數，選填): 回傳的最大字元數(預設:5000)
  - `start_index` (整數，選填): 從此字元索引開始擷取內容(預設:0)
  - `raw` (布林值，選填): 擷取原始內容而不轉換為 markdown(預設:false)

### 提示詞

- **fetch**
  - 擷取 URL 並提取其內容為 markdown 格式
  - 參數:
    - `url` (字串，必填): 要擷取的 URL

## 安裝

選用:安裝 node.js，這將使 fetch 伺服器使用更穩健的 HTML 簡化器。

### 使用 uv(推薦)

使用[`uv`](https://docs.astral.sh/uv/)時不需要特定安裝。我們將使用[`uvx`](https://docs.astral.sh/uv/guides/tools/)直接執行*mcp-server-fetch*。

### 使用 PIP 安裝

或者你也可以透過 pip 安裝 `mcp-server-fetch`：

```
pip install mcp-server-fetch
```

安裝完成後，您可以透過以下指令執行：

```
python -m mcp_server_fetch
```

## 設定

### 設定為 Claude.app

將以下內容加入你的 Claude 設定中：

<details>
<summary>使用 uvx</summary>

```json
"mcpServers": {
  "fetch": {
    "command": "uvx",
    "args": ["mcp-server-fetch"]
  }
}
```

</details>

<details>
<summary>使用 pip 安装</summary>

```json
"mcpServers": {
  "fetch": {
    "command": "python",
    "args": ["-m", "mcp_server_fetch"]
  }
}
```

</details>

### 定制 - robots.txt

預設情況下,伺服器會遵守網站的 robots.txt 文件,如果請求來自模型(透過工具),但不是來自用戶(透過提示),則不會遵守。你可以透過在配置中添加`--ignore-robots-txt`參數來禁用此功能。

### 定制 - User-agent

預設情況下,根據請求來自模型(透過工具)還是來自用戶(透過提示),伺服器將使用以下用戶代理:

```
ModelContextProtocol/1.0 (Autonomous; +https://github.com/modelcontextprotocol/servers)
```

或者

```
ModelContextProtocol/1.0 (User-Specified; +https://github.com/modelcontextprotocol/servers)
```

你可以透過在配置中添加`--user-agent=YourUserAgent`參數來自訂。

## 調試

你可以使用 MCP 檢查器來調試伺服器。對於 uvx 安裝:

```
npx @modelcontextprotocol/inspector uvx mcp-server-fetch
```

或者如果你在特定目錄中安裝了包或在開發中:

```
cd path/to/servers/src/fetch
npx @modelcontextprotocol/inspector uv run mcp-server-fetch
```

## 貢獻

我們鼓勵貢獻來幫助擴展和改進 mcp-server-fetch。無論你是想添加新工具、增強現有功能還是改進文件,你的輸入都是寶貴的。

有關其他 MCP 伺服器和實現模式的示例,請參見:
[https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)

我們歡迎貢獻!請隨時貢獻新想法、錯誤修復或增強功能,使 mcp-server-fetch 更加強大和有用。

## License

mcp-server-fetch 根據 MIT 許可證授權。這意味著你可以自由使用、修改和分發軟體,但需遵守 MIT 許可證的條款和條件。更多詳情請參見專案倉庫中的 LICENSE 文件。
