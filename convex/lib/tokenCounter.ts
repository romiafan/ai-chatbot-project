import { encoding_for_model, TiktokenModel } from "tiktoken";

/**
 * Count tokens in text using tiktoken for a specific model
 *
 * @param text - The text to count tokens for
 * @param model - The model name (e.g., "gpt-4o", "gpt-3.5-turbo")
 * @returns Number of tokens
 */
export function countTokens(text: string, model: string): number {
  try {
    // Map model names to tiktoken models
    const tiktokenModel = mapModelToTiktoken(model);
    const encoding = encoding_for_model(tiktokenModel);
    const tokens = encoding.encode(text);
    encoding.free(); // Free up memory
    return tokens.length;
  } catch (error) {
    // Fallback to rough estimate if model not supported
    // ~4 characters per token on average
    console.warn(`Tiktoken encoding failed for model ${model}, using fallback`);
    return Math.ceil(text.length / 4);
  }
}

/**
 * Count tokens for an array of messages (conversation history)
 *
 * @param messages - Array of message objects
 * @param model - The model name
 * @returns Total token count for all messages
 */
export function countMessagesTokens(
  messages: Array<{ role: string; content: string }>,
  model: string
): number {
  let totalTokens = 0;

  for (const message of messages) {
    // Count tokens in message content
    totalTokens += countTokens(message.content, model);

    // Add overhead for message formatting (role, delimiters, etc.)
    // OpenAI adds ~3-4 tokens per message for formatting
    totalTokens += 4;
  }

  // Add overhead for conversation priming
  totalTokens += 3;

  return totalTokens;
}

/**
 * Map our model names to tiktoken model names
 *
 * @param model - Our model name (e.g., "gpt-4o", "gemini-1.5-pro")
 * @returns Tiktoken model name
 */
function mapModelToTiktoken(model: string): TiktokenModel {
  // OpenAI models
  if (
    model.startsWith("gpt-4") ||
    model === "gpt-4o" ||
    model === "gpt-4o-mini"
  ) {
    return "gpt-4";
  }
  if (model.startsWith("gpt-3.5")) {
    return "gpt-3.5-turbo";
  }

  // For Gemini and other non-OpenAI models, use gpt-3.5-turbo as approximation
  return "gpt-3.5-turbo";
}

/**
 * Get model context window limits
 *
 * @param model - The model name
 * @returns Maximum tokens for the model's context window
 */
export function getModelContextLimit(model: string): number {
  // OpenAI models
  if (model === "gpt-4o" || model === "gpt-4o-mini") {
    return 128000; // 128K context window
  }
  if (model.startsWith("gpt-4")) {
    return 8192; // Standard GPT-4 models
  }
  if (model === "gpt-3.5-turbo") {
    return 16385; // GPT-3.5 Turbo 16K
  }

  // Gemini models
  if (model === "gemini-1.5-pro") {
    return 1000000; // 1M context window
  }
  if (model === "gemini-1.5-flash") {
    return 1000000; // 1M context window
  }

  // Default conservative limit
  return 4096;
}
