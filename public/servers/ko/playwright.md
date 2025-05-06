---
name: Microsoft Playwright MCP
digest: 대형 언어 모델에 브라우저 자동화 기능을 제공하는 Playwright MCP 서버
author: microsoft
homepage: https://www.npmjs.com/package/@playwright/mcp
repository: https://github.com/microsoft/playwright-mcp
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - playwright
  - 브라우저
  - 자동화
icon: https://avatars.githubusercontent.com/u/6154722?s=48&v=4
createTime: 2025-04-05
---

[Playwright](https://playwright.dev) 기반의 Claude MCP 서버를 통해 대형 언어 모델에 강력한 웹 상호작용 기능을 제공합니다. 이 혁신적인 솔루션은 구조화된 접근성 스냅샷을 통해 LLM과 웹 페이지의 원활한 통신을 가능하게 합니다 - **스크린샷이나 시각 모델 없이도 가능합니다**.

## Playwright란?

`Playwright`는 마이크로소프트가 개발한 오픈 소스 브라우저 자동화 도구로, 테스터와 개발자가 다양한 브라우저와 플랫폼에서 웹 애플리케이션과의 상호작용을 자동화할 수 있게 합니다. 기존 자동화 도구와 달리 `Playwright`는 현대적인 웹 애플리케이션을 위해 설계되어 동적 콘텐츠, 실시간 상호작용, 심지어 네트워크 모니터링까지 지원하여 팀이 애플리케이션을 더 빠르고 효율적으로 테스트할 수 있도록 돕습니다.

![Playwright](/images/playwright.png)

현대 소프트웨어 개발에서 자동화된 브라우저 테스트는 웹 애플리케이션이 다양한 브라우저와 환경에서 원활하게 실행되도록 보장하는 필수적인 요소가 되었습니다. `Playwright`를 사용해 본 적이 있다면 웹 상호작용 자동화에서의 강력한 능력을 잘 알고 있을 것입니다. 하지만 여러 테스트 스크립트, 디버깅 도구 또는 자동화 서비스가 동일한 `Playwright` 인스턴스와 상호작용해야 할 때 `Playwright` 다중 클라이언트 프로토콜(MCP) 서버가 필요합니다.

## Playwright 핵심 기능

### 다중 브라우저 지원

`Playwright`는 Chromium, Firefox 및 WebKit을 원활하게 지원하여 주요 브라우저 간 호환성을 보장합니다. 이는 단일 테스트 스크립트가 다른 브라우저에서 실행될 수 있어 반복 작업을 줄이고 일관된 사용자 경험을 보장합니다.

### 헤드리스 및 헤드 모드 실행

`Playwright`는 UI 없이 헤드리스 모드로 실행되어 테스트 실행 속도를 높일 수 있으며, 이는 CI/CD 프로세스에 특히 이상적입니다. 동시에 디버깅 및 대화형 테스트를 위한 헤드 모드도 지원하여 테스트 실행 과정을 시각적으로 확인할 수 있습니다.

### 병렬 테스트 실행

`Playwright`의 가장 큰 장점 중 하나는 여러 테스트를 동시에 실행할 수 있는 능력입니다. 병렬 실행은 전체 테스트 실행 시간을 줄여주어 빈번하고 빠른 테스트가 필요한 대규모 애플리케이션에 이상적인 솔루션입니다.

### 고급 디버깅 도구

`Playwright`에 내장된 도구는 테스트 실패 디버깅을 크게 단순화합니다. 다음과 같은 기능을 제공합니다:

- 트레이스 뷰어 - 테스트 실행의 단계별 시각화
- 비디오 녹화 - 문제 해결을 위한 테스트 실행 과정 캡처
- 스크린샷 - UI 불일치 문제 감지 지원

### 강력한 웹 상호작용 API

`Playwright`는 다음과 같은 다양한 사용자 상호작용을 지원합니다:

- 버튼 클릭, 양식 작성 및 스크롤 작업
- 네트워크 요청 및 응답 캡처
- 인증 프로세스 및 쿠키 처리
- 파일 업로드 및 다운로드 자동화

## Playwright MCP 서버

Playwright MCP 서버는 Playwright 기반의 MCP 서버로, 테스터와 개발자가 다양한 브라우저와 플랫폼에서 웹 애플리케이션과의 상호작용을 자동화할 수 있게 합니다. 이 서버는 대형 언어 모델(LLM)이 스크린샷이나 시각 조정 모델에 의존하지 않고 구조화된 접근성 스냅샷을 통해 웹 페이지와 상호작용할 수 있도록 합니다. 다음과 같은 핵심 기능을 갖추고 있습니다:

- **LLM에 브라우저 자동화 기능 제공**: MCP를 통해 LLM을 연결하여 AI가 직접 웹 페이지를 조작할 수 있게 합니다. Claude, GPT-4o, DeepSeek 등 대형 언어 모델에 적합합니다.
- **웹 페이지와의 상호작용 지원**: 버튼 클릭, 양식 작성, 페이지 스크롤 등 일반적인 웹 작업을 지원합니다.
- **웹 페이지 스크린샷 캡처**: Playwright MCP Server를 통해 웹 페이지의 스크린샷을 얻어 현재 페이지의 UI와 콘텐츠를 분석할 수 있습니다.
- **JavaScript 코드 실행**: 브라우저 환경에서 JavaScript를 실행하여 웹 페이지와 더 복잡한 상호작용이 가능합니다.
- **편리한 도구 통합**: Smithery 및 mcp-get과 같은 도구를 지원하여 설치 및 구성 과정을 단순화합니다.

자동화 테스트, 정보 수집, SEO 경쟁사 분석, AI 스마트 에이전트 등에 적합합니다. AI가 웹 작업을 더 지능적으로 처리하도록 하거나 효율적인 자동화 도구가 필요한 경우 Playwright MCP Server를 사용해 보세요.

### Cursor에서 설치

Cursor Settings에서 MCP 탭으로 전환한 후 오른쪽 상단의 `Add new global MCP server` 버튼을 클릭하고 다음 구성을 입력합니다:

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp"
      ]
    }
  }
}
```

전역 범위에서 활성화하고 싶지 않다면 프로젝트 루트 디렉토리의 `.cursor/mcp.json` 파일에 위 구성을 추가할 수 있습니다.

⚠️ 참고: 공식 문서에서 제공하는 명령어는 `npx @playwright/mcp@latest`이지만 사용 시 다음과 같은 오류가 발생하여 구성에 실패할 수 있습니다:

```bash
$ npx @playwright/mcp@latest


