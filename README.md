# Claude Agent System Template

> **A comprehensive framework for AI agent orchestration and PRD-driven development workflows**

## 🚀 Quick Setup for New Projects

### Step 1: Copy System Files

From the `the_garden` repository:

```bash
# Copy the entire Claude Agent System
cp -r .claude/ /path/to/your/project/.claude/

# Copy the memory/instruction file
cp CLAUDE.md /path/to/your/project/
```

### Step 2: Initialize Workspace

In your new project, start Claude Code and run:

```bash
# Interactive mode - Claude guides you through setup
/onboard

# Single argument - Apply predefined theme
/onboard red      # Red + Orange
/onboard ocean    # Blue + Teal

# Two arguments - Custom color pairing
/onboard red blue       # Red primary, Blue secondary
/onboard purple orange  # Purple primary, Orange secondary
```

This command will:
- ✅ Create `.vscode/settings.json` from template
- ✅ Configure unique workspace colors for your project
- ✅ Generate audio completion notification (cross-platform WAV)
- ✅ Set up all hooks and settings

### Step 3: Start Working

Tell Claude:
```
I'm setting up a new project with the Claude Agent System.
Please use the garden-guide agent to help me get started.
```

That's it! The system auto-loads and all agents, hooks, and templates work immediately.

## 🎯 Purpose

This template provides a complete system for managing software development projects using specialized AI agents and Product Requirements Documents (PRDs). It eliminates project clutter through organized folder structures and enables knowledge transfer across projects.

## ✨ What You Get

- ✅ **Core system agents** (garden-guide, project-navigator) + add your own specialized agents
- ✅ **Additional agent library** (financial, platform, security, data science, product, UX/UI - choose what you need)
- ✅ **15+ templates** (PRDs, tasks, sessions, agents, architecture)
- ✅ **Automatic hooks** (context tracking, session handoff)
- ✅ **Task workflows** (backlog → active → completed → OBE)
- ✅ **Session continuity** (auto-handoff at 65% context)
- ✅ **Unique workspace colors** (visual project identity)
- ✅ **Audio completion notifications** (cross-platform WAV support)
- ✅ **Custom commands** (extensible slash command system)

## 🏗️ Repository Structure

**The Garden (Template Repository):**
```
the_garden/
├── .claude/                         # Claude Agent System (copy this entire folder)
│   ├── agents/                      # Core system agents (add specialized agents as needed)
│   ├── commands/                    # Custom slash commands
│   ├── templates/                   # 15+ workflow templates
│   ├── tasks/                       # PRD workflow directories (0_obe, 1_backlog, 2_active, 3_completed)
│   ├── docs/                        # Agent documentation & examples
│   ├── hooks/                       # Automation hooks (context tracking)
│   ├── settings.json                # Claude Code configuration
│   ├── context/                     # Session history (not copied - created at runtime)
│   └── README.md                    # System documentation
├── CLAUDE.md                        # Agent orchestration rules (copy to project root)
└── README.md                        # This file
```

**After Setup in Your Project:**
```
your-project/
├── .claude/                         # (copied from the_garden/.claude/)
│   ├── agents/                      # Auto-loaded specialized agents
│   ├── commands/                    # Custom slash commands
│   ├── templates/                   # Available templates
│   ├── tasks/                       # PRD lifecycle folders
│   ├── docs/                        # Documentation
│   ├── hooks/                       # Active hooks
│   ├── settings.json                # Active configuration
│   ├── settings.local.json          # Local overrides (created by /onboard)
│   ├── audio/                       # Completion audio (created by /onboard)
│   └── context/                     # Runtime session history
├── .vscode/                         # Workspace colors (created by /onboard)
│   └── settings.json                # Auto-generated from template
├── CLAUDE.md                        # Agent rules (auto-loaded)
└── [your project files...]
```

**Key Points:**
- `.claude/` = Single unified system folder
- `CLAUDE.md` = Always in project root for auto-loading
- `.vscode/` = Created by `/onboard` command

## 🎨 Workspace Color Customization

Each project can have a **unique two-color theme** for easy visual identification across multiple VS Code windows.

### How It Works

When you run `/onboard`:
1. Creates `.vscode/settings.json` from template
2. Default theme is **Green + Brown** ("The Garden")
3. Claude detects project name and suggests appropriate colors
4. You can choose from suggested themes or pick custom colors

