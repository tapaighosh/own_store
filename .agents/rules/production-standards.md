# 🏭 Production Standards — Own Store

> These rules are **always active** for every agent session in this project. Follow them unconditionally.

---

## 🧱 Tech Stack (Non-Negotiable)

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Framework  | Next.js 16 App Router              |
| Language   | TypeScript (strict mode)           |
| Database   | MongoDB Atlas via Mongoose         |
| Auth       | NextAuth.js (credentials provider) |
| Storage    | Vercel Blob                        |
| Styling    | Tailwind CSS + shadcn/ui           |
| Animations | GSAP 3.x + Lenis + Framer Motion   |
| Deployment | Vercel (Hobby tier)                |

---

## 📐 Architectural Constraints

### App Router Rules

- All pages live under `app/` using the App Router convention
- Group routes: `(store)` for public, `(admin)` for protected
- Server Components by default — use `"use client"` only when truly needed (event handlers, hooks, animations)
- API routes live under `app/api/` using Route Handlers (not `pages/api/`)

### TypeScript Rules

- Strict mode enabled in `tsconfig.json` — no `any` types
- All MongoDB models must have a corresponding TypeScript interface in `types/`
- Use `z` (Zod) for all API request validation
- Prop types must be explicitly declared — no implicit `children: any`

### File Naming

- Components: `PascalCase.tsx`
- Utilities/helpers: `camelCase.ts`
- API routes: `route.ts` (Next.js convention)
- Mongoose models: `PascalCase.ts` in `/models`
- Types: `PascalCase.types.ts` in `/types`

---

## 🔐 Security Rules

1. **Never expose secrets** — all env vars prefixed `NEXT_PUBLIC_` are client-visible; keep tokens server-only
2. **Always validate** incoming API data with Zod before touching MongoDB
3. **Admin routes** must check NextAuth session server-side — never trust client headers alone
4. **Passwords** must be hashed with `bcryptjs` (salt rounds ≥ 12) — never store plaintext
5. **Registration lock** — after first admin is created, the `/admin/register` route must return 403
6. **Image uploads** — validate MIME type and file size (max 4MB per image) before sending to Vercel Blob

---

## 🗄️ MongoDB / Mongoose Rules

- Always use the singleton connection pattern in `lib/mongodb.ts` — never create new connections per request
- Every model must include `createdAt` timestamps (`{ timestamps: true }`)
- Use `lean()` on read queries for performance — only use full Mongoose docs when calling `.save()`
- Index frequently queried fields: `slug`, `status`, `category`, `featured`
- Never delete records permanently — use `status: "archived"` instead

---

## 🎨 Styling Rules

- Use Tailwind utilities — no custom CSS files unless for animation keyframes
- Colors come from CSS variables (`--color-primary`, `--color-accent`) injected via `theme.ts` — never hardcode hex values in components
- Dark mode NOT required for v1 — the theme system handles vendor palette choices
- `shadcn/ui` components must not be modified directly — extend via `cn()` className merging

---

## ✨ Animation Rules

- GSAP animations must be initialized inside `useLayoutEffect` (not `useEffect`) with a cleanup context
- Lenis smooth scroll is initialized once in `app/(store)/layout.tsx` — never reinitialize per component
- Respect `prefers-reduced-motion` — wrap all animations with a motion check:
  ```ts
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!prefersReduced) {
    /* animate */
  }
  ```
- Framer Motion variants must be defined outside the component to prevent re-renders

---

## 🧪 Error Handling Standards

### API Routes

```ts
// Every route handler must follow this pattern:
export async function GET(req: Request) {
  try {
    await dbConnect();
    // ... logic
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

### Client Components

- Use React Error Boundaries for page-level errors
- All `fetch` calls must handle non-ok responses explicitly
- Show user-friendly toast messages (shadcn `useToast`) — never expose raw error strings to users

### Form Submissions

- Use React Hook Form + Zod resolver for all forms
- Show inline field errors, not just toast alerts

---

## 📦 Code Organization

- Keep components under 150 lines — split into sub-components if larger
- Business logic goes in `lib/` — components only handle rendering
- Shared types go in `types/` — never inline complex types in component files
- No barrel re-exports (`index.ts`) — import directly from files to keep tree-shaking clean

---

## 🚫 Forbidden Patterns

- ❌ No `pages/` directory — App Router only
- ❌ No `getServerSideProps` or `getStaticProps`
- ❌ No inline styles (`style={{}}`) except for dynamic CSS variable injection
- ❌ No `console.log` in production code — use a structured logger or remove before commit
- ❌ No hardcoded MongoDB connection strings — always use `process.env.MONGODB_URI`
- ❌ No skipping `await dbConnect()` in route handlers

---

## 📋 Definition of Done (per module)

A module is only "done" when:

- [ ] All TypeScript errors are resolved (`tsc --noEmit` passes)
- [ ] All API routes have Zod validation
- [ ] Auth guards are in place for admin routes
- [ ] Error handling follows the standard pattern above
- [ ] Components are responsive (mobile + desktop)
- [ ] Animations respect `prefers-reduced-motion`
