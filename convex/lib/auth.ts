import { QueryCtx, MutationCtx } from "../_generated/server";
import { ErrorCode, throwError, ErrorMessages } from "./errors";

/**
 * Authentication helper that enforces user authentication.
 *
 * This function MUST be called at the beginning of every Convex query or mutation
 * that accesses user-specific data. It retrieves the authenticated user's identity
 * from Clerk and throws an error if the user is not authenticated.
 *
 * @param ctx - Convex query or mutation context
 * @returns The authenticated user's identity
 * @throws UNAUTHORIZED error if user is not authenticated
 *
 * @example
 * ```typescript
 * export const getMyConversations = query({
 *   args: {},
 *   handler: async (ctx) => {
 *     const identity = await requireAuth(ctx);
 *     return await ctx.db
 *       .query("conversations")
 *       .withIndex("by_user", (q) => q.eq("userId", identity.subject))
 *       .collect();
 *   },
 * });
 * ```
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throwError(ErrorCode.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
  }

  return identity;
}

/**
 * Optional authentication helper that returns the user identity if authenticated,
 * or null if not. Use this for operations that work differently for authenticated
 * vs anonymous users.
 *
 * @param ctx - Convex query or mutation context
 * @returns The authenticated user's identity or null
 */
export async function getAuthOptional(ctx: QueryCtx | MutationCtx) {
  return await ctx.auth.getUserIdentity();
}

/**
 * Checks if a user has permission to access a resource.
 * Currently checks if the userId matches the authenticated user's ID.
 *
 * @param identity - User identity from requireAuth()
 * @param resourceUserId - The userId associated with the resource
 * @throws FORBIDDEN error if user doesn't have permission
 */
export function checkPermission(
  identity: { subject: string },
  resourceUserId: string
) {
  if (identity.subject !== resourceUserId) {
    throwError(ErrorCode.FORBIDDEN, ErrorMessages.FORBIDDEN);
  }
}
