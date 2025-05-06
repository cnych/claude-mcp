---
name: SEO MCP
digest: MCP는 Ahrefs 데이터를 기반으로 한 무료 SEO 도구로, 백링크 분석 및 키워드 연구와 같은 주요 기능을 제공하여 웹사이트 최적화와 검색 순위 향상을 돕습니다.
author: cnych
homepage: https://github.com/cnych/seo-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - SEO
  - Ahrefs
  - 백링크
  - 키워드
icon: https://avatars.githubusercontent.com/u/3094973?v=4
createTime: 2025-04-14
featured: true
---

Ahrefs 데이터를 기반으로 한 무료 SEO 도구 MCP(Model Control Protocol) 서비스입니다. 백링크, 키워드 아이디어 등의 기능을 포함합니다. 향후 더 많은 도구를 추가할 예정입니다.

## 개요

이 서비스는 웹사이트의 SEO 데이터를 조회하기 위한 API를 제공합니다. 캡차 해결, 인증, Ahrefs에서 데이터 가져오기 등의 전체 프로세스를 처리합니다.

> 이 MCP 서비스는 학습 목적으로만 제공됩니다. 악용하지 마십시오. 그렇지 않으면 책임을 지게 됩니다. 이 프로젝트는 `@GoFei Community`에서 영감을 받았습니다.

## 기능

- 모든 도메인에 대한 백링크 데이터 조회
- 키워드 아이디어 및 SEO 제안 가져오기
- CapSolver를 사용한 자동 캡차 해결
- API 호출 감소를 위한 서명 캐싱
- 빠르고 효율적인 데이터 검색
- 가장 관련성 높은 SEO 정보를 제공하는 단순화된 출력

## 설치

### 필수 조건

- Python 3.10 이상
- CapSolver 계정 및 API 키
- `pip` 또는 `uv` 설치 (macOS에서는 `brew install uv`로 설치 필요)

### PyPI에서 설치

```bash
pip install seo-mcp
```

또는 `uv` 사용:

```bash
uv pip install seo-mcp
```

### 수동 설치

1. 저장소 복제:

   ```bash
   git clone https://github.com/cnych/seo-mcp.git
   cd seo-mcp
   ```

2. pip 또는 uv로 종속성 설치:

   ```bash
   pip install -e .
   # 또는
   uv pip install -e .
   ```

3. CapSolver API 키 설정:

   ```bash
   export CAPSOLVER_API_KEY="your-capsolver-api-key"
   ```

## 사용 방법

### 서비스 실행

다음과 같은 방법으로 서비스를 실행할 수 있습니다:

#### Claude Desktop에 설치

```bash
fastmcp install src/seo_mcp/server.py
```

#### 테스트를 위해 MCP Inspector 사용

```bash
fastmcp dev src/seo_mcp/server.py
```

#### Cursor IDE에 설치

Cursor 설정에서 MCP 탭으로 전환한 후 `+ Add new global MCP service` 버튼을 클릭하고 다음 내용을 입력하세요:

```json
{
  "mcpServers": {
    "SEO MCP": {
      "command": "uvx",
      "args": ["--python 3.10", "seo-mcp"],
      "env": {
        "CAPSOLVER_API_KEY": "CAP-xxxxxx"
      }
    }
  }
}
```

![Cursor에서 SEO MCP 백링크 도구 사용](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-03c59e1e.png)

![Cursor에서 SEO MCP 키워드 도구 사용](https://static.claudemcp.com/servers/cnych/seo-mcp/cnych-seo-mcp-a188f668.png)

### API 참조

서비스는 다음 MCP 도구를 제공합니다:

#### `get_backlinks_list(domain: str)`

지정된 도메인의 백링크 목록을 조회합니다.

**매개변수:**

- `domain` (문자열): 조회할 도메인 (예: "example.com")

**반환값:**

백링크 객체 목록, 각각 다음을 포함:

- `anchor`: 백링크의 앵커 텍스트
- `domainRating`: 도메인 등급 (0-100)
- `title`: 링크된 페이지의 제목
- `urlFrom`: 백링크가 포함된 페이지의 URL
- `urlTo`: 링크된 페이지의 URL
- `edu`: 백링크가 교육 웹사이트에서 온 경우를 나타내는 부울 값
- `gov`: 백링크가 정부 웹사이트에서 온 경우를 나타내는 부울 값

**예시 응답:**

```json
[
  {
    "anchor": "예시 링크",
    "domainRating": 76,
    "title": "유용한 자료",
    "urlFrom": "https://referringsite.com/resources",
    "urlTo": "https://example.com/page",
    "edu": false,
    "gov": false
  },
  ...
]
```

#### `keyword_generator(keyword: str, country: str = "us", search_engine: str = "Google")`

지정된 키워드에 대한 창의적이고 SEO 친화적인 제안을 가져옵니다.

**매개변수:**

- `keyword` (문자열): 조회할 키워드
- `country` (문자열): 국가 코드 (예: "us")
- `search_engine` (문자열): 검색 엔진 (예: "Google")

**반환값:**

- 키워드 아이디어 목록, 두 가지 유형 포함:

  - `keyword ideas`: 일반 키워드 제안, 키워드, 국가, 난이도, 볼륨 및 업데이트 시간 포함
  - `question ideas`: 질문 기반 키워드 제안, 동일한 형식

  각 키워드 객체는 다음을 포함:

  - `keyword`: 키워드 텍스트
  - `country`: 국가 코드
  - `difficulty`: 난이도 등급 (Easy, Medium, Hard 또는 Unknown)
  - `volume`: 검색 볼륨 수준 (예: MoreThanOneHundred, MoreThanOneThousand)
  - `updatedAt`: 데이터 업데이트 시간

## 개발

개발 목적으로 저장소를 복제하고 개발 종속성을 설치할 수 있습니다:

```bash
git clone https://github.com/cnych/seo-mcp.git
cd seo-mcp
uv sync  # 또는 pip install -e . 사용
```

## 작동 방식

1. 서비스는 먼저 도메인의 캐시된 서명을 검색하려고 시도합니다.
2. 유효한 캐시가 없는 경우:
   - CapSolver를 사용하여 Cloudflare Turnstile 캡차를 해결합니다.
   - Ahrefs에서 서명 및 만료 날짜를 검색합니다.
   - 향후 사용을 위해 이 정보를 캐시합니다.
3. 서명을 사용하여 SEO 데이터를 검색합니다.
4. 처리하고 단순화된 SEO 정보를 반환합니다.

## 문제 해결

- **CapSolver API 키 오류**: `CAPSOLVER_API_KEY` 환경 변수가 올바르게 설정되었는지 확인하세요.
- **속도 제한**: 속도 제한이 발생하면 서비스 사용 빈도를 줄여보세요.
- **결과 없음**: 일부 도메인은 백링크가 없거나 Ahrefs에 인덱싱되지 않을 수 있습니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 LICENSE 파일을 참조하세요.
