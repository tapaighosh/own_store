import Link from "next/link";
import Image from "next/image";
import { Plus, PackageOpen, AlertTriangle } from "lucide-react";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductListActions } from "@/components/admin/ProductListActions";

async function getProducts() {
  await dbConnect();
  // Using simple population here. Category model existence is required.
  const products = await Product.find({ status: { $ne: "archived" } })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store inventory, pricing, and visibility.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] border border-dashed rounded-lg bg-zinc-50 dark:bg-zinc-900/20 px-4">
          <PackageOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No products yet</h2>
          <p className="text-zinc-500 mb-6 text-center max-w-sm">
            You haven&apos;t added any products to your store. Add your first product to start selling.
          </p>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add your first product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden bg-white dark:bg-zinc-950">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => {
                const isLowStock = product.stock <= product.lowStockThreshold;

                return (
                  <TableRow key={product._id.toString()}>
                    <TableCell>
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <PackageOpen className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                      {product.featured && (
                        <span className="ml-2 text-xs font-normal text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 px-1.5 py-0.5 rounded-sm">
                          Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell>
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.stock}</span>
                        {isLowStock && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" aria-label="Low stock warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.status === "active" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <ProductListActions productId={product._id.toString()} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
