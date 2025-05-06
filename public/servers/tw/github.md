---
name: GitHub MCP 伺服器
digest: 用於 GitHub API 的 Claude MCP 伺服器
author: Claude 團隊
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/github
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - github
  - git
icon: https://cdn.simpleicons.org/github
createTime: 2024-12-06T00:00:00Z
---

用於 GitHub API 的 MCP 伺服器，支援檔案操作、倉庫管理、搜尋功能等。

### 特性

- **自動建立分支**: 在建立/更新檔案或推送變更時，若分支不存在則自動建立
- **全面的錯誤處理**: 對常見問題提供清晰的錯誤訊息
- **保留 Git 歷史**: 操作保持適當的 Git 歷史記錄，不使用強制推送
- **批次操作**: 支援單檔案和多檔案操作
- **進階搜尋**: 支援搜尋程式碼、問題/PR 和使用者

## 工具

1. `create_or_update_file`

   - 在倉庫中建立或更新單個檔案
   - 輸入:
     - `owner` (字串): 倉庫擁有者(使用者名稱或組織)
     - `repo` (字串): 倉庫名稱
     - `path` (字串): 建立/更新檔案的路徑
     - `content` (字串): 檔案內容
     - `message` (字串): 提交訊息
     - `branch` (字串): 建立/更新檔案的分支
     - `sha` (選填字串): 被替換檔案的 SHA (用於更新)
   - 回傳: 檔案內容和提交詳情

2. `push_files`

   - 在單次提交中推送多個檔案
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `branch` (字串): 推送的目標分支
     - `files` (陣列): 要推送的檔案，每個包含 `path` 和 `content`
     - `message` (字串): 提交訊息
   - 回傳: 更新後的分支參考

3. `search_repositories`

   - 搜尋 GitHub 倉庫
   - 輸入:
     - `query` (字串): 搜尋查詢
     - `page` (選填數字): 分頁頁碼
     - `perPage` (選填數字): 每頁結果數量(最大 100)
   - 回傳: 倉庫搜尋結果

4. `create_repository`

   - 建立新的 GitHub 倉庫
   - 輸入:
     - `name` (字串): 倉庫名稱
     - `description` (選填字串): 倉庫描述
     - `private` (選填布林值): 是否為私有倉庫
     - `autoInit` (選填布林值): 是否使用 README 初始化
   - 回傳: 建立的倉庫詳情

5. `get_file_contents`

   - 取得檔案或目錄的內容
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `path` (字串): 檔案/目錄路徑
     - `branch` (選填字串): 取得內容的分支
   - 回傳: 檔案/目錄內容

6. `create_issue`

   - 建立新問題
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `title` (字串): 問題標題
     - `body` (選填字串): 問題描述
     - `assignees` (選填字串[]): 要分配的使用者名稱
     - `labels` (選填字串[]): 要加入的標籤
     - `milestone` (選填數字): 里程碑編號
   - 回傳: 建立的問題詳情

7. `create_pull_request`

   - 建立新的拉取請求
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `title` (字串): PR 標題
     - `body` (選填字串): PR 描述
     - `head` (字串): 包含變更的分支
     - `base` (字串): 要合併到的分支
     - `draft` (選填布林值): 是否建立為草稿 PR
     - `maintainer_can_modify` (選填布林值): 是否允許維護者編輯
   - 回傳: 建立的拉取請求詳情

8. `fork_repository`

   - 複製倉庫
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `organization` (選填字串): 複製到的組織
   - 回傳: 複製的倉庫詳情

9. `create_branch`

   - 建立新分支
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `branch` (字串): 新分支名稱
     - `from_branch` (選填字串): 來源分支(預設為倉庫預設分支)
   - 回傳: 建立的分支參考

10. `list_issues`

    - 列出和篩選倉庫問題
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `state` (選填字串): 按狀態篩選('open', 'closed', 'all')
      - `labels` (選填字串[]): 按標籤篩選
      - `sort` (選填字串): 排序方式('created', 'updated', 'comments')
      - `direction` (選填字串): 排序方向('asc', 'desc')
      - `since` (選填字串): 按日期篩選(ISO 8601 時間戳)
      - `page` (選填數字): 頁碼
      - `per_page` (選填數字): 每頁結果數
    - 回傳: 問題詳情陣列

