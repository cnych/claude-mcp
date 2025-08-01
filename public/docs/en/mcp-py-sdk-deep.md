---
title: In-Depth Usage of MCP Python SDK
description: Implementing SSE and Streamable HTTP protocols with MCP Python SDK and testing MCP servers using MCP Inspector
section: base-dev
prev: mcp-py-sdk-basic
next: mcp-authorization
pubDate: 2025-06-10
order: 8
---

# In-Depth Usage of MCP Python SDK

Previously, we explored the fundamentals of MCP, including its architecture, protocols, and application scenarios. Through a simple example, we learned how to develop MCP services and clients, but we only covered the stdio mode. In real-world applications, we also need to consider deploying MCP services to the cloud, which often requires using SSE and Streamable HTTP protocols.

## SSE Mode

SSE mode is a communication method between MCP services and clients that uses the Server-Sent Events (SSE) protocol for data transmission. Next, we will develop an intelligent e-commerce assistant based on MCP, leveraging SSE-type MCP services with the following core functionalities:

- Real-time access to product information and inventory levels, supporting custom orders.
- Recommending products based on customer preferences and available inventory.
- Using MCP tool servers for real-time interaction with microservices.
- Checking real-time inventory levels when answering product inquiries.
- Facilitating product purchases using product IDs and quantities.
- Updating inventory levels in real time.
- Providing ad-hoc analysis of order transactions through natural language queries.

![Intelligent E-Commerce Assistant](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749089781344.png)

Here, we can adopt a microservices architecture. First, we need a product microservice to expose an API for product listings. Then, we provide an order microservice to expose APIs for order creation, inventory information, etc.

The core component is the MCP SSE server, which exposes data from the product and order microservices to the LLM as tools using the SSE protocol.

Finally, we use an MCP client to connect to the MCP SSE server via the SSE protocol and interact with the LLM.

### Microservices

First, create a Python project using `uv` and navigate to the project directory.

```bash
uv init product-mcp --python 3.13
cd product-mcp
uv add fastapi uvicorn
```

Next, we develop the product and order microservices and expose their APIs. We start by defining types for products, inventory, and orders using `Pydantic`. For simplicity, we use mock data as our database. The detailed code is as follows:

```python
# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uvicorn

app = FastAPI()

# Pydantic model definitions
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

# Mock data storage
# Product list
products_db: List[Product] = [
    Product(id=1, name="Galaxy Smart Watch", price=1299, description="Health monitoring, activity tracking, supports multiple apps"),
    Product(id=2, name="Pro Wireless Bluetooth Earbuds", price=899, description="Active noise cancellation, 30-hour battery life, IPX7 waterproof"),
    Product(id=3, name="Portable Power Bank", price=299, description="20000mAh capacity, fast charging, lightweight design"),
    Product(id=4, name="Huawei MateBook X Pro", price=1599, description="14.2-inch full-screen display, 3:2 aspect ratio, 100% sRGB color gamut"),
]

# Inventory list
inventory_db: List[InventoryItemBase] = [
    InventoryItemBase(productId=1, quantity=100),
    InventoryItemBase(productId=2, quantity=50),
    InventoryItemBase(productId=3, quantity=200),
    InventoryItemBase(productId=4, quantity=150),
]

orders_db: List[Order] = []

# API routes
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
        raise HTTPException(status_code=400, detail="Invalid request: Missing customer name or items")

    total_amount = 0.0

    # Validate inventory and calculate total price
    for item in items:
        inventory_item = next((i for i in inventory_db if i.productId == item.productId), None)
        product = next((p for p in products_db if p.id == item.productId), None)

        if not inventory_item or not product:
            raise HTTPException(status_code=404, detail=f"Product ID {item.productId} does not exist")

        if inventory_item.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}. Available: {inventory_item.quantity}",
            )

        total_amount += product.price * item.quantity

    # Create order
    order_id = len(orders_db) + 1
    order_date = datetime.datetime.now(datetime.timezone.utc).isoformat()

    new_order = Order(
        id=order_id,
        customerName=customer_name,
        items=items,
        totalAmount=total_amount,
        orderDate=order_date,
    )

    # Update inventory
    for item in items:
        inventory_item = next(
            (i for i in inventory_db if i.productId == item.productId), None
        )
        if inventory_item:  # Should always be true due to checks above
            inventory_item.quantity -= item.quantity

    orders_db.append(new_order)
    return new_order

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

The API code above is straightforward, querying product, inventory, and order information by product ID and providing an interface for order creation.

Next, we run this microservice using `uv` and test it with `curl`.

```bash
$ uv run python api.py
INFO:     Started server process [21924]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

