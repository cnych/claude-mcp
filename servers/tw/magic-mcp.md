---
name: 21st.dev Magic AI Agent
digest: Magic MCP 是一款強大的前端開發工具，它將像 v0 一樣的功能整合到 Cursor/WindSurf/Cline 中。21st dev Magic MCP 伺服器讓您能夠像使用魔法一樣處理前端開發工作
author: 21st-dev
repository: https://github.com/21st-dev/magic-mcp
homepage: https://21st.dev/magic/
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - ui
  - ide
icon: https://static.claudemcp.com/servers/21st-dev/magic-mcp/21st-dev-magic-mcp-6c24c56a.png
createTime: 2025-02-19
featured: true
---

![MCP橫幅](https://static.claudemcp.com/servers/21st-dev/magic-mcp/21st-dev-magic-mcp-6c24c56a.png)

Magic Component Platform (MCP) 是一款強大的 AI 驅動工具，能幫助開發者透過自然語言描述即時創建精美、現代的 UI 元件。它與主流 IDE 無縫整合，為 UI 開發提供流暢的工作流程。

## 功能特色

- **AI 驅動 UI 生成**：透過自然語言描述創建 UI 元件
- **多 IDE 支援**：
  - [Cursor](https://cursor.com) IDE 整合
  - [Windsurf](https://windsurf.ai) 支援
  - [VSCode + Cline](https://cline.bot) 整合測試版
- **現代元件庫**：存取大量預建、可自訂元件，靈感來自[21st.dev](https://21st.dev)
- **即時預覽**：創建元件時立即查看效果
- **TypeScript 支援**：完整支援 TypeScript 確保類型安全開發
- **SVGL 整合**：存取大量專業品牌資產與標誌
- **元件增強**：為現有元件添加進階功能與動畫（即將推出）

## 運作原理

1. **告訴代理您的需求**

   - 在 AI 代理聊天中輸入`/ui`並描述所需元件
   - 範例：`/ui 建立一個具有響應式設計的現代導航列`

2. **讓魔法為您創建**

   - 您的 IDE 會提示使用 Magic 功能
   - Magic 立即生成精緻的 UI 元件
   - 元件設計靈感來自 21st.dev 元件庫

3. **無縫整合**
   - 元件自動加入您的專案
   - 立即開始使用新 UI 元件
   - 所有元件均可完全自訂

## 開始使用

### 必要條件

- Node.js（建議使用最新 LTS 版本）
- 支援的 IDE 之一：
  - Cursor
  - Windsurf
  - VSCode（需安裝 Cline 擴充）

### 安裝步驟

1. **產生 API 金鑰**

   - 訪問[21st.dev 魔法控制台](https://21st.dev/magic/console)
   - 產生新 API 金鑰

2. **選擇安裝方式**

#### 方法 1：CLI 安裝（推薦）

一鍵指令為您的 IDE 安裝並配置 MCP：

```bash
npx @21st-dev/cli@latest install <client> --api-key <key>
```

支援客戶端：cursor、windsurf、cline、claude

#### 方法 2：手動配置

若偏好手動設定，請將以下內容加入 IDE 的 MCP 設定檔：

```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest", "API_KEY=\"您的API金鑰\""]
    }
  }
}
```

設定檔位置：

- Cursor：`~/.cursor/mcp.json`
- Windsurf：`~/.codeium/windsurf/mcp_config.json`
- Cline：`~/.cline/mcp_config.json`
- Claude：`~/.claude/mcp_config.json`

## 常見問題

### Magic AI 代理如何處理我的程式碼庫？

Magic AI 代理僅會寫入或修改與其生成元件相關的檔案。它遵循專案的程式碼風格與結構，無縫整合現有程式碼庫而不影響應用程式其他部分。

### 能否自訂生成的元件？

可以！所有生成元件均可完全編輯且具備良好結構化程式碼。您可以像修改專案中任何其他 React 元件一樣調整樣式、功能與行為。

### 若生成次數用完會怎樣？

若超過每月生成限制，系統將提示您升級方案。您可隨時升級以繼續生成元件。現有元件仍可完全正常使用。

### 新元件多久會加入 21st.dev 元件庫？

作者可隨時發布元件至 21st.dev，Magic 代理將立即取得這些元件。這表示您始終能存取社群提供的最新元件與設計模式。

### 元件複雜度是否有限制？

Magic AI 代理能處理各種複雜度的元件，從簡單按鈕到複雜互動表單皆可。但為獲得最佳效果，建議將非常複雜的 UI 拆解為較小、易管理的元件。

## 開發資訊

### 專案結構

```
mcp/
├── app/
│   └── components/     # 核心UI元件
├── types/             # TypeScript類型定義
├── lib/              # 工具函式
└── public/           # 靜態資源
```

### 關鍵元件

- `IdeInstructions`：不同 IDE 的設定說明
- `ApiKeySection`：API 金鑰管理介面
- `WelcomeOnboarding`：新使用者引導流程

## 授權條款

MIT 授權
