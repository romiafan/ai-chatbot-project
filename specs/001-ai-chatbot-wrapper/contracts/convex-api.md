# Convex API Contracts

**Feature**: AI Chatbot Wrapper  
**Backend**: Convex

## Queries

### `conversations.list`

**Description**: Get all conversations for the current user

**Args**: None

**Returns**:

```typescript
Array<{
  _id: Id<"conversations">;
  title: string;
  provider: "openai" | "gemini";
  model: string;
  ragEnabled: boolean;
  createdAt: number;
  updatedAt: number;
  messageCount: number; // Computed: count of messages in conversation
}>;
```

**Auth**: Required (Clerk)

---

### `conversations.get`

**Description**: Get a single conversation by ID

**Args**:

```typescript
{
  conversationId: Id<"conversations">;
}
```

**Returns**:

```typescript
{
  _id: Id<"conversations">,
  userId: string,
  title: string,
  provider: "openai" | "gemini",
  model: string,
  ragEnabled: boolean,
  createdAt: number,
  updatedAt: number,
} | null
```

**Auth**: Required (Clerk), Must be conversation owner

---

### `messages.list`

**Description**: Get all messages in a conversation

**Args**:

```typescript
{
  conversationId: Id<"conversations">;
}
```

**Returns**:

```typescript
Array<{
  _id: Id<"messages">;
  role: "user" | "assistant" | "system";
  content: string;
  provider: "openai" | "gemini" | "user";
  model?: string;
  citations?: Array<{
    fileId: Id<"fileAttachments">;
    fileName: string;
    chunkIndex: number;
    relevanceScore: number;
  }>;
  createdAt: number;
}>;
```

**Auth**: Required (Clerk), Must own conversation

---

### `fileAttachments.list`

**Description**: Get all files uploaded to a conversation

**Args**:

```typescript
{
  conversationId: Id<"conversations">;
}
```

**Returns**:

```typescript
Array<{
  _id: Id<"fileAttachments">;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageId: string;
  uploadedAt: number;
  chunkCount: number; // Computed: count of document chunks
}>;
```

**Auth**: Required (Clerk), Must own conversation

---

### `userSettings.get`

**Description**: Get current user's settings

**Args**: None

**Returns**:

```typescript
{
  _id: Id<"userSettings">,
  userId: string,
  openaiApiKey?: string,
  geminiApiKey?: string,
  defaultProvider: "openai" | "gemini",
  defaultModel: string,
  useAdminKeys: boolean,
  createdAt: number,
  updatedAt: number,
} | null
```

**Auth**: Required (Clerk)

---

## Mutations

### `conversations.create`

**Description**: Create a new conversation

**Args**:

```typescript
{
  title: string,              // 1-200 characters
  provider: "openai" | "gemini",
  model: string,
  ragEnabled: boolean,
}
```

**Returns**:

```typescript
Id<"conversations">; // ID of created conversation
```

**Auth**: Required (Clerk)

**Side Effects**:

- Creates conversation record
- Sets `userId` from Clerk auth
- Sets `createdAt` and `updatedAt` to current timestamp

---

### `conversations.update`

**Description**: Update conversation settings

**Args**:

```typescript
{
  conversationId: Id<"conversations">,
  title?: string,
  provider?: "openai" | "gemini",
  model?: string,
  ragEnabled?: boolean,
}
```

**Returns**: `void`

**Auth**: Required (Clerk), Must be conversation owner

**Side Effects**:

- Updates specified fields
- Updates `updatedAt` timestamp

---

### `conversations.delete`

**Description**: Delete a conversation and all associated data

**Args**:

```typescript
{
  conversationId: Id<"conversations">;
}
```

**Returns**: `void`

**Auth**: Required (Clerk), Must be conversation owner

**Side Effects**:

- Deletes conversation record
- Deletes all messages in conversation
- Deletes all file attachments (including storage files)
- Deletes all document chunks

---

### `messages.create`

**Description**: Add a message to a conversation (user message only, AI responses via action)

**Args**:

```typescript
{
  conversationId: Id<"conversations">,
  content: string,  // 1-10,000 characters
}
```

**Returns**:

```typescript
Id<"messages">; // ID of created message
```

**Auth**: Required (Clerk), Must own conversation

**Side Effects**:

- Creates message with role="user", provider="user"
- Updates conversation `updatedAt` timestamp
- If this is first message, updates conversation `title` (truncated from content)

---

### `userSettings.upsert`

**Description**: Create or update user settings

**Args**:

```typescript
{
  openaiApiKey?: string,
  geminiApiKey?: string,
  defaultProvider?: "openai" | "gemini",
  defaultModel?: string,
  useAdminKeys?: boolean,
}
```

**Returns**: `void`

**Auth**: Required (Clerk)

**Side Effects**:

- Creates settings record if doesn't exist
- Updates specified fields
- Updates `updatedAt` timestamp
- API keys are encrypted by Convex

---

## Actions

### `ai.chat`

**Description**: Send message to AI provider and stream response

**Args**:

