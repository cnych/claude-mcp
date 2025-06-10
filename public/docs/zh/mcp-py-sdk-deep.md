---
title: MCP Python SDK 深入使用
description: 使用 MCP Python SDK 实现 SSE 和 Streamable HTTP 协议，并使用 MCP Inspector 来测试 MCP 服务器
section: base-dev
prev: mcp-py-sdk-basic
next: mcp-authorization
pubDate: 2025-06-10
order: 8
---

# MCP Python SDK 深入使用

前面我们深入了解了 MCP 的基础知识，包括其架构、协议和应用场景。也通过一个简单的例子，了解了如何开发 MCP 服务和 MCP 客户端，但是我们只学习了 stdio 模式的 MCP 服务和客户端，在实际应用中，我们还需要考虑如何将 MCP 服务部署到云端，所以更多的时候需要用到 SSE 和 Streamable HTTP 协议。

## SSE 模式

SSE 模式是 MCP 服务和客户端之间的一种通信方式，它使用 Server-Sent Events（SSE）协议来传输数据。接下来我们将为大家开发一个基于 MCP 的智能商城服务助手，使用 SSE 类型的 MCP 服务，具备以下核心功能：

- 实时访问产品信息和库存水平，支持定制订单。
- 根据客户偏好和可用库存推荐产品。
- 使用 MCP 工具服务器与微服务进行实时交互。
- 在回答产品询问时检查实时库存水平。
- 使用产品 ID 和数量促进产品购买。
- 实时更新库存水平。
- 通过自然语言查询提供订单交易的临时分析。

