/**
 * Admin group layout — wraps all protected admin routes.
 *
 * Responsibilities:
 * 1. Check NextAuth session on the server — redirect to login if unauthenticated
 * 2. Render Sidebar + main content area with proper layout structure
 * 3. Provide Toaster for admin notifications
 *
 * This layout is implemented in Module 2 (Admin Dashboard).
 * The placeholder below allows the app to run during Module 0 setup.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
