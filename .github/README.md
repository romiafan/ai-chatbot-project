# GitHub Configuration

This folder contains configuration files for GitHub features and AI coding assistants.

## Files

### `copilot-instructions.md`

Custom instructions for GitHub Copilot and other AI coding assistants. These instructions:

- **Enforce documentation-first workflow** - AI must check `/docs/` and `/specs/` before making changes
- **Define project architecture patterns** - Provider nesting, middleware flow, Convex structure
- **Specify development workflows** - Commands, deployment, feature addition patterns
- **Establish coding conventions** - Tailwind CSS 4, shadcn/ui, TypeScript patterns
- **Provide quick references** - Common patterns, anti-patterns, best practices

## How It Works

### GitHub Copilot

GitHub Copilot automatically reads `copilot-instructions.md` from this folder and uses it to:

- Provide context-aware code suggestions
- Follow project-specific patterns
- Respect architectural decisions
- Generate code that aligns with your standards

### Other AI Tools

For other AI coding assistants (Cursor, Continue, etc.), the instructions serve as:

- A reference document to paste into chat
- Guidelines for code review
- Standards for feature implementation

## Documentation Hierarchy

The instruction file enforces this workflow:

```text
┌─────────────────────────────────────────────────────────┐
│                  CRITICAL WORKFLOW                      │
├─────────────────────────────────────────────────────────┤
│ 1. Check /docs/ for AI model specifications            │
│ 2. Check /specs/ for project architecture              │
│ 3. Verify approach aligns with documented standards    │
│ 4. Implement following documented guidelines           │
│ 5. Update docs if adding new patterns                  │
└─────────────────────────────────────────────────────────┘
```

## Keeping Instructions Updated

When making architectural changes:

1. Update `copilot-instructions.md` with new patterns
2. Update `/docs/` with new technical references
3. Update `/specs/` with new specifications
4. Keep all three in sync

## Related Files

- AI model references → `/docs/README.md`
- Project specifications → `/specs/README.md`
- Cursor IDE rules → `/.cursorrules`

---

**These instructions help AI assistants write better code by understanding your project! 🤖**
