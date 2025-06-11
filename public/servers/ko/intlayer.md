---
name: Intlayer MCP 서버
digest: Intlayer MCP 서버는 IDE에 AI 지원을 통합하여 Intlayer를 사용한 더 스마트하고 컨텍스트를 인식하는 개발 경험을 제공합니다. 명령줄 액세스, 프로젝트 내 문서 및 직관적인 AI 도움말을 제공합니다.
author: aymericzip
homepage: https://intlayer.org
repository: https://github.com/aymericzip/intlayer
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - i18n
  - 지역화
  - 번역
  - 자동화
icon: https://intlayer.org/android-chrome-512x512.png
createTime: 2025-06-10
featured: true
---

**Intlayer**를 사용하여 개발을 향상시키는 모델 컨텍스트 프로토콜(MCP) 서버로, IDE 인식 문서, CLI 통합 및 AI 기반 컨텍스트 도구를 제공합니다.

## 기능

- Intlayer 사용에 대한 AI 지원 제안 및 설명
- IDE에서 직접 `intlayer` 명령을 실행하고 검사하는 스마트 CLI 통합
- 프로젝트의 실제 Intlayer 버전을 기반으로 한 컨텍스트 내 문서
- 실시간 상호 작용을 위한 도구 인터페이스 및 프롬프트 제안
- `npx`를 사용한 제로 구성 설정

## 지원되는 IDE

- Cursor
- VS Code (MCP를 통해)
- 모델 컨텍스트 프로토콜(MCP)을 지원하는 모든 IDE

## 설정

### 옵션 1: NPX로 빠른 시작

`.cursor/mcp.json`(또는 동등한 MCP 구성)에 다음을 추가하십시오:

```json
{
  "mcpServers": {
    "intlayer": {
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

그런 다음 IDE 또는 MCP 세션을 다시 시작하십시오.

### 옵션 2: VS Code 구성

`.vscode/mcp.json`을 만듭니다:

```json
{
  "servers": {
    "intlayer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@intlayer/mcp"]
    }
  }
}
```

명령 팔레트에서:

- "채팅 모드"를 통해 **에이전트 모드** 활성화
- `#intlayer`를 사용하여 도구 참조
- 도구 확인 및 서버 세션 관리

## CLI 사용법

CLI를 통해 수동으로 Intlayer MCP 서버를 실행할 수도 있습니다:

```bash
# 권장: npx
npx @intlayer/mcp

# 개발 모드
npm run dev

# 사용자 지정 항목
node dist/cjs/index.cjs
```

검사 및 디버그하려면:

```bash
npx @modelcontextprotocol/inspector npx @intlayer/mcp
```

## 사용 가능한 기능

| 기능                 | 설명                                                                |
| -------------------- | ------------------------------------------------------------------- |
| 스마트 CLI           | `intlayer` 명령에 대한 인라인 실행 및 문서 조회                     |
| 버전 관리된 문서     | 설치된 Intlayer 버전을 자동으로 감지하고 일치하는 문서를 로드합니다 |
| 자동 완성 + 프롬프트 | 파일 및 컨텍스트에 맞는 AI 지원 프롬프트 제안                       |
| 에이전트 모드 도구   | Cursor 및 호환 IDE 내에서 사용자 지정 도구를 등록하고 실행합니다    |

## 전제 조건

- Node.js
- MCP 프로토콜을 지원하는 IDE (Cursor, VS Code 등)
- [Intlayer](https://github.com/aymericzip/intlayer)를 사용하는 프로젝트

## 라이선스

Apache 2.0

---

## 유용한 링크

- [Intlayer GitHub 리포지토리](https://github.com/aymericzip/intlayer)
- [문서](https://intlayer.org/doc/mcp-server)
