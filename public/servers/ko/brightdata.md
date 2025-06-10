---
name: 브라이트 데이터
digest: 브라이트 데이터 API를 통해 공개 웹 데이터에 접근
author: 브라이트 데이터
homepage: https://brightdata.com
repository: https://github.com/brightdata/brightdata-mcp
pinned: true
capabilities:
  resources: true
  tools: true
tags:
  - 크롤러
  - 데이터 수집
  - API
icon: https://avatars.githubusercontent.com/u/19207323?s=48&v=4
createTime: 2025-04-15
featured: true
---

LLM이 공개 웹 데이터에 접근할 수 있도록 하는 공식 브라이트 데이터 MCP 서버입니다. 이 서버를 통해 Claude Desktop, Cursor, Windsurf, OpenAI Agents 등의 MCP 클라이언트가 웹상의 정보를 기반으로 의사 결정을 내릴 수 있습니다.

## 🌟 개요

LLM, 에이전트 및 앱이 실시간으로 웹 데이터에 접근, 탐색 및 추출할 수 있도록 하는 공식 브라이트 데이터 모델 컨텍스트 프로토콜(MCP) 서버에 오신 것을 환영합니다. 이 서버는 Claude Desktop, Cursor, Windsurf 등의 MCP 클라이언트가 차단 없이 웹을 검색하고, 웹사이트를 탐색하며, 작업을 수행하고 데이터를 검색할 수 있도록 합니다. 스크래핑 작업에 최적화된 솔루션입니다.

