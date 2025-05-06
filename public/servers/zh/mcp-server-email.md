---
name: MCP Email Server
digest: 📧 一个提供电子邮件功能的模型上下文协议服务器。该服务器使大型语言模型能够撰写和发送电子邮件，并能在指定目录中搜索附件。
author: Shy2593666979
repository: https://github.com/Shy2593666979/mcp-server-email
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 电子邮件
  - smtp
  - 搜索
icon: https://avatars.githubusercontent.com/u/105286202?v=4
createTime: 2025-03-23
---

一个提供电子邮件功能的[模型上下文协议](/zh)服务器。该服务器使大型语言模型能够撰写和发送电子邮件，并能在指定目录中搜索附件。

![](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-3f2f5e52.jpg)

![](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-8d59fdeb.jpg)

## 功能特性

- 支持多收件人邮件发送
- 邮件附件功能
- 基于模式匹配的目录文件搜索
- 使用 SMTP 的安全邮件传输

### 可用工具

- `send_email` - 根据提供的主题、正文和收件人发送邮件

  - `receiver`（字符串数组，必填）：收件人邮箱地址列表
  - `body`（字符串，必填）：邮件正文内容
  - `subject`（字符串，必填）：邮件主题行
  - `attachments`（字符串数组或字符串，可选）：邮件附件（文件名）

- `search_attachments` - 在指定目录中搜索匹配给定模式的文件
  - `pattern`（字符串，必填）：用于匹配文件名的文本模式

### 提示指令

- **send_email**

  - 发送带可选附件的邮件
  - 参数：
    - `receiver`（必填）：收件人邮箱地址列表
    - `body`（必填）：邮件正文内容
    - `subject`（必填）：邮件主题行
    - `attachments`（可选）：邮件附件

- **search_attachments**
  - 搜索匹配模式的文件
  - 参数：
    - `pattern`（必填）：用于匹配文件名的文本模式

## 安装指南

### 使用 pip

安装所需依赖：

```bash
pip install pydantic python-dotenv
```

### 邮件配置

包含 SMTP 服务器配置的 `email.json` 文件：

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

## 使用说明

### 启动服务器

运行以下命令启动 MCP 邮件服务器：

```bash
python -m mcp_email_server (--dir /path/to/attachment/directory)
```

### Claude.app 配置

添加到您的 Claude 设置中：

#### Conda 环境

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

#### UV 环境

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

## 安全注意事项

- 对于 Gmail 等服务，可能需要使用应用专用密码
- 出于安全考虑，服务器仅支持有限类型的附件文件

## 支持的文件类型

服务器支持以下附件文件类型：

- 文档：doc, docx, xls, xlsx, ppt, pptx, pdf
- 压缩包：zip, rar, 7z, tar, gz
- 文本文件：txt, log, csv, json, xml
- 图片：jpg, jpeg, png, gif, bmp
- 其他：md

## 使用示例

### 发送邮件

```json
{
  "receiver": ["recipient@example.com"],
  "subject": "来自 MCP 服务器的测试邮件",
  "body": "这是通过 MCP 邮件服务器发送的测试邮件。",
  "attachments": ["document.pdf", "image.jpg"]
}
```

### 搜索附件

```json
{
  "pattern": "报告"
}
```

## 许可证

MCP 邮件服务器采用 MIT 许可证授权。这意味着您可以自由使用、修改和分发该软件，但需遵守 MIT 许可证的条款和条件。
