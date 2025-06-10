---
title: MCP Python SDK 深度應用
description: 使用 MCP Python SDK 實作 SSE 與 Streamable HTTP 協定，並透過 MCP Inspector 測試 MCP 伺服器
section: base-dev
prev: mcp-py-sdk-basic
next: mcp-authorization
pubDate: 2025-06-10
order: 8
---

# MCP Python SDK 深度應用

前面我們深入瞭解了 MCP 的基礎知識，包括其架構、協定和應用場景。也透過一個簡單的例子，瞭解了如何開發 MCP 服務和 MCP 客戶端，但我們只學習了 stdio 模式的 MCP 服務和客戶端，在實際應用中，我們還需要考慮如何將 MCP 服務部署到雲端，所以更多的時候需要用到 SSE 和 Streamable HTTP 協定。

## SSE 模式

SSE 模式是 MCP 服務和客戶端之間的一種通訊方式，它使用 Server-Sent Events（SSE）協定來傳輸資料。接下來我們將為大家開發一個基於 MCP 的智能商城服務助手，使用 SSE 類型的 MCP 服務，具備以下核心功能：

- 即時存取產品資訊和庫存水平，支援客製化訂單。
- 根據客戶偏好和可用庫存推薦產品。
- 使用 MCP 工具伺服器與微服務進行即時互動。
- 在回答產品詢問時檢查即時庫存水平。
- 使用產品 ID 和數量促進產品購買。
- 即時更新庫存水平。
- 透過自然語言查詢提供訂單交易的臨時分析。

