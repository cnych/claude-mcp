---
name: Deepwiki MCP Server
digest: 📖 deepwiki.com을 가져와서 LLM이 읽을 수 있는 마크다운으로 변환하는 MCP 서버
author: regenrek
repository: https://github.com/regenrek/deepwiki-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - deepwiki
  - markdown
  - api
icon: https://avatars.githubusercontent.com/u/5182020?v=4
createTime: 2025-04-28
---

이것은 **비공식 Deepwiki MCP 서버**입니다.

[MCP](/ko)를 통해 Deepwiki URL을 받아 관련된 모든 페이지를 크롤링하고, 이를 마크다운으로 변환하여 하나의 문서 또는 페이지별 목록으로 반환합니다.

## 기능

- **도메인 안전성**: deepwiki.com의 URL만 처리합니다.
- **HTML 정제**: 헤더, 푸터, 네비게이션, 스크립트 및 광고를 제거합니다.
- **링크 재작성**: 마크다운에서 작동하도록 링크를 조정합니다.
- **다중 출력 형식**: 하나의 문서 또는 구조화된 페이지 데이터를 얻을 수 있습니다.
- **성능**: 조정 가능한 동시성 및 깊이로 빠른 크롤링을 제공합니다.

## 사용법

```
{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki"]
    }
  }
}
```

### MCP 도구 통합

이 패키지는 `deepwiki_fetch`라는 도구를 등록하며, 모든 MCP 호환 클라이언트에서 사용할 수 있습니다:

```json
{
  "action": "deepwiki_fetch",
  "params": {
    "url": "https://deepwiki.com/user/repo",
    "mode": "aggregate",
    "maxDepth": "1"
  }
}
```

#### 매개변수

- `url` (필수): Deepwiki 저장소의 시작 URL
- `mode` (선택사항): 출력 모드, "aggregate"(기본값)는 단일 마크다운 문서, "pages"는 구조화된 페이지 데이터
- `maxDepth` (선택사항): 크롤링할 최대 페이지 깊이 (기본값: 10)

### 응답 형식

#### 성공 응답 (Aggregate 모드)

```json
{
  "status": "ok",
  "data": "# 페이지 제목\n\n페이지 내용...\n\n---\n\n# 다른 페이지\n\n더 많은 내용...",
  "totalPages": 5,
  "totalBytes": 25000,
  "elapsedMs": 1200
}
```

#### 성공 응답 (Pages 모드)

```json
{
  "status": "ok",
  "data": [
    {
      "path": "index",
      "markdown": "# 홈 페이지\n\n저장소에 오신 것을 환영합니다."
    },
    {
      "path": "section/page1",
      "markdown": "# 첫 번째 페이지\n\n이것은 첫 번째 페이지 내용입니다."
    }
  ],
  "totalPages": 2,
  "totalBytes": 12000,
  "elapsedMs": 800
}
```

#### 오류 응답

```json
{
  "status": "error",
  "code": "DOMAIN_NOT_ALLOWED",
  "message": "deepwiki.com 도메인만 허용됩니다"
}
```

#### 부분 성공 응답

```json
{
  "status": "partial",
  "data": "# 페이지 제목\n\n페이지 내용...",
  "errors": [
    {
      "url": "https://deepwiki.com/user/repo/page2",
      "reason": "HTTP 오류: 404"
    }
  ],
  "totalPages": 1,
  "totalBytes": 5000,
  "elapsedMs": 950
}
```

### 진행 이벤트

도구 사용 시 크롤링 중 진행 이벤트를 받게 됩니다:

```
https://deepwiki.com/user/repo 가져옴: 12500 바이트, 450ms (상태: 200)
https://deepwiki.com/user/repo/page1 가져옴: 8750 바이트, 320ms (상태: 200)
https://deepwiki.com/user/repo/page2 가져옴: 6200 바이트, 280ms (상태: 200)
```

## 로컬 개발 - 설치

### 로컬 사용법

```
{
  "mcpServers": {
    "mcp-deepwiki": {
      "command": "node",
      "args": ["./bin/cli.mjs"]
    }
  }
}
```

### 소스에서 설치

```bash
# 저장소 복제
git clone https://github.com/regenrek/mcp-deepwiki.git
cd mcp-deepwiki

# 의존성 설치
npm install

# 패키지 빌드
npm run build
```

#### 직접 API 호출

HTTP 전송을 위해 직접 API 호출을 할 수 있습니다:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "req-1",
    "action": "deepwiki_fetch",
    "params": {
      "url": "https://deepwiki.com/user/repo",
      "mode": "aggregate"
    }
  }'
```

## 구성

### 환경 변수

- `DEEPWIKI_MAX_CONCURRENCY`: 최대 동시 요청 수 (기본값: 5)
- `DEEPWIKI_REQUEST_TIMEOUT`: 요청 시간 제한 (밀리초, 기본값: 30000)
- `DEEPWIKI_MAX_RETRIES`: 실패한 요청에 대한 최대 재시도 횟수 (기본값: 3)
- `DEEPWIKI_RETRY_DELAY`: 재시도 지연 기본 시간 (밀리초, 기본값: 250)

이를 구성하려면 프로젝트 루트에 `.env` 파일을 생성하세요:

```
DEEPWIKI_MAX_CONCURRENCY=10
DEEPWIKI_REQUEST_TIMEOUT=60000
DEEPWIKI_MAX_RETRIES=5
DEEPWIKI_RETRY_DELAY=500
```

## Docker 배포 (테스트되지 않음)

Docker 이미지 빌드 및 실행:

```bash
# 이미지 빌드
docker build -t mcp-deepwiki .

# stdio 전송으로 실행 (개발용)
docker run -it --rm mcp-deepwiki

# HTTP 전송으로 실행 (프로덕션용)
docker run -d -p 3000:3000 mcp-deepwiki --http --port 3000

# 환경 변수와 함께 실행
docker run -d -p 3000:3000 \
  -e DEEPWIKI_MAX_CONCURRENCY=10 \
  -e DEEPWIKI_REQUEST_TIMEOUT=60000 \
  mcp-deepwiki --http --port 3000
```

## 개발

```bash
# 의존성 설치
pnpm install

# stdio로 개발 모드 실행
pnpm run dev-stdio

# 테스트 실행
pnpm test

# 린터 실행
pnpm run lint

# 패키지 빌드
pnpm run build
```

## 문제 해결

### 일반적인 문제

1. **권한 거부**: CLI 실행 시 EACCES 오류가 발생하면 바이너리를 실행 가능하게 만드세요:

   ```bash
   chmod +x ./node_modules/.bin/mcp-deepwiki
   ```

2. **연결 거부**: 포트가 사용 가능하고 방화벽에 의해 차단되지 않았는지 확인하세요:

   ```bash
   # 포트 사용 중인지 확인
   lsof -i :3000
   ```

3. **시간 초과 오류**: 대규모 저장소의 경우 시간 제한과 동시성을 증가시키세요:
   ```
   DEEPWIKI_REQUEST_TIMEOUT=60000 DEEPWIKI_MAX_CONCURRENCY=10 npx mcp-deepwiki
   ```

## 라이선스

MIT
