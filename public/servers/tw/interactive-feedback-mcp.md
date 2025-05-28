---
name: Interactive Feedback MCP
digest: MCP 伺服器為 Cursor、Cline 和 Windsurf 等 AI 開發工具實現了「人在迴路」工作流程。它允許在開發過程中執行命令、查看輸出並直接向 AI 系統提供文字回饋。
author: noopstudios
homepage: https://github.com/noopstudios/interactive-feedback-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - server
  - workflow
icon: https://avatars.githubusercontent.com/u/74713198?v=4
createTime: 2025-05-09
---
這是一個簡單的 [MCP 伺服器](https://modelcontextprotocol.io/)，可在 [Cursor](https://www.cursor.com) 等 AI 輔助開發工具中實現「人在迴路」工作流程。該伺服器允許您執行命令、查看其輸出並直接向 AI 提供文字回饋。它還兼容 [Cline](https://cline.bot) 和 [Windsurf](https://windsurf.com)。

![互動回饋介面 - 主視圖](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-1a5be5d2.jpg?raw=true)
![互動回饋介面 - 命令區塊展開](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-051f81d1.jpg)

## 提示工程

為獲得最佳效果，請將以下內容添加到 AI 助手的自訂提示中，您可以將其添加到規則中或直接寫入提示（例如在 Cursor 中）：

> 當您想提問時，請始終調用 MCP 的 `interactive_feedback`。  
> 當您即將完成用戶請求時，請調用 MCP 的 `interactive_feedback` 而不是直接結束流程。
> 持續調用 MCP 直到用戶回饋為空，然後結束請求。

## 為什麼使用這個？
通過引導助手與用戶確認，而不是進行推測性的高成本工具調用，此模組可以大幅減少在 Cursor 等平台上的高級請求（例如 OpenAI 工具調用）數量。在某些情況下，它可以將多達 25 次工具調用整合為單一回饋感知的請求，從而節省資源並提升效能。

## 配置

此 MCP 伺服器使用 Qt 的 `QSettings` 來存儲基於每個項目的配置。這包括：
*   要運行的命令。
*   是否在下一次啟動時自動執行該項目的命令（參見「下次運行時自動執行」核取方塊）。
*   命令區塊的可見狀態（顯示/隱藏）（切換時會立即保存）。
*   視窗幾何形狀和狀態（一般 UI 偏好）。

這些設置通常存儲在平台特定的位置（例如 Windows 的註冊表、macOS 的 plist 文件、Linux 的 `~/.config` 或 `~/.local/share` 中的配置文件），組織名稱為 "FabioFerreira"，應用程序名稱為 "InteractiveFeedbackMCP"，並為每個項目目錄設置唯一的群組。

## 安裝（Cursor）

![在 Cursor 中安裝](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-060e8911.jpg?raw=true)

1.  **先決條件：**
    *   Python 3.11 或更新版本。
    *   [uv](https://github.com/astral-sh/uv)（Python 套件管理器）。安裝方法：
        *   Windows：`pip install uv`
        *   Linux/Mac：`curl -LsSf https://astral.sh/uv/install.sh | sh`
2.  **獲取代碼：**
    *   克隆此存儲庫：
        `git clone https://github.com/noopstudios/interactive-feedback-mcp.git`
    *   或下載源代碼。
3.  **導航到目錄：**
    *   `cd path/to/interactive-feedback-mcp`
4.  **安裝依賴項：**
    *   `uv sync`（這會創建一個虛擬環境並安裝套件）
5.  **運行 MCP 伺服器：**
    *   `uv run server.py`
6.  **在 Cursor 中配置：**
    *   **手動配置（例如通過 `mcp.json`）**
        **請記得將 `/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp` 路徑更改為您系統上克隆存儲庫的實際路徑。**

        ```json
        {
          "mcpServers": {
            "interactive-feedback-mcp": {
              "command": "uv",
              "args": [
                "--directory",
                "/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp",
                "run",
                "server.py"
              ],
              "timeout": 600,
              "autoApprove": [
                "interactive_feedback"
              ]
            }
          }
        }
        ```

### 適用於 Cline / Windsurf

適用類似的設置原則。您需要在相應工具的 MCP 設置中配置伺服器命令（例如 `uv run server.py` 並帶有指向項目目錄的正確 `--directory` 參數），並使用 `interactive-feedback-mcp` 作為伺服器標識符。

## 開發

要在開發模式下運行伺服器並使用網頁介面進行測試：

```sh
uv run fastmcp dev server.py
```

## 可用工具

以下是 AI 助手調用 `interactive_feedback` 工具的示例：

```xml
<use_mcp_tool>
  <server_name>interactive-feedback-mcp</server_name>
  <tool_name>interactive_feedback</tool_name>
  <arguments>
    {
      "project_directory": "/path/to/your/project",
      "summary": "我已實施您請求的更改並重構了主模組。"
    }
  </arguments>
</use_mcp_tool>
```