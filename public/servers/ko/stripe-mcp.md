---
name: Stripe MCP
digest: Stripe MCP 서버를 통해 함수 호출로 Stripe API와 연동할 수 있습니다. 이 프로토콜은 다양한 Stripe 서비스와 상호작용하기 위한 여러 도구를 지원합니다.
author: stripe
homepage: https://github.com/stripe/agent-toolkit/tree/main/modelcontextprotocol
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - Stripe
  - 결제
icon: https://avatars.githubusercontent.com/u/856813?s=48&v=4
createTime: 2025-04-12
---

Stripe [모델 컨텍스트 프로토콜](/ko) 서버를 사용하면 함수 호출을 통해 Stripe API와 연동할 수 있습니다. 이 프로토콜은 다양한 Stripe 서비스와 상호작용하기 위한 여러 도구를 지원합니다.

## 설정

npx를 사용하여 Stripe MCP 서버를 실행하려면 다음 명령어를 사용하세요:

```bash
# 모든 사용 가능한 도구 설정
npx -y @stripe/mcp --tools=all --api-key=YOUR_STRIPE_SECRET_KEY

# 특정 도구 설정
npx -y @stripe/mcp --tools=customers.create,customers.read,products.create --api-key=YOUR_STRIPE_SECRET_KEY

# Stripe 연결 계정 구성
npx -y @stripe/mcp --tools=all --api-key=YOUR_STRIPE_SECRET_KEY --stripe-account=CONNECTED_ACCOUNT_ID
```

`YOUR_STRIPE_SECRET_KEY`를 실제 Stripe 비밀 키로 반드시 교체하세요. 또는 환경 변수에 STRIPE_SECRET_KEY를 설정할 수도 있습니다.

### Claude Desktop과 함께 사용

`claude_desktop_config.json`에 다음을 추가하세요. 자세한 내용은 [여기](https://modelcontextprotocol.io/quickstart/user)를 참조하세요.

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

또는 Docker를 사용하는 경우

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

## 사용 가능한 도구

| 도구                   | 설명                 |
| ---------------------- | -------------------- |
| `customers.create`     | 새 고객 생성         |
| `customers.read`       | 고객 정보 조회       |
| `products.create`      | 새 상품 생성         |
| `products.read`        | 상품 정보 조회       |
| `prices.create`        | 새 가격 생성         |
| `prices.read`          | 가격 정보 조회       |
| `paymentLinks.create`  | 새 결제 링크 생성    |
| `invoices.create`      | 새 청구서 생성       |
| `invoices.update`      | 기존 청구서 업데이트 |
| `invoiceItems.create`  | 새 청구서 항목 생성  |
| `balance.read`         | 잔액 정보 조회       |
| `refunds.create`       | 새 환불 생성         |
| `paymentIntents.read`  | 결제 의도 정보 조회  |
| `subscriptions.read`   | 구독 정보 조회       |
| `subscriptions.update` | 구독 정보 업데이트   |
| `coupons.create`       | 새 쿠폰 생성         |
| `coupons.read`         | 쿠폰 정보 조회       |
| `disputes.update`      | 기존 분쟁 업데이트   |
| `disputes.read`        | 분쟁 정보 조회       |
| `documentation.read`   | Stripe 문서 검색     |

## 서버 디버깅

서버를 디버깅하려면 [MCP Inspector](/ko/inspector)를 사용할 수 있습니다.

먼저 서버를 빌드하세요

```bash
npm run build
```

터미널에서 다음 명령어를 실행하세요:

```bash
# MCP Inspector와 모든 도구가 포함된 서버 시작
npx @modelcontextprotocol/inspector node dist/index.js --tools=all --api-key=YOUR_STRIPE_SECRET_KEY
```

### Docker로 빌드

먼저 서버를 빌드하세요

```bash
docker build -t mcp/stripe .
```

터미널에서 다음 명령어를 실행하세요:

```bash
docker run -p 3000:3000 -p 5173:5173 -v /var/run/docker.sock:/var/run/docker.sock mcp/inspector docker run --rm -i mcp/stripe --tools=all --api-key=YOUR_STRIPE_SECRET_KEY

```

### 지침

1. `YOUR_STRIPE_SECRET_KEY`를 실제 Stripe API 비밀 키로 교체하세요.
2. MCP Inspector를 시작하기 위해 명령어를 실행하세요.
3. 브라우저에서 MCP Inspector UI를 열고 연결을 클릭하여 MCP 서버를 시작하세요.
4. 선택한 도구 목록을 확인하고 각 도구를 개별적으로 테스트할 수 있습니다.
