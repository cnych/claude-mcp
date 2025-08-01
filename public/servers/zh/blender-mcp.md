---
name: Blender MCP
digest: 通过 MCP 允许大语言模型直接与 Blender 交互和控制
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
featured: true
---

[Blender MCP](https://github.com/ahujasid/blender-mcp) 是一个 Blender MCP 服务器，它通过 Model Context Protocol (MCP) 连接到大语言模型，允许大语言模型直接与 Blender 交互和控制。这个集成使得通过提示词来进行辅助 3D 建模、场景创建和操作成为可能。尤其适合希望简化流程的初学者和专业人士。

[Blender](https://www.blender.org/) 是一个 3D 建模软件，可以用来创建 3D 模型，也可以用来创建 2D 的图形，甚至可以用来创建动画。

![Blender](https://static.claudemcp.com/images/blender.png)

## 安装与配置

Blender MCP 是使用 Python 开发的一个开源项目，所以需要保证我们本地已经安装 Python，版本要求 3.10 或更高。肯定也需要安装 Blender，版本要求 3.0 或更高。

然后我们需要安装 `uv` 包管理器，这是一个使用 Rust 开发的高性能 Python 包管理器。

**Mac**

```bash
brew install uv
```

**Windows**

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

然后还需要配置环境变量:

```bash
set Path=C:\Users\nntra\.local\bin;%Path%
```

**Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

当然我们也可以选择手动安装，具体可以参考 [Install uv](https://docs.astral.sh/uv/getting-started/installation/)。

安装完成后，接下来我们就可以在 Claude MCP 客户端中来启用 Blender MCP 服务器了。

:::adsense 8781986491:::

**Claude for Desktop**

对于 `Claude for Desktop`，打开客户端，点击 `Settings` > `Developer` > `Edit Config` > `claude_desktop_config.json` 文件，添加以下内容即可：

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

配置后，隔一小会儿，我们就可以在 `Claude for Desktop` 的左侧工具栏看到一个锤子图标，点击即可看到 Blender MCP 的工具了。

![Blender MCP On Claude Desktop](https://static.claudemcp.com/images/blender-mcp-on-claude-desktop.png)

**Cursor**

对于 Cursor 而言，同样打开 `Cursor Settings` > `MCP` > `+ Add new global MCP server`，添加以下内容即可：

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

如果只希望在指定项目下生效，则将上面配置文件添加到项目根目录下的 `.cursor/mcp.json` 文件中即可。

> ⚠️ 注意：由于某些 MCP 服务器或者用户开启了很多 MCP 服务器，会导致 Cursor 有很多可使用的工具列表，这会造成 Token 不够用，目前 Cursor 只会将前 40 个工具发送给 LLM，所以建议测试的时候只开启 Blender MCP 服务器。

配置完成后，在 Cursor 设置页面，MCP 选项卡中就可以看到我们刚刚添加的 Blender MCP 服务器了（记得开启）。

![Blender MCP On Cursor](https://static.claudemcp.com/images/blender-mcp-on-cursor.png)

## 使用

上面我们只是完成了 Blender MCP 服务器的配置，我们还需要在 Blender 中安装一个插件。在 Blender MCP 的 GitHub 仓库中获取 `addon.py` 文件，地址：[https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py](https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py)，将其下载到本地保存为 `addon.py` 文件。

然后打开 Blender，进入 `Edit` > `Preferences` > `Add-ons`，点击 `Install from Disk...` 按钮，选择我们刚刚下载的 `addon.py` 文件即可。

![Blender install addon](https://static.claudemcp.com/images/blender-install-addon.png)

要注意勾选 `Blender MCP` 选项，才能正常使用。

![Blender enable addon](https://static.claudemcp.com/images/blender-enable-addon.png)

然后回到 Blender，在 3D 视图侧边栏（可以按 `N` 键显示）找到 `BlenderMCP` 选项卡，勾选 `Poly Haven`（可选），然后点击 `Connect to MCP server` 按钮。

![Blender MCP Addon Connect](https://static.claudemcp.com/images/blender-mcp-addon-connect.png)

到这里我们所有的准备工作就完成了，接下来我们就可以在 Claude Desktop 或者 Cursor 中输入命令来控制 Blender 了。目前支持如下的一些能力：

- 获取场景和对象信息
- 创建、删除和修改形状
- 应用或创建对象材料
- 在 Blender 中执行任意 Python 代码
- 通过 [Poly Haven](https://polyhaven.com/) 下载模型、资产和 HDRIs
- 通过 [Hyper3D Rodin](https://hyper3d.ai/) 生成 3D 模型，可从 [hyper3d.ai](https://hyper3d.ai/) 或 [fal.ai](https://fal.ai/) 获取完整密钥。

比如我们在 Cursor 中输入如下提示词来让 Blender 创建一个

```
Create a beach vibe in blender scene. Let there be:

* Sky HDRI image
* some nice sandy ground
* some rocks and shrubbery in the scene
* any other props you can think of to make it look like a beach
```

然后我们就可以看到 Blender 开始自动创建场景了。

:::youtube 0SuVIfLoUnA:::

此外我们还可以通过 [Hyper3D Rodin](https://hyper3d.ai/) 生成 3D 模型，需要先在 [Hyper3D Rodin](https://hyper3d.ai/) 注册账号，然后获取密钥，在 Blender 的插件中配置后，就可以在 Cursor 中输入提示词来生成 3D 模型了。

> 另外 Blender MCP 除了支持 Tools 之外，还支持 Prompts，但目前 Cursor 还不支持 Prompts。

## 故障排除

常见问题包括：

- **连接问题**：确保插件服务器运行，MCP 配置正确，首次命令可能失败，需重试。
- **超时错误**：简化请求或分步操作。
- **Poly Haven 问题**：可能不稳定，建议重试或检查状态。
- **一般问题**：重启 Claude 和 Blender 服务器。

## 总结

Blender MCP 项目展示了 AI 辅助 3D 建模的潜力，通过 MCP 标准化协议，它简化了复杂操作，提升了效率。随着 MCP 的普及，未来可能看到更多软件与 AI 的集成，进一步扩展创意工具的可能性。
