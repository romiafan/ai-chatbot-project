/**
 * Provider configuration for AI models
 * Defines available providers, their models, and capabilities
 */

export interface ModelConfig {
  id: string;
  name: string;
  provider: "openai" | "gemini";
  contextWindow: number;
  supportsStreaming: boolean;
  costPer1kTokens: {
    input: number;
    output: number;
  };
}

export const PROVIDER_MODELS: Record<string, ModelConfig[]> = {
  openai: [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "openai",
      contextWindow: 128000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.005,
        output: 0.015,
      },
    },
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "openai",
      contextWindow: 128000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.00015,
        output: 0.0006,
      },
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "openai",
      contextWindow: 128000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.01,
        output: 0.03,
      },
    },
    {
      id: "gpt-4",
      name: "GPT-4",
      provider: "openai",
      contextWindow: 8192,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.03,
        output: 0.06,
      },
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "openai",
      contextWindow: 16385,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.0005,
        output: 0.0015,
      },
    },
  ],
  gemini: [
    {
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
      provider: "gemini",
      contextWindow: 1000000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0,
        output: 0,
      },
    },
    {
      id: "gemini-2.5-flash-lite",
      name: "Gemini 2.5 Flash Lite",
      provider: "gemini",
      contextWindow: 1000000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0,
        output: 0,
      },
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      provider: "gemini",
      contextWindow: 1000000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.00125,
        output: 0.005,
      },
    },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      provider: "gemini",
      contextWindow: 1000000,
      supportsStreaming: true,
      costPer1kTokens: {
        input: 0.000075,
        output: 0.0003,
      },
    },
  ],
};

export const DEFAULT_PROVIDER = "openai";
export const DEFAULT_MODEL = "gpt-4o-mini";

/**
 * Get all models for a specific provider
 */
export function getProviderModels(
  provider: "openai" | "gemini"
): ModelConfig[] {
  return PROVIDER_MODELS[provider] || [];
}

/**
 * Get model config by ID
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  for (const models of Object.values(PROVIDER_MODELS)) {
    const model = models.find((m) => m.id === modelId);
    if (model) return model;
  }
  return undefined;
}

/**
 * Get all available models
 */
export function getAllModels(): ModelConfig[] {
  return Object.values(PROVIDER_MODELS).flat();
}
