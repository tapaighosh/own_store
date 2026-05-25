/**
 * TypeScript interfaces for the ShopSettings entity.
 *
 * These types drive the admin Settings page form and the (store) layout
 * theme injection. They are separate from the Mongoose IShopSettings interface.
 */

// ---------------------------------------------------------------------------
// Union Types
// ---------------------------------------------------------------------------

export type PrimaryColor = "slate" | "stone" | "zinc" | "neutral" | "warm-gray";
export type AccentColor = "rose" | "amber" | "sky" | "emerald";
export type FontChoice = "Inter" | "Geist" | "Nunito" | "Lato";

// ---------------------------------------------------------------------------
// Nested Types
// ---------------------------------------------------------------------------

export interface HeroSettings {
  headline: string;
  subheadline: string;
  /** Vercel Blob URL */
  backgroundImage: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface FooterSettings {
  description: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: SocialLinks;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
}

// ---------------------------------------------------------------------------
// Core ShopSettings Type (API Response)
// ---------------------------------------------------------------------------

export interface ShopSettings {
  _id: string;
  shopName: string;
  /** Vercel Blob URL for the shop logo */
  logo: string;
  primaryColor: PrimaryColor;
  accentColor: AccentColor;
  font: FontChoice;
  hero: HeroSettings;
  footer: FooterSettings;
  seo: SeoSettings;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Form Types
// ---------------------------------------------------------------------------

export type ShopSettingsFormData = Omit<ShopSettings, "_id" | "createdAt" | "updatedAt">;

// ---------------------------------------------------------------------------
// Theme Resolution Types
// ---------------------------------------------------------------------------

/**
 * Resolved theme values used to inject CSS variables into the store layout.
 * Computed by config/theme.ts from the raw ShopSettings values.
 */
export interface ResolvedTheme {
  /** Hex value for --color-primary */
  primaryHex: string;
  /** Hex value for --color-accent */
  accentHex: string;
  /** CSS font-family string for --font-sans */
  fontFamily: string;
}

// ---------------------------------------------------------------------------
// API Types
// ---------------------------------------------------------------------------

export interface ShopSettingsResponse {
  data: ShopSettings | null;
}
