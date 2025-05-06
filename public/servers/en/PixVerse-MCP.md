---
name: PixVerse MCP
digest: PixVerse offers video generation models accessible through MCP-supported apps like Claude and Cursor, enabling seamless AI-powered video creation within existing workflows.
author: PixVerseAI
repository: https://github.com/PixVerseAI/PixVerse-MCP
homepage: https://platform.pixverse.ai
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - video
  - api
  - python
icon: https://avatars.githubusercontent.com/u/204290266?v=4
createTime: 2025-04-17
---

A tool that allows you to access PixVerse's latest video generation models via applications that support the [Model Context Protocol (MCP)](/), such as Claude or Cursor.

## Overview

PixVerse MCP is a tool that allows you to access PixVerse's latest video generation models via applications that support the Model Context Protocol (MCP), such as Claude or Cursor. This integration enables you to generate high-quality videos anytime, anywhere — including text-to-video, image-to-video, and more.

## Key Features

- **Text-to-Video Generation**: Generate creative videos using text prompts
- **Flexible Parameter Control**: Adjust video quality, length, aspect ratio, and more
- **Co-Creation with AI Assistants**: Collaborate with AI models like Claude to enhance your creative workflow

## System Components

The system consists of two main components:

1. **UVX MCP Server**
   - Python-based cloud server
   - Communicates directly with the PixVerse API
   - Provides full video generation capabilities

## Installation & Configuration

### Prerequisites

