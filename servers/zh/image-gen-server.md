---
name: Image-Gen-Server
digest: Image-Gen-Server 是一款强大的图像生成工具，能够根据文本提示创建高质量视觉内容。它提供快速处理、可定制输出，并支持多种风格以满足多样化创意需求。该服务非常适合设计师、营销人员和内容创作者进行高效的视觉内容生产。
author: fengin
homepage: https://github.com/fengin/image-gen-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 人工智能
  - 图像
  - 集成开发环境
icon: https://avatars.githubusercontent.com/u/49424247?v=4
createTime: 2025-02-07
---

![Image-Gen-Server 标志](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-167510b5.png)

基于即梦 AI 的图像生成服务，专门设计用于与 Cursor IDE 集成。它接收来自 Cursor 的文本描述，生成相应的图像，并提供图片下载和保存功能。

![示例](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-12f05bd3.png)

## 特性

- 与 Cursor IDE 完美集成
- 支持文本到图像的生成
- 自动保存生成的图像
- 支持自定义保存路径
- 一次生成四张图，提供更多选择

## 安装

1. 环境准备

- Python 3.10+
- 安装 npm
- 安装 Node.js（v20 已验证可用）
- 通过 pip 安装 uv
- 调试需要安装：npm install -g @modelcontextprotocol/inspector@0.4.0

2. 克隆项目

   ```bash
   git clone https://github.com/fengin/image-gen-server.git
   cd image-gen-server
   ```

3. 安装依赖

   ```bash
   pip install -r requirements.txt
   pip install uv
   ```

4. 设置即梦 Token 和图片默认保存地址
   修改 server.py 文件中的这两个配置

   ```bash
   # API配置
   JIMENG_API_TOKEN = "057f7addf85dxxxxxxxxxxxxx" # 登录即梦获得的session_id，支持多个，用逗号分隔
   IMG_SAVA_FOLDER = "D:/code/image-gen-server/images" # 图片默认保存路径
   ```

## Cursor 集成

![Cursor配置](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-fa725511.png)

1. 打开 Cursor 设置

   - 点击左下角的设置图标
   - 选择 Features > MCP Servers
   - 点击 "Add new MCP server"

2. 填写服务器配置

   - 名称: `image-gen-server`（或其他自定义名称）
   - 类型: `command`
   - 命令:

     ```bash
     uv run --with fastmcp fastmcp run D:\code\image-gen-service\server.py
     ```

     注意：将路径替换为实际项目路径

     - Windows 示例: ` uv run --with fastmcp fastmcp run D:/code/image-gen-service/server.py`
     - macOS/Linux 示例: ` uv run --with fastmcp fastmcp run /Users/username/code/image-gen-server/server.py`

## 使用方法

在 Cursor 中，要让 cursor 生成图片，在 agent 模式下，提示它了解图片工具使用方法，然后直接提出要生成的图片要求和保存位置即可

## 获取即梦 Token

1. 访问 [即梦](https://jimeng.jianying.com/)
2. 登录账号
3. 按 F12 打开开发者工具
4. 在 Application > Cookies 中找到`sessionid`
5. 将找到的 sessionid 设置到 server.py 的 JIMENG_API_TOKEN 中

## 工具函数说明

### generate_image

```python
async def generate_image(prompt: str, file_name: str, save_folder: str = None, sample_strength: float = 0.5, width: int = 1024, height: int = 1024) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """根据文本描述生成图片

    参数:
        prompt: 图片的文本描述
        file_name: 生成图片的文件名(不含路径，如果没有后缀则默认使用.jpg)
        save_folder: 图片保存绝对地址目录(可选,默认使用IMG_SAVA_FOLDER)
        sample_strength: 生成图片的精细度(可选,范围0-1,默认0.5)
        width: 生成图片的宽度(可选,默认1024)
        height: 生成图片的高度(可选,默认1024)

    返回:
        List: 包含生成结果的JSON字符串
    """
```

### 技术实现

1. server.py 采用 fastmcp 实现了 mcp sever 的能力，提供给 cursor/claude 使用

2. sever.py 调用了 proxy.jimeng 模块逆向与即梦 AI 进行交互。
   proxy.jimeng 逆向模块也可以单独 install 使用，主要提供以下功能：

- 图像生成（generate_images）
- 同步对话补全（create_completion）
- 流式对话补全（create_completion_stream）
- 多账号 token 支持
- 完整的错误处理

### 使用示例

```cmd
# cursor agent模式下
#例子一
根据项目需求，帮我生成一张产品logo，放在项目目录images下面

#例子二
根据项目需求，帮我制作网站的首页，头部需要有banner图片。
```

## 许可证

MIT 许可证
作者：凌封

## 故障排除

1.配置完成后跳出黑窗口并快速消失，工具状态变成 No tools found

原因：未正常启动，通常有以下原因

- 配置命令不正确，检查命令是否正确，通常是 server.py 路径错误，或路径中包含中文，或正反斜杠不正确
- 依赖环境未准备好
- 依赖运行的终端不正确

  2.正常运行后，想查看调用日志或进行调试

  将命令修改为：

```
uv run --with fastmcp fastmcp dev D:/code/image-gen-service/server.py
```

即将最后一个 run 改为 dev。

或者在终端运行以下命令进入调试模式：

```
fastmcp dev D:/code/image-gen-service/server.py
```
