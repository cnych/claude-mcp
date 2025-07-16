---
name: Open-WebSearch MCP 서버
digest: 다중 검색 엔진 결과를 기반으로 한 모델 컨텍스트 프로토콜(MCP) 서버입니다. API 키 없이도 무료 웹 검색을 지원합니다.
author: Aas-ee
repository: https://github.com/Aas-ee/open-webSearch
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - web-search
  - search
  - web
icon: https://avatars.githubusercontent.com/u/81606643?s=48&v=4
createTime: 2025-06-10
---

다중 검색 엔진 결과를 기반으로 한 모델 컨텍스트 프로토콜(MCP) 서버입니다. **API 키 없이도 무료 웹 검색**을 지원합니다.

## 주요 기능

- 여러 검색 엔진의 결과를 활용한 웹 검색

  - Bing
  - Baidu
  - ~~linux.do~~ (현재 미지원)
  - CSDN
  - DuckDuckGo
  - Exa
  - Brave

- HTTP 프록시 설정 지원 (네트워크 접근 제한 우회 가능)
- API 키 또는 인증 없이 사용 가능
- 제목, URL, 설명이 포함된 구조화된 검색 결과 제공
- 검색 결과 수 설정 가능
- 기본 검색 엔진 지정 가능
- 개별 게시글 콘텐츠 가져오기 지원 (현재 CSDN 지원)

## TODO

- ✅ Bing, DuckDuckGo, Exa, Brave 지원 완료
- Google 등 추가 검색 엔진 지원 예정
- 더 많은 블로그, 커뮤니티, 소셜 플랫폼 지원 예정
- 게시글 콘텐츠 파싱 기능 고도화 및 사이트 지원 확대

## 설치 가이드

### 로컬 설치

1. 저장소를 클론하거나 다운로드합니다.
2. 종속 패키지 설치:

```bash
npm install
```

3. 서버 빌드:

```bash
npm run build
```

4. MCP 설정에 서버 추가:

**Cherry Studio:**

```json
{
  "mcpServers": {
    "web-search": {
      "name": "Web Search MCP",
      "type": "streamableHttp",
      "description": "다중 엔진 웹 검색 + 게시글 추출 기능",
      "isActive": true,
      "baseUrl": "http://localhost:3000/mcp"
    }
  }
}
```

**VSCode(Claude 확장용):**

```json
{
  "mcpServers": {
    "web-search": {
      "transport": {
        "type": "streamableHttp",
        "url": "http://localhost:3000/mcp"
      }
    },
    "web-search-sse": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

**Claude 데스크탑 버전:**

```json
{
  "mcpServers": {
    "web-search": {
      "transport": {
        "type": "streamableHttp",
        "url": "http://localhost:3000/mcp"
      }
    },
    "web-search-sse": {
      "transport": {
        "type": "sse",
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

### Docker 배포

Docker Compose로 빠르게 배포:

```bash
docker-compose up -d
```

또는 Docker 단독 실행:

```bash
docker run -d --name web-search -p 3000:3000 -e ENABLE_CORS=true -e CORS_ORIGIN=* ghcr.io/aas-ee/open-web-search:latest
```

환경 변수 설정 예시:

```bash
# CORS 허용 (기본값: false)
ENABLE_CORS=true

# 허용된 CORS origin (기본값: *)
CORS_ORIGIN=*

# 기본 검색 엔진 (옵션: bing, duckduckgo, exa, brave / 기본: bing)
DEFAULT_SEARCH_ENGINE=duckduckgo

# 프록시 사용 여부 (기본: false)
USE_PROXY=true

# 프록시 서버 주소
PROXY_URL=http://your-proxy-server:port
```

MCP 클라이언트에 설정:

```json
{
  "mcpServers": {
    "web-search": {
      "name": "Web Search MCP",
      "type": "streamableHttp",
      "description": "다중 엔진 웹 검색 + 게시글 추출 기능",
      "isActive": true,
      "baseUrl": "http://localhost:3000/mcp"
    },
    "web-search-sse": {
      "transport": {
        "name": "Web Search MCP",
        "type": "sse",
        "description": "다중 엔진 웹 검색 + 게시글 추출 기능",
        "isActive": true,
        "url": "http://localhost:3000/sse"
      }
    }
  }
}
```

## 사용법

서버는 3가지 도구를 제공합니다: `search`, `fetchCsdnArticle`, `fetchLinuxDoArticle`

### search 도구 사용법

```ts
{
  "query": string,        // 검색어
  "limit": number,        // (선택) 결과 수 (기본: 10)
  "engines": string[]     // (선택) 사용할 엔진 목록 (기본: bing)
}
```

예시:

```ts
use_mcp_tool({
  server_name: "web-search",
  tool_name: "search",
  arguments: {
    query: "검색어 입력",
    limit: 3,
    engines: ["bing", "csdn", "duckduckgo", "exa", "brave"],
  },
});
```

응답 예시:

```json
[
  {
    "title": "검색 결과 예시",
    "url": "https://example.com",
    "description": "설명 텍스트...",
    "source": "출처",
    "engine": "사용된 엔진"
  }
]
```

### fetchCsdnArticle 도구 사용법

CSDN 블로그 게시글의 전문 내용을 가져옵니다.

```ts
{
  "url": string    // CSDN 게시글 URL
}
```

예시:

```ts
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchCsdnArticle",
  arguments: {
    url: "https://blog.csdn.net/xxx/article/details/xxx",
  },
});
```

응답 예시:

```json
[
  {
    "content": "게시글 본문 내용..."
  }
]
```

### fetchLinuxDoArticle 도구 사용법

Linux.do 포럼 게시글의 전문 내용을 가져옵니다.

```ts
{
  "url": string    // Linux.do 게시글 URL
}
```

예시:

```ts
use_mcp_tool({
  server_name: "web-search",
  tool_name: "fetchLinuxDoArticle",
  arguments: {
    url: "https://xxxx.json",
  },
});
```

응답 예시:

```json
[
  {
    "content": "게시글 본문 내용..."
  }
]
```

## 사용 시 주의사항

웹 크롤링 기반 검색이므로 다음 사항에 유의하세요:

1. **요청 제한**:

   - 짧은 시간에 과도한 검색은 차단될 수 있음
   - 권장 사항:

     - 검색 간 간격 유지
     - `limit` 값 신중하게 사용
     - 필요한 경우 딜레이 추가

2. **정확도**:

   - 엔진 구조 변경 시 결과 파싱이 실패할 수 있음
   - 일부 결과는 설명이 누락될 수 있음
   - 복잡한 검색 연산자는 예상대로 작동하지 않을 수 있음

3. **법적 책임**:

   - 개인 용도로만 사용해야 함
   - 각 검색 엔진의 이용약관을 준수하세요
   - 빈번한 접근은 주의 요함

4. **기본 검색 엔진 설정**:

   - 환경 변수 `DEFAULT_SEARCH_ENGINE`으로 지정 가능
   - 지원 엔진: bing, duckduckgo, exa, brave
   - 특정 사이트 검색 시 기본 엔진이 자동 사용됨

5. **프록시 설정**:

   - 지역 제한이 있는 경우 HTTP 프록시를 통해 우회 가능
   - `USE_PROXY=true`로 활성화
   - `PROXY_URL`에 프록시 주소 지정
