---
name: OpenMemory MCP 伺服器
digest: OpenMemory 是由 Mem0 驅動的本地記憶體基礎架構，讓您能在任何 AI 應用中攜帶記憶。它提供一個與您相伴的統一記憶層，使代理和助手能跨應用記住重要事項。
author: mem0ai
homepage: https://mem0.ai/openmemory-mcp
repository: https://github.com/mem0ai/mem0/tree/main/openmemory
capabilities:
  prompts: false
  resources: false
tags:
  - api
  - server
  - memory
icon: https://avatars.githubusercontent.com/u/137054526?s=48&v=4
createTime: 2025-05-14
featured: true
---

OpenMemory 是由 Mem0 驅動的本地記憶體基礎架構，讓您能在任何 AI 應用中攜帶記憶。它提供一個與您相伴的統一記憶層，使代理和助手能跨應用記住重要事項。

![openmemory-demo](/images/openmemory-mcp.png)

今日，我們推出首個基礎組件：[OpenMemory MCP 伺服器](/tw/servers/openmemory-mcp)——一個私密、本地優先的記憶層，內建使用者介面，兼容所有 MCP 客戶端。

## 何謂 OpenMemory MCP 伺服器

**OpenMemory MCP 伺服器**是一個私密、本地優先的記憶體伺服器，為您的 MCP 兼容工具創建共享的持久記憶層。它完全運行於您的機器上，實現工具間無縫上下文傳遞。無論您切換於開發、規劃或除錯環境之間，AI 助手皆能存取相關記憶，無需重複指示。

OpenMemory MCP 伺服器確保所有記憶保持**本地化、結構化且由您掌控**，無需雲端同步或外部儲存。

## OpenMemory MCP 伺服器運作原理

基於**模型上下文協定 (MCP)** 構建，OpenMemory MCP 伺服器提供標準化記憶工具集：

- `add_memories`: 儲存新記憶物件
- `search_memory`: 檢索相關記憶
- `list_memories`: 檢視所有儲存記憶
- `delete_all_memories`: 完全清除記憶

任何 MCP 兼容工具皆可連接至伺服器，並使用這些 API 來持久化及存取記憶。

## 實現功能

1. **跨客戶端記憶存取**: 在 Cursor 儲存上下文，稍後於 Claude 或 Windsurf 中取用，無需重複說明。
2. **完全本地記憶儲存**: 所有記憶儲存於您的機器，不傳輸至雲端，您保有完整所有權與控制權。
3. **統一記憶介面**: 內建的 OpenMemory 儀表板提供集中檢視所有儲存內容。可直接從儀表板新增、瀏覽、刪除記憶，並控制客戶端存取權限。

## 支援客戶端

OpenMemory MCP 伺服器兼容所有支援模型上下文協定的客戶端，包括：

- **Cursor**
- **Claude Desktop**
- **Windsurf**
- **Cline 等**

隨著更多 AI 系統採用 MCP，您的私密記憶將更具價值。

---

## 安裝與設定

開始使用 OpenMemory 十分簡單，只需幾分鐘即可在本地機器完成設定。請遵循以下步驟：

```bash
# 複製儲存庫
git clone <https://github.com/mem0ai/mem0.git>
cd openmemory

# 建立後端 .env 檔案並填入 OpenAI 金鑰
cd api
touch .env
echo "OPENAI_API_KEY=your_key_here" > .env

# 返回專案根目錄並建構 Docker 映像檔
cd ..
make build

# 啟動所有服務（API 伺服器、向量資料庫及 MCP 伺服器元件）
make up

# 啟動前端
cp ui/.env.example ui/.env
make ui
```

**設定您的 MCP 客戶端**  
要連接 Cursor、Claude Desktop 或其他 MCP 客戶端，您需要使用者 ID。可執行以下指令查詢：

```bash
whoami
```

接著將以下設定加入您的 MCP 客戶端（將 `your-username` 替換為您的使用者名稱）：

```bash
npx install-mcp i "http://localhost:8765/mcp/<mcp-client>/sse/<your-username>" --client <mcp-client>
```

OpenMemory 儀表板將於 `http://localhost:3000` 提供服務。您可在此檢視與管理記憶，並檢查與 MCP 客戶端的連接狀態。

設定完成後，OpenMemory 將於您的機器本地運行，確保所有 AI 記憶保持私密安全，同時能在任何兼容的 MCP 客戶端中存取。

### 實際操作演示 🎥

我們準備了簡短示範影片展示實際運作：

<video
src="https://mem0.ai/blog/content/media/2025/05/Mem0-openMemory.mp4"
poster="https://img.spacergif.org/v1/3340x2160/0a/spacer.png"
width="3340"
height="2160"
controls
playsinline
preload="metadata"
style="background: transparent url('https://mem0.ai/blog/content/media/2025/05/Mem0-openMemory_thumb.jpg') 50% 50% / cover no-repeat;"></video>

## 實際應用範例

**情境 1：跨工具專案流程**

在 Claude Desktop 定義專案技術需求，於 Cursor 進行開發，再到 Windsurf 除錯——全程透過 OpenMemory 共享上下文。

**情境 2：持久化偏好設定**

在單一工具中設定偏好的程式風格或語調，切換至其他 MCP 客戶端時，無需重新定義即可沿用相同偏好。

**情境 3：專案知識庫**

一次性儲存重要專案細節，之後可從任何兼容 AI 工具存取，不再需要重複說明。

## 結論

OpenMemory MCP 伺服器為**MCP 兼容工具帶來記憶功能**，同時不犧牲控制權與隱私。它解決了現代 LLM 工作流程的根本限制：跨工具、會話與環境的上下文遺失問題。

透過標準化記憶操作並保持所有資料本地化，它降低了 token 開銷，提升效能，並在日益成長的 AI 助手生態系中實現更智慧的互動。

這僅是開端。MCP 伺服器是 OpenMemory 平台的首個核心層——這項更廣泛的計畫旨在使記憶體能在 AI 系統間可攜帶、私密且互通。

使用 OpenMemory MCP，您的 AI 記憶將保持私密、可攜帶且由您掌控，恰如其分。