We can then view the API documentation at `http://127.0.0.1:8000/docs` or in ReDoc format at `http://127.0.0.1:8000/redoc`.

![API Docs](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749092558487.png)

We can now expose these APIs using MCP tools. Next, we use the MCP Python SDK to develop the MCP service.

```bash
uv add "mcp[cli]"
```

For stdio-type MCP services, we can use these tools directly in the command line. However, since we need SSE-type MCP services, we also require an MCP SSE server to expose these tools.

### MCP SSE Server

Next, we develop the MCP SSE server to expose data from the product and order microservices as tools using the SSE protocol.

First, we create an MCP instance using `FastMCP`, define an async client to call the FastAPI service, and then define four tools:

- `get_products`: Retrieve all product information.
- `get_inventory`: Retrieve inventory information for all products.
- `get_orders`: Retrieve all order information.
- `create_purchase`: Create a new purchase order.

We define these tools directly using `mcp.tool`. The detailed code is as follows:

```python
# main.py
from models import OrderItem
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field
from typing import List
import httpx  # HTTP client for calling FastAPI service

# MCP instance
mcp = FastMCP(name="Product MCP Server", host="0.0.0.0", port=8083)

# FastAPI service base URL
FASTAPI_SERVICE_URL = "http://localhost:8000/api"
# Create an async client for calling the FastAPI service
async_client = httpx.AsyncClient(base_url=FASTAPI_SERVICE_URL)

# MCP tool definitions (calling FastAPI service)
@mcp.tool(name="get_products", description="Retrieve a list of all products.")
async def get_products_tool():
    """Retrieve a list of all products by calling the FastAPI service."""
    try:
        response = await async_client.get("/products")
        response.raise_for_status()  # Raise an exception for HTTP error codes (4xx or 5xx)
        return response.json()
    except httpx.HTTPStatusError as e:
        # Forward FastAPI's error message if possible, or a generic one
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"Failed to call product service ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"Error requesting product service: {e}") from e

@mcp.tool(name="get_inventory", description="Retrieve inventory list, including product details.")
async def get_inventory_tool():
    """Retrieve inventory list by calling the FastAPI service."""
    try:
        response = await async_client.get("/inventory")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"Failed to call inventory service ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"Error requesting inventory service: {e}") from e

@mcp.tool(name="get_orders", description="Retrieve order list, sorted by date in descending order.")
async def get_orders_tool():
    """Retrieve a list of all orders by calling the FastAPI service."""
    try:
        response = await async_client.get("/orders")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        raise Exception(f"Failed to call order service ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"Error requesting order service: {e}") from e

class CreatePurchaseInput(BaseModel):
    customerName: str = Field(..., description="Customer name")
    items: List[OrderItem] = Field(..., description="List of purchased items, each containing productId and quantity")

@mcp.tool(name="create_purchase", description="Create a new purchase order.")
async def create_purchase_tool(input_data: CreatePurchaseInput):
    """Create a new purchase order by calling the FastAPI service."""
    try:
        response = await async_client.post("/purchase", json=input_data.model_dump())
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        detail = e.response.json().get("detail", str(e)) if e.response.content else str(e)
        # It's important that the MCP tool surfaces meaningful errors from the API
        raise Exception(f"Failed to create purchase order ({e.response.status_code}): {detail}") from e
    except httpx.RequestError as e:
        raise Exception(f"Error requesting purchase order creation: {e}") from e
```

After defining the tools, we expose them via the SSE transport protocol by specifying `transport="sse"` in the `run` method. The detailed code is as follows:

