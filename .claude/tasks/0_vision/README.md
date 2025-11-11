# Vision Directory (0_vision/)

This directory contains high-level product vision documents that guide all feature development. Vision documents are created BEFORE roadmaps and PRDs.

## Directory Purpose

The `0_vision/` directory is the **starting point** for strategic product planning. It sits above all other task workflows and provides the strategic foundation for feature development.

## Workflow Hierarchy

```
0_vision/ (Strategic Vision)
    ↓
Feature Roadmap (Strategic Architecture)
    ↓
1_backlog/ (PRD Generation)
    ↓
2_active/ (Implementation)
    ↓
3_completed/ (Delivery)
```

## Standard Files

This directory typically contains three interconnected documents:

### 1. product-vision.md
**Created by**: strategic-product-visionary agent
**Purpose**: Capture the big picture product vision
**Contains**:
- Vision statement (6-12 month horizon)
- Business objectives and market context
- Target users and personas
- Core value propositions
- Strategic themes (3-5 major feature domains)
- Success metrics and OKRs
- Product principles
- In-scope / out-of-scope boundaries

**When to create**: At the start of a major product initiative or when strategic direction needs definition

**Template**: `/.claude/templates/product-vision-template.md`

---

### 2. strategic-themes.md
**Created by**: strategic-product-visionary agent
**Purpose**: Summarize and detail the strategic themes from the vision
**Contains**:
- Quick reference for all themes
- Theme-to-persona mapping
- Prioritization rationale
- Cross-cutting capabilities
- Success metrics by theme
- Implementation guidance

**When to create**: Automatically created alongside product-vision.md

**Template**: `/.claude/templates/strategic-themes-template.md`

---

### 3. feature-roadmap.md
**Created by**: strategic-feature-architect agent
**Purpose**: Decompose themes into prioritized feature epics
**Contains**:
- Feature epics organized by phase (3-6 months)
- Dependency mapping
- Priority scores (RICE, WSJF, Value vs Effort)
- Epic definitions with scope and success metrics
- MVP and phased rollout strategy
- PRD generation plan

**When to create**: After vision and themes are approved, before PRD generation

**Template**: `/.claude/templates/feature-roadmap-template.md`

---

## Workflow: Vision to Implementation

### Step 1: Create Product Vision
**Agent**: strategic-product-visionary

```
User request: "I want to create a vision for [product/initiative]"

The agent conducts discovery interviews covering:
- Business context and objectives
- User needs and pain points
- Market opportunity and competition
- Technical capabilities and constraints
- Success metrics and validation criteria

Output:
- /.claude/tasks/0_vision/product-vision.md
- /.claude/tasks/0_vision/strategic-themes.md
```

---

### Step 2: Create Feature Roadmap
**Agent**: strategic-feature-architect

```
User request: "Break this vision into a feature roadmap"

The agent analyzes the vision and themes to:
- Decompose themes into 10-15 feature epics
- Map dependencies between epics
- Prioritize using RICE, WSJF, or Value vs Effort
- Sequence into phases (Foundation → Core → Enhancement)
- Prepare PRD briefs for top priorities

Output:
- /.claude/tasks/0_vision/feature-roadmap.md (updated)
```

---

### Step 3: Generate PRDs
**Agent**: tactical-product-manager (via existing workflow)

```
User request: "Create a PRD for [epic from roadmap]"

The agent uses:
- Strategic context from vision document
- Theme objectives from strategic-themes.md
- Epic definition from feature-roadmap.md

Output:
- /.claude/tasks/1_backlog/001-[feature-name]/prd-001-[feature-name].md
```

---

### Step 4: Standard PRD Workflow
**Follow existing process**: Tasks 2_generate-tasks → 3_process-task-list

---

## File Lifecycle

### Active Vision Documents
- Product vision typically valid for 6-12 months
- Strategic themes updated quarterly as needed
- Feature roadmap updated monthly or per phase

### When to Update Vision

**Quarterly Reviews**:
- Validate assumptions against learnings
- Update themes based on user feedback
- Adjust priorities based on business changes

**Vision Refresh (6-12 months)**:
- Create new vision document when current expires
- Archive old vision to `0_vision/archive/[date]-product-vision.md`
- Conduct new discovery and strategy session

### Archive Old Visions

When creating a new vision:
```bash
# Archive old vision documents
mkdir -p /.claude/tasks/0_vision/archive/
mv product-vision.md archive/2025-Q1-product-vision.md
mv strategic-themes.md archive/2025-Q1-strategic-themes.md
mv feature-roadmap.md archive/2025-Q1-feature-roadmap.md
```

