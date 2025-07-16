---
title: MCP Python SDK 심화 사용법
description: MCP Python SDK를 활용한 SSE 및 Streamable HTTP 프로토콜 구현과 MCP Inspector를 통한 MCP 서버 테스트
section: base-dev
prev: mcp-py-sdk-basic
next: mcp-authorization
pubDate: 2025-06-10
order: 8
---

# MCP Python SDK 심화 사용법

이전에는 MCP의 기본 개념인 아키텍처, 프로토콜, 적용 시나리오에 대해 깊이 있게 알아보았습니다. 또한 간단한 예제를 통해 MCP 서비스와 클라이언트 개발 방법을 배웠지만, stdio 모드의 MCP 서비스와 클라이언트만 다루었습니다. 실제 애플리케이션에서는 MCP 서비스를 클라우드에 배포하는 방법을 고려해야 하므로, SSE와 Streamable HTTP 프로토콜을 더 자주 사용하게 됩니다.

## SSE 모드

SSE 모드는 MCP 서비스와 클라이언트 간의 통신 방식 중 하나로, Server-Sent Events(SSE) 프로토콜을 사용하여 데이터를 전송합니다. 이제 MCP 기반의 스마트 쇼핑몰 서비스 어시스턴트를 개발해 보겠습니다. 이 어시스턴트는 SSE 타입의 MCP 서비스를 사용하며, 다음과 같은 핵심 기능을 갖추고 있습니다:

- 실시간 제품 정보 및 재고 수준 확인, 맞춤형 주문 지원
- 고객 선호도와 가용 재고를 기반으로 제품 추천
- MCP 도구 서버를 이용한 마이크로서비스와의 실시간 상호작용
- 제품 문의 시 실시간 재고 수준 확인
- 제품 ID와 수량을 활용한 제품 구매 지원
- 재고 수준 실시간 업데이트
- 자연어 쿼리를 통한 주문 거래 임시 분석 제공

![스마트 쇼핑몰 어시스턴트](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749089781344.png)

여기서는 마이크로서비스 아키텍처를 채택할 수 있습니다. 먼저 제품 마이크로서비스가 필요하며, 이는 제품 목록 API 인터페이스를 제공합니다. 또한 주문 마이크로서비스를 제공하여 주문 생성, 재고 정보 등의 API 인터페이스를 노출합니다.

다음으로 핵심은 MCP SSE 서버로, 제품 마이크로서비스와 주문 마이크로서비스 데이터를 LLM에 노출하는 SSE 프로토콜 기반 도구 역할을 합니다.

마지막으로 MCP 클라이언트를 사용하여 SSE 프로토콜로 MCP SSE 서버에 연결하고 LLM과 상호작용합니다.

### 마이크로서비스

먼저 uv를 사용하여 Python 프로젝트를 생성하고 프로젝트 디렉토리로 이동합니다.

```bash
uv init product-mcp --python 3.13
cd product-mcp
uv add fastapi uvicorn
```

이제 제품 마이크로서비스와 주문 마이크로서비스를 개발하고 API 인터페이스를 노출하겠습니다. 먼저 `Pydantic`을 사용하여 제품, 재고, 주문 유형을 정의합니다. 간단함을 위해 시뮬레이션 데이터를 데이터베이스로 사용하며, 상세 코드는 다음과 같습니다:

