---
name: Microsoft Playwright MCP
digest: Playwright MCP server providing browser automation capabilities for large language models
author: microsoft
homepage: https://www.npmjs.com/package/@playwright/mcp
repository: https://github.com/microsoft/playwright-mcp
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - playwright
  - browser
  - automation
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4
createTime: 2025-04-05
---

Unlock powerful web interaction capabilities for large language models through the Claude MCP server based on [Playwright](https://playwright.dev). This innovative solution enables seamless communication between LLMs and web pages via structured accessibility snapshots - **without requiring screenshots or visual models**.

## What is Playwright?

`Playwright` is an open-source browser automation tool developed by Microsoft, enabling testers and developers to automate interactions with web applications across multiple browsers and platforms. Unlike traditional automation tools, `Playwright` is designed for modern web applications, supporting dynamic content, real-time interactions, and even network monitoring, helping teams test applications faster and more efficiently.

![Playwright](/images/playwright.png)

In modern software development, automated browser testing has become indispensable, ensuring web applications run smoothly across different browsers and environments. If you've used `Playwright`, you understand its powerful capabilities in automating web interactions. However, when multiple test scripts, debugging tools, or automation services need to interact with the same `Playwright` instance simultaneously, the `Playwright` Multi-Client Protocol (MCP) server comes into play.

## Core Features of Playwright

### Multi-Browser Support

`Playwright` seamlessly supports Chromium, Firefox, and WebKit, ensuring compatibility across major browsers. This means a single test script can be executed across different browsers, reducing redundant work and ensuring a consistent user experience.

### Headless and Headed Execution Modes

`Playwright` can run in headless mode (without UI) to accelerate test execution, making it ideal for CI/CD pipelines. It also supports headed mode for debugging and interactive testing, allowing developers to visually inspect test runs.

### Parallel Test Execution

One of `Playwright`'s greatest strengths is its ability to execute multiple tests simultaneously. Parallel execution reduces overall test runtime, making it an ideal solution for large applications requiring frequent and rapid testing.

### Advanced Debugging Tools

`Playwright` includes built-in tools that significantly simplify debugging failed tests. It provides:

- Trace Viewer – A step-by-step visual representation of test execution
- Video Recording – Captures test runs for troubleshooting
- Screenshots – Helps detect UI inconsistencies

### Powerful Web Interaction APIs

`Playwright` supports a wide range of user interactions, including:

- Clicking buttons, filling forms, and scrolling
- Capturing network requests and responses
- Handling authentication flows and cookies
- Automating file uploads and downloads

## Playwright MCP Server

The Playwright MCP server is an MCP server based on Playwright, enabling testers and developers to automate interactions with web applications across multiple browsers and platforms. This server allows large language models (LLMs) to interact with web pages through structured accessibility snapshots without relying on screenshots or visually adjusted models. It offers the following core functionalities:

- **Enable LLMs with Browser Automation**: Connect LLMs via MCP, allowing AI to directly manipulate web pages. Compatible with large language models like Claude, GPT-4o, and DeepSeek.
- **Support Web Page Interactions**: Supports common web operations, including clicking buttons, filling forms, and scrolling pages.
- **Capture Web Screenshots**: Obtain screenshots of web pages via Playwright MCP Server to analyze current UI and content.
- **Execute JavaScript Code**: Run JavaScript in the browser environment for more complex interactions with web pages.
- **Integrated Convenience Tools**: Supports tools like Smithery and mcp-get to simplify installation and configuration.

Ideal for automated testing, data scraping, SEO competitor analysis, AI intelligent agents, and more. If you want AI to handle web tasks more intelligently or need an efficient automation tool, try Playwright MCP Server.

### Installation in Cursor

In Cursor Settings, switch to the MCP tab, click the `Add new global MCP server` button in the top-right corner, and enter the following configuration:

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp"
      ]
    }
  }
}
```

If you don't want to enable it globally, add the above configuration to the `.cursor/mcp.json` file in your project's root directory.

⚠️ Note: The official documentation suggests the command `npx @playwright/mcp@latest`, but it may cause errors during configuration:

```bash
$ npx @playwright/mcp@latest


node:internal/modules/cjs/loader:646
      throw e;
      ^

Error: Cannot find module '/Users/cnych/.npm/_npx/9833c18b2d85bc59/node_modules/yaml/dist/index.js'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:1285:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:1273:15)
    at resolveExports (node:internal/modules/cjs/loader:639:14)
    at Module._findPath (node:internal/modules/cjs/loader:747:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1234:27)
    at Module._load (node:internal/modules/cjs/loader:1074:27)
    at TracingChannel.traceSync (node:diagnostics_channel:315:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:217:24)
    at Module.require (node:internal/modules/cjs/loader:1339:12)
    at require (node:internal/modules/helpers:135:16) {
  code: 'MODULE_NOT_FOUND',
  path: '/Users/cnych/.npm/_npx/9833c18b2d85bc59/node_modules/yaml/package.json'
}

