---
name: BrowserStack MCP
digest: BrowserStack MCP 伺服器正式上線！讓您在任何AI系統（包括聊天機器人、應用程式和自主代理）上充分發揮BrowserStack測試平台的強大功能。
author: BrowserStack
homepage: https://www.browserstack.com
repository: https://github.com/browserstack/mcp-server
capabilities:
  resources: true
  tools: true
tags:
  - 測試
  - QA
icon: https://avatars.githubusercontent.com/u/1119453?s=200&v=4
createTime: 2025-04-29
---

# BrowserStack MCP 伺服器

[![BrowserStack](/images/browserstack-mcp-thumbnail.jpg)](https://www.youtube.com/watch?v=sLA7K9v7qZc)

讓團隊中的每位開發者和測試人員都能發揮所長，無論是手動測試、開始自動化旅程，還是擴展測試自動化規模。
BrowserStack MCP 伺服器讓您能直接從喜愛的 AI 工具使用我們尖端的[測試平台](https://www.browserstack.com/test-platform)。

### 為什麼選擇 BrowserStack？

![BrowserStack](/images/browserstack-overview.png)

## 💡 使用範例

### 📱 手動應用程式測試

使用以下指令在 BrowserStack 龐大的真實裝置雲端上測試您的**行動應用程式**。別再用模擬器了！

```bash
# 在特定裝置上開啟應用程式
"在我的iPhone 15 Pro Max上開啟應用程式"

# 除錯應用程式崩潰
"我的應用程式在Android 14裝置上崩潰了，能幫我除錯嗎？"
```

- 與模擬器不同，您可以在真實裝置上測試應用程式的實際效能。透過進階的[應用程式分析功能](https://www.browserstack.com/docs/app-live/app-performance-testing)，您可以即時除錯崩潰和效能問題。
- 從我們的[裝置網格](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)存取所有主要裝置和作業系統版本。我們有嚴格的 SLA，確保在[發佈日](https://www.browserstack.com/blog/browserstack-launches-iphone-15-on-day-0-behind-the-scenes/)就能在全球資料中心提供新發布的裝置。

### 🌐 手動網頁測試

與應用程式測試類似，您可以使用以下指令在 BrowserStack 龐大的真實瀏覽器和裝置雲端上測試您的**網站**。電腦上沒安裝 Edge 瀏覽器？我們幫您搞定！

```bash
# 測試本地網站
"在Edge上開啟我位於localhost:3001的網站"
```

- 跨不同瀏覽器和裝置測試網站。我們支援[所有主要瀏覽器](https://www.browserstack.com/list-of-browsers-and-platforms/live)和主要作業系統。
- 無縫測試本地主機上的網站，無需部署到遠端伺服器！

### 🧪 自動化測試（Playwright、Selenium、無障礙測試等）

使用以下指令在 BrowserStack 的[測試平台](https://www.browserstack.com/test-platform)上執行/除錯/修復您的**自動化測試**。

```bash
# 將測試套件移植到BrowserStack
"在BrowserStack基礎架構上執行我的測試套件"

# 除錯測試失敗
"我的測試套件失敗了，能幫我修復新的失敗嗎？"

# 無障礙測試
"檢查www.mywebsite.com的無障礙問題"
```

- 利用我們業界領先的[測試可觀測性](https://www.browserstack.com/docs/test-observability)功能修復 CI/CD 管道報告的測試失敗。更多資訊請見[這裡](https://www.browserstack.com/docs/test-observability/features/smart-tags)。
- 在 BrowserStack 的[測試平台](https://www.browserstack.com/test-platform)上執行用 Jest、Playwright、Selenium 等編寫的測試
- **無障礙測試**：使用我們的[無障礙測試](https://www.browserstack.com/accessibility-testing)工具確保符合 WCAG 和 ADA 標準

## 🛠️ 安裝

1. **建立 BrowserStack 帳戶**

   - 如果還沒有帳戶，請先[註冊 BrowserStack](https://www.browserstack.com/signup)。

   - ℹ️ 如果您有開源專案，我們可以為您提供[免費方案](https://www.browserstack.com/open-source)。

![開源](/images/browserstack-open-source.png)

- 建立帳戶（並購買合適方案）後，請從[帳戶設定](https://www.browserstack.com/accounts/profile/details)記下您的`username`和`access_key`。

2. 確保使用 Node 版本>= `18.0`。使用`node --version`檢查您的 Node 版本。推薦版本：`v22.15.0` (LTS)
3. **安裝 MCP 伺服器**

   - VSCode（Copilot - 代理模式）：`.vscode/mcp.json`：

   ```json
   {
     "servers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```

   - 在 VSCode 中，確保點擊 MCP 伺服器中的`Start`按鈕來啟動伺服器。
     ![啟動MCP伺服器](/images/browserstack-vscode.png)

   * 對於 Cursor：`.cursor/mcp.json`：

   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```

   - Claude 桌面版：`~/claude_desktop_config.json`：

   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```

## 🤝 推薦的 MCP 客戶端

- 對於自動化測試+除錯使用案例，我們推薦使用**Github Copilot 或 Cursor**。
- 對於手動測試使用案例（即時測試），我們推薦使用**Claude 桌面版**。

## ⚠️ 重要注意事項

- BrowserStack MCP 伺服器正在積極開發中，目前僅支援 MCP 規範的子集。更多功能即將推出。
- 工具調用依賴於 MCP 客戶端，而 MCP 客戶端又依賴於 LLM，因此可能會出現一些非確定性行為，導致意外結果。如有任何建議或反饋，請開立 issue 討論。

## 📝 貢獻

我們歡迎貢獻！請開立 issue 討論您想做的任何更改。
👉 [**點此查看我們的貢獻指南**](https://github.com/browserstack/mcp-server/blob/main/CONTRIBUTING.md)

## 📞 支援

如需支援，請：

- 查看我們的[文件](https://www.browserstack.com/docs)
- 如果遇到與 MCP 伺服器相關的任何問題，請在我們的[GitHub 儲存庫](https://github.com/browserstack/mcp-server)開立 issue。
- 對於其他查詢，請聯繫我們的[支援團隊](https://www.browserstack.com/contact)。

## 🚀 更多功能即將推出

敬請期待令人興奮的更新！有任何建議？請開立 issue 討論。

## 🔗 資源

- [BrowserStack 測試平台](https://www.browserstack.com/test-platform)
- [MCP 協議文件](https://modelcontextprotocol.io)
- [裝置網格](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)
- [無障礙測試](https://www.browserstack.com/accessibility-testing)

## 📄 授權

本專案採用[AGPL-3.0 授權](https://www.gnu.org/licenses/agpl-3.0.html)。