```python
# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uvicorn

app = FastAPI()

# Pydantic 모델 정의
class Product(BaseModel):
    id: int
    name: str
    price: float
    description: str

class InventoryItemBase(BaseModel):
    productId: int
    quantity: int

class InventoryItem(InventoryItemBase):
    product: Optional[Product] = None

class OrderItem(BaseModel):
    productId: int
    quantity: int

class OrderBase(BaseModel):
    customerName: str
    items: List[OrderItem]

class Order(OrderBase):
    id: int
    totalAmount: float
    orderDate: str


# 시뮬레이션 데이터 저장
# 제품 목록
products_db: List[Product] = [
    Product(id=1, name="Galaxy 스마트워치", price=1299, description="건강 모니터링, 운동 추적, 다양한 앱 지원"),
    Product(id=2, name="프로 무선 블루투스 이어폰", price=899, description="액티브 노이즈 캔슬링, 30시간 배터리, IPX7 방수"),
    Product(id=3, name="휴대용 보조배터리", price=299, description="20000mAh 대용량, 고속 충전 지원, 슬림 디자인"),
    Product(id=4, name="화웨이 MateBook X Pro", price=1599, description="14.2인치 풀스크린, 3:2 비율, 100% sRGB 색영역"),
]
# 재고 목록
inventory_db: List[InventoryItemBase] = [
    InventoryItemBase(productId=1, quantity=100),
    InventoryItemBase(productId=2, quantity=50),
    InventoryItemBase(productId=3, quantity=200),
    InventoryItemBase(productId=4, quantity=150),
]

orders_db: List[Order] = []

# API 라우트
@app.get("/api/products", response_model=List[Product])
async def get_products() -> List[Product]:
    return products_db


@app.get("/api/inventory", response_model=List[InventoryItem])
async def get_inventory() -> List[InventoryItem]:
    result: List[InventoryItem] = []
    for item_base in inventory_db:
        product = next((p for p in products_db if p.id == item_base.productId), None)
        result.append(InventoryItem(productId=item_base.productId, quantity=item_base.quantity, product=product))
    return result


@app.get("/api/orders", response_model=List[Order])
async def get_orders() -> List[Order]:
    return sorted(orders_db, key=lambda o: o.orderDate, reverse=True)


class PurchaseRequest(BaseModel):
    customerName: str
    items: List[OrderItem]


@app.post("/api/purchase", response_model=Order)
async def create_purchase(request: PurchaseRequest) -> Order:
    customer_name = request.customerName
    items = request.items

    if not customer_name or not items or len(items) == 0:
        raise HTTPException(status_code=400, detail="잘못된 요청: 고객 이름 또는 상품이 누락되었습니다")

    total_amount = 0.0

    # 재고 확인 및 총액 계산
    for item in items:
        inventory_item = next((i for i in inventory_db if i.productId == item.productId), None)
        product = next((p for p in products_db if p.id == item.productId), None)

        if not inventory_item or not product:
            raise HTTPException(status_code=404, detail=f"상품 ID {item.productId}가 존재하지 않습니다")

        if inventory_item.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"{product.name} 상품 재고가 부족합니다. 현재 재고: {inventory_item.quantity}",
            )

        total_amount += product.price * item.quantity

    # 주문 생성
    order_id = len(orders_db) + 1
    order_date = datetime.datetime.now(datetime.timezone.utc).isoformat()

    new_order = Order(
        id=order_id,
        customerName=customer_name,
        items=items,
        totalAmount=total_amount,
        orderDate=order_date,
    )

    # 재고 업데이트
    for item in items:
        inventory_item = next(
            (i for i in inventory_db if i.productId == item.productId), None
        )
        if inventory_item: # 위의 검사로 항상 참
            inventory_item.quantity -= item.quantity

    orders_db.append(new_order)
    return new_order


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

위의 인터페이스 코드는 매우 간단하며, 제품 ID를 기반으로 제품 정보, 재고 정보, 주문 정보를 조회하고 주문 생성 인터페이스를 제공합니다.

이제 `uv`를 사용하여 이 마이크로서비스를 실행하고 `curl`로 테스트해 보겠습니다.

```bash
$ uv run python api.py
INFO:     Started server process [21924]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

그런 다음 `http://127.0.0.1:8000/docs`에서 API 문서를 확인하거나 `http://127.0.0.1:8000/redoc`에서 ReDoc 형식의 API 문서를 볼 수 있습니다.

![api 문서](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749092558487.png)

이제 MCP 도구를 사용하여 이러한 API 인터페이스를 노출할 수 있습니다. 다음으로 MCP Python SDK를 사용하여 MCP 서비스를 개발할 수 있습니다.

```bash
uv add "mcp[cli]"
```

Stdio 타입의 MCP 서비스라면 명령줄에서 직접 이러한 도구를 사용할 수 있지만, 현재는 SSE 타입의 MCP 서비스가 필요하므로 이러한 도구를 노출하기 위해 MCP SSE 서버가 추가로 필요합니다.

### MCP SSE 서버

이제 MCP SSE 서버를 개발하여 제품 마이크로서비스와 주문 마이크로서비스 데이터를 SSE 프로토콜 기반 도구로 노출하겠습니다.

먼저 `FastMCP`를 사용하여 MCP 인스턴스를 생성한 다음, FastAPI 서비스를 호출하기 위한 비동기 클라이언트를 정의합니다. 그런 다음 4개의 도구를 정의합니다:

- `get_products`: 모든 제품 정보 가져오기
- `get_inventory`: 모든 제품의 재고 정보 가져오기
- `get_orders`: 모든 주문 정보 가져오기
- `create_purchase`: 새로운 구매 주문 생성

`mcp.tool`을 직접 사용하여 이러한 도구를 정의할 수 있으며, 상세 코드는 다음과 같습니다:

```python
# main.py
from models import OrderItem
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field
from typing import List
import httpx # FastAPI 서비스 호출을 위한 HTTP 클라이언트

# MCP 인스턴스
mcp = FastMCP(name="제품 MCP 서버", host="0.0.0.0", port=8083)

# FastAPI 서비스 기본 URL
FASTAPI_SERVICE_URL = "http://localhost:8000/api"
# FastAPI 서비스 호출을 위한 비동기 클라이언트 생성
async_client = httpx.AsyncClient(base_url=FASTAPI_SERVICE_URL)

# MCP 도구 정의 (FastAPI 서비스 호출)
@mcp.tool(name="get_products", description="모든 제품 목록을 가져옵니다.")
async def get_products_tool():
    """FastAPI 서비스를 호출하여 모든 제품 목록을 가져옵니다."""
    try:
        response = await async_client.get("/products")
        response.raise_for_status() # HTTP 오류 코드(4xx 또는 5xx)에 대한 예외 발생
        return response.json()
    except httpx.HTTPStatusError as e:
        # 가능한 경우 FastAPI의 오류 메시지 전달 또는 일반 메시지
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"제품 서비스 호출 실패 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"제품 서비스 요청 중 오류 발생: {e}") from e

@mcp.tool(name="get_inventory", description="제품 상세 정보를 포함한 재고 목록을 가져옵니다.")
async def get_inventory_tool():
    """FastAPI 서비스를 호출하여 재고 목록을 가져옵니다."""
    try:
        response = await async_client.get("/inventory")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"재고 서비스 호출 실패 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"재고 서비스 요청 중 오류 발생: {e}") from e

@mcp.tool(name="get_orders", description="날짜 내림차순으로 정렬된 주문 목록을 가져옵니다.")
async def get_orders_tool():
    """FastAPI 서비스를 호출하여 모든 주문 목록을 가져옵니다."""
    try:
        response = await async_client.get("/orders")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"주문 서비스 호출 실패 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"주문 서비스 요청 중 오류 발생: {e}") from e

class CreatePurchaseInput(BaseModel):
    customerName: str = Field(..., description="고객 이름")
    items: List[OrderItem] = Field(..., description="구매할 상품 목록, 각 항목은 productId와 quantity 포함")

@mcp.tool(name="create_purchase", description="새로운 구매 주문을 생성합니다.")
async def create_purchase_tool(input_data: CreatePurchaseInput):
    """FastAPI 서비스를 호출하여 새로운 구매 주문을 생성합니다."""
    try:
        response = await async_client.post("/purchase", json=input_data.model_dump())
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        # MCP 도구가 API의 의미 있는 오류를 표면화하는 것이 중요
        raise Exception(f"구매 주문 생성 실패 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"구매 주문 생성 요청 중 오류 발생: {e}") from e
```

