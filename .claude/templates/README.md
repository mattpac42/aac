# Claude Templates

This directory contains templates used by the Claude Agent System.

## Templates

### `vscode-settings-template.json`

**Purpose**: Template for VS Code workspace color customization

**Usage**:
- Automatically copied to `.vscode/settings.json` by `/setup-workspace` command
- Contains default "The Garden" theme (Green + Brown)
- Includes example color pairings for other themes

**Do not edit directly in new projects** - use `/setup-workspace` to customize colors.

### `handoff-session-template.md`

**Purpose**: Template for session handoff documentation

**Usage**:
- Auto-generated at 65% context usage
- Provides forward-looking information for next session
- Overwrites previous handoff file each time

### `session-summary-template.md`

**Purpose**: Template for session summaries

**Usage**:
- Auto-generated at 65% context usage
- Creates numbered session files (001-SESSION.md, 002-SESSION.md, etc.)
- Archives completed work and decisions

## Template Management

**Source of Truth**: `the_garden` repository contains master templates
**Distribution**: Copy `claude/` folder to `.claude/` in new projects
**Customization**: Templates are meant to be copied and customized per project
