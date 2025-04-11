---
name: Figma Context MCP
digest: 打通 Figma 和 MCP 客户端之间的桥梁，通过 AI 代理快速实现设计，快速实现从设计到代码的无缝转换。
author: glips
repository: https://github.com/glips/figma-context-mcp
homepage: https://www.framelink.ai
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - figma
  - 设计
icon: /icons/figma-context-mcp-icon.png
createTime: 2025-04-11
---

[Figma Context MCP](/servers/figma-context-mcp) 是一个强大的 [MCP Server](/servers)，可以帮助开发者直接从 Figma 设计稿中提取信息，并通过 AI 代理快速实现设计。比如在 Cursor 中可以通过提示词让 AI Agent 访问你的 Figma 设计数据，并生成代码。与直接粘贴屏幕截图相比，它最终的表现结果要好得多。

![Figma Context MCP](/images/figma-context-mcp.png)

## 获取 Figma 访问令牌

在开始使用 Figma Context MCP 服务器之前，您需要生成一个 Figma 访问令牌。以下是获取令牌的详细步骤：

1. 登录 Figma，点击左上角的个人资料图标，从下拉菜单中选择"设置"（`Settings`）。
2. 在设置菜单中，选择"安全"（`Security`）选项卡。
3. 向下滚动到"个人访问令牌"（`Personal access tokens`）部分，点击"生成新令牌"（`Generate new token`）。
4. 为令牌输入一个名称（如"Figma MCP"），并确保您拥有 `File content` 和 `Dev resources` 的读取权限。

   ![生成 Figma 访问令牌](/images/figma-context-mcp-generate-token.png)

5. 点击"生成令牌"（`Generate token`）按钮。

> **重要提示**：请立即复制并安全保存生成的令牌。关闭此页面后，您将无法再次查看完整的令牌。

如果您需要更详细的指引，可以查阅 [Figma 关于访问令牌的官方文档](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens)。

## 配置 Figma Context MCP 服务器

大多数的 MCP 客户端都支持通过 JSON 配置 MCP 服务器，一旦您更新了 MCP 客户端中的 MCP 配置文件，MCP 服务器就会被自动下载并启用。

根据您的操作系统，选择合适的配置方式：

**MacOS / Linux:**

```json
{
  "mcpServers": {
    "Figma MCP": {
      "command": "npx",
      "args": [
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

**Windows:**

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "figma-developer-mcp",
        "--figma-api-key=YOUR-KEY",
        "--stdio"
      ]
    }
  }
}
```

> **重要提示**：将配置中的`YOUR-KEY`替换为您在第一步中生成的 Figma 访问令牌。

各种 [MCP 客户端](/clients) 的具体配置步骤可能略有不同。这里我们重点介绍下 Cursor 下面的配置方法：

1. 打开 Cursor 设置（CMD+,或 Ctrl+,）
2. 导航至 MCP 配置部分
3. 点击右上角的 `+ Add new global MCP server` 按钮
4. 粘贴上面提供的配置 JSON

此外我们也可以在项目根目录下面创建 `.cursor/mcp.json` 文件，然后添加上面的配置，这样该 MCP Server 就只会对当前项目生效。

![Cursor MCP 配置](/images/figma-context-mcp-cursor-settings.png)

到这里我们就完成了该 MCP server 的配置。

## 实现您的第一个设计

配置好 MCP 客户端后，接下来我们就可以开始实现您的第一个设计了。

### 复制 Figma 框架或组的链接

MCP 服务器会将从 Figma API 接收到的数据压缩近 90%，尽管如此，复杂的设计仍可能让 AI 代理因信息过多而出现问题（超 Token 限制）。

**虽然您可以尝试让编辑器为您实现整个设计，但为了获得最一致的结果，建议一次处理一个部分。**

具体操作方法：**右键点击您想要实现的框架或组，然后选择"复制/粘贴为"（`Copy/Paste as`），然后选择"复制所选内容的链接"（`Copy link to selection`）。**

![复制 Figma 框架或组的链接](/images/figma-context-mcp-copy-figma-link.png)

### 将链接粘贴到编辑器中

获取 Figma 框架或组的链接后，然后我们就可以向编辑器的 AI 代理发出请求。

