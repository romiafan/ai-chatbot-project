# Documentation Folder

## 🔴 MANDATORY: Read Before Coding

This folder contains **authoritative technical references** that MUST be consulted before implementing features or making changes related to AI models.

## Files

### AI Model References

#### `openai-models-reference.md`

Complete reference for OpenAI models including:

- Available models and their capabilities
- Context window sizes and token limits
- Pricing per model
- API parameters and configuration
- Vision and function calling support
- Rate limits and quotas

**When to check this file:**

- Before adding OpenAI integration
- When selecting a model for a feature
- Before implementing streaming responses
- When calculating token usage or costs
- When troubleshooting API errors

#### `gemini-models-reference.md`

Complete reference for Google Gemini models including:

- Available models and their capabilities
- Context window sizes and token limits
- Pricing per model
- API parameters and configuration
- Multimodal support (vision, audio)
- Rate limits and quotas

**When to check this file:**

- Before adding Gemini integration
- When selecting a model for a feature
- Before implementing multimodal features
- When calculating token usage or costs
- When troubleshooting API errors

## Workflow

### For AI Coding Agents

```text
┌──────────────────────────────────────────────────────┐
│ BEFORE implementing any AI model feature:            │
├──────────────────────────────────────────────────────┤
│ 1. Read the relevant model reference file           │
│ 2. Verify model names are correct                   │
│ 3. Check supported parameters                       │
│ 4. Validate token limits for use case               │
│ 5. Review pricing implications                      │
│ 6. Confirm feature support (streaming, vision, etc) │
└──────────────────────────────────────────────────────┘
```

### For Developers

These files serve as:

- **Single source of truth** for AI model specifications
- **Quick reference** during development
- **Validation** before deployment
- **Documentation** for team members

## Related Documentation

- Project specifications → `/specs/001-ai-chatbot-wrapper/spec.md`
- Database schema → `/specs/001-ai-chatbot-wrapper/data-model.md`
- API contracts → `/specs/001-ai-chatbot-wrapper/contracts/convex-api.md`
- Task tracking → `/specs/001-ai-chatbot-wrapper/tasks.md`

## Keeping Documentation Updated

When adding support for new AI providers:

1. Create a new `{provider}-models-reference.md` file
2. Follow the structure of existing reference files
3. Include all relevant model specifications
4. Update this README with the new file
5. Update `.github/copilot-instructions.md` to reference it

---

**Remember**: Outdated assumptions about AI models lead to bugs. Always verify against these references! 🎯