11. `update_issue`

    - 更新現有問題
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `issue_number` (數字): 要更新的問題編號
      - `title` (選填字串): 新標題
      - `body` (選填字串): 新描述
      - `state` (選填字串): 新狀態('open' 或 'closed')
      - `labels` (選填字串[]): 新標籤
      - `assignees` (選填字串[]): 新受理人
      - `milestone` (選填數字): 新里程碑編號
    - 回傳: 更新後的問題詳情

12. `add_issue_comment`

    - 為問題加入評論
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `issue_number` (數字): 要評論的問題編號
      - `body` (字串): 評論文字
    - 回傳: 建立的評論詳情

13. `search_code`

    - 在 GitHub 倉庫中搜尋程式碼
    - 輸入:
      - `q` (字串): 使用 GitHub 程式碼搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(僅'indexed')
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 帶倉庫上下文的程式碼搜尋結果

14. `search_issues`

    - 搜尋問題和拉取請求
    - 輸入:
      - `q` (字串): 使用 GitHub 問題搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(comments, reactions, created 等)

- 在倉庫中建立或更新單個檔案
- 輸入:
  - `owner` (字串): 倉庫擁有者(使用者名稱或組織)
  - `repo` (字串): 倉庫名稱
  - `path` (字串): 建立/更新檔案的路徑
  - `content` (字串): 檔案內容
  - `message` (字串): 提交訊息
  - `branch` (字串): 建立/更新檔案的分支
  - `sha` (選填字串): 被替換檔案的 SHA (用於更新)
- 回傳: 檔案內容和提交詳情

2. `push_files`

   - 在單次提交中推送多個檔案
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `branch` (字串): 推送的目標分支
     - `files` (陣列): 要推送的檔案，每個包含 `path` 和 `content`
     - `message` (字串): 提交訊息
   - 回傳: 更新後的分支引用

3. `search_repositories`

   - 搜尋 GitHub 倉庫
   - 輸入:
     - `query` (字串): 搜尋查詢
     - `page` (選填數字): 分頁頁碼
     - `perPage` (選填數字): 每頁結果數量(最大 100)
   - 回傳: 倉庫搜尋結果

4. `create_repository`

   - 建立新的 GitHub 倉庫
   - 輸入:
     - `name` (字串): 倉庫名稱
     - `description` (選填字串): 倉庫描述
     - `private` (選填布林值): 是否為私有倉庫
     - `autoInit` (選填布林值): 是否使用 README 初始化
   - 回傳: 建立的倉庫詳情

5. `get_file_contents`

   - 取得檔案或目錄的內容
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `path` (字串): 檔案/目錄路徑
     - `branch` (選填字串): 取得內容的分支
   - 回傳: 檔案/目錄內容

6. `create_issue`

   - 建立新問題
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `title` (字串): 問題標題
     - `body` (選填字串): 問題描述
     - `assignees` (選填字串[]): 要分配的使用者名稱
     - `labels` (選填字串[]): 要加入的標籤
     - `milestone` (選填數字): 里程碑編號
   - 回傳: 建立的問題詳情

7. `create_pull_request`

   - 建立新的拉取請求
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `title` (字串): PR 標題
     - `body` (選填字串): PR 描述
     - `head` (字串): 包含變更的分支
     - `base` (字串): 要合併到的分支
     - `draft` (選填布林值): 是否建立為草稿 PR
     - `maintainer_can_modify` (選填布林值): 是否允許維護者編輯
   - 回傳: 建立的拉取請求詳情

8. `fork_repository`

   - 複製倉庫
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `organization` (選填字串): 複製到的組織
   - 回傳: 複製的倉庫詳情

9. `create_branch`

   - 建立新分支
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `branch` (字串): 新分支名稱
     - `from_branch` (選填字串): 來源分支(預設為倉庫預設分支)
   - 回傳: 建立的分支引用

10. `list_issues`

    - 列出和篩選倉庫問題
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `state` (選填字串): 按狀態篩選('open', 'closed', 'all')
      - `labels` (選填字串[]): 按標籤篩選
      - `sort` (選填字串): 排序方式('created', 'updated', 'comments')
      - `direction` (選填字串): 排序方向('asc', 'desc')
      - `since` (選填字串): 按日期篩選(ISO 8601 時間戳)
      - `page` (選填數字): 頁碼
      - `per_page` (選填數字): 每頁結果數
    - 回傳: 問題詳情陣列

