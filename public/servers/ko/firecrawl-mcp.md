---
name: Firecrawl MCP
digest: 대형 언어 모델을 위한 웹 스크래핑 기능을 제공하는 Firecrawl MCP 서버
author: mendableai
repository: https://github.com/mendableai/firecrawl-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - firecrawl
  - 크롤러
  - 웹 추출
icon: https://avatars.githubusercontent.com/u/135057108?s=48&v=4
createTime: 2025-04-09
featured: true
---

Firecrawl MCP는 [Firecrawl](https://firecrawl.dev/)을 사용하여 웹 페이지를 스크랩하는 MCP 서버 구현으로, Cursor, Claude 및 기타 MCP 클라이언트에 고급 웹 스크래핑, 콘텐츠 추출 및 데이터 처리 기능을 제공합니다. Model Context Protocol (MCP)을 통해 다양한 MCP 클라이언트와 원활하게 통합되어 AI가 웹 콘텐츠에 직접 접근하고 처리할 수 있도록 합니다.

## 주요 기능

- **고급 웹 스크래핑**: 단일 URL 또는 여러 URL에서 콘텐츠를 일괄적으로 스크랩 지원
- **지능형 콘텐츠 추출**: 주요 콘텐츠를 자동으로 식별 및 추출하며, 네비게이션 바, 푸터 등 관련 없는 요소를 필터링
- **구조화된 데이터 추출**: LLM을 사용하여 웹 페이지에서 형식화된 구조적 데이터 추출
- **웹 검색**: 검색 엔진에서 직접 결과를 가져와 처리
- **웹사이트 크롤링**: 재귀적 웹사이트 크롤링 지원, 깊이와 범위 제어 가능
- **심층 연구**: 지능형 크롤링, 검색 및 LLM 분석을 활용한 심층 연구 수행
- **자동 생성 LLMs.txt**: 웹사이트에 대한 표준화된 LLMs.txt 파일 생성, LLM이 웹사이트와 상호 작용하는 방식 정의
- **자동화된 속도 제한 처리**: 내장된 지수 백오프 재시도 메커니즘
- **병렬 처리**: 효율적인 일괄 작업 및 병렬 요청 처리

:::adsense 8781986491:::

## 설치 및 구성

### npx로 실행

```bash
env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp
```

### 수동 설치

```bash
npm install -g firecrawl-mcp
```

### Cursor에서 구성 및 실행

#### Cursor 🖥️ 구성

참고: Cursor 버전 0.45.6 이상이 필요합니다. MCP 서버 구성에 대한 최신 지침은 Cursor 공식 문서를 참조하세요: [Cursor MCP 서버 구성 가이드](https://cursor.sh/docs/mcp-server-configuration)

##### Cursor v0.45.6에서 Firecrawl MCP 구성

1. Cursor 설정 열기
2. Features > MCP Servers로 이동
3. "+ Add New MCP Server" 클릭
4. 다음 내용 입력:
   - 이름: "firecrawl-mcp" (또는 원하는 이름)
   - 유형: "command"
   - 명령: `env FIRECRAWL_API_KEY=your-api-key npx -y firecrawl-mcp`

##### Cursor v0.48.6에서 Firecrawl MCP 구성

1. Cursor 설정 열기
2. Features > MCP Servers로 이동
3. "+ Add new global MCP server" 클릭
4. 다음 코드 입력:

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR-API-KEY"
      }
    }
  }
}
```

Windows 시스템을 사용 중이며 문제가 발생하는 경우 다음을 시도하세요: `cmd /c "set FIRECRAWL_API_KEY=your-api-key && npx -y firecrawl-mcp"`

`your-api-key`를 Firecrawl API 키로 교체하세요. 아직 키가 없는 경우 계정을 생성하고 https://www.firecrawl.dev/app/api-keys에서 얻을 수 있습니다.

추가한 후 MCP 서버 목록을 새로 고쳐 새 도구를 확인하세요. Composer Agent는 적절한 경우 자동으로 Firecrawl MCP를 사용하지만, 웹 스크래핑 요구 사항을 설명하여 명시적으로 요청할 수도 있습니다. Command+L(Mac)을 통해 Composer에 접근하고, 제출 버튼 옆의 "Agent"를 선택한 후 쿼리를 입력하세요.

### Windsurf에서 실행

`./codeium/windsurf/model_config.json` 파일에 다음 내용을 추가하세요:

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### Smithery를 통해 설치(레거시 방식)

Claude Desktop에 Firecrawl을 자동으로 설치:

```bash
npx -y @smithery/cli install @mendableai/mcp-server-firecrawl --client claude
```

### 구성

#### 환경 변수

##### 클라우드 API 필수 변수

- `FIRECRAWL_API_KEY`: Firecrawl API 키

  - 클라우드 API 사용 시 필수(기본값)
  - `FIRECRAWL_API_URL`과 함께 자체 호스팅 인스턴스 사용 시 선택 사항

- `FIRECRAWL_API_URL`(선택 사항): 자체 호스팅 인스턴스의 사용자 정의 API 엔드포인트
  - 예: `https://firecrawl.your-domain.com`
  - 제공되지 않으면 클라우드 API 사용(API 키 필요)

