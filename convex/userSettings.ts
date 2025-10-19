/**
 * User settings mutations
 * Handles user preferences including API keys and default provider/model
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./lib/auth";
import { ErrorCode, throwError, validateStringLength } from "./lib/errors";

/**
 * Get current user's settings
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    return settings;
  },
});

/**
 * Update user settings (API keys, default provider/model)
 */
export const update = mutation({
  args: {
    openaiApiKey: v.optional(v.string()),
    geminiApiKey: v.optional(v.string()),
    defaultProvider: v.optional(
      v.union(v.literal("openai"), v.literal("gemini"))
    ),
    defaultModel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    // Validate API keys if provided (basic length check)
    if (args.openaiApiKey !== undefined) {
      validateStringLength(args.openaiApiKey, "openaiApiKey", 0, 500);
    }
    if (args.geminiApiKey !== undefined) {
      validateStringLength(args.geminiApiKey, "geminiApiKey", 0, 500);
    }

    // Get existing settings
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      // Update existing settings
      await ctx.db.patch(existing._id, {
        ...(args.openaiApiKey !== undefined && {
          openaiApiKey: args.openaiApiKey,
        }),
        ...(args.geminiApiKey !== undefined && {
          geminiApiKey: args.geminiApiKey,
        }),
        ...(args.defaultProvider !== undefined && {
          defaultProvider: args.defaultProvider,
        }),
        ...(args.defaultModel !== undefined && {
          defaultModel: args.defaultModel,
        }),
        updatedAt: Date.now(),
      });

      return existing._id;
    } else {
      // Create new settings
      const settingsId = await ctx.db.insert("userSettings", {
        userId: identity.subject,
        openaiApiKey: args.openaiApiKey || "",
        geminiApiKey: args.geminiApiKey || "",
        defaultProvider: args.defaultProvider || "openai",
        defaultModel: args.defaultModel || "gpt-4o-mini",
        useAdminKeys: true, // Default to admin keys
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return settingsId;
    }
  },
});

/**
 * Delete API key for a specific provider
 */
export const deleteApiKey = mutation({
  args: {
    provider: v.union(v.literal("openai"), v.literal("gemini")),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (!settings) {
      throwError(ErrorCode.NOT_FOUND, "User settings not found");
    }

    // Clear the specified API key
    await ctx.db.patch(settings._id, {
      ...(args.provider === "openai" && { openaiApiKey: "" }),
      ...(args.provider === "gemini" && { geminiApiKey: "" }),
      updatedAt: Date.now(),
    });
  },
});
