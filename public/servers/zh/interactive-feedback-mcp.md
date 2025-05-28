---
name: Interactive Feedback MCP
digest: MCP服务器为Cursor、Cline和Windsurf等AI开发工具提供人机协同工作流支持，允许在开发过程中执行命令、查看输出并直接向AI系统提供文本反馈。
author: noopstudios
homepage: https://github.com/noopstudios/interactive-feedback-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 人工智能
  - 服务器
  - 工作流
icon: https://avatars.githubusercontent.com/u/74713198?v=4
createTime: 2025-05-09
---
这是一个简单的[MCP服务器](https://modelcontextprotocol.io/)，用于在[Cursor](https://www.cursor.com)等AI辅助开发工具中实现人机协同工作流。该服务器允许您运行命令、查看输出结果，并直接向AI提供文本反馈。同时兼容[Cline](https://cline.bot)和[Windsurf](https://windsurf.com)平台。

![交互式反馈界面 - 主视图](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-1a5be5d2.jpg?raw=true)
![交互式反馈界面 - 命令面板展开状态](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-051f81d1.jpg)

## 提示词工程

为获得最佳效果，请将以下内容添加到AI助手的自定义提示中（可通过规则或直接写入提示词，例如在Cursor中）：

> 当需要提问时，始终调用MCP的`interactive_feedback`功能  
> 在完成用户请求前，请调用MCP的`interactive_feedback`而非直接结束流程  
> 持续调用MCP直至用户反馈为空，再结束请求

## 使用价值
通过引导助手与用户保持交互（而非执行高成本的推测性工具调用），本模块可显著减少Cursor等平台上OpenAI工具调用的高级请求次数。实际案例中，曾将25次工具调用整合为单次带反馈的请求，既节省资源又提升性能。

## 配置说明

本MCP服务器使用Qt的`QSettings`按项目存储配置，包括：
* 待执行的命令
* 是否在下文启动时自动执行（参见"下次运行时自动执行"复选框）
* 命令面板的显示/隐藏状态（切换时即时保存）
* 窗口几何参数与UI偏好设置

配置通常存储在平台特定位置（如Windows注册表、macOS的plist文件、Linux的`~/.config`或`~/.local/share`），组织名为"FabioFerreira"，应用名为"InteractiveFeedbackMCP"，每个项目目录有独立分组。

## 安装指南（Cursor）

![Cursor中的安装示意](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-060e8911.jpg?raw=true)

1. **环境准备：**
   * Python 3.11或更新版本
   * 安装[uv](https://github.com/astral-sh/uv)包管理器：
     * Windows: `pip install uv`
     * Linux/Mac: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. **获取代码：**
   * 克隆仓库：`git clone https://github.com/noopstudios/interactive-feedback-mcp.git`
   * 或直接下载源码
3. **进入目录：**
   * `cd path/to/interactive-feedback-mcp`
4. **安装依赖：**
   * `uv sync`（将创建虚拟环境并安装依赖包）
5. **启动服务器：**
   * `uv run server.py`
6. **Cursor配置：**
   * **手动配置（通过`mcp.json`）**
     **注意将`/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp`替换为您本地的实际路径**

     ```json
     {
       "mcpServers": {
         "interactive-feedback-mcp": {
           "command": "uv",
           "args": [
             "--directory",
             "/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp",
             "run",
             "server.py"
           ],
           "timeout": 600,
           "autoApprove": [
             "interactive_feedback"
           ]
         }
       }
     }
     ```

### Cline/Windsurf配置

配置原理相同：在对应工具的MCP设置中配置服务器命令（如带正确`--directory`参数的`uv run server.py`），使用`interactive-feedback-mcp`作为服务器标识符。

## 开发模式

通过web界面测试开发版服务器：

```sh
uv run fastmcp dev server.py
```

## 可用工具

AI助手调用`interactive_feedback`工具的示例：

```xml
<use_mcp_tool>
  <server_name>interactive-feedback-mcp</server_name>
  <tool_name>interactive_feedback</tool_name>
  <arguments>
    {
      "project_directory": "/path/to/your/project",
      "summary": "已完成您请求的修改，并重构了主模块"
    }
  </arguments>
</use_mcp_tool>
```