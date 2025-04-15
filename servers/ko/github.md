---
name: GitHub MCP 서버
digest: GitHub API를 위한 Claude MCP 서버
author: Claude 팀
homepage: https://github.com/modelcontextprotocol/servers
repository: https://github.com/modelcontextprotocol/servers/tree/main/src/github
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - github
  - git
icon: https://cdn.simpleicons.org/github
createTime: 2024-12-06T00:00:00Z
---

파일 작업, 저장소 관리, 검색 기능 등을 가능하게 하는 GitHub API용 MCP 서버입니다.

### 기능

- **자동 브랜치 생성**: 파일 생성/업데이트 또는 변경사항 푸시 시, 브랜치가 존재하지 않으면 자동으로 생성됩니다
- **포괄적인 오류 처리**: 일반적인 문제에 대한 명확한 오류 메시지 제공
- **Git 이력 보존**: 강제 푸시 없이 적절한 Git 이력을 유지하는 작업
- **일괄 작업**: 단일 파일 및 다중 파일 작업 지원
- **고급 검색**: 코드, 이슈/PR 및 사용자 검색 지원

## 도구

1. `create_or_update_file`

   - 저장소에서 단일 파일 생성 또는 업데이트
   - 입력:
     - `owner` (문자열): 저장소 소유자(사용자 이름 또는 조직)
     - `repo` (문자열): 저장소 이름
     - `path` (문자열): 파일을 생성/업데이트할 경로
     - `content` (문자열): 파일 내용
     - `message` (문자열): 커밋 메시지
     - `branch` (문자열): 파일을 생성/업데이트할 브랜치
     - `sha` (선택적 문자열): 교체할 파일의 SHA(업데이트용)
   - 반환: 파일 내용 및 커밋 세부 정보

2. `push_files`

   - 단일 커밋으로 여러 파일 푸시
   - 입력:
     - `owner` (문자열): 저장소 소유자
     - `repo` (문자열): 저장소 이름
     - `branch` (문자열): 푸시할 브랜치
     - `files` (배열): 푸시할 파일, 각각 `path`와 `content` 포함
     - `message` (문자열): 커밋 메시지
   - 반환: 업데이트된 브랜치 참조

3. `search_repositories`

   - GitHub 저장소 검색
   - 입력:
     - `query` (문자열): 검색 쿼리
     - `page` (선택적 숫자): 페이지네이션을 위한 페이지 번호
     - `perPage` (선택적 숫자): 페이지당 결과 수(최대 100)
   - 반환: 저장소 검색 결과

4. `create_repository`

   - 새 GitHub 저장소 생성
   - 입력:
     - `name` (문자열): 저장소 이름
     - `description` (선택적 문자열): 저장소 설명
     - `private` (선택적 불리언): 저장소를 비공개로 할지 여부
     - `autoInit` (선택적 불리언): README로 초기화할지 여부
   - 반환: 생성된 저장소 세부 정보

5. `get_file_contents`

   - 파일 또는 디렉토리 내용 가져오기
   - 입력:
     - `owner` (문자열): 저장소 소유자
     - `repo` (문자열): 저장소 이름
     - `path` (문자열): 파일/디렉토리 경로
     - `branch` (선택적 문자열): 내용을 가져올 브랜치
   - 반환: 파일/디렉토리 내용

6. `create_issue`

   - 새 이슈 생성
   - 입력:
     - `owner` (문자열): 저장소 소유자
     - `repo` (문자열): 저장소 이름
     - `title` (문자열): 이슈 제목
     - `body` (선택적 문자열): 이슈 설명
     - `assignees` (선택적 문자열[]): 할당할 사용자 이름
     - `labels` (선택적 문자열[]): 추가할 레이블
     - `milestone` (선택적 숫자): 마일스톤 번호
   - 반환: 생성된 이슈 세부 정보

7. `create_pull_request`

   - 새 풀 리퀘스트 생성
   - 입력:
     - `owner` (문자열): 저장소 소유자
     - `repo` (문자열): 저장소 이름
     - `title` (문자열): PR 제목
     - `body` (선택적 문자열): PR 설명
     - `head` (문자열): 변경사항이 포함된 브랜치
     - `base` (문자열): 병합할 대상 브랜치
     - `draft` (선택적 불리언): 초안 PR로 생성할지 여부
     - `maintainer_can_modify` (선택적 불리언): 관리자 편집 허용 여부
   - 반환: 생성된 풀 리퀘스트 세부 정보

8. `fork_repository`

   - 저장소 포크
   - 입력:
     - `owner` (문자열): 저장소 소유자
     - `repo` (문자열): 저장소 이름
     - `organization` (선택적 문자열): 포크할 조직
   - 반환: 포크된 저장소 세부 정보

9. `create_branch`

   - 새 브랜치 생성
   - 입력:
     - `owner` (문자열): 저장소 소유자
     - `repo` (문자열): 저장소 이름
     - `branch` (문자열): 새 브랜치 이름
     - `from_branch` (선택적 문자열): 소스 브랜치(기본값은 저장소 기본값)
   - 반환: 생성된 브랜치 참조

10. `list_issues`

    - 저장소 이슈 목록 및 필터링
    - 입력:
      - `owner` (문자열): 저장소 소유자
      - `repo` (문자열): 저장소 이름
      - `state` (선택적 문자열): 상태별 필터링('open', 'closed', 'all')
      - `labels` (선택적 문자열[]): 레이블별 필터링
      - `sort` (선택적 문자열): 정렬 기준('created', 'updated', 'comments')
      - `direction` (선택적 문자열): 정렬 방향('asc', 'desc')
      - `since` (선택적 문자열): 날짜별 필터링(ISO 8601 타임스탬프)
      - `page` (선택적 숫자): 페이지 번호
      - `per_page` (선택적 숫자): 페이지당 결과 수
    - 반환: 이슈 세부 정보 배열

