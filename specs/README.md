# Project Specifications

## 🔴 MANDATORY: Read Before Making Architectural Changes

This folder contains **project specifications and architecture decisions** that MUST be consulted before implementing features or making changes to the application.

## Structure

```text
specs/
└── 001-ai-chatbot-wrapper/
    ├── spec.md              # Complete feature specification
    ├── data-model.md        # Database schema & relationships
    ├── plan.md              # Implementation roadmap
    ├── tasks.md             # Task breakdown & status
    ├── quickstart.md        # Setup & getting started
    ├── research.md          # Research notes & decisions
    ├── contracts/
    │   └── convex-api.md    # API contracts & interfaces
    └── checklists/
        ├── requirements.md   # Requirements validation
        └── completeness.md   # Implementation completeness
```

## Workflow for AI Coding Agents

```text
┌──────────────────────────────────────────────────────┐
│ BEFORE implementing any feature:                     │
├──────────────────────────────────────────────────────┤
│ 1. Check spec.md for feature requirements           │
│ 2. Review data-model.md for schema changes          │
│ 3. Verify approach aligns with plan.md decisions    │
│ 4. Check tasks.md for current implementation status │
│ 5. Follow API contracts in contracts/convex-api.md  │
│ 6. Validate against checklists when complete        │
└──────────────────────────────────────────────────────┘
```

## When to Check Each File

### `spec.md` - Feature Specification

Check before:

- Adding new features or functionality
- Modifying existing features
- Understanding project scope
- Clarifying requirements

### `data-model.md` - Database Schema

Check before:

- Creating/modifying Convex tables
- Adding new fields or relationships
- Implementing queries/mutations
- Data migration or restructuring

### `plan.md` - Implementation Roadmap

Check before:

- Starting a new phase of development
- Making architectural decisions
- Understanding feature dependencies
- Planning sprints or milestones

### `tasks.md` - Task Breakdown

Check before:

- Picking up new work
- Understanding implementation status
- Avoiding duplicate work
- Tracking progress

### `quickstart.md` - Setup Guide

Check before:

- Setting up development environment
- Onboarding new developers
- Troubleshooting setup issues
- Deploying to production

### `contracts/convex-api.md` - API Contracts

Check before:

- Implementing Convex queries/mutations
- Integrating frontend with backend
- Changing API signatures
- Adding new endpoints

### `checklists/` - Validation

Check during:

- Feature completion review
- Pre-deployment validation
- Quality assurance testing
- Requirements verification

## Adding New Project Specs

When starting a new project or major feature:

1. Create a new folder: `specs/XXX-project-name/`
2. Copy the structure from `001-ai-chatbot-wrapper/`
3. Populate all required specification files
4. Update this README with the new project
5. Update `.github/copilot-instructions.md` to reference it

## Related Documentation

- AI model references → `/docs/openai-models-reference.md` & `/docs/gemini-models-reference.md`
- Coding instructions → `/.github/copilot-instructions.md`

---

**Remember**: Specs are your source of truth. Code should implement specs, not the other way around! 📐
