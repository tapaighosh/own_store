import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/ShopSettings";

export default async function NotFound() {
  await dbConnect();
  const settings = await getOrCreateSettings();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primary-50)] text-[var(--color-primary-900)]" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="text-center space-y-6 max-w-md p-8 bg-white dark:bg-[var(--color-primary-950)] rounded-xl shadow-sm border border-[var(--color-primary-200)]">
        <h1 className="text-3xl font-bold">{settings.shopName}</h1>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Page Not Found</h2>
          <p className="text-[var(--color-primary-600)]">We couldn&apos;t find the page you&apos;re looking for.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/" 
            className="px-6 py-2 rounded-md bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity font-medium w-full sm:w-auto text-center"
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className="px-6 py-2 rounded-md bg-[var(--color-primary-100)] text-[var(--color-primary-900)] hover:bg-[var(--color-primary-200)] transition-colors font-medium w-full sm:w-auto text-center"
          >
            Products
          </Link>
        </div>
      </div>
    </div>
  );
}
