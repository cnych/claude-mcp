---
name: MCP Feedback Enhanced
digest: 核心理念是将复杂概念简化为清晰、可操作的见解。它专注于提炼关键信息以增强理解和决策能力，确保用户快速高效地掌握要点。其价值在于通过简洁、结构化的内容改善沟通、节省时间并推动更好的结果。
author: Minidoracat
homepage: https://github.com/Minidoracat/mcp-feedback-enhanced
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 服务器
  - SSH
  - WSL
icon: https://avatars.githubusercontent.com/u/11269639?v=4
createTime: 2025-05-29
featured: true
---

## 核心理念

这是一个建立**面向反馈的开发工作流**的[MCP 服务器](/zh)，完美适配本地环境、**SSH 远程环境**（Cursor SSH Remote、VS Code Remote SSH）和**WSL（Windows Subsystem for Linux）环境**。通过引导 AI 与用户确认而非进行推测性操作，可将多个工具调用整合为单个面向反馈的请求，大幅降低平台成本并提升开发效率。

**支持平台:** [Cursor](https://www.cursor.com) | [Cline](https://cline.bot) | [Windsurf](https://windsurf.com) | [Augment](https://www.augmentcode.com) | [Trae](https://www.trae.ai)

### 工作流程

1. **AI 调用** → `mcp-feedback-enhanced`
2. **环境检测** → 自动选择合适接口
3. **用户交互** → 命令执行、文本反馈、图片上传
4. **反馈传递** → 信息返回 AI
5. **流程延续** → 根据反馈调整或结束

## 核心特性

### 双界面系统

- **Qt 图形界面**: 本地环境原生体验，模块化重构设计
- **网页界面**: SSH 远程和 WSL 环境的现代化界面，全新架构
- **智能切换**: 自动检测环境（本地/远程/WSL）并选择最优界面

### 全新界面设计(v2.1.0)

- **模块化架构**: GUI 和 Web UI 均采用模块化设计
- **集中管理**: 重组文件夹结构便于维护
- **现代主题**: 改进视觉设计和用户体验
- **响应式布局**: 适配不同屏幕尺寸和窗口比例

### 图片支持

- **格式支持**: PNG、JPG、JPEG、GIF、BMP、WebP
- **上传方式**: 文件拖放 + 剪贴板粘贴(Ctrl+V)
- **自动处理**: 智能压缩确保符合 1MB 限制

### 多语言支持

- **三种语言**: 英语、繁体中文、简体中文
- **智能检测**: 根据系统语言自动选择
- **实时切换**: 界面内直接更改语言

### WSL 环境支持(v2.2.5)

- **自动检测**: 智能识别 WSL(Windows Subsystem for Linux)环境
- **浏览器集成**: WSL 环境下自动启动 Windows 浏览器
- **多种启动方式**: 支持`cmd.exe`、`powershell.exe`、`wslview`等多种浏览器启动方式
- **无缝体验**: WSL 用户可直接使用 Web UI 无需额外配置

### SSH 远程环境支持(v2.3.0 新功能)

- **智能检测**: 自动识别 SSH 远程环境（Cursor SSH Remote、VS Code Remote SSH 等）
- **浏览器启动指引**: 当浏览器无法自动启动时提供明确解决方案
- **端口转发支持**: 完整的端口转发设置指引和问题排查
- **MCP 集成优化**: 改进与 MCP 系统的集成，提供更稳定的连接体验
- **详细文档**: [SSH 远程环境使用指南](docs/en/ssh-remote/browser-launch-issues.md)
- **输入框自动聚焦**: 窗口打开时自动聚焦反馈输入框，提升用户体验

## 界面预览

### Qt 图形界面(重构版)

<div align="center">
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-d52415e2.png" width="400" alt="Qt图形主界面" />
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-08512ba3.png" width="400" alt="Qt图形设置界面" />
</div>

_Qt 图形界面 - 模块化重构，支持本地环境_

### 网页界面(重构版)

<div align="center">
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-b9522f81.png" width="400" alt="网页主界面" />
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-bfd5339d.png" width="400" alt="网页设置界面" />
</div>

_网页界面 - 全新架构，适合 SSH 远程环境_

**快捷键说明**

- `Ctrl+Enter`(Windows/Linux) / `Cmd+Enter`(macOS): 提交反馈（支持主键盘和小键盘）
- `Ctrl+V`(Windows/Linux) / `Cmd+V`(macOS): 直接粘贴剪贴板图片

## 快速开始

### 1. 安装与测试

```bash
# 安装uv(如未安装)
pip install uv

# 快速测试
uvx mcp-feedback-enhanced@latest test
```

### 2. MCP 配置

**基础配置**(适合大多数用户):

```json
{
  "mcpServers": {
    "mcp-feedback-enhanced": {
      "command": "uvx",
      "args": ["mcp-feedback-enhanced@latest"],
      "timeout": 600,
      "autoApprove": ["interactive_feedback"]
    }
  }
}
```

**高级配置**(需要自定义环境):

```json
{
  "mcpServers": {
    "mcp-feedback-enhanced": {
      "command": "uvx",
      "args": ["mcp-feedback-enhanced@latest"],
      "timeout": 600,
      "env": {
        "FORCE_WEB": "true",
        "MCP_DEBUG": "false"
      },
      "autoApprove": ["interactive_feedback"]
    }
  }
}
```

### 3. 提示工程设置

为获得最佳效果，请为 AI 助手添加以下规则:

```
# MCP交互反馈规则

1. 在任何流程、任务或对话中，无论是提问、回答还是完成阶段性任务，都必须调用MCP mcp-feedback-enhanced。
2. 当收到用户反馈时，如果反馈内容不为空，必须再次调用MCP mcp-feedback-enhanced并根据反馈调整行为。
3. 只有当用户明确表示"结束"或"无需再交互"时，才能停止调用MCP mcp-feedback-enhanced，此时流程才算完成。
4. 除非收到结束指令，否则所有步骤都必须反复调用MCP mcp-feedback-enhanced。
5. 在完成任务前，使用MCP mcp-feedback-enhanced向用户征求反馈。
```

## 高级设置

### 环境变量

| 变量名         | 用途            | 可选值         | 默认值  |
| -------------- | --------------- | -------------- | ------- |
| `FORCE_WEB`    | 强制使用 Web UI | `true`/`false` | `false` |
| `MCP_DEBUG`    | 调试模式        | `true`/`false` | `false` |
| `MCP_WEB_PORT` | Web UI 端口     | `1024-65535`   | `8765`  |

### 测试选项

```bash
# 版本检查
uvx mcp-feedback-enhanced@latest version       # 检查版本

# 指定界面测试
uvx mcp-feedback-enhanced@latest test --gui    # 快速测试Qt图形界面
uvx mcp-feedback-enhanced@latest test --web    # 测试Web UI(自动持续运行)

# 调试模式
MCP_DEBUG=true uvx mcp-feedback-enhanced@latest test
```

### 开发者安装

```bash
git clone https://github.com/Minidoracat/mcp-feedback-enhanced.git
cd mcp-feedback-enhanced
uv sync
```

**本地测试方法**

```bash
# 方法1: 标准测试(推荐)
uv run python -m mcp_feedback_enhanced test

# 方法2: 完整测试套件(macOS和Windows开发环境)
uvx --with-editable . mcp-feedback-enhanced test

# 方法3: 指定界面测试
uvx --with-editable . mcp-feedback-enhanced test --gui    # 快速测试Qt图形界面
uvx --with-editable . mcp-feedback-enhanced test --web    # 测试Web UI(自动持续运行)
```

**测试说明**

- **标准测试**: 完整功能检查，适合日常开发验证
- **完整测试**: 深度测试所有组件，适合发布前验证
- **Qt 图形测试**: 快速启动并测试本地图形界面
- **Web UI 测试**: 启动 Web 服务器并保持运行，进行完整 Web 功能测试

## 版本历史

📋 **完整版本历史:** [RELEASE_NOTES/CHANGELOG.en.md](RELEASE_NOTES/CHANGELOG.en.md)

### 最新版本亮点(v2.3.0)

- **SSH 远程环境支持**: 解决 Cursor SSH Remote 浏览器启动问题，提供清晰使用指引
- **错误信息改进**: 出错时提供更友好的错误信息和解决方案建议
- **自动清理功能**: 自动清理临时文件和过期会话保持系统整洁
- **内存监控**: 监控内存使用情况防止系统资源不足
- **连接稳定性**: 改进 Web UI 连接稳定性和错误处理

## 常见问题

### SSH 远程环境问题

**问: SSH 远程环境下浏览器无法启动**
答: 这是正常行为。SSH 远程环境无图形界面，需在本地浏览器手动打开。详细解决方案见: [SSH 远程环境使用指南](docs/en/ssh-remote/browser-launch-issues.md)

**问: 为什么收不到新的 MCP 反馈?**
答: 可能存在 WebSocket 连接问题。**解决方案**: 只需刷新浏览器页面。

**问: 为什么 MCP 没有被调用?**
答: 请确认 MCP 工具状态显示绿灯。**解决方案**: 反复切换 MCP 工具开关，等待几秒让系统重新连接。

**问: Augment 无法启动 MCP**
答: **解决方案**: 完全关闭并重新启动 VS Code 或 Cursor，然后重新打开项目。

### 一般问题

**问: 出现"Unexpected token 'D'"错误**
答: 调试输出干扰。设置`MCP_DEBUG=false`或移除该环境变量。

**问: 中文字符乱码**
答: v2.0.3 已修复。更新至最新版本: `uvx mcp-feedback-enhanced@latest`

**问: 多屏幕窗口消失或定位错误**
答: v2.1.1 已修复。前往"⚙️ 设置"标签页，勾选"始终在主屏幕中心显示窗口"即可解决。特别适用于 T 形屏幕排列等复杂多显示器配置。

**问: 图片上传失败**
答: 检查文件大小(≤1MB)和格式(PNG/JPG/GIF/BMP/WebP)。

**问: Web UI 无法启动**
答: 设置`FORCE_WEB=true`或检查防火墙设置。

**问: UV 缓存占用过多磁盘空间**
答: 由于频繁使用`uvx`命令，缓存可能积累到数十 GB。建议定期清理:

```bash
# 检查缓存大小和详细信息
python scripts/cleanup_cache.py --size

# 预览清理内容(不实际清理)
python scripts/cleanup_cache.py --dry-run

# 执行标准清理
python scripts/cleanup_cache.py --clean

# 强制清理(尝试关闭相关进程，解决Windows文件锁定问题)
python scripts/cleanup_cache.py --force

# 或直接使用uv命令
uv cache clean
```

详细指引见: [缓存管理指南](docs/en/cache-management.md)

**问: AI 模型无法解析图片**
答: 各种 AI 模型(包括 Gemini Pro 2.5、Claude 等)在图片解析上可能存在不稳定情况，有时能正确识别，有时无法解析上传的图片内容。这是 AI 视觉理解技术的已知限制。建议:

1. 确保图片质量良好(高对比度、文字清晰)
2. 尝试多次上传，重试通常能成功
3. 如果持续解析失败，尝试调整图片大小或格式

## 开源许可

MIT 许可证 - 详见[LICENSE](LICENSE)文件
