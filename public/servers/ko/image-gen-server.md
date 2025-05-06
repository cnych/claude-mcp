---
name: Image-Gen-Server
digest: Image-Gen-Server는 텍스트 프롬프트에서 고품질 시각 자료를 생성하는 강력한 이미지 생성 도구입니다. 빠른 처리, 사용자 정의 가능한 출력, 다양한 스타일 지원으로 다양한 창의적 요구를 충족시킵니다. 효율적인 시각 콘텐츠 제작을 원하는 디자이너, 마케터, 콘텐츠 크리에이터에게 이상적인 서비스입니다.
author: fengin
homepage: https://github.com/fengin/image-gen-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - image
  - ide
icon: https://avatars.githubusercontent.com/u/49424247?v=4
createTime: 2025-02-07
---
![Image-Gen-Server 로고](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-167510b5.png)

지멍AI 기반의 이미지 생성 서비스로, Cursor IDE와의 통합을 위해 특별히 설계되었습니다. Cursor에서의 텍스트 설명을 받아 해당 이미지를 생성하며, 이미지 다운로드 및 저장 기능을 제공합니다.

![예시](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-12f05bd3.png)

## 기능

- Cursor IDE와 완벽한 통합
- 텍스트-이미지 생성 지원
- 생성된 이미지 자동 저장
- 사용자 정의 저장 경로 지원
- 한 번에 네 장의 이미지 생성으로 더 많은 선택지 제공

## 설치

1. 환경 준비
- python 3.10+
- npm 설치
- nodejs 설치(v20에서 검증됨)
- pip install uv 실행
- 디버깅 시 필요: npm install -g @modelcontextprotocol/inspector@0.4.0

2. 프로젝트 클론
   
   ```bash
   git clone https://github.com/fengin/image-gen-server.git
   cd image-gen-server
   ```

3. 의존성 설치
   
   ```bash
   pip install -r requirements.txt
   pip install uv
   ```

4. 지멍 토큰 및 이미지 기본 저장 위치 설정
   server.py 파일 내 다음 설정 수정
   
   ```bash
   # API 설정
   JIMENG_API_TOKEN = "057f7addf85dxxxxxxxxxxxxx" # 지멍 로그인 시 얻은 session_id, 여러 개 지원(쉼표로 구분)   
   IMG_SAVA_FOLDER = "D:/code/image-gen-server/images" # 이미지 기본 저장 경로
   ```

## Cursor 통합

![Cursor 설정](https://static.claudemcp.com/servers/fengin/image-gen-server/fengin-image-gen-server-fa725511.png)

1. Cursor 설정 열기
   
   - 왼쪽 하단 설정 아이콘 클릭
   - Features > MCP Servers 선택
   - "Add new MCP server" 클릭

2. 서버 구성 입력
   
   - Name: `image-gen-server`(또는 원하는 이름)
   - Type: `command`
   - Command: 
     
     ```bash
     uv run --with fastmcp fastmcp run D:\code\image-gen-service\server.py
     ```
     
     참고: 실제 프로젝트 경로로 변경
     
     - Windows 예시: ` uv run --with fastmcp fastmcp run D:/code/image-gen-service/server.py`
     - macOS/Linux 예시: ` uv run --with fastmcp fastmcp run /Users/username/code/image-gen-server/server.py`

## 사용 방법

Cursor에서 이미지 생성을 원할 경우, 에이전트 모드에서 이미지 도구 사용법을 확인하도록 지시한 후 원하는 이미지 생성 요청과 저장 위치를 지정하면 됩니다.

## 지멍 토큰 획득

1. [지멍](https://jimeng.jianying.com/) 방문
2. 계정 로그인
3. F12로 개발자 도구 열기
4. Application > Cookies에서 `sessionid` 찾기
5. 찾은 sessionid를 server.py의 JIMENG_API_TOKEN에 설정

## 도구 함수 설명

### generate_image

```python
async def generate_image(prompt: str, file_name: str, save_folder: str = None, sample_strength: float = 0.5, width: int = 1024, height: int = 1024) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """텍스트 설명으로 이미지 생성

    Args:
        prompt: 이미지 텍스트 프롬프트 설명
        file_name: 생성할 이미지 파일명(경로 제외, 확장자 없으면 기본 .jpg 사용)
        save_folder: 이미지 저장 절대 경로 디렉토리(선택사항, 기본 IMG_SAVA_FOLDER 사용)
        sample_strength: 이미지 생성 정밀도(선택사항, 범위 0-1, 기본 0.5)
        width: 생성할 이미지 너비(선택사항, 기본 1024)
        height: 생성할 이미지 높이(선택사항, 기본 1024)

    Returns:
        List: 생성 결과를 포함한 JSON 문자열
    """
```

### 기술 구현

1. server.py는 fastmcp를 사용해 mcp 서버 기능을 구현하여 cursor/claude에 제공합니다.

2. sever.py는 proxy.jimeng 모듈을 통해 지멍AI와 역방향 상호작용을 합니다.
proxy.jimeng 역방향 모듈은 별도로 설치 사용 가능하며, 주요 기능은 다음과 같습니다:

- 이미지 생성(generate_images)
- 동기화 대화 완성(create_completion)
- 스트리밍 대화 완성(create_completion_stream)
- 다중 계정 토큰 지원
- 완전한 오류 처리

### 사용 예시

```cmd
# cursor 에이전트 모드에서
#예시 1
제공된 프로젝트 요구사항에 따라 프로젝트 디렉토리 images 아래에 제품 로고를 생성해 주세요.

#예시 2
프로젝트 요구사항에 따라 웹사이트 홈페이지를 제작해 주세요. 헤더에 배너 이미지가 필요합니다.
```

## 라이선스

MIT License 
작성자: 봉림

## 문제 해결

1. 구성 후 검은 창이 나타났다가 빠르게 사라지고 도구 상태가 No tools found로 변경됨

   원인: 정상적으로 시작되지 않음, 일반적으로 다음과 같은 이유

- 구성 명령이 잘못됨, 명령이 정확한지 확인, 일반적으로 server.py 경로가 잘못되었거나 경로에 한글이 포함되거나 슬래시 방향이 잘못됨
- 필요한 환경이 준비되지 않음
- 실행할 터미널이 맞지 않음

2. 정상 실행 후 호출 로그 확인 또는 디버깅 방법

  명령을 다음과 같이 변경:

```
uv run --with fastmcp fastmcp dev D:/code/image-gen-service/server.py
```

  즉 마지막 run을 dev로 변경.

  또는 터미널에서 다음 명령 실행하여 디버그 모드 진입:

```
fastmcp dev D:/code/image-gen-service/server.py
```