11. `update_issue`

    - 기존 이슈 업데이트
    - 입력:
      - `owner` (문자열): 저장소 소유자
      - `repo` (문자열): 저장소 이름
      - `issue_number` (숫자): 업데이트할 이슈 번호
      - `title` (선택적 문자열): 새 제목
      - `body` (선택적 문자열): 새 설명
      - `state` (선택적 문자열): 새 상태('open' 또는 'closed')
      - `labels` (선택적 문자열[]): 새 레이블
      - `assignees` (선택적 문자열[]): 새 담당자
      - `milestone` (선택적 숫자): 새 마일스톤 번호
    - 반환: 업데이트된 이슈 세부 정보

12. `add_issue_comment`

    - 이슈에 댓글 추가
    - 입력:
      - `owner` (문자열): 저장소 소유자
      - `repo` (문자열): 저장소 이름
      - `issue_number` (숫자): 댓글을 달 이슈 번호
      - `body` (문자열): 댓글 텍스트
    - 반환: 생성된 댓글 세부 정보

13. `search_code`

    - GitHub 저장소 전체에서 코드 검색
    - 입력:
      - `q` (문자열): GitHub 코드 검색 구문을 사용한 검색 쿼리
      - `sort` (선택적 문자열): 정렬 필드('indexed'만 가능)
      - `order` (선택적 문자열): 정렬 순서('asc' 또는 'desc')
      - `per_page` (선택적 숫자): 페이지당 결과 수(최대 100)
      - `page` (선택적 숫자): 페이지 번호
    - 반환: 저장소 컨텍스트가 포함된 코드 검색 결과

14. `search_issues`

    - 이슈 및 풀 리퀘스트 검색
    - 입력:
      - `q` (문자열): GitHub 이슈 검색 구문을 사용한 검색 쿼리
      - `sort` (선택적 문자열): 정렬 필드(comments, reactions, created 등)
      - `order` (선택적 문자열): 정렬 순서('asc' 또는 'desc')
      - `per_page` (선택적 숫자): 페이지당 결과 수(최대 100)
      - `page` (선택적 숫자): 페이지 번호
    - 반환: 이슈 및 풀 리퀘스트 검색 결과

15. `search_users`

    - GitHub 사용자 검색
    - 입력:
      - `q` (문자열): GitHub 사용자 검색 구문을 사용한 검색 쿼리
      - `sort` (선택적 문자열): 정렬 필드(followers, repositories, joined)
      - `order` (선택적 문자열): 정렬 순서('asc' 또는 'desc')
      - `per_page` (선택적 숫자): 페이지당 결과 수(최대 100)
      - `page` (선택적 숫자): 페이지 번호
    - 반환: 사용자 검색 결과

16. `list_commits`

- 저장소의 브랜치 커밋 가져오기
- 입력:
  - `owner` (문자열): 저장소 소유자
  - `repo` (문자열): 저장소 이름
  - `page` (선택적 문자열): 페이지 번호
  - `per_page` (선택적 문자열): 페이지당 레코드 수
  - `sha` (선택적 문자열): 브랜치 이름
- 반환: 커밋 목록

## 검색 쿼리 구문

### 코드 검색

- `language:javascript`: 프로그래밍 언어로 검색
- `repo:owner/name`: 특정 저장소에서 검색
- `path:app/src`: 특정 경로에서 검색
- `extension:js`: 파일 확장자로 검색
- 예시: `q: "import express" language:typescript path:src/`

### 이슈 검색

- `is:issue` 또는 `is:pr`: 유형별 필터링
- `is:open` 또는 `is:closed`: 상태별 필터링
- `label:bug`: 레이블로 검색
- `author:username`: 작성자로 검색
- 예시: `q: "memory leak" is:issue is:open label:bug`

### 사용자 검색

- `type:user` 또는 `type:org`: 계정 유형별 필터링
- `followers:>1000`: 팔로워 수로 필터링
- `location:London`: 위치로 검색
- 예시: `q: "fullstack developer" location:London followers:>100`

자세한 검색 구문은 [GitHub의 검색 문서](https://docs.github.com/en/search-github/searching-on-github)를 참조하세요.

## 설정

### 개인 액세스 토큰

적절한 권한이 있는 [GitHub 개인 액세스 토큰 생성](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens):

- [개인 액세스 토큰](https://github.com/settings/tokens)으로 이동 (GitHub 설정 > 개발자 설정)
- 이 토큰이 액세스할 저장소 선택 (공개, 전체 또는 선택)
- `repo` 범위("비공개 저장소에 대한 전체 제어")가 있는 토큰 생성
  - 또는 공개 저장소만 작업하는 경우 `public_repo` 범위만 선택
- 생성된 토큰 복사

### Claude 데스크톱에서 사용

Claude 데스크톱에서 사용하려면 `claude_desktop_config.json`에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## 라이선스

이 MCP 서버는 MIT 라이선스로 배포됩니다. 이는 당신이 자유롭게 소프트웨어를 사용, 수정, 배포할 수 있으며, MIT 라이선스의 조건에 따라 이용할 수 있습니다. 자세한 내용은 프로젝트 저장소의 LICENSE 파일을 참조하세요.
