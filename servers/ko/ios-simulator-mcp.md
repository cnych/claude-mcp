---
name: iOS Simulator MCP Server
digest: MCP 서버는 iOS 시뮬레이터와 상호작용할 수 있도록 하여, 시뮬레이터 정보 조회, UI 동작 제어, 테스트 및 개발 목적의 UI 요소 검사 기능을 제공합니다.
author: joshuayoes
homepage: https://github.com/joshuayoes/ios-simulator-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ios
  - 시뮬레이터
  - 자동화
icon: https://avatars.githubusercontent.com/u/37849890?v=4
createTime: 2025-03-20
---
iOS 시뮬레이터와 상호작용하기 위한 Model Context Protocol (MCP) 서버입니다. 이 서버를 통해 iOS 시뮬레이터에 대한 정보를 얻고, UI 상호작용을 제어하며, UI 요소를 검사할 수 있습니다.

## 기능

- 현재 부팅된 iOS 시뮬레이터의 ID 확인
- 시뮬레이터 UI와 상호작용:
  - 화면의 모든 접근성 요소 설명
  - 화면 좌표 탭
  - 텍스트 입력
  - 좌표 간 스와이프
  - 특정 좌표의 UI 요소 정보 확인
  - 시뮬레이터 화면 스크린샷 촬영
- 환경 변수를 사용하여 특정 도구 필터링

## 설정

### 환경 변수

- `IOS_SIMULATOR_MCP_FILTERED_TOOLS`: 등록에서 제외할 도구 이름의 쉼표로 구분된 목록. 예: `screenshot,record_video,stop_recording`

## 사용 사례: 에이전트 모드에서의 QA 단계

이 MCP는 기능 구현 직후 UI 일관성과 올바른 동작을 보장하는 품질 보증 단계로 에이전트 모드에서 효과적으로 사용할 수 있습니다.

### 사용 방법

기능 구현 후:

1. Cursor에서 에이전트 모드를 활성화합니다.
2. 아래 프롬프트를 사용하여 UI 상호작용을 빠르게 검증하고 문서화합니다.

### 예제 프롬프트

- **UI 요소 확인:**

  ```
  현재 화면의 모든 접근성 요소 확인
  ```

- **텍스트 입력 확인:**

  ```
  텍스트 입력 필드에 "QA 테스트"를 입력하고 입력이 올바른지 확인
  ```

- **탭 응답 확인:**

  ```
  좌표 x=250, y=400을 탭하고 예상 요소가 트리거되는지 확인
  ```

- **스와이프 동작 검증:**

  ```
  x=150, y=600에서 x=150, y=100으로 스와이프하고 올바른 동작 확인
  ```

- **상세 요소 확인:**

  ```
  위치 x=300, y=350의 UI 요소를 설명하여 적절한 라벨링과 기능 확인
  ```

- **스크린샷 촬영:**

  ```
  현재 시뮬레이터 화면의 스크린샷을 촬영하여 my_screenshot.png로 저장
  ```

- **비디오 녹화:**

  ```
  시뮬레이터 화면 녹화 시작 (기본적으로 ~/Downloads/simulator_recording_$DATE.mp4에 저장)
  ```

- **녹화 중지:**
  ```
  현재 시뮬레이터 화면 녹화 중지
  ```

## 필수 조건

- Node.js
- macOS (iOS 시뮬레이터는 macOS에서만 사용 가능)
- [Xcode](https://developer.apple.com/xcode/resources/) 및 iOS 시뮬레이터 설치
- Facebook [IDB](https://fbidb.io/) 도구 [(설치 가이드 참조)](https://fbidb.io/docs/installation)

## 설치

### 옵션 1: NPX 사용 (권장)

1. Cursor MCP 설정 편집:

   ```bash
   cursor ~/.cursor/mcp.json
   ```

2. iOS 시뮬레이터 서버를 설정에 추가:

   ```json
   {
     "mcpServers": {
       "ios-simulator": {
         "command": "npx",
         "args": ["-y", "ios-simulator-mcp"]
       }
     }
   }
   ```

3. Cursor 재시작.

### 옵션 2: 로컬 개발

1. 저장소 복제:

   ```bash
   git clone https://github.com/joshuayoes/ios-simulator-mcp
   cd ios-simulator-mcp
   ```

2. 의존성 설치:

   ```bash
   npm install
   ```

3. 프로젝트 빌드:

   ```bash
   npm run build
   ```

4. Cursor MCP 설정 편집:

   ```bash
   cursor ~/.cursor/mcp.json
   ```

5. iOS 시뮬레이터 서버를 설정에 추가:

   ```json
   {
     "mcpServers": {
       "ios-simulator": {
         "command": "node",
         "args": ["/path/to/your/ios-simulator-mcp/build/index.js"]
       }
     }
   }
   ```

   `"/path/to/your"`를 프로젝트 디렉토리의 실제 경로로 대체합니다.

6. Cursor 재시작.

## 라이선스

MIT