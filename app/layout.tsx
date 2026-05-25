import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Own Store",
    template: "%s | Own Store",
  },
  description: "Your personal online storefront.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

/**
 * Root layout — wraps every route (store + admin).
 *
 * Inter is loaded here as the default font. The (store) layout will
 * dynamically override --font-sans based on shop_settings.font.
 *
 * The dark background here ensures there is no flash of white
 * while the store layout loads vendor theme variables.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950`}>
        {children}
      </body>
    </html>
  );
}
