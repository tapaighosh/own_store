/**
 * TypeScript interfaces for the Category entity.
 */

// ---------------------------------------------------------------------------
// Core Category Type (API Response)
// ---------------------------------------------------------------------------

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Form Types
// ---------------------------------------------------------------------------

export interface CategoryFormData {
  name: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// API Types
// ---------------------------------------------------------------------------

export interface CategoriesListResponse {
  data: Category[];
  total: number;
}
