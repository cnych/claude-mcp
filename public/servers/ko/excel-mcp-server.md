---
name: Excel MCP Server
digest: 모델 컨텍스트 프로토콜 (MCP) 서버는 Microsoft Excel 설치 없이도 AI 에이전트가 Excel 파일을 생성, 읽기 및 수정할 수 있도록 하여 원활한 스프레드시트 조작 기능을 제공합니다.
author: haris-musa
homepage: https://github.com/haris-musa/excel-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 엑셀
  - 서버
  - 파이썬
icon: https://avatars.githubusercontent.com/u/79357181?v=4
createTime: 2025-02-12
---

Microsoft Excel 설치 없이 Excel 파일을 조작할 수 있는 [Model Context Protocol (MCP)](/ko) 서버입니다. AI 에이전트로 Excel 통합 문서를 생성, 읽기 및 수정할 수 있습니다.

## 기능

- 📊 Excel 통합 문서 생성 및 수정
- 📝 데이터 읽기 및 쓰기
- 🎨 서식 및 스타일 적용
- 📈 차트 및 시각화 생성
- 📊 피벗 테이블 생성
- 🔄 워크시트 및 범위 관리

## 빠른 시작

### 필수 조건

- Python 3.10 이상

### 설치

1. 저장소 복제:

```bash
git clone https://github.com/haris-musa/excel-mcp-server.git
cd excel-mcp-server
```

2. uv를 사용하여 설치:

```bash
uv pip install -e .
```

### 서버 실행

서버 시작 (기본 포트 8000):

```bash
uv run excel-mcp-server
```

사용자 정의 포트 (예: 8080):

```bash
# Bash/Linux/macOS
export FASTMCP_PORT=8080 && uv run excel-mcp-server

# Windows PowerShell
$env:FASTMCP_PORT = "8080"; uv run excel-mcp-server
```

## AI 도구와 함께 사용

### Cursor IDE

1. Cursor에 이 구성을 추가:

```json
{
  "mcpServers": {
    "excel": {
      "url": "http://localhost:8000/sse",
      "env": {
        "EXCEL_FILES_PATH": "/path/to/excel/files"
      }
    }
  }
}
```

2. Excel 도구가 AI 어시스턴트를 통해 사용 가능해집니다.

### 원격 호스팅 및 전송 프로토콜

이 서버는 Server-Sent Events (SSE) 전송 프로토콜을 사용합니다. 다양한 사용 사례:

1. **Claude Desktop과 함께 사용 (stdio 필요):**

   - [Supergateway](https://github.com/supercorp-ai/supergateway)를 사용하여 SSE를 stdio로 변환

2. **MCP 서버 호스팅:**
   - [원격 MCP 서버 가이드](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)

## 환경 변수

- `FASTMCP_PORT`: 서버 포트 (기본값: 8000)
- `EXCEL_FILES_PATH`: Excel 파일 디렉토리 (기본값: `./excel_files`)

## 라이선스

MIT 라이선스.
