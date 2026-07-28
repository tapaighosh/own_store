import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getOrCreateSettings } from "@/models/ShopSettings";
import { ProductsCatalog } from "./ProductsCatalog";

export async function generateMetadata() {
  await dbConnect();
  const settings = await getOrCreateSettings();
  return {
    title: `All Products | ${settings.shopName}`,
    description: `Browse our full collection of products at ${settings.shopName}.`,
  };
}

export default async function AllProductsPage() {
  await dbConnect();

  const [productsRaw, categoriesRaw] = await Promise.all([
    Product.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  const serializedProducts = productsRaw.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    category: p.category ? p.category.toString() : "",
    images: p.images || [],
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold || 5,
    featured: Boolean(p.featured),
  }));

  const serializedCategories = categoriesRaw.map((c: any) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-primary-950)]">
          All Products
        </h1>
        <p className="text-[var(--color-primary-600)] mt-2 text-base">
          Explore our complete collection of products.
        </p>
      </div>

      <ProductsCatalog
        initialProducts={serializedProducts}
        categories={serializedCategories}
      />
    </main>
  );
}
