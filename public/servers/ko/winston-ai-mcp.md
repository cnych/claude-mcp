---
name: Winston AI MCP 서버
digest: AI 텍스트 및 이미지 탐지에서 업계 최고 정확도를 자랑하는 Winston AI의 AI 탐지 MCP 서버입니다. 또한 견고한 표절 검사 기능을 제공하여 콘텐츠의 무결성을 유지합니다.
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

# Winston AI MCP 서버 ⚡️

> **모델 컨텍스트 프로토콜(MCP) 서버 for Winston AI** – 가장 정확한 AI 탐지기. AI 생성 콘텐츠, 표절을 탐지하고 텍스트를 손쉽게 비교하세요.

## ✨ 특징

### 🔍 AI 텍스트 탐지
- **인간 vs AI 분류**: 텍스트가 사람 또는 AI에 의해 작성되었는지 판별
- **신뢰도 점수**: 백분율 기반 신뢰도 제공
- **문장 수준 분석**: AI로 작성된 가능성이 가장 높은 문장 식별
- **다국어 지원**: 다양한 언어의 텍스트 처리
- **크레딧 비용**: 단어당 1 크레딧

### 🖼️ AI 이미지 탐지
- **이미지 분석**: 고급 ML 모델을 사용하여 AI 생성 이미지를 탐지
- **메타데이터 확인**: 이미지 메타데이터 및 EXIF 데이터 분석
- **워터마크 탐지**: AI 워터마크 및 발행자 식별
- **다중 포맷 지원**: JPG, JPEG, PNG, WEBP 포맷 지원
- **크레딧 비용**: 이미지당 300 크레딧

### 📝 표절 탐지
- **인터넷 전역 스캔**: 수십억 개 웹페이지와 비교
- **출처 식별**: 원본 출처 찾기 및 목록 제공
- **상세 보고서**: 종합적인 표절 분석 리포트
- **학술 및 전문 용도**: 콘텐츠 검증에 최적
- **크레딧 비용**: 단어당 2 크레딧

### 🔄 텍스트 비교
- **유사도 분석**: 두 텍스트 간 유사도 비교
- **단어 수준 매칭**: 매칭된 콘텐츠에 대한 세부 분석
- **백분율 점수**: 정확한 유사도 백분율 제공
- **양방향 분석**: 양쪽 방향 모두 비교
- **크레딧 비용**: 총 단어 수의 절반 크레딧

## 🚀 빠른 시작

### 사전 준비
- Node.js 18+

## 🛠️ 개발

### npx로 실행 🔋

```bash
env WINSTONAI_API_KEY=your-api-key npx -y winston-ai-mcp
```

### stdio로 로컬 MCP 서버 실행 💻

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
WINSTONAI_API_KEY=your_actual_api_key_here
```

```bash
# 저장소 클론
git clone https://github.com/gowinston-ai/winston-ai-mcp-server.git
cd winston-ai-mcp-server

# 의존성 설치
npm install

# 빌드 후 서버 시작
npm run mcp-start
```

## 📦 Docker 지원

Docker로 빌드 및 실행:

```bash
# 이미지 빌드
docker build -t winston-ai-mcp .

# 컨테이너 실행
docker run -e WINSTONAI_API_KEY=your_api_key winston-ai-mcp
```

## 📋 사용 가능한 스크립트

- `npm run build` - TypeScript를 JavaScript로 컴파일
- `npm start` - MCP 서버 시작
- `npm run mcp-start` - TypeScript 컴파일 후 MCP 서버 시작
- `npm run lint` - ESLint 실행
- `npm run format` - Prettier로 코드 포맷팅

## 🔧 구성

### Claude Desktop용

`claude_desktop_config.json`에 추가:

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

### Cursor IDE용

Cursor 설정에 추가:

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

## API를 통한 MCP 서버 접근 🌐

MCP 서버는 `https://api.gowinston.ai/mcp/v1` 에서 호스팅되며 HTTPS 요청으로 접근할 수 있습니다.

#### 예시: 도구 목록 가져오기

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

#### 예시: AI 텍스트 탐지

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
      "text": "분석할 텍스트 (최소 300자)",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 예시: AI 이미지 탐지

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

#### 예시: 표절 탐지

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
      "text": "표절 여부를 확인할 텍스트 (최소 100자)",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

#### 예시: 텍스트 비교

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
      "first_text": "첫 번째 텍스트",
      "second_text": "두 번째 텍스트",
      "apiKey": "your-winston-ai-api-key"
    }
  }
}'
```

**주의:** `your-winston-ai-api-key` 를 실제 Winston AI API 키로 교체하세요. [https://dev.gowinston.ai](https://dev.gowinston.ai)에서 발급 받을 수 있습니다.

## 📋 API 레퍼런스

### AI 텍스트 탐지
```typescript
{
  "text": "분석할 텍스트 (600자 이상 권장)",
  "file": "(선택) 스캔할 파일. 파일을 제공하면 해당 콘텐츠를 분석합니다. .pdf, .doc, .docx 형식 지원.",
  "website": "(선택) 스캔할 웹사이트 URL. 공개적으로 접근 가능한 페이지여야 합니다."
}
```

### AI 이미지 탐지
```typescript
{
  "url": "https://example.com/image.jpg"
}
```

### 표절 탐지
```typescript
{
  "text": "표절 여부를 확인할 텍스트",
  "language": "ko", // 선택, 기본값: "en"
  "country": "kr"   // 선택, 기본값: "us"
}
```

### 텍스트 비교
```typescript
{
  "first_text": "첫 번째 텍스트",
  "second_text": "두 번째 텍스트"
}
```

## 🤝 기여

환영합니다!

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경 사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 🔗 링크

- **Winston AI MCP NPM 패키지**: [https://www.npmjs.com/package/winston-ai-mcp](https://www.npmjs.com/package/winston-ai-mcp)
- **Winston AI 웹사이트**: [https://gowinston.ai](https://gowinston.ai)
- **API 문서**: [https://dev.gowinston.ai](https://dev.gowinston.ai)
- **MCP 프로토콜**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **GitHub 저장소**: [https://github.com/gowinston-ai/winston-ai-mcp-server](https://github.com/gowinston-ai/winston-ai-mcp-server)

## ⭐️ 지원

프로젝트가 도움이 되었다면 GitHub에서 ⭐️ 눌러 주세요!

---

**Winston AI 팀이 ❤️ 와 함께 만듦**
