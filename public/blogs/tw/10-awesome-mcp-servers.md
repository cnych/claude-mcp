---
title: 10 個值得關注嘅 MCP Server
excerpt: MCP（Model Context Protocol）伺服器令AI模型同現實世界嘅數據、工具無縫連接。無論你係開發者、AI愛好者，定係希望提升自動化效率嘅企業用戶，呢10個MCP Server都值得一試！
date: 2025-04-28
slug: 10-awesome-mcp-servers
coverImage: https://static.claudemcp.com/images/blog/mcp-servers-10awesome-cn.jpg
featured: true
author:
  name: 陽明
  avatar: https://static.claudemcp.com/images/avatars/yangming.png
category: 技術
---

[MCP（Model Context Protocol）](/zh)伺服器令 AI 模型同各種工具、平台無縫集成，極大拓展咗 AI 嘅實際應用場景。以下係我哋精心挑選嘅 10 個有代表性嘅 MCP Server，覆蓋設計、自動化、SEO、支付、內容管理等多個領域。

---

## 1. SEO MCP Server

SEO MCP Server 專為 SEO 優化場景打造，AI 可自動分析網站結構、關鍵詞分佈、外鏈情況等，幫助站長同運營人員提升網站排名。

- 支援站點抓取、關鍵詞分析、外鏈監控
- 可生成 SEO 優化建議報告
- 典型應用：網站 SEO 體檢、內容優化、競品分析