```python
# --- Run MCP server ---
if __name__ == "__main__":
    print("🌤️ Starting Product MCP Server...")
    print("📍 Supported features:")
    print("  - Get product list (get_products)")
    print("  - Get inventory list (get_inventory)")
    print("  - Get order list (get_orders)")
    print("  - Create purchase order (create_purchase)")
    print()

    # Run MCP server with SSE transport protocol
    mcp.run(transport="sse")
```

Here, we use `mcp.run(transport="sse")` to run the MCP server and expose the tools via the SSE transport protocol. Note that we specify `host` and `port` when instantiating `FastMCP` because the SSE transport protocol requires an HTTP server to expose the tools. By default, the SSE server is mounted at the `/sse` endpoint, meaning SSE connections are established via `http://localhost:8083/sse`, with the actual client message endpoint being `/messages`.

Now, we can start this MCP server directly:

```bash
$ uv run python main.py
🌤️ Starting Product MCP Server...
📍 Supported features:
  - Get product list (get_products)
  - Get inventory list (get_inventory)
  - Get order list (get_orders)
  - Create purchase order (create_purchase)

INFO:     Started server process [77092]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

We can now test this MCP server using MCP Inspector. Select "SSE" as the Transport Type, enter the endpoint `http://localhost:8083/sse`, and click the "Connect" button to see the tools exposed by the MCP server.

![MCP Inspector](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749105716600.png)

For example, we can select the `get_products` tool, click "Run Tool," and see the product list returned by the MCP server.

### MCP Client

Next, we can use an MCP client to connect to the MCP SSE server. For example, we can test it in Cursor. In the Cursor settings page, switch to the MCP tab, click the "+ Add new global MCP Server" button, and enter the following in the `mcp.json` file:

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://localhost:8083/sse"
    }
  }
}
```

Returning to the MCP page, we can now see this MCP service and its provided tools:

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749105955597.png)

This allows us to use the MCP service in Cursor.

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749106197834.png)

If we want to use the MCP service in our own business system, we need to develop an MCP client. For example, we could develop a customer service system that integrates the MCP service.

For the MCP client, the only difference is that we now use the SSE protocol to connect to the MCP SSE server.

```typescript
// Create MCP client
const mcpClient = new McpClient({
  name: "mcp-sse-demo",
  version: "1.0.0",
});

// Create SSE transport object
const transport = new SSEClientTransport(new URL(config.mcp.serverUrl));

