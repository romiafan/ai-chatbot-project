# Gemini Models Reference

**Source**: https://ai.google.dev/gemini-api/docs/models  
**Last Updated**: October 19, 2025

## Available Gemini Models

### Gemini 2.0 Flash (Experimental)

**Model ID**: `gemini-2.0-flash-exp`

- **Status**: Experimental (Preview)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 8,192 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - Audio understanding
  - Video understanding
  - Multimodal inputs
- **Pricing**: Free during experimental period
- **Best For**: Testing latest features, multimodal applications
- **Notes**: Experimental features may change, not recommended for production

---

### Gemini 1.5 Pro

**Model ID**: `gemini-1.5-pro`

- **Status**: Stable (Production)
- **Context Window**: 2,097,152 tokens (2M tokens)
- **Max Output**: 8,192 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - Audio understanding
  - Video understanding
  - Multimodal inputs
  - Code generation
  - Function calling
- **Pricing**:
  - Input: $1.25 per 1M tokens
  - Output: $5.00 per 1M tokens
- **Best For**: Complex reasoning, long context tasks, production applications
- **Notes**: Most capable Gemini 1.5 model

---

### Gemini 1.5 Flash

**Model ID**: `gemini-1.5-flash`

- **Status**: Stable (Production)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 8,192 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - Audio understanding
  - Video understanding
  - Multimodal inputs
  - Code generation
  - Function calling
- **Pricing**:
  - Input: $0.075 per 1M tokens
  - Output: $0.30 per 1M tokens
- **Best For**: Fast responses, cost-effective applications, chatbots
- **Notes**: Optimized for speed and efficiency

---

### Gemini 1.5 Flash-8B

**Model ID**: `gemini-1.5-flash-8b`

- **Status**: Stable (Production)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 8,192 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - Multimodal inputs
- **Pricing**:
  - Input: $0.0375 per 1M tokens
  - Output: $0.15 per 1M tokens
- **Best For**: High-volume applications, ultra-low latency
- **Notes**: Smallest, fastest Gemini 1.5 model

---

### Legacy Models (Gemini 1.0)

#### Gemini 1.0 Pro

**Model ID**: `gemini-1.0-pro`

- **Status**: Deprecated (use Gemini 1.5 instead)
- **Context Window**: 32,768 tokens (32K)
- **Max Output**: 8,192 tokens
- **Notes**: Superseded by Gemini 1.5 Flash

---

## Model Selection Guide

### By Use Case

| Use Case             | Recommended Model      | Reason                               |
| -------------------- | ---------------------- | ------------------------------------ |
| Chatbot (production) | `gemini-1.5-flash`     | Best balance of speed, cost, quality |
| Complex reasoning    | `gemini-1.5-pro`       | Highest capability, long context     |
| High-volume API      | `gemini-1.5-flash-8b`  | Lowest cost, fastest                 |
| Testing new features | `gemini-2.0-flash-exp` | Latest experimental capabilities     |
| Long documents       | `gemini-1.5-pro`       | 2M token context window              |
| Budget-conscious     | `gemini-1.5-flash-8b`  | 50% cheaper than 1.5-flash           |

### By Performance

| Metric  | Fastest → Slowest                |
| ------- | -------------------------------- |
| Latency | flash-8b > flash > pro > 2.0-exp |
| Quality | pro ≥ 2.0-exp > flash > flash-8b |
| Context | pro (2M) > others (1M)           |
| Cost    | flash-8b < flash < pro           |

---

## API Model Name Format

### Required Format for API Calls

```typescript
// ✅ CORRECT - Include "models/" prefix
model: "models/gemini-1.5-flash";

// ❌ WRONG - Missing prefix
model: "gemini-1.5-flash";
```

### Example API Call

```typescript
const genAI = new GoogleGenAI({ apiKey });

const response = await genAI.models.generateContent({
  model: "models/gemini-1.5-flash", // ← Include "models/" prefix
  contents: [{ role: "user", parts: [{ text: "Hello!" }] }],
});
```

---

## Rate Limits (Free Tier)

- **Requests per minute**: 15 RPM
- **Requests per day**: 1,500 RPD
- **Tokens per minute**: 1,000,000 TPM

**Note**: Paid tiers have higher limits. See https://ai.google.dev/pricing

---

## Model Capabilities Matrix

| Feature          | 2.0 Flash Exp | 1.5 Pro | 1.5 Flash | 1.5 Flash-8B |
| ---------------- | ------------- | ------- | --------- | ------------ |
| Text             | ✅            | ✅      | ✅        | ✅           |
| Vision           | ✅            | ✅      | ✅        | ✅           |
| Audio            | ✅            | ✅      | ✅        | ❌           |
| Video            | ✅            | ✅      | ✅        | ❌           |
| Function Calling | ✅            | ✅      | ✅        | ❌           |
| Code Execution   | ✅            | ✅      | ✅        | ❌           |
| Grounding        | ✅            | ✅      | ✅        | ❌           |
| Context Caching  | ❌            | ✅      | ✅        | ✅           |

