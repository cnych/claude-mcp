---
name: MiniMax MCP
digest: MiniMax 官方 MCP 伺服器，支援與強大的文字轉語音及影片/圖片生成 API 互動。此伺服器讓 MCP 客戶端（如 Claude 桌面版、Cursor、Windsurf、OpenAI 代理等）能生成語音、克隆聲音、生成影片、生成圖片等功能。
author: MiniMax-AI
repository: https://github.com/MiniMax-AI/MiniMax-MCP
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - MiniMax
  - 語音
  - 影片
  - 圖片
  - 音訊
icon: https://avatars.githubusercontent.com/u/194880281?v=4
createTime: 2025-04-10
---

![MiniMax Logo](https://static.claudemcp.com/images/MiniMaxLogo-Light.png)

官方 MiniMax 模型情境協定(MCP)伺服器，可與強大的文字轉語音及影片/圖片生成 API 互動。此伺服器讓 MCP 客戶端如 Claude 桌面版、Cursor、Windsurf、OpenAI 代理等能生成語音、克隆聲音、生成影片、生成圖片等功能。

## MCP 客戶端快速入門

- 1. 從[MiniMax](https://www.minimax.io/platform/user-center/basic-information/interface-key)取得您的 API 金鑰。
- 2. 安裝`uv`(Python 套件管理工具)，使用`curl -LsSf https://astral.sh/uv/install.sh | sh`安裝或參閱`uv`[儲存庫](https://github.com/astral-sh/uv)獲取其他安裝方式。
- 3. **重要**：API 主機與金鑰依地區而異且必須匹配，否則會遇到`無效API金鑰`錯誤。

| 地區             | 全球                                                                                                | 中國大陸                                                                                   |
| :--------------- | :-------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| MINIMAX_API_KEY  | 從[MiniMax 全球站](https://www.minimax.io/platform/user-center/basic-information/interface-key)取得 | 從[MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key)取得 |
| MINIMAX_API_HOST | ​https://api.minimaxi.chat (注意多一個**"i"**)                                                      | ​https://api.minimax.chat                                                                  |

### Claude 桌面版

前往`Claude > 設定 > 開發者 > 編輯設定 > claude_desktop_config.json`加入以下內容：

```
{
  "mcpServers": {
    "MiniMax": {
      "command": "uvx",
      "args": [
        "minimax-mcp"
      ],
      "env": {
        "MINIMAX_API_KEY": "在此填入您的API金鑰",
        "MINIMAX_MCP_BASE_PATH": "本地輸出目錄路徑，例如/User/xxx/Desktop",
        "MINIMAX_API_HOST": "API主機，​https://api.minimaxi.chat|https://api.minimax.chat",
        "MINIMAX_API_RESOURCE_MODE": "選填，[url|local]，預設為url，音訊/圖片/影片可下載至本地或提供URL格式"
      }
    }
  }
}
```

⚠️ 警告：API 金鑰需與主機匹配。若出現「API 錯誤：無效 api 金鑰」訊息，請檢查您的 api 主機：

- 全球主機：`​https://api.minimaxi.chat` (注意多一個"i")
- 中國大陸主機：​`https://api.minimax.chat`

若您使用 Windows 系統，需在 Claude 桌面版中啟用「開發者模式」才能使用 MCP 伺服器。點擊左上角漢堡選單中的「幫助」並選擇「啟用開發者模式」。

### Cursor

前往`Cursor -> 偏好設定 -> Cursor設定 -> MCP -> 新增全域MCP伺服器`以新增上述配置。

## 傳輸方式

我們支援兩種傳輸類型：stdio 與 sse。
| stdio | SSE |
|:-----|:-----|
| 本地執行 | 可部署於本地或雲端 |
| 透過`stdout`通訊 | 透過`網路`通訊 |
| 輸入：支援處理`本地檔案`或有效`URL`資源 | 輸入：部署於雲端時建議使用`URL`作為輸入 |

## 可用工具

| 工具             | 描述                       |
| ---------------- | -------------------------- |
| `text_to_audio`  | 以指定聲音將文字轉為音訊   |
| `list_voices`    | 列出所有可用聲音           |
| `voice_clone`    | 使用提供的音訊檔案克隆聲音 |
| `generate_video` | 根據提示詞生成影片         |
| `text_to_image`  | 根據提示詞生成圖片         |

## 常見問題

### 1. 無效 api 金鑰

請確認您的 API 金鑰與 API 主機地區匹配
|地區| 全球 | 中國大陸 |
|:--|:-----|:-----|
|MINIMAX_API_KEY| 從[MiniMax 全球站](https://www.minimax.io/platform/user-center/basic-information/interface-key)取得 | 從[MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key)取得 |
|MINIMAX_API_HOST| ​https://api.minimaxi.chat (注意多一個**"i"**) | ​https://api.minimax.chat |

### 2. spawn uvx ENOENT

請在終端機執行以下指令確認其絕對路徑：

```sh
which uvx
```

取得絕對路徑後(例如/usr/local/bin/uvx)，更新您的設定使用該路徑(例如"command": "/usr/local/bin/uvx")。

## 使用範例

⚠️ 警告：使用這些工具可能產生費用。

### 1. 播報一段晚間新聞

![播報一段晚間新聞](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-268624ab.jpg)

### 2. 克隆聲音

![克隆聲音](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-6362babc.jpg)

### 3. 生成影片

![生成影片](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-ebf0c2e1.jpg)
![生成影片](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-47236af8.jpg)

### 4. 生成圖片

![生成圖片](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-0730dc0a.jpg)
![生成圖片](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-f0acd0d5.jpg)