Node.js v22.8.0
```

Replace `npx @playwright/mcp@latest` with `npx @playwright/mcp`.

After configuration, you should see the Playwright MCP server successfully configured in the MCP tab of Cursor Settings:

![](/images/cursor-playwright-mcp.png)

### VS Code Installation

```bash
# For VS Code
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'

# For VS Code Insiders
code-insiders --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'
```

Once installed, the Playwright MCP server will be immediately available for GitHub Copilot agents in VS Code.

## Advanced Configuration

### Browser Options

You can add parameters to `args` to customize the browser:

- `--browser <browser>`: Options:
  - Standard browsers: `chrome`, `firefox`, `webkit`, `msedge`
  - Chrome variants: `chrome-beta`, `chrome-canary`, `chrome-dev`
  - Edge variants: `msedge-beta`, `msedge-canary`, `msedge-dev`
  - Default: `chrome`
- `--cdp-endpoint <endpoint>`: Connect to an existing Chrome DevTools Protocol endpoint
- `--executable-path <path>`: Specify a custom browser executable path
- `--headless`: Run in headless mode (default is headed)
- `--port <port>`: Set the SSE transport listening port
- `--user-data-dir <path>`: Customize the user data directory
- `--vision`: Enable screenshot-based interaction mode

### Profile Management

Playwright MCP creates dedicated browser profiles in the following locations:

- Windows: `%USERPROFILE%\AppData\Local\ms-playwright\mcp-chrome-profile`
- macOS: `~/Library/Caches/ms-playwright/mcp-chrome-profile`
- Linux: `~/.cache/ms-playwright/mcp-chrome-profile`

Deleting these directories between sessions clears the browsing state.

## Operation Modes

### Headless Operation (Recommended for Automation)

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless"
      ]
    }
  }
}
```

### Headed Operation on Headless Systems

For Linux systems without displays or IDE worker processes, you can start the server using SSE transport. First, launch the server with:

```bash
npx @playwright/mcp --port 8931
```

Then configure the MCP client:

```js
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/sse"
    }
  }
}
```

## Interaction Modes

Once the server is running and connected to an agent, the agent can invoke specific MCP-provided tools to control the browser. Available tools depend on whether the server runs in snapshot or vision mode.

### Snapshot Mode (Recommended)

This is the default mode, using accessibility snapshots for optimal performance and reliability. The provided MCP tools primarily operate using the accessibility tree. A typical workflow includes:

1. Use `browser_snapshot` to get the current state of the accessibility tree.
2. The agent analyzes the snapshot (structured text/JSON) to understand page content and identify target elements. Each interactive element in the snapshot typically has a unique ref (reference identifier).
3. The agent calls interaction tools like `browser_click` or `browser_type`, providing the target element's ref.

Playwright MCP provides a suite of tools for browser automation. Here are all available tools:

- **browser_navigate**: Navigate to a URL
  - Parameters:
    - url (string): The URL to navigate to
- **browser_go_back**: Go back to the previous page
  - Parameters: None
- **browser_go_forward**: Go forward to the next page
  - Parameters: None
- **browser_click**: Click an element
  - Parameters:
    - element (string): Description of the element to click
    - ref (string): Precise target element reference from the page snapshot
- **browser_hover**: Hover over an element
  - Parameters:
    - element (string): Description of the element to hover over
    - ref (string): Precise target element reference from the page snapshot
- **browser_drag**: Drag and drop an element
  - Parameters:
    - startElement (string): Description of the element to drag
    - startRef (string): Precise source element reference from the page snapshot
    - endElement (string): Description of the target element to drop onto
    - endRef (string): Precise target element reference from the page snapshot
- **browser_type**: Input text (optionally submit)
  - Parameters:
    - element (string): Description of the element to input text into
    - ref (string): Precise target element reference from the page snapshot
    - text (string): Text to input
    - submit (boolean): Whether to submit the input text (press Enter afterward)
- **browser_select_option**: Select a dropdown option
  - Parameters:
    - element (string): Description of the element to select
    - ref (string): Precise target element reference from the page snapshot
    - values (array): Dropdown option values to select
- **browser_choose_file**: Select a file
  - Parameters:
    - paths (array): Absolute paths of files to upload. Can be a single file or multiple files.
- **browser_press_key**: Press a key on the keyboard
  - Parameters:
    - key (string): Name or character of the key to press, e.g., ArrowLeft or a
- **browser_snapshot**: Capture an accessibility snapshot of the current page (better than screenshots)
  - Parameters: None
- **browser_save_as_pdf**: Save the page as a PDF
  - Parameters: None
- **browser_take_screenshot**: Capture a screenshot of the page
  - Parameters: None
- **browser_wait**: Wait for a specified time
  - Parameters:
    - time (number): Time to wait (maximum 10 seconds)
- **browser_close**: Close the page
  - Parameters: None

### Vision Mode