도구 정의가 완료되면 SSE 전송 프로토콜을 통해 이러한 도구를 노출해야 합니다. 가장 간단한 방법은 `run` 메서드에서 `transport="sse"` 매개변수를 지정하는 것이며, 상세 코드는 다음과 같습니다:

```python
# --- MCP 서버 실행 ---
if __name__ == "__main__":
    print("🌤️ 제품 MCP 서버 시작 중...")
    print("📍 지원 기능:")
    print("  - 제품 목록 가져오기 (get_products)")
    print("  - 재고 목록 가져오기 (get_inventory)")
    print("  - 주문 목록 가져오기 (get_orders)")
    print("  - 구매 주문 생성 (create_purchase)")
    print()

    # sse 전송 프로토콜로 MCP 서버 실행
    mcp.run(transport="sse")
```

위에서 `mcp.run(transport="sse")`를 사용하여 MCP 서버를 실행하고 SSE 전송 프로토콜을 사용하여 이러한 도구를 노출하도록 지정했습니다. 또한 `FastMCP`를 인스턴스화할 때 `host`와 `port` 매개변수를 지정했는데, 이는 SSE 전송 프로토콜이 이러한 도구를 노출하기 위해 HTTP 서버가 필요하기 때문입니다. 따라서 여기서는 `0.0.0.0`과 `8083` 포트(기본값 8000)를 사용합니다. 기본적으로 SSE 서버는 `/sse` 엔드포인트에 마운트되며, `http://localhost:8083/sse` 엔드포인트를 통해 SSE 연결을 설정합니다. 실제 클라이언트 메시지를 수신하는 엔드포인트는 `/messages`입니다.

이제 이 MCP 서버를 직접 시작할 수 있습니다:

```bash
$ uv run python main.py
🌤️ 제품 MCP 서버 시작 중...
📍 지원 기능:
  - 제품 목록 가져오기 (get_products)
  - 재고 목록 가져오기 (get_inventory)
  - 주문 목록 가져오기 (get_orders)
  - 구매 주문 생성 (create_purchase)

INFO:     Started server process [77092]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

이제 MCP Inspector를 사용하여 이 MCP 서버를 테스트할 수 있습니다. Transport Type을 SSE로 선택하고 `http://localhost:8083/sse` 엔드포인트를 입력한 다음 `Connect` 버튼을 클릭하면 MCP 서버가 노출한 도구를 볼 수 있습니다.

![mcp inspector](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749105716600.png)

예를 들어 `get_products` 도구를 선택하고 `Run Tool` 버튼을 클릭하면 MCP 서버가 반환하는 제품 목록을 볼 수 있습니다.

### MCP 클라이언트

이제 MCP 클라이언트를 사용하여 MCP SSE 서버에 연결할 수 있습니다. 예를 들어 Cursor에서 테스트할 수 있습니다. Cursor 설정 페이지에서 MCP 탭으로 전환하고 오른쪽 상단의 `+ Add new global MCP Server` 버튼을 클릭한 다음, 리디렉션된 `mcp.json` 파일에 다음 내용을 입력합니다:

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://localhost:8083/sse"
    }
  }
}
```

그런 다음 MCP 페이지로 돌아가면 이 MCP 서비스를 볼 수 있으며, 제공하는 도구도 표시됩니다:

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749105955597.png)

이렇게 하면 Cursor에서 이 MCP 서비스를 사용할 수 있습니다.

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749106197834.png)

물론 비즈니스 시스템에서 MCP 서비스를 사용하려면 직접 MCP 클라이언트를 개발해야 합니다. 예를 들어 MCP 서비스를 통합하는 고객 서비스 시스템을 개발할 수 있습니다.

MCP 클라이언트에 대해서는 이전에 설명했지만, 유일한 차이점은 이제 SSE 프로토콜을 사용하여 MCP SSE 서버에 연결해야 한다는 것입니다.

```typescript
// MCP 클라이언트 생성
const mcpClient = new McpClient({
  name: "mcp-sse-demo",
  version: "1.0.0",
});

