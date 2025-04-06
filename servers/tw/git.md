---
name: Git MCP 伺服器
digest: 用於 git 操作的 Claude MCP 伺服器
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/git
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - git
icon: https://cdn.simpleicons.org/git
createTime: 2024-12-01T00:00:00Z
---

一個用於 Git 倉庫互動和自動化的模型上下文協定伺服器。該伺服器提供工具，透過大型語言模型來讀取、搜尋和操作 Git 倉庫。

請注意，mcp-server-git 目前處於早期開發階段。隨著我們持續開發和改進伺服器，其功能和可用工具可能會發生變化和擴展。

### 工具

1. `git_status`

   - 顯示工作樹狀態
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
   - 回傳: 工作目錄的當前狀態文字輸出

2. `git_diff_unstaged`

   - 顯示工作目錄中尚未暫存的變更
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
   - 回傳: 未暫存變更的差異輸出

3. `git_diff_staged`

   - 顯示已暫存待提交的變更
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
   - 回傳: 已暫存變更的差異輸出

4. `git_commit`

   - 記錄對倉庫的變更
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
     - `message` (字串): 提交訊息
   - 回傳: 帶有新提交雜湊的確認訊息

5. `git_add`

   - 將檔案內容加入暫存區
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
     - `files` (字串[]): 要暫存的檔案路徑陣列
   - 回傳: 已暫存檔案的確認訊息

6. `git_reset`

   - 取消所有已暫存的變更
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
   - 回傳: 重置操作的確認訊息

7. `git_log`

   - 顯示提交紀錄
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
     - `max_count` (數字, 選填): 顯示的最大提交數量(預設: 10)
   - 回傳: 包含雜湊、作者、日期和訊息的提交項目陣列

8. `git_create_branch`
   - 建立新分支
   - 輸入:
     - `repo_path` (字串): Git 倉庫路徑
     - `branch_name` (字串): 新分支的名稱
     - `start_point` (字串, 選填): 新分支的起始點
   - 回傳: 分支建立的確認訊息

## 安裝

### 使用 uv (推薦)

使用 [`uv`](https://docs.astral.sh/uv/) 時不需要特定安裝。我們將使用 [`uvx`](https://docs.astral.sh/uv/guides/tools/) 直接執行 _mcp-server-git_。

### 使用 PIP

你也可以透過 pip 安裝 `mcp-server-git`:

```
pip install mcp-server-git
```

安裝後，你可以透過以下命令運行它:

```
python -m mcp_server_git
```

## 設定

### 使用 Claude Desktop

將以下內容加入你的 `claude_desktop_config.json`：

<details>
<summary>使用 uvx</summary>

```json
"mcpServers": {
  "git": {
    "command": "uvx",
    "args": ["mcp-server-git", "--repository", "path/to/git/repo"]
  }
}
```

</details>

<details>
<summary>使用 pip 安装</summary>

```json
"mcpServers": {
  "git": {
    "command": "python",
    "args": ["-m", "mcp_server_git", "--repository", "path/to/git/repo"]
  }
}
```

</details>

### 使用 Zed

將以下內容加入你的 Zed settings.json：

<details>
<summary>使用 uvx</summary>

```json
"context_servers": [
  "mcp-server-git": {
    "command": {
      "path": "uvx",
      "args": ["mcp-server-git"]
    }
  }
],
```

</details>

<details>
<summary>使用 pip 安装</summary>

```json
"context_servers": {
  "mcp-server-git": {
    "command": {
      "path": "python",
      "args": ["-m", "mcp_server_git"]
    }
  }
},
```

</details>

## 調試

你可以使用 MCP 檢查器來調試伺服器。對於 uvx 安裝:

```
npx @modelcontextprotocol/inspector uvx mcp-server-git
```

或者如果你在特定目錄中安裝了包或在開發中:

```
cd path/to/servers/src/git
npx @modelcontextprotocol/inspector uv run mcp-server-git
```

運行 `tail -n 20 -f ~/Library/Logs/Claude/mcp*.log` 將顯示伺服器的日誌，並可能幫助你調試任何問題。

## 開發

如果你正在本地開發，有兩種方法可以測試你的更改:

1. 運行 MCP 檢查器來測試你的更改。請參閱[調試](#debugging)以獲取運行說明。

2. 使用 Claude 桌面應用程序測試。將以下內容添加到你的 `claude_desktop_config.json`:

```json
"git": {
  "command": "uv",
  "args": [
    "--directory",
    "/<path to mcp-servers>/mcp-servers/src/git",
    "run",
    "mcp-server-git"
  ]
}
```

## 授權條款

此 MCP 伺服器根據 MIT 許可證授權。這表示你可以自由使用、修改和分發軟體，但需遵守 MIT 許可證的條款和條件。有關更多詳細信息，請參閱專案倉庫中的 LICENSE 文件。
