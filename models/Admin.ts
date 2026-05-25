import mongoose, { Schema, model, models, type Document } from "mongoose";

import bcrypt from "bcryptjs";

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
  comparePassword(candidate: string): Promise<boolean>;
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
// Hooks & Methods
// ---------------------------------------------------------------------------

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

AdminSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

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
