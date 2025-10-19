import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    // Add other fields as needed
    // text: v.string(),
    // createdAt: v.number(),
  }),
});