![智能商城助手](https://picdn.youdianzhishi.com/images/1749089781344.png)

这里我们可以采用微服务的架构，首先需要一个产品微服务，用于暴露一个产品列表的 API 接口。然后再提供一个订单微服务，用于暴露一个订单创建、库存信息等 API 接口。

接下来的核心就是核心的 MCP SSE 服务器，用于向 LLM 暴露产品微服务和订单微服务数据，作为使用 SSE 协议的工具。

最后就是使用 MCP 客户端，通过 SSE 协议连接到 MCP SSE 服务器，并使用 LLM 进行交互。

### 微服务

首先使用 uv 创建一个 Python 项目，并进入项目目录。

```bash
uv init product-mcp --python 3.13
cd product-mcp
uv add fastapi uvicorn
```

接下来我们开始开发产品微服务和订单微服务，并暴露 API 接口。首先可以使用 `Pydantic` 定义产品、库存和订单的类型，为了简单起见，这里我们直接用模拟数据来充当数据库，详细代码如下所示：

```python
# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uvicorn

app = FastAPI()

# Pydantic 模型定义
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


# 模拟数据存储
# 产品列表
products_db: List[Product] = [
    Product(id=1, name="智能手表Galaxy", price=1299, description="健康监测，运动追踪，支持多种应用"),
    Product(id=2, name="无线蓝牙耳机Pro", price=899, description="主动降噪，30小时续航，IPX7防水"),
    Product(id=3, name="便携式移动电源", price=299, description="20000mAh大容量，支持快充，轻薄设计"),
    Product(id=4, name="华为MateBook X Pro", price=1599, description="14.2英寸全面屏，3:2比例，100% sRGB色域"),
]
# 库存列表
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
        raise HTTPException(status_code=400, detail="请求无效：缺少客户名称或商品")

    total_amount = 0.0

    # 验证库存并计算总价
    for item in items:
        inventory_item = next((i for i in inventory_db if i.productId == item.productId), None)
        product = next((p for p in products_db if p.id == item.productId), None)

        if not inventory_item or not product:
            raise HTTPException(status_code=404, detail=f"商品ID {item.productId} 不存在")

        if inventory_item.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"商品 {product.name} 库存不足. 可用: {inventory_item.quantity}",
            )

        total_amount += product.price * item.quantity

    # 创建订单
    order_id = len(orders_db) + 1
    order_date = datetime.datetime.now(datetime.timezone.utc).isoformat()

    new_order = Order(
        id=order_id,
        customerName=customer_name,
        items=items,
        totalAmount=total_amount,
        orderDate=order_date,
    )

    # 更新库存
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

上面的接口代码非常简单，就是根据产品 ID 查询产品信息、库存信息和订单信息，并提供一个创建订单的接口。

接下来我们使用 `uv` 运行这个微服务，并使用 `curl` 测试一下。

```bash
$ uv run python api.py
INFO:     Started server process [21924]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

然后我们可以通过 `http://127.0.0.1:8000/docs` 查看 API 文档，也可以通过 `http://127.0.0.1:8000/redoc` 查看 API 文档的 ReDoc 格式。

![api docs](https://picdn.youdianzhishi.com/images/1749092558487.png)

然后我们就可以通过 MCP 的工具来将这些 API 接口暴露出去，接下来我们可以使用 MCP Python SDK 来开发 MCP 服务。

```bash
uv add "mcp[cli]"
```

如果是 Stdio 类型的 MCP 服务，那么我们就可以直接在命令行中使用这些工具了，但是我们现在需要使用 SSE 类型的 MCP 服务，所以我们还需要一个 MCP SSE 服务器来暴露这些工具。

### MCP SSE 服务器

接下来我们开始开发 MCP SSE 服务器，用于暴露产品微服务和订单微服务数据，作为使用 SSE 协议的工具。

首先我们使用 `FastMCP` 创建一个 MCP 实例，然后定义一个异步客户端，用于调用 FastAPI 服务。然后定义 4 个工具，分别是：

- `get_products`：获取所有产品信息
- `get_inventory`：获取所有产品的库存信息
- `get_orders`：获取所有订单信息
- `create_purchase`：创建新的采购订单

我们可以直接通过 `mcp.tool` 来定义这些工具，详细代码如下所示：

```python
# main.py
from models import OrderItem
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field
from typing import List
import httpx # HTTP client for calling FastAPI service

# MCP 实例
mcp = FastMCP(name="Product MCP Server", host="0.0.0.0", port=8083)

# FastAPI 服务基础 URL
FASTAPI_SERVICE_URL = "http://localhost:8000/api"
# 创建一个异步客户端，用于调用 FastAPI 服务
async_client = httpx.AsyncClient(base_url=FASTAPI_SERVICE_URL)

# MCP 工具定义 (调用 FastAPI 服务)
@mcp.tool(name="get_products", description="获取所有产品列表。")
async def get_products_tool():
    """通过调用FastAPI服务获取所有产品的列表。"""
    try:
        response = await async_client.get("/products")
        response.raise_for_status() # Raise an exception for HTTP error codes (4xx or 5xx)
        return response.json()
    except httpx.HTTPStatusError as e:
        # Forward FastAPI's error message if possible, or a generic one
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"调用产品服务失败 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"请求产品服务时出错: {e}") from e

@mcp.tool(name="get_inventory", description="获取库存列表，包含产品详细信息。")
async def get_inventory_tool():
    """通过调用FastAPI服务获取库存列表。"""
    try:
        response = await async_client.get("/inventory")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"调用库存服务失败 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"请求库存服务时出错: {e}") from e

@mcp.tool(name="get_orders", description="获取订单列表，按日期降序排序。")
async def get_orders_tool():
    """通过调用FastAPI服务获取所有订单的列表。"""
    try:
        response = await async_client.get("/orders")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"调用订单服务失败 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"请求订单服务时出错: {e}") from e

class CreatePurchaseInput(BaseModel):
    customerName: str = Field(..., description="客户名称")
    items: List[OrderItem] = Field(..., description="购买的商品列表，每个条目包含 productId 和 quantity")

@mcp.tool(name="create_purchase", description="创建新的采购订单。")
async def create_purchase_tool(input_data: CreatePurchaseInput):
    """通过调用FastAPI服务创建新的采购订单。"""
    try:
        response = await async_client.post("/purchase", json=input_data.model_dump())
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        # It's important that the MCP tool surfaces meaningful errors from the API
        raise Exception(f"创建采购订单失败 ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"请求创建采购订单时出错: {e}") from e
```

工具定义完成后，接下来我们需要通过 SSE 传输协议来暴露这些工具，最简单的方式就是在 `run` 方法中指定 `transport="sse"` 参数，详细代码如下所示：

```python

# --- 运行 MCP 服务器 ---
if __name__ == "__main__":
    print("🌤️ 启动产品 MCP 服务器...")
    print("📍 支持的功能:")
    print("  - 获取产品列表 (get_products)")
    print("  - 获取库存列表 (get_inventory)")
    print("  - 获取订单列表 (get_orders)")
    print("  - 创建采购订单 (create_purchase)")
    print()

    # 使用 sse 传输协议运行 MCP 服务器
    mcp.run(transport="sse")
```

上面我们通过 `mcp.run(transport="sse")` 来运行 MCP 服务器，并指定使用 SSE 传输协议暴露这些工具。另外需要注意的是我们在实例化 `FastMCP` 时，指定了 `host` 和 `port` 参数，这是因为 SSE 传输协议需要一个 HTTP 服务器来暴露这些工具，所以这里我们使用 `0.0.0.0` 和 `8083` 端口（默认为 8000），默认情况下，SSE 服务器挂载在 `/sse` 端点，也就是通过 `http://localhost:8083/sse` 端点来建立 SSE 连接，然后真正接收客户端消息的端点是 `/messages`。

同样现在我们可以直接启动这个 MCP 服务器：

```bash
$ uv run python main.py
🌤️ 启动产品 MCP 服务器...
📍 支持的功能:
  - 获取产品列表 (get_products)
  - 获取库存列表 (get_inventory)
  - 获取订单列表 (get_orders)
  - 创建采购订单 (create_purchase)

INFO:     Started server process [77092]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

同样现在我们可以使用 MCP Inspector 来测试这个 MCP 服务器，选中 Transport Type 为 SSE，然后输入 `http://localhost:8083/sse` 端点，然后点击 `Connect` 按钮，就可以看到 MCP 服务器暴露的工具了。

![mcp inspector](https://picdn.youdianzhishi.com/images/1749105716600.png)

比如我们可以选择 `get_products` 工具，然后点击 `Run Tool` 按钮，就可以看到 MCP 服务器返回的产品列表。

### MCP 客户端

接下来我们就可以使用 MCP 客户端来连接到 MCP SSE 服务器，比如我们可以在 Cursor 中来进行测试，在 Cursor 设置页面，切换到 MCP 选项卡，点击右上角的 `+ Add new global MCP Server` 按钮，然后在跳转的 `mcp.json` 文件中，输入以下内容：

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://localhost:8083/sse"
    }
  }
}
```

然后回到 MCP 页面就可以看到这个 MCP 服务了，并且将其提供的 Tools 也显示出来了：

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749105955597.png)

这样我们就可以在 Cursor 中来使用这个 MCP 服务了。

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749106197834.png)

当然如果我们要自己在业务系统中使用 MCP 服务，那么就需要我们自己来开发一个 MCP 客户端了，比如我们可以开发一个客服系统，来集成 MCP 服务。

对于 MCP 客户端前面我们已经介绍过了，唯一不同的是现在我们需要使用 SSE 协议来连接到 MCP SSE 服务器。

```typescript
// 创建MCP客户端
const mcpClient = new McpClient({
  name: "mcp-sse-demo",
  version: "1.0.0",
});

