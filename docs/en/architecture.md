---
title: Architecture
description: Claude MCP (Model Context Protocol) Protocol Architecture
section: getting_started
prev: introduction
next: protocol
pubDate: 2024-12-02
order: 2
---

# MCP Architecture

The MCP protocol follows a client-host-server architecture where each host can run multiple client instances. This architecture enables users to integrate AI capabilities across applications while maintaining clear security boundaries and isolating issues. Built on `JSON-RPC`, MCP provides a stateful session protocol focused on context exchange and sampling coordination between clients and servers.

## MCP Protocol Architecture

MCP follows a client-server architecture. The MCP protocol architecture is shown in the diagram below:

```mermaid
graph LR
    subgraph "Application Host Process"
        H[Host]
        C1[Client 1]
        C2[Client 2]
        C3[Client 3]
        H --> C1
        H --> C2
        H --> C3
    end

    subgraph "Local Machine"
        S1[Server 1<br>File & Git]
        S2[Server 2<br>Database]
        R1[("Local<br>Resource A")]
        R2[("Local<br>Resource B")]

        C1 --> S1
        C2 --> S2
        S1 <--> R1
        S2 <--> R2
    end

    subgraph "Internet"
        S3[Server 3<br>External API]
        R3[("Remote<br>Resource C")]

        C3 --> S3
        S3 <--> R3
    end
```

Here, three roles are mainly involved: **Host**, **Server**, and **Client**.

- The host is an LLM application (such as Claude Desktop or IDE) that initiates the connection.
- The client maintains a 1:1 connection with the server within the host application.
- The server provides context, tools, and prompts to the client.

### Host

The host process is the central component of the MCP protocol, responsible for managing the lifecycle of client instances and coordinating communication between clients and servers. The host can run multiple client instances, each of which can connect to different servers. The host communicates with clients and servers using the JSON-RPC protocol.

- Manage the lifecycle of client instances
- Control connection permissions and execute security policies
- Coordinate AI/LLM integration
- Ensure system stability

### Server

The server is the resource storage and processing center of the MCP protocol, responsible for storing and managing local and remote resources and providing them to clients. The server can run multiple server instances, each of which can handle different types of resources. The server communicates with the host and clients using the JSON-RPC protocol.

- Expose specific resources and tools
- Independently run and manage
- Process requests through clients
- Support local and remote services

### Client

The client is used to maintain an independent connection between the host and the server, and to handle user input and output. Each client maintains a 1:1 relationship with a server, ensuring isolation and security of the connection.

- Maintain an independent connection with the server
- Establish a stateful session
- Handle protocol negotiation
- Manage message routing