For screenshot-based visual interactions, enable it with:

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp",
        "--vision"
      ]
    }
  }
}
```

Vision mode provides MCP tools that rely on coordinates derived from screenshots. A typical workflow includes:

1. Use `browser_screenshot` to capture the current view.
2. The agent (possibly requiring visual processing capabilities) analyzes the screenshot to identify target positions (X, Y coordinates).
3. The agent calls interaction tools like `browser_click` or `browser_type` using the determined coordinates.

Vision Mode provides a suite of tools for screenshot-based visual interactions. Here are all available tools:

- **browser_navigate**: Navigate to a URL
  - Parameters:
    - url (string): The URL to navigate to
- **browser_go_back**: Go back to the previous page
  - Parameters: None
- **browser_go_forward**: Go forward to the next page
  - Parameters: None
- **browser_screenshot**: Capture a screenshot of the page
  - Parameters: None
- **browser_move_mouse**: Move the mouse to specified coordinates
  - Parameters:
    - x (number): X coordinate
    - y (number): Y coordinate
- **browser_click**: Click an element
  - Parameters:
    - x (number): X coordinate
    - y (number): Y coordinate
- **browser_drag**: Drag and drop an element
  - Parameters:
    - startX (number): Starting X coordinate
    - startY (number): Starting Y coordinate
    - endX (number): Ending X coordinate
    - endY (number): Ending Y coordinate
- **browser_type**: Input text (optionally submit)
  - Parameters:
    - x (number): X coordinate
    - y (number): Y coordinate
    - text (string): Text to input
    - submit (boolean): Whether to submit the input text (press Enter afterward)
- **browser_press_key**: Press a key on the keyboard
  - Parameters:
    - key (string): Name or character of the key to press, e.g., ArrowLeft or a
- **browser_choose_file**: Select a file
  - Parameters:
    - paths (array): Absolute paths of files to upload. Can be a single file or multiple files.
- **browser_save_as_pdf**: Save the page as a PDF
  - Parameters: None
- **browser_wait**: Wait for a specified time
  - Parameters:
    - time (number): Time to wait (maximum 10 seconds)
- **browser_close**: Close the page
  - Parameters: None

## Getting Started with Custom Implementation

Beyond configuration files and automatic startup via IDEs, Playwright MCP can be directly integrated into your Node.js application. This provides more control over server setup and communication transports.

```js
import { createServer } from "@playwright/mcp";
// Import necessary transport classes, e.g., from '@playwright/mcp/lib/sseServerTransport';
// Or potentially implement your own transport mechanism.

async function runMyMCPServer() {
  // Create the MCP server instance
  const server = createServer({
    // You can pass Playwright launch options here
    launchOptions: {
      headless: true,
      // other Playwright options...
    },
    // You might specify other server options if available
  });

  // Example using SSE transport (requires appropriate setup like an HTTP server)
  // This part is conceptual and depends on your specific server framework (e.g., Express, Node http)
  /*
  const http = require('http');
  const { SSEServerTransport } = require('@playwright/mcp/lib/sseServerTransport'); // Adjust path as needed

  const httpServer = http.createServer((req, res) => {
    if (req.url === '/messages' && req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      const transport = new SSEServerTransport("/messages", res); // Pass the response object
      server.connect(transport); // Connect the MCP server to this transport

      req.on('close', () => {
        // Handle client disconnect if necessary
        server.disconnect(transport);
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  httpServer.listen(8931, () => {
    console.log('MCP Server with SSE transport listening on port 8931');
  });
  */

  // For simpler non-web transport, you might use other mechanisms
  // server.connect(yourCustomTransport);

  console.log("Playwright MCP server started programmatically.");

  // Keep the server running, handle connections, etc.
  // Add cleanup logic for server shutdown.
}

runMyMCPServer().catch(console.error);
```

This custom approach allows for fine-grained control, custom transport layers (beyond default mechanisms or SSE), and embedding MCP functionality directly into larger applications or agent frameworks.

## Best Practices

1. Prefer snapshot mode in most cases – faster and more reliable
2. Use vision mode only when visual recognition is absolutely necessary
3. Clear user profiles between sensitive sessions
4. Leverage headless mode for automated workflows
5. Combine with LLMs' natural language capabilities for powerful automation

## Conclusion

Microsoft Playwright MCP provides a powerful and efficient way for LLMs and AI agents to interact with the web. By leveraging the browser's accessibility tree in its default snapshot mode, it offers a fast, reliable, and text-friendly approach to browser automation, ideal for common tasks like navigation, data extraction, and form filling. The optional vision mode serves as a fallback for scenarios requiring coordinate-based interaction with visual elements.

With simple installation via npx, deep integration into Claude MCP clients like Cursor, and flexible configuration options including headless operation and custom transports, Playwright MCP is a versatile tool for developers building the next generation of web-aware AI agents. By understanding its core concepts and available tools, you can effectively empower your applications and agents to navigate and interact across the vast internet.
