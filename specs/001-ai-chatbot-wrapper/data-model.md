# Data Model

**Feature**: AI Chatbot Wrapper  
**Database**: Convex

## Schema Definition

```typescript
// convex/schema.ts
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
```

## Entity Relationships

```
User (Clerk)
  │
  ├─── 1:N ──→ conversations
  │               │
  │               ├─── 1:N ──→ messages
  │               │               │
  │               │               └─── 1:N ──→ citations (embedded in message)
  │               │
  │               └─── 1:N ──→ fileAttachments
  │                               │
  │                               └─── 1:N ──→ documentChunks
  │
  └─── 1:1 ──→ userSettings
```

## Field Validations & Constraints

### conversations

- `title`: 1-200 characters, auto-generated from first user message (truncated)
- `provider`: Must be "openai" or "gemini"
- `model`: Must match provider's available models (validated in mutation)
- `ragEnabled`: Boolean toggle, defaults to false
- `createdAt`, `updatedAt`: Timestamps in milliseconds

### messages

- `content`: 1-10,000 characters (enforce in mutation)
- `role`: Must be "user", "assistant", or "system"
- `provider`: "openai", "gemini", or "user" (for user messages)
- `citations`: Optional array, only present if RAG was used
- `citations[].relevanceScore`: 0.0-1.0 (cosine similarity)

### fileAttachments

- `fileName`: 1-255 characters, preserve original name
- `fileType`: Must be "application/pdf" (Phase 1), expandable later
- `fileSize`: Max 10 MB (10 _ 1024 _ 1024 bytes, enforced by Convex)
- `storageId`: Convex storage reference
- `extractedText`: Can be very large (100K+ chars), optional (null if extraction fails)

### documentChunks

- `chunkIndex`: 0-indexed, sequential within file
- `text`: ~1000 tokens per chunk (varies slightly due to overlap)
- `embedding`: Array of 1536 floats (OpenAI text-embedding-3-small)
- `tokenCount`: Actual token count (calculated by tiktoken)

### userSettings

- `openaiApiKey`, `geminiApiKey`: Encrypted at rest (Convex handles encryption)
- `defaultProvider`: Must be "openai" or "gemini"
- `defaultModel`: Validated against provider's model list
- `useAdminKeys`: If true, ignore user's API keys and use admin keys from env vars

## Indexes

### Performance-Critical Indexes

1. **conversations.by_user**: Query all conversations for a user (sidebar list)
2. **conversations.by_updated**: Sort conversations by last activity (most recent first)
3. **messages.by_conversation**: Fetch all messages in a conversation (chat history)
4. **messages.by_conversation_role**: Filter messages by role (e.g., system messages)
5. **fileAttachments.by_conversation**: List files uploaded to a conversation
6. **documentChunks.by_conversation**: Retrieve all chunks for RAG (with vector search)
7. **documentChunks.by_embedding** (vector index): Semantic search for RAG
8. **userSettings.by_user**: Get user's settings (API keys, preferences)

## Data Size Estimates

### Per Conversation (Average)

- **Conversation record**: ~200 bytes
- **Messages**: 20 messages × 500 bytes = 10 KB
- **File attachments**: 1 file × 1 MB = 1 MB
- **Document chunks**: 50 chunks × 2 KB = 100 KB
- **Total per conversation**: ~1.1 MB

### Per User (Average)

- **Conversations**: 10 conversations × 1.1 MB = 11 MB
- **User settings**: ~500 bytes
- **Total per user**: ~11 MB

### Scale Assumptions

- **Users**: 1,000 active users
- **Total storage**: 1,000 users × 11 MB = 11 GB
- **Convex limits**: Free tier = 1 GB, Pro tier = 50 GB (sufficient for MVP)

## Security & Privacy

### API Key Storage

- User API keys stored encrypted by Convex
- Never log API keys in console or errors
- Admin keys stored in environment variables (`OPENAI_API_KEY`, `GEMINI_API_KEY`)
- Hybrid mode: If `useAdminKeys=true`, use admin keys; else use user keys

### Data Isolation

- All queries filter by `userId` (from Clerk auth)
- Convex auth rules enforce user isolation:
  ```typescript
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  // Filter: q.eq(q.field("userId"), identity.subject)
  ```

### File Upload Security

- Validate file type (PDF only in Phase 1)
- Enforce 10 MB size limit (Convex enforces at storage layer)
- Scan for malicious content (future enhancement: virus scanning)

## Migration Strategy

### Phase 1 (MVP)

- Deploy schema with all tables
- No migrations needed (new database)

### Phase 2+ (Future Enhancements)

- Add support for more file types: Update `fileType` union, add parsers
- Add conversation sharing: Add `sharing` table with conversation permissions
- Add usage tracking: Add `usage` table for API call metering

### Convex Migration Pattern

- Convex handles schema migrations automatically
- Adding fields: Optional fields are safe (existing records get `undefined`)
- Removing fields: Requires data migration script (backfill or cleanup)
- Changing types: Requires manual migration (export, transform, re-import)
