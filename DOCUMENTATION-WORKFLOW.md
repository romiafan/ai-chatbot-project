# Documentation-First Workflow Summary

This document summarizes the documentation system and mandatory workflow for AI coding assistants.

## 🎯 Quick Reference

### The Golden Rule

**AI assistants MUST check documentation BEFORE making ANY code changes.**

### Documentation Structure

```text
ai-chatbot-project/
├── .github/
│   ├── copilot-instructions.md  ← Main instructions for AI assistants
│   └── README.md                ← Explains the instruction system
├── .cursorrules                 ← Cursor IDE specific rules
├── docs/                        ← Technical references
│   ├── README.md
│   ├── openai-models-reference.md
│   └── gemini-models-reference.md
└── specs/                       ← Project specifications
    ├── README.md
    └── 001-ai-chatbot-wrapper/
        ├── spec.md              ← Feature requirements
        ├── data-model.md        ← Database schema
        ├── plan.md              ← Implementation roadmap
        ├── tasks.md             ← Task breakdown
        ├── quickstart.md        ← Setup guide
        ├── contracts/
        │   └── convex-api.md    ← API contracts
        └── checklists/
            ├── requirements.md
            └── completeness.md
```

## 🔄 Mandatory Workflow

```text
┌─────────────────────────────────────────────────────────────────┐
│                      AI CODING WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 1: IDENTIFY THE TYPE OF CHANGE                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 2: CHECK RELEVANT DOCUMENTATION                    │   │
│  │                                                          │   │
│  │  AI Model Work    → /docs/[provider]-models-reference   │   │
│  │  Database Changes → /specs/.../data-model.md            │   │
│  │  New Features     → /specs/.../spec.md + tasks.md       │   │
│  │  API Changes      → /specs/.../contracts/convex-api.md  │   │
│  │  Setup/Config     → /specs/.../quickstart.md            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 3: VERIFY APPROACH ALIGNS WITH DOCS               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 4: IMPLEMENT FOLLOWING DOCUMENTED PATTERNS        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ STEP 5: UPDATE DOCS IF ADDING NEW PATTERNS             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 When to Check Which File

| Task                           | Primary File                            | Secondary Files                             |
| ------------------------------ | --------------------------------------- | ------------------------------------------- |
| Add OpenAI integration         | `/docs/openai-models-reference.md`      | `/specs/.../spec.md`, `/specs/.../tasks.md` |
| Add Gemini integration         | `/docs/gemini-models-reference.md`      | `/specs/.../spec.md`, `/specs/.../tasks.md` |
| Create/modify database table   | `/specs/.../data-model.md`              | `/specs/.../spec.md`                        |
| Implement new feature          | `/specs/.../spec.md`                    | `/specs/.../tasks.md`, `/specs/.../plan.md` |
| Create Convex query/mutation   | `/specs/.../contracts/convex-api.md`    | `/specs/.../data-model.md`                  |
| Set up development environment | `/specs/.../quickstart.md`              | `/.github/copilot-instructions.md`          |
| Validate implementation        | `/specs/.../checklists/requirements.md` | `/specs/.../checklists/completeness.md`     |

## ✅ Benefits of This System

### For AI Assistants

- **Consistent output** - Always follows documented patterns
- **Fewer errors** - Verifies specifications before implementation
- **Better context** - Understands project architecture and decisions
- **Aligned changes** - Modifications match existing codebase standards

### For Developers

- **Single source of truth** - All standards documented in one place
- **Onboarding tool** - New developers read the same instructions as AI
- **Quality assurance** - AI follows the same standards as human reviewers
- **Living documentation** - Specs stay updated as code evolves

## 🚫 Common Mistakes to Avoid

### ❌ Don't Do This

- Implement AI features without checking model reference docs
- Modify Convex schema without reviewing data-model.md
- Add features without checking spec.md and tasks.md
- Change APIs without updating contracts/convex-api.md
- Use outdated model names or parameters

### ✅ Do This Instead

- Read relevant docs FIRST, then implement
- Verify model capabilities against reference files
- Check task status before starting work
- Follow API contracts exactly
- Update documentation when adding new patterns

## 🔧 How to Use This System

### For Manual AI Interactions (ChatGPT, Claude, etc.)

1. **Before asking for help**, tell the AI:

   ```
   Before implementing anything, please read:
   - .github/copilot-instructions.md
   - docs/[relevant-file].md
   - specs/001-ai-chatbot-wrapper/[relevant-file].md
   ```

2. **Be specific** about which docs are relevant:
   ```
   I need to add support for GPT-4. Please check
   docs/openai-models-reference.md first, then implement
   following the patterns in .github/copilot-instructions.md
   ```

### For GitHub Copilot

- Copilot automatically reads `.github/copilot-instructions.md`
- The instructions enforce the documentation-first workflow
- No manual steps needed - just start coding!

### For Cursor IDE

- Cursor automatically reads `.cursorrules`
- The rules enforce the same workflow as Copilot instructions
- Rules are concise for quick AI reference

## 📖 Further Reading

- Main AI instructions → `/.github/copilot-instructions.md`
- Technical references → `/docs/README.md`
- Project specifications → `/specs/README.md`
- Cursor IDE rules → `/.cursorrules`

---

**Remember: Good documentation = Good AI assistance! 📚🤖**
