import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { throwError, ErrorCode } from "./lib/errors";
import { pruneMessages } from "./lib/contextManager";

/**
 * Chat action - Generates AI response
 *
 * This action:
 * 1. Validates conversation exists and user owns it
 * 2. Retrieves conversation messages and prunes to context window
 * 3. Gets API key from user settings or environment
 * 4. Calls AI provider API
 * 5. Stores assistant response in database
 */
export const chat = action({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throwError(ErrorCode.UNAUTHORIZED, "Not authenticated");
    }

    // Get conversation details
    const conversation = await ctx.runQuery(api.conversations.get as any, {
      conversationId: args.conversationId,
    });

    if (!conversation) {
      throwError(ErrorCode.NOT_FOUND, "Conversation not found");
    }

    // Get conversation messages
    const allMessages = await ctx.runQuery(api.messages.list as any, {
      conversationId: args.conversationId,
    });

    // Prune messages to fit context window
    const messages = pruneMessages(
      allMessages.map((m: any) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      conversation.model
    );

    // Get API key from environment variables
    const apiKey =
      conversation.provider === "openai"
        ? process.env.OPENAI_API_KEY
        : process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throwError(
        ErrorCode.AI_API_ERROR,
        `No API key configured for ${conversation.provider}. Please set the ${
          conversation.provider === "openai"
            ? "OPENAI_API_KEY"
            : "GEMINI_API_KEY"
        } environment variable.`
      );
    }

    try {
      // Call appropriate AI provider
      let assistantMessage = "";

      if (conversation.provider === "openai") {
        assistantMessage = await streamOpenAI(
          apiKey,
          conversation.model,
          messages,
          ctx
        );
      } else if (conversation.provider === "gemini") {
        assistantMessage = await streamGemini(
          apiKey,
          conversation.model,
          messages,
          ctx
        );
      } else {
        throwError(
          ErrorCode.INVALID_INPUT,
          `Unsupported provider: ${conversation.provider}`
        );
      }

      // Store assistant response in database
      const now = Date.now();
      await ctx.runMutation(api.messages.createAssistant as any, {
        conversationId: args.conversationId,
        content: assistantMessage,
        provider: conversation.provider,
        model: conversation.model,
        createdAt: now,
      });

      return { content: assistantMessage };
    } catch (error: any) {
      console.error("AI API error:", error);
      throwError(
        ErrorCode.AI_API_ERROR,
        `AI provider error: ${error.message || "Unknown error"}`,
        { provider: conversation.provider, model: conversation.model }
      );
    }
  },
});

/**
 * Stream response from OpenAI
 */
async function streamOpenAI(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  ctx: any
): Promise<string> {
  const openai = new OpenAI({ apiKey });

  const stream = await openai.chat.completions.create({
    model,
    messages: messages as any,
    stream: true,
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      fullResponse += content;
      // In a real implementation, we'd emit SSE events here
      // For now, just accumulate the response
    }
  }

  return fullResponse;
}

/**
 * Stream response from Google Gemini
 */
async function streamGemini(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  ctx: any
): Promise<string> {
  const genAI = new GoogleGenAI({ apiKey });

  // Convert conversation history to Gemini format
  const contents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  try {
    const response = await genAI.models.generateContent({
      model: `models/${model}`,
      contents,
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}
