---
name: Git MCP 서버
digest: Git 작업을 위한 Claude MCP 서버
author: Claude 팀
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/git
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - git
icon: https://cdn.simpleicons.org/git
createTime: 2024-12-01T00:00:00Z
---

Git 저장소 상호작용 및 자동화를 위한 모델 컨텍스트 프로토콜 서버입니다. 이 서버는 대형 언어 모델을 통해 Git 저장소를 읽고, 검색하고, 조작하는 도구를 제공합니다.

mcp-server-git은 현재 초기 개발 단계에 있습니다. 서버를 계속 개발하고 개선함에 따라 기능과 사용 가능한 도구는 변경되거나 확장될 수 있습니다.

### 도구

1. `git_status`

   - 작업 트리 상태 표시
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
   - 반환: 작업 디렉토리의 현재 상태를 텍스트로 출력

2. `git_diff_unstaged`

   - 아직 스테이징되지 않은 작업 디렉토리의 변경사항 표시
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
   - 반환: 스테이징되지 않은 변경사항의 diff 출력

3. `git_diff_staged`

   - 커밋을 위해 스테이징된 변경사항 표시
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
   - 반환: 스테이징된 변경사항의 diff 출력

4. `git_commit`

   - 저장소에 변경사항 기록
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
     - `message` (문자열): 커밋 메시지
   - 반환: 새 커밋 해시와 함께 확인

5. `git_add`

   - 파일 내용을 스테이징 영역에 추가
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
     - `files` (문자열[]): 스테이징할 파일 경로 배열
   - 반환: 스테이징된 파일 확인

6. `git_reset`

   - 모든 스테이징된 변경사항 취소
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
   - 반환: 리셋 작업 확인

7. `git_log`

   - 커밋 로그 표시
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
     - `max_count` (숫자, 선택사항): 표시할 최대 커밋 수 (기본값: 10)
   - 반환: 해시, 작성자, 날짜, 메시지가 포함된 커밋 항목 배열

8. `git_create_branch`

   - 새 브랜치 생성
   - 입력:
     - `repo_path` (문자열): Git 저장소 경로
     - `branch_name` (문자열): 새 브랜치 이름
     - `start_point` (문자열, 선택사항): 새 브랜치의 시작점
   - 반환: 브랜치 생성 확인

## 설치

### uv 사용 (권장)

[`uv`](https://docs.astral.sh/uv/)를 사용할 때는 특별한 설치가 필요하지 않습니다. *mcp-server-git*을 직접 실행하기 위해 [`uvx`](https://docs.astral.sh/uv/guides/tools/)를 사용합니다.

### PIP 사용

또는 pip를 통해 `mcp-server-git`을 설치할 수 있습니다:

```bash
pip install mcp-server-git
```

## 설치

### uv 사용 (권장)

[`uv`](https://docs.astral.sh/uv/)를 사용할 때는 특별한 설치가 필요하지 않습니다. *mcp-server-git*을 직접 실행하기 위해 [`uvx`](https://docs.astral.sh/uv/guides/tools/)를 사용합니다.

### PIP 사용

또는 pip를 통해 `mcp-server-git`을 설치할 수 있습니다:

<details>
<summary>uvx 사용</summary>

```json
"mcpServers": {
  "git": {
    "command": "uvx",
    "args": ["mcp-server-git", "--repository", "path/to/git/repo"]
  }
}
```

</details>

<details>
<summary>PIP 설치 사용</summary>

```json
"mcpServers": {
  "git": {
    "command": "python",
    "args": ["-m", "mcp_server_git", "--repository", "path/to/git/repo"]
  }
}
```

</details>

### [Zed](https://github.com/zed-industries/zed) 사용

Zed 설정.json에 다음을 추가하세요:

<details>
<summary>uvx 사용</summary>

```json
"context_servers": [
  "mcp-server-git": {
    "command": {
      "path": "uvx",
      "args": ["mcp-server-git"]
    }
  }
],
```

</details>

<details>
<summary>PIP 설치 사용</summary>

```json
"context_servers": {
  "mcp-server-git": {
    "command": {
      "path": "python",
      "args": ["-m", "mcp_server_git"]
    }
  }
},
```

</details>

## 디버깅

MCP 검사기를 사용하여 서버를 디버깅할 수 있습니다. uvx 설치의 경우:

```bash
npx @modelcontextprotocol/inspector uvx mcp-server-git
```

또는 패키지가 특정 디렉토리에 설치되어 있거나 개발 중인 경우:

```bash
cd path/to/servers/src/git
npx @modelcontextprotocol/inspector uv run mcp-server-git
```

`tail -n 20 -f ~/Library/Logs/Claude/mcp*.log`를 실행하면 서버의 로그를 표시하고 문제를 디버깅하는 데 도움이 될 수 있습니다.

## 개발

로컬 개발을 하는 경우 두 가지 방법으로 변경사항을 테스트할 수 있습니다:

1. MCP 검사기를 사용하여 변경사항을 테스트할 수 있습니다. [디버깅](#디버깅) 섹션을 참조하세요.

2. Claude 데스크톱 앱을 사용하여 변경사항을 테스트할 수 있습니다. `claude_desktop_config.json`에 다음을 추가하세요:

```json
"git": {
  "command": "uv",
  "args": [
    "--directory",
    "/<path to mcp-servers>/mcp-servers/src/git",
    "run",
    "mcp-server-git"
  ]
}
```

## 라이선스

이 MCP 서버는 MIT 라이선스로 배포됩니다. 이는 당신이 자유롭게 소프트웨어를 사용, 수정, 배포할 수 있으며, MIT 라이선스의 조건에 따라 이용할 수 있습니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
