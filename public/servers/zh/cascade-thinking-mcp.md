---
name: Cascade Thinking MCP 服务器
digest: 将线性问题解决转变为丰富的多维探索，具有真正的分支和智能思维管理
author: Drew Llewellyn
homepage: https://github.com/drewdotpro/cascade-thinking-mcp
repository: https://github.com/drewdotpro/cascade-thinking-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - reasoning
  - problem-solving
  - analysis
  - thinking
  - branching
createTime: 2025-01-25T00:00:00Z
---

将线性问题解决转变为丰富的多维探索，具有真正的分支和智能思维管理。

## 功能特性

- **真正的分支**: 创建自动启动新序列的独立探索路径
- **思维修订**: 随着理解的深入更新早期的见解
- **动态扩展**: 需要时将思维空间扩展 50% 或至少增加 3 个思维
- **多工具集成**: 通过 `toolSource` 跟踪实现跨工具的持久状态
- **灵活输出**: 使用最小、标准或详细响应模式控制详细程度
- **双重编号系统**: 使用序列相对位置 (S{n}) 和绝对位置 (A{n}) 跟踪思维

## 为什么选择 Cascade Thinking？

传统的问题解决工具在面对模糊性时会失效。Cascade Thinking MCP 让你能够：
- 通过创建独立序列的真正分支探索替代方案
- 通过完整的可追溯性修订先前的思维
- 通过持久状态在代理和工具之间保持上下文
- 在探索中期发现复杂性时动态扩展

## API

### 工具

- **cascade_thinking**
  - 促进具有动态分支和修订功能的详细、逐步思考过程
  - 关键输入：
    - `thought` (字符串): 当前思考步骤
    - `nextThoughtNeeded` (布尔值): 是否需要另一个思考步骤
    - `thoughtNumber` (字符串): 序列中的当前位置（例如 "S1"、"S2"、"S3"）
    - `totalThoughts` (整数): 预计需要的总思维数
    - `branchFromThought` (可选): 从指定思维创建新分支
    - `needsMoreThoughts` (可选): 动态扩展 totalThoughts
    - `responseMode` (可选): 控制详细程度（minimal/standard/verbose）

## 独特功能

### 双重编号系统
- **S{n}**: 序列相对位置（每个分支重置）
- **A{n}**: 所有思维的绝对位置（永不重置）

### 真正的分支
当你创建分支时，工具会：
1. 自动创建新序列
2. 在新分支中将编号重置为 S1
3. 从父序列复制相关上下文
4. 跟踪分支关系以便导航

### 动态扩展
当你设置 `needsMoreThoughts: true` 时：
1. 将 totalThoughts 增加 50% 或至少 3 个思维
2. 显示包括 ⚡ 表情符号的视觉指示器
3. 用新总数更新响应
4. 添加提示文本以指示扩展

## 在 Claude Desktop 中使用

将此添加到你的 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "cascade-thinking-mcp"
      ]
    }
  }
}
```

## 使用 Docker

```json
{
  "mcpServers": {
    "cascade-thinking": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/cascade-thinking"
      ]
    }
  }
}
```

## 使用示例

开始探索：
```json
{
  "thought": "分析我们 API 的认证选项",
  "thoughtNumber": "S1",
  "totalThoughts": 3,
  "nextThoughtNeeded": true
}
```

创建分支探索 OAuth：
```json
{
  "thought": "让我探索 OAuth2 实现",
  "thoughtNumber": "S1",
  "branchFromThought": "A1",
  "branchId": "oauth-exploration",
  "totalThoughts": 4,
  "nextThoughtNeeded": true
}
```

## 许可证

此 MCP 服务器根据 MIT 许可证授权。这意味着你可以自由使用、修改和分发该软件，但须遵守 MIT 许可证的条款和条件。更多详情请参见项目仓库中的 LICENSE 文件。