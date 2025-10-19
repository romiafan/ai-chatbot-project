import { query } from "./_generated/server";
import { requireAuth } from "./lib/auth";

/**
 * Placeholder query for messages - will be fully implemented in Phase 3 (T010).
 * This temporary implementation ensures the schema deploys without errors.
 */
export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);
    // Placeholder: return empty array until Phase 3 implementation
    return [];
  },
});
