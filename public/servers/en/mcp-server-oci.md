# MCP Server for Oracle Cloud Infrastructure (OCI)

This project implements a Model Context Protocol (MCP) server for Oracle Cloud Infrastructure, allowing LLMs like Claude to interact directly with OCI resources.

## Source Code

https://github.com/jopsis/mcp-server-oci

## Features

- Connection to Oracle Cloud using standard OCI CLI configuration
- Tools to list and manage instances and compartments in OCI
- Integration with the MCP protocol to facilitate access from Claude Desktop

## State

In development new features

## Prerequisites

- Python 3.10 or higher
- OCI CLI configured (`oci setup config`)
- Appropriate permissions in Oracle Cloud

## Installation

Clone 

```bash
git clone https://github.com/jopsis/mcp-server-oci.git
```

```bash
pip install git+https://github.com/modelcontextprotocol/python-sdk.git
pip install oci fastapi uvicorn click pydantic loguru
pip install -e .
```

## Usage

To start the MCP server directly:

```bash
python -m mcp_server_oci.mcp_server --profile DEFAULT
```

With `uv`:

```bash
uv --directory /Users/jocebal/Work/mcp/mcp-server-oci run python -m mcp_server_oci.mcp_server --profile DEFAULT
```

You can also specify the profile using an environment variable:

```bash
OCI_CLI_PROFILE=PERFIL python -m mcp_server_oci.mcp_server
```

## Configuration for Claude Desktop (MacOS)

Add this configuration to your file: 
`/Users/<usuario>/Library/Application Support/Claude/claude_desktop_config.json`

```json
"mcpServers": {
  "mcp-server-oci": {
    "command": "python",
    "args": [
      "-m",
      "mcp_server_oci.mcp_server",
      "--profile", "DEFAULT"
    ],
    "env": {
      "PYTHONPATH": "/<PATH_TO_MCP>/mcp-server-oci",
      "FASTMCP_LOG_LEVEL": "INFO"
    }
  }
}
```

With `uv`:

```json
"mcpServers": {
  "mcp-server-oci": {
    "command": "uv",
    "args": [
      "--directory",
      "/<PATH_TO_MCP>/mcp-server-oci",
      "run",
      "python",
      "-m",
      "mcp_server_oci.mcp_server",
      "--profile", "DEFAULT"
    ],
    "env": {
      "FASTMCP_LOG_LEVEL": "INFO"
    }
  }
}
```

## 📋 **Complete Resource Coverage**

### **Identity & Access Management**
- `list_compartments` - List all compartments accessible to you
- `list_users` / `get_user` - User accounts and their capabilities
- `list_groups` / `get_group` - User groups and memberships
- `list_policies` / `get_policy` - IAM policies and their statements
- `list_dynamic_groups` / `get_dynamic_group` - Dynamic groups and matching rules

### **Compute Resources**
- `list_instances` / `get_instance` - Virtual machine instances and their configurations
- `start_instance` / `stop_instance` - Basic instance lifecycle management
- `list_images` / `get_image` - Available OS images and custom images
- `list_shapes` - Available compute shapes and their specifications

### **Networking**
- `list_vcns` / `get_vcn` - Virtual Cloud Networks and their configurations
- `list_subnets` / `get_subnet` - Subnets and their routing/security settings
- `list_vnics` / `get_vnic` - Virtual Network Interface Cards
- `list_security_lists` / `get_security_list` - Network security rules (ingress/egress)
- `list_network_security_groups` / `get_network_security_group` - Advanced security groups

### **Storage**
- `get_namespace` - Object Storage namespace for your tenancy
- `list_buckets` / `get_bucket` - Object Storage buckets and their configurations
- `list_volumes` / `get_volume` - Block Storage volumes
- `list_boot_volumes` / `get_boot_volume` - Boot volumes for instances
- `list_file_systems` / `get_file_system` - File Storage systems

### **Databases**
- `list_db_systems` / `get_db_system` - Database systems and their configurations
- `list_databases` / `get_database` - Individual databases within DB systems
- `list_autonomous_databases` / `get_autonomous_database` - Autonomous databases with connection details

### **Load Balancers**
- `list_load_balancers` / `get_load_balancer` - Classic load balancers with listeners and backend sets
- `list_network_load_balancers` / `get_network_load_balancer` - Network load balancers

### **Security & Encryption**
- `list_vaults` / `get_vault` - Key Management Service vaults

### **Infrastructure Utilities**
- `list_availability_domains` - Available ADs in your region
- `list_fault_domains` - Fault domains within ADs
- `list_regions` - All OCI regions
- `get_tenancy_info` - Your tenancy details and configuration

## 💡 **Usage Examples**

### **Basic Discovery**
```bash
# Run the server
python -m mcp_server_oci

# From Claude or any MCP client:
# "List all compartments in my tenancy"
# "Show me all compute instances in compartment ocid1.compartment.oc1..."
# "What VCNs do I have and their CIDR blocks?"
```

### **Security Auditing**
```bash
# "List all users and their capabilities"
# "Show me all policies in the root compartment"
# "What are the security list rules for subnet X?"
```

### **Infrastructure Inventory**
```bash
# "List all databases and their configurations"
# "Show me all storage volumes and their sizes"
# "What load balancers do I have and their backend configurations?"
```

### **Advanced Queries**
```bash
# "Show me the complete network topology for compartment X"
# "List all resources that are publicly accessible"
# "Generate a report of all compute instances with their shapes and states"
```