// SSE 전송 객체 생성
const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

// MCP 서버에 연결
await mcpClient.connect(transport);
```

다른 작업은 기본적으로 동일하며, 모든 도구를 나열한 다음 사용자의 질문과 도구를 함께 LLM에 보내 처리합니다. LLM이 결과를 반환하면 결과를 기반으로 도구를 호출하고, 호출 결과와 기록 메시지를 함께 LLM에 보내 최종 결과를 얻습니다.

웹 클라이언트의 경우 명령줄 클라이언트와 기본적으로 동일하며, 이러한 처리 과정을 인터페이스에 구현하고 웹 페이지에서 호출하기만 하면 됩니다.

먼저 MCP 클라이언트를 초기화하고 모든 도구를 가져온 다음, 도구 형식을 OpenAI가 요구하는 배열 형식으로 변환하고 OpenAI 클라이언트를 생성합니다. 전체 코드는 다음과 같습니다:

```python
# web.py
import os
import json
import asyncio
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
# MCP/LLM 관련 의존성
from openai import AsyncOpenAI
from mcp.client.sse import sse_client
from mcp.client.session import ClientSession
from mcp.types import Tool, TextContent

# 환경 변수 로드
load_dotenv()

# FastAPI 인스턴스
app = FastAPI()

# CORS 허용 (로컬 프론트엔드 디버깅용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP 구성
MCP_CONFIG_PATH = os.getenv("MCP_CONFIG_PATH", "mcp.json")

# LLM 구성
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

# 도구 캐시
class MCPServerConfig(BaseModel):
    name: str
    url: str
    description: Optional[str] = ""

class MCPToolInfo(BaseModel):
    server: str
    name: str
    description: str
    input_schema: Dict[str, Any]

# 전역 캐시
mcp_servers: Dict[str, MCPServerConfig] = {}
all_tools: List[MCPToolInfo] = []
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

# ------------------ 도구 로딩 ------------------
def load_mcp_config():
    """
    MCP 구성 로드
    """
    global mcp_servers
    try:
        with open(MCP_CONFIG_PATH, 'r', encoding='utf-8') as f:
            config = json.load(f)
        mcp_servers.clear()
        for name, server_config in config.get("mcpServers", {}).items():
            mcp_servers[name] = MCPServerConfig(
                name=name,
                url=server_config["url"],
                description=server_config.get("description", ""),
            )
    except Exception as e:
        raise RuntimeError(f"MCP 구성 로드 실패: {e}")

def tool_to_info(server_name: str, tool: Tool) -> MCPToolInfo:
    """
    MCP 도구를 도구 정보로 변환
    """
    return MCPToolInfo(
        server=server_name,
        name=tool.name,
        description=tool.description or "설명 없음",
        input_schema=tool.inputSchema or {"type": "object", "properties": {}}
    )

async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    MCP 서버에서 도구 가져오기
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]

async def load_all_tools():
    """
    모든 도구 로드
    """
    global all_tools
    all_tools.clear()
    tasks = [get_tools_from_server(name, config) for name, config in mcp_servers.items()]
    results = await asyncio.gather(*tasks)
    for tool_list in results:
        all_tools.extend(tool_list)

# 시작 시 로드
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 실행
    load_mcp_config()
    await load_all_tools()
    yield
    # 종료 시 실행
    pass

app = FastAPI(lifespan=lifespan)

# ------------------ API 데이터 모델 ------------------
class ChatMessage(BaseModel):
    role: str  # user/assistant/tool
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class CallToolRequest(BaseModel):
    server: str
    name: str
    args: Dict[str, Any] = {}

# ------------------ 도구 호출 ------------------
async def call_tool(server_name: str, tool_name: str, arguments: Dict[str, Any]) -> Any:
    config = mcp_servers.get(server_name)
    if not config:
        raise HTTPException(status_code=404, detail=f"서버 {server_name}이(가) 존재하지 않습니다")
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool(tool_name, arguments)
            return result

def extract_text_content(content_list: List[Any]) -> str:
    text_parts: List[str] = []
    for content in content_list:
        if isinstance(content, TextContent):
            text_parts.append(content.text)
        elif hasattr(content, 'text'):
            text_parts.append(str(content.text))
        else:
            text_parts.append(str(content))
    return "\n".join(text_parts) if text_parts else "✅ 작업 완료, 하지만 반환된 텍스트 내용 없음"

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# 정적 파일 디렉토리 마운트
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/")
async def index():
    return FileResponse("public/index.html")

# ------------------ API 구현 ------------------
@app.get("/api/tools")
async def api_tools():
    return {"tools": [t.model_dump() for t in all_tools]}

@app.post("/api/call-tool")
async def api_call_tool(req: CallToolRequest):
    result = await call_tool(req.server, req.name, req.args)
    # MCP 반환 구조 호환성 처리
    if hasattr(result, 'content'):
        content = extract_text_content(result.content)
    else:
        content = str(result)
    return {"result": content}