node:internal/modules/cjs/loader:646
      throw e;
      ^

Error: Cannot find module '/Users/cnych/.npm/_npx/9833c18b2d85bc59/node_modules/yaml/dist/index.js'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:1285:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:1273:15)
    at resolveExports (node:internal/modules/cjs/loader:639:14)
    at Module._findPath (node:internal/modules/cjs/loader:747:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1234:27)
    at Module._load (node:internal/modules/cjs/loader:1074:27)
    at TracingChannel.traceSync (node:diagnostics_channel:315:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:217:24)
    at Module.require (node:internal/modules/cjs/loader:1339:12)
    at require (node:internal/modules/helpers:135:16) {
  code: 'MODULE_NOT_FOUND',
  path: '/Users/cnych/.npm/_npx/9833c18b2d85bc59/node_modules/yaml/package.json'
}

Node.js v22.8.0
```

`npx @playwright/mcp@latest`를 `npx @playwright/mcp`로 대체하면 문제가 해결됩니다.

구성이 완료되면 Cursor 설정 페이지의 MCP 탭에서 Playwright MCP 서버가 성공적으로 구성된 것을 확인할 수 있습니다:

![](/images/cursor-playwright-mcp.png)

### VS Code 설치

```bash
# VS Code용
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'

# VS Code Insiders용
code-insiders --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp"]}'
```

설치가 완료되면 Playwright MCP 서버는 VS Code의 GitHub Copilot 에이전트에서 즉시 사용할 수 있습니다.

## 고급 구성

### 브라우저 옵션

`args`에 일부 매개변수를 추가하여 브라우저를 사용자 정의할 수 있습니다:

- `--browser <browser>`: 선택 사항:
  - 표준 브라우저: `chrome`, `firefox`, `webkit`, `msedge`
  - Chrome 변형: `chrome-beta`, `chrome-canary`, `chrome-dev`
  - Edge 변형: `msedge-beta`, `msedge-canary`, `msedge-dev`
  - 기본값: `chrome`
- `--cdp-endpoint <endpoint>`: 기존 Chrome DevTools 프로토콜 엔드포인트에 연결
- `--executable-path <path>`: 사용자 정의 브라우저 실행 파일 지정
- `--headless`: 헤드리스 모드 실행(기본값은 헤드 모드)
- `--port <port>`: SSE 전송 수신 포트 설정
- `--user-data-dir <path>`: 사용자 데이터 디렉토리 사용자 정의
- `--vision`: 스크린샷 기반 상호작용 모드 활성화

### 프로필 관리

Playwright MCP는 다음 위치에 전용 브라우저 프로필을 생성합니다:

- Windows: `%USERPROFILE%\AppData\Local\ms-playwright\mcp-chrome-profile`
- macOS: `~/Library/Caches/ms-playwright/mcp-chrome-profile`
- Linux: `~/.cache/ms-playwright/mcp-chrome-profile`

세션 간에 이러한 디렉토리를 삭제하면 브라우징 상태가 초기화됩니다.

## 운영 모드

### 헤드리스 운영(자동화에 권장)

```js
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless"
      ]
    }
  }
}
```

### 헤드리스 시스템에서 헤드 모드 운영

디스플레이가 없는 Linux 시스템이나 IDE 작업 프로세스의 경우 SSE 전송을 사용하여 서버를 시작할 수 있습니다. 먼저 다음 명령어로 서버를 시작합니다:

```bash
npx @playwright/mcp --port 8931
```

그런 다음 MCP 클라이언트를 구성합니다:

```js
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/sse"
    }
  }
}
```

## 상호작용 모드

서버가 실행되고 에이전트에 연결되면 에이전트는 MCP에서 제공하는 특정 도구를 호출하여 브라우저를 제어할 수 있습니다. 사용 가능한 도구는 서버가 스냅샷 모드인지 시각 모드인지에 따라 달라집니다.

### 스냅샷 모드(권장)

이 모드는 기본 모드로, 접근성 스냅샷을 사용하여 최고의 성능과 신뢰성을 제공합니다. 제공되는 MCP 도구는 주로 접근성 트리를 사용하여 작동하며, 일반적인 워크플로우는 다음과 같습니다:

1. `browser_snapshot`을 사용하여 접근성 트리의 현재 상태를 가져옵니다.
2. 에이전트는 스냅샷(구조화된 텍스트/JSON)을 분석하여 페이지 콘텐츠를 이해하고 대상 요소를 식별합니다. 스냅샷의 각 상호작용 가능한 요소에는 일반적으로 고유한 ref(참조 식별자)가 있습니다.
3. 에이전트는 `browser_click` 또는 `browser_type`과 같은 상호작용 도구를 호출하여 대상 요소의 ref를 제공합니다.

Playwright MCP는 브라우저 자동화를 위한 일련의 도구를 제공합니다. 다음은 사용 가능한 모든 도구입니다:

- **browser_navigate**: URL로 이동
  - 매개변수:
    - url (string): 이동할 URL
- **browser_go_back**: 이전 페이지로 돌아가기
  - 매개변수: 없음
- **browser_go_forward**: 다음 페이지로 이동
  - 매개변수: 없음
- **browser_click**: 요소 클릭
  - 매개변수:
    - element (string): 클릭할 요소 설명
    - ref (string): 페이지 스냅샷의 정확한 대상 요소 참조
- **browser_hover**: 요소에 마우스 오버
  - 매개변수:
    - element (string): 마우스 오버할 요소 설명
    - ref (string): 페이지 스냅샷의 정확한 대상 요소 참조
- **browser_drag**: 요소 드래그 앤 드롭
  - 매개변수:
    - startElement (string): 드래그할 요소 설명
    - startRef (string): 페이지 스냅샷의 정확한 소스 요소 참조
    - endElement (string): 드롭할 대상 요소 설명
    - endRef (string): 페이지 스냅샷의 정확한 대상 요소 참조
- **browser_type**: 텍스트 입력(선택적 제출)
  - 매개변수:
    - element (string): 입력할 요소 설명
    - ref (string): 페이지 스냅샷의 정확한 대상 요소 참조
- **browser_hover**: 요소에 마우스 오버
  - 매개변수:
    - element (string): 마우스 오버할 요소 설명
    - ref (string): 페이지 스냅샷의 정확한 대상 요소 참조
- **browser_drag**: 요소 드래그 앤 드롭
  - 매개변수:
    - startElement (string): 드래그할 요소 설명
    - startRef (string): 페이지 스냅샷의 정확한 소스 요소 참조
    - endElement (string): 드롭할 대상 요소 설명
    - endRef (string): 페이지 스냅샷의 정확한 대상 요소 참조
- **browser_type**: 텍스트 입력(선택적 제출)
  - 매개변수:
    - element (string): 입력할 요소 설명
    - ref (string): 페이지 스냅샷의 정확한 대상 요소 참조
    - text (string): 입력할 텍스트
    - submit (boolean): 입력된 텍스트를 제출할지 여부(엔터 키 누른 후)
- **browser_select_option**: 드롭다운 옵션 선택
  - 매개변수:
    - element (string): 선택할 요소 설명
    - ref (string): 페이지 스냅샷의 정확한 대상 요소 참조
    - values (array): 선택할 드롭다운 옵션 값
- **browser_choose_file**: 파일 선택
  - 매개변수:
    - paths (array): 업로드할 파일의 절대 경로. 단일 파일 또는 여러 파일일 수 있습니다.
- **browser_press_key**: 키보드의 키 누르기
  - 매개변수:
    - key (string): 누를 키의 이름 또는 문자, 예: ArrowLeft 또는 a
- **browser_snapshot**: 현재 페이지의 접근성 스냅샷 캡처(스크린샷보다 우수)
  - 매개변수: 없음
- **browser_save_as_pdf**: 페이지를 PDF로 저장
  - 매개변수: 없음
- **browser_take_screenshot**: 페이지 스크린샷 캡처
  - 매개변수: 없음
- **browser_wait**: 지정된 시간 동안 대기
  - 매개변수:
    - time (number): 대기할 시간(최대 10초)
- **browser_close**: 페이지 닫기
  - 매개변수: 없음
- **browser_close**: 페이지 닫기
  - 매개변수: 없음

### 비주얼 모드

비주얼 모드에서 제공하는 MCP 도구는 스크린샷에서 추출한 좌표에 의존합니다. 일반적인 작업 흐름은 다음과 같습니다:

1. `browser_screenshot`을 사용하여 현재 화면을 캡처합니다.
2. 에이전트(비주얼 처리 기능이 필요할 수 있음)가 스크린샷을 분석하여 대상 위치(X, Y 좌표)를 식별합니다.
3. 에이전트가 결정된 좌표를 사용하여 `browser_click`이나 `browser_type`과 같은 상호작용 도구를 호출합니다.

비주얼 모드는 스크린샷 기반의 시각적 상호작용을 위한 도구 세트를 제공합니다. 다음은 사용 가능한 모든 도구 목록입니다:

- **browser_navigate**: URL로 이동
  - 매개변수:
    - url (문자열): 이동할 URL
- **browser_go_back**: 이전 페이지로 돌아가기
  - 매개변수: 없음
- **browser_go_forward**: 다음 페이지로 이동
  - 매개변수: 없음
- **browser_screenshot**: 페이지 스크린샷 캡처
  - 매개변수: 없음
- **browser_move_mouse**: 지정된 좌표로 마우스 이동
  - 매개변수:
    - x (숫자): X 좌표
    - y (숫자): Y 좌표
- **browser_click**: 요소 클릭
  - 매개변수:
    - x (숫자): X 좌표
    - y (숫자): Y 좌표
- **browser_drag**: 요소 드래그 앤 드롭
  - 매개변수:
    - startX (숫자): 시작 X 좌표
    - startY (숫자): 시작 Y 좌표
    - endX (숫자): 종료 X 좌표
    - endY (숫자): 종료 Y 좌표
- **browser_type**: 텍스트 입력(선택적 제출)
  - 매개변수:
    - x (숫자): X 좌표
    - y (숫자): Y 좌표
    - text (문자열): 입력할 텍스트
    - submit (불리언): 입력 텍스트 제출 여부(엔터 키 누름)
- **browser_press_key**: 키보드 키 누르기
  - 매개변수:
    - key (문자열): 누를 키 이름 또는 문자(예: ArrowLeft 또는 a)
- **browser_choose_file**: 파일 선택
  - 매개변수:
    - paths (배열): 업로드할 파일의 절대 경로. 단일 파일 또는 여러 파일 가능.
- **browser_save_as_pdf**: 페이지를 PDF로 저장
  - 매개변수: 없음
- **browser_wait**: 지정된 시간 동안 대기
  - 매개변수:
    - time (숫자): 대기 시간(최대 10초)
- **browser_close**: 페이지 닫기
  - 매개변수: 없음

## 커스텀 구현 시작하기

설정 파일과 IDE를 통한 자동 시작 외에도, Playwright MCP는 Node.js 애플리케이션에 직접 통합할 수 있습니다. 이를 통해 서버 설정과 통신 전송에 대한 더 많은 제어가 가능합니다.

```js
import { createServer } from "@playwright/mcp";
// 필요한 전송 클래스를 가져옵니다. 예: '@playwright/mcp/lib/sseServerTransport';
// 또는 직접 전송 메커니즘을 구현할 수도 있습니다.

