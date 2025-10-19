# Developer Quickstart Guide

**Feature**: AI Chatbot Wrapper  
**Target Audience**: Developers implementing this feature

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Convex account (convex.dev)
- Clerk account (clerk.com)
- OpenAI API key (optional, for admin keys)
- Google AI API key (optional, for admin keys)

## Initial Setup (5 minutes)

### 1. Clone and Install Dependencies

```bash
cd /Users/romiafan/Code/ai-chatbot-project
pnpm install

# Install new dependencies for AI chatbot
pnpm add openai @google/generative-ai pdf-parse tiktoken
```

### 2. Configure Environment Variables

Create or update `.env.local`:

```bash
# Existing variables (from template)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# New variables for AI chatbot
OPENAI_API_KEY=sk-...                    # Optional: Admin-provided OpenAI key
GEMINI_API_KEY=AI...                     # Optional: Admin-provided Gemini key
NEXT_PUBLIC_DEFAULT_AI_PROVIDER=openai   # Default: "openai" or "gemini"
NEXT_PUBLIC_DEFAULT_AI_MODEL=gpt-4o      # Default model
```

### 3. Update Convex Schema

Replace `convex/schema.ts` with the schema from `data-model.md` (see Schema Definition section).

### 4. Deploy Convex Backend

```bash
# Terminal 1: Start Convex dev server
npx convex dev

# This will:
# - Deploy schema to Convex
# - Generate types in convex/_generated/
# - Watch for changes
```

### 5. Start Next.js Dev Server

```bash
# Terminal 2: Start Next.js
pnpm dev

# Open http://localhost:3000
```

## Implementation Roadmap (3 phases)

### Phase 1: Basic Chat (1-2 days)

**Goal**: User can create conversation, send message, receive AI response

**Tasks**:

1. Implement Convex functions:

   - `convex/conversations.ts`: queries (list, get), mutations (create, update, delete)
   - `convex/messages.ts`: queries (list), mutations (create)
   - `convex/userSettings.ts`: queries (get), mutations (upsert)
   - `convex/ai.ts`: actions (chat with streaming)

2. Create UI components:

   - `src/app/chat/page.tsx`: Chat page layout
   - `src/components/ConversationList.tsx`: Sidebar with conversation list
   - `src/components/ChatInterface.tsx`: Main chat UI
   - `src/components/MessageList.tsx`: Display messages
   - `src/components/MessageInput.tsx`: Text input with send button
   - `src/components/ProviderSelector.tsx`: Toggle between OpenAI/Gemini

3. Implement streaming:
   - `src/lib/ai-stream.ts`: Client-side streaming handler
   - Connect to Convex action via `fetch()` with `ReadableStream`

**Test**: Create conversation → Send "Hello" → Receive AI response

---

### Phase 2: File Upload & RAG (2-3 days)

**Goal**: User can upload PDF, system extracts text, generates embeddings, uses RAG in responses

**Tasks**:

1. Implement Convex functions:

   - `convex/files.ts`: mutations (upload), queries (list)
   - `convex/rag.ts`: actions (search with hybrid algorithm)
   - `convex/ai.ts`: Update chat action to include RAG context

2. Create UI components:

   - `src/components/FileUpload.tsx`: Drag-and-drop PDF upload
   - `src/components/FileList.tsx`: Display uploaded files
   - `src/components/RAGToggle.tsx`: Enable/disable RAG per conversation
   - `src/components/CitationBadge.tsx`: Display RAG citations in messages

3. Implement backend logic:
   - `convex/lib/pdf-extractor.ts`: Extract text from PDF using pdf-parse
   - `convex/lib/chunker.ts`: Chunk text (1000 tokens, 200 overlap)
   - `convex/lib/embedder.ts`: Generate embeddings (OpenAI text-embedding-3-small)
   - `convex/lib/hybrid-search.ts`: Reciprocal Rank Fusion algorithm

**Test**: Upload PDF → Enable RAG → Ask question about file content → Response includes citations

---

### Phase 3: User Settings & Polish (1 day)

**Goal**: User can configure API keys, preferences, theme works correctly

**Tasks**:

1. Implement UI:

   - `src/app/settings/page.tsx`: Settings page
   - `src/components/APIKeyInput.tsx`: Secure input for API keys
   - `src/components/ModelSelector.tsx`: Choose default provider/model

2. Apply Ragnarok Online theme:

   - Update `src/app/globals.css`: Custom properties for colors, fonts
   - Add Google Font (Press Start 2P for pixel aesthetic)
   - Style buttons, panels, borders with game-like UI

