---
name: Alipay MCP
digest: Alipay MCP Server is provided by Alipay Open Platform, allowing you to easily integrate transaction creation, query, refund and other capabilities from Alipay Open Platform into your LLM applications, and further create intelligent tools with payment capabilities.
author: Alipay Open Platform
homepage: https://www.npmjs.com/package/@alipay/mcp-server-alipay
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - Alipay
  - Payment
icon: https://static.claudemcp.com/images/alipay.png
createTime: 2025-04-15
featured: true
---

`@alipay/mcp-server-alipay` is an MCP Server provided by Alipay Open Platform, allowing you to easily integrate transaction creation, query, refund and other capabilities from Alipay Open Platform into your LLM applications, and further create intelligent tools with payment capabilities.

Below is a simplified fictional use case to help understand the tool's capabilities:

> An illustrator wants to earn income by providing custom original illustration services. Traditionally, they would need to repeatedly communicate with each client about requirements, determine pricing, send payment links, and then manually confirm payment status - a cumbersome and time-consuming process.
>
> Now, using Alipay MCP Server with intelligent Agent tools, the illustrator has developed a smart chat application (web or mini-program) through the Agent platform. Clients only need to describe their illustration requirements in the application (such as style preferences, illustration purpose, delivery time, etc.), and the AI will automatically analyze the requirements, quickly generate accurate and reasonable custom quotes, and instantly create dedicated Alipay payment links through the tool.
>
> After the client clicks and completes payment, the creator immediately receives a notification and enters the creation phase. Without the need for manual back-and-forth dialogue to confirm transaction status or payment situation, the entire process is not only convenient and smooth but also significantly improves transaction efficiency and customer satisfaction, allowing illustrators to focus more on their creative work and achieve a more effortless personalized service business model.

```bash
End User Device                 Agent Runtime Environment
+---------------------+        +--------------------------+      +-------------------+
|                     |  Comm. |   Alipay MCP Server +    |      |                   |
|    Mini-app/WebApp  |<------>|   Other MCP Servers +    |<---->|   Payment Service |
|                     |  Pay   |   Agent Dev Tools        |      |  Trans/Refund/Query|
+---------------------+        +--------------------------+      +-------------------+
   Creative Service Buyer           Intelligent Tool Developer         Alipay Open Platform
      (End User)                         (Creator)
```

