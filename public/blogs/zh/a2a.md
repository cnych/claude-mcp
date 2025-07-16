---
title: A2A 协议详解
excerpt: A2A 协议是 Google 推出的智能体之间的通信协议，本文将详细介绍 A2A 协议的原理、特点、应用场景及实现方式。
date: 2025-07-15
slug: a2a
coverImage: https://static.claudemcp.com/images/blog/a2a.png
featured: true
author:
  name: 阳明
  avatar: https://static.claudemcp.com/images/avatars/yangming.png
category: 技术
---

[A2A](https://www.a2aprotocol.net)，即 `Agent to Agent` 协议，是由 Google 推出的开源协议，旨在实现 AI 智能体之间的通信和互操作性。通过为智能体提供标准化的协作方式，无论其底层框架或供应商如何，该协议使 AI 智能体能够安全地交换信息、协调行动，并跨各种企业平台和应用程序工作。简单来说，就是解决**不同团队、使用不同技术、由不同组织拥有的 AI 智能体如何有效地沟通和协作？**

## 为什么需要 A2A

随着 AI 智能体变得越来越专业和强大，它们在复杂任务上协同工作的需求也在增加。想象一下，一个用户请求他们的主要 AI 智能体来规划一次国际旅行，这个单一请求可能就会涉及协调几个专业智能体的能力：

1. 一个用于航班预订的智能体。
2. 一个用于酒店预订的智能体。
3. 第三个用于本地旅游推荐和预订的智能体。
4. 第四个用于处理货币转换和旅行建议的智能体。

没有一个共同的通信协议，将这些不同的智能体整合成一个统一的用户体验是一个重大的工程难题。每个集成都可能是一个定制的点对点解决方案，使得系统难以扩展、维护和延伸。

## 应用场景

**企业自动化**

在企业环境中，A2A 使智能体能够跨孤立的数据系统和应用程序工作。例如，供应链规划智能体可以与库存管理、物流和采购智能体协调，即使它们由不同的供应商或在不同的框架中构建。这增加了自主性并提高了生产力，同时降低了长期成本。

**多智能体协作**

A2A 协议实现了真正的多智能体场景，智能体可以在其自然、非结构化的模式中协作，即使它们不共享内存、工具和上下文。这超越了简单地将一个智能体用作另一个智能体的"工具" - 它允许每个智能体在处理复杂任务时保持自己的能力。

**跨平台集成**

对于商业应用，A2A 允许 AI 智能体跨整个企业应用程序生态工作。这意味着智能体可以访问和协调跨各种平台的其他智能体，如 CRM 系统、知识库、项目管理工具等。跨多样化平台和云环境管理智能体的标准化方法对于实现协作 AI 的潜力至关重要。

## 工作原理

![A2A 工作原理](https://static.claudemcp.com/images/blog/a2a-workflow.png)

A2A 方便了“客户端”智能体与“远程”智能体之间的通信。客户端智能体负责制定和传达任务，而远程智能体负责执行这些任务，力图提供正确的信息或采取正确的行动。这种交互涉及几个关键功能：

- **能力发现**：智能体可以使用 JSON 格式的`智能体名片（Agent Card）`来暴露其能力。这使客户端智能体能够识别最适合执行任务的智能体，并利用 A2A 与远程智能体通信。例如，客户端智能体可能发现另一个智能体专门处理财务数据，并将财务分析任务委托给它。

- **任务管理**：客户端和远程智能体之间的通信以任务完成为导向，智能体共同工作以满足最终用户请求。这个`任务`对象由协议定义，具有生命周期。它可以立即完成，或者对于长时间运行的任务，每个智能体可以相互通信以保持同步。任务的输出被称为 `Artifact`，即`制品`。

- **协作**：智能体可以相互发送消息，传达上下文、回复、制品或用户指令。这为智能体创建了一种结构化的方式，以共享完成任务所需的信息。例如，一个智能体可能提供关于用户偏好的上下文，而另一个智能体可能返回分析结果。

- **协商**：每条消息都包含一个 `parts`，这是一个完整形成的内容片段，如生成的文本或图像。每个部分都有指定的内容类型，允许客户端和远程智能体协商所需的正确格式，并明确包含对用户 UI 功能的协商，如 iframe、视频、Web 表单等。

## 核心概念

上面我们提到了 A2A 的基本工作原理，该协议中涉及到一系列核心概念，通过这些概念来定义智能体之间的互动。

![A2A 核心概念](https://static.claudemcp.com/images/blog/a2a-core.png)

### 参与者

首先我们要明确 A2A 协议里面的参与者，包括用户、客户端、服务器：

- **用户**：发起请求的最终用户（人类或自动化服务），该请求或目标需要智能体的协助。
- **A2A 客户端（客户端智能体）**：一种应用程序、服务或其他 AI 智能体，代表用户请求远程智能体的操作或信息。客户端使用 A2A 协议发起通信。
- **A2A 服务器（远程智能体）**：一个 AI 智能体或智能体系统，暴露一个实现 A2A 协议的 HTTP 端点。它接收来自客户端的请求，处理任务，并返回结果或状态更新。对于客户端而言，远程智能体作为一个“不可见”的系统运行，客户端无需了解其内部实现。

### 通信元素

明确了参与者后，接下来的重点就是通信协议，也就是如何来实现这些参与者之间的通信。

**智能体名片**

- 一个 JSON 元数据文档，通常可以通过 `/.well-known/agent.json` 的 URL 发现，该文档描述了 A2A 服务器。
- 它详细说明了智能体的身份（名称、描述）、服务端点 URL、版本、支持的 A2A 功能（如流媒体或推送通知）、提供的特定技能、默认输入/输出方式以及认证要求。
- 客户端使用智能体名片来发现智能体并了解如何安全有效地与其互动。

**任务**

- 当客户端向智能体发送消息时，智能体可能会判断满足请求需要完成一个任务（例如，“生成报告”，“预订航班”，“回答问题”）。
- 每个任务都有一个由智能体定义的唯一 ID，并通过一个定义的生命周期进行推进（例如 `submitted`、`working` 、`input-required` 、`completed` 、`failed` ）。
- 任务是有状态的，并且可能涉及到客户端与服务器之间的多次交换（消息）。

**消息**

- 表示客户端与智能体之间的单个回合或通信单元。
- 消息是具有一个角色 `role`（客户端发送的消息为 `user`，服务器发送的消息为 `agent`），并包含一个或多个 `Part` 对象，这些对象承载实际内容。消息对象的 `messageId` 部分是由消息发送者设置的每条消息的唯一标识符。
- 用于传达指令、上下文、问题、答案或状态更新，这些内容不一定是正式的 `Artifacts`。

**Part（片段）**

- 消息或 `Artifact` 中的基本内容单元。每个片段都有特定的 `type`，并可以携带不同种类的数据：
  - `TextPart`：包含纯文本内容。
  - `FilePart`：表示一个文件，可以作为内联的 base64 编码字节传输或通过 URI 引用。包括文件名和媒体类型等元数据。
  - `DataPart`：携带结构化的 JSON 数据，适用于表单、参数或任何机器可读的信息。

**Artifact（制品）**

- 表示远程智能体在处理任务期间生成的输出结果。
- 比如生成的文档、图像、电子表格、结构化数据或任何其他自包含的信息片段，这些都是任务的直接结果。
- `Artifact` 由一个或多个 `Part` 对象组成，并可以增量流式传输。

### 交互机制

**请求/响应（轮询）**

- 客户端发送请求（例如，使用 `message/send` RPC 方法）并从服务器接收响应。
- 如果交互需要一个有状态的长时间运行的任务，服务器可能会最初以 `working` 状态进行响应。然后客户端会定期调用 `tasks/get` 进行轮询，直到任务达到终端状态（例如，`completed`，`failed`）。

**流式传输（SSE）**

- 用于逐步产生结果或提供实时进度更新的任务。
- 客户端使用 `message/stream` 向服务器发起交互。
- 服务器以保持开放的 HTTP 连接进行响应，通过该连接发送服务器发送事件（SSE）流。
- 这些事件可以是 `Task`、`Message`，或 `TaskStatusUpdateEvent`（用于状态变化）或 `TaskArtifactUpdateEvent`（用于新的或更新的制品）。
- 这要求服务器在其智能体名片中宣传 `streaming` 能力。

**推送通知**

- 对于非常长时间运行的任务或在维持持久连接（如 SSE）不切实际的场景。
- 客户端可以在启动任务时提供一个 webhook URL（或通过调用 `tasks/pushNotificationConfig/set` ）。
- 当任务状态发生显著变化（例如 `completed`、`failed` 或 `input-required`）时，服务器可以向该客户端提供的 webhook 发送异步通知（一个 HTTP POST 请求）。
- 这要求服务器在其智能体名片中声明 `pushNotifications` 功能。

### 其他概念

- **上下文 (contextId)**: 由服务器生成的标识符，可用于逻辑上将多个相关的任务对象分组，为一系列交互提供上下文。
- **传输和格式**: A2A 通信通过 HTTP(S)进行，所有请求和响应的有效负载格式使用 JSON-RPC 2.0。
- **认证与授权**: A2A 依赖于标准的网络安全实践。认证要求在智能体名片中声明，凭证（例如 OAuth 令牌、API 密钥）通常通过 HTTP Header 传递，与 A2A 协议消息本身分开。
- **代理发现**: 客户端查找智能体名片以了解可用的 A2A 服务器及其功能的过程。
- **扩展**: A2A 允许智能体在其智能体名片中声明自定义协议扩展。

通过理解这些核心组件和机制，开发者可以有效地设计、实现和利用 A2A 来构建可互操作和协作的 AI 代理系统。

## 用户案例

以下是 A2A 在企业场景中使用的一个真实例子。一名新员工在一家公司被录用，多个系统和部门参与入职流程：

- HR 需要创建记录并发送欢迎邮件
- IT 部门需要提供笔记本电脑和公司账户
- 设施部门需要准备办公桌和通行证

传统上，这些步骤是手动处理或通过内部系统之间的紧耦合集成处理。现在如果每个部门都使用 A2A 协议暴露其自己的智能体：

| **智能体**                     | **职责**                         |
| ------------------------------ | -------------------------------- |
| `hr-agent.company.com`         | 创建员工记录，发送文档           |
| `it-agent.company.com`         | 创建电子邮箱账户，订购笔记本电脑 |
| `facilities-agent.company.com` | 分配桌子，打印通行证             |

假如我们有一个多智能体系统 `OnboardingPro` （例如 `onboarding-agent.company.com`），它协调整个入职工作流程。

1. **发现**：它读取每个智能体的 `.well-known/agent.json` 以了解其能力和认证。
2. **任务委派**：
   - 向 HR 智能体发送 `createEmployee` 任务。
   - 向 IT 智能体发送 `setupEmailAccount` 和 `orderHardware` 任务。
   - 向设施智能体发送 `assignDesk` 和 `generateBadge` 任务。
3. **持续更新**：智能体使用服务器发送事件流回进度（例如“笔记本电脑已发货”，“桌子已分配”）。
4. **制品收集**：最终结果（例如 PDF 通行证、确认电子邮件、账户凭证）作为 A2A 制品返回。
5. **完成**：`OnboardingPro` 通知招聘经理入职完成。

![A2A 用户案例](https://static.claudemcp.com/images/blog/a2a-usercase.png)

## A2A 和 MCP

前面我们已经详细介绍了 [MCP 协议](https://www.claudemcp.com)，有人可能会认为 A2A 协议与 MCP 协议是替代关系，实际上并不是，这二者是互补的关系，MCP 协议主要关注如何让 AI 模型动态访问外部数据源、调用外部工具，并实时获得相关信息来执行任务。如果 MCP 是套筒扳手（用于工具），那么 A2A 就是机械师之间的对话（用于协作）。这两个协议在功能上形成完美互补。我们建议将 MCP 用于工具，将 A2A 用于智能体。

- MCP：专注于单个 AI 模型与外部工具和数据源的连接（模型到数据/工具）
- A2A：专注于多个 AI 智能体之间的通信和协作（智能体到智能体）

![A2A 与 MCP](https://static.claudemcp.com/images/blog/a2a-mcp-1.png)

> 一个智能体应用可能会使用 A2A 与其他智能体进行通信，而每个智能体内部则使用 MCP 与其特定的工具和资源进行交互。

## A2A 协议

了解了 A2A 的一些基本概念后，接下来我们可以来详细了解下 A2A 的具体协议是如何定义的（0.2.2 版本）。

A2A 通信必须通过 HTTP(S) 进行，所有请求和响应的有效负载格式使用 JSON-RPC 2.0。A2A 服务器在其 `AgentCard` 中定义的 URL 上提供服务。

### 智能体发现

A2A 服务器**必须**提供智能体名片。智能体名片是一个 JSON 文档，描述了服务器的身份、能力、技能、服务端点 URL，以及客户端应如何进行身份验证和与之交互。客户端使用这些信息来发现合适的智能体并配置其交互。

客户端可以通过多种方法来找到智能体卡片，包括：

- **URI 策略**：访问智能体域上的预定义路径，智能体路径推荐位置是 `https://{server_domain}/.well-known/agent.json`，这也是推荐的方式
- **注册表/目录**：智能体目录或注册表
- **直接配置**：客户端可以预先配置智能体卡片的 URL 或卡片内容本身

智能体名片本身可能包含敏感的息。

- 如果智能体名片包含敏感信息，提供该名片的端点**必须**受到适当的访问控制保护（例如 mTLS、网络限制、获取名片时需要认证）。
- 通常不推荐在智能体名片中直接包含明文密钥（如静态 API 密钥）。

#### AgentCard 对象结构

`AgentCard` 的对象结构如下所示：

```typescript
/**
 * 一个 AgentCard 传达了关键信息：
 * - 整体信息（版本、名称、描述、用途）
 * - Skills：一组智能体可以执行的能力
 * - 默认的模态/内容类型支持。
 * - 认证要求
 */
export interface AgentCard {
  /**
   * 人类可读的智能体名称。
   * @example "Recipe Agent"
   */
  name: string;
  /**
   * 人类可读的智能体描述。用于帮助用户和其他智能体理解智能体可以做什么。
   * @example "Agent that helps users with recipes and cooking."
   */
  description: string;
  /** 智能体所在地址的 URL。 */
  url: string;
  /** 智能体图标的 URL。 */
  iconUrl?: string;
  /** 智能体的服务提供者 */
  provider?: AgentProvider;
  /**
   * 智能体的版本 - 格式由提供者决定。
   * @example "1.0.0"
   */
  version: string;
  /** 智能体文档的 URL。 */
  documentationUrl?: string;
  /** 智能体支持的可选能力。 */
  capabilities: AgentCapabilities;
  /** 用于认证的 Security scheme 详细信息。 */
  securitySchemes?: { [scheme: string]: SecurityScheme };
  /** 访问智能体的安全要求。 */
  security?: { [scheme: string]: string[] }[];
  /**
   * 智能体支持的所有技能的交互模式。这可以针对每个技能进行覆盖。
   * 支持的输入媒体类型。
   */
  defaultInputModes: string[];
  /** 支持的输出媒体类型。 */
  defaultOutputModes: string[];
  /** 技能是智能体可以执行的能力单位。 */
  skills: AgentSkill[];
  /**
   * 如果智能体支持在用户认证时提供扩展的智能体名片，则为 true。
   * 如果未指定，默认为 false。
   */
  supportsAuthenticatedExtendedCard?: boolean;
}
```

其中 `AgentProvider` 对象的结构如下所示：

```typescript
/**
 * 表示智能体的服务提供者。
 */
export interface AgentProvider {
  /** 智能体提供者的组织名称。 */
  organization: string;
  /** 智能体提供者的 URL：比如网站 URL。 */
  url: string;
}
```

`AgentCapabilities` 对象的结构如下所示，该字段用来指定智能体支持的可选 A2A 协议特性。

```typescript
/**
 * 定义智能体支持的可选 A2A 协议特性。
 */
export interface AgentCapabilities {
  /** 如果智能体支持 SSE，则为 true。 */
  streaming?: boolean;
  /** 如果智能体可以通知客户端更新，则为 true。 */
  pushNotifications?: boolean;
  /** 如果智能体暴露任务状态变化历史，则为 true。 */
  stateTransitionHistory?: boolean;
  /** 智能体支持的扩展。 */
  extensions?: AgentExtension[];
}
```

`AgentExtension` 对象的结构如下所示，指定智能体支持的 A2A 协议的扩展。

```typescript
/**
 * 声明智能体支持的扩展。
 */
export interface AgentExtension {
  /** 扩展的 URI。 */
  uri: string;
  /** 描述智能体如何使用此扩展。 */
  description?: string;
  /** 客户端是否必须遵循扩展的特定要求。 */
  required?: boolean;
  /** 扩展的可选配置。 */
  params?: { [key: string]: any };
}
```

其中最重要的一个字段当属 `AgentSkill` 对象，用来描述智能体可以执行或处理的特定能力、功能或专业领域。

```typescript
/**
 * 表示智能体可以执行的特定能力、功能或专业领域。
 */
export interface AgentSkill {
  /** 智能体技能的唯一标识符。 */
  id: string;
  /** 人类可读的技能名称。 */
  name: string;
  /**
   * 技能的描述 - 将由客户端或人类作为提示来理解技能的作用。
   */
  description: string;
  /**
   * 一组描述特定技能能力的标签词。
   * @example ["cooking", "customer support", "billing"]
   */
  tags: string[];
  /**
   * 技能可以执行的示例场景。
   * 将由客户端作为提示来理解技能如何使用。
   * @example ["I need a recipe for bread"]
   */
  examples?: string[];
  /**
   * 技能支持的交互模式（如果与默认不同）。
   * 支持的输入媒体类型。
   */
  inputModes?: string[];
  /** 支持的输出媒体类型。 */
  outputModes?: string[];
}
```

我们可以用一个示例来理解 `AgentSkill` 对象的结构，如下所示：

```json
{
  "name": "GeoSpatial Route Planner Agent",
  "description": "Provides advanced route planning, traffic analysis, and custom map generation services. This agent can calculate optimal routes, estimate travel times considering real-time traffic, and create personalized maps with points of interest.",
  "url": "https://georoute-agent.example.com/a2a/v1",
  "provider": {
    "organization": "Example Geo Services Inc.",
    "url": "https://www.examplegeoservices.com"
  },
  "iconUrl": "https://georoute-agent.example.com/icon.png",
  "version": "1.2.0",
  "documentationUrl": "https://docs.examplegeoservices.com/georoute-agent/api",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true,
    "stateTransitionHistory": false
  },
  "securitySchemes": {
    "google": {
      "type": "openIdConnect",
      "openIdConnectUrl": "https://accounts.google.com/.well-known/openid-configuration"
    }
  },
  "security": [{ "google": ["openid", "profile", "email"] }],
  "defaultInputModes": ["application/json", "text/plain"],
  "defaultOutputModes": ["application/json", "image/png"],
  "skills": [
    {
      "id": "route-optimizer-traffic",
      "name": "Traffic-Aware Route Optimizer",
      "description": "Calculates the optimal driving route between two or more locations, taking into account real-time traffic conditions, road closures, and user preferences (e.g., avoid tolls, prefer highways).",
      "tags": ["maps", "routing", "navigation", "directions", "traffic"],
      "examples": [
        "Plan a route from '1600 Amphitheatre Parkway, Mountain View, CA' to 'San Francisco International Airport' avoiding tolls.",
        "{\"origin\": {\"lat\": 37.422, \"lng\": -122.084}, \"destination\": {\"lat\": 37.7749, \"lng\": -122.4194}, \"preferences\": [\"avoid_ferries\"]}"
      ],
      "inputModes": ["application/json", "text/plain"],
      "outputModes": [
        "application/json",
        "application/vnd.geo+json",
        "text/html"
      ]
    },
    {
      "id": "custom-map-generator",
      "name": "Personalized Map Generator",
      "description": "Creates custom map images or interactive map views based on user-defined points of interest, routes, and style preferences. Can overlay data layers.",
      "tags": ["maps", "customization", "visualization", "cartography"],
      "examples": [
        "Generate a map of my upcoming road trip with all planned stops highlighted.",
        "Show me a map visualizing all coffee shops within a 1-mile radius of my current location."
      ],
      "inputModes": ["application/json"],
      "outputModes": [
        "image/png",
        "image/jpeg",
        "application/json",
        "text/html"
      ]
    }
  ],
  "supportsAuthenticatedExtendedCard": true
}
```

### 协议数据对象

上面的 `AgentCard` 对象是是用来描述智能体本身的信息，这些信息是用来帮助客户端发现和理解智能体，就相当于智能体的一张名片。而下面的这些对象则是用来定义在 A2A 协议的 `JSON-RPC` 方法中交换的数据结构。

#### Task 任务相关对象

**Task** 对象：

`Task` 对象表示 A2A 服务器为 A2A 客户端处理的有状态工作单元，一个任务封装了与特定目标或请求相关的整个交互。

```typescript
export interface Task {
  /** 任务的唯一标识符 */
  id: string;
  /** 服务器生成的上下文标识符，用于跨交互的上下文对齐 */
  contextId: string;
  /** 任务的当前状态 */
  status: TaskStatus;
  /** 任务的历史消息 */
  history?: Message[];
  /** 由智能体创建的制品集合 */
  artifacts?: Artifact[];
  /** 扩展元数据 */
  metadata?: {
    [key: string]: any;
  };
  /** 事件类型 */
  kind: "task";
}
```

**TaskStatus** 对象：

表示 `Task` 的当前状态及相关上下文（例如，来自智能体的消息）。

```typescript
/** TaskState and accompanying message. */
export interface TaskStatus {
  state: TaskState;
  /** 客户端的附加状态更新 */
  message?: Message;
  /**
   * ISO 8601 datetime string when the status was recorded.
   * @example "2023-10-27T10:00:00Z"
   * */
  timestamp?: string;
}
```

**TaskState**

定义了 Task 的可能生命周期状态。

```typescript
/** 表示 Task 的可能状态。 */
export enum TaskState {
  Submitted = "submitted",
  Working = "working",
  InputRequired = "input-required",
  Completed = "completed",
  Canceled = "canceled",
  Failed = "failed",
  Rejected = "rejected",
  AuthRequired = "auth-required",
  Unknown = "unknown",
}
```

| 值               | 描述                                                                           | 终端？     |
| ---------------- | ------------------------------------------------------------------------------ | ---------- |
| `submitted`      | 任务已被服务器接收并确认，但处理尚未积极开始。                                 | 不         |
| `working`        | 任务正在被代理积极处理。客户端可以期待进一步的更新或终端状态。                 | 不         |
| `input-required` | 代理需要来自客户端/用户的额外输入才能继续。任务实际上已暂停。                  | 否（暂停） |
| `completed`      | 任务成功完成。结果通常可以在 `Task.artifacts` 或 `TaskStatus.message` 中找到。 | 是的       |
| `canceled`       | 任务已被取消（例如，通过 `tasks/cancel` 请求或服务器端策略）。                 | 是的       |
| `failed`         | 任务因处理过程中出现错误而终止。`TaskStatus.message` 可能包含错误详情。        | 是的       |
| `rejected`       | 任务因远程代理拒绝而终止。`TaskStatus.message` 可能包含错误详情。              | 是的       |
| `auth-required`  | 代理需要客户端/用户提供额外的认证才能继续。任务实际上已暂停。                  | 否（暂停） |
| `unknown`        | 无法确定任务的状态（例如，任务 ID 无效、未知或已过期）。                       | 是的       |

#### Message 对象

表示客户端与智能体之间的单次通信轮次或一条上下文信息。消息用于指令、提示、回复和状态更新。

```typescript
/** 表示客户端与智能体之间的单次通信轮次或一条上下文信息。 */
export interface Message {
  /** 消息发送者的角色 */
  role: "user" | "agent";
  /** 消息内容 */
  parts: Part[];
  /** 扩展元数据。 */
  metadata?: {
    [key: string]: any;
  };
  /** 消息中存在的扩展的 URI。 */
  extensions?: string[];
  /** 消息引用的任务列表。 */
  referenceTaskIds?: string[];
  /** 消息创建者创建的标识符 */
  messageId: string;
  /** 消息关联的任务的标识符 */
  taskId?: string;
  /** 消息关联的上下文标识符 */
  contextId?: string;
  /** 事件类型 */
  kind: "message";
}
```

#### Part 对象

表示在 `Message` 或 `Artifact` 中的一个独特内容片段。`Part` 是一个联合类型，表示可导出的内容，可以是 `TextPart`、`FilePart` 或 `DataPart`。所有 `Part` 类型还包括一个可选的 `metadata` 字段（`Record<string, any>`），用于特定于部分的元数据。

```typescript
/** 表示消息或制品中的一个独特内容片段，可以是文本、文件或结构化数据。 */
export type Part = TextPart | FilePart | DataPart;
```

它**必须**是以下之一：

**TextPart**

用于传输纯文本内容。

```typescript
// 文本片段
export interface TextPart extends PartBase {
  /** 部分类型 - 文本部分 */
  kind: "text";
  /** 文本内容 */
  text: string;
}
```

**FilePart**

用于传递基于文件的内容。

```typescript
// 文件片段
export interface FilePart extends PartBase {
  /** 部分类型 - 文件部分 */
  kind: "file";
  /** 文件内容，可以是 URL 或字节 */
  file: FileWithBytes | FileWithUri;
}
```

其中 `FileWithBytes` 表示文件的数据。

```typescript
export interface FileWithBytes extends FileBase {
  /** 文件的 base64 编码内容 */
  bytes: string;
  uri?: never;
}
```

`FileWithUri` 表示文件的 URL。

```typescript
export interface FileWithUri extends FileBase {
  /** 文件内容的 URL */
  uri: string;
  bytes?: never;
}
```

**DataPart**

用于传递结构化的 JSON 数据。适用于表单、参数或任何机器可读的信息。

```typescript
/** 一个结构化的数据片段 */
export interface DataPart extends PartBase {
  /** 部分类型 - 数据部分 */
  kind: "data";
  /** 结构化数据内容 */
  data: {
    [key: string]: any;
  };
}
```

#### Artifact 对象

表示智能体在任务过程中生成的有形输出，制品是智能体工作结果或产品。

```typescript
/** 表示为任务生成的制品。 */
export interface Artifact {
  /** 制品的唯一标识符。 */
  artifactId: string;
  /** 制品的可选名称。 */
  name?: string;
  /** 制品的可选描述。 */
  description?: string;
  /** 制品的部分。 */
  parts: Part[];
  /** 扩展元数据。 */
  metadata?: {
    [key: string]: any;
  };
  /** 制品中存在的扩展的 URI。 */
  extensions?: string[];
}
```

#### TaskPushNotificationConfig 对象

用作 params 对象，用于 `tasks/pushNotificationConfig/set` 方法，并作为 result 对象，用于 `tasks/pushNotificationConfig/get` 方法。

```typescript
/** 用于设置或获取任务的推送通知配置。 */
export interface TaskPushNotificationConfig {
  /** 任务 ID。 */
  taskId: string;
  /** 推送通知配置。 */
  pushNotificationConfig: PushNotificationConfig;
}
```

其中 `PushNotificationConfig` 对象表示客户端提供给服务器的配置，用于发送关于任务更新的异步推送通知。

```typescript
/** 配置用于设置任务更新推送通知。 */
export interface PushNotificationConfig {
  /** 推送通知 ID - 由服务器创建以支持多个回调 */
  id?: string;
  /** 发送推送通知的 URL。 */
  url: string;
  /** 此任务/会话的唯一令牌。 */
  token?: string;
  authentication?: PushNotificationAuthenticationInfo;
}
```

其中 `PushNotificationAuthenticationInfo` 对象是一个通用结构，用于指定认证要求，以描述 A2A 服务器应如何对客户端的 Webhook 进行认证。

```typescript
/** 定义推送通知的认证细节。 */
export interface PushNotificationAuthenticationInfo {
  /** 支持的认证方案 - 例如 Basic, Bearer */
  schemes: string[];
  /** 可选的凭据 */
  credentials?: string;
}
```

#### JSON-RPC 结构

A2A 遵循标准的 JSON-RPC 2.0 请求和响应结构。

**JSONRPCRequest 对象**

所有 A2A 方法调用都封装在一个 JSON-RPC 请求对象中，包含以下字段：

- `jsonrpc`: 一个字符串，指定 JSON-RPC 协议的版本，**必须**为 "2.0"。
- `method`: 一个字符串，包含要调用的方法名称（例如 `message/send`、`tasks/get`）。
- `params`: 一个结构化值，包含在调用方法时使用的参数值。如果方法不期望任何参数，则此成员 可以 被省略。A2A 方法通常使用一个 对象 作为 params。
- `id`: 由客户端建立的标识符，如果包含，则 必须 包含一个字符串、数字或 NULL 值。如果未包含，则假定为通知。对于期望响应的请求，值 不应 为 NULL，并且数字 不应 包含小数部分。如果包含，服务器 必须 在响应对象中回复相同的值。此成员用于关联两个对象之间的上下文。A2A 方法通常期望一个响应或流，因此 id 通常会存在且不为 null。

**JSONRPCResponse 对象**

A2A 服务器的响应也封装在一个 JSON-RPC 响应对象中。

- `jsonrpc`: 一个字符串，指定 JSON-RPC 协议的版本，**必须**为 "2.0"。
- `id`: 该字段是**必需**的，它**必须**与请求对象中 id 成员的值相同。如果在请求对象中检测 id 时发生错误（例如解析错误/无效请求），则它 必须为 `null`。
- `result`: 该字段在成功时是**必需**的，如果调用方法时发生错误，则此成员不得存在。此成员的值由在服务器上调用的方法决定。
- `error`: 该字段在失败时是**必需**的，如果在调用过程中没有触发错误，则此成员不得存在。此成员的值必须是一个 JSONRPCError 对象。
- `result` 和 `error` 是互斥的。

**JSONRPCError 对象**

当 JSON-RPC 调用遇到错误时，响应对象将包含一个 `error` 成员，其值为此结构。

```typescript
/**
 * JSON-RPC 2.0 错误对象。
 */
export interface JSONRPCError {
  /**
   * 指示发生错误类型的数字。
   */
  code: number;

  /**
   * 提供错误简短描述的字符串。
   */
  message: string;

  /**
   * 包含有关错误附加信息的原始或结构化值。
   * 这可能是省略的。
   */
  data?: any;
}
```

### 协议 RPC 方法

所有 A2A RPC 方法都是通过 A2A 客户端向 A2A 服务器的 url 发送 HTTP POST 请求来调用的。HTTP POST 请求的 body 必须是一个 `JSONRPCRequest` 对象，并且 `Content-Type` 的值必须是 `application/json`。

A2A 服务器的 HTTP 响应主体必须是一个 `JSONRPCResponse` 对象（或者，对于流式方法，是一个 SSE 流，其中每个事件的数据是一个 `JSONRPCResponse`）。JSON-RPC 响应的 `Content-Type` 的值必须是 `application/json`。对于 SSE 流，它的值必须是 `text/event-stream`。

#### `message/send`

向一个智能体发送消息以启动新的交互或继续现有的交互。此方法适用于同步请求/响应交互，或在客户端轮询（使用 `tasks/get`）可接受的情况下监控长时间运行的任务。

- 请求 `params` 类型 : `MessageSendParams`
- 响应 `result` 类型（成功时）: `Task` | `Message` （一个消息对象或处理消息后任务的当前或最终状态）
- 响应 `error` 类型（在失败时）: `JSONRPCError`

**MessageSendParams**

客户端向智能体发送消息作为请求。它可以创建、继续或重新启动任务。

```typescript
export interface MessageSendParams {
  /** 要发送的消息，Message.role 通常是 "user" */
  message: Message;
  /** 发送消息的配置。 */
  configuration?: MessageSendConfiguration;
  /** 扩展元数据。 */
  metadata?: {
    [key: string]: any;
  };
}

/** 发送消息请求的配置。 */
export interface MessageSendConfiguration {
  /** 客户端接受的输出模式。 */
  acceptedOutputModes: string[];
  /** 要检索的最近消息的数量。 */
  historyLength?: number;
  /** 当断开连接时，服务器应该发送通知的位置。 */
  pushNotificationConfig?: PushNotificationConfig;
  /** 服务器是否应该将客户端视为阻塞请求。 */
  blocking?: boolean;
}
```

#### `message/stream`

向智能体发送消息以启动/继续任务，并通过 SSE 将客户端订阅到该任务的实时更新。此方法要求服务器具有 `AgentCard.capabilities.streaming: true` 。

- 请求 `params` 类型 : `MessageSendParams`（与 `message/send` 相同）。
- 响应（成功订阅时）:
  - HTTP 状态: 200 OK
  - HTTP Content-Type: `text/event-stream`
  - HTTP Body：每个 SSE data 字段包含一个 `SendStreamingMessageResponse` JSON 对象。
- 响应（在初始订阅失败时）：
  - 标准 HTTP 错误代码（例如，4xx，5xx）。
  - HTTP Body 可能包含一个标准的 `JSONRPCResponse`，其中包含一个 error 对象，详细说明失败原因。

**SendStreamingMessageResponse**

这是服务器为 `message/stream` 请求或 `tasks/resubscribe` 请求发送的每个 SSE 事件中 data 字段中找到的 JSON 对象的结构。

```typescript
/**
 * JSON-RPC 响应模型，用于 'message/stream' 方法。
 */
export type SendStreamingMessageResponse =
  | SendStreamingMessageSuccessResponse
  | JSONRPCErrorResponse;

/**
 * JSON-RPC 成功响应模型，用于 'message/stream' 方法。
 */
export interface SendStreamingMessageSuccessResponse
  extends JSONRPCSuccessResponse {
  result: Message | Task | TaskStatusUpdateEvent | TaskArtifactUpdateEvent;
}
```

其中 `TaskStatusUpdateEvent` 对象携带有关任务状态在流式传输过程中变化的信息。

```typescript
/** 由服务器在 sendStream 或 subscribe 请求期间发送 */
export interface TaskStatusUpdateEvent {
  /** 任务 id */
  taskId: string;
  /** 任务关联的上下文 */
  contextId: string;
  /** 事件类型 */
  kind: "status-update";
  /** 任务的当前状态 */
  status: TaskStatus;
  /** 指示事件流的结束，如果 true，服务器通常在此之后关闭 SSE 连接。
   */
  final: boolean;
  /** 扩展元数据。 */
  metadata?: {
    [key: string]: any;
  };
}
```

`TaskArtifactUpdateEvent` 对象携带任务在流式传输过程中生成的新或更新的 Artifact（或 Artifact 的一部分）。

```typescript
/** 由服务器在 sendStream 或 subscribe 请求期间发送 */
export interface TaskArtifactUpdateEvent {
  /** 任务 id */
  taskId: string;
  /** 任务关联的上下文 */
  contextId: string;
  /** 事件类型 */
  kind: "artifact-update";
  /** 生成的 Artifact */
  artifact: Artifact;
  /** 指示此 Artifact 是否附加到先前的 Artifact */
  append?: boolean;
  /** 指示这是 Artifact 的最后一个块 */
  lastChunk?: boolean;
  /** 扩展元数据。 */
  metadata?: {
    [key: string]: any;
  };
}
```

#### `tasks/get`

检索先前发起的任务的当前状态（包括状态、制品，和可选的历史记录）。这通常用于轮询通过 `message/send` 发起的任务的状态，或在通过推送通知被通知后，或在 SSE 流结束后获取任务的最终状态。

- 请求 `params` 类型 : `TaskQueryParams`
- 响应 `result` 类型（成功时）: `Task`（任务当前状态的快照）
- 响应 `error` 类型（在失败时）: `JSONRPCError`

其中 `TaskQueryParams` 对象用于指定要检索的任务的查询参数。

```typescript
/** 用于查询任务的参数，包括可选的历史记录长度。 */
export interface TaskQueryParams extends TaskIdParams {
  /** 要检索的最近消息的数量。 */
  historyLength?: number;
}
```

#### `tasks/cancel`

请求取消正在进行的任务，服务器将尝试取消该任务，但不保证成功（例如，任务可能已经完成或失败，或者在当前阶段可能不支持取消）。

- 请求 `params` 类型 : `TaskIdParams`
- 响应 `result` 类型（成功时）: `Task`（取消尝试后的任务状态。理想情况下，如果成功，`Task.status.state` 将是 "canceled"）。
- 响应 `error` 类型（失败时）: `JSONRPCError`（例如，`TaskNotFoundError`，`TaskNotCancelableError`）。

其中 `TaskIdParams` 对象用于 `tasks/cancel` 和 `tasks/pushNotificationConfig/get` ，这就是一个简单的对象，只包含任务 ID 和可选的元数据。

```typescript
/** 仅包含任务 ID 的参数，用于简单的任务操作。 */
export interface TaskIdParams {
  /** 任务 ID。 */
  id: string;
  metadata?: {
    [key: string]: any;
  };
}
```

#### `tasks/pushNotificationConfig/set`

设置或更新指定任务的推送通知配置，这允许客户端告诉服务器在哪里以及如何发送该任务的异步更新。需要服务器具备 `AgentCard.capabilities.pushNotifications: true` 。

- 请求 `params` 类型 : `TaskPushNotificationConfig`
- 响应 `result` 类型（成功时）: `TaskPushNotificationConfig`（
- 响应 `error` 类型（失败时）: `JSONRPCError`（例如 `PushNotificationNotSupportedError`、`TaskNotFoundError` 与无效的 `PushNotificationConfig` 相关的错误）。

#### `tasks/pushNotificationConfig/get`

检索指定任务的当前推送通知配置，要求服务器具有 `AgentCard.capabilities.pushNotifications: true` 。

- 请求 `params` 类型 : `TaskIdParams`
- 响应 `result` 类型（成功时）: `TaskPushNotificationConfig`（任务的当前推送通知配置。如果任务没有关联的推送通知配置，服务器可能会返回错误）。
- 响应 `error` 类型（失败时）: `JSONRPCError`（例如 `PushNotificationNotSupportedError`、`TaskNotFoundError`）。

#### `tasks/resubscribe`

允许客户端在之前的连接（来自 `message/stream` 或早期的 `tasks/resubscribe`）中断后，重新连接到正在进行的任务的 SSE 流。需要服务器具备 `AgentCard.capabilities.streaming: true` 。

目的是恢复接收后续更新，服务器在断开连接期间错过的事件的行为（例如它是否尝试填补一些错过的事件，或者仅从重新订阅的点发送新的事件）取决于具体实现，并未在本规范中严格定义。

- 请求 `params` 类型 : `TaskIdParams`
- 响应（在成功重新订阅时）:
  - HTTP 状态: 200 OK.
  - HTTP Content-Type: `text/event-stream`.
  - HTTP Body：一系列服务器推送事件，格式与 `message/stream` 相同，携带后续 `SendStreamingMessageResponse` 事件用于该任务。
- 响应（在重新订阅失败时）:
  - 标准 HTTP 错误代码（例如，4xx，5xx）。
  - HTTP Body 可以包含一个标准的 `JSONRPCResponse`，其中包含一个 error 对象。如果任务不再处于活动状态、不存在或不支持/未启用流式传输，则可能会发生失败。

#### `agent/authenticatedExtendedCard`

在客户端认证后，检索可能更详细的智能体名片版本，仅当 `AgentCard.supportsAuthenticatedExtendedCard` 为 true 时，此端点可用。这是一个 HTTP GET 端点，而不是 JSON-RPC 方法。

- 端点 URL: `{AgentCard.url}/../agent/authenticatedExtendedCard`（相对于在公共智能体名片中指定的基础 URL）。
- HTTP 方法 : GET
- 认证 : 客户端必须使用在公共 `AgentCard.securitySchemes` 和 `AgentCard.security` 字段中声明的方案对请求进行认证。
- 响应 `result` 类型（成功时）: `AgentCard` （一个完整的智能体名片对象，可能包含公共智能体名片中不存在的额外细节或技能）。
- 响应 `error` 类型（失败时）: 标准 HTTP 错误代码。
  - 401 未授权: 认证失败（缺少或无效的凭据）。服务器应包含 `WWW-Authenticate` 头。
  - 403 禁止: 认证成功，但客户端/用户无权访问扩展卡。
  - 404 未找到: `supportsAuthenticatedExtendedCard` 功能已声明，但服务器未在指定路径实现此端点。
  - 5xx 服务器错误: 发生了内部服务器错误。

获取此认证名片的客户端应在其认证会话期间或直到名片版本更改之前，用从此端点接收到的内容替换其缓存的公共智能体名片。

### 流程示例

上面我们详细讲解了 A2A 协议中涉及到的一些对象和方法，下面我们用一个示例俩说明下常见的 A2A 交互示例 JSON。

首先我们获取经过身份验证的扩展智能体名片，现在我们有个客户端发现一个公共智能体名片，表明支持经过身份验证的扩展智能体名片，并希望检索完整的详细信息。

客户端获取公共智能体名片：

```http
GET https://example.com/.well-known/agent.json
```

服务器响应公共智能体名片，其中包括 `supportsAuthenticatedExtendedCard: true`和 `securitySchemes`。

- 客户端从公共智能体名片中识别所需的认证。
- 客户端获取必要的凭证（例如执行与 Google 的 OAuth 2.0 流程，获得访问令牌）。
- 客户端获取经过认证的扩展智能体名片：

  ```http
  GET https://example.com/a2a/agent/authenticatedExtendedCard
  Authorization: Bearer <obtained_access_token>
  ```

- 服务器对请求进行身份验证和授权。
- 然后服务器返回完整的智能体名片。

#### 基本执行（同步/轮询）

假设现在有个场景是客户端提出一个简单的问题，智能体迅速以任务形式作出回应。

首先客户端使用 `message/send` 发送消息：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "tell me a joke"
        }
      ],
      "messageId": "9229e770-767c-417b-a0b0-f0741243c589"
    },
    "metadata": {}
  }
}
```

服务器处理请求，创建任务并响应（任务快速完成）

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "id": "363422be-b0f9-4692-a24d-278670e7c7f1",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "status": {
      "state": "completed"
    },
    "artifacts": [
      {
        "artifactId": "9b6934dd-37e3-4eb1-8766-962efaab63a1",
        "name": "joke",
        "parts": [
          {
            "kind": "text",
            "text": "Why did the chicken cross the road? To get to the other side!"
          }
        ]
      }
    ],
    "history": [
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "tell me a joke"
          }
        ],
        "messageId": "9229e770-767c-417b-a0b0-f0741243c589",
        "taskId": "363422be-b0f9-4692-a24d-278670e7c7f1",
        "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4"
      }
    ],
    "kind": "task",
    "metadata": {}
  }
}
```

但是如果智能体快速回应了但是没有任务，服务器可能会返回一个消息对象，而不是任务对象。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "messageId": "363422be-b0f9-4692-a24d-278670e7c7f1",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "parts": [
      {
        "kind": "text",
        "text": "Why did the chicken cross the road? To get to the other side!"
      }
    ],
    "kind": "message",
    "metadata": {}
  }
}
```

如果任务运行时间较长，服务器可能最初会响应 `status.state: "working"`。然后，客户端会定期调用 `tasks/get`，直到任务达到最终状态。

#### 流式任务执行 (SSE)

假设客户要求智能体撰写一篇长文，描述附带的图片。客户端首先发送消息并使用 `message/stream` 进行订阅：

```json
{
  "method": "message/stream",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "write a long paper describing the attached pictures"
        },
        {
          "kind": "file",
          "file": {
            "mimeType": "image/png",
            "data": "<base64-encoded-content>"
          }
        }
      ],
      "messageId": "bbb7dee1-cf5c-4683-8a6f-4114529da5eb"
    },
    "metadata": {}
  }
}
```

服务器响应 `HTTP 200 OK`、`Content-Type: text/event-stream` ，并开始发送 SSE 事件：

_事件 1：任务状态更新 - 正在进行中_

```json
data: {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "id": "225d6247-06ba-4cda-a08b-33ae35c8dcfa",
    "contextId": "05217e44-7e9f-473e-ab4f-2c2dde50a2b1",
    "status": {
      "state": "submitted",
      "timestamp":"2025-04-02T16:59:25.331844"
    },
    "history": [
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "write a long paper describing the attached pictures"
          },
          {
            "kind": "file",
            "file": {
              "mimeType": "image/png",
              "data": "<base64-encoded-content>"
            }
          }
        ],
        "messageId": "bbb7dee1-cf5c-4683-8a6f-4114529da5eb",
        "taskId": "225d6247-06ba-4cda-a08b-33ae35c8dcfa",
        "contextId": "05217e44-7e9f-473e-ab4f-2c2dde50a2b1"
      }
    ],
    "kind": "task",
    "metadata": {}
  }
}