```typescript
{
  conversationId: Id<"conversations">,
  userMessageId: Id<"messages">,  // ID of user message (already created)
}
```

**Returns**:

```typescript
Id<"messages">; // ID of assistant's response message
```

**Auth**: Required (Clerk), Must own conversation

**Side Effects**:

- Retrieves conversation settings (provider, model, RAG enabled)
- If RAG enabled:
  - Retrieves relevant document chunks (hybrid search)
  - Includes chunks in context
- Constructs prompt with conversation history + RAG context
- Calls AI provider API (OpenAI or Gemini)
- Streams response to client via Server-Sent Events
- Creates assistant message with response
- If RAG was used, adds citations to message
- Updates conversation `updatedAt` timestamp

**Streaming Format**:

```typescript
// SSE events sent to client:
{
  type: "chunk",
  content: string  // Token(s) from AI response
}
{
  type: "done",
  messageId: Id<"messages">  // Final message ID
}
{
  type: "error",
  error: string  // Error message if failure
}
```

---

### `files.upload`

**Description**: Upload file, extract text, generate embeddings

**Args**:

```typescript
{
  conversationId: Id<"conversations">,
  fileName: string,
  fileType: string,  // Must be "application/pdf"
  storageId: string,  // Convex storage ID (from client upload)
}
```

**Returns**:

```typescript
Id<"fileAttachments">; // ID of created file attachment
```

**Auth**: Required (Clerk), Must own conversation

**Side Effects**:

- Validates file type (PDF only in Phase 1)
- Extracts text using pdf-parse
- Creates fileAttachment record
- Chunks text (1000 tokens, 200 overlap)
- Generates embeddings for each chunk (OpenAI text-embedding-3-small)
- Creates documentChunk records with embeddings
- Returns file ID

**Error Handling**:

- If PDF extraction fails: Throw error, don't create attachment
- If embedding generation fails: Throw error, rollback chunks

---

### `rag.search`

**Description**: Search document chunks (hybrid keyword + semantic)

**Args**:

```typescript
{
  conversationId: Id<"conversations">,
  query: string,
  limit?: number,  // Default: 5, max: 20
}
```

**Returns**:

```typescript
Array<{
  chunkId: Id<"documentChunks">;
  fileId: Id<"fileAttachments">;
  fileName: string;
  chunkIndex: number;
  text: string;
  relevanceScore: number; // 0.0-1.0 (RRF score)
}>;
```

**Auth**: Required (Clerk), Must own conversation

**Side Effects**: None (read-only)

**Algorithm**:

1. Generate query embedding (OpenAI text-embedding-3-small)
2. Perform vector search (Convex vector index)
3. Perform keyword search (Convex full-text search)
4. Merge results using Reciprocal Rank Fusion (RRF)
5. Return top N chunks

---

## Error Codes

| Code               | Message                    | Cause                                                   |
| ------------------ | -------------------------- | ------------------------------------------------------- |
| `UNAUTHORIZED`     | Not authenticated          | User not logged in (Clerk)                              |
| `FORBIDDEN`        | Not authorized             | User trying to access another user's data               |
| `NOT_FOUND`        | Resource not found         | Invalid ID (conversation, message, file)                |
| `INVALID_INPUT`    | Invalid input              | Validation failed (e.g., empty message, title too long) |
| `RATE_LIMIT`       | Rate limit exceeded        | Too many requests (Convex enforces)                     |
| `AI_API_ERROR`     | AI provider error          | OpenAI/Gemini API returned error                        |
| `STORAGE_ERROR`    | File storage error         | Convex storage upload/download failed                   |
| `EMBEDDING_ERROR`  | Embedding generation error | OpenAI embedding API failed                             |
| `EXTRACTION_ERROR` | Text extraction failed     | pdf-parse failed to extract text                        |

## Rate Limiting

**Convex Built-in Limits**:

- Queries: 1000/sec per user (sufficient for chat UI)
- Mutations: 100/sec per user
- Actions: 10/sec per user (AI calls are throttled)

**Custom Limits** (Future Enhancement):

- AI calls: Max 60 per hour per user (prevent abuse)
- File uploads: Max 10 files per conversation (prevent storage abuse)

## Caching Strategy

**Convex Reactive Queries**:

- `conversations.list`: Cached until conversation created/updated/deleted
- `messages.list`: Cached until message added (real-time updates)
- `fileAttachments.list`: Cached until file uploaded/deleted

**Embeddings**:

- Document chunk embeddings cached forever (immutable after creation)
- Query embeddings NOT cached (generated per query)

## Testing Contracts

**Unit Tests** (Convex test framework):

- Test each query/mutation/action in isolation
- Mock Clerk auth using `ctx.auth` test helper
- Mock external APIs (OpenAI, Gemini) using environment variable overrides

**Integration Tests**:

- Test full chat flow: create conversation → send message → receive AI response
- Test RAG flow: upload file → extract text → generate embeddings → search → cite in response
- Test auth: Verify user isolation (User A can't access User B's conversations)
