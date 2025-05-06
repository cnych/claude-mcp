---
name: PixVerse MCP
digest: PixVerse 提供可透過支援 MCP 的應用程式（如 Claude 和 Cursor）存取的影片生成模型，讓您能在現有工作流程中無縫進行 AI 驅動的影片創作。
author: PixVerseAI
repository: https://github.com/PixVerseAI/PixVerse-MCP
homepage: https://platform.pixverse.ai
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 影片
  - API
  - Python
icon: https://avatars.githubusercontent.com/u/204290266?v=4
createTime: 2025-04-17
---

這是一個工具，讓您可以透過支援模型上下文協定（MCP）的應用程式（如 Claude 或 Cursor）存取 PixVerse 的最新影片生成模型。

## 概述

PixVerse MCP 是一個工具，讓您可以透過支援模型上下文協定（MCP）的應用程式（如 Claude 或 Cursor）存取 PixVerse 的最新影片生成模型。此整合讓您能隨時隨地生成高品質影片——包括文字轉影片、圖片轉影片等功能。

## 主要功能

- **文字轉影片生成**：使用文字提示生成創意影片
- **靈活的參數控制**：調整影片品質、長度、寬高比等
- **與 AI 助手共同創作**：與 Claude 等 AI 模型協作，提升創意工作流程

## 系統組成

系統由兩個主要組件構成：

1. **UVX MCP 伺服器**
   - 基於 Python 的雲端伺服器
   - 直接與 PixVerse API 通訊
   - 提供完整的影片生成功能

## 安裝與配置

### 先決條件

1. Python 3.10 或更高版本
2. UV/UVX
3. PixVerse API 金鑰：從 PixVerse 平台取得（此功能需要 API 點數，需在 [PixVerse 平台](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp) 另行購買）

### 取得依賴項

1. **Python**：

   - 從官方 Python 網站下載並安裝
   - 確保 Python 已加入系統路徑

2. **UV/UVX**：
   - 安裝 uv 並設定我們的 Python 專案與環境：

#### Mac/Linux

