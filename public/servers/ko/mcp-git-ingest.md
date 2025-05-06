---
name: MCP Git Ingest
digest: MCP 서버는 GitHub 저장소를 분석하여 핵심 파일과 구조를 추출하여 프로젝트 구성과 주요 구성 요소에 대한 명확한 통찰력을 제공합니다. 저장소 탐색과 이해를 단순화합니다.
author: adhikasp
homepage: https://github.com/adhikasp/mcp-git-ingest
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - git
  - server
  - python
icon: https://avatars.githubusercontent.com/u/6151302?v=4
createTime: 2024-12-15
---
GitHub 저장소 구조와 중요한 파일을 읽는 데 도움을 주는 Model Context Protocol (MCP) 서버입니다.

[gitingest](https://gitingest.com/)에서 영감을 받았습니다.

## 설정

```json
{
    "mcpServers": {
        "mcp-git-ingest": {
            "command": "uvx",
            "args": ["--from", "git+https://github.com/adhikasp/mcp-git-ingest", "mcp-git-ingest"],
        }
    }
}
```

## 사용 방법

[mcp-client-cli](https://github.com/adhikasp/mcp-client-cli) 사용:

```
$ llm read https://github.com/adhikasp/mcp-git-ingest and determine how the code technically works

mcp-git-ingest 저장소의 기술적 세부 사항을 이해하는 데 도움을 드리겠습니다. 먼저 디렉토리 구조를 가져온 다음 중요한 파일을 읽어 코드가 어떻게 작동하는지 분석하겠습니다.

도구 호출:
  github_directory_structure
  인수:
    repo_url: https://github.com/adhikasp/mcp-git-ingest

이제 중요한 파일을 읽어 기술적 구현을 이해하겠습니다:

도구 호출:
  github_read_important_files
  인수:
    repo_url: https://github.com/adhikasp/mcp-git-ingest
    file_paths: ['README.md', 'src/mcp_git_ingest/main.py', 'pyproject.toml']

이 코드가 기술적으로 어떻게 작동하는지 설명드리겠습니다:

1. 목적:
`mcp-git-ingest`는 GitHub 저장소 구조와 중요한 파일을 읽는 데 도움을 주는 Model Context Protocol (MCP) 서버입니다. 두 가지 주요 도구를 제공합니다:
- `github_directory_structure`: 저장소의 디렉토리 구조를 트리 형태로 반환
- `github_read_important_files`: 저장소의 지정된 파일 내용을 읽고 반환

2. 기술적 구현:

a. 종속성:
- MCP 서버 생성에 `fastmcp` 사용
- Git 저장소 작업에 `gitpython` 사용
- Python 3.8+ 필요

b. 주요 함수:

`clone_repo(repo_url: str) -> str`:
- 저장소 URL의 해시를 기반으로 결정론적 임시 디렉토리 생성
- 저장소가 이미 복제되었는지 확인
- 복제되지 않은 경우 저장소 복제
- 오류 처리 및 정리
- 복제된 저장소 경로 반환

`get_directory_tree(path: str, prefix: str = "") -> str`:
- 재귀적으로 트리 형태의 디렉토리 구조 생성
- `.git` 디렉토리 건너뜀
- 시각적 트리 표현을 위해 유니코드 박스 드로잉 문자 사용
- 항목 정렬 처리

`github_directory_structure(repo_url: str) -> str`:
- 저장소 복제
- 디렉토리 트리 생성
- 처리 후 임시 저장소 정리
- 트리 구조 또는 오류 메시지 반환

`github_read_important_files(repo_url: str, file_paths: List[str]) -> dict[str, str]`:
- 저장소 복제
- 지정된 파일 읽기
- 파일 경로를 내용에 매핑하는 딕셔너리 반환
- 파일 읽기 오류 처리
- 임시 저장소 정리

3. 오류 처리:
- 저장소 복제, 파일 읽기 오류 처리를 위해 try-except 블록 사용
- `finally` 블록을 사용하여 임시 디렉토리 항상 정리
- 설명적인 오류 메시지 반환

4. 성능 최적화:
- 해시 기반 임시 디렉토리 명명을 사용하여 복제된 저장소 재사용 가능
- 복제 전 기존 저장소 확인
- 임시 파일 누적 방지를 위한 정리 구현

5. 고유 기능:
- 결정론적 임시 디렉토리 생성
- 유니코드 트리 표현
- 오류 처리가 있는 유연한 파일 읽기

6. 실행:
- `mcp-git-ingest`를 통해 CLI 도구로 실행 가능
- `pyproject.toml`을 통해 구성
- MCP 서버 기능을 위해 `fastmcp`에 의존

이 코드는 오류 처리와 깔끔한 구현에 중점을 둔 GitHub 저장소를 프로그래밍 방식으로 탐색하고 읽기 위한 강력하고 유연한 도구입니다.

구현의 특정 측면에 대해 더 자세히 설명해 드릴까요?
```