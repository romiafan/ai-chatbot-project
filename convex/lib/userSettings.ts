import { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Retrieves API keys for a user, with fallback to admin keys.
 *
 * @param ctx - Convex query context
 * @param userId - Clerk user ID
 * @param provider - AI provider ("openai" or "gemini")
 * @returns API key string or null if not configured
 */
export async function getApiKey(
  ctx: QueryCtx,
  userId: string,
  provider: "openai" | "gemini"
): Promise<string | null> {
  // Get user settings
  const settings = await ctx.db
    .query("userSettings")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  // If user wants to use their own keys and has them configured
  if (settings && !settings.useAdminKeys) {
    const userKey =
      provider === "openai" ? settings.openaiApiKey : settings.geminiApiKey;

    if (userKey) {
      return userKey;
    }
  }

  // Fall back to admin keys from environment variables
  const adminKey =
    provider === "openai"
      ? process.env.OPENAI_API_KEY
      : process.env.GEMINI_API_KEY;

  return adminKey || null;
}

/**
 * Gets the default provider and model for a user.
 * Falls back to system defaults if user settings don't exist.
 *
 * @param ctx - Convex query context
 * @param userId - Clerk user ID
 * @returns Object with provider and model
 */
export async function getUserDefaults(
  ctx: QueryCtx,
  userId: string
): Promise<{ provider: "openai" | "gemini"; model: string }> {
  const settings = await ctx.db
    .query("userSettings")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (settings) {
    return {
      provider: settings.defaultProvider,
      model: settings.defaultModel,
    };
  }

  // System defaults from environment variables
  const defaultProvider =
    (process.env.NEXT_PUBLIC_DEFAULT_AI_PROVIDER as "openai" | "gemini") ||
    "openai";
  const defaultModel = process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || "gpt-4o";

  return { provider: defaultProvider, model: defaultModel };
}
