---
name: MiniMax MCP
digest: Official MiniMax MCP server that enables interaction with powerful Text to Speech and video/image generation APIs. This server allows MCP clients like Claude Desktop, Cursor, Windsurf, OpenAI Agents and others to generate speech, clone voices, generate video, generate image and more.
author: MiniMax-AI
repository: https://github.com/MiniMax-AI/MiniMax-MCP
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - MiniMax
  - speech
  - voice
  - image
  - video
icon: https://avatars.githubusercontent.com/u/194880281?v=4
createTime: 2025-04-10
---

![MiniMax Logo](/images/MiniMaxLogo-Light.png)

Official MiniMax Model Context Protocol (MCP) server that enables interaction with powerful Text to Speech and video/image generation APIs. This server allows MCP clients like Claude Desktop, Cursor, Windsurf, OpenAI Agents and others to generate speech, clone voices, generate video, generate image and more.

## Quickstart with MCP Client

- 1. Get your API key from [MiniMax](https://www.minimax.io/platform/user-center/basic-information/interface-key).
- 2. Install `uv` (Python package manager), install with `curl -LsSf https://astral.sh/uv/install.sh | sh` or see the `uv` [repo](https://github.com/astral-sh/uv) for additional install methods.
- 3. **Important**: The API host and key vary by region and must match; otherwise, you'll encounter an `Invalid API key` error.

| Region           | Global                                                                                                    | Mainland                                                                                         |
| :--------------- | :-------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| MINIMAX_API_KEY  | go get from [MiniMax Global](https://www.minimax.io/platform/user-center/basic-information/interface-key) | go get from [MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key) |
| MINIMAX_API_HOST | ​https://api.minimaxi.chat (note the extra **"i"**)                                                       | ​https://api.minimax.chat                                                                        |

### Claude Desktop

Go to `Claude > Settings > Developer > Edit Config > claude_desktop_config.json` to include the following:

```
{
  "mcpServers": {
    "MiniMax": {
      "command": "uvx",
      "args": [
        "minimax-mcp"
      ],
      "env": {
        "MINIMAX_API_KEY": "insert-your-api-key-here",
        "MINIMAX_MCP_BASE_PATH": "local-output-dir-path, such as /User/xxx/Desktop",
        "MINIMAX_API_HOST": "api host, ​https://api.minimaxi.chat|https://api.minimax.chat",
        "MINIMAX_API_RESOURCE_MODE": "optional, [url|local], url is default, audio/image/video are downloaded locally or provided in URL format"
      }
    }
  }
}
```

⚠️ Warning: The API key needs to match the host. If an error "API Error: invalid api key" occurs, please check your api host:

- Global Host：`​https://api.minimaxi.chat` (note the extra "i")
- Mainland Host：​`https://api.minimax.chat`

If you're using Windows, you will have to enable "Developer Mode" in Claude Desktop to use the MCP server. Click "Help" in the hamburger menu in the top left and select "Enable Developer Mode".

### Cursor

Go to `Cursor -> Preferences -> Cursor Settings -> MCP -> Add new global MCP Server` to add above config.

## Transport

We support two transport types: stdio and sse.
| stdio | SSE |
|:-----|:-----|
| Run locally | Can be deployed locally or in the cloud |
| Communication through `stdout` | Communication through `network` |
| Input: Supports processing `local files` or valid `URL` resources | Input: When deployed in the cloud, it is recommended to use `URL` for input |

## Available Tools

| tool             | description                              |
| ---------------- | ---------------------------------------- |
| `text_to_audio`  | Convert text to audio with a given voice |
| `list_voices`    | List all voices available                |
| `voice_clone`    | Clone a voice using provided audio files |
| `generate_video` | Generate a video from a prompt           |
| `text_to_image`  | Generate a image from a prompt           |

## FAQ

### 1. invalid api key

Please ensure your API key and API host are regionally aligned
|Region| Global | Mainland |
|:--|:-----|:-----|
|MINIMAX_API_KEY| go get from [MiniMax Global](https://www.minimax.io/platform/user-center/basic-information/interface-key) | go get from [MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key) |
|MINIMAX_API_HOST| ​https://api.minimaxi.chat (note the extra **"i"**) | ​https://api.minimax.chat |

### 2. spawn uvx ENOENT

Please confirm its absolute path by running this command in your terminal:

```sh
which uvx
```

Once you obtain the absolute path (e.g., /usr/local/bin/uvx), update your configuration to use that path (e.g., "command": "/usr/local/bin/uvx").

## Example usage

⚠️ Warning: Using these tools may incur costs.

### 1. broadcast a segment of the evening news

![broadcast a segment of the evening news](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-268624ab.jpg)

### 2. clone a voice

![clone a voice](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-6362babc.jpg)

### 3. generate a video

![generate a video](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-ebf0c2e1.jpg)
![generate a video](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-47236af8.jpg)

### 4. generate images

![generate images](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-0730dc0a.jpg)
![generate images](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-f0acd0d5.jpg)
