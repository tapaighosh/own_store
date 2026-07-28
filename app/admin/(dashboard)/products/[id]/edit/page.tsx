import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductRaw } from "@/types/Product.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  await dbConnect();

  const productDoc = await Product.findById(id).lean();

  if (!productDoc) {
    notFound();
  }

  const product = productDoc as any;

  // Serialize the document fields into a clean ProductRaw object
  const serializedProduct: ProductRaw = {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category ? product.category.toString() : "",
    images: product.images || [],
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold || 5,
    status: product.status,
    featured: Boolean(product.featured),
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
  };

  return <ProductForm mode="edit" product={serializedProduct} />;
}