##### 선택적 구성

**재시도 구성**

- `FIRECRAWL_RETRY_MAX_ATTEMPTS`: 최대 재시도 횟수(기본값: 3)
- `FIRECRAWL_RETRY_INITIAL_DELAY`: 첫 재시도 전 초기 지연(밀리초)(기본값: 1000)
- `FIRECRAWL_RETRY_MAX_DELAY`: 재시도 간 최대 지연(밀리초)(기본값: 10000)
- `FIRECRAWL_RETRY_BACKOFF_FACTOR`: 지수 백오프 승수(기본값: 2)

**크레딧 사용 모니터링**

- `FIRECRAWL_CREDIT_WARNING_THRESHOLD`: 크레딧 사용 경고 임계값(기본값: 1000)
- `FIRECRAWL_CREDIT_CRITICAL_THRESHOLD`: 크레딧 사용 위험 임계값(기본값: 100)

#### 구성 예시

**클라우드 API 사용자 정의 재시도 및 크레딧 모니터링**:

```bash
# 클라우드 API 필수
export FIRECRAWL_API_KEY=your-api-key

# 선택적 재시도 구성
export FIRECRAWL_RETRY_MAX_ATTEMPTS=5        # 최대 재시도 횟수 증가
export FIRECRAWL_RETRY_INITIAL_DELAY=2000    # 2초 지연으로 시작
export FIRECRAWL_RETRY_MAX_DELAY=30000       # 최대 30초 지연
export FIRECRAWL_RETRY_BACKOFF_FACTOR=3      # 더 공격적인 백오프

# 선택적 크레딧 모니터링
export FIRECRAWL_CREDIT_WARNING_THRESHOLD=2000    # 2000 크레딧 시 경고
export FIRECRAWL_CREDIT_CRITICAL_THRESHOLD=500    # 500 크레딧 시 위험 경고
```

**자체 호스팅 인스턴스**:

```bash
# 자체 호스팅 필수
export FIRECRAWL_API_URL=https://firecrawl.your-domain.com

# 자체 호스팅 선택적 인증
export FIRECRAWL_API_KEY=your-api-key  # 인스턴스에 인증이 필요한 경우

# 사용자 정의 재시도 구성
export FIRECRAWL_RETRY_MAX_ATTEMPTS=10
export FIRECRAWL_RETRY_INITIAL_DELAY=500     # 더 빠른 재시도 시작
```

### Claude Desktop과 함께 사용

`claude_desktop_config.json` 파일에 다음 내용을 추가하세요:

```json
{
  "mcpServers": {
    "mcp-server-firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_API_KEY_HERE",

        "FIRECRAWL_RETRY_MAX_ATTEMPTS": "5",
        "FIRECRAWL_RETRY_INITIAL_DELAY": "2000",
        "FIRECRAWL_RETRY_MAX_DELAY": "30000",
        "FIRECRAWL_RETRY_BACKOFF_FACTOR": "3",

        "FIRECRAWL_CREDIT_WARNING_THRESHOLD": "2000",
        "FIRECRAWL_CREDIT_CRITICAL_THRESHOLD": "500"
      }
    }
  }
}
```

## 구성 옵션

Firecrawl MCP 서버는 필요에 따라 조정할 수 있는 다양한 구성 옵션을 제공합니다:

### 재시도 구성

```javascript
retry: {
  maxAttempts: 3,    // 속도 제한 요청에 대한 재시도 횟수
  initialDelay: 1000, // 첫 재시도 전 초기 지연(밀리초)
  maxDelay: 10000,    // 재시도 간 최대 지연(밀리초)
  backoffFactor: 2,   // 지수 백오프 인자
}
```

