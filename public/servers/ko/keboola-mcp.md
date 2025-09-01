---
name: Keboola MCP Server
digest: Keboola 환경에서 Model Context Protocol을 통해 데이터 처리를 위한 상호 작용
author: Keboola
repository: https://github.com/keboola/keboola-mcp-server
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 데이터 처리
  - 비즈니스 인텔리전스
  - ETL
  - 자동화
icon: https://avatars.githubusercontent.com/u/1424387?s=200&v=4
createTime: 2025-08-21
---

> AI 에이전트, MCP 클라이언트(**Cursor**, **Claude**, **Windsurf**, **VS Code** ...)와 다른 AI 어시스턴트를 Keboola에 연결하세요. 데이터, 변환, SQL 쿼리, 작업 트리거를 노출하고—접착 코드 없이. 에이전트가 필요할 때 필요한 곳에서 올바른 데이터를 제공합니다.

## 개요

Keboola MCP Server는 Keboola 프로젝트와 현대 AI 도구 사이의 오픈소스 브릿지입니다. 스토리지 액세스, SQL 변환, 작업 트리거와 같은 Keboola 기능을 Claude, Cursor, CrewAI, LangChain, Amazon Q 등을 위한 호출 가능한 도구로 전환합니다.

## 🚀 빠른 시작: 원격 MCP 서버 (가장 쉬운 방법)

Keboola MCP Server를 사용하는 가장 쉬운 방법은 **원격 MCP 서버**를 통하는 것입니다. 이 호스팅된 솔루션은 로컬 설정, 구성 또는 설치가 필요 없습니다.

### 원격 MCP 서버란?

우리의 원격 서버는 모든 멀티 테넌트 Keboola 스택에서 호스팅되며 OAuth 인증을 지원합니다. 원격 SSE 연결과 OAuth 인증을 지원하는 모든 AI 어시스턴트에서 연결할 수 있습니다.

### 연결 방법

1. **원격 서버 URL 가져오기**: Keboola 프로젝트 설정 → `MCP Server` 탭으로 이동
2. **서버 URL 복사**: `https://mcp.<YOUR_REGION>.keboola.com/sse`와 같은 형태입니다
3. **AI 어시스턴트 구성**: AI 어시스턴트의 MCP 설정에 URL을 붙여넣기
4. **인증**: Keboola 계정으로 인증하고 프로젝트를 선택하라는 메시지가 표시됩니다

### 지원되는 클라이언트

