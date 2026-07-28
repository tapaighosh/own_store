import { notFound } from "next/navigation";
import Link from "next/link";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getOrCreateSettings } from "@/models/ShopSettings";
import { StockBadge } from "@/components/store/StockBadge";
import { ProductGallery } from "@/components/store/ProductGallery";
import { MessageSquare, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  const product = await Product.findOne({ slug, status: "active" }).lean();
  const settings = await getOrCreateSettings();

  if (!product) {
    return { title: "Product Not Found" };
  }

  const prod = product as any;

  return {
    title: `${prod.name} | ${settings.shopName}`,
    description: prod.description ? prod.description.substring(0, 160) : "",
    openGraph: {
      title: prod.name,
      description: prod.description ? prod.description.substring(0, 160) : "",
      images: prod.images && prod.images[0] ? [prod.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  const productDoc = await Product.findOne({ slug, status: "active" }).lean();

  if (!productDoc) {
    notFound();
  }

  const product = productDoc as any;

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(product.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images && product.images[0] ? product.images[0] : "",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "GBP",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="min-h-screen py-24 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/products"
        className="inline-flex items-center text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-900)] transition-colors w-fit gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        <ProductGallery images={product.images || []} name={product.name} />

        <div className="w-full md:w-1/2 flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-primary-950)] mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-[var(--color-primary-900)]">
              {formattedPrice}
            </p>
          </div>

          <div>
            <StockBadge
              stock={product.stock}
              lowStockThreshold={product.lowStockThreshold || 5}
            />
          </div>

          <div className="prose prose-zinc max-w-none text-[var(--color-primary-700)]">
            <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
          </div>

          <div className="pt-4 border-t border-[var(--color-primary-200)]">
            {product.stock > 0 ? (
              <Link
                href="/contact"
                className="w-full py-4 px-6 rounded-full bg-[var(--color-accent)] text-white font-medium text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-5 h-5" />
                Inquire / Order via Contact
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-4 px-6 rounded-full bg-zinc-300 dark:bg-zinc-800 text-zinc-500 font-medium text-lg cursor-not-allowed text-center"
              >
                Currently Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
