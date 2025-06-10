---
name: Debugg AI MCP
digest: AI驅動的瀏覽器自動化與端對端測試伺服器
author: Debugg AI
homepage: https://debugg.ai
repository: https://github.com/debugg-ai/debugg-ai-mcp
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - 測試
  - 自動化
  - 瀏覽器
icon: https://avatars.githubusercontent.com/u/203699926?s=48&v=4
createTime: 2025-06-02
---

# 🧪 Debugg AI 官方 MCP 伺服器

**AI 驅動的瀏覽器自動化與端對端測試伺服器**，實作[模型情境協定(MCP)](/)，幫助 AI 代理測試 UI 變更、模擬使用者行為，並分析運行中網頁應用的視覺輸出——全部透過自然語言與 CLI 工具完成。

端對端測試曾經是場惡夢。不僅設定困難，隨著應用程式變更，管理更是麻煩。

Debugg AI 的 MCP 伺服器提供**全新測試方式**，您無需擔心設定 Playwright、本地瀏覽器或代理伺服器，完全遠端管理的瀏覽器只需透過安全通道連接到本地或遠端運行的伺服器。

這意味著測試運行時不會有煩人的 Chrome 彈窗，無需管理 Chrome 或 Playwright 版本，最重要的是——**零配置**。只需取得 API 金鑰並將我們加入您的 MCP 伺服器清單。

