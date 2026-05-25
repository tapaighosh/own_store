/**
 * Store group layout — wraps all public storefront routes.
 *
 * Responsibilities:
 * 1. Fetch shop_settings from DB (Server Component — runs at request time or cached)
 * 2. Inject CSS custom properties for vendor theme (primaryColor, accentColor, font)
 * 3. Initialize Lenis smooth scroll (in a client component wrapper)
 * 4. Render Navbar and Footer around all store pages
 *
 * This layout is implemented fully in Module 3 (Store Frontend).
 * The placeholder below allows the app to run during Module 0 setup.
 */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
