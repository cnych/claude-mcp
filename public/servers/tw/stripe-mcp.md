---
name: Stripe MCP
digest: Stripe MCP 伺服器讓您能透過函式呼叫整合 Stripe API。此協定支援多種工具與不同 Stripe 服務互動。
author: stripe
homepage: https://github.com/stripe/agent-toolkit/tree/main/modelcontextprotocol
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - Stripe
  - 支付
icon: https://avatars.githubusercontent.com/u/856813?s=48&v=4
createTime: 2025-04-12
---

Stripe [模型上下文協定](/tw) 伺服器讓您能透過函式呼叫整合 Stripe API。此協定支援多種工具與不同 Stripe 服務互動。

## 設定

使用 npx 執行 Stripe MCP 伺服器時，請執行以下指令：

```bash
# 設定所有可用工具
npx -y @stripe/mcp --tools=all --api-key=您的Stripe密鑰

# 設定特定工具
npx -y @stripe/mcp --tools=customers.create,customers.read,products.create --api-key=您的Stripe密鑰

# 設定 Stripe 關聯帳戶
npx -y @stripe/mcp --tools=all --api-key=您的Stripe密鑰 --stripe-account=關聯帳戶ID
```

請將 `您的Stripe密鑰` 替換為實際的 Stripe 密鑰。您也可以選擇在環境變數中設定 STRIPE_SECRET_KEY。

### 搭配 Claude Desktop 使用

將以下內容加入您的 `claude_desktop_config.json` 檔案。詳情請參閱[此處](https://modelcontextprotocol.io/quickstart/user)。

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

若使用 Docker 則改為：

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

| 工具                   | 說明             |
| ---------------------- | ---------------- |
| `customers.create`     | 建立新客戶       |
| `customers.read`       | 讀取客戶資訊     |
| `products.create`      | 建立新商品       |
| `products.read`        | 讀取商品資訊     |
| `prices.create`        | 建立新價格       |
| `prices.read`          | 讀取價格資訊     |
| `paymentLinks.create`  | 建立新付款連結   |
| `invoices.create`      | 建立新發票       |
| `invoices.update`      | 更新現有發票     |
| `invoiceItems.create`  | 建立新發票項目   |
| `balance.read`         | 取得餘額資訊     |
| `refunds.create`       | 建立新退款       |
| `paymentIntents.read`  | 讀取付款意向資訊 |
| `subscriptions.read`   | 讀取訂閱資訊     |
| `subscriptions.update` | 更新訂閱資訊     |
| `coupons.create`       | 建立新優惠券     |
| `coupons.read`         | 讀取優惠券資訊   |
| `disputes.update`      | 更新現有爭議     |
| `disputes.read`        | 讀取爭議資訊     |
| `documentation.read`   | 搜尋 Stripe 文件 |

## 伺服器除錯

您可以使用 [MCP 檢查器](/tw/inspector) 進行除錯。

首先建置伺服器：

```bash
npm run build
```

在終端機執行以下指令：

```bash
# 啟動 MCP 檢查器與含所有工具的伺服器
npx @modelcontextprotocol/inspector node dist/index.js --tools=all --api-key=您的Stripe密鑰
```

### 使用 Docker 建置

首先建置伺服器：

```bash
docker build -t mcp/stripe .
```

在終端機執行以下指令：

```bash
docker run -p 3000:3000 -p 5173:5173 -v /var/run/docker.sock:/var/run/docker.sock mcp/inspector docker run --rm -i mcp/stripe --tools=all --api-key=您的Stripe密鑰
```

### 操作說明

1. 將 `您的Stripe密鑰` 替換為實際的 Stripe API 密鑰
2. 執行指令啟動 MCP 檢查器
3. 在瀏覽器開啟 MCP 檢查器介面，點擊 Connect 啟動 MCP 伺服器
4. 您可查看所選工具清單，並單獨測試每個工具
