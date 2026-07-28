"use client";

import { useState, useMemo } from "react";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Search, SlidersHorizontal } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string; // category ID
  images: string[];
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
}

interface ProductsCatalogProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductsCatalog({
  initialProducts,
  categories,
}: ProductsCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch =
          search.trim() === "" ||
          p.name.toLowerCase().includes(search.toLowerCase().trim());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        // Default: featured first, then newest
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [initialProducts, search, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-[var(--color-primary-950)] p-4 rounded-xl border border-[var(--color-primary-200)] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-primary-400)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] border border-[var(--color-primary-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary-900)]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-primary-500)] hidden sm:inline-block" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] border border-[var(--color-primary-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary-900)] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] border border-[var(--color-primary-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary-900)] cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-[var(--color-primary-500)] px-1">
        Showing {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
