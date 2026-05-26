"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StockBadge } from "./StockBadge";

interface Product {
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number;
  lowStockThreshold: number;
}

interface ProductCardProps {
  product: Product;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(product.price);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "tween", ease: "easeOut" }}
      className="group relative flex flex-col bg-white dark:bg-[var(--color-primary-950)] rounded-xl overflow-hidden shadow-sm border border-[var(--color-primary-200)] hover:shadow-md transition-shadow"
    >
      <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {product.name}</span>
      </Link>
      
      <div className="relative aspect-square w-full bg-[var(--color-primary-100)] overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-400)]">
            No image
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-medium text-[var(--color-primary-900)] line-clamp-2">
            {product.name}
          </h3>
          <span className="font-semibold text-lg whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>
        
        <div className="mt-auto pt-2">
          <StockBadge 
            stock={product.stock} 
            lowStockThreshold={product.lowStockThreshold} 
          />
        </div>
      </div>
    </motion.div>
  );
}