data: {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "225d6247-06ba-4cda-a08b-33ae35c8dcfa",
    "contextId": "05217e44-7e9f-473e-ab4f-2c2dde50a2b1",
    "artifact": {
      "artifactId": "9b6934dd-37e3-4eb1-8766-962efaab63a1",
      "parts": [
        {"type":"text", "text": "<section 1...>"}
      ]
    },
    "append": false,
    "lastChunk": false,
    "kind":"artifact-update"
  }
}

data: {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "225d6247-06ba-4cda-a08b-33ae35c8dcfa",
    "contextId": "05217e44-7e9f-473e-ab4f-2c2dde50a2b1",
    "artifact": {
      "artifactId": "9b6934dd-37e3-4eb1-8766-962efaab63a1",
      "parts": [
        {"type":"text", "text": "<section 2...>"}
      ],
    },
    "append": true,
    "lastChunk": false,
    "kind":"artifact-update"
  }
}


data: {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "225d6247-06ba-4cda-a08b-33ae35c8dcfa",
    "contextId": "05217e44-7e9f-473e-ab4f-2c2dde50a2b1",
    "artifact": {
      "artifactId": "9b6934dd-37e3-4eb1-8766-962efaab63a1",
      "parts": [
        {"type":"text", "text": "<section 3...>"}
      ]
    },
    "append": true,
    "lastChunk": true,
    "kind":"artifact-update"
  }
}

