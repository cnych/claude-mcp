---
name: browser-use-mcp-server
digest: MCP服务器允许AI代理通过browser-use工具控制网页浏览器，实现自动化网页交互与任务执行。它为AI提供了高效导航、操作和提取网页数据的无缝接口。
author: co-browser
repository: https://github.com/co-browser/browser-use-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 浏览器
  - 自动化
  - browser-use
icon: https://github.com/user-attachments/assets/45bc5bee-418d-4182-94f5-db84b4fc0b3a
createTime: 2025-03-06
featured: true
---

一个支持 AI 代理通过[browser-use](https://github.com/browser-use/browser-use)控制网页浏览器的 MCP 服务器。

## 前置要求

- [uv](https://github.com/astral-sh/uv) - 快速 Python 包管理器
- [Playwright](https://playwright.dev/) - 浏览器自动化工具
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - stdio 模式必需组件

```bash
# 安装前置组件
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install mcp-proxy
uv tool update-shell
```

## 环境配置

创建`.env`文件：

```bash
OPENAI_API_KEY=您的API密钥
CHROME_PATH=可选/Chrome浏览器路径
PATIENT=false  # 设为true可使API调用等待任务完成
```

## 安装

```bash
# 安装依赖项
uv sync
uv pip install playwright
uv run playwright install --with-deps --no-shell chromium
```

## 使用方式

### SSE 模式

```bash
# 直接从源码运行
uv run server --port 8000
```

### stdio 模式

```bash
# 1. 构建并全局安装
uv build
uv tool uninstall browser-use-mcp-server 2>/dev/null || true
uv tool install dist/browser_use_mcp_server-*.whl

# 2. 使用stdio传输运行
browser-use-mcp-server run server --port 8000 --stdio --proxy-port 9000
```

## 客户端配置

### SSE 模式客户端配置

```json
{
  "mcpServers": {
    "browser-use-mcp-server": {
      "url": "http://localhost:8000/sse"
    }
  }
}
```

### stdio 模式客户端配置

```json
{
  "mcpServers": {
    "browser-server": {
      "command": "browser-use-mcp-server",
      "args": [
        "run",
        "server",
        "--port",
        "8000",
        "--stdio",
        "--proxy-port",
        "9000"
      ],
      "env": {
        "OPENAI_API_KEY": "您的API密钥"
      }
    }
  }
}
```

### 配置文件路径

| 客户端      | 配置文件路径                                                      |
| ----------- | ----------------------------------------------------------------- |
| Cursor      | `./.cursor/mcp.json`                                              |
| Windsurf    | `~/.codeium/windsurf/mcp_config.json`                             |
| Claude(Mac) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude(Win) | `%APPDATA%\Claude\claude_desktop_config.json`                     |

## 功能特性

- [x] **浏览器自动化**：通过 AI 代理控制浏览器
- [x] **双传输协议**：支持 SSE 和 stdio 两种协议
- [x] **VNC 实时流**：可观看浏览器自动化过程
- [x] **异步任务**：异步执行浏览器操作

## 本地开发

进行本地开发和测试：

1. 构建可分发的 wheel 包：

   ```bash
   # 在项目根目录执行
   uv build
   ```

2. 作为全局工具安装：

   ```bash
   uv tool uninstall browser-use-mcp-server 2>/dev/null || true
   uv tool install dist/browser_use_mcp_server-*.whl
   ```

3. 在任何目录运行：

   ```bash
   # 为当前会话设置OpenAI API密钥
   export OPENAI_API_KEY=您的API密钥

   # 或内联提供一次性运行密钥
   OPENAI_API_KEY=您的API密钥 browser-use-mcp-server run server --port 8000 --stdio --proxy-port 9000
   ```

4. 修改后重新构建安装：
   ```bash
   uv build
   uv tool uninstall browser-use-mcp-server
   uv tool install dist/browser_use_mcp_server-*.whl
   ```

## Docker 部署

使用 Docker 可为服务器运行提供一致且隔离的环境。

```bash
# 构建Docker镜像
docker build -t browser-use-mcp-server .

# 运行容器（默认VNC密码为"browser-use"）
# --rm确保容器停止时自动删除
# -p 8000:8000映射服务器端口
# -p 5900:5900映射VNC端口
docker run --rm -p8000:8000 -p5900:5900 browser-use-mcp-server

# 使用文件配置自定义VNC密码
# 创建密码文件（如vnc_password.txt），仅包含密码内容
echo "您的安全密码" > vnc_password.txt
# 将密码文件作为secret挂载到容器内
docker run --rm -p8000:8000 -p5900:5900 \
  -v $(pwd)/vnc_password.txt:/run/secrets/vnc_password:ro \
  browser-use-mcp-server
```

### VNC 查看器

```bash
# 基于浏览器的查看器
git clone https://github.com/novnc/noVNC
cd noVNC
./utils/novnc_proxy --vnc localhost:5900
```

默认密码：`browser-use`（除非使用自定义密码方法覆盖）

![VNC截图](https://github.com/user-attachments/assets/45bc5bee-418d-4182-94f5-db84b4fc0b3a)

![VNC截图](https://github.com/user-attachments/assets/7db53f41-fc00-4e48-8892-f7108096f9c4)

## 使用示例

尝试向您的 AI 提问：

```text
打开https://news.ycombinator.com并返回排名第一的文章
```