11. `update_issue`

    - 更新現有問題
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `issue_number` (數字): 要更新的問題編號
      - `title` (選填字串): 新標題
      - `body` (選填字串): 新描述
      - `state` (選填字串): 新狀態('open' 或 'closed')
      - `labels` (選填字串[]): 新標籤
      - `assignees` (選填字串[]): 新受理人
      - `milestone` (選填數字): 新里程碑編號
    - 回傳: 更新後的問題詳情

12. `add_issue_comment`

    - 為問題加入評論
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `issue_number` (數字): 要評論的問題編號
      - `body` (字串): 評論文字
    - 回傳: 建立的評論詳情

13. `search_code`

    - 在 GitHub 倉庫中搜尋程式碼
    - 輸入:
      - `q` (字串): 使用 GitHub 程式碼搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(僅'indexed')
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 帶倉庫上下文的程式碼搜尋結果

14. `search_issues`

    - 搜尋問題和拉取請求
    - 輸入:
      - `q` (字串): 使用 GitHub 問題搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(comments, reactions, created 等)
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 問題和拉取請求搜尋結果

15. `search_users`

    - 搜尋 GitHub 使用者
    - 輸入:
      - `q` (字串): 使用 GitHub 使用者搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(followers, repositories, joined)
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 使用者搜尋結果

16. `list_commits`

- 取得倉庫分支的提交記錄
- 輸入:
  - `owner` (字串): 倉庫擁有者
  - `repo` (字串): 倉庫名稱
  - 在倉庫中建立或更新單一檔案
  - 輸入:
    - `owner` (字串): 倉庫擁有者(使用者名稱或組織)
    - `repo` (字串): 倉庫名稱
    - `path` (字串): 建立/更新檔案的路徑
    - `content` (字串): 檔案內容
    - `message` (字串): 提交訊息
    - `branch` (字串): 建立/更新檔案的分支
    - `sha` (選填字串): 被替換檔案的 SHA (用於更新)
  - 回傳: 檔案內容和提交詳情

2. `push_files`

   - 在單次提交中推送多個檔案
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `branch` (字串): 推送的目標分支
     - `files` (陣列): 要推送的檔案，每個包含 `path` 和 `content`
     - `message` (字串): 提交訊息
   - 回傳: 更新後的分支參考

3. `search_repositories`

   - 搜尋 GitHub 倉庫
   - 輸入:
     - `query` (字串): 搜尋查詢
     - `page` (選填數字): 分頁頁碼
     - `perPage` (選填數字): 每頁結果數量(最大 100)
   - 回傳: 倉庫搜尋結果

4. `create_repository`

   - 建立新的 GitHub 倉庫
   - 輸入:
     - `name` (字串): 倉庫名稱
     - `description` (選填字串): 倉庫描述
     - `private` (選填布林值): 是否為私有倉庫
     - `autoInit` (選填布林值): 是否使用 README 初始化
   - 回傳: 建立的倉庫詳情

5. `get_file_contents`

   - 取得檔案或目錄的內容
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `path` (字串): 檔案/目錄路徑
     - `branch` (選填字串): 取得內容的分支
   - 回傳: 檔案/目錄內容

6. `create_issue`

   - 建立新問題
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `title` (字串): 問題標題
     - `body` (選填字串): 問題描述
     - `assignees` (選填字串[]): 要分配的使用者名稱
     - `labels` (選填字串[]): 要加入的標籤
     - `milestone` (選填數字): 里程碑編號
   - 回傳: 建立的問題詳情

7. `create_pull_request`

   - 建立新的拉取請求
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `title` (字串): PR 標題
     - `body` (選填字串): PR 描述
     - `head` (字串): 包含變更的分支
     - `base` (字串): 要合併到的分支
     - `draft` (選填布林值): 是否建立為草稿 PR
     - `maintainer_can_modify` (選填布林值): 是否允許維護者編輯
   - 回傳: 建立的拉取請求詳情

8. `fork_repository`

   - 複製倉庫
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `organization` (選填字串): 複製到的組織
   - 回傳: 複製的倉庫詳情

9. `create_branch`

   - 建立新分支
   - 輸入:
     - `owner` (字串): 倉庫擁有者
     - `repo` (字串): 倉庫名稱
     - `branch` (字串): 新分支名稱
     - `from_branch` (選填字串): 來源分支(預設為倉庫預設分支)
   - 回傳: 建立的分支參考