比如我们在 Cursor 里面输入 `Implement this Figma frame for me. https://www.figma.com/design/....`，注意我们将前面获取的 Figma 链接直接粘贴到 Cursor 输入框里面的时候，他会自动将其识别为一个链接，这样会导致 Cursor 去直接获取这个链接的页面内容，这显然不是我们期望的，我们只是希望将这个链接通过 MCP 服务器来获取 Figma 设计稿的数据，所以这里我们需要点击下这个 URL 链接地址，然后点击 `Unlink` 按钮，这样 Cursor 就会将这个链接识别为一个普通的文本。

![将链接粘贴到编辑器中](/images/figma-context-mcp-paste-link.png)

然后回车后 Cursor 经过语意分析过后就会去调用 MCP 服务器的 `get_figma_data` 工具来获取对应的设计稿数据，如果有图片的话则会调用 `download_figma_images` 工具来下载图片，最后再根据获取的这些数据通过 Agent 生成对应的代码。

![调用 Figma MCP 工具](/images/figma-context-mcp-call-tool.png)

最终生成的页面效果如下所示：

![最终生成的页面效果](/images/figma-context-mcp-final-result.png)

和我们的设计图已经非常类似了，当然还有一些细节需要我们自己去调整了。

当然我们也可以通过提示词来告诉 AI 代理我们想要使用的技术栈、命名约定或特定要求等等，提供更多上下文通常有助于获得最佳结果。

```bash
请基于这个Figma设计实现一个响应式页面：

https://www.figma.com/file/xxxxx

技术栈要求：
- HTML/CSS
- 使用Tailwind CSS框架
- 确保在移动设备上也能正常显示
```

到这里我们就完成了第一个设计，是不是非常简单呢？

## 最佳实践

为了充分利用 Figma Context MCP，以下是一些最佳实践方式值得我们参考：

**在 Figma 中**

通常来说，您需要将您的 Figma 文件结构化，以便于理解和实现。

- 使用自动布局 — MCP 目前还不能很好地处理浮动或绝对定位的元素
- 命名您的 Frame 和 Group
- 提示：尝试使用 Figma 的 AI 来自动生成名称

**在您的编辑器中**

使用 LLM 的关键是提供正确的上下文，比如：

- 告诉代理您有哪些资源可用（例如 Tailwind、React）
- 参考您代码库中的关键文件以提供额外上下文
- 除了 Figma 的原始数据外，还提供设计细节
- 管理上下文大小 — 提供 Frame 和 Group 的链接，而不是整个文件（会超 Token 限制）
- 始终审查 AI 生成的代码，确保它符合您的标准和期望。

## SSE 配置方式

除了我们前面介绍的配置方式外，Figma MCP 还支持通过 SSE 的方式来向客户端流式传输响应。

**启动 MCP 服务器**

我们可以使用 `npx` 命令来启动 MCP 服务器。

```bash
npx figma-developer-mcp --figma-api-key=<your-figma-api-key>
# Initializing Figma MCP Server in HTTP mode on port 3333...
# HTTP server listening on port 3333
# SSE endpoint available at http://localhost:3333/sse
# Message endpoint available at http://localhost:3333/messages
```

**配置 MCP 客户端**

接下来我们需要在 MCP 客户端中配置 MCP 服务器，具体配置方式如下：

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "url": "http://localhost:3333/sse",
      "env": {
        "FIGMA_API_KEY": "<your-figma-api-key>"
      }
    }
  }
}
```

## 常见问题与故障排除

如果您在使用 Figma Context MCP 时遇到问题，以下是一些常见问题和解决方案：

### 问题：MCP 服务器无法连接

**解决方案**：

- 确认您已正确配置 Figma 访问令牌
- 检查您的网络连接
- 重启 IDE
- 确认 npx 命令可用（需要安装 Node.js）

### 问题：生成的代码不符合预期

**解决方案**：

- 尝试提供更具体的指导
- 使用更小的设计部分
- 确保 Figma 设计具有清晰的组织和命名
- 尝试不同的提示方式

### 问题：访问令牌权限错误

**解决方案**：

- 确保您的访问令牌具有必要的权限（`File content` 和 `Dev resources` 的读取权限）
- 如需要，生成新的访问令牌

## 总结

Figma Context MCP 是一个非常强大的 MCP Server，彻底打通了 Figma 和 Cursor 之间的桥梁，让我们可以更加方便地从 Figma 设计稿中获取数据，并通过 AI 代理快速实现设计。实现从设计到代码的无缝转换。这是一个非常值得推荐的好工具。
