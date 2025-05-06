---
name: Image-Gen-Server
digest: Image-Gen-Server 是一款強大的圖像生成工具，能從文字提示創建高品質視覺內容。它提供快速處理、可自訂輸出，並支援多種風格以滿足多元創意需求。此服務非常適合設計師、行銷人員和內容創作者尋求高效的視覺內容製作。
author: fengin
homepage: https://github.com/fengin/image-gen-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 人工智慧
  - 圖像
  - 整合開發環境
icon: https://avatars.githubusercontent.com/u/49424247?v=4
createTime: 2025-02-07
---
![Image-Gen-Server Logo](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-167510b5.png)

基於即夢AI的圖像生成服務，專門設計用於與Cursor IDE整合。它接收來自Cursor的文字描述，生成相應的圖像，並提供圖片下載和儲存功能。

![範例](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-12f05bd3.png)

## 特性

- 與Cursor IDE完美整合
- 支援文字到圖像的生成
- 自動儲存生成的圖像
- 支援自訂儲存路徑
- 一次生成四張圖，提供更多選擇

## 安裝

1. 環境準備
- python 3.10+
- 安裝npm
- 安裝nodejs（v20已驗證可用）
- 安裝 pip install uv
- 除錯需要安裝：npm install -g @modelcontextprotocol/inspector@0.4.0

2. 複製專案
   
   ```bash
   git clone https://github.com/fengin/image-gen-server.git
   cd image-gen-server
   ```

3. 安裝依賴
   
   ```bash
   pip install -r requirements.txt
   pip install uv
   ```

4. 設定即夢Token和圖片預設儲存地址
   修改server.py檔案裡面這兩個設定
   
   ```bash
   # API設定
   JIMENG_API_TOKEN = "057f7addf85dxxxxxxxxxxxxx" # 你登入即夢獲得的session_id，支援多個，在後面用逗號分隔   
   IMG_SAVA_FOLDER = "D:/code/image-gen-server/images" # 圖片預設儲存路徑
   ```

## Cursor整合

![Cursor 設定](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-fa725511.png)

1. 開啟Cursor設定
   
   - 點擊左下角的設定圖示
   - 選擇 Features > MCP Servers
   - 點擊 "Add new MCP server"

2. 填寫伺服器設定
   
   - Name: `image-gen-server`（或其他你喜歡的名稱）
   - Type: `command`
   - Command: 
     
     ```bash
     uv run --with fastmcp fastmcp run D:\code\image-gen-service\server.py
     ```
     
     注意：將路徑替換為你的實際專案路徑
     
     - Windows範例: ` uv run --with fastmcp fastmcp run D:/code/image-gen-service/server.py`
     - macOS/Linux範例: ` uv run --with fastmcp fastmcp run /Users/username/code/image-gen-server/server.py`

## 使用方法

在Cursor中，你要讓cursor生成圖片，在agent模式下，你提示它了解下圖片工具使用方法，然後直接提你要生成的圖片要求，儲存位置就行了

## 取得即夢Token

1. 訪問 [即夢](https://jimeng.jianying.com/)
2. 登入帳號
3. 按F12開啟開發者工具
4. 在Application > Cookies中找到`sessionid`
5. 將找到的sessionid設定到server.py的JIMENG_API_TOKEN中

## 工具函數說明

### generate_image

```python
async def generate_image(prompt: str, file_name: str, save_folder: str = None, sample_strength: float = 0.5, width: int = 1024, height: int = 1024) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """根據文字描述生成圖片

    Args:
        prompt: 圖片的文字prompt描述
        file_name: 生成圖片的檔案名(不含路徑，如果沒有後綴則預設使用.jpg)
        save_folder: 圖片儲存絕對地址目錄(可選,預設使用IMG_SAVA_FOLDER)
        sample_strength: 生成圖片的精細度(可選,範圍0-1,預設0.5)
        width: 生成圖片的寬度(可選,預設1024)
        height: 生成圖片的高度(可選,預設1024)

    Returns:
        List: 包含生成結果的JSON字串
    """
```

### 技術實現

1. server.py採用了fastmcp實現了mcp sever的能力，提供給cursor/claude使用

2. sever.py呼叫了proxy.jimeng模組逆向與即夢AI進行互動。
proxy.jimeng逆向模組也可以單獨install使用，主要提供了以下主要功能：

- 圖像生成（generate_images）
- 同步對話補全（create_completion）
- 流式對話補全（create_completion_stream）
- 多帳號token支援
- 完整的錯誤處理

### 使用範例

```cmd
# cursor agent模式下
#例子一
根據提供過你的專案需求，幫我生成一張產品logo，放在專案目錄images下面

#例子二
根據專案需求，幫我製作網站的首頁，頭部需要有banner圖片。
```

## 授權許可

MIT License 
作者：凌封

## 故障排除

1.設定完後跳出黑視窗，很快消失，工具狀態變成No tools found

  原因：沒有正常啟動，一般有以下原因

- 設定命令不對，檢查命令是否正確，一般是server.py路徑不對，或者路徑中包含中文，或者正反斜槓不對
- 依賴的環境沒準備好
- 依賴執行的終端不對

2.正常執行後，想看呼叫日誌，或者除錯怎麼弄

  命令改成以下：

```
uv run --with fastmcp fastmcp dev D:/code/image-gen-service/server.py
```

  即把最後一個run 改成 dev。

  或者找個終端執行以下命令進入除錯模式：

```
fastmcp dev D:/code/image-gen-service/server.py
```