```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Windows

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## 如何使用 MCP 伺服器

### 1. 取得 PixVerse API 金鑰

- 訪問 [PixVerse 平台](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp)
- 註冊或登入您的帳戶
- 從帳戶設定中建立並複製您的 API 金鑰
- [API 金鑰生成指南](https://docs.platform.pixverse.ai/how-to-get-api-key-882968m0)

### 2. 下載必要依賴項

- **Python**：安裝 Python 3.10 或更高版本
- **UV/UVX**：安裝最新穩定版的 UV & UVX

### 3. 配置 MCP 客戶端

- 開啟您的 MCP 客戶端（如 Claude for Desktop 或 Cursor）
- 找到客戶端設定
- 開啟 mcp_config.json（或相關設定檔）
- 根據您使用的方法添加配置：

```json
{
  "mcpServers": {
    "PixVerse": {
      "command": "uvx",
      "args": ["pixverse-mcp"],
      "env": {
        "PIXVERSE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

- 將從 platform.pixverse.ai 取得的 API 金鑰添加到 `"PIXVERSE_API_KEY": "xxxx"` 下方
- 儲存設定檔

### 5. 重新啟動 MCP 客戶端或刷新 MCP 伺服器

- 完全關閉並重新開啟您的 MCP 客戶端
- 或使用「刷新 MCP 伺服器」選項（如果支援）

## 客戶端特定配置

### Claude for Desktop

1. 開啟 Claude 應用程式
2. 導航至 Claude > 設定 > 開發者 > 編輯配置
3. 開啟 claude_desktop_config.json 檔案
   - Windows
   - Mac : ~/Library/Application\ Support/Claude/claude_desktop_config.json
4. 添加上述配置並儲存
5. 重新啟動 Claude
   - 如果連接成功：首頁不會顯示任何錯誤，且 MCP 狀態會顯示為綠色
   - 如果連接失敗：首頁會顯示錯誤訊息

### Cursor

1. 開啟 Cursor 應用程式
2. 前往設定 > 模型上下文協定
3. 新增伺服器
4. 按照上述 JSON 配置填寫伺服器詳細資訊
5. 儲存並重新啟動或刷新 MCP 伺服器

## 使用範例

### 文字轉影片

透過 Claude 或 Cursor 使用自然語言提示生成影片。

**基本範例**：

```
生成一段海洋日落的影片。金色的陽光在水面上反射，海浪輕輕拍打岸邊。
```

**帶參數的進階範例**：

```
生成一段夜晚城市景觀的影片，參數如下：
內容：摩天大樓的燈光在夜空下閃爍，車燈在道路上形成光軌
寬高比：16:9
品質：540p
時長：5 秒
動態模式：正常
負面提示：模糊、抖動、文字
```

**支援的參數**：

- 寬高比：16:9、4:3、1:1、3:4、9:16
- 時長：5 秒或 8 秒
- 品質：360p、540p、720p、1080p
- 動態模式：正常或快速

### 腳本 + 影片

使用詳細的場景描述或分鏡表來建立更有結構的影片。

**場景描述範例**：

```
場景：清晨的海灘。
太陽正在升起，在海面上投射金色的反射。
沙灘上延伸著腳印。
溫柔的波浪退去時留下白色泡沫。
遠處有一艘小船緩緩航行在平靜的海面上。
寬高比：16:9，品質：540p，時長：5 秒。
```

**分鏡範例**：

```
根據此分鏡表生成影片：
- 開始：咖啡杯的俯視鏡頭，蒸汽上升
- 特寫：咖啡表面的漣漪和紋理
- 過渡：攪拌形成漩渦
- 結束：杯子旁有一本打開的書和眼鏡
格式：1:1 正方形，品質：540p，動態：快速
```

- Claude Desktop 也支援分鏡圖像輸入。

### 一鍵影片

快速生成特定主題或風格的影片，無需詳細描述。

**主題範例**：

```
生成一段未來科技主題的影片，包含霓虹燈和全息投影。
```

**風格範例**：

```
生成一段水彩風格的開花影片，色彩明亮且夢幻。
```

### 創意 + 影片

結合 AI 的創造力與影片生成。

**風格轉換範例**：

```
這是一張城市景觀的照片。以復古風格重新詮釋並提供影片提示。
```

**故事提示範例**：

```
如果這張街道照片是電影的開場場景，接下來會發生什麼？提供一個簡短的影片概念。
```

**情感場景範例**：

```
查看這張森林小徑照片，設計一個簡短的影片概念，可以是微型故事或帶有情感進展的場景。
```

## 常見問題

**如何取得 PixVerse API 金鑰？**

- 在 PixVerse 平台註冊，並在帳戶中的「API-KEY」下生成。

**如果伺服器沒有回應該怎麼辦？**

1. 檢查您的 API 金鑰是否有效
2. 確保設定檔路徑正確
3. 查看錯誤日誌（通常在 Claude 或 Cursor 的日誌資料夾中）

**MCP 是否支援圖片轉影片或關鍵幀功能？**

- 目前不支援。這些功能僅能透過 PixVerse API 使用。[API 文件](https://docs.platform.pixverse.ai)

**如何取得點數？**

- 如果您尚未在 API 平台上儲值，請先進行儲值。[PixVerse 平台](https://platform.pixverse.ai/billing?utm_source=github&utm_medium=readme&utm_campaign=mcp)

**支援哪些影片格式和尺寸？**

- PixVerse 支援從 360p 到 1080p 的解析度，以及從 9:16（直向）到 16:9（橫向）的寬高比。
- 建議從 540p 和 5 秒影片開始測試輸出品質。

**在哪裡可以找到生成的影片？**

- 您將收到一個 URL 連結，用於查看、下載或分享影片。

**影片生成需要多長時間？**

- 通常需要 30 秒到 2 分鐘，具體取決於複雜度、伺服器負載和網路狀況。

**如果遇到 spawn uvx ENOENT 錯誤該怎麼辦？**

- 此錯誤通常由 UV/UVX 安裝路徑不正確引起。您可以按照以下方式解決：

對於 Mac/Linux：

```
sudo cp ./uvx /usr/local/bin
```

對於 Windows：

1. 在終端機中執行以下命令以識別 UV/UVX 的安裝路徑：

```
where uvx
```

2. 開啟檔案總管並找到 uvx/uv 檔案。
3. 將檔案移動到以下目錄之一：
   - C:\Program Files (x86) 或 C:\Program Files

## 社群與支援

### 社群

- 加入我們的 [Discord 伺服器](https://discord.gg/pixverse) 以接收更新、分享創作、獲得幫助或提供反饋。

### 技術支援

- 電子郵件：api@pixverse.ai
- 網站：https://platform.pixverse.ai

## 版本說明

v1.0.0

- 支援透過 MCP 進行文字轉影片生成
- 啟用影片連結檢索
- 與 Claude 和 Cursor 整合以增強工作流程
- 支援基於雲端的 Python MCP 伺服器