### Available Themes

**Nature:**
- Green + Brown (default "The Garden" theme)
- Teal + Sage

**Ocean:**
- Blue + Teal
- Cyan + Navy

**Fire:**
- Red + Orange
- Orange + Yellow

**Royal:**
- Purple + Blue
- Magenta + Purple

**Sunset:**
- Pink + Orange
- Rose + Gold

**Energy:**
- Orange + Yellow

**Tech:**
- Cyan + Navy

**Earth:**
- Teal + Sage

### Theme Selection

Claude will **automatically infer** themes based on project name keywords:

- **garden, tree, forest, plant** → Green + Brown
- **ocean, sea, water, aqua** → Blue + Teal
- **fire, flame, heat, burn** → Red + Orange
- **royal, king, crown, purple** → Purple + Blue
- **sunset, dusk, dawn, pink** → Pink + Orange
- **tech, cyber, digital, code** → Cyan + Navy

Or you can **manually choose** any color pairing from the list above.

### What Gets Colored

✅ **Primary color** (bright): Title bar, status bar, major UI elements
✅ **Secondary color** (accent): Borders, tab underlines, icons
✅ **Background tint**: Sidebar (subtle blend of both colors)
❌ **Stays default**: Editor, terminal content, syntax highlighting

This keeps code **fully readable** while making workspaces **instantly recognizable**!

### Quick Color Change

**Predefined themes** (single argument):
```bash
/onboard red      # Red + Orange
/onboard ocean    # Blue + Teal
/onboard purple   # Purple + Blue
/onboard tech     # Cyan + Navy
```

**Custom pairings** (two arguments):
```bash
/onboard red blue       # Red primary + Blue secondary
/onboard purple orange  # Purple primary + Orange secondary
/onboard green cyan     # Green primary + Cyan secondary
/onboard magenta yellow # Magenta primary + Yellow secondary
```

**Supported color keywords**:
- Single colors: `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `magenta`, `pink`, `brown`, `navy`, `sage`
- Neutral colors: `gray`, `white`, `silver`, `black`
- Theme names: `ocean`, `fire`, `royal`, `sunset`, `tech`, `nature`, `earth`, `energy`

**Interactive mode**: Run `/onboard` without arguments for guided setup

**To revert to defaults**: Run `/onboard nature` or manually edit `.vscode/settings.json`

## 🔊 Audio Completion Notifications

The `/onboard` command automatically creates a cross-platform audio notification that plays when Claude finishes processing your prompts.

### How It Works

When you run `/onboard`, Claude generates:
- `.claude/audio/completion.wav` - Audio file saying "[Project Name] is finished"
- Works on both macOS and Windows

### Enable Audio Notifications

Add this to `.claude/settings.json` under `"hooks"`:

**macOS**:
```json
{
  "hooks": {
    "Stop": {
      "command": "afplay .claude/audio/completion.wav 2>/dev/null || true"
    }
  }
}
```

**Windows**:
```json
{
  "hooks": {
    "Stop": {
      "command": "powershell -c (New-Object Media.SoundPlayer '.claude/audio/completion.wav').PlaySync()"
    }
  }
}
```

### Disable Audio Notifications

Remove the `"Stop"` hook from `.claude/settings.json`

**Benefits**:
- ✅ Know when long-running tasks complete
- ✅ Multitask while Claude works
- ✅ Cross-platform compatibility (WAV format)
- ✅ Unique per-project audio identity

## 📁 PRD Organization System

Features are organized using a **numbered folder system** that eliminates project-level clutter:

### Folder Lifecycle
```
1_backlog/001-feature-name/    →    2_active/001-feature-name/    →    3_completed/001-feature-name/
                              ↘                                   ↗
                                0_obe/001-feature-name/ (if cancelled)
