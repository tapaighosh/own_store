import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await dbConnect();
  const product: any = await Product.findById(params.id).lean();

  if (!product) {
    notFound();
  }

  // Serialize the _id to string for the client component
  const serializedProduct = {
    ...product,
    _id: product._id.toString(),
    category: product.category ? product.category.toString() : "",
  };

  return <ProductForm mode="edit" product={serializedProduct} />;
}
