---
name: Supabase MCP Server
digest: Supabase 프로젝트를 Cursor, Claude, Windsurf와 같은 AI 도구와 연결하여 개발 워크플로우를 강화하세요. 이 통합은 데이터 접근과 상호작용을 원활하게 하여 데이터베이스 환경 내에서 직접 AI 기능을 활용하여 생산성을 높입니다.
author: supabase-community
homepage: https://github.com/supabase-community/supabase-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - database
  - cloud
icon: https://avatars.githubusercontent.com/u/87650496?v=4
createTime: 2024-12-21
---
> Supabase 프로젝트를 Cursor, Claude, Windsurf 및 기타 AI 어시스턴트와 연결하세요.

![supabase-mcp-demo](https://static.claudemcp.com/servers/supabase-community/supabase-mcp/supabase-community-supabase-mcp-24a1d57e.jpg)

[모델 컨텍스트 프로토콜](https://modelcontextprotocol.io/introduction) (MCP)은 Supabase와 같은 외부 서비스와 대형 언어 모델(LLM)이 통신하는 방식을 표준화합니다. 이는 AI 어시스턴트를 Supabase 프로젝트에 직접 연결하고 테이블 관리, 설정 조회, 데이터 쿼리와 같은 작업을 수행할 수 있도록 합니다.

## 사전 요구 사항

컴퓨터에 Node.js가 설치되어 있어야 합니다. 다음 명령어로 확인할 수 있습니다:

```shell
node -v
```

Node.js가 설치되어 있지 않다면 [nodejs.org](https://nodejs.org/)에서 다운로드할 수 있습니다.

## 설정

### 1. 개인 액세스 토큰(PAT)

먼저 [Supabase 설정](https://supabase.com/dashboard/account/tokens)으로 이동하여 개인 액세스 토큰을 생성하세요. "Cursor MCP 서버"와 같이 용도를 설명하는 이름을 지정하세요.

이 토큰은 MCP 서버가 Supabase 계정과 인증하는 데 사용됩니다. 토큰을 복사해 두세요. 다시 볼 수 없습니다.

### 2. MCP 클라이언트 구성

다음으로, MCP 클라이언트(예: Cursor)를 이 서버를 사용하도록 구성하세요. 대부분의 MCP 클라이언트는 구성을 다음과 같은 JSON 형식으로 저장합니다:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<개인-액세스-토큰>"
      ]
    }
  }
}
```

`<개인-액세스-토큰>`을 1단계에서 생성한 토큰으로 바꾸세요. 또는 `--access-token`을 생략하고 대신 `SUPABASE_ACCESS_TOKEN` 환경 변수를 개인 액세스 토큰으로 설정할 수 있습니다.

Windows를 사용하는 경우 명령 앞에 `cmd /c`를 추가해야 합니다:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<개인-액세스-토큰>"
      ]
    }
  }
}
```

### 읽기 전용 모드

Supabase MCP 서버를 읽기 전용 쿼리로 제한하려면 CLI 명령에 `--read-only` 플래그를 설정하세요:

```shell
npx -y @supabase/mcp-server-supabase@latest --access-token=<개인-액세스-토큰> --read-only
```

이렇게 하면 읽기 전용 Postgres 사용자로 SQL을 실행하여 데이터베이스에 대한 쓰기 작업이 방지됩니다.

## 도구

다음 Supabase 도구가 LLM에서 사용 가능합니다:

#### 프로젝트 관리

- `list_projects`: 사용자의 모든 Supabase 프로젝트를 나열합니다.
- `get_project`: 프로젝트의 세부 정보를 가져옵니다.
- `create_project`: 새로운 Supabase 프로젝트를 생성합니다.
- `pause_project`: 프로젝트를 일시 중지합니다.
- `restore_project`: 프로젝트를 복원합니다.
- `list_organizations`: 사용자가 속한 모든 조직을 나열합니다.
- `get_organization`: 조직의 세부 정보를 가져옵니다.

#### 데이터베이스 작업

- `list_tables`: 지정된 스키마 내의 모든 테이블을 나열합니다.
- `list_extensions`: 데이터베이스의 모든 확장 기능을 나열합니다.
- `list_migrations`: 데이터베이스의 모든 마이그레이션을 나열합니다.
- `apply_migration`: 데이터베이스에 SQL 마이그레이션을 적용합니다.
- `execute_sql`: 데이터베이스에서 원시 SQL을 실행합니다.
- `get_logs`: 서비스 유형별로 Supabase 프로젝트의 로그를 가져옵니다.

#### 프로젝트 구성

- `get_project_url`: 프로젝트의 API URL을 가져옵니다.
- `get_anon_key`: 프로젝트의 익명 API 키를 가져옵니다.

#### 브랜칭 (실험적, 유료 플랜 필요)

- `create_branch`: 프로덕션 브랜치에서 마이그레이션을 포함한 개발 브랜치를 생성합니다.
- `list_branches`: 모든 개발 브랜치를 나열합니다.
- `delete_branch`: 개발 브랜치를 삭제합니다.
- `merge_branch`: 개발 브랜치에서 프로덕션으로 마이그레이션과 엣지 함수를 병합합니다.
- `reset_branch`: 개발 브랜치의 마이그레이션을 이전 버전으로 재설정합니다.
- `rebase_branch`: 마이그레이션 드리프트를 처리하기 위해 프로덕션 브랜치에서 개발 브랜치를 리베이스합니다.

#### 개발 도구

- `generate_typescript_types`: 데이터베이스 스키마를 기반으로 TypeScript 타입을 생성합니다.

#### 비용 확인

- `get_cost`: 조직에 대한 새 프로젝트 또는 브랜치의 비용을 가져옵니다.
- `confirm_cost`: 사용자가 새 프로젝트 또는 브랜치 비용을 이해했음을 확인합니다.

## 기타 MCP 서버

### `@supabase/mcp-server-postgrest`

PostgREST MCP 서버를 사용하면 REST API를 통해 자체 사용자를 앱에 연결할 수 있습니다.

## 리소스

- [**모델 컨텍스트 프로토콜**](https://modelcontextprotocol.io/introduction): MCP 및 그 기능에 대해 자세히 알아보세요.

## 라이선스

이 프로젝트는 Apache 2.0 라이선스로 제공됩니다.