---
title: A2A Protocol Explained
excerpt: The A2A protocol is a communication framework between AI agents introduced by Google. This article provides a detailed overview of its principles, features, application scenarios, and implementation methods.
date: 2025-07-15
slug: a2a
coverImage: https://static.claudemcp.com/images/blog/a2a.png
featured: true
author:
  name: Yangming
  avatar: https://static.claudemcp.com/images/avatars/yangming.png
category: Technology
---

[A2A](https://www.a2aprotocol.net), short for `Agent to Agent` protocol, is an open-source framework launched by Google to facilitate communication and interoperability among AI agents. By providing a standardized collaboration method for agents, regardless of their underlying frameworks or vendors, this protocol enables AI agents to securely exchange information, coordinate actions, and operate across diverse enterprise platforms and applications. In simple terms, it addresses the question: **How can AI agents developed by different teams, using different technologies, and owned by different organizations effectively communicate and collaborate?**

## Why A2A is Needed

As AI agents become increasingly specialized and powerful, the need for them to collaborate on complex tasks grows. Imagine a user requesting their primary AI agent to plan an international trip—this single request might involve coordinating the capabilities of several specialized agents:

1. An agent for flight bookings.
2. An agent for hotel reservations.
3. A third agent for local tour recommendations and bookings.
4. A fourth agent handling currency conversion and travel advisories.

Without a common communication protocol, integrating these disparate agents into a unified user experience becomes a significant engineering challenge. Each integration would likely require a custom point-to-point solution, making the system difficult to scale, maintain, and extend.

## Application Scenarios

**Enterprise Automation**

In corporate environments, A2A enables agents to work across siloed data systems and applications. For example, a supply chain planning agent can coordinate with inventory management, logistics, and procurement agents—even if they are built by different vendors or on different frameworks. This enhances autonomy, boosts productivity, and reduces long-term costs.

**Multi-Agent Collaboration**

A2A protocols facilitate true multi-agent scenarios where agents can collaborate in their natural, unstructured modes, even without shared memory, tools, or context. This goes beyond simply using one agent as a "tool" for another—it allows each agent to retain its capabilities while handling complex tasks.

**Cross-Platform Integration**

For business applications, A2A allows AI agents to operate across an entire ecosystem of enterprise applications. This means agents can access and coordinate with other agents on various platforms, such as CRM systems, knowledge bases, project management tools, and more. A standardized approach to managing agents across diverse platforms and cloud environments is essential for unlocking the full potential of collaborative AI.

## How It Works

![A2A Workflow](https://static.claudemcp.com/images/blog/a2a-workflow.png)

A2A facilitates communication between "client" agents and "remote" agents. The client agent is responsible for formulating and conveying tasks, while the remote agent executes them, aiming to provide accurate information or take appropriate actions. This interaction involves several key functions:

- **Capability Discovery**: Agents can expose their capabilities using a JSON-formatted `Agent Card`. This allows client agents to identify the most suitable agent for a task and communicate with remote agents via A2A. For example, a client agent might discover another agent specialized in financial data and delegate financial analysis tasks to it.

- **Task Management**: Communication between client and remote agents is task-oriented, with agents collaborating to fulfill end-user requests. The `Task` object, defined by the protocol, has a lifecycle. It can be completed immediately, or for long-running tasks, agents can synchronize updates. The output of a task is called an `Artifact`.

- **Collaboration**: Agents can exchange messages to share context, responses, artifacts, or user instructions. This creates a structured way for agents to share the information needed to complete tasks. For instance, one agent might provide context about user preferences, while another returns analytical results.

- **Negotiation**: Each message includes a `parts` field, which contains fully formed content fragments such as generated text or images. Each part has a specified content type, allowing client and remote agents to negotiate the correct format. It also explicitly supports negotiation for user UI features like iframes, videos, web forms, etc.

## Core Concepts

Above, we outlined the basic working principles of A2A. This protocol involves a series of core concepts that define the interactions between agents.

![A2A Core Concepts](https://static.claudemcp.com/images/blog/a2a-core.png)

### Participants

First, we need to clarify the participants in the A2A protocol, including users, clients, and servers:

- **User**: The end user (human or automated service) initiating a request or goal that requires assistance from an agent.
- **A2A Client (Client Agent)**: An application, service, or other AI agent that represents the user in requesting actions or information from a remote agent. The client initiates communication using the A2A protocol.
- **A2A Server (Remote Agent)**: An AI agent or agent system that exposes an HTTP endpoint implementing the A2A protocol. It receives requests from clients, processes tasks, and returns results or status updates. To the client, the remote agent operates as an "invisible" system, with no need for the client to understand its internal implementation.

### Communication Elements

After identifying the participants, the next focus is the communication protocol—how these participants interact.

**Agent Card**

- A JSON metadata document, typically discoverable via the URL `/.well-known/agent.json`, which describes the A2A server.
- It details the agent's identity (name, description), service endpoint URLs, version, supported A2A features (e.g., streaming or push notifications), specific skills offered, default input/output methods, and authentication requirements.
- Clients use the agent card to discover the agent and learn how to interact with it securely and effectively.

**Task**

- When a client sends a message to an agent, the agent may determine that fulfilling the request requires completing a task (e.g., "generate a report," "book a flight," "answer a question").
- Each task has a unique ID assigned by the agent and progresses through a defined lifecycle (e.g., `submitted`, `working`, `input-required`, `completed`, `failed`).
- Tasks are stateful and may involve multiple exchanges (messages) between the client and server.

**Message**

- Represents a single turn or unit of communication between the client and the agent.
- A message has a `role` (messages sent by the client are labeled `user`, while those sent by the server are labeled `agent`) and contains one or more `Part` objects that carry the actual content. The `messageId` field is a unique identifier set by the sender for each message.
- Used to convey instructions, context, questions, answers, or status updates, which may not necessarily be formal `Artifacts`.

**Part**

- The fundamental content unit within a message or `Artifact`. Each part has a specific `type` and can carry different kinds of data:
  - `TextPart`: Contains plain text content.
  - `FilePart`: Represents a file, transmitted either as inline base64-encoded bytes or referenced via a URI. Includes metadata such as filename and media type.
  - `DataPart`: Carries structured JSON data, suitable for forms, parameters, or any machine-readable information.

**Artifact**

- Represents the output results generated by the remote agent during task processing.
- Examples include generated documents, images, spreadsheets, structured data, or any other self-contained piece of information that directly results from the task.
- An `Artifact` consists of one or more `Part` objects and can be streamed incrementally.

### Interaction Mechanisms

**Request/Response (Polling)**

- The client sends a request (e.g., using the `message/send` RPC method) and receives a response from the server.
- If the interaction involves a stateful, long-running task, the server may initially respond with a `working` status. The client then periodically polls by calling `tasks/get` until the task reaches a terminal state (e.g., `completed`, `failed`).

**Streaming (SSE)**

- Used for tasks that produce results incrementally or provide real-time progress updates.
- The client initiates the interaction with the server using `message/stream`.
- The server responds with an open HTTP connection, sending a stream of Server-Sent Events (SSE).
- These events can be `Task`, `Message`, `TaskStatusUpdateEvent` (for state changes), or `TaskArtifactUpdateEvent` (for new or updated artifacts).
- This requires the server to advertise `streaming` capability in its agent card.

**Push Notifications**

- For very long-running tasks or scenarios where maintaining a persistent connection (e.g., SSE) is impractical.
- The client may provide a webhook URL when initiating the task (or by calling `tasks/pushNotificationConfig/set`).
- When significant task state changes occur (e.g., `completed`, `failed`, or `input-required`), the server can send an asynchronous notification (an HTTP POST request) to the client-provided webhook.
- This requires the server to declare `pushNotifications` capability in its agent card.

### Additional Concepts

- **Context (contextId)**: A server-generated identifier used to logically group related task objects, providing context for a series of interactions.
- **Transport and Format**: A2A communication occurs over HTTP(S), with all request and response payloads formatted using JSON-RPC 2.0.
- **Authentication & Authorization**: A2A relies on standard cybersecurity practices. Authentication requirements are declared in the agent card, and credentials (e.g., OAuth tokens, API keys) are typically passed via HTTP headers, separate from the A2A protocol messages themselves.
- **Agent Discovery**: The process by which clients locate agent cards to identify available A2A servers and their capabilities.
- **Extensions**: A2A allows agents to declare custom protocol extensions in their agent cards.

By understanding these core components and mechanisms, developers can effectively design, implement, and leverage A2A to build interoperable and collaborative AI agent systems.

## User Case

Here is a real-world example of A2A in an enterprise scenario. A new employee is hired at a company, and multiple systems and departments are involved in the onboarding process:

- HR needs to create records and send a welcome email.
- The IT department needs to provide a laptop and company account.
- The facilities team needs to prepare a desk and an access badge.

Traditionally, these steps were handled manually or through tightly coupled integrations between internal systems. Now, if each department exposes its own agent using the A2A protocol:

| **Agent**                      | **Responsibilities**                    |
| ------------------------------ | --------------------------------------- |
| `hr-agent.company.com`         | Create employee records, send documents |
| `it-agent.company.com`         | Set up email accounts, order laptops    |
| `facilities-agent.company.com` | Assign desks, print badges              |

Suppose we have a multi-agent system, `OnboardingPro` (e.g., `onboarding-agent.company.com`), which orchestrates the entire onboarding workflow.

1. **Discovery**: It reads each agent's `.well-known/agent.json` to understand its capabilities and authentication.
2. **Task Delegation**:
   - Sends the `createEmployee` task to the HR agent.
   - Sends the `setupEmailAccount` and `orderHardware` tasks to the IT agent.
   - Sends the `assignDesk` and `generateBadge` tasks to the facilities agent.
3. **Continuous Updates**: Agents stream back progress updates via server-sent events (e.g., "Laptop shipped," "Desk assigned").
4. **Artifact Collection**: Final outputs (e.g., PDF badge, confirmation email, account credentials) are returned as A2A artifacts.
5. **Completion**: `OnboardingPro` notifies the hiring manager that onboarding is complete.

![A2A User Case](https://static.claudemcp.com/images/blog/a2a-usercase.png)

## A2A and MCP

As we have previously detailed in the [MCP Protocol](https://www.claudemcp.com), some might assume that the A2A protocol is a replacement for MCP. However, this is not the case—the two are complementary. The MCP protocol primarily focuses on enabling AI models to dynamically access external data sources, invoke external tools, and obtain real-time information to execute tasks. If MCP is a socket wrench (for tools), then A2A is the conversation between mechanics (for collaboration). These two protocols perfectly complement each other in functionality. We recommend using MCP for tools and A2A for agents.

- **MCP**: Focuses on connecting individual AI models with external tools and data sources (Model to Data/Tools).
- **A2A**: Focuses on communication and collaboration between multiple AI agents (Agent to Agent).

![A2A and MCP](https://static.claudemcp.com/images/blog/a2a-mcp-1.png)

> An agent application might use A2A to communicate with other agents, while internally, each agent employs MCP to interact with its specific tools and resources.

## A2A Protocol

After understanding some basic concepts of A2A, let's delve into how the specific A2A protocol is defined (version 0.2.2).

A2A communication must occur over HTTP(S), with all request and response payloads formatted using JSON-RPC 2.0. The A2A server provides services at the URL defined in its `AgentCard`.

### Agent Discovery

The A2A server **must** provide an agent card. An agent card is a JSON document that describes the server's identity, capabilities, skills, service endpoint URLs, and how clients should authenticate and interact with it. Clients use this information to discover suitable agents and configure their interactions.

Clients can locate agent cards through several methods, including:

- **URI Strategy**: Accessing a predefined path on the agent's domain. The recommended path for the agent card is `https://{server_domain}/.well-known/agent.json`, which is also the preferred approach.
- **Registry/Directory**: An agent directory or registry.
- **Direct Configuration**: Clients may pre-configure the URL of the agent card or the card content itself.

The agent card itself may contain sensitive information.

- If the agent card includes sensitive information, the endpoint providing the card **must** be protected with appropriate access controls (e.g., mTLS, network restrictions, or requiring authentication to retrieve the card).
- It is generally not recommended to include plaintext keys (such as static API keys) directly in the agent card.

#### AgentCard Object Structure

The structure of an `AgentCard` is as follows:

```typescript
/**
 * An AgentCard conveys key information:
 * - General details (version, name, description, purpose)
 * - Skills: A set of capabilities the agent can perform
 * - Default modality/content type support
 * - Authentication requirements
 */
export interface AgentCard {
  /**
   * A human-readable name for the agent.
   * @example "Recipe Agent"
   */
  name: string;
  /**
   * A human-readable description of the agent. Helps users and other agents understand its capabilities.
   * @example "Agent that helps users with recipes and cooking."
   */
  description: string;
  /** The URL where the agent is hosted. */
  url: string;
  /** The URL of the agent's icon. */
  iconUrl?: string;
  /** The service provider of the agent. */
  provider?: AgentProvider;
  /**
   * The version of the agent—format determined by the provider.
   * @example "1.0.0"
   */
  version: string;
  /** The URL of the agent's documentation. */
  documentationUrl?: string;
  /** Optional capabilities supported by the agent. */
  capabilities: AgentCapabilities;
  /** Security scheme details for authentication. */
  securitySchemes?: { [scheme: string]: SecurityScheme };
  /** Security requirements for accessing the agent. */
  security?: { [scheme: string]: string[] }[];
  /**
   * The interaction modes supported by the agent for all skills. This can be overridden per skill.
   * Supported input media types.
   */
  defaultInputModes: string[];
  /** Supported output media types. */
  defaultOutputModes: string[];
  /** Skills represent units of capability the agent can perform. */
  skills: AgentSkill[];
  /**
   * If true, the agent supports providing an extended AgentCard upon user authentication.
   * Defaults to false if unspecified.
   */
  supportsAuthenticatedExtendedCard?: boolean;
}
```

## Python SDK

In the previous section, we explored the A2A protocol in detail. Now, let's put it into practice by implementing it in specific scenarios using the official [Python SDK](https://github.com/google-a2a/a2a-python).

Here, we'll use the Python SDK to build a simple "echo" A2A server, which will help us understand the fundamental concepts and components of an A2A server.

### Initialization

First, ensure your Python version is 3.10 or higher. We'll continue using `uv` for project management.

Initialize the project:

```bash
uv init a2a-demo
cd a2a-demo
```

Then install the A2A Python SDK dependencies:

```bash
uv add a2a-sdk uvicorn
```

The project directory structure should now look like this:

```bash
$ tree .
.
├── README.md
├── main.py
├── pyproject.toml
└── uv.lock

0 directories, 4 files
```

### Server Implementation

Next, we'll implement an A2A server (i.e., the remote agent) in the `main.py` file. We can leverage the components provided by `a2a-sdk` for this purpose. The core code is as follows:

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
    # Define a simple skill that returns "hello world"
    skill = AgentSkill(
        id='hello_world',
        name='Returns hello world',
        description='just returns hello world',
        tags=['hello world'],
        examples=['hi', 'hello world'],
    )

    # Define a more complex skill that returns "super hello world"
    extended_skill = AgentSkill(
        id='super_hello_world',
        name='Returns a SUPER Hello World',
        description='A more enthusiastic greeting, only for authenticated users.',
        tags=['hello world', 'super', 'extended'],
        examples=['super hi', 'give me a super hello'],
    )

    # Define a public agent card
    public_agent_card = AgentCard(
        name='Hello World Agent',
        description='Just a hello world agent',
        url='http://0.0.0.0:9999/',
        version='1.0.0',
        defaultInputModes=['text'],
        defaultOutputModes=['text'],
        capabilities=AgentCapabilities(streaming=True),
        skills=[skill],  # Only basic skills for the public card
        supportsAuthenticatedExtendedCard=True,
    )

    # Define an extended agent card that returns "super hello world"
    specific_extended_agent_card = public_agent_card.model_copy(
        update={
            'name': 'Hello World Agent - Extended Edition',  # Different name
            'description': 'The full-featured hello world agent for authenticated users.',
            'version': '1.0.1',  # Can even be a different version
            # Capabilities and other fields like url, defaultInputModes, defaultOutputModes, supportsAuthenticatedExtendedCard, etc.,
            # are inherited from public_agent_card unless specified here.
            'skills': [
                skill,
                extended_skill,
            ],  # Both skills for the extended card
        }
    )

    # Create a default request handler
    request_handler = DefaultRequestHandler(
        agent_executor=HelloWorldAgentExecutor(),
        task_store=InMemoryTaskStore(),
    )

    # Create an A2A server, here we use `A2AStarletteApplication` to create an A2A server
    server = A2AStarletteApplication(
        agent_card=public_agent_card,
        http_handler=request_handler,
        extended_agent_card=specific_extended_agent_card,
    )

    # Run the server, here we use `uvicorn` to run the server
    uvicorn.run(server.build(), host='0.0.0.0', port=9999)
```

First, we use the `AgentSkill` class to define a simple skill, which represents a unit of capability that an agent can perform. Then, we define a more complex skill.

Next, we use the `AgentCard` class to define an agent card, which represents the overall information of an agent. An `AgentCard` is used to convey key details:

- General information (version, name, description, usage)
- Skills: A set of capabilities the agent can perform
- Default modality/content type support
- Authentication requirements

The agent card we define here is as follows:

```python
public_agent_card = AgentCard(
    name='Hello World Agent',
    description='Just a hello world agent',
    url='http://0.0.0.0:9999/',
    version='1.0.0',
    defaultInputModes=['text'],
    defaultOutputModes=['text'],
    capabilities=AgentCapabilities(streaming=True),
    skills=[skill],  # Only basic skills for the public card
    supportsAuthenticatedExtendedCard=True,
)
```

The agent information we define here includes:

- `name`: The name of the agent
- `description`: A description of the agent
- `url`: The URL of the agent
- `version`: The version of the agent
- `defaultInputModes`: The input modes, here defined as `text`, indicating the agent supports text input
- `defaultOutputModes`: The output modes, here defined as `text`, indicating the agent supports text output
- `capabilities`: The agent's capabilities, here defined as `streaming`, indicating the agent supports streaming output
- `skills`: The skills the agent supports, here defined as `skill`, representing the agent's supported skills
- `supportsAuthenticatedExtendedCard`: Whether the agent supports an extended authenticated card

To extend the agent card, we can even override and create a new `AgentCard`, as shown below:

```python
# Define an extended agent card to return "super hello world"
specific_extended_agent_card = public_agent_card.model_copy(
    update={
        'name': 'Hello World Agent - Extended Edition',  # Different name
        'description': 'The full-featured hello world agent for authenticated users.',
        'version': '1.0.1',  # Even a different version
        # Other fields like url, defaultInputModes, defaultOutputModes, supportsAuthenticatedExtendedCard, etc.,
        # unless specified here, will be inherited from public_agent_card.
        'skills': [
            skill,
            extended_skill,
        ],  # Two skills for the extended card
    }
)
```

Here, we provide two skill objects in the `skills` field, allowing us to use both skills in the extended agent card.

Next, we use the `DefaultRequestHandler` class provided by the SDK to create a default request handler, which is used to process A2A requests:

```python
# Create a default request handler
request_handler = DefaultRequestHandler(
    agent_executor=HelloWorldAgentExecutor(),
    task_store=InMemoryTaskStore(),
)
```

This requires us to provide an instance of the `AgentExecutor` object, which is responsible for executing the core logic of the agent. We need to inherit from the `AgentExecutor` class ourselves. Additionally, we need to provide an instance of the `TaskStore` object, which is used to store tasks. Here, we use the `InMemoryTaskStore` class to implement this, indicating that tasks are stored in memory.

The key focus here is the `AgentExecutor` base class, whose basic definition is as follows:

```python
from abc import ABC, abstractmethod

from a2a.server.agent_execution.context import RequestContext
from a2a.server.events.event_queue import EventQueue


class AgentExecutor(ABC):
    """Agent executor interface.

    Classes implementing this interface contain the core logic of an agent, executing tasks based on requests and publishing updates to the event queue.
    """

    @abstractmethod
    async def execute(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        """Execute the agent's logic, performing tasks based on the request and publishing updates to the event queue.
        Args:
            context: Request context containing messages, task IDs, etc.
            event_queue: Queue for publishing events
        """

    @abstractmethod
    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        """Request the agent to cancel an ongoing task.
        Args:
            context: Request context containing the task ID to be canceled
            event_queue: Queue for publishing cancellation status update events
        """

```

The `execute` method is used to execute the agent's logic. The agent should read necessary information from the `context` and publish `Task` or `Message` events, or `TaskStatusUpdateEvent` / `TaskArtifactUpdateEvent` to the event queue. The event queue serves as a buffer for A2A to respond to the agent, bridging asynchronous execution and response handling (e.g., via SSE streaming).

The `cancel` method is used to cancel an ongoing task. The agent should attempt to stop the task identified in the context and publish a `TaskStatusUpdateEvent` with the status `TaskState.canceled` to the event queue.

Next, we create a file named `agent_executor.py` to implement the `AgentExecutor` interface, as shown below:

```python
# agent_executor.py
from a2a.server.agent_execution import AgentExecutor, RequestContext
from a2a.server.events import EventQueue
from a2a.utils import new_agent_text_message


class HelloWorldAgent:
    """Hello World agent."""
    async def invoke(self) -> str:
        return 'Hello World'


class HelloWorldAgentExecutor(AgentExecutor):
    """AgentExecutor implementation."""

    def __init__(self):
        self.agent = HelloWorldAgent()

    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        # Execute the agent's logic—here, we directly return "Hello World"
        result = await self.agent.invoke()
        # Publish a text message to the event queue
        await event_queue.enqueue_event(new_agent_text_message(result))

    async def cancel(
        self, context: RequestContext, event_queue: EventQueue
    ) -> None:
        # Cancel logic for the agent—here, we raise an exception as cancellation is not supported
        raise Exception('cancel not supported')

```

As shown in the code above, we have implemented the `AgentExecutor` interface, including the `execute` and `cancel` methods. The `execute` method executes the agent's logic, while the `cancel` method cancels an ongoing task.

In the `execute` method, we directly call the `invoke` method of `HelloWorldAgent`, which represents the actual execution of the agent's logic. For example, we could integrate an LLM model, invoke it to perform the agent's logic, and then return the result (here, we return a fixed string). The result is then published to the event queue.

We use the `new_agent_text_message` function to convert the agent's execution result into a text message object, which corresponds to the `Message` object mentioned earlier in the protocol:

```python
def new_agent_text_message(
    text: str,
    context_id: str | None = None,
    task_id: str | None = None,
) -> Message:
    """Create a new agent message containing a single TextPart.

    Args:
        text: The text content of the message
        context_id: The context ID of the message
        task_id: The task ID of the message

    Returns:
        A new `Message` object with the 'agent' role
    """
    return Message(
        role=Role.agent,
        parts=[Part(root=TextPart(text=text))],
        messageId=str(uuid.uuid4()),
        taskId=task_id,
        contextId=context_id,
    )
```

Once all preparations are complete, we use the `A2AStarletteApplication` class to create an A2A server and run it using `uvicorn`:

```python
# Create an A2A server using `A2AStarletteApplication`
server = A2AStarletteApplication(
    agent_card=public_agent_card,
    http_handler=request_handler,
    extended_agent_card=specific_extended_agent_card,
)

# Run the server using `uvicorn`
uvicorn.run(server.build(), host='0.0.0.0', port=9999)
```

Finally, start the service:

```bash
$ python main.py
INFO:     Started server process [98132]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:9999 (Press CTRL+C to quit)
```

After running, you can access `http://localhost:9999/.well-known/agent.json` in a browser to retrieve the agent's card information.

![Agent card information](https://static.claudemcp.com/images/blog/a2a-agentcard-info.png)

Similarly, you can access `http://localhost:9999/agent/authenticatedExtendedCard` to retrieve the extended agent card information:

![Extended agent card information](https://static.claudemcp.com/images/blog/a2a-agentcard-extend.png)

At this point, we have implemented the simplest A2A server program.

### Client

Next, we will implement an A2A client to invoke the capabilities of remote agents using the agent card information from the server. Again, we will use the Python SDK to achieve this. The core code is as follows:

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
        # Initialize A2ACardResolver
        resolver = A2ACardResolver(
            httpx_client=httpx_client,
            base_url=base_url,
            # agent_card_path uses default value, extended_agent_card_path also uses default value
        )

        # Fetch public agent card and initialize the client
        final_agent_card_to_use: AgentCard | None = None

        try:
            logger.info(
                f'Attempting to fetch public agent card from: {base_url}{PUBLIC_AGENT_CARD_PATH}'
            )
            _public_card = (
                await resolver.get_agent_card()
            )  # Fetch from the default public path
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
                        _extended_card  # Update to use the extended agent card
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
            ):  # supportsAuthenticatedExtendedCard is False or None
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

        # Initialize A2AClient object
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
        # Construct a send message request object
        request = SendMessageRequest(
            id=str(uuid4()), params=MessageSendParams(**send_message_payload)
        )
        # Send the message
        response = await client.send_message(request)
        # Print the response
        print(response.model_dump(mode='json', exclude_none=True))

        # Construct a streaming send message request object
        streaming_request = SendStreamingMessageRequest(
            id=str(uuid4()), params=MessageSendParams(**send_message_payload)
        )

        # Send the streaming message
        stream_response = client.send_message_streaming(streaming_request)

        # Print the streaming message response
        async for chunk in stream_response:
            print(chunk.model_dump(mode='json', exclude_none=True))


if __name__ == '__main__':
    import asyncio

    asyncio.run(main())
```

First, we request the agent card information from the A2A server (via the `/.well-known/agent.json` path). Then, we check whether the server supports providing an extended agent card upon user authentication. If supported, we request the extended agent card information (via the `/agent/authenticatedExtendedCard` path).

Once we have the agent card data, we only need to initialize an `A2AClient` object to start invoking the agent's capabilities. For example, we can construct a send message request object `SendMessageRequest` and then call the `send_message` method to send the message and receive the remote agent's response. To construct a streaming message request, we create a `SendStreamingMessageRequest` object and call the `send_message_streaming` method to send the message and receive the streaming response data.

Finally, we run the client program directly for testing:

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

In the output above, we first requested the public agent card information, then fetched the extended agent card information, and finally sent a message to the remote agent, receiving its response.

At this point, we have implemented the simplest A2A server and client program.

Here, we have merely demonstrated the basic mechanics of A2A. In real-world scenarios, our agents would be more sophisticated, supporting advanced features such as streaming, task state management, and LLM-driven multi-turn conversations. Different agents might also be implemented using various frameworks. We could even integrate [MCP](https://www.claudemcp.com/servers) within an agent to enhance functionality. Furthermore, we could develop an aggregation platform where users could configure the card addresses provided by various agents, enabling them to invoke the capabilities of these agents through the platform. These more complex functionalities will be covered in subsequent articles.
