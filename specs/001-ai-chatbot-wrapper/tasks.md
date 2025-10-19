# Tasks: AI Chatbot Wrapper with Multi-Provider Support

**Input**: Design documents from `/specs/001-ai-chatbot-wrapper/`  
**Prerequisites**: plan.md (complete), spec.md (complete), research.md (complete), data-model.md (complete), contracts/convex-api.md (complete)

**Tests**: Not explicitly requested in feature specification - focusing on implementation tasks only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

This is a Next.js full-stack project using Convex:

- **Backend**: `convex/` (Convex serverless functions)
- **Frontend**: `src/app/` (Next.js App Router pages), `src/components/` (React components), `src/lib/` (utilities)
- **Styling**: `src/app/globals.css` (Tailwind + custom CSS)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure environment

- [ ] T001 Install new dependencies: `pnpm add openai @google/generative-ai pdf-parse tiktoken`
- [ ] T002 [P] Add environment variables to `.env.local`: `OPENAI_API_KEY`, `GEMINI_API_KEY`, `NEXT_PUBLIC_DEFAULT_AI_PROVIDER`, `NEXT_PUBLIC_DEFAULT_AI_MODEL`
- [ ] T003 [P] Update `.env.example` with new AI-related environment variable documentation

**Checkpoint**: Dependencies installed, environment configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core schema and infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement Convex schema in `convex/schema.ts` with all 5 tables (conversations, messages, fileAttachments, documentChunks, userSettings) and indexes per data-model.md
- [ ] T005 [P] Create base user settings helper in `convex/lib/userSettings.ts` for retrieving API keys (checks user keys, falls back to admin keys)
- [ ] T006 [P] Create error handling utilities in `convex/lib/errors.ts` for standardized error responses (9 error codes from contracts)
- [ ] T007 [P] Start Convex dev server: `npx convex dev` and verify schema deployment
- [ ] T007b [Foundational] Create auth check template in `convex/lib/auth.ts` with `requireAuth()` helper function that calls `ctx.auth.getUserIdentity()` and throws "Not authenticated" if null. Verify all user-data queries (conversations.list, conversations.get, messages.list, fileAttachments.list, userSettings.get) use this helper. Add code review checkpoint.

**Checkpoint**: Foundation ready - Convex schema deployed, helper utilities created, auth enforcement verified, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Chat Conversation (Priority: P1) 🎯 MVP

**Goal**: Users can engage in text-based conversations with AI assistants through a web interface with real-time streaming responses

**Independent Test**: User can open the app, type a message in the chat interface, and receive a streaming AI response. The conversation persists in the interface and database, and the user can continue the conversation thread.

### Implementation for User Story 1

#### Backend (Convex Functions)