// 创建SSE传输对象
const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

// 连接到MCP服务器
await mcpClient.connect(transport);
```

然后其他操作也基本一致，也就是列出所有工具，然后将用户的问题和工具一起发给 LLM 进行处理。LLM 返回结果后，我们再根据结果来调用工具，将调用工具结果和历史消息一起发给 LLM 进行处理，得到最终结果。

对于 Web 客户端的话，和命令行客户端也基本一致，只是需要我们将这些处理过程放到一些接口里面去实现，然后通过 Web 页面来调用这些接口即可。

我们首先要初始化 MCP 客户端，然后获取所有工具，并转换工具格式为 OpenAI 所需的数组形式，然后创建 OpenAI 客户端，完整代码如下所示：

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
# MCP/LLM 相关依赖
from openai import AsyncOpenAI
from mcp.client.sse import sse_client
from mcp.client.session import ClientSession
from mcp.types import Tool, TextContent

# 加载环境变量
load_dotenv()

# FastAPI 实例
app = FastAPI()

# 允许跨域（方便本地前端调试）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP 配置
MCP_CONFIG_PATH = os.getenv("MCP_CONFIG_PATH", "mcp.json")

# LLM 配置
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

# 工具缓存
class MCPServerConfig(BaseModel):
    name: str
    url: str
    description: Optional[str] = ""

class MCPToolInfo(BaseModel):
    server: str
    name: str
    description: str
    input_schema: Dict[str, Any]

# 全局缓存
mcp_servers: Dict[str, MCPServerConfig] = {}
all_tools: List[MCPToolInfo] = []
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

# ------------------ 工具加载 ------------------
def load_mcp_config():
    """
    加载 MCP 配置
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
        raise RuntimeError(f"加载 MCP 配置失败: {e}")

def tool_to_info(server_name: str, tool: Tool) -> MCPToolInfo:
    """
    将 MCP 工具转换为工具信息
    """
    return MCPToolInfo(
        server=server_name,
        name=tool.name,
        description=tool.description or "无描述",
        input_schema=tool.inputSchema or {"type": "object", "properties": {}}
    )

async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    从 MCP 服务器获取工具
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]

async def load_all_tools():
    """
    加载所有工具
    """
    global all_tools
    all_tools.clear()
    tasks = [get_tools_from_server(name, config) for name, config in mcp_servers.items()]
    results = await asyncio.gather(*tasks)
    for tool_list in results:
        all_tools.extend(tool_list)

# 启动时加载
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行
    load_mcp_config()
    await load_all_tools()
    yield
    # 关闭时执行
    pass

app = FastAPI(lifespan=lifespan)

# ------------------ API 数据模型 ------------------
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

# ------------------ 工具调用 ------------------
async def call_tool(server_name: str, tool_name: str, arguments: Dict[str, Any]) -> Any:
    config = mcp_servers.get(server_name)
    if not config:
        raise HTTPException(status_code=404, detail=f"服务器 {server_name} 不存在")
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
    return "\n".join(text_parts) if text_parts else "✅ 操作完成，但没有返回文本内容"

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/")
async def index():
    return FileResponse("public/index.html")

# ------------------ API 实现 ------------------
@app.get("/api/tools")
async def api_tools():
    return {"tools": [t.model_dump() for t in all_tools]}

@app.post("/api/call-tool")
async def api_call_tool(req: CallToolRequest):
    result = await call_tool(req.server, req.name, req.args)
    # MCP 返回结构兼容性处理
    if hasattr(result, 'content'):
        content = extract_text_content(result.content)
    else:
        content = str(result)
    return {"result": content}

@app.post("/api/chat")
async def api_chat(req: ChatRequest):
    # 构建 LLM 消息历史，首条为 system
    messages = [
        {"role": "system", "content": "你是一个智能助手，可以使用各种 MCP 工具来帮助用户完成任务。如果不需要使用工具，直接返回回答。"}
    ]
    if req.history:
        for m in req.history:
            messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": req.message})

    # 构建 tools 列表
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

    # 第一次 LLM 调用
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
        # 工具调用
        if hasattr(message, 'tool_calls') and message.tool_calls:
            # 1. tool_calls 作为 assistant 消息加入历史
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
                ]  # 转换为 openai 格式
            })
            # 2. 依次调用工具，结果以 tool 消息加入历史
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
                        "content": f"错误: {str(e)}"
                    })
            # 3. 再次 LLM 调用，生成最终回复
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
        raise HTTPException(status_code=500, detail=f"LLM/对话处理失败: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
```

