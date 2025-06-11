---
name: Intlayer MCP 伺服器
digest: Intlayer MCP 伺服器將 AI 輔助功能整合到您的 IDE 中，透過 Intlayer 提供更智慧、具有上下文感知能力的開發體驗。它提供命令列存取、專案内文件和直觀的 AI 協助。
author: aymericzip
homepage: https://intlayer.org
repository: https://github.com/aymericzip/intlayer
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - intlayer
  - i18n
  - l10n
  - 本地化
  - 翻譯
  - ide
  - 自動化
  - 文件
icon: https://intlayer.org/android-chrome-512x512.png
createTime: 2025-06-10
---

一個模型上下文協定（MCP）伺服器，透過提供 IDE 感知的文件、CLI 整合和 AI 驅動的上下文工具來增強 **Intlayer** 的開發體驗。

## 特性

- 為 Intlayer 使用提供 AI 輔助的建議和解釋
- 智慧 CLI 整合，可直接在您的 IDE 中執行和檢查 `intlayer` 命令
- 基於您專案實際 Intlayer 版本的上下文文件
- 用於即時互動的工具介面和提示建議
- 使用 `npx` 實現零設定設置

## 支援的 IDE

- Cursor
- VS Code (透過 MCP)
- 任何支援模型上下文協定（MCP）的 IDE

## 設定

### 選項 1：使用 NPX 快速啟動

將以下內容新增至您的 `.cursor/mcp.json`（或等效的 MCP 設定）中：

```json
{
  "mcpServers": {
    "intlayer": {
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

然後重新啟動您的 IDE 或 MCP 會話。

### 選項 2：VS Code 設定

建立 `.vscode/mcp.json`：

```json
{
  "servers": {
    "intlayer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

在命令面板中：

- 透過「聊天模式」啟用 **代理模式**
- 使用 `#intlayer` 來參照工具
- 管理工具確認和伺服器會話

## CLI 用法

您也可以透過 CLI 手動執行 Intlayer MCP 伺服器：

```bash
# 推薦：npx
npx @intlayer/mcp

# 開發模式
npm run dev

# 自訂入口
node dist/cjs/index.cjs
```

要進行檢查和偵錯：

```bash
npx @modelcontextprotocol/inspector npx @intlayer/mcp
```

## 可用功能

| 功能            | 描述                                           |
| --------------- | ---------------------------------------------- |
| 智慧 CLI        | `intlayer` 命令的內嵌執行和文件查詢            |
| 版本化文件      | 自動偵測您安裝的 Intlayer 版本並載入相符的文件 |
| 自動完成 + 提示 | 針對您的檔案和上下文量身訂製的 AI 輔助提示建議 |
| 代理模式工具    | 在 Cursor 和相容的 IDE 中註冊並執行自訂工具    |

## 先決條件

- Node.js
- 支援 MCP 協定的 IDE（Cursor、VS Code 等）
- 使用 [Intlayer](https://github.com/aymericzip/intlayer) 的專案

## 授權條款

Apache 2.0

---

## 有用連結

- [Intlayer GitHub 倉庫](https://github.com/aymericzip/intlayer)
- [文件](https://intlayer.org/doc/mcp-server)
