---
name: MCP K8S Go
digest: MCP K8S Go 是一款 Kubernetes 管理工具，通过自动化与精简工作流简化集群操作。其核心价值在于高效的资源管理、便捷的部署能力以及对云原生应用的可扩展性支持，使开发者能专注于应用构建而非基础设施管理。
author: strowk
homepage: https://github.com/strowk/mcp-k8s-go
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - kubernetes
  - go
icon: https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-4e7474d6.png
createTime: 2024-12-01
featured: true
---

![MCP K8S Go 徽标](https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-4e7474d6.png)

## 功能特性

MCP 💬 提示 🗂️ 资源 🤖 工具

- 🗂️🤖 列出 Kubernetes 上下文
- 💬🤖 列出 Kubernetes 命名空间
- 🤖 列出并获取任意 Kubernetes 资源
  - 包含对 Pods、Services、Deployments 等资源的自定义映射，同时支持列出和检索所有资源类型
- 🤖 列出 Kubernetes 节点
- 💬 列出 Kubernetes Pods
- 🤖 获取 Kubernetes 事件
- 🤖 获取 Kubernetes Pod 日志
- 🤖 在 Kubernetes Pod 中执行命令

## 通过 Inspector 浏览

要使用最新发布版本与 Inspector 交互，可运行：

```bash
npx @modelcontextprotocol/inspector npx @strowk/mcp-k8s
```

## 与 Claude 集成

下图展示了在 Claude Desktop 中选择特定上下文作为资源后，检查 kube-system 命名空间中 Pod 错误日志的对话示例：

![Claude Desktop 界面](https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-8eb1730a.png)

如需在 Claude Desktop（或其他客户端）使用此 MCP 服务，可根据需求选择安装方式。

### 通过 Smithery 安装

使用 [Smithery](https://smithery.ai/server/@strowk/mcp-k8s) 为 Claude Desktop 自动安装：

```bash
npx -y @smithery/cli install @strowk/mcp-k8s --client claude
```

### 通过 mcp-get 安装

使用 [mcp-get](https://mcp-get.com/packages/%40strowk%2Fmcp-k8s) 为 Claude Desktop 自动安装：

```bash
npx @michaellatman/mcp-get@latest install @strowk/mcp-k8s
```

### 手动安装预编译二进制文件

#### 通过 npm 安装

若已安装 npm 且希望使用预编译版本：

```bash
npm install -g @strowk/mcp-k8s
```

运行 `mcp-k8s --version` 验证版本后，将以下配置添加至 `claude_desktop_config.json` 文件：

```json
{
  "mcpServers": {
    "mcp_k8s": {
      "command": "mcp-k8s",
      "args": []
    }
  }
}
```

或通过 `npx` 与任意客户端集成：

```bash
npx @strowk/mcp-k8s
```

Claude 专用配置示例：

```json
{
  "mcpServers": {
    "mcp_k8s": {
      "command": "npx",
      "args": ["@strowk/mcp-k8s"]
    }
  }
}
```

#### 通过 GitHub 发布版安装

前往 [GitHub 发布页](https://github.com/strowk/mcp-k8s-go/releases) 下载适用于您平台的最新版本。

解压包含 `mcp-k8s-go` 二进制文件的压缩包，将其放入 PATH 路径后，在 `claude_desktop_config.json` 中添加配置：

```json
{
  "mcpServers": {
    "mcp_k8s": {
      "command": "mcp-k8s-go",
      "args": []
    }
  }
}
```

### 从源码构建

需预先安装 Golang：

```bash
go get github.com/strowk/mcp-k8s-go
go install github.com/strowk/mcp-k8s-go
```

然后在 `claude_desktop_config.json` 中添加配置：

```json
{
  "mcpServers": {
    "mcp_k8s_go": {
      "command": "mcp-k8s-go",
      "args": []
    }
  }
}
```

### 使用 Docker

自 0.3.1-beta.2 版本起提供多架构 Docker 镜像（支持 linux/amd64 和 linux/arm64）。

运行最新版镜像示例：

```bash
docker run -i -v ~/.kube/config:/home/nonroot/.kube/config --rm mcpk8s/server:latest
```

Windows 用户需将 `~/.kube/config` 替换为 `//c/Users/<用户名>/.kube/config`（适用于 Git Bash）。

Claude 专用配置：

```json
{
  "mcpServers": {
    "mcp_k8s_go": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "-v",
        "~/.kube/config:/home/nonroot/.kube/config",
        "--rm",
        "mcpk8s/server:latest"
      ]
    }
  }
}
```

### 环境变量与命令行参数

支持以下环境变量：

- `KUBECONFIG`: Kubernetes 配置文件路径（可选，默认 ~/.kube/config）

支持以下命令行参数：

- `--allowed-contexts=<ctx1,ctx2,...>`: 允许访问的 Kubernetes 上下文列表（逗号分隔，未指定时允许所有上下文）
- `--help`: 显示帮助信息
- `--version`: 显示版本信息
