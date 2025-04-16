---
name: Perplexity Ask MCP Server
digest: 一個整合Sonar API的MCP伺服器，賦予Claude即時、全網範圍的研究能力，使其能獲取最新線上資訊以提供全面且準確的回應。
author: ppl-ai
homepage: https://github.com/ppl-ai/modelcontextprotocol
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - 網路
  - docker
icon: https://avatars.githubusercontent.com/u/110299016?v=4
createTime: 2025-03-11
---

一個整合 Sonar API 的 MCP 伺服器實現，為 Claude 提供無與倫比的即時全網研究能力。

![示範](/images/perplexity_demo_screenshot.png)

## 工具

- **perplexity_ask**
  - 與 Sonar API 進行對話以進行即時網路搜尋。
  - **輸入:**
    - `messages` (陣列): 對話訊息的陣列。
      - 每條訊息必須包含:
        - `role` (字串): 訊息的角色 (例如 `system`, `user`, `assistant`)。
        - `content` (字串): 訊息的內容。

## 配置

### 步驟 1:

克隆此儲存庫:

```bash
git clone git@github.com:ppl-ai/modelcontextprotocol.git
```

進入 `perplexity-ask` 目錄並安裝必要的依賴項:

```bash
cd modelcontextprotocol/perplexity-ask && npm install
```

### 步驟 2: 獲取 Sonar API 金鑰

1. 註冊 [Sonar API 帳戶](https://docs.perplexity.ai/guides/getting-started)。
2. 按照帳戶設定說明，從開發者儀表板生成您的 API 金鑰。
3. 將 API 金鑰設定為環境變數 `PERPLEXITY_API_KEY`。

### 步驟 3: 配置 Claude 桌面版

1. 下載 Claude 桌面版 [此處](https://claude.ai/download)。

2. 將以下內容添加到您的 `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PERPLEXITY_API_KEY",
        "mcp/perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "您的API金鑰"
      }
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "perplexity-ask": {
      "command": "npx",
      "args": ["-y", "server-perplexity-ask"],
      "env": {
        "PERPLEXITY_API_KEY": "您的API金鑰"
      }
    }
  }
}
```

您可以透過以下方式存取該檔案:

```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 步驟 4: 構建 Docker 映像

Docker 構建:

```bash
docker build -t mcp/perplexity-ask:latest -f Dockerfile .
```

### 步驟 5: 測試

確保 Claude 桌面版能識別我們在 `perplexity-ask` 伺服器中暴露的兩個工具。您可以透過尋找錘子圖示來確認:

![Claude視覺工具](/images/perplexity-visual-indicator-mcp-tools.png)

點擊錘子圖示後，您應該能看到與檔案系統 MCP 伺服器一起提供的工具:

![可用整合](/images/perplexity_available_tools.png)

### 步驟 6: 進階參數

目前使用的搜尋參數是預設值。您可以直接在 `index.ts` 腳本中修改 API 呼叫中的任何搜尋參數。為此，請參考官方 [API 文件](https://docs.perplexity.ai/api-reference/chat-completions)。

### 疑難排解

Claude 文件提供了優秀的 [疑難排解指南](https://modelcontextprotocol.io/docs/tools/debugging) 供您參考。不過，您仍可以透過 api@perplexity.ai 聯繫我們以獲得額外支援，或 [提交錯誤報告](https://github.com/ppl-ai/api-discussion/issues)。

## 授權

此 MCP 伺服器採用 MIT 授權。這意味著您可以自由使用、修改和分發該軟體，但需遵守 MIT 授權的條款和條件。更多詳情，請參閱專案儲存庫中的 LICENSE 檔案。
