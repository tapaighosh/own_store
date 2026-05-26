"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { PackageOpen } from "lucide-react";

interface Product {
  _id?: any;
  id?: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  lowStockThreshold: number;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {title && (
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-primary-900)]">
            {title}
          </h2>
          <div className="h-1 w-12 bg-[var(--color-accent)] mx-auto mt-4 rounded-full" />
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-primary-500)] bg-[var(--color-primary-50)] rounded-2xl border border-dashed border-[var(--color-primary-200)]">
          <PackageOpen className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No products available</p>
          <p className="text-sm mt-1">Check back later for new arrivals.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard key={product.id || product._id?.toString() || product.slug} product={product as any} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
