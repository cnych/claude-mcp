---
name: MCPControl
digest: 基于模型上下文协议的Windows控制服务器，可编程自动化执行鼠标/键盘输入、窗口管理和屏幕捕获等系统操作，简化工作流控制。
author: Cheffromspace
repository: https://github.com/Cheffromspace/MCPControl
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - windows
  - 自动化
  - 控制
icon: https://avatars.githubusercontent.com/u/21370528?v=4
createTime: 2024-12-04
featured: true
---

一个[模型上下文协议(MCP)](/zh)的 Windows 控制服务器，提供对鼠标、键盘、窗口管理及屏幕捕获等系统操作的可编程控制。

> **注意**：本项目目前仅支持 Windows 系统。

## ⚠️ 重要免责声明

**本软件为实验性产品，可能存在潜在风险**

使用本软件即表示您确认并接受以下条款：

- 通过本工具赋予 AI 模型直接控制计算机的权限具有固有风险
- 本软件可控制鼠标、键盘等系统功能，可能导致意外后果
- 您需自行承担使用本软件的全部风险
- 项目创建者及贡献者不对使用本软件造成的任何损害、数据丢失等后果承担责任
- 本工具仅应在采取适当安全措施的受控环境中使用

## 功能特性

- **窗口管理**

  - 列举所有窗口
  - 获取活动窗口信息
  - 获取窗口标题
  - 获取窗口尺寸与位置
  - 聚焦窗口
  - 调整窗口尺寸
  - 重定位窗口

- **鼠标控制**

  - 鼠标移动
  - 点击操作
  - 滚轮功能
  - 拖拽操作
  - 光标位置追踪

- **键盘控制**

  - 文本输入
  - 组合键操作
  - 按键按下/释放
  - 长按功能

- **屏幕操作**

  - 屏幕截图
  - 获取屏幕尺寸
  - 活动窗口检测

- **剪贴板集成**
  - 获取剪贴板内容
  - 设置剪贴板内容
  - 清空剪贴板
  - 检查剪贴板状态

## 使用方法

只需按照[MCP 服务器配置](#mcp-server-configuration)章节所示配置 Claude MCP 设置即可使用 MCPControl，无需安装！

### 从源码构建

#### 开发环境要求

构建本项目需要：

1. Windows 操作系统（keysender 依赖项必需）
2. Node.js 18 或更高版本（使用包含构建工具的官方 Windows 安装包）
3. npm 包管理器
4. 原生构建工具：
   - node-gyp: `npm install -g node-gyp`
   - cmake-js: `npm install -g cmake-js`

## MCP 服务器配置

使用本项目需要以下构建工具：

1. 通过官方 Windows 安装包安装 Node.js（包含必要构建工具）
2. 安装额外所需工具：

```
npm install -g node-gyp
npm install -g cmake-js
```

然后在 MCP 设置中添加如下配置：

```json
{
  "mcpServers": {
    "MCPControl": {
      "command": "npx",
      "args": ["--no-cache", "-y", "mcp-control"]
    }
  }
}
```

## 项目结构

- `/src`
  - `/handlers` - 请求处理器与工具管理
  - `/tools` - 核心功能实现
  - `/types` - TypeScript 类型定义
  - `index.ts` - 主程序入口

## 依赖项

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - 协议实现的 MCP SDK
- [keysender](https://www.npmjs.com/package/keysender) - 仅限 Windows 的 UI 自动化库
- [clipboardy](https://www.npmjs.com/package/clipboardy) - 剪贴板处理
- [sharp](https://www.npmjs.com/package/sharp) - 图像处理
- [uuid](https://www.npmjs.com/package/uuid) - UUID 生成

## 已知限制

- 目前不支持窗口最小化/还原操作
- 多显示器功能可能因配置不同而表现异常
- get_screenshot 工具在 VS Code 扩展中无法使用
- 部分操作可能需要针对目标应用提升权限
- 仅支持 Windows 系统
- 当前点击精度在 1280x720 分辨率单屏环境下表现最佳

## 许可证

MIT 许可证。
