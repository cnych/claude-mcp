---
title: Using Cursor/LLM to Develop MCP
description: How to Develop MCP Servers Using Cursor/LLM
section: typescript
prev: write-ts-client
next: dev-sse-mcp
pubDate: 2025-04-01
order: 3
---

# Using Cursor/LLM to Develop MCP

In previous chapters, we've learned how to develop MCP servers and clients, but the process requires certain development experience, which can be challenging for beginners.

Today, we'll introduce a solution for directly using LLMs to develop MCP servers.

## Preparation

First, we need to prepare some documentation to help the LLM better understand the MCP protocol. Alternatively, we can directly provide the official MCP documentation to the LLM.

Here, we'll use Cursor for development and provide the `https://modelcontextprotocol.io/llms-full.txt` file as documentation content, which we'll download locally as `llms-full.txt`.

Then we can open Cursor and start development.

## Starting Development

We simply need to clearly describe the type of server we want to build to Cursor:

```markdown
What resources will the server expose?
What tools will it provide?
What prompts should it include?
What external systems should it interact with?
```

Here, we'll use the weather query example we previously explained to demonstrate how to use LLM to develop an MCP server.

Open the Cursor chat window, select the `llms-full.txt` file using the `@` command, and describe the requirements to Cursor:

```markdown
Build a weather query MCP server that:

- Developed using TypeScript
- Connects to the OpenWeatherMap API to fetch weather information
- Obtains the OpenWeatherMap API key from the environment variable `OPENWEATHERMAP_API_KEY`
- Provides two tools: one for querying current weather of a specified city, and another for forecasting weather for the next few days
- Retrieves weather data as comprehensive as possible
```

![](/images/cursor-prompts.png)

Here, we'll select the `Cluade-3.7-sonnet` model and click the `Send` button. After a moment, we can see Cursor starting to generate code based on our requirements.

We can start with the core functionality and gradually add more features. When encountering any issues, we can ask Cursor for help to resolve them, and finally, we can let Cursor help us test the server and handle edge cases.

Finally, we can get a complete MCP server code, as shown below:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { writeFileSync } from "fs";

// Setup debugging to file instead of stdout
const debugLog = (message: string) => {
  try {
    writeFileSync(
      "weather-mcp-debug.log",
      `${new Date().toISOString()}: ${message}\n`,
      { flag: "a" }
    );
  } catch (e) {
    // Silently fail if we can't write to the log file
  }
};

// Check if API key is present
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
if (!OPENWEATHERMAP_API_KEY) {
  debugLog("Error: OPENWEATHERMAP_API_KEY environment variable is not set");
  process.exit(1);
}

const BASE_URL = "https://api.openweathermap.org";

// Create an MCP server
const server = new McpServer({
  name: "WeatherMCP",
  version: "1.0.0",
});

// Helper function to fetch weather data from OpenWeatherMap API
async function fetchWeatherData(
  endpoint: string,
  params: Record<string, string>
) {
  const url = new URL(`/data/2.5/${endpoint}`, BASE_URL);

  // We've already checked if the API key exists, so we can safely assert it's not undefined
  const apiKey = OPENWEATHERMAP_API_KEY as string;
  url.searchParams.append("appid", apiKey);

  // Add all parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    // Hide the API key in logs
    const sanitizedUrl = url.toString().replace(apiKey, "API_KEY_HIDDEN");
    debugLog(`Fetching from URL: ${sanitizedUrl}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    debugLog(
      `Error fetching weather data: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error;
  }
}

// Format weather data to a human-readable format
function formatCurrentWeather(data: any) {
  const main = data.main;
  const weather = data.weather[0];
  const wind = data.wind;
  const sys = data.sys;

  return `
Current Weather in ${data.name}, ${sys.country}:
Description: ${weather.main} (${weather.description})
Temperature: ${(main.temp - 273.15).toFixed(1)}°C / ${(
    ((main.temp - 273.15) * 9) / 5 +
    32
  ).toFixed(1)}°F
Feels Like: ${(main.feels_like - 273.15).toFixed(1)}°C
Humidity: ${main.humidity}%
Pressure: ${main.pressure} hPa
Wind: ${wind.speed} m/s, Direction: ${wind.deg}°
Visibility: ${data.visibility / 1000} km
Cloudiness: ${data.clouds.all}%
Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}
Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}
  `.trim();
}