data: {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "225d6247-06ba-4cda-a08b-33ae35c8dcfa",
    "contextId": "05217e44-7e9f-473e-ab4f-2c2dde50a2b1",
    "status": {
      "state": "completed",
      "timestamp":"2025-04-02T16:59:35.331844"
    },
    "final": true,
    "kind":"status-update"
  }
}
```

服务器在 `final: true` 事件后关闭 SSE 连接。

#### 多轮交互（需要输入）

假设客户想要预订航班，智能体需要更多信息，客户端首先使用 `message/send` 发送消息：

```json
{
  "jsonrpc": "2.0",
  "id": "req-003",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [{ "kind": "text", "text": "I'd like to book a flight." }]
    },
    "messageId": "c53ba666-3f97-433c-a87b-6084276babe2"
  }
}
```

然后服务器给出响应，任务状态为 `input-required`：

```json
{
  "jsonrpc": "2.0",
  "id": "req-003",
  "result": {
    "id": "3f36680c-7f37-4a5f-945e-d78981fafd36",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "status": {
      "state": "input-required",
      "message": {
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Sure, I can help with that! Where would you like to fly to, and from where? Also, what are your preferred travel dates?"
          }
        ],
        "messageId": "c2e1b2dd-f200-4b04-bc22-1b0c65a1aad2",
        "taskId": "3f36680c-7f37-4a5f-945e-d78981fafd36",
        "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4"
      },
      "timestamp": "2024-03-15T10:10:00Z"
    },
    "history": [
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "I'd like to book a flight."
          }
        ],
        "messageId": "c53ba666-3f97-433c-a87b-6084276babe2",
        "taskId": "3f36680c-7f37-4a5f-945e-d78981fafd36",
        "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4"
      }
    ],
    "kind": "task"
  }
}
```

然后客户端使用 `message/send` 提供请求的输入，使用**相同的任务 ID**：

```json
{
  "jsonrpc": "2.0",
  "id": "req-004",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "I want to fly from New York (JFK) to London (LHR) around October 10th, returning October 17th."
        }
      ],
      "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
      "taskId": "3f36680c-7f37-4a5f-945e-d78981fafd36",
      "messageId": "0db1d6c4-3976-40ed-b9b8-0043ea7a03d3"
    },
    "configuration": {
      "blocking": true
    }
  }
}
```

服务器处理新的输入并作出响应（例如，任务完成或需要更多输入）：

```json
{
  "jsonrpc": "2.0",
  "id": "req-004",
  "result": {
    "id": "3f36680c-7f37-4a5f-945e-d78981fafd36",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "status": {
      "state": "completed",
      "message": {
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Okay, I've found a flight for you. Confirmation XYZ123. Details are in the artifact."
          }
        ]
      }
    },
    "artifacts": [
      {
        "artifactId": "9b6934dd-37e3-4eb1-8766-962efaab63a1",
        "name": "FlightItinerary.json",
        "parts": [
          {
            "kind": "data",
            "data": {
              "confirmationId": "XYZ123",
              "from": "JFK",
              "to": "LHR",
              "departure": "2024-10-10T18:00:00Z",
              "arrival": "2024-10-11T06:00:00Z",
              "returnDeparture": "..."
            }
          }
        ]
      }
    ],
    "history": [
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "I'd like to book a flight."
          }
        ],
        "messageId": "c53ba666-3f97-433c-a87b-6084276babe2",
        "taskId": "3f36680c-7f37-4a5f-945e-d78981fafd36",
        "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4"
      },
      {
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Sure, I can help with that! Where would you like to fly to, and from where? Also, what are your preferred travel dates?"
          }
        ],
        "messageId": "c2e1b2dd-f200-4b04-bc22-1b0c65a1aad2",
        "taskId": "3f36680c-7f37-4a5f-945e-d78981fafd36",
        "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4"
      },
      {
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "I want to fly from New York (JFK) to London (LHR) around October 10th, returning October 17th."
          }
        ],
        "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
        "taskId": "3f36680c-7f37-4a5f-945e-d78981fafd36",
        "messageId": "0db1d6c4-3976-40ed-b9b8-0043ea7a03d3"
      }
    ],
    "kind": "task",
    "metadata": {}
  }
}
```

#### 推送通知设置和使用

假设客户端请求生成一个长时间运行的报告，并希望在完成时通过 Webhook 进行通知。客户端首先使用 `message/send` 发送消息，并使用 `pushNotification` 配置：

```json
{
  "jsonrpc": "2.0",
  "id": "req-005",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Generate the Q1 sales report. This usually takes a while. Notify me when it's ready."
        }
      ],
      "messageId": "6dbc13b5-bd57-4c2b-b503-24e381b6c8d6"
    },
    "configuration": {
      "pushNotificationConfig": {
        "url": "https://client.example.com/webhook/a2a-notifications",
        "token": "secure-client-token-for-task-aaa",
        "authentication": {
          "schemes": ["Bearer"]
          // 'credentials' 可以提供更多具体信息，如果服务器需要的话。
        }
      }
    }
  }
}
```

然后服务器确认任务（例如状态变成 `submitted` 或 `working` ）：

```json
{
  "jsonrpc": "2.0",
  "id": "req-005",
  "result": {
    "id": "43667960-d455-4453-b0cf-1bae4955270d",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "status": { "state": "submitted", "timestamp": "2024-03-15T11:00:00Z" }
    // ... other fields ...
  }
}
```

然后服务器完成任务并向 `https://client.example.com/webhook/a2a-notifications` 发送通知。其中 HTTP Header 可能包括：

