# AI Coding Agent Instructions

## 🔴 CRITICAL: Documentation-First Workflow (Read This First!)

**BEFORE making ANY changes to code, AI models, or project architecture, you MUST:**

1. **Check `/docs/` folder** for technical references:

   - `openai-models-reference.md` - OpenAI model specifications, capabilities, pricing, limits
   - `gemini-models-reference.md` - Google Gemini model specifications, capabilities, pricing, limits
   - Always verify model names, parameters, and pricing against these references before implementation

2. **Check `/specs/001-ai-chatbot-wrapper/` folder** for project specifications:

   - `spec.md` - Complete feature specification and requirements
   - `data-model.md` - Database schema and data structures
   - `plan.md` - Implementation roadmap and architecture decisions
   - `tasks.md` - Task breakdown and current status
   - `quickstart.md` - Setup and getting started guide
   - `contracts/convex-api.md` - Convex API contracts and interfaces
   - `checklists/requirements.md` & `completeness.md` - Validation checklists

3. **Workflow for ANY task**:
   ```
   ┌─────────────────────────────────────────────────────────┐
   │ 1. READ relevant docs/specs files FIRST                │
   │ 2. Verify approach aligns with documented standards    │
   │ 3. Check for existing patterns/decisions in specs      │
   │ 4. Implement changes following documented guidelines   │
   │ 5. Update docs/specs if you add new patterns           │
   └─────────────────────────────────────────────────────────┘
   ```

**Examples of when to check documentation:**

- Adding AI provider support → Check `docs/openai-models-reference.md` or `docs/gemini-models-reference.md`
- Modifying Convex schema → Check `specs/001-ai-chatbot-wrapper/data-model.md`
- Adding new features → Check `specs/001-ai-chatbot-wrapper/spec.md` and `tasks.md`
- Implementing API calls → Check `specs/001-ai-chatbot-wrapper/contracts/convex-api.md`
- Setting up project → Check `specs/001-ai-chatbot-wrapper/quickstart.md`

**Why this matters:**

- ✅ Ensures consistency with project decisions
- ✅ Prevents using deprecated/incorrect model names or parameters
- ✅ Avoids reimplementing existing solutions
- ✅ Maintains alignment with documented architecture
- ✅ Reduces errors from outdated assumptions

---

## Project Overview

This is a **production-ready Next.js 15 template** for building modern web applications. Designed for AI chatbots (GPT/Gemini wrappers), ecommerce sites, landing pages, and company profiles.

**Stack**: Next.js 15 + Clerk (auth) + Convex (real-time backend) + shadcn/ui + Tailwind CSS 4 + TypeScript + pnpm

**Deployment**: Vercel (frontend) + Convex (backend)

## Architecture Patterns

### Provider Nesting Pattern (Critical)

The app has a specific provider hierarchy in `src/app/layout.tsx`:

```tsx
<ClerkProvider>
  <ConvexClientProvider>{children}</ConvexClientProvider>
</ClerkProvider>
```

- **Never** reverse this order - Convex needs Clerk's `useAuth` hook
- `ConvexClientProvider` (`src/components/ConvexClientProvider.tsx`) bridges Clerk auth with Convex using `ConvexProviderWithClerk`
- All client components must be marked with `"use client"` directive

### Middleware Flow (Authentication + Maintenance)

`src/middleware.ts` has dual responsibilities:

1. **Maintenance mode** - checks `NEXT_PUBLIC_MAINTENANCE_MODE` env var first
2. **Authentication** - runs Clerk middleware after maintenance check

When adding middleware logic, maintain this order or maintenance mode breaks.

### Convex Backend Structure

- **Schema**: Define tables in `convex/schema.ts` using `defineTable` and `v` validators
- **Functions**: Create queries/mutations in separate files (e.g., `convex/messages.ts`)
- **Auth integration**: Use `ctx.auth.getUserIdentity()` to get Clerk user in Convex functions
- **Type generation**: `convex/_generated/` is auto-generated - never edit directly

Example query pattern from `convex/messages.ts`:

```typescript
export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    return await ctx.db.query("messages").filter(/* ... */).collect();
  },
});
```

## Development Workflow

### Essential Commands

```bash
pnpm dev                 # Next.js dev with Turbopack
npx convex dev           # Start Convex backend (separate terminal)
pnpm lint                # ESLint check
pnpm lint:css            # Stylelint for CSS
pnpm build               # Production build (validates for Vercel)
```

**Critical**: Always run `npx convex dev` in a separate terminal during development - it watches `convex/` files and regenerates types.

### Deployment Workflow

#### Vercel (Frontend)