3. Error handling & loading states:
   - Add error boundaries in chat UI
   - Loading skeletons for messages, file uploads
   - Retry logic for failed API calls

**Test**: Configure custom API key → Send message using custom key → Verify correct provider used

---

## Development Workflow

### Running Tests

```bash
# (Future) Run Convex tests
npx convex test

# (Future) Run Next.js tests
pnpm test
```

### Code Organization

```
convex/
  conversations.ts       # Conversation CRUD
  messages.ts            # Message CRUD
  files.ts               # File upload & storage
  ai.ts                  # AI chat action (streaming)
  rag.ts                 # RAG search action
  userSettings.ts        # User settings CRUD
  lib/
    pdf-extractor.ts     # PDF text extraction
    chunker.ts           # Text chunking logic
    embedder.ts          # Embedding generation
    hybrid-search.ts     # RRF algorithm
  schema.ts              # Convex schema (6 tables)

src/app/
  chat/page.tsx          # Main chat page
  settings/page.tsx      # User settings page

src/components/
  ConversationList.tsx   # Sidebar
  ChatInterface.tsx      # Main chat UI
  MessageList.tsx        # Message rendering
  MessageInput.tsx       # Text input
  FileUpload.tsx         # PDF upload
  FileList.tsx           # Uploaded files display
  ProviderSelector.tsx   # OpenAI vs Gemini toggle
  RAGToggle.tsx          # RAG on/off
  CitationBadge.tsx      # RAG citations
  ModelSelector.tsx      # Model dropdown
  APIKeyInput.tsx        # Secure API key input

src/lib/
  ai-stream.ts           # Client-side streaming handler
  token-counter.ts       # Token counting (tiktoken)
```

### Common Commands

```bash
# Install new dependency
pnpm add <package>

# Update Convex schema (after editing schema.ts)
# Just save the file - convex dev auto-deploys

# Deploy to production
npx convex deploy --prod
git push origin main  # Vercel auto-deploys

# Check types
pnpm tsc --noEmit

# Lint
pnpm lint
pnpm lint:css
```

## Debugging Tips

### Convex Function Errors

```typescript
// In Convex functions, use console.log (appears in Convex dashboard)
export const chat = action({
  handler: async (ctx, args) => {
    console.log("Chat action called:", args);
    // ...
  },
});
```

View logs: https://dashboard.convex.dev → Logs tab

### Streaming Issues

- Check browser Network tab for SSE connection
- Verify `Content-Type: text/event-stream` in response headers
- Ensure client handles `ReadableStream` correctly

### RAG Not Working

- Verify embeddings generated: Check `documentChunks` table in Convex dashboard
- Verify vector index created: Check schema has `vectorIndex` definition
- Test search manually: Run `rag.search` action from Convex dashboard

### API Key Issues

- Check env vars loaded: `console.log(process.env.OPENAI_API_KEY?.substring(0, 7))`
- Verify user settings: Query `userSettings` table in Convex dashboard
- Test API keys: Use OpenAI/Gemini CLI to verify keys work

## Performance Optimization

### Caching

- Convex queries automatically cached (reactive)
- Embeddings cached forever (immutable after creation)
- Don't cache query embeddings (generated per query)

### Rate Limiting

- Implement rate limiting in Convex actions (10 AI calls/sec)
- Use Convex scheduled functions to reset rate limits
- Display rate limit errors to user

### Token Management

- Count tokens before sending to AI (use tiktoken)
- Prune conversation history if exceeds model limit
- Show token count in UI (e.g., "1,234 / 8,192 tokens used")

## Deployment Checklist

Before deploying to production:

- [ ] Update `OPENAI_API_KEY` and `GEMINI_API_KEY` in Vercel environment variables
- [ ] Deploy Convex backend: `npx convex deploy --prod`
- [ ] Copy production Convex URL to Vercel: `NEXT_PUBLIC_CONVEX_URL`
- [ ] Test with real API keys (not test keys)
- [ ] Verify Clerk production instance configured
- [ ] Test file uploads (10 MB limit enforced)
- [ ] Test RAG search (hybrid algorithm works)
- [ ] Test streaming (no dropped connections)
- [ ] Monitor Convex logs for errors

## Support & Resources

- **Convex Docs**: https://docs.convex.dev
- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Project README**: `README.md` (general template info)
- **Feature Spec**: `specs/001-ai-chatbot-wrapper/spec.md`
- **Implementation Plan**: `specs/001-ai-chatbot-wrapper/plan.md`
