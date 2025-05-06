---
name: PixVerse MCP
digest: PixVerse는 Claude 및 Cursor와 같은 MCP 지원 앱을 통해 접근할 수 있는 비디오 생성 모델을 제공하여 기존 워크플로우 내에서 원활한 AI 기반 비디오 제작을 가능하게 합니다.
author: PixVerseAI
homepage: https://github.com/PixVerseAI/PixVerse-MCP
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 비디오
  - API
  - 파이썬
icon: https://avatars.githubusercontent.com/u/204290266?v=4
createTime: 2025-04-17
---
Model Context Protocol (MCP)을 지원하는 Claude 또는 Cursor와 같은 애플리케이션을 통해 PixVerse의 최신 비디오 생성 모델에 접근할 수 있는 도구입니다.

## 개요

PixVerse MCP는 Claude 또는 Cursor와 같은 MCP 지원 애플리케이션을 통해 PixVerse의 최신 비디오 생성 모델에 접근할 수 있는 도구입니다. 이 통합을 통해 텍스트-투-비디오, 이미지-투-비디오 등을 포함한 고품질 비디오를 언제 어디서나 생성할 수 있습니다.

## 주요 기능

- **텍스트-투-비디오 생성**: 텍스트 프롬프트를 사용하여 창의적인 비디오 생성
- **유연한 파라미터 제어**: 비디오 품질, 길이, 종횡비 등 조정 가능
- **AI 어시스턴트와의 공동 창작**: Claude와 같은 AI 모델과 협업하여 창의적인 워크플로우 강화

## 시스템 구성 요소

시스템은 두 가지 주요 구성 요소로 이루어져 있습니다:

1. **UVX MCP 서버**
   - 파이썬 기반 클라우드 서버
   - PixVerse API와 직접 통신
   - 완전한 비디오 생성 기능 제공

## 설치 및 구성

### 필수 조건

1. Python 3.10 이상
2. UV/UVX
3. PixVerse API 키: PixVerse 플랫폼에서 획득 (이 기능은 API 크레딧이 필요하며, [PixVerse 플랫폼](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp)에서 별도로 구매해야 합니다)

### 의존성 설치

1. **Python**:
   - 공식 Python 웹사이트에서 다운로드 및 설치
   - 시스템 경로에 Python이 추가되었는지 확인

2. **UV/UVX**:
   - uv를 설치하고 Python 프로젝트 및 환경 설정:

#### Mac/Linux
```
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Windows
```
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## MCP 서버 사용 방법

