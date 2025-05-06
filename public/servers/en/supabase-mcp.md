---
name: Supabase MCP Server
digest: Link your Supabase projects with AI tools like Cursor, Claude, and Windsurf to enhance development workflows. This integration enables seamless data access and interaction, boosting productivity by leveraging AI capabilities directly within your database environment.
author: supabase-community
homepage: https://github.com/supabase-community/supabase-mcp
capabilities:
  prompts: false
  resources: false
  tools: true
tags:
  - ai
  - database
  - cloud
icon: https://avatars.githubusercontent.com/u/87650496?v=4
createTime: 2024-12-21
featured: true
---

> Connect your Supabase projects to Cursor, Claude, Windsurf, and other AI assistants.

![supabase-mcp-demo](https://static.claudemcp.com/servers/supabase-community/supabase-mcp/supabase-community-supabase-mcp-24a1d57e.jpg)

The [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) standardizes how Large Language Models (LLMs) talk to external services like Supabase. It connects AI assistants directly with your Supabase project and allows them to perform tasks like managing tables, fetching config, and querying data.

## Prerequisites

You will need Node.js installed on your machine. You can check this by running:

```shell
node -v
```

If you don't have Node.js installed, you can download it from [nodejs.org](https://nodejs.org/).

## Setup

### 1. Personal access token (PAT)

First, go to your [Supabase settings](https://supabase.com/dashboard/account/tokens) and create a personal access token. Give it a name that describes its purpose, like "Cursor MCP Server".

This will be used to authenticate the MCP server with your Supabase account. Make sure to copy the token, as you won't be able to see it again.

### 2. Configure MCP client

Next, configure your MCP client (such as Cursor) to use this server. Most MCP clients store the configuration as JSON in the following format:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

Replace `<personal-access-token>` with the token you created in step 1. Alternatively you can omit `--access-token` and instead set the `SUPABASE_ACCESS_TOKEN` environment variable to your personal access token.

If you are on Windows, you will need to prefix the command with `cmd /c`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
```

### Read-only mode

If you wish to restrict the Supabase MCP server to read-only queries, set the `--read-only` flag on the CLI command:

```shell
npx -y @supabase/mcp-server-supabase@latest --access-token=<personal-access-token> --read-only
```

This prevents write operations on any of your databases by executing SQL as a read-only Postgres user.

## Tools

The following Supabase tools are available to the LLM:

#### Project Management

- `list_projects`: Lists all Supabase projects for the user.
- `get_project`: Gets details for a project.
- `create_project`: Creates a new Supabase project.
- `pause_project`: Pauses a project.
- `restore_project`: Restores a project.
- `list_organizations`: Lists all organizations that the user is a member of.
- `get_organization`: Gets details for an organization.

#### Database Operations

- `list_tables`: Lists all tables within the specified schemas.
- `list_extensions`: Lists all extensions in the database.
- `list_migrations`: Lists all migrations in the database.
- `apply_migration`: Applies a SQL migration to the database.
- `execute_sql`: Executes raw SQL in the database.
- `get_logs`: Gets logs for a Supabase project by service type.

#### Project Configuration

- `get_project_url`: Gets the API URL for a project.
- `get_anon_key`: Gets the anonymous API key for a project.

#### Branching (Experimental, requires a paid plan)

- `create_branch`: Creates a development branch with migrations from production branch.
- `list_branches`: Lists all development branches.
- `delete_branch`: Deletes a development branch.
- `merge_branch`: Merges migrations and edge functions from a development branch to production.
- `reset_branch`: Resets migrations of a development branch to a prior version.
- `rebase_branch`: Rebases development branch on production to handle migration drift.

#### Development Tools

- `generate_typescript_types`: Generates TypeScript types based on the database schema.

#### Cost Confirmation

- `get_cost`: Gets the cost of a new project or branch for an organization.
- `confirm_cost`: Confirms the user's understanding of new project or branch costs.

## Other MCP servers

### `@supabase/mcp-server-postgrest`

The PostgREST MCP server allows you to connect your own users to your app via REST API.

## Resources

- [**Model Context Protocol**](https://modelcontextprotocol.io/introduction): Learn more about MCP and its capabilities.

## License

This project is licensed under Apache 2.0.
