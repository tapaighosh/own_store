import mongoose, { Schema, model, models, type Document } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IAdmin extends Document {
  name: string;
  email: string;
  /** bcrypt hash — never returned in API responses */
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      maxlength: [100, "Name must be 100 characters or fewer"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      // Never return password in queries
      select: false,
    },
  },
  {
    timestamps: true,
    collection: "admins",
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

AdminSchema.index({ email: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/**
 * Admin model.
 *
 * Security notes:
 * - `password` field has `select: false` — always explicitly select it when needed:
 *   `Admin.findOne({ email }).select("+password")`
 * - Hash passwords with bcryptjs (≥12 salt rounds) before saving
 * - One admin per deployment (registration lock after first admin is created)
 */
const Admin = models.Admin ?? model<IAdmin>("Admin", AdminSchema);

export default Admin;
