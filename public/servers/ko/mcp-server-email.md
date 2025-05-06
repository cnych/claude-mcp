---
name: MCP Email Server
digest: 📧 이메일 기능을 제공하는 Model Context Protocol 서버입니다. 이 서버는 LLM이 이메일을 작성하고 전송하며, 지정된 디렉토리에서 첨부 파일을 검색할 수 있도록 합니다.
author: Shy2593666979
repository: https://github.com/Shy2593666979/mcp-server-email
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 이메일
  - SMTP
  - 검색
icon: https://avatars.githubusercontent.com/u/105286202?v=4
createTime: 2025-03-23
---

이메일 기능을 제공하는 [Model Context Protocol](/ko) 서버입니다. 이 서버는 LLM이 이메일을 작성하고 전송하며, 지정된 디렉토리에서 첨부 파일을 검색할 수 있도록 합니다.
![1742711978001](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-3f2f5e52.jpg)

![1742712768132](https://static.claudemcp.com/servers/Shy2593666979/mcp-server-email/Shy2593666979-mcp-server-email-8d59fdeb.jpg)

## 기능

- 여러 수신자에게 이메일 전송
- 이메일 첨부 파일 지원
- 패턴 매칭을 기반으로 디렉토리에서 파일 검색
- SMTP를 사용한 안전한 이메일 전송

### 사용 가능한 도구

- `send_email` - 제공된 제목, 본문 및 수신자에 따라 이메일을 전송합니다.

  - `receiver` (문자열 배열, 필수): 수신자 이메일 주소 목록
  - `body` (문자열, 필수): 이메일의 본문 내용
  - `subject` (문자열, 필수): 이메일의 제목
  - `attachments` (문자열 배열 또는 문자열, 선택 사항): 이메일 첨부 파일(파일 이름)

- `search_attachments` - 지정된 디렉토리에서 주어진 패턴과 일치하는 파일을 검색합니다.
  - `pattern` (문자열, 필수): 파일 이름에서 검색할 텍스트 패턴

### 프롬프트

- **send_email**

  - 선택적 첨부 파일과 함께 이메일 전송
  - 인수:
    - `receiver` (필수): 수신자 이메일 주소 목록
    - `body` (필수): 이메일의 본문 내용
    - `subject` (필수): 이메일의 제목
    - `attachments` (선택 사항): 이메일 첨부 파일

- **search_attachments**
  - 패턴과 일치하는 파일 검색
  - 인수:
    - `pattern` (필수): 파일 이름에서 검색할 텍스트 패턴

## 설치

### pip 사용

필요한 종속성 설치:

```bash
pip install pydantic python-dotenv
```

### 이메일 구성

SMTP 서버 구성이 포함된 `email.json` 파일:

```json
[
  {
    "domain": "@gmail.com",
    "server": "smtp.gmail.com",
    "port": 587
  },
  {
    "domain": "@outlook.com",
    "server": "smtp.office365.com",
    "port": 587
  },
  {
    "domain": "@yahoo.com",
    "server": "smtp.mail.yahoo.com",
    "port": 587
  }
]
```

## 사용 방법

### 서버 실행

MCP 이메일 서버 시작:

```bash
python -m mcp_email_server (--dir /path/to/attachment/directory)
```

### Claude.app 구성

Claude 설정에 추가:

#### Conda

```json
{
  "mcpServers": {
    "email": {
      "command": "D:\\conda\\envs\\mcp\\python.exe",
      "args": [
        "C:\\Users\\YourUserName\\Desktop\\servers\\src\\email\\src\\mcp_server_email",
        "--dir",
        "C:\\Users\\YourUserName\\Desktop"
      ],
      "env": {
        "SENDER": "2593666979q@gmail.com",
        "PASSWORD": "tuogk......."
      }
    }
  }
}
```

#### UV

```json
{
  "mcpServers": {
    "email": {
      "command": "uv",
      "args": [
        "~\\servers\\src\\email\\src\\mcp_server_email",
        "--dir",
        "C:\\Users\\YourUserName\\Desktop"
      ],
      "env": {
        "SENDER": "2593666979q@gmail.com",
        "PASSWORD": "tuogk......."
      }
    }
  }
}
```

## 보안 참고 사항

- Gmail 및 기타 서비스의 경우 앱별 비밀번호를 사용해야 할 수 있습니다
- 보안상의 이유로 서버는 제한된 첨부 파일 유형만 지원합니다

## 지원되는 파일 유형

서버는 다음 첨부 파일 유형을 지원합니다:

- 문서: doc, docx, xls, xlsx, ppt, pptx, pdf
- 아카이브: zip, rar, 7z, tar, gz
- 텍스트 파일: txt, log, csv, json, xml
- 이미지: jpg, jpeg, png, gif, bmp
- 기타: md

## 사용 예시

### 이메일 전송

```json
{
  "receiver": ["recipient@example.com"],
  "subject": "MCP 서버에서 보낸 테스트 이메일",
  "body": "이것은 MCP 이메일 서버를 통해 전송된 테스트 이메일입니다.",
  "attachments": ["document.pdf", "image.jpg"]
}
```

### 첨부 파일 검색

```json
{
  "pattern": "report"
}
```

## 라이선스

MCP 이메일 서버는 MIT 라이선스로 제공됩니다. 이는 MIT 라이선스의 조건에 따라 소프트웨어를 자유롭게 사용, 수정 및 배포할 수 있음을 의미합니다.
