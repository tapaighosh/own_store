/**
 * TypeScript interfaces for the Product entity.
 *
 * These are used for API responses, component props, and form data.
 * Separate from the Mongoose IProduct model interface.
 */

// ---------------------------------------------------------------------------
// Enums / Union Types
// ---------------------------------------------------------------------------

export type ProductStatus = "active" | "draft" | "archived";

// ---------------------------------------------------------------------------
// Core Product Type (API Response)
// ---------------------------------------------------------------------------

/**
 * Product as returned from the API — ObjectId fields are serialized to strings.
 * The `category` field is populated (contains category name + slug).
 */
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: PopulatedCategory;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product with category as a raw ObjectId string (not populated).
 * Used in admin forms and when creating/updating products.
 */
export interface ProductRaw {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string; // ObjectId as string
  images: string[];
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Populated Types
// ---------------------------------------------------------------------------

/** Minimal category data embedded in a product response */
export interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Stock Status Helpers
// ---------------------------------------------------------------------------

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

/**
 * Derive stock status from product fields.
 * Used by StockBadge component.
 */
export function getStockStatus(product: Pick<Product, "stock" | "lowStockThreshold">): StockStatus {
  if (product.stock === 0) return "out-of-stock";
  if (product.stock <= product.lowStockThreshold) return "low-stock";
  return "in-stock";
}

// ---------------------------------------------------------------------------
// Form Types
// ---------------------------------------------------------------------------

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  featured: boolean;
}

// ---------------------------------------------------------------------------
// API Types
// ---------------------------------------------------------------------------

export interface ProductsListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  status?: ProductStatus;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "oldest";
}
