# Implementation Plan: AI Chatbot Wrapper with Multi-Provider Support

**Branch**: `001-ai-chatbot-wrapper` | **Date**: October 19, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-chatbot-wrapper/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a production-ready AI chatbot application supporting multiple AI providers (OpenAI ChatGPT and Google Gemini) with real-time streaming responses, file upload for context, and Retrieval-Augmented Generation (RAG) using hybrid search. Users can switch between providers/models, manage conversations, and optionally provide their own API keys. The system uses the existing Next.js 15 + Clerk + Convex template with minimal additional dependencies, focusing on CSS-first styling with a Ragnarok Online-inspired "Gamer" theme.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode enabled)
**Primary Dependencies**:

- Next.js 15 (App Router, React 19, Server Components)
- Convex 1.28.0 (real-time backend, type generation)
- Clerk 6.33.7 (authentication)
- Tailwind CSS 4 (OKLCH color space, CSS-first approach)
- shadcn/ui (source-installed components)
- lucide-react (icons)

**AI Stack**:

- OpenAI SDK (`openai` npm package for GPT-4o, GPT-4o-mini, GPT-3.5-turbo)
- Google Generative AI SDK (`@google/generative-ai` for Gemini 1.5 Pro, Gemini 1.5 Flash)
- Embeddings: OpenAI `text-embedding-3-small` (1536 dimensions, cost-effective)

**RAG Stack** (Hybrid Search):

- Vector storage: Convex vector search (built-in)
- Text extraction: `pdf-parse` for PDFs (minimal native dependency)
- Keyword search: Convex full-text search indexes
- Chunking strategy: 1000 tokens per chunk with 200 token overlap

**Storage**: Convex tables (conversations, messages, fileAttachments, documentChunks, userSettings)  
**File Storage**: Convex file storage for uploads (10MB limit per file)  
**Testing**: Playwright for E2E, Vitest for unit tests (defer to implementation phase)  
**Target Platform**: Web (Vercel deployment, mobile-responsive)
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**:

- Page load: <2 seconds (hydration)
- AI response start: <2 seconds (streaming begins)
- File upload processing: <10 seconds (10MB files)
- Conversation list: <1 second (50+ conversations)

**Constraints**:

- <10MB per file upload
- <20 documents per conversation
- <4096 token context window management (rolling window)
- Streaming responses required (no full-load waits)
- Server-side API keys only (never client-exposed)

**Scale/Scope**:

- Expected users: 100-1000 concurrent
- Conversations per user: unlimited (paginated UI)
- Messages per conversation: unlimited (context window management)
- 5 user stories (3 P1, 2 P2, 1 P3 deprioritized for MVP)
- 6 core entities, 37 functional requirements

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Minimal Dependencies

**Status**: ✅ PASS (with justification required for 2 new dependencies)

**Evaluation**:

- Core dependencies unchanged: Next.js 15, Clerk, Convex, Tailwind CSS 4, shadcn/ui
- Package manager: pnpm (enforced)
- No state management libraries added (using Convex reactive queries)
- No routing libraries (using Next.js App Router)
- No form libraries (building custom with shadcn/ui primitives)
- No animation libraries (using Tailwind utilities and CSS transitions)

**New Dependencies Required** (justification needed):

1. **`openai`** (OpenAI SDK): Required for GPT-4/GPT-3.5 API integration. Cannot achieve FR-004 without it.
2. **`@google/generative-ai`** (Google Gemini SDK): Required for Gemini API integration. Cannot achieve FR-004 without it.
3. **`pdf-parse`** (PDF text extraction): Required for FR-009 (extract PDF content). Minimal native dependency, well-maintained, no alternatives in Convex.
4. **`tiktoken`** (Token counting utility): Required for FR-021 (context window management). Official OpenAI library for accurate token counting across different models. Essential for preventing context overflow and managing sliding windows.

**Verdict**: Acceptable. Four new dependencies justified by core requirements. See Complexity Tracking table.

### Principle II: Type-Safe Architecture