![智能商城助手](https://picdn.youdianzhishi.com/images/1749089781344.png)

這裡我們可以採用微服務的架構，首先需要一個產品微服務，用於暴露一個產品列表的 API 介面。然後再提供一個訂單微服務，用於暴露一個訂單建立、庫存資訊等 API 介面。

接下來的核心就是核心的 MCP SSE 伺服器，用於向 LLM 暴露產品微服務和訂單微服務資料，作為使用 SSE 協定的工具。

最後就是使用 MCP 客戶端，透過 SSE 協定連接到 MCP SSE 伺服器，並使用 LLM 進行互動。

### 微服務

首先使用 uv 建立一個 Python 專案，並进入專案目錄。

```bash
uv init product-mcp --python 3.13
cd product-mcp
uv add fastapi uvicorn
```

接下來我們開始開發產品微服務和訂單微服務，並暴露 API 介面。首先可以使用 `Pydantic` 定義產品、庫存和訂單的類型，為了簡單起見，這裡我們直接用模擬資料來充當資料庫，詳細程式碼如下所示：

```python
# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uvicorn

app = FastAPI()

# Pydantic 模型定義
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


# 模擬資料儲存
# 產品列表
products_db: List[Product] = [
    Product(id=1, name="智能手錶Galaxy", price=1299, description="健康監測，運動追蹤，支援多種應用"),
    Product(id=2, name="無線藍牙耳機Pro", price=899, description="主動降噪，30小時續航，IPX7防水"),
    Product(id=3, name="便攜式行動電源", price=299, description="20000mAh大容量，支援快充，輕薄設計"),
    Product(id=4, name="華為MateBook X Pro", price=1599, description="14.2吋全面屏，3:2比例，100% sRGB色域"),
]
# 庫存列表
inventory_db: List[InventoryItemBase] = [
    InventoryItemBase(productId=1, quantity=100),
    InventoryItemBase(productId=2, quantity=50),
    InventoryItemBase(productId=3, quantity=200),
    InventoryItemBase(productId=4, quantity=150),
]

orders_db: List[Order] = []

# API 路由
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
        raise HTTPException(status_code=400, detail="請求無效：缺少客戶名稱或商品")

    total_amount = 0.0

    # 驗證庫存並計算總價
    for item in items:
        inventory_item = next((i for i in inventory_db if i.productId == item.productId), None)
        product = next((p for p in products_db if p.id == item.productId), None)

        if not inventory_item or not product:
            raise HTTPException(status_code=404, detail=f"商品ID {item.productId} 不存在")

        if inventory_item.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"商品 {product.name} 庫存不足. 可用: {inventory_item.quantity}",
            )

        total_amount += product.price * item.quantity

    # 建立訂單
    order_id = len(orders_db) + 1
    order_date = datetime.datetime.now(datetime.timezone.utc).isoformat()

    new_order = Order(
        id=order_id,
        customerName=customer_name,
        items=items,
        totalAmount=total_amount,
        orderDate=order_date,
    )

    # 更新庫存
    for item in items:
        inventory_item = next(
            (i for i in inventory_db if i.productId == item.productId), None
        )
        if inventory_item: # Should always be true due to checks above
            inventory_item.quantity -= item.quantity

    orders_db.append(new_order)
    return new_order


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

上面的介面程式碼非常簡單，就是根據產品 ID 查詢產品資訊、庫存資訊和訂單資訊，並提供一個建立訂單的介面。

接下來我們使用 `uv` 運行這個微服務，並使用 `curl` 測試一下。

```bash
$ uv run python api.py
INFO:     Started server process [21924]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

然後我們可以透過 `http://127.0.0.1:8000/docs` 查看 API 文件，也可以透過 `http://127.0.0.1:8000/redoc` 查看 API 文件的 ReDoc 格式。

![api docs](https://picdn.youdianzhishi.com/images/1749092558487.png)

然後我們就可以透過 MCP 的工具來將這些 API 介面暴露出去，接下來我們可以使用 MCP Python SDK 來開發 MCP 服務。

```bash
uv add "mcp[cli]"
```

如果是 Stdio 類型的 MCP 服務，那麼我們就可以直接在命令列中使用這些工具了，但是我們現在需要使用 SSE 類型的 MCP 服務，所以我們還需要一個 MCP SSE 伺服器來暴露這些工具。

### MCP SSE 伺服器

接下來我們開始開發 MCP SSE 伺服器，用於暴露產品微服務和訂單微服務資料，作為使用 SSE 協定的工具。

首先我們使用 `FastMCP` 建立一個 MCP 實例，然後定義一個非同步客戶端，用於呼叫 FastAPI 服務。然後定義 4 個工具，分別是：

- `get_products`：取得所有產品資訊
- `get_inventory`：取得所有產品的庫存資訊
- `get_orders`：取得所有訂單資訊
- `create_purchase`：建立新的採購訂單

我們可以直接透過 `mcp.tool` 來定義這些工具，詳細程式碼如下所示：

```python
# main.py
from models import OrderItem
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field
from typing import List
import httpx # HTTP client for calling FastAPI service

# MCP 實例
mcp = FastMCP(name="Product MCP Server", host="0.0.0.0", port=8083)

# FastAPI 服務基礎 URL
FASTAPI_SERVICE_URL = "http://localhost:8000/api"
# 建立一個非同步客戶端，用於呼叫 FastAPI 服務
async_client = httpx.AsyncClient(base_url=FASTAPI_SERVICE_URL)

# MCP 工具定義 (呼叫 FastAPI 服務)
@mcp.tool(name="get_products", description="取得所有產品列表。")
async def get_products_tool():
    """透過呼叫FastAPI服務取得所有產品的列表。"""
    try:
        response = await async_client.get("/products")
        response.raise_for_status() # Raise an exception for HTTP error codes (4xx or 5xx)
        return response.json()
    except httpx.HTTPStatusError as e:
        # Forward FastAPI's error message if possible, or a generic one
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"呼叫產品服務失敗 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"請求產品服務時出錯: {e}") from e

@mcp.tool(name="get_inventory", description="取得庫存列表，包含產品詳細資訊。")
async def get_inventory_tool():
    """透過呼叫FastAPI服務取得庫存列表。"""
    try:
        response = await async_client.get("/inventory")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"呼叫庫存服務失敗 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"請求庫存服務時出錯: {e}") from e

@mcp.tool(name="get_orders", description="取得訂單列表，按日期降序排序。")
async def get_orders_tool():
    """透過呼叫FastAPI服務取得所有訂單的列表。"""
    try:
        response = await async_client.get("/orders")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"呼叫訂單服務失敗 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"請求訂單服務時出錯: {e}") from e

class CreatePurchaseInput(BaseModel):
    customerName: str = Field(..., description="客戶名稱")
    items: List[OrderItem] = Field(..., description="購買的商品列表，每個條目包含 productId 和 quantity")

@mcp.tool(name="create_purchase", description="建立新的採購訂單。")
async def create_purchase_tool(input_data: CreatePurchaseInput):
    """透過呼叫FastAPI服務建立新的採購訂單。"""
    try:
        response = await async_client.post("/purchase", json=input_data.model_dump())
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        # It's important that the MCP tool surfaces meaningful errors from the API
        raise Exception(f"建立採購訂單失敗 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"請求建立採購訂單時出錯: {e}") from e
```

工具定義完成後，接下來我們需要透過 SSE 傳輸協定來暴露這些工具，最簡單的方式就是在 `run` 方法中指定 `transport="sse"` 參數，詳細程式碼如下所示：

```python

# --- 運行 MCP 伺服器 ---
if __name__ == "__main__":
    print("🌤️ 啟動產品 MCP 伺服器...")
    print("📍 支援的功能:")
    print("  - 取得產品列表 (get_products)")
    print("  - 取得庫存列表 (get_inventory)")
    print("  - 取得訂單列表 (get_orders)")
    print("  - 建立採購訂單 (create_purchase)")
    print()

    # 使用 sse 傳輸協定運行 MCP 伺服器
    mcp.run(transport="sse")
```

上面我們透過 `mcp.run(transport="sse")` 來運行 MCP 伺服器，並指定使用 SSE 傳輸協定暴露這些工具。另外需要注意的是我們在實例化 `FastMCP` 時，指定了 `host` 和 `port` 參數，這是因為 SSE 傳輸協定需要一個 HTTP 伺服器來暴露這些工具，所以這裡我們使用 `0.0.0.0` 和 `8083` 端口（預設為 8000），預設情況下，SSE 伺服器掛載在 `/sse` 端點，也就是透過 `http://localhost:8083/sse` 端點來建立 SSE 連接，然後真正接收客戶端消息的端點是 `/messages`。

同樣現在我們可以直接啟動這個 MCP 伺服器：

```bash
$ uv run python main.py
🌤️ 啟動產品 MCP 伺服器...
📍 支援的功能:
  - 取得產品列表 (get_products)
  - 取得庫存列表 (get_inventory)
  - 取得訂單列表 (get_orders)
  - 建立採購訂單 (create_purchase)

INFO:     Started server process [77092]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

同樣現在我們可以使用 MCP Inspector 來測試這個 MCP 伺服器，選中 Transport Type 為 SSE，然後輸入 `http://localhost:8083/sse` 端點，然後點擊 `Connect` 按鈕，就可以看到 MCP 伺服器暴露的工具了。

![mcp inspector](https://picdn.youdianzhishi.com/images/1749105716600.png)

比如我們可以選擇 `get_products` 工具，然後點擊 `Run Tool` 按鈕，就可以看到 MCP 伺服器返回的產品列表。

### MCP 客戶端

接下來我們就可以使用 MCP 客戶端來連接到 MCP SSE 伺服器，比如我們可以在 Cursor 中來進行測試，在 Cursor 設定頁面，切換到 MCP 選項卡，點擊右上角的 `+ Add new global MCP Server` 按鈕，然後在跳轉的 `mcp.json` 檔案中，輸入以下內容：

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://localhost:8083/sse"
    }
  }
}
```

然後回到 MCP 頁面就可以看到這個 MCP 服務了，並且將其提供的 Tools 也顯示出來了：

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749105955597.png)

這樣我們就可以在 Cursor 中來使用這個 MCP 服務了。

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749106197834.png)

當然如果我們要自己在業務系統中使用 MCP 服務，那麼就需要我們自己來開發一個 MCP 客戶端了，比如我們可以開發一個客服系統，來整合 MCP 服務。

對於 MCP 客戶端前面我們已經介紹過了，唯一不同的是現在我們需要使用 SSE 協定來連接到 MCP SSE 伺服器。

```typescript
// 建立MCP客戶端
const mcpClient = new McpClient({
  name: "mcp-sse-demo",
  version: "1.0.0",
});

