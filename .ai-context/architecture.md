# Own Store — Architecture Reference

## System Overview

```
Browser (Customer)          Browser (Admin)
      │                           │
      ▼                           ▼
┌─────────────────────────────────────────┐
│         Next.js 16 App Router           │
│  ┌─────────────┐  ┌───────────────────┐ │
│  │ (store) group│  │  (admin) group    │ │
│  │  Public SSR  │  │  Protected SSR    │ │
│  └──────┬──────┘  └────────┬──────────┘ │
│         │                  │            │
│         └────────┬─────────┘            │
│                  ▼                      │
│         app/api/ Route Handlers         │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴──────────┐
         ▼                    ▼
   MongoDB Atlas          Vercel Blob
   (per-vendor DB)     (image storage)
```

---

## Directory Structure

```
/
├── app/
│   ├── (store)/                    # Public storefront group
│   │   ├── layout.tsx              # Theme loader + Lenis init
│   │   ├── page.tsx                # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx            # All products (filter/search/sort)
│   │   │   └── [slug]/page.tsx     # Single product detail
│   │   └── contact/page.tsx        # Contact info from shop_settings
│   │
│   ├── (admin)/                    # Protected admin group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx       # One-time only, 403 after first admin
│   │   ├── dashboard/page.tsx      # Stats overview
│   │   ├── products/
│   │   │   ├── page.tsx            # Product list with actions
│   │   │   ├── new/page.tsx        # Add product form
│   │   │   └── [id]/edit/page.tsx  # Edit product form
│   │   ├── categories/page.tsx     # Category CRUD
│   │   ├── inventory/page.tsx      # Stock management
│   │   └── settings/page.tsx       # Shop settings form
│   │
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── products/
│       │   ├── route.ts            # GET all, POST new
│       │   └── [id]/route.ts       # GET one, PUT, DELETE (archive)
│       ├── categories/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── inventory/route.ts      # Bulk stock update
│       ├── upload/route.ts         # Vercel Blob handler
│       └── settings/route.ts      # GET + PUT shop settings
│
├── components/
│   ├── store/
│   │   ├── Navbar.tsx              # Scroll-aware hide/show
│   │   ├── Hero.tsx                # GSAP staggered text reveal
│   │   ├── ProductCard.tsx         # Framer Motion fade-up
│   │   ├── ProductGrid.tsx         # Staggered card grid
│   │   ├── Footer.tsx              # From shop_settings
│   │   └── StockBadge.tsx          # In Stock / Low / Out of Stock
│   │
│   └── admin/
│       ├── Sidebar.tsx             # Nav links
│       ├── ProductForm.tsx         # RHF + Zod form
│       ├── ImageUploader.tsx       # Drag-drop, max 4, Vercel Blob
│       └── StockManager.tsx        # Inline stock editing
│
├── lib/
│   ├── mongodb.ts                  # Singleton connection
│   ├── auth.ts                     # NextAuth config + session helpers
│   ├── blob.ts                     # Vercel Blob upload/delete helpers
│   └── animations.ts               # Shared GSAP configs & variants
│
├── models/
│   ├── Admin.ts                    # Mongoose model + TS interface
│   ├── ShopSettings.ts
│   ├── Product.ts
│   └── Category.ts
│
├── types/
│   ├── Product.types.ts
│   ├── Category.types.ts
│   ├── ShopSettings.types.ts
│   └── Admin.types.ts
│
├── config/
│   └── theme.ts                    # Color palette + font mapping
│
└── tests/                          # Jest test files (mirrors src structure)
```

---

## MongoDB Collections

### `admins`

```ts
{
  name: string;
  email: string; // unique index
  password: string; // bcrypt hash, never returned in API
  createdAt: Date;
}
```

### `shop_settings` (singleton document per DB)

```ts
{
  shopName: string;
  logo: string;           // Vercel Blob URL
  primaryColor: "slate" | "stone" | "zinc" | "neutral" | "warm-gray";
  accentColor: "rose" | "amber" | "sky" | "emerald";
  font: "Inter" | "Geist" | "Nunito" | "Lato";
  hero: {
    headline: string;
    subheadline: string;
    backgroundImage: string;  // Vercel Blob URL
  };
  footer: {
    description: string;
    email: string;
    phone: string;
    address: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}
```

### `products`

```ts
{
  name: string;
  slug: string;           // unique index, auto-generated from name
  description: string;
  price: number;
  category: ObjectId;     // ref: Category
  images: string[];       // Vercel Blob URLs, max 4
  stock: number;
  lowStockThreshold: number;  // default: 5
  status: "active" | "draft" | "archived";
  featured: boolean;
  createdAt: Date;
}
// Indexes: slug (unique), status, category, featured
```

### `categories`

```ts
{
  name: string;
  slug: string;           // unique index
  description?: string;
  createdAt: Date;
}
```

---

## Authentication Flow

```
1. Admin visits /admin/login
2. Submits email + password
3. NextAuth credentials provider validates against DB
4. JWT session created (stored in httpOnly cookie)
5. Admin routes check getServerSession() on every request
6. Session expires after 7 days (configurable)
```

**Registration Lock:**

- `/admin/register` checks `Admin.countDocuments()` on load
- If count > 0, immediately redirect to `/admin/login` with message

---

## Theme System

CSS variables injected in `app/(store)/layout.tsx`:

```css
:root {
  --color-primary: [Tailwind palette value from shop_settings];
  --color-accent: [Accent color from shop_settings];
  --font-sans: [Font from shop_settings];
}
```

`config/theme.ts` maps setting values to actual CSS values:

```ts
export const colorMap = {
  slate: { 50: "#f8fafc", 900: "#0f172a", ... },
  // ...
};
```

---

## Image Upload Flow (Vercel Blob)

```
1. User selects image in ImageUploader component
2. Client sends POST to /api/upload with FormData
3. Route handler validates MIME type (image/*) and size (≤4MB)
4. Calls put() from @vercel/blob
5. Returns { url } to client
6. Client stores URL in form state, sends with product save
```

---

## External Integrations

| Service       | Purpose                      | SDK            |
| ------------- | ---------------------------- | -------------- |
| MongoDB Atlas | Database                     | `mongoose`     |
| Vercel Blob   | Image storage                | `@vercel/blob` |
| NextAuth.js   | Authentication               | `next-auth`    |
| Graphify      | Reporting/Analytics (future) | TBD            |

---

## Environment Variables

```bash
# Required
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Auto-provided by Vercel (no manual setup)
BLOB_READ_WRITE_TOKEN=auto
```
