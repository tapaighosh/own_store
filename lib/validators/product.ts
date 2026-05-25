import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Maximum 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Maximum 2000 characters"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  images: z.array(z.string().url("Must be a valid URL")).min(1, "At least one image is required").max(4, "Maximum 4 images"),
  stock: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().positive().default(5),
  status: z.enum(["active", "draft", "archived"]).default("draft"),
  featured: z.boolean().default(false),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