**Status**: ✅ PASS

**Evaluation**:

- TypeScript strict mode: enabled (tsconfig.json)
- Convex schema: Will define all 6 entities with `v` validators in Phase 1
- Convex functions: All queries/mutations/actions will have typed args
- React components: All props explicitly typed (no implicit any)
- AI API responses: Will validate with Zod or Convex validators
- No manual edits to `convex/_generated/`: Enforced in workflow
- Type-safe imports: Using `api.module.function` pattern

**Verdict**: Full compliance. Design phase will deliver complete schema.

### Principle III: Authentication-First Design

**Status**: ✅ PASS

**Evaluation**:

- All Convex queries/mutations will call `ctx.auth.getUserIdentity()` first
- Identity check pattern: `if (identity === null) throw new Error("Not authenticated")`
- Middleware order maintained: maintenance check → Clerk auth (unchanged)
- Provider nesting correct: ClerkProvider → ConvexClientProvider → children (unchanged)
- All client components: Will have `"use client"` directive where needed
- Public routes: Chat interface requires auth (no public routes added)

**Verdict**: Full compliance. All user-specific queries will have auth checks.

### Principle IV: Real-Time Data Patterns

**Status**: ✅ PASS

**Evaluation**:

- Data fetching: Using `useQuery(api.module.function)` for all reads
- Data writes: Using `useMutation(api.module.function)` for all writes
- AI calls: Using `useAction(api.module.function)` for OpenAI/Gemini (correct pattern)
- Loading states: Will implement `if (data === undefined) return <LoadingComponent />`
- Empty states: Will implement `if (data === null || data.length === 0) return <EmptyState />`
- Conversation state: Stored in Convex tables (FR-006), not React state
- Database indexes: Will define in Phase 1 schema for common queries

**Verdict**: Full compliance. Convex reactive patterns enforced throughout.

### Principle V: AI Integration Best Practices

**Status**: ✅ PASS

**Evaluation**:

- AI API calls: In Convex actions (FR-002, FR-003) - correct pattern
- API keys: Server-side only (FR-023, FR-026, FR-027) - no NEXT*PUBLIC*\* prefix
- Message storage: Store user message before AI call, store AI response after (FR-002, FR-006)
- Streaming responses: Implementing with Server-Sent Events (FR-003, SC-002)
- Rate limits/errors: Graceful handling with user-friendly messages (FR-018, SC-007)
- Conversation context: Stored in Convex for multi-turn conversations (FR-025)
- Usage tracking: Will add token/cost tracking to Message entity in Phase 1

**Verdict**: Full compliance. Actions pattern and streaming design follow best practices.

### Technology Stack Constraints

**Status**: ✅ PASS (approved stack + 3 justified additions)

**Evaluation**:

**Approved Stack** (unchanged):

- Frontend: Next.js 15, TypeScript 5+, Tailwind CSS 4, shadcn/ui, lucide-react, React 19
- Backend: Convex, Clerk
- Deployment: Vercel (frontend), Convex (backend)
- Development: pnpm, ESLint, Stylelint

**New AI Services** (approved by constitution):

- OpenAI API (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo) - explicitly allowed
- Google Gemini API (Gemini Pro, Gemini Pro Vision) - explicitly allowed

**New Dependencies** (minimal, justified):

- `openai`: Official OpenAI SDK for API integration
- `@google/generative-ai`: Official Google SDK for Gemini integration
- `pdf-parse`: PDF text extraction (minimal native dependency, no Convex alternative)

**NOT Using** (constitution forbids):

- ❌ Redux/Zustand/Jotai (using Convex)
- ❌ React Query/SWR (using Convex queries)
- ❌ Axios/node-fetch (using native fetch in actions)
- ❌ Express/Fastify (using Convex actions)
- ❌ Prisma/Drizzle/TypeORM (using Convex schema)
- ❌ Socket.io (using Convex subscriptions)

**Verdict**: Full compliance. All additions justified by core requirements.

### Development Workflow

**Status**: ✅ PASS

