---
name: mcp-server-webcrawl
digest: 웹 크롤러 콘텐츠 검색 및 검색. 고급 필터링 및 콘텐츠 검색 기능이 있는 크롤러에 연결합니다.
author: pragmar
repository: https://github.com/pragmar/mcp_server_webcrawl
homepage: https://pragmar.com/mcp-server-webcrawl/
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - crawler
  - search
  - indexing
icon: https://pragmar.com/media/static/images/home/mcp-server-webcrawl.png
createTime: 2025-03-26
---

웹 크롤러 검색 및 검색 기능을 제공하는 모델 컨텍스트 프로토콜(MCP) 서버입니다. 이 서버를 통해 MCP 클라이언트는 고급 필터링 기능을 사용하여 크롤링된 사이트의 웹 콘텐츠를 검색하고 액세스할 수 있습니다.

## 기능

🔍 **전체 텍스트 검색**. 키워드, 태그, CSS 클래스 등으로 웹 콘텐츠를 필터링합니다.

🔬 **고급 검색**. 상태, 콘텐츠 유형 및/또는 사이트별로 검색합니다.

🕸️ **다중 크롤러 지원**. WARC, wget, InterroBot, Katana, SiteOne 등과 같은 크롤러를 지원합니다.

✂️ **API 컨텍스트 형성**. 필드 옵션은 API가 반환하는 내용을 결정하여 LLM 상호 작용에서 컨텍스트를 가볍게 유지합니다.

## 설치

Python 3.10 이상이 필요합니다.

### pip으로 설치

pip을 사용하여 패키지 설치:

```bash
pip install mcp-server-webcrawl
```

## 구성

구성은 크롤러에 따라 다릅니다. --datasource 예제를 대상 경로로 교체해야 합니다.

### wget 구성

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "wget", "--datasrc", "/path/to/wget/archives/"]
    }
  }
}
```

**테스트된 wget 명령:**

```bash
# --adjust-extension은 파일 확장자용, 예: *.html
wget --mirror https://example.com
wget --mirror https://example.com --adjust-extension
```

### WARC 구성

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "warc", "--datasrc", "/path/to/warc/archives/"]
    }
  }
}
```

**WARC용 테스트된 wget 명령:**

```bash
wget --warc-file=example --recursive https://example.com
wget --warc-file=example --recursive --page-requisites https://example.com
```

### InterroBot 구성

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": [
        "--crawler",
        "interrobot",
        "--datasrc",
        "/home/user/Documents/InterroBot/interrobot.v2.db"
      ]
    }
  }
}
```

**참고:**

- 크롤러는 InterroBot 내에서 실행해야 합니다(창 모드)
- macOS/Windows: --datasource 경로는 InterroBot 옵션 페이지에서 제공됩니다

### Katana 구성

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": ["--crawler", "katana", "--datasrc", "/path/to/katana/crawls/"]
    }
  }
}
```

**테스트된 Katana 명령:**

```bash
# -store-response는 크롤링 콘텐츠 저장용
# -store-response-dir는 단일 디렉토리에서 여러 사이트 크롤링 허용
katana -u https://example.com -store-response -store-response-dir crawls/
```

### SiteOne 구성

```json
{
  "mcpServers": {
    "webcrawl": {
      "command": "mcp-server-webcrawl",
      "args": [
        "--crawler",
        "siteone",
        "--datasrc",
        "/path/to/siteone/archives/"
      ]
    }
  }
}
```

**참고:**

- 크롤러는 SiteOne 내에서 실행해야 합니다(창 모드)
- "Generate offline website" 옵션을 선택해야 합니다

## 사용 가능한 도구

### `webcrawl_sites`

사이트 목록(프로젝트 사이트 또는 크롤링 디렉토리)을 가져옵니다.

**선택적 매개변수**

- `fields`(문자열 배열, 선택 사항): 기본 필드(id, url) 외에 응답에 포함할 추가 필드. 옵션에는 다음이 포함됩니다:
- `ids`(정수 배열, 선택 사항): 프로젝트 ID로 필터링된 목록. 비어 있으면 모든 항목을 의미합니다.

