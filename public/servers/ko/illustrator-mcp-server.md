---
name: Illustrator MCP Server
digest: Adobe Illustrator는 스크립트를 통해 복잡한 작업을 자동화하는 JavaScript를 지원하여 효율적인 프로그램적 콘텐츠 생성을 가능하게 합니다. 이 통합은 봇과 자동화 워크플로우에 이상적입니다.
author: spencerhhubert
homepage: https://github.com/spencerhhubert/illustrator-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - javascript
  - macos
  - illustrator
icon: https://avatars.githubusercontent.com/u/33559710?v=4
createTime: 2024-12-12
---
Adobe Illustrator는 JavaScript와 호환됩니다. 사실, 프로그램적으로 생성해야 하는 매우 큰 작업들은 이러한 스크립트를 통해 처리할 수 있습니다. 봇들은 JavaScript를 잘 다룹니다.

이 MCP 서버는 봇들이 스크립트를 직접 Illustrator로 보내고 결과를 확인할 수 있게 해줍니다.

AppleScript에 의존하기 때문에 MacOS와만 호환됩니다. 그리고 저는 Claude Desktop에서만 테스트해보았습니다.

## 설정

Claude Desktop 설정 파일에 다음을 추가하세요:
`~/Library/Application\ Support/Claude/claude_desktop_config.json`

```json
{
    "mcpServers": {
        "illustrator": {
            "command": "uv",
            "args": [
                "--directory",
                "/Users/you/code/mcp/illustrator-mcp-server",
                "run",
                "illustrator"
            ]
        }
    }
}
```