---
name: Blender MCP
digest: 통해 대형 언어 모델과 연결되어 Blender와 직접 상호작용하고 제어할 수 있게 해주는 Blender MCP 서버
author: ahujasid
repository: https://github.com/ahujasid/blender-mcp
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - blender
  - 3D
icon: https://avatars.githubusercontent.com/u/11807284?s=48&v=4
createTime: 2025-04-07
featured: true
---

[Blender MCP](https://github.com/ahujasid/blender-mcp)는 Model Context Protocol(MCP)을 통해 대형 언어 모델과 연결되어 Blender와 직접 상호작용하고 제어할 수 있게 해주는 Blender MCP 서버입니다. 이 통합을 통해 프롬프트를 이용한 3D 모델링 보조, 장면 생성 및 조작이 가능해집니다. 특히 워크플로우를 간소화하고자 하는 초보자와 전문가 모두에게 적합합니다.

[Blender](https://www.blender.org/)는 3D 모델링 소프트웨어로, 3D 모델 생성은 물론 2D 그래픽 및 애니메이션 제작에도 사용할 수 있습니다.

![Blender](https://static.claudemcp.com/images/blender.png)

## 설치 및 설정

Blender MCP는 Python으로 개발된 오픈소스 프로젝트로, Python 3.10 이상이 로컬에 설치되어 있어야 합니다. 또한 Blender 3.0 이상 버전도 필수입니다.

다음으로 `uv` 패키지 관리자를 설치해야 합니다. 이는 Rust로 개발된 고성능 Python 패키지 관리자입니다.

**Mac**

```bash
brew install uv
```

**Windows**

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

환경 변수도 설정해야 합니다:

```bash
set Path=C:\Users\nntra\.local\bin;%Path%
```

**Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

수동 설치를 원할 경우 [Install uv](https://docs.astral.sh/uv/getting-started/installation/)를 참조하세요.

설치가 완료되면 Claude MCP 클라이언트에서 Blender MCP 서버를 활성화할 수 있습니다.

:::adsense 8781986491:::

**Claude for Desktop**

`Claude for Desktop`의 경우 클라이언트를 열고 `Settings` > `Developer` > `Edit Config` > `claude_desktop_config.json` 파일에 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

설정 후 잠시 기다리면 `Claude for Desktop`의 왼쪽 툴바에 망치 아이콘이 나타납니다. 클릭하면 Blender MCP 도구를 확인할 수 있습니다.

![Blender MCP On Claude Desktop](https://static.claudemcp.com/images/blender-mcp-on-claude-desktop.png)

**Cursor**

Cursor의 경우 `Cursor Settings` > `MCP` > `+ Add new global MCP server`를 열고 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

특정 프로젝트에서만 적용하려면 프로젝트 루트 디렉토리의 `.cursor/mcp.json` 파일에 위 구성을 추가합니다.

> ⚠️ 참고: 여러 MCP 서버가 활성화된 경우 Cursor의 도구 목록이 많아져 Token이 부족할 수 있습니다. 현재 Cursor는 상위 40개 도구만 LLM에 전송하므로 테스트 시 Blender MCP 서버만 활성화하는 것이 좋습니다.

설정 완료 후 Cursor 설정 페이지의 MCP 탭에서 방금 추가한 Blender MCP 서버를 확인할 수 있습니다(활성화 필수).

![Blender MCP On Cursor](https://static.claudemcp.com/images/blender-mcp-on-cursor.png)

## 사용 방법

Blender MCP 서버 설정 외에도 Blender에 플러그인을 설치해야 합니다. Blender MCP GitHub 저장소에서 `addon.py` 파일을 다운로드합니다: [https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py](https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py). 로컬에 저장한 후 Blender를 열고 `Edit` > `Preferences` > `Add-ons`로 이동해 `Install from Disk...` 버튼을 클릭, 다운로드한 `addon.py` 파일을 선택합니다.

![Blender install addon](https://static.claudemcp.com/images/blender-install-addon.png)

정상 사용을 위해 `Blender MCP` 옵션을 체크해야 합니다.

![Blender enable addon](https://static.claudemcp.com/images/blender-enable-addon.png)

Blender로 돌아가 3D 뷰 사이드바(`N` 키로 표시 가능)에서 `BlenderMCP` 탭을 찾아 `Poly Haven`(선택 사항)을 체크하고 `Connect to MCP server` 버튼을 클릭합니다.

![Blender MCP Addon Connect](https://static.claudemcp.com/images/blender-mcp-addon-connect.png)

이제 모든 준비가 완료되었습니다. Claude Desktop이나 Cursor에서 명령을 입력해 Blender를 제어할 수 있습니다. 현재 지원하는 기능은 다음과 같습니다:

- 장면 및 객체 정보 가져오기
- 도형 생성, 삭제 및 수정
- 객체 재질 적용 또는 생성
- Blender 내 임의 Python 코드 실행
- [Poly Haven](https://polyhaven.com/)에서 모델, 에셋 및 HDRIs 다운로드
- [Hyper3D Rodin](https://hyper3d.ai/)을 통한 3D 모델 생성([hyper3d.ai](https://hyper3d.ai/) 또는 [fal.ai](https://fal.ai/)에서 전체 키 획득 가능)

예를 들어 Cursor에 다음과 같은 프롬프트를 입력해 Blender가 해변 장면을 생성하도록 할 수 있습니다:

```
Create a beach vibe in blender scene. Let there be:

* Sky HDRI image
* some nice sandy ground
* some rocks and shrubbery in the scene
* any other props you can think of to make it look like a beach
```

그러면 Blender가 자동으로 장면을 생성하기 시작하는 것을 볼 수 있습니다.

:::youtube 0SuVIfLoUnA:::

또한 [Hyper3D Rodin](https://hyper3d.ai/)을 통해 3D 모델을 생성할 수도 있습니다. [Hyper3D Rodin](https://hyper3d.ai/)에 계정을 등록하고 키를 획득한 후 Blender 플러그인에 설정하면 Cursor에서 프롬프트를 입력해 3D 모델을 생성할 수 있습니다.

## 문제 해결

일반적인 문제는 다음과 같습니다:

- **연결 문제**: 플러그인 서버가 실행 중인지, MCP 설정이 올바른지 확인하세요. 첫 명령은 실패할 수 있으므로 재시도가 필요할 수 있습니다.
- **타임아웃 오류**: 요청을 단순화하거나 단계별로 작업하세요.
- **Poly Haven 문제**: 불안정할 수 있으므로 재시도하거나 상태를 확인하세요.
- **일반 문제**: Claude와 Blender 서버를 재시작하세요.

## 결론

Blender MCP 프로젝트는 AI 보조 3D 모델링의 가능성을 보여줍니다. MCP 표준 프로토콜을 통해 복잡한 작업을 단순화하고 효율성을 높였습니다. MCP의 보급으로 앞으로 더 많은 소프트웨어가 AI와 통합되어 창의적인 도구의 가능성을 더욱 확장할 것으로 기대됩니다.