**선택적 필드**

- `modified` 마지막 수정된 ISO 8601 타임스탬프
- `created` 생성된 ISO 8601 타임스탬프
- `robots` Robots.txt 정보(제한된 지원)

**사용 예시**

모든 크롤링된 사이트 나열: "웹 크롤러를 나열할 수 있습니까?"

특정 사이트의 기본 크롤링 정보 가져오기: "example.com의 웹 크롤러 정보를 가져올 수 있습니까?"

### `webcrawl_search`

프로젝트 전체의 리소스(웹 페이지, CSS, PDF 등)를 검색하고 지정된 필드를 검색합니다.

**선택적 매개변수:**

- `query`(문자열, 선택 사항): 전체 텍스트 검색 쿼리 문자열. 전체 텍스트 및 부울 연산자를 지원하며, 구문은 SQLite FTS5의 부울 모드(AND, OR, NOT, 인용구 구문, 접미사 와일드카드)와 일치합니다.
- `sites`(정수 배열, 선택 사항): 검색 결과를 특정 사이트로 필터링하기 위한 프로젝트 ID 목록.
- `limit`(정수, 선택 사항): 반환할 최대 결과 수. 기본값은 20, 최대값은 100입니다.
- `offset`(정수, 선택 사항): 페이지 매김을 위해 건너뛸 결과 수. 기본값은 0입니다.
- `sort`(문자열, 선택 사항): 결과의 정렬 순서. `+` 접두사는 오름차순, `-`는 내림차순을 나타냅니다.
- `statuses`(정수 배열, 선택 사항): HTTP 상태 코드로 필터링([200]은 성공 응답, [404, 500]은 오류를 나타냄).
- `types`(문자열 배열, 선택 사항): 특정 리소스 유형으로 필터링.
- `thumbnails`(부울, 선택 사항): 이미지 썸네일의 base64 인코딩 데이터를 활성화합니다. 기본값은 false입니다.
- `fields`(문자열 배열, 선택 사항): 기본 필드(id, URL, status) 외에 응답에 포함할 추가 필드. 빈 목록은 기본 필드만을 의미합니다. 콘텐츠 필드는 크기가 클 수 있으므로 LIMIT와 함께 신중하게 사용해야 합니다:
- `ids`(정수 배열, 선택 사항): ID를 통해 특정 리소스를 직접 찾습니다.

**선택적 필드**

- `created`: 생성된 ISO 8601 타임스탬프
- `modified`: 마지막 수정된 ISO 8601 타임스탬프
- `content`: text/\*인 경우 리소스의 실제 콘텐츠(HTML/CSS/JS/일반 텍스트)
- `name`: 리소스 이름 또는 제목 정보
- `size`: 파일 크기 정보
- `time`: 리소스와 관련된 시간 지표(크롤러 유형에 따라 지원이 다를 수 있음)
- `headers`: 리소스와 관련된 HTTP 헤더(크롤러 유형에 따라 지원이 다를 수 있음)

**정렬 옵션**

- `+id`, `-id`: 리소스 ID로 정렬
- `+url`, `-url`: 리소스 URL로 정렬
- `+status`, `-status`: HTTP 상태 코드로 정렬
- `?`: 무작위 정렬(통계 샘플링에 유용)

**사용 예시:**

사이트 키워드 검색: "example.com 크롤러에서 키워드를 검색할 수 있습니까?"

검색 및 필터링된 콘텐츠 요약: "웹 크롤러에서 키워드를 검색하고 콘텐츠를 수집하여 요약할 수 있습니까?"

이미지 정보 가져오기: "example.com 웹 크롤러의 이미지를 나열할 수 있습니까?"

키워드가 포함된 404 오류 찾기(WARC/Katana/InterroBot): "example.com 크롤러에서 404 오류를 검색할 수 있습니까?"

## 라이선스

이 프로젝트는 MPL 2.0 라이선스에 따라 제공됩니다. 자세한 내용은 저장소의 LICENSE 파일을 참조하세요.