// Connect to MCP server
await mcpClient.connect(transport);
```

Other operations remain largely the same: list all tools, send the user's question and tools to the LLM for processing, and then call the tools based on the LLM's response, combining the results with the message history for further LLM processing to obtain the final result.

For a web client, the process is similar to the command-line client, but we need to implement these processes in interfaces and call them via a web page.

First, we initialize the MCP client, retrieve all tools, and convert them into the array format required by OpenAI. Then, we create an OpenAI client. The complete code is as follows:

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
# MCP/LLM related dependencies
from openai import AsyncOpenAI
from mcp.client.sse import sse_client
from mcp.client.session import ClientSession
from mcp.types import Tool, TextContent

# Load environment variables
load_dotenv()

# FastAPI instance
app = FastAPI()

# Enable CORS (for local frontend debugging)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP configuration
MCP_CONFIG_PATH = os.getenv("MCP_CONFIG_PATH", "mcp.json")

# LLM configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

# Tool cache
class MCPServerConfig(BaseModel):
    name: str
    url: str
    description: Optional[str] = ""

class MCPToolInfo(BaseModel):
    server: str
    name: str
    description: str
    input_schema: Dict[str, Any]

# Global cache
mcp_servers: Dict[str, MCPServerConfig] = {}
all_tools: List[MCPToolInfo] = []
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_API_BASE)

# ------------------ Tool Loading ------------------
def load_mcp_config():
    """
    Load MCP configuration
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
        raise RuntimeError(f"Failed to load MCP configuration: {e}")

def tool_to_info(server_name: str, tool: Tool) -> MCPToolInfo:
    """
    Convert MCP tool to tool information
    """
    return MCPToolInfo(
        server=server_name,
        name=tool.name,
        description=tool.description or "No description",
        input_schema=tool.inputSchema or {"type": "object", "properties": {}}
    )

async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    Get tools from MCP server
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]

async def load_all_tools():
    """
    Load all tools
    """
    global all_tools
    all_tools.clear()
    tasks = [get_tools_from_server(name, config) for name, config in mcp_servers.items()]
    results = await asyncio.gather(*tasks)
    for tool_list in results:
        all_tools.extend(tool_list)

# Load on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Execute on startup
    load_mcp_config()
    await load_all_tools()
    yield
    # Execute on shutdown
    pass

app = FastAPI(lifespan=lifespan)

# ------------------ API Data Models ------------------
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

# ------------------ Tool Calling ------------------
async def call_tool(server_name: str, tool_name: str, arguments: Dict[str, Any]) -> Any:
    config = mcp_servers.get(server_name)
    if not config:
        raise HTTPException(status_code=404, detail=f"Server {server_name} not found")
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
    return "\n".join(text_parts) if text_parts else "✅ Operation complete, but no text content returned"

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Mount static files directory
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/")
async def index():
    return FileResponse("public/index.html")

# ------------------ API Implementation ------------------
@app.get("/api/tools")
async def api_tools():
    return {"tools": [t.model_dump() for t in all_tools]}

@app.post("/api/call-tool")
async def api_call_tool(req: CallToolRequest):
    result = await call_tool(req.server, req.name, req.args)
    # MCP return structure compatibility handling
    if hasattr(result, 'content'):
        content = extract_text_content(result.content)
    else:
        content = str(result)
    return {"result": content}

@app.post("/api/chat")
async def api_chat(req: ChatRequest):
    # Build LLM message history, starting with a system message
    messages = [
        {"role": "system", "content": "You are an intelligent assistant that can use various MCP tools to help users complete tasks. If no tool is needed, respond directly."}
    ]
    if req.history:
        for m in req.history:
            messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": req.message})

    # Build tools list
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

    # First LLM call
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
        # Tool call
        if hasattr(message, 'tool_calls') and message.tool_calls:
            # 1. Add tool_calls as an assistant message to history
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
                ]  # Convert to OpenAI format
            })
            # 2. Call tools sequentially, add results as tool messages to history
            for tool_call in message.tool_calls:
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                # Parse server/tool
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
                        "content": f"Error: {str(e)}"
                    })
            # 3. Second LLM call to generate final response
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
        raise HTTPException(status_code=500, detail=f"LLM/dialog processing failed: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
```

In the code above, we also read an `mcp.json` file to configure the MCP server, create an SSE client using the SDK's `sse_client`, create a client session with `ClientSession`, retrieve the tools exposed by the MCP server with `session.list_tools`, and finally convert MCP tools to tool information with `tool_to_info`.

```python
async def get_tools_from_server(name: str, config: MCPServerConfig) -> List[MCPToolInfo]:
    """
    Get tools from MCP server
    """
    async with sse_client(config.url) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools_result = await session.list_tools()
            return [tool_to_info(name, t) for t in tools_result.tools]
```

This allows us to retrieve all tools provided by all configured SSE-type MCP servers. Note that we are using `FastAPI` to create a web service, and we can manage the lifecycle of the MCP server using `lifespan`, loading it on startup and closing it on shutdown.

```python
# Load on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Execute on startup
    load_mcp_config()
    await load_all_tools()
    yield
    # Execute on shutdown
    pass

app = FastAPI(lifespan=lifespan)
```

Then, we implement interfaces based on frontend requirements, such as getting all tools, calling tools, sending messages, etc. The most important is the `/api/chat` interface, which handles user messages by sending the user's input and the MCP tool list to the LLM for processing. After the LLM returns a result, we call the tools based on the result, and then send the tool call results and message history to the LLM again to get the final response.

Finally, we run this web service, and it can be accessed at `http://localhost:8002`, allowing us to use the MCP service on a web page.

