import { notFound } from "next/navigation";
import Image from "next/image";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getOrCreateSettings } from "@/models/ShopSettings";
import { StockBadge } from "@/components/store/StockBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  const product = (await Product.findOne({ slug, status: "active" }).lean()) as any;
  const settings = (await getOrCreateSettings()) as any;

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | ${settings.shopName}`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  await dbConnect();
  const product = (await Product.findOne({ slug, status: "active" }).lean()) as any;

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(product.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0] || "",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "GBP",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="min-h-screen py-24 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="w-full md:w-1/2 aspect-square relative bg-[var(--color-primary-100)] rounded-2xl overflow-hidden border border-[var(--color-primary-200)]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-400)]">
            No image available
          </div>
        )}
      </div>

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
          <StockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
        </div>

        <div className="prose prose-zinc max-w-none text-[var(--color-primary-700)]">
          <p className="whitespace-pre-wrap">{product.description}</p>
        </div>

        <button 
          className="w-full py-4 rounded-full bg-[var(--color-accent)] text-white font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </main>
  );
}
