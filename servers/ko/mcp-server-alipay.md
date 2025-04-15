---
name: 알리페이 MCP
digest: 알리페이 MCP Server는 알리페이 오픈 플랫폼에서 제공하는 MCP Server로, 거래 생성, 조회, 환불 등의 기능을 LLM 애플리케이션에 쉽게 통합하여 결제 기능을 갖춘 지능형 도구를 만들 수 있습니다.
author: 알리페이 오픈 플랫폼
homepage: https://www.npmjs.com/package/@alipay/mcp-server-alipay
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 알리페이
  - 결제
icon: /images/alipay.png
createTime: 2025-04-15
featured: true
---

`@alipay/mcp-server-alipay`는 알리페이 오픈 플랫폼에서 제공하는 MCP Server로, 거래 생성, 조회, 환불 등의 기능을 LLM 애플리케이션에 쉽게 통합하여 결제 기능을 갖춘 지능형 도구를 만들 수 있습니다.

다음은 도구의 기능을 이해하기 쉽게 설명하는 가상의 간소화된 사용 시나리오입니다:

> 한 일러스트레이터가 맞춤형 원작 일러스트레이션 서비스를 제공하여 수입을 얻고자 합니다. 전통적인 방식에서는 각 고객과 반복적으로 요구사항을 소통하고, 가격을 결정하며, 결제 링크를 보낸 후 수동으로 결제 상태를 확인해야 하는 번거롭고 시간이 많이 소요되는 과정이 필요했습니다.
>
> 이제 일러스트레이터는 알리페이 MCP Server와 지능형 Agent 도구를 활용하여 Agent 플랫폼을 통해 지능형 채팅 애플리케이션(웹 또는 미니 프로그램)을 개발했습니다. 고객은 애플리케이션에서 자신의 그림 요구사항(스타일 선호도, 일러스트 용도, 납품 시간 등)을 설명하기만 하면, AI가 자동으로 요구사항을 분석하여 정확하고 합리적인 맞춤형 견적을 신속하게 생성하고, 도구를 통해 전용 알리페이 결제 링크를 즉시 생성합니다.
>
> 客户点击并支付后，创作者立即收到通知，进入创作环节。无需人工往返对话确认交易状态或支付情况，整个流程不仅便捷顺畅，还能显著提高交易效率和客户满意度，让插画师更专注于自己的创作本身，实现更轻松的个性化服务商业模式。

````bash
최종 사용자 기기                     Agent 실행 환경
+---------------------+        +--------------------------+      +-------------------+
|                     |  통신  |   알리페이 MCP Server +   |      |                   |
|    미니앱/웹앱      |<------>|   기타 MCP Server +      |<---->|     결제 서비스    |
|                     |  결제  |   Agent 개발 도구        |      |   거래/환불/조회  |
+---------------------+        +--------------------------+      +-------------------+
     창작 서비스 구매자                 지능형 도구 개발자                알리페이 오픈 플랫폼
      (최종 사용자)                        (창작자)

이 도구에 대한 더 자세한 소개와 사용 가이드(결제 가맹점 신분 준비 등 사전 절차 포함)는 알리페이 오픈 플랫폼의 [결제 MCP 서비스 문서](https://opendocs.alipay.com/open/0go80l)를 참조하세요.

## 사용 및 구성

도구의 대부분 결제 기능을 사용하려면 먼저 알리페이 오픈 플랫폼의 결제 가맹점이 되어 가맹점 개인 키를 획득해야 합니다. 그 후, 주요 MCP 클라이언트에서 알리페이 MCP Server를 직접 사용할 수 있습니다:

### Cursor에서 사용하기

Cursor 프로젝트의 `.cursor/mcp.json`에 다음 구성을 추가하세요:

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
        "...기타 매개변수": "...기타 값"
      }
    },
    "기타 도구": {
      "...": "..."
    }
  }
}
````

### Cline 에서 사용하기

Cline 설정의 `cline_mcp_settings.json` 구성 파일에 다음 구성을 추가하세요:

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
        "...기타 매개변수": "...기타 값"
      },
      "disable": false,
      "autoApprove": []
    },
    "기타 도구": {
      "...": "..."
    }
  }
}
```

### 다른 MCP Client 에서 사용하기

다른 MCP Client 에서도 사용할 수 있습니다. 서버 프로세스 시작 방식을 `npx -y @alipay/mcp-server-alipay`로 적절히 구성하고, 아래 설명한 환경 매개변수를 설정하세요.

### 모든 매개변수

알리페이 MCP Server는 환경 변수를 통해 매개변수를 수신합니다. 매개변수와 기본값은 다음과 같습니다:

```shell
# 알리페이 오픈 플랫폼 구성