```

### Folder Contents
Each PRD folder contains:
- `prd-001-feature-name.md` - Product Requirements Document
- `tasks-prd-001-feature-name.md` - Implementation task breakdown
- Implementation files (code, configs, tests)
- `implementation-notes.md` - Technical decisions and notes
- `retrospective.md` - Lessons learned (completed features)
- `obe-reason.md` - Cancellation reasoning (OBE features)

### Enhanced Workflow (Optional)
For projects requiring knowledge transfer and pattern reusability:
- `PROJECT_IMPLEMENTATION_GUIDE.md` - Standalone replication guide
- `SOLUTION_PATTERNS.md` - Reusable architectural patterns
- `TECHNOLOGY_DECISION_LOG.md` - Decision rationale documentation

## 🤖 Agent Architecture

### Core System Agents (Included)

These agents are essential for the system to function and are included in the template:

| Agent | Specialization | Use Cases |
|-------|---------------|-----------|
| **🌱 garden-guide** | System setup, coaching | Project initialization, workflow guidance, optimization |
| **🧭 project-navigator** | Knowledge management | Project understanding, decision history, context |

### Specialized Agents (Add What You Need)

**The Garden provides agent templates for specialized domains. Choose and add agents based on your project needs:**

#### Software Engineering
- **strategic-software-engineer** - Architecture design, technical decisions, system design
- **tactical-software-engineer** - Code implementation, bug fixes, testing

#### Infrastructure & DevOps
- **strategic-platform-engineer** - Cloud strategy, infrastructure architecture, cost optimization
- **tactical-platform-engineer** - Infrastructure setup, deployment, resource provisioning
- **strategic-cicd** - CI/CD strategy, DevOps workflow design, release management
- **tactical-cicd** - Pipeline implementation, build configuration, deployment automation

#### Security
- **strategic-cybersecurity** - Security architecture, ATO strategy, compliance planning
- **tactical-cybersecurity** - Security implementation, vulnerability remediation, controls

#### Site Reliability
- **strategic-sre** - SLO/SLI definition, observability strategy, capacity planning
- **tactical-sre** - Monitoring implementation, incident response, reliability engineering

#### Product & Design
- **strategic-product-visionary** - Product vision, discovery interviews, strategic themes
- **strategic-feature-architect** - Feature roadmaps, epic decomposition, dependency planning
- **strategic-product-manager** - Product strategy, market analysis, stakeholder alignment
- **tactical-product-manager** - User stories, sprint planning, feature requirements
- **strategic-ux-ui-designer** - Design systems, UX strategy, information architecture
- **tactical-ux-ui-designer** - Wireframes, prototypes, component design, usability testing

#### Data & Analytics
- **data-scientist** - Data analysis, ML models, statistical analysis, predictive analytics

#### Financial Analysis
- **strategic-financial-officer** - CFO-level strategy, capital allocation, risk management
- **strategic-fpa-director** - Budget planning, forecasting, variance analysis
- **tactical-financial-analyst** - Financial statement analysis, ratio analysis, reporting
- **tactical-business-intelligence** - Dashboards, revenue analytics, customer metrics
- **tactical-controller** - Transaction processing, reconciliation, month-end close

### How to Add Agents

1. **Identify Your Needs**: Review the specialized agents list above
2. **Copy Agent Files**: From `.claude/agents/` in the Garden repository
3. **Add to Your Project**: Place in your project's `.claude/agents/` directory
4. **Restart Claude Code**: New agents auto-load on restart

**Example**:
```bash
# Add financial analysis agents to your project
cp the_garden/.claude/agents/strategic-financial-officer.md your-project/.claude/agents/
cp the_garden/.claude/agents/tactical-financial-analyst.md your-project/.claude/agents/
cp the_garden/.claude/agents/tactical-business-intelligence.md your-project/.claude/agents/

