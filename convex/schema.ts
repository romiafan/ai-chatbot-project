import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User conversations
  conversations: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(), // Conversation title (auto-generated from first message)
    provider: v.union(
      // AI provider
      v.literal("openai"),
      v.literal("gemini")
    ),
    model: v.string(), // Model name (e.g., "gpt-4o", "gemini-1.5-pro")
    ragEnabled: v.boolean(), // RAG toggle state
    createdAt: v.number(), // Timestamp (ms since epoch)
    updatedAt: v.number(), // Last message timestamp
  })
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"]),

  // Chat messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(
      // Message role
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(), // Message text content
    provider: v.union(
      // AI provider that generated this message
      v.literal("openai"),
      v.literal("gemini"),
      v.literal("user") // For user messages
    ),
    model: v.optional(v.string()), // Model used (only for assistant messages)
    citations: v.optional(
      // RAG citations (only if RAG was used)
      v.array(
        v.object({
          fileId: v.id("fileAttachments"),
          fileName: v.string(),
          chunkIndex: v.number(),
          relevanceScore: v.number(),
        })
      )
    ),
    createdAt: v.number(), // Timestamp (ms since epoch)
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_conversation_role", ["conversationId", "role"]),

  // Uploaded files
  fileAttachments: defineTable({
    conversationId: v.id("conversations"),
    fileName: v.string(), // Original filename
    fileType: v.string(), // MIME type (e.g., "application/pdf")
    fileSize: v.number(), // Size in bytes
    storageId: v.string(), // Convex storage ID
    extractedText: v.optional(v.string()), // Extracted text content (for PDFs)
    uploadedAt: v.number(), // Timestamp (ms since epoch)
  }).index("by_conversation", ["conversationId"]),

  // Document chunks for RAG
  documentChunks: defineTable({
    fileId: v.id("fileAttachments"),
    conversationId: v.id("conversations"),
    chunkIndex: v.number(), // Position in original document (0-indexed)
    text: v.string(), // Chunk text content (1000 tokens)
    embedding: v.array(v.float64()), // Vector embedding (1536 dimensions)
    tokenCount: v.number(), // Number of tokens in this chunk
    createdAt: v.number(), // Timestamp (ms since epoch)
  })
    .index("by_file", ["fileId"])
    .index("by_conversation", ["conversationId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["conversationId"],
    }),

  // User settings (API keys, preferences)
  userSettings: defineTable({
    userId: v.string(), // Clerk user ID
    openaiApiKey: v.optional(v.string()), // User's OpenAI API key (encrypted)
    geminiApiKey: v.optional(v.string()), // User's Gemini API key (encrypted)
    defaultProvider: v.union(
      // Default AI provider
      v.literal("openai"),
      v.literal("gemini")
    ),
    defaultModel: v.string(), // Default model for selected provider
    useAdminKeys: v.boolean(), // Whether to use admin-provided keys
    createdAt: v.number(), // Timestamp (ms since epoch)
    updatedAt: v.number(), // Last update timestamp
  }).index("by_user", ["userId"]),
});
