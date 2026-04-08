**Language:** **English** | [한국어](../../ko-KR/mcp-configs/README.md)

# MCP Server Configurations

This directory contains configurations for **Model Context Protocol (MCP)** servers, which allow Gemini-CLI and Antigravity to connect with external tools and data sources.

## Using MCP Servers

Gemini CLI makes it easy to integrate with MCP servers. You can define servers globally in your `~/.gemini.json` or locally in your project's `.gemini/settings.json`.

### 1. Configuration File

We provide a comprehensive template in `mcp-configs/mcp-servers.json` that demonstrates various server setups:

- **Stdio servers** (Python/Node)
- **Docker-based servers**
- **HTTP & SSE servers** (with Authentication headers and IAP support)
- **Tool Filtering** (`includeTools` / `excludeTools`)

Copy the necessary server blocks from `mcp-servers.json` to your own `settings.json` file under `mcpServers`.

### 2. Available CLI Commands

You can manage your connected MCP servers using the Gemini CLI (`gemini mcp` or `/mcp` in interactive mode):

- `/mcp list` : View all configured servers, their connection status, and the tools they provide.
- `/mcp add <name> <command> [args...]` : Register a new stdio server dynamically.
- `/mcp remove <name>` : Remove an MCP server configuration.
- `/mcp enable <name>` / `/mcp disable <name>` : Temporarily enable or disable a specific server.

### 3. How It Works

Once a server is added and enabled, Gemini automatically discovers its tools. When you converse with Gemini, it will autonomously decide when to invoke these external tools without requiring explicit manual tool calls.