```bash
$ uv run python web.py
```

On the right side of the page, we list all available tools. When a question is entered in the chat interface, if the large model determines a tool is needed, it will call the tool and return the result. We then use this result to call the tool until a final answer is obtained. The tool call results are also displayed on the frontend, as shown below:

![MCP WEB](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749110324295.png)

This completes our development of a web-based SSE-type MCP server and client. This example shows that using MCP services allows us to conveniently integrate various tools into our business systems, thereby achieving more intelligent systems.

## Streamable HTTP Mode

MCP officially launched the Streamable HTTP transport mechanism on March 26, 2025. This mechanism combines HTTP and Server-Sent Events (SSE) technologies to provide flexible two-way communication for modern distributed systems. This is a major innovation over the existing SSE protocol, and Streamable HTTP is set to become the future standard.

### Existing HTTP+SSE Transport Mechanism and Its Limitations

![HTTP+SSE Transport Mechanism](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749111379973.png)

In the original MCP implementation, clients and servers communicated through two main channels:

- **HTTP Request/Response**: The client sends messages to the server via standard HTTP requests.
- **Server-Sent Events (SSE)**: The server pushes messages to the client through a dedicated `/sse` endpoint.

### Key Issues

While simple and intuitive, this design has several key problems:

**No Support for Disconnection/Resumption**

When an SSE connection is lost, all session state is lost, and the client must re-establish the connection and initialize the entire session. For example, a large document analysis task would be completely interrupted by an unstable WiFi connection, forcing the user to restart the entire process.

**Server Must Maintain Long-Lived Connections**

The server must maintain a long-lived SSE connection for each client, leading to a significant increase in resource consumption with a large number of concurrent users. When the server needs to be restarted or scaled, all connections are dropped, impacting user experience and system reliability.

**Server Messages Can Only Be Passed via SSE**

Even for simple request-response interactions, the server must return information through the SSE channel, causing unnecessary complexity and overhead. This is not suitable for some environments (like cloud functions) that are not designed for long-lived connections.

**Infrastructure Compatibility Limitations**

Many existing web infrastructures like CDNs, load balancers, and API gateways may not handle long-lived SSE connections correctly. Corporate firewalls might forcibly close timed-out connections, leading to unreliable service.

### Streamable HTTP: Design and Principles

The design of Streamable HTTP is based on several core concepts:

- **Maximum Compatibility**: Seamless integration with the existing HTTP ecosystem.
- **Flexibility**: Supports both stateless and stateful modes.
- **Resource Efficiency**: On-demand resource allocation, avoiding unnecessary long-lived connections.
- **Reliability**: Supports disconnection/resumption and session recovery.

#### Key Improvements

Compared to the previous mechanism, Streamable HTTP introduces several key improvements:

1. **Unified Endpoint**: Removes the dedicated `/sse` endpoint, with all communication happening through a single endpoint (e.g., `/message`).
2. **On-Demand Streaming**: The server can flexibly choose to return a regular HTTP response or upgrade to an SSE stream.
3. **Session Identification**: Introduces a session ID mechanism to support state management and recovery.
4. **Flexible Initialization**: The client can proactively initialize an SSE stream with an empty GET request.

#### Technical Details

The workflow of Streamable HTTP is as follows:

1. **Session Initialization**:

   - The client sends an initialization request to the `/message` endpoint.
   - The server can choose to generate a session ID and return it to the client.
   - The session ID is used in subsequent requests to identify the session.

2. **Client-to-Server Communication**:

   - All messages are sent via HTTP POST requests to the `/message` endpoint.
   - If a session ID exists, it is included in the request.

3. **Server Response Methods**:

   - **Normal Response**: Directly returns an HTTP response, suitable for simple interactions.
   - **Streaming Response**: Upgrades the connection to SSE, sends a series of events, and then closes.
   - **Long-Lived Connection**: Maintains the SSE connection to continuously send events.

4. **Proactive SSE Stream Establishment**:

   - The client can send a GET request to the `/message` endpoint to proactively establish an SSE stream.
   - The server can use this stream to push notifications or requests.

