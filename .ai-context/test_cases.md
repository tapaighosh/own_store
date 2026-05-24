# Own Store — Test Cases Master List

> Updated automatically by the agent after each test generation session.
> Format: Module > Feature > Scenario > Expected Result

---

## Phase 1 — Foundation

### MongoDB Connection (`lib/mongodb.ts`)
- [ ] Returns existing connection if already established
- [ ] Creates new connection when none exists
- [ ] Throws clear error if `MONGODB_URI` is missing

### Authentication (`lib/auth.ts`)
- [ ] Valid credentials return session with user email
- [ ] Invalid password returns null (not error)
- [ ] Unknown email returns null
- [ ] Session contains correct user fields

### API: Auth (`app/api/auth/[...nextauth]`)
- [ ] POST with valid credentials sets session cookie
- [ ] POST with invalid credentials returns 401
- [ ] GET session returns user data when logged in
- [ ] GET session returns null when not logged in

### Registration Lock
- [ ] `/admin/register` accessible when 0 admins exist
- [ ] `/admin/register` returns 403 when 1+ admins exist
- [ ] Creating admin via form hashes password with bcrypt

---

## Phase 2 — Admin Panel

### Products API (`app/api/products/`)
- [ ] GET all returns only active + draft products (not archived)
- [ ] GET one by ID returns full product with category populated
- [ ] POST creates product with auto-generated slug
- [ ] POST rejects missing required fields (Zod)
- [ ] POST rejects price ≤ 0
- [ ] PUT updates product and returns updated doc
- [ ] DELETE sets status to "archived" (not hard delete)
- [ ] Unauthenticated GET all returns 401

### Categories API (`app/api/categories/`)
- [ ] GET all returns all categories sorted by name
- [ ] POST creates category with unique slug
- [ ] POST rejects duplicate slug
- [ ] DELETE fails if products reference this category

### Upload API (`app/api/upload/`)
- [ ] Valid image uploads successfully
- [ ] Non-image MIME type rejected (400)
- [ ] File > 4MB rejected (400)
- [ ] Returns URL on success

### Settings API (`app/api/settings/`)
- [ ] GET returns shop settings (or defaults if none)
- [ ] PUT updates settings and returns updated doc
- [ ] PUT rejects invalid color/font values

### Admin Components
- [ ] `ProductForm` shows validation errors on empty submit
- [ ] `ImageUploader` previews images before upload
- [ ] `StockManager` updates stock with optimistic UI
- [ ] `Sidebar` highlights active route

---

## Phase 3 — Storefront

### Homepage
- [ ] Renders hero with settings data
- [ ] Featured products section shows only `featured: true` products
- [ ] Empty featured products shows fallback state

### Products Page
- [ ] Shows all active products
- [ ] Category filter narrows results
- [ ] Search filters by name (case-insensitive)
- [ ] Sort by price (asc/desc) works correctly
- [ ] No active products shows empty state

### Single Product Page
- [ ] Renders with correct slug
- [ ] Shows all product images in gallery
- [ ] Stock badge shows correct state (In Stock / Low / Out)
- [ ] Unknown slug returns 404

### StockBadge Component
- [ ] `stock > lowStockThreshold` → "In Stock"
- [ ] `stock > 0 && stock ≤ lowStockThreshold` → "Low Stock (X left)"
- [ ] `stock === 0` → "Out of Stock"

---

## Phase 4 — Polish

### SEO
- [ ] Homepage has correct `<title>` from shop settings
- [ ] Product pages have correct OG meta tags
- [ ] `robots.txt` accessible

### Animations
- [ ] Animations disabled when `prefers-reduced-motion: reduce`
- [ ] GSAP context cleaned up on component unmount
- [ ] Lenis scroll initialized only once per page load
