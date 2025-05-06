---
name: MCPControl
digest: 모델 컨텍스트 프로토콜을 위한 Windows 제어 서버로 마우스/키보드 입력, 창 관리, 화면 캡처와 같은 시스템 작업을 프로그래밍 방식으로 자동화하여 워크플로우 제어를 간소화합니다.
author: Cheffromspace
repository: https://github.com/Cheffromspace/MCPControl
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - windows
  - 자동화
  - 제어
icon: https://avatars.githubusercontent.com/u/21370528?v=4
createTime: 2024-12-04
---

모델 컨텍스트 프로토콜을 위한 Windows 제어 서버로, 마우스, 키보드, 창 관리 및 화면 캡처 기능을 포함한 시스템 작업을 프로그래밍 방식으로 제어할 수 있습니다.

> **참고**: 이 프로젝트는 현재 Windows만 지원합니다.

## ⚠️ 중요한 고지 사항

**이 소프트웨어는 실험적이며 잠재적으로 위험할 수 있습니다**

이 소프트웨어를 사용함으로써 다음 사항을 인지하고 동의하는 것으로 간주합니다:

- 이 도구를 통해 AI 모델이 컴퓨터를 직접 제어하는 것은 본질적으로 위험합니다
- 이 소프트웨어는 마우스, 키보드 및 기타 시스템 기능을 제어할 수 있으며 의도하지 않은 결과를 초래할 수 있습니다
- 이 소프트웨어는 전적으로 사용자의 책임하에 사용됩니다
- 이 프로젝트의 제작자와 기여자는 이 소프트웨어 사용으로 인해 발생할 수 있는 손상, 데이터 손실 또는 기타 결과에 대해 어떠한 책임도 지지 않습니다
- 이 도구는 적절한 안전 조치가 마련된 통제된 환경에서만 사용해야 합니다

## 기능

- **창 관리**

  - 모든 창 목록 표시
  - 활성 창 정보 가져오기
  - 창 제목 가져오기
  - 창 크기 및 위치 가져오기
  - 창 포커스
  - 창 크기 조정
  - 창 위치 변경

- **마우스 제어**

  - 마우스 이동
  - 클릭 작업
  - 스크롤 기능
  - 드래그 작업
  - 커서 위치 추적

- **키보드 제어**

  - 텍스트 입력
  - 키 조합
  - 키 누름/놓기 작업
  - 키 홀드 기능

- **화면 작업**

  - 화면 캡처
  - 화면 크기 가져오기
  - 활성 창 감지

- **클립보드 통합**
  - 클립보드 내용 가져오기
  - 클립보드 내용 설정
  - 클립보드 지우기
  - 클립보드 상태 확인

## 사용 방법

[MCP 서버 구성](#mcp-서버-구성) 섹션에 표시된 대로 Claude MCP 설정을 구성하여 MCPControl을 사용하세요. 설치가 필요 없습니다!

### 소스에서 빌드

#### 개발 요구 사항

이 프로젝트를 개발용으로 빌드하려면 다음이 필요합니다:

1. Windows 운영 체제 (keysender 종속성에 필요)
2. Node.js 18 이상 (빌드 도구가 포함된 공식 Windows 설치 프로그램 사용)
3. npm 패키지 관리자
4. 네이티브 빌드 도구:
   - node-gyp: `npm install -g node-gyp`
   - cmake-js: `npm install -g cmake-js`

## MCP 서버 구성

이 프로젝트를 사용하려면 필요한 빌드 도구가 필요합니다:

1. 공식 Windows 설치 프로그램을 사용하여 Node.js 설치 (필수 빌드 도구 포함)
2. 추가 필요한 도구 설치:

```
npm install -g node-gyp
npm install -g cmake-js
```

그런 다음 MCP 설정에 다음 구성을 추가하세요:

```json
{
  "mcpServers": {
    "MCPControl": {
      "command": "npx",
      "args": ["--no-cache", "-y", "mcp-control"]
    }
  }
}
```

## 프로젝트 구조

- `/src`
  - `/handlers` - 요청 핸들러 및 도구 관리
  - `/tools` - 핵심 기능 구현
  - `/types` - TypeScript 타입 정의
  - `index.ts` - 주요 애플리케이션 진입점

## 종속성

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - 프로토콜 구현을 위한 MCP SDK
- [keysender](https://www.npmjs.com/package/keysender) - Windows 전용 UI 자동화 라이브러리
- [clipboardy](https://www.npmjs.com/package/clipboardy) - 클립보드 처리
- [sharp](https://www.npmjs.com/package/sharp) - 이미지 처리
- [uuid](https://www.npmjs.com/package/uuid) - UUID 생성

## 알려진 제한 사항

- 창 최소화/복원 작업은 현재 지원되지 않음
- 다중 화면 기능은 설정에 따라 예상대로 작동하지 않을 수 있음
- get_screenshot 유틸리티는 VS Code Extension Cline에서 작동하지 않음
- 일부 작업은 대상 애플리케이션에 따라 상승된 권한이 필요할 수 있음
- Windows만 지원됨
- 클릭 정확도는 현재 1280x720 해상도, 단일 화면에서 가장 잘 작동함

## 라이선스

MIT 라이선스.
