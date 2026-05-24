# 🏪 Own Store — White-Label E-Commerce Template

> A white-label storefront template. One codebase, infinite vendors. Each gets their own Vercel project, MongoDB database, and custom domain — fully isolated, zero monthly cost.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/own-store)

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Quick Start (Vendor Onboarding)](#-quick-start-vendor-onboarding)
- [Environment Variables](#-environment-variables)
- [Agent Setup](#-agent-setup)
- [Recommended Skills](#-recommended-skills)
- [Module Build Prompts](#-module-build-prompts)
  - [Phase 1 — Foundation](#phase-1--foundation)
  - [Phase 2 — Admin Panel](#phase-2--admin-panel)
  - [Phase 3 — Storefront + Animations](#phase-3--storefront--animations)
  - [Phase 4 — Polish & Deploy](#phase-4--polish--deploy)
- [Project Structure](#-project-structure)
- [Theme System](#-theme-system)
- [Animation Stack](#-animation-stack)
- [Graphify Integration](#-graphify-integration)

---

## 🛠 Tech Stack

| Layer         | Technology                     | Cost             |
| ------------- | ------------------------------ | ---------------- |
| Framework     | Next.js 16 App Router          | Free             |
| Language      | TypeScript (strict)            | Free             |
| Database      | MongoDB Atlas M0               | Free per vendor  |
| Auth          | NextAuth.js (credentials)      | Free             |
| Image Storage | Vercel Blob                    | Free per project |
| Styling       | Tailwind CSS + shadcn/ui       | Free             |
| Animations    | GSAP 3 + Lenis + Framer Motion | Free             |
| Deployment    | Vercel Hobby                   | Free per vendor  |
| Analytics     | Graphify                       | TBD              |

**Vendor total cost: Domain only (~$10–15/year)**

---

## 🚀 Quick Start (Vendor Onboarding)

1. Fork this repo for the vendor
2. Create MongoDB Atlas database (free M0 tier)
3. Deploy to Vercel (Hobby tier)
4. Attach vendor's custom domain in Vercel dashboard
5. Set environment variables (see below)
6. Share `/admin/register` link with vendor _(one-time only — locks after first admin)_
7. Vendor fills shop info, picks theme, starts adding products

---

## ⚙️ Environment Variables

```bash
# .env.local (never commit this file)

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendordb

# Auth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://vendordomain.com

# App
NEXT_PUBLIC_APP_URL=https://vendordomain.com

# Vercel Blob (auto-injected by Vercel — no manual setup needed)
BLOB_READ_WRITE_TOKEN=auto
```

Copy `.env.example` and fill in your values.

---

## 🤖 Agent Setup

This project is configured for AI-assisted development with a structured agent workspace:

```
.agents/
├── rules/
│   ├── production-standards.md   # Coding standards (always active)
│   ├── auto-log.md               # Auto-logging rule (always active)
│   └── .agentignore              # Files the agent skips
└── workflows/
    ├── code-review.md            # Trigger: "review [file]"
    └── generate-tests.md         # Trigger: "generate tests for [file]"

.ai-context/
├── project_context.md            # What & why
├── architecture.md               # System design & DB schemas
├── BRD.md                        # Business requirements
├── test_cases.md                 # Master test scenarios
├── prompt_history.md             # Auto-generated session log
└── prompts.md                    # Quick prompt reference

CLAUDE.md                         # Agent behavior configuration
```

**The agent reads `CLAUDE.md` and `.agents/rules/` automatically at session start.**

---

## 🧠 Recommended Skills

Activate these Antigravity skills for maximum agent performance:

```
nextjs-best-practices    → App Router, Server Components, RSC patterns
react-patterns           → Component architecture, hooks, performance
tailwind-patterns        → Tailwind v4, shadcn/ui, design tokens
database-design          → MongoDB schema decisions, indexing strategy
api-patterns             → REST API design, error handling, validation
animejs-animation        → GSAP + Framer Motion animation patterns
security-auditor         → Auth, API security, input validation review
tdd-workflow             → Test-driven development cycle
debugging-toolkit-smart-debug → Error diagnosis and fixing
nextjs-supabase-auth     → Auth flow patterns (applies to NextAuth too)
```

---

## 📦 Module Build Prompts

> **How to use:** Copy the prompt for the module you want to build and paste it into the agent chat.
> Run them **in order** — each phase builds on the previous.
> ✅ = Ready to run | 🔄 = In progress | ✔️ = Complete

---

## Phase 1 — Foundation

> **Goal:** Working Next.js app with DB connection, auth, and file upload. No UI yet — just infrastructure.

---

### 📌 Module 1.1 — Project Initialization

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md before starting.

Initialize the Next.js 16 project with this exact configuration:
- Framework: Next.js 16 with App Router
- Language: TypeScript with strict mode
- Styling: Tailwind CSS
- No src/ directory — use root app/ convention
- ESLint enabled

After scaffolding, install these dependencies:
  Production: mongoose, next-auth, @vercel/blob, bcryptjs, zod, react-hook-form, @hookform/resolvers
  Dev: @types/bcryptjs, @testing-library/react, @testing-library/jest-dom, jest, jest-environment-jsdom

Create tsconfig.json with strict: true and path aliases:
  @/* → ./*
  @/components/* → ./components/*
  @/lib/* → ./lib/*
  @/models/* → ./models/*
  @/types/* → ./types/*

Create the empty directory structure from .ai-context/architecture.md.

Do NOT write any component or page content yet — scaffold only.
Follow .agents/rules/production-standards.md for all file naming.
```

---

### 📌 Module 1.2 — MongoDB Connection

**Status: ✅ Ready**

```
Read CLAUDE.md, .ai-context/architecture.md (MongoDB section), and .agents/rules/production-standards.md before starting.

Create lib/mongodb.ts implementing the singleton connection pattern:
- Check if a cached connection exists on the global object
- Use process.env.MONGODB_URI (throw a clear error if missing)
- Export a dbConnect() function that returns the cached or new connection
- Add TypeScript types for the global mongoose cache

Create all four Mongoose models with exact schemas from .ai-context/architecture.md:
- models/Admin.ts — with password field excluded from default queries
- models/Product.ts — with compound indexes on slug (unique), status, category, featured
- models/Category.ts — with slug unique index
- models/ShopSettings.ts — singleton document pattern (upsert-based)

Create corresponding TypeScript interfaces in types/:
- types/Admin.types.ts
- types/Product.types.ts
- types/Category.types.ts
- types/ShopSettings.types.ts

All models must use { timestamps: true } and follow naming from .ai-context/architecture.md exactly.
Follow .agents/rules/production-standards.md for error handling.
```

---

### 📌 Module 1.3 — Authentication

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md (Authentication Flow section) before starting.

Create lib/auth.ts with NextAuth configuration:
- Credentials provider only (email + password)
- Validate against Admin model using bcryptjs.compare()
- JWT strategy with 7-day maxAge
- Session callback: include user id and email
- Exclude password from all DB queries (.select("-password"))

Create app/api/auth/[...nextauth]/route.ts exporting GET and POST handlers.

Create app/(admin)/login/page.tsx:
- Client component with React Hook Form + Zod validation
- Email + password fields with inline error messages
- Calls signIn("credentials", {...}) from next-auth/react
- Redirects to /admin/dashboard on success
- Shows error toast on failure (shadcn useToast)
- Clean, minimal UI using shadcn/ui Card + Input + Button

Create app/(admin)/register/page.tsx:
- Server component that checks Admin.countDocuments() on load
- If count > 0: immediately redirect to /admin/login with a "Setup already complete" message
- If count === 0: show registration form (name, email, password, confirm password)
- On submit: hash password with bcrypt (rounds: 12), create Admin document, redirect to login
- Form validation: email format, password min 8 chars, passwords must match

Create middleware.ts:
- Protect all /admin/* routes except /admin/login and /admin/register
- Redirect unauthenticated users to /admin/login
- Use NextAuth's withAuth middleware

Follow .agents/rules/production-standards.md security rules strictly.
```

---

### 📌 Module 1.4 — Vercel Blob Upload API

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md (Image Upload Flow section) before starting.

Create lib/blob.ts with helper functions:
- uploadToBlob(file: File, folder: string): Promise<string> — uploads and returns URL
- deleteFromBlob(url: string): Promise<void> — deletes by URL
- validateImageFile(file: File): { valid: boolean; error?: string } — checks MIME and size

Create app/api/upload/route.ts:
- POST handler only
- Check authentication (getServerSession) — return 401 if not authenticated
- Parse FormData, extract file
- Validate: MIME type must start with "image/", size must be ≤ 4MB (4 * 1024 * 1024 bytes)
- Upload to Vercel Blob using put() from @vercel/blob
- Return { url: string } on success
- Return { error: string } with appropriate status on failure
- Follow the standard try/catch error pattern from production-standards.md

Write a .env.example file documenting all required environment variables.
Follow .agents/rules/production-standards.md for error handling patterns.
```

---

## Phase 2 — Admin Panel

> **Goal:** Fully functional admin panel with CRUD for products, categories, inventory, and shop settings.
> **Prerequisite:** Phase 1 complete.

---

### 📌 Module 2.1 — Admin Layout & Sidebar

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md before starting.

Install shadcn/ui: run "npx shadcn@latest init" with default settings, then add:
  npx shadcn@latest add button card input label textarea select toast badge table dialog sheet

Create app/(admin)/layout.tsx:
- Server component
- Check session with getServerSession — redirect to /admin/login if missing
- Render Sidebar + main content area
- Clean two-column layout (fixed sidebar, scrollable main)

Create components/admin/Sidebar.tsx:
- Shows shop name from settings (or "Own Store" as fallback)
- Navigation links: Dashboard, Products, Categories, Inventory, Settings
- Active link highlighting using usePathname()
- Logout button using signOut() from next-auth/react
- shadcn/ui components for styling
- Responsive: collapsible on mobile using Sheet component

Create app/(admin)/dashboard/page.tsx:
- Server component — fetch stats server-side
- Show stat cards: Total Products, Active Products, Low Stock Items, Total Categories
- Low stock alert section: list products where stock ≤ lowStockThreshold
- Category breakdown: count per category
- Design: shadcn/ui Card components, clean grid layout
- Data shapes must be Graphify-compatible (document the shape in a comment)

Follow .agents/rules/production-standards.md for all patterns.
```

---

### 📌 Module 2.2 — Shop Settings

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md (ShopSettings schema) before starting.

Create app/api/settings/route.ts:
- GET: return shop settings document (or sensible defaults if none exists)
- PUT: validate request body with Zod (all ShopSettings fields), upsert document
- Both routes require authentication
- Standard error handling pattern

Create a Zod schema in types/ShopSettings.types.ts for validation.

Create app/(admin)/settings/page.tsx:
- Client component with React Hook Form + Zod
- Sections: Basic Info (name, logo), Theme (color, accent, font), Hero, Footer, SEO
- Logo upload: use ImageUploader component (create it here)
- Color picker: radio group of 5 neutral colors with visual swatches
- Accent picker: radio group of 4 accent colors with swatches
- Font selector: dropdown with live font preview
- Hero background image: upload via Vercel Blob
- Save button with loading state + success toast

Create components/admin/ImageUploader.tsx:
- Accepts: currentUrl?, onUpload: (url: string) => void, label
- Drag-and-drop zone + click to browse
- Shows current image preview if URL exists
- On file select: validates type/size client-side, then calls /api/upload
- Shows upload progress indicator
- Shows error if upload fails

Follow .agents/rules/production-standards.md for error handling.
```

---

### 📌 Module 2.3 — Product CRUD

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md (products schema and API routes) before starting.

Create app/api/products/route.ts:
- GET: return all non-archived products, populated with category name, sorted by createdAt desc
- POST: validate body with Zod, auto-generate slug from name (use slugify pattern), create product
- Both routes require authentication
- Include Zod schema: name (required), price (positive number), category (valid ObjectId), images (array max 4), stock (non-negative), status, featured, lowStockThreshold

Create app/api/products/[id]/route.ts:
- GET: return single product by ID, populate category
- PUT: validate body with Zod (partial update), update and return updated doc
- DELETE: set status to "archived" (never hard delete) — require authentication

Create app/(admin)/products/page.tsx:
- Server component — list all products with table view
- Columns: Image (first), Name, Category, Price, Stock, Status badge, Actions (Edit, Archive)
- Status badge colors: active=green, draft=yellow, archived=gray
- Low stock warning indicator (⚠️ icon) when stock ≤ lowStockThreshold
- Link to add new product

Create app/(admin)/products/new/page.tsx and app/(admin)/products/[id]/edit/page.tsx:
- Share the same ProductForm component
- Edit page pre-fills form with existing product data

Create components/admin/ProductForm.tsx:
- React Hook Form + Zod
- Fields: name, description, price, category (select from fetched categories), images (ImageUploader ×4 max), stock, lowStockThreshold, status, featured (checkbox)
- Auto-generate slug preview from name as user types
- Save/Update button with loading state
- Cancel button

Follow .agents/rules/production-standards.md strictly.
```

---

### 📌 Module 2.4 — Category Management

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Create app/api/categories/route.ts:
- GET: return all categories sorted by name
- POST: validate with Zod (name required), auto-generate slug, create category
- Authentication required

Create app/api/categories/[id]/route.ts:
- PUT: update name/description, regenerate slug if name changed
- DELETE: check if any products reference this category — if yes, return 400 with "Category has products" message; if no, hard delete is OK

Create app/(admin)/categories/page.tsx:
- List all categories with name, slug, description, product count, created date
- Inline add form at top (name + description)
- Edit: open a shadcn Dialog with pre-filled form
- Delete: confirmation dialog before deleting
- Show "has products" warning if category cannot be deleted

Zod schema: name (min 2 chars), description (optional, max 200 chars)
Follow .agents/rules/production-standards.md.
```

---

### 📌 Module 2.5 — Inventory Management

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Create app/api/inventory/route.ts:
- GET: return all non-archived products with only inventory-relevant fields: id, name, stock, lowStockThreshold, status
- PUT (bulk update): accept array of { id, stock, lowStockThreshold } objects, validate each, update in a Promise.all
- Authentication required

Create app/(admin)/inventory/page.tsx:
- Table view: Product Name, Current Stock, Low Stock Threshold, Status badge, Quick Edit
- Highlight rows where stock ≤ lowStockThreshold in amber/yellow
- Highlight rows where stock === 0 in red
- Inline editing: clicking stock count opens an input field (no modal needed)
- "Save All Changes" button that bulk-updates via PUT /api/inventory
- Filter by status (All / Low Stock / Out of Stock)

Create components/admin/StockManager.tsx:
- Reusable inline stock editor
- Optimistic UI: update display immediately, revert on API error
- Shows low stock warning icon

Follow .agents/rules/production-standards.md.
```

---

## Phase 3 — Storefront + Animations

> **Goal:** Beautiful, animated public storefront loaded from database content.
> **Prerequisite:** Phase 2 complete, shop settings saved in DB.

---

### 📌 Module 3.1 — Store Layout & Theme Loading

**Status: ✅ Ready**

```
Read CLAUDE.md, .ai-context/architecture.md (Theme System section), and .agents/rules/production-standards.md before starting.

Create config/theme.ts:
- Export colorMap: maps primaryColor values to Tailwind color objects (50-950 shades)
- Export accentMap: maps accentColor values to specific hex values
- Export fontMap: maps font names to next/font imports

Create app/(store)/layout.tsx:
- Server component
- Fetch shop_settings from DB (call dbConnect + ShopSettings.findOne())
- Generate CSS custom properties from settings using theme.ts maps:
  --color-primary, --color-accent, --font-sans
- Inject via <style> tag with dangerouslySetInnerHTML (safe — server-generated values only)
- Initialize Lenis smooth scroll in a client component wrapper
- Set dynamic <title> and meta tags from shop SEO settings

Create a client component LenisProvider.tsx:
- Initializes Lenis on mount, destroys on unmount
- Wraps children — used in store layout only
- Checks prefers-reduced-motion: skip Lenis if user prefers reduced motion

Create lib/animations.ts:
- Export GSAP ease presets used across the project
- Export Framer Motion variant objects (fadeUp, fadeIn, staggerContainer)
- Export a motionCheck() helper that returns boolean for prefers-reduced-motion

Follow .agents/rules/production-standards.md animation rules.
```

---

### 📌 Module 3.2 — Homepage

**Status: ✅ Ready**

```
Read CLAUDE.md and .ai-context/architecture.md before starting.

Create app/(store)/page.tsx:
- Server component
- Fetch in parallel: shop settings (for hero/footer data) + featured products (status: active, featured: true, limit 8)
- Pass data to child components as props

Create components/store/Hero.tsx:
- "use client" — needs GSAP
- Props: headline, subheadline, backgroundImage (optional)
- Background: full-screen with overlay, backgroundImage from settings or a solid gradient
- GSAP animation inside useLayoutEffect with context cleanup:
  - Split headline by words, stagger reveal: duration 0.8s, ease "power2.out"
  - Subheadline fades in after headline: delay 0.4s
  - CTA button fades up: delay 0.6s
- CTA button: "Browse Products" → links to /products
- Check prefers-reduced-motion: skip animations if true
- Fully responsive: min-height 100vh on desktop, 80vh on mobile

Create components/store/ProductGrid.tsx:
- "use client" — needs Framer Motion
- Props: products array, title (optional)
- Responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop
- Framer Motion: viewport-triggered stagger (0.1s between cards)
- Shows EmptyState if no products

Create components/store/ProductCard.tsx:
- "use client" — hover animation
- Props: product (name, slug, price, images, stock, lowStockThreshold)
- Shows first image, name, price, StockBadge
- Hover effect: scale(1.02) + box-shadow (no bounce — use ease: "power2.out")
- Links to /products/[slug]
- Framer Motion fadeUp variant on enter

Create components/store/StockBadge.tsx:
- Pure presentation component (no "use client" needed)
- Logic: stock > lowStockThreshold → "In Stock" (green), stock > 0 → "Low Stock ({n} left)" (amber), stock === 0 → "Out of Stock" (red)

Follow .agents/rules/production-standards.md animation rules for ALL animation code.
```

---

### 📌 Module 3.3 — Navbar & Footer

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Create components/store/Navbar.tsx:
- "use client" — needs GSAP ScrollTrigger + usePathname
- Props: shopName, logo (optional)
- Fixed position, full width, blurred background (backdrop-blur)
- GSAP ScrollTrigger: hide navbar on scroll down 100px, reveal on scroll up
  - Use CSS transform translateY(-100%) with smooth transition
  - Check prefers-reduced-motion: always visible if reduced motion
- Navigation links: Home, Products, Contact
- Active link underline animation with Framer Motion layoutId
- Mobile: hamburger menu using shadcn Sheet component

Create components/store/Footer.tsx:
- Server Component (no interactivity needed)
- Props: footer data from shop_settings (description, email, phone, address, socialLinks)
- Sections: Brand (logo + description), Contact info, Social links
- Social links: only render icons that have a value set
- Year auto-updated with new Date().getFullYear()
- Responsive: stacked on mobile, 3 columns on desktop

Follow .agents/rules/production-standards.md animation rules.
```

---

### 📌 Module 3.4 — Products Page

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Create app/(store)/products/page.tsx:
- Server component
- Accept searchParams: { category?, search?, sort?, page? }
- Build MongoDB query from searchParams: status "active" only
- Fetch matching products + all categories (for filter UI)
- Pass to client ProductsClient component

Create a client wrapper ProductsClient.tsx (in components/store/):
- Manages filter/sort/search state
- Updates URL searchParams using useRouter + useSearchParams (no page reload)
- Category filter: pill/chip buttons, multi-select
- Search: debounced input (300ms), updates URL
- Sort: dropdown (Newest, Price: Low to High, Price: High to Low, Name A-Z)
- Shows active filter count badge
- Framer Motion: filter panel slide-down animation

On the page: render ProductGrid with filtered results + pagination
Pagination: simple prev/next, 12 products per page

Follow .agents/rules/production-standards.md.
```

---

### 📌 Module 3.5 — Single Product Page

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Create app/(store)/products/[slug]/page.tsx:
- Server component
- Fetch product by slug (status: active only — 404 if not found or archived)
- Fetch related products: same category, limit 4, exclude current
- Generate metadata from product data (title, description, OG image)
- Use generateStaticParams() for static generation of known slugs

Create an image gallery client component ProductGallery.tsx:
- Props: images array (up to 4)
- Main large image + thumbnail strip
- Click thumbnail to switch main image with crossfade animation (Framer Motion AnimatePresence)
- Keyboard accessible

The product detail page layout:
- Left: ProductGallery
- Right: slides in from right on load (Framer Motion, x: 20 → 0)
  - Product name, price (formatted as currency)
  - StockBadge
  - Description
  - Category name (linked to /products?category=...)
- Below: Related Products section with ProductGrid

Generate 404 page: app/(store)/not-found.tsx with navigation back to store.

Follow .agents/rules/production-standards.md animation rules.
```

---

### 📌 Module 3.6 — Contact Page

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Create app/(store)/contact/page.tsx:
- Server component
- Fetch shop_settings for contact info
- Display: shop name, email, phone, address
- Social links with icons (use lucide-react for icons)
- Map placeholder (static address display — no Google Maps API needed in v1)
- SEO metadata from shop settings

Design: clean, centered layout with icon + text pairs.
No form in v1 — just display contact information.
```

---

## Phase 4 — Polish & Deploy

> **Goal:** Production-ready: SEO, accessibility, performance, mobile, and deploy.
> **Prerequisite:** Phases 1-3 complete.

---

### 📌 Module 4.1 — SEO & Metadata

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Update all store pages with dynamic metadata using Next.js generateMetadata():

For app/(store)/layout.tsx:
- Default metadata from shop_settings: title, description, OG image (hero background)
- Canonical URL from NEXT_PUBLIC_APP_URL

For app/(store)/products/[slug]/page.tsx:
- Title: "{product name} | {shopName}"
- Description: first 160 chars of product description
- OG image: first product image
- Product schema markup (JSON-LD): name, price, availability, image

Create app/robots.txt/route.ts:
- Allow all crawlers
- Sitemap URL pointing to /sitemap.xml

Create app/sitemap.xml/route.ts:
- Include: homepage, /products, /contact
- Include all active product pages dynamically (fetch slugs from DB)
- Set lastmod to product's updatedAt

Create app/(store)/not-found.tsx:
- Branded 404 page with shop name
- Link back to homepage and products
```

---

### 📌 Module 4.2 — Mobile Responsiveness Audit

**Status: ✅ Ready**

```
Read CLAUDE.md before starting.

Audit and fix responsiveness for ALL components. Go through each file:

1. Hero: min-h-100vh desktop, min-h-80vh mobile; text sizes fluid (clamp or responsive classes)
2. ProductGrid: 1→2→3→4 column breakpoints
3. ProductCard: touch-friendly (min 44px tap targets)
4. Navbar: mobile menu via Sheet, hamburger icon
5. Sidebar (admin): collapsible on mobile via Sheet
6. ProductForm (admin): single column on mobile
7. Inventory table: horizontal scroll on mobile
8. All forms: full width inputs on mobile

For each animation, verify prefers-reduced-motion is respected:
- Grep all useLayoutEffect and useEffect blocks
- Ensure each animation checks: window.matchMedia("(prefers-reduced-motion: reduce)").matches

Run a Lighthouse audit simulation:
- Check for missing alt attributes on all images
- Check for missing ARIA labels on icon buttons
- Check heading hierarchy (one h1 per page)
- Check color contrast meets WCAG AA

Report issues found and fix them.
```

---

### 📌 Module 4.3 — .env.example & Documentation

**Status: ✅ Ready**

```
Create .env.example with all required variables documented:

# ===========================================
# OWN STORE — ENVIRONMENT VARIABLES EXAMPLE
# Copy this file to .env.local and fill values
# ===========================================

# --- Database ---
# Get from MongoDB Atlas → Connect → Drivers
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DBNAME?retryWrites=true&w=majority

# --- Authentication ---
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-32-char-secret-here
# Your production domain (no trailing slash)
NEXTAUTH_URL=https://yourdomain.com

# --- App ---
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# --- Vercel Blob ---
# Auto-injected by Vercel — no action needed locally
# For local dev: get from Vercel dashboard → Storage → Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxx

Then update this README's Quick Start section with exact steps.
Create docs/VENDOR_ONBOARDING.md with step-by-step guide for non-technical vendors.
```

---

### 📌 Module 4.4 — Final QA & Deploy Checklist

**Status: ✅ Ready**

```
Run the final QA checklist against the entire codebase:

TypeScript:
- Run: npx tsc --noEmit
- Fix ALL type errors before proceeding

Security:
- All admin API routes have getServerSession() check
- Registration page has countDocuments() guard
- No .env values in client-accessible code (NEXT_PUBLIC_ prefix only for safe values)
- Passwords never returned from API (`.select("-password")` everywhere)

Error Handling:
- Every API route follows the try/catch pattern from production-standards.md
- All client-side fetch calls handle non-ok responses
- Error states shown to users with toast messages

Performance:
- All GSAP animations have useLayoutEffect + cleanup
- "use client" only where strictly needed
- Images use Next.js <Image> component throughout
- Heavy client components use dynamic() import

Animations:
- prefers-reduced-motion respected everywhere
- Lenis initialized only in store layout, not admin

Generate a final report listing:
1. Any remaining TypeScript errors
2. Any security concerns
3. Any missing error handling
4. Performance recommendations
5. Deployment readiness: PASS or NEEDS FIXES
```

---

## 📁 Project Structure

```
/
├── app/
│   ├── (store)/          # Public storefront
│   │   ├── layout.tsx    # Theme + Lenis
│   │   ├── page.tsx      # Homepage
│   │   ├── products/     # All products + [slug]
│   │   └── contact/      # Contact page
│   ├── (admin)/          # Protected admin
│   │   ├── login/
│   │   ├── register/     # One-time only
│   │   ├── dashboard/
│   │   ├── products/     # CRUD
│   │   ├── categories/
│   │   ├── inventory/
│   │   └── settings/
│   └── api/              # Route Handlers
├── components/
│   ├── store/            # Public components
│   └── admin/            # Admin components
├── lib/                  # Utilities
├── models/               # Mongoose models
├── types/                # TypeScript interfaces
├── config/               # Theme mapping
├── tests/                # Jest tests
├── .agents/              # Agent control plane
└── .ai-context/          # AI knowledge base
```

---

## 🎨 Theme System

Vendor picks during registration, changeable in settings:

| Setting       | Options                                                  |
| ------------- | -------------------------------------------------------- |
| Primary Color | `slate` \| `stone` \| `zinc` \| `neutral` \| `warm-gray` |
| Accent Color  | `rose` \| `amber` \| `sky` \| `emerald`                  |
| Font          | `Inter` \| `Geist` \| `Nunito` \| `Lato`                 |

CSS variables injected at root: `--color-primary`, `--color-accent`, `--font-sans`

---

## ✨ Animation Stack

| Library       | Version | Use Case                                          |
| ------------- | ------- | ------------------------------------------------- |
| GSAP 3.x      | Latest  | Hero text reveal, page transitions, navbar scroll |
| Lenis         | Latest  | Smooth scroll (store only)                        |
| Framer Motion | Latest  | Product cards, modals, filter transitions         |

**All animations respect `prefers-reduced-motion`.**

---

## 📊 Graphify Integration

Graphify is used for the admin dashboard analytics layer.

- Dashboard stat cards are Graphify-compatible data shapes
- Analytics queries are isolated in `lib/analytics.ts`
- Chart components live in `components/admin/charts/`
- Integration guide: `docs/GRAPHIFY_SETUP.md` _(to be created in Phase 2)_

---

## 🔑 Key Decisions

| Decision   | Choice                       | Reason                       |
| ---------- | ---------------------------- | ---------------------------- |
| Images     | Vercel Blob                  | Free, fast, no vendor signup |
| Auth       | NextAuth credentials         | Simple, no third-party cost  |
| Styling    | Tailwind + shadcn/ui         | Fast, consistent, free       |
| Animation  | GSAP + Lenis + Framer Motion | Minimal elegant feel         |
| DB         | MongoDB Atlas M0             | Free per vendor              |
| Deployment | Vercel Hobby                 | Free per vendor              |
| Analytics  | Graphify                     | Dashboard reporting          |

---

_Built with ❤️ — Vendor total cost: domain only (~$10–15/year)_