10. `list_issues`

    - 列出和篩選倉庫問題
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `state` (選填字串): 按狀態篩選('open', 'closed', 'all')
      - `labels` (選填字串[]): 按標籤篩選
      - `sort` (選填字串): 排序方式('created', 'updated', 'comments')
      - `direction` (選填字串): 排序方向('asc', 'desc')
      - `since` (選填字串): 按日期篩選(ISO 8601 時間戳)
      - `page` (選填數字): 頁碼
      - `per_page` (選填數字): 每頁結果數
    - 回傳: 問題詳情陣列

11. `update_issue`

    - 更新現有問題
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `issue_number` (數字): 要更新的問題編號
      - `title` (選填字串): 新標題
      - `body` (選填字串): 新描述
      - `state` (選填字串): 新狀態('open' 或 'closed')
      - `labels` (選填字串[]): 新標籤
      - `assignees` (選填字串[]): 新受理人
      - `milestone` (選填數字): 新里程碑編號
    - 回傳: 更新後的問題詳情

12. `add_issue_comment`

    - 為問題加入評論
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `issue_number` (數字): 要評論的問題編號
      - `body` (字串): 評論文字
    - 回傳: 建立的評論詳情

13. `search_code`

    - 在 GitHub 倉庫中搜尋程式碼
    - 輸入:
      - `q` (字串): 使用 GitHub 程式碼搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(僅'indexed')
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 帶倉庫上下文的程式碼搜尋結果

14. `search_issues`

    - 搜尋問題和拉取請求
    - 輸入:
      - `q` (字串): 使用 GitHub 問題搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(comments, reactions, created 等)
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 問題和拉取請求搜尋結果

15. `search_users`

    - 搜尋 GitHub 使用者
    - 輸入:
      - `q` (字串): 使用 GitHub 使用者搜尋語法的搜尋查詢
      - `sort` (選填字串): 排序欄位(followers, repositories, joined)
      - `order` (選填字串): 排序順序('asc' 或 'desc')
      - `per_page` (選填數字): 每頁結果數(最大 100)
      - `page` (選填數字): 頁碼
    - 回傳: 使用者搜尋結果

16. `list_commits`

    - 取得倉庫分支的提交記錄
    - 輸入:
      - `owner` (字串): 倉庫擁有者
      - `repo` (字串): 倉庫名稱
      - `page` (選填字串): 頁碼
      - `per_page` (選填字串): 每頁記錄數
      - `sha` (選填字串): 分支名稱
    - 回傳: 提交列表

## 搜尋查詢語法

### 程式碼搜尋

- `language:javascript`: 按程式語言搜尋
- `repo:owner/name`: 在特定倉庫中搜尋
- `path:app/src`: 在特定路徑中搜尋
- `extension:js`: 按副檔名搜尋
- 範例: `q: "import express" language:typescript path:src/`

### 問題搜尋

- `is:issue` 或 `is:pr`: 按類型篩選
- `is:open` 或 `is:closed`: 按狀態篩選
- `label:bug`: 按標籤搜尋
- `author:username`: 按作者搜尋
- 範例: `q: "memory leak" is:issue is:open label:bug`

### 使用者搜尋

- `type:user` 或 `type:org`: 按帳戶類型篩選
- `followers:>1000`: 按追蹤者數篩選
- `location:London`: 按位置搜尋
- 範例: `q: "fullstack developer" location:London followers:>100`

有關詳細的搜尋語法，請參閱 [GitHub 的搜尋文件](https://docs.github.com/zh-tw/search-github/searching-on-github)。

### 個人存取權杖

- 前往 [個人存取權杖](https://github.com/settings/tokens) (在 GitHub 設定 > 開發者設定中)
- 選擇此權杖可以存取的倉庫(公開、全部或選擇)
- 建立一個具有 `repo` 作用域的權杖("完全控制私有倉庫")
  - 或者，如果只使用公開倉庫，僅選擇 `public_repo` 作用域
- 複製產生的權杖

### 使用 Claude Desktop

要使用此伺服器與 Claude Desktop，請將以下內容新增到 `claude_desktop_config.json` 中：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## 授權條款

此 MCP 伺服器基於 MIT 許可證發布。這表示您可以自由使用、修改和分發軟體，但需遵守 MIT 許可證的條款和條件。更多詳情請參閱專案倉庫中的 LICENSE 文件。