### 1. PixVerse API 키 획득
- [PixVerse 플랫폼](https://platform.pixverse.ai?utm_source=github&utm_medium=readme&utm_campaign=mcp) 방문
- 계정 등록 또는 로그인
- 계정 설정에서 API 키 생성 및 복사
- [API 키 생성 가이드](https://docs.platform.pixverse.ai/how-to-get-api-key-882968m0)

### 2. 필요한 의존성 다운로드
- **Python**: Python 3.10 이상 설치
- **UV/UVX**: 최신 안정 버전의 UV & UVX 설치

### 3. MCP 클라이언트 구성
- MCP 클라이언트(예: Claude for Desktop 또는 Cursor) 열기
- 클라이언트 설정 찾기
- mcp_config.json(또는 관련 구성 파일) 열기
- 사용하는 방법에 따라 구성 추가:

```json
{
  "mcpServers": {
    "PixVerse": {
      "command": "uvx",
      "args": [
        "pixverse-mcp"
      ],
      "env": {
        "PIXVERSE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

- platform.pixverse.ai에서 얻은 API 키를 `"PIXVERSE_API_KEY": "xxxx"` 아래에 추가
- 구성 파일 저장

### 5. MCP 클라이언트 재시작 또는 MCP 서버 새로 고침
- MCP 클라이언트 완전히 닫고 다시 열기
- 또는 지원되는 경우 "MCP 서버 새로 고침" 옵션 사용

## 클라이언트별 구성

### Claude for Desktop

1. Claude 애플리케이션 열기
2. Claude > 설정 > 개발자 > 구성 편집으로 이동
3. claude_desktop_config.json 파일 열기
   - Windows
   - Mac : ~/Library/Application\ Support/Claude/claude_desktop_config.json
4. 위의 구성 추가 및 저장
5. Claude 재시작
   - 성공적으로 연결된 경우: 홈페이지에 오류가 표시되지 않고 MCP 상태가 녹색으로 표시됨
   - 연결 실패 시: 홈페이지에 오류 메시지 표시됨

### Cursor

1. Cursor 애플리케이션 열기
2. 설정 > Model Context Protocol으로 이동
3. 새 서버 추가
4. 위의 JSON 구성과 같이 서버 세부 정보 입력
5. 저장하고 MCP 서버 재시작 또는 새로 고침

## 사용 예시

### 텍스트-투-비디오

Claude 또는 Cursor를 통해 자연어 프롬프트를 사용하여 비디오 생성.

**기본 예시**:
```
바다 위로 지는 해질녘 비디오 생성. 황금빛 햇살이 물에 반사되며 파도가 부드럽게 해안을 때립니다.
```

**파라미터가 포함된 고급 예시**:
```
다음 파라미터로 야간 도시 풍경 비디오 생성:
내용: 밤하늘 아래 반짝이는 고층 건물의 불빛, 도로 위 자동차 불빛이 줄을 이룸
종횡비: 16:9
품질: 540p
지속 시간: 5초
모션 모드: 일반
부정 프롬프트: 흐림, 흔들림, 텍스트
```

**지원되는 파라미터**:
- 종횡비: 16:9, 4:3, 1:1, 3:4, 9:16
- 지속 시간: 5초 또는 8초
- 품질: 360p, 540p, 720p, 1080p
- 모션 모드: 일반 또는 빠름

### 스크립트 + 비디오

상세한 장면 설명 또는 샷 리스트를 사용하여 더 구조화된 비디오 생성.

**장면 설명 예시**:
```
장면: 이른 아침 해변.
해가 떠오르며 바다에 황금빛 반사를 비춥니다.
모래 위로 발자국이 이어집니다.
부드러운 파도가 물러나며 하얀 거품을 남깁니다.
작은 배가 잔잔한 바다를 가로질러 천천히 항해합니다.
종횡비: 16:9, 품질: 540p, 지속 시간: 5초.
```

**샷별 예시**:
```
이 스토리보드를 기반으로 비디오 생성:
- 시작: 증기가 오르는 커피 컵의 상단 샷
- 클로즈업: 커피 표면의 물결과 질감
- 전환: 저어서 소용돌이 생성
- 끝: 컵 옆에 펼쳐진 책과 안경
형식: 1:1 정사각형, 품질: 540p, 모션: 빠름
```
- Claude Desktop은 스토리보드 이미지 입력도 지원합니다.

### 원클릭 비디오

특정 테마 또는 스타일의 비디오를 상세한 설명 없이 빠르게 생성.

**테마 예시**:
```
네온 불빛과 홀로그램 투영을 포함한 미래 기술 테마의 비디오 생성.
```

**스타일 예시**:
```
밝고 몽환적인 색상의 피어나는 꽃을 물감 스타일로 비디오 생성.
```

### 창의성 + 비디오

AI의 창의성과 비디오 생성 결합.

**스타일 변환 예시**:
```
이 도시 풍경 사진을 레트로 스타일로 재해석하고 비디오 프롬프트 제공.
```

**스토리 프롬프트 예시**:
```
이 거리 사진이 영화의 오프닝 장면이라면 다음에 무슨 일이 일어날까요? 짧은 비디오 컨셉 제공.
```

**감정적 장면 예시**:
```
이 숲길 사진을 보고 짧은 비디오 컨셉을 디자인하세요, 마이크로 스토리 또는 감정적 진행이 있는 장면.
```

## FAQ

**PixVerse API 키를 어떻게 얻나요?**
- PixVerse 플랫폼에 등록하고 계정의 "API-KEY"에서 생성하세요.

**서버가 응답하지 않으면 어떻게 해야 하나요?**
1. API 키가 유효한지 확인
2. 구성 파일 경로가 올바른지 확인
3. 오류 로그 확인(일반적으로 Claude 또는 Cursor의 로그 폴더에 있음)

**MCP는 이미지-투-비디오 또는 키프레임 기능을 지원하나요?**
- 아직 아닙니다. 이러한 기능은 PixVerse API를 통해서만 사용할 수 있습니다. [API 문서](https://docs.platform.pixverse.ai)

**크레딧을 어떻게 얻나요?**
- API 플랫폼에서 아직 충전하지 않았다면 먼저 충전하세요. [PixVerse 플랫폼](https://platform.pixverse.ai/billing?utm_source=github&utm_medium=readme&utm_campaign=mcp)

**어떤 비디오 형식과 크기가 지원되나요?**
- PixVerse는 360p부터 1080p까지의 해상도와 9:16(세로)부터 16:9(가로)까지의 종횡비를 지원합니다.
- 출력 품질을 테스트하기 위해 540p와 5초 비디오로 시작하는 것을 권장합니다.

**생성된 비디오는 어디에서 찾을 수 있나요?**
- 비디오를 보기, 다운로드 또는 공유할 수 있는 URL 링크를 받게 됩니다.

**비디오 생성에는 얼마나 걸리나요?**
- 일반적으로 복잡성, 서버 부하 및 네트워크 상태에 따라 30초에서 2분 정도 소요됩니다.

**spawn uvx ENOENT 오류가 발생하면 어떻게 해야 하나요?**
- 이 오류는 일반적으로 UV/UVX 설치 경로가 잘못되어 발생합니다. 다음과 같이 해결할 수 있습니다:

Mac/Linux:
```
sudo cp ./uvx /usr/local/bin
```

Windows:
1. 터미널에서 다음 명령을 실행하여 UV/UVX 설치 경로 확인:
```
where uvx
```
2. 파일 탐색기를 열고 uvx/uv 파일 위치 확인.
3. 파일을 다음 디렉토리 중 하나로 이동:
   - C:\Program Files (x86) 또는 C:\Program Files

## 커뮤니티 및 지원
### 커뮤니티
- 업데이트를 받고, 창작물을 공유하며, 도움을 받거나 피드백을 제공하려면 [Discord 서버](https://discord.gg/pixverse)에 참여하세요.

### 기술 지원
- 이메일: api@pixverse.ai
- 웹사이트: https://platform.pixverse.ai

## 릴리스 노트
v1.0.0
- MCP를 통한 텍스트-투-비디오 생성 지원
- 비디오 링크 검색 가능
- Claude 및 Cursor와 통합하여 워크플로우 강화
- 클라우드 기반 Python MCP 서버 지원