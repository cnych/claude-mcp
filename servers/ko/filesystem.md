---
name: 파일시스템 MCP 서버
digest: 파일시스템 작업을 위한 Claude MCP 서버
author: Claude 팀
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
capabilities:
  prompts: false
  resources: true
  tools: true
tags:
  - filesystem
createTime: 2024-12-01T00:00:00Z
---

파일시스템 작업을 위한 모델 컨텍스트 프로토콜(MCP)을 구현한 Node.js 서버입니다.

## 기능

- 파일 읽기/쓰기
- 디렉토리 생성/목록/삭제
- 파일/디렉토리 이동
- 파일 검색
- 파일 메타데이터 가져오기

**참고**: 서버는 `args`를 통해 지정된 디렉토리 내에서만 작업을 허용합니다.

## API

### 리소스

- `file://system`: 파일 시스템 작업 인터페이스

### 도구

- **read_file**

  - 파일의 전체 내용 읽기
  - 입력: `path` (문자열)
  - UTF-8 인코딩으로 파일 전체 내용을 읽습니다

- **read_multiple_files**

  - 여러 파일을 동시에 읽기
  - 입력: `paths` (문자열[])
  - 일부 파일 읽기 실패가 전체 작업을 중단시키지 않습니다

- **write_file**

  - 새 파일 생성 또는 기존 파일 덮어쓰기(주의해서 사용)
  - 입력:
    - `path` (문자열): 파일 위치
    - `content` (문자열): 파일 내용

- **create_directory**

  - 새 디렉토리 생성 또는 존재 확인
  - 입력: `path` (문자열)
  - 필요한 경우 상위 디렉토리도 생성
  - 디렉토리가 이미 존재하면 조용히 성공

- **list_directory**

  - [FILE] 또는 [DIR] 접두사가 붙은 디렉토리 내용 나열
  - 입력: `path` (문자열)

- **move_file**

  - 파일 및 디렉토리 이동 또는 이름 변경
  - 입력:
    - `source` (문자열)
    - `destination` (문자열)
  - 대상이 이미 존재하면 실패

- **search_files**

  - 파일/디렉토리 재귀적 검색
  - 입력:
    - `path` (문자열): 시작 디렉토리
    - `pattern` (문자열): 검색 패턴
  - 대소문자 구분 없는 매칭
  - 일치하는 항목의 전체 경로 반환

- **get_file_info**

  - 파일/디렉토리 상세 메타데이터 가져오기
  - 입력: `path` (문자열)
  - 반환:
    - 크기
    - 생성 시간
    - 수정 시간
    - 접근 시간
    - 유형 (파일/디렉토리)
    - 권한

- **list_allowed_directories**
  - 서버가 접근 가능한 모든 디렉토리 나열
  - 입력 필요 없음
  - 반환:
    - 이 서버가 읽기/쓰기 가능한 디렉토리들

## Claude Desktop에서 사용

`claude_desktop_config.json`에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/path/to/other/allowed/dir"
      ]
    }
  }
}
```

## 라이선스

이 MCP 서버는 MIT 라이선스로 배포됩니다. 이는 당신이 자유롭게 소프트웨어를 사용, 수정, 배포할 수 있으며, MIT 라이선스의 조건에 따라 이용할 수 있습니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
