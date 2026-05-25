import type { PrimaryColor, AccentColor, FontChoice, ResolvedTheme } from "@/types/ShopSettings.types";

// ---------------------------------------------------------------------------
// Color Maps
// ---------------------------------------------------------------------------

/**
 * Maps primary color names (from shop_settings) to Tailwind shade hex values.
 * These values are injected as CSS custom property --color-primary in the
 * (store) layout based on the vendor's chosen primaryColor.
 *
 * Shade selection strategy:
 * - 50: lightest background tint
 * - 100–400: light UI surfaces
 * - 500: midpoint
 * - 600–800: primary text and interactive elements
 * - 900: darkest — headers and footer backgrounds
 */
export const colorMap: Record<PrimaryColor, Record<number, string>> = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09",
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
  "warm-gray": {
    50: "#fafaf9",
    100: "#f5f4f2",
    200: "#e8e5e0",
    300: "#d5cfc6",
    400: "#b5ab9d",
    500: "#908578",
    600: "#756b5f",
    700: "#5e574d",
    800: "#3d3830",
    900: "#1f1c17",
    950: "#100e0b",
  },
};

// ---------------------------------------------------------------------------
// Accent Color Map
// ---------------------------------------------------------------------------

/**
 * Maps accent color names to their primary hex values.
 * Injected as --color-accent CSS custom property.
 *
 * These are the "500" shades from Tailwind palettes — bold enough to stand
 * out as CTA buttons and highlights on both light and dark backgrounds.
 */
export const accentMap: Record<AccentColor, string> = {
  rose: "#f43f5e",     // rose-500
  amber: "#f59e0b",    // amber-500
  sky: "#0ea5e9",      // sky-500
  emerald: "#10b981",  // emerald-500
};

// ---------------------------------------------------------------------------
// Font Map
// ---------------------------------------------------------------------------

/**
 * Maps font names to next/font configuration objects.
 * The `variable` property is injected into the <html> tag as a CSS class,
 * making the font available as a CSS variable in the store layout.
 *
 * Usage in (store)/layout.tsx:
 * ```ts
 * const fontConfig = fontMap[settings.font];
 * const fontLoader = fontConfig.loader({ subsets: ["latin"], variable: fontConfig.variable });
 * ```
 */
export const fontMap: Record<
  FontChoice,
  {
    /** CSS variable name applied to <html> element */
    variable: string;
    /** Human-readable font stack for CSS font-family */
    cssFamily: string;
    /** Google Fonts import name */
    googleName: string;
  }
> = {
  Inter: {
    variable: "--font-inter",
    cssFamily: '"Inter", system-ui, sans-serif',
    googleName: "Inter",
  },
  Geist: {
    variable: "--font-geist",
    cssFamily: '"Geist", system-ui, sans-serif',
    googleName: "Geist",
  },
  Nunito: {
    variable: "--font-nunito",
    cssFamily: '"Nunito", system-ui, sans-serif',
    googleName: "Nunito",
  },
  Lato: {
    variable: "--font-lato",
    cssFamily: '"Lato", system-ui, sans-serif',
    googleName: "Lato",
  },
};

// ---------------------------------------------------------------------------
// Theme Resolver
// ---------------------------------------------------------------------------

/**
 * Resolves ShopSettings color/font values into CSS-injectable theme values.
 *
 * @param primaryColor - The vendor's chosen neutral palette
 * @param accentColor - The vendor's chosen accent color
 * @param font - The vendor's chosen font
 * @returns Object with hex strings and font-family CSS value
 *
 * @example
 * const theme = resolveTheme("zinc", "rose", "Inter");
 * // Inject into (store)/layout.tsx:
 * // style={{ "--color-primary": theme.primaryHex, "--color-accent": theme.accentHex }}
 */
export function resolveTheme(
  primaryColor: PrimaryColor,
  accentColor: AccentColor,
  font: FontChoice
): ResolvedTheme {
  const palette = colorMap[primaryColor];
  return {
    primaryHex: palette[900], // darkest shade as the primary color
    accentHex: accentMap[accentColor],
    fontFamily: fontMap[font].cssFamily,
  };
}

// ---------------------------------------------------------------------------
// Default Theme
// ---------------------------------------------------------------------------

/**
 * Default theme used when ShopSettings are not yet configured.
 * Zinc palette + Rose accent + Inter font.
 */
export const defaultTheme: ResolvedTheme = resolveTheme("zinc", "rose", "Inter");
