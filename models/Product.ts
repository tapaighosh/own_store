import mongoose, { Schema, model, models, type Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export type ProductStatus = "active" | "draft" | "archived";

export interface IProduct extends Document {
  name: string;
  /** URL-safe identifier, auto-generated from name via slugify */
  slug: string;
  description: string;
  price: number;
  /** Reference to Category document */
  category: Types.ObjectId;
  /** Vercel Blob URLs, maximum 4 images */
  images: string[];
  stock: number;
  /** Threshold below which StockBadge shows "Low Stock" warning */
  lowStockThreshold: number;
  status: ProductStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  readonly isLowStock: boolean;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name must be 200 characters or fewer"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [5000, "Description must be 5000 characters or fewer"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => images.length <= 4,
        message: "A product can have a maximum of 4 images",
      },
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "draft", "archived"] as ProductStatus[],
        message: "Status must be active, draft, or archived",
      },
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "products",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------

ProductSchema.virtual("isLowStock").get(function (this: IProduct) {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ status: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
// Compound index for the most common storefront query: active products by category
ProductSchema.index({ status: 1, category: 1 });
// Text index for search functionality
ProductSchema.index({ name: "text", description: "text" });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * Product model.
 *
 * Notes:
 * - Products are NEVER permanently deleted — use `status: "archived"` instead
 * - Slug must be generated from name via slugify before saving
 * - Images are Vercel Blob URLs (max 4, validated at upload API level too)
 * - Use `.lean()` on read queries for performance
 */
const Product = models.Product ?? model<IProduct>("Product", ProductSchema);

export default Product;
