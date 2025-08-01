---
title: 简介
description: Model Context Protocol 中文入门指南
section: getting_started
next: architecture
pubDate: 2024-12-01
order: 1
---

# Claude MCP 简介

Claude [MCP](https://www.claudemcp.com/zh)，即模型上下文协议（Model Context Protocol），是 Anthropic Claude 的一个开源开放协议，旨在建立 AI 模型和开发环境之间的统一上下文交互，通过提供标准化的上下文信息访问，使 AI 模型能够更好地理解和处理代码。就像给它们之间搭建了一座桥梁，使得开发者可以通过一套标准将 AI 应用和数据源连接起来 。

[![Claude MCP 架构图](https://static.claudemcp.com/images/claude-mcp.png "Claude MCP 架构图")](https://www.claudemcp.com/zh)

例如，在实际应用中，通过 Claude 桌面应用，借助 [MCP](https://www.claudemcp.com/zh) 协议，AI 可以帮用户管理 GitHub 项目，从创建项目到提交代码请求等复杂任务都能轻松完成，而且速度很快。这一协议的出现，有望彻底解决 LLM（大型语言模型）应用连接数据难的痛点，让前沿模型生成更好、更相关的响应，不再需要为每个数据源写定制的集成代码，一个 [MCP](https://www.claudemcp.com/zh) 协议就可以搞定与多种数据源的连接 。

## 应用场景

### 代码管理与开发

在代码开发方面，Claude 通过 [MCP](https://www.claudemcp.com/zh) 协议可以直接连接 GitHub。开发人员可以利用 Claude 自动化编程，例如让 AI 自己写代码、创建仓库、Push 代码、创建 Issue、创建分支、创建 PR 等操作，全程无需离开聊天界面，开发人员仅需提出需求即可 。这大大提高了开发效率，将开发人员从繁琐的代码操作中部分解放出来，更多地扮演需求提出者的角色。

### 数据管理与交互

#### 本地资源管理

[MCP](https://www.claudemcp.com/zh) 协议支持对本地资源的管理，如电脑里的文件、数据库（像 SQLite 数据库）等。开发人员可以使用 [MCP](https://www.claudemcp.com/zh) 协议让桌面版 Claude 安全连接本地服务，进行文件的创建、读取、编辑等操作，还能对数据库中的数据进行交互操作，例如查询、更新等 。

#### 远程资源交互

对于远程资源，如 `GoogleDrive`、`Slack` 等平台的数据，Claude 借助 [MCP](https://www.claudemcp.com/zh) 协议可以直接进行控制和访问。这使得企业和开发者在构建 AI 应用时，能够轻松整合不同来源的数据，如从商业工具、软件、内容库、应用程序开发环境等各种来源提取资料，协助模型产生与指令更相关的回复 。

### 构建智能助手应用

随着大模型从纯聊天机器人走向以智能助手为代表的 Agent 应用，[MCP](https://www.claudemcp.com/zh) 协议可以让 AI 系统更加智能和强大。开发人员通过 [MCP](https://www.claudemcp.com/zh) 协议将 AI 系统与多个数据源相连接后，AI 工具不再只是简单的问答系统，而是变成了一个能够执行复杂任务、管理代码、处理文件和与外部系统通信的强大工具。例如，在构建一个企业内部的智能助手时，可以利用 [MCP](https://www.claudemcp.com/zh) 协议连接企业内部的各种数据资源（如数据库、文件服务器等）以及外部相关的业务工具（如项目管理工具等），为企业员工提供更全面、更高效的服务。

## Claude [MCP](https://www.claudemcp.com/zh) 协议的优缺点

### 优点

**简化数据连接**

对于开发人员来说，[MCP](https://www.claudemcp.com/zh) 协议最大的优点之一就是**简化了 AI 应用与数据源之间的连接**。在过去，为了让 LLM 应用连接不同的数据源，开发者需要为每个数据源写定制的集成代码，这是非常麻烦且重复的工作。而有了 [MCP](https://www.claudemcp.com/zh) 协议，开发人员只需将其与他们的 AI 工具集成一次，就可以连接到任何地方的数据源。例如，无论是连接本地的数据库，还是像 GitHub、Slack 这样的远程平台，都可以使用同一个 [MCP](https://www.claudemcp.com/zh) 协议，大大减少了开发工作量，提高了开发效率 。

**提高数据交互的安全性**

所有的数据交互都是通过标准化的协议进行的，这意味着可以更好地控制数据的流动，防止数据泄露。[MCP](https://www.claudemcp.com/zh) 服务器内置了安全机制，允许服务器自己控制资源，不用把 API 密钥给 LLM 提供商。例如，当 Claude 通过 [MCP](https://www.claudemcp.com/zh) 协议连接到企业内部的数据库时，[MCP](https://www.claudemcp.com/zh) 服务器可以在遵循企业安全策略的前提下进行数据交互，保护企业数据的安全 。

**增强 AI 应用的功能**

使 AI 应用不再只是一个简单的问答系统，而是变成了一个能够执行复杂任务、管理代码、处理文件和与外部系统通信的强大工具。例如，通过 [MCP](https://www.claudemcp.com/zh) 协议连接到 GitHub 后，Claude 可以进行一系列复杂的代码管理操作，从创建项目到提交代码请求等，拓宽了 AI 应用的功能范围，使其在更多的业务场景中发挥作用 。

**良好的可扩展性**

[MCP](https://www.claudemcp.com/zh) 协议具有良好的可扩展性，提供了 `Prompts`、`Tools`、`Sampling` 等功能。这些功能可以方便地扩展 AI 应用与数据源交互的能力，满足不同应用场景的需求。例如，开发人员可以根据具体需求创建新的 `Prompts` 模板或者利用 `Tools` 中的功能来扩展数据处理能力，并且随着技术的发展和新需求的出现，可以通过 `Sampling` 等功能优化 AI 的行为 。

**数据形式支持广泛**

支持的数据形式非常多样，包括文件内容、数据库记录、API 响应、实时系统数据、屏幕截图和图像、日志文件等，几乎覆盖了所有类型。这使得 [MCP](https://www.claudemcp.com/zh) 协议可以适用于各种不同类型的数据交互场景，无论是处理文本数据、图像数据还是系统运行数据等都可以胜任 。

### 缺点

**行业标准竞争压力大**

当前在数据连接和交互领域有众多的标准在竞争，[MCP](https://www.claudemcp.com/zh) 协议只是其中之一，要想成为行业通用标准面临很大的挑战。例如，在 AI 领域，其他类似的协议或技术也在不断发展，可能会分散市场的注意力和资源，使得 [MCP](https://www.claudemcp.com/zh) 协议的推广和普及受到一定的阻碍 。

**可能存在兼容性问题**

虽然 [MCP](https://www.claudemcp.com/zh) 协议旨在实现不同数据源和 AI 应用的连接，但在实际应用中可能会遇到兼容性问题。由于数据源和 AI 应用的多样性，可能存在某些数据源或者 AI 应用在与 [MCP](https://www.claudemcp.com/zh) 协议集成时出现不兼容的情况。例如，一些老旧的系统或者特殊定制的数据源可能无法很好地与 [MCP](https://www.claudemcp.com/zh) 协议进行对接，需要进行额外的适配工作。

**对协议本质存在质疑**

有观点认为 [MCP](https://www.claudemcp.com/zh) 本质上只是一个工程优化的方案，而且并不是一个非常完美的工程优化方案。例如，有人觉得最暴力的情况下，甚至直接提供 HTTP 接口给 LLM，识别 Json 并进行调用，这和 [MCP](https://www.claudemcp.com/zh) 没有本质上的区别，质疑其是否能够称之为一个真正的协议，本质上可能更像是 `FunctionCall + Proxy` 的组合 。

**目前应用范围受限**

目前 [MCP](https://www.claudemcp.com/zh) 仅支持本地运行（服务器需要在自己的机器上），虽然官方正计划构建具有企业级身份验证的远程服务器支持（为企业内部共享提供支持），但目前这种限制在一定程度上影响了其在更广泛场景下的应用。例如，对于一些需要在多台设备或者分布式环境下进行数据交互的应用场景，目前的 [MCP](https://www.claudemcp.com/zh) 协议可能无法满足需求。