上面代码中我们同样读取一个 `mcp.json` 文件来配置 MCP 服务器，然后通过 SDK 提供的 `sse_client` 来创建一个 SSE 客户端，通过 `ClientSession` 来创建一个客户端会话，然后通过 `session.list_tools` 来获取 MCP 服务器暴露的工具，最后通过 `tool_to_info` 将 MCP 工具转换为工具信息。

```python
async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    从 MCP 服务器获取工具
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]
```

这样我们就可以获取所有配置的 SSE 类型的 MCP 服务器提供的所有 Tools 工具了，注意我们这里使用的 `FastAPI` 来创建一个 Web 服务，我们可以通过使用 `lifespan` 来管理 MCP 服务器的生命周期，在启动时加载 MCP 服务器，在关闭时关闭 MCP 服务器。

```python
# 启动时加载
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行
    load_mcp_config()
    await load_all_tools()
    yield
    # 关闭时执行
    pass

app = FastAPI(lifespan=lifespan)
```

然后就是根据前端页面的需求去实现一些接口，比如获取所有工具、调用工具、发送消息等，其中最主要的是 `api/chat` 接口，这个接口是用来处理用户发送的消息的，将用户的输入和 MCP 工具列表一起发给 LLM 进行处理，LLM 返回结果后，我们再根据结果来调用工具，将调用工具结果和历史消息一起发给 LLM 进行处理，得到最终结果。