function formatForecast(data: any, days: number) {
  const city = data.city;
  let forecast = `${days}-day Forecast for ${city.name}, ${city.country}:\n\n`;

  // Group forecast by day
  const dailyForecasts: Record<string, any[]> = {};

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const day = date.toDateString();

    if (!dailyForecasts[day]) {
      dailyForecasts[day] = [];
    }

    dailyForecasts[day].push(item);
  });

  // Format each day's forecast
  Object.entries(dailyForecasts).forEach(([day, items]) => {
    forecast += `${day}:\n`;

    items.forEach((item) => {
      const time = new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const temp = (item.main.temp - 273.15).toFixed(1);
      const description = item.weather[0].description;
      const humidity = item.main.humidity;
      const windSpeed = item.wind.speed;

      forecast += `  ${time}: ${temp}°C, ${description}, Humidity: ${humidity}%, Wind: ${windSpeed} m/s\n`;
    });

    forecast += "\n";
  });

  return forecast.trim();
}

// Tool: Get current weather for a city
server.tool(
  "current_weather",
  {
    city: z.string().describe("City name (e.g., 'London' or 'New York,US')"),
    units: z
      .enum(["metric", "imperial", "standard"])
      .optional()
      .describe("Units of measurement (metric, imperial, or standard)"),
  },
  async ({ city, units = "metric" }) => {
    try {
      debugLog(`Processing current weather request for ${city}`);
      const data = await fetchWeatherData("weather", {
        q: city,
        units: units,
      });

      return {
        content: [
          {
            type: "text",
            text: formatCurrentWeather(data),
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      debugLog(`Error in current_weather tool: ${errorMessage}`);
      return {
        content: [
          {
            type: "text",
            text: `Error fetching weather data: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Tool: Get weather forecast for a city
server.tool(
  "weather_forecast",
  {
    city: z.string().describe("City name (e.g., 'London' or 'New York,US')"),
    days: z
      .number()
      .min(1)
      .max(5)
      .optional()
      .describe("Number of days for forecast (1-5)"),
    units: z
      .enum(["metric", "imperial", "standard"])
      .optional()
      .describe("Units of measurement (metric, imperial, or standard)"),
  },
  async ({ city, days = 5, units = "metric" }) => {
    try {
      debugLog(`Processing forecast request for ${city}, ${days} days`);
      const data = await fetchWeatherData("forecast", {
        q: city,
        units: units,
        cnt: String(days * 8), // 8 forecasts per day (3-hour steps)
      });

      return {
        content: [
          {
            type: "text",
            text: formatForecast(data, days),
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      debugLog(`Error in weather_forecast tool: ${errorMessage}`);
      return {
        content: [
          {
            type: "text",
            text: `Error fetching forecast data: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
debugLog("Starting Weather MCP server");
try {
  const transport = new StdioServerTransport();
  await server.connect(transport);
} catch (error) {
  debugLog(
    `Error starting server: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
}
```

From the above code, we can see that we have implemented two tools:

- `current_weather`：Query current weather
- `weather_forecast`：Query weather forecast

Then we can use the same method to build this server code:

```bash
# Build using tsc
tsc
# Build using npm
# npm run build
```

The built code will be saved to the `build/index.js` file.

Next, we can create a `.cursor/mcp.json` file in the current directory and configure the server information:

```json
{
  "mcpServers": {
    "weather": {
      "command": "node",
      "args": ["/path/to/weather-mcp-server/build/index.js"],
      "env": {
        "OPENWEATHERMAP_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

In the latest Cursor version (Version: 0.48.6), when we add the MCP configuration, it will automatically detect the addition of an MCP server and prompt us whether to enable it:

![](/images/cursor-auto-deteched-mcp.png)

After enabling it, we can also see the two tools we added in the Cursor settings page:

![](/images/cursor-mcp-tools-list.png)

Then we can ask weather information in Cursor:

![](/images/cursor-test-weather-mcp-server.png)

## Best Practices

The MCP server we introduced earlier is a simple one. In actual use, we may need to build more complex servers based on actual needs.

When building MCP servers using Cursor or LLM, we can refer to the following best practices:

- Break down complex servers into smaller parts
- Thoroughly test each component before moving on to the next step
- Consider security - validate inputs and appropriately restrict access
- Document the code thoroughly for future maintenance
- Strictly follow the MCP protocol specifications

After building the server:

- Carefully review the generated code
- Use the MCP Inspector tool to test the server
- Connect the server to the MCP client for testing
- Iterate based on actual use and feedback

Remember, LLM can help us modify and improve the server as needs change.

Need more guidance? Simply ask LLM about implementing MCP features or solving specific issues, and of course, the implementation of the MCP client can be handed over to LLM.