@app.post("/api/chat")
async def api_chat(req: ChatRequest):
    # LLM 메시지 기록 구축, 첫 번째는 system
    messages = [
        {"role": "system", "content": "당신은 다양한 MCP 도구를 사용하여 사용자의 작업을 돕는 지능형 어시스턴트입니다. 도구가 필요하지 않으면 직접 답변을 반환하세요."}
    ]
    if req.history:
        for m in req.history:
            messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": req.message})

    # tools 목록 구축
    openai_tools = []
    for t in all_tools:
        openai_tools.append({
            "type": "function",
            "function": {
                "name": f"{t.server}_{t.name}",
                "description": f"[{t.server}] {t.description}",
                "parameters": t.input_schema
            }
        })

    # 첫 번째 LLM 호출
    kwargs = {
        "model": LLM_MODEL,
        "messages": messages,
        "temperature": 0.7
    }
    if openai_tools:
        kwargs["tools"] = openai_tools
        kwargs["tool_choice"] = "auto"
    try:
        response = await openai_client.chat.completions.create(**kwargs)
        message = response.choices[0].message
        toolCalls = []
        # 도구 호출
        if hasattr(message, 'tool_calls') and message.tool_calls:
            # 1. tool_calls를 어시스턴트 메시지로 기록에 추가
            messages.append({
                "role": "assistant",
                "content": message.content,
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    } for tc in message.tool_calls
                ]  # openai 형식으로 변환
            })
            # 2. 순서대로 도구 호출, 결과를 tool 메시지로 기록에 추가
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                # server/tool 분석
                parts = function_name.split('_', 1)
                if len(parts) == 2:
                    server_name, tool_name = parts
                else:
                    server_name, tool_name = all_tools[0].server, function_name
                try:
                    result = await call_tool(server_name, tool_name, arguments)
                    content = extract_text_content(result.content)
                    toolCalls.append({
                        "name": tool_name,
                        "result": content,
                        "tool_call_id": tool_call.id
                    })
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": content
                    })
                except Exception as e:
                    toolCalls.append({
                        "name": function_name,
                        "error": str(e),
                        "tool_call_id": tool_call.id
                    })
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": f"오류: {str(e)}"
                    })
            # 3. 다시 LLM 호출하여 최종 응답 생성
            final_response = await openai_client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                temperature=0.7
            )
            final_content = final_response.choices[0].message.content
            return {"response": final_content, "toolCalls": toolCalls}
        else:
            return {"response": message.content, "toolCalls": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM/대화 처리 실패: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
```

위 코드에서는 마찬가지로 `mcp.json` 파일을 읽어 MCP 서버를 구성한 다음, SDK에서 제공하는 `sse_client`를 사용하여 SSE 클라이언트를 생성하고, `ClientSession`을 통해 클라이언트 세션을 생성합니다. 그런 다음 `session.list_tools`를 사용하여 MCP 서버가 노출하는 도구를 가져오고, 마지막으로 `tool_to_info`를 사용하여 MCP 도구를 도구 정보로 변환합니다.

```python
async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    MCP 서버에서 도구 가져오기
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]
```

이렇게 하면 구성된 모든 SSE 타입의 MCP 서버가 제공하는 모든 Tools 도구를 가져올 수 있습니다. 여기서 우리는 `FastAPI`를 사용하여 웹 서비스를 생성했으며, `lifespan`을 사용하여 MCP 서버의 수명 주기를 관리할 수 있습니다. 즉, 시작 시 MCP 서버를 로드하고 종료 시 MCP 서버를 닫습니다.

```python
# 시작 시 로드
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 실행
    load_mcp_config()
    await load_all_tools()
    yield
    # 종료 시 실행
    pass

app = FastAPI(lifespan=lifespan)
```

그런 다음 프론트엔드 페이지의 요구에 따라 모든 도구 가져오기, 도구 호출, 메시지 전송과 같은 인터페이스를 구현합니다. 가장 중요한 것은 `api/chat` 인터페이스로, 사용자가 보낸 메시지를 처리하는 데 사용됩니다. 사용자의 입력과 MCP 도구 목록을 함께 LLM에 보내 처리하고, LLM이 결과를 반환하면 결과를 기반으로 도구를 호출하고, 호출 결과와 기록 메시지를 함께 LLM에 보내 최종 결과를 얻습니다.

마지막으로 이 웹 서비스를 직접 실행하면 `http://localhost:8002`에서 액세스할 수 있으며, 웹 페이지에서 MCP 서비스를 사용할 수 있습니다.

```bash
$ uv run python web.py
```

페이지 오른쪽에는 사용 가능한 모든 도구가 나열됩니다. 채팅 인터페이스에 질문을 입력하면, 대형 모델이 도구 사용이 필요하다고 판단하면 도구를 호출하고 호출 결과를 반환합니다. 그런 다음 도구 호출 결과를 기반으로 다시 도구를 호출하여 최종 결과를 얻을 때까지 반복합니다. 프론트엔드 페이지에도 도구 호출 결과가 표시됩니다:

![MCP WEB](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749110324295.png)

여기까지 웹 기반 SSE 타입의 MCP 서버와 클라이언트 개발을 구현했습니다. 이 예제를 통해 MCP 서비스를 사용하면 비즈니스 시스템에 다양한 도구를 매우 편리하게 통합하여 더 지능적인 비즈니스 시스템을 구현할 수 있음을 알 수 있습니다.

## Streamable HTTP 모드

MCP는 2025-03-26 버전에 Streamable HTTP 전송 메커니즘을 공식 출시했습니다. 이 메커니즘은 HTTP와 Server-Sent Events(SSE) 기술을 결합하여 현대 분산 시스템에 유연한 양방향 통신 기능을 제공하며, 기존 SSE 프로토콜의 중요한 혁신으로서 Streamable HTTP가 미래 표준이 될 것입니다.

