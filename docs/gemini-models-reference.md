---

# Gemini Models Reference

**Source**: [https://ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) & [https://ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing)
**Last Updated**: October 19, 2025

## Available Gemini Models

### Gemini 2.5 Pro

**Model ID**: `gemini-2.5-pro`

- **Status**: Stable (Production)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 65,536 tokens
- **Capabilities**:
  - Text, Code, PDF, Image, Video, Audio inputs
  - Text, Code, JSON outputs
  - Advanced Reasoning ("Thinking")
  - Function Calling & Code Execution
  - Grounding (Google Search, Google Maps)
  - Context Caching & Batch API
- **Pricing (Pay-as-you-go, per 1M tokens)**:
  - Input: $1.25 (for prompts \> 200k tokens)
  - Output: $7.50 (for prompts \> 200k tokens)
  - (Pricing for smaller prompts is also available)
- **Best For**: State-of-the-art reasoning, complex problems (code, math, STEM), and analysis of large datasets or documents.
- **Notes**: Google's most advanced and capable thinking model.

---

### Gemini 2.5 Flash

**Model ID**: `gemini-2.5-flash`

- **Status**: Stable (Production)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 65,536 tokens
- **Capabilities**:
  - Text, Code, PDF, Image, Video, Audio inputs
  - Text, Code, JSON outputs
  - Reasoning ("Thinking")
  - Function Calling & Code Execution
  - Grounding (Google Search, Google Maps)
  - Context Caching & Batch API
- **Pricing (Pay-as-you-go, per 1M tokens)**:
  - Input: $0.30 (Text/Image/Video), $1.00 (Audio)
  - Output: $2.50
- **Best For**: Large-scale processing, low-latency tasks, agentic use cases, and applications needing a strong balance of price and performance.
- **Notes**: The best all-around model for price-performance.

---

### Gemini 2.5 Flash-Lite

**Model ID**: `gemini-2.5-flash-lite`

- **Status**: Stable (Production)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 65,536 tokens
- **Capabilities**:
  - Text, Code, PDF, Image, Video, Audio inputs
  - Text, Code, JSON outputs
  - Reasoning ("Thinking")
  - Function Calling & Code Execution
  - Grounding (Google Search)
  - Context Caching & Batch API
- **Pricing (Pay-as-you-go, per 1M tokens)**:
  - Input: $0.10 (Text/Image/Video), $0.30 (Audio)
  - Output: $0.40
- **Best For**: High-throughput, cost-sensitive, and ultra-low latency applications like translation, classification, and high-volume agents.
- **Notes**: The fastest and most cost-efficient model in the Gemini 2.5 family.

---

### Gemini 2.0 Flash

**Model ID**: `gemini-2.0-flash` (Stable version: `gemini-2.0-flash-001`)

- **Status**: Stable (Production, previous generation)
- **Context Window**: 1,048,576 tokens (1M tokens)
- **Max Output**: 8,192 tokens
- **Capabilities**:
  - Text, Image, Video, Audio inputs
  - Text output
  - Function Calling & Code Execution
  - Grounding (Google Search)
  - Live API
- **Pricing (Pay-as-you-go, per 1M tokens)**:
  - Input: $0.10 (Text/Image/Video), $0.70 (Audio)
  - Output: $0.40
- **Best For**: An upgrade path for 1.5 Flash users, offering a 1M context window and improved capabilities.
- **Notes**: Superseded by the Gemini 2.5 family for new projects.

---

### Legacy Models (Deprecated)

#### Gemini 1.5 Pro

**Model ID**: `gemini-1.5-pro`

- **Status**: Deprecated (use `gemini-2.5-pro` instead)
- **Notes**: Superseded by Gemini 2.5 Pro, which offers superior reasoning and capabilities.

#### Gemini 1.5 Flash

**Model ID**: `gemini-1.5-flash`

- **Status**: Deprecated (use `gemini-2.5-flash-lite` or `gemini-2.5-flash` instead)
- **Notes**: Superseded by the 2.5 Flash family. `gemini-2.0-flash` was the direct upgrade path.

---

## Model Selection Guide

### By Use Case

| Use Case                   | Recommended Model       | Reason                                           |
| :------------------------- | :---------------------- | :----------------------------------------------- |
| **Chatbot (production)**   | `gemini-2.5-flash`      | Best balance of speed, cost, and capability.     |
| **Complex reasoning**      | `gemini-2.5-pro`        | Most advanced "Thinking" for STEM, code, logic.  |
| **High-volume / Low-cost** | `gemini-2.5-flash-lite` | Lowest cost, fastest latency for simple tasks.   |
| **Long documents / RAG**   | `gemini-2.5-pro`        | Highest capability for analyzing large datasets. |
| **General Purpose Agent**  | `gemini-2.5-flash`      | Strong all-arounder with full tool use.          |

### By Performance

| Metric      | Fastest → Slowest                       |
| :---------- | :-------------------------------------- |
| **Latency** | Flash-Lite \> Flash \> Pro              |
| **Quality** | Pro \> Flash \> Flash-Lite              |
| **Context** | Pro (1M) = Flash (1M) = Flash-Lite (1M) |
| **Cost**    | Flash-Lite \< Flash \< Pro              |

---

## API Model Name Format

### Required Format for API Calls (Google AI SDK)

```typescript
// ✅ CORRECT - Include "models/" prefix
model: "models/gemini-2.5-flash";

// ❌ WRONG - Missing prefix
model: "gemini-2.5-flash";
```

### Example API Call (Node.js SDK)

```typescript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash", // ← Use full model path
});

async function run() {
  const prompt = "Hello!";
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

run();
```

---

## Rate Limits (Free Tier)

| Model                     | Requests per minute (RPM) | Tokens per minute (TPM) | Requests per day (RPD) |
| :------------------------ | :------------------------ | :---------------------- | :--------------------- |
| **Gemini 2.5 Pro**        | 5                         | 125,000                 | 100                    |
| **Gemini 2.5 Flash**      | 10                        | 250,000                 | 250                    |
| **Gemini 2.5 Flash-Lite** | 15                        | 250,000                 | 1,000                  |
| **Gemini 2.0 Flash**      | 15                        | 1,000,000               | 200                    |
| **Gemini 2.0 Flash-Lite** | 30                        | 1,000,000               | 200                    |

**Note**: Paid tiers (by setting up billing) offer significantly higher limits.

---

## Model Capabilities Matrix

| Feature                | 2.5 Pro | 2.5 Flash | 2.5 Flash-Lite | 2.0 Flash |
| :--------------------- | :-----: | :-------: | :------------: | :-------: |
| **Input: Text**        |   ✅    |    ✅     |       ✅       |    ✅     |
| **Input: Image**       |   ✅    |    ✅     |       ✅       |    ✅     |
| **Input: Audio**       |   ✅    |    ✅     |       ✅       |    ✅     |
| **Input: Video**       |   ✅    |    ✅     |       ✅       |    ✅     |
| **Input: PDF**         |   ✅    |    ✅     |       ✅       |    ❌     |
| **Output: Code**       |   ✅    |    ✅     |       ✅       |    ❌     |
| **Output: JSON**       |   ✅    |    ✅     |       ✅       |    ❌     |
| **Function Calling**   |   ✅    |    ✅     |       ✅       |    ✅     |
| **Code Execution**     |   ✅    |    ✅     |       ✅       |    ✅     |
| **Grounding (Search)** |   ✅    |    ✅     |       ✅       |    ✅     |
| **Context Caching**    |   ✅    |    ✅     |       ✅       |    ✅     |
| **Batch API**          |   ✅    |    ✅     |       ✅       |    ✅     |
| **Live API**           |   ❌    |    ✅     |       ❌       |    ✅     |

---

## Migration Guide

### From Gemini 1.5 → 2.5

```typescript
// Old (1.5 Flash - Deprecated)
model: "models/gemini-1.5-flash";
contextWindow: 1048576;

// New (2.5 Flash-Lite - Recommended replacement)
// Offers better quality, speed, and cost
model: "models/gemini-2.5-flash-lite";
contextWindow: 1048576;
```

### From OpenAI → Gemini

| OpenAI Model  | Gemini Equivalent       | Notes                                 |
| :------------ | :---------------------- | :------------------------------------ |
| gpt-4o        | `gemini-2.5-pro`        | Top-tier reasoning, multimodal.       |
| gpt-4o-mini   | `gemini-2.5-flash`      | Best balance of speed, cost, quality. |
| gpt-3.5-turbo | `gemini-2.5-flash-lite` | Fastest, lowest cost for high volume. |

---

## Error Handling

### Common Model-Related Errors

#### 1\. Model Not Found (404)

```
Error: 404 Not Found
```

**Cause**: Model name typo, or the model is not available in your region or project.
**Fix**:

- Double-check the model ID (e.g., `gemini-2.5-flash`).
- Ensure you are using the correct API endpoint and project setup.

#### 2\. Quota Exceeded (429)

```
Error: 429 Resource exhausted (Rate limit exceeded)
```

**Cause**: Exceeded free tier limits (e.g., \> 15 RPM on Flash-Lite).
**Fix**:

- Implement exponential backoff in your code to retry.
- Set up a billing account for pay-as-you-go with much higher limits.

#### 3\. Invalid Argument (400)

```
Error: 400 INVALID_ARGUMENT
```

**Cause**: Malformed request. Common issues include incorrect request body, invalid API key, or unsupported model parameters (e.g., `max_output_tokens` too high).
**Fix**:

- Check the API reference for the correct request format.
- Verify your API key is correct and active.
- Ensure parameters like `temperature` are within the valid range.

#### 4\. Internal Error (500)

```
Error: 500 INTERNAL
```

**Cause**: An unexpected error on Google's side.
**Fix**:

- Retry the request after a short delay.
- If the issue persists, check the Google Cloud Status Dashboard.

---

## Best Practices

### 1\. Model Selection Strategy

```typescript
// Production: Use stable models
const PRODUCTION_MODEL = "gemini-2.5-flash"; // Good balance

// Development: Can use stable or preview models
const DEV_MODEL = "gemini-2.5-pro"; // For testing max capability

// Use environment variable
const model =
  process.env.NODE_ENV === "production" ? PRODUCTION_MODEL : DEV_MODEL;
```

### 2\. Cost Optimization

```typescript
// High-volume, simple task (e.g., classification, summarization)
if (taskType === "simple_batch") {
  model = "gemini-2.5-flash-lite"; // Cheapest & fastest
}
// Complex reasoning needed
else if (taskType === "complex_reasoning") {
  model = "gemini-2.5-pro"; // Most capable
}
// Default for interactive chat
else {
  model = "gemini-2.5-flash"; // Best balance
}
```

### 3\. Fallback Strategy

```typescript
const MODEL_FALLBACK_LIST = [
  "models/gemini-2.5-flash", // Primary
  "models/gemini-2.5-flash-lite", // Fallback 1 (cheaper, faster)
];

async function callGeminiWithFallback(prompt: string) {
  for (const modelName of MODEL_FALLBACK_LIST) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response;
    } catch (error) {
      console.warn(`Model ${modelName} failed, trying next...`, error);
      continue; // Try the next model in the list
    }
  }
  throw new Error("All Gemini models failed");
}
```

---

## Version History (Recent)

| Date          | Change                                           |
| :------------ | :----------------------------------------------- |
| July 22, 2025 | Gemini 2.5 Flash-Lite becomes stable (GA).       |
| June 17, 2025 | Gemini 2.5 Pro and 2.5 Flash become stable (GA). |
| Feb 2025      | Gemini 2.0 Flash and 2.0 Flash-Lite released.    |
| \~Mid-2025    | Gemini 1.5 models (Pro, Flash) are deprecated.   |

---

## Additional Resources

- **Official Docs**: [https://ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)
- **Pricing**: [https://ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Rate Limits**: [https://ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- **API Reference**: [https://ai.google.dev/api](https://ai.google.dev/api)
- **Quickstart**: [https://ai.google.dev/gemini-api/docs/quickstart](https://ai.google.dev/gemini-api/docs/quickstart)

---

## Notes for AI Chatbot Project

### Current Configuration (Example)

```bash
# .env.local
NEXT_PUBLIC_DEFAULT_AI_PROVIDER=gemini
# Using an older model, should update
NEXT_PUBLIC_DEFAULT_AI_MODEL=gemini-2.0-flash
GEMINI_API_KEY=AIza...
```

### Recommended Production Settings

```bash
# For production deployment
NEXT_PUBLIC_DEFAULT_AI_PROVIDER=gemini
# Use a stable, cost-effective 2.5 model
NEXT_PUBLIC_DEFAULT_AI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=<your-production-key>
```

### Model IDs in providerConfig.ts

Ensure these match the latest official stable model IDs:

```typescript
gemini: [
  { id: "gemini-2.5-pro", ... },          // ✅ Correct
  { id: "gemini-2.5-flash", ... },        // ✅ Correct (Recommended default)
  { id: "gemini-2.5-flash-lite", ... },   // ✅ Correct (Good for high-volume)
  // ❌ DEPRECATED: "gemini-1.5-pro"
  // ❌ DEPRECATED: "gemini-1.5-flash"
]
```
