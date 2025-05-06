---
name: PixVerse MCP
digest: PixVerse 提供可通过 Claude 和 Cursor 等支持 MCP 的应用程序访问的视频生成模型，实现在现有工作流程中无缝进行 AI 视频创作。
author: PixVerseAI
repository: https://github.com/PixVerseAI/PixVerse-MCP
homepage: https://platform.pixverse.ai
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 视频
  - API
  - Python
icon: https://avatars.githubusercontent.com/u/204290266?v=4
createTime: 2025-04-17
---

一个允许您通过支持[模型上下文协议（MCP）](/zh)的应用程序（如 Claude 或 Cursor）访问 PixVerse 最新视频生成模型的工具。

## 概述

PixVerse MCP 是一个工具，允许您通过支持模型上下文协议（MCP）的应用程序（如 Claude 或 Cursor）访问 PixVerse 的最新视频生成模型。这一集成使您能够随时随地生成高质量的视频，包括文本到视频、图像到视频等。

## 主要功能

- **文本到视频生成**：使用文本提示生成创意视频
- **灵活的参数控制**：调整视频质量、长度、宽高比等
- **与 AI 助手协同创作**：与 Claude 等 AI 模型协作，增强您的创意工作流程

## 系统组件

该系统由两个主要组件组成：

1. **UVX MCP 服务器**
   - 基于 Python 的云服务器
   - 直接与 PixVerse API 通信
   - 提供完整的视频生成能力

## 安装与配置

### 先决条件

1. Python 3.10 或更高版本
2. UV/UVX
3. PixVerse API 密钥：从 PixVerse 平台获取（此功能需要 API 积分，需在 [PixVerse 平台](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp) 单独购买）

### 获取依赖项

1. **Python**：

   - 从 Python 官方网站下载并安装
   - 确保 Python 已添加到系统路径

2. **UV/UVX**：
   - 安装 uv 并设置我们的 Python 项目和环境：

#### Mac/Linux

```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Windows

```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## 如何使用 MCP 服务器

### 1. 获取 PixVerse API 密钥