// 建立SSE傳輸物件
const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

// 連接到MCP伺服器
await mcpClient.connect(transport);
```

然後其他操作也基本一致，也就是列出所有工具，然後將使用者的問題和工具一起發給 LLM 進行處理。LLM 返回結果後，我們再根據結果來呼叫工具，將呼叫工具結果和歷史消息一起發給 LLM 進行處理，得到最終結果。

對於 Web 客戶端的話，和命令列用戶端也基本一致，只是需要我們將這些處理過程放到一些介面裡面去實作，然後透過 Web 頁面來呼叫這些介面即可。

我們首先要初始化 MCP 客戶端，然後取得所有工具，並轉換工具格式為 OpenAI 所需的陣列形式，然後建立 OpenAI 客戶端，完整程式碼如下所示：

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
# MCP/LLM 相關依賴
from openai import AsyncOpenAI
from mcp.client.sse import sse_client
from mcp.client.session import ClientSession
from mcp.types import Tool, TextContent

# 載入環境變數
load_dotenv()

# FastAPI 實例
app = FastAPI()

# 允許跨域（方便本地前端調試）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP 設定
MCP_CONFIG_PATH = os.getenv("MCP_CONFIG_PATH", "mcp.json")

# LLM 設定
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

# 工具快取
class MCPServerConfig(BaseModel):
    name: str
    url: str
    description: Optional[str] = ""

class MCPToolInfo(BaseModel):
    server: str
    name: str
    description: str
    input_schema: Dict[str, Any]

# 全域快取
mcp_servers: Dict[str, MCPServerConfig] = {}
all_tools: List[MCPToolInfo] = []
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

# ------------------ 工具載入 ------------------
def load_mcp_config():
    """
    載入 MCP 設定
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
        raise RuntimeError(f"載入 MCP 設定失敗: {e}")

def tool_to_info(server_name: str, tool: Tool) -> MCPToolInfo:
    """
    將 MCP 工具轉換為工具資訊
    """
    return MCPToolInfo(
        server=server_name,
        name=tool.name,
        description=tool.description or "無描述",
        input_schema=tool.inputSchema or {"type": "object", "properties": {}}
    )

async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    從 MCP 伺服器取得工具
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]

async def load_all_tools():
    """
    載入所有工具
    """
    global all_tools
    all_tools.clear()
    tasks = [get_tools_from_server(name, config) for name, config in mcp_servers.items()]
    results = await asyncio.gather(*tasks)
    for tool_list in results:
        all_tools.extend(tool_list)

# 啟動時載入
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時執行
    load_mcp_config()
    await load_all_tools()
    yield
    # 關閉時執行
    pass

app = FastAPI(lifespan=lifespan)

# ------------------ API 資料模型 ------------------
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

# ------------------ 工具呼叫 ------------------
async def call_tool(server_name: str, tool_name: str, arguments: Dict[str, Any]) -> Any:
    config = mcp_servers.get(server_name)
    if not config:
        raise HTTPException(status_code=404, detail=f"伺服器 {server_name} 不存在")
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
    return "\n".join(text_parts) if text_parts else "✅ 操作完成，但沒有返回文本內容"

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# 掛載靜態檔案目錄
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/")
async def index():
    return FileResponse("public/index.html")

# ------------------ API 實作 ------------------
@app.get("/api/tools")
async def api_tools():
    return {"tools": [t.model_dump() for t in all_tools]}

@app.post("/api/call-tool")
async def api_call_tool(req: CallToolRequest):
    result = await call_tool(req.server, req.name, req.args)
    # MCP 返回結構相容性處理
    if hasattr(result, 'content'):
        content = extract_text_content(result.content)
    else:
        content = str(result)
    return {"result": content}

@app.post("/api/chat")
async def api_chat(req: ChatRequest):
    # 建構 LLM 消息歷史，首條為 system
    messages = [
        {"role": "system", "content": "你是一個智能助手，可以使用各種 MCP 工具來幫助使用者完成任務。如果不需要使用工具，直接返回回答。"}
    ]
    if req.history:
        for m in req.history:
            messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": req.message})

    # 建構 tools 列表
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

    # 第一次 LLM 呼叫
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
        # 工具呼叫
        if hasattr(message, 'tool_calls') and message.tool_calls:
            # 1. tool_calls 作為 assistant 消息加入歷史
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
                ]  # 轉換為 openai 格式
            })
            # 2. 依次呼叫工具，結果以 tool 消息加入歷史
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                # 解析 server/tool
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
                        "content": f"錯誤: {str(e)}"
                    })
            # 3. 再次 LLM 呼叫，生成最終回覆
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
        raise HTTPException(status_code=500, detail=f"LLM/對話處理失敗: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
```

