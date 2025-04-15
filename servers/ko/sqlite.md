---
name: SQLite MCP 서버
digest: MCP 서버를 위한 데이터베이스 상호작용 및 비즈니스 인텔리전스
author: Claude 팀
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite
capabilities:
  prompts: true
  resources: true
  tools: true
tags:
  - sqlite
  - database
icon: https://cdn.simpleicons.org/sqlite
createTime: 2024-12-06T00:00:00Z
---

SQLite를 통해 데이터베이스 상호작용 및 비즈니스 인텔리전스 기능을 제공하는 모델 컨텍스트 프로토콜(MCP) 서버 구현입니다. 이 서버는 SQL 쿼리 실행, 비즈니스 데이터 분석 및 비즈니스 인사이트 메모 자동 생성을 가능하게 합니다.

## 구성 요소

### 리소스

서버는 단일 동적 리소스를 제공합니다:

- `memo://insights`: 분석 중 발견된 인사이트를 집계하는 지속적으로 업데이트되는 비즈니스 인사이트 메모
  - append-insight 도구를 통해 새로운 인사이트가 발견되면 자동 업데이트됨

### 프롬프트

서버는 데모 프롬프트를 제공합니다:

- `mcp-demo`: 사용자를 데이터베이스 작업을 통해 안내하는 대화형 프롬프트
  - 필수 인자: `topic` - 분석할 비즈니스 도메인
  - 적절한 데이터베이스 스키마 및 샘플 데이터 생성
  - 사용자를 분석 및 인사이트 생성 과정으로 안내
  - 비즈니스 인사이트 메모와 통합

### 도구

서버는 여섯 가지 핵심 도구를 제공합니다:

#### 쿼리 도구

- `read-query`

  - 데이터베이스에서 데이터를 읽기 위한 SELECT 쿼리 실행
  - 입력:
    - `query` (문자열): 실행할 SELECT SQL 쿼리
  - 반환: 객체 배열 형태의 쿼리 결과

- `write-query`

  - INSERT, UPDATE 또는 DELETE 쿼리 실행
  - 입력:
    - `query` (문자열): SQL 수정 쿼리
  - 반환: `{ affected_rows: number }`

- `create-table`
  - 데이터베이스에 새 테이블 생성
  - 입력:
    - `query` (문자열): CREATE TABLE SQL 문
  - 반환: 테이블 생성 확인

#### 스키마 도구

- `list-tables`

  - 데이터베이스의 모든 테이블 목록 가져오기
  - 입력 필요 없음
  - 반환: 테이블 이름 배열

- `describe-table`
  - 특정 테이블의 스키마 정보 보기
  - 입력:
    - `table_name` (문자열): 설명할 테이블 이름
  - 반환: 이름과 유형이 포함된 열 정의 배열

#### 분석 도구

- `append-insight`
  - 메모 리소스에 새로운 비즈니스 인사이트 추가
  - 입력:
    - `insight` (문자열): 데이터 분석에서 발견된 비즈니스 인사이트
  - 반환: 인사이트 추가 확인
  - memo://insights 리소스 업데이트 트리거

## Claude Desktop에서 사용하기

```bash
# Add the server to your claude_desktop_config.json
"mcpServers": {
  "sqlite": {
    "command": "uv",
    "args": [
      "--directory",
      "parent_of_servers_repo/servers/src/sqlite",
      "run",
      "mcp-server-sqlite",
      "--db-path",
      "~/test.db"
    ]
  }
}
```

## 라이선스

이 MCP 서버는 MIT 라이선스로 배포됩니다. 이는 당신이 자유롭게 소프트웨어를 사용, 수정, 배포할 수 있으며, MIT 라이선스의 조건에 따라 이용할 수 있습니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
