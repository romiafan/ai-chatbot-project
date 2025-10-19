# Contributing to Next.js Template

Thank you for considering using this template! This guide will help you get started quickly.

## 🚀 Using This Template

### Quick Start

1. **Fork or Clone** this repository
2. **Install dependencies**: `pnpm install`
3. **Set up environment variables**: Copy `.env.example` to `.env.local` and fill in your keys
4. **Start Convex**: `npx convex dev` (in a separate terminal)
5. **Start Next.js**: `pnpm dev`

### Required Accounts

Before using this template, create accounts for:

- [Clerk](https://clerk.com) - Authentication
- [Convex](https://convex.dev) - Real-time backend
- [Vercel](https://vercel.com) - Deployment (optional)

### Environment Setup

Create a `.env.local` file:

```bash
# Clerk (get from dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex (get after running `npx convex dev`)
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

## 📝 Customization Guide

### 1. Update Branding

- **Site name**: Update `src/lib/metadata.ts` → `siteConfig.name`
- **Logo**: Replace logo in `src/components/Navbar.tsx`
- **Colors**: Modify `src/app/globals.css` → CSS variables
- **Favicon**: Replace `public/favicon.ico`

### 2. Add New Pages

```bash
# Create a new page
src/app/your-page/page.tsx
```

Use the `MainLayout` wrapper:

```tsx
import { MainLayout } from "@/components/layouts/MainLayout";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Your Page",
  description: "Your page description",
});

export default function YourPage() {
  return <MainLayout>{/* Your content */}</MainLayout>;
}
```

### 3. Add Convex Functions

```bash
# Create new Convex file
convex/your-feature.ts
```

Example:

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.query("your_table").collect();
  },
});
```

Update schema in `convex/schema.ts`:

```typescript
your_table: defineTable({
  field: v.string(),
});
```

### 4. Add UI Components

Use shadcn/ui CLI:

```bash
pnpm dlx shadcn@latest add button
```

Or create custom components in `src/components/`

## 🎨 Styling

This template uses:

- **Tailwind CSS 4** with OKLCH colors
- **shadcn/ui** components (new-york style)
- **Dark mode** support

### Adding Custom Colors

Edit `src/app/globals.css`:

```css
:root {
  --your-color: oklch(0.5 0.2 180);
}
```

## 🧪 Development Workflow

### Running Locally

```bash
# Terminal 1: Convex backend
npx convex dev

# Terminal 2: Next.js frontend
pnpm dev
```

### Linting

```bash
pnpm lint        # ESLint
pnpm lint:css    # Stylelint
```

### Building

```bash
pnpm build       # Production build
```

## 🚢 Deployment

### Deploy Convex (Backend)

```bash
npx convex deploy --prod
```

Copy the production URL and add to Vercel environment variables.

### Deploy Vercel (Frontend)

```bash
# Connect to Vercel
vercel link

# Add environment variables in Vercel dashboard
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY
# - NEXT_PUBLIC_CONVEX_URL (from Convex deploy)

# Deploy
git push origin main  # Auto-deploys if connected
# OR
vercel --prod
```

## 📚 Project Structure

```
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Root layout
│   │   ├── error.tsx        # Error boundary
│   │   ├── not-found.tsx    # 404 page
│   │   └── loading.tsx      # Loading state
│   ├── components/          # React components
│   │   ├── Navbar.tsx       # Navigation
│   │   ├── Footer.tsx       # Footer
│   │   └── layouts/         # Layout wrappers
│   └── lib/                 # Utilities
│       ├── utils.ts         # Helper functions
│       └── metadata.ts      # SEO utilities
├── convex/                  # Backend functions
│   ├── schema.ts           # Database schema
│   ├── messages.ts         # Example functions
│   └── auth.config.ts      # Clerk integration
└── public/                 # Static assets
```

## 🤝 Common Use Cases

### AI Chatbot

1. Add Convex action for API calls
2. Create chat UI components
3. Store conversations in Convex

See `.github/copilot-instructions.md` for detailed patterns.

### Ecommerce

1. Add product schema in `convex/schema.ts`
2. Create product listing pages
3. Integrate payment provider (Stripe/Lemon Squeezy)

### Landing Page

1. Customize home page in `src/app/page.tsx`
2. Add sections (hero, features, CTA)
3. Update metadata for SEO

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 💡 Tips

- Always run `npx convex dev` during development
- Use `createMetadata()` helper for consistent SEO
- Wrap pages with `MainLayout` for consistent navigation
- Use `cn()` utility for merging Tailwind classes
- Check `.github/copilot-instructions.md` for AI coding patterns

## 🐛 Troubleshooting

### Convex not connecting

- Ensure `npx convex dev` is running
- Check `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
- Verify Convex deployment is active

### Clerk errors

- Confirm environment variables are set
- Check Clerk dashboard for correct keys
- Verify domains are whitelisted in Clerk

### Build errors

- Run `pnpm lint` to check for issues
- Clear `.next` and rebuild: `rm -rf .next && pnpm build`
- Check all imports are correct

## 📄 License

This template is MIT licensed. Use it freely for your projects!