### 기존 HTTP+SSE 전송 메커니즘과 그 한계

![HTTP+SSE 전송 메커니즘](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749111379973.png)

기존 MCP 구현에서 클라이언트와 서버는 두 가지 주요 채널을 통해 통신했습니다:

- **HTTP 요청/응답**: 클라이언트는 표준 HTTP 요청을 통해 서버에 메시지를 보냅니다.
- **서버 전송 이벤트(SSE)**: 서버는 전용 `/sse` 엔드포인트를 통해 클라이언트에 메시지를 푸시합니다.

### 주요 문제점

이 설계는 간단하고 직관적이지만 몇 가지 중요한 문제가 있습니다:

**연결 끊김 재연결/복구 미지원**

SSE 연결이 끊어지면 모든 세션 상태가 손실되며, 클라이언트는 연결을 다시 설정하고 전체 세션을 초기화해야 합니다. 예를 들어, 대용량 문서 분석과 같은 작업은 불안정한 WiFi로 인해 완전히 중단되어 사용자가 전체 과정을 다시 시작해야 합니다.

**서버의 긴 연결 유지 필요**

서버는 각 클라이언트에 대해 장시간 SSE 연결을 유지해야 하므로, 많은 동시 사용자는 리소스 소비를 급증시킵니다. 서버 재시작이나 확장이 필요할 때 모든 연결이 중단되어 사용자 경험과 시스템 신뢰성에 영향을 미칩니다.

**서버 메시지는 SSE를 통해서만 전달 가능**

간단한 요청-응답 상호 작용이라도 서버는 SSE 채널을 통해 정보를 반환해야 하므로 불필요한 복잡성과 오버헤드가 발생합니다. 일부 환경(예: 클라우드 함수)은 장시간 SSE 연결을 유지하기에 적합하지 않습니다.

**인프라 호환성 제한**

CDN, 로드 밸런서, API 게이트웨이와 같은 많은 기존 웹 인프라는 장시간 SSE 연결을 제대로 처리하지 못할 수 있으며, 기업 방화벽은 시간 초과 연결을 강제로 닫아 서비스 신뢰성을 떨어뜨릴 수 있습니다.

### Streamable HTTP: 설계 및 원리

Streamable HTTP의 설계는 다음과 같은 핵심 개념을 기반으로 합니다:

- **최대 호환성**: 기존 HTTP 생태계와 원활하게 통합
- **유연성**: 상태 비저장 및 상태 저장 모드 동시 지원
- **리소스 효율성**: 필요에 따라 리소스를 할당하여 불필요한 긴 연결 방지
- **신뢰성**: 연결 끊김 재연결 및 세션 복구 지원

#### 주요 개선 사항

기존 메커니즘에 비해 Streamable HTTP는 몇 가지 중요한 개선 사항을 도입했습니다:

1. **통합 엔드포인트**: 전용 `/sse` 엔드포인트를 제거하고 모든 통신을 단일 엔드포인트(예: `/message`)를 통해 수행합니다.
2. **필요에 따른 스트리밍 전송**: 서버는 일반 HTTP 응답을 반환할지 SSE 스트림으로 업그레이드할지 유연하게 선택할 수 있습니다.
3. **세션 식별**: 세션 ID 메커니즘을 도입하여 상태 관리 및 복구를 지원합니다.
4. **유연한 초기화**: 클라이언트는 빈 GET 요청을 통해 SSE 스트림을 능동적으로 초기화할 수 있습니다.

#### 기술 세부 정보

Streamable HTTP의 작업 흐름은 다음과 같습니다:

1. **세션 초기화**:

   - 클라이언트가 `/message` 엔드포인트로 초기화 요청을 보냅니다.
   - 서버는 세션 ID를 생성하여 클라이언트에 반환할 수 있습니다.
   - 세션 ID는 후속 요청에서 세션을 식별하는 데 사용됩니다.

2. **클라이언트에서 서버로의 통신**:

   - 모든 메시지는 HTTP POST 요청을 통해 `/message` 엔드포인트로 전송됩니다.
   - 세션 ID가 있는 경우 요청에 포함됩니다.

3. **서버 응답 방식**:

   - **일반 응답**: 간단한 상호 작용에 적합한 직접적인 HTTP 응답을 반환합니다.
   - **스트리밍 응답**: 연결을 SSE로 업그레이드하고 일련의 이벤트를 보낸 후 닫습니다.
   - **긴 연결**: SSE 연결을 유지하여 지속적으로 이벤트를 보냅니다.

4. **능동적인 SSE 스트림 설정**:

   - 클라이언트는 GET 요청을 `/message` 엔드포인트로 보내 SSE 스트림을 능동적으로 설정할 수 있습니다.
   - 서버는 이 스트림을 통해 알림이나 요청을 푸시할 수 있습니다.

5. **연결 복구**:

   - 연결이 중단되면 클라이언트는 이전 세션 ID를 사용하여 다시 연결할 수 있습니다.
   - 서버는 세션 상태를 복구하여 이전 상호 작용을 계속할 수 있습니다.

### 실제 적용 시나리오

#### 상태 비저장 서버 모드

