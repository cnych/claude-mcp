---
name: browser-use-mcp-server
digest: MCP 서버는 AI 에이전트가 browser-use 도구를 통해 웹 브라우저를 제어할 수 있게 하여 자동화된 웹 상호작용과 작업을 가능하게 합니다. AI가 웹 페이지를 효율적으로 탐색, 조작 및 데이터를 추출할 수 있는 원활한 인터페이스를 제공합니다.
author: co-browser
repository: https://github.com/co-browser/browser-use-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - browser
  - automation
  - browser-use
icon: https://github.com/user-attachments/assets/45bc5bee-418d-4182-94f5-db84b4fc0b3a
createTime: 2025-03-06
featured: true
---

AI 에이전트가 [browser-use](https://github.com/browser-use/browser-use)를 사용하여 웹 브라우저를 제어할 수 있는 MCP 서버입니다.

## 필수 조건

- [uv](https://github.com/astral-sh/uv) - 빠른 Python 패키지 관리자
- [Playwright](https://playwright.dev/) - 브라우저 자동화
- [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy) - stdio 모드에 필요

```bash
# 필수 조건 설치
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install mcp-proxy
uv tool update-shell
```

## 환경 설정

`.env` 파일 생성:

```bash
OPENAI_API_KEY=your-api-key
CHROME_PATH=optional/path/to/chrome
PATIENT=false  # API 호출이 작업 완료를 기다려야 할 경우 true로 설정
```

## 설치

```bash
# 의존성 설치
uv sync
uv pip install playwright
uv run playwright install --with-deps --no-shell chromium
```

## 사용 방법

### SSE 모드

```bash
# 소스에서 직접 실행
uv run server --port 8000
```

### stdio 모드

```bash
# 1. 빌드 및 전역 설치
uv build
uv tool uninstall browser-use-mcp-server 2>/dev/null || true
uv tool install dist/browser_use_mcp_server-*.whl

# 2. stdio 전송으로 실행
browser-use-mcp-server run server --port 8000 --stdio --proxy-port 9000
```

## 클라이언트 구성

### SSE 모드 클라이언트 구성

```json
{
  "mcpServers": {
    "browser-use-mcp-server": {
      "url": "http://localhost:8000/sse"
    }
  }
}
```

### stdio 모드 클라이언트 구성

```json
{
  "mcpServers": {
    "browser-server": {
      "command": "browser-use-mcp-server",
      "args": [
        "run",
        "server",
        "--port",
        "8000",
        "--stdio",
        "--proxy-port",
        "9000"
      ],
      "env": {
        "OPENAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 구성 파일 위치

| 클라이언트       | 구성 경로                                                         |
| ---------------- | ----------------------------------------------------------------- |
| Cursor           | `./.cursor/mcp.json`                                              |
| Windsurf         | `~/.codeium/windsurf/mcp_config.json`                             |
| Claude (Mac)     | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude (Windows) | `%APPDATA%\Claude\claude_desktop_config.json`                     |

## 기능

- [x] **브라우저 자동화**: AI 에이전트를 통해 브라우저 제어
- [x] **이중 전송**: SSE 및 stdio 프로토콜 지원
- [x] **VNC 스트리밍**: 브라우저 자동화 실시간 시청
- [x] **비동기 작업**: 브라우저 작업 비동기 실행

## 로컬 개발

패키지를 로컬에서 개발하고 테스트하려면:

1. 배포 가능한 wheel 빌드:

   ```bash
   # 프로젝트 루트 디렉터리에서
   uv build
   ```

2. 전역 도구로 설치:

   ```bash
   uv tool uninstall browser-use-mcp-server 2>/dev/null || true
   uv tool install dist/browser_use_mcp_server-*.whl
   ```

3. 모든 디렉터리에서 실행:

   ```bash
   # 현재 세션에 OpenAI API 키 설정
   export OPENAI_API_KEY=your-api-key-here

   # 또는 일회성 실행을 위해 인라인 제공
   OPENAI_API_KEY=your-api-key-here browser-use-mcp-server run server --port 8000 --stdio --proxy-port 9000
   ```

4. 변경 후 재빌드 및 재설치:
   ```bash
   uv build
   uv tool uninstall browser-use-mcp-server
   uv tool install dist/browser_use_mcp_server-*.whl
   ```

## Docker

Docker를 사용하면 서버 실행을 위한 일관되고 격리된 환경을 제공합니다.

```bash
# Docker 이미지 빌드
docker build -t browser-use-mcp-server .

# 기본 VNC 비밀번호("browser-use")로 컨테이너 실행
# --rm은 컨테이너가 중지될 때 자동으로 제거되도록 합니다
# -p 8000:8000은 서버 포트를 매핑합니다
# -p 5900:5900은 VNC 포트를 매핑합니다
docker run --rm -p8000:8000 -p5900:5900 browser-use-mcp-server

# 파일에서 읽은 사용자 정의 VNC 비밀번호로 실행
# 파일(예: vnc_password.txt) 생성하고 원하는 비밀번호만 포함
echo "your-secure-password" > vnc_password.txt
# 비밀번호 파일을 컨테이너 내부의 시크릿으로 마운트
docker run --rm -p8000:8000 -p5900:5900 \
  -v $(pwd)/vnc_password.txt:/run/secrets/vnc_password:ro \
  browser-use-mcp-server
```

### VNC 뷰어

```bash
# 브라우저 기반 뷰어
git clone https://github.com/novnc/noVNC
cd noVNC
./utils/novnc_proxy --vnc localhost:5900
```

기본 비밀번호: `browser-use` (사용자 정의 비밀번호 방법으로 재정의하지 않는 한)

![VNC 스크린샷](https://github.com/user-attachments/assets/45bc5bee-418d-4182-94f5-db84b4fc0b3a)

![VNC 스크린샷](https://github.com/user-attachments/assets/7db53f41-fc00-4e48-8892-f7108096f9c4)

## 예시

AI에게 다음과 같이 요청해 보세요:

```text
https://news.ycombinator.com을 열고 상위 랭크 기사를 반환하세요
```
