---
name: Bright Data
digest: 透過Bright Data API存取公開網路資料
author: Bright Data
homepage: https://brightdata.com
repository: https://github.com/luminati-io/brightdata-mcp
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - crawler
  - data-collection
  - api
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
---

官方 Bright Data MCP 伺服器，讓大型語言模型能存取公開網路資料。此伺服器允許 Claude Desktop、Cursor、Windsurf、OpenAI Agents 等 MCP 客戶端根據網路資訊做出決策。

## 功能特色

- **網路資料存取**: 從公開網站與網路服務獲取資訊
- **瀏覽器控制**: 可選的瀏覽器自動化功能，處理複雜網頁互動
- **智慧資料擷取**: 高效處理並回傳相關網頁內容

## 工具集

#### 網路搜尋與爬取

- **search_engine**: 搜尋 Google、Bing 或 Yandex，取得 Markdown 格式結果
- **scrape_as_markdown**: 將網頁內容擷取為 Markdown 格式
- **scrape_as_html**: 將網頁內容擷取為 HTML 格式
- **session_stats**: 檢視當前會話的工具使用統計

#### 結構化資料擷取

- **web_data_amazon_product**: 擷取 Amazon 產品結構化資料
- **web_data_amazon_product_reviews**: 擷取 Amazon 產品評論
- **web_data_linkedin_person_profile**: 擷取 LinkedIn 個人檔案
- **web_data_linkedin_company_profile**: 擷取 LinkedIn 公司檔案

#### 瀏覽器控制工具 (需 BROWSER_AUTH 授權)

- **scraping_browser_navigate**: 導航至指定 URL
- **scraping_browser_go_back**: 返回上一頁
- **scraping_browser_go_forward**: 前往下一頁
- **scraping_browser_links**: 取得當前頁面所有連結
- **scraping_browser_click**: 點擊頁面元素
- **scraping_browser_type**: 在元素中輸入文字
- **scraping_browser_wait_for**: 等待元素出現
- **scraping_browser_screenshot**: 擷取頁面截圖
- **scraping_browser_get_html**: 取得頁面 HTML 內容
- **scraping_browser_get_text**: 取得頁面文字內容

## 設定指南

### 取得 API 金鑰

1. 確保您已註冊[brightdata.com](https://brightdata.com)帳號（新用戶可獲測試用免費額度）
2. 從[用戶設定頁面](https://brightdata.com/cp/setting/users)取得 API 金鑰
3. 在[控制面板](https://brightdata.com/cp/zones)建立名為`mcp_unlocker`的 Web Unlocker 代理區域
   - 可透過環境變數`WEB_UNLOCKER_ZONE`覆寫此設定
4. (選用) 瀏覽器控制工具設定：
   - 在 Brightdata 控制面板建立「scraping browser」區域
   - 從 Scraping Browser 概覽頁複製授權字串

### 搭配 Claude Desktop 使用

將以下設定加入`claude_desktop_config.json`檔案：

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<請在此填入您的API金鑰>",
        "WEB_UNLOCKER_ZONE": "<可選的區域名稱覆寫設定>",
        "BROWSER_AUTH": "<瀏覽器控制工具選用授權>"
      }
    }
  }
}
```

---

## 授權條款

本 MCP 伺服器採用 MIT 授權。您可自由使用、修改與散佈本軟體，惟須遵守 MIT 授權條款。詳細內容請參閱專案儲存庫中的 LICENSE 檔案。