* 詳細介紹請參考 [SEO MCP Server](/zh/servers/seo-mcp)
* 倉庫地址：[https://github.com/cnych/seo-mcp](https://github.com/cnych/seo-mcp)

## 2. Context7 MCP Server

Context7 MCP Server 係一個為大語言模型同 AI 代碼編輯器提供最新文檔嘅 MCP 伺服器。

大語言模型依賴關於你使用庫嘅過時或通用信息。你將面臨：

- ❌ 代碼示例基於一年前嘅訓練數據，已經過時
- ❌ 虛構嘅 API 根本唔存在
- ❌ 針對舊版軟件包嘅通用回答

✅ 使用 Context7 嘅優勢

Context7 MCP 直接從源頭獲取最新、特定版本嘅文檔同代碼示例，並將其直接注入你嘅提示詞中。

喺 Cursor 嘅提示詞中添加 use context7：

```bash
創建一個使用 app router 嘅基礎 Next.js 項目。use context7
```

Context7 會將最新代碼示例同文檔直接送入大語言模型嘅上下文。

- 1️⃣ 自然編寫你嘅提示詞
- 2️⃣ 添加 use context7 指令
- 3️⃣ 獲取可運行嘅代碼答案

* 詳細介紹請參考 [Context7 MCP Server](/zh/servers/context7)
* 倉庫地址：[https://github.com/upstash/context7](https://github.com/upstash/context7)

---

## 3. Figma Context MCP Server

Figma Context MCP Server 令 AI 能夠直接同 Figma 設計工具對接，實現設計稿嘅自動分析、批量修改、組件提取等操作。適合設計團隊、產品經理同開發者協作場景。

- 支援讀取、分析 Figma 文件結構
- 可自動生成設計文檔、批量導出資源
- 典型應用：設計自動化、UI 資產管理、設計評審輔助

* 詳細介紹請參考 [Figma Context MCP Server](/zh/servers/figma-context-mcp)
* 倉庫地址：[https://github.com/glips/figma-context-mcp](https://github.com/glips/figma-context-mcp)

---

## 4. Blender MCP Server

Blender MCP Server 令 AI 同 3D 建模工具 Blender 無縫集成，實現自動建模、渲染、動畫生成等功能。適合 3D 設計師、動畫製作團隊。

- 支援模型導入導出、參數化建模、批量渲染
- 可自動生成動畫腳本
- 典型應用：3D 資產批量生成、動畫自動化、虛擬場景搭建

* 詳細介紹請參考 [Blender MCP Server](/zh/servers/blender-mcp)
* 倉庫地址：[https://github.com/ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)

---

## 5. Windows 控制 MCP Server

Windows 控制 MCP Server 令 AI 具備遠程操作 Windows 系統嘅能力，包括窗口管理、鼠標鍵盤模擬、屏幕截圖等。適合自動化測試、遠程運維、桌面自動化場景。

- 支援窗口聚焦、移動、縮放
- 模擬鼠標點擊、鍵盤輸入
- 支援剪貼板操作、屏幕捕獲

* 詳細介紹請參考 [Windows 控制 MCP Server](/zh/servers/MCPControl)
* 倉庫地址：[https://github.com/Cheffromspace/MCPControl](https://github.com/Cheffromspace/MCPControl)

---

## 6. Browser-use MCP Server

Browser-use MCP Server 令 AI 能夠自動化操作瀏覽器，實現網頁抓取、表單填寫、自動化測試等功能。適合數據採集、RPA、自動化辦公。

- 支援多標籤頁管理、頁面元素操作
- 可自動化登錄、數據提交、內容抓取
- 典型應用：自動化測試、網頁監控、信息採集

* 詳細介紹請參考 [Browser-use MCP Server](/zh/servers/browser-use-mcp-server)
* 倉庫地址：[https://github.com/co-browser/browser-use-mcp-server](https://github.com/co-browser/browser-use-mcp-server)

---

## 7. Zapier MCP Server

Zapier MCP Server 令 AI 同 Zapier 平台集成，自動觸發同管理各種自動化工作流。適合需要跨平台自動化嘅企業同個人。

- 支援觸發 Zapier 上嘅各種自動化任務
- 可同數百種 SaaS 工具聯動
- 典型應用：自動化郵件、日程同步、數據同步

* 詳細介紹請參考 [Zapier MCP Server](/zh/servers/zapier)
* 項目主頁：[https://zapier.com/mcp](https://zapier.com/mcp)

---

## 8. MarkItDown MCP Server

MarkItDown MCP Server 專為內容創作同文檔管理設計，AI 可自動生成、格式化、管理 Markdown 文檔。適合技術寫作、知識庫建設、博客自動化。

- 支援 Markdown 文檔嘅創建、編輯、格式轉換
- 可批量導入導出文檔
- 典型應用：技術博客自動發布、團隊知識庫管理

* 詳細介紹請參考 [MarkItDown MCP Server](/zh/servers/markitdown-mcp)
* 倉庫地址：[https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp)

---

## 9. 支付寶 MCP Server

支付寶 MCP Server 令 AI 具備同支付寶平台交互嘅能力，實現自動支付、賬單查詢、收款等功能。適合電商、財務自動化、智能收銀場景。

- 支援自動發起支付、查詢賬單、收款通知
- 可同業務系統無縫集成
- 典型應用：自動化收款、財務對賬、智能支付助手

* 詳細介紹請參考 [支付寶 MCP Server](/zh/servers/mcp-server-alipay)

---

## 10. Notion MCP Server

Notion MCP Server 令 AI 自動管理 Notion 中嘅任務、筆記、數據庫等內容，提升個人同團隊嘅效率。

- 支援任務創建、查詢、狀態更新
- 可自動整理筆記、生成日報
- 典型應用：個人 GTD、團隊協作、知識管理

* 詳細介紹請參考 [Notion MCP Server](/zh/servers/notion-mcp-server)
* 倉庫地址：[https://github.com/makenotion/notion-mcp-server](https://github.com/makenotion/notion-mcp-server)

---

## 總結

呢 10 個 MCP Server 覆蓋咗設計、辦公、自動化、內容、支付等多個領域，極大拓展咗 AI 嘅實際應用邊界。通過 MCP 協議，AI 唔單止能「思考」，仲能「動手」，令智能真正融入到每一個業務環節。

如需某個 Server 嘅詳細接入教程、API 示例或實際案例，歡迎留言或私信交流！
