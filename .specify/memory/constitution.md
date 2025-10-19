<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: 0.0.0 → 1.0.0

  Modified Principles:
  - NEW: I. Minimal Dependencies
  - NEW: II. Type-Safe Architecture
  - NEW: III. Authentication-First Design
  - NEW: IV. Real-Time Data Patterns
  - NEW: V. AI Integration Best Practices

  Added Sections:
  - Technology Stack Constraints
  - Development Workflow

  Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligns with new principles
  ✅ spec-template.md - Requirements section compatible with architecture principles
  ✅ tasks-template.md - Task structure supports component-based development

  Follow-up TODOs: None
-->

# AI Chatbot Project Constitution

## Core Principles

### I. Minimal Dependencies

**MUST maintain lean dependency footprint:**

- Core dependencies ONLY: Next.js 15, React 19, Clerk (auth), Convex (backend), Tailwind CSS 4, TypeScript
- UI components: shadcn/ui components (installed as source), lucide-react (icons), class-variance-authority, tailwind-merge
- Package manager: pnpm exclusively (never npm or yarn)
- NO additional state management libraries (use Convex reactive queries)
- NO additional routing libraries (use Next.js App Router)
- NO additional form libraries unless user-approved for complex forms
- NO additional animation libraries beyond Tailwind's built-in utilities

**Rationale:** Dependencies increase bundle size, maintenance burden, security surface, and deployment complexity. The template provides everything needed for production-ready AI chatbots. External libraries must justify their existence with clear, documented value that cannot be achieved with existing dependencies.

### II. Type-Safe Architecture

**MUST enforce end-to-end type safety:**

- TypeScript strict mode enabled across frontend and backend
- Convex schema definitions using `v` validators in `convex/schema.ts`
- All Convex functions (queries/mutations/actions) MUST have typed args
- React components MUST have explicit prop types (no implicit `any`)
- API responses from AI services MUST be validated with Convex validators or Zod
- NEVER edit files in `convex/_generated/` (auto-generated types)
- Use `api.filename.functionName` pattern for type-safe Convex imports

**Rationale:** Type safety prevents runtime errors, enables refactoring confidence, provides IDE autocomplete, and catches bugs at compile time. Convex's type generation ensures frontend-backend contract validation. AI API responses are unpredictable and require validation at the boundary.

### III. Authentication-First Design

**MUST implement authentication before data access:**

- ALL Convex queries/mutations serving user-specific data MUST call `ctx.auth.getUserIdentity()` first
- Identity check MUST throw error if null: `if (identity === null) throw new Error("Not authenticated")`
- Middleware order in `src/middleware.ts` MUST be: maintenance mode check → Clerk authentication
- Provider nesting in `src/app/layout.tsx` MUST be: `ClerkProvider` → `ConvexClientProvider` → children (NEVER reverse)
- All client components using auth hooks MUST have `"use client"` directive
- Public routes MUST be explicitly configured in middleware (default is protected)

**Rationale:** Authentication violations cause data leaks and security breaches. Convex depends on Clerk's useAuth hook, so provider order is critical. Maintenance mode must precede auth to allow global shutdown. The template's architecture enforces this pattern, and deviations break the application.

### IV. Real-Time Data Patterns

**MUST use Convex reactive patterns:**

- Use `useQuery(api.module.function)` for all data fetching (NOT fetch/axios)
- Use `useMutation(api.module.function)` for all data writes
- Use `useAction(api.module.function)` for AI API calls (OpenAI, Gemini, etc.)
- Handle loading state: `if (data === undefined) return <LoadingComponent />`
- Handle empty state: `if (data === null || data.length === 0) return <EmptyState />`
- NEVER store AI conversation state in React state - use Convex tables
- Database indexes MUST be defined for common query patterns in `convex/schema.ts`

**Rationale:** Convex provides automatic real-time updates, optimistic updates, and caching. Using fetch/axios bypasses these benefits and requires manual state management. AI chatbot conversations need persistence and multi-device sync. Indexes prevent slow queries as data scales.

### V. AI Integration Best Practices

**MUST follow AI service integration patterns:**

- AI API calls (OpenAI, Gemini) MUST be in Convex actions (NOT queries/mutations)
- API keys MUST be server-side only (never `NEXT_PUBLIC_*` prefix)
- Store user messages in Convex BEFORE calling AI service
- Store AI responses in Convex AFTER receiving them
- Implement streaming responses using Server-Sent Events for better UX
- Handle rate limits, timeouts, and errors gracefully with user-friendly messages
- Store conversation context in Convex for multi-turn conversations
- Include usage tracking (tokens, costs) in database schema

**Rationale:** Actions are designed for external API calls and provide proper error handling. Exposing API keys client-side is a security violation. Storing messages before/after ensures data persistence even if AI calls fail. Streaming prevents user waiting on long responses. Conversation context enables coherent multi-turn chat. Usage tracking prevents cost overruns.

## Technology Stack Constraints

**MUST use only approved technologies:**

**Frontend:**