5. **Connection Recovery**:

   - When the connection is interrupted, the client can reconnect using the previous session ID.
   - The server can restore the session state and continue the previous interaction.

### Practical Application Scenarios

#### Stateless Server Mode

**Scenario**: Simple tool API services, such as math calculations, text processing, etc.

**Implementation**:

```bash
Client                                 Server
   |                                    |
   |-- POST /message (Calculation request) -->|
   |                                    |-- Execute calculation
   |<------- HTTP 200 (Calculation result) ----|
   |                                    |
```

**Advantage**: Minimal deployment, no state management, suitable for serverless architectures and microservices.

#### Streaming Progress Feedback Mode

**Scenario**: Long-running tasks, such as large file processing, complex AI generation, etc.

**Implementation**:

```bash
Client                                 Server
   |                                    |
   |-- POST /message (Processing request) -->|
   |                                    |-- Start processing task
   |<------- HTTP 200 (SSE start) --------|
   |                                    |
   |<------- SSE: Progress 10% -------------|
   |<------- SSE: Progress 30% -------------|
   |<------- SSE: Progress 70% -------------|
   |<------- SSE: Complete + Result --------|
   |                                    |
```

**Advantage**: Provides real-time feedback without needing to maintain a permanent connection state.

#### Complex AI Session Mode

**Scenario**: Multi-turn conversational AI assistant that needs to maintain context.

**Implementation**:

```bash
Client                                 Server
   |                                    |
   |-- POST /message (Initialize) -------->|
   |<-- HTTP 200 (Session ID: abc123) ------|
   |                                    |
   |-- GET /message (Session ID: abc123) --->|
   |<------- SSE stream established --------|
   |                                    |
   |-- POST /message (Question 1, abc123) -->|
   |<------- SSE: Thinking... --------------|
   |<------- SSE: Answer 1 -----------------|
   |                                    |
   |-- POST /message (Question 2, abc123) -->|
   |<------- SSE: Thinking... --------------|
   |<------- SSE: Answer 2 -----------------|
```

**Advantage**: Maintains session context, supports complex interactions, and allows for horizontal scaling.

#### Disconnection/Resumption Mode

**Scenario**: Using AI applications in unstable network environments.

**Implementation**:

```bash
Client                                 Server
   |                                    |
   |-- POST /message (Initialize) -------->|
   |<-- HTTP 200 (Session ID: xyz789) ------|
   |                                    |
   |-- GET /message (Session ID: xyz789) --->|
   |<------- SSE stream established --------|
   |                                    |
   |-- POST /message (Long task, xyz789) -->|
   |<------- SSE: Progress 30% -------------|
   |                                    |
   |     [Network interruption]            |
   |                                    |
   |-- GET /message (Session ID: xyz789) --->|
   |<------- SSE stream re-established -----|
   |<------- SSE: Progress 60% -------------|
   |<------- SSE: Complete -----------------|
```

**Advantage**: Improves reliability in poor network conditions and enhances user experience.

### Key Advantages of Streamable HTTP

#### Technical Advantages

1. **Simplified Implementation**: Can be implemented on a regular HTTP server without special support.
2. **Resource Efficiency**: On-demand resource allocation, no need to maintain long-lived connections for each client.
3. **Infrastructure Compatibility**: Works well with existing web infrastructure (CDNs, load balancers, API gateways).
4. **Horizontal Scaling**: Supports routing requests to different server nodes via a message bus.
5. **Progressive Adoption**: Service providers can choose implementation complexity based on their needs.
6. **Disconnection/Resumption**: Supports session recovery, improving reliability.

#### Business Advantages

1. **Lower Operational Costs**: Reduces server resource consumption and simplifies deployment architecture.
2. **Improved User Experience**: Enhances the experience with real-time feedback and reliable connections.
3. **Wide Applicability**: Suitable for a range of implementations, from simple tools to complex AI interactions.
4. **Scalability**: Supports a more diverse range of AI application scenarios.
5. **Developer-Friendly**: Lowers the technical barrier to implementing MCP.

