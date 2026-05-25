import { z } from "zod";

export const settingsSchema = z.object({
  shopName: z.string().min(1, "Shop name is required").max(60, "Maximum 60 characters"),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  primaryColor: z.enum(["slate", "stone", "zinc", "neutral", "warm-gray"]),
  accentColor: z.enum(["rose", "amber", "sky", "emerald"]),
  font: z.enum(["Inter", "Geist", "Nunito", "Lato"]),
  hero: z.object({
    headline: z.string().min(1, "Headline is required").max(80, "Maximum 80 characters"),
    subheadline: z.string().max(160, "Maximum 160 characters").optional().or(z.literal("")),
    backgroundImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
  footer: z.object({
    description: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    socialLinks: z.object({
      instagram: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      facebook: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    }),
  }),
  seo: z.object({
    metaTitle: z.string().max(60, "Maximum 60 characters").optional().or(z.literal("")),
    metaDescription: z.string().max(160, "Maximum 160 characters").optional().or(z.literal("")),
  }),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
