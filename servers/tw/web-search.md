---
name: 網路搜尋 MCP 伺服器
digest: MCP伺服器透過利用Google搜尋結果提供免費的網路搜尋功能，無需API金鑰，為獲取線上資訊提供了一個簡單且易於使用的解決方案。
author: pskill9
repository: https://github.com/pskill9/web-search
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 搜尋
  - 網路
  - 伺服器
icon: https://avatars.githubusercontent.com/u/188422281?s=48&v=4
createTime: 2024-12-30
---

一個模型上下文協議(MCP)伺服器，可使用 Google 搜尋結果進行免費網路搜尋，無需 API 金鑰。

## 功能特色

- 使用 Google 搜尋結果進行網路搜尋
- 無需 API 金鑰或身份驗證
- 返回結構化結果，包含標題、網址和描述
- 可配置每次搜尋的結果數量

## 安裝步驟

1. 複製或下載此儲存庫
2. 安裝相依套件：

```bash
npm install
```

3. 建置伺服器：

```bash
npm run build
```

4. 將伺服器加入您的 MCP 配置：

適用於 VSCode(Claude 開發擴充功能)：

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search/build/index.js"]
    }
  }
}
```

適用於 Claude 桌面版：

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search/build/index.js"]
    }
  }
}
```

## 使用方式

伺服器提供一個名為`search`的工具，接受以下參數：

```typescript
{
  "query": string,    // 搜尋查詢
  "limit": number     // 選填：返回的結果數量(預設：5，最大值：10)
}
```

使用範例：

```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "search",
  arguments: {
    query: "您的搜尋查詢",
    limit: 3, // 選填
  },
});
```

回應範例：

```json
[
  {
    "title": "範例搜尋結果",
    "url": "https://example.com",
    "description": "搜尋結果的描述..."
  }
]
```

## 限制說明

由於此工具使用 Google 搜尋結果的網頁爬取技術，請注意以下重要限制：

1. **速率限制**：若短時間內執行過多搜尋，Google 可能會暫時封鎖請求。為避免此情況：

   - 保持合理的搜尋頻率
   - 謹慎使用 limit 參數
   - 如有需要，可考慮在搜尋之間實施延遲

2. **結果準確性**：

   - 此工具依賴 Google 的 HTML 結構，該結構可能會變更
   - 部分結果可能缺少描述或其他元數據
   - 複雜的搜尋運算子可能無法如預期運作

3. **法律考量**：
   - 此工具僅供個人使用
   - 請遵守 Google 的服務條款
   - 根據您的使用情境考慮實施適當的速率限制
