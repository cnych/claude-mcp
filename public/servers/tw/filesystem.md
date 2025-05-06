---
name: 檔案系統 MCP 伺服器
digest: 用於檔案系統操作的 Claude MCP 伺服器
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - filesystem
createTime: 2024-12-01T00:00:00Z
---

實作模型上下文協定 Claude MCP 的 Node.js 伺服器，用於檔案系統操作。

## 功能特性

- 讀寫檔案
- 建立/列出/刪除目錄
- 移動檔案/目錄
- 搜尋檔案
- 取得檔案元資料

**注意**: 伺服器只允許在透過 `args` 指定的目錄內進行操作。

## API

### 資源

- `file://system`: 檔案系統操作介面

### 工具

- **read_file**

  - 讀取檔案的完整內容
  - 輸入: `path` (字串)
  - 使用 UTF-8 編碼讀取完整檔案內容

- **read_multiple_files**

  - 同時讀取多個檔案
  - 輸入: `paths` (字串陣列)
  - 單一檔案讀取失敗不會影響整個操作

- **write_file**

  - 建立新檔案或覆蓋現有檔案(使用時需謹慎)
  - 輸入:
    - `path` (字串): 檔案位置
    - `content` (字串): 檔案內容

- **create_directory**

  - 建立新目錄或確保目錄存在
  - 輸入: `path` (字串)
  - 如果需要會建立父目錄
  - 如果目錄已存在則靜默成功

- **list_directory**

  - 列出目錄內容,帶有 [FILE] 或 [DIR] 前綴
  - 輸入: `path` (字串)

- **move_file**

  - 移動或重新命名檔案和目錄
  - 輸入:
    - `source` (字串)
    - `destination` (字串)
  - 如果目標已存在則失敗

- **search_files**

  - 遞迴搜尋檔案/目錄
  - 輸入:
    - `path` (字串): 起始目錄
    - `pattern` (字串): 搜尋模式
  - 不區分大小寫匹配
  - 回傳匹配項的完整路徑

- **get_file_info**

  - 取得詳細的檔案/目錄元資料
  - 輸入: `path` (字串)
  - 回傳:
    - 大小
    - 建立時間
    - 修改時間
    - 存取時間
    - 類型(檔案/目錄)
    - 權限

- **list_allowed_directories**

  - 列出伺服器允許存取的所有目錄
  - 無需輸入
  - 回傳:
    - 此伺服器可以讀寫的目錄

## 在 Claude Desktop 中使用

將以下內容加入你的 `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/path/to/other/allowed/dir"
      ]
    }
  }
}
```

## 授權條款

本 MCP 伺服器依據 MIT 授權條款發布。這表示您可以自由使用、修改與散布本軟體，但需遵守 MIT 授權條款中的相關規定。更多詳細資訊請參閱專案儲存庫中的 LICENSE 檔案。
