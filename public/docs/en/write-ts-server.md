---
title: Write a MCP Server
description: How to write your first TypeScript MCP server
section: base-dev
prev: quickstart
next: write-ts-client
pubDate: 2024-12-03
order: 1
---

# Write a TypeScript MCP Server

In the previous section, we learned how to use the MCP protocol by following the [Quick Start](./quickstart). However, we have been using the MCP servers built in by Claude Desktop directly. So how can we implement our own MCP server?

Next, we will demonstrate how to write an MCP server through a TypeScript example. We will create a weather server that provides current weather data as a resource and allows Claude to use tools to get weather forecasts.

We need to use the [OpenWeatherMap API](https://openweathermap.org/api) to get weather data. After registering, you can get a free API key on the [API keys](https://home.openweathermap.org/api_keys) page.

## Environment Preparation

We need to prepare a TypeScript development environment, so we need to install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com).

```bash
# Check Node.js version, need v18 or higher version
node --version

# Check npm version
npm --version
```

Next, we can use the `@modelcontextprotocol/create-server` tool to create an MCP server scaffold:

```bash
$ npx @modelcontextprotocol/create-server weather-server
Need to install the following packages:
@modelcontextprotocol/create-server@0.3.1
Ok to proceed? (y) y

? What is the name of your MCP server? y
? What is the description of your server? A Model Context Protocol server
? Would you like to install this server for Claude.app? Yes
✔ MCP server created successfully!
✓ Successfully added MCP server to Claude.app configuration

Next steps:
  cd weather-server
  npm install
  npm run build  # or: npm run watch
  npm link       # optional, to make available globally

$ cd weather-server
```

Then install the dependencies:

```bash
npm install --save axios dotenv
```

Next, we need to set the environment variables, create a `.env` file:

```
OPENWEATHER_API_KEY=your-api-key-here
```

Ensure to add the `.env` file to the `.gitignore` file.

After the project is created, we can see the project structure as follows:

