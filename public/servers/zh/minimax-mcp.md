---
name: MiniMax MCP
digest: MiniMax 官方 MCP 服务器，支持与强大的文本转语音和视频/图像生成 API 交互。该服务器允许 MCP 客户端（如 Claude 桌面版、Cursor、Windsurf、OpenAI 代理等）生成语音、克隆声音、生成视频、生成图像等功能。
author: MiniMax-AI
repository: https://github.com/MiniMax-AI/MiniMax-MCP
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - MiniMax
  - 语音
  - 视频
  - 图像
  - 音频
icon: https://avatars.githubusercontent.com/u/194880281?v=4
createTime: 2025-04-10
---

![MiniMax Logo](/images/MiniMaxLogo-Light.png)

MiniMax 官方模型上下文协议(MCP)服务器，支持与强大的文本转语音和视频/图像生成 API 交互。该服务器允许 Claude 桌面版、Cursor、Windsurf、OpenAI 代理等 MCP 客户端生成语音、克隆声音、生成视频、生成图像等功能。

## MCP 客户端快速入门

- 1. 从[MiniMax](https://www.minimax.io/platform/user-center/basic-information/interface-key)获取 API 密钥。
- 2. 安装`uv`(Python 包管理器)，使用`curl -LsSf https://astral.sh/uv/install.sh | sh`安装，或查看`uv`[仓库](https://github.com/astral-sh/uv)获取其他安装方法。
- 3. **重要**：API 主机和密钥因地区而异，必须匹配；否则会遇到`Invalid API key`错误。

| 地区             | 国际版                                                                                              | 中国大陆版                                                                                 |
| :--------------- | :-------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| MINIMAX_API_KEY  | 从[MiniMax 国际版](https://www.minimax.io/platform/user-center/basic-information/interface-key)获取 | 从[MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key)获取 |
| MINIMAX_API_HOST | ​https://api.minimaxi.chat (注意多一个**"i"**)                                                      | ​https://api.minimax.chat                                                                  |

### Claude 桌面版

前往`Claude > 设置 > 开发者 > 编辑配置 > claude_desktop_config.json`，添加以下内容：

```
{
  "mcpServers": {
    "MiniMax": {
      "command": "uvx",
      "args": [
        "minimax-mcp"
      ],
      "env": {
        "MINIMAX_API_KEY": "在此处插入您的API密钥",
        "MINIMAX_MCP_BASE_PATH": "本地输出目录路径，例如/User/xxx/Desktop",
        "MINIMAX_API_HOST": "API主机，​https://api.minimaxi.chat|https://api.minimax.chat",
        "MINIMAX_API_RESOURCE_MODE": "可选，[url|local]，默认为url，音频/图像/视频是本地下载还是以URL格式提供"
      }
    }
  }
}
```

⚠️ 警告：API 密钥需要与主机匹配。如果出现"API Error: invalid api key"错误，请检查您的 API 主机：

- 国际版主机：`​https://api.minimaxi.chat` (注意多一个"i")
- 中国大陆版主机：​`https://api.minimax.chat`

如果您使用 Windows，需要在 Claude 桌面版中启用"开发者模式"才能使用 MCP 服务器。点击左上角菜单中的"帮助"，选择"启用开发者模式"。

### Cursor

前往`Cursor -> 首选项 -> Cursor设置 -> MCP -> 添加新的全局MCP服务器`，添加上述配置。

## 传输方式

我们支持两种传输类型：stdio 和 sse。
| stdio | SSE |
|:-----|:-----|
| 本地运行 | 可本地或云端部署 |
| 通过`stdout`通信 | 通过网络通信 |
| 输入：支持处理`本地文件`或有效`URL`资源 | 输入：云端部署时建议使用`URL`输入 |

## 可用工具

| 工具             | 描述                         |
| ---------------- | ---------------------------- |
| `text_to_audio`  | 使用指定语音将文本转换为音频 |
| `list_voices`    | 列出所有可用语音             |
| `voice_clone`    | 使用提供的音频文件克隆语音   |
| `generate_video` | 根据提示生成视频             |
| `text_to_image`  | 根据提示生成图像             |

## 常见问题

### 1. 无效 API 密钥

请确保您的 API 密钥和 API 主机地区匹配
|地区| 国际版 | 中国大陆版 |
|:--|:-----|:-----|
|MINIMAX_API_KEY| 从[MiniMax 国际版](https://www.minimax.io/platform/user-center/basic-information/interface-key)获取 | 从[MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key)获取 |
|MINIMAX_API_HOST| ​https://api.minimaxi.chat (注意多一个**"i"**) | ​https://api.minimax.chat |

### 2. spawn uvx ENOENT

请在终端中运行以下命令确认其绝对路径：

```sh
which uvx
```

获取绝对路径后(如/usr/local/bin/uvx)，更新配置使用该路径(如"command": "/usr/local/bin/uvx")。

## 使用示例

⚠️ 警告：使用这些工具可能会产生费用。

### 1. 播报一段晚间新闻

![播报一段晚间新闻](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-268624ab.jpg)

### 2. 克隆语音

![克隆语音](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-6362babc.jpg)

### 3. 生成视频

![生成视频](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-ebf0c2e1.jpg)
![生成视频](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-47236af8.jpg)

### 4. 生成图像

![生成图像](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-0730dc0a.jpg)
![生成图像](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-f0acd0d5.jpg)
