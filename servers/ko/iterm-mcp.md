---
name: iterm-mcp
digest: MCP 서버를 통해 iTerm 터미널 세션에 원격으로 접근할 수 있어, 다양한 위치에서 안전하게 명령줄 인터페이스를 제어하고 관리할 수 있습니다.
author: ferrislucas
homepage: https://github.com/ferrislucas/iterm-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 터미널
  - 통합
  - CLI
icon: https://avatars.githubusercontent.com/u/678152?v=4
createTime: 2025-01-09
---
iTerm 세션에 접근할 수 있는 Model Context Protocol 서버입니다.

![메인 이미지](https://static.claudemcp.com/servers/ferrislucas/iterm-mcp/ferrislucas-iterm-mcp-633bb741.gif)

### 기능

**효율적인 토큰 사용:** iterm-mcp는 모델이 관심 있는 출력만 검사할 수 있도록 합니다. 모델은 일반적으로 장시간 실행되는 명령어의 경우에도 마지막 몇 줄의 출력만 확인하려고 합니다.

**자연스러운 통합:** 모델과 iTerm을 공유할 수 있습니다. 화면에 표시된 내용에 대해 질문하거나 작업을 위임하고 각 단계를 수행하는 모델을 관찰할 수 있습니다.

**완전한 터미널 제어 및 REPL 지원:** 모델은 REPL을 시작하고 상호 작용할 수 있으며, ctrl-c, ctrl-z 등의 제어 문자를 보낼 수 있습니다.

**의존성 최소화:** iterm-mcp는 최소한의 의존성으로 구축되었으며 npx를 통해 실행할 수 있습니다. Claude Desktop 및 기타 MCP 클라이언트에 쉽게 추가할 수 있도록 설계되었습니다. 바로 작동해야 합니다.

## 안전 고려 사항

* 사용자는 도구를 안전하게 사용할 책임이 있습니다.
* 내장된 제한 사항 없음: iterm-mcp는 실행되는 명령어의 안전성을 평가하지 않습니다.
* 모델은 예상치 못한 방식으로 작동할 수 있습니다. 사용자는 활동을 모니터링하고 적절할 때 중단해야 합니다.
* 다단계 작업의 경우 모델이 길을 잃으면 중단해야 할 수 있습니다. 모델의 작동 방식을 익힐 때까지 작고 집중된 작업부터 시작하세요.

### 도구
- `write_to_terminal` - 활성 iTerm 터미널에 작성하며, 종종 명령어를 실행하는 데 사용됩니다. 명령어에 의해 생성된 출력 줄 수를 반환합니다.
- `read_terminal_output` - 활성 iTerm 터미널에서 요청된 줄 수를 읽습니다.
- `send_control_character` - 활성 iTerm 터미널에 제어 문자를 보냅니다.

### 요구 사항

* iTerm2가 실행 중이어야 함
* Node 버전 18 이상

## 설치

Claude Desktop과 함께 사용하려면 서버 구성을 추가하세요:

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "iterm-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "iterm-mcp"
      ]
    }
  }
}
```

### Smithery를 통한 설치

[Smithery](https://smithery.ai/server/iterm-mcp)를 통해 Claude Desktop용 iTerm을 자동으로 설치하려면:

```bash
npx -y @smithery/cli install iterm-mcp --client claude
```

## 개발

의존성 설치:
```bash
yarn install
```

서버 빌드:
```bash
yarn run build
```

자동 재빌드와 함께 개발하려면:
```bash
yarn run watch
```

### 디버깅

MCP 서버는 stdio를 통해 통신하므로 디버깅이 어려울 수 있습니다. [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 사용을 권장하며, 패키지 스크립트로 사용할 수 있습니다:

```bash
yarn run inspector
yarn debug <command>
```

Inspector는 브라우저에서 디버깅 도구에 접근할 수 있는 URL을 제공합니다.