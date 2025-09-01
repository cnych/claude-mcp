---
name: ComIDP MCP
digest: ComIDP MCP 服务器旨在无缝集成 ComIDP 与 AI 聊天机器人，提供非结构化文档处理功能，例如从 PDF 文件中提取数据。
author: ComPDF
repository: https://github.com/ComPDFKit/ComIDP-MCP-Server
homepage: https://www.compdf.com/
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - 智能文档提取
  - mcp server
  - 从PDF中提取信息
icon: https://avatars.githubusercontent.com/u/108792372?s=400&u=074de1805476adbda05ed0b5177e4d3b6ad26be2&v=4
createTime: 2025-06-13
---

该工具可让您从 PDF 中提取关键信息，或通过支持 Model Context Protocol (MCP) 的应用（如 Claude）解析并提取文档关键信息，从而提升文档处理效率。


# ComIDP MCP Server

**ComIDP MCP** 服务器是一款轻量级的 Model Context Protocol (MCP) 服务器，旨在将 [ComIDP](https://www.compdf.com/solutions/intelligent-document-processing)与 AI 聊天机器人无缝集成，提供非结构化文档处理功能，例如从 PDF 文件中提取数据。该服务以结构化的纯文本格式返回结果，便于后续处理或归档。

<img src="https://github.com/user-attachments/assets/0588f0e8-8692-4480-ad36-720a4de90d01" alt="2.4" width="50%" height="50%"/>

## 许可证

本项目基于 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)许可协议发布。请[联系我们](https://www.compdf.com/contact-sales) 获取免费试用的许可证密钥。

## 功能

1. 智能文档抽取

  - 支持从上传的 PDF 文档中提取文本内容。
  - 批量处理及多文件支持。

2. 未来增强功能
  - 支持更多文档格式（例如JPG,PNG等）。
  - 与其他ComIDP工具集成以实现高级处理。


## 如何将 ComIDP MCP 服务器用于 Claude 桌面？

### 设置

1. 依赖项：
- 确保已安装以下依赖项：
        
    - Python 3.10 或更高版本。

    - pip (Python包安装程序)

    - uv
    
        ```bash
        pip install uv 
        ```

- 创建虚拟环境并安装所需的包：
    - Windows:

    ```bash
    cd comidp-mcp\\src
    python -m venv .venv
    .venv\\Scripts\\activate
    pip install -r requirements.txt
    ```

    - Linux / MacOS:

    ```bash
    cd comidp-mcp/src
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

2. 配置Claude桌面

要配置与 Claude Desktop 的集成，您需要编辑 claude_desktop_config.json 文件。

如果该文件尚不存在，您可以按照以下步骤从 Claude Desktop 直接创建并打开它：
- 打开 Claude 桌面。
- 单击窗口左上角的 Claude 图标。
- 导航至文件 → 设置 → 开发人员 → 编辑配置。

这将在系统的默认编辑器中自动打开（或创建）claude_desktop_config.json 文件。

打开文件后，您可以根据需要添加 comidp-mcp 工具的配置。然后，您可以在文件的 mcpServers 部分添加 comidp-mcp 服务器配置。以下是示例配置：

    ```json
    {
        "mcpServers": { 
            "comidp-mcp": {     
                "command": "uv", 
                "args": [
                        "run", 
                        "PATH/TO/comidp-mcp/src/virtual environment python",
                        "PATH/TO/comidp-mcp/src/comidp_tools.py"
                ],
                "env": {
                    "IDPKEY": "your_idp_key_here"
                }
            }
        }
    }
    ```
    - Note:
        1. The virtual environment python path should point to the Python executable in your virtual environment. It should look like 
            -  For Windows `C:\\path\\to\\comidp-mcp\\.venv\\Scripts\\python.exe`.
            -  For Linux/MacOS `/path/to/comidp-mcp/.venv/bin/python`.
        2. All paths should be absolute paths.
        3. Replace `your_idp_key_here` with your actual IDPKEY API key.

3. 重新启动 Claude Desktop。

### API参考

**数据提取**

```python
def data_extraction(filenames: list, save_dir_path: str = "output", key: str = "", err_msg_lang: str = "en") -> Dict[str, str]:
    """
    Extract data from PDF files and save to TXT files in the specified folder.

    Params:
        filenames: A list of PDF file paths.
        save_dir_path: Folder where the result TXT files will be saved.
        key: The API key for IDPKEY. Required on the first call.
        err_msg_lang: Optional language code for error messages (e.g., 'zh' or 'en'). Defaults to 'en'.

    Returns:
        A dictionary mapping each input file path to its corresponding output TXT file path.
        If an error occurs, the value will be an error message.
    """

def data_extraction_from_folder(folder: str, save_dir_path: str, recursive: bool = False, key: str = "", err_msg_lang: str = "en") -> Dict[str, str]:
    """
    Extract data from PDF files in a folder and save to TXT files in the specified folder.

    Params:
        folder: Path to the folder containing PDF files.
        save_dir_path: Path to the folder where the result files will be saved.
        key: The API key for IDPKEY. Required on the first call.
        recursive: If true, recursively search subdirectories for PDF files.
        err_msg_lang: Optional language code for error messages (e.g., 'zh' or 'en'). Defaults to 'en'.

    Returns:
        A dictionary mapping each input file path to its corresponding output TXT file path.
        If an error occurs, the value will be an error message.
    """
```

## Support

如果您遇到任何问题或需要支持，请[联系我们的研发团队](https://www.compdf.com/support)。