![MCP](https://github.com/user-attachments/assets/b949cb3e-c80a-4a43-b6a5-e0d6cec619a7)

## 🎬 데모

아래 동영상은 Claude Desktop의 최소 사용 사례를 보여줍니다:

<video src="https://github.com/user-attachments/assets/59f6ebba-801a-49ab-8278-1b2120912e33" controls></video>

<video src="https://github.com/user-attachments/assets/61ab0bee-fdfa-4d50-b0de-5fab96b4b91d" controls></video>

YouTube 튜토리얼 및 데모 보기: [데모](https://github.com/brightdata-com/brightdata-mcp/blob/main/examples/README.md)

## ✨ 기능

- **실시간 웹 접근**: 웹에서 최신 정보 직접 접근
- **지역 제한 우회**: 위치 제약 없이 콘텐츠 접근
- **웹 언락커**: 봇 탐지 보호 기능으로 웹사이트 탐색
- **브라우저 제어**: 선택적 원격 브라우저 자동화 기능
- **원활한 통합**: 모든 MCP 호환 AI 어시스턴트와 연동

## 🚀 Claude Desktop 빠른 시작

1. `npx` 명령어 사용을 위해 `nodejs` 설치 ([node.js 웹사이트](https://nodejs.org/en/download) 참조)

2. Claude > 설정 > 개발자 > 구성 편집 > claude_desktop_config.json에 다음 내용 추가:

```json
{
  "mcpServers": {
    "Bright Data": {
      "command": "npx",
      "args": ["@brightdata/mcp"],
      "env": {
        "API_TOKEN": "<여기에-API-토큰-입력>",
        "WEB_UNLOCKER_ZONE": "<기본 mcp_unlocker 존 이름 재정의 시 선택사항>",
        "BROWSER_ZONE": "<선택사항 브라우저 존 이름, 기본값 mcp_browser>"
      }
    }
  }
}
```

## 🔧 사용 가능한 도구

[사용 가능한 도구 목록](https://github.com/brightdata-com/brightdata-mcp/blob/main/assets/Tools.md)

## ⚠️ 보안 모범 사례

**중요:** 스크랩한 웹 콘텐츠는 항상 신뢰할 수 없는 데이터로 취급하세요. 프롬프트 주입 위험을 피하기 위해 원시 스크랩 콘텐츠를 LLM 프롬프트에 직접 사용하지 마십시오.
대신 다음을 수행하세요:

- 처리 전 모든 웹 데이터 필터링 및 검증
- 원시 텍스트 대신 구조화된 데이터 추출 사용 (web_data 도구)

## 🔧 계정 설정

1. [brightdata.com](https://brightdata.com)에 계정 생성 (신규 사용자는 테스트용 무료 크레딧 제공, 종량제 옵션 이용 가능)

2. [사용자 설정 페이지](https://brightdata.com/cp/setting/users)에서 API 키 획득

3. (선택사항) 커스텀 웹 언락커 존 생성

   - 기본적으로 API 토큰을 사용해 자동으로 웹 언락커 존 생성
   - 더 많은 제어를 원할 경우 [제어판](https://brightdata.com/cp/zones)에서 직접 웹 언락커 존 생성 후 `WEB_UNLOCKER_ZONE` 환경 변수로 지정

4. (선택사항) 브라우저 제어 도구 활성화:
   - 기본적으로 MCP는 `mcp_browser` 존의 자격 증명을 가져오려 시도
   - `mcp_browser` 존이 없는 경우:
     - [제어판](https://brightdata.com/cp/zones)에서 브라우저 API 존 생성 또는 기존 존 사용 후 `BROWSER_ZONE` 환경 변수로 지정

![브라우저 API 설정](https://github.com/user-attachments/assets/cb494aa8-d84d-4bb4-a509-8afb96872afe)

## 🔌 기타 MCP 클라이언트

다른 에이전트 유형에서 이 MCP 서버를 사용하려면 다음을 해당 소프트웨어에 맞게 조정하세요:

- MCP 서버 실행 전체 명령: `npx @brightdata/mcp`
- 서버 실행 시 환경 변수 `API_TOKEN=<토큰>` 필수
- (선택사항) `BROWSER_ZONE=<존-이름>` 설정으로 커스텀 브라우저 API 존 이름 지정 (기본값 `mcp_browser`)

## 🔄 주요 변경 사항

### 브라우저 인증 업데이트

**주요 변경:** `BROWSER_AUTH` 환경 변수가 `BROWSER_ZONE`으로 대체되었습니다.

- **이전:** 브라우저 API 존에서 `BROWSER_AUTH="사용자:비밀번호"` 제공 필요
- **현재:** 브라우저 존 이름만 `BROWSER_ZONE="존_이름"`으로 지정
- **기본값:** 지정하지 않을 경우 시스템이 자동으로 `mcp_browser` 존 사용
- **마이그레이션:** 구성에서 `BROWSER_AUTH`를 `BROWSER_ZONE`으로 교체하고 `mcp_browser` 존이 없는 경우 브라우저 API 존 이름 지정

## 🔄 변경 로그

[CHANGELOG.md](https://github.com/brightdata-com/brightdata-mcp/blob/main/CHANGELOG.md)

## 🎮 브라이트 데이터 MCP 플레이그라운드 체험

별도 설정 없이 브라이트 데이터 MCP를 체험해보시겠습니까?

[Smithery](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)의 플레이그라운드를 확인하세요:

[![2025-05-06_10h44_20](https://github.com/user-attachments/assets/52517fa6-827d-4b28-b53d-f2020a13c3c4)](https://smithery.ai/server/@luminati-io/brightdata-mcp/tools)

이 플랫폼은 로컬 설정 없이 브라이트 데이터 MCP의 기능을 쉽게 탐색할 수 있는 방법을 제공합니다. 로그인 후 웹 데이터 수집 실험을 시작하세요!

## 💡 사용 예시

이 MCP 서버가 도움을 줄 수 있는 몇 가지 예시 쿼리:

- "[귀하의 지역]에서 곧 개봉할 영화를 구글에서 검색해주세요"
- "테슬라의 현재 시가총액은 얼마인가요?"
- "오늘의 위키백디아 특집 기사는 무엇인가요?"
- "[귀하의 위치]의 7일간 일기 예보는 어떻게 되나요?"
- "연봉이 가장 높은 기술 기업 CEO 3명의 경력 기간은 얼마나 되나요?"

## ⚠️ 문제 해결

### 특정 도구 사용 시 타임아웃

일부 도구는 웹 데이터 읽기를 포함할 수 있으며, 페이지 로딩에 필요한 시간은 극단적인 경우 상당히 달라질 수 있습니다.

에이전트가 데이터를 소비할 수 있도록 충분히 높은 타임아웃 값을 에이전트 설정에서 지정하세요.

`180s` 값은 요청의 99%에 충분하지만, 일부 사이트는 더 느리게 로드될 수 있으므로 필요에 따라 조정하세요.

### spawn npx ENOENT 오류

시스템이 `npx` 명령을 찾을 수 없을 때 발생하는 오류입니다. 해결 방법:

#### npm/Node 경로 찾기

**macOS:**

```
which node
```

`/usr/local/bin/node`와 같은 경로 표시

**Windows:**

```
where node
```

`C:\Program Files\nodejs\node.exe`와 같은 경로 표시

#### MCP 구성 업데이트:

`npx` 명령을 Node의 전체 경로로 교체, 예를 들어 macOS에서는 다음과 같이 표시됩니다:

```
"command": "/usr/local/bin/node"
```

## 📞 지원

문제가 발생하거나 질문이 있는 경우 브라이트 데이터 지원 팀에 문의하거나 저장소에 이슈를 개설해 주세요。