AP_APP_ID=2014...222                    # 알리페이 오픈 플랫폼에서 신청한 애플리케이션 ID(APPID)。필수 항목입니다.
AP_APP_KEY=MIIE...DZdM=                 # 알리페이 오픈 플랫폼에서 신청한 애플리케이션 개인 키。필수 항목입니다.
AP_PUB_KEY=MIIB...DAQAB                 # 알리페이 서비스 서버 데이터 서명 검증을 위한 알리페이 공공 키。필수 항목입니다.
AP_RETURN_URL=https://success-page      # 웹 결제 완료 후 결제 사용자가 보게 될 「동기 결과 반환 주소」。
AP_NOTIFY_URL=https://your-own-server   # 결제 완료 후 개발자에게 결제 결과를 알리는「비동기 결과 알림 주소」。
AP_ENCRYPTION_ALGO=RSA2                 # 알리페이 오픈 플랫폼에서 구성한 매개변수 서명 방법。선택 가능한 값은 "RSA2" 또는 "RSA"입니다。기본값은 "RSA2"입니다.
AP_CURRENT_ENV=prod                     # 연결된 알리페이 오픈 플랫폼 환경。선택 가능한 값은 "prod"（실제 환경） 또는 "sandbox"（시험 환경）입니다. 기본값은 "prod"입니다.

# MCP Server 구성

