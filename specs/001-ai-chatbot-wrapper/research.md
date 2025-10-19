# Phase 0: Research & Technical Decisions

**Feature**: AI Chatbot Wrapper with Multi-Provider Support  
**Date**: October 19, 2025

## Research Topics

### 1. AI Provider SDKs & Streaming

**Decision**: Use official SDKs (`openai`, `@google/generative-ai`) with native streaming support

**Rationale**:

- Official SDKs provide type safety, built-in retry logic, and error handling
- OpenAI SDK supports Server-Sent Events (SSE) streaming out of the box
- Gemini SDK supports streaming via `generateContentStream()` method
- Both handle authentication, rate limiting, and API versioning automatically

**Alternatives Considered**:

- Native fetch: Rejected - requires manual streaming implementation, error handling, retry logic
- LangChain: Rejected - adds 50+ dependencies, violates Principle I (Minimal Dependencies)
- Vercel AI SDK: Rejected - adds abstraction layer, less control over streaming

**Implementation Notes**:

- OpenAI: Use `stream: true` in chat completion calls
- Gemini: Use `generateContentStream()` for streaming responses
- Convex actions will handle streaming via Server-Sent Events to client
- Client uses EventSource or custom fetch streaming for progressive rendering

---

### 2. Vector Database for RAG

**Decision**: Use Convex built-in vector search

**Rationale**:

- Convex 1.16+ includes native vector search with cosine similarity
- No additional infrastructure or dependencies required
- Type-safe vector operations integrated with existing schema
- Scales automatically with Convex backend
- Zero configuration - indexes created via schema definitions

**Alternatives Considered**:

- Pinecone: Rejected - external service, additional cost, network latency, API key management
- Weaviate: Rejected - requires separate hosting, infrastructure complexity
- ChromaDB: Rejected - not designed for serverless, requires persistent storage
- Supabase pgvector: Rejected - would require PostgreSQL, violates constitution (must use Convex)

**Implementation Notes**:

- Store embeddings in `documentChunks` table with vector field type
- Use `vectorSearch()` query method for semantic search
- Combine with Convex full-text search indexes for hybrid approach
- OpenAI `text-embedding-3-small` model (1536 dimensions, $0.02/1M tokens)

---

### 3. PDF Text Extraction

**Decision**: Use `pdf-parse` npm package

**Rationale**:

- Lightweight (< 100KB), single-purpose library
- Minimal native dependencies (uses pdf.js internally)
- Works in Node.js environment (Convex actions)
- Widely used (2M+ weekly downloads), well-maintained
- Simple API: `pdf(buffer)` returns text content

**Alternatives Considered**:

- pdf.js directly: Rejected - more complex API, designed for browser rendering
- External API (Adobe PDF Services): Rejected - adds cost, latency, API key management
- tesseract.js (OCR): Rejected - unnecessary for text PDFs, slower, larger dependency
- Manual PDF parsing: Rejected - would take weeks to implement correctly

**Implementation Notes**:

- Install: `pnpm add pdf-parse`
- Use in Convex action to extract text from uploaded PDFs
- Handle corrupted/encrypted PDFs with try-catch error handling
- Return extracted text to store in `fileAttachments` table

---

### 4. Document Chunking Strategy

**Decision**: Fixed-size chunking with overlap (1000 tokens/chunk, 200 token overlap)

**Rationale**:

- Balances context preservation with embedding quality
- 1000 tokens fits within most LLM context windows
- 200 token overlap prevents context loss at chunk boundaries
- Simple to implement, predictable performance

**Alternatives Considered**:

- Sentence-based chunking: Rejected - variable sizes complicate retrieval ranking
- Paragraph-based: Rejected - paragraphs vary wildly in size (10-1000+ tokens)
- Semantic chunking (LangChain): Rejected - adds AI calls for chunking, slow, expensive
- No chunking: Rejected - files >8K tokens exceed embedding model limits

**Implementation Notes**:

- Use `tiktoken` library to count tokens accurately
- Sliding window: chunk 1 (0-1000), chunk 2 (800-1800), chunk 3 (1600-2600)
- Store chunk index and parent file ID for source citation
- Generate embeddings per chunk using OpenAI embedding API

---

### 5. Hybrid Search Merging Algorithm

**Decision**: Reciprocal Rank Fusion (RRF) with configurable weights

**Rationale**:

- RRF is simple, effective, doesn't require score normalization
- Handles different score scales from keyword vs semantic search
- Well-studied algorithm used in production search systems (Elasticsearch)
- Formula: `RRF_score = sum(1 / (k + rank_i))` where k=60 (standard constant)

**Alternatives Considered**:

