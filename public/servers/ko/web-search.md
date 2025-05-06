---
name: 웹 검색
digest: MCP 서버는 API 키 없이도 Google 검색 결과를 활용하여 무료 웹 검색 기능을 제공하며, 온라인 정보 검색을 위한 간편하고 접근 가능한 솔루션을 제공합니다.
author: pskill9
homepage: https://github.com/pskill9/web-search
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 검색
  - 웹
  - 서버
icon: https://avatars.githubusercontent.com/u/188422281?s=48&v=4
createTime: 2024-12-30
---

API 키가 필요 없이 Google 검색 결과를 사용하여 무료 웹 검색을 가능하게 하는 모델 컨텍스트 프로토콜(MCP) 서버입니다.

## 기능

- Google 검색 결과를 이용한 웹 검색
- API 키 또는 인증 불필요
- 제목, URL, 설명이 포함된 구조화된 결과 반환
- 검색당 반환 결과 수 조정 가능

## 설치 방법

1. 이 저장소를 클론 또는 다운로드
2. 의존성 설치:

```bash
npm install
```

3. 서버 빌드:

```bash
npm run build
```

4. MCP 구성에 서버 추가:

VSCode(Claude Dev 확장)용:

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search/build/index.js"]
    }
  }
}
```

Claude 데스크톱용:

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search/build/index.js"]
    }
  }
}
```

## 사용 방법

서버는 다음과 같은 매개변수를 받는 `search`라는 단일 도구를 제공합니다:

```typescript
{
  "query": string,    // 검색 쿼리
  "limit": number     // 선택사항: 반환할 결과 수 (기본값: 5, 최대: 10)
}
```

사용 예시:

```typescript
use_mcp_tool({
  server_name: "web-search",
  tool_name: "search",
  arguments: {
    query: "검색할 내용",
    limit: 3, // 선택사항
  },
});
```

응답 예시:

```json
[
  {
    "title": "검색 결과 예시",
    "url": "https://example.com",
    "description": "검색 결과에 대한 설명..."
  }
]
```

## 제한 사항

이 도구는 Google 검색 결과의 웹 스크래핑을 사용하므로 다음과 같은 중요한 제한 사항이 있습니다:

1. **속도 제한**:

   - 짧은 시간에 너무 많은 검색을 수행하면 Google이 일시적으로 요청을 차단할 수 있습니다. 이를 방지하려면:
     - 적절한 검색 빈도 유지
     - limit 매개변수 신중하게 사용
     - 필요 시 검색 간 지연 구현 고려

2. **결과 정확도**:

   - 도구는 Google의 HTML 구조에 의존하며 이는 변경될 수 있음
   - 일부 결과에는 설명이나 기타 메타데이터가 누락될 수 있음
   - 복잡한 검색 연산자가 예상대로 작동하지 않을 수 있음

3. **법적 고려 사항**:
   - 이 도구는 개인적인 용도로만 사용
   - Google의 서비스 약관 준수
   - 사용 사례에 적합한 속도 제한 구현 고려