- `Authorization`: `Bearer <server_jwt_for_webhook_audience>` （如果服务器对 webhook 进行身份验证）
- `Content-Type`: `application/json`
- `X-A2A-Notification-Token`: `secure-client-token-for-task-aaa`

HTTP Body（任务对象作为 JSON 负载发送）:

```json
{
  "id": "43667960-d455-4453-b0cf-1bae4955270d",
  "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
  "status": { "state": "completed", "timestamp": "2024-03-15T18:30:00Z" },
  "kind": "task"
  // ... other fields ...
}
```

然后对于客户端的 Webhook 服务，需要做以下的一些操作：

- 接收 POST 请求。
- 验证 `Authorization` Header（如果适用）。
- 验证 `X-A2A-Notification-Token`。
- 内部处理通知（例如，更新应用程序状态，通知最终用户）。

#### 文件交换（上传和下载）

假设客户端发送一张图像，智能体返回一张修改后的图像。客户端首先使用 `message/send` 发送一个 `FilePart` （上传图像字节）：

```json
{
  "jsonrpc": "2.0",
  "id": "req-007",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Analyze this image and highlight any faces."
        },
        {
          "kind": "file",
          "file": {
            "name": "input_image.png",
            "mimeType": "image/png",
            "bytes": "iVBORw0KGgoAAAANSUhEUgAAAAUA..." // Base64 encoded image data
          }
        }
      ],
      "messageId": "6dbc13b5-bd57-4c2b-b503-24e381b6c8d6"
    }
  }
}
```

