---
name: Blender MCP
digest: 透過 MCP 允許大語言模型直接與 Blender 互動和控制
author: ahujasid
repository: https://github.com/ahujasid/blender-mcp
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - blender
  - 3D
icon: https://avatars.githubusercontent.com/u/11807284?s=48&v=4
createTime: 2025-04-07
---

[Blender MCP](https://github.com/ahujasid/blender-mcp) 是一個 Blender MCP 伺服器，透過 Model Context Protocol (MCP)與大型語言模型連接，讓大型語言模型能直接與 Blender 互動和控制。這個整合讓使用者能透過提示詞來輔助 3D 建模、場景建立與操作。特別適合想簡化流程的初學者和專業人士。

[Blender](https://www.blender.org/) 是一個 3D 建模軟體，可用來建立 3D 模型、2D 圖形，甚至製作動畫。

![Blender](/images/blender.png)

## 安裝與設定

Blender MCP 是一個使用 Python 開發的開源專案，需要先安裝 Python 3.10 或更高版本。當然也需要安裝 Blender 3.0 或更高版本。

接著需要安裝`uv`套件管理工具，這是一個用 Rust 開發的高效能 Python 套件管理工具。

**Mac**

```bash
brew install uv
```

**Windows**

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

還需要設定環境變數:

```bash
set Path=C:\Users\nntra\.local\bin;%Path%
```

**Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

也可以選擇手動安裝，詳情請參考[Install uv](https://docs.astral.sh/uv/getting-started/installation/)。

安裝完成後，就可以在 Claude MCP 客戶端中啟用 Blender MCP 伺服器了。

**Claude for Desktop**

在`Claude for Desktop`中，開啟客戶端，點選`Settings` > `Developer` > `Edit Config` > `claude_desktop_config.json`檔案，加入以下內容：

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

設定完成後，稍等片刻就能在`Claude for Desktop`左側工具列看到錘子圖示，點選即可看到 Blender MCP 工具。

![Blender MCP On Claude Desktop](/images/blender-mcp-on-claude-desktop.png)

**Cursor**

在 Cursor 中，開啟`Cursor Settings` > `MCP` > `+ Add new global MCP server`，加入以下內容：

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

如果只想在特定專案中啟用，請將上述設定檔加入專案根目錄的`.cursor/mcp.json`檔案中。

> ⚠️ 注意：由於某些 MCP 伺服器或用戶開啟過多 MCP 伺服器，可能導致 Cursor 工具列表過長，目前 Cursor 只會將前 40 個工具傳送給 LLM，建議測試時僅開啟 Blender MCP 伺服器。

設定完成後，在 Cursor 設定頁面的 MCP 分頁中就能看到新增的 Blender MCP 伺服器（記得啟用）。

![Blender MCP On Cursor](/images/blender-mcp-on-cursor.png)

## 使用方式

完成 Blender MCP 伺服器設定後，還需要在 Blender 中安裝外掛程式。從 Blender MCP 的 GitHub 儲存庫取得`addon.py`檔案，網址：[https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py](https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py)，下載後儲存為`addon.py`檔案。

開啟 Blender，進入`Edit` > `Preferences` > `Add-ons`，點選`Install from Disk...`按鈕，選擇剛才下載的`addon.py`檔案。

![Blender install addon](/images/blender-install-addon.png)

記得勾選`Blender MCP`選項才能正常使用。

![Blender enable addon](/images/blender-enable-addon.png)

回到 Blender，在 3D 視圖側邊欄（可按`N`鍵顯示）找到`BlenderMCP`分頁，勾選`Poly Haven`（選用），然後點選`Connect to MCP server`按鈕。

![Blender MCP Addon Connect](/images/blender-mcp-addon-connect.png)

完成所有準備工作後，就能在 Claude Desktop 或 Cursor 中輸入指令來控制 Blender 了。目前支援以下功能：

- 取得場景和物件資訊
- 建立、刪除和修改形狀
- 套用或建立物件材質
- 在 Blender 中執行任意 Python 程式碼
- 透過[Poly Haven](https://polyhaven.com/)下載模型、資產和 HDRIs
- 透過[Hyper3D Rodin](https://hyper3d.ai/)生成 3D 模型，可從[hyper3d.ai](https://hyper3d.ai/)或[fal.ai](https://fal.ai/)取得完整金鑰。

例如在 Cursor 中輸入以下提示詞讓 Blender 建立場景：

```
Create a beach vibe in blender scene. Let there be:

* Sky HDRI image
* some nice sandy ground
* some rocks and shrubbery in the scene
* any other props you can think of to make it look like a beach
```

接著就能看到 Blender 開始自動建立場景。

:::youtube 0SuVIfLoUnA:::

還能透過[Hyper3D Rodin](https://hyper3d.ai/)生成 3D 模型，需先在[Hyper3D Rodin](https://hyper3d.ai/)註冊帳號並取得金鑰，在 Blender 外掛程式中設定後，就能在 Cursor 中輸入提示詞來生成 3D 模型。

> 另外 Blender MCP 除了支援 Tools 之外，還支援 Prompts，但目前 Cursor 尚未支援 Prompts。

## 疑難排解

常見問題包括：

- **連線問題**：確認外掛伺服器正在執行，MCP 設定正確，首次指令可能失敗需重試。
- **逾時錯誤**：簡化請求或分步操作。
- **Poly Haven 問題**：可能不穩定，建議重試或檢查狀態。
- **一般問題**：重新啟動 Claude 和 Blender 伺服器。

## 總結

Blender MCP 專案展示了 AI 輔助 3D 建模的潛力，透過 MCP 標準化協定簡化了複雜操作，提升了效率。隨著 MCP 普及，未來可能看到更多軟體與 AI 整合，進一步擴展創意工具的可能性。
