---
title: 簡介
description: Model Context Protocol 中文入門指南
section: getting_started
next: architecture
pubDate: 2024-12-01
order: 1
---

# Claude MCP 簡介

Claude [MCP](https://www.claudemcp.com/tw)，即模型上下文協議（Model Context Protocol），是 Anthropic Claude 的一個開源開放協議，旨在建立 AI 模型和開發環境之間的統一上下文互動，透過提供標準化的上下文資訊存取，使 AI 模型能夠更好地理解和處理程式碼。就像給它們之間搭建了一座橋樑，使得開發者可以透過一套標準將 AI 應用程式和資料來源連接起來。

[![Claude MCP 架構圖](https://static.claudemcp.com/images/claude-mcp.png "Claude MCP 架構圖")](https://www.claudemcp.com/tw)

例如，在實際應用中，透過 Claude 桌面應用程式，藉助 [MCP](https://www.claudemcp.com/tw) 協議，AI 可以幫用戶管理 GitHub 專案，從建立專案到提交程式碼請求等複雜任務都能輕鬆完成，而且速度很快。這一協議的出現，有望徹底解決 LLM（大型語言模型）應用程式連接資料難的痛點，讓前沿模型生成更好、更相關的回應，不再需要為每個資料來源寫客製化的整合程式碼，一個 [MCP](https://www.claudemcp.com/tw) 協議就可以搞定與多種資料來源的連接。

## 應用場景

### 程式碼管理與開發

在程式碼開發方面，Claude 透過 [MCP](https://www.claudemcp.com/tw) 協議可以直接連接 GitHub。開發人員可以利用 Claude 自動化程式設計，例如讓 AI 自己寫程式碼、建立儲存庫、Push 程式碼、建立 Issue、建立分支、建立 PR 等操作，全程無需離開聊天介面，開發人員僅需提出需求即可。這大大提高了開發效率，將開發人員從繁瑣的程式碼操作中部分解放出來，更多地扮演需求提出者的角色。

### 資料管理與互動

#### 本機資源管理

[MCP](https://www.claudemcp.com/tw) 協議支援對本機資源的管理，如電腦裡的檔案、資料庫（像 SQLite 資料庫）等。開發人員可以使用 [MCP](https://www.claudemcp.com/tw) 協議讓桌面版 Claude 安全連接本機服務，進行檔案的建立、讀取、編輯等操作，還能對資料庫中的資料進行互動操作，例如查詢、更新等。

#### 遠端資源互動

對於遠端資源，如 `GoogleDrive`、`Slack` 等平台的資料，Claude 藉助 [MCP](https://www.claudemcp.com/tw) 協議可以直接進行控制和存取。這使得企業和開發者在建構 AI 應用程式時，能夠輕鬆整合不同來源的資料，如從商業工具、軟體、內容庫、應用程式開發環境等各種來源提取資料，協助模型產生與指令更相關的回覆。

### 建構智慧助手應用程式

隨著大模型從純聊天機器人走向以智慧助手為代表的 Agent 應用程式，[MCP](https://www.claudemcp.com/tw) 協議可以讓 AI 系統更加智慧和強大。開發人員透過 [MCP](https://www.claudemcp.com/tw) 協議將 AI 系統與多個資料來源相連接後，AI 工具不再只是簡單的問答系統，而是變成了一個能夠執行複雜任務、管理程式碼、處理檔案和與外部系統通訊的強大工具。例如，在建構一個企業內部的智慧助手時，可以利用 [MCP](https://www.claudemcp.com/tw) 協議連接企業內部的各種資料資源（如資料庫、檔案伺服器等）以及外部相關的業務工具（如專案管理工具等），為企業員工提供更全面、更高效的服務。

## Claude [MCP](https://www.claudemcp.com/tw) 協議的優缺點

### 優點

**簡化資料連接**

對於開發人員來說，[MCP](https://www.claudemcp.com/tw) 協議最大的優點之一就是**簡化了 AI 應用程式與資料來源之間的連接**。在過去，為了讓 LLM 應用程式連接不同的資料來源，開發者需要為每個資料來源寫客製化的整合程式碼，這是非常麻煩且重複的工作。而有了 [MCP](https://www.claudemcp.com/tw) 協議，開發人員只需將其與他們的 AI 工具整合一次，就可以連接到任何地方的資料來源。例如，無論是連接本機的資料庫，還是像 GitHub、Slack 這樣的遠端平台，都可以使用同一個 [MCP](https://www.claudemcp.com/tw) 協議，大大減少了開發工作量，提高了開發效率。

**提高資料互動的安全性**

所有的資料互動都是透過標準化的協議進行的，這意味著可以更好地控制資料的流動，防止資料外洩。[MCP](https://www.claudemcp.com/tw) 伺服器內建了安全機制，允許伺服器自己控制資源，不用把 API 金鑰給 LLM 提供商。例如，當 Claude 透過 [MCP](https://www.claudemcp.com/tw) 協議連接到企業內部的資料庫時，[MCP](https://www.claudemcp.com/tw) 伺服器可以在遵循企業安全策略的前提下進行資料互動，保護企業資料的安全。

**增強 AI 應用程式的功能**

使 AI 應用程式不再只是一個簡單的問答系統，而是變成了一個能夠執行複雜任務、管理程式碼、處理檔案和與外部系統通訊的強大工具。例如，透過 [MCP](https://www.claudemcp.com/tw) 協議連接到 GitHub 後，Claude 可以進行一系列複雜的程式碼管理操作，從建立專案到提交程式碼請求等，拓寬了 AI 應用程式的功能範圍，使其在更多的業務場景中發揮作用。

**良好的可擴展性**

[MCP](https://www.claudemcp.com/tw) 協議具有良好的可擴展性，提供了 `Prompts`、`Tools`、`Sampling` 等功能。這些功能可以方便地擴展 AI 應用程式與資料來源互動的能力，滿足不同應用場景的需求。例如，開發人員可以根據具體需求建立新的 `Prompts` 範本或者利用 `Tools` 中的功能來擴展資料處理能力，並且隨著技術的發展和新需求的出現，可以透過 `Sampling` 等功能最佳化 AI 的行為。

**資料形式支援廣泛**

支援的資料形式非常多樣，包括檔案內容、資料庫記錄、API 回應、即時系統資料、螢幕截圖和圖像、日誌檔案等，幾乎涵蓋了所有類型。這使得 [MCP](https://www.claudemcp.com/tw) 協議可以適用於各種不同類型的資料互動場景，無論是處理文字資料、圖像資料還是系統運行資料等都可以勝任。

### 缺點

**行業標準競爭壓力大**

當前在資料連接和互動領域有眾多的標準在競爭，[MCP](https://www.claudemcp.com/tw) 協議只是其中之一，要想成為行業通用標準面臨很大的挑戰。例如，在 AI 領域，其他類似的協議或技術也在不斷發展，可能會分散市場的注意力和資源，使得 [MCP](https://www.claudemcp.com/tw) 協議的推廣和普及受到一定的阻礙。

**可能存在相容性問題**

雖然 [MCP](https://www.claudemcp.com/tw) 協議旨在實現不同資料來源和 AI 應用程式的連接，但在實際應用中可能會遇到相容性問題。由於資料來源和 AI 應用程式的多樣性，可能存在某些資料來源或者 AI 應用程式在與 [MCP](https://www.claudemcp.com/tw) 協議整合時出現不相容的情況。例如，一些老舊的系統或者特殊客製化的資料來源可能無法很好地與 [MCP](https://www.claudemcp.com/tw) 協議進行對接，需要進行額外的適配工作。

**對協議本質存在質疑**

有觀點認為 [MCP](https://www.claudemcp.com/tw) 本質上只是一個工程最佳化的方案，而且並不是一個非常完美的工程最佳化方案。例如，有人覺得最暴力的情況下，甚至直接提供 HTTP 介面給 LLM，識別 Json 並進行調用，這和 [MCP](https://www.claudemcp.com/tw) 沒有本質上的區別，質疑其是否能夠稱之為一個真正的協議，本質上可能更像是 `FunctionCall + Proxy` 的組合。

**目前應用範圍受限**

目前 [MCP](https://www.claudemcp.com/tw) 僅支援本機運行（伺服器需要在自己的機器上），雖然官方正計劃建構具有企業級身份驗證的遠端伺服器支援（為企業內部共享提供支援），但目前這種限制在一定程度上影響了其在更廣泛場景下的應用。例如，對於一些需要在多台設備或者分散式環境下進行資料互動的應用場景，目前的 [MCP](https://www.claudemcp.com/tw) 協議可能無法滿足需求。
