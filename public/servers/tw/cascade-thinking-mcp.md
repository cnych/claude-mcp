---
name: Cascade Thinking MCP 伺服器
digest: 將線性問題解決轉變為豐富的多維探索，具有真正的分支和智能思維管理
author: Drew Llewellyn
homepage: https://github.com/drewdotpro/cascade-thinking-mcp
repository: https://github.com/drewdotpro/cascade-thinking-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - reasoning
  - problem-solving
  - analysis
  - thinking
  - branching
createTime: 2025-01-25T00:00:00Z
---

將線性問題解決轉變為豐富的多維探索，具有真正的分支和智能思維管理。

## 功能特性

- **真正的分支**: 創建自動啟動新序列的獨立探索路徑
- **思維修訂**: 隨著理解的深入更新早期的見解
- **動態擴展**: 需要時將思維空間擴展 50% 或至少增加 3 個思維
- **多工具整合**: 通過 `toolSource` 追蹤實現跨工具的持久狀態
- **靈活輸出**: 使用最小、標準或詳細回應模式控制詳細程度
- **雙重編號系統**: 使用序列相對位置 (S{n}) 和絕對位置 (A{n}) 追蹤思維

## 為什麼選擇 Cascade Thinking？

傳統的問題解決工具在面對模糊性時會失效。Cascade Thinking MCP 讓你能夠：
- 通過創建獨立序列的真正分支探索替代方案
- 通過完整的可追溯性修訂先前的思維
- 通過持久狀態在代理和工具之間保持上下文
- 在探索中期發現複雜性時動態擴展

## API

### 工具

- **cascade_thinking**
  - 促進具有動態分支和修訂功能的詳細、逐步思考過程
  - 關鍵輸入：
    - `thought` (字串): 當前思考步驟
    - `nextThoughtNeeded` (布林值): 是否需要另一個思考步驟
    - `thoughtNumber` (字串): 序列中的當前位置（例如 "S1"、"S2"、"S3"）
    - `totalThoughts` (整數): 預計需要的總思維數
    - `branchFromThought` (可選): 從指定思維創建新分支
    - `needsMoreThoughts` (可選): 動態擴展 totalThoughts
    - `responseMode` (可選): 控制詳細程度（minimal/standard/verbose）

## 獨特功能

### 雙重編號系統
- **S{n}**: 序列相對位置（每個分支重設）
- **A{n}**: 所有思維的絕對位置（永不重設）

### 真正的分支
當你創建分支時，工具會：
1. 自動創建新序列
2. 在新分支中將編號重設為 S1
3. 從父序列複製相關上下文
4. 追蹤分支關係以便導航

### 動態擴展
當你設定 `needsMoreThoughts: true` 時：
1. 將 totalThoughts 增加 50% 或至少 3 個思維
2. 顯示包括 ⚡ 表情符號的視覺指示器
3. 用新總數更新回應
4. 添加提示文字以指示擴展

## 在 Claude Desktop 中使用

將此添加到你的 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "cascade-thinking-mcp"
      ]
    }
  }
}
```

## 使用 Docker

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/cascade-thinking"
      ]
    }
  }
}
```

## 使用範例

開始探索：
```json
{
  "thought": "分析我們 API 的認證選項",
  "thoughtNumber": "S1",
  "totalThoughts": 3,
  "nextThoughtNeeded": true
}
```

創建分支探索 OAuth：
```json
{
  "thought": "讓我探索 OAuth2 實現",
  "thoughtNumber": "S1",
  "branchFromThought": "A1",
  "branchId": "oauth-exploration",
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}
```

## 授權條款

此 MCP 伺服器根據 MIT 授權條款授權。這意味著你可以自由使用、修改和分發該軟體，但須遵守 MIT 授權條款的條款和條件。更多詳情請參見專案儲存庫中的 LICENSE 檔案。