- [ ] T008 [P] [US1] Implement `convex/conversations.ts` with queries: `list` (get user's conversations), `get` (get single conversation)
- [ ] T009 [P] [US1] Implement mutations in `convex/conversations.ts`: `create` (new conversation), `update` (change settings), `delete` (with cascade)
- [ ] T010 [P] [US1] Implement `convex/messages.ts` with query: `list` (get messages for conversation) and mutation: `create` (add user message)
- [ ] T011 [US1] Create AI streaming action in `convex/ai.ts`: `chat` action that calls OpenAI/Gemini APIs, streams response, creates assistant message
- [ ] T012 [US1] Implement token counting utility in `convex/lib/tokenCounter.ts` using tiktoken for context window management
- [ ] T013 [US1] Implement context window pruning in `convex/lib/contextManager.ts` (sliding window, keep recent messages within model limits)

#### Frontend (UI Components)

- [ ] T014 [P] [US1] Create chat page in `src/app/chat/page.tsx` with MainLayout wrapper and metadata
- [ ] T015 [P] [US1] Create `src/components/chat/ChatInterface.tsx` - main chat container with conversation display and input
- [ ] T016 [P] [US1] Create `src/components/chat/MessageList.tsx` - scrollable message history with user/assistant message rendering
- [ ] T017 [P] [US1] Create `src/components/chat/MessageInput.tsx` - text input with send button and loading states
- [ ] T018 [P] [US1] Create `src/components/chat/MessageBubble.tsx` - individual message component with role styling (user vs assistant)
- [ ] T019 [US1] Implement streaming handler in `src/lib/ai/streamHandler.ts` - fetch with ReadableStream, parse SSE events, update React state
- [ ] T020 [US1] Connect ChatInterface to Convex: use `useQuery` for messages, `useMutation` for sending, `useAction` for AI streaming
- [ ] T021 [US1] Add error handling UI in ChatInterface: display error messages from AI API failures with retry button
- [ ] T022 [US1] Add loading states: skeleton for message list, disabled input during streaming, typing indicator

**Checkpoint**: At this point, User Story 1 should be fully functional - user can chat with AI (default provider) and see streaming responses

---

## Phase 4: User Story 2 - AI Provider Selection (Priority: P1) 🎯 MVP

**Goal**: Users can switch between different AI providers (ChatGPT and Gemini) and select specific models within each provider

**Independent Test**: User can select ChatGPT from a provider dropdown, choose GPT-4o from a model dropdown, send a message and receive a response, then switch to Gemini and select Gemini 1.5 Pro, send another message, and receive a response from the new provider and model. The interface clearly indicates which provider and model are active.

### Implementation for User Story 2

#### Backend (Provider Logic)

- [ ] T023 [P] [US2] Create provider configuration in `convex/lib/aiProviders.ts` - define available models per provider (OpenAI: gpt-4o, gpt-4o-mini, gpt-3.5-turbo; Gemini: gemini-1.5-pro, gemini-1.5-flash)
- [ ] T024 [P] [US2] Implement `convex/userSettings.ts` with query: `get` (user's settings) and mutation: `upsert` (save API keys, default provider, default model)
- [ ] T025 [US2] Update `convex/ai.ts` chat action to use conversation's provider and model settings (retrieve from conversation record)
- [ ] T026 [US2] Add API key validation in `convex/lib/apiKeyValidator.ts` - test keys against provider APIs before saving

#### Frontend (Provider Selection UI)

- [ ] T027 [P] [US2] Create `src/components/chat/ProviderSelector.tsx` - dropdown for selecting AI provider (OpenAI/Gemini) with icons
- [ ] T028 [P] [US2] Create `src/components/chat/ModelSelector.tsx` - dropdown for selecting model based on active provider
- [ ] T029 [P] [US2] Create `src/components/chat/ProviderBadge.tsx` - visual indicator showing active provider and model in chat interface
- [ ] T030 [US2] Integrate ProviderSelector and ModelSelector into ChatInterface - update conversation settings on change
- [ ] T031 [US2] Add provider switching logic: update conversation with `conversations.update` mutation when user changes provider/model
- [ ] T032 [US2] Handle missing API keys: detect when user selects provider without configured keys, show modal with setup instructions

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - user can chat with any provider/model combination

---

## Phase 5: User Story 3 - File Upload for Context (Priority: P2)

**Goal**: Users can upload files (PDFs) to provide additional context to the AI assistant. The system extracts content from files and includes it in the conversation context.

**Independent Test**: User can click an upload button, select a PDF file from their computer, see the file appear in the chat interface with a filename, send a message asking about the file content, and receive a relevant response that demonstrates the AI has access to the file content.

### Implementation for User Story 3

#### Backend (File Processing)

- [ ] T033 [P] [US3] Implement `convex/fileAttachments.ts` with query: `list` (get files for conversation)
- [ ] T034 [P] [US3] Create file upload action in `convex/files.ts`: `upload` action that validates file, extracts text with pdf-parse, creates fileAttachment record. Include conversation-wide document quota check: query existing fileAttachments count for conversation, throw STORAGE_ERROR if >= 20 documents (FR-020).
- [ ] T035 [US3] Implement PDF text extraction in `convex/lib/pdfExtractor.ts` using pdf-parse library
- [ ] T036 [US3] Implement text chunking in `convex/lib/chunker.ts` - split text into 1000 token chunks with 200 token overlap using tiktoken
- [ ] T037 [US3] Implement embedding generation in `convex/lib/embedder.ts` - call OpenAI text-embedding-3-small API for each chunk
- [ ] T038 [US3] Update `convex/files.ts` upload action to create documentChunk records with embeddings after text extraction
- [ ] T039 [US3] Add file size validation (10MB limit per file) and file type validation (PDF, images: .png, .jpg, .jpeg, .txt, .md) in upload action

#### Frontend (File Upload UI)

- [ ] T040 [P] [US3] Create `src/components/files/FileUpload.tsx` - button with file picker, drag-and-drop area, upload progress indicator
- [ ] T041 [P] [US3] Create `src/components/files/FileList.tsx` - display uploaded files with filename, size, upload timestamp, delete button
- [ ] T042 [P] [US3] Create `src/components/files/FileIcon.tsx` - icon component for different file types (PDF icon)
- [ ] T043 [US3] Integrate FileUpload into ChatInterface - handle file selection, upload to Convex storage, call upload action
- [ ] T044 [US3] Add file upload error handling: show user-friendly errors for oversized files, unsupported formats, extraction failures, and 20-document quota exceeded (FR-020)
- [ ] T045 [US3] Update MessageList to show file attachments inline with messages (display FileList for conversation)
- [ ] T039a [P] [US3] Implement image validation in `convex/lib/imageValidator.ts` - check dimensions, file signature (magic bytes), enforce 10MB limit for images
- [ ] T039b [P] [US3] Create vision model capability checker in `convex/lib/modelCapabilities.ts` - return true for GPT-4V (gpt-4-vision-preview, gpt-4o), Gemini Pro Vision (gemini-1.5-pro, gemini-1.5-flash)
- [ ] T039c [US3] Update `convex/files.ts` upload action to handle image attachments - store image URLs in fileAttachment record, skip text extraction for images
- [ ] T039d [US3] Update `convex/ai.ts` chat action to pass image URLs to vision-capable models - check model capability first, show graceful error if text-only model selected with images
- [ ] T039e [US3] Add non-vision model error handler in ChatInterface - display "Selected model doesn't support image analysis. Switch to GPT-4o or Gemini 1.5 Pro" message

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work - user can upload files (including images) and AI can access file content and analyze images with vision models

---

## Phase 6: User Story 4 - RAG Toggle (Priority: P2)

**Goal**: Users can enable or disable RAG functionality to control whether the AI searches through uploaded documents for relevant context before responding

**Independent Test**: User can toggle RAG on, upload multiple documents, ask a question that requires information from those documents, and receive a response citing relevant passages. When toggled off, the same question receives a response without document retrieval.

### Implementation for User Story 4

#### Backend (RAG Search)

- [ ] T046 [P] [US4] Implement semantic search in `convex/lib/ragSearch.ts` - vectorSearch on documentChunks using query embedding
- [ ] T047 [P] [US4] Implement keyword search in `convex/lib/ragSearch.ts` - full-text search on documentChunk text field
- [ ] T048 [US4] Implement Reciprocal Rank Fusion (RRF) algorithm in `convex/lib/ragSearch.ts` - merge keyword and semantic results
- [ ] T049 [US4] Create RAG search action in `convex/rag.ts`: `search` action that takes query, returns top-ranked chunks with metadata
- [ ] T050 [US4] Update `convex/ai.ts` chat action to check conversation's `ragEnabled` flag, call rag.search if enabled, include results in AI context
- [ ] T051 [US4] Add citation generation in `convex/ai.ts` - map RAG chunks to citations array, store in assistant message record

#### Frontend (RAG Controls)

- [ ] T052 [P] [US4] Create `src/components/chat/RAGToggle.tsx` - switch component to enable/disable RAG per conversation
- [ ] T053 [P] [US4] Create `src/components/chat/CitationBadge.tsx` - display source citations in assistant messages (file name, chunk reference)
- [ ] T054 [US4] Integrate RAGToggle into ChatInterface - update conversation's `ragEnabled` field with mutation
- [ ] T055 [US4] Update MessageBubble to render citations when present - show expandable list of sources used for response
- [ ] T056 [US4] Add visual indicator in ChatInterface showing RAG status (enabled/disabled badge)

**Checkpoint**: At this point, User Stories 1-4 should all work independently - user can chat, switch providers, upload files, and toggle RAG

---

## Phase 7: User Story 5 - Conversation Management (Priority: P3)

**Goal**: Users can create multiple conversations, view conversation history, rename conversations, delete conversations, and navigate between them

**Independent Test**: User can click "New Conversation", start a fresh chat, navigate back to view a list of all conversations with titles and timestamps, click on an old conversation to resume it, rename a conversation by clicking an edit icon, and delete a conversation permanently.

### Implementation for User Story 5

#### Frontend (Conversation Management UI)

- [ ] T057 [P] [US5] Create `src/components/chat/ConversationList.tsx` - sidebar component displaying user's conversations with useQuery(api.conversations.list)
- [ ] T058 [P] [US5] Create `src/components/chat/ConversationItem.tsx` - individual conversation entry with title, timestamp, active state, hover actions
- [ ] T059 [P] [US5] Create `src/components/chat/NewConversationButton.tsx` - button to create new conversation with default settings
- [ ] T060 [P] [US5] Create `src/components/chat/ConversationMenu.tsx` - dropdown menu for rename and delete actions on conversation item
- [ ] T061 [US5] Integrate ConversationList into chat page layout - responsive sidebar (collapsible on mobile)
- [ ] T062 [US5] Implement conversation navigation - clicking ConversationItem loads that conversation's messages
- [ ] T063 [US5] Implement rename functionality - inline edit or modal dialog, calls conversations.update mutation
- [ ] T064 [US5] Implement delete functionality - confirmation dialog, calls conversations.delete mutation (cascades to messages, files, chunks)
- [ ] T065 [US5] Add auto-title generation - when user sends first message, extract/generate title and update conversation
- [ ] T066 [US5] Add conversation sorting - display most recently updated conversations at top (use updatedAt timestamp)

**Checkpoint**: All 5 user stories should now be independently functional - complete chat application with multi-provider support, file uploads, RAG, and conversation management

---

## Phase 8: User Settings & API Key Configuration

**Purpose**: Allow users to configure their own API keys (hybrid mode from clarifications)

- [ ] T067 [P] Create settings page in `src/app/settings/page.tsx` with MainLayout wrapper
- [ ] T068 [P] Create `src/components/settings/APIKeyInput.tsx` - secure password-style input for API keys with show/hide toggle
- [ ] T069 [P] Create `src/components/settings/ProviderSettings.tsx` - section for each provider (OpenAI, Gemini) with API key input and default model selector
- [ ] T070 Create `src/components/settings/KeyModeToggle.tsx` - switch between admin keys and user-provided keys
- [ ] T071 Integrate ProviderSettings into settings page - display current settings, call userSettings.upsert mutation on save
- [ ] T072 Add API key validation on save - call backend validator, show success/error feedback
- [ ] T073 Add "Test Connection" button per provider - sends test request to verify key works

**Checkpoint**: User settings page complete - users can provide their own API keys or use admin defaults

---

## Phase 9: Ragnarok Online Theme (CSS-First Polish)

**Purpose**: Apply custom Ragnarok Online-inspired "Gamer" theme using CSS-first approach

- [ ] T074 [P] Add Google Font (Press Start 2P) to `src/app/layout.tsx` for pixelated headings
- [ ] T075 [P] Define CSS custom properties in `src/app/globals.css` for Ragnarok Online color palette (browns, golds, fantasy aesthetic)
- [ ] T076 [P] Create ornate border styles in `src/app/globals.css` mimicking RO UI panels (thick borders, decorative corners)
- [ ] T077 [P] Style buttons with gradient backgrounds and hover effects (glow/shadow) in `src/app/globals.css`
- [ ] T078 Apply theme to ChatInterface - medieval window frame styling for main chat panel
- [ ] T079 Apply theme to ConversationList - sidebar with RO-style panel borders
- [ ] T080 Apply theme to MessageBubbles - user messages (one color), assistant messages (another color), borders/shadows
- [ ] T081 Apply theme to buttons and inputs - consistent fantasy game aesthetic across all interactive elements
- [ ] T082 Add responsive breakpoints - ensure theme works on mobile (collapsible sidebar, touch-friendly controls)

**Checkpoint**: Application has complete Ragnarok Online-inspired visual theme

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T083 [P] Add comprehensive error boundaries in `src/app/error.tsx` and component-level error handling
- [ ] T084 [P] Implement proper loading skeletons for all async data (conversations, messages, files)
- [ ] T085 [P] Add empty states - no conversations, no messages, no files with helpful prompts
- [ ] T086 [P] Optimize Convex queries - ensure all indexes are used, paginate conversation list if >50 items
- [ ] T087 [P] Add rate limit handling - detect rate limit errors from AI APIs, show user-friendly retry messages
- [ ] T088 [P] Implement graceful degradation - handle missing API keys, unavailable providers, network errors
- [ ] T089 Add accessibility improvements - ARIA labels, keyboard navigation, screen reader support
- [ ] T090 Add analytics/logging - track AI usage, error rates, user engagement (optional)
- [ ] T091 Run through quickstart.md validation - verify all setup steps work correctly
- [ ] T092 Update README.md with feature-specific documentation and screenshots

**Checkpoint**: Production-ready AI chatbot application complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P1): Can start after Foundational - Integrates with US1 but independently testable
  - User Story 3 (P2): Can start after Foundational - Enhances US1/US2 but independently testable
  - User Story 4 (P2): Depends on US3 (needs files uploaded) - Must complete US3 first
  - User Story 5 (P3): Can start after Foundational - Enhances navigation but independently testable
- **User Settings (Phase 8)**: Can start after Foundational - Enhances US2 but not blocking
- **Theme (Phase 9)**: Can start after US1 is functional - Visual polish, can proceed in parallel with other stories
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Core chat - can start after Foundational
- **User Story 2 (P1)**: Provider selection - can start after Foundational, integrates with US1
- **User Story 3 (P2)**: File upload - can start after Foundational, enhances US1/US2
- **User Story 4 (P2)**: RAG toggle - REQUIRES User Story 3 (needs files to search)
- **User Story 5 (P3)**: Conversation management - can start after Foundational, enhances navigation

### Within Each User Story

- Backend Convex functions before frontend components (queries/mutations/actions first)
- Helper utilities before main functions that use them
- Models/schema before services that use them
- Core functionality before error handling/polish
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**:

- All 3 tasks can run in parallel

**Phase 2 (Foundational)**:

- T005 (userSettings helper), T006 (error utilities) can run in parallel after T004 (schema) completes

**Phase 3 (User Story 1)**:

- Backend: T008 (conversations), T009 (conversation mutations), T010 (messages) can run in parallel
- Frontend: T014-T018 (all UI components) can run in parallel
- T011 (AI action) depends on T012, T013 (token counter, context manager)
- T019 (streaming handler) can run in parallel with other frontend tasks

**Phase 4 (User Story 2)**:

- T023 (provider config), T024 (userSettings) can run in parallel
- T027-T029 (all selector components) can run in parallel

**Phase 5 (User Story 3)**:

- T033 (fileAttachments query), T034 (upload action skeleton) can run in parallel
- T035-T037 (extractor, chunker, embedder utilities) can run in parallel
- T040-T042 (all file UI components) can run in parallel

**Phase 6 (User Story 4)**:

- T046-T048 (search utilities) can run in parallel
- T052, T053 (RAG UI components) can run in parallel

**Phase 7 (User Story 5)**:

- T057-T060 (all conversation list UI components) can run in parallel

**Phase 8 (Settings)**:

- T067-T070 (all settings UI components) can run in parallel

**Phase 9 (Theme)**:

- T074-T077 (CSS definitions) can run in parallel

**Phase 10 (Polish)**:

- T083-T088 (error handling, loading, empty states) can run in parallel

---

## Parallel Example: User Story 1 (Basic Chat)

```bash
# Launch all backend functions together:
Task: "Implement convex/conversations.ts queries (T008)"
Task: "Implement convex/conversations.ts mutations (T009)"
Task: "Implement convex/messages.ts (T010)"

# Launch all frontend components together:
Task: "Create src/app/chat/page.tsx (T014)"
Task: "Create src/components/chat/ChatInterface.tsx (T015)"
Task: "Create src/components/chat/MessageList.tsx (T016)"
Task: "Create src/components/chat/MessageInput.tsx (T017)"
Task: "Create src/components/chat/MessageBubble.tsx (T018)"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only - Core Chat with Provider Selection)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007) - CRITICAL checkpoint
3. Complete Phase 3: User Story 1 (T008-T022) - Basic chat working
4. Complete Phase 4: User Story 2 (T023-T032) - Provider selection working
5. **STOP and VALIDATE**: Test chat with multiple providers independently
6. Deploy/demo MVP if ready (fully functional multi-provider chatbot)

**MVP Definition**: User can chat with ChatGPT or Gemini, switch providers/models, see streaming responses. This delivers immediate value.

### Incremental Delivery (Add Features Post-MVP)

1. Setup + Foundational → Foundation ready
2. Add User Story 1 + 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 (File Upload) → Test independently → Deploy/Demo
4. Add User Story 4 (RAG Toggle) → Test independently → Deploy/Demo
5. Add User Story 5 (Conversation Management) → Test independently → Deploy/Demo
6. Add User Settings (Phase 8) → Deploy/Demo
7. Add Theme (Phase 9) → Deploy/Demo
8. Polish (Phase 10) → Final deploy

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers (after Foundational phase completes):

- **Developer A**: User Story 1 (Basic Chat) - T008-T022
- **Developer B**: User Story 2 (Provider Selection) - T023-T032
- **Developer C**: User Story 3 (File Upload) - T033-T045
- **Developer D**: User Story 5 (Conversation Management) - T057-T066

Then converge on User Story 4 (RAG) after US3 completes, since it depends on file upload.

---

## Task Summary

- **Total Tasks**: 92 tasks
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 4 tasks (CRITICAL - blocks all stories)
- **Phase 3 (User Story 1 - Basic Chat)**: 15 tasks
- **Phase 4 (User Story 2 - Provider Selection)**: 10 tasks
- **Phase 5 (User Story 3 - File Upload)**: 13 tasks
- **Phase 6 (User Story 4 - RAG Toggle)**: 11 tasks
- **Phase 7 (User Story 5 - Conversation Management)**: 10 tasks
- **Phase 8 (User Settings)**: 7 tasks
- **Phase 9 (Theme)**: 9 tasks
- **Phase 10 (Polish)**: 10 tasks

**Parallel Opportunities**: 45+ tasks marked [P] can run in parallel within their phase

**Independent Test Criteria**:

- **US1**: User can chat and receive streaming responses
- **US2**: User can switch providers/models and chat with each
- **US3**: User can upload files and AI responds about file content
- **US4**: User can toggle RAG and see citations in responses
- **US5**: User can create/rename/delete conversations and navigate between them

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 + Phase 4 (User Stories 1 & 2) = 32 tasks for fully functional multi-provider chatbot

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests not included per feature specification (can add later if needed)
- User Story 4 (RAG) depends on User Story 3 (File Upload) being complete
- Follow quickstart.md for development workflow (Terminal 1: `npx convex dev`, Terminal 2: `pnpm dev`)
