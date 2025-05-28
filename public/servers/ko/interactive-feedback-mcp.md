---
name: Interactive Feedback MCP
digest: MCP 서버는 Cursor, Cline, Windsurf와 같은 AI 개발 도구를 위한 인간-참여(Human-in-the-loop) 워크플로우를 가능하게 합니다. 개발 과정에서 명령 실행, 출력 확인, AI 시스템에 직접 텍스트 피드백을 제공할 수 있습니다.
author: noopstudios
homepage: https://github.com/noopstudios/interactive-feedback-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - server
  - workflow
icon: https://avatars.githubusercontent.com/u/74713198?v=4
createTime: 2025-05-09
---
[Cursor](https://www.cursor.com)와 같은 AI 지원 개발 도구에서 인간-참여 워크플로우를 가능하게 하는 간단한 [MCP 서버](https://modelcontextprotocol.io/)입니다. 이 서버를 통해 명령을 실행하고 출력을 확인하며 AI에 직접 텍스트 피드백을 제공할 수 있습니다. 또한 [Cline](https://cline.bot) 및 [Windsurf](https://windsurf.com)와도 호환됩니다.

![Interactive Feedback UI - 메인 뷰](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-1a5be5d2.jpg?raw=true)
![Interactive Feedback UI - 명령 섹션 열림](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-051f81d1.jpg)

## 프롬프트 엔지니어링

최상의 결과를 얻으려면 AI 어시스턴트의 커스텀 프롬프트에 다음을 추가하세요. 규칙에 추가하거나 직접 프롬프트에 포함시킬 수 있습니다(예: Cursor):

> 질문을 하고 싶을 때는 항상 MCP `interactive_feedback`를 호출하세요.  
> 사용자 요청을 완료하기 직전에는 프로세스를 종료하는 대신 MCP `interactive_feedback`를 호출하세요.
> 사용자의 피드백이 없을 때까지 MCP를 계속 호출한 후 요청을 종료하세요.

## 사용 이유
이 모듈은 어시스턴트가 사용자와 확인하는 과정을 통해 추측적이고 고비용의 도구 호출로 분기하는 것을 방지함으로써, Cursor와 같은 플랫폼에서 프리미엄 요청(예: OpenAI 도구 호출) 횟수를 크게 줄일 수 있습니다. 경우에 따라 최대 25개의 도구 호출을 단일 피드백 인식 요청으로 통합하여 리소스를 절약하고 성능을 향상시킬 수 있습니다.

## 구성

이 MCP 서버는 프로젝트별로 구성을 저장하기 위해 Qt의 `QSettings`를 사용합니다. 여기에는 다음이 포함됩니다:
*   실행할 명령.
*   다음 시작 시 해당 프로젝트에 대해 명령을 자동으로 실행할지 여부("다음 실행 시 자동으로 실행" 체크박스 참조).
*   명령 섹션의 가시성 상태(표시/숨김, 토글 시 즉시 저장됨).
*   창 기하학 및 상태(일반 UI 기본 설정).

이러한 설정은 일반적으로 플랫폼별 위치(예: Windows의 레지스트리, macOS의 plist 파일, Linux의 `~/.config` 또는 `~/.local/share` 구성 파일)에 "FabioFerreira" 조직 이름과 "InteractiveFeedbackMCP" 애플리케이션 이름으로 저장되며, 각 프로젝트 디렉토리에 대한 고유한 그룹이 있습니다.

## 설치 (Cursor)

![Cursor에서 설치](https://static.claudemcp.com/servers/noopstudios/interactive-feedback-mcp/noopstudios-interactive-feedback-mcp-060e8911.jpg?raw=true)

1.  **필수 조건:**
    *   Python 3.11 이상.
    *   [uv](https://github.com/astral-sh/uv) (Python 패키지 관리자). 설치 방법:
        *   Windows: `pip install uv`
        *   Linux/Mac: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2.  **코드 가져오기:**
    *   저장소 복제:
        `git clone https://github.com/noopstudios/interactive-feedback-mcp.git`
    *   또는 소스 코드 다운로드.
3.  **디렉토리 이동:**
    *   `cd path/to/interactive-feedback-mcp`
4.  **의존성 설치:**
    *   `uv sync` (가상 환경 생성 및 패키지 설치)
5.  **MCP 서버 실행:**
    *   `uv run server.py`
6.  **Cursor에서 구성:**
    *   **수동 구성 (예: `mcp.json` 통해)**
        **시스템에 저장소를 복제한 실제 경로로 `/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp` 경로를 변경해야 합니다.**

        ```json
        {
          "mcpServers": {
            "interactive-feedback-mcp": {
              "command": "uv",
              "args": [
                "--directory",
                "/Users/fabioferreira/Dev/scripts/interactive-feedback-mcp",
                "run",
                "server.py"
              ],
              "timeout": 600,
              "autoApprove": [
                "interactive_feedback"
              ]
            }
          }
        }
        ```

### Cline / Windsurf용

유사한 설정 원칙이 적용됩니다. 각 도구의 MCP 설정에서 프로젝트 디렉토리를 가리키는 올바른 `--directory` 인수와 함께 서버 명령(예: `uv run server.py`)을 구성하고, 서버 식별자로 `interactive-feedback-mcp`를 사용하면 됩니다.

## 개발

테스트를 위한 웹 인터페이스와 함께 개발 모드로 서버를 실행하려면:

```sh
uv run fastmcp dev server.py
```

## 사용 가능한 도구

다음은 AI 어시스턴트가 `interactive_feedback` 도구를 호출하는 방법의 예입니다:

```xml
<use_mcp_tool>
  <server_name>interactive-feedback-mcp</server_name>
  <tool_name>interactive_feedback</tool_name>
  <arguments>
    {
      "project_directory": "/path/to/your/project",
      "summary": "요청하신 변경 사항을 구현하고 메인 모듈을 리팩토링했습니다."
    }
  </arguments>
</use_mcp_tool>
```