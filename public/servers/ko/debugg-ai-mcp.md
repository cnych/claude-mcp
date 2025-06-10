---
name: Debugg AI MCP
digest: AI 기반 브라우저 자동화 및 E2E 테스트 서버
author: Debugg AI
homepage: https://debugg.ai
repository: https://github.com/debugg-ai/debugg-ai-mcp
capabilities:
  resources: true
  tools: true
  prompts: false
tags:
  - 테스트
  - 자동화
  - 브라우저
icon: https://avatars.githubusercontent.com/u/203699926?s=48&v=4
createTime: 2025-06-02
---

# 🧪 Debugg AI 공식 MCP 서버

**AI 기반 브라우저 자동화 및 E2E 테스트 서버**로 [모델 컨텍스트 프로토콜(MCP)](/)(Model Context Protocol)을 구현하여, AI 에이전트가 UI 변경 사항을 테스트하고 사용자 행동을 시뮬레이션하며 실행 중인 웹 애플리케이션의 시각적 출력을 분석할 수 있도록 지원합니다. 자연어와 CLI 도구를 통해 모든 작업이 가능합니다.

E2E 테스트는 설정뿐만 아니라 앱 변경 시 지속적으로 관리해야 하는 악몽과 같았습니다.

Debugg AI의 MCP 서버는 완전히 원격으로 관리되는 브라우저를 통해 로컬 또는 원격 서버에 안전한 터널로 연결하는 새로운 테스트 방식을 제공합니다. 따라서 Playwright 설정, 로컬 브라우저 또는 프록시 관리에 대해 걱정할 필요가 없습니다.

테스트 실행 시 방해되는 크롬 팝업이 나타나지 않으며, 크롬이나 Playwright 버전을 관리할 필요도 없습니다. 가장 중요한 것은 - **설정이 전혀 필요하지 않습니다**. API 키를 받아 MCP 서버 목록에 추가하기만 하면 됩니다.