# Restart Claude Code to load new agents
```

**Benefits of This Approach**:
- ✅ Keep context window lean (only load agents you use)
- ✅ Customize agent selection per project
- ✅ Easy to add new specialized agents as needs evolve
- ✅ Template repository stays modular and flexible

## 🔄 Workflow Overview

### Standard PRD Workflow
1. **Create PRD** → Use `1_create-prd.md` template
2. **Generate Tasks** → Use `2_generate-tasks.md` template
3. **Implement** → Use `3_process-task-list.md` workflow
4. **Complete** → Move to `3_completed/` with retrospective

### Enhanced PRD Workflow (Knowledge Transfer)
Standard workflow **plus** mandatory deliverables:
- **Task 3.4**: Create implementation guide for replication
- **Task 3.5**: Extract reusable solution patterns
- **Task 3.6**: Document technology decisions and rationale

## 🎯 Enhanced Features for Knowledge Transfer

### Implementation Guides
Create standalone guides that enable anyone to replicate your solution independently:
```markdown
PROJECT_IMPLEMENTATION_GUIDE.md
├── Environment Setup
├── Step-by-Step Implementation
├── Configuration Details
├── Testing & Validation
├── Troubleshooting Guide
└── Adaptation Instructions
```

### Solution Patterns
Extract technology-agnostic patterns for future reuse:
```markdown
SOLUTION_PATTERNS.md
├── Architectural Patterns
├── Design Decisions
├── Scaling Strategies
├── Integration Approaches
└── Adaptation Guidelines
```

### Decision Logs
Capture the "why" behind technology choices:
```markdown
TECHNOLOGY_DECISION_LOG.md
├── Decision Context
├── Options Considered
├── Selection Rationale
├── Trade-offs Made
└── Migration Paths
```

## 📋 Quality Gates

### Standard Projects
- [ ] All functional requirements implemented
- [ ] Tests passing and code reviewed
- [ ] Documentation updated

### Enhanced Projects (Knowledge Transfer)
- [ ] Implementation guide enables independent replication
- [ ] Solution patterns are technology-agnostic and reusable
- [ ] Decision log captures rationale for all major choices
- [ ] All deliverables support knowledge transfer

## 🚀 Expected Benefits

### For Standard Workflow
- **Organized Development**: No scattered files across project
- **Clear Progress Tracking**: Visual folder-based lifecycle
- **Agent Efficiency**: Context-optimized specialized agents
- **Decision Preservation**: OBE folder maintains cancelled work

### For Enhanced Workflow
- **60-80% Faster Similar Projects**: Implementation guides accelerate future work
- **Better Architecture Decisions**: Pattern library improves choices
- **Reduced Decision Overhead**: Decision logs prevent re-solving problems
- **Team Scalability**: New members can understand and replicate solutions
- **Cross-Project Learning**: Patterns improve decisions across projects

## 🛠️ Usage Examples

### Starting a New Feature
```bash
# Tell Claude:
"I want to create a PRD for user authentication system"

# Claude will:
1. Use 1_create-prd.md to ask clarifying questions
2. Create 001-user-authentication/ folder in 1_backlog/
3. Generate prd-001-user-authentication.md
4. Ask for approval before task generation
```

### Implementation Phase
```bash
# Tell Claude:
"Let's start implementing the user authentication PRD"

# Claude will:
1. Move 001-user-authentication/ to 2_active/
2. Follow 3_process-task-list.md workflow
3. Complete tasks one by one with approval
4. Create implementation files within the folder
```

### Knowledge Transfer (Enhanced)
```bash
# For enhanced workflow, Claude will also create:
- PROJECT_IMPLEMENTATION_GUIDE.md
- SOLUTION_PATTERNS.md
- TECHNOLOGY_DECISION_LOG.md
```

## 📖 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete agent orchestration rules
- **[docs/](docs/)** - Detailed agent documentation
- **[templates/](templates/)** - All workflow and development templates

## 🎯 Next Steps

### After Setup
1. **Customize** `PROJECT_CONTEXT.md` with your project details
2. **Train team** on PRD workflow if working with others
3. **Start** with a simple feature to learn the system

### For Enhanced Workflow
1. **Use enhanced templates** for all new PRDs
2. **Build pattern library** from multiple projects
3. **Measure** acceleration in similar projects

## 🤝 Team Integration

Add to your project README:
```markdown
## Claude Agent Integration
This project uses the Claude Agent System for development workflow management.
- Project context: `PROJECT_CONTEXT.md`
- Active tasks: `.claude/tasks/2_active/`
- Workflow templates: `.claude/templates/`

### PRD Organization
Features are organized in numbered folders that move through workflow stages:
- **Backlog**: `.claude/tasks/1_backlog/001-feature-name/`
- **Active**: `.claude/tasks/2_active/001-feature-name/`
- **Completed**: `.claude/tasks/3_completed/001-feature-name/`
- **OBE**: `.claude/tasks/0_obe/001-feature-name/` (Overtaken by Events)
```

## 📄 License

This repository is designed for internal use in AI agent orchestration systems. Adapt and modify as needed for your specific use cases.

---

**Status**: ✅ Ready for use in any project
**Templates Available**: 13 total (including enhanced workflow templates)
**Last Updated**: November 2024