- Score normalization + weighted sum: Rejected - fragile, requires tuning per query type
- Take top-N from each: Rejected - biases toward one search type
- Semantic-only: Rejected - misses exact phrase matches (e.g., "API key")
- Keyword-only: Rejected - misses semantic similarity (e.g., "How do I configure OpenAI?" vs "Set up GPT-4")

**Implementation Notes**:

- Run keyword and semantic search in parallel (Convex allows concurrent queries)
- Rank results from each method (1st, 2nd, 3rd...)
- Apply RRF formula to merge rankings
- Return top 5 chunks after merging
- Include source metadata (file name, chunk index) for citations

---

### 6. Streaming Response Implementation

**Decision**: Server-Sent Events (SSE) from Convex action to client

**Rationale**:

- SSE is one-directional (server → client), perfect for AI streaming
- Built-in browser support via EventSource API
- Simpler than WebSockets (no bidirectional handshake needed)
- Works with Convex actions (actions can stream responses)

**Alternatives Considered**:

- WebSockets: Rejected - overkill for one-way streaming, requires connection management
- Polling: Rejected - inefficient, high latency, wastes bandwidth
- Long polling: Rejected - complex error handling, not real-time

**Implementation Notes**:

- Convex action streams chunks as they arrive from AI provider
- Client uses `fetch()` with `ReadableStream` (not EventSource for more control)
- React component updates state on each chunk, triggering re-render
- Handle connection errors, timeouts, and manual cancellation

---

### 7. Context Window Management

**Decision**: Sliding window with semantic pruning

**Rationale**:

- GPT-4 context: 8K-128K tokens depending on model
- Gemini 1.5: 1M token context (but expensive to fill)
- Keep most recent N messages (e.g., last 20) + RAG context
- If exceeding limit, remove oldest non-system messages first

**Alternatives Considered**:

- Summarization: Rejected - adds AI calls, latency, potential information loss
- Always full history: Rejected - expensive, slow, exceeds limits on long conversations
- Fixed message count: Rejected - messages vary in length, could exceed tokens

**Implementation Notes**:

- Calculate total tokens before sending to AI (use `tiktoken`)
- If > model limit, prune oldest messages until fits
- Always keep system message (role: system) and last user message
- Store full history in Convex, only send relevant window to AI
- Display full history in UI (UX: users see everything, AI gets window)

---

### 8. Ragnarok Online Theme CSS Approach

**Decision**: CSS custom properties + Tailwind utilities (no additional CSS framework)

**Rationale**:

- Constitution mandates CSS-first approach, minimal dependencies
- Tailwind CSS 4 with OKLCH colors provides full styling power
- Custom properties for theme colors, fonts, borders
- Use `@apply` sparingly for complex component styles

**Design Choices**:

- Color palette: Earthy tones (browns, golds), fantasy game aesthetic
- Typography: Pixelated/retro font for headings (e.g., Press Start 2P from Google Fonts)
- Borders: Thick, ornate borders mimicking RO UI panels
- Buttons: Gradient backgrounds, hover effects (glow/shadow)
- Layout: Sidebar (conversation list) + main panel (chat), medieval window frames

**Alternatives Considered**:

- CSS framework (Styled Components, Emotion): Rejected - violates minimal dependencies
- Inline styles: Rejected - not scalable, no reusability
- Separate CSS files per component: Rejected - Tailwind approach preferred

**Implementation Notes**:

- Update `src/app/globals.css` with custom properties
- Add Google Font (Press Start 2P) for pixel aesthetic
- Use shadcn/ui components with custom theme overrides
- CSS Grid for layout, Flexbox for component internals

---

## Technical Stack Summary

| Category       | Technology                       | Justification                                 |
| -------------- | -------------------------------- | --------------------------------------------- |
| Frontend       | Next.js 15, React 19, TypeScript | Constitution-mandated, existing template      |
| Backend        | Convex                           | Constitution-mandated, existing template      |
| Auth           | Clerk                            | Constitution-mandated, existing template      |
| Styling        | Tailwind CSS 4                   | Constitution-mandated, existing template      |
| UI Components  | shadcn/ui                        | Constitution-mandated, existing template      |
| AI - OpenAI    | `openai` SDK                     | Official SDK, streaming support, type safety  |
| AI - Gemini    | `@google/generative-ai` SDK      | Official SDK, streaming support               |
| Embeddings     | OpenAI text-embedding-3-small    | Cost-effective, 1536 dimensions, high quality |
| Vector Search  | Convex vector search             | Built-in, zero config, type-safe              |
| PDF Extraction | `pdf-parse`                      | Lightweight, minimal dependencies             |
| Token Counting | `tiktoken`                       | Accurate token counts for context management  |

**Total New Dependencies**: 4 (`openai`, `@google/generative-ai`, `pdf-parse`, `tiktoken`)

**Constitution Compliance**: All additions justified in Complexity Tracking table. No forbidden technologies introduced.
