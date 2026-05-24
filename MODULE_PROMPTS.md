# 🏪 Own Store — Step-by-Step Module Prompts

> **How to use this file:**
> Run each prompt one at a time, in order. After each prompt completes, **read
> the generated code**, ask questions, and verify the output before moving to the next.
>
> Each section tells you:
>
> - 🏗️ **What it does** — the goal of this step
> - 🧠 **What you'll learn** — concepts and patterns
> - 📄 **Files involved** — what gets created or changed
> - ✅ **How to verify** — how to confirm it worked
> - 💬 **The prompt** — exactly what to paste

---

## Before You Start — How to Give Context

Every time you start a **new conversation**, paste this at the top:

```
I'm building Own Store — a white-label e-commerce storefront template.

Tech stack:
- Framework: Next.js 16 (App Router), TypeScript strict mode
- Database: MongoDB Atlas (Mongoose)
- Auth: NextAuth.js (credentials provider)
- Storage: Vercel Blob (product images)
- Styling: Tailwind CSS + shadcn/ui
- Animations: GSAP 3.x + Lenis + Framer Motion
- Deployment: Vercel Hobby (free per vendor)
- Analytics: Graphify (admin dashboard)

Refer to these files for context:
- .ai-context/project_context.md — what we're building and why
- .ai-context/architecture.md — DB schema, API routes, theme system
- .ai-context/test_cases.md — test scenarios
- .agents/rules/production-standards.md — coding standards (always follow)

One codebase, one vendor per deployment. No multi-tenancy.
```

---

## Module 0 — Project Setup & Scaffolding

### 🏗️ What it does

Initializes the Next.js 16 project, installs all dependencies, sets up TypeScript strict mode, configures Tailwind CSS, creates the full directory structure, and wires up the base layout.

### 🧠 What you'll learn

- Next.js 16 App Router project structure with route groups `(store)` and `(admin)`
- TypeScript strict mode configuration with path aliases
- Tailwind CSS configuration with shadcn/ui
- Base layout with font loading via `next/font`
- Environment variable validation with Zod

### 📄 Files involved

- `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- `app/layout.tsx` — root layout
- `app/(store)/layout.tsx` — store group layout stub
- `app/(admin)/layout.tsx` — admin group layout stub
- `middleware.ts` — auth protection stub
- `lib/mongodb.ts` — MongoDB singleton connection
- `lib/auth.ts` — NextAuth config stub
- `lib/blob.ts` — Vercel Blob helpers stub
- `lib/animations.ts` — shared GSAP / Framer config
- `config/theme.ts` — color + font mapping
- `models/` — all 4 Mongoose model stubs
- `types/` — all 4 TypeScript interface files
- `components/ui/` — base shadcn/ui component stubs
- `.env.example`

### ✅ How to verify

```bash
npm run dev
# Open http://localhost:3000 — should load without errors
# Check terminal — no TypeScript errors (npx tsc --noEmit)
# Folder structure matches .ai-context/architecture.md exactly
```

### 💬 The Prompt

```
Implement Module 0 — Project Setup & Scaffolding for Own Store.

Read .ai-context/architecture.md and .agents/rules/production-standards.md before starting.

