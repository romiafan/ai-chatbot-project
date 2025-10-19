Here is the reference file for OpenAI's models, built in the same format you requested.

---

# OpenAI Models Reference

**Source**: [https://platform.openai.com/docs/models](https://platform.openai.com/docs/models) & [https://openai.com/api/pricing/](https://openai.com/api/pricing/)
**Last Updated**: October 19, 2025

## Available OpenAI Models

### GPT-5 (Reasoning)

**Model ID**: `gpt-5`

- **Status**: Stable (Production)
- **Context Window**: 400,000 tokens
- **Max Output**: 128,000 tokens (Note: Practical single-response limit may be lower; controllable via `verbosity` parameter)
- **Capabilities**:
  - Advanced reasoning & logic ("thinking")
  - Text generation
  - Vision (image understanding)
  - Code generation & agentic tasks
  - Function calling
- **Pricing (per 1M tokens)**:
  - Input: $1.25
  - Output: $10.00
- **Best For**: State-of-the-art coding, complex logic, scientific tasks, and multi-step agentic workflows.
- **Notes**: OpenAI's flagship reasoning model.

---

### GPT-5 mini (Reasoning)

**Model ID**: `gpt-5-mini`

- **Status**: Stable (Production)
- **Context Window**: 400,000 tokens
- **Max Output**: 128,000 tokens (See note for `gpt-5`)
- **Capabilities**:
  - Reasoning & logic
  - Text generation
  - Vision (image understanding)
  - Code generation
  - Function calling
- **Pricing (per 1M tokens)**:
  - Input: $0.25
  - Output: $2.00
- **Best For**: A faster, cheaper alternative to `gpt-5` for well-defined reasoning tasks.

---

### GPT-4.1 (General Purpose)

**Model ID**: `gpt-4.1`

- **Status**: Stable (Production)
- **Context Window**: 1,047,576 tokens (1M tokens)
- **Max Output**: 32,768 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - Code generation
  - Function calling
- **Pricing (per 1M tokens)**:
  - Input: $2.00
  - Output: $8.00
- **Best For**: Versatile, high-performance general tasks that do not require advanced reasoning.

---

### GPT-4.1 mini (General Purpose)

**Model ID**: `gpt-4.1-mini`

- **Status**: Stable (Production)
- **Context Window**: 1,047,576 tokens (1M tokens)
- **Max Output**: 32,768 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - Code generation
  - Function calling
- **Pricing (per 1M tokens)**:
  - Input: $0.40
  - Output: $1.60
- **Best For**: The best starting point for general-purpose applications; balances power, performance, and cost.

---

### GPT-4o (Multimodal)

**Model ID**: `gpt-4o`

- **Status**: Stable (Production)
- **Context Window**: 128,000 tokens
- **Max Output**: 16,384 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - **Audio input & output**
  - Function calling
- **Pricing (per 1M tokens)**:
  - Text Input: $2.50
  - Text Output: $10.00
  - Audio Input: $40.00
  - Audio Output: $80.00
- **Best For**: Natively multimodal tasks, especially those involving voice conversations or audio processing.

---

### GPT-4o mini (Multimodal)

**Model ID**: `gpt-4o-mini`

- **Status**: Stable (Production)
- **Context Window**: 128,000 tokens
- **Max Output**: 16,384 tokens
- **Capabilities**:
  - Text generation
  - Vision (image understanding)
  - **Audio input & output**
  - Function calling
- **Pricing (per 1M tokens)**:
  - Text Input: $0.15
  - Text Output: $0.60
  - Audio Input: $10.00
  - Audio Output: $20.00
- **Best For**: Cost-effective multimodal applications, like budget-friendly voice bots.

---

### Legacy Models (Deprecated)

#### GPT-4 & GPT-4 Turbo

**Model ID**: `gpt-4`, `gpt-4-turbo`

- **Status**: Deprecated (use `gpt-4.1` or `gpt-5-mini` instead)
- **Notes**: Superseded by the more capable and cost-effective `gpt-4.1` series.

#### GPT-3.5 Turbo

**Model ID**: `gpt-3.5-turbo`

- **Status**: Deprecated (use `gpt-4.1-mini` or `gpt-4o-mini` instead)
- **Notes**: Superseded by `gpt-4o-mini`, which is faster, more capable, and cheaper for most tasks.

---

## Model Selection Guide

### By Use Case

| Use Case                   | Recommended Model           | Reason                                            |
| :------------------------- | :-------------------------- | :------------------------------------------------ |
| **Chatbot (production)**   | `gpt-4.1-mini`              | Best balance of speed, cost, and general quality. |
| **Complex reasoning**      | `gpt-5`                     | Highest capability for logic, math, and code.     |
| **Voice/Audio Agent**      | `gpt-4o` or `gpt-4o-mini`   | Natively handles audio input and output.          |
| **High-volume / Low-cost** | `gpt-4o-mini`               | Extremely low cost for text tasks.                |
| **Long documents**         | `gpt-4.1` or `gpt-4.1-mini` | 1M token context window.                          |

### By Performance

| Metric                  | Fastest → Slowest                                      |
| :---------------------- | :----------------------------------------------------- |
| **Latency**             | 4o-mini \> 4.1-mini \> 4.1 \> 5-mini \> 5              |
| **Quality (Reasoning)** | 5 \> 5-mini \> 4.1 \> 4.1-mini \> 4o                   |
| **Context**             | 4.1 series (1M) \> 5 series (400K) \> 4o series (128K) |
| **Cost (Text)**         | 4o-mini \< 4.1-mini \< 5-mini \< 4.1 \< 5 \< 4o        |

---

## API Model Name Format

### Required Format for API Calls

```python
# ✅ CORRECT - Pass the model ID string directly
model="gpt-5-mini"

# ❌ WRONG - No "models/" prefix
model="models/gpt-5-mini"
```

### Example API Call (Python SDK)

```python
from openai import OpenAI
client = OpenAI(api_key="sk-...")

response = client.chat.completions.create(
  model="gpt-4.1-mini",  # ← Pass the model ID string
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  response_format={ "type": "json_object" } # Optional: for JSON mode
)

print(response.choices[0].message.content)
```

---

## Rate Limits (Usage Tiers)

Rate limits depend on your "Usage Tier," which increases automatically as you spend more with the API.

| Tier       | Qualifications        | Requests per minute (RPM) | Tokens per minute (TPM) | Requests per day (RPD) |
| :--------- | :-------------------- | :------------------------ | :---------------------- | :--------------------- |
| **Free**   | New account           | 3                         | 40,000                  | 200                    |
| **Tier 1** | Add payment method    | 500                       | 200,000                 | 10,000                 |
| **Tier 2** | \> $250 total spend   | 5,000                     | 2,000,000               | -                      |
| **Tier 3** | \> $1,000 total spend | 5,000                     | 4,000,000               | -                      |

_Note: Limits are illustrative (based on `gpt-4.1-mini`) and vary by model. Check your account settings for exact limits._

---

## Model Capabilities Matrix

| Feature              | GPT-5 | GPT-4.1 | GPT-4o | 4o-mini | Image 1 |
| :------------------- | :---: | :-----: | :----: | :-----: | :-----: |
| **Input: Text**      |  ✅   |   ✅    |   ✅   |   ✅    |   ✅    |
| **Input: Vision**    |  ✅   |   ✅    |   ✅   |   ✅    |   ✅    |
| **Input: Audio**     |  ❌   |   ❌    |   ✅   |   ✅    |   ❌    |
| **Output: Text**     |  ✅   |   ✅    |   ✅   |   ✅    |   ❌    |
| **Output: Audio**    |  ❌   |   ❌    |   ✅   |   ✅    |   ❌    |
| **Output: Image**    |  ❌   |   ❌    |   ❌   |   ❌    |   ✅    |
| **Reasoning**        |  ⭐   |   ✅    |   ✅   |   ✅    |   ❌    |
| **Function Calling** |  ✅   |   ✅    |   ✅   |   ✅    |   N/A   |
| **JSON Mode**        |  ✅   |   ✅    |   ✅   |   ✅    |   N/A   |

---

## Migration Guide

### From GPT-4 Turbo → GPT-4.1

```python
# Old (GPT-4 Turbo)
response = client.chat.completions.create(
  model="gpt-4-turbo",
  ...
)

# New (GPT-4.1 - Recommended replacement)
response = client.chat.completions.create(
  model="gpt-4.1", # More capable, 1M context
  ...
)
```

### From GPT-3.5 Turbo → GPT-4o-mini

```python
# Old (GPT-3.5 Turbo)
response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  ...
)

# New (GPT-4o-mini - Recommended replacement)
response = client.chat.completions.create(
  model="gpt-4o-mini", # Faster, cheaper, and more capable
  ...
)
```

---

## Error Handling

### Common Model-Related Errors

#### 1\. Authentication Error (401)

```
Error: 401 Incorrect API key provided
```

**Cause**: Your API key is invalid, expired, or has been revoked.
**Fix**:

- Generate a new API key in your OpenAI dashboard.
- Ensure the key is correctly set as an environment variable or in your client.

#### 2\. Quota Exceeded (429)

```
Error: 429 You exceeded your current quota, please check your plan and billing details.
```

**Cause**: You have hit your rate limit (RPM, TPM) for your usage tier.
**Fix**:

- Implement exponential backoff to retry requests after a delay.
- Increase your usage tier by adding a payment method or increasing your spend.

#### 3\. Model Not Found (404)

```
Error: 404 The model `gpt-4.1-x` does not exist
```

**Cause**: Model name typo, or your account does not have access to that model.
**Fix**:

- Check the model ID against the official list (e.g., `gpt-4.1`, not `gpt-4.1-x`).
- Ensure the model is not deprecated (e.g., `gpt-3.5-turbo` may be fully phased out).

#### 4\. Bad Request / Invalid (400)

```
Error: 400 This model's maximum context length is 128000 tokens.
```

**Cause**: Your input prompt (`messages`) plus the requested `max_tokens` exceeds the model's context window.
**Fix**:

- Reduce the length of your prompt.
- Use a model with a larger context window (e.g., `gpt-4.1-mini`).
- Do not set `max_tokens` higher than the model's allowed output.

---

**Last verified**: October 19, 2025
