---
name: Cloudflare MCP 서버
digest: Cloudflare 개발자 플랫폼(예: Workers/KV/R2/D1)에서 리소스를 배포, 구성 및 조회할 수 있습니다
author: Cloudflare
homepage: https://github.com/cloudflare/mcp-server-cloudflare
repository: https://github.com/cloudflare/mcp-server-cloudflare
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - cloudflare
  - workers
  - kv
  - r2
  - d1
icon: https://cdn.simpleicons.org/cloudflare
createTime: 2024-12-01T00:00:00Z
---

모델 컨텍스트 프로토콜(MCP)은 대형 언어 모델(LLM)과 외부 시스템 간의 컨텍스트를 관리하기 위한 [새로운 표준화된 프로토콜](https://www.claudemcp.com)입니다. 이 저장소에서는 [Cloudflare API](https://api.cloudflare.com)를 위한 설치 프로그램과 MCP 서버를 제공합니다.

이를 통해 Claude Desktop 또는 모든 MCP 클라이언트를 사용하여 자연어로 Cloudflare 계정에서 다음과 같은 작업을 수행할 수 있습니다:

- `예제 durable object가 포함된 새 Worker를 배포해 주세요.`
- `'...'라는 이름의 D1 데이터베이스에 있는 데이터에 대해 알려주실 수 있나요?`
- `'...'라는 KV 네임스페이스의 모든 항목을 '...'라는 R2 버킷으로 복사해 주실 수 있나요?`

## 데모

[![Workers, KV, D1과 같은 Cloudflare 속성을 탐색하기 위해 새로 출시된 MCP 서버 시연.](/images/mcp-cloudflare-cover.jpg)](https://www.youtube.com/watch?v=vGajZpl_9yA)

## 설정

1. `npx @cloudflare/mcp-server-cloudflare init` 실행

![예제 콘솔 출력](/images/mcp-cloudflare-init.jpg)

2. Claude Desktop를 다시 시작하면 다음과 같은 사용 가능한 도구를 보여주는 작은 🔨 아이콘이 표시됩니다:

![예제 도구 아이콘](/images/mcp-cloudflare-tool-icon.jpg)

![예제 도구 목록](/images/mcp-cloudflare-tool-list.jpg)

## 기능

### KV 스토어 관리

- `get_kvs`: 계정의 모든 KV 네임스페이스 나열
- `kv_get`: KV 네임스페이스에서 값 가져오기
- `kv_put`: KV 네임스페이스에 값 저장
- `kv_list`: KV 네임스페이스의 키 나열
- `kv_delete`: KV 네임스페이스에서 키 삭제

### R2 스토리지 관리

- `r2_list_buckets`: 계정의 모든 R2 버킷 나열
- `r2_create_bucket`: 새 R2 버킷 생성
- `r2_delete_bucket`: R2 버킷 삭제
- `r2_list_objects`: R2 버킷의 객체 나열
- `r2_get_object`: R2 버킷에서 객체 가져오기
- `r2_put_object`: R2 버킷에 객체 넣기
- `r2_delete_object`: R2 버킷에서 객체 삭제

### D1 데이터베이스 관리

- `d1_list_databases`: 계정의 모든 D1 데이터베이스 나열
- `d1_create_database`: 새 D1 데이터베이스 생성
- `d1_delete_database`: D1 데이터베이스 삭제
- `d1_query`: D1 데이터베이스에 대해 SQL 쿼리 실행

### Workers 관리

- `worker_list`: 계정의 모든 Workers 나열
- `worker_get`: Worker의 스크립트 내용 가져오기
- `worker_put`: Worker 스크립트 생성 또는 업데이트
- `worker_delete`: Worker 스크립트 삭제

### 분석

- `analytics_get`: 도메인에 대한 분석 데이터 검색
  - 요청, 대역폭, 위협, 페이지 뷰와 같은 지표 포함
  - 날짜 범위 필터링 지원

## 개발

현재 프로젝트 폴더에서 다음을 실행합니다:

```
pnpm install
pnpm build:watch
```

그런 다음 두 번째 터미널에서:

```
node dist/index.js init
```

이 명령은 Claude Desktop를 로컬 설치 버전에 연결하여 테스트할 수 있도록 합니다.

## 클라이언트 외부에서 사용

서버를 로컬에서 실행하려면 `node dist/index run <account-id>`을 실행합니다.

대체 MCP 클라이언트를 사용하거나 로컬에서 테스트하는 경우 `tools/list` 명령을 실행하여 모든 사용 가능한 도구 목록을 업데이트하고 이를 직접 호출할 수 있습니다.

### Workers

```javascript
// List workers
worker_list();

// Get worker code
worker_get({ name: "my-worker" });

// Update worker
worker_put({
  name: "my-worker",
  script: "export default { async fetch(request, env, ctx) { ... }}",
  bindings: [
    {
      type: "kv_namespace",
      name: "MY_KV",
      namespace_id: "abcd1234",
    },
    {
      type: "r2_bucket",
      name: "MY_BUCKET",
      bucket_name: "my-files",
    },
  ],
  compatibility_date: "2024-01-01",
  compatibility_flags: ["nodejs_compat"],
});

// Delete worker
worker_delete({ name: "my-worker" });
```

### KV 스토어

```javascript
// List KV namespaces
get_kvs();

// Get value
kv_get({
  namespaceId: "your_namespace_id",
  key: "myKey",
});

// Store value
kv_put({
  namespaceId: "your_namespace_id",
  key: "myKey",
  value: "myValue",
  expirationTtl: 3600, // optional, in seconds
});

// List keys
kv_list({
  namespaceId: "your_namespace_id",
  prefix: "app_", // optional
  limit: 10, // optional
});

// Delete key
kv_delete({
  namespaceId: "your_namespace_id",
  key: "myKey",
});
```

### R2 스토리지

```javascript
// 버킷 나열
r2_list_buckets();

// 버킷 생성
r2_create_bucket({ name: "my-bucket" });

// Delete bucket
r2_delete_bucket({ name: "my-bucket" });

// List objects in bucket
r2_list_objects({
  bucket: "my-bucket",
  prefix: "folder/", // optional
  delimiter: "/", // optional
  limit: 1000, // optional
});

// Get object
r2_get_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
});

// Put object
r2_put_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
  content: "Hello, World!",
  contentType: "text/plain", // optional
});

// Delete object
r2_delete_object({
  bucket: "my-bucket",
  key: "folder/file.txt",
});
```

### D1 데이터베이스

```javascript
// 데이터베이스 나열
d1_list_databases();

// 데이터베이스 생성
d1_create_database({ name: "my-database" });

// Delete database
d1_delete_database({ databaseId: "your_database_id" });

// Execute a single query
d1_query({
  databaseId: "your_database_id",
  query: "SELECT * FROM users WHERE age > ?",
  params: ["25"], // optional
});

// Create a table
d1_query({
  databaseId: "your_database_id",
  query: `
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `,
});
```

### 분석

```javascript
// 오늘의 분석 가져오기
analytics_get({
  zoneId: "your_zone_id",
  since: "2024-11-26T00:00:00Z",
  until: "2024-11-26T23:59:59Z",
});
```

## 기여

기여를 환영합니다! 자유롭게 Pull Request를 제출하세요.
