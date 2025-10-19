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
 * List all conversations for the current user, sorted by most recent first
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    // Sort by updatedAt descending (most recent first)
    conversations.sort((a, b) => b.updatedAt - a.updatedAt);

    // Add message count for each conversation
    const conversationsWithCount = await Promise.all(
      conversations.map(async (conv) => {
        const messageCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect()
          .then((messages) => messages.length);

        return {
          ...conv,
          messageCount,
        };
      })
    );

    return conversationsWithCount;
  },
});

/**
 * Get a single conversation by ID
 */
export const get = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      return null;
    }

    // Verify user owns this conversation
    if (conversation.userId !== identity.subject) {
      throwError(
        ErrorCode.FORBIDDEN,
        "You don't have permission to access this conversation"
      );
    }

    return conversation;
  },
});

/**
 * Create a new conversation
 */
export const create = mutation({
  args: {
    title: v.optional(v.string()),
    provider: v.union(v.literal("openai"), v.literal("gemini")),
    model: v.string(),
    ragEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Validate inputs
    validateRequired(args.provider, "provider");
    validateRequired(args.model, "model");

    if (args.title) {
      validateStringLength(args.title, "title", 1, 200);
    }

    const now = Date.now();

    const conversationId = await ctx.db.insert("conversations", {
      userId: identity.subject,
      title: args.title || "New Conversation",
      provider: args.provider,
      model: args.model,
      ragEnabled: args.ragEnabled ?? false,
      createdAt: now,
      updatedAt: now,
    });

    return conversationId;
  },
});

/**
 * Update conversation settings (provider, model, RAG toggle, title)
 */
export const update = mutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.optional(v.string()),
    provider: v.optional(v.union(v.literal("openai"), v.literal("gemini"))),
    model: v.optional(v.string()),
    ragEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throwError(ErrorCode.NOT_FOUND, "Conversation not found");
    }

    // Verify user owns this conversation
    if (conversation.userId !== identity.subject) {
      throwError(
        ErrorCode.FORBIDDEN,
        "You don't have permission to update this conversation"
      );
    }

    // Validate title if provided
    if (args.title !== undefined) {
      validateStringLength(args.title, "title", 1, 200);
    }

    // Build update object with only provided fields
    const updates: {
      title?: string;
      provider?: "openai" | "gemini";
      model?: string;
      ragEnabled?: boolean;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.provider !== undefined) updates.provider = args.provider;
    if (args.model !== undefined) updates.model = args.model;
    if (args.ragEnabled !== undefined) updates.ragEnabled = args.ragEnabled;

    await ctx.db.patch(args.conversationId, updates);

    return args.conversationId;
  },
});

/**
 * Delete a conversation and all associated data (messages, files, chunks)
 */
export const remove = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throwError(ErrorCode.NOT_FOUND, "Conversation not found");
    }

    // Verify user owns this conversation
    if (conversation.userId !== identity.subject) {
      throwError(
        ErrorCode.FORBIDDEN,
        "You don't have permission to delete this conversation"
      );
    }

    // Delete all messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete all document chunks
    const chunks = await ctx.db
      .query("documentChunks")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }

    // Delete all file attachments
    const files = await ctx.db
      .query("fileAttachments")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const file of files) {
      // Delete from Convex storage if storageId exists
      if (file.storageId) {
        try {
          await ctx.storage.delete(file.storageId as any);
        } catch (error) {
          // Log but don't fail if storage delete fails
          console.error(
            `Failed to delete storage for file ${file._id}:`,
            error
          );
        }
      }
      await ctx.db.delete(file._id);
    }

    // Finally, delete the conversation itself
    await ctx.db.delete(args.conversationId);

    return { success: true };
  },
});