**시나리오**: 수학 계산, 텍스트 처리 등과 같은 간단한 도구 API 서비스.

**구현**:

```bash
클라이언트                                 서버
   |                                    |
   |-- POST /message (계산 요청) -------->|
   |                                    |-- 계산 실행
   |<------- HTTP 200 (계산 결과) -------|
   |                                    |
```

**장점**: 최소한의 배포, 상태 관리 불필요, 서버리스 아키텍처 및 마이크로서비스에 적합합니다.

#### 스트리밍 진행률 피드백 모드

**시나리오**: 대용량 파일 처리, 복잡한 AI 생성 등과 같은 장기 실행 작업.

**구현**:

```bash
클라이언트                                 서버
   |                                    |
   |-- POST /message (처리 요청) -------->|
   |                                    |-- 처리 작업 시작
   |<------- HTTP 200 (SSE 시작) --------|
   |                                    |
   |<------- SSE: 진행률 10% ---------------|
   |<------- SSE: 진행률 30% ---------------|
   |<------- SSE: 진행률 70% ---------------|
   |<------- SSE: 완료 + 결과 ------------|
   |                                    |
```

**장점**: 실시간 피드백을 제공하지만 영구적인 연결 상태를 유지할 필요가 없습니다.

#### 복잡한 AI 세션 모드

**시나리오**: 컨텍스트를 유지해야 하는 다중 턴 대화형 AI 어시스턴트.

**구현**:

```bash
클라이언트                                 서버
   |                                    |
   |-- POST /message (초기화) ---------->|
   |<-- HTTP 200 (세션 ID: abc123) ------|
   |                                    |
   |-- GET /message (세션 ID: abc123) --->|
   |<------- SSE 스트림 설정 -----------------|
   |                                    |
   |-- POST /message (질문 1, abc123) --->|
   |<------- SSE: 생각 중... -------------|
   |<------- SSE: 답변 1 ----------------|
   |                                    |
   |-- POST /message (질문 2, abc123) --->|
   |<------- SSE: 생각 중... -------------|
   |<------- SSE: 답변 2 ----------------|
```

**장점**: 세션 컨텍스트를 유지하고 복잡한 상호 작용을 지원하며 수평 확장이 가능합니다.

#### 연결 끊김 복구 모드

**시나리오**: 불안정한 네트워크 환경에서의 AI 애플리케이션 사용.

**구현**:

```bash
클라이언트                                 서버
   |                                    |
   |-- POST /message (초기화) ---------->|
   |<-- HTTP 200 (세션 ID: xyz789) ------|
   |                                    |
   |-- GET /message (세션 ID: xyz789) --->|
   |<------- SSE 스트림 설정 -----------------|
   |<------- SSE: 진행률 30% ---------------|
   |-- POST /message (긴 작업, xyz789) -->|
   |<------- SSE: 진행률 60% ---------------|
   |                                    |
   |     [네트워크 중단]                      |
   |                                    |
   |-- GET /message (세션 ID: xyz789) --->|
   |<------- SSE 스트림 재설정 --------------|
   |<------- SSE: 진행률 60% ---------------|
   |<------- SSE: 완료 ------------------|
```

**장점**: 약한 네트워크 환경에서 신뢰성을 높이고 사용자 경험을 개선합니다.

### Streamable HTTP의 주요 장점

#### 기술적 장점

1. **간소화된 구현**: 특수 지원 없이 일반 HTTP 서버에서 구현할 수 있습니다.
2. **리소스 효율성**: 필요에 따라 리소스를 할당하므로 각 클라이언트에 대해 긴 연결을 유지할 필요가 없습니다.
3. **인프라 호환성**: 기존 웹 인프라(CDN, 로드 밸런서, API 게이트웨이)와 잘 작동합니다.
4. **수평 확장**: 메시지 버스를 통해 요청을 다른 서버 노드로 라우팅하는 것을 지원합니다.
5. **점진적 채택**: 서비스 제공자는 요구에 따라 구현 복잡성을 선택할 수 있습니다.
6. **연결 끊김 재연결**: 세션 복구를 지원하여 신뢰성을 높입니다.

#### 비즈니스 장점

1. **운영 비용 절감**: 서버 리소스 소비를 줄이고 배포 아키텍처를 간소화합니다.
2. **사용자 경험 향상**: 실시간 피드백과 안정적인 연결을 통해 경험을 개선합니다.
3. **광범위한 적용성**: 간단한 도구부터 복잡한 AI 상호 작용까지 적절한 구현 방법을 찾을 수 있습니다.
4. **확장성**: 더 다양한 AI 애플리케이션 시나리오를 지원합니다.
5. **개발자 친화적**: MCP 구현의 기술적 장벽을 낮춥니다.

### 구현 참조

#### 서버 측 구현 요점

1. **엔드포인트 설계**:

   - 모든 요청을 처리하는 단일 `/message` 엔드포인트를 구현합니다.
   - POST 및 GET HTTP 메서드를 모두 지원합니다.

2. **상태 관리**:

   - 세션 ID 생성 및 검증 메커니즘을 설계합니다.
   - 세션 상태 저장(메모리, Redis 등)을 구현합니다.

3. **요청 처리**:

   - 요청의 세션 ID를 구문 분석합니다.
   - 응답 유형(일반 HTTP 또는 SSE)을 결정합니다.
   - 스트리밍 응답의 콘텐츠 유형과 형식을 처리합니다.

