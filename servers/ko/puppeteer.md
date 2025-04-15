---
name: Puppeteer
digest: Puppeteer를 사용하여 브라우저 자동화 기능을 제공하는 MCP 서버입니다. 이 서버는 LLM이 웹 페이지와 상호 작용하고, 스크린샷을 찍고, 실제 브라우저 환경에서 JavaScript를 실행할 수 있게 합니다.
author: Claude 팀
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - puppeteer
  - 브라우저
  - 크롤러
icon: https://cdn.simpleicons.org/puppeteer
createTime: 2024-12-01T00:00:00Z
---

Puppeteer를 사용하여 브라우저 자동화 기능을 제공하는 모델 컨텍스트 프로토콜 서버입니다. 이 서버는 LLM이 웹 페이지와 상호 작용하고, 스크린샷을 찍고, 실제 브라우저 환경에서 JavaScript를 실행할 수 있게 합니다.

## 구성 요소

### 도구

- **puppeteer_navigate**

  - 브라우저에서 모든 URL로 이동
  - 입력: `url` (string)

- **puppeteer_screenshot**

  - 전체 페이지 또는 특정 요소의 스크린샷 캡처
  - 입력:
    - `name` (string, 필수): 스크린샷 이름
    - `selector` (string, 선택 사항): 스크린샷을 찍을 요소의 CSS 선택자
    - `width` (number, 선택 사항, 기본값: 800): 스크린샷 너비
    - `height` (number, 선택 사항, 기본값: 600): 스크린샷 높이

- **puppeteer_click**

  - 페이지의 요소 클릭
  - 입력: `selector` (string): 클릭할 요소의 CSS 선택자

- **puppeteer_hover**

  - 페이지의 요소 위에 마우스 올리기
  - 입력: `selector` (string): 마우스를 올릴 요소의 CSS 선택자

- **puppeteer_fill**

  - 입력 필드 채우기
  - 입력:
    - `selector` (string): 입력 필드의 CSS 선택자
    - `value` (string): 채울 값

- **puppeteer_select**

  - SELECT 태그가 있는 요소 선택
  - 입력:
    - `selector` (string): 선택할 요소의 CSS 선택자
    - `value` (string): 선택할 값

- **puppeteer_evaluate**
  - 브라우저 콘솔에서 JavaScript 실행
  - 입력: `script` (string): 실행할 JavaScript 코드

### 리소스

서버는 두 가지 유형의 리소스에 대한 액세스를 제공합니다:

1. **콘솔 로그** (`console://logs`)

   - 텍스트 형식의 브라우저 콘솔 출력
   - 브라우저의 모든 콘솔 메시지 포함

2. **스크린샷** (`screenshot://<name>`)
   - 캡처된 스크린샷의 PNG 이미지
   - 캡처 중에 지정된 스크린샷 이름을 통해 접근 가능

## 주요 기능

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

## Puppeteer 서버 사용을 위한 구성

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
