---
name: 브라이트 데이터
digest: 브라이트 데이터 API를 통해 공개 웹 데이터에 접근
author: 브라이트 데이터
homepage: https://brightdata.com
repository: https://github.com/luminati-io/brightdata-mcp
capabilities:
  resources: true
  tools: true
tags:
  - 크롤러
  - 데이터 수집
  - API
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
---

LLM이 공개 웹 데이터에 접근할 수 있도록 하는 공식 브라이트 데이터 MCP 서버입니다. 이 서버를 통해 Claude Desktop, Cursor, Windsurf, OpenAI Agents 등의 MCP 클라이언트가 웹상의 정보를 기반으로 의사 결정을 내릴 수 있습니다.

## 기능

- **웹 데이터 접근**: 공개 웹사이트 및 웹 서비스에서 정보 검색
- **브라우저 제어**: 복잡한 웹 상호작용을 위한 선택적 브라우저 자동화
- **스마트 데이터 추출**: 관련 웹 콘텐츠를 효율적으로 처리 및 반환

## 도구

#### 웹 검색 및 스크래핑

- **search_engine**: Google, Bing 또는 Yandex 검색 후 마크다운 형식으로 결과 제공
- **scrape_as_markdown**: 웹페이지 콘텐츠를 마크다운으로 추출
- **scrape_as_html**: 웹페이지 콘텐츠를 HTML로 추출
- **session_stats**: 현재 세션의 도구 사용 통계 확인

#### 구조화된 데이터 추출

- **web_data_amazon_product**: 구조화된 아마존 제품 데이터 추출
- **web_data_amazon_product_reviews**: 아마존 제품 리뷰 추출
- **web_data_linkedin_person_profile**: LinkedIn 개인 프로필 추출
- **web_data_linkedin_company_profile**: LinkedIn 기업 프로필 추출

#### 브라우저 제어 도구 (BROWSER_AUTH 필요)

- **scraping_browser_navigate**: URL로 이동
- **scraping_browser_go_back**: 이전 페이지로 돌아가기
- **scraping_browser_go_forward**: 다음 페이지로 이동
- **scraping_browser_links**: 현재 페이지의 모든 링크 가져오기
- **scraping_browser_click**: 요소 클릭
- **scraping_browser_type**: 요소에 텍스트 입력
- **scraping_browser_wait_for**: 요소가 나타날 때까지 대기
- **scraping_browser_screenshot**: 스크린샷 찍기
- **scraping_browser_get_html**: 페이지의 HTML 콘텐츠 가져오기
- **scraping_browser_get_text**: 페이지의 텍스트 콘텐츠 가져오기

## 설정

### API 키 획득 방법

1. [brightdata.com](https://brightdata.com)에 계정 생성 (신규 사용자는 테스트용 무료 크레딧 제공)
2. [사용자 설정 페이지](https://brightdata.com/cp/setting/users)에서 API 키 획득
3. [제어판](https://brightdata.com/cp/zones)에서 `mcp_unlocker`라는 이름의 Web Unlocker 프록시 존 생성
   - `WEB_UNLOCKER_ZONE` 환경 변수로 이 존을 재정의할 수 있음
4. (선택사항) 브라우저 제어 도구 사용 시:
   - 브라이트 데이터 제어판에 "스크래핑 브라우저" 존 생성
   - 스크래핑 브라우저 개요 탭에서 인증 문자열 복사

### Claude Desktop과 함께 사용하기

`claude_desktop_config.json`에 다음 내용 추가:

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<여기에-API-토큰-입력>",
        "WEB_UNLOCKER_ZONE": "<존 이름 재정의 선택사항>",
        "BROWSER_AUTH": "<브라우저 제어 도구용 선택사항>"
      }
    }
  }
}
```

---

## 라이선스

이 MCP 서버는 MIT 라이선스로 제공됩니다. 이는 MIT 라이선스의 조건에 따라 소프트웨어를 자유롭게 사용, 수정 및 배포할 수 있음을 의미합니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
