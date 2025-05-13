---
name: Stripe MCP
digest: Stripe MCP服务器支持通过函数调用与Stripe API集成。该协议提供多种工具以对接不同Stripe服务。
author: stripe
homepage: https://github.com/stripe/agent-toolkit/tree/main/modelcontextprotocol
capabilities:
  prompt: false
  resource: false
  tools: true
tags:
  - Stripe
  - 支付
icon: https://avatars.githubusercontent.com/u/856813?s=48&v=4
createTime: 2025-04-12
---

[Stripe MCP](/zh)服务器支持通过函数调用与 Stripe API 集成。该协议提供多种工具以对接不同 Stripe 服务。

## 安装配置

使用 npx 运行 Stripe MCP 服务器的命令如下：

```bash
# 配置所有可用工具
npx -y @stripe/mcp --tools=all --api-key=您的STRIPE密钥

# 配置指定工具
npx -y @stripe/mcp --tools=customers.create,customers.read,products.create --api-key=您的STRIPE密钥

# 配置Stripe关联账户
npx -y @stripe/mcp --tools=all --api-key=您的STRIPE密钥 --stripe-account=关联账户ID
```

请将`您的STRIPE密钥`替换为实际密钥。您也可以设置环境变量 STRIPE_SECRET_KEY。

### 在 Claude Desktop 中使用

将以下内容添加到`claude_desktop_config.json`中。详见[使用指南](https://modelcontextprotocol.io/quickstart/user)。

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": [
        "-y",
        "@stripe/mcp",
        "--tools=all",
        "--api-key=STRIPE_SECRET_KEY"
      ]
    }
  }
}
```

若使用 Docker：

```json
{
  "mcpServers": {
    "stripe": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/stripe",
        "--tools=all",
        "--api-key=STRIPE_SECRET_KEY"
      ]
    }
  }
}
```

## 可用工具

| 工具                   | 功能描述         |
| ---------------------- | ---------------- |
| `customers.create`     | 创建新客户       |
| `customers.read`       | 查询客户信息     |
| `products.create`      | 创建新产品       |
| `products.read`        | 查询产品信息     |
| `prices.create`        | 创建新价格       |
| `prices.read`          | 查询价格信息     |
| `paymentLinks.create`  | 创建支付链接     |
| `invoices.create`      | 创建新发票       |
| `invoices.update`      | 更新现有发票     |
| `invoiceItems.create`  | 创建发票项目     |
| `balance.read`         | 查询余额信息     |
| `refunds.create`       | 创建退款         |
| `paymentIntents.read`  | 查询支付意向信息 |
| `subscriptions.read`   | 查询订阅信息     |
| `subscriptions.update` | 更新订阅信息     |
| `coupons.create`       | 创建优惠券       |
| `coupons.read`         | 查询优惠券信息   |
| `disputes.update`      | 更新争议         |
| `disputes.read`        | 查询争议信息     |
| `documentation.read`   | 搜索 Stripe 文档 |

## 服务器调试

可使用[MCP 检查器](/zh/inspector)进行调试。

首先构建服务器：

```bash
npm run build
```

在终端运行：

```bash
# 启动检查器和所有工具
npx @modelcontextprotocol/inspector node dist/index.js --tools=all --api-key=您的STRIPE密钥
```

### Docker 构建方式

首先构建镜像：

```bash
docker build -t mcp/stripe .
```

运行命令：

```bash
docker run -p 3000:3000 -p 5173:5173 -v /var/run/docker.sock:/var/run/docker.sock mcp/inspector docker run --rm -i mcp/stripe --tools=all --api-key=您的STRIPE密钥
```

### 操作说明

1. 将`您的STRIPE密钥`替换为实际 API 密钥
2. 运行命令启动 MCP 检查器
3. 在浏览器打开检查器界面，点击连接启动 MCP 服务器
4. 可查看所选工具列表并单独测试每个工具