- Framework: Next.js 15 with App Router (no Pages Router)
- Language: TypeScript 5+ (strict mode enabled)
- Styling: Tailwind CSS 4 with OKLCH color space
- UI Components: shadcn/ui (install as source via CLI)
- Icons: lucide-react only
- Runtime: React 19 (Server Components where possible)

**Backend:**

- Platform: Convex (real-time backend with type generation)
- Authentication: Clerk (no custom auth implementations)
- Database: Convex tables (no PostgreSQL, MongoDB, etc.)
- File Storage: Convex file storage for user uploads (if needed)

**AI Services (choose one or both):**

- OpenAI API (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo)
- Google Gemini API (Gemini Pro, Gemini Pro Vision)
- Access via Convex actions with server-side API keys

**Deployment:**

- Frontend: Vercel (auto-deploy from Git)
- Backend: Convex (deploy via `npx convex deploy --prod`)

**Development Tools:**

- Package Manager: pnpm (NEVER npm or yarn)
- Linting: ESLint (Next.js config)
- CSS Linting: Stylelint (Tailwind-aware config)
- Formatting: Built-in VS Code formatting
- Type Checking: TypeScript compiler

**MUST NOT introduce:**

- Redux, Zustand, Jotai, or other state management (use Convex)
- React Query, SWR (use Convex queries)
- Axios, node-fetch (use native fetch in Convex actions)
- Express, Fastify (use Next.js API routes only if Convex actions insufficient)
- Prisma, Drizzle, TypeORM (use Convex schema)
- Socket.io (use Convex subscriptions)

## Development Workflow

**Phase 1: Setup and Configuration**

1. Clone template repository
2. Install dependencies: `pnpm install`
3. Configure environment variables in `.env.local`
4. Start Convex backend: `npx convex dev` (separate terminal)
5. Start Next.js: `pnpm dev`

**Phase 2: Feature Development**

1. Define database schema in `convex/schema.ts` (tables, indexes, validators)
2. Create Convex functions in `convex/[feature].ts` (queries/mutations/actions)
3. Build UI components in `src/components/[feature]/` (with "use client" if needed)
4. Create pages in `src/app/[route]/page.tsx` with metadata
5. Test locally with both terminals running
6. Commit changes (Convex auto-deploys to dev environment)

**Phase 3: AI Integration**

1. Add AI service API key to `.env.local` (NOT `NEXT_PUBLIC_*`)
2. Create Convex action in `convex/ai.ts` for API calls
3. Implement conversation schema in `convex/schema.ts`
4. Build chat UI with streaming support
5. Add error handling and rate limiting
6. Test with multiple conversation threads

**Phase 4: Deployment**

1. Deploy Convex: `npx convex deploy --prod` (get production URL)
2. Add `NEXT_PUBLIC_CONVEX_URL` to Vercel environment variables
3. Add AI API keys to Vercel environment variables (server-side)
4. Push to main branch (Vercel auto-deploys)
5. Update Clerk allowed domains with production URL
6. Verify production deployment works end-to-end

**Quality Gates:**

- TypeScript MUST compile without errors: `tsc --noEmit`
- ESLint MUST pass: `pnpm lint`
- Stylelint MUST pass: `pnpm lint:css`
- Production build MUST succeed: `pnpm build`
- All Convex functions MUST have auth checks for user data
- No `NEXT_PUBLIC_*` environment variables for API keys
- Convex dev server MUST be running during development

**Code Review Checklist:**

- [ ] Minimal dependencies maintained (no unauthorized additions)
- [ ] Type safety enforced (no `any` types, proper validators)
- [ ] Authentication checks present in Convex functions
- [ ] Real-time patterns used (no fetch/axios for app data)
- [ ] AI calls in actions (not queries/mutations)
- [ ] API keys server-side only
- [ ] "use client" directive on components using hooks
- [ ] Error handling and loading states implemented
- [ ] Metadata configured for SEO
- [ ] No direct edits to `convex/_generated/`

## Governance

**Amendment Process:**

1. Propose changes via GitHub issue with rationale
2. Document alternatives considered and rejected
3. Update this constitution with version bump
4. Update affected templates in `.specify/templates/`
5. Update `.github/copilot-instructions.md` if architecture changes
6. Commit with message: `docs: amend constitution to vX.Y.Z (description)`

**Version Bumping Rules:**

- **MAJOR (X.0.0)**: Remove/replace core principle, change tech stack, break existing patterns
- **MINOR (0.X.0)**: Add new principle, add new section, expand guidance materially
- **PATCH (0.0.X)**: Clarify wording, fix typos, refine examples, non-semantic changes

**Compliance Verification:**

- All PRs MUST pass Quality Gates before merge
- Complexity violations MUST be justified in plan.md Complexity Tracking table
- Dependency additions MUST be approved and documented
- Architecture deviations MUST be approved by maintainers

**Runtime Development Guidance:**

- Primary reference: `.github/copilot-instructions.md`
- Template reference: `.specify/templates/`
- This constitution supersedes all other practices

**Version**: 1.0.0 | **Ratified**: 2025-10-19 | **Last Amended**: 2025-10-19