4. **연결 관리**:

   - SSE 스트림 초기화 및 유지를 구현합니다.
   - 연결 끊김 및 재연결 로직을 처리합니다.

#### 클라이언트 측 구현 요점

1. **요청 구성**:

   - 프로토콜에 맞는 메시지 형식을 구성합니다.
   - 세션 ID를 올바르게 포함합니다(있는 경우).

2. **응답 처리**:

   - 응답이 일반 HTTP인지 SSE인지 감지합니다.
   - SSE 이벤트를 구문 분석하고 처리합니다.

3. **세션 관리**:

   - 세션 ID를 저장하고 관리합니다.
   - 연결 끊김 재연결 로직을 구현합니다.

4. **오류 처리**:

   - 네트워크 오류 및 시간 초과를 처리합니다.
   - 지수 백오프 재시도 전략을 구현합니다.

### 요약

Streamable HTTP 전송 계층은 MCP 프로토콜의 중요한 진화를 나타냅니다. HTTP와 SSE의 장점을 결합하고 단점을 극복함으로써 AI 애플리케이션 통신에 더 유연하고 신뢰할 수 있는 솔루션을 제공합니다. 기존 전송 메커니즘의 문제를 해결할 뿐만 아니라 미래의 더 복잡한 AI 상호 작용 모드를 위한 기반을 마련합니다.

이 프로토콜의 설계는 실용성 원칙을 충분히 반영하여 기술적 진보 요구 사항을 충족하면서 기존 웹 인프라와의 호환성을 유지합니다. 유연성 덕분에 개발자는 자신의 요구에 가장 적합한 구현 방식을 선택할 수 있으며, 간단한 상태 비저장 API부터 복잡한 대화형 AI 애플리케이션까지 적절한 솔루션을 찾을 수 있습니다.

### Python SDK 구현 참조

이제 MCP Python SDK는 Streamable HTTP 프로토콜 모드를 지원하며, 기본적으로 `/mcp` 엔드포인트를 사용합니다.

`transport` 매개변수를 `streamable-http`로 설정하고 `host`와 `port` 매개변수로 서버 주소와 포트를 지정하며 `path` 매개변수로 기본 엔드포인트 경로를 덮어쓸 수 있습니다. 다음과 같습니다:

```python
from fastmcp import FastMCP

mcp = FastMCP("데모 🚀", host="0.0.0.0", port=8083)

@mcp.tool()
def add(a: int, b: int) -> int:
    """두 숫자 더하기"""
    return a + b

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

위의 몇 줄 코드로 Streamable HTTP 타입의 MCP 서버를 구현할 수 있습니다.

이전의 SSE 타입 MCP 서버를 Streamable HTTP 타입으로 변경하려면 `transport` 매개변수를 `streamable-http`로 설정하기만 하면 됩니다:

```bash
$ python main.py
🌤️ 제품 MCP 서버 시작 중...
📍 지원 기능:
  - 제품 목록 가져오기 (get_products)
  - 재고 목록 가져오기 (get_inventory)
  - 주문 목록 가져오기 (get_orders)
  - 구매 주문 생성 (create_purchase)

INFO:     Started server process [26897]
INFO:     Waiting for application startup.
[06/05/25 16:39:19] INFO     StreamableHTTP 세션 관리자 시작됨  streamable_http_manager.py:109
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

그런 다음 `http://localhost:8083/mcp`를 통해 이 MCP 서버에 액세스할 수 있습니다. 예를 들어 Cursor에서 구성할 수 있습니다:

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://localhost:8083/mcp"
    }
  }
}
```

이제 Cursor에서 이 MCP 서버를 사용할 수 있습니다.

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749112893794.png)

이제 Cursor에서 이 MCP 서버를 사용할 수 있습니다. 다음과 같습니다:

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749113099093.png)

클라이언트에서도 Streamable HTTP 모드를 사용하여 연결할 수 있습니다. 다음과 같습니다:

```python
import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession


async def main():
    # streamable HTTP 서버에 연결
    async with streamablehttp_client("http://localhost:8083/mcp") as (
        read_stream,
        write_stream,
        _,
    ):
        # 세션 생성
        async with ClientSession(read_stream, write_stream) as session:
            # 세션 초기화
            await session.initialize()
            # 도구 호출
            tool_result = await session.call_tool("get_products", {})
            print(tool_result)

if __name__ == "__main__":
    asyncio.run(main())
```

마찬가지로 SDK에서 제공하는 `streamablehttp_client`를 사용하여 Streamable HTTP 클라이언트를 생성하고, `ClientSession`을 통해 클라이언트 세션을 생성하며, `session.initialize`로 세션을 초기화하고, `session.call_tool`로 도구를 호출합니다. 전체 프로세스는 `stdio` 및 `sse` 모드와 기본적으로 동일합니다.

Streamable HTTP 모드는 SSE 모드보다 웹 애플리케이션에 더 적합합니다. Streamable HTTP 모드는 연결 끊김 재연결, 세션 복구 등 웹 애플리케이션의 특성을 더 잘 지원하며 대규모 동시 요청을 지원할 수 있습니다. (이전 웹 애플리케이션을 Streamable HTTP 모드로 변경해 보세요.)
