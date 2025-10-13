---
name: Intelligent Document Extraction - ComIDP
digest: ComIDP MCP Server is designed for seamless integrating ComIDP with AI chatbots, providing unstructured document processing functionalities, such as extracting data from PDF files. 、
author: ComPDF
repository: https://github.com/ComPDFKit/ComIDP-MCP-Server
homepage: https://www.compdf.com/
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - intelligent document extraction
  - extract pdf info
  - mcp server
  - extract data from pdf
icon: https://avatars.githubusercontent.com/u/108792372?s=400&u=074de1805476adbda05ed0b5177e4d3b6ad26be2&v=4
createTime: 2025-06-13
---

This tool allows you to extract key information from PDFs or parse and extract key information from documents through applications that support the Model Context Protocol (MCP), such as Claude, thereby improving document processing efficiency.



## Supported Feature: Intelligent Document Extraction
ComIDP **Intelligent Document Extraction** automatically extracts key information from your uploaded unstructured documents, like PDF, converts it into structured data, and supports batch processing to significantly improve document handling efficiency.
 
In the future, we will support more document formats (e.g., JPG, PNG etc.) and integrate with other ComIDP tools for advanced processing

## What is ComIDP MCP Server

**ComIDP MCP Server** is a lightweight Model Context Protocol (MCP) server designed for seamless integrating [ComIDP](https://www.compdf.com/solutions/intelligent-document-processing?utm_source=Code&utm_campaign=github_mcpserver_20250912&utm_medium=GitHub) with AI chatbots, providing unstructured document processing functionalities, such as extracting data from PDF files. The service returns results in structured plain-text format, enabling downstream processing or archival.

<img src="https://github.com/user-attachments/assets/0588f0e8-8692-4480-ad36-720a4de90d01" alt="2.4" width="50%" height="50%"/>

## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please [contact us](https://www.compdf.com/contact-sales?utm_source=Code&utm_campaign=github_mcpserver_20250912&utm_medium=GitHub) for a trial license key.

## Features

1.Intelligent Document Extraction

  - Supports extraction of textual content from uploaded PDF documents.

  - Batch processing and support for multiple files.

2. Future Enhancements
  - Support for more document formats (e.g., JPG, PNG etc.).
  - Integration with other ComIDP tools for advanced processing.


## ComIDP MCP Server for Claude Desktop

### Setup

1. Dependencies:
- Ensure you have the following dependencies installed:
        
    - Python 3.10 or higher

    - pip (Python package installer)

    - uv
    
        ```bash
        pip install uv 
        ```

- Create a virtual environment and install the required packages:
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

2. Configure Claude Desktop

    To configure the integration with Claude Desktop, you need to edit the claude_desktop_config.json file.

    If the file does not already exist, you can create and open it directly from Claude Desktop by following these steps:

    1. Open Claude Desktop.

    2. Click the Claude icon in the top-left corner of the window.

    3. Navigate to File → Settings → Developer → Edit Config.

    This will automatically open (or create) the claude_desktop_config.json file in your system's default editor.

    Once the file is open, you can add your configuration for the comidp-mcp tool as needed.
    Then you can add a comidp-mcp server configuration in mcpServers section of the file. Here is an example configuration:

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

3. Restart Claude Desktop.

### API Reference

**Data extraction**

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

If you encounter any issues or need support, please open an issue or [contact our R&D team](https://www.compdf.com/solutions/intelligent-document-processing?utm_source=Code&utm_campaign=github_mcpserver_20250912&utm_medium=GitHubt).
