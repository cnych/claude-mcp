---
name: Winston AI MCP Server
digest: AI detector MCP server with industry leading accuracy rates in detecting use of AI in text and images. The Winston AI MCP server also offers a robust plagiarism checker to help maintain integrity.
author: Winston AI
repository: https://github.com/gowinston-ai/winston-ai-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai-detector
  - ai-tools
  - plagiarism
  - plagiarism-checker
  - text-compare
  - typescript
  - server
icon: https://winston-app-production-public.s3.us-east-1.amazonaws.com/winston-ai-favicon-light.svg
createTime: 2025-07-24
---

# Winston AI MCP Server ⚡️

> **Model Context Protocol (MCP) Server for Winston AI** - the most accurate AI Detector. Detect AI-generated content, plagiarism, and compare texts with ease.

## ✨ Features

### 🔍 AI Text Detection
- **Human vs AI Classification**: Determine if text was written by a human or AI
- **Confidence Scoring**: Get percentage-based confidence scores
- **Sentence-level Analysis**: Identify the most AI-like sentences in your text
- **Multi-language Support**: Works with text in various languages
- **Credit cost**: 1 credit per word

### 🖼️ AI Image Detection
- **Image Analysis**: Detect AI-generated images using advanced ML models
- **Metadata Verification**: Analyze image metadata and EXIF data
- **Watermark Detection**: Identify AI watermarks and their issuers
- **Multiple Formats**: Supports JPG, JPEG, PNG, and WEBP formats
- **Credit cost**: 300 credits per image

### 📝 Plagiarism Detection
- **Internet-wide Scanning**: Check against billions of web pages
- **Source Identification**: Find and list original sources
- **Detailed Reports**: Get comprehensive plagiarism analysis
- **Academic & Professional Use**: Perfect for content verification
- **Credit cost**: 2 credits per word

### 🔄 Text Comparison
- **Similarity Analysis**: Compare two texts for similarities
- **Word-level Matching**: Detailed breakdown of matching content
- **Percentage Scoring**: Get precise similarity percentages
- **Bidirectional Analysis**: Compare both directions
- **Credit cost**: 1/2 credit per total words found in both texts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Winston AI API Key ([Get one here](https://dev.gowinston.ai))

## 🛠️ Development

### Running with npx 🔋
```
env WINSTONAI_API_KEY=your-api-key npx -y winston-ai-mcp
```

### Running the MCP Server locally via stdio 💻

Create a `.env` file in your project root:

```env
WINSTONAI_API_KEY=your_actual_api_key_here
```


```bash
# Clone the repository
git clone https://github.com/gowinston-ai/winston-ai-mcp-server.git
cd winston-ai-mcp-server

# Install dependencies
npm install

# Build the project and start the server
npm run mcp-start
```

## 📦 Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t winston-ai-mcp .

# Run the container
docker run -e WINSTONAI_API_KEY=your_api_key winston-ai-mcp
```

## 📋 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the MCP server
- `npm run mcp-start` - Compile TypeScript to JavaScript and Start the MCP server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🔧 Configuration

### For Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "winston-ai-mcp": {
      "command": "npx",
      "args": ["-y", "winston-ai-mcp"],
      "env": {
        "WINSTONAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### For Cursor IDE

Add to your Cursor configuration:

```json
{
  "mcpServers": {
    "winston-ai-mcp": {
      "command": "npx",
      "args": ["-y", "winston-ai-mcp"],
      "env": {
        "WINSTONAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Accessing the MCP Server via API 🌐

Our MCP server is hosted at `https://api.gowinston.ai/mcp/v1` and can be accessed via HTTPS requests.


#### Example: List tools

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--header 'jsonrpc: 2.0' \
--data '{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}'
```

#### Example: AI Text Detection

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "ai-text-detection",
    "arguments": {
      "text": "Your text to analyze (minimum 300 characters)",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### Example: AI Image Detection

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "ai-image-detection",
    "arguments": {
      "url": "https://example.com/image.jpg",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### Example: Plagiarism Detection

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "plagiarism-detection",
    "arguments": {
      "text": "Text to check for plagiarism (minimum 100 characters)",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### Example: Text Comparison

```bash
curl --location 'https://api.gowinston.ai/mcp/v1' \
--header 'content-type: application/json' \
--header 'accept: application/json' \
--data '{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "text-compare",
    "arguments": {
      "first_text": "First text to compare",
      "second_text": "Second text to compare",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

**Note:** Replace `your-winston-ai-api-key` with your actual Winston AI API key. You can get one at [https://dev.gowinston.ai](https://dev.gowinston.ai).

## 📋 API Reference

### AI Text Detection
```typescript
{
  "text": "Your text to analyze (600+ characters recommended)",
  "file": "(optional) A file to scan. If you supply a file, the API will scan the content of the file. The file must be in plain .pdf, .doc or .docx format.",
  "website": "(optional) A website URL to scan. If you supply a website, the API will fetch the content of the website and scan it. The website must be publicly accessible."
}
```

### AI Image Detection
```typescript
{
  "url": "https://example.com/image.jpg"
}
```

### Plagiarism Detection
```typescript
{
  "text": "Text to check for plagiarism",
  "language": "en", // optional, default: "en"
  "country": "us"   // optional, default: "us"
}
```

### Text Comparison
```typescript
{
  "first_text": "First text to compare",
  "second_text": "Second text to compare"
}
```

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

## 🔗 Links

- **Winston AI MCP NPM Package**: [https://www.npmjs.com/package/winston-ai-mcp](https://www.npmjs.com/package/winston-ai-mcp)
- **Winston AI Website**: [https://gowinston.ai](https://gowinston.ai)
- **API Documentation**: [https://dev.gowinston.ai](https://dev.gowinston.ai)
- **MCP Protocol**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **GitHub Repository**: [https://github.com/gowinston-ai/winston-ai-mcp-server](https://github.com/gowinston-ai/winston-ai-mcp-server)

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

**Made with ❤️ by the Winston AI Team**
