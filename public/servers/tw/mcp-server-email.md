---
name: MCP Email Server
digest: 📧 一個提供電子郵件功能的模型上下文協議伺服器。該伺服器使大型語言模型能夠撰寫和發送電子郵件，並能在指定目錄中搜尋附件。
author: Shy2593666979
repository: https://github.com/Shy2593666979/mcp-server-email
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 電子郵件
  - smtp
  - 搜尋
icon: https://avatars.githubusercontent.com/u/105286202?v=4
createTime: 2025-03-23
---

一個提供電子郵件功能的 [Model Context Protocol](/tw) 伺服器。此伺服器讓 LLMs 能夠撰寫並發送電子郵件，同時也能在指定目錄中搜尋附件。

![1742711978001](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-3f2f5e52.jpg)

![1742712768132](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-8d59fdeb.jpg)

## 功能特色

- 支援多收件人的郵件發送
- 電子郵件附件功能
- 基於模式匹配的目錄檔案搜尋
- 使用 SMTP 的安全郵件傳輸

### 可用工具

- `send_email` - 根據提供的主旨、內文和收件人發送電子郵件

  - `receiver` (字串陣列，必填): 收件人電子郵件地址列表
  - `body` (字串，必填): 郵件主要內容
  - `subject` (字串，必填): 郵件主旨
  - `attachments` (字串陣列或字串，選填): 郵件附件(檔案名稱)

- `search_attachments` - 在指定目錄中搜尋符合給定模式的檔案
  - `pattern` (字串，必填): 要在檔案名稱中搜尋的文字模式

### 提示指令

- **send_email**

  - 發送帶有可選附件的電子郵件
  - 參數:
    - `receiver` (必填): 收件人電子郵件地址列表
    - `body` (必填): 郵件主要內容
    - `subject` (必填): 郵件主旨
    - `attachments` (選填): 郵件附件

- **search_attachments**
  - 搜尋符合模式的檔案
  - 參數:
    - `pattern` (必填): 要在檔案名稱中搜尋的文字模式

## 安裝指南

### 使用 pip

安裝必要相依套件:

```bash
pip install pydantic python-dotenv
```

### 郵件設定

需準備包含 SMTP 伺服器設定的 `email.json` 檔案:

```json
[
  {
    "domain": "@gmail.com",
    "server": "smtp.gmail.com",
    "port": 587
  },
  {
    "domain": "@outlook.com",
    "server": "smtp.office365.com",
    "port": 587
  },
  {
    "domain": "@yahoo.com",
    "server": "smtp.mail.yahoo.com",
    "port": 587
  }
]
```

## 使用說明

### 啟動伺服器

執行以下指令啟動 MCP 郵件伺服器:

```bash
python -m mcp_email_server (--dir /path/to/attachment/directory)
```

### 為 Claude.app 進行設定

將以下內容加入您的 Claude 設定中:

#### Conda 環境

```json
{
  "mcpServers": {
    "email": {
      "command": "D:\\conda\\envs\\mcp\\python.exe",
      "args": [
        "C:\\Users\\YourUserName\\Desktop\\servers\\src\\email\\src\\mcp_server_email",
        "--dir",
        "C:\\Users\\YourUserName\\Desktop"
      ],
      "env": {
        "SENDER": "2593666979q@gmail.com",
        "PASSWORD": "tuogk......."
      }
    }
  }
}
```

#### UV 環境

```json
{
  "mcpServers": {
    "email": {
      "command": "uv",
      "args": [
        "~\\servers\\src\\email\\src\\mcp_server_email",
        "--dir",
        "C:\\Users\\YourUserName\\Desktop"
      ],
      "env": {
        "SENDER": "2593666979q@gmail.com",
        "PASSWORD": "tuogk......."
      }
    }
  }
}
```

## 安全注意事項

- 對於 Gmail 等服務，您可能需要使用應用程式專用密碼
- 基於安全考量，伺服器僅支援有限類型的附件檔案

## 支援的檔案類型

伺服器支援以下附件檔案類型:

- 文件: doc, docx, xls, xlsx, ppt, pptx, pdf
- 壓縮檔: zip, rar, 7z, tar, gz
- 文字檔: txt, log, csv, json, xml
- 圖片: jpg, jpeg, png, gif, bmp
- 其他: md

## 使用範例

### 發送電子郵件

```json
{
  "receiver": ["recipient@example.com"],
  "subject": "來自 MCP 伺服器的測試郵件",
  "body": "這是一封透過 MCP 郵件伺服器發送的測試郵件。",
  "attachments": ["document.pdf", "image.jpg"]
}
```

### 搜尋附件

```json
{
  "pattern": "report"
}
```

## 授權條款

MCP 郵件伺服器採用 MIT 授權條款。這表示您可以自由使用、修改和分發此軟體，但須遵守 MIT 授權條款的相關規定。
