---
title: 使用 Cursor/LLM 開發 MCP
description: 如何使用 Cursor/LLM 開發 MCP 伺服器
section: base-dev
prev: write-ts-client
next: dev-sse-mcp
pubDate: 2025-04-01
order: 3
---

# 使用 Cursor/LLM 開發 MCP

在前面的章節中，我們已經學習了如何開發 MCP 伺服器和客戶端，但整個過程需要一定的開發經驗，這對初學者來說可能有些困難。

今天我們將為大家介紹如何直接使用 LLM 來開發 MCP 伺服器的方案。

## 準備工作

首先，我們需要準備一些文件，這些文件可以幫助 LLM 更好地理解 MCP 協議，當然我們也可以直接提供 MCP 的官方文件給 LLM。

這裡我們使用 Cursor 來進行開發，並提供 `https://modelcontextprotocol.io/llms-full.txt` 文件作為文件內容，我們將其下載到本地的 `llms-full.txt` 文件。

然後就可以開啟 Cursor 開始開發了。

## 開始開發

我們只需要向 Cursor 描述清楚想要構建的伺服器類型即可：

```markdown
伺服器將暴露哪些資源
將提供哪些工具
應包含哪些提示
需要與哪些外部系統交互
```

這裡我們還是以前面和大家講解的氣象查詢為例，來為大家演示如何使用 LLM 來開發一個 MCP 伺服器。

開啟 Cursor 聊天窗口，並使用 `@` 命令選擇 `llms-full.txt` 文件，然後和 Cursor 對話描述清楚需求：

```markdown
Build a weather query MCP server that:

- Developed using TypeScript
- Connects to the OpenWeatherMap API to fetch weather information
- Obtains the OpenWeatherMap API key from the environment variable `OPENWEATHERMAP_API_KEY`
- Provides two tools: one for querying current weather of a specified city, and another for forecasting weather for the next few days
- Retrieves weather data as comprehensive as possible
```

![](https://static.claudemcp.com/images/cursor-prompts.png)

這裡我們選擇使用 `Cluade-3.7-sonnet` 模型，然後點擊 `Send` 按鈕，等待片刻，就可以看到 Cursor 開始根據我們的需求生成代碼了。

我們可以先從核心功能開始，然後逐步添加更多功能。在遇到任何問題時，都可以向 Cursor 提問 解決，最後還可以讓 Cursor 幫助我們來測試伺服器並處理邊界情況。

最後我們就可以得到一個完整的 MCP 伺服器代碼了，如下所示：

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

從上面代碼可以看出同樣我們實現了兩個工具：

- `current_weather`：查詢當前天氣
- `weather_forecast`：查詢未來天氣預報

然後用同樣的方法將這個伺服器代碼先進行構建：

```bash
# 使用 tsc 进行构建
tsc
# 使用 npm 进行构建
# npm run build
```

構建後的代碼會保存到 `build/index.js` 文件中。

接下來我們可以在當前目錄下創建一個 `.cursor/mcp.json` 文件，並配置好伺服器信息：

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

在最新的 Cursor 版本（Version: 0.48.6）中，當我們添加了 MCP 配置後，會自動檢測到新增了 MCP server，會提示我們是否開啟：

![](https://static.claudemcp.com/images/cursor-auto-deteched-mcp.png)

開啟後中 Cursor 設置頁面也可以看到我們新增的兩個工具：

![](https://static.claudemcp.com/images/cursor-mcp-tools-list.png)

然後我們就可以在 Cursor 中來詢問天氣信息了：

![](https://static.claudemcp.com/images/cursor-test-weather-mcp-server.png)

## 最佳實踐

上面我們介紹的只是一個簡單的 MCP 伺服器，實際使用中我們可能需要根據實際需求來構建更加複雜的伺服器。

在使用 Cursor 或者 LLM 構建 MCP 伺服器時，我們可以參考以下最佳實踐：

- 將複雜的伺服器拆分為更小的部分
- 在繼續下一步之前，徹底測試每個組件
- 考慮安全性 - 驗證輸入並適當地限制訪問
- 為將來的維護做好充分的代碼文件
- 嚴格遵循 MCP 協議規範

在構建好伺服器後：

- 仔細審查生成的代碼
- 使用 MCP Inspector 工具測試伺服器
- 將伺服器連接到 MCP 客戶端 測試
- 根據實際使用和反饋進行迭代

請記住，隨著需求的變化，LLM 可以幫助我們修改和改進伺服器。

還需要更多指導？只需向 LLM 提出關於實現 MCP 功能或解決出現的問題的具體問題，當然 MCP 客戶端的實現也可以交給 LLM 來完成。
