---
title: Cursor/LLM을 사용하여 MCP 개발하기
description: Cursor/LLM을 사용하여 MCP 서버를 개발하는 방법
section: base-dev
prev: write-ts-client
next: dev-sse-mcp
pubDate: 2025-04-01
order: 3
---

# Cursor/LLM을 사용하여 MCP 개발하기

이전 장에서는 MCP 서버와 클라이언트를 개발하는 방법을 배웠지만, 이 과정은 특정 개발 경험이 필요하며 초보자에게는 어려울 수 있습니다.

오늘은 LLM을 직접 사용하여 MCP 서버를 개발하는 솔루션을 소개하겠습니다.

## 준비

먼저, LLM이 MCP 프로토콜을 더 잘 이해할 수 있도록 일부 문서를 준비해야 합니다. 또는 공식 MCP 문서를 LLM에 직접 제공할 수도 있습니다.

여기서는 Cursor를 개발에 사용하고 `https://modelcontextprotocol.io/llms-full.txt` 파일을 문서 내용으로 제공할 것이며, 이를 로컬에 `llms-full.txt`로 다운로드합니다.

그런 다음 Cursor를 열고 개발을 시작할 수 있습니다.

## 개발 시작하기

우리는 단순히 Cursor에게 구축하고자 하는 서버 유형을 명확하게 설명하기만 하면 됩니다:

```markdown
What resources will the server expose?
What tools will it provide?
What prompts should it include?
What external systems should it interact with?
```

여기서는 이전에 설명한 날씨 조회 예제를 사용하여 LLM을 사용하여 MCP 서버를 개발하는 방법을 설명하겠습니다.

Cursor 채팅 창을 열고 `@` 명령을 사용하여 `llms-full.txt` 파일을 선택하고, 요구 사항을 Cursor에 설명합니다:

```markdown
Build a weather query MCP server that:

- Developed using TypeScript
- Connects to the OpenWeatherMap API to fetch weather information
- Obtains the OpenWeatherMap API key from the environment variable `OPENWEATHERMAP_API_KEY`
- Provides two tools: one for querying current weather of a specified city, and another for forecasting weather for the next few days
- Retrieves weather data as comprehensive as possible
```

![](https://static.claudemcp.com/images/cursor-prompts.png)

여기서는 `Cluade-3.7-sonnet` 모델을 선택하고 `Send` 버튼을 클릭합니다. 조금 기다리면 Cursor가 요구 사항에 따라 코드를 생성하기 시작합니다.

우리는 코어 기능을 시작하고 점차 더 많은 기능을 추가할 수 있습니다. 문제가 발생하면 Cursor에 도움을 요청하여 해결할 수 있으며, 마지막으로 Cursor가 서버를 테스트하고 에지 케이스를 처리하도록 도와줍니다.

마지막으로, 우리는 완전한 MCP 서버 코드를 얻을 수 있으며, 다음과 같습니다:

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

위 코드에서 우리는 두 가지 도구를 구현했음을 알 수 있습니다:

- `current_weather`：현재 날씨 조회
- `weather_forecast`：날씨 예보 조회

그런 다음 동일한 방법을 사용하여 이 서버 코드를 빌드할 수 있습니다:

```bash
# Build using tsc
tsc
# Build using npm
# npm run build
```

빌드된 코드는 `build/index.js` 파일에 저장됩니다.

그런 다음 현재 디렉토리에 `.cursor/mcp.json` 파일을 생성하고 서버 정보를 구성합니다:

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

최신 Cursor 버전 (버전: 0.48.6)에서는 MCP 구성을 추가할 때 자동으로 MCP 서버 추가를 감지하고 활성화할지 묻습니다:

![](https://static.claudemcp.com/images/cursor-auto-deteched-mcp.png)

활성화한 후, 우리는 또한 Cursor 설정 페이지에서 추가한 두 가지 도구를 볼 수 있습니다:

![](https://static.claudemcp.com/images/cursor-mcp-tools-list.png)

그런 다음 우리는 Cursor에서 날씨 정보를 물을 수 있습니다:

![](https://static.claudemcp.com/images/cursor-test-weather-mcp-server.png)

## 최선의 방법

이전에 소개한 MCP 서버는 간단한 서버입니다. 실제 사용에서는 실제 요구 사항에 따라 더 복잡한 서버를 구축해야 합니다.

Cursor 또는 LLM을 사용하여 MCP 서버를 구축할 때 다음 최선의 방법을 참조할 수 있습니다:

- 복잡한 서버를 작은 부분으로 나누기
- 다음 단계로 넘어가기 전에 각 구성 요소를 철저히 테스트하기
- 보안 고려 - 입력 유효성 검사 및 적절한 제한 적용
- 향후 유지 보수를 위해 코드를 철저히 문서화하기
- MCP 프로토콜 사양을 엄격히 따르기

서버를 구축한 후:

- 생성된 코드를 주의 깊게 검토하기
- MCP Inspector 도구를 사용하여 서버 테스트
- 서버를 MCP 클라이언트에 연결하여 테스트
- 실제 사용 및 피드백에 따라 반복

LLM은 요구 사항이 변경됨에 따라 서버를 수정하고 개선할 수 있습니다.

더 많은 지침이 필요하신가요? 간단히 MCP 기능 구현 또는 특정 문제 해결에 대해 LLM에게 물어보세요. 물론, MCP 클라이언트의 구현도 LLM에게 맡길 수 있습니다.
