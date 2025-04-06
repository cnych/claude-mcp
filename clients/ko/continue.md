---
name: Continue
digest: Continue는 맞춤형 AI 코드 어시스턴트를 생성, 공유 및 사용할 수 있는 통합 허브로, 오픈소스 IDE 플러그인과 모델, 규칙, 프롬프트, 문서 및 기타 구성 요소를 통합합니다
author: Continue
homepage: https://www.continue.dev
repository: https://github.com/continuedev/continue
icon: /icons/continuedev.jpeg
windows: true
mac: true
linux: true
featured: true
tags:
  - 플러그인
  - 프로그래밍
  - Continue
  - VSCode
  - JetBrains
createTime: 2023-02-01
---

# Continue Dev: 프로그래밍 지원 경험의 재정의

Continue Dev는 AI 기술을 통해 개발자의 프로그래밍 경험을 완전히 변화시키는 혁신적인 오픈소스 프로젝트입니다. 강력한 IDE 확장 도구로서, Continue는 인공지능을 개발 환경에 원활하게 통합하여 코딩 효율성을 크게 향상시키고 개발 난이도를 낮춥니다. 이 글에서는 Continue Dev의 핵심 기능, 아키텍처 설계, 사용 시나리오 및 Model Control Protocol(MCP)과의 긴밀한 통합에 대해 자세히 살펴보겠습니다.

![continue dev plugin ui](/images/continuedev-ui.png)

## 핵심 기능 및 특징

### 1. 다중 IDE 지원

Continue는 다양한 IDE를 지원합니다:

- Visual Studio Code
- JetBrains 제품군(IntelliJ IDEA, PyCharm, WebStorm 등)
- Cursor 에디터

이러한 크로스 플랫폼 호환성은 개발자가 자신에게 익숙한 개발 환경에서 Continue의 강력한 기능을 사용할 수 있도록 보장합니다.

### 2. 맞춤형 AI 코드 어시스턴트

Continue의 핵심 장점은 고도로 맞춤화 가능한 AI 코드 어시스턴트입니다:

- **맞춤형 프롬프트 템플릿**: 개발자는 특정 작업에 맞는 프롬프트 템플릿을 생성하고 공유할 수 있습니다
- **다중 모델 지원**: GPT-4, Claude, PaLM, Ollama, Llama2 등 다양한 AI 모델 지원
- **컨텍스트 인식**: 코드베이스 구조를 자동으로 분석하여 현재 코딩 컨텍스트와 관련된 제안 제공
- **다중 언어 지원**: 거의 모든 주요 프로그래밍 언어 지원

### 3. 코드베이스 이해

Continue는 강력한 코드 이해 능력을 갖추고 있습니다:

- 관련 파일 및 종속성 자동 가져오기
- 프로젝트 구조 및 코드 규칙 지능적 분석
- 기존 코드의 스타일과 패턴에 맞는 일관된 새 코드 생성
- 복잡한 코드 관계 및 종속성 그래프 식별

### 4. 협업 기능

- 팀이 맞춤형 어시스턴트 구성을 공유할 수 있음
- 버전 관리 및 협업 편집 지원
- AI 생성 코드 제안 추적 및 감사 가능

## Model Control Protocol(MCP)과의 통합

Continue Dev는 Model Control Protocol(MCP)을 지원하는 최초의 개발 도구 중 하나로, 이 통합은 개발자에게 강력한 기능 확장과 유연성을 제공합니다.

![continue dev x mcp](/images/continue-x-mcp.png)

## 기술 아키텍처

Continue Dev의 아키텍처 설계는 성능, 확장성 및 보안성을 충분히 고려했습니다:

### 1. 핵심 구성 요소

- **IDE 확장**: 개발 환경에 직접 통합되는 프론트엔드 인터페이스
- **Continue 엔진**: 코드 분석 및 AI 모델 상호작용을 처리하는 핵심 구성 요소
- **MCP 어댑터**: Continue의 요청을 MCP 호환 형식으로 변환하는 역할
- **웹 서버**: REST API 및 WebSocket 지원 제공

### 2. 데이터 흐름

1. 개발자가 IDE에서 Continue 작업을 트리거
2. Continue 엔진이 현재 코드 컨텍스트 분석
3. MCP 어댑터를 통해 구성된 AI 모델로 요청 전송
4. 모델이 응답을 생성하고 후처리 후 개발자에게 표시
5. 모든 상호작용은 웹 인터페이스를 통해 모니터링 및 관리 가능

### 3. 보안 고려사항

Continue Dev는 설계상 코드 보안을 매우 중요시합니다:

- 모든 민감한 코드 분석은 기본적으로 로컬에서 수행
- 세분화된 데이터 공유 제어 제공
- 완전히 오프라인으로 작동하는 로컬 실행 오픈소스 모델 지원
- 엔터프라이즈급 암호화 및 접근 제어 옵션

## 향후 개발 방향

Continue Dev 팀은 다음 기능을 적극적으로 개발 중입니다:

1. **향상된 MCP 통합**:

   - 더 많은 MCP 호환 모델 지원
   - MCP 표준의 확장 기능 개선
   - 전용 MCP 디버깅 도구 개발

2. **고급 코드 생성 기능**:

   - 완전한 기능 모듈의 자동 생성
   - 테스트 케이스 기반 코드 자동 구현
   - 지능형 리팩토링 제안

3. **팀 협업 강화**:

   - CI/CD 프로세스 통합
   - 팀 수준의 AI 지원 코드 리뷰
   - 지식 베이스 및 모범 사례 공유

4. **웹 인터페이스 업그레이드**:
   - 더 풍부한 시각화 분석 도구
   - 맞춤형 대시보드 및 보고서
   - 개선된 다중 사용자 지원

## 결론

Continue Dev는 포괄적인 MCP 웹 통합을 통해 개발자와 AI의 협업 프로그래밍 방식을 완전히 변화시켰습니다. 오픈소스 특성, 유연한 아키텍처 및 강력한 기능으로 현대 소프트웨어 개발 워크플로우의 핵심 도구가 되었습니다. 개인 개발자, 교육 기관 또는 대기업 모두에게 Continue Dev는 효율적이고 지능적인 프로그래밍 지원 솔루션을 제공합니다.

MCP 표준이 계속 발전하고 개선됨에 따라 Continue Dev는 기능을 지속적으로 확장하여 개발자에게 더 스마트하고 효율적인 프로그래밍 경험을 제공할 것입니다. 이 혁신적인 도구가 소프트웨어 개발의 미래를 어떻게 계속 추진할지 기대됩니다.