### Implementation Reference

#### Server-Side Implementation Points

1. **Endpoint Design**:

   - Implement a single `/message` endpoint to handle all requests.
   - Support both POST and GET HTTP methods.

2. **State Management**:

   - Design a session ID generation and validation mechanism.
   - Implement session state storage (in-memory, Redis, etc.).

3. **Request Handling**:

   - Parse the session ID from the request.
   - Determine the response type (normal HTTP or SSE).
   - Handle the content type and format of streaming responses.

4. **Connection Management**:

   - Implement SSE stream initialization and maintenance.
   - Handle connection disconnection and reconnection logic.

#### Client-Side Implementation Points

1. **Request Construction**:

   - Construct messages that conform to the protocol format.
   - Correctly include the session ID (if any).

2. **Response Handling**:

   - Detect whether the response is normal HTTP or SSE.
   - Parse and handle SSE events.

3. **Session Management**:

   - Store and manage the session ID.
   - Implement disconnection/reconnection logic.

4. **Error Handling**:

   - Handle network errors and timeouts.
   - Implement an exponential backoff retry strategy.

### Summary

The Streamable HTTP transport layer represents a significant evolution of the MCP protocol. By combining the advantages of HTTP and SSE while overcoming their limitations, it provides a more flexible and reliable communication solution for AI applications. It not only solves the problems of the original transport mechanism but also lays the foundation for more complex AI interaction models in the future.

The design of this protocol fully embodies the principle of practicality, meeting advanced technical requirements while maintaining compatibility with existing web infrastructure. Its flexibility allows developers to choose the most suitable implementation method for their needs, from simple stateless APIs to complex interactive AI applications.

### Python SDK Implementation Reference

The MCP Python SDK now supports the Streamable HTTP protocol mode, though the SDK defaults to using the `/mcp` endpoint.

We just need to set the `transport` parameter to `streamable-http`, specify the server address and port with the `host` and `port` parameters, and override the default endpoint path with the `path` parameter, as shown below:

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

With just these few lines of code, we can implement a Streamable HTTP-type MCP server.

If we want to convert the previous SSE-type MCP server to a Streamable HTTP-type MCP server, we just need to set the `transport` parameter to `streamable-http`:

```bash
$ python main.py
🌤️ Starting Product MCP Server...
📍 Supported features:
  - Get product list (get_products)
  - Get inventory list (get_inventory)
  - Get order list (get_orders)
  - Create purchase order (create_purchase)

INFO:     Started server process [26897]
INFO:     Waiting for application startup.
[06/05/25 16:39:19] INFO     StreamableHTTP session manager started  streamable_http_manager.py:109
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8083 (Press CTRL+C to quit)
```

We can then access this MCP server at `http://localhost:8083/mcp`. For example, in Cursor, you can configure it as follows:

```json
{
  "mcpServers": {
    "product-mcp": {
      "url": "http://127.0.0.1:8083/mcp"
    }
  }
}
```

Then we can use this MCP server in Cursor, as shown below:

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749112893794.png)

Then we can use this MCP server in Cursor, as shown below:

![Cursor MCP](https://picdn.youdianzhishi.comhttps://static.claudemcp.com/images/1749113099093.png)

Similarly, on the client side, we can connect using Streamable HTTP mode, as shown below:

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
        # Create a session
        async with ClientSession(read_stream, write_stream) as session:
            # Initialize the session
            await session.initialize()
            # Call a tool
            tool_result = await session.call_tool("get_products", {})
            print(tool_result)

if __name__ == "__main__":
    asyncio.run(main())
```

Similarly, we use the SDK's `streamablehttp_client` to create a Streamable HTTP client, then create a client session with `ClientSession`, initialize the session with `session.initialize`, and call a tool with `session.call_tool`. The overall process is largely the same as with `stdio` and `sse` modes.

Using Streamable HTTP mode is more suitable for web applications than SSE mode because it better supports web application features like disconnection/resumption and session recovery, and it can handle large-scale concurrent requests. (You can try converting our previous web application to Streamable HTTP mode.)
