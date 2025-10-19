/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as conversations from "../conversations.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_contextManager from "../lib/contextManager.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_providerConfig from "../lib/providerConfig.js";
import type * as lib_tokenCounter from "../lib/tokenCounter.js";
import type * as lib_userSettings from "../lib/userSettings.js";
import type * as messages from "../messages.js";
import type * as userSettings from "../userSettings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  conversations: typeof conversations;
  "lib/auth": typeof lib_auth;
  "lib/contextManager": typeof lib_contextManager;
  "lib/errors": typeof lib_errors;
  "lib/providerConfig": typeof lib_providerConfig;
  "lib/tokenCounter": typeof lib_tokenCounter;
  "lib/userSettings": typeof lib_userSettings;
  messages: typeof messages;
  userSettings: typeof userSettings;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
