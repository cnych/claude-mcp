---
name: MCP Feedback Enhanced
digest: 핵심 개념은 복잡한 아이디어를 명확하고 실행 가능한 통찰력으로 단순화하는 효율적인 접근법입니다. 핵심 정보를 추출하여 이해와 의사 결정을 향상시키는 데 중점을 두며, 사용자가 빠르고 효율적으로 핵심 사항을 파악할 수 있도록 합니다. 간결하고 체계적인 콘텐츠를 통해 커뮤니케이션 개선, 시간 절약, 더 나은 결과 도출에 그 가치가 있습니다.
author: Minidoracat
homepage: https://github.com/Minidoracat/mcp-feedback-enhanced
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 서버
  - SSH
  - WSL
icon: https://avatars.githubusercontent.com/u/11269639?v=4
createTime: 2025-05-29
featured: true
---

## 핵심 개념

이것은 [MCP 서버](https://modelcontextprotocol.io/)로, **피드백 중심의 개발 워크플로우**를 구축하며 로컬, **SSH 원격 환경**(Cursor SSH Remote, VS Code Remote SSH), **WSL(Windows Subsystem for Linux) 환경**에 완벽하게 적응합니다. AI가 추측성 작업을 수행하는 대신 사용자와 확인하도록 유도함으로써, 여러 도구 호출을 단일 피드백 중심 요청으로 통합할 수 있어 플랫폼 비용을 크게 절감하고 개발 효율성을 향상시킵니다.

**지원 플랫폼:** [Cursor](https://www.cursor.com) | [Cline](https://cline.bot) | [Windsurf](https://windsurf.com) | [Augment](https://www.augmentcode.com) | [Trae](https://www.trae.ai)

### 워크플로우

1. **AI 호출** → `mcp-feedback-enhanced`
2. **환경 감지** → 적절한 인터페이스 자동 선택
3. **사용자 상호작용** → 명령 실행, 텍스트 피드백, 이미지 업로드
4. **피드백 전달** → 정보가 AI로 반환
5. **프로세스 계속** → 피드백에 따라 조정 또는 종료

## 주요 기능

### 듀얼 인터페이스 시스템

- **Qt GUI**: 로컬 환경을 위한 네이티브 경험, 모듈식 리팩토링 설계
- **Web UI**: 원격 SSH 및 WSL 환경을 위한 현대적 인터페이스, 완전히 새로운 아키텍처
- **스마트 전환**: 환경(로컬/원격/WSL)을 자동 감지하고 최적의 인터페이스 선택

### 완전히 새로운 인터페이스 디자인 (v2.1.0)

- **모듈식 아키텍처**: GUI와 Web UI 모두 모듈식 설계 채택
- **중앙 집중식 관리**: 폴더 구조 재구성으로 유지보수 용이성 향상
- **현대적 테마**: 시각적 디자인과 사용자 경험 개선
- **반응형 레이아웃**: 다양한 화면 크기와 창 크기에 적응

### 이미지 지원

- **형식 지원**: PNG, JPG, JPEG, GIF, BMP, WebP
- **업로드 방법**: 파일 드래그 & 드롭 + 클립보드 붙여넣기(Ctrl+V)
- **자동 처리**: 1MB 제한 준수를 위한 스마트 압축

### 다국어 지원

- **세 가지 언어**: 영어, 번체 중국어, 간체 중국어
- **스마트 감지**: 시스템 언어 기반 자동 선택
- **실시간 전환**: 인터페이스 내에서 직접 언어 변경

### WSL 환경 지원 (v2.2.5)

- **자동 감지**: WSL(Windows Subsystem for Linux) 환경을 지능적으로 식별
- **브라우저 통합**: WSL 환경에서 Windows 브라우저 자동 실행
- **다양한 실행 방법**: `cmd.exe`, `powershell.exe`, `wslview` 등 브라우저 실행 방법 지원
- **원활한 경험**: WSL 사용자는 추가 구성 없이 Web UI를 직접 사용할 수 있음

### SSH 원격 환경 지원 (v2.3.0 신규 기능)

- **스마트 감지**: SSH 원격 환경(Cursor SSH Remote, VS Code Remote SSH 등) 자동 식별
- **브라우저 실행 안내**: 브라우저가 자동으로 실행되지 않을 때 명확한 솔루션 제공
- **포트 포워딩 지원**: 포트 포워딩 설정 안내 및 문제 해결 완료
- **MCP 통합 최적화**: MCP 시스템과의 통합 개선으로 더 안정적인 연결 경험 제공
- **상세 문서**: [SSH 원격 환경 사용 가이드](docs/en/ssh-remote/browser-launch-issues.md)
- **입력 상자 자동 포커스**: 창이 열릴 때 피드백 입력 상자에 자동으로 포커스, 사용자 경험 개선

## 인터페이스 미리보기

### Qt GUI 인터페이스 (리팩토링 버전)

<div align="center">
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-d52415e2.png" width="400" alt="Qt GUI 메인 인터페이스" />
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-08512ba3.png" width="400" alt="Qt GUI 설정 인터페이스" />
</div>

_Qt GUI 인터페이스 - 모듈식 리팩토링, 로컬 환경 지원_

### Web UI 인터페이스 (리팩토링 버전)

<div align="center">
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-b9522f81.png" width="400" alt="Web UI 메인 인터페이스" />
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-bfd5339d.png" width="400" alt="Web UI 설정 인터페이스" />
</div>

_Web UI 인터페이스 - 완전히 새로운 아키텍처, SSH 원격 환경에 적합_

**키보드 단축키**

- `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (macOS): 피드백 제출 (메인 키보드와 넘패드 모두 지원)
- `Ctrl+V` (Windows/Linux) / `Cmd+V` (macOS): 클립보드 이미지 직접 붙여넣기

## 빠른 시작

### 1. 설치 및 테스트

```bash
# uv 설치 (아직 설치되지 않은 경우)
pip install uv

# 빠른 테스트
uvx mcp-feedback-enhanced@latest test
```

### 2. MCP 구성

**기본 구성** (대부분의 사용자에게 적합):

```json
{
  "mcpServers": {
    "mcp-feedback-enhanced": {
      "command": "uvx",
      "args": ["mcp-feedback-enhanced@latest"],
      "timeout": 600,
      "autoApprove": ["interactive_feedback"]
    }
  }
}
```

**고급 구성** (사용자 정의 환경 필요):

```json
{
  "mcpServers": {
    "mcp-feedback-enhanced": {
      "command": "uvx",
      "args": ["mcp-feedback-enhanced@latest"],
      "timeout": 600,
      "env": {
        "FORCE_WEB": "true",
        "MCP_DEBUG": "false"
      },
      "autoApprove": ["interactive_feedback"]
    }
  }
}
```

### 3. 프롬프트 엔지니어링 설정

최상의 결과를 위해 AI 어시스턴트에 다음 규칙을 추가하세요:

```
# MCP 상호작용 피드백 규칙

1. 모든 프로세스, 작업 또는 대화 중에 질문, 응답 또는 단계 작업 완료 시 MCP mcp-feedback-enhanced를 호출해야 합니다.
2. 사용자 피드백을 받을 때 피드백 내용이 비어 있지 않으면 MCP mcp-feedback-enhanced를 다시 호출하고 피드백에 따라 동작을 조정해야 합니다.
3. 사용자가 명시적으로 "종료" 또는 "더 이상 상호작용 필요 없음"을 표시할 때만 MCP mcp-feedback-enhanced 호출을 중지할 수 있으며, 그때 프로세스가 완료됩니다.
4. 종료 명령을 받지 않는 한 모든 단계에서 반복적으로 MCP mcp-feedback-enhanced를 호출해야 합니다.
5. 작업을 완료하기 전에 MCP mcp-feedback-enhanced를 사용하여 사용자 피드백을 요청하세요.
```

## 고급 설정

### 환경 변수

| 변수           | 목적             | 값             | 기본값  |
| -------------- | ---------------- | -------------- | ------- |
| `FORCE_WEB`    | Web UI 강제 사용 | `true`/`false` | `false` |
| `MCP_DEBUG`    | 디버그 모드      | `true`/`false` | `false` |
| `MCP_WEB_PORT` | Web UI 포트      | `1024-65535`   | `8765`  |

### 테스트 옵션

```bash
# 버전 확인
uvx mcp-feedback-enhanced@latest version       # 버전 확인

# 인터페이스별 테스트
uvx mcp-feedback-enhanced@latest test --gui    # Qt GUI 빠른 테스트
uvx mcp-feedback-enhanced@latest test --web    # Web UI 테스트 (자동 지속 실행)

# 디버그 모드
MCP_DEBUG=true uvx mcp-feedback-enhanced@latest test
```

### 개발자 설치

```bash
git clone https://github.com/Minidoracat/mcp-feedback-enhanced.git
cd mcp-feedback-enhanced
uv sync
```

**로컬 테스트 방법**

```bash
# 방법 1: 표준 테스트 (권장)
uv run python -m mcp_feedback_enhanced test

# 방법 2: 완전한 테스트 스위트 (macOS 및 Windows 개발 환경)
uvx --with-editable . mcp-feedback-enhanced test

# 방법 3: 인터페이스별 테스트
uvx --with-editable . mcp-feedback-enhanced test --gui    # Qt GUI 빠른 테스트
uvx --with-editable . mcp-feedback-enhanced test --web    # Web UI 테스트 (자동 지속 실행)
```

**테스트 설명**

- **표준 테스트**: 완전한 기능 확인, 일상적인 개발 검증에 적합
- **완전한 테스트**: 모든 구성 요소 심층 테스트, 출시 전 검증에 적합
- **Qt GUI 테스트**: 로컬 그래픽 인터페이스 빠른 실행 및 테스트
- **Web UI 테스트**: Web 서버 시작 및 완전한 Web 기능 테스트를 위한 지속 실행

## 버전 기록

📋 **전체 버전 기록:** [RELEASE_NOTES/CHANGELOG.en.md](RELEASE_NOTES/CHANGELOG.en.md)

### 최신 버전 하이라이트 (v2.3.0)

- **SSH 원격 환경 지원**: Cursor SSH Remote 브라우저 실행 문제 해결 및 명확한 사용 가이드 제공
- **오류 메시지 개선**: 오류 발생 시 더 사용자 친화적인 오류 메시지와 솔루션 제안 제공
- **자동 정리 기능**: 임시 파일 및 만료된 세션 자동 정리로 시스템 깔끔하게 유지
- **메모리 모니터링**: 시스템 리소스 부족 방지를 위한 메모리 사용량 모니터링
- **연결 안정성**: Web UI 연결 안정성 및 오류 처리 개선

## 일반적인 문제

### SSH 원격 환경 문제

**Q: SSH 원격 환경에서 브라우저가 실행되지 않음**
A: 이는 정상적인 동작입니다. SSH 원격 환경에는 그래픽 인터페이스가 없으므로 로컬 브라우저에서 수동으로 열어야 합니다. 자세한 솔루션은 [SSH 원격 환경 사용 가이드](docs/en/ssh-remote/browser-launch-issues.md)를 참조하세요.

**Q: 새로운 MCP 피드백을 받지 못하는 이유는?**
A: WebSocket 연결 문제일 수 있습니다. **해결 방법**: 브라우저 페이지를 새로고침하세요.

**Q: MCP가 호출되지 않는 이유는?**
A: MCP 도구 상태가 녹색 표시되는지 확인하세요. **해결 방법**: MCP 도구를 반복적으로 켜고 끄고, 시스템 재연결을 위해 몇 초 기다리세요.

**Q: Augment에서 MCP를 시작할 수 없음**
A: **해결 방법**: VS Code 또는 Cursor를 완전히 닫고 다시 시작한 후 프로젝트를 다시 열어보세요.

### 일반적인 문제

**Q: "Unexpected token 'D'" 오류 발생**
A: 디버그 출력 간섭입니다. `MCP_DEBUG=false`를 설정하거나 환경 변수를 제거하세요.

**Q: 한글 문자 깨짐**
A: v2.0.3에서 수정되었습니다. 최신 버전으로 업데이트하세요: `uvx mcp-feedback-enhanced@latest`

**Q: 다중 화면에서 창 사라짐 또는 위치 오류**
A: v2.1.1에서 수정되었습니다. "⚙️ 설정" 탭에서 "항상 기본 화면 중앙에 창 표시"를 체크하여 해결하세요. 특히 T자형 화면 배열 및 기타 복잡한 다중 모니터 구성에 유용합니다.

**Q: 이미지 업로드 실패**
A: 파일 크기(≤1MB)와 형식(PNG/JPG/GIF/BMP/WebP)을 확인하세요.

**Q: Web UI가 시작되지 않음**
A: `FORCE_WEB=true`를 설정하거나 방화벽 설정을 확인하세요.

**Q: UV 캐시가 디스크 공간을 너무 많이 차지함**
A: `uvx` 명령을 자주 사용하면 캐시가 수십 GB까지 누적될 수 있습니다. 정기적인 정리를 권장합니다:

```bash
# 캐시 크기 및 상세 정보 확인
python scripts/cleanup_cache.py --size

# 정리 내용 미리보기 (실제 정리 없음)
python scripts/cleanup_cache.py --dry-run

# 표준 정리 실행
python scripts/cleanup_cache.py --clean

# 강제 정리 (관련 프로세스 종료 시도, Windows 파일 잠금 문제 해결)
python scripts/cleanup_cache.py --force

# 또는 uv 명령 직접 사용
uv cache clean
```

자세한 지침은 [캐시 관리 가이드](docs/en/cache-management.md)를 참조하세요.

**Q: AI 모델이 이미지를 파싱할 수 없음**
A: 다양한 AI 모델(Gemini Pro 2.5, Claude 등 포함)은 이미지 파싱에 불안정성을 보일 수 있으며, 업로드된 이미지 내용을 정확히 식별할 때도 있고 파싱하지 못할 때도 있습니다. 이는 AI 시각 이해 기술의 알려진 한계입니다. 권장 사항:

1. 이미지 품질 확인 (고대비, 명확한 텍스트)
2. 여러 번 업로드 시도, 재시도는 일반적으로 성공함
3. 계속 파싱 실패 시 이미지 크기 또는 형식 조정 시도

## 라이선스

MIT 라이선스 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요