---

## Migration Guide

### From Gemini 1.0 → 1.5

```typescript
// Old (1.0 Pro)
model: "models/gemini-1.0-pro";
contextWindow: 32768;

// New (1.5 Flash - recommended replacement)
model: "models/gemini-1.5-flash";
contextWindow: 1048576; // 32x larger!
```

### From OpenAI GPT-4 → Gemini

| OpenAI Model  | Gemini Equivalent   | Notes                          |
| ------------- | ------------------- | ------------------------------ |
| gpt-4o        | gemini-1.5-pro      | Similar capability, 4x cheaper |
| gpt-4o-mini   | gemini-1.5-flash    | Similar speed, 10x cheaper     |
| gpt-3.5-turbo | gemini-1.5-flash-8b | Faster, 20x cheaper            |

---

## Error Handling

### Common Model-Related Errors

#### 1. Model Not Found (404)

```
Error: models/gemini-1.5-flash is not found for API version v1beta
```

**Cause**: Using wrong API version or model name typo

**Fix**:

- Ensure model name is correct (no typos)
- Check API version compatibility
- Use stable models (not experimental) for production

#### 2. Quota Exceeded (429)

```
Error: 429 Resource exhausted
```

**Cause**: Rate limit exceeded

**Fix**:

- Implement exponential backoff
- Upgrade to paid tier
- Use flash-8b model for high-volume

#### 3. Invalid Model ID

```
Error: Invalid model specified
```

**Cause**: Model doesn't exist or is deprecated

**Fix**:

- Check model ID against current list
- Use stable model IDs from this document

---

## Best Practices

### 1. Model Selection Strategy

```typescript
// Production: Use stable models
const PRODUCTION_MODEL = "gemini-1.5-flash";

// Development: Test with experimental
const DEV_MODEL = "gemini-2.0-flash-exp";

// Use environment variable
const model =
  process.env.NODE_ENV === "production" ? PRODUCTION_MODEL : DEV_MODEL;
```

### 2. Cost Optimization

```typescript
// High-volume use case
if (requestsPerDay > 100000) {
  model = "gemini-1.5-flash-8b"; // Cheapest
}
// Complex reasoning needed
else if (taskComplexity === "high") {
  model = "gemini-1.5-pro"; // Most capable
}
// Default
else {
  model = "gemini-1.5-flash"; // Best balance
}
```

### 3. Fallback Strategy

```typescript
const MODEL_FALLBACK = [
  "gemini-1.5-flash", // Primary
  "gemini-1.5-flash-8b", // Fallback 1
  "gemini-1.5-pro", // Fallback 2
];

async function callGemini(prompt: string) {
  for (const model of MODEL_FALLBACK) {
    try {
      return await genAI.models.generateContent({
        model: `models/${model}`,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    } catch (error) {
      console.warn(`Model ${model} failed, trying next...`);
      continue;
    }
  }
  throw new Error("All models failed");
}
```

---

## Version History

| Date       | Change                                 |
| ---------- | -------------------------------------- |
| 2024-12-11 | Gemini 2.0 Flash Experimental released |
| 2024-05-14 | Gemini 1.5 Flash and Pro GA (stable)   |
| 2024-02-15 | Gemini 1.5 Pro preview                 |
| 2023-12-13 | Gemini 1.0 Pro initial release         |

---

## Additional Resources

- **Official Docs**: https://ai.google.dev/gemini-api/docs/models
- **Pricing**: https://ai.google.dev/pricing
- **API Reference**: https://ai.google.dev/api
- **Model Card**: https://ai.google.dev/gemini-api/docs/model-card
- **Quickstart**: https://ai.google.dev/gemini-api/docs/quickstart

---

## Notes for AI Chatbot Project

### Current Configuration

```bash
# .env.local
NEXT_PUBLIC_DEFAULT_AI_PROVIDER=gemini
NEXT_PUBLIC_DEFAULT_AI_MODEL=gemini-2.0-flash-exp
GEMINI_API_KEY=AIza...
```

### Recommended Production Settings

```bash
# For production deployment
NEXT_PUBLIC_DEFAULT_AI_PROVIDER=gemini
NEXT_PUBLIC_DEFAULT_AI_MODEL=gemini-1.5-flash  # ← Use stable model
GEMINI_API_KEY=<your-production-key>
```

### Model IDs in providerConfig.ts

Ensure these match official model IDs:

```typescript
gemini: [
  { id: "gemini-2.0-flash-exp", ... },      // ✅ Correct
  { id: "gemini-1.5-pro", ... },            // ✅ Correct
  { id: "gemini-1.5-flash", ... },          // ✅ Correct
  { id: "gemini-1.5-flash-8b", ... },       // ✅ Add this
  // ❌ DON'T: "gemini-2.5-flash" (doesn't exist)
]
```

---

**Last verified**: October 19, 2025  
**Status**: Active reference document for ai-chatbot-project