![MCP Server Project Structure](https://static.claudemcp.com/images/claude-write-ts-server-layout.png)

## Template Analysis

We use the scaffold to create a project, which creates a template for an MCP server by default. This template implements a simple note system, which explains the core MCP concepts of resources and tools in the following ways:

- List notes as resources
- Read personal notes
- Create new notes through tools
- Summarize all notes through prompts

Before writing our own MCP server, we can learn how this note system is implemented, and then we can implement our own MCP server based on this template.

First, let's look at the imported dependency packages:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
```

The first line of code is importing the `Server` object from the MCP SDK, which represents an MCP server. This server will automatically respond to the initialization process initiated by the client. Later, we will also see that objects such as `ListResourcesRequestSchema` and `ReadResourceRequestSchema` are imported, which represent the request types defined in the MCP protocol.

For example, the template creates an MCP server through `Server`:

```typescript
const server = new Server(
  {
    name: "weather-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);
```

This code creates an MCP server with resources (for listing/reading notes), tools (for creating new notes), and prompts (for summarizing notes), and specifies the server's name and version.

After the server is initialized, we can register handlers through the `setRequestHandler` method of the `Server` object. When the protocol object receives a request for a specified method, it will be called, which is actually equivalent to writing an HTTP server. When an HTTP request with a specified method is received, the registered handler will be called.

In the template, we can see that several handlers are registered:

### Resources

Here we need to explain the `Resources` concept in the MCP protocol. Resources represent an object that can be read and manipulated, and we can expose data and content from the server to LLMs, and then LLMs can operate on these resources through tools. For example, we can treat a note, a file, a database table, etc. as resources.

> ⚠️ Note that resources are designed to be controlled by the application, which means that the client application can decide how and when to use them. Different MCP clients may handle resources differently. For example:
>
> - Claude Desktop currently requires users to explicitly select resources before using them
> - Other clients may automatically select resources
> - Some implementations even allow the AI model itself to determine which resources to use
>
> So server developers should be prepared to handle any of these interaction patterns when implementing resource support. To automatically expose data to the model, server authors should use model control primitives, such as tools.

Resources represent any type of data that the MCP server wants to provide to the client, which can include:

- File content
- Database records
- API response
- Real-time system data
- Screenshots and images
- Log files
- And more

Each resource is identified by a unique `URI`, and can contain text or binary data.

The template exposes all the note resources to the client, and registers a handler to process the client's `resources/list` request through `setRequestHandler`:

```typescript
/**
 * Handler for listing available notes as resources.
 * Each note is exposed as a resource with the following characteristics:
 * - note:// URI scheme
 * - MIME type
 * - Human-readable name and description (including note title)
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(notes).map(([id, note]) => ({
      uri: `note:///${id}`,
      mimeType: "text/plain",
      name: note.title,
      description: `A text note: ${note.title}`,
    })),
  };
});
```

#### Resource URI

Resources are identified using URIs in the following format:

```
[protocol]://[host]/[path]
```

For example:

- `file:///home/user/documents/report.pdf`
- `postgres://database/customers/schema`
- `screen://localhost/display1`

Where `protocol` is the protocol and `path` is the path defined by the MCP server implementation, of course, the server can define its own custom URI schemes.

#### Resource Types

Resources can contain two types of content:

**Text Resources**

Text resources contain UTF-8 encoded text data, which are suitable for:

- Source code
- Configuration files
- Log files
- JSON/XML data
- Plain text

**Binary Resources**

Binary resources contain raw binary data encoded in `base64`, which are suitable for:

- Images
- PDF files
- Audio files
- Video files
- Other non-text formats

#### Resource Discovery

Clients can discover available resources in two main ways:

**Direct Resources**

The server exposes a list of specific resources through the `resources/list` endpoint. Each resource includes:

```json
{
  uri: string;           // The unique identifier of the resource
  name: string;          // A human-readable name
  description?: string;  // An optional description
  mimeType?: string;     // An optional MIME type
}
```

**Resource Templates**

For dynamic resources, the server can expose **URI templates**, and clients can use these templates to construct valid resource URIs:

```json
{
  uriTemplate: string;   // URI template following RFC 6570
  name: string;          // A human-readable name for this type
  description?: string;  // An optional description
  mimeType?: string;     // An optional MIME type for all matching resources
}
```

#### Reading Resources

To read a resource, the client sends a `resources/read` request with the resource URI. The server responds with a list of resource content as follows:

```json
{
  contents: [
    {
      uri: string;        // The URI of the resource
      mimeType?: string;  // An optional MIME type
      // One of the following:
      text?: string;      // For text resources
      blob?: string;      // For binary resources (base64 encoded)
    }
  ]
}
```

The server may return multiple resources to respond to a `resources/read` request, such as returning a list of files in a directory when reading a directory.

For example, the processor implementation for reading a note is as follows:

```typescript
/**
 * Handler for reading the content of a specified note.
 * Accepts a note:// URI and returns the note content as plain text.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, "");
  const note = notes[id];

  if (!note) {
    throw new Error(`Note ${id} not found`);
  }

  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: "text/plain",
        text: note.content,
      },
    ],
  };
});
```

#### Resource Updates

MCP supports real-time updates of resources through two mechanisms:

**List Changes**

When the list of available resources changes, the server can notify the client through `notification/resources/list_changed`.

**Content Changes**

Clients can subscribe to updates of a specified resource:

- The client sends a `resources/subscribe` request with the resource URI
- When the resource changes, the server sends a `notification/resources/update` notification
- The client can get the latest content through `resources/read`
- The client can unsubscribe from the resource

### Tools

Tools allow LLMs to perform operations through your server, and allow servers to expose executable functions to clients, through tools, LLMs can interact with external systems, perform calculations, and execute real-world actions. Tools are exposed to clients from the server, with the purpose of AI models being able to automatically invoke them (with approval).

MCP tools allow servers to expose executable functions that can be called by clients, and are used by LLMs to perform operations, the implementation of tools mainly includes the following aspects:

- **Discoverability**：Clients can list available tools through the `tools/list` endpoint
- **Invocation**：Use the `tools/call` endpoint to invoke tools, where the server performs the requested operation and returns the result
- **Flexibility**：The scope of tools can range from simple calculations to complex API interactions

Like resources, tools are identified by unique names and can include descriptions to identify their purpose, but unlike resources, tools represent dynamic operations that can modify state or interact with external systems.

Each tool is defined with the following structure:

```json
{
  name: string;          // The unique identifier of the tool
  description?: string;  // A human-readable description
  inputSchema: { // The JSON Schema for the tool's parameters
    type: "object";
    properties: { ... } // The tool's specific parameters
  }
}
```

For example, in the template code, a tool list processor is registered through `setRequestHandler`:

```typescript
/**
 * Handler for listing available tools.
 * Exposes a "create_note" tool, allowing clients to create new notes.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_note",
        description: "Create a new note",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note",
            },
            content: {
              type: "string",
              description: "Text content of the note",
            },
          },
          required: ["title", "content"],
        },
      },
    ],
  };
});
```

The above code defines a tool named `create_note` according to the tool structure defined earlier, which represents creating a new note, and requires two parameters: `title` and `content`, i.e., the title and content of the note. This way, the client knows that there is a `create_note` tool that can be called, and knows that the tool requires `title` and `content` parameters when called.

To actually implement the tool, we need to register a tool call processor, as shown in the following code:

```typescript
/**
 * Handler for creating a new note.
 * Creates a new note with the provided title and content, and returns a success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "create_note": {
      const title = String(request.params.arguments?.title);
      const content = String(request.params.arguments?.content);
      if (!title || !content) {
        throw new Error("Title and content are required");
      }

      const id = String(Object.keys(notes).length + 1);
      notes[id] = { title, content };

      return {
        content: [
          {
            type: "text",
            text: `Created note ${id}: ${title}`,
          },
        ],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});
```

The above code is very simple, it creates a new note with the provided title and content, and returns a success message. When the client calls the `create_note` tool, it will trigger the above processor code.

### Prompts

`Prompts` are a mechanism in the MCP protocol for defining reusable prompt templates and workflows, clients can easily display these templates and workflows to users and LLMs. Prompts are designed to be controlled by users, which means they are exposed to clients from the server, so users can explicitly select and use them.

MCP prompts are predefined templates that can:

- Accept dynamic parameters
- Include context from resources
- Chain multiple interactions
- Guide specific workflows
- Be used as UI elements (such as slash commands)

Each prompt is defined with the following structure:

```json
{
  name: string;              // The unique identifier of the prompt
  description?: string;      // A human-readable description
  arguments?: [              // An optional list of arguments
    {
      name: string;          // The identifier of the argument
      description?: string;  // The description of the argument
      required?: boolean;    // Whether it is required
    }
  ]
}
```

Clients can discover all available prompts through the `prompts/list` endpoint, for example, by sending the following request:

```json
// Request
{
  method: "prompts/list"
}

// Response
{
  prompts: [
    {
      name: "analyze-code",
      description: "Analyze code for potential improvements",
      arguments: [
        {
          name: "language",
          description: "Programming language",
          required: true
        }
      ]
    }
  ]
}
```

Then, you can get the detailed information of a specified prompt through the `prompts/get` endpoint:

````json
// Request
{
  "method": "prompts/get",
  "params": {
    "name": "analyze-code",
    "arguments": {
      "language": "python"
    }
  }
}

// Response
{
  "description": "Analyze Python code for potential improvements",
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Please analyze the following Python code for potential improvements:\n\n```python\ndef calculate_sum(numbers):\n    total = 0\n    for num in numbers:\n        total = total + num\n    return total\n\nresult = calculate_sum([1, 2, 3, 4, 5])\nprint(result)\n```"
      }
    }
  ]
}
````

For example, the template registers a prompt list processor through `setRequestHandler`, as shown in the following code:

```typescript
/**
 * Handler for listing available prompts.
 * Exposes a "summarize_notes" prompt, for summarizing all notes.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "summarize_notes",
        description: "Summarize all notes",
      },
    ],
  };
});
```

We can see that the template registers a prompt named `summarize_notes`, which is used to summarize all notes, but this prompt does not define any parameters, so the client does not need to pass any parameters when calling this prompt.

Then, to get the detailed information of a prompt, you can get it through the `prompts/get` endpoint, the template also registers a prompt get processor through `setRequestHandler`, as shown in the following code:

```typescript
/**
 * Handler for summarizing all notes.
 * Returns a prompt for requesting to summarize all notes, and embeds the note content as resources.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "summarize_notes") {
    throw new Error("Unknown prompt");
  }

  const embeddedNotes = Object.entries(notes).map(([id, note]) => ({
    type: "resource" as const,
    resource: {
      uri: `note:///${id}`,
      mimeType: "text/plain",
      text: note.content,
    },
  }));

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Please summarize the following notes:",
        },
      },
      ...embeddedNotes.map((note) => ({
        role: "user" as const,
        content: note,
      })),
      {
        role: "user",
        content: {
          type: "text",
          text: "Provide a concise summary of all the notes above.",
        },
      },
    ],
  };
});
```

From the above code, we can see that when generating the prompt, all note content is embedded into the prompt, so the context now has the related content of the notes.

### Start the Server

Here, we have implemented a simple MCP server and registered resource, tool, and prompt processors. Of course, we still need to start the server so that the server we wrote can actually run.

The template starts the server using the `stdio` transport, as shown in the following code:

```typescript
/**
 * Start the server using the stdio transport.
 * Allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

The `stdio` transport supports communication via standard input/output streams, which is particularly useful for local integration and command line tools. We can use `stdio` in the following cases:

- Build command line tools
- Implement local integration
- Need simple process communication
- Use shell scripts

In addition to the `stdio` transport, MCP also supports the Server-Sent Events (SSE) transport based on HTTP, the SSE transport supports server-to-client streaming through HTTP POST requests, for client-to-server communication. We can use `SSE` in the following cases:

- Only need server-to-client streaming
- Use restricted networks
- Implement simple updates

## Implement a Weather MCP Server

After analyzing the implementation of the MCP server above, we can now write code according to our requirements. Our requirement is to provide a weather query service, where we can expose weather data as resources and provide a weather query tool.

First, let's define the types for our weather resources as shown in the code below:

```typescript
// src/types/weather.ts
export interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
  wind: {
    speed: number;
  };
  dt_txt?: string;
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  humidity: number;
  wind_speed: number;
  timestamp: string;
}

export interface ForecastDay {
  date: string;
  temperature: number;
  conditions: string;
}

export interface GetForecastArgs {
  city: string;
  days?: number;
}

// Type guard function to check GetForecastArgs type
export function isValidForecastArgs(args: any): args is GetForecastArgs {
  return (
    typeof args === "object" &&
    args !== null &&
    "city" in args &&
    typeof args.city === "string" &&
    (args.days === undefined || typeof args.days === "number")
  );
}
```

The type definition here is mainly based on the response data type of the OpenWeather API, so we can easily use these types.

Then, write the following basic code to replace the code in `src/index.ts` of the template:

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";
import {
  WeatherData,
  ForecastDay,
  OpenWeatherResponse,
  isValidForecastArgs,
} from "./types.js";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("OPENWEATHER_API_KEY environment variable is required");
}

const API_CONFIG = {
  BASE_URL: "http://api.openweathermap.org/data/2.5",
  DEFAULT_CITY: "San Francisco",
  ENDPOINTS: {
    CURRENT: "weather",
    FORECAST: "forecast",
  },
} as const;

class WeatherServer {
  private server: Server;
  private axiosInstance;

  constructor() {
    this.server = new Server(
      {
        name: "weather-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Configure axios instance
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      params: {
        appid: API_KEY,
        units: "metric",
      },
    });

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupResourceHandlers(): void {
    // TODO: Implement resource handlers
  }

  private setupToolHandlers(): void {
    // TODO: Implement tool handlers
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error("Weather MCP server running on stdio");
  }
}

const server = new WeatherServer();
server.run().catch(console.error);
```

Here, we encapsulated the code a bit on the template by defining it as a class, mainly doing the following:

- Defined the types for weather resources
- Initialized an MCP server instance
- Registered resource and tool handlers
- Started the server

Where the resource and tool handlers are marked with `TODO`, and we can implement these handlers next.

### Implement Resource Handlers

In the `setupResourceHandlers` method, we will implement the resource handlers, first add a resource listing handler, then add a resource reading handler, as shown in the following code:

```typescript
private setupResourceHandlers(): void {
  this.server.setRequestHandler(
    ListResourcesRequestSchema,
    async () => ({
      resources: [{
        uri: `weather://${API_CONFIG.DEFAULT_CITY}/current`,
        name: `Current weather in ${API_CONFIG.DEFAULT_CITY}`,
        mimeType: "application/json",
        description: "Real-time weather data including temperature, conditions, humidity, and wind speed"
      }]
    })
  );

  this.server.setRequestHandler(
    ReadResourceRequestSchema,
    async (request) => {
      const city = API_CONFIG.DEFAULT_CITY;
      if (request.params.uri !== `weather://${city}/current`) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Unknown resource: ${request.params.uri}`
        );
      }

      try {
        const response = await this.axiosInstance.get<OpenWeatherResponse>(
          API_CONFIG.ENDPOINTS.CURRENT,
          {
            params: { q: city }
          }
        );

        const weatherData: WeatherData = {
          temperature: response.data.main.temp,
          conditions: response.data.weather[0].description,
          humidity: response.data.main.humidity,
          wind_speed: response.data.wind.speed,
          timestamp: new Date().toISOString()
        };

        return {
          contents: [{
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(weatherData, null, 2)
          }]
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new McpError(
            ErrorCode.InternalError,
            `Weather API error: ${error.response?.data.message ?? error.message}`
          );
        }
        throw error;
      }
    }
  );
}
```

The implementation of the resource listing handler is very simple, here we define the `weather` protocol ourselves, and the data type is JSON format. When getting the resource, we first request the current weather data from the OpenWeather API using `axios`, then convert it to the `WeatherData` type and return it.

### Implement Tool Handlers

After implementing the resource handlers, we can implement the tool handlers. The tool handlers are mainly used to implement some tool functions, here we implement a tool to query the weather forecast for the future, as shown in the following code:

```typescript
private setupToolHandlers(): void {
  this.server.setRequestHandler(
    ListToolsRequestSchema,
    async () => ({
      tools: [{
        name: "get_forecast",
        description: "Get weather forecast for a city",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "City name"
            },
            days: {
              type: "number",
              description: "Number of days (1-5)",
              minimum: 1,
              maximum: 5
            }
          },
          required: ["city"]
        }
      }]
    })
  );

  this.server.setRequestHandler(
    CallToolRequestSchema,
    async (request) => {
      if (request.params.name !== "get_forecast") {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isValidForecastArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "Invalid forecast arguments"
        );
      }

      const city = request.params.arguments.city;
      const days = Math.min(request.params.arguments.days || 3, 5);

      try {
        const response = await this.axiosInstance.get<{
          list: OpenWeatherResponse[]
        }>(API_CONFIG.ENDPOINTS.FORECAST, {
          params: {
            q: city,
            cnt: days * 8 // API returns data with 3-hour intervals
          }
        });

        const forecasts: ForecastDay[] = [];
        for (let i = 0; i < response.data.list.length; i += 8) {
          const dayData = response.data.list[i];
          forecasts.push({
            date: dayData.dt_txt?.split(' ')[0] ?? new Date().toISOString().split('T')[0],
            temperature: dayData.main.temp,
            conditions: dayData.weather[0].description
          });
        }

        return {
          content: [{
            type: "text",
            text: JSON.stringify(forecasts, null, 2)
          }]
        };
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            content: [{
              type: "text",
              text: `Weather API error: ${error.response?.data.message ?? error.message}`
            }],
            isError: true,
          }
        }
        throw error;
      }
    }
  );
}
```

Similarly, we need to implement the tool listing handler first, then implement the tool calling handler. Here we only defined a tool named `get_forecast`, which is used to get the weather forecast for a specified city, and it needs to receive two parameters `city` and `days`, where `city` is the city name, and `days` is the number of days to query, the default is 3 days, of course, the data is still obtained through the OpenWeather API request.

In fact, the resources we defined above can be directly obtained through tools, we can add a tool to get the current weather, because the data is obtained through the OpenWeather API request, so it is not necessary to define resources, but here we define resources for demonstration purposes.

### Test

We have implemented a simple weather MCP service, and now we can test it.

First, we need to build the project:

```bash
npm run build
```

Then, we need to update the configuration of Claude Desktop:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Add our weather service to the configuration, as shown below:

```json
{
  "mcpServers": {
    //...... other server configurations
    "weather": {
      "command": "node",
      "args": ["/Users/cnych/src/weather-server/build/index.js"],
      "env": {
        "OPENWEATHER_API_KEY": "your_openweather_api_key"
      }
    }
  }
}
```

Where `args` is the path to the built file, and `env` is the OpenWeather API key we need to configure. After configuring, restart Claude Desktop.

### Test

Next, we can test it, click the number button on the bottom right of the Claude Desktop input box, and it will list the `get_forecast` tool we defined.

![Claude Weather Tools](https://static.claudemcp.com/images/claude-weather-tools.png)

Next, we can test it, for example, we ask Claude for a 5-day weather forecast:

```bash
Can you get me a 5-day forecast for Beijing and tell me if I should pack an umbrella?
```

![Claude Weather Current](https://static.claudemcp.com/images/claude-weather-forecast.png)

We can see that it calls the `get_forecast` tool (requires authorization) and displays the result.

### Debug

If we encounter problems during testing, we can debug through some methods, for example, view the detailed logs of MCP:

```bash
# View logs in real-time
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

The logs will capture server connection events, configuration issues, runtime errors, message exchanges, and other information.

In addition to logs, we can also debug through `Chrome DevTools`, access the developer tools of Chrome in Claude Desktop to view client errors. You can add the following configuration to the file `~/Library/Application\ Support/Claude/developer_settings.json` to enable DevTools:

```json
{
  "allowDevTools": true
}
```

Then, use the shortcut `Command+Option+Shift+i` to open DevTools, just like debugging in Chrome.

![Claude DevTools](https://static.claudemcp.com/images/claude-devtools.png)

In addition to the above conventional debugging methods, Claude MCP also provides an `Inspector` tool, **MCP Inspector** is an interactive developer tool for testing and debugging MCP servers.

You can directly use it through `npx` command without installation:

```bash
npx @modelcontextprotocol/inspector <command>
# or
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

If the server package comes from NPM, you can start it using the following method:

```bash
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# For example
npx -y @modelcontextprotocol/inspector npx server-postgres postgres://127.0.0.1/testdb
```

If the server package is built locally, you can start it using the following method:

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

For example, for the weather service we built above, we can start it using the following method:

```bash
npx @modelcontextprotocol/inspector node /Users/cnych/src/weather-server/build/index.js
```

After the `Inspector` tool starts, it will start a Web page on `localhost:5173`, and we can test and debug our weather service on it.

![MCP Inspector](https://static.claudemcp.com/images/claude-inspector-ui.png)

Here, we need to click the `Environment Variables` button on the right, then add the `OPENWEATHER_API_KEY` environment variable, the value is the OpenWeather API key we applied for, then click the `Connect` button to connect to the weather service.

After connecting successfully, we can see the resources and tools of the weather service on the right main window, and we can test and debug them, click the `List Resources` button to list the resources of the weather service, click the listed resources to read and display the resource contents.

![MCP Inspector Resources](https://static.claudemcp.com/images/claude-inspector-resources.png)

Similarly, we can test Tools, click the `List Tools` button to list the tools of the weather service, then click a specific tool, input the parameters, and click the `Run Tool` button to call the tool and display the result.

![MCP Inspector Tools](https://static.claudemcp.com/images/claude-inspector-tools.png)

Of course, besides Resources and Tools, we can also test Prompts and Sampling.

We have implemented a simple weather MCP service.