1. Python 3.10 or higher
2. UV/UVX
3. PixVerse API Key: Obtain from PixVerse Platform (This feature requires API Credits, which must be purchased separately on [PixVerse Platform](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp)

### Get Dependencies

1. **Python**:

   - Download and install from the official Python website
   - Ensure Python is added to your system path

2. **UV/UVX**:
   - Install uv and set up our Python project and environment:

#### Mac/Linux

```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Windows

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## How to Use MCP Server

### 1. Get PixVerse API Key

- Visit the [PixVerse Platform](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp)
- Register or log into your account
- Create and copy your API key from the account settings
- [API key generation guide](https://docs.platform.pixverse.ai/how-to-get-api-key-882968m0)

### 2. Download Required Dependencies

- **Python**: Install Python 3.10 or above
- **UV/UVX**: Install the latest stable version of UV & UVX

### 3. Configure MCP Client

- Open your MCP client (e.g., Claude for Desktop or Cursor)
- Locate the client settings
- Open mcp_config.json (or relevant config file)
- Add the configuration based on the method you use:

```json
{
  "mcpServers": {
    "PixVerse": {
      "command": "uvx",
      "args": ["pixverse-mcp"],
      "env": {
        "PIXVERSE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

- Add the API key obtained from platform.pixverse.ai under `"PIXVERSE_API_KEY": "xxxx"`
- Save the config file

### 5. Restart MCP Client or Refresh MCP Server

- Fully close and reopen your MCP client
- Or use the "Refresh MCP Server" option if supported

## Client-specific Configuration

### Claude for Desktop

1. Open the Claude application
2. Navigate to Claude > Settings > Developer > Edit Config
3. Open the claude_desktop_config.json file
   - Windows
   - Mac : ~/Library/Application\ Support/Claude/claude_desktop_config.json
4. Add the configuration above and save
5. Restart Claude
   - If connected successfully: the homepage will not show any error and the MCP status will be green
   - If connection fails: an error message will be shown on the homepage

### Cursor

1. Open the Cursor application
2. Go to Settings > Model Context Protocol
3. Add a new server
4. Fill in the server details as in the JSON config above
5. Save and restart or refresh the MCP server

## Usage Examples

### Text-to-Video

Use natural language prompts via Claude or Cursor to generate videos.

**Basic Example**:

```
Generate a video of a sunset over the ocean. Golden sunlight reflects on the water as waves gently hit the shore.
```

**Advanced Example with Parameters**:

```
Generate a night cityscape video with the following parameters:
Content: Skyscraper lights twinkling under the night sky, with car lights forming streaks on the road
Aspect Ratio: 16:9
Quality: 540p
Duration: 5 seconds
Motion Mode: normal
Negative Prompts: blur, shaking, text
```

**Supported Parameters**:

- Aspect Ratio: 16:9, 4:3, 1:1, 3:4, 9:16
- Duration: 5s or 8s
- Quality: 360p, 540p, 720p, 1080p
- Motion Mode: normal or fast

### Script + Video

Use detailed scene descriptions or shot lists to create more structured videos.

**Scene Description Example**:

```
Scene: A beach in the early morning.
The sun is rising, casting golden reflections on the sea.
Footprints stretch across the sand.
Gentle waves leave white foam as they retreat.
A small boat slowly sails across the calm sea in the distance.
Aspect Ratio: 16:9, Quality: 540p, Duration: 5 seconds.
```

**Shot-by-Shot Example**:

```
Generate a video based on this storyboard:
- Start: Top-down shot of a coffee cup with steam rising
- Close-up: Ripples and texture on the coffee surface
- Transition: Stirring creates a vortex
- End: An open book and glasses next to the cup
Format: 1:1 square, Quality: 540p, Motion: fast
```

- Claude Desktop also supports storyboard image input.

### One-Click Video

Quickly generate videos of specific themes or styles without detailed descriptions.

**Theme Example**:

```
Generate a video with a futuristic technology theme, including neon lights and holographic projections.
```

**Style Example**:

```
Generate a watercolor-style video of blooming flowers with bright, dreamy colors.
```

### Creative + Video

Combine AI's creativity with video generation.

**Style Transfer Example**:

```
This is a photo of a cityscape. Reinterpret it with a retro style and provide a video prompt.
```

**Story Prompt Example**:

```
If this street photo is the opening scene of a movie, what happens next? Provide a short video concept.
```

**Emotional Scene Example**:

```
Look at this forest path photo and design a short video concept, either a micro-story or a scene with emotional progression.
```

## FAQ

**How do I get a PixVerse API key?**

- Register at the PixVerse Platform and generate it under "API-KEY" in your account.

**What should I do if the server doesn't respond?**

1. Check whether your API key is valid
2. Ensure the configuration file path is correct
3. View error logs (typically in the log folders of Claude or Cursor)

**Does MCP support image-to-video or keyframe features?**

- Not yet. These features are only available via the PixVerse API. [API Docs](https://docs.platform.pixverse.ai)

**How to obtain credits?**

- If you haven't topped up on the API platform yet, please do so first. [PixVerse Platform](https://platform.pixverse.ai/billing?utm_source=github&utm_medium=readme&utm_campaign=mcp)

**What video formats and sizes are supported?**

- PixVerse supports resolutions from 360p to 1080p, and aspect ratios from 9:16 (portrait) to 16:9 (landscape).
- We recommend starting with 540p and 5-second videos to test the output quality.

**Where can I find the generated video?**

- You will receive a URL link to view, download, or share the video.

**How long does video generation take?**

- Typically 30 seconds to 2 minutes depending on complexity, server load, and network conditions.

**What to do if you encounter a spawn uvx ENOENT error?**

- This error is typically caused by incorrect UV/UVX installation paths. You can resolve it as follows:

For Mac/Linux:

```
sudo cp ./uvx /usr/local/bin
```

For Windows:

1. Identify the installation path of UV/UVX by running the following command in the terminal:

```
where uvx
```

2. Open File Explorer and locate the uvx/uv files.
3. Move the files to one of the following directories:
   - C:\Program Files (x86) or C:\Program Files

## Community & Support

### Community

- Join our [Discord server](https://discord.gg/pixverse) to receive updates, share creations, get help, or give feedback.

### Technical Support

- Email: api@pixverse.ai
- Website: https://platform.pixverse.ai

## Release Notes

v1.0.0

- Supports text-to-video generation via MCP
- Enables video link retrieval
- Integrates with Claude and Cursor for enhanced workflows
- Supports Cloud based Python MCP servers
