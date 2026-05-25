import { Schema, model, models, type Document } from "mongoose";

// ---------------------------------------------------------------------------
// Sub-schemas
// ---------------------------------------------------------------------------

const HeroSchema = new Schema(
  {
    headline: {
      type: String,
      default: "Welcome to our store",
      maxlength: [200, "Headline must be 200 characters or fewer"],
    },
    subheadline: {
      type: String,
      default: "",
      maxlength: [400, "Subheadline must be 400 characters or fewer"],
    },
    backgroundImage: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema(
  {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
  { _id: false }
);

const FooterSchema = new Schema(
  {
    description: {
      type: String,
      default: "",
      maxlength: [500, "Footer description must be 500 characters or fewer"],
    },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  },
  { _id: false }
);

const SeoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      default: "",
      maxlength: [60, "Meta title must be 60 characters or fewer"],
    },
    metaDescription: {
      type: String,
      default: "",
      maxlength: [160, "Meta description must be 160 characters or fewer"],
    },
  },
  { _id: false }
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PrimaryColor = "slate" | "stone" | "zinc" | "neutral" | "warm-gray";
export type AccentColor = "rose" | "amber" | "sky" | "emerald";
export type FontChoice = "Inter" | "Geist" | "Nunito" | "Lato";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IShopSettings extends Document {
  shopName: string;
  /** Vercel Blob URL for the shop logo */
  logo: string;
  primaryColor: PrimaryColor;
  accentColor: AccentColor;
  font: FontChoice;
  hero: {
    headline: string;
    subheadline: string;
    backgroundImage: string;
  };
  footer: {
    description: string;
    email: string;
    phone: string;
    address: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const ShopSettingsSchema = new Schema<IShopSettings>(
  {
    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      maxlength: [100, "Shop name must be 100 characters or fewer"],
    },
    logo: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      enum: {
        values: ["slate", "stone", "zinc", "neutral", "warm-gray"] as PrimaryColor[],
        message: "Invalid primary color choice",
      },
      default: "zinc",
    },
    accentColor: {
      type: String,
      enum: {
        values: ["rose", "amber", "sky", "emerald"] as AccentColor[],
        message: "Invalid accent color choice",
      },
      default: "rose",
    },
    font: {
      type: String,
      enum: {
        values: ["Inter", "Geist", "Nunito", "Lato"] as FontChoice[],
        message: "Invalid font choice",
      },
      default: "Inter",
    },
    hero: { type: HeroSchema, default: () => ({}) },
    footer: { type: FooterSchema, default: () => ({}) },
    seo: { type: SeoSchema, default: () => ({}) },
  },
  {
    timestamps: true,
    collection: "shop_settings",
  }
);

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * ShopSettings model — singleton document per database.
 *
 * Usage pattern (always upsert, never insert):
 * ```ts
 * const settings = await ShopSettings.findOneAndUpdate(
 *   {},
 *   { $set: updateData },
 *   { upsert: true, new: true, runValidators: true }
 * ).lean();
 * ```
 *
 * To read settings:
 * ```ts
 * const settings = await ShopSettings.findOne({}).lean();
 * ```
 */
const ShopSettings =
  models.ShopSettings ??
  model<IShopSettings>("ShopSettings", ShopSettingsSchema);

export default ShopSettings;
