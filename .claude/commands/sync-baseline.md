# Sync Baseline Template

Compare this project's Claude Agent System files against the latest baseline template and identify available updates.

## Instructions for Claude

When this command is invoked, follow these steps to help the user sync their project with the baseline template:

### Step 1: Check for Baseline Remote

First, check if a git remote for the baseline template exists:

```bash
git remote -v
```

Look for a remote named `baseline` or `template` pointing to the baseline repository.

**If not found**, provide these instructions:

```bash
# Add the baseline template as a remote
git remote add baseline https://github.com/[BASELINE_REPO_URL]

# Verify it was added
git remote -v
```

Ask the user for the correct baseline repository URL if unknown.

### Step 2: Fetch Latest Baseline

Fetch the latest changes from the baseline remote:

```bash
git fetch baseline main
```

Confirm the fetch was successful and note the latest commit hash.

### Step 3: Show Template Updates

Display the TEMPLATE_UPDATES.md file from the baseline to show what's new:

```bash
git show baseline/main:TEMPLATE_UPDATES.md
```

Present this changelog to the user, highlighting recent additions and changes.

### Step 4: Compare Key Files

Compare the project's Claude Agent System files against the baseline. For each file/directory, show differences and provide recommendations.

**Core Files to Compare:**

1. **CLAUDE.md**
   ```bash
   git diff HEAD:CLAUDE.md baseline/main:CLAUDE.md
   ```
   - Focus on structural/protocol changes
   - Preserve project-specific sections (agent lists, project context, custom rules)
   - Highlight new mandatory protocols or workflows

2. **Template Files**
   ```bash
   git diff HEAD:.claude/templates/ baseline/main:.claude/templates/
   ```
   - List new templates added
   - Show updates to existing templates
   - Recommend copying new templates directly

3. **Documentation Files**
   ```bash
   git diff HEAD:.claude/docs/ baseline/main:.claude/docs/
   ```
   - List new documentation files
   - Show updates to existing docs
   - Recommend adopting new best practices

4. **Command Files**
   ```bash
   git diff HEAD:.claude/commands/ baseline/main:.claude/commands/
   ```
   - List new commands available
   - Show updates to existing commands
   - Preserve custom commands specific to this project

5. **TEMPLATE_UPDATES.md**
   ```bash
   git diff HEAD:TEMPLATE_UPDATES.md baseline/main:TEMPLATE_UPDATES.md
   ```
   - Show what's been added to the changelog

### Step 5: Provide Actionable Recommendations

For each file with differences, provide specific guidance:

**Format:**
```
File: [filename]
Status: [New / Updated / Unchanged]
Recommendation: [Specific action to take]
Risk Level: [Low / Medium / High] (based on customization impact)
```

**Example Recommendations:**

- **New template files**: "Copy directly from baseline - no customization needed"
- **Updated docs**: "Review changes and merge relevant sections"
- **CLAUDE.md updates**: "Carefully review protocol changes; preserve project-specific agent lists and context"
- **New commands**: "Add to your project if functionality is useful"

### Step 6: Create Update Plan

Generate a prioritized update plan:

1. **High Priority** (Core protocols, mandatory workflows)
2. **Medium Priority** (New templates, documentation updates)
3. **Low Priority** (Optional commands, minor enhancements)

For each item, provide:
- What changed
- Why it matters
- How to apply it safely
- What to preserve from current version

### Step 7: Safety Warnings

Alert the user about files that should NOT be overwritten:

**Preserve Project-Specific Content:**
- Custom agent definitions in CLAUDE.md
- Project-specific sections in CLAUDE.md (PROJECT_CONTEXT integration, custom rules)
- Custom slash commands unique to this project
- Project-specific documentation in .claude/docs/
- Any customized templates

**Merge Carefully:**
- CLAUDE.md protocol updates (merge new protocols, preserve project config)
- Updated documentation (add new content, keep project examples)
- Template improvements (evaluate if project customizations should be kept)

### Step 8: Suggest Merge Strategy

Provide step-by-step merge instructions for complex files:

**For CLAUDE.md:**
```bash
# Create backup
cp CLAUDE.md CLAUDE.md.backup

# Show specific sections that changed
git diff HEAD:CLAUDE.md baseline/main:CLAUDE.md --word-diff

# Manually merge new protocols while preserving project sections
```

**For other files:**
```bash
# Copy new baseline file
git show baseline/main:[filepath] > [filepath].baseline

# Compare with current
diff [filepath] [filepath].baseline

# Decide: overwrite, merge, or keep current
```

## Key Files to Compare

- `CLAUDE.md` - Core agent orchestration rules and protocols
- `.claude/templates/` - Templates for tasks, sessions, agents
- `.claude/docs/` - Best practices and workflow documentation
- `.claude/commands/` - Slash command definitions
- `TEMPLATE_UPDATES.md` - Changelog of baseline updates

## Important Notes

**Customization Preservation:**
- Never blindly overwrite CLAUDE.md - it contains project-specific agent lists and rules
- Preserve custom slash commands that are unique to this project
- Keep project-specific documentation and examples
- Maintain any workflow customizations in templates

**Protocol Updates:**
- New mandatory protocols in CLAUDE.md should be adopted
- Structural improvements should be merged carefully
- New templates and docs can usually be copied directly
- Test changes incrementally, don't update everything at once

**Conflict Resolution:**
- When in doubt, ask the user which version to keep
- Provide context about why baseline version might be better
- Explain impact of keeping current version vs. updating
- Suggest hybrid approaches when applicable

## Output Format

Present findings in this structure:

```
# Baseline Sync Analysis

## Current Status
- Baseline Remote: [found/not found]
- Last Fetch: [timestamp or "never"]
- Latest Baseline Commit: [hash and message]

## Available Updates
[Summary from TEMPLATE_UPDATES.md]

## File Comparison Results

### High Priority Updates
1. [File] - [Status] - [Recommendation]
2. ...

### Medium Priority Updates
1. [File] - [Status] - [Recommendation]
2. ...

### Low Priority Updates
1. [File] - [Status] - [Recommendation]
2. ...

## Recommended Action Plan
1. [Step-by-step plan to apply updates safely]
2. ...

## Files to Preserve
- [List of project-specific files that should not be overwritten]

## Next Steps
[Specific commands or actions for the user to take]
```

## Validation

After presenting the analysis, ask the user:
1. Which updates do you want to apply first?
2. Are there any custom modifications I should be aware of before merging?
3. Would you like me to help merge specific files?
