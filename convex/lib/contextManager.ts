import { countMessagesTokens, getModelContextLimit } from "./tokenCounter";

/**
 * Message interface for context management
 */
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Prune conversation messages to fit within model's context window
 * using a sliding window approach (keep recent messages)
 *
 * @param messages - All messages in the conversation
 * @param model - The model name
 * @param maxTokens - Optional maximum tokens (defaults to model's limit - 1000 for response)
 * @returns Pruned messages that fit within context window
 */
export function pruneMessages(
  messages: Message[],
  model: string,
  maxTokens?: number
): Message[] {
  const contextLimit = getModelContextLimit(model);

  // Reserve tokens for the AI response
  const responseReserve = 1000;
  const effectiveLimit = maxTokens || contextLimit - responseReserve;

  // Always keep system messages if present
  const systemMessages = messages.filter((m) => m.role === "system");
  const conversationMessages = messages.filter((m) => m.role !== "system");

  // If no messages or already within limit, return all
  const totalTokens = countMessagesTokens(messages, model);
  if (totalTokens <= effectiveLimit) {
    return messages;
  }

  // Start with most recent messages and work backwards
  const prunedMessages: Message[] = [];
  let currentTokenCount = countMessagesTokens(systemMessages, model);

  // Always include system messages at the start
  prunedMessages.push(...systemMessages);

  // Add messages from most recent to oldest until we hit the limit
  for (let i = conversationMessages.length - 1; i >= 0; i--) {
    const message = conversationMessages[i];
    const messageTokens = countMessagesTokens([message], model);

    if (currentTokenCount + messageTokens <= effectiveLimit) {
      prunedMessages.splice(systemMessages.length, 0, message); // Insert after system messages
      currentTokenCount += messageTokens;
    } else {
      // Stop adding more messages once we hit the limit
      break;
    }
  }

  // Sort messages back to chronological order (oldest first)
  return prunedMessages.sort((a, b) => {
    const aIndex = messages.indexOf(a);
    const bIndex = messages.indexOf(b);
    return aIndex - bIndex;
  });
}

/**
 * Calculate remaining tokens available for new message
 *
 * @param messages - Current conversation messages
 * @param model - The model name
 * @returns Number of tokens available for new content
 */
export function getRemainingTokens(messages: Message[], model: string): number {
  const contextLimit = getModelContextLimit(model);
  const currentTokens = countMessagesTokens(messages, model);
  const responseReserve = 1000;

  return Math.max(0, contextLimit - currentTokens - responseReserve);
}

/**
 * Check if a new message would exceed context window
 *
 * @param messages - Current conversation messages
 * @param newMessageContent - Content of the new message to add
 * @param model - The model name
 * @returns True if adding this message would exceed the limit
 */
export function wouldExceedLimit(
  messages: Message[],
  newMessageContent: string,
  model: string
): boolean {
  const newMessage: Message = {
    role: "user",
    content: newMessageContent,
  };

  const totalTokens = countMessagesTokens([...messages, newMessage], model);
  const contextLimit = getModelContextLimit(model);
  const responseReserve = 1000;

  return totalTokens + responseReserve > contextLimit;
}