- 访问 [PixVerse 平台](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp)
- 注册或登录您的账户
- 从账户设置中创建并复制您的 API 密钥
- [API 密钥生成指南](https://docs.platform.pixverse.ai/how-to-get-api-key-882968m0)

### 2. 下载所需依赖项

- **Python**：安装 Python 3.10 或更高版本
- **UV/UVX**：安装最新稳定版本的 UV 和 UVX

### 3. 配置 MCP 客户端

- 打开您的 MCP 客户端（如 Claude for Desktop 或 Cursor）
- 找到客户端设置
- 打开 mcp_config.json（或相关配置文件）
- 根据您使用的方法添加配置：

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

- 将从 platform.pixverse.ai 获取的 API 密钥添加到 `"PIXVERSE_API_KEY": "xxxx"` 下
- 保存配置文件

### 5. 重启 MCP 客户端或刷新 MCP 服务器

- 完全关闭并重新打开您的 MCP 客户端
- 或使用“刷新 MCP 服务器”选项（如果支持）

## 客户端特定配置

### Claude for Desktop

1. 打开 Claude 应用程序
2. 导航到 Claude > 设置 > 开发者 > 编辑配置
3. 打开 claude_desktop_config.json 文件
   - Windows
   - Mac : ~/Library/Application\ Support/Claude/claude_desktop_config.json
4. 添加上述配置并保存
5. 重启 Claude
   - 如果连接成功：主页不会显示任何错误，MCP 状态将为绿色
   - 如果连接失败：主页将显示错误消息

### Cursor

1. 打开 Cursor 应用程序
2. 转到 设置 > 模型上下文协议
3. 添加新服务器
4. 按照上述 JSON 配置填写服务器详细信息
5. 保存并重启或刷新 MCP 服务器

## 使用示例

### 文本到视频

通过 Claude 或 Cursor 使用自然语言提示生成视频。

**基本示例**：

```
生成一段海洋日落的视频。金色的阳光反射在水面上，海浪轻轻拍打岸边。
```

**带参数的高级示例**：

```
生成一段夜晚城市景观视频，参数如下：
内容：摩天大楼的灯光在夜空下闪烁，车灯在路上形成光轨
宽高比：16:9
质量：540p
时长：5 秒
运动模式：正常
负面提示：模糊、抖动、文字
```

**支持的参数**：

- 宽高比：16:9、4:3、1:1、3:4、9:16
- 时长：5 秒或 8 秒
- 质量：360p、540p、720p、1080p
- 运动模式：正常或快速

### 脚本 + 视频

使用详细的场景描述或分镜列表创建更有结构的视频。

**场景描述示例**：

```
场景：清晨的海滩。
太阳正在升起，金色的光芒洒在海面上。
沙滩上留下一串脚印。
轻柔的海浪退去时留下白色泡沫。
远处一艘小船缓缓驶过平静的海面。
宽高比：16:9，质量：540p，时长：5 秒。
```

**分镜示例**：

```
根据以下故事板生成视频：
- 开始：俯视咖啡杯，蒸汽升起
- 特写：咖啡表面的涟漪和纹理
- 过渡：搅拌形成漩涡
- 结束：杯子旁放着一本打开的书和眼镜
格式：1:1 方形，质量：540p，运动：快速
```

- Claude Desktop 还支持故事板图像输入。

### 一键视频

快速生成特定主题或风格的视频，无需详细描述。

**主题示例**：

```
生成一段未来科技主题的视频，包括霓虹灯和全息投影。
```

**风格示例**：

```
生成一段水彩风格的盛开花朵视频，色彩明亮梦幻。
```

### 创意 + 视频

将 AI 的创造力与视频生成相结合。

**风格迁移示例**：

```
这是一张城市景观的照片。用复古风格重新诠释它，并提供视频提示。
```

**故事提示示例**：

```
如果这张街道照片是电影的开场场景，接下来会发生什么？提供一个简短的视频概念。
```

**情感场景示例**：

```
查看这张森林小径的照片，设计一个短视频概念，可以是微故事或带有情感递进的场景。
```

## 常见问题

**如何获取 PixVerse API 密钥？**

- 在 PixVerse 平台注册，并在账户的“API-KEY”下生成。

**如果服务器无响应怎么办？**

1. 检查您的 API 密钥是否有效
2. 确保配置文件路径正确
3. 查看错误日志（通常在 Claude 或 Cursor 的日志文件夹中）

**MCP 是否支持图像到视频或关键帧功能？**

- 目前不支持。这些功能仅通过 PixVerse API 提供。[API 文档](https://docs.platform.pixverse.ai)

**如何获取积分？**

- 如果您尚未在 API 平台充值，请先充值。[PixVerse 平台](https://platform.pixverse.ai/billing?utm_source=github&utm_medium=readme&utm_campaign=mcp)

**支持哪些视频格式和尺寸？**

- PixVerse 支持从 360p 到 1080p 的分辨率，以及从 9:16（竖屏）到 16:9（横屏）的宽高比。
- 建议从 540p 和 5 秒视频开始测试输出质量。

**生成的视频在哪里可以找到？**

- 您将收到一个 URL 链接，用于查看、下载或分享视频。

**视频生成需要多长时间？**

- 通常需要 30 秒到 2 分钟，具体取决于复杂度、服务器负载和网络条件。

**如果遇到 spawn uvx ENOENT 错误怎么办？**

- 此错误通常由 UV/UVX 安装路径不正确引起。解决方法如下：

对于 Mac/Linux：

```
sudo cp ./uvx /usr/local/bin
```

对于 Windows：

1. 在终端中运行以下命令，确定 UV/UVX 的安装路径：

```
where uvx
```

2. 打开文件资源管理器，找到 uvx/uv 文件。
3. 将文件移动到以下目录之一：
   - C:\Program Files (x86) 或 C:\Program Files

## 社区与支持

### 社区

- 加入我们的 [Discord 服务器](https://discord.gg/pixverse)，获取更新、分享创作、获得帮助或提供反馈。

### 技术支持

- 电子邮件：api@pixverse.ai
- 网站：https://platform.pixverse.ai

## 发布说明

v1.0.0

- 支持通过 MCP 进行文本到视频生成
- 支持获取视频链接
- 与 Claude 和 Cursor 集成，增强工作流程
- 支持基于云的 Python MCP 服务器
