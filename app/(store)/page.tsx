import { dbConnect } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/ShopSettings";
import Product from "@/models/Product";
import { Hero } from "@/components/store/Hero";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Footer } from "@/components/store/Footer";

export default async function StorefrontPage() {
  await dbConnect();
  
  const [settings, featuredProducts] = await Promise.all([
    getOrCreateSettings(),
    Product.find({ status: "active", featured: true }).limit(8).lean(),
  ]);

  // Map Mongoose documents to plain objects for client components
  const serializedProducts = featuredProducts.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    images: p.images,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
  }));

  const serializedSettings = {
    shopName: settings.shopName,
    logo: settings.logo,
    footer: {
      description: settings.footer.description,
      email: settings.footer.email,
      phone: settings.footer.phone,
      address: settings.footer.address,
      socialLinks: {
        instagram: settings.footer.socialLinks.instagram,
        facebook: settings.footer.socialLinks.facebook,
        twitter: settings.footer.socialLinks.twitter,
      },
    },
  };

  return (
    <>
      <main className="min-h-screen pt-16">
        <Hero 
          headline={settings.hero.headline} 
          subheadline={settings.hero.subheadline}
          backgroundImage={settings.hero.backgroundImage}
        />
        
        <ProductGrid products={serializedProducts} title="Featured Products" />
      </main>
      <Footer settings={serializedSettings} />
    </>
  );
}
