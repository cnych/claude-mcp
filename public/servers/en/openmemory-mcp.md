---
name: OpenMemory MCP Server
digest: OpenMemory is a local memory infrastructure powered by Mem0 that lets you carry your memory accross any AI app. It provides a unified memory layer that stays with you, enabling agents and assistants to remember what matters across applications.
author: mem0ai
homepage: https://mem0.ai/openmemory-mcp
repository: https://github.com/mem0ai/mem0/tree/main/openmemory
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - api
  - server
  - memory
icon: https://avatars.githubusercontent.com/u/137054526?s=48&v=4
createTime: 2025-05-14
featured: true
---

OpenMemory is a local memory infrastructure powered by Mem0 that lets you carry your memory accross any AI app. It provides a unified memory layer that stays with you, enabling agents and assistants to remember what matters across applications.

![openmemory-demo](/images/openmemory-mcp.png)

Today, we’re launching the first building block: the [OpenMemory MCP Server](/servers/openmemory-mcp) - a private, local-first memory layer with a built-in UI, compatible with all MCP-clients.

## What is the OpenMemory MCP Server

The **OpenMemory MCP Server** is a private, local-first memory server that creates a shared, persistent memory layer for your MCP-compatible tools. This runs entirely on your machine, enabling seamless context handoff across tools. Whether you're switching between development, planning, or debugging environments, your AI assistants can access relevant memory without needing repeated instructions.

The OpenMemory MCP Server ensures all memory stays **local, structured, and under your control** with no cloud sync or external storage.

## How the OpenMemory MCP Server Works

Built around the **Model Context Protocol (MCP)**, the OpenMemory MCP Server exposes a standardized set of memory tools:

- `add_memories`: Store new memory objects
- `search_memory`: Retrieve relevant memories
- `list_memories`: View all stored memory
- `delete_all_memories`: Clear memory entirely

Any MCP-compatible tool can connect to the server and use these APIs to persist and access memory.

## What It Enables

1.  **Cross-Client Memory Access**: Store context in Cursor and retrieve it later in Claude or Windsurf without repeating yourself.
2.  **Fully Local Memory Store**: All memory is stored on your machine. Nothing goes to the cloud. You maintain full ownership and control.
3.  **Unified Memory UI**: The built-in OpenMemory dashboard provides a central view of everything stored. Add, browse, delete and control memory access to clients directly from the dashboard.

## Supported Clients

The OpenMemory MCP Server is compatible with any client that supports the Model Context Protocol. This includes:

- **Cursor**
- **Claude Desktop**
- **Windsurf**
- **Cline, and more.**

As more AI systems adopt MCP, your private memory becomes more valuable.

---

## Installation and Setup

Getting started with OpenMemory is straightforward and takes just a few minutes to set up on your local machine. Follow these steps:

```bash
# Clone the repository
git clone <https://github.com/mem0ai/mem0.git>
cd openmemory

# Create the backend .env file with your OpenAI key
cd api
touch .env
echo "OPENAI_API_KEY=your_key_here" > .env

# Return to project root and build the Docker images
cd ..
make build

# Start all services (API server, vector database, and MCP server components)
make up

# Start the frontend
cp ui/.env.example ui/.env
make ui
```

**Configure Your MCP Client**  
To connect Cursor, Claude Desktop, or other MCP clients, you'll need your user ID. You can find it by running:

```bash
whoami
```

Then add the following configuration to your MCP client (replace `your-username` with your username):

```bash
npx install-mcp i "http://localhost:8765/mcp/<mcp-client>/sse/<your-username>" --client <mcp-client>
```

The OpenMemory dashboard will be available at `http://localhost:3000`. From here, you can view and manage your memories, as well as check connection status with your MCP clients.

Once set up, OpenMemory runs locally on your machine, ensuring all your AI memories remain private and secure while being accessible across any compatible MCP client.

### See it in action 🎥 

We’ve put together a short demo to show how it works in practice:

<video
src="https://mem0.ai/blog/content/media/2025/05/Mem0-openMemory.mp4"
poster="https://img.spacergif.org/v1/3340x2160/0a/spacer.png"
width="3340"
height="2160"
controls
playsinline
preload="metadata"
style="background: transparent url('https://mem0.ai/blog/content/media/2025/05/Mem0-openMemory_thumb.jpg') 50% 50% / cover no-repeat;"></video>

## Real-World Examples

**Scenario 1: Cross-Tool Project Flow** Define technical requirements of a project in Claude Desktop. Build in Cursor. Debug issues in Windsurf - all with shared context passed through OpenMemory.

**Scenario 2: Preferences That Persist** Set your preferred code style or tone in one tool. When you switch to another MCP client, it can access those same preferences without redefining them.

**Scenario 3: Project Knowledge**

Save important project details once, then access them from any compatible AI tool, no more repetitive explanations.

## Conclusion

The OpenMemory MCP Server brings **memory to MCP-compatible tools** without giving up control or privacy. It solves a foundational limitation in modern LLM workflows: the loss of context across tools, sessions, and environments.

By standardizing memory operations and keeping all data local, it reduces token overhead, improves performance, and unlocks more intelligent interactions across the growing ecosystem of AI assistants.

This is just the beginning. The MCP server is the first core layer in the OpenMemory platform - a broader effort to make memory portable, private, and interoperable across AI systems.

With OpenMemory MCP, your AI memories stay private, portable, and under your control, exactly where they belong.
