---
name: MCP Feedback Enhanced
digest: 核心概念是一種簡化複雜想法為清晰、可操作見解的流暢方法。它專注於提煉關鍵信息以增強理解和決策，確保用戶快速高效地掌握要點。其價值在於通過簡潔、結構良好的內容改善溝通、節省時間並推動更好的結果。
author: Minidoracat
homepage: https://github.com/Minidoracat/mcp-feedback-enhanced
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - 伺服器
  - ssh
  - wsl
icon: https://avatars.githubusercontent.com/u/11269639?v=4
createTime: 2025-05-29
featured: true
---

## 核心概念

這是一個建立**以反饋為導向的開發工作流程**的[MCP 伺服器](https://modelcontextprotocol.io/)，完美適應本地、**SSH 遠端環境**（Cursor SSH Remote、VS Code Remote SSH）和**WSL（Windows Subsystem for Linux）環境**。通過引導 AI 與用戶確認而非進行猜測性操作，它能將多個工具調用整合為單一的反饋導向請求，大幅降低平台成本並提升開發效率。

**支援平台:** [Cursor](https://www.cursor.com) | [Cline](https://cline.bot) | [Windsurf](https://windsurf.com) | [Augment](https://www.augmentcode.com) | [Trae](https://www.trae.ai)

### 工作流程

1. **AI 調用** → `mcp-feedback-enhanced`
2. **環境檢測** → 自動選擇合適介面
3. **用戶互動** → 指令執行、文字反饋、圖片上傳
4. **反饋傳遞** → 信息返回 AI
5. **流程延續** → 根據反饋調整或結束

## 主要功能

### 雙介面系統

- **Qt GUI**: 本地環境原生體驗，模組化重構設計
- **Web UI**: 遠端 SSH 和 WSL 環境的現代介面，全新架構
- **智能切換**: 自動檢測環境（本地/遠端/WSL）並選擇最佳介面

### 全新介面設計 (v2.1.0)

- **模組化架構**: GUI 和 Web UI 均採用模組化設計
- **集中管理**: 重組文件夾結構，更易維護
- **現代主題**: 改進視覺設計和用戶體驗
- **響應式佈局**: 適應不同屏幕尺寸和窗口大小

### 圖片支援

- **格式支援**: PNG、JPG、JPEG、GIF、BMP、WebP
- **上傳方式**: 拖放文件 + 剪貼板貼上 (Ctrl+V)
- **自動處理**: 智能壓縮確保符合 1MB 限制

### 多語言

- **三種語言**: 英文、繁體中文、簡體中文
- **智能檢測**: 根據系統語言自動選擇
- **即時切換**: 直接在介面中更改語言

### WSL 環境支援 (v2.2.5)

- **自動檢測**: 智能識別 WSL（Windows Subsystem for Linux）環境
- **瀏覽器整合**: 在 WSL 環境中自動啟動 Windows 瀏覽器
- **多種啟動方式**: 支援`cmd.exe`、`powershell.exe`、`wslview`等多種瀏覽器啟動方式
- **無縫體驗**: WSL 用戶可直接使用 Web UI，無需額外配置

### SSH 遠端環境支援 (v2.3.0 新功能)

- **智能檢測**: 自動識別 SSH 遠端環境（Cursor SSH Remote、VS Code Remote SSH 等）
- **瀏覽器啟動指引**: 當瀏覽器無法自動啟動時提供清晰解決方案
- **端口轉發支援**: 完整的端口轉發設置指引和故障排除
- **MCP 整合優化**: 改進與 MCP 系統的整合，提供更穩定的連接體驗
- **詳細文檔**: [SSH 遠端環境使用指南](docs/en/ssh-remote/browser-launch-issues.md)
- **自動聚焦輸入框**: 窗口打開時自動聚焦反饋輸入框，提升用戶體驗

## 介面預覽

### Qt GUI 介面 (重構版)

<div align="center">
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-d52415e2.png" width="400" alt="Qt GUI主介面" />
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-08512ba3.png" width="400" alt="Qt GUI設置介面" />
</div>

_Qt GUI 介面 - 模組化重構，支援本地環境_

### Web UI 介面 (重構版)

<div align="center">
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-b9522f81.png" width="400" alt="Web UI主介面" />
  <img src="https://static.claudemcp.com/servers/Minidoracat/mcp-feedback-enhanced/Minidoracat-mcp-feedback-enhanced-bfd5339d.png" width="400" alt="Web UI設置介面" />
</div>

_Web UI 介面 - 全新架構，適合 SSH 遠端環境_

**鍵盤快捷鍵**

- `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (macOS): 提交反饋（支援主鍵盤和數字鍵盤）
- `Ctrl+V` (Windows/Linux) / `Cmd+V` (macOS): 直接貼上剪貼板圖片

## 快速開始

### 1. 安裝與測試

```bash
# 安裝uv（如未安裝）
pip install uv

# 快速測試
uvx mcp-feedback-enhanced@latest test
```

### 2. MCP 配置

**基本配置**（適合大多數用戶）:

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

**進階配置**（需要自定義環境）:

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

### 3. 提示工程設置

為獲得最佳效果，請將這些規則添加到您的 AI 助手:

```
# MCP互動反饋規則

1. 在任何流程、任務或對話中，無論是詢問、回應還是完成階段任務，都必須調用MCP mcp-feedback-enhanced。
2. 當收到用戶反饋時，如果反饋內容不為空，必須再次調用MCP mcp-feedback-enhanced並根據反饋調整行為。
3. 只有當用戶明確表示「結束」或「無需更多互動」時，才能停止調用MCP mcp-feedback-enhanced，此時流程完成。
4. 除非收到結束指令，否則所有步驟都必須重複調用MCP mcp-feedback-enhanced。
5. 在完成任務前，使用MCP mcp-feedback-enhanced向用戶徵求反饋。
```

## 進階設置

### 環境變量

| 變量           | 用途            | 值             | 默認值  |
| -------------- | --------------- | -------------- | ------- |
| `FORCE_WEB`    | 強制使用 Web UI | `true`/`false` | `false` |
| `MCP_DEBUG`    | 調試模式        | `true`/`false` | `false` |
| `MCP_WEB_PORT` | Web UI 端口     | `1024-65535`   | `8765`  |

### 測試選項

```bash
# 版本檢查
uvx mcp-feedback-enhanced@latest version       # 檢查版本

# 介面專項測試
uvx mcp-feedback-enhanced@latest test --gui    # 快速測試Qt GUI
uvx mcp-feedback-enhanced@latest test --web    # 測試Web UI（自動持續運行）

# 調試模式
MCP_DEBUG=true uvx mcp-feedback-enhanced@latest test
```

### 開發者安裝

```bash
git clone https://github.com/Minidoracat/mcp-feedback-enhanced.git
cd mcp-feedback-enhanced
uv sync
```

**本地測試方法**

```bash
# 方法1: 標準測試（推薦）
uv run python -m mcp_feedback_enhanced test

# 方法2: 完整測試套件（macOS和Windows開發環境）
uvx --with-editable . mcp-feedback-enhanced test

# 方法3: 介面專項測試
uvx --with-editable . mcp-feedback-enhanced test --gui    # 快速測試Qt GUI
uvx --with-editable . mcp-feedback-enhanced test --web    # 測試Web UI（自動持續運行）
```

**測試說明**

- **標準測試**: 完整功能檢查，適合日常開發驗證
- **完整測試**: 所有組件深度測試，適合發布前驗證
- **Qt GUI 測試**: 快速啟動並測試本地圖形介面
- **Web UI 測試**: 啟動 Web 伺服器並保持運行，進行完整 Web 功能測試

## 版本歷史

📋 **完整版本歷史:** [RELEASE_NOTES/CHANGELOG.en.md](RELEASE_NOTES/CHANGELOG.en.md)

### 最新版本亮點 (v2.3.0)

- **SSH 遠端環境支援**: 解決 Cursor SSH Remote 瀏覽器啟動問題，提供清晰使用指引
- **錯誤信息改進**: 發生錯誤時提供更友好的錯誤信息和解決建議
- **自動清理功能**: 自動清理臨時文件和過期會話，保持系統整潔
- **內存監控**: 監控內存使用情況，防止系統資源不足
- **連接穩定性**: 改進 Web UI 連接穩定性和錯誤處理

## 常見問題

### SSH 遠端環境問題

**Q: SSH 遠端環境中瀏覽器無法啟動**
A: 這是正常行為。SSH 遠端環境無圖形介面，需在本地瀏覽器中手動打開。詳細解決方案見: [SSH 遠端環境使用指南](docs/en/ssh-remote/browser-launch-issues.md)

**Q: 為什麼收不到新的 MCP 反饋？**
A: 可能存在 WebSocket 連接問題。**解決方法**: 只需刷新瀏覽器頁面。

**Q: 為什麼 MCP 沒有被調用？**
A: 請確認 MCP 工具狀態顯示綠燈。**解決方法**: 反覆切換 MCP 工具開/關，等待幾秒系統重新連接。

**Q: Augment 無法啟動 MCP**
A: **解決方法**: 完全關閉並重啟 VS Code 或 Cursor，然後重新打開項目。

### 一般問題

**Q: 出現「Unexpected token 'D'」錯誤**
A: 調試輸出干擾。設置`MCP_DEBUG=false`或移除環境變量。

**Q: 中文字符亂碼**
A: v2.0.3 已修復。更新至最新版本: `uvx mcp-feedback-enhanced@latest`

**Q: 多屏幕窗口消失或定位錯誤**
A: v2.1.1 已修復。前往「⚙️ 設置」選項卡，勾選「始終在主屏幕中心顯示窗口」解決。特別適用於 T 形屏幕排列和其他複雜的多顯示器配置。

**Q: 圖片上傳失敗**
A: 檢查文件大小（≤1MB）和格式（PNG/JPG/GIF/BMP/WebP）。

**Q: Web UI 無法啟動**
A: 設置`FORCE_WEB=true`或檢查防火牆設置。

**Q: UV 緩存佔用過多磁盤空間**
A: 由於頻繁使用`uvx`命令，緩存可能累積至數十 GB。建議定期清理:

```bash
# 檢查緩存大小和詳細信息
python scripts/cleanup_cache.py --size

# 預覽清理內容（不實際清理）
python scripts/cleanup_cache.py --dry-run

# 執行標準清理
python scripts/cleanup_cache.py --clean

# 強制清理（嘗試關閉相關進程，解決Windows文件鎖問題）
python scripts/cleanup_cache.py --force

# 或直接使用uv命令
uv cache clean
```

詳細說明見: [緩存管理指南](docs/en/cache-management.md)

**Q: AI 模型無法解析圖片**
A: 各種 AI 模型（包括 Gemini Pro 2.5、Claude 等）在圖片解析上可能存在不穩定性，有時能正確識別，有時無法解析上傳的圖片內容。這是 AI 視覺理解技術的已知限制。建議:

1. 確保圖片質量良好（高對比度、文字清晰）
2. 嘗試多次上傳，重試通常會成功
3. 如果解析持續失敗，嘗試調整圖片大小或格式

## 許可證

MIT 許可證 - 詳見[LICENSE](LICENSE)文件
