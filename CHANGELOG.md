# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - AI Chatbot Wrapper Feature (001) - Specification Phase

#### Requirements & Documentation

- Complete feature specification in `specs/001-ai-chatbot-wrapper/spec.md`

  - 37 functional requirements covering multi-provider AI chat
  - 2 non-functional requirements (NFR-001: Ragnarok Online theme, NFR-002: WCAG 2.1 AA accessibility)
  - 10 success criteria defining feature completion
  - 6 key entities: Conversation, Message, User Settings, Document, RAG Context, File Metadata
  - 5 user stories with acceptance criteria

- Implementation plan in `specs/001-ai-chatbot-wrapper/plan.md`

  - Constitution compliance evaluation (5/5 principles)
  - 4 justified dependencies: openai, @google/generative-ai, pdf-parse, tiktoken
  - 10-phase implementation strategy (97 tasks total)
  - Risk assessment and mitigation strategies

- Task breakdown in `specs/001-ai-chatbot-wrapper/tasks.md`

  - 97 implementation tasks across 10 phases
  - Phase 1: Setup (4 tasks) - Environment and dependencies
  - Phase 2: Foundational (4 tasks) - Database schema, helpers, auth enforcement
  - Phase 3-10: User stories and polish (89 tasks)
  - Special focus: Image handling (T039a-e), authentication verification (T007b), quota enforcement (T034, T044)

- Requirements completeness checklist in `specs/001-ai-chatbot-wrapper/checklists/completeness.md`
  - 119 validation items organized in 17 categories
  - 95%+ traceability to spec/plan/tasks documents
  - Gap prevention measures (CHK113-CHK119)
  - Pre-implementation quality assurance

#### Analysis Fixes Applied

- **HIGH Priority:**

  - H1: Added 5 tasks for image handling (validation, capability checking, integration, error handling)
  - H2: Added authentication enforcement verification task (T007b with requireAuth() helper)

- **MEDIUM Priority:**

  - M2: Resolved entity model mismatch (clarified "RAG Context" as embedded, added "User Settings" entity)
  - M3: Added missing tiktoken dependency documentation
  - M4: Added document quota enforcement (20-document limit per conversation)
  - M5: Added theme specification (NFR-001) for existing theme tasks

- **LOW Priority:**
  - L2: Added accessibility specification (NFR-002: WCAG 2.1 AA standards)

#### Feature Capabilities

- **AI Provider Support:**

  - OpenAI: GPT-4o, GPT-4o-mini, GPT-3.5-turbo, GPT-4-vision (image support)
  - Google Gemini: gemini-1.5-pro, gemini-1.5-flash, gemini-1.5-pro-vision (image support)
  - Flexible API key management (user-provided or fallback keys)
  - Real-time streaming responses with Server-Sent Events

- **File Upload & RAG:**

  - Document upload: PDF, Markdown, plain text (20 documents per conversation)
  - Image upload: PNG, JPG, JPEG (10MB limit, dimension validation)
  - Vector search with Convex for semantic retrieval
  - Toggle-able RAG mode with inline citations

- **Conversation Management:**

  - Create, rename, delete conversations
  - Conversation history with message persistence
  - Context window tracking (tiktoken-based)
  - Token usage monitoring per conversation

- **User Experience:**

  - Ragnarok Online themed interface (CSS-first, medieval aesthetic)
  - WCAG 2.1 AA accessibility compliance
  - Provider/model selection with real-time switching
  - Error handling with graceful degradation
  - Loading states and streaming indicators

- **Security & Quality:**
  - Clerk authentication with requireAuth() enforcement
  - API key validation before use
  - File type and size validation
  - Rate limiting considerations
  - Type-safe Convex schema with validators

### Documentation

- Updated `README.md`:

  - Reorganized features into "Core Features (Production-Ready)" and "Planned Features (In Development)"
  - Added reference to `specs/001-ai-chatbot-wrapper/` specification
  - Added feature status indicator
  - Maintained all existing setup and deployment instructions

- Created `CHANGELOG.md`:
  - Following Keep a Changelog format
  - Comprehensive specification phase summary
  - Organized by feature, requirements, analysis fixes, and capabilities

### Status

- **Current Phase:** Requirements complete, ready for Phase 1 implementation
- **Requirements Coverage:** 100% (37 FRs + 2 NFRs)
- **Task-to-Requirement Mapping:** 100%
- **Constitution Compliance:** 5/5 principles
- **Analysis Issues Resolved:** 7/7 (2 HIGH, 4 MEDIUM, 1 LOW)
- **Next Steps:** Review completeness checklist, begin Phase 1 (Setup)

---

## [0.1.0] - 2024-01-01 (Template Base)

### Added

- Next.js 15 template with App Router
- Clerk authentication integration
- Convex real-time backend
- Tailwind CSS 4 with shadcn/ui components
- Maintenance mode feature
- Basic project structure and documentation
- SEO configuration (sitemap, robots.txt, metadata)
- Development and production build scripts
- ESLint and Stylelint configuration

### Infrastructure

- GitHub repository initialization
- Vercel deployment configuration
- Convex backend setup
- Environment variable management
- TypeScript strict mode configuration
- pnpm package manager enforcement

[Unreleased]: https://github.com/romiafan/ai-chatbot-project/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/romiafan/ai-chatbot-project/releases/tag/v0.1.0