async function runMyMCPServer() {
  // MCP 서버 인스턴스 생성
  const server = createServer({
    // Playwright 실행 옵션을 여기에 전달할 수 있습니다
    launchOptions: {
      headless: true,
      // 기타 Playwright 옵션...
    },
    // 사용 가능한 경우 다른 서버 옵션 지정
  });

  // SSE 전송 사용 예시(HTTP 서버와 같은 적절한 설정 필요)
  // 이 부분은 개념적이며 특정 서버 프레임워크(예: Express, Node http)에 따라 달라집니다
  /*
  const http = require('http');
  const { SSEServerTransport } = require('@playwright/mcp/lib/sseServerTransport'); // 필요에 따라 경로 조정

  const httpServer = http.createServer((req, res) => {
    if (req.url === '/messages' && req.method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
      const transport = new SSEServerTransport("/messages", res); // 응답 객체 전달
      server.connect(transport); // MCP 서버를 이 전송에 연결

      req.on('close', () => {
        // 필요한 경우 클라이언트 연결 해제 처리
        server.disconnect(transport);
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  httpServer.listen(8931, () => {
    console.log('MCP Server with SSE transport listening on port 8931');
  });
  */

  // 더 간단한 비웹 전송의 경우 다른 메커니즘을 사용할 수 있습니다
  // server.connect(yourCustomTransport);

  console.log("Playwright MCP 서버가 프로그래밍 방식으로 시작되었습니다.");

  // 서버 실행 유지, 연결 처리 등
  // 서버 종료를 위한 정리 로직 추가
}

