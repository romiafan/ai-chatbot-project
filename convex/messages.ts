import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAuth } from "./lib/auth";
import {
  throwError,
  ErrorCode,
  validateRequired,
  validateStringLength,
} from "./lib/errors";

/**
 * List all messages in a conversation, ordered by creation time
 */
export const list = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Verify conversation exists and user owns it
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throwError(ErrorCode.NOT_FOUND, "Conversation not found");
    }

    if (conversation.userId !== identity.subject) {
      throwError(
        ErrorCode.FORBIDDEN,
        "You don't have permission to access this conversation"
      );
    }

    // Get all messages for this conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Sort by createdAt ascending (oldest first)
    messages.sort((a, b) => a.createdAt - b.createdAt);

    return messages;
  },
});

/**
 * Create a new user message in a conversation
 */
export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Validate inputs
    validateRequired(args.content, "content");
    validateStringLength(args.content, "content", 1, 10000);

    // Verify conversation exists and user owns it
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throwError(ErrorCode.NOT_FOUND, "Conversation not found");
    }

    if (conversation.userId !== identity.subject) {
      throwError(
        ErrorCode.FORBIDDEN,
        "You don't have permission to send messages in this conversation"
      );
    }

    const now = Date.now();

    // Create user message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "user",
      content: args.content,
      provider: "user",
      createdAt: now,
    });

    // Update conversation's updatedAt timestamp
    await ctx.db.patch(args.conversationId, {
      updatedAt: now,
    });

    return messageId;
  },
});

/**
 * Create an assistant message (called by AI action)
 */
export const createAssistant = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    provider: v.union(v.literal("openai"), v.literal("gemini")),
    model: v.string(),
    createdAt: v.number(),
    citations: v.optional(
      v.array(
        v.object({
          fileId: v.id("fileAttachments"),
          fileName: v.string(),
          chunkIndex: v.number(),
          relevanceScore: v.number(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    // No auth check needed - this is called by internal AI action
    // which already verified conversation ownership

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: "assistant",
      content: args.content,
      provider: args.provider,
      model: args.model,
      createdAt: args.createdAt,
      citations: args.citations,
    });

    return messageId;
  },
});
