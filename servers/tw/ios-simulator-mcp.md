---
name: iOS Simulator MCP Server
digest: MCP 伺服器可實現與 iOS 模擬器的互動，提供獲取模擬器資訊、控制 UI 操作及檢查 UI 元素等功能，適用於測試與開發用途。
author: joshuayoes
homepage: https://github.com/joshuayoes/ios-simulator-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ios
  - 模擬器
  - 自動化
icon: https://avatars.githubusercontent.com/u/37849890?v=4
createTime: 2025-03-20
---
一個用於與 iOS 模擬器互動的 Model Context Protocol (MCP) 伺服器。此伺服器可讓您透過獲取模擬器資訊、控制 UI 互動及檢查 UI 元素來與 iOS 模擬器互動。

## 功能

- 獲取當前啟動的 iOS 模擬器 ID
- 與模擬器 UI 互動：
  - 描述螢幕上所有無障礙元素
  - 點擊螢幕座標
  - 輸入文字
  - 在座標之間滑動
  - 獲取特定座標處 UI 元素的資訊
  - 擷取模擬器螢幕截圖
- 使用環境變數過濾特定工具

## 配置

### 環境變數

- `IOS_SIMULATOR_MCP_FILTERED_TOOLS`: 以逗號分隔的工具名稱列表，用於過濾不註冊的工具。例如：`screenshot,record_video,stop_recording`

## 使用案例：代理模式中的 QA 步驟

此 MCP 可有效用於代理模式中，作為功能實現後的品質保證步驟，確保 UI 一致性和正確行為。

### 使用方法

功能實現後：

1. 在 Cursor 中啟用代理模式。
2. 使用以下提示快速驗證並記錄 UI 互動。

### 範例提示

- **驗證 UI 元素：**

  ```
  驗證當前螢幕上的所有無障礙元素
  ```

- **確認文字輸入：**

  ```
  在文字輸入欄位中輸入「QA 測試」並確認輸入正確
  ```

- **檢查點擊回應：**

  ```
  點擊座標 x=250, y=400 並確認預期元素被觸發
  ```

- **驗證滑動操作：**

  ```
  從 x=150, y=600 滑動至 x=150, y=100 並確認行為正確
  ```

- **詳細元素檢查：**

  ```
  描述座標 x=300, y=350 處的 UI 元素，確保標籤和功能正確
  ```

- **擷取螢幕截圖：**

  ```
  擷取當前模擬器螢幕的截圖並儲存為 my_screenshot.png
  ```

- **錄製影片：**

  ```
  開始錄製模擬器螢幕影片（預設儲存至 ~/Downloads/simulator_recording_$DATE.mp4）
  ```

- **停止錄製：**
  ```
  停止當前模擬器螢幕錄製
  ```

## 必要條件

- Node.js
- macOS（因 iOS 模擬器僅在 macOS 上可用）
- 已安裝 [Xcode](https://developer.apple.com/xcode/resources/) 和 iOS 模擬器
- Facebook [IDB](https://fbidb.io/) 工具 [(參閱安裝指南)](https://fbidb.io/docs/installation)

## 安裝

### 選項 1：使用 NPX（推薦）

1. 編輯您的 Cursor MCP 配置：

   ```bash
   cursor ~/.cursor/mcp.json
   ```

2. 將 iOS 模擬器伺服器加入您的配置：

   ```json
   {
     "mcpServers": {
       "ios-simulator": {
         "command": "npx",
         "args": ["-y", "ios-simulator-mcp"]
       }
     }
   }
   ```

3. 重新啟動 Cursor。

### 選項 2：本地開發

1. 複製此儲存庫：

   ```bash
   git clone https://github.com/joshuayoes/ios-simulator-mcp
   cd ios-simulator-mcp
   ```

2. 安裝依賴項：

   ```bash
   npm install
   ```

3. 建置專案：

   ```bash
   npm run build
   ```

4. 編輯您的 Cursor MCP 配置：

   ```bash
   cursor ~/.cursor/mcp.json
   ```

5. 將 iOS 模擬器伺服器加入您的配置：

   ```json
   {
     "mcpServers": {
       "ios-simulator": {
         "command": "node",
         "args": ["/path/to/your/ios-simulator-mcp/build/index.js"]
       }
     }
   }
   ```

   將 `"/path/to/your"` 替換為您的專案目錄實際路徑。

6. 重新啟動 Cursor。

## 授權

MIT