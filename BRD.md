🏗️ Architecture Overview
Model: White-label deployable codebase
Each vendor gets their own repo copy + MongoDB database + Vercel project (Vercel Blob included free per project)

📁 Project Structure
/
├── app/
│ ├── (store)/ # Public storefront
│ │ ├── layout.tsx # Loads theme + Lenis smooth scroll
│ │ ├── page.tsx # Homepage
│ │ ├── products/
│ │ │ ├── page.tsx # All products
│ │ │ └── [slug]/page.tsx # Single product
│ │ └── contact/page.tsx
│ ├── (admin)/ # Admin panel (protected)
│ │ ├── login/page.tsx
│ │ ├── register/page.tsx # First time only, locked after
│ │ ├── dashboard/page.tsx
│ │ ├── products/
│ │ │ ├── page.tsx # Product list
│ │ │ ├── new/page.tsx
│ │ │ └── [id]/edit/page.tsx
│ │ ├── categories/page.tsx
│ │ ├── inventory/page.tsx # Stock overview
│ │ └── settings/page.tsx # Shop info, theme, footer
│ └── api/
│ ├── auth/[...nextauth]/
│ ├── products/
│ ├── categories/
│ ├── inventory/
│ ├── upload/ # Vercel Blob handler
│ └── settings/
├── components/
│ ├── store/
│ │ ├── Navbar.tsx
│ │ ├── Hero.tsx
│ │ ├── ProductCard.tsx
│ │ ├── ProductGrid.tsx
│ │ ├── Footer.tsx
│ │ └── StockBadge.tsx
│ └── admin/
│ ├── Sidebar.tsx
│ ├── ProductForm.tsx
│ ├── ImageUploader.tsx
│ └── StockManager.tsx
├── lib/
│ ├── mongodb.ts
│ ├── auth.ts
│ ├── blob.ts # Vercel Blob helpers
│ └── animations.ts # Shared GSAP configs
├── models/
│ ├── Admin.ts
│ ├── ShopSettings.ts
│ ├── Product.ts
│ └── Category.ts
└── config/
└── theme.ts # CSS variable mapping

🗄️ MongoDB Collections (per vendor DB)
ts// admin
{
name, email, password(hashed), createdAt
}

// shop_settings
{
shopName,
logo: vercelBlobUrl,
primaryColor, // e.g. "slate" | "stone" | "zinc" | "neutral"
accentColor, // subtle highlight color
font, // "inter" | "geist" | "nunito" | "lato"
hero: {
headline,
subheadline,
backgroundImage: vercelBlobUrl
},
footer: {
description,
email,
phone,
address,
socialLinks: { instagram, facebook, twitter }
},
seo: {
metaTitle,
metaDescription
}
}

// products
{
name,
slug,
description,
price,
category: ObjectId,
images: [vercelBlobUrl], // max 4 images per product
stock: Number,
lowStockThreshold: Number, // default 5, admin can set
status: "active" | "draft" | "archived",
featured: Boolean,
createdAt
}

// categories
{
name,
slug,
description,
createdAt
}

🎨 Theme System
Admin picks during registration, changeable anytime in settings:
ts// Neutral palettes only
colors: "slate" | "stone" | "zinc" | "neutral" | "warm-gray"
accent: "rose" | "amber" | "sky" | "emerald" // one subtle accent

// Fonts (loaded via next/font)
fonts: "Inter" | "Geist" | "Nunito" | "Lato"
These map to CSS variables injected in the root layout:
css--color-primary: ...
--color-accent: ...
--font-sans: ...

✨ Animation Stack
LibraryVersionUse CaseFree?GSAP3.xHero text reveal, product card entrances, page transitions✅LenisLatestSmooth scroll across entire storefront✅Framer MotionLatestNavbar, modals, filter transitions, cart drawer✅
Animation Patterns (Minimal & Elegant)
Homepage Hero
└── Staggered text reveal with GSAP (word by word, 0.8s ease)
└── Subtle fade-up on CTA button

Product Grid
└── Framer Motion viewport-triggered fade-up per card
└── Stagger delay 0.1s between cards
└── Hover: slight scale + shadow lift (no bounce)

Page Transitions
└── GSAP page wipe or opacity fade between routes
└── Lenis handles all scroll momentum site-wide

Product Detail Page
└── Image gallery with smooth crossfade
└── Price/stock info slides in from right

Navbar
└── Hides on scroll down, reveals on scroll up (GSAP ScrollTrigger)

✅ Build Phases
Phase 1 — Foundation (Week 1)

Next.js 16 App Router setup
MongoDB connection with per-vendor .env
NextAuth credentials provider
Register page (locks after first admin created)
Vercel Blob upload API route

Phase 2 — Admin Panel (Week 1–2)

Clean, functional UI with shadcn/ui + Tailwind
Shop settings: name, logo, colors, fonts, footer, hero content, SEO
Product CRUD with up to 4 images via Vercel Blob
Category management (fully custom)
Inventory page: stock count, low stock warnings, bulk update
Dashboard: total products, low stock alerts, category breakdown

Phase 3 — Storefront + Animations (Week 2–3)

Theme loaded dynamically from shop_settings via CSS variables
Lenis smooth scroll initialized in store layout
Homepage: hero, featured products, about snippet, footer
Products page: category filter, search, sort
Single product page: image gallery, stock badge, related products
Contact page: details from shop settings

Phase 4 — Polish & Deploy Template (Week 3–4)

SEO metadata per page from shop settings
Mobile responsive (animation reduced on mobile via prefers-reduced-motion)
Stock badge logic: In Stock / Low Stock (X left) / Out of Stock
.env.example file with all variables documented
Vercel one-click deploy button in README

⚙️ Per-Vendor Env Variables
bash# Database
MONGODB_URI=mongodb+srv://...

# Auth

NEXTAUTH_SECRET=generate-random-string
NEXTAUTH_URL=https://vendordomain.com

# Vercel Blob (auto-injected by Vercel, no action needed)

BLOB_READ_WRITE_TOKEN=auto

# App

NEXT_PUBLIC_APP_URL=https://vendordomain.com

⚙️ Your Vendor Onboarding Workflow

1. Fork the base repo for the vendor
2. Create MongoDB Atlas database (free M0 tier — vendor pays ~$0)
3. Deploy to Vercel (free hobby tier — vendor pays $0)
4. Attach their custom domain in Vercel dashboard
5. Set MONGODB_URI + NEXTAUTH_SECRET + NEXTAUTH_URL in Vercel env
6. BLOB_READ_WRITE_TOKEN is auto-provided by Vercel — no setup needed
7. Share /admin/register link with vendor (one-time setup)
8. Vendor fills shop info, picks theme, starts adding products
   Vendor total cost: Domain only (~$10–15/year)

🔑 Key Technical Decisions Locked In
DecisionChoiceReasonImagesVercel BlobFree, fast, no vendor signupAuthNextAuth credentialsSimple, no third-party costStylingTailwind + shadcn/uiFast, consistent, freeAnimationGSAP + Lenis + Framer MotionMinimal elegant feelDBMongoDB Atlas M0Free per vendorDeploymentVercel HobbyFree per vendor
