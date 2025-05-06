---
name: MCP Git Ingest
digest: MCP伺服器分析GitHub儲存庫，提取關鍵檔案和結構，提供清晰的專案組織與關鍵組件洞察。它簡化了儲存庫的導航與理解。
author: adhikasp
homepage: https://github.com/adhikasp/mcp-git-ingest
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - git
  - 伺服器
  - python
icon: https://avatars.githubusercontent.com/u/6151302?v=4
createTime: 2024-12-15
---
一個幫助讀取GitHub儲存庫結構與重要檔案的模型上下文協議(MCP)伺服器。

靈感來自[gitingest](https://gitingest.com/)。

## 配置

```json
{
    "mcpServers": {
        "mcp-git-ingest": {
            "command": "uvx",
            "args": ["--from", "git+https://github.com/adhikasp/mcp-git-ingest", "mcp-git-ingest"],
        }
    }
}
```

## 使用方式

使用[mcp-client-cli](https://github.com/adhikasp/mcp-client-cli):

```
$ llm read https://github.com/adhikasp/mcp-git-ingest and determine how the code technically works

我將幫助您理解mcp-git-ingest儲存庫的技術細節。我將先獲取目錄結構，然後閱讀重要檔案來分析程式碼運作方式。

工具呼叫:
  github_directory_structure
  參數:
    repo_url: https://github.com/adhikasp/mcp-git-ingest

現在，我將閱讀重要檔案來理解技術實現:

工具呼叫:
  github_read_important_files
  參數:
    repo_url: https://github.com/adhikasp/mcp-git-ingest
    file_paths: ['README.md', 'src/mcp_git_ingest/main.py', 'pyproject.toml']

讓我分解這段程式碼的技術運作方式:

1. 目的:
`mcp-git-ingest`是一個模型上下文協議(MCP)伺服器，設計用來幫助讀取GitHub儲存庫結構和重要檔案。它提供兩個主要工具:
- `github_directory_structure`: 返回儲存庫目錄結構的樹狀表示
- `github_read_important_files`: 讀取並返回儲存庫中指定檔案的內容

2. 技術實現:

a. 依賴項:
- 使用`fastmcp`創建MCP伺服器
- 使用`gitpython`進行Git儲存庫操作
- 需要Python 3.8+

b. 關鍵函數:

`clone_repo(repo_url: str) -> str`:
- 基於儲存庫URL的哈希值創建確定性臨時目錄
- 檢查儲存庫是否已克隆
- 若未克隆則進行克隆
- 處理錯誤情況和清理
- 返回克隆儲存庫的路徑

`get_directory_tree(path: str, prefix: str = "") -> str`:
- 遞歸生成樹狀目錄結構
- 跳過`.git`目錄
- 使用Unicode方框繪製字符創建視覺化樹狀表示
- 處理條目排序

`github_directory_structure(repo_url: str) -> str`:
- 克隆儲存庫
- 生成目錄樹
- 處理後清理臨時儲存庫
- 返回樹狀結構或錯誤訊息

`github_read_important_files(repo_url: str, file_paths: List[str]) -> dict[str, str]`:
- 克隆儲存庫
- 讀取指定檔案
- 返回檔案路徑到內容的映射字典
- 處理檔案讀取錯誤
- 清理臨時儲存庫

3. 錯誤處理:
- 使用try-except區塊處理儲存庫克隆、檔案讀取錯誤
- 使用`finally`區塊確保臨時目錄始終被清理
- 返回描述性錯誤訊息

4. 效能優化:
- 使用基於哈希的臨時目錄命名以潛在重用克隆儲存庫
- 克隆前檢查現有儲存庫
- 實施清理以防止臨時檔案累積

5. 獨特功能:
- 確定性臨時目錄創建
- Unicode樹狀表示
- 具有錯誤處理的靈活檔案讀取

6. 執行:
- 可通過`mcp-git-ingest`作為CLI工具運行
- 通過`pyproject.toml`配置
- 依賴`fastmcp`實現MCP伺服器功能

這段程式碼是一個穩健、靈活的工具，用於以程式化方式探索和讀取GitHub儲存庫，重點在於錯誤處理和清晰的實現。

您希望我詳細說明實現的任何特定方面嗎?
```