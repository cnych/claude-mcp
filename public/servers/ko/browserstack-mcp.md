---
name: BrowserStack
digest: BrowserStack MCP 서버가 출시되었습니다! 챗봇, 앱, 자율 에이전트를 포함한 모든 AI 시스템에서 BrowserStack 테스트 플랫폼의 전체 기능을 활용하세요.
author: BrowserStack
homepage: https://www.browserstack.com
repository: https://github.com/browserstack/mcp-server
capabilities:
  resources: true
  tools: true
tags:
  - 테스팅
  - 품질 보증
  - 접근성
icon: https://avatars.githubusercontent.com/u/1119453?s=200&v=4
createTime: 2025-04-29
---

# BrowserStack MCP 서버

[![BrowserStack](https://static.claudemcp.com/images/browserstack-mcp-thumbnail.jpg)](https://www.youtube.com/watch?v=sLA7K9v7qZc)

팀의 모든 개발자와 테스터가 수동 테스트를 수행하거나 자동화 여정을 시작하거나 테스트 자동화를 확장할 수 있도록 지원합니다.
BrowserStack MCP 서버를 사용하면 선호하는 AI 도구에서 바로 최첨단 [테스트 플랫폼](https://www.browserstack.com/test-platform)을 사용할 수 있습니다.

### BrowserStack을 선택해야 하는 이유

![BrowserStack](https://static.claudemcp.com/images/browserstack-overview.png)

## 💡 사용 예시

### 📱 수동 앱 테스트

BrowserStack의 광범위한 실제 디바이스 클라우드에서 **모바일 앱**을 테스트하세요. 에뮬레이터 사용은 이제 그만!

```bash
# 특정 디바이스에서 앱 열기
"iPhone 15 Pro Max에서 내 앱 열기"

# 앱 충돌 디버깅
"Android 14 디바이스에서 내 앱이 충돌했는데, 디버깅을 도와줄 수 있나요?"
```

- 에뮬레이터와 달리 실제 디바이스에서 앱의 실제 성능을 테스트하세요. 고급 [앱 프로파일링 기능](https://www.browserstack.com/docs/app-live/app-performance-testing)으로 실시간으로 충돌 및 성능 문제를 디버깅할 수 있습니다.
- [디바이스 그리드](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)에서 모든 주요 디바이스 및 OS 버전에 액세스하세요. 글로벌 데이터센터에 새로 출시된 디바이스를 [출시 당일](https://www.browserstack.com/blog/browserstack-launches-iphone-15-on-day-0-behind-the-scenes/)에 제공하기 위한 엄격한 SLA를 준수합니다.

### 🌐 수동 웹 테스트

앱 테스트와 유사하게 BrowserStack의 광범위한 실제 브라우저 및 디바이스 클라우드에서 **웹사이트**를 테스트할 수 있습니다. 컴퓨터에 Edge 브라우저가 설치되어 있지 않나요? 걱정하지 마세요!

```bash
# 로컬 웹사이트 테스트
"localhost:3001에서 호스팅되는 내 웹사이트를 Edge에서 열기"
```

- 다양한 브라우저와 디바이스에서 웹사이트를 테스트하세요. 모든 주요 OS의 [모든 주요 브라우저](https://www.browserstack.com/list-of-browsers-and-platforms/live)를 지원합니다.
- 컴퓨터에서 로컬로 호스팅되는 웹사이트를 원격 서버에 배포할 필요 없이 원활하게 테스트하세요!

### 🧪 자동화 테스트 (Playwright, Selenium, 접근성 테스트 등)

BrowserStack의 [테스트 플랫폼](https://www.browserstack.com/test-platform)에서 **자동화 테스트**를 실행/디버깅/수정하세요.

```bash
# 테스트 스위트를 BrowserStack으로 포팅
"내 테스트 스위트를 BrowserStack 인프라에서 실행"

# 테스트 실패 디버깅
"내 테스트 스위트가 실패했는데, 새로운 실패를 수정하는 데 도움을 줄 수 있나요?"

# 접근성 테스트
"www.mywebsite.com에서 접근성 문제 확인"
```

- CI/CD 파이프라인에서 보고된 테스트 실패를 업계 최고의 [테스트 가시성](https://www.browserstack.com/docs/test-observability) 기능을 활용하여 수정하세요. 자세한 정보는 [여기](https://www.browserstack.com/docs/test-observability/features/smart-tags)에서 확인할 수 있습니다.
- Jest, Playwright, Selenium 등으로 작성된 테스트를 BrowserStack의 [테스트 플랫폼](https://www.browserstack.com/test-platform)에서 실행하세요.
- **접근성 테스트**: [접근성 테스트](https://www.browserstack.com/accessibility-testing) 도구로 WCAG 및 ADA 준수 여부를 확인하세요.

## 🛠️ 설치 방법

1. **BrowserStack 계정 생성**

   - 아직 계정이 없다면 [BrowserStack](https://www.browserstack.com/signup)에 가입하세요.

   - ℹ️ 오픈소스 프로젝트가 있는 경우 [무료 플랜](https://www.browserstack.com/open-source)을 제공할 수 있습니다.

![오픈소스](https://static.claudemcp.com/images/browserstack-open-source.png)

- 계정이 있고 적절한 플랜을 구매한 후 [계정 설정](https://www.browserstack.com/accounts/profile/details)에서 `username`과 `access_key`를 기록해 두세요.

2. Node 버전 >= `18.0`을 사용하고 있는지 확인하세요. `node --version`으로 버전을 확인하세요. 권장 버전: `v22.15.0` (LTS)
3. **MCP 서버 설치**

   - VSCode (Copilot - 에이전트 모드): `.vscode/mcp.json`:

   ```json
   {
     "servers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```

   - VSCode에서 MCP 서버의 `시작` 버튼을 클릭하여 서버를 시작하세요.
     ![MCP 서버 시작](https://static.claudemcp.com/images/browserstack-vscode.png)

   * Cursor: `.cursor/mcp.json`:

   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```

   - Claude Desktop: `~/claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "browserstack": {
         "command": "npx",
         "args": ["-y", "@browserstack/mcp-server@latest"],
         "env": {
           "BROWSERSTACK_USERNAME": "<username>",
           "BROWSERSTACK_ACCESS_KEY": "<access_key>"
         }
       }
     }
   }
   ```

## 🤝 권장 MCP 클라이언트

- 자동화 테스트 및 디버깅 사용 사례에는 **Github Copilot 또는 Cursor**를 사용하는 것이 좋습니다.
- 수동 테스트 사용 사례(라이브 테스트)에는 **Claude Desktop**을 사용하는 것이 좋습니다.

## ⚠️ 중요 사항

- BrowserStack MCP 서버는 활발히 개발 중이며 현재 MCP 사양의 일부만 지원합니다. 더 많은 기능이 곧 추가될 예정입니다.
- 도구 호출은 MCP 클라이언트에 의존하며, 이는 LLM에 의존하므로 예상치 못한 결과를 초래할 수 있는 비결정적 동작이 있을 수 있습니다. 제안 사항이나 피드백이 있으면 이슈를 열어 논의해 주세요.

## 📝 기여하기

기여를 환영합니다! 변경 사항을 논의하려면 이슈를 열어 주세요.
👉 [**기여 가이드라인 보기**](https://github.com/browserstack/mcp-server/blob/main/CONTRIBUTING.md)

## 📞 지원

지원이 필요하면:

- [문서](https://www.browserstack.com/docs)를 확인하세요.
- MCP 서버와 관련된 문제가 있으면 [GitHub 저장소](https://github.com/browserstack/mcp-server)에 이슈를 열어 주세요.
- 기타 문의 사항은 [지원 팀](https://www.browserstack.com/contact)에 문의하세요.

## 🚀 곧 출시될 더 많은 기능

흥미로운 업데이트를 기대해 주세요! 제안 사항이 있으면 이슈를 열어 논의해 주세요.

## 🔗 리소스

- [BrowserStack 테스트 플랫폼](https://www.browserstack.com/test-platform)
- [MCP 프로토콜 문서](https://modelcontextprotocol.io)
- [디바이스 그리드](https://www.browserstack.com/list-of-browsers-and-platforms/app_live)
- [접근성 테스트](https://www.browserstack.com/accessibility-testing)

## 📄 라이선스

이 프로젝트는 [AGPL-3.0 라이선스](https://www.gnu.org/licenses/agpl-3.0.html)에 따라 라이선스가 부여됩니다.