### 크레딧 모니터링

```javascript
credit: {
  warningThreshold: 1000, // 크레딧 사용이 이 수준에 도달하면 경고
  criticalThreshold: 100,  // 크레딧 사용이 이 수준에 도달하면 심각한 경고
}
```

이러한 구성은 다음을 제어합니다:

1. **재시도 동작**

   - 속도 제한으로 실패한 요청 자동 재시도
   - API 과도한 요청 방지를 위한 지수 백오프 사용
   - 예: 기본 설정 사용 시 재시도는 다음 시간에 시도됨:
     - 첫 재시도: 1초 지연
     - 두 번째 재시도: 2초 지연
     - 세 번째 재시도: 4초 지연(maxDelay 상한)

2. **크레딧 모니터링**
   - 클라우드 API 크레딧 소비 추적
   - 지정된 임계값에서 경고 제공
   - 서비스 중단 예방 지원
   - 예: 기본 설정 사용 시:
     - 1000 크레딧 남았을 때 경고
     - 100 크레딧 남았을 때 심각한 경고

## 속도 제한 및 일괄 처리

서버는 Firecrawl 내장 속도 제한 및 일괄 처리 기능을 활용합니다:

- 지수 백오프 전략을 통한 자동 속도 제한 처리
- 일괄 작업을 위한 효율적인 병렬 처리
- 지능형 요청 큐 및 스로틀링
- 일시적 오류 자동 재시도

## 사용 가능한 도구

### 1. 스크랩 도구 (`firecrawl_scrape`)

단일 URL에서 콘텐츠를 스크랩하며 고급 옵션 지원.

```json
{
  "name": "firecrawl_scrape",
  "arguments": {
    "url": "https://example.com",
    "formats": ["markdown"],
    "onlyMainContent": true,
    "waitFor": 1000,
    "timeout": 30000,
    "mobile": false,
    "includeTags": ["article", "main"],
    "excludeTags": ["nav", "footer"],
    "skipTlsVerification": false
  }
}
```

### 2. 일괄 스크랩 도구 (`firecrawl_batch_scrape`)

여러 URL에서 효율적으로 콘텐츠를 스크랩하며 내장 속도 제한 및 병렬 처리.

```json
{
  "name": "firecrawl_batch_scrape",
  "arguments": {
    "urls": ["https://example1.com", "https://example2.com"],
    "options": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

응답에는 상태 확인을 위한 작업 ID가 포함됩니다:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Batch operation queued with ID: batch_1. Use firecrawl_check_batch_status to check progress."
    }
  ],
  "isError": false
}
```

### 3. 일괄 상태 확인 (`firecrawl_check_batch_status`)

일괄 작업 상태 확인.

```json
{
  "name": "firecrawl_check_batch_status",
  "arguments": {
    "id": "batch_1"
  }
}
```

### 4. 검색 도구 (`firecrawl_search`)

웹을 검색하고 선택적으로 검색 결과에서 콘텐츠 추출.

```json
{
  "name": "firecrawl_search",
  "arguments": {
    "query": "검색 쿼리",
    "limit": 5,
    "lang": "en",
    "country": "us",
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true
    }
  }
}
```

### 5. 크롤링 도구 (`firecrawl_crawl`)

고급 옵션으로 비동기 크롤링 시작.

```json
{
  "name": "firecrawl_crawl",
  "arguments": {
    "url": "https://example.com",
    "maxDepth": 2,
    "limit": 100,
    "allowExternalLinks": false,
    "deduplicateSimilarURLs": true
  }
}
```

### 6. 추출 도구 (`firecrawl_extract`)

LLM 기능을 사용하여 웹 페이지에서 구조화된 정보 추출. 클라우드 AI 및 자체 호스팅 LLM 추출 지원.

```json
{
  "name": "firecrawl_extract",
  "arguments": {
    "urls": ["https://example.com/page1", "https://example.com/page2"],
    "prompt": "제품 정보 추출, 이름, 가격 및 설명 포함",
    "systemPrompt": "제품 정보 추출을 돕는 어시스턴트입니다",
    "schema": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "price": { "type": "number" },
        "description": { "type": "string" }
      },
      "required": ["name", "price"]
    },
    "allowExternalLinks": false,
    "enableWebSearch": false,
    "includeSubdomains": false
  }
}
```