---

## Quick Start Guide

### For New Product Initiatives

1. **Start with Vision**:
   ```
   Ask main agent: "I want to create a product vision for [initiative]"
   → strategic-product-visionary agent conducts discovery
   → Creates product-vision.md and strategic-themes.md
   ```

2. **Create Roadmap**:
   ```
   Ask main agent: "Create a feature roadmap from this vision"
   → strategic-feature-architect decomposes themes
   → Creates feature-roadmap.md with prioritized epics
   ```

3. **Generate First PRDs**:
   ```
   Ask main agent: "Create a PRD for [highest priority epic]"
   → tactical-product-manager uses roadmap context
   → Creates PRD in 1_backlog/001-[feature-name]/
   ```

4. **Execute Standard Workflow**:
   ```
   → Follow existing PRD workflow (tasks 1-4)
   ```

---

### For Existing Products

1. **Review Current Vision**:
   - Check if vision exists and is current (< 6 months old)
   - If no vision exists, create one with strategic-product-visionary
   - If vision is stale, conduct vision refresh

2. **Update Roadmap**:
   - Review feature-roadmap.md quarterly
   - Adjust priorities based on learnings
   - Add new epics as themes evolve

3. **Continue PRD Generation**:
   - Use roadmap to guide PRD priorities
   - Reference vision for strategic context
   - Ensure features ladder up to themes

---

## Integration with Existing Workflows

### Before This Addition
```
PRD Creation → Task Generation → Implementation → Completion
```

### After This Addition
```
Vision Creation → Feature Roadmap → PRD Creation → Task Generation → Implementation → Completion
```

### Key Principle
**Vision documents are optional but recommended** for:
- Major product initiatives
- New product lines
- Strategic pivots
- Complex multi-feature efforts

**Simple features** can skip vision and go directly to PRD creation.

---

## Templates Location

All templates are stored in `/.claude/templates/`:
- `product-vision-template.md`
- `strategic-themes-template.md`
- `feature-roadmap-template.md`

---

## Agent Responsibilities

| Agent | Responsibilities | Output Location |
|-------|-----------------|----------------|
| strategic-product-visionary | Vision creation, theme identification | 0_vision/product-vision.md<br>0_vision/strategic-themes.md |
| strategic-feature-architect | Roadmap creation, epic definition | 0_vision/feature-roadmap.md |
| tactical-product-manager | PRD creation from epics | 1_backlog/NNN-[feature]/ |

---

## Success Criteria

A complete vision package includes:

- ✅ **product-vision.md**: Clear 6-12 month vision with 3-5 themes
- ✅ **strategic-themes.md**: Detailed theme definitions with priorities
- ✅ **feature-roadmap.md**: Prioritized epics with dependencies
- ✅ **Stakeholder alignment**: Key stakeholders have reviewed and approved
- ✅ **Success metrics defined**: Clear OKRs and KPIs at vision level
- ✅ **PRD readiness**: Top 3-5 epics ready for PRD generation

---

## Tips for Effective Vision Documents

1. **Keep vision inspiring but achievable** - 6-12 months is realistic
2. **Limit to 3-5 strategic themes** - More themes create confusion
3. **Ground in user research** - Base personas on real user data
4. **Define clear success metrics** - Make the vision measurable
5. **Establish boundaries** - Be explicit about what's out of scope
6. **Update regularly** - Quarterly reviews keep vision relevant
7. **Use for alignment** - Share vision docs with all stakeholders

---

## Common Patterns

### Pattern 1: New Product Launch
```
strategic-product-visionary (Vision)
→ strategic-feature-architect (Roadmap)
→ tactical-product-manager (MVP PRD)
→ Implementation
```

### Pattern 2: Major Feature Initiative
```
strategic-product-visionary (Feature Vision)
→ strategic-feature-architect (Feature Roadmap)
→ tactical-product-manager (PRDs)
→ Implementation
```

### Pattern 3: Strategic Pivot
```
strategic-product-visionary (New Vision)
→ Archive old vision
→ strategic-feature-architect (New Roadmap)
→ Move old PRDs to OBE
→ Create new PRDs
```

---

## Questions?

- **What if I just want to build one feature?** → Skip vision, create PRD directly
- **Do I need all three documents?** → Yes, they work together as a system
- **How often should I update the vision?** → Review quarterly, refresh every 6-12 months
- **Can I have multiple visions?** → Yes, for different product lines or initiatives
- **What if my vision changes mid-execution?** → Update the vision docs and adjust roadmap