上面程式碼中我們同樣讀取一個 `mcp.json` 檔案來設定 MCP 伺服器，然後透過 SDK 提供的 `sse_client` 來建立一個 SSE 客戶端，透過 `ClientSession` 來建立一個客戶端會話，然後透過 `session.list_tools` 來取得 MCP 伺服器暴露的工具，最後透過 `tool_to_info` 將 MCP 工具轉換為工具資訊。

```python
async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    從 MCP 伺服器取得工具
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]
```

這樣我們就可以取得所有設定的 SSE 類型的 MCP 伺服器提供的所有 Tools 工具了，注意我們這裡使用的 `FastAPI` 來建立一個 Web 服務，我們可以透過使用 `lifespan` 來管理 MCP 伺服器的生命週期，在啟動時載入 MCP 伺服器，在關閉時關閉 MCP 伺服器。

```python
# 啟動時載入
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 啟動時執行
    load_mcp_config()
    await load_all_tools()
    yield
    # 關閉時執行
    pass

app = FastAPI(lifespan=lifespan)
```

然後就是根據前端頁面的需求去實作一些介面，比如取得所有工具、呼叫工具、發送消息等，其中最主要的是 `api/chat` 介面，這個介面是用來處理使用者發送的消息的，將使用者的輸入和 MCP 工具列表一起發給 LLM 進行處理，LLM 返回結果後，我們再根據結果來呼叫工具，將呼叫工具結果和歷史消息一起發給 LLM 進行處理，得到最终结果。