For more information and usage guidelines about this tool, including the prerequisite process of preparing the payment merchant identity, please refer to the [Payment MCP Service Documentation](https://opendocs.alipay.com/open/0go80l) on the Alipay Open Platform.

## Usage and Configuration

To use most of the payment capabilities of the tool, you need to first become a payment merchant on the Alipay Open Platform and obtain your merchant private key. After that, you can directly use the Alipay MCP Server on the mainstream MCP Clients:

### Using in Cursor

Add the following configuration to the `.cursor/mcp.json` file in your Cursor project:

```json
{
  "mcpServers": {
    "mcp-server-alipay": {
      "command": "npx",
      "args": ["-y", "@alipay/mcp-server-alipay"],
      "env": {
        "AP_APP_ID": "2014...222",
        "AP_APP_KEY": "MIIE...DZdM=",
        "AP_PUB_KEY": "MIIB...DAQAB",
        "AP_RETURN_URL": "https://success-page",
        "AP_NOTIFY_URL": "https://your-own-server",
        "...other parameters": "...other values"
      }
    },
    "other tools": {
      "...": "..."
    }
  }
}
```

### Using in Cline

Find the `cline_mcp_settings.json` configuration file in your Cline settings and add the following configuration:

```json
{
  "mcpServers": {
    "mcp-server-alipay": {
      "command": "npx",
      "args": ["-y", "@alipay/mcp-server-alipay"],
      "env": {
        "AP_APP_ID": "2014...222",
        "AP_APP_KEY": "MIIE...DZdM=",
        "AP_PUB_KEY": "MIIB...DAQAB",
        "AP_RETURN_URL": "https://success-page",
        "AP_NOTIFY_URL": "https://your-own-server",
        "...other parameters": "...other values"
      },
      "disable": false,
      "autoApprove": []
    },
    "other tools": {
      "...": "..."
    }
  }
}
```

### Using in other MCP Clients

You can also use it in any other MCP Client by properly configuring the Server process startup method `npx -y @alipay/mcp-server-alipay`, and setting the environment parameters as described below.

### All Parameters

Alipay MCP Server receives parameters through environment variables. Parameters and default values include:

```shell
# Alipay Open Platform Configuration

AP_APP_ID=2014...222                    # The application ID (APPID) applied by the merchant on the Open Platform. Required.
AP_APP_KEY=MIIE...DZdM=                 # The application private key applied by the merchant on the Open Platform. Required.
AP_PUB_KEY=MIIB...DAQAB                 # The public key used to verify the data signature of the Alipay service, obtained from the Open Platform. Required.
AP_RETURN_URL=https://success-page      # The "synchronous result return address" displayed to the payment user after the web payment is completed.
AP_NOTIFY_URL=https://your-own-server   # The "asynchronous result notification address" used to inform the developer of the payment result.
AP_ENCRYPTION_ALGO=RSA2                 # The parameter signature method configured by the merchant on the Open Platform. Optional values are "RSA2" or "RSA". The default value is "RSA2".
AP_CURRENT_ENV=prod                     # The Alipay Open Platform environment connected to. Optional values are "prod" (production environment) or "sandbox" (sandbox environment). The default value is "prod".

# MCP Server Configuration

AP_SELECT_TOOLS=all                      # The tools allowed to be used. Optional values are "all" or a comma-separated list of tool names. The tool names include `mobilePay`, `webPagePay`, `queryPay`, `refundPay`, `refundQuery`. The default value is "all".
AP_LOG_ENABLED=true                      # Whether to record logs in $HOME/mcp-server-alipay.log. The default value is true.
```

## Debugging with MCP Inspector

You can use MCP Inspector to debug and understand the functionality of the Alipay MCP Server:

1. Set the environment variables through `export`;
2. Execute `npx -y @modelcontextprotocol/inspector npx -y @alipay/mcp-server-alipay` to start MCP Inspector;
3. Debug in the MCP Inspector WebUI.

## Supported Capabilities

The following table lists all the available payment tool capabilities:
| Name | Tool Name in `AP_SELECT_TOOLS` | Description | Parameters | Output |
| -------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| `create-mobile-alipay-payment` | `mobilePay` | Creates an Alipay order and returns Markdown text with a payment link that can be opened in a mobile browser to jump to Alipay or pay directly in the browser. This tool is suitable for mobile websites or mobile apps. | - outTradeNo: Merchant order number, max 64 characters | |
| | | | - totalAmount: Payment amount, unit: yuan, minimum 0.01 | |
| | | | - orderTitle: Order title, max 256 characters | - url: Markdown text with payment link |
| `create-web-page-alipay-payment` | `webPagePay` | Creates an Alipay order and returns Markdown text with a payment link that, when opened in a desktop browser, displays a payment QR code that users can scan to pay. This tool is suitable for desktop websites or computer clients. | - outTradeNo: Merchant order number, max 64 characters | |
| | | | - totalAmount: Payment amount, unit: yuan, minimum 0.01 | |
| | | | - orderTitle: Order title, max 256 characters | - url: Markdown text with payment link |
| `query-alipay-payment` | `queryPay` | Queries an Alipay order and returns text with order information | - outTradeNo: Merchant order number, max 64 characters | - tradeStatus: Order transaction status |
| | | | | - totalAmount: Order transaction amount |
| | | | | - tradeNo: Alipay transaction number |
| `refund-alipay-payment` | `refundPay` | Initiates a refund for a transaction and returns the refund status and amount | - outTradeNo: Merchant order number, max 64 characters | |
| | | | - refundAmount: Refund amount, unit: yuan, minimum 0.01 | |
| | | | - outRequestNo: Refund request number, max 64 characters | |
| | | | - refundReason: Refund reason, max 256 characters (optional) | - tradeNo: Alipay transaction number |
| | | | | - refundResult: Refund result |
| `query-alipay-refund` | `refundQuery` | Queries an Alipay refund and returns the refund status and amount | - outRequestNo: Refund request number, max 64 characters | |
| | | | - outTradeNo: Merchant order number, max 64 characters | - tradeNo: Alipay transaction number |
| | | | | - refundAmount: Refund amount |
| | | | | - refundStatus: Refund status |

## How to Choose the Appropriate Payment Method

During development, to help the LLM choose the appropriate payment method more accurately, it's recommended to clearly explain your product usage scenario in the prompt:

- **QR Code Payment (`webPagePay`)**: Suitable for scenarios where users see the payment interface on a computer screen. If your application or website primarily runs on desktop (PC), you can specify in your prompt: "My application is desktop software/PC website, and needs to display a payment QR code on the computer."
- **Mobile Payment (`mobilePay`)**: Suitable for scenarios where users initiate payment within a mobile browser. If your application is a mobile H5 page or mobile website, you can specify in your prompt: "My page is a mobile website, and needs to directly invoke Alipay payment on the mobile phone."

We will provide more payment methods suitable for AI applications in the future. Stay tuned.

## Important Notes

- The Alipay MCP service is currently in its early release stage, and related capabilities and supporting facilities are being continuously improved. For feedback, user experience, or suggestions, please join the discussion in the [Alipay Developer Community](https://open.alipay.com/portal/forum).
- When deploying and using intelligent agent services, please properly safeguard your merchant private key to prevent leakage. If needed, refer to [Alipay Open Platform - How to Modify Keys](https://opendocs.alipay.com/support/01rav9) for instructions on invalidating existing keys.
- When developing any intelligent agent service using the MCP Server and providing it to users, please understand the necessary security knowledge to prevent AI application-specific security risks such as prompt attacks and arbitrary command execution in MCP Server.
- For more precautions and best practices, please refer to the [About Payment MCP Service](https://opendocs.alipay.com/open/0go80l) documentation on the Alipay Open Platform.

## Terms of Use

This tool is an integral part of the Alipay Open Platform capabilities. During use, please comply with the [Alipay Open Platform Developer Service Agreement](https://ds.alipay.com/fd-ifz2dlhv/index.html) and relevant commercial behavior regulations.
