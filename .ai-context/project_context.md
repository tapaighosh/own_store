# Own Store — Project Context

## What Is This?

**Own Store** is a white-label e-commerce storefront template. Each vendor (client) gets their own deployed instance — their own Vercel project, MongoDB database, and custom domain. No multi-tenancy; every vendor is fully isolated.

## Who Uses It?

- **Vendor Admin:** A small business owner who logs in, sets up their shop (name, logo, theme, products), and manages inventory. Non-technical.
- **End Customer:** Visits the public storefront, browses products, views details. No account required — no cart/checkout in v1.

## Business Model

You (the developer) build and deploy this once per vendor. The vendor pays only for their domain (~$10–15/year). Everything else (Vercel, MongoDB Atlas M0, Vercel Blob) is free tier.

## Core Value Proposition

A small vendor gets a **beautifully animated, fully branded storefront** and a simple admin panel — without paying for Shopify or hiring a developer permanently.

## v1 Scope (What We're Building)

- ✅ Admin: Register (once), Login, Dashboard, Products CRUD, Categories, Inventory, Settings
- ✅ Store: Homepage (hero, featured products, footer), Products page (filter/search/sort), Single Product page, Contact page
- ✅ Theme: Vendor picks neutral color palette + accent color + font during setup
- ✅ Images: Up to 4 images per product via Vercel Blob
- ✅ Animations: GSAP + Lenis + Framer Motion (elegant, minimal)
- ❌ NOT in v1: Shopping cart, checkout, payments, customer accounts, reviews, email notifications

## Success Criteria

1. A vendor can go from zero to live store in under 30 minutes
2. The storefront scores 90+ on Lighthouse (performance, accessibility, SEO)
3. Admin panel is usable on mobile (responsive)
4. Each vendor's data is completely isolated
