---
name: 백링크 MCP
digest: Ahrefs 데이터를 사용하여 도메인의 백링크 정보를 검색하는 MCP 서버
author: cnych
repository: https://github.com/cnych/backlinks-mcp
homepage: https://www.claudemcp.com/servers/backlinks-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - 백링크
icon: https://avatars.githubusercontent.com/u/3094973?s=48&v=4
createTime: 2025-04-12
---

이 MCP 서버는 Ahrefs 데이터를 활용하여 모든 도메인의 백링크 정보를 검색합니다.

## 기능

- 🔍 도메인 백링크 정보 검색
- 🔒 Cloudflare Turnstile 캡차 자동 해결
- 💾 서명 캐싱으로 성능 향상 및 API 비용 절감
- 🚀 빠르고 효율적인 데이터 검색
- 🧹 가장 관련성 높은 백링크 정보만 간소화된 출력

## 설치

> 이 MCP 서버는 학습 목적으로만 사용되며, 오용 시 책임은 사용자에게 있습니다. 이 프로젝트는 `@哥飞 커뮤니티`에서 영감을 받았습니다.

## 기능

- 🔍 도메인 백링크 정보 검색
- 🔒 Cloudflare Turnstile 캡차 자동 해결
- 💾 서명 캐싱으로 성능 향상 및 API 비용 절감
- 🚀 빠르고 효율적인 데이터 검색
- 🧹 가장 관련성 높은 백링크 정보만 간소화된 출력

## 설치

### 필수 조건

- Python 3.8 이상
- CapSolver 계정 및 API 키 ([여기서 등록](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0))
- `uv` 설치 (macOS에서는 `brew install uv`로 설치 가능)

### 수동 설치

1. 저장소 복제:

   ```bash
   git clone https://github.com/cnych/backlinks-mcp.git
   cd backlinks-mcp
   ```

2. FastMCP 설치:

   ```bash
   uv pip install fastmcp
   ```

3. CapSolver API 키 설정:
   ```bash
   export CAPSOLVER_API_KEY="your-capsolver-api-key"
   ```

## 사용 방법

### 서비스 실행

FastMCP로 서비스를 여러 방식으로 실행할 수 있습니다:

#### Claude Desktop에 설치

Claude Desktop에 이 서버를 설치하여 즉시 상호작용:

```bash
fastmcp install src/backlinks_mcp/server.py
```

#### MCP 검사기로 테스트

개발 및 테스트용:

```bash
fastmcp dev src/backlinks_mcp/server.py
```

#### Cursor IDE에 설치

Cursor 설정에서 MCP 탭으로 이동, `+Add new global MCP server` 버튼 클릭 후 다음 내용 입력:

```json
{
  "mcpServers": {
    "Backlink MCP": {
      "command": "uvx",
      "args": ["backlinks-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

프로젝트 루트에 `.cursor/mcp.json` 파일을 생성하여 위 내용을 입력하면 프로젝트 전용 MCP 서버로 사용할 수 있습니다.

> `CAPSOLVER_API_KEY` 환경 변수는 [여기서](https://dashboard.capsolver.com/passport/register?inviteCode=1dTH7WQSfHD0) 얻을 수 있습니다.

이제 Cursor에서 이 MCP를 사용할 수 있습니다:

![Cursor에서 백링크 MCP 사용](/images/backlinks-mcp-on-cursor.png)

### API 참조

이 서비스는 다음 MCP 도구를 제공합니다:

#### `get_backlinks_list(domain: str)`

지정된 도메인의 백링크 목록을 검색합니다.

**매개변수:**

- `domain` (string): 조회할 도메인 (예: "example.com")

**반환값:**

백링크 객체 목록으로 각 객체는 다음을 포함:

- `anchor`: 백링크 앵커 텍스트
- `domainRating`: 도메인 평점 (0-100)
- `title`: 링크 페이지 제목
- `urlFrom`: 백링크가 포함된 페이지 URL
- `urlTo`: 링크된 URL
- `edu`: 교육 사이트 여부
- `gov`: 정부 사이트 여부

**예시 응답:**

```json
[
  {
    "anchor": "example link",
    "domainRating": 76,
    "title": "Useful Resources",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

## 개발

개발 목적으로 저장소를 복제하고 개발 의존성을 설치할 수 있습니다:

```bash
git clone https://github.com/cnych/backlinks-mcp.git
cd backlinks-mcp
uv sync
```

## 작동 원리

1. 서비스는 먼저 도메인의 캐시된 서명을 검색 시도
2. 유효한 캐시가 없을 경우:
   - CapSolver로 Cloudflare Turnstile 캡차 해결
   - Ahrefs에서 서명 및 유효기간 획득
   - 향후 사용을 위해 이 정보 캐싱
3. 서명을 사용하여 백링크 데이터 검색
4. 처리 후 간소화된 백링크 정보 반환

## 문제 해결

- **CapSolver API 키 오류**: `CAPSOLVER_API_KEY` 환경 변수가 올바르게 설정되었는지 확인
- **속도 제한**: 속도 제한이 발생하면 서비스 사용을 줄여보세요
- **결과 없음**: 일부 도메인은 백링크가 없거나 Ahrefs에 인덱싱되지 않을 수 있음
- **문제 발생 시**: 백링크 MCP 문제가 발생하면 [백링크 MCP GitHub 저장소](https://github.com/cnych/backlinks-mcp)에서 문제 해결 가이드 확인

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 배포됩니다 - 자세한 내용은 LICENSE 파일을 참조하세요.