나중에 해당 테스트를 다시 실행하거나 CI/CD 파이프라인에서 실행할 테스트 모음을 생성하려는 경우, 대시보드에서 모든 과거 테스트 결과를 확인할 수 있습니다 - [Debugg.AI 앱](https://debugg.ai)

---

## 🚀 기능

- 🧠 **MCP 프로토콜 지원**
  CLI 및 도구 레지스트리 지원과 함께 완전한 MCP 서버 구현.

- 🧪 **E2E 테스트 자동화**
  `debugg_ai_test_page_changes` 도구를 통해 사용자 스토리 또는 자연어 설명 기반 UI 테스트 실행.

- 🌐 **로컬호스트 웹 앱 통합**
  시뮬레이션된 사용자 흐름으로 모든 `localhost` 포트에서 실행 중인 개발 앱 테스트.

- 🧾 **MCP 도구 알림**
  단계 설명 및 UI 상태 목표와 함께 클라이언트에 실시간 진행 상황 업데이트 전송.

- 🧷 **스크린샷 지원**
  이미지 렌더링 지원으로 페이지의 최종 시각적 상태를 LLM용으로 캡처.

- 🧱 **Stdio 서버 호환**
  stdin/stdout을 통해 모든 MCP 호환 클라이언트(Claude Desktop, LangChain 에이전트 등)에 연결 가능.

---

## 예시

### 입력 프롬프트: "계정 생성 및 로그인 기능 테스트"

![계정 생성 및 로그인 테스트](https://static-debugg-ai.s3.us-east-2.amazonaws.com/test-create-account-login.gif)

### 결과:

    **작업 완료**

    - 소요 시간: 86.80초
    - 최종 결과: 'alice.wonderland1234@example.com' 이메일로 계정 가입 및 로그인 작업 성공적으로 완료.
    - 상태: 성공

### 전체 데모:

> 더 자세한 [전체 사용 사례 데모](https://debugg.ai/demo) 시청

---

## 🛠️ 빠른 시작

### 무료 계정 생성 및 API 키 발급 확인 - [DebuggAI](https://debugg.ai)

### 옵션 1: NPX (로컬 개발)

```bash
npx -y @debugg-ai/debugg-ai-mcp
```

Claude Desktop 또는 사용자 정의 AI 에이전트와 같은 도구에 통합하거나 테스트할 때 사용.

### 옵션 2: Docker

```bash
docker run -i --rm --init \
  -e DEBUGGAI_API_KEY=your_api_key \
  -e TEST_USERNAME_EMAIL=your_test_email \
  -e TEST_USER_PASSWORD=your_password \
  -e DEBUGGAI_LOCAL_PORT=3000 \
  -e DEBUGGAI_LOCAL_REPO_NAME=your-org/your-repo \
  -e DEBUGGAI_LOCAL_BRANCH_NAME=main \
  -e DEBUGGAI_LOCAL_REPO_PATH=/app \
  -e DEBUGGAI_LOCAL_FILE_PATH=/app/index.ts \
  quinnosha/debugg-ai-mcp
```

---

## 🧰 MCP 도구: `debugg_ai_test_page_changes`

### 설명

실행 중인 웹 앱에서 E2E 테스트를 실행하여 자연어로 설명된 UI 기능 또는 흐름을 테스트합니다. 모든 코드 생성 플랫폼의 AI 에이전트가 제안된 변경 사항을 빠르게 평가하고 새로운 기능이 예상대로 작동하는지 확인할 수 있습니다.

### 입력 매개변수

| 이름          | 유형   | 필수 | 설명                                             |
| ------------- | ------ | ---- | ------------------------------------------------ |
| `description` | string | ✅   | 테스트할 기능 또는 페이지 (예: "가입 페이지 폼") |
| `localPort`   | number | ❌   | 실행 중인 앱의 포트 (기본값: `3000`)             |
| `repoName`    | string | ❌   | GitHub 저장소 이름                               |
| `branchName`  | string | ❌   | 현재 브랜치                                      |
| `repoPath`    | string | ❌   | 저장소의 절대 경로                               |
| `filePath`    | string | ❌   | 테스트할 파일                                    |

---

## 🧪 Claude Desktop 구성 예시

```jsonc
{
  "mcpServers": {
    "debugg-ai-mcp": {
      "command": "npx",
      "args": ["-y", "@debugg-ai/debugg-ai-mcp"],
      "env": {
        "DEBUGGAI_API_KEY": "YOUR_API_KEY",
        "TEST_USERNAME_EMAIL": "test@example.com",
        "TEST_USER_PASSWORD": "supersecure",
        "DEBUGGAI_LOCAL_PORT": 3000,
        "DEBUGGAI_LOCAL_REPO_NAME": "org/project",
        "DEBUGGAI_LOCAL_BRANCH_NAME": "main",
        "DEBUGGAI_LOCAL_REPO_PATH": "/Users/you/project",
        "DEBUGGAI_LOCAL_FILE_PATH": "/Users/you/project/index.ts"
      }
    }
  }
}
```

---

## 🔐 환경 변수

| 변수                         | 설명                          | 필수 |
| ---------------------------- | ----------------------------- | ---- |
| `DEBUGGAI_API_KEY`           | DebuggAI 백엔드 호출용 API 키 | ✅   |
| `TEST_USERNAME_EMAIL`        | 테스트 사용자 계정 이메일     | ❌   |
| `TEST_USER_PASSWORD`         | 테스트 사용자 계정 비밀번호   | ❌   |
| `DEBUGGAI_LOCAL_PORT`        | 앱이 실행 중인 로컬 포트      | ✅   |
| `DEBUGGAI_LOCAL_REPO_NAME`   | GitHub 저장소 이름            | ❌   |
| `DEBUGGAI_LOCAL_BRANCH_NAME` | 브랜치 이름                   | ❌   |
| `DEBUGGAI_LOCAL_REPO_PATH`   | 저장소 루트의 로컬 경로       | ❌   |
| `DEBUGGAI_LOCAL_FILE_PATH`   | 테스트할 파일                 | ❌   |

---

## 🧑‍💻 로컬 개발

```bash
# 저장소 복제 및 의존성 설치
npm install

# 테스트 구성 복사 및 자격 증명 입력
cp test-config-example.json test-config.json

# 로컬에서 MCP 서버 실행
npx @modelcontextprotocol/inspector --config debugg-ai-mcp/test-config.json --server debugg-ai-mcp
```

---

## 📁 저장소 구조

```
.
├── e2e-agents/             # E2E 브라우저 테스트 실행기
├── services/               # DebuggAI API 클라이언트
├── tunnels /               # 원격 웹 브라우저에 대한 안전한 연결
├── index.ts                # 주요 MCP 서버 진입점
├── Dockerfile              # Docker 빌드 구성
└── README.md
```

---

## 🧱 사용 기술

- [모델 컨텍스트 프로토콜 SDK](https://github.com/modelcontextprotocol)

---

## 💬 피드백 및 문제

버그, 아이디어 또는 통합 도움이 필요한 경우 이슈를 열거나 DebuggAI 팀에 직접 문의하세요.

---

## 🔒 라이선스

MIT 라이선스 © 2025 DebuggAI

---

<p style="padding-top: 20px; text-align: center;">샌프란시스코에서 🩸, 💦, 그리고 😭으로 만들었습니다</p>
