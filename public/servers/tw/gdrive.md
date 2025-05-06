---
name: Google Drive
digest: 用於 Google Drive 的 Claude MCP 伺服器
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - gdrive
  - google
  - 雲端
icon: https://cdn.simpleicons.org/google
createTime: 2024-12-06T00:00:00Z
---

一個用於 Google Drive 的模型上下文協定伺服器。該伺服器與 Google Drive 整合，允許列出、讀取和搜尋檔案。

## 元件

### 工具

- **search**
  - 在 Google Drive 中搜尋檔案
  - 輸入：`query`（字串）：搜尋查詢
  - 回傳匹配檔案的檔案名稱和 MIME 類型

### 資源

伺服器提供對 Google Drive 檔案的存取：

- **檔案**（`gdrive:///<file_id>`）
  - 支援所有檔案類型
  - Google Workspace 檔案自動匯出為：
    - 文件 → Markdown
    - 試算表 → CSV
    - 簡報 → 純文字
    - 繪圖 → PNG
  - 其他檔案以其原生格式提供

## 入門指南

1. [建立新的 Google Cloud 專案](https://console.cloud.google.com/projectcreate)
2. [啟用 Google Drive API](https://console.cloud.google.com/workspace-api/products)
3. [設定 OAuth 同意畫面](https://console.cloud.google.com/apis/credentials/consent)（測試時選擇"內部"即可）
4. 新增 OAuth 範圍 `https://www.googleapis.com/auth/drive.readonly`
5. [建立 OAuth 用戶端 ID](https://console.cloud.google.com/apis/credentials/oauthclient)，應用程式類型選擇"桌面應用程式"
6. 下載用戶端 OAuth 金鑰的 JSON 檔案
7. 將金鑰檔案重新命名為 `gcp-oauth.keys.json` 並放置在此儲存庫的根目錄（即 `servers/gcp-oauth.keys.json`）

請確保使用 `npm run build` 或 `npm run watch` 建置伺服器。

### 與桌面應用程式整合

要進行身份驗證並儲存憑證：

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"]
    }
  }
}
```

## 授權條款

此 MCP 伺服器依據 MIT 授權條款發布。這表示您可以自由使用、修改與散布本軟體，但需遵守 MIT 授權條款中的相關規定。更多詳細資訊請參閱專案儲存庫中的 LICENSE 檔案。
