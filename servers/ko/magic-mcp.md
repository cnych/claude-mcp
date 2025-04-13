---
name: 21st.dev Magic AI Agent
digest: v0와 같지만 Cursor/WindSurf/Cline에서 사용 가능합니다. 21st dev Magic MCP 서버는 마법처럼 프론트엔드 작업을 할 수 있게 해줍니다
author: 21st-dev
repository: https://github.com/21st-dev/magic-mcp
homepage: https://21st.dev/magic/
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - ui
  - ide
icon: https://static.claudemcp.com/servers/21st-dev/magic-mcp/21st-dev-magic-mcp-6c24c56a.png
createTime: 2025-02-19
featured: true
---

![MCP 배너](https://static.claudemcp.com/servers/21st-dev/magic-mcp/21st-dev-magic-mcp-6c24c56a.png)

Magic Component Platform(MCP)은 자연어 설명을 통해 개발자가 아름답고 현대적인 UI 컴포넌트를 즉시 생성할 수 있도록 도와주는 강력한 AI 기반 도구입니다. 인기 있는 IDE와 원활하게 통합되며 UI 개발을 위한 간소화된 워크플로를 제공합니다.

## 기능

- **AI 기반 UI 생성**: 자연어로 설명하여 UI 컴포넌트 생성
- **다중 IDE 지원**:
  - [Cursor](https://cursor.com) IDE 통합
  - [Windsurf](https://windsurf.ai) 지원
  - [VSCode + Cline](https://cline.bot) 통합 (베타)
- **현대적 컴포넌트 라이브러리**: [21st.dev](https://21st.dev)에서 영감을 받은 사전 제작된 다양한 커스터마이징 가능한 컴포넌트에 접근
- **실시간 미리보기**: 생성하는 즉시 컴포넌트 확인 가능
- **TypeScript 지원**: 타입 안전 개발을 위한 완전한 TypeScript 지원
- **SVGL 통합**: 전문적인 브랜드 자산과 로고의 방대한 컬렉션에 접근
- **컴포넌트 향상**: 고급 기능과 애니메이션으로 기존 컴포넌트 개선 (출시 예정)

## 작동 방식

1. **필요한 사항을 에이전트에게 알리기**

   - AI 에이전트 채팅에서 `/ui`를 입력하고 원하는 컴포넌트 설명
   - 예시: `/ui 반응형 디자인을 가진 현대적인 네비게이션 바 생성`

2. **Magic이 생성하도록 하기**

   - IDE에서 Magic 사용을 요청
   - Magic이 즉시 정교한 UI 컴포넌트 생성
   - 컴포넌트는 21st.dev 라이브러리에서 영감을 받음

3. **원활한 통합**
   - 컴포넌트가 자동으로 프로젝트에 추가
   - 새로운 UI 컴포넌트를 즉시 사용 시작
   - 모든 컴포넌트는 완전히 커스터마이징 가능

## 시작하기

### 필수 조건

- Node.js (최신 LTS 버전 권장)
- 지원되는 IDE 중 하나:
  - Cursor
  - Windsurf
  - VSCode (Cline 확장 프로그램 포함)

### 설치

1. **API 키 생성**

   - [21st.dev Magic 콘솔](https://21st.dev/magic/console) 방문
   - 새로운 API 키 생성

2. **설치 방법 선택**

#### 방법 1: CLI 설치 (권장)

IDE에 MCP를 설치하고 구성하는 한 줄 명령:

```bash
npx @21st-dev/cli@latest install <client> --api-key <key>
```

지원되는 클라이언트: cursor, windsurf, cline, claude

#### 방법 2: 수동 구성

수동 설정을 선호하는 경우, IDE의 MCP 구성 파일에 다음을 추가:

```json
{
  "mcpServers": {
    "@21st-dev/magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest", "API_KEY=\"your-api-key\""]
    }
  }
}
```

구성 파일 위치:

- Cursor: `~/.cursor/mcp.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`
- Cline: `~/.cline/mcp_config.json`
- Claude: `~/.claude/mcp_config.json`

## FAQ

### Magic AI 에이전트는 내 코드베이스를 어떻게 처리하나요?

Magic AI 에이전트는 생성하는 컴포넌트와 관련된 파일만 작성하거나 수정합니다. 프로젝트의 코드 스타일과 구조를 따르며, 애플리케이션의 다른 부분에 영향을 주지 않고 기존 코드베이스와 원활하게 통합됩니다.

### 생성된 컴포넌트를 커스터마이징할 수 있나요?

네! 모든 생성된 컴포넌트는 완전히 편집 가능하며 잘 구조화된 코드로 제공됩니다. 코드베이스의 다른 React 컴포넌트와 마찬가지로 스타일링, 기능 및 동작을 수정할 수 있습니다.

### 생성 한도를 초과하면 어떻게 되나요?

월간 생성 한도를 초과하면 플랜 업그레이드를 요청받게 됩니다. 언제든지 업그레이드하여 컴포넌트 생성을 계속할 수 있습니다. 기존 컴포넌트는 계속 정상적으로 작동합니다.

### 새로운 컴포넌트는 얼마나 빨리 21st.dev 라이브러리에 추가되나요?

작성자는 언제든지 컴포넌트를 21st.dev에 게시할 수 있으며, Magic 에이전트는 즉시 접근할 수 있습니다. 이는 커뮤니티의 최신 컴포넌트와 디자인 패턴에 항상 접근할 수 있음을 의미합니다.

### 컴포넌트 복잡도에 제한이 있나요?

Magic AI 에이전트는 간단한 버튼부터 복잡한 인터랙티브 폼까지 다양한 복잡도의 컴포넌트를 처리할 수 있습니다. 그러나 최상의 결과를 위해 매우 복잡한 UI는 작고 관리 가능한 컴포넌트로 분할하는 것을 권장합니다.

## 개발

### 프로젝트 구조

```
mcp/
├── app/
│   └── components/     # 핵심 UI 컴포넌트
├── types/             # TypeScript 타입 정의
├── lib/              # 유틸리티 함수
└── public/           # 정적 자산
```

### 주요 컴포넌트

- `IdeInstructions`: 다양한 IDE에 대한 설정 지침
- `ApiKeySection`: API 키 관리 인터페이스
- `WelcomeOnboarding`: 신규 사용자를 위한 온보딩 흐름

## 라이선스

MIT 라이선스