- **[Cursor](https://cursor.com)**: 프로젝트의 MCP Server 설정에서 "Install In Cursor" 버튼 사용하거나 이 버튼을 클릭
- **[Claude Desktop](https://claude.ai)**: 설정 → 통합을 통해 통합 추가
- **[Windsurf](https://windsurf.ai)**: 원격 서버 URL로 구성
- **[Make](https://make.com)**: 원격 서버 URL로 구성
- **기타 MCP 클라이언트**: 원격 서버 URL로 구성

자세한 설정 지침 및 지역별 URL은 [원격 서버 설정 문서](https://help.keboola.com/ai/mcp-server/#remote-server-setup)를 참조하세요.

---

## 기능

- **스토리지**: 테이블을 직접 쿼리하고 테이블 또는 버킷 설명을 관리
- **구성 요소**: 추출기, 작성기, 데이터 앱 및 변환 구성을 생성, 나열 및 검사
- **SQL**: 자연어로 SQL 변환 생성
- **작업**: 구성 요소 및 변환을 실행하고 작업 실행 세부 정보를 검색
- **메타데이터**: 자연어를 사용하여 프로젝트 문서 및 객체 메타데이터를 검색, 읽기 및 업데이트

## 준비 사항

다음을 확인하세요:

- [ ] Python 3.10+ 설치
- [ ] 관리자 권한이 있는 Keboola 프로젝트 액세스
- [ ] 선호하는 MCP 클라이언트 (Claude, Cursor 등)

**참고**: `uv`가 설치되어 있는지 확인하세요. MCP 클라이언트는 이를 사용하여 Keboola MCP Server를 자동으로 다운로드하고 실행합니다.

**uv 설치하기**:

_macOS/Linux_:

```bash
# homebrew가 설치되지 않은 경우 사용:
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Homebrew를 사용하여 설치
brew install uv
```

_Windows_:

```powershell
# 설치 스크립트 사용
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# 또는 pip 사용
pip install uv

# 또는 winget 사용
winget install --id=astral-sh.uv -e
```

더 많은 설치 옵션은 [공식 uv 문서](https://docs.astral.sh/uv/getting-started/installation/)를 참조하세요.

MCP 서버를 설정하기 전에 세 가지 주요 정보가 필요합니다:

### KBC_STORAGE_TOKEN

Keboola에 대한 인증 토큰입니다:

Storage API 토큰을 생성하고 관리하는 방법에 대한 지침은 [공식 Keboola 문서](https://help.keboola.com/management/project/tokens/)를 참조하세요.

**참고**: MCP 서버가 제한된 액세스를 갖도록 하려면 사용자 정의 스토리지 토큰을 사용하고, MCP가 프로젝트의 모든 것에 액세스하도록 하려면 마스터 토큰을 사용하세요.

### KBC_WORKSPACE_SCHEMA

이는 Keboola에서 작업 공간을 식별하며 SQL 쿼리에 사용됩니다. 그러나 이는 **마스터 토큰 대신 사용자 정의 스토리지 토큰을 사용하는 경우에만 필요**합니다:

- [마스터 토큰](https://help.keboola.com/management/project/tokens/#master-tokens) 사용 시: 작업 공간이 백그라운드에서 자동으로 생성됩니다
- [사용자 정의 스토리지 토큰](https://help.keboola.com/management/project/tokens/#limited-tokens) 사용 시: 이 [Keboola 가이드](https://help.keboola.com/tutorial/manipulate/workspace/)를 따라 KBC_WORKSPACE_SCHEMA를 가져오세요

**참고**: 작업 공간을 수동으로 생성할 때 모든 프로젝트 데이터에 대한 읽기 전용 액세스 권한 부여 옵션을 선택하세요

**참고**: KBC_WORKSPACE_SCHEMA는 BigQuery 작업 공간에서 데이터세트 이름이라고 합니다. 단순히 연결을 클릭하고 데이터세트 이름을 복사하면 됩니다

### Keboola 지역

Keboola API URL은 배포 지역에 따라 다릅니다. Keboola 프로젝트에 로그인했을 때 브라우저의 URL을 보면 지역을 확인할 수 있습니다:

| 지역            | API URL                                             |
| --------------- | --------------------------------------------------- |
| AWS 북미        | `https://connection.keboola.com`                    |
| AWS 유럽        | `https://connection.eu-central-1.keboola.com`       |
| Google Cloud EU | `https://connection.europe-west3.gcp.keboola.com`   |
| Google Cloud US | `https://connection.us-east4.gcp.keboola.com`       |
| Azure EU        | `https://connection.north-europe.azure.keboola.com` |

## Keboola MCP Server 실행

필요에 따라 Keboola MCP Server를 사용하는 네 가지 방법이 있습니다:

### 옵션 A: 통합 모드 (권장)

이 모드에서는 Claude 또는 Cursor가 자동으로 MCP 서버를 시작합니다. **터미널에서 명령을 실행할 필요가 없습니다**.

1. MCP 클라이언트 (Claude/Cursor)를 적절한 설정으로 구성
2. 클라이언트가 필요할 때 자동으로 MCP 서버를 실행합니다

#### Claude Desktop 구성

1. Claude (화면 왼쪽 상단 모서리) → 설정 → 개발자 → 구성 편집으로 이동 (claude_desktop_config.json이 보이지 않으면 생성하세요)
2. 다음 구성을 추가하세요:
3. 변경사항이 적용되도록 Claude 데스크탑을 재시작하세요

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": ["keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

구성 파일 위치:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Cursor 구성

1. 설정 → MCP로 이동
2. "+ Add new global MCP Server" 클릭
3. 다음 설정으로 구성:

```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": ["keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

**참고**: MCP 서버에는 짧고 설명적인 이름을 사용하세요. 전체 도구 이름에는 서버 이름이 포함되고 ~60자 미만으로 유지되어야 하므로 긴 이름은 Cursor에서 필터링되어 에이전트에게 표시되지 않을 수 있습니다.

#### Windows WSL용 Cursor 구성

Windows Subsystem for Linux에서 Cursor AI로 MCP 서버를 실행할 때 이 구성을 사용하세요:

```json
{
  "mcpServers": {
    "keboola": {
      "command": "wsl.exe",
      "args": [
        "bash",
        "-c '",
        "export KBC_STORAGE_API_URL=https://connection.YOUR_REGION.keboola.com &&",
        "export KBC_STORAGE_TOKEN=your_keboola_storage_token &&",
        "export KBC_WORKSPACE_SCHEMA=your_workspace_schema &&",
        "/snap/bin/uvx keboola_mcp_server",
        "'"
      ]
    }
  }
}
```

### 옵션 B: 로컬 개발 모드

MCP 서버 코드 자체를 작업하는 개발자를 위해:

1. 리포지토리를 복제하고 로컬 환경을 설정
2. 로컬 Python 경로를 사용하도록 Claude/Cursor 구성:

```json
{
  "mcpServers": {
    "keboola": {
      "command": "/absolute/path/to/.venv/bin/python",
      "args": ["-m", "keboola_mcp_server"],
      "env": {
        "KBC_STORAGE_API_URL": "https://connection.YOUR_REGION.keboola.com",
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

### 옵션 C: 수동 CLI 모드 (테스트 전용)

테스트나 디버깅을 위해 터미널에서 서버를 수동으로 실행할 수 있습니다:

```bash
# 환경 변수 설정
export KBC_STORAGE_API_URL=https://connection.YOUR_REGION.keboola.com
export KBC_STORAGE_TOKEN=your_keboola_storage_token
export KBC_WORKSPACE_SCHEMA=your_workspace_schema

uvx keboola_mcp_server --transport sse
```

> **참고**: 이 모드는 주로 디버깅이나 테스트용입니다. Claude나 Cursor와의 일반적인 사용을 위해서는 수동으로 서버를 실행할 필요가 없습니다.

> **참고**: 서버는 SSE 전송을 사용하고 들어오는 SSE 연결을 위해 `localhost:8000`에서 수신합니다. `--port`와 `--host` 매개변수를 사용하여 다른 곳에서 수신하도록 할 수 있습니다.

### 옵션 D: Docker 사용

```shell
docker pull keboola/mcp-server:latest

docker run \
  --name keboola_mcp_server \
  --rm \
  -it \
  -p 127.0.0.1:8000:8000 \
  -e KBC_STORAGE_API_URL="https://connection.YOUR_REGION.keboola.com" \
  -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
  -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
  keboola/mcp-server:latest \
  --transport sse \
  --host 0.0.0.0
```

> **참고**: 서버는 SSE 전송을 사용하고 들어오는 SSE 연결을 위해 `localhost:8000`에서 수신합니다. `-p`를 변경하여 컨테이너의 포트를 다른 곳에 매핑할 수 있습니다.

### 서버를 직접 시작해야 하나요?

| 시나리오           | 수동 실행 필요?        | 이 설정 사용              |
| ------------------ | ---------------------- | ------------------------- |
| Claude/Cursor 사용 | 아니오                 | 앱 설정에서 MCP 구성      |
| 로컬에서 MCP 개발  | 아니오 (Claude가 시작) | 구성을 python 경로로 지정 |
| CLI 수동 테스트    | 예                     | 터미널에서 실행           |
| Docker 사용        | 예                     | Docker 컨테이너 실행      |

## MCP Server 사용

MCP 클라이언트 (Claude/Cursor)가 구성되고 실행되면 Keboola 데이터를 쿼리할 수 있습니다:

### 설정 확인

모든 것이 작동하는지 확인하기 위해 간단한 쿼리로 시작할 수 있습니다:

```text
내 Keboola 프로젝트에 어떤 버킷과 테이블이 있나요?
```

### 수행할 수 있는 작업의 예

**데이터 탐색:**

- "고객 정보가 포함된 테이블은 무엇인가요?"
- "수익 상위 10명의 고객을 찾는 쿼리를 실행하세요"

**데이터 분석:**

- "지난 분기 지역별 매출 데이터를 분석하세요"
- "고객 연령과 구매 빈도 간의 상관관계를 찾으세요"

**데이터 파이프라인:**

- "고객 및 주문 테이블을 조인하는 SQL 변환을 만드세요"
- "내 Salesforce 구성 요소에 대한 데이터 추출 작업을 시작하세요"

## 호환성

### MCP 클라이언트 지원

| **MCP 클라이언트**         | **지원 상태** | **연결 방법**       |
| -------------------------- | ------------- | ------------------- |
| Claude (데스크탑 및 웹)    | ✅ 지원됨     | stdio               |
| Cursor                     | ✅ 지원됨     | stdio               |
| Windsurf, Zed, Replit      | ✅ 지원됨     | stdio               |
| Codeium, Sourcegraph       | ✅ 지원됨     | HTTP+SSE            |
| 사용자 정의 MCP 클라이언트 | ✅ 지원됨     | HTTP+SSE 또는 stdio |

## 지원되는 도구

**참고:** AI 에이전트는 새로운 도구에 자동으로 적응합니다.

| 카테고리      | 도구                        | 설명                                                              |
| ------------- | --------------------------- | ----------------------------------------------------------------- |
| **프로젝트**  | `get_project_info`          | Keboola 프로젝트에 대한 구조화된 정보 반환                        |
| **스토리지**  | `get_bucket`                | 특정 버킷에 대한 자세한 정보 가져오기                             |
|               | `get_table`                 | DB 식별자와 열을 포함하여 특정 테이블에 대한 자세한 정보 가져오기 |
|               | `list_buckets`              | 프로젝트의 모든 버킷 검색                                         |
|               | `list_tables`               | 특정 버킷의 모든 테이블 검색                                      |
|               | `update_description`        | 버킷, 테이블 또는 열의 설명 업데이트                              |
| **SQL**       | `query_data`                | 기본 데이터베이스에 대해 SELECT 쿼리 실행                         |
| **구성 요소** | `add_config_row`            | 구성 요소 구성에 대한 구성 행 생성                                |
|               | `create_config`             | 루트 구성 요소 구성 생성                                          |
|               | `create_sql_transformation` | 하나 이상의 SQL 코드 블록에서 SQL 변환 생성                       |
|               | `find_component_id`         | 자연어 쿼리와 일치하는 구성 요소 ID 찾기                          |
|               | `get_component`             | ID로 구성 요소의 세부 정보 검색                                   |
|               | `get_config`                | 특정 구성 요소/변환 구성 검색                                     |
|               | `get_config_examples`       | 구성 요소에 대한 예제 구성 검색                                   |
|               | `list_configs`              | 프로젝트의 구성을 나열하고 선택적으로 필터링                      |
|               | `list_transformations`      | 프로젝트의 변환 구성 나열                                         |
|               | `update_config`             | 루트 구성 요소 구성 업데이트                                      |
|               | `update_config_row`         | 구성 요소 구성 행 업데이트                                        |
|               | `update_sql_transformation` | 기존 SQL 변환 구성 업데이트                                       |
| **플로우**    | `create_conditional_flow`   | 조건부 플로우 생성 (`keboola.flow`)                               |
|               | `create_flow`               | 레거시 플로우 생성 (`keboola.orchestrator`)                       |
|               | `get_flow`                  | 특정 플로우 구성의 세부 정보 검색                                 |
|               | `get_flow_examples`         | 유효한 플로우 구성의 예제 검색                                    |
|               | `get_flow_schema`           | 지정된 플로우 유형에 대한 JSON 스키마 반환                        |
|               | `list_flows`                | 프로젝트의 플로우 구성 나열                                       |
|               | `update_flow`               | 기존 플로우 구성 업데이트                                         |
| **작업**      | `get_job`                   | 특정 작업에 대한 자세한 정보 검색                                 |
|               | `list_jobs`                 | 선택적 필터링, 정렬 및 페이지네이션으로 작업 나열                 |
|               | `run_job`                   | 구성 요소 또는 변환에 대한 작업 시작                              |
| **문서**      | `docs_query`                | Keboola 문서를 소스로 사용하여 질문에 답변                        |
| **기타**      | `create_oauth_url`          | 구성 요소 구성에 대한 OAuth 인증 URL 생성                         |
|               | `search`                    | 이름 접두사로 프로젝트의 항목 검색                                |

## 문제 해결

### 일반적인 문제

| 문제               | 해결책                                 |
| ------------------ | -------------------------------------- |
| **인증 오류**      | `KBC_STORAGE_TOKEN`이 유효한지 확인    |
| **작업 공간 문제** | `KBC_WORKSPACE_SCHEMA`가 올바른지 확인 |
| **연결 시간 초과** | 네트워크 연결 확인                     |

## 개발

### 설치

기본 설정:

```bash
uv sync --extra dev
```

기본 설정으로 `uv run tox`를 사용하여 테스트를 실행하고 코드 스타일을 확인할 수 있습니다.

권장 설정:

```bash
uv sync --extra dev --extra tests --extra integtests --extra codestyle
```

권장 설정으로 테스트 및 코드 스타일 확인을 위한 패키지가 설치되어 VsCode나 Cursor와 같은 IDE가 개발 중에 코드를 확인하거나 테스트를 실행할 수 있습니다.

### 통합 테스트

로컬에서 통합 테스트를 실행하려면 `uv run tox -e integtests`를 사용하세요.
참고: 다음 환경 변수를 설정해야 합니다:

- `INTEGTEST_STORAGE_API_URL`
- `INTEGTEST_STORAGE_TOKEN`
- `INTEGTEST_WORKSPACE_SCHEMA`

이러한 값을 얻으려면 통합 테스트를 위한 전용 Keboola 프로젝트가 필요합니다.

### `uv.lock` 업데이트

종속성을 추가하거나 제거한 경우 `uv.lock` 파일을 업데이트하세요. 릴리스를 만들 때 최신 종속성 버전으로 잠금을 업데이트하는 것도 고려하세요 (`uv lock --upgrade`).

### 도구 문서 업데이트

도구 설명(도구 함수의 docstring)을 변경할 때마다 이러한 변경사항을 반영하기 위해 `TOOLS.md` 문서 파일을 다시 생성해야 합니다:

```bash
uv run python -m src.keboola_mcp_server.generate_tool_docs
```

## 지원 및 피드백

**⭐ 도움을 받거나 버그를 신고하거나 기능을 요청하는 주요 방법은 [GitHub에서 이슈를 여는 것](https://github.com/keboola/mcp-server/issues/new)입니다. ⭐**

개발 팀은 이슈를 적극적으로 모니터링하며 가능한 한 빨리 응답할 것입니다. Keboola에 대한 일반적인 정보는 아래 리소스를 사용하세요.

## 리소스

- [사용자 문서](https://help.keboola.com/)
- [개발자 문서](https://developers.keboola.com/)
- [Keboola 플랫폼](https://www.keboola.com)
- [이슈 트래커](https://github.com/keboola/mcp-server/issues/new) ← **MCP Server를 위한 주요 연락 방법**

## 연결

- [LinkedIn](https://www.linkedin.com/company/keboola)
- [Twitter](https://x.com/keboola)
- [변경 로그](https://changelog.keboola.com/)
