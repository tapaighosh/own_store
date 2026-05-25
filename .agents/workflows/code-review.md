# Workflow: Code Review

> **Trigger:** When a developer says "review [filename]" or "do a code review".

## Instructions for the Agent

You are performing a structured code review for the **Own Store** project. Follow this checklist exactly.

---

## Step 1 — Read Context First
Before reviewing, read:
- `.agents/rules/production-standards.md` (standards to enforce)
- `.ai-context/architecture.md` (system design context)

## Step 2 — Review Checklist

### TypeScript & Type Safety
- [ ] No `any` types — if present, suggest specific types
- [ ] All props explicitly typed
- [ ] Zod validation present on API routes
- [ ] Return types on all exported functions

### Security
- [ ] Admin routes check `getServerSession` before returning data
- [ ] No secrets or tokens in client-accessible code
- [ ] Image uploads validated (type + size)
- [ ] Registration lock enforced

### MongoDB / Data Layer
- [ ] `dbConnect()` called before every query
- [ ] `lean()` used on read-only queries
- [ ] No raw user input passed to MongoDB queries
- [ ] Indexes in place for queried fields

### Error Handling
- [ ] Try/catch with standard error format in API routes
- [ ] Client-side fetch errors handled
- [ ] User-facing errors use toast (not raw messages)

### Performance
- [ ] `"use client"` only where strictly necessary
- [ ] Heavy components use `dynamic()` with `{ ssr: false }`
- [ ] No redundant `useEffect` calls

### Animations
- [ ] GSAP inside `useLayoutEffect` with cleanup
- [ ] `prefers-reduced-motion` respected
- [ ] Framer Motion variants outside component

### Code Quality
- [ ] Components under 150 lines
- [ ] No `console.log` statements
- [ ] No hardcoded strings that should be env vars

---

## Step 3 — Output Format

Provide your review in this format:

```
## Code Review: [filename]

### 🔴 Critical Issues (must fix before merge)
- ...

### 🟡 Warnings (should fix)
- ...

### 🟢 Good Practices Found
- ...

### 💡 Suggestions (optional improvements)
- ...

### Verdict: PASS / FAIL / PASS WITH CHANGES
```