最後我們直接運行這個 Web 服務，然後就可以透過 `http://localhost:8002` 存取這個 Web 服務了，然後我們就可以在 Web 頁面中使用 MCP 服務了。

```bash
$ uv run python web.py
```

在頁面右側我們列出了所有可用的工具，在聊天介面中輸入問題，如果大模型認為需要使用工具，那麼就會呼叫工具，並返回工具呼叫結果，然後我們再根據工具呼叫結果來呼叫工具，直到得到最终结果，在前端頁面上我們也顯示了工具呼叫結果，如下圖所示：

![MCP WEB](https://picdn.youdianzhishi.com/images/1749110324295.png)

到這裡我們就實作了一個基於 Web 的 SSE 類型的 MCP 伺服器和客戶端的開發，透過這個例子我們可以看到，使用 MCP 服務可以讓我們在業務系統中非常方便地整合各種工具，從而實作更加智能化的業務系統。

## Streamable HTTP 模式

MCP 官方在 2025-03-26 版本中正式推出了 Streamable HTTP 傳輸機制，該機制結合了 HTTP 與 Server-Sent Events (SSE) 技術，為現代分散式系統提供了靈活的雙向通訊能力，這是對現有 SSE 協定的重大革新，Streamable HTTP 會取代 SSE 成為未來標準。

### 原有 HTTP+SSE 傳輸機制及其局限

![HTTP+SSE 傳輸機制](https://picdn.youdianzhishi.com/images/1749111379973.png)

在原有的 MCP 實作中，客戶端和伺服器透過兩個主要通道通訊：

- **HTTP 請求/回應**：客戶端透過標準 HTTP 請求發送消息到伺服器
- **伺服器發送事件(SSE)**：伺服器透過專門的 `/sse` 端點向客戶端推送消息

### 主要問題

這種設計雖然簡單直觀，但存在幾個關鍵問題：

**不支援斷線重連/恢復**

當 SSE 連接斷開時，所有會話狀態丟失，客戶端必須重新建立連接並初始化整個會話。例如，正在執行的大型文件分析任務會因 WiFi 不穩定而完全中斷，迫使使用者重新開始整個過程。

**伺服器需維護長連接**

伺服器必須為每個客戶端維護一個長時間的 SSE 連接，大量並發使用者會導致資源消耗劇增。當伺服器需要重啟或擴容時，所有連接都會中斷，影響使用者體驗和系統可靠性。

**伺服器消息只能透過 SSE 傳遞**

即使是簡單的請求-回應互動，伺服器也必須透過 SSE 通道返回資訊，造成不必要的複雜性和開銷。對於某些環境（如雲端函數）不適合長時間保持 SSE 連接。

**基礎設施相容性限制**

許多現有的 Web 基礎設施如 CDN、負載平衡器、API 閘道等可能不能正確處理長時間的 SSE 連接，企業防火牆可能會強制關閉逾時連接，導致服務不可靠。

### Streamable HTTP：設計與原理

Streamable HTTP 的設計基於以下幾個核心理念：

- **最大化相容性**：與現有 HTTP 生態系統無縫整合
- **靈活性**：同時支援無狀態和有狀態模式
- **資源效率**：按需分配資源，避免不必要的長連接
- **可靠性**：支援斷線重連和會話恢復

#### 關鍵改進

相比原有機制，Streamable HTTP 引入了幾項關鍵改進：

1. **統一端點**：移除專門的 `/sse` 端點，所有通訊透過單一端點（如 `/message`）進行
2. **按需流式傳輸**：伺服器可靈活選擇是返回普通 HTTP 回應還是升級為 SSE 流
3. **會話標識**：引入會話 ID 機制，支援狀態管理和恢復
4. **靈活初始化**：客戶端可透過空 GET 請求主動初始化 SSE 流

#### 技術細節

Streamable HTTP 的工作流程如下：

1. **會話初始化**：

   - 客戶端發送初始化請求到 `/message` 端點
   - 伺服器可選擇產生會話 ID 返回給客戶端
   - 會話 ID 用於後續請求中標識會話

2. **客戶端向伺服器通訊**：

   - 所有消息透過 HTTP POST 請求發送到 `/message` 端点
   - 如果有會話 ID，則包含在請求中

3. **伺服器回應方式**：

   - **普通回應**：直接返回 HTTP 回應，適合簡單互動
   - **流式回應**：升級連接為 SSE，發送一系列事件後關閉
   - **長連接**：維持 SSE 連接持續發送事件

4. **主動建立 SSE 流**：

   - 客戶端可發送 GET 請求到 `/message` 端點主動建立 SSE 流
   - 伺服器可透過該流推送通知或請求

5. **連接恢復**：

   - 連接中斷時，客戶端可使用之前的會話 ID 重新連接
   - 伺服器可恢復會話狀態繼續之前的互動

### 實際應用場景

#### 無狀態伺服器模式

**場景**：簡單工具 API 服務，如數學計算、文本處理等。

**實作**：

```bash
客戶端                                 伺服器
   |                                    |
   |-- POST /message (計算請求) -------->|
   |                                    |-- 執行計算
   |<------- HTTP 200 (計算結果) -------|
   |                                    |
```

**優勢**：極簡部署，無需狀態管理，適合無伺服器架構和微服務。

#### 流式進度回饋模式

**場景**：長時間執行的任務，如大檔案處理、複雜 AI 生成等。

**實作**：

```bash
客戶端                                 伺服器
   |                                    |
   |-- POST /message (處理請求) -------->|
   |                                    |-- 啟動處理任務
   |<------- HTTP 200 (SSE開始) --------|
   |                                    |
   |<------- SSE: 進度10% ---------------|
   |<------- SSE: 進度30% ---------------|
   |<------- SSE: 進度70% ---------------|
   |<------- SSE: 完成 + 結果 ------------|
   |                                    |
```

**優勢**：提供即時回饋，但不需要永久保持連接狀態。

#### 複雜 AI 會話模式

**場景**：多輪對話 AI 助手，需要維護上下文。

**實作**：

```bash
客戶端                                 伺服器
   |                                    |
   |-- POST /message (初始化) ---------->|
   |<-- HTTP 200 (會話ID: abc123) ------|
   |                                    |
   |-- GET /message (會話ID: abc123) --->|
   |<------- SSE流建立 -----------------|
   |                                    |
   |-- POST /message (問題1, abc123) --->|
   |<------- SSE: 思考中... -------------|
   |<------- SSE: 回答1 ----------------|
   |                                    |
   |-- POST /message (問題2, abc123) --->|
   |<------- SSE: 思考中... -------------|
   |<------- SSE: 回答2 ----------------|
```

**優勢**：維護會話上下文，支援複雜互動，同時允許水平擴展。

#### 斷線恢復模式

**場景**：不穩定網路環境下的 AI 應用使用。

**實作**：

```bash
客戶端                                 伺服器
   |                                    |
   |-- POST /message (初始化) ---------->|
   |<-- HTTP 200 (會話ID: xyz789) ------|
   |                                    |
   |-- GET /message (會話ID: xyz789) --->|
   |<------- SSE流建立 -----------------|
   |                                    |
   |-- POST /message (長任務, xyz789) -->|
   |<------- SSE: 進度30% ---------------|
   |                                    |
   |     [網路中斷]                      |
   |                                    |
   |-- GET /message (會話ID: xyz789) --->|
   |<------- SSE流重新建立 --------------|
   |<------- SSE: 進度60% ---------------|
   |<------- SSE: 完成 ------------------|
```

**優勢**：提高弱網環境下的可靠性，改善使用者體驗。

### Streamable HTTP 的主要優勢

#### 技術優勢

1. **簡化實作**：可以在普通 HTTP 伺服器上實作，無需特殊支援
2. **資源效率**：按需分配資源，不需要為每個客戶端維護長連接
3. **基礎設施相容性**：與現有 Web 基礎設施（CDN、負載平衡器、API 閘道）良好配合
4. **水平擴展**：支援透過消息總線路由請求到不同伺服器節點
5. **漸進式採用**：服務提供者可根據需求選擇實作複雜度
6. **斷線重連**：支援會話恢復，提高可靠性

#### 業務優勢

1. **降低維運成本**：減少伺服器資源消耗，簡化部署架構
2. **提升使用者體驗**：透過即時回饋和可靠連接改善體驗
3. **廣泛適用性**：從簡單工具到複雜 AI 互動，都有合適的實作方式
4. **擴展能力**：支援更多樣化的 AI 應用場景
5. **開發友好**：降低實作 MCP 的技術門檻

### 實作參考

#### 伺服器端實作要點

1. **端點設計**：

   - 實作單一的 `/message` 端點處理所有請求
   - 支援 POST 和 GET 兩種 HTTP 方法

2. **狀態管理**：

   - 設計會話 ID 產生和驗證機制
   - 實作會話狀態儲存（記憶體、Redis 等）

3. **請求處理**：

   - 解析請求中的會話 ID
   - 確定回應類型（普通 HTTP 或 SSE）
   - 處理流式回應的內容類型和格式

4. **連接管理**：

   - 實作 SSE 流初始化和維護
   - 處理連接斷開和重連邏輯

#### 客戶端實作要點

1. **請求建構**：

   - 建構符合協定的消息格式
   - 正確包含會話 ID（如有）

2. **回應處理**：

   - 檢測回應是普通 HTTP 還是 SSE
   - 解析和處理 SSE 事件

3. **會話管理**：

   - 儲存和管理會話 ID
   - 實作斷線重連邏輯

4. **錯誤處理**：

   - 處理網路錯誤和逾時
   - 實作指數退避重試策略

### 總結

Streamable HTTP 傳輸層代表了 MCP 協定的重要進化，它透過結合 HTTP 和 SSE 的優點，同時克服二者的局限，為 AI 應用的通訊提供了更靈活、更可靠的解決方案。它不僅解決了原有傳輸機制的問題，還為未來更複雜的 AI 互動模式奠定了基礎。

這個協定的設計充分體現了實用性原則，既滿足了技術先進性要求，又保持了與現有 Web 基礎設施的相容性。它的靈活性使得開發者可以根據自身需求選擇最合適的實作方式，從簡單的無狀態 API 到複雜的互動式 AI 應用，都能找到合適的解決方案。

### Python SDK 實作參考

現在 MCP Python SDK 已經支援了 Streamable HTTP 協定模式，不過 SDK 預設使用的端點是 `/mcp`。

我們只需要將 `transport` 參數設定為 `streamable-http` 即可，然後透過 `host` 和 `port` 參數來指定伺服器地址和端口，透過 `path` 參數來覆蓋預設的端點路徑，如下所示：

```python
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀", host="0.0.0.0", port=8083)

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

我們只需要透過上面的幾行程式碼即可實作一個 Streamable HTTP 類型的 MCP 伺服器。

如果我們要將前面的 SSE 類型的 MCP 伺服器改成 Streamable HTTP 類型的 MCP 伺服器，那麼我們只需要將 `transport` 參數設定為 `streamable-http` 即可：

```bash
$ python main.py
🌤️ 啟動產品 MCP 伺服器...
📍 支援的功能:
  - 取得產品列表 (get_products)
  - 取得庫存列表 (get_inventory)
  - 取得訂單列表 (get_orders)
  - 建立採購訂單 (create_purchase)

INFO:     Started server process [26897]
INFO:     Waiting for application startup.
[06/05/25 16:39:19] INFO     StreamableHTTP session manager started  streamable_http_manager.py:109
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

然後我們就可以透過 `http://localhost:8083/mcp` 來存取這個 MCP 伺服器了，同樣比如在 Cursor 中設定：

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://127.0.0.1:8083/mcp"
    }
  }
}
```

然後我們就可以在 Cursor 中使用這個 MCP 伺服器了，如下圖所示：

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749112893794.png)

然後我們就可以在 Cursor 中使用這個 MCP 伺服器了，如下圖所示：

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749113099093.png)

同樣在客戶端中我們也可以使用 Streamable HTTP 模式進行連接，如下所示：

```python
import asyncio
from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession


async def main():
    # Connect to a streamable HTTP server
    async with streamablehttp_client("http://localhost:8083/mcp") as (
        read_stream,
        write_stream,
        _,
    ):
        # 建立一個會話
        async with ClientSession(read_stream, write_stream) as session:
            # 初始化會話
            await session.initialize()
            # 呼叫工具
            tool_result = await session.call_tool("get_products", {})
            print(tool_result)

if __name__ == "__main__":
    asyncio.run(main())
```

同樣直接使用 SDK 提供的 `streamablehttp_client` 來建立一個 Streamable HTTP 客戶端，然後透過 `ClientSession` 來建立一個客戶端會話，然後透過 `session.initialize` 來初始化會話，然後透過 `session.call_tool` 來呼叫工具，整體流程和 `stdio` 以及 `sse` 模式基本一致。

使用 Streamable HTTP 模式比 SSE 模式更加適合在 Web 應用中使用，因為 Streamable HTTP 模式可以更好地支援 Web 應用的特性，比如支援斷線重連、支援會話恢復等，且能支援大規模的並發請求。（大家可以嘗試將前面我們的 Web 應用更改為 Streamable HTTP 模式）
