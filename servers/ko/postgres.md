---
name: PostgreSQL
digest: 스키마 검사 기능이 있는 읽기 전용 데이터베이스 접근
author: Claude Team
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - postgresql
  - database
icon: https://cdn.simpleicons.org/postgresql
createTime: 2024-12-01T00:00:00Z
---

PostgreSQL 데이터베이스에 읽기 전용 접근을 제공하는 모델 컨텍스트 프로토콜 서버입니다. 이 서버는 LLM이 데이터베이스 스키마를 검사하고 읽기 전용 쿼리를 실행할 수 있게 합니다.

## 구성 요소

### 도구

- **query**
  - 연결된 데이터베이스에 대해 읽기 전용 SQL 쿼리 실행
  - 입력: `sql` (문자열): 실행할 SQL 쿼리
  - 모든 쿼리는 READ ONLY 트랜잭션 내에서 실행됨

### 리소스

서버는 데이터베이스의 각 테이블에 대한 스키마 정보를 제공합니다:

- **테이블 스키마** (`postgres://<host>/<table>/schema`)
  - 각 테이블에 대한 JSON 스키마 정보
  - 열 이름 및 데이터 유형 포함
  - 데이터베이스 메타데이터에서 자동으로 검색됨

## Claude Desktop에서 사용하기

Claude Desktop 앱에서 이 서버를 사용하려면 `claude_desktop_config.json`의 "mcpServers" 섹션에 다음 구성을 추가하세요:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}
```

`/mydb`를 사용자의 데이터베이스 이름으로 바꿉니다.

## 라이선스

이 MCP 서버는 MIT 라이선스로 배포됩니다. 이는 당신이 자유롭게 소프트웨어를 사용, 수정, 배포할 수 있으며, MIT 라이선스의 조건에 따라 이용할 수 있습니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