runMyMCPServer().catch(console.error);
```

이러한 커스텀 접근 방식은 세밀한 제어, 커스텀 전송 계층(기본 메커니즘 또는 SSE를 넘어서), 그리고 MCP 기능을 더 큰 애플리케이션이나 에이전트 프레임워크에 직접 내장할 수 있도록 합니다.

## 모범 사례

1. 대부분의 경우 스냅샷 모드를 우선 사용 - 더 빠르고 안정적입니다
2. 반드시 시각적 인식이 필요한 경우에만 비주얼 모드 사용
3. 민감한 세션 간에 사용자 프로필 삭제
4. 자동화 워크플로우를 위해 헤드리스 모드 활용
5. LLM의 자연어 처리 능력과 결합하여 강력한 자동화 구현

## 요약

Microsoft Playwright MCP는 LLM과 AI 에이전트가 웹과 상호작용할 수 있는 강력하고 효율적인 방법을 제공합니다. 브라우저의 접근성 트리를 활용하는 기본 스냅샷 모드를 통해, 탐색, 데이터 추출, 양식 작성과 같은 일반적인 작업에 적합한 빠르고 안정적이며 텍스트 친화적인 브라우저 자동화 방법을 제공합니다. 선택적 비주얼 모드는 좌표 기반의 시각적 요소 상호작용이 필요한 시나리오를 위한 대안을 제공합니다.

npx를 통한 간편한 설치 또는 Cursor와 같은 Claude MCP 클라이언트에의 심층 통합, 그리고 헤드리스 운영 및 커스텀 전송을 포함한 유연한 구성 옵션을 통해, Playwright MCP는 개발자가 차세대 웹 인식 AI 에이전트를 구축할 수 있는 다목적 도구입니다. 핵심 개념과 사용 가능한 도구를 이해함으로써, 광활한 인터넷 공간을 탐색하고 상호작용할 수 있는 애플리케이션과 에이전트를 효과적으로 강화할 수 있습니다.