最后我们直接运行这个 Web 服务，然后就可以通过 `http://localhost:8002` 访问这个 Web 服务了，然后我们就可以在 Web 页面中使用 MCP 服务了。

```bash
$ uv run python web.py
```

在页面右侧我们列出了所有可用的工具，在聊天界面中输入问题，如果大模型认为需要使用工具，那么就会调用工具，并返回工具调用结果，然后我们再根据工具调用结果来调用工具，直到得到最终结果，在前端页面上我们也显示了工具调用结果，如下图所示：

![MCP WEB](https://picdn.youdianzhishi.com/images/1749110324295.png)

到这里我们就实现了一个基于 Web 的 SSE 类型的 MCP 服务器和客户端的开发，通过这个例子我们可以看到，使用 MCP 服务可以让我们在业务系统中非常方便的集成各种工具，从而实现更加智能化的业务系统。

## Streamable HTTP 模式

MCP 官方在 2025-03-26 版本中正式推出了 Streamable HTTP 传输机制，该机制结合了 HTTP 与 Server-Sent Events (SSE) 技术，为现代分布式系统提供了灵活的双向通信能力，这是对现有 SSE 协议的重大革新，Streamable HTTP 会取代 SSE 成为未来标准。

### 原有 HTTP+SSE 传输机制及其局限

![HTTP+SSE 传输机制](https://picdn.youdianzhishi.com/images/1749111379973.png)

在原有的 MCP 实现中，客户端和服务器通过两个主要通道通信：

- **HTTP 请求/响应**：客户端通过标准 HTTP 请求发送消息到服务器
- **服务器发送事件(SSE)**：服务器通过专门的 `/sse` 端点向客户端推送消息

### 主要问题

这种设计虽然简单直观，但存在几个关键问题：

**不支持断线重连/恢复**

当 SSE 连接断开时，所有会话状态丢失，客户端必须重新建立连接并初始化整个会话。例如，正在执行的大型文档分析任务会因 WiFi 不稳定而完全中断，迫使用户重新开始整个过程。

**服务器需维护长连接**

服务器必须为每个客户端维护一个长时间的 SSE 连接，大量并发用户会导致资源消耗剧增。当服务器需要重启或扩容时，所有连接都会中断，影响用户体验和系统可靠性。

**服务器消息只能通过 SSE 传递**

即使是简单的请求-响应交互，服务器也必须通过 SSE 通道返回信息，造成不必要的复杂性和开销。对于某些环境（如云函数）不适合长时间保持 SSE 连接。

**基础设施兼容性限制**

许多现有的 Web 基础设施如 CDN、负载均衡器、API 网关等可能不能正确处理长时间的 SSE 连接，企业防火墙可能会强制关闭超时连接，导致服务不可靠。

### Streamable HTTP：设计与原理

Streamable HTTP 的设计基于以下几个核心理念：

- **最大化兼容性**：与现有 HTTP 生态系统无缝集成
- **灵活性**：同时支持无状态和有状态模式
- **资源效率**：按需分配资源，避免不必要的长连接
- **可靠性**：支持断线重连和会话恢复

#### 关键改进

相比原有机制，Streamable HTTP 引入了几项关键改进：

1. **统一端点**：移除专门的 `/sse` 端点，所有通信通过单一端点（如 `/message`）进行
2. **按需流式传输**：服务器可灵活选择是返回普通 HTTP 响应还是升级为 SSE 流
3. **会话标识**：引入会话 ID 机制，支持状态管理和恢复
4. **灵活初始化**：客户端可通过空 GET 请求主动初始化 SSE 流

#### 技术细节

Streamable HTTP 的工作流程如下：

1. **会话初始化**：

   - 客户端发送初始化请求到 `/message` 端点
   - 服务器可选择生成会话 ID 返回给客户端
   - 会话 ID 用于后续请求中标识会话

2. **客户端向服务器通信**：

   - 所有消息通过 HTTP POST 请求发送到 `/message` 端点
   - 如果有会话 ID，则包含在请求中

3. **服务器响应方式**：

   - **普通响应**：直接返回 HTTP 响应，适合简单交互
   - **流式响应**：升级连接为 SSE，发送一系列事件后关闭
   - **长连接**：维持 SSE 连接持续发送事件

4. **主动建立 SSE 流**：

   - 客户端可发送 GET 请求到 `/message` 端点主动建立 SSE 流
   - 服务器可通过该流推送通知或请求

5. **连接恢复**：

   - 连接中断时，客户端可使用之前的会话 ID 重新连接
   - 服务器可恢复会话状态继续之前的交互

### 实际应用场景

#### 无状态服务器模式

**场景**：简单工具 API 服务，如数学计算、文本处理等。

**实现**：

```bash
客户端                                 服务器
   |                                    |
   |-- POST /message (计算请求) -------->|
   |                                    |-- 执行计算
   |<------- HTTP 200 (计算结果) -------|
   |                                    |
```

**优势**：极简部署，无需状态管理，适合无服务器架构和微服务。

#### 流式进度反馈模式

**场景**：长时间运行的任务，如大文件处理、复杂 AI 生成等。

**实现**：

```bash
客户端                                 服务器
   |                                    |
   |-- POST /message (处理请求) -------->|
   |                                    |-- 启动处理任务
   |<------- HTTP 200 (SSE开始) --------|
   |                                    |
   |<------- SSE: 进度10% ---------------|
   |<------- SSE: 进度30% ---------------|
   |<------- SSE: 进度70% ---------------|
   |<------- SSE: 完成 + 结果 ------------|
   |                                    |
```

**优势**：提供实时反馈，但不需要永久保持连接状态。

#### 复杂 AI 会话模式

**场景**：多轮对话 AI 助手，需要维护上下文。

**实现**：

```bash
客户端                                 服务器
   |                                    |
   |-- POST /message (初始化) ---------->|
   |<-- HTTP 200 (会话ID: abc123) ------|
   |                                    |
   |-- GET /message (会话ID: abc123) --->|
   |<------- SSE流建立 -----------------|
   |                                    |
   |-- POST /message (问题1, abc123) --->|
   |<------- SSE: 思考中... -------------|
   |<------- SSE: 回答1 ----------------|
   |                                    |
   |-- POST /message (问题2, abc123) --->|
   |<------- SSE: 思考中... -------------|
   |<------- SSE: 回答2 ----------------|
```

**优势**：维护会话上下文，支持复杂交互，同时允许水平扩展。

#### 断线恢复模式

**场景**：不稳定网络环境下的 AI 应用使用。

**实现**：

```bash
客户端                                 服务器
   |                                    |
   |-- POST /message (初始化) ---------->|
   |<-- HTTP 200 (会话ID: xyz789) ------|
   |                                    |
   |-- GET /message (会话ID: xyz789) --->|
   |<------- SSE流建立 -----------------|
   |                                    |
   |-- POST /message (长任务, xyz789) -->|
   |<------- SSE: 进度30% ---------------|
   |                                    |
   |     [网络中断]                      |
   |                                    |
   |-- GET /message (会话ID: xyz789) --->|
   |<------- SSE流重新建立 --------------|
   |<------- SSE: 进度60% ---------------|
   |<------- SSE: 完成 ------------------|
```

**优势**：提高弱网环境下的可靠性，改善用户体验。

### Streamable HTTP 的主要优势

#### 技术优势

1. **简化实现**：可以在普通 HTTP 服务器上实现，无需特殊支持
2. **资源效率**：按需分配资源，不需要为每个客户端维护长连接
3. **基础设施兼容性**：与现有 Web 基础设施（CDN、负载均衡器、API 网关）良好配合
4. **水平扩展**：支持通过消息总线路由请求到不同服务器节点
5. **渐进式采用**：服务提供者可根据需求选择实现复杂度
6. **断线重连**：支持会话恢复，提高可靠性

#### 业务优势

1. **降低运维成本**：减少服务器资源消耗，简化部署架构
2. **提升用户体验**：通过实时反馈和可靠连接改善体验
3. **广泛适用性**：从简单工具到复杂 AI 交互，都有合适的实现方式
4. **扩展能力**：支持更多样化的 AI 应用场景
5. **开发友好**：降低实现 MCP 的技术门槛

### 实现参考

#### 服务器端实现要点

1. **端点设计**：

   - 实现单一的 `/message` 端点处理所有请求
   - 支持 POST 和 GET 两种 HTTP 方法

2. **状态管理**：

   - 设计会话 ID 生成和验证机制
   - 实现会话状态存储（内存、Redis 等）

3. **请求处理**：

   - 解析请求中的会话 ID
   - 确定响应类型（普通 HTTP 或 SSE）
   - 处理流式响应的内容类型和格式

4. **连接管理**：

   - 实现 SSE 流初始化和维护
   - 处理连接断开和重连逻辑

#### 客户端实现要点

1. **请求构造**：

   - 构建符合协议的消息格式
   - 正确包含会话 ID（如有）

2. **响应处理**：

   - 检测响应是普通 HTTP 还是 SSE
   - 解析和处理 SSE 事件

3. **会话管理**：

   - 存储和管理会话 ID
   - 实现断线重连逻辑

4. **错误处理**：

   - 处理网络错误和超时
   - 实现指数退避重试策略

### 总结

Streamable HTTP 传输层代表了 MCP 协议的重要进化，它通过结合 HTTP 和 SSE 的优点，同时克服二者的局限，为 AI 应用的通信提供了更灵活、更可靠的解决方案。它不仅解决了原有传输机制的问题，还为未来更复杂的 AI 交互模式奠定了基础。

这个协议的设计充分体现了实用性原则，既满足了技术先进性要求，又保持了与现有 Web 基础设施的兼容性。它的灵活性使得开发者可以根据自身需求选择最合适的实现方式，从简单的无状态 API 到复杂的交互式 AI 应用，都能找到合适的解决方案。

### Python SDK 实现参考

现在 MCP Python SDK 已经支持了 Streamable HTTP 协议模式，不过 SDK 默认使用的端点是 `/mcp`。

我们只需要将 `transport` 参数设置为 `streamable-http` 即可，然后通过 `host` 和 `port` 参数来指定服务器地址和端口，通过 `path` 参数来覆盖默认的端点路径，如下所示：

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

我们只需要通过上面的几行代码即可实现一个 Streamable HTTP 类型的 MCP 服务器。

如果我们要将前面的 SSE 类型的 MCP 服务器改成 Streamable HTTP 类型的 MCP 服务器，那么我们只需要将 `transport` 参数设置为 `streamable-http` 即可：

```bash
$ python main.py
🌤️ 启动产品 MCP 服务器...
📍 支持的功能:
  - 获取产品列表 (get_products)
  - 获取库存列表 (get_inventory)
  - 获取订单列表 (get_orders)
  - 创建采购订单 (create_purchase)

INFO:     Started server process [26897]
INFO:     Waiting for application startup.
[06/05/25 16:39:19] INFO     StreamableHTTP session manager started  streamable_http_manager.py:109
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

然后我们就可以通过 `http://localhost:8083/mcp` 来访问这个 MCP 服务器了，同样比如在 Cursor 中配置：

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://127.0.0.1:8083/mcp"
    }
  }
}
```

然后我们就可以在 Cursor 中使用这个 MCP 服务器了，如下图所示：

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749112893794.png)

然后我们就可以在 Cursor 中使用这个 MCP 服务器了，如下图所示：

![Cursor MCP](https://picdn.youdianzhishi.com/images/1749113099093.png)

同样在客户端中我们也可以使用 Streamable HTTP 模式进行连接，如下所示：

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
        # 创建一个会话
        async with ClientSession(read_stream, write_stream) as session:
            # 初始化会话
            await session.initialize()
            # 调用工具
            tool_result = await session.call_tool("get_products", {})
            print(tool_result)

if __name__ == "__main__":
    asyncio.run(main())
```

同样直接使用 SDK 提供的 `streamablehttp_client` 来创建一个 Streamable HTTP 客户端，然后通过 `ClientSession` 来创建一个客户端会话，然后通过 `session.initialize` 来初始化会话，然后通过 `session.call_tool` 来调用工具，整体流程和 `stdio` 以及 `sse` 模式基本一致。

使用 Streamable HTTP 模式比 SSE 模式更加适合在 Web 应用中使用，因为 Streamable HTTP 模式可以更好的支持 Web 应用的特性，比如支持断线重连、支持会话恢复等，且能支持大规模的并发请求。（大家可以尝试将前面我们的 Web 应用更改为 Streamable HTTP 模式）