```bash
# First time setup
vercel link              # Link to Vercel project
vercel env pull          # Pull environment variables

# Deploy
git push origin main     # Auto-deploys via Vercel Git integration
# OR
vercel --prod            # Manual production deploy
```

**Environment variables** in Vercel dashboard:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOYMENT` (optional)
- `NEXT_PUBLIC_MAINTENANCE_MODE` (for maintenance windows)

#### Convex (Backend)

```bash
# Deploy to production
npx convex deploy --prod

# Get production URL (add to Vercel env)
# Copy from dashboard or after deploy
```

**Deployment order**:

1. Deploy Convex first → get production URL
2. Add `NEXT_PUBLIC_CONVEX_URL` to Vercel
3. Deploy/redeploy Vercel frontend

**Clerk configuration**: Update allowed domains in Clerk dashboard to include Vercel production URL.

### Adding New Features

1. **Database changes**: Update `convex/schema.ts` first → Convex auto-regenerates types
2. **Convex functions**: Add to `convex/` → import via `api.filename.functionName`
3. **Components**: Use `@/components` alias, `"use client"` for hooks
4. **Styling**: Use `cn()` utility from `@/lib/utils.ts` to merge Tailwind classes

### Common Project Types & Patterns

#### AI Chatbot (GPT/Gemini Wrapper)

```typescript
// convex/chat.ts
export const sendMessage = mutation({
  args: { message: v.string(), conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // Store user message
    await ctx.db.insert("messages", {
      ...args,
      role: "user",
      userId: identity.subject,
    });
    // Call OpenAI/Gemini API (use API routes or Convex actions)
    // Store AI response
  },
});
```

**Best practices**:

- Use Convex **actions** (not mutations) for external API calls to AI services
- Store conversation history in Convex for real-time updates
- Use streaming responses with Server-Sent Events for chat UX

#### Ecommerce

```typescript
// convex/products.ts - List products with filtering
export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products");
    if (args.category)
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    return await query.collect();
  },
});

// convex/cart.ts - User cart management
export const addToCart = mutation({
  args: { productId: v.id("products"), quantity: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    // Implement cart logic
  },
});
```

**Best practices**:

- Use Convex for cart state (real-time sync across devices)
- Integrate Stripe/Lemon Squeezy via Next.js API routes
- Use Clerk user metadata for order history

#### Landing Pages & Profiles

```typescript
// convex/content.ts - CMS-like content management
export const getPage = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
  },
});
```

**Best practices**:

- Use Convex for dynamic content (editable without deploys)
- Static pages in `src/app/` for SEO-critical content
- Use Next.js Image component with Vercel optimization

## Styling Conventions

### Tailwind CSS 4 Specifics

- **Color system**: Uses OKLCH color space with decimal notation (e.g., `oklch(0.5 0.2 180)`)
- **Theme variables**: Defined in `src/app/globals.css` using `@theme inline`
- **Dark mode**: Uses custom variant `@custom-variant dark (&:is(.dark *))`
- **Component variants**: Use `class-variance-authority` (not plain strings)

### shadcn/ui Configuration

This project uses shadcn/ui with "new-york" style:

- Configuration in `components.json`
- Components install to `@/components/ui`
- Use `pnpm dlx shadcn@latest add <component>` to add new components
- The `cn()` helper merges classes correctly - use it instead of template literals

**Component organization**:

- `@/components/ui/*` - shadcn components only (don't edit after install, regenerate instead)
- `@/components/*` - Custom application components (Navbar, Footer, ChatInterface, etc.)
- Wrap shadcn components in custom components for app-specific logic

### Stylelint Setup

`.stylelintrc.json` is configured to **ignore Tailwind CSS 4 directives**:

- Disables `lightness-notation`, `color-function-notation` rules for OKLCH
- Allows `@tailwind`, `@apply`, `@layer`, `@theme`, `@custom-variant`
- Run `pnpm lint:css` to validate CSS

## Common Patterns

### Using Convex Queries/Mutations in Components

```tsx
"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const data = useQuery(api.messages.getForCurrentUser);
const doSomething = useMutation(api.messages.create);
```

### Convex Functions: Queries vs Mutations vs Actions

- **Queries** - Read data, cached, reactive (use `query`)
- **Mutations** - Write to database, transactional (use `mutation`)
- **Actions** - Call external APIs (OpenAI, Stripe, etc.), non-transactional (use `action`)

```typescript
// convex/ai.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const generateResponse = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    // Call external API (OpenAI, Gemini, etc.)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        /* ... */
      }),
    });

    // Can call mutations to save results
    await ctx.runMutation(api.messages.create, { text: response.data });
    return response.data;
  },
});
```

**Best practice**: Use actions for AI APIs, payment processing, sending emails - anything external to Convex.

### Page Structure Pattern

Every new page should follow this structure:

```tsx
import { MainLayout } from "@/components/layouts/MainLayout";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Page Title",
  description: "Page description for SEO",
});

