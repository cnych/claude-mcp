import type { MCPServer } from '@/types/server';

export const servers: MCPServer[] = [
  {
    id: "weather-server",
    name: "Weather MCP Server",
    description: "A comprehensive MCP server that provides weather data and forecasts through the OpenWeather API, supporting current conditions, forecasts, and weather alerts.",
    digest: "Get real-time weather data and forecasts via MCP protocol",
    author: "Claude Team",
    homepage: "https://github.com/modelcontextprotocol/weather-server",
    repository: "https://github.com/modelcontextprotocol/weather-server",
    capabilities: {
      resources: true,
      tools: true,
      prompts: false
    },
    tags: ["weather", "api", "forecast"],
    createTime: "2024-01-01T00:00:00Z"
  },
  {
    id: "sqlite-server",
    name: "SQLite MCP Server",
    description: "Access and query SQLite databases through MCP protocol with support for SQL operations, data analysis, and database management.",
    digest: "Query and manage SQLite databases through MCP protocol",
    author: "Claude Team",
    homepage: "https://github.com/modelcontextprotocol/sqlite-server",
    repository: "https://github.com/modelcontextprotocol/sqlite-server",
    capabilities: {
      resources: true,
      tools: true,
      prompts: true
    },
    tags: ["database", "sqlite", "query"],
    createTime: "2024-01-02T00:00:00Z"
  }
]; 