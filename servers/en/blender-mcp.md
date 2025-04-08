---
name: Blender MCP
digest: Allow large language models to directly interact and control Blender
author: ahujasid
repository: https://github.com/ahujasid/blender-mcp
capabilities:
  prompts: true
  resources: false
  tools: true
tags:
  - blender
  - 3D
icon: https://avatars.githubusercontent.com/u/11807284?s=48&v=4
createTime: 2025-04-07
---

[Blender MCP](https://github.com/ahujasid/blender-mcp) is a Blender MCP server that connects to large language models via the Model Context Protocol (MCP), enabling direct interaction and control of Blender. This integration makes it possible to assist with 3D modeling, scene creation, and manipulation through prompts. It is particularly suitable for both beginners and professionals looking to streamline their workflows.

[Blender](https://www.blender.org/) is a 3D modeling software used to create 3D models, 2D graphics, and even animations.

![Blender](/images/blender.png)

## Installation and Configuration

Blender MCP is an open-source project developed in Python, so ensure you have Python installed locally, version 3.10 or higher. You will also need Blender installed, version 3.0 or higher.

Next, install the `uv` package manager, a high-performance Python package manager developed in Rust.

**Mac**

```bash
brew install uv
```

**Windows**

```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Then configure the environment variables:

```bash
set Path=C:\Users\nntra\.local\bin;%Path%
```

**Linux**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Alternatively, you can manually install it by referring to [Install uv](https://docs.astral.sh/uv/getting-started/installation/).

Once installed, you can enable the Blender MCP server in the Claude MCP client.

:::adsense 8781986491:::

**Claude for Desktop**

For `Claude for Desktop`, open the client, go to `Settings` > `Developer` > `Edit Config` > `claude_desktop_config.json`, and add the following:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

After configuration, wait a moment, and you will see a hammer icon in the left toolbar of `Claude for Desktop`. Click it to access the Blender MCP tools.

![Blender MCP On Claude Desktop](/images/blender-mcp-on-claude-desktop.png)

**Cursor**

For Cursor, open `Cursor Settings` > `MCP` > `+ Add new global MCP server` and add the following:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"]
    }
  }
}
```

To apply this to a specific project only, add the configuration file to the `.cursor/mcp.json` file in the project's root directory.

> ⚠️ Note: Due to multiple MCP servers or users enabling many MCP servers, Cursor may have an extensive list of available tools, which can exhaust the token limit. Currently, Cursor only sends the first 40 tools to the LLM, so it is recommended to enable only the Blender MCP server during testing.

Once configured, you can see the newly added Blender MCP server in the MCP tab of Cursor settings (remember to enable it).

![Blender MCP On Cursor](/images/blender-mcp-on-cursor.png)

## Usage

After configuring the Blender MCP server, you need to install a plugin in Blender. Download the `addon.py` file from the Blender MCP GitHub repository at [https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py](https://raw.githubusercontent.com/ahujasid/blender-mcp/refs/heads/main/addon.py) and save it locally as `addon.py`.

Open Blender, go to `Edit` > `Preferences` > `Add-ons`, click `Install from Disk...`, and select the downloaded `addon.py` file.

![Blender install addon](/images/blender-install-addon.png)

Ensure the `Blender MCP` option is checked for proper functionality.

![Blender enable addon](/images/blender-enable-addon.png)

Return to Blender, find the `BlenderMCP` tab in the 3D view sidebar (press `N` to display it), check `Poly Haven` (optional), and click the `Connect to MCP server` button.

![Blender MCP Addon Connect](/images/blender-mcp-addon-connect.png)

With all preparations complete, you can now input commands in Claude Desktop or Cursor to control Blender. Current capabilities include:

- Retrieving scene and object information
- Creating, deleting, and modifying shapes
- Applying or creating object materials
- Executing arbitrary Python code in Blender
- Downloading models, assets, and HDRIs via [Poly Haven](https://polyhaven.com/)
- Generating 3D models with [Hyper3D Rodin](https://hyper3d.ai/). Obtain full API keys from [hyper3d.ai](https://hyper3d.ai/) or [fal.ai](https://fal.ai/).

For example, input the following prompt in Cursor to have Blender create a beach scene:

```
Create a beach vibe in blender scene. Let there be:

* Sky HDRI image
* some nice sandy ground
* some rocks and shrubbery in the scene
* any other props you can think of to make it look like a beach
```

Blender will then automatically start creating the scene.

:::youtube 0SuVIfLoUnA:::

Additionally, you can generate 3D models using [Hyper3D Rodin](https://hyper3d.ai/). Register an account on [Hyper3D Rodin](https://hyper3d.ai/), obtain an API key, configure it in the Blender plugin, and then input prompts in Cursor to generate 3D models.

## Troubleshooting

Common issues include:

- **Connection problems**: Ensure the plugin server is running and MCP is configured correctly. The first command may fail and require retrying.
- **Timeout errors**: Simplify requests or break them into steps.
- **Poly Haven issues**: The service may be unstable; try again or check its status.
- **General issues**: Restart Claude and the Blender server.

## Conclusion

The Blender MCP project demonstrates the potential of AI-assisted 3D modeling. By leveraging the MCP standard protocol, it simplifies complex operations and enhances efficiency. As MCP gains traction, more software integrations with AI are expected, further expanding the possibilities of creative tools.
