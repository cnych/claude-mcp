---
name: MCP K8S Go
digest: MCP K8S Go 是一款 Kubernetes 管理工具，透過自動化與簡化工作流程來簡化叢集操作。其核心價值在於高效的資源管理、簡易部署以及雲原生應用的擴展性。該平台讓開發者能專注於構建應用程式，而非基礎設施管理。
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

![MCP K8S Go Logo](https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-4e7474d6.png)

## 功能

MCP 💬 提示 🗂️ 資源 🤖 工具

- 🗂️🤖 列出 Kubernetes 上下文
- 💬🤖 列出 Kubernetes 命名空間
- 🤖 列出並取得任何 Kubernetes 資源
  - 包含針對 pods、services、deployments 等資源的自訂映射，但任何資源皆可列出與檢索
- 🤖 列出 Kubernetes 節點
- 💬 列出 Kubernetes pods
- 🤖 取得 Kubernetes 事件
- 🤖 取得 Kubernetes pod 日誌
- 🤖 在 Kubernetes pod 中執行命令

## 透過 Inspector 瀏覽

若要使用最新發布版本搭配 Inspector，可執行以下指令：

```bash
npx @modelcontextprotocol/inspector npx @strowk/mcp-k8s
```

## 與 Claude 搭配使用

以下與 Claude Desktop 的對話示範了當選擇特定上下文作為資源後，要求檢查 kube-system 命名空間中 pod 日誌錯誤時的情況：

![Claude Desktop](https://static.claudemcp.com/servers/strowk/mcp-k8s-go/strowk-mcp-k8s-go-8eb1730a.png)

若要讓此 MCP 伺服器與 Claude Desktop（或任何其他客戶端）搭配使用，您可能需要選擇安裝方式。

### 使用 Smithery

透過 [Smithery](https://smithery.ai/server/@strowk/mcp-k8s) 自動為 Claude Desktop 安裝 MCP K8S Go：

```bash
npx -y @smithery/cli install @strowk/mcp-k8s --client claude
```

### 使用 mcp-get

透過 [mcp-get](https://mcp-get.com/packages/%40strowk%2Fmcp-k8s) 自動為 Claude Desktop 安裝 MCP K8S Go：

```bash
npx @michaellatman/mcp-get@latest install @strowk/mcp-k8s
```

### 手動使用預建二進位檔

#### 從 npm 預建

若已安裝 npm 且想使用預建二進位檔：

```bash
npm install -g @strowk/mcp-k8s
```

接著執行 `mcp-k8s --version` 檢查版本，若顯示已安裝版本，即可繼續將配置加入 `claude_desktop_config.json` 檔案：

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

，或搭配任何客戶端使用 `npx`：

```bash
npx @strowk/mcp-k8s
```

例如針對 Claude：

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

#### 從 GitHub 發布頁面

前往 [GitHub 發布頁面](https://github.com/strowk/mcp-k8s-go/releases) 下載適用於您平台的最新版本。

解壓縮檔案，其中會包含名為 `mcp-k8s-go` 的二進位檔，將其置於您的 PATH 路徑中，然後將以下配置加入 `claude_desktop_config.json` 檔案：

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

### 從原始碼建置

您需要安裝 Golang 來建置此專案：

```bash
go get github.com/strowk/mcp-k8s-go
go install github.com/strowk/mcp-k8s-go
```

，然後將以下配置加入 `claude_desktop_config.json` 檔案：

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

自 0.3.1-beta.2 版本起，此伺服器已建置並發布至 Docker Hub，提供適用於 linux/amd64 和 linux/arm64 架構的多平台映像檔。

您可以使用 latest 標籤，例如：

```bash
docker run -i -v ~/.kube/config:/home/nonroot/.kube/config --rm mcpk8s/server:latest
```

Windows 使用者可能需要將 `~/.kube/config` 替換為 `//c/Users/<username>/.kube/config`，至少在 Git Bash 中需如此。

針對 Claude：

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

### 環境變數與命令列選項

MCP 伺服器使用以下環境變數：

- `KUBECONFIG`: 您的 Kubernetes 配置檔案路徑（選填，預設為 ~/.kube/config）

支援以下命令列選項：

- `--allowed-contexts=<ctx1,ctx2,...>`: 允許使用者存取的 Kubernetes 上下文清單（以逗號分隔）。若未指定，則允許所有上下文。
- `--help`: 顯示幫助資訊
- `--version`: 顯示版本資訊