服务器处理图像并以一个 `FilePart` 作为制品进行响应（例如提供修改后图像的 URI）：

```json
{
  "jsonrpc": "2.0",
  "id": "req-007",
  "result": {
    "id": "43667960-d455-4453-b0cf-1bae4955270d",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "status": { "state": "completed", "timestamp": "2024-03-15T12:05:00Z" },
    "artifacts": [
      {
        "artifactId": "9b6934dd-37e3-4eb1-8766-962efaab63a1",
        "name": "processed_image_with_faces.png",
        "parts": [
          {
            "kind": "file",
            "file": {
              "name": "output.png",
              "mimeType": "image/png",
              // 服务器可能会提供一个 URI
              "uri": "https://storage.example.com/processed/task-bbb/output.png?token=xyz"
              // 或者，它可以直接返回字节：
              // "bytes": "ASEDGhw0KGgoAAAANSUhEUgAA..."
            }
          }
        ]
      }
    ],
    "kind": "task"
  }
}
```

#### 结构化数据交换（请求和提供 JSON）

客户端请求以特定的 JSON 格式获取未解决的支持工单列表。客户端首先使用 `message/send` 发送消息，并使用 `Part.metadata` 暗示了期望的输出模式/媒体类型：

```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Show me a list of my open IT tickets",
          "metadata": {
            "mimeType": "application/json",
            "schema": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "ticketNumber": { "type": "string" },
                  "description": { "type": "string" }
                }
              }
            }
          }
        }
      ],
      "messageId": "85b26db5-ffbb-4278-a5da-a7b09dea1b47"
    },
    "metadata": {}
  }
}
```

