# AI Documentation Reference Guide

## Quick Decision Tree: Which File Should AI Check?

```text
                    ┌─────────────────────────┐
                    │  What type of task?     │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │   AI Model       │ │   Database   │ │    Feature       │
    │   Integration    │ │   Changes    │ │  Implementation  │
    └────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
             │                  │                   │
             ▼                  ▼                   ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │ /docs/           │ │ /specs/.../  │ │ /specs/.../      │
    │ openai-models-   │ │ data-model.md│ │ spec.md          │
    │ reference.md     │ │              │ │ tasks.md         │
    │       OR         │ └──────────────┘ │ plan.md          │
    │ gemini-models-   │                  └──────────────────┘
    │ reference.md     │
    └──────────────────┘

              │                 │                 │
              ▼                 ▼                 ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │   API/Backend    │ │    Setup/    │ │   Architecture   │
    │   Implementation │ │    Config    │ │    Patterns      │
    └────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
             │                  │                   │
             ▼                  ▼                   ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │ /specs/.../      │ │ /specs/.../  │ │ .github/         │
    │ contracts/       │ │ quickstart.md│ │ copilot-         │
    │ convex-api.md    │ │              │ │ instructions.md  │
    └──────────────────┘ └──────────────┘ └──────────────────┘
```

## File Priority by Task Type

### 1. Adding OpenAI Integration

**Must Read (in order):**

1. `/docs/openai-models-reference.md` ← Model specs, pricing, limits
2. `/specs/001-ai-chatbot-wrapper/spec.md` ← Feature requirements
3. `/specs/001-ai-chatbot-wrapper/contracts/convex-api.md` ← API patterns
4. `.github/copilot-instructions.md` ← Convex action patterns

**Why**: Prevents using wrong model names, ensures correct parameters, follows API contracts

### 2. Adding Gemini Integration

**Must Read (in order):**

1. `/docs/gemini-models-reference.md` ← Model specs, pricing, limits
2. `/specs/001-ai-chatbot-wrapper/spec.md` ← Feature requirements
3. `/specs/001-ai-chatbot-wrapper/contracts/convex-api.md` ← API patterns
4. `.github/copilot-instructions.md` ← Convex action patterns

**Why**: Prevents using wrong model names, ensures correct parameters, follows API contracts

### 3. Modifying Database Schema

**Must Read (in order):**

1. `/specs/001-ai-chatbot-wrapper/data-model.md` ← Current schema
2. `/specs/001-ai-chatbot-wrapper/spec.md` ← Feature requirements
3. `.github/copilot-instructions.md` ← Schema definition patterns

**Why**: Avoids breaking existing relationships, ensures proper indexing, maintains consistency

### 4. Adding New Feature

**Must Read (in order):**

1. `/specs/001-ai-chatbot-wrapper/spec.md` ← Feature requirements
2. `/specs/001-ai-chatbot-wrapper/tasks.md` ← Task status
3. `/specs/001-ai-chatbot-wrapper/plan.md` ← Implementation roadmap
4. `/specs/001-ai-chatbot-wrapper/data-model.md` ← Schema changes needed
5. `.github/copilot-instructions.md` ← Architecture patterns

**Why**: Ensures feature aligns with requirements, avoids duplicate work, follows architecture

### 5. Creating Convex Query/Mutation/Action

**Must Read (in order):**

1. `/specs/001-ai-chatbot-wrapper/contracts/convex-api.md` ← API contracts
2. `/specs/001-ai-chatbot-wrapper/data-model.md` ← Schema reference
3. `.github/copilot-instructions.md` ← Query/mutation patterns

**Why**: Follows API contracts, uses correct validators, implements auth correctly

### 6. Project Setup

**Must Read (in order):**

1. `/specs/001-ai-chatbot-wrapper/quickstart.md` ← Setup guide
2. `.github/copilot-instructions.md` ← Development workflow
3. `README.md` ← Prerequisites and commands

**Why**: Ensures correct setup order, prevents common setup errors

### 7. Validating Implementation

**Must Read (in order):**

1. `/specs/001-ai-chatbot-wrapper/checklists/requirements.md` ← Requirements
2. `/specs/001-ai-chatbot-wrapper/checklists/completeness.md` ← Completeness
3. `/specs/001-ai-chatbot-wrapper/spec.md` ← Original requirements

**Why**: Ensures all requirements met, nothing missed, ready for production

## Common Mistakes and How to Avoid Them

### ❌ Mistake 1: Using Wrong Model Names

**Wrong:**

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo", // Incorrect model name
});
```

**Correct Workflow:**

1. Check `/docs/openai-models-reference.md`
2. Verify exact model name: `gpt-4-turbo-2024-04-09`
3. Implement with correct name

### ❌ Mistake 2: Breaking Database Schema

**Wrong:**

```typescript
// Adding field without checking existing schema
export default defineSchema({
  messages: defineTable({
    text: v.string(),
    // Forgot existing fields, wrong validators
  }),
});
```

**Correct Workflow:**

1. Read `/specs/001-ai-chatbot-wrapper/data-model.md`
2. Understand existing schema and relationships
3. Add fields following documented patterns

### ❌ Mistake 3: Implementing Duplicate Features

**Wrong:**

```typescript
// Implementing feature that already exists or is in progress
```

**Correct Workflow:**

1. Check `/specs/001-ai-chatbot-wrapper/tasks.md` for status
2. Check `/specs/001-ai-chatbot-wrapper/spec.md` for requirements
3. Verify feature isn't already implemented

## Documentation Update Workflow

When adding NEW patterns or features:

```text
┌─────────────────────────────────────────────────────────┐
│ 1. Implement the feature following existing patterns   │
│ 2. Update relevant spec files:                         │
│    - spec.md (if requirements changed)                 │
│    - data-model.md (if schema changed)                 │
│    - contracts/convex-api.md (if API changed)          │
│    - tasks.md (mark task as complete)                  │
│ 3. Update .github/copilot-instructions.md if adding    │
│    new architectural pattern                           │
│ 4. Update docs/ if adding new AI model support         │
└─────────────────────────────────────────────────────────┘
```

## AI Assistant Checklist

Before implementing ANY change, verify:

- [ ] I've identified the type of change (AI model, database, feature, etc.)
- [ ] I've read the relevant documentation files
- [ ] I've verified my approach aligns with documented standards
- [ ] I've checked for existing patterns in specifications
- [ ] I understand the current task status (if applicable)
- [ ] I know which files need updating after implementation
- [ ] I will update documentation if adding new patterns

## Quick Links

- Main workflow guide: `DOCUMENTATION-WORKFLOW.md`
- AI coding instructions: `.github/copilot-instructions.md`
- OpenAI reference: `/docs/openai-models-reference.md`
- Gemini reference: `/docs/gemini-models-reference.md`
- Project spec: `/specs/001-ai-chatbot-wrapper/spec.md`
- Database schema: `/specs/001-ai-chatbot-wrapper/data-model.md`
- API contracts: `/specs/001-ai-chatbot-wrapper/contracts/convex-api.md`
- Task tracking: `/specs/001-ai-chatbot-wrapper/tasks.md`

---

**Remember**: Documentation first, implementation second! 📚 → 💻