AP_SELECT_TOOLS=all                      # 사용 가능한 도구。선택 가능한 값은 "all" 또는 쉼표로 구분된 도구 이름 목록입니다。도구 이름은 `mobilePay`, `webPagePay`, `queryPay`, `refundPay`, `refundQuery`입니다。기본값은 "all"입니다.
AP_LOG_ENABLED=true                      # $HOME/mcp-server-alipay.log 에 로그를 기록합니다. 기본값은 true입니다.
```

## MCP Inspector 사용하기

MCP Inspector를 사용하여 알리페이 MCP Server의 기능을 디버깅하고 이해할 수 있습니다:

1. `export` 명령어를 사용하여 각 환경 변수를 설정합니다.
2. `npx -y @modelcontextprotocol/inspector npx -y @alipay/mcp-server-alipay` 명령어를 실행하여 MCP Inspector를 시작합니다.
3. MCP Inspector WebUI에서 디버깅할 수 있습니다.

## 지원 기능

아래 표는 모든 결제 도구 기능을 나열합니다:

| 이름                                              | `AP_SELECT_TOOLS`의 도구 이름       | 설명                                                                                                                                                                                                                             | 매개변수                                   | 출력                             |
| ------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------- |
| `create-mobile-alipay-payment`                    | `mobilePay`                         | 알리페이 주문을 생성하고 결제 링크가 포함된 Markdown 텍스트를 반환합니다. 이 링크는 모바일 브라우저에서 열면 알리페이로 이동하거나 브라우저에서 직접 결제할 수 있습니다. 이 도구는 모바일 웹사이트나 모바일 앱에 적합합니다.     | \- outTradeNo: 판매자 주문 번호, 최대 64자 |                                  |
| \- totalAmount: 결제 금액, 단위: 위안, 최소 0.01  |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| \- orderTitle: 주문 제목, 최대 256자              | \- url: 결제 링크의 markdown 텍스트 |                                                                                                                                                                                                                                  |                                            |                                  |
| `create-web-page-alipay-payment`                  | `webPagePay`                        | 알리페이 주문을 생성하고 결제 링크가 포함된 Markdown 텍스트를 반환합니다. 이 링크는 PC 브라우저에서 열면 결제 QR 코드가 표시되어 사용자가 스캔하여 결제할 수 있습니다. 이 도구는 데스크톱 웹사이트나 PC 클라이언트에 적합합니다. | \- outTradeNo: 판매자 주문 번호, 최대 64자 |                                  |
| \- totalAmount: 결제 금액, 단위: 위안, 최소 0.01  |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| \- orderTitle: 주문 제목, 최대 256자              | \- url: 결제 링크의 markdown 텍스트 |                                                                                                                                                                                                                                  |                                            |                                  |
| `query-alipay-payment`                            | `queryPay`                          | 알리페이 주문을 조회하고 주문 정보가 포함된 텍스트를 반환합니다                                                                                                                                                                  | \- outTradeNo: 판매자 주문 번호, 최대 64자 | \- tradeStatus: 주문의 거래 상태 |
| \- totalAmount: 주문의 거래 금액                  |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| \- tradeNo: 알리페이 거래 번호                    |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| `refund-alipay-payment`                           | `refundPay`                         | 거래에 대한 환불을 시작하고 환불 상태와 환불 금액을 반환합니다                                                                                                                                                                   | \- outTradeNo: 판매자 주문 번호, 최대 64자 |                                  |
| \- refundAmount: 환불 금액, 단위: 위안, 최소 0.01 |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| \- outRequestNo: 환불 요청 번호, 최대 64자        |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| \- refundReason: 환불 이유, 최대 256자(선택 사항) | \- tradeNo: 알리페이 거래 번호      |                                                                                                                                                                                                                                  |                                            |                                  |
| \- refundResult: 환불 결과                        |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| `query-alipay-refund`                             | `refundQuery`                       | 알리페이 환불을 조회하고 환불 상태와 환불 금액을 반환합니다                                                                                                                                                                      | \- outRequestNo: 환불 요청 번호, 최대 64자 |                                  |
| \- outTradeNo: 판매자 주문 번호, 최대 64자        | \- tradeNo: 알리페이 거래 번호      |                                                                                                                                                                                                                                  |                                            |                                  |
| \- refundAmount: 환불 금액                        |                                     |                                                                                                                                                                                                                                  |                                            |                                  |
| \- refundStatus: 환불 상태                        |                                     |                                                                                                                                                                                                                                  |                                            |                                  |

## 적합한 결제 방식 선택 방법

개발 과정에서 LLM이 적합한 결제 방식을 더 정확하게 선택할 수 있도록 Prompt에서 제품 사용 시나리오를 명확히 설명하는 것이 좋습니다:

- **QR 코드 결제(`webPagePay`)**: 사용자가 컴퓨터 화면에서 결제 인터페이스를 보는 시나리오에 적합합니다. 애플리케이션이나 웹사이트가 주로 데스크톱(PC)에서 실행되는 경우, Prompt에서 다음과 같이 명시할 수 있습니다: "내 애플리케이션은 데스크톱 소프트웨어/PC 웹사이트이며, 컴퓨터에서 결제 QR 코드를 표시해야 합니다."
- **모바일 결제(`mobilePay`)**: 사용자가 모바일 브라우저에서 결제를 시작하는 시나리오에 적합합니다. 애플리케이션이 모바일 H5 페이지나 모바일 웹사이트인 경우, Prompt에서 다음과 같이 명시할 수 있습니다: "내 페이지는 모바일 웹페이지이며, 모바일에서 직접 알리페이 결제를 실행해야 합니다."

향후 AI 애플리케이션에 더 적합한 결제 방식을 제공할 예정이니 기대해 주세요.

## 주의 사항

- 알리페이 MCP 서비스는 현재 초기 출시 단계에 있으며, 관련 기능과 지원 인프라가 지속적으로 개선되고 있습니다. 문제 피드백, 사용 경험 또는 제안 사항이 있으시면 [알리페이 개발자 커뮤니티](https://open.alipay.com/portal/forum)에서 논의에 참여해 주세요.
- 지능형 에이전트 서비스를 배포하고 사용할 때는 판매자 개인 키를 안전하게 보관하여 유출을 방지하세요. 필요한 경우 [알리페이 오픈 플랫폼-키 수정 방법](https://opendocs.alipay.com/support/01rav9)의 지침에 따라 기존 키를 무효화할 수 있습니다.
- MCP Server를 사용하는 지능형 에이전트 서비스를 개발하여 사용자에게 제공할 때는 필요한 보안 지식을 이해하고 AI 애플리케이션 특유의 Prompt 공격, MCP Server 임의 명령 실행 등의 보안 위험을 방지하세요.
- 추가 주의 사항 및 모범 사례는 알리페이 오픈 플랫폼의 [결제 MCP 서비스 관련](https://opendocs.alipay.com/open/0go80l) 설명을 참조하세요.

## 사용 약관

이 도구는 알리페이 오픈 플랫폼 기능의 일부입니다. 사용 중에는 [알리페이 오픈 플랫폼 개발자 서비스 계약](https://ds.alipay.com/fd-ifz2dlhv/index.html) 및 관련 상업 행위 규정을 준수하세요.
