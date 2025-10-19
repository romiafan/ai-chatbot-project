# AI Chatbot Project

A production-ready AI chatbot application built with Next.js 15, featuring real-time conversations, authentication, and support for OpenAI/Gemini APIs. Built using minimal dependencies and following best practices for type safety, authentication, and real-time data patterns.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with OKLCH color space
- **Authentication**: [Clerk](https://clerk.com)
- **Backend**: [Convex](https://convex.dev) - Real-time backend with type-safe APIs
- **AI Services**: OpenAI API / Google Gemini API (configurable)
- **UI Components**: shadcn/ui components with class-variance-authority
- **Package Manager**: pnpm (strictly enforced)

## Features

- 🤖 **AI Chat Integration** - Support for OpenAI GPT and Google Gemini APIs
- � **Real-time Conversations** - Live chat updates with Convex subscriptions
- �🔐 **Authentication-First** - Secure Clerk integration with user-specific data
- ⚡ **Type-Safe Architecture** - End-to-end TypeScript with Convex validators
- 🎨 **Modern UI** - Tailwind CSS 4 + shadcn/ui components
- 📱 **Responsive Design** - Mobile-first with dark mode support
- � **Streaming Responses** - Server-Sent Events for smooth AI interactions
- � **Conversation Persistence** - All messages stored in Convex backend
- 📊 **Usage Tracking** - Token counting and cost monitoring
- 🚧 **Maintenance Mode** - Built-in maintenance page
- 📄 **SEO Ready** - Meta tags, sitemap, robots.txt
- ⚠️ **Error Handling** - Graceful error recovery and user feedback

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`) - **Required, not optional**
- Clerk account ([clerk.com](https://clerk.com))
- Convex account ([convex.dev](https://convex.dev))
- OpenAI API key ([platform.openai.com](https://platform.openai.com)) or Google Gemini API key ([ai.google.dev](https://ai.google.dev))

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chatbot-project

# Install dependencies (must use pnpm)
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory (see `.env.local` for reference):

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name

# Maintenance Mode (optional)
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

**Get your keys:**

- **Clerk**: Sign up at [clerk.com](https://clerk.com) and create an application
- **Convex**: Sign up at [convex.dev](https://convex.dev) and create a project

### 3. Set Up Convex

```bash
# Initialize Convex (if not already done)
npx convex dev
```

This will:

- Create a Convex project (if needed)
- Generate type-safe API code
- Start the Convex development server
- Watch for changes to your Convex functions

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
├── convex/                 # Convex backend
│   ├── auth.config.ts     # Authentication configuration
│   ├── messages.ts        # Example queries/mutations
│   ├── schema.ts          # Database schema
│   └── _generated/        # Auto-generated types
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── layout.tsx     # Root layout with providers
│   │   ├── page.tsx       # Home page
│   │   ├── error.tsx      # Error boundary
│   │   ├── not-found.tsx  # 404 page
│   │   ├── loading.tsx    # Loading state
│   │   ├── sitemap.ts     # Dynamic sitemap
│   │   ├── pricing/       # Pricing page
│   │   └── maintenance/   # Maintenance mode page
│   ├── components/        # React components
│   │   ├── Navbar.tsx     # Navigation bar
│   │   ├── Footer.tsx     # Footer
│   │   ├── layouts/       # Layout wrappers
│   │   └── ConvexClientProvider.tsx
│   ├── lib/               # Utilities
│   │   ├── utils.ts       # Helper functions
│   │   └── metadata.ts    # SEO utilities
│   └── middleware.ts      # Auth + maintenance middleware
├── public/                # Static assets
│   └── robots.txt         # SEO robots file
└── package.json
```

## Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:css     # Run Stylelint for CSS
npx convex dev    # Start Convex backend (separate terminal)
```

## Convex Backend

### Schema

The database schema is defined in `convex/schema.ts`. Example:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    text: v.string(),
  }),
});
```

### Queries and Mutations

Define backend functions in `convex/`:

```typescript
// convex/messages.ts
import { query } from "./_generated/server";

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    // ... your logic
  },
});
```

Use them in your React components:

```typescript
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const messages = useQuery(api.messages.getForCurrentUser);
```

## Authentication

This template uses Clerk for authentication. Key files:

- `src/middleware.ts` - Protects routes
- `src/app/layout.tsx` - ClerkProvider setup
- `src/components/ConvexClientProvider.tsx` - Integrates Clerk with Convex

### Protected Routes

By default, all routes are protected. To make a route public, update `src/middleware.ts`:

```typescript
export default clerkMiddleware((auth, req) => {
  // Public routes configuration
});
```

## Styling

This project uses:

- **Tailwind CSS 4** for utility-first styling
- **class-variance-authority** for component variants
- **tailwind-merge** for merging Tailwind classes
- **lucide-react** for icons

Components are in `src/components/` with utilities in `src/lib/utils.ts`.

## Maintenance Mode

This template includes a built-in maintenance mode feature that allows you to temporarily take your site offline for maintenance.

### Enable Maintenance Mode

Add this environment variable to your `.env.local`:

```env
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

When enabled, all requests will be redirected to `/maintenance`, displaying a friendly maintenance page.

### Disable Maintenance Mode

Set the variable to `false` or remove it:

```env
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### Customization

The maintenance page is located at `src/app/maintenance/page.tsx`. You can customize:

- Design and styling
- Maintenance message
- Expected return time
- Contact information

### How It Works

The middleware (`src/middleware.ts`) checks the `NEXT_PUBLIC_MAINTENANCE_MODE` environment variable before processing requests:

1. If maintenance mode is enabled, users are redirected to `/maintenance`
2. The maintenance page itself is always accessible
3. When disabled, the `/maintenance` route redirects to home
4. Normal authentication flow resumes when maintenance mode is off

This is perfect for:

- Scheduled maintenance windows
- Emergency updates
- Database migrations
- System upgrades

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy Convex

```bash
npx convex deploy
```

Update your production environment variables with the production Convex URL.

## Customization

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guide on:

- Adding new pages and features
- Customizing branding and styling
- Creating Convex functions
- Deployment instructions
- Common use cases (AI chatbots, ecommerce, landing pages)

## AI Coding Agent Instructions

This template includes comprehensive AI coding agent instructions in `.github/copilot-instructions.md`. These instructions are designed to help AI assistants (GitHub Copilot, Claude, ChatGPT, etc.) understand:

- Critical architecture patterns (provider nesting, middleware flow)
- Deployment workflows for Vercel and Convex
- Common project patterns (AI chatbots, ecommerce, landing pages)
- Best practices for Convex queries/mutations/actions
- Production-ready code examples

**For AI agents**: Read `.github/copilot-instructions.md` first for project-specific guidance.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
