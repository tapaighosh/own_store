import { Schema, model, models, type Document } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface ICategory extends Document {
  name: string;
  /** URL-safe identifier, auto-generated from name via slugify */
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name must be 100 characters or fewer"],
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
      trim: true,
      maxlength: [500, "Description must be 500 characters or fewer"],
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

CategorySchema.index({ name: 1 });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * Category model.
 *
 * Notes:
 * - Slug must be generated from name via slugify before saving
 * - Description is optional
 * - Deleting a category should check for associated products first
 */
const Category =
  models.Category ?? model<ICategory>("Category", CategorySchema);

export default Category;