然后服务器以结构化的 JSON 数据响应：

```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "result": {
    "id": "d8c6243f-5f7a-4f6f-821d-957ce51e856c",
    "contextId": "c295ea44-7543-4f78-b524-7a38915ad6e4",
    "status": {
      "state": "completed",
      "timestamp": "2025-04-17T17:47:09.680794"
    },
    "artifacts": [
      {
        "artifactId": "c5e0382f-b57f-4da7-87d8-b85171fad17c",
        "parts": [
          {
            "kind": "text",
            "text": "[{\"ticketNumber\":\"REQ12312\",\"description\":\"request for VPN access\"},{\"ticketNumber\":\"REQ23422\",\"description\":\"Add to DL - team-gcp-onboarding\"}]"
          }
        ]
      }
    ],
    "kind": "task"
  }
}
```

这些示例说明了 A2A 在处理各种交互模式和数据类型方面的灵活性。实现者可以参考所有字段和约束的详细对象定义。

## Python SDK

上面我们详细了解了 A2A 的具体协议，接下来我们就来实际使用下 A2A 协议在一些具体的场景中，这里我们可以使用官方提供的 [Python SDK](https://github.com/google-a2a/a2a-python) 来实现。

这里我们来使用 Python SDK 实现一个简单的 “echo” A2A 服务器，我们可以了解 A2A 服务器的基本概念和组件。

### 初始化

首先需要保证环境的 Python 版本在 3.10 或以上，同样这里我们还是使用 `uv` 来管理项目。

首先初始化项目：

```bash
uv init a2a-demo
cd a2a-demo
```

然后安装 A2A Python SDK 依赖：

```bash
uv add a2a-sdk uvicorn
```

现在我们的项目目录结构如下所示：

```bash
$ tree .
.
├── README.md
├── main.py
├── pyproject.toml
└── uv.lock

0 directories, 4 files
```

### 服务端

接下来我们在 `main.py` 文件中来实现一个 A2A 服务端（也就是远程端的智能体），这里我们可以直接使用 `a2a-sdk` 提供的组件来实现，核心代码如下所示：

```python
import uvicorn

from a2a.server.apps import A2AStarletteApplication
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
)
from agent_executor import (
    HelloWorldAgentExecutor,  # type: ignore[import-untyped]
)


if __name__ == '__main__':
    # 定义一个简单的技能，用于返回 "hello world"
    skill = AgentSkill(
        id='hello_world',
        name='Returns hello world',
        description='just returns hello world',
        tags=['hello world'],
        examples=['hi', 'hello world'],
    )

    # 定义一个更复杂的技能，用于返回 "super hello world"
    extended_skill = AgentSkill(
        id='super_hello_world',
        name='Returns a SUPER Hello World',
        description='A more enthusiastic greeting, only for authenticated users.',
        tags=['hello world', 'super', 'extended'],
        examples=['super hi', 'give me a super hello'],
    )

    # 定义一个公共的智能体名片
    public_agent_card = AgentCard(
        name='Hello World Agent',
        description='Just a hello world agent',
        url='http://0.0.0.0:9999/',
        version='1.0.0',
        defaultInputModes=['text'],
        defaultOutputModes=['text'],
        capabilities=AgentCapabilities(streaming=True),
        skills=[skill],  # 只有基本的技能用于公共名片
        supportsAuthenticatedExtendedCard=True,
    )

    # 定义一个扩展的智能体名片，用于返回 "super hello world"
    specific_extended_agent_card = public_agent_card.model_copy(
        update={
            'name': 'Hello World Agent - Extended Edition',  # 不同的名称
            'description': 'The full-featured hello world agent for authenticated users.',
            'version': '1.0.1',  # 甚至可以是不同的版本
            # 能力和其他字段，如 url、defaultInputModes、defaultOutputModes、supportsAuthenticatedExtendedCard 等，
            # 除非在这里指定，否则继承自 public_agent_card。
            'skills': [
                skill,
                extended_skill,
            ],  # 两个技能用于扩展名片
        }
    )

    # 创建一个默认的请求处理器
    request_handler = DefaultRequestHandler(
        agent_executor=HelloWorldAgentExecutor(),
        task_store=InMemoryTaskStore(),
    )

    # 创建一个 A2A 服务端，这里我们使用 `A2AStarletteApplication` 来创建一个 A2A 服务端
    server = A2AStarletteApplication(
        agent_card=public_agent_card,
        http_handler=request_handler,
        extended_agent_card=specific_extended_agent_card,
    )

    # 运行服务，这里我们使用 `uvicorn` 来运行服务
    uvicorn.run(server.build(), host='0.0.0.0', port=9999)
```

首先我们使用 `AgentSkill` 这个类来定义一个简单的技能，这个类用于表示智能体可以执行的一个能力单元，然后再定义了一个更复杂的技能。

接下来使用 `AgentCard` 这个类来定义一个智能体名片，这个类用于表示智能体的整体信息，一个 `AgentCard` 用于传递关键信息：

- 整体信息（版本、名称、描述、使用）
- 技能：智能体可以执行的一组能力
- 默认的模态/内容类型支持
- 认证要求

我们这里定义的智能体名片如下所示：

```python
public_agent_card = AgentCard(
    name='Hello World Agent',
    description='Just a hello world agent',
    url='http://0.0.0.0:9999/',
    version='1.0.0',
    defaultInputModes=['text'],
    defaultOutputModes=['text'],
    capabilities=AgentCapabilities(streaming=True),
    skills=[skill],  # 只有基本的技能用于公共名片
    supportsAuthenticatedExtendedCard=True,
)
```

这里我们定义的智能体信息如下所示：

- `name`：智能体的名称
- `description`：智能体的描述
- `url`：智能体的 URL
- `version`：智能体的版本
- `defaultInputModes`：输入模式，我们这里定义的是 `text`，表示智能体支持文本输入
- `defaultOutputModes`：输出模式，我们这里定义的是 `text`，表示智能体支持文本输出
- `capabilities`：智能体的能力，我们这里定义的是 `streaming`，表示智能体支持流式输出
- `skills`：智能体支持的技能，我们这里定义的是 `skill`，表示智能体支持的技能
- `supportsAuthenticatedExtendedCard`：智能体是否支持扩展的认证卡片

为了扩展智能体名片，我们甚至还可以重新覆盖更新重新创建一个新的 `AgentCard`，如下所示：

```python
# 定义一个扩展的智能体名片，用于返回 "super hello world"
specific_extended_agent_card = public_agent_card.model_copy(
    update={
        'name': 'Hello World Agent - Extended Edition',  # 不同的名称
        'description': 'The full-featured hello world agent for authenticated users.',
        'version': '1.0.1',  # 甚至可以是不同的版本
        # 能力和其他字段，如 url、defaultInputModes、defaultOutputModes、supportsAuthenticatedExtendedCard 等，
        # 除非在这里指定，否则继承自 public_agent_card。
        'skills': [
            skill,
            extended_skill,
        ],  # 两个技能用于扩展名片
    }
)
```

这里我们在 `skills` 字段里面提供了两个技能对象，这样我们就可以在扩展的智能体名片中使用这两个技能了。

然后接下来使用 SDK 提供的 `DefaultRequestHandler` 这个类来创建一个默认的请求处理器，这个类用于处理 A2A 请求：

```python
# 创建一个默认的请求处理器
request_handler = DefaultRequestHandler(
    agent_executor=HelloWorldAgentExecutor(),
    task_store=InMemoryTaskStore(),
)
```

这里需要我们提供一个 `AgentExecutor` 对象实例，该实例是用来执行智能体的核心逻辑的，需要我们自己继承 `AgentExecutor` 类，然后还需要提供一个 `TaskStore` 对象实例，该实例是用来存储任务的，这里我们使用 `InMemoryTaskStore` 这个类来实现，表示在内存中存储任务的。

这里的重点是 `AgentExecutor` 这个基类，其基本定义如下所示：

```python
from abc import ABC, abstractmethod

from a2a.server.agent_execution.context import RequestContext
from a2a.server.events.event_queue import EventQueue


class AgentExecutor(ABC):
    """智能体执行器接口。

    实现这个接口的类包含智能体的核心逻辑，根据请求执行任务并发布更新到事件队列。
    """

    @abstractmethod
    async def execute(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        """执行智能体的逻辑，根据请求执行任务并发布更新到事件队列。
        Args:
            context: 包含消息、任务 ID 等的请求上下文
            event_queue: 发布事件的队列
        """

    @abstractmethod
    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        """请求智能体取消一个正在进行的任务。
        Args:
            context: 包含要取消的任务 ID 的请求上下文
            event_queue: 发布取消状态更新事件的队列
        """

```

其中的 `execute` 方法用于执行智能体的逻辑，智能体应该从 `context` 上下文中读取必要的信息，并发布 `Task` 或 `Message` 事件，或 `TaskStatusUpdateEvent` / `TaskArtifactUpdateEvent` 到事件队列，事件队列用于 A2A 从智能体响应，作为智能体异步执行和响应处理（例如通过 SSE 流式传输）之间的缓冲区。

`cancel` 方法用于取消一个正在进行的任务，智能体应该尝试停止在上下文中标识的任务，并发布一个 `TaskStatusUpdateEvent` 事件，状态为 `TaskState.canceled` 到事件队列。

接下来我们创建一个 `agent_executor.py` 的文件，用于实现 `AgentExecutor` 接口，其具体实现如下所示：

```python
# agent_executor.py
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.utils import new_agent_text_message


class HelloWorldAgent:
    """Hello World 智能体."""
    async def invoke(self) -> str:
        return 'Hello World'


class HelloWorldAgentExecutor(AgentExecutor):
    """AgentExecutor 实现."""

    def __init__(self):
        self.agent = HelloWorldAgent()

    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        # 执行智能体的逻辑，这里我们直接返回 "Hello World"
        result = await self.agent.invoke()
        # 发布一个文本消息到事件队列
        await event_queue.enqueue_event(new_agent_text_message(result))

    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        # 取消智能体的逻辑，这里我们直接抛出异常，不支持取消
        raise Exception('cancel not supported')

```

如上面的代码所示，我们这里实现了 `AgentExecutor` 接口，并实现了 `execute` 和 `cancel` 方法，其中 `execute` 方法用于执行智能体的逻辑，`cancel` 方法用于取消一个正在进行的任务。

`execute` 方法中我们直接调用了 `HelloWorldAgent` 的 `invoke` 方法，这里其实就是真正的去执行智能体的逻辑，比如我们可以去接入 LLM 模型，然后调用模型来执行智能体的逻辑，然后将智能体执行结果返回（我们这里是返回一个固定的字符串），当然是将消息发布到事件队列中去。

这里我们使用 `new_agent_text_message` 这个函数来将智能体执行结果转换成一个文本消息对象，这其实就是我们在前面协议中提到的 `Message` 对象：

```python
def new_agent_text_message(
    text: str,
    context_id: str | None = None,
    task_id: str | None = None,
) -> Message:
    """创建一个包含单个 TextPart 的新的智能体消息。

    Args:
        text: 消息的文本内容
        context_id: 消息的上下文 ID
        task_id: 消息的任务 ID

    Returns:
        一个具有 'agent' 角色的新 `Message` 对象
    """
    return Message(
        role=Role.agent,
        parts=[Part(root=TextPart(text=text))],
        messageId=str(uuid.uuid4()),
        taskId=task_id,
        contextId=context_id,
    )
```

所有工作准备完成后，最后我们直接使用 `A2AStarletteApplication` 这个类来创建一个 A2A 服务端，然后使用 `uvicorn` 来运行服务该服务即可：

```python
# 创建一个 A2A 服务端，这里我们使用 `A2AStarletteApplication` 来创建一个 A2A 服务端
server = A2AStarletteApplication(
    agent_card=public_agent_card,
    http_handler=request_handler,
    extended_agent_card=specific_extended_agent_card,
)

# 运行服务，这里我们使用 `uvicorn` 来运行服务
uvicorn.run(server.build(), host='0.0.0.0', port=9999)
```

最后直接运行服务即可：

```bash
$ python main.py
INFO:     Started server process [98132]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:9999 (Press CTRL+C to quit)
```

运行后，我们就可以在浏览器中访问 `http://localhost:9999/.well-known/agent.json` 来获取到智能体的名片信息了。

![智能体名片信息](https://static.claudemcp.com/images/blog/a2a-agentcard-info.png)

同样可以访问 `http://localhost:9999/agent/authenticatedExtendedCard` 来获取到扩展的智能体名片信息：

![扩展的智能体名片信息](https://static.claudemcp.com/images/blog/a2a-agentcard-extend.png)

到这里我们就实现了一个最简单的 A2A 服务端程序。

### 客户端

接下来我们来实现一个 A2A 客户端，去通过服务端的智能体名片信息来调用远程智能体的能力。同样还是使用 Python SDK 来实现，核心代码如下所示：

```python
# client.py
# client.py
import logging

from typing import Any
from uuid import uuid4

import httpx

from a2a.client import A2ACardResolver, A2AClient
from a2a.types import (
    AgentCard,
    MessageSendParams,
    SendMessageRequest,
    SendStreamingMessageRequest,
)


async def main() -> None:
    PUBLIC_AGENT_CARD_PATH = '/.well-known/agent.json'
    EXTENDED_AGENT_CARD_PATH = '/agent/authenticatedExtendedCard'

    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    base_url = 'http://localhost:9999'

    async with httpx.AsyncClient() as httpx_client:
        # 初始化 A2ACardResolver
        resolver = A2ACardResolver(
            httpx_client=httpx_client,
            base_url=base_url,
            # agent_card_path 使用默认值，extended_agent_card_path 也使用默认值
        )

        # 获取公共智能体名片并初始化客户端
        final_agent_card_to_use: AgentCard | None = None

        try:
            logger.info(
                f'Attempting to fetch public agent card from: {base_url}{PUBLIC_AGENT_CARD_PATH}'
            )
            _public_card = (
                await resolver.get_agent_card()
            )  # 从默认的公共路径获取
            logger.info('Successfully fetched public agent card:')
            logger.info(
                _public_card.model_dump_json(indent=2, exclude_none=True)
            )
            final_agent_card_to_use = _public_card
            logger.info(
                '\nUsing PUBLIC agent card for client initialization (default).'
            )

            if _public_card.supportsAuthenticatedExtendedCard:
                try:
                    logger.info(
                        f'\nPublic card supports authenticated extended card. Attempting to fetch from: {base_url}{EXTENDED_AGENT_CARD_PATH}'
                    )
                    auth_headers_dict = {
                        'Authorization': 'Bearer dummy-token-for-extended-card'
                    }
                    _extended_card = await resolver.get_agent_card(
                        relative_card_path=EXTENDED_AGENT_CARD_PATH,
                        http_kwargs={'headers': auth_headers_dict},
                    )
                    logger.info(
                        'Successfully fetched authenticated extended agent card:'
                    )
                    logger.info(
                        _extended_card.model_dump_json(
                            indent=2, exclude_none=True
                        )
                    )
                    final_agent_card_to_use = (
                        _extended_card  # 更新为使用扩展的智能体名片
                    )
                    logger.info(
                        '\nUsing AUTHENTICATED EXTENDED agent card for client initialization.'
                    )
                except Exception as e_extended:
                    logger.warning(
                        f'Failed to fetch extended agent card: {e_extended}. Will proceed with public card.',
                        exc_info=True,
                    )
            elif (
                _public_card
            ):  # supportsAuthenticatedExtendedCard 为 False 或 None
                logger.info(
                    '\nPublic card does not indicate support for an extended card. Using public card.'
                )

        except Exception as e:
            logger.error(
                f'Critical error fetching public agent card: {e}', exc_info=True
            )
            raise RuntimeError(
                'Failed to fetch the public agent card. Cannot continue.'
            ) from e

        # 初始化 A2AClient 对象
        client = A2AClient(
            httpx_client=httpx_client, agent_card=final_agent_card_to_use
        )
        logger.info('A2AClient initialized.')

        send_message_payload: dict[str, Any] = {
            'message': {
                'role': 'user',
                'parts': [
                    {'kind': 'text', 'text': 'how much is 10 USD in INR?'}
                ],
                'messageId': uuid4().hex,
            },
        }
        # 构造发送消息请求对象
        request = SendMessageRequest(
            id=str(uuid4()), params=MessageSendParams(**send_message_payload)
        )
        # 发送消息
        response = await client.send_message(request)
        # 打印响应
        print(response.model_dump(mode='json', exclude_none=True))

        # 构造流式发送消息请求对象
        streaming_request = SendStreamingMessageRequest(
            id=str(uuid4()), params=MessageSendParams(**send_message_payload)
        )

        # 发送流式消息
        stream_response = client.send_message_streaming(streaming_request)

        # 打印流式消息响应
        async for chunk in stream_response:
            print(chunk.model_dump(mode='json', exclude_none=True))


if __name__ == '__main__':
    import asyncio

    asyncio.run(main())
```

首先我们通过请求 A2A 服务端的智能体名片（通过 `/.well-known/agent.json` 路径）信息，然后再判断是否支持用户认证时提供扩展的智能体名片，如果支持，则再请求扩展的智能体名片（通过 `/agent/authenticatedExtendedCard` 路径）信息。

拿到智能体名片信息数据过后只需要初始化一个 `A2AClient` 对象就可以开始调用智能体的能力了。比如先构造一个发送消息请求对象 `SendMessageRequest`，然后调用 `send_message` 方法发送消息即可拿到远端智能体的响应。如果要构造一个流式消息请求，则构造一个 `SendStreamingMessageRequest` 对象，然后调用 `send_message_streaming` 方法发送消息即可拿到流式响应数据。

最后我们直接运行客户端程序来进行测试：

```bash
$ python client.py
INFO:__main__:Attempting to fetch public agent card from: http://localhost:9999/.well-known/agent.json
INFO:httpx:HTTP Request: GET http://localhost:9999/.well-known/agent.json "HTTP/1.1 200 OK"
INFO:a2a.client.client:Successfully fetched agent card data from http://localhost:9999/.well-known/agent.json: {'capabilities': {'streaming': True}, 'defaultInputModes': ['text'], 'defaultOutputModes': ['text'], 'description': 'Just a hello world agent', 'name': 'Hello World Agent', 'skills': [{'description': 'just returns hello world', 'examples': ['hi', 'hello world'], 'id': 'hello_world', 'name': 'Returns hello world', 'tags': ['hello world']}], 'supportsAuthenticatedExtendedCard': True, 'url': 'http://0.0.0.0:9999/', 'version': '1.0.0'}
INFO:__main__:Successfully fetched public agent card:
INFO:__main__:{
  "capabilities": {
    "streaming": true
  },
  "defaultInputModes": [
    "text"
  ],
  "defaultOutputModes": [
    "text"
  ],
  "description": "Just a hello world agent",
  "name": "Hello World Agent",
  "skills": [
    {
      "description": "just returns hello world",
      "examples": [
        "hi",
        "hello world"
      ],
      "id": "hello_world",
      "name": "Returns hello world",
      "tags": [
        "hello world"
      ]
    }
  ],
  "supportsAuthenticatedExtendedCard": true,
  "url": "http://0.0.0.0:9999/",
  "version": "1.0.0"
}
INFO:__main__:
Using PUBLIC agent card for client initialization (default).
INFO:__main__:
Public card supports authenticated extended card. Attempting to fetch from: http://localhost:9999/agent/authenticatedExtendedCard
INFO:httpx:HTTP Request: GET http://localhost:9999/agent/authenticatedExtendedCard "HTTP/1.1 200 OK"
INFO:a2a.client.client:Successfully fetched agent card data from http://localhost:9999/agent/authenticatedExtendedCard: {'capabilities': {'streaming': True}, 'defaultInputModes': ['text'], 'defaultOutputModes': ['text'], 'description': 'The full-featured hello world agent for authenticated users.', 'name': 'Hello World Agent - Extended Edition', 'skills': [{'description': 'just returns hello world', 'examples': ['hi', 'hello world'], 'id': 'hello_world', 'name': 'Returns hello world', 'tags': ['hello world']}, {'description': 'A more enthusiastic greeting, only for authenticated users.', 'examples': ['super hi', 'give me a super hello'], 'id': 'super_hello_world', 'name': 'Returns a SUPER Hello World', 'tags': ['hello world', 'super', 'extended']}], 'supportsAuthenticatedExtendedCard': True, 'url': 'http://0.0.0.0:9999/', 'version': '1.0.1'}
INFO:__main__:Successfully fetched authenticated extended agent card:
INFO:__main__:{
  "capabilities": {
    "streaming": true
  },
  "defaultInputModes": [
    "text"
  ],
  "defaultOutputModes": [
    "text"
  ],
  "description": "The full-featured hello world agent for authenticated users.",
  "name": "Hello World Agent - Extended Edition",
  "skills": [
    {
      "description": "just returns hello world",
      "examples": [
        "hi",
        "hello world"
      ],
      "id": "hello_world",
      "name": "Returns hello world",
      "tags": [
        "hello world"
      ]
    },
    {
      "description": "A more enthusiastic greeting, only for authenticated users.",
      "examples": [
        "super hi",
        "give me a super hello"
      ],
      "id": "super_hello_world",
      "name": "Returns a SUPER Hello World",
      "tags": [
        "hello world",
        "super",
        "extended"
      ]
    }
  ],
  "supportsAuthenticatedExtendedCard": true,
  "url": "http://0.0.0.0:9999/",
  "version": "1.0.1"
}
INFO:__main__:
Using AUTHENTICATED EXTENDED agent card for client initialization.
INFO:__main__:A2AClient initialized.
INFO:httpx:HTTP Request: POST http://0.0.0.0:9999/ "HTTP/1.1 200 OK"
{'id': 'c8c2b71f-89bf-4a31-a660-0c6a1b50f7ea', 'jsonrpc': '2.0', 'result': {'kind': 'message', 'messageId': 'b50b5c2d-10b9-4800-80a4-4f38f25f1556', 'parts': [{'kind': 'text', 'text': 'Hello World'}], 'role': 'agent'}}
INFO:httpx:HTTP Request: POST http://0.0.0.0:9999/ "HTTP/1.1 200 OK"
{'id': 'a2a6316d-7aef-4b51-b7d1-535bbc1362eb', 'jsonrpc': '2.0', 'result': {'kind': 'message', 'messageId': 'f6904b90-7e3a-4596-b5e8-5c14920443f6', 'parts': [{'kind': 'text', 'text': 'Hello World'}], 'role': 'agent'}}
```

上面的输出结果中，我们首先请求了公共的智能体名片信息，然后请求了扩展的智能体名片信息，最后发送了一条消息给远端智能体，并收到了远端智能体的响应。

到这里我们就实现了一个最简单的 A2A 服务端和客户端程序。

我们这里只是简单演示了 A2A 的基本机制，当然在实际场景中，我们的智能体会更加复杂，比如支持流式传输、任务状态管理和由 LLM 驱动的多轮对话等更高级的功能，而且不同的智能体可能会由不同的框架去实现，我们也可以在智能体中去集成 [MCP](https://www.claudemcp.com/servers) 去实现功能，甚至我们还可以去开发一个聚合平台，只需要在这个平台配置上各个智能体提供的名片地址，然后就可以让用户通过这个平台去调用各个智能体的能力了，这些更复杂的能力我们将在后续文章中进行介绍。
