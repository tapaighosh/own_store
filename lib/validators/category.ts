import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Maximum 50 characters"),
  description: z.string().max(200, "Maximum 200 characters").optional().or(z.literal("")),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
