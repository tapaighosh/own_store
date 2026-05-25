# CLAUDE.md — Own Store Agent Configuration

> This file configures how Claude (and compatible agents) behave in this project.
> It is read automatically at the start of every session.

---

## 🎯 Project Identity

You are working on **Own Store** — a white-label e-commerce storefront template built with Next.js 16, MongoDB, Vercel Blob, and NextAuth. Each deployment serves a single vendor.

**Always read these files at the start of a new topic:**

- `.ai-context/project_context.md` — understand what we're building and why
- `.ai-context/architecture.md` — system design, DB schemas, file structure
- `.agents/rules/production-standards.md` — coding standards you must enforce

---

## 🧠 Agent Behavior Rules

### Always Do

- ✅ Follow the production standards in `.agents/rules/production-standards.md`
- ✅ Use TypeScript strict mode — no `any` types
- ✅ Validate all API inputs with Zod
- ✅ Check `getServerSession()` in every admin route handler
- ✅ Use the singleton MongoDB connection from `lib/mongodb.ts`
- ✅ Append session activity to `.ai-context/prompt_history.md` (per auto-log.md rule)
- ✅ Explain what you're building before writing code (brief plan)
- ✅ Point out security issues immediately, even if not asked

### Never Do

- ❌ Use `any` TypeScript type
- ❌ Hardcode colors, secrets, or connection strings
- ❌ Create files in `pages/` — App Router only
- ❌ Skip `await dbConnect()` in route handlers
- ❌ Leave `console.log` in production code
- ❌ Store unhashed passwords
- ❌ Make the registration page accessible after the first admin is created

---

## 📦 Tech Stack Quick Reference

```
Next.js 16 App Router    → all routing + SSR
TypeScript (strict)      → all files
MongoDB + Mongoose       → database (lib/mongodb.ts singleton)
NextAuth.js              → auth (credentials provider)
Vercel Blob              → image storage (lib/blob.ts)
Tailwind CSS + shadcn/ui → styling (admin panel)
GSAP 3.x                 → hero animations, page transitions
Lenis                    → smooth scroll (store layout only)
Framer Motion            → product cards, modals, filters
Zod                      → API validation
React Hook Form          → all forms
Graphify                 → reporting/analytics dashboard
```

---

## 🗂️ Key File Locations

| What              | Where               |
| ----------------- | ------------------- |
| DB connection     | `lib/mongodb.ts`    |
| Auth config       | `lib/auth.ts`       |
| Blob helpers      | `lib/blob.ts`       |
| Animation configs | `lib/animations.ts` |
| Theme mapping     | `config/theme.ts`   |
| Mongoose models   | `models/`           |
| TypeScript types  | `types/`            |
| Store components  | `components/store/` |
| Admin components  | `components/admin/` |
| API routes        | `app/api/`          |

---

## 🔐 Security Mindset

Every time you write an admin API route, mentally run this checklist:

1. Is `await dbConnect()` the first line in the try block?
2. Is `const session = await getServerSession(authOptions)` checked before any DB operation?
3. Is the request body validated with Zod before being passed to Mongoose?
4. Are passwords excluded from query results (`.select("-password")`)?
5. Is `status: "archived"` used instead of hard deletion?

---

## 🎨 Animation Mindset

Every time you write an animation:

1. Is it inside `useLayoutEffect` (not `useEffect`) with a GSAP context?
2. Does it check `prefers-reduced-motion` before running?
3. Is Lenis scroll only initialized in `app/(store)/layout.tsx`?
4. Are Framer Motion variants defined outside the component?

---

## 📋 Build Phase Reference

| Phase   | Focus                                                   | Status         |
| ------- | ------------------------------------------------------- | -------------- |
| Phase 1 | Foundation (Next.js setup, DB, Auth, Blob)              | 🔲 Not Started |
| Phase 2 | Admin Panel (Settings, Products, Categories, Inventory) | 🔲 Not Started |
| Phase 3 | Storefront + Animations                                 | 🔲 Not Started |
| Phase 4 | Polish, SEO, Responsive, Deploy                         | 🔲 Not Started |

Update these statuses as phases complete.

---

## 💬 How to Communicate with Me

**For module builds:** Use the exact prompts from `README.md` → "Module Build Prompts"
**For code reviews:** "Follow .agents/workflows/code-review.md to review: [file]"
**For tests:** "Follow .agents/workflows/generate-tests.md for: [file]"
**For bugs:** Paste the error + file path + expected behavior
**For architecture questions:** Just ask — I'll reference `.ai-context/architecture.md`

---

## 🛠️ Recommended Skills (Activate These)

For best results, activate these Antigravity skills:

| Skill                   | Why                                            |
| ----------------------- | ---------------------------------------------- |
| `nextjs-best-practices` | App Router patterns, Server Components         |
| `nextjs-supabase-auth`  | NextAuth patterns (same auth principles)       |
| `database-design`       | MongoDB schema decisions                       |
| `neon-postgres`         | Connection pooling patterns (apply to MongoDB) |
| `react-patterns`        | Component architecture                         |
| `tailwind-patterns`     | Tailwind v4 + shadcn/ui patterns               |
| `animejs-animation`     | Advanced animation patterns                    |
| `security-auditor`      | Auth + API security review                     |
| `tdd-workflow`          | Test-driven development                        |
| `api-patterns`          | REST API design                                |

---

## 📌 Graphify Integration Notes

Graphify will be used for the admin dashboard analytics/reporting layer.

- Dashboard stats (total products, low stock count, category breakdown) should be designed with Graphify-compatible data shapes
- Keep analytics queries in `lib/analytics.ts` (separate from core business logic)
- Graphify integration is a Phase 2+ concern — don't block Phase 1 on it

---

_Last updated: 2026-05-24 | Version: 1.0_
