---
name: MCPControl
digest: 適用於Model Context Protocol的Windows控制伺服器，可程式化自動執行系統操作如滑鼠/鍵盤輸入、視窗管理與螢幕擷取，簡化工作流程控制。
author: Cheffromspace
repository: https://github.com/Cheffromspace/MCPControl
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - windows
  - 自動化
  - 控制
icon: https://avatars.githubusercontent.com/u/21370528?v=4
createTime: 2024-12-04
---

適用於[Model Context Protocol](/tw)的 Windows 控制伺服器，提供對系統操作的程式化控制，包括滑鼠、鍵盤、視窗管理及螢幕擷取功能。

> **注意**：此專案目前僅支援 Windows 系統。

## ⚠️ 重要免責聲明

**本軟體為實驗性產品且具有潛在危險性**

使用本軟體即表示您知曉並同意：

- 透過此工具讓 AI 模型直接控制您的電腦具有本質上的風險
- 本軟體可控制您的滑鼠、鍵盤及其他系統功能，可能導致非預期後果
- 您需自行承擔使用此軟體的全部風險
- 本專案創建者與貢獻者對使用此軟體造成的任何損害、資料遺失或其他後果概不負責
- 此工具僅應在具備適當安全措施的受控環境中使用

## 功能特色

- **視窗管理**

  - 列出所有視窗
  - 取得活動視窗資訊
  - 取得視窗標題
  - 取得視窗尺寸與位置
  - 聚焦視窗
  - 調整視窗大小
  - 重新定位視窗

- **滑鼠控制**

  - 滑鼠移動
  - 點擊操作
  - 滾動功能
  - 拖曳操作
  - 游標位置追蹤

- **鍵盤控制**

  - 文字輸入
  - 組合鍵操作
  - 按鍵按下/釋放操作
  - 長按鍵功能

- **螢幕操作**

  - 螢幕擷取
  - 取得螢幕尺寸
  - 活動視窗偵測

- **剪貼簿整合**
  - 取得剪貼簿內容
  - 設定剪貼簿內容
  - 清除剪貼簿
  - 檢查剪貼簿狀態

## 使用方式

只需按照[MCP 伺服器設定](#mcp-server-configuration)章節所示配置您的 Claude MCP 設定即可使用 MCPControl，無需安裝！

### 從原始碼建構

#### 開發需求

要進行開發建構，您需要：

1. Windows 作業系統（keysender 相依性所需）
2. Node.js 18 或更新版本（使用包含建構工具的官方 Windows 安裝程式）
3. npm 套件管理員
4. 原生建構工具：
   - node-gyp：`npm install -g node-gyp`
   - cmake-js：`npm install -g cmake-js`

## MCP 伺服器設定

使用此專案需具備必要建構工具：

1. 使用官方 Windows 安裝程式安裝 Node.js（包含必要建構工具）
2. 安裝其他必要工具：

```
npm install -g node-gyp
npm install -g cmake-js
```

接著在您的 MCP 設定中加入以下配置：

```json
{
  "mcpServers": {
    "MCPControl": {
      "command": "npx",
      "args": ["--no-cache", "-y", "mcp-control"]
    }
  }
}
```

## 專案結構

- `/src`
  - `/handlers` - 請求處理器與工具管理
  - `/tools` - 核心功能實作
  - `/types` - TypeScript 型別定義
  - `index.ts` - 主要應用程式進入點

## 相依套件

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - 用於協議實作的 MCP SDK
- [keysender](https://www.npmjs.com/package/keysender) - 僅限 Windows 的 UI 自動化函式庫
- [clipboardy](https://www.npmjs.com/package/clipboardy) - 剪貼簿處理
- [sharp](https://www.npmjs.com/package/sharp) - 影像處理
- [uuid](https://www.npmjs.com/package/uuid) - UUID 生成

## 已知限制

- 目前不支援視窗最小化/還原操作
- 多螢幕功能可能因設定不同而無法正常運作
- get_screenshot 工具無法與 VS Code Extension Cline 配合使用
- 部分操作可能需視目標應用程式要求提升權限
- 僅支援 Windows 系統
- 目前點擊精準度在 1280x720 解析度單螢幕下表現最佳

## 授權條款

MIT 授權條款。