export default function YourPage() {
  return <MainLayout>{/* Your page content */}</MainLayout>;
}
```

### Path Aliases

From `tsconfig.json`:

- `@/*` → `./src/*`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`

### Environment Variables

Required in `.env.local` (development):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` (Clerk auth)
- `NEXT_PUBLIC_CONVEX_URL` (Convex backend)
- `NEXT_PUBLIC_MAINTENANCE_MODE` (optional, "true" enables maintenance page)

**For AI chatbots, add**:

- `OPENAI_API_KEY` or `GOOGLE_AI_API_KEY` (server-side only, for Convex actions)

**For ecommerce, add**:

- `STRIPE_SECRET_KEY` or `LEMONSQUEEZY_API_KEY` (server-side only)

Prefix with `NEXT_PUBLIC_` for client-side access. Never expose API keys client-side.

## What NOT to Do

- ❌ Don't edit files in `convex/_generated/` or `.next/`
- ❌ Don't use npm/yarn - this project uses **pnpm**
- ❌ Don't add auth logic to `middleware.ts` before maintenance mode check
- ❌ Don't use percentage notation in OKLCH colors (stylelint allows decimals)
- ❌ Don't create Convex queries without auth checks if data is user-specific
- ❌ Don't call external APIs in mutations - use actions instead
- ❌ Don't expose API keys in `NEXT_PUBLIC_*` env vars
- ❌ Don't add tests to this template - keep it minimal for forking

## Performance & Production Best Practices

### Images

```tsx
import Image from "next/image";
// Always use Next.js Image component for Vercel optimization
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />;
```

### Database Indexing

```typescript
// convex/schema.ts
export default defineSchema({
  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]), // Add indexes for common queries
});
```

### Loading States

```tsx
const data = useQuery(api.messages.list);
if (data === undefined) return <Skeleton />; // Convex returns undefined while loading
if (data === null) return <EmptyState />; // null means no data
```

### Error Handling

```typescript
// Convex functions
handler: async (ctx, args) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  // Errors automatically propagate to client with helpful messages
};
```

## Quick Reference

- **Add database table**: Edit `convex/schema.ts` → run `npx convex dev` to regenerate types
- **Add Convex function**: Create file in `convex/` → import via `api.filename.functionName`
- **Add page**: Create `src/app/[route]/page.tsx` → wrap with `MainLayout` → add metadata with `createMetadata()`
- **Add UI component**: `pnpm dlx shadcn@latest add <component>` or create in `src/components/`
- **Add utility**: Add to `src/lib/utils.ts` or create new file in `src/lib/`
- **Update SEO**: Edit `src/lib/metadata.ts` for site-wide config, use `createMetadata()` per page
- **Deploy**: `npx convex deploy --prod` → `git push` (Vercel auto-deploys)

## Common Use Cases Quick Start

| Project Type    | Key Files to Create                        | Convex Schema Tables          |
| --------------- | ------------------------------------------ | ----------------------------- |
| AI Chatbot      | `convex/chat.ts`, `src/app/chat/page.tsx`  | `conversations`, `messages`   |
| Ecommerce       | `convex/products.ts`, `convex/cart.ts`     | `products`, `carts`, `orders` |
| Landing Page    | `src/app/page.tsx`, `convex/leads.ts`      | `leads`, `contacts`           |
| Company Profile | `src/app/about/page.tsx`, `convex/team.ts` | `team_members`, `portfolio`   |

---

## 📚 Documentation Reference Map

Always consult these files before making related changes:

### AI Model Integration

- **OpenAI models** → `/docs/openai-models-reference.md`
- **Gemini models** → `/docs/gemini-models-reference.md`

### Project Architecture & Specifications

- **Feature requirements** → `/specs/001-ai-chatbot-wrapper/spec.md`
- **Database schema** → `/specs/001-ai-chatbot-wrapper/data-model.md`
- **Implementation plan** → `/specs/001-ai-chatbot-wrapper/plan.md`
- **Task tracking** → `/specs/001-ai-chatbot-wrapper/tasks.md`
- **API contracts** → `/specs/001-ai-chatbot-wrapper/contracts/convex-api.md`
- **Setup guide** → `/specs/001-ai-chatbot-wrapper/quickstart.md`

### Validation Checklists

- **Requirements checklist** → `/specs/001-ai-chatbot-wrapper/checklists/requirements.md`
- **Completeness checklist** → `/specs/001-ai-chatbot-wrapper/checklists/completeness.md`

**Remember**: When in doubt, read the docs first! 📖
