---
name: iOS Simulator MCP Server
digest: MCP服务器支持与iOS模拟器交互，提供获取模拟器信息、控制UI操作及检查UI元素的能力，适用于测试与开发场景。
author: joshuayoes
homepage: https://github.com/joshuayoes/ios-simulator-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ios
  - 模拟器
  - 自动化
icon: https://avatars.githubusercontent.com/u/37849890?v=4
createTime: 2025-03-20
---
用于与iOS模拟器交互的模型上下文协议（MCP）服务器。该服务器支持通过获取模拟器信息、控制UI交互和检查UI元素等方式与iOS模拟器进行交互。

## 功能特性

- 获取当前已启动iOS模拟器的ID
- 与模拟器UI交互：
  - 描述屏幕上所有可访问性元素
  - 点击屏幕坐标
  - 输入文本
  - 在坐标间滑动
  - 获取特定坐标处UI元素的信息
  - 截取模拟器屏幕截图
- 通过环境变量筛选特定工具

## 配置说明

### 环境变量

- `IOS_SIMULATOR_MCP_FILTERED_TOOLS`：以逗号分隔的工具名称列表，用于过滤不需要注册的工具。例如：`screenshot,record_video,stop_recording`

## 使用场景：代理模式下的QA步骤

该MCP可在代理模式中作为质量保障步骤，在功能实现后立即验证UI一致性和行为正确性。

### 使用方法

功能实现后：

1. 在Cursor中激活代理模式
2. 使用以下提示快速验证并记录UI交互

### 示例提示

- **验证UI元素：**

  ```
  验证当前屏幕上的所有可访问性元素
  ```

- **确认文本输入：**

  ```
  在文本输入框中输入"QA测试"并确认输入正确
  ```

- **检查点击响应：**

  ```
  点击坐标x=250, y=400并验证是否触发预期元素
  ```

- **验证滑动操作：**

  ```
  从x=150, y=600滑动到x=150, y=100并确认行为正确
  ```

- **详细元素检查：**

  ```
  描述坐标x=300, y=350处的UI元素，确保标签和功能正常
  ```

- **截取屏幕截图：**

  ```
  截取当前模拟器屏幕并保存为my_screenshot.png
  ```

- **录制视频：**

  ```
  开始录制模拟器屏幕视频（默认保存到~/Downloads/simulator_recording_$DATE.mp4）
  ```

- **停止录制：**
  ```
  停止当前模拟器屏幕录制
  ```

## 先决条件

- Node.js
- macOS系统（iOS模拟器仅支持macOS）
- 已安装[Xcode](https://developer.apple.com/xcode/resources/)和iOS模拟器
- Facebook [IDB](https://fbidb.io/)工具[（安装指南）](https://fbidb.io/docs/installation)

## 安装指南

### 方案1：使用NPX（推荐）

1. 编辑Cursor MCP配置文件：

   ```bash
   cursor ~/.cursor/mcp.json
   ```

2. 在配置中添加iOS模拟器服务器：

   ```json
   {
     "mcpServers": {
       "ios-simulator": {
         "command": "npx",
         "args": ["-y", "ios-simulator-mcp"]
       }
     }
   }
   ```

3. 重启Cursor。

### 方案2：本地开发

1. 克隆本仓库：

   ```bash
   git clone https://github.com/joshuayoes/ios-simulator-mcp
   cd ios-simulator-mcp
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 构建项目：

   ```bash
   npm run build
   ```

4. 编辑Cursor MCP配置文件：

   ```bash
   cursor ~/.cursor/mcp.json
   ```

5. 在配置中添加iOS模拟器服务器：

   ```json
   {
     "mcpServers": {
       "ios-simulator": {
         "command": "node",
         "args": ["/path/to/your/ios-simulator-mcp/build/index.js"]
       }
     }
   }
   ```

   将`"/path/to/your"`替换为实际项目目录路径。

6. 重启Cursor。

## 许可证

MIT