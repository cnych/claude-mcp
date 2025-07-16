---
title: MCP 서버 작성하기
description: 첫 번째 TypeScript MCP 서버를 작성하는 방법
section: base-dev
prev: quickstart
next: write-ts-client
pubDate: 2024-12-03
order: 1
---

# TypeScript MCP 서버 작성하기

이전 섹션에서는 [빠른 시작](./quickstart)을 따라 MCP 프로토콜을 사용하는 방법을 배웠습니다. 하지만 지금까지는 Claude 데스크톱에 내장된 MCP 서버를 직접 사용했습니다. 그렇다면 우리만의 MCP 서버를 어떻게 구현할 수 있을까요?

다음으로, TypeScript 예제를 통해 MCP 서버를 작성하는 방법을 보여드리겠습니다. 현재 날씨 데이터를 리소스로 제공하고 Claude가 도구를 사용하여 날씨 예보를 얻을 수 있게 하는 날씨 서버를 만들 것입니다.

날씨 데이터를 얻기 위해 [OpenWeatherMap API](https://openweathermap.org/api)를 사용해야 합니다. 등록 후, [API 키](https://home.openweathermap.org/api_keys) 페이지에서 무료 API 키를 얻을 수 있습니다.

## 환경 준비

TypeScript 개발 환경을 준비해야 하므로, [Node.js](https://nodejs.org)와 [npm](https://www.npmjs.com)을 설치해야 합니다.

```bash
# Node.js 버전 확인, v18 이상 필요
node --version

# npm 버전 확인
npm --version
```

이제 `@modelcontextprotocol/create-server` 도구를 사용하여 MCP 서버 스캐폴드를 생성할 수 있습니다:

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

그런 다음 의존성 패키지를 설치합니다:

```bash
npm install --save axios dotenv
```

다음으로, 환경 변수를 설정해야 합니다. `.env` 파일을 생성합니다:

```
OPENWEATHER_API_KEY=your-api-key-here
```

`.env` 파일을 `.gitignore` 파일에 추가해야 합니다.

프로젝트가 생성되면 다음과 같은 프로젝트 구조를 볼 수 있습니다:

![MCP 서버 프로젝트 구조](https://static.claudemcp.com/images/claude-write-ts-server-layout.png)

## 템플릿 분석

우리는 프로젝트를 생성하기 위해 스캐폴드를 사용합니다. 이 스캐폴드는 기본적으로 MCP 서버를 위한 템플릿을 생성합니다. 이 템플릿은 간단한 노트 시스템을 구현하며, 다음과 같은 방식으로 리소스와 도구의 핵심 MCP 개념을 설명합니다:

- 노트를 리소스로 나열
- 개인 노트 읽기
- 도구를 통해 새 노트 생성
- 프롬프트를 통해 모든 노트 요약

우리만의 MCP 서버를 작성하기 전에, 이 노트 시스템이 구현되는 방식을 배우고, 이 템플릿을 기반으로 우리만의 MCP 서버를 구현할 수 있습니다.

먼저, 가져온 의존성 패키지를 살펴보겠습니다:

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

첫 번째 줄의 코드는 MCP SDK에서 `Server` 객체를 가져오며, 이는 MCP 서버를 나타냅니다. 이 서버는 클라이언트가 시작한 초기화 과정에 자동으로 응답합니다. 나중에 우리는 `ListResourcesRequestSchema`와 `ReadResourceRequestSchema`와 같은 객체도 가져오는 것을 볼 수 있습니다. 이는 MCP 프로토콜에 정의된 요청 유형을 나타냅니다.

예를 들어, 템플릿은 `Server`를 통해 MCP 서버를 생성합니다:

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

이 코드는 리소스(노트 나열/읽기), 도구(새 노트 생성), 프롬프트(모든 노트 요약)를 포함하는 MCP 서버를 생성하고, 서버의 이름과 버전을 지정합니다.

서버가 초기화되면, 우리는 `Server` 객체의 `setRequestHandler` 메서드를 통해 핸들러를 등록할 수 있습니다. 프로토콜 객체가 지정된 메서드에 대한 요청을 받으면 해당 메서드가 호출됩니다. 이는 실제로 HTTP 서버를 작성하는 것과 동일합니다. 지정된 메서드를 사용하는 HTTP 요청을 받으면 등록된 핸들러가 호출됩니다.

템플릿에서 여러 핸들러가 등록되어 있는 것을 볼 수 있습니다:

### Resources

여기서 우리는 MCP 프로토콜에서 `Resources` 개념을 설명해야 합니다. 리소스는 읽고 조작할 수 있는 객체를 나타내며, 우리는 서버의 데이터와 콘텐츠를 LLM에 노출할 수 있으며, 그러한 리소스를 도구를 통해 작업할 수 있습니다. 예를 들어, 노트, 파일, 데이터베이스 테이블 등을 리소스로 취급할 수 있습니다.

> ⚠️ 리소스는 애플리케이션에 의해 제어되어야 하며, 이는 클라이언트 애플리케이션이 리소스를 사용하는 방법과 시기를 결정할 수 있음을 의미합니다. 다른 MCP 클라이언트는 리소스를 다르게 처리할 수 있습니다. 예를 들어:
>
> - Claude Desktop는 사용자가 리소스를 사용하기 전에 명시적으로 선택해야 합니다.
> - 다른 클라이언트는 자동으로 리소스를 선택할 수 있습니다.
> - 일부 구현은 심지어 AI 모델이 리소스를 결정할 수 있도록 허용합니다.
>
> 따라서 서버 개발자는 리소스 지원을 구현할 때 이러한 상호작용 패턴을 처리할 수 있도록 준비해야 합니다. 모델 제어 기본 요소를 사용하여 모델에 데이터를 자동으로 노출하려면 서버 작성자가 도구를 사용해야 합니다.

리소스는 MCP 서버가 클라이언트에 제공하고자 하는 모든 유형의 데이터를 나타낼 수 있으며, 이는 다음과 같은 것들을 포함할 수 있습니다:

- 파일 콘텐츠
- 데이터베이스 레코드
- API 응답
- 실시간 시스템 데이터
- 스크린샷 및 이미지
- 로그 파일
- 그 외 더 많은 것들

각 리소스는 고유한 `URI`로 식별되며, 텍스트 또는 이진 데이터를 포함할 수 있습니다.

템플릿은 모든 노트 리소스를 클라이언트에 노출하고, `setRequestHandler`를 통해 클라이언트의 `resources/list` 요청을 처리하는 핸들러를 등록합니다:

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

#### 리소스 URI

리소스는 다음 형식의 URI를 사용하여 식별됩니다:

```
[protocol]://[host]/[path]
```

예를 들어:

- `file:///home/user/documents/report.pdf`
- `postgres://database/customers/schema`
- `screen://localhost/display1`

여기서 `protocol`은 프로토콜이고 `path`는 MCP 서버 구현에 의해 정의된 경로입니다. 물론 서버는 자체 사용자 정의 URI 스키마를 정의할 수 있습니다.

#### 리소스 유형

리소스는 두 가지 유형의 콘텐츠를 포함할 수 있습니다:

**텍스트 리소스**

텍스트 리소스는 UTF-8 인코딩 텍스트 데이터를 포함하며, 이는 다음과 같은 것들에 적합합니다:

- 소스 코드
- 설정 파일
- 로그 파일
- JSON/XML 데이터
- 일반 텍스트

**이진 리소스**

이진 리소스는 `base64`로 인코딩된 원시 이진 데이터를 포함하며, 이는 다음과 같은 것들에 적합합니다:

- 이미지
- PDF 파일
- 오디오 파일
- 비디오 파일
- 그 외 더 많은 것들

#### 리소스 검색

클라이언트는 두 가지 주요 방법으로 사용 가능한 리소스를 검색할 수 있습니다:

**직접 리소스**

서버는 `resources/list` 엔드포인트를 통해 특정 리소스 목록을 노출합니다. 각 리소스는 다음과 같은 특성을 포함합니다:

```json
{
  uri: string;           // The unique identifier of the resource
  name: string;          // A human-readable name
  description?: string;  // An optional description
  mimeType?: string;     // An optional MIME type
}
```

**리소스 템플릿**

동적 리소스의 경우, 서버는 **URI 템플릿**을 노출할 수 있으며, 클라이언트는 이러한 템플릿을 사용하여 유효한 리소스 URI를 생성할 수 있습니다:

```json
{
  uriTemplate: string;   // URI template following RFC 6570
  name: string;          // A human-readable name for this type
  description?: string;  // An optional description
  mimeType?: string;     // An optional MIME type for all matching resources
}
```

#### 리소스 읽기

리소스를 읽으려면 클라이언트는 `resources/read` 요청을 리소스 URI와 함께 보냅니다. 서버는 다음과 같은 리소스 콘텐츠 목록을 반환합니다:

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

서버는 여러 리소스를 반환할 수 있으며, 이는 디렉토리를 읽을 때 디렉토리의 파일 목록을 반환하는 것과 같습니다.

예를 들어, 노트를 읽는 프로세서 구현은 다음과 같습니다:

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

#### 리소스 업데이트

MCP는 두 가지 메커니즘을 통해 리소스의 실시간 업데이트를 지원합니다:

**리스트 변경**

사용 가능한 리소스 목록이 변경되면 서버는 `notification/resources/list_changed`를 통해 클라이언트에 알릴 수 있습니다.

**콘텐츠 변경**

클라이언트는 지정된 리소스의 업데이트를 구독할 수 있습니다:

- 클라이언트는 리소스 URI와 함께 `resources/subscribe` 요청을 보냅니다
- 리소스가 변경되면 서버는 `notification/resources/update` 알림을 보냅니다
- 클라이언트는 `resources/read`를 통해 최신 콘텐츠를 얻을 수 있습니다
- 클라이언트는 리소스에서 구독을 취소할 수 있습니다

### Tools

도구는 LLM이 서버를 통해 작업을 수행할 수 있도록 하며, 서버는 도구를 통해 실행 가능한 기능을 클라이언트에 노출할 수 있습니다. 도구를 통해 LLM은 외부 시스템과 상호 작용하고, 계산을 수행하며, 실제 세계 작업을 실행할 수 있습니다. 도구는 서버에서 클라이언트에 노출되며, AI 모델이 자동으로 호출할 수 있도록 하는 목적이 있습니다.

MCP 도구는 서버가 실행 가능한 기능을 클라이언트에 노출할 수 있도록 하며, LLM이 이를 통해 작업을 수행할 수 있도록 합니다. 도구의 구현은 주로 다음 측면을 포함합니다:

- **Discoverability**：클라이언트는 `tools/list` 엔드포인트를 통해 사용 가능한 도구를 나열할 수 있습니다
- **Invocation**：`tools/call` 엔드포인트를 사용하여 도구를 호출하면 서버가 요청된 작업을 수행하고 결과를 반환합니다
- **Flexibility**：도구의 범위는 간단한 계산에서 복잡한 API 상호 작용에 이르기까지 다양할 수 있습니다

리소스와 마찬가지로, 도구는 고유한 이름으로 식별되며, 목적을 식별하기 위해 설명을 포함할 수 있지만, 리소스와 달리 도구는 상태를 수정하거나 외부 시스템과 상호 작용할 수 있는 동적 작업을 나타냅니다.

각 도구는 다음 구조로 정의됩니다:

```json
{
  name: string;          // 도구의 고유 식별자
  description?: string;  // A human-readable description
  inputSchema: { // The JSON Schema for the tool's parameters
    type: "object";
    properties: { ... } // The tool's specific parameters
  }
}
```

예를 들어, 템플릿 코드에서 `setRequestHandler`를 통해 도구 목록 처리기를 등록합니다:

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

위의 코드는 이전에 정의된 도구 구조에 따라 `create_note`라는 도구를 정의하며, 이는 새 노트를 생성하는 것을 나타내며, 두 개의 매개변수인 `title`과 `content`를 필요로 합니다. 이렇게 하면 클라이언트는 `create_note` 도구가 호출될 수 있음을 알고, 도구가 호출될 때 `title`과 `content` 매개변수가 필요함을 알 수 있습니다.

실제로 도구를 구현하려면 `setRequestHandler`를 통해 도구 호출 처리기를 등록해야 합니다:

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

위의 코드는 매우 간단합니다. 제공된 제목과 내용으로 새 노트를 생성하고 성공 메시지를 반환합니다. 클라이언트가 `create_note` 도구를 호출하면 위의 프로세서 코드가 트리거됩니다.

### Prompts

`Prompts`는 MCP 프로토콜에서 재사용 가능한 프롬프트 템플릿과 워크플로우를 정의하는 메커니즘으로, 클라이언트는 이러한 템플릿과 워크플로우를 사용자와 LLM에게 쉽게 표시할 수 있습니다. Prompts는 사용자가 제어할 수 있도록 설계되었으며, 이는 서버에서 클라이언트로 노출되어 사용자가 명시적으로 선택하고 사용할 수 있음을 의미합니다.

MCP 프롬프트는 다음과 같은 기능을 가진 사전 정의된 템플릿입니다:

- 동적 매개변수 수용
- 리소스에서 컨텍스트 포함
- 여러 상호작용 연결
- 특정 워크플로우 안내
- UI 요소로 사용 가능 (예: 슬래시 명령어)

각 프롬프트는 다음과 같은 구조로 정의됩니다:

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

클라이언트는 `prompts/list` 엔드포인트를 통해 모든 사용 가능한 프롬프트를 검색할 수 있으며, 예를 들어 다음 요청을 보내면 됩니다:

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

그런 다음, `prompts/get` 엔드포인트를 통해 지정된 프롬프트의 상세 정보를 얻을 수 있습니다:

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

예를 들어, 템플릿은 `setRequestHandler`를 통해 프롬프트 목록 처리기를 등록하며, 다음 코드와 같습니다:

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

우리는 템플릿이 `summarize_notes`라는 프롬프트를 등록하며, 이는 모든 노트를 요약하는 데 사용되지만, 이 프롬프트는 매개변수를 정의하지 않으므로 클라이언트는 이 프롬프트를 호출할 때 매개변수를 전달할 필요가 없습니다.

그런 다음, 프롬프트의 상세 정보를 얻으려면 `prompts/get` 엔드포인트를 통해 얻을 수 있으며, 템플릿은 또한 `setRequestHandler`를 통해 프롬프트 가져오기 처리기를 등록하며, 다음 코드와 같습니다:

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

위의 코드에서 볼 수 있듯이, 프롬프트를 생성할 때 모든 노트 콘텐츠가 프롬프트에 포함되며, 이제 컨텍스트는 노트와 관련된 콘텐츠를 가지고 있습니다.

### 서버 시작

여기에서는 간단한 MCP 서버를 구현하고 리소스, 도구, 프롬프트 프로세서를 등록했습니다. 물론 우리가 작성한 서버가 실제로 실행되도록 서버를 시작해야 합니다.

템플릿은 다음 코드와 같이 `stdio` 전송을 사용하여 서버를 시작합니다:

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

`stdio` 전송은 표준 입력/출력 스트림을 통해 통신을 지원하며, 이는 로컬 통합과 명령줄 도구에 특히 유용합니다. 우리는 다음 경우에 `stdio`를 사용할 수 있습니다:

- 명령줄 도구 빌드
- 로컬 통합 구현
- 간단한 프로세스 통신이 필요한 경우
- 쉘 스크립트 사용

`stdio` 전송 외에도 MCP는 HTTP 기반의 Server-Sent Events (SSE) 전송을 지원하며, SSE 전송은 HTTP POST 요청을 통해 서버에서 클라이언트로 스트리밍을 지원합니다. 우리는 다음 경우에 `SSE`를 사용할 수 있습니다:

- 서버에서 클라이언트로 스트리밍이 필요한 경우
- 제한된 네트워크 사용
- 간단한 업데이트 구현

## 날씨 MCP 서버 구현

위의 MCP 서버 구현을 분석한 후, 우리는 이제 요구 사항에 따라 코드를 작성할 수 있습니다. 우리의 요구 사항은 날씨 조회 서비스를 제공하는 것으로, 이는 날씨 데이터를 리소스로 노출하고 날씨 조회 도구를 제공하는 것을 의미합니다.

먼저, 다음 코드와 같이 날씨 리소스에 대한 타입을 정의합니다:

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

여기에서 정의한 타입은 주로 OpenWeather API의 응답 데이터 타입에 기반하여 작성되었으며, 이는 이러한 타입을 쉽게 사용할 수 있음을 의미합니다.

그런 다음, 다음 기본 코드를 작성하여 템플릿의 `src/index.ts` 코드를 대체합니다:

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

여기에서는 템플릿에 대한 코드를 클래스로 정의하여 코드를 조금 더 구조화했으며, 주로 다음과 같은 작업을 수행합니다:

- 날씨 리소스에 대한 타입 정의
- MCP 서버 인스턴스 초기화
- 리소스 및 도구 처리기 등록
- 서버 시작

리소스 및 도구 처리기는 `TODO`로 표시되어 있으며, 이제 이러한 처리기를 구현할 수 있습니다.

### 리소스 처리기 구현

`setupResourceHandlers` 메서드에서는 리소스 처리기를 구현합니다. 먼저 리소스 목록 처리기를 추가하고, 그 다음 리소스 읽기 처리기를 추가하며, 다음 코드와 같습니다:

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

리소스 목록 처리기의 구현은 매우 간단합니다. 여기에서는 자체 `weather` 프로토콜을 정의하고, 데이터 형식은 JSON 형식입니다. 리소스를 가져올 때, 먼저 `axios`를 사용하여 OpenWeather API에서 현재 날씨 데이터를 요청하고, 이를 `WeatherData` 타입으로 변환하여 반환합니다.

### 도구 처리기 구현

리소스 처리기를 구현한 후, 도구 처리기를 구현할 수 있습니다. 도구 처리기는 주로 도구 기능을 구현하는 데 사용되며, 다음 코드와 같이 날씨 예보 조회 도구를 구현합니다:

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

마찬가지로, 먼저 도구 목록 처리기를 구현한 다음 도구 호출 처리기를 구현해야 합니다. 여기에서는 이름이 `get_forecast`인 도구를 하나만 정의했으며, 이는 지정된 도시의 날씨 예보를 가져오는 데 사용되며, 두 개의 매개변수 `city`와 `days`를 받아야 합니다. 여기서 `city`는 도시 이름이고, `days`는 조회할 일수이며, 기본값은 3일입니다. 물론 데이터는 여전히 OpenWeather API 요청을 통해 가져옵니다.

사실, 위에서 정의한 리소스는 도구를 통해 직접 가져올 수 있으며, 현재 날씨를 가져오는 도구를 추가할 수 있습니다. 데이터는 OpenWeather API 요청을 통해 가져오기 때문에 리소스를 정의할 필요가 없지만, 여기서는 리소스를 정의하여 설명 목적으로 사용합니다.

### 테스트

우리는 간단한 날씨 MCP 서비스를 구현했으며, 이제 테스트할 수 있습니다.

먼저, 프로젝트를 빌드해야 합니다:

```bash
npm run build
```

그런 다음, Claude Desktop의 설정을 업데이트해야 합니다:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

우리의 날씨 서비스를 구성에 추가하면 다음과 같습니다:

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

여기서 `args`는 빌드된 파일의 경로이며, `env`는 우리가 필요로 하는 OpenWeather API 키입니다. 구성을 마친 후, Claude Desktop를 다시 시작합니다.

### 테스트

다음으로, 클릭하여 클라이언트에서 날씨 예보 도구를 테스트할 수 있습니다:

![Claude Weather Tools](https://static.claudemcp.com/images/claude-weather-tools.png)

다음으로, 예를 들어, 우리는 베이징에 대한 5일 날씨 예보를 요청할 수 있습니다:

```bash
Can you get me a 5-day forecast for Beijing and tell me if I should pack an umbrella?
```

![Claude Weather Current](https://static.claudemcp.com/images/claude-weather-forecast.png)

우리는 이것이 `get_forecast` 도구를 호출하고 (권한 필요) 결과를 표시함을 볼 수 있습니다.

### 디버깅

테스트 중 문제가 발생하면 다음과 같은 방법으로 디버깅할 수 있습니다. 예를 들어, MCP의 상세 로그를 볼 수 있습니다:

```bash
# 실시간 로그 보기
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

로그는 서버 연결 이벤트, 구성 문제, 런타임 오류, 메시지 교환 등 다양한 정보를 캡처합니다.

로그 외에도 우리는 또한 `Chrome DevTools`를 통해 디버깅할 수 있으며, Claude Desktop의 개발자 도구에 액세스하여 클라이언트 오류를 볼 수 있습니다. 다음 구성을 파일 `~/Library/Application\ Support/Claude/developer_settings.json`에 추가하여 DevTools를 활성화할 수 있습니다:

```json
{
  "allowDevTools": true
}
```

그런 다음, 단축키 `Command+Option+Shift+i`를 사용하여 DevTools를 열 수 있으며, Chrome에서 디버깅하는 것과 같습니다.

![Claude DevTools](https://static.claudemcp.com/images/claude-devtools.png)

위의 기본 디버깅 방법 외에도, Claude MCP는 `Inspector` 도구를 제공하며, **MCP Inspector**는 MCP 서버를 테스트하고 디버깅하기 위한 대화형 개발자 도구입니다.

설치 없이 `npx` 명령을 사용하여 직접 사용할 수 있습니다:

```bash
npx @modelcontextprotocol/inspector <command>
# or
npx @modelcontextprotocol/inspector <command> <arg1> <arg2>
```

서버 패키지가 NPM에서 오는 경우, 다음 방법을 사용하여 시작할 수 있습니다:

```bash
npx -y @modelcontextprotocol/inspector npx <package-name> <args>
# 예를 들어
npx -y @modelcontextprotocol/inspector npx server-postgres postgres://127.0.0.1/testdb
```

서버 패키지가 로컬로 빌드된 경우, 다음 방법을 사용하여 시작할 수 있습니다:

```bash
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

예를 들어, 위에서 구축한 날씨 서비스의 경우, 다음 방법을 사용하여 시작할 수 있습니다:

```bash
npx @modelcontextprotocol/inspector node /Users/cnych/src/weather-server/build/index.js
```

`Inspector` 도구가 시작되면 `localhost:5173`에서 웹 페이지를 시작하며, 여기서 우리는 날씨 서비스를 테스트하고 디버깅할 수 있습니다.

![MCP Inspector](https://static.claudemcp.com/images/claude-inspector-ui.png)

여기서는 우리가 오른쪽에서 `Environment Variables` 버튼을 클릭하고, `OPENWEATHER_API_KEY` 환경 변수를 추가하고, 값은 우리가 신청한 OpenWeather API 키이며, 그런 다음 `Connect` 버튼을 클릭하여 날씨 서비스에 연결합니다.

연결이 성공적으로 이루어지면 우리는 오른쪽 주 창에서 날씨 서비스의 리소스와 도구를 볼 수 있으며, 우리는 이를 테스트하고 디버깅할 수 있습니다. `List Resources` 버튼을 클릭하여 날씨 서비스의 리소스를 나열하고, 나열된 리소스를 클릭하여 읽고 표시할 수 있습니다.

![MCP Inspector Resources](https://static.claudemcp.com/images/claude-inspector-resources.png)

마찬가지로, 우리는 도구를 테스트할 수 있으며, `List Tools` 버튼을 클릭하여 날씨 서비스의 도구를 나열하고, 특정 도구를 클릭하여 매개변수를 입력하고, `Run Tool` 버튼을 클릭하여 도구를 호출하고 결과를 표시할 수 있습니다.

![MCP Inspector Tools](https://static.claudemcp.com/images/claude-inspector-tools.png)

물론, 리소스와 도구 외에도 우리는 또한 프롬프트와 샘플링을 테스트할 수 있습니다.

우리는 간단한 날씨 MCP 서비스를 구현했습니다.