1. Initialize Next.js 16 with App Router:
   - TypeScript strict mode enabled (strict: true in tsconfig.json)
   - Tailwind CSS configured
   - ESLint enabled
   - Path aliases: @/* → ./*  (and @/components/*, @/lib/*, @/models/*, @/types/*)
   - No src/ directory — use root app/ convention

2. Install all production dependencies:
   mongoose, next-auth, @vercel/blob, bcryptjs, zod,
   react-hook-form, @hookform/resolvers, slugify, lucide-react

   Install all dev dependencies:
   @types/bcryptjs, @testing-library/react, @testing-library/jest-dom,
   jest, jest-environment-jsdom, ts-jest

3. Initialize shadcn/ui (npx shadcn@latest init with New York style, zinc base color).
   Then add these components:
   button, card, input, label, textarea, select, toast, badge, table,
   dialog, sheet, separator, dropdown-menu, avatar

4. Create the full directory structure from .ai-context/architecture.md:
   app/(store)/, app/(admin)/, app/api/, components/store/, components/admin/,
   lib/, models/, types/, config/, tests/
   Create empty .gitkeep files so directories exist in git.

5. Create lib/mongodb.ts — singleton connection pattern:
   - Check global cache before creating new connection
   - Throw clear error if MONGODB_URI is missing
   - Export dbConnect() function

6. Create all 4 Mongoose model stubs (schema-only, no methods yet):
   - models/Admin.ts — name, email, password, createdAt
   - models/Product.ts — all fields from .ai-context/architecture.md, full indexes
   - models/Category.ts — name, slug (unique), description, createdAt
   - models/ShopSettings.ts — full schema from .ai-context/architecture.md
   All use { timestamps: true }

7. Create TypeScript interfaces in types/:
   - types/Admin.types.ts
   - types/Product.types.ts
   - types/Category.types.ts
   - types/ShopSettings.types.ts

8. Create config/theme.ts:
   - colorMap: maps "slate"|"stone"|"zinc"|"neutral"|"warm-gray" to Tailwind shade objects
   - accentMap: maps "rose"|"amber"|"sky"|"emerald" to primary hex values
   - fontMap: maps "Inter"|"Geist"|"Nunito"|"Lato" to next/font config

9. Create lib/animations.ts:
   - GSAP ease presets (ease strings used in the project)
   - Framer Motion variant objects: fadeUp, fadeIn, staggerContainer
   - motionCheck() helper: returns true if user prefers reduced motion

10. Create .env.example with all variables documented (see .ai-context/architecture.md)

11. Create app/layout.tsx with Inter as default font and dark background

Explain each file created and why the structure is organized this way.
```

---

## Module 1 — MongoDB Models & Authentication

### 🏗️ What it does

Completes all Mongoose models with full validation, sets up NextAuth with credentials provider, creates the login page, and implements the registration page with a one-time lock.

### 🧠 What you'll learn

- Mongoose schema with validators, virtual fields, and indexes
- bcryptjs password hashing (salt rounds 12)
- NextAuth.js credentials provider + JWT session strategy
- Registration lock pattern (countDocuments guard)
- Next.js middleware for route protection

### 📄 Files involved

- `models/Admin.ts` — complete with pre-save hook for password hashing
- `models/Product.ts` — complete with compound indexes
- `models/ShopSettings.ts` — with upsert-based singleton helper
- `lib/auth.ts` — complete NextAuth config
- `app/api/auth/[...nextauth]/route.ts`
- `middleware.ts` — protects all /admin/\* routes
- `app/(admin)/login/page.tsx`
- `app/(admin)/register/page.tsx`

### ✅ How to verify

```bash
npm run dev
# Visit /admin/register — should show registration form
# Register an admin — redirects to /admin/login
# Visit /admin/register again — should redirect to /admin/login (locked)
# Login with registered credentials — redirects to /admin/dashboard
# Visit /admin/dashboard without session — redirects to /admin/login
```

### 💬 The Prompt

```
Implement Module 1 — MongoDB Models & Authentication for Own Store.

Read .ai-context/architecture.md (all schema sections + auth flow) and
.agents/rules/production-standards.md (security rules) before starting.

1. Complete models/Admin.ts:
   - Fields: name (required), email (required, unique, lowercase), password (required)
   - Pre-save hook: hash password with bcryptjs (rounds: 12) only if modified
   - Method: comparePassword(candidate) → boolean
   - Never return password field by default (.select("-password") on all queries)

2. Complete models/Product.ts:
   - All fields from .ai-context/architecture.md exactly
   - Compound index: { slug: 1 } unique, { status: 1 }, { category: 1 }, { featured: 1 }
   - Virtual: isLowStock (stock > 0 && stock <= lowStockThreshold)
   - Default values: status "draft", featured false, lowStockThreshold 5, stock 0

3. Complete models/ShopSettings.ts:
   - All fields from .ai-context/architecture.md
   - Export getOrCreateSettings() helper: ShopSettings.findOneAndUpdate({},
     { $setOnInsert: defaults }, { upsert: true, new: true })

4. Complete lib/auth.ts:
   - Credentials provider: validate email + password against Admin model
   - On success: return { id, name, email } (never include password)
   - JWT strategy, session maxAge: 7 days
   - Session callback: include user.id in session.user
   - Export authOptions for use in route handlers + getServerSession()

5. Create app/api/auth/[...nextauth]/route.ts:
   - Export GET and POST handlers using NextAuth(authOptions)

6. Create middleware.ts:
   - Protect all /admin/* routes using NextAuth withAuth
   - Exceptions: /admin/login and /admin/register bypass auth check
   - Redirect unauthenticated users to /admin/login

7. Create app/(admin)/login/page.tsx:
   - "use client" component
   - React Hook Form + Zod: email (valid format) + password (required)
   - On submit: signIn("credentials", { email, password, redirect: false })
   - Success → router.push("/admin/dashboard")
   - Error → toast with "Invalid email or password" (shadcn useToast)
   - Clean shadcn/ui Card layout, centered, branded

8. Create app/(admin)/register/page.tsx:
   - Server Component: check Admin.countDocuments() on load
   - If count > 0 → redirect("/admin/login") with message "Setup complete"
   - If count === 0 → render registration form
   - Form fields: Full Name, Email, Password (min 8), Confirm Password
   - On submit: hash password (bcrypt rounds 12), create Admin, redirect to login
   - Form submits to a Server Action (no API route needed for this)

Follow .agents/rules/production-standards.md security rules strictly.
Explain the registration lock mechanism and why it uses countDocuments.
```

---

## Module 2 — Vercel Blob Upload & Image Pipeline

### 🏗️ What it does

Creates the image upload API route with full validation, builds the reusable `ImageUploader` component, and establishes the image pipeline that all other modules depend on.

### 🧠 What you'll learn

- Vercel Blob SDK (`put`, `del`)
- FormData handling in Next.js Route Handlers
- Client-side MIME type and file size validation
- Drag-and-drop file upload UI pattern
- Optimistic preview before actual upload

### 📄 Files involved

- `lib/blob.ts` — upload, delete, validate helpers
- `app/api/upload/route.ts` — Vercel Blob handler
- `components/admin/ImageUploader.tsx` — reusable drag-drop uploader

### ✅ How to verify

```bash
npm run dev
# Navigate to /admin/settings (shell page from Module 3)
# Upload a valid image — should return a Vercel Blob URL
# Try uploading a .pdf — should show "Images only" error
# Try uploading > 4MB — should show "File too large" error
# Check Vercel Blob dashboard — uploaded file visible
```

### 💬 The Prompt

```
Implement Module 2 — Vercel Blob Upload & Image Pipeline for Own Store.

Read .ai-context/architecture.md (Image Upload Flow section) and
.agents/rules/production-standards.md before starting.

1. Complete lib/blob.ts with three helpers:
   - uploadToBlob(file: File | Buffer, filename: string, folder: string): Promise<string>
     → Calls put() from @vercel/blob, returns the blob URL
     → folder param segments the blob path: e.g. "products/img.jpg"
   - deleteFromBlob(url: string): Promise<void>
     → Calls del() from @vercel/blob, handles 404 gracefully
   - validateImageFile(file: File): { valid: boolean; error?: string }
     → MIME type must start with "image/"
     → File size must be ≤ 4MB (4 * 1024 * 1024 bytes)
     → Return descriptive error message for each failure

2. Create app/api/upload/route.ts (POST only):
   - Check authentication with getServerSession(authOptions) → 401 if missing
   - Parse FormData, extract field named "file"
   - Call validateImageFile() → return 400 with { error } if invalid
   - Upload to Vercel Blob via uploadToBlob(), folder = "products"
   - Return { url: string } on success
   - Follow the standard try/catch error pattern from production-standards.md

3. Create components/admin/ImageUploader.tsx ("use client"):
   - Props:
     currentUrl?: string       (shows existing image)
     onUpload: (url: string) => void
     label?: string
     disabled?: boolean
   - UI:
     * Dashed border drop zone with icon + "Click or drag to upload" text
     * If currentUrl: show preview image + "Replace" button overlay
     * While uploading: show spinner + "Uploading..." text
     * On error: show error message in red below the zone
   - Behavior:
     * Accept: input accept="image/*"
     * Client-side validate before sending (type + size check)
     * POST to /api/upload via fetch with FormData
     * On success: call onUpload(url) + show preview
   - Styled with shadcn/ui, Tailwind, accessible (keyboard + screen reader)

Explain the folder segmentation strategy in Vercel Blob and why we validate
both client-side AND server-side.
```

---

## Module 3 — Shop Settings

### 🏗️ What it does

Creates the shop settings API and the full settings page where the vendor customizes their store: name, logo, theme colors, fonts, hero content, footer details, and SEO metadata.

### 🧠 What you'll learn

- Upsert pattern for singleton MongoDB documents
- React Hook Form with complex nested objects
- Live theme preview using CSS variables
- Zod validation for enum fields

### 📄 Files involved

- `lib/validators/settings.ts` — Zod schema
- `app/api/settings/route.ts` — GET + PUT handlers
- `app/(admin)/settings/page.tsx` — full settings form
- `components/admin/Sidebar.tsx` — admin navigation

### ✅ How to verify

```bash
npm run dev
# Visit /admin/settings
# Fill in shop name, pick a theme color, pick a font
# Save — toast shows "Settings saved"
# Refresh — form pre-filled with saved values
# Visit /admin/settings with bad enum value via API — should return 400
```

### 💬 The Prompt

```
Implement Module 3 — Shop Settings for Own Store.

Read .ai-context/architecture.md (ShopSettings schema + API routes) and
.agents/rules/production-standards.md before starting.

1. Create lib/validators/settings.ts — Zod schema for ShopSettings:
   - shopName: string min 1 max 60
   - logo: string url optional
   - primaryColor: z.enum(["slate","stone","zinc","neutral","warm-gray"])
   - accentColor: z.enum(["rose","amber","sky","emerald"])
   - font: z.enum(["Inter","Geist","Nunito","Lato"])
   - hero.headline: string min 1 max 80
   - hero.subheadline: string max 160 optional
   - hero.backgroundImage: string url optional
   - footer: { description, email, phone, address } all optional strings
   - footer.socialLinks: { instagram, facebook, twitter } all optional valid URLs
   - seo: { metaTitle max 60, metaDescription max 160 } both optional

2. Create app/api/settings/route.ts:
   - GET: dbConnect → ShopSettings.findOne() or getOrCreateSettings() →
     return document (never expose internal _id in response, use lean())
   - PUT: getServerSession guard → validate body with Zod settingsSchema →
     ShopSettings.findOneAndUpdate({}, update, { upsert: true, new: true }) →
     return updated document
   - Standard try/catch error pattern

3. Create app/(admin)/layout.tsx:
   - Server component
   - getServerSession check → redirect to /admin/login if no session
   - Renders <Sidebar /> + {children} in a two-column layout
   - Sidebar fixed on desktop, Sheet (drawer) on mobile

4. Create components/admin/Sidebar.tsx ("use client"):
   - Fetch shop name from /api/settings on mount (or default "Own Store")
   - Nav links with icons (lucide-react):
     * LayoutDashboard → /admin/dashboard
     * Package → /admin/products
     * Tag → /admin/categories
     * BarChart2 → /admin/inventory
     * Settings → /admin/settings
   - Active link: highlighted with accent color using usePathname()
   - Bottom: LogOut button → signOut() → redirects to /admin/login
   - Mobile: hamburger icon triggers Sheet component

5. Create app/(admin)/settings/page.tsx ("use client"):
   - React Hook Form + Zod resolver
   - On mount: fetch GET /api/settings and reset() form with values
   - Sections (use shadcn Separator between each):
     a. Basic Info: shopName (text input), logo (ImageUploader component)
     b. Theme: primaryColor (5 color swatches as radio buttons with visual preview),
        accentColor (4 swatches), font (dropdown with font name as option text)
     c. Hero: headline, subheadline, backgroundImage (ImageUploader)
     d. Footer: description, email, phone, address, socialLinks (instagram, facebook, twitter)
     e. SEO: metaTitle, metaDescription with character counters
   - Save button with loading spinner, success toast on save
   - Show inline field-level errors for validation failures

Explain the upsert singleton pattern and why it's used for ShopSettings.
```

---

## Module 4 — Product CRUD

### 🏗️ What it does

Full product management: create, read, update, and archive products. Includes auto-generated slugs, multi-image uploads (up to 4), category linking, stock configuration, and a product list table in the admin panel.

### 🧠 What you'll learn

- Mongoose populate() for related documents
- Slug auto-generation with uniqueness checking
- Partial Zod validation for PATCH (update) routes
- React Hook Form with nested arrays (image URLs)
- SWR-based optimistic UI

### 📄 Files involved

- `lib/validators/product.ts` — Zod schemas (create + update)
- `app/api/products/route.ts` — GET all, POST
- `app/api/products/[id]/route.ts` — GET one, PUT, DELETE (archive)
- `app/(admin)/products/page.tsx` — product list table
- `app/(admin)/products/new/page.tsx`
- `app/(admin)/products/[id]/edit/page.tsx`
- `components/admin/ProductForm.tsx` — shared create/edit form

### ✅ How to verify

```bash
npm run dev
# Visit /admin/products — shows empty state with "Add Product" button
# Create a product with 2 images — appears in list with first image thumbnail
# Edit the product — form pre-fills with current values
# Change status to "archived" — product disappears from list
# Try creating without a name — inline validation error appears
# GET /api/products — returns only active + draft (not archived)
```

### 💬 The Prompt

```
Implement Module 4 — Product CRUD for Own Store.

Read .ai-context/architecture.md (products schema, indexes, API routes) and
.agents/rules/production-standards.md before starting.

1. Create lib/validators/product.ts:
   - productCreateSchema (Zod):
     * name: string min 2 max 100 (required)
     * description: string min 10 max 2000 (required)
     * price: number positive (required)
     * category: string — valid MongoDB ObjectId format (required)
     * images: z.array(z.string().url()).max(4) (required, min 1)
     * stock: number non-negative integer, default 0
     * lowStockThreshold: number positive integer, default 5
     * status: z.enum(["active","draft","archived"]), default "draft"
     * featured: boolean, default false
   - productUpdateSchema: productCreateSchema.partial() — all fields optional
   - Slug is auto-generated server-side, never accepted from client

2. Create app/api/products/route.ts:
   - GET: dbConnect → Product.find({ status: { $ne: "archived" } })
     .populate("category", "name slug")
     .sort({ createdAt: -1 }).lean()
     → return array
   - POST: session guard → validate body with productCreateSchema →
     auto-generate slug from name using slugify({ lower: true, strict: true }) →
     check slug uniqueness, append -2/-3 if collision →
     Product.create(data) → return created doc
   - Standard error pattern

3. Create app/api/products/[id]/route.ts:
   - GET: dbConnect → Product.findById(id).populate("category").lean() →
     404 if not found
   - PUT: session guard → validate body with productUpdateSchema →
     if name changed, regenerate slug →
     Product.findByIdAndUpdate(id, data, { new: true }) → return updated
   - DELETE: session guard → Product.findByIdAndUpdate(id,
     { status: "archived" }) → 200 { message: "Product archived" }
     (never hard delete)

4. Create app/(admin)/products/page.tsx (Server Component):
   - Fetch all non-archived products server-side
   - Render shadcn Table: columns: [Image, Name, Category, Price, Stock, Status, Actions]
   - Status badge: active=green, draft=yellow-amber
   - Low stock warning: ⚠️ icon in Stock cell when stock ≤ lowStockThreshold
   - Actions: Edit (link to /admin/products/[id]/edit), Archive (confirm dialog)
   - Header: "Products" title + "Add Product" button → /admin/products/new
   - Empty state: illustration + "No products yet. Add your first product."

5. Create app/(admin)/products/new/page.tsx:
   - Renders <ProductForm mode="create" />

6. Create app/(admin)/products/[id]/edit/page.tsx (Server Component):
   - Fetch product server-side, 404 if not found
   - Pass product as prop to <ProductForm mode="edit" product={product} />

7. Create components/admin/ProductForm.tsx ("use client"):
   - Props: mode: "create"|"edit", product?: IProduct
   - React Hook Form + Zod (productCreateSchema for create, productUpdateSchema for edit)
   - Fields:
     * Name (text input) → shows live slug preview below as user types
     * Description (textarea, char counter showing /2000)
     * Price (number input with £/$ currency indicator)
     * Category (select — fetch from GET /api/categories on mount)
     * Images: 4 ImageUploader slots (labeled Image 1–4),
       first slot required, rest optional. Store URL array in form state.
     * Stock (number input)
     * Low Stock Threshold (number input, helper text "Show warning below this number")
     * Status (radio group: Draft / Active)
     * Featured (checkbox "Show on homepage")
   - Submit: POST /api/products (create) or PUT /api/products/[id] (edit)
   - Loading state on submit button
   - Success: toast + redirect to /admin/products
   - Cancel: link back to /admin/products

Explain slug collision handling and why we archive instead of hard-deleting products.
```

---

## Module 5 — Category Management

### 🏗️ What it does

Full category CRUD with a delete guard that prevents removing categories still referenced by products. Inline add/edit form within the categories page.

### 🧠 What you'll learn

- Referential integrity check in MongoDB (countDocuments with $in)
- Optimistic updates with SWR mutate
- shadcn Dialog for inline editing
- Delete confirmation pattern

### 📄 Files involved

- `lib/validators/category.ts` — Zod schema
- `app/api/categories/route.ts` — GET all, POST
- `app/api/categories/[id]/route.ts` — PUT, DELETE
- `app/(admin)/categories/page.tsx` — category management page

### ✅ How to verify

```bash
npm run dev
# Visit /admin/categories — add a category
# Create a product in that category
# Try deleting the category — should show "This category has X products" error
# Delete a category with no products — succeeds immediately
# Edit a category name — slug auto-regenerates
```

### 💬 The Prompt

```
Implement Module 5 — Category Management for Own Store.

Read .ai-context/architecture.md (categories schema) and
.agents/rules/production-standards.md before starting.

1. Create lib/validators/category.ts (Zod):
   - categoryCreateSchema: name (string min 2 max 50 required),
     description (string max 200 optional)
   - categoryUpdateSchema: categoryCreateSchema.partial()
   - Slug always auto-generated server-side from name

2. Create app/api/categories/route.ts:
   - GET: Category.find().sort({ name: 1 }).lean() → return array
     (public route — no session required, needed by ProductForm)
   - POST: session guard → validate → auto-generate slug → check slug uniqueness
     → Category.create(data) → return created doc

3. Create app/api/categories/[id]/route.ts:
   - PUT: session guard → validate with categoryUpdateSchema →
     if name changed, regenerate slug →
     Category.findByIdAndUpdate(id, data, { new: true }) → return updated
   - DELETE: session guard →
     const productCount = await Product.countDocuments({ category: id })
     if productCount > 0 → return 400 { error: "Cannot delete: X product(s) use this category" }
     else → Category.findByIdAndDelete(id) → 200 { message: "Deleted" }

4. Create app/(admin)/categories/page.tsx ("use client"):
   - SWR fetch from GET /api/categories
   - Layout: header "Categories" + "Add Category" button
   - Inline add form at top (name + description) with Save/Cancel buttons
     Appears when "Add Category" clicked; hides on save/cancel
   - Category list: table with columns: Name, Slug, Description, Created At, Actions
   - Edit action → opens shadcn Dialog with pre-filled form (name + description)
     Submit → PUT /api/categories/[id] → mutate SWR → toast
   - Delete action → shadcn AlertDialog confirmation:
     "Delete [category name]? This cannot be undone."
     On confirm → DELETE /api/categories/[id]
     If 400 (has products) → show toast with the error message
     If success → mutate SWR → toast "Category deleted"
   - Empty state: "No categories yet. Add your first one."

Explain why the GET /api/categories route has no session guard and why that's intentional.
```

---

## Module 6 — Inventory Management

### 🏗️ What it does

Dedicated inventory view with inline stock editing and bulk update. Highlights low-stock and out-of-stock products. Separate from product CRUD — focused entirely on stock management.

### 🧠 What you'll learn

- Bulk update pattern with Promise.all in MongoDB
- Optimistic UI with local state before API confirmation
- Controlled inline editing (click-to-edit table cells)
- Filter UI without URL state (client-side only)

### 📄 Files involved

- `app/api/inventory/route.ts` — GET (inventory view), PUT (bulk update)
- `app/(admin)/inventory/page.tsx`
- `components/admin/StockManager.tsx` — inline editor cell

### ✅ How to verify

```bash
npm run dev
# Visit /admin/inventory — all products listed with stock numbers
# Products with stock ≤ threshold highlighted amber
# Products with stock = 0 highlighted red
# Click a stock number → becomes editable input
# Change multiple stocks → click "Save Changes" → all updated in DB
# Filter to "Low Stock" → only at-risk products shown
```

### 💬 The Prompt

```
Implement Module 6 — Inventory Management for Own Store.

Read .ai-context/architecture.md and .agents/rules/production-standards.md before starting.

1. Create app/api/inventory/route.ts:
   - GET: session guard → dbConnect →
     Product.find({ status: { $ne: "archived" } })
     .select("name slug stock lowStockThreshold status category")
     .populate("category", "name")
     .sort({ name: 1 }).lean()
     → return array
   - PUT (bulk update): session guard →
     Body: { updates: Array<{ id: string, stock: number, lowStockThreshold: number }> }
     Validate with Zod: each item must have valid id, non-negative stock, positive threshold
     Execute: await Promise.all(updates.map(u =>
       Product.findByIdAndUpdate(u.id, { stock: u.stock, lowStockThreshold: u.lowStockThreshold })
     ))
     → return { updated: count }

2. Create app/(admin)/inventory/page.tsx ("use client"):
   - SWR fetch from GET /api/inventory on mount
   - Local state: pendingChanges — Map<id, { stock, lowStockThreshold }>
   - Filter bar (client-side only, no URL state):
     All | Low Stock | Out of Stock (pill buttons)
   - Table columns: Product Name, Category, Status badge, Stock (editable), Threshold (editable), Alert
   - Row highlighting:
     * stock === 0 → red background tint (bg-red-950/30)
     * stock > 0 && stock ≤ lowStockThreshold → amber tint (bg-amber-950/30)
   - Alert column: ⚠️ icon in amber when low stock, 🚫 in red when out of stock
   - "Save Changes" button (disabled when pendingChanges is empty):
     On click → PUT /api/inventory with pendingChanges array → toast result → clear pendingChanges
   - Loading skeleton while SWR fetches

3. Create components/admin/StockManager.tsx ("use client"):
   - Props: value: number, productId: string, field: "stock"|"lowStockThreshold",
     onChange: (id: string, field: string, value: number) => void
   - Displays value as text when not editing
   - Click on value → becomes a number input (autofocus)
   - On blur or Enter → call onChange() with new value → revert to text display
   - Prevents negative values (min="0")
   - Shows subtle pencil icon on hover to indicate editability

Explain the bulk update approach and why we use local pendingChanges state
instead of saving each change individually.
```

---

## Module 7 — Admin Dashboard

### 🏗️ What it does

Builds the admin dashboard homepage with stat cards showing total products, active products, low-stock count, and category breakdown. Graphify-compatible data shapes for future analytics integration.

### 🧠 What you'll learn

- Server Component data fetching with parallel queries
- Graphify-compatible data structure design
- shadcn/ui Card + Badge for stat display
- Server-side aggregation with Mongoose

### 📄 Files involved

- `lib/analytics.ts` — aggregation queries (Graphify-ready)
- `app/(admin)/dashboard/page.tsx`
- `components/admin/charts/` — placeholder chart components

### ✅ How to verify

```bash
npm run dev
# Visit /admin/dashboard
# Stat cards show correct counts (verify against DB)
# Low stock section lists correct products
# Category breakdown totals match product count
# Add a product → refresh dashboard → count increments
```

### 💬 The Prompt

```
Implement Module 7 — Admin Dashboard for Own Store.

Read .ai-context/architecture.md and .agents/rules/production-standards.md before starting.
Data shapes must be Graphify-compatible — document the shape in a comment above each query.

1. Create lib/analytics.ts with these aggregation helpers:
   (Add a comment above each: // Graphify-compatible shape: { ... })

   - getDashboardStats(): Promise<DashboardStats>
     Returns:
     {
       totalProducts: number,       // all non-archived
       activeProducts: number,      // status: "active"
       draftProducts: number,       // status: "draft"
       lowStockProducts: number,    // stock > 0 && stock ≤ lowStockThreshold
       outOfStockProducts: number,  // stock === 0 (non-archived)
       totalCategories: number
     }

   - getLowStockProducts(): Promise<LowStockProduct[]>
     Returns array of { id, name, slug, stock, lowStockThreshold } for products
     where stock <= lowStockThreshold AND status !== "archived", sorted by stock ASC

   - getCategoryBreakdown(): Promise<CategoryBreakdown[]>
     Returns array of { categoryName, count } — product count per category
     (active + draft only), sorted by count DESC

2. Create app/(admin)/dashboard/page.tsx (Server Component):
   - getServerSession guard → redirect to login if no session
   - Fetch in parallel: Promise.all([getDashboardStats(), getLowStockProducts(), getCategoryBreakdown()])
   - Render:
     a. Greeting: "Welcome back 👋" + current date (formatted)
     b. Stat cards row (shadcn Card, 2×2 grid on mobile, 4-wide on desktop):
        * Total Products (Package icon, neutral)
        * Active Products (CheckCircle icon, green)
        * Low Stock (AlertTriangle icon, amber)
        * Out of Stock (XCircle icon, red)
     c. Low Stock Alert section (only if count > 0):
        Table with columns: Product Name, Current Stock, Threshold, Edit link
        "All good — no low stock items!" empty state
     d. Category Breakdown section:
        Horizontal bar chart (pure CSS / Tailwind widths, no chart lib yet)
        Each bar: category name + product count, width proportional to max count
   - Link in low stock rows → /admin/inventory for quick fix

3. Create components/admin/charts/ directory with:
   - StatCard.tsx: Card with icon, label, value, optional color variant
   - CategoryBar.tsx: single CSS bar chart row (category, count, fill width%)
   These are stub components for Graphify replacement later.
   Add comment: // TODO: Replace with Graphify component in Phase 2

Explain why analytics queries are isolated in lib/analytics.ts and
how the data shapes are designed for Graphify compatibility.
```

---

## Module 8 — Store Layout & Theme Engine

### 🏗️ What it does

Builds the public storefront layout: dynamically loads the vendor's theme from `shop_settings`, injects CSS variables, initializes Lenis smooth scroll, and sets global SEO metadata. This is the foundation all storefront pages depend on.

### 🧠 What you'll learn

- Next.js Server Component data fetching in layout
- CSS custom property injection from server data
- Lenis smooth scroll initialization in a Client Component wrapper
- `prefers-reduced-motion` detection
- Dynamic metadata with `generateMetadata()`

### 📄 Files involved

- `app/(store)/layout.tsx` — server layout + CSS injection + metadata
- `components/store/LenisProvider.tsx` — scroll init client wrapper
- `app/(store)/page.tsx` — homepage stub
- `app/(store)/not-found.tsx` — 404 page

### ✅ How to verify

```bash
npm run dev
# Set primaryColor to "slate" in settings → storefront uses slate palette
# Change to "zinc" → palette updates (hard refresh to see CSS vars)
# Open DevTools → :root should have --color-primary, --color-accent, --font-sans
# Check <title> tag matches shop settings metaTitle
# Set OS to prefer reduced motion → Lenis should not initialize
```

### 💬 The Prompt

```
Implement Module 8 — Store Layout & Theme Engine for Own Store.

Read .ai-context/architecture.md (Theme System section) and
.agents/rules/production-standards.md (animation rules) before starting.

1. Create app/(store)/layout.tsx (Server Component):
   - Fetch shop settings: await getOrCreateSettings() (use lib/mongodb.ts + ShopSettings model)
   - Build CSS custom properties string from settings using config/theme.ts:
     * --color-primary: [hex from colorMap[settings.primaryColor][600]]
     * --color-primary-50 through --color-primary-900: full range
     * --color-accent: [hex from accentMap[settings.accentColor]]
     * --font-sans: [font family string from fontMap[settings.font]]
   - Inject via: <style dangerouslySetInnerHTML={{ __html: cssVars }} />
     (safe: all values are server-generated from a controlled enum, not user input)
   - Wrap children in <LenisProvider>
   - Export generateMetadata() function:
     * title: settings.seo.metaTitle || settings.shopName
     * description: settings.seo.metaDescription
     * openGraph: { title, description, images: [settings.hero.backgroundImage] }

2. Create components/store/LenisProvider.tsx ("use client"):
   - useEffect on mount:
     * Check: const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
     * If reduced → do NOT initialize Lenis, return
     * Otherwise: const lenis = new Lenis({ duration: 1.2, easing: (t) => ... })
       Use RAF loop: function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
       requestAnimationFrame(raf)
   - Cleanup on unmount: lenis.destroy()
   - Install lenis: npm install lenis
   - Children rendered directly (no wrapper div)

3. Create app/(store)/page.tsx (Server Component stub):
   - Just return a <main> with "Storefront coming in Module 9" placeholder
   - This gets replaced in Module 9

4. Create app/(store)/not-found.tsx:
   - Branded 404 page using shop name
   - "Page Not Found" heading, short message, two links: Home + Products
   - Minimal, clean design using CSS variables

5. Create app/(store)/contact/page.tsx (Server Component):
   - Fetch shop settings
   - Display contact info: email, phone, address
   - Social links with icons (lucide-react: Instagram, Facebook, Twitter)
   - Page title from settings + "| Contact"
   - Clean centered layout, no form in v1

Explain the CSS variable injection approach and why dangerouslySetInnerHTML is
safe here specifically (server-generated enum values, not user text input).
```

---

## Module 9 — Homepage & Store Components

### 🏗️ What it does

Builds the full public homepage: GSAP-animated hero, Framer Motion product grid with staggered entrance animations, featured products, and all reusable storefront components.

### 🧠 What you'll learn

- GSAP word-by-word stagger inside `useLayoutEffect` with context cleanup
- Framer Motion `viewport` and `staggerChildren` variants
- `prefers-reduced-motion` guard pattern for every animation
- Framer Motion variants defined outside component (performance)
- Server/client component boundary decisions

### 📄 Files involved

- `app/(store)/page.tsx` — full homepage
- `components/store/Hero.tsx` — GSAP animated hero
- `components/store/ProductGrid.tsx` — Framer Motion grid
- `components/store/ProductCard.tsx` — hover + fade-up
- `components/store/StockBadge.tsx` — stock status indicator
- `components/store/Navbar.tsx` — scroll-aware navbar
- `components/store/Footer.tsx` — footer from settings

### ✅ How to verify

```bash
npm run dev
# Homepage loads with animated hero (words stagger in)
# Featured products grid fades up as you scroll into view
# Hover a product card — slight scale lift, no bounce
# Scroll down quickly — navbar hides; scroll up — reveals
# OS: prefer reduced motion → all animations skipped, layout intact
# Stock badge shows correct state per product stock value
```

### 💬 The Prompt

```
Implement Module 9 — Homepage & Store Components for Own Store.

Read .ai-context/architecture.md (animation patterns) and
.agents/rules/production-standards.md (animation rules) before starting.
Every animation must check prefers-reduced-motion before running.

1. Update app/(store)/page.tsx (Server Component):
   - Fetch in parallel:
     * getOrCreateSettings() — for hero + footer data
     * Product.find({ status: "active", featured: true }).limit(8).lean()
   - Render: <Hero> + <ProductGrid products={featured} title="Featured" /> + <Footer>

2. Create components/store/Hero.tsx ("use client"):
   - Props: headline: string, subheadline?: string, backgroundImage?: string
   - Layout: full-viewport div with background (image with overlay OR gradient fallback)
   - GSAP inside useLayoutEffect (NEVER useEffect for GSAP):
     const ctx = gsap.context(() => {
       const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
       if (!reduced) {
         // Split headline into word spans (create them in JSX, target with selector)
         gsap.from(".hero-word", { y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power2.out" })
         gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.6, delay: 0.5, ease: "power2.out" })
         gsap.from(".hero-cta", { y: 15, opacity: 0, duration: 0.5, delay: 0.7, ease: "power2.out" })
       }
     }, heroRef);
     return () => ctx.revert(); // cleanup
   - Headline: split into <span className="hero-word"> per word in JSX
   - CTA button: "Browse Products" → links to /products
   - Responsive: min-h-screen desktop, min-h-[80vh] mobile
   - Install gsap: npm install gsap

3. Create components/store/StockBadge.tsx (Server Component, no "use client"):
   - Props: stock: number, lowStockThreshold: number
   - Logic:
     * stock === 0 → "Out of Stock" (red badge)
     * stock > 0 && stock <= lowStockThreshold → "Low Stock ({stock} left)" (amber badge)
     * stock > lowStockThreshold → "In Stock" (green badge)
   - Use CSS variables for colors: var(--color-accent) for accent badges
   - Small pill badge, no animation

4. Create components/store/ProductCard.tsx ("use client"):
   - Props: product: { name, slug, price, images: string[], stock, lowStockThreshold }
   - Framer Motion variants (defined OUTSIDE component):
     const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
   - Wrapped in motion.div using cardVariants
   - Hover: whileHover={{ scale: 1.02 }} — NO bounce (transition: { type: "tween", ease: "easeOut" })
   - Layout: image (aspect-square, object-cover, Next.js <Image>), name, price, StockBadge
   - Link wraps entire card: href="/products/[slug]"
   - Price formatted: £XX.XX or use Intl.NumberFormat

5. Create components/store/ProductGrid.tsx ("use client"):
   - Props: products: Product[], title?: string
   - Framer Motion variants (outside component):
     const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
   - motion.div with containerVariants, whileInView="visible", viewport={{ once: true }}
   - Responsive grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
   - Empty state: "No products available" with icon
   - Render ProductCard for each product as motion child

6. Create components/store/Navbar.tsx ("use client"):
   - Props: shopName: string, logo?: string
   - Fixed position, backdrop-blur background using CSS vars
   - GSAP ScrollTrigger for hide/show (check prefers-reduced-motion first):
     ScrollTrigger.create({ start: "top -100", onUpdate: (self) => {
       if (!reduced) gsap.to(navRef.current, { y: self.direction === 1 ? "-100%" : "0%", duration: 0.3 })
     }})
   - Nav links: Home (/), Products (/products), Contact (/contact)
   - Active link underline using Framer Motion layoutId="underline"
   - Mobile: hamburger → shadcn Sheet with nav links stacked
   - Cleanup ScrollTrigger on unmount

7. Create components/store/Footer.tsx (Server Component):
   - Props: footer settings object from shop_settings
   - Three columns (desktop): Brand, Contact, Follow us
   - Brand: logo or shopName + description
   - Contact: email, phone, address with icons
   - Social: only render links that have values (instagram/facebook/twitter)
   - Bottom bar: "© {year} {shopName}. All rights reserved."
   - Responsive: stacked single column on mobile

Explain why Hero uses useLayoutEffect (not useEffect) for GSAP,
and why ProductCard variants are defined outside the component.
```

---

## Module 10 — Products Page & Single Product

### 🏗️ What it does

Builds the public products listing page with filter/search/sort, and the single product detail page with image gallery, stock info, and related products.

### 🧠 What you'll learn

- Next.js `searchParams` for URL-driven filter state
- `useRouter` + `useSearchParams` for client-side URL updates without full reload
- Framer Motion `AnimatePresence` for image crossfade
- `generateStaticParams()` for product pages
- `generateMetadata()` for per-product SEO

### 📄 Files involved

- `app/(store)/products/page.tsx` — products listing (Server Component)
- `components/store/ProductsClient.tsx` — filter/search/sort UI (Client Component)
- `app/(store)/products/[slug]/page.tsx` — single product page
- `components/store/ProductGallery.tsx` — image gallery with crossfade

### ✅ How to verify

```bash
npm run dev
# /products — shows all active products
# Click a category filter — URL updates, products filter without page reload
# Type in search — debounces 300ms, URL updates, results filter
# Sort by price — reorders correctly
# /products/my-product-slug — shows product detail
# Thumbnail click — main image crossfades
# Unknown slug — shows 404 page
# View source — OG meta tags present with product image
```

### 💬 The Prompt

```
Implement Module 10 — Products Page & Single Product for Own Store.

Read .ai-context/architecture.md and .agents/rules/production-standards.md before starting.

1. Update app/api/products/route.ts GET handler to accept query params:
   - ?category=[slug] → filter by category slug
   - ?search=[term] → case-insensitive name match ($regex, $options: "i")
   - ?sort=price_asc | price_desc | name_asc | newest (default)
   - ?page=[n] → pagination, 12 per page
   - Return: { products, total, page, totalPages, categories (for filter UI) }
   - Public route (no session required)

2. Create app/(store)/products/page.tsx (Server Component):
   - Accept searchParams prop
   - Fetch products + categories from API with searchParams forwarded
   - Render <ProductsClient initialProducts={...} categories={...} searchParams={...} />

3. Create components/store/ProductsClient.tsx ("use client"):
   - Props: initialProducts, categories, searchParams
   - State: managed via URL (useRouter + useSearchParams)
   - Category filter: pill buttons (All + one per category)
     On click: update ?category= in URL, reset to page 1
   - Search input: debounced 300ms with useEffect + setTimeout
     On change: update ?search= in URL, reset to page 1
   - Sort dropdown: select or shadcn DropdownMenu
     On change: update ?sort= in URL
   - Display: total count "Showing X products"
   - Framer Motion: AnimatePresence on filter panel for slide-down effect
   - ProductGrid below filters — re-renders when URL changes (server refetch via navigation)
   - Pagination: Prev / Next buttons, "Page X of Y" display
   - Loading state: skeleton grid while navigating

4. Create app/(store)/products/[slug]/page.tsx (Server Component):
   - Fetch: Product.findOne({ slug, status: "active" }).populate("category").lean()
   - If not found or archived → notFound() (triggers app/not-found.tsx)
   - Fetch related: Product.find({ category: product.category._id,
     _id: { $ne: product._id }, status: "active" }).limit(4).lean()
   - generateMetadata():
     title: `${product.name} | ${shopSettings.shopName}`
     description: product.description.slice(0, 160)
     openGraph: { images: [product.images[0]] }
   - generateStaticParams(): fetch all active product slugs, return array
   - Layout:
     Left (lg:col-span-7): <ProductGallery images={product.images} />
     Right (lg:col-span-5): slides in from right on load (Framer Motion x:30 → 0)
       Product name (h1), price, <StockBadge>, description, category link
   - Below: "You might also like" + <ProductGrid products={related} />

5. Create components/store/ProductGallery.tsx ("use client"):
   - Props: images: string[] (max 4)
   - State: selectedIndex (number, default 0)
   - Main image: Framer Motion AnimatePresence with crossfade transition (opacity 0→1, 0.3s)
     Use Next.js <Image> with priority on first image
   - Thumbnail strip: row of 4 slots (show placeholder for empty slots)
     Active thumbnail: ring using --color-accent variable
   - Keyboard: ArrowLeft/ArrowRight to cycle images
   - Touch: swipe left/right to cycle (add simple touch handlers)

Explain generateStaticParams() and how it balances SSG performance with
dynamic product data freshness using revalidate.
```

---

## Module 11 — SEO, Sitemap & Polish

### 🏗️ What it does

Implements dynamic sitemap, robots.txt, per-page structured data (JSON-LD), and runs the full mobile responsiveness + animation audit. Final production readiness check.

### 🧠 What you'll learn

- Next.js Route Handlers for sitemap.xml and robots.txt
- JSON-LD schema markup for products
- `prefers-reduced-motion` audit across the entire codebase
- TypeScript strict mode final pass (`tsc --noEmit`)
- Lighthouse performance patterns

### 📄 Files involved

- `app/sitemap.xml/route.ts`
- `app/robots.txt/route.ts`
- `app/(store)/products/[slug]/page.tsx` — JSON-LD added
- All store components — animation audit
- `docs/VENDOR_ONBOARDING.md`
- `.env.example` — finalized

### ✅ How to verify

```bash
npm run dev
# /sitemap.xml — valid XML with all active product URLs
# /robots.txt — allows all crawlers, includes sitemap URL
# View source of product page — JSON-LD script tag present
# npx tsc --noEmit — zero errors
# Enable "Emulate CSS prefers-reduced-motion" in DevTools → no animations fire
# Mobile viewport (375px) — all pages usable without horizontal scroll
```

### 💬 The Prompt

```
Implement Module 11 — SEO, Sitemap & Polish for Own Store.

Read .ai-context/architecture.md and .agents/rules/production-standards.md before starting.
This is the final production readiness pass — be thorough.

1. Create app/sitemap.xml/route.ts (GET):
   - Content-Type: application/xml
   - URLs to include:
     * {NEXT_PUBLIC_APP_URL}/ (priority 1.0)
     * {NEXT_PUBLIC_APP_URL}/products (priority 0.9)
     * {NEXT_PUBLIC_APP_URL}/contact (priority 0.7)
     * All active products: /products/[slug] (priority 0.8, lastmod = updatedAt)
   - Fetch active product slugs + updatedAt from DB (no cache — revalidate: 3600)

2. Create app/robots.txt/route.ts (GET):
   - Content-Type: text/plain
   - Content:
     User-agent: *
     Allow: /
     Disallow: /admin/
     Sitemap: {NEXT_PUBLIC_APP_URL}/sitemap.xml

3. Add JSON-LD to app/(store)/products/[slug]/page.tsx:
   - <script type="application/ld+json"> in the <head> via generateMetadata or inline
   - Schema: Product type
     { "@context": "https://schema.org", "@type": "Product",
       name, description, image: images[0], offers: { price, priceCurrency: "GBP",
       availability: stock > 0 ? "InStock" : "OutOfStock" } }

4. Run the full animation audit — check every file with GSAP or Framer Motion:
   For each animation found, verify:
   a. GSAP: inside useLayoutEffect? Has gsap.context() wrapper? Has ctx.revert() cleanup?
   b. GSAP: checks prefers-reduced-motion before running?
   c. Framer Motion: variants defined outside component?
   d. Lenis: only initialized in LenisProvider (store layout), not re-initialized elsewhere?
   Fix any violations found. List what was fixed.

5. Run mobile responsiveness audit:
   For each page and component, verify at 375px viewport:
   a. No horizontal overflow
   b. All tap targets ≥ 44px height
   c. Images not cropped critically
   d. Navigation usable (hamburger menu works)
   e. Tables have horizontal scroll on mobile
   Fix any issues found.

6. Run TypeScript audit:
   - npx tsc --noEmit
   - Fix ALL errors — no exceptions
   - List every file that had errors and what was fixed

7. Create docs/VENDOR_ONBOARDING.md:
   - Step-by-step guide for non-technical vendors
   - Section: "Setting up your store for the first time" (register, theme, first product)
   - Section: "Adding and managing products" (images, stock, categories)
   - Section: "Updating your store information" (settings page walkthrough)
   - Plain language, no jargon

8. Finalize .env.example with full comments and instructions

Report at the end:
- TypeScript errors fixed: list
- Animation violations fixed: list
- Mobile issues fixed: list
- Verdict: PRODUCTION READY ✅ or NEEDS MORE WORK ⚠️
```

---

## Module 12 — Testing Suite

### 🏗️ What it does

Creates comprehensive tests for all API routes, utility functions, and key components. Covers happy paths, validation errors, auth guards, and edge cases.

### 🧠 What you'll learn

- Jest + `mongodb-memory-server` for isolated DB tests
- `node-mocks-http` for Route Handler testing
- `@testing-library/react` for component tests
- Test organization mirroring the src structure

### 📄 Files involved

- `jest.config.ts` — Jest configuration
- `tests/setup.ts` — global test setup
- `tests/api/auth.test.ts`
- `tests/api/products.test.ts`
- `tests/api/categories.test.ts`
- `tests/api/upload.test.ts`
- `tests/api/settings.test.ts`
- `tests/api/inventory.test.ts`
- `tests/components/StockBadge.test.tsx`
- `tests/lib/analytics.test.ts`
- `tests/lib/blob.test.ts`

### ✅ How to verify

```bash
npm test
# All tests pass
# Coverage report generated (aim for >80% on lib/ and api/)
```

### 💬 The Prompt

```
Implement Module 12 — Testing Suite for Own Store.

Read .ai-context/test_cases.md (master test scenarios) and
.agents/rules/production-standards.md before starting.
Use the /generate-tests workflow for each test file.

1. Configure Jest:
   - jest.config.ts: testEnvironment "node" for API tests, "jsdom" for component tests
   - tests/setup.ts: connect mongodb-memory-server before tests, disconnect after
   - Add "test" and "test:coverage" scripts to package.json

2. Create tests/api/products.test.ts covering ALL scenarios from test_cases.md Section "Products API":
   - GET all: returns active + draft only (not archived)
   - GET one: returns product with category populated
   - POST: creates product with auto-generated slug
   - POST: rejects missing name (Zod 400)
   - POST: rejects price ≤ 0 (Zod 400)
   - POST: rejects > 4 images (Zod 400)
   - PUT: updates product, returns updated doc
   - DELETE: sets status to "archived", not hard delete
   - GET all: returns 401 when not authenticated

3. Create tests/api/categories.test.ts:
   - GET all: returns sorted by name
   - POST: creates with unique slug
   - POST: rejects duplicate slug (400)
   - DELETE: fails with 400 if products reference this category
   - DELETE: succeeds if no products reference it

4. Create tests/api/settings.test.ts:
   - GET: returns defaults if no settings exist
   - PUT: updates and returns updated doc
   - PUT: rejects invalid primaryColor (not in enum)
   - PUT: rejects invalid font (not in enum)

5. Create tests/api/inventory.test.ts:
   - GET: returns all non-archived products with stock fields
   - PUT (bulk): updates multiple products in one call
   - PUT (bulk): rejects negative stock values

6. Create tests/api/upload.test.ts:
   - Validates MIME type (reject application/pdf)
   - Validates file size (reject > 4MB)
   - Returns 401 when not authenticated

7. Create tests/components/StockBadge.test.tsx:
   - stock > threshold → renders "In Stock"
   - stock > 0 && stock ≤ threshold → renders "Low Stock (X left)"
   - stock === 0 → renders "Out of Stock"

8. Create tests/lib/analytics.test.ts:
   - getDashboardStats: correct counts with seeded data
   - getLowStockProducts: returns only products at or below threshold
   - getCategoryBreakdown: correct count per category

9. Create tests/lib/blob.test.ts (unit test validateImageFile only, mock @vercel/blob):
   - Rejects non-image MIME types
   - Rejects files > 4MB
   - Accepts valid image under 4MB

After all tests pass, run: npm test -- --coverage
Report coverage percentages for lib/ and app/api/.
```

---

## 🏁 Final Deployment Checklist

After all modules are complete, run this final prompt before going live:

```
Run the complete pre-deployment checklist for Own Store:

1. TypeScript: npx tsc --noEmit — must return zero errors
2. Tests: npm test — all tests must pass
3. Environment: verify .env.example matches all variables used in code
4. Security audit: grep all admin API routes — every one must have getServerSession() call
5. Registration lock: manually verify Admin.countDocuments() guard in register page
6. Blob validation: confirm MIME + size check in /api/upload (both client AND server)
7. Animations: confirm prefers-reduced-motion respected in Hero, Navbar, ProductCard, ProductGrid
8. Lenis: confirm it is ONLY initialized in LenisProvider (store layout) — grep "new Lenis("
9. console.log audit: grep -r "console.log" src/ — must return empty
10. Image components: grep for <img — all should be Next.js <Image> (except SVGs)
11. Build: npm run build — must complete with no errors
12. Lighthouse: run on / and /products — target 90+ on Performance, Accessibility, SEO

Report results in a table: Check | Status | Notes
Final verdict: READY TO DEPLOY ✅ or BLOCKERS FOUND ⚠️ (list blockers)
```