**Evaluation**: Plan follows 4-phase workflow:

1. Setup: Dependencies installed, env vars configured, Convex + Next.js running
2. Feature Development: Schema → Convex functions → Components → Pages
3. AI Integration: API keys, Convex actions, chat UI, streaming, error handling
4. Deployment: Convex prod deploy → Vercel deploy → domain config

**Verdict**: Full compliance. Plan execution aligns with prescribed workflow.

### Overall Gate Status

**✅ ALL GATES PASS** - Proceed to Phase 0 Research

**Summary**: This feature adds 3 minimal dependencies (`openai`, `@google/generative-ai`, `pdf-parse`) justified by core requirements (AI provider support, PDF extraction). All 5 constitution principles satisfied. No forbidden technologies introduced. Type safety, authentication patterns, real-time patterns, and AI best practices enforced in design.

## Project Structure

### Documentation (this feature)

```
specs/001-ai-chatbot-wrapper/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (Next.js full-stack)

```
ai-chatbot-project/
├── convex/                          # Backend
│   ├── schema.ts                    # 6 entities
│   ├── conversations.ts             # CRUD
│   ├── messages.ts                  # Queries
│   ├── fileAttachments.ts           # Uploads
│   ├── documentChunks.ts            # RAG chunks
│   ├── aiProviders.ts               # AI actions
│   ├── ragSearch.ts                 # Hybrid search
│   └── userSettings.ts              # API keys
│
├── src/
│   ├── app/
│   │   ├── chat/page.tsx            # Main UI (P1)
│   │   └── settings/page.tsx        # API config
│   ├── components/
│   │   ├── chat/                    # Chat components
│   │   ├── files/                   # File upload (P2)
│   │   └── ui/                      # shadcn/ui
│   └── lib/
│       ├── ai/                      # AI helpers
│       └── rag/                     # RAG utilities
│
└── public/
    └── ragnarok-ui/                 # Theme assets
