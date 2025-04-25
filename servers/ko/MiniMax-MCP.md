---
name: MiniMax MCP
digest: 강력한 텍스트 음성 변환(TTS) 및 비디오/이미지 생성 API와 상호 작용할 수 있는 공식 MiniMax MCP 서버. Claude Desktop, Cursor, Windsurf, OpenAI Agents 등의 MCP 클라이언트에서 음성 생성, 목소리 복제, 비디오 생성, 이미지 생성 등의 기능을 사용할 수 있습니다.
author: MiniMax-AI
repository: https://github.com/MiniMax-AI/MiniMax-MCP
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - MiniMax
  - 음성 생성
  - 목소리 복제
  - 이미지 생성
  - 비디오 생성
icon: https://avatars.githubusercontent.com/u/194880281?v=4
createTime: 2025-04-10
---

![MiniMax Logo](/images/MiniMaxLogo-Light.png)

강력한 텍스트 음성 변환(TTS) 및 비디오/이미지 생성 API와 상호 작용할 수 있는 공식 MiniMax Model Context Protocol (MCP) 서버입니다. 이 서버를 통해 Claude Desktop, Cursor, Windsurf, OpenAI Agents 등의 MCP 클라이언트에서 음성 생성, 목소리 복제, 비디오 생성, 이미지 생성 등을 수행할 수 있습니다.

## MCP 클라이언트 빠른 시작

- 1. [MiniMax](https://www.minimax.io/platform/user-center/basic-information/interface-key)에서 API 키를 발급받으세요.
- 2. Python 패키지 관리자인 `uv`를 설치하세요. `curl -LsSf https://astral.sh/uv/install.sh | sh` 명령어로 설치하거나 `uv` [저장소](https://github.com/astral-sh/uv)에서 추가 설치 방법을 확인하세요.
- 3. **중요**: API 호스트와 키는 지역별로 다르며 반드시 일치해야 합니다. 그렇지 않으면 `Invalid API key` 오류가 발생합니다.

| 지역             | 글로벌                                                                                                 | 중국 본토                                                                                     |
| :--------------- | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| MINIMAX_API_KEY  | [MiniMax Global](https://www.minimax.io/platform/user-center/basic-information/interface-key)에서 발급 | [MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key)에서 발급 |
| MINIMAX_API_HOST | ​https://api.minimaxi.chat (추가 **"i"** 주의)                                                         | ​https://api.minimax.chat                                                                     |

### Claude Desktop

`Claude > 설정 > 개발자 > 설정 편집 > claude_desktop_config.json`로 이동하여 다음 내용을 추가하세요:

```
{
  "mcpServers": {
    "MiniMax": {
      "command": "uvx",
      "args": [
        "minimax-mcp"
      ],
      "env": {
        "MINIMAX_API_KEY": "여기에-API-키-입력",
        "MINIMAX_MCP_BASE_PATH": "로컬 출력 디렉토리 경로, 예: /User/xxx/Desktop",
        "MINIMAX_API_HOST": "API 호스트, ​https://api.minimaxi.chat|https://api.minimax.chat",
        "MINIMAX_API_RESOURCE_MODE": "선택 사항, [url|local], 기본값은 url, 오디오/이미지/비디오를 로컬에 다운로드하거나 URL 형식으로 제공"
      }
    }
  }
}
```

⚠️ 경고: API 키는 호스트와 일치해야 합니다. "API Error: invalid api key" 오류가 발생하면 API 호스트를 확인하세요:

- 글로벌 호스트: `​https://api.minimaxi.chat` (추가 "i" 주의)
- 중국 본토 호스트: ​`https://api.minimax.chat`

Windows를 사용하는 경우 Claude Desktop에서 MCP 서버를 사용하려면 "개발자 모드"를 활성화해야 합니다. 왼쪽 상단의 햄버거 메뉴에서 "도움말"을 클릭하고 "개발자 모드 활성화"를 선택하세요.

### Cursor

`Cursor -> 환경 설정 -> Cursor 설정 -> MCP -> 새로운 글로벌 MCP 서버 추가`로 이동하여 위 설정을 추가하세요.

## 전송 방식

stdio와 sse 두 가지 전송 유형을 지원합니다.
| stdio | SSE |
|:-----|:-----|
| 로컬에서 실행 | 로컬 또는 클라우드에 배포 가능 |
| `stdout`을 통한 통신 | 네트워크를 통한 통신 |
| 입력: `로컬 파일` 또는 유효한 `URL` 리소스 처리 지원 | 입력: 클라우드에 배포 시 `URL` 사용 권장 |

## 사용 가능한 도구

| 도구             | 설명                                      |
| ---------------- | ----------------------------------------- |
| `text_to_audio`  | 주어진 목소리로 텍스트를 음성으로 변환    |
| `list_voices`    | 사용 가능한 모든 목소리 목록 표시         |
| `voice_clone`    | 제공된 오디오 파일을 사용하여 목소리 복제 |
| `generate_video` | 프롬프트에서 비디오 생성                  |
| `text_to_image`  | 프롬프트에서 이미지 생성                  |

## FAQ

### 1. 잘못된 API 키

API 키와 API 호스트가 지역적으로 일치하는지 확인하세요
|지역| 글로벌 | 중국 본토 |
|:--|:-----|:-----|
|MINIMAX_API_KEY| [MiniMax Global](https://www.minimax.io/platform/user-center/basic-information/interface-key)에서 발급 | [MiniMax](https://platform.minimaxi.com/user-center/basic-information/interface-key)에서 발급 |
|MINIMAX_API_HOST| ​https://api.minimaxi.chat (추가 **"i"** 주의) | ​https://api.minimax.chat |

### 2. spawn uvx ENOENT

터미널에서 다음 명령어를 실행하여 절대 경로를 확인하세요:

```sh
which uvx
```

절대 경로(예: /usr/local/bin/uvx)를 얻은 후 설정을 해당 경로(예: "command": "/usr/local/bin/uvx")로 업데이트하세요.

## 사용 예시

⚠️ 경고: 이 도구들을 사용하면 비용이 발생할 수 있습니다.

### 1. 저녁 뉴스 세그먼트 방송

![저녁 뉴스 세그먼트 방송](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-268624ab.jpg)

### 2. 목소리 복제

![목소리 복제](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-6362babc.jpg)

### 3. 비디오 생성

![비디오 생성](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-ebf0c2e1.jpg)
![비디오 생성](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-47236af8.jpg)

### 4. 이미지 생성

![이미지 생성](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-0730dc0a.jpg)
![이미지 생성](https://static.claudemcp.com/servers/MiniMax-AI/MiniMax-MCP/MiniMax-AI-MiniMax-MCP-f0acd0d5.jpg)
