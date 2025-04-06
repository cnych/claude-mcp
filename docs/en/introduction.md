---
title: Introduction
description: Model Context Protocol Getting Started Guide
section: getting_started
next: architecture
pubDate: 2024-12-01
order: 1
---

# MCP Introduction

[MCP](https://www.claudemcp.com/), or Model Context Protocol, is an open-source protocol from Anthropic Claude that aims to establish unified context interaction between AI models and development environments. By providing standardized access to contextual information, it enables AI models to better understand and process code. It acts like a bridge between them, allowing developers to connect AI applications and data sources through a single standard.

[![Claude MCP Architecture](/images/claude-mcp.png "Claude MCP Architecture")](https://www.claudemcp.com/)

For example, in practical applications, through the Claude desktop application and with the help of the [MCP](https://www.claudemcp.com/) protocol, AI can help users manage GitHub projects, easily completing complex tasks from creating projects to submitting code requests, and doing so quickly. The emergence of this protocol promises to thoroughly solve the pain point of LLM (Large Language Model) applications struggling to connect with data, enabling cutting-edge models to generate better and more relevant responses, without needing custom integration code for each data source - a single [MCP](https://www.claudemcp.com/) protocol can handle connections to multiple data sources.

## Application Scenarios

### Code Management and Development

In terms of code development, Claude can directly connect to GitHub through the [MCP](https://www.claudemcp.com/) protocol. Developers can utilize Claude for automated programming, such as having AI write code, create repositories, push code, create issues, create branches, create PRs, and other operations, all without leaving the chat interface - developers only need to specify their requirements. This greatly improves development efficiency, partially freeing developers from tedious code operations and allowing them to focus more on their role as requirement providers.

### Data Management and Interaction

#### Local Resource Management

The [MCP](https://www.claudemcp.com/) protocol supports management of local resources, such as files on your computer and databases (like SQLite). Developers can use the [MCP](https://www.claudemcp.com/) protocol to let desktop Claude securely connect to local services, perform file creation, reading, editing, and other operations, as well as interact with database data through queries, updates, and more.

#### Remote Resource Interaction

For remote resources, such as data from platforms like GoogleDrive and Slack, Claude can directly control and access them through the [MCP](https://www.claudemcp.com/) protocol. This enables businesses and developers building AI applications to easily integrate data from different sources, such as business tools, software, content libraries, application development environments, and other sources, helping models generate more relevant responses to instructions.

### Building Intelligent Assistant Applications

As large models evolve from pure chatbots to Agent applications represented by intelligent assistants, the [MCP](https://www.claudemcp.com/) protocol can make AI systems smarter and more powerful. After developers connect AI systems to multiple data sources through the [MCP](https://www.claudemcp.com/) protocol, AI tools are no longer just simple Q&A systems, but become powerful tools capable of executing complex tasks, managing code, processing files, and communicating with external systems. For example, when building an internal enterprise intelligent assistant, the [MCP](https://www.claudemcp.com/) protocol can be used to connect various internal data resources (such as databases, file servers, etc.) and external business tools (such as project management tools), providing more comprehensive and efficient services for enterprise employees.

## Advantages and Disadvantages of Claude's [MCP](https://www.claudemcp.com/) Protocol

### Advantages

**Simplified Data Connection**

For developers, one of the biggest advantages of the [MCP](https://www.claudemcp.com/) protocol is that it **simplifies the connection between AI applications and data sources**. In the past, to connect LLM applications to different data sources, developers needed to write custom integration code for each data source, which was very troublesome and repetitive work. With the [MCP](https://www.claudemcp.com/) protocol, developers only need to integrate it once with their AI tools to connect to data sources anywhere. For example, whether connecting to a local database or remote platforms like GitHub and Slack, the same [MCP](https://www.claudemcp.com/) protocol can be used, greatly reducing development workload and improving efficiency.

**Enhanced Data Interaction Security**

All data interactions are conducted through a standardized protocol, meaning better control over data flow and prevention of data leaks. [MCP](https://www.claudemcp.com/) servers have built-in security mechanisms, allowing servers to control their own resources without giving API keys to LLM providers. For example, when Claude connects to an enterprise's internal database through the [MCP](https://www.claudemcp.com/) protocol, the [MCP](https://www.claudemcp.com/) server can interact with data while following enterprise security policies, protecting enterprise data security.

**Enhanced AI Application Functionality**

Makes AI applications more than just simple Q&A systems, transforming them into powerful tools capable of executing complex tasks, managing code, processing files, and communicating with external systems. For example, after connecting to GitHub through the [MCP](https://www.claudemcp.com/) protocol, Claude can perform a series of complex code management operations, from creating projects to submitting code requests, expanding the functional range of AI applications and enabling them to play roles in more business scenarios.

**Good Extensibility**

The [MCP](https://www.claudemcp.com/) protocol has good extensibility, providing features like `Prompts`, `Tools`, and `Sampling`. These features can easily extend AI applications' ability to interact with data sources, meeting the needs of different application scenarios. For example, developers can create new `Prompts` templates based on specific needs or use features in `Tools` to extend data processing capabilities, and as technology develops and new requirements emerge, AI behavior can be optimized through features like `Sampling`.

**Wide Data Format Support**

Supports a wide variety of data formats, including file content, database records, API responses, real-time system data, screenshots and images, log files, etc., covering almost all types. This makes the [MCP](https://www.claudemcp.com/) protocol applicable to various types of data interaction scenarios, capable of handling text data, image data, system operation data, and more.

### Disadvantages

**High Industry Standard Competition Pressure**

Currently, there are many competing standards in the field of data connection and interaction, and the [MCP](https://www.claudemcp.com/) protocol is just one of them, facing significant challenges to become an industry-wide standard. For example, in the AI field, other similar protocols or technologies are also constantly developing, which may disperse market attention and resources, hindering the promotion and popularization of the [MCP](https://www.claudemcp.com/) protocol.

**Potential Compatibility Issues**

Although the [MCP](https://www.claudemcp.com/) protocol aims to enable connection between different data sources and AI applications, compatibility issues may arise in practical applications. Due to the diversity of data sources and AI applications, some data sources or AI applications may experience incompatibility when integrating with the [MCP](https://www.claudemcp.com/) protocol. For example, some legacy systems or specially customized data sources may not integrate well with the [MCP](https://www.claudemcp.com/) protocol, requiring additional adaptation work.

**Questions About Protocol Essence**

Some view the [MCP](https://www.claudemcp.com/) as essentially just an engineering optimization solution, and not a perfect one at that. For example, some argue that in the most extreme case, directly providing HTTP interfaces to LLMs, recognizing JSON and making calls, is not fundamentally different from [MCP](https://www.claudemcp.com/), questioning whether it can be called a true protocol, and suggesting it might be more like a `FunctionCall + Proxy` combination.

**Currently Limited Application Scope**

Currently, [MCP](https://www.claudemcp.com/) only supports local operation (servers need to be on your own machine), and although official plans are underway to build remote server support with enterprise-level authentication (to support enterprise internal sharing), this limitation currently affects its application in broader scenarios to some extent. For example, for some application scenarios requiring data interaction across multiple devices or distributed environments, the current [MCP](https://www.claudemcp.com/) protocol may not meet the requirements.