```

**Structure Decision**: Next.js full-stack using existing template. Convex backend (serverless functions + schema). Frontend: App Router pages, feature-based components, shadcn/ui, CSS-first Ragnarok Online theme.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                          | Why Needed                                                          | Simpler Alternative Rejected Because                                                   |
| ---------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `openai` dependency                | Required for OpenAI API integration (FR-004: GPT-4/GPT-3.5 support) | No native fetch alternative - SDK handles streaming, retry logic, type safety          |
| `@google/generative-ai` dependency | Required for Gemini API integration (FR-004: Gemini support)        | No alternative - official Google SDK for Gemini models                                 |
| `pdf-parse` dependency             | Required for PDF text extraction (FR-009: extract PDF content)      | Convex has no built-in PDF parser, external API would add latency/cost                 |
| `tiktoken` dependency              | Required for context window management (FR-021: token counting)     | No alternative - official OpenAI library for accurate token counting across GPT models |

---

## Phase 0: Research ✅

**Status**: COMPLETE  
**Artifact**: [`research.md`](./research.md)

**Key Research Topics Addressed**:

1. **AI Provider SDKs**: Official SDKs (`openai`, `@google/generative-ai`) with native streaming support
2. **Vector Database**: Convex built-in vector search (no external service needed)
3. **PDF Extraction**: `pdf-parse` library (lightweight, well-maintained)
4. **Document Chunking**: Fixed-size (1000 tokens/chunk, 200 token overlap)
5. **Hybrid Search**: Reciprocal Rank Fusion (RRF) algorithm for merging keyword + semantic results
6. **Streaming**: Server-Sent Events (SSE) from Convex actions to client
7. **Context Management**: Sliding window with token counting (tiktoken)
8. **Theme**: CSS custom properties + Tailwind utilities (no CSS framework), Ragnarok Online aesthetic

**Technical Decisions Made**:

- Embeddings: OpenAI text-embedding-3-small (1536 dimensions, $0.02/1M tokens)
- Token counting: tiktoken library for accurate counts
- Total new dependencies: 4 (`openai`, `@google/generative-ai`, `pdf-parse`, `tiktoken`)

---

## Phase 1: Design & Contracts ✅

**Status**: COMPLETE

### Deliverables

#### 1. Data Model ✅

**Artifact**: [`data-model.md`](./data-model.md)

**Schema Summary**:

- 5 core tables: `conversations`, `messages`, `fileAttachments`, `documentChunks`, `userSettings`
- 8 indexes for query performance (by_user, by_conversation, by_updated, etc.)
- 1 vector index for semantic search (1536 dimensions, filtered by conversationId)
- Convex validators for type safety (v.string(), v.id(), v.union(), v.array(), v.float64())

**Key Design Decisions**:

- Hybrid API key management: User keys OR admin keys (controlled by `useAdminKeys` flag)
- RAG toggle per conversation (not global)
- Citations embedded in message records (not separate table)
- Encrypted API key storage (Convex handles encryption)

**Data Size Estimates**:

- Per conversation: ~1.1 MB (20 messages + 1 file + 50 chunks)
- Per user: ~11 MB (10 conversations)
- Scale target: 1,000 users = 11 GB (within Convex Pro tier limits)

#### 2. API Contracts ✅

**Artifact**: [`contracts/convex-api.md`](./contracts/convex-api.md)

**Convex Functions**:

- **5 Queries**: conversations.list, conversations.get, messages.list, fileAttachments.list, userSettings.get
- **5 Mutations**: conversations.create/update/delete, messages.create, userSettings.upsert
- **3 Actions**: ai.chat (streaming), files.upload (extract + embed), rag.search (hybrid)

**Streaming Protocol**:

- Server-Sent Events (SSE) from Convex action to client
- Event types: `chunk` (token), `done` (final message ID), `error` (failure)

**Error Codes**: 9 standardized codes (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INVALID_INPUT, RATE_LIMIT, AI_API_ERROR, STORAGE_ERROR, EMBEDDING_ERROR, EXTRACTION_ERROR)

#### 3. Developer Quickstart ✅

**Artifact**: [`quickstart.md`](./quickstart.md)

**3-Phase Implementation Roadmap**:

1. **Phase 1: Basic Chat** (1-2 days) - Create conversation, send message, receive AI response
2. **Phase 2: File Upload & RAG** (2-3 days) - Upload PDF, extract text, generate embeddings, use RAG in responses
3. **Phase 3: User Settings & Polish** (1 day) - Configure API keys, apply Ragnarok Online theme, error handling

**Setup Time**: 5 minutes (install deps, configure env vars, deploy Convex)

**Development Workflow**: Terminal 1 (`npx convex dev`) + Terminal 2 (`pnpm dev`)

---

## Phase 1: Agent Context Update ✅

**Status**: COMPLETE

**Action**: Ran `.specify/scripts/bash/update-agent-context.sh` to update `.github/copilot-instructions.md`

**Changes Applied**:

- Added language: TypeScript 5+ (strict mode enabled)
- Added database: Convex tables (conversations, messages, fileAttachments, documentChunks, userSettings)
- Updated GitHub Copilot context file with feature-specific information

---

## Planning Complete ✅

**All phases completed successfully**:

- ✅ Constitution Check: All 5 principles passed
- ✅ Phase 0: Research completed (8 technical decisions documented)
- ✅ Phase 1: Design & Contracts completed (data model, API contracts, quickstart guide)
- ✅ Phase 1: Agent context updated

**Next Command**: `/speckit.tasks` to generate task breakdown for implementation

**Feature Branch**: `001-ai-chatbot-wrapper`  
**Implementation Plan**: `/Users/romiafan/Code/ai-chatbot-project/specs/001-ai-chatbot-wrapper/plan.md`

**Artifacts Generated**:

1. `plan.md` - This document (implementation plan)
2. `research.md` - Technical research and decisions
3. `data-model.md` - Convex schema and entity relationships
4. `contracts/convex-api.md` - API contracts for all Convex functions
5. `quickstart.md` - Developer setup and implementation roadmap