예시 응답:

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "name": "예제 제품",
        "price": 99.99,
        "description": "이것은 예제 제품 설명입니다"
      }
    }
  ],
  "isError": false
}
```

#### 추출 도구 옵션:

- `urls`: 정보를 추출할 URL 배열
- `prompt`: LLM 추출을 위한 사용자 정의 프롬프트
- `systemPrompt`: LLM을 안내하는 시스템 프롬프트
- `schema`: 구조화된 데이터 추출을 위한 JSON 스키마
- `allowExternalLinks`: 외부 링크에서 추출 허용
- `enableWebSearch`: 추가 컨텍스트를 위한 웹 검색 활성화
- `includeSubdomains`: 추출에 서브도메인 포함

자체 호스팅 인스턴스 사용 시 추출은 구성된 LLM을 사용합니다. 클라우드 API의 경우 Firecrawl의 관리형 LLM 서비스를 사용합니다.

### 7. 심층 연구 도구 (`firecrawl_deep_research`)

지능형 크롤링, 검색 및 LLM 분석을 사용하여 쿼리에 대한 심층적인 웹 연구 수행.

```json
{
  "name": "firecrawl_deep_research",
  "arguments": {
    "query": "탄소 포집 기술은 어떻게 작동하나요?",
    "maxDepth": 3,
    "timeLimit": 120,
    "maxUrls": 50
  }
}
```

매개변수:

- query(문자열, 필수): 탐구할 연구 질문 또는 주제.
- maxDepth(숫자, 선택 사항): 크롤링/검색의 최대 재귀 깊이(기본값: 3).
- timeLimit(숫자, 선택 사항): 연구 세션의 시간 제한(초)(기본값: 120).
- maxUrls(숫자, 선택 사항): 분석할 최대 URL 수(기본값: 50).

반환:

- 연구 기반으로 LLM이 생성한 최종 분석. (data.finalAnalysis)
- 연구 과정에서 사용된 구조화된 활동 및 소스도 포함할 수 있습니다.

### 8. LLMs.txt 생성 도구 (`firecrawl_generate_llmstxt`)

주어진 도메인에 대한 표준화된 `llms.txt` 파일 생성, 이 파일은 대형 언어 모델이 웹사이트와 어떻게 상호 작용해야 하는지 정의합니다.

```json
{
  "name": "firecrawl_generate_llmstxt",
  "arguments": {
    "url": "https://example.com",
    "maxUrls": 20,
    "showFullText": true
  }
}
```

매개변수:

- url(문자열, 필수): 분석할 웹사이트 기본 URL.
- maxUrls(숫자, 선택 사항): 포함할 최대 URL 수(기본값: 10).
- showFullText(불리언, 선택 사항): 응답에 llms-full.txt 내용을 포함할지 여부.

반환:

- 생성된 `llms.txt` 파일 내용, 선택적으로 `llms-full.txt` 포함(`data.llmstxt` 및/또는 `data.llmsfulltxt`)

## 로그 시스템

서버는 포괄적인 로깅을 포함합니다:

- 작업 상태 및 진행 상황
- 성능 지표
- 크레딧 사용 모니터링
- 속도 제한 추적
- 오류 상황

예시 로그 메시지:

```
[INFO] Firecrawl MCP Server 성공적으로 초기화됨
[INFO] URL 스크래핑 시작: https://example.com
[INFO] 일괄 작업이 큐에 추가됨, ID: batch_1
[WARNING] 크레딧 사용이 경고 임계값에 도달함
[ERROR] 속도 제한 초과, 2초 후 재시도...
```

## 오류 처리

서버는 강력한 오류 처리를 제공합니다:

- 일시적 오류 자동 재시도
- 백오프 전략을 사용한 속도 제한 처리
- 상세한 오류 메시지
- 크레딧 사용 경고
- 네트워크 복원력

오류 응답 예시:

```json
{
  "content": [
    {
      "type": "text",
      "text": "오류: 속도 제한 초과. 2초 후 재시도..."
    }
  ],
  "isError": true
}
```

## 개발

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 테스트 실행
npm test
```

### 기여

1. 저장소 포크
2. 기능 브랜치 생성
3. 테스트 실행: `npm test`
4. 풀 리퀘스트 제출

## 라이선스

MIT 라이선스 - 자세한 내용은 LICENSE 파일 참조
