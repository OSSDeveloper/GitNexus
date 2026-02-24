# GitNexus Antigravity Integration

A standalone integration package that bridges **[GitNexus](https://github.com/abhigyanpatwari/GitNexus)** with the **Google Antigravity IDE**.

GitNexus indexes any codebase into a knowledge graph, exposing deep architectural context to AI agents. Google Antigravity is an agent-centric IDE built for 10x development.

This extension natively bridges the two.

## Features

Installing this package automatically configures your Antigravity environment to use GitNexus:

1. **Auto-Configures MCP**: Appends the GitNexus server to your `~/.gemini/antigravity/mcp.json` file.
2. **Installs Agent Skills**: Copies the core GitNexus Agent Skills (`Exploring`, `Debugging`, `Impact Analysis`, `Refactoring`) directly into `~/.gemini/antigravity/skills/`.
3. **Injects PreToolUse Hooks**: Deploys a native native Antigravity agent rule (`.agent/rules/gitnexus_pre_search_hook.md`) that deterministically intercepts generic global searches (`grep_search`) and prioritizes the GitNexus structural knowledge graph.

## Installation

Because this is a standalone integration, it keeps the core GitNexus CLI pristine. Install it globally:

```bash
# 1. Install core gitnexus first
npm install -g gitnexus

# 2. Install the Antigravity extension
npm install -g gitnexus-antigravity
```

_(The `postinstall` script will automatically configure your local Antigravity settings and tools)._

## Uninstallation

If you wish to remove GitNexus from Antigravity, simply uninstall the package:

```bash
npm uninstall -g gitnexus-antigravity
```

_The `postuninstall` script will cleanly revert the MCP configurations and remove the injected skills and rules._

## Author

Developed by OSSDeveloper (vijaybhaskar.puranam@gmail.com).