若您後續想重新運行這些測試，或在 CI/CD 流程中建立測試套件，您可以在儀表板查看所有歷史測試結果——[Debugg.AI 應用](https://debugg.ai)

---

## 🚀 功能特色

- 🧠 **MCP 協定支援**
  完整 MCP 伺服器實作，包含 CLI 與工具註冊支援。

- 🧪 **端對端測試自動化**
  透過`debugg_ai_test_page_changes`工具，基於使用者故事或自然語言描述觸發 UI 測試。

- 🌐 **本地網頁應用整合**
  在任何`localhost`連接埠測試您正在開發的應用，模擬使用者流程。

- 🧾 **MCP 工具通知**
  透過步驟描述與 UI 狀態目標，即時傳送進度更新給客戶端。

- 🧷 **螢幕截圖支援**
  為 LLM 捕捉頁面的最終視覺狀態，支援影像渲染。

- 🧱 **標準輸入輸出伺服器相容**
  透過 stdin/stdout 連接任何 MCP 相容客戶端(如 Claude Desktop、LangChain 代理等)。

---

## 範例

### 輸入提示："測試建立帳號與登入功能"

![測試建立帳號與登入](https://static-debugg-ai.s3.us-east-2.amazonaws.com/test-create-account-login.gif)

### 結果:

    **任務完成**

    - 耗時: 86.80秒
    - 最終結果: 成功使用電子郵件'alice.wonderland1234@example.com'完成帳號註冊與登入。
    - 狀態: 成功

### 完整示範:

> 觀看更深入的[完整使用案例示範](https://debugg.ai/demo)

---

## 🛠️ 快速開始

### 請先建立免費帳號並產生 API 金鑰 - [DebuggAI](https://debugg.ai)

### 選項 1: NPX (本地開發)

```bash
npx -y @debugg-ai/debugg-ai-mcp
```

建議在測試或整合至 Claude Desktop 等工具時使用。

### 選項 2: Docker

```bash
docker run -i --rm --init \
  -e DEBUGGAI_API_KEY=your_api_key \
  -e TEST_USERNAME_EMAIL=your_test_email \
  -e TEST_USER_PASSWORD=your_password \
  -e DEBUGGAI_LOCAL_PORT=3000 \
  -e DEBUGGAI_LOCAL_REPO_NAME=your-org/your-repo \
  -e DEBUGGAI_LOCAL_BRANCH_NAME=main \
  -e DEBUGGAI_LOCAL_REPO_PATH=/app \
  -e DEBUGGAI_LOCAL_FILE_PATH=/app/index.ts \
  quinnosha/debugg-ai-mcp
```

---

## 🧰 MCP 工具: `debugg_ai_test_page_changes`

### 描述

對運行中的網頁應用進行端對端測試，驗證以自然語言描述的 UI 功能或流程。讓任何程式碼生成平台中的 AI 代理能快速評估建議變更，確保新功能如預期運作。

### 輸入參數

| 名稱          | 類型 | 必填 | 說明                                 |
| ------------- | ---- | ---- | ------------------------------------ |
| `description` | 字串 | ✅   | 要測試的功能或頁面(如"註冊頁面表單") |
| `localPort`   | 數字 | ❌   | 應用運行的連接埠(預設:`3000`)        |
| `repoName`    | 字串 | ❌   | GitHub 儲存庫名稱                    |
| `branchName`  | 字串 | ❌   | 目前分支                             |
| `repoPath`    | 字串 | ❌   | 儲存庫的絕對路徑                     |
| `filePath`    | 字串 | ❌   | 要測試的檔案                         |

---

## 🧪 Claude Desktop 設定範例

```jsonc
{
  "mcpServers": {
    "debugg-ai-mcp": {
      "command": "npx",
      "args": ["-y", "@debugg-ai/debugg-ai-mcp"],
      "env": {
        "DEBUGGAI_API_KEY": "YOUR_API_KEY",
        "TEST_USERNAME_EMAIL": "test@example.com",
        "TEST_USER_PASSWORD": "supersecure",
        "DEBUGGAI_LOCAL_PORT": 3000,
        "DEBUGGAI_LOCAL_REPO_NAME": "org/project",
        "DEBUGGAI_LOCAL_BRANCH_NAME": "main",
        "DEBUGGAI_LOCAL_REPO_PATH": "/Users/you/project",
        "DEBUGGAI_LOCAL_FILE_PATH": "/Users/you/project/index.ts"
      }
    }
  }
}
```

---

## 🔐 環境變數

| 變數名稱                     | 說明                          | 必填 |
| ---------------------------- | ----------------------------- | ---- |
| `DEBUGGAI_API_KEY`           | 呼叫 DebuggAI 後端的 API 金鑰 | ✅   |
| `TEST_USERNAME_EMAIL`        | 測試帳號電子郵件              | ❌   |
| `TEST_USER_PASSWORD`         | 測試帳號密碼                  | ❌   |
| `DEBUGGAI_LOCAL_PORT`        | 本地應用運行的連接埠          | ✅   |
| `DEBUGGAI_LOCAL_REPO_NAME`   | GitHub 儲存庫名稱             | ❌   |
| `DEBUGGAI_LOCAL_BRANCH_NAME` | 分支名稱                      | ❌   |
| `DEBUGGAI_LOCAL_REPO_PATH`   | 儲存庫根目錄的本地路徑        | ❌   |
| `DEBUGGAI_LOCAL_FILE_PATH`   | 要測試的檔案路徑              | ❌   |

---

## 🧑‍💻 本地開發

```bash
# 複製儲存庫並安裝依賴
npm install

# 複製測試設定檔並填入憑證
cp test-config-example.json test-config.json

# 本地運行MCP伺服器
npx @modelcontextprotocol/inspector --config debugg-ai-mcp/test-config.json --server debugg-ai-mcp
```

---

## 📁 儲存庫結構

```
.
├── e2e-agents/             # 端對端瀏覽器測試執行器
├── services/               # DebuggAI API客戶端
├── tunnels /               # 遠端瀏覽器的安全連接
├── index.ts                # 主要MCP伺服器入口
├── Dockerfile              # Docker建置設定
└── README.md
```

---

## 🧱 技術基礎

- [模型情境協定 SDK](https://github.com/modelcontextprotocol)

---

## 💬 意見回饋與問題

如需回報錯誤、提供想法或整合協助，請開立 issue 或直接聯繫 DebuggAI 團隊。

---

## 🔒 授權條款

MIT 授權 © 2025 DebuggAI

---

<p style="padding-top: 20px; text-align: center;">於舊金山以🩸、💦與😭打造</p>
