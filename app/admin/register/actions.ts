"use server";

import { dbConnect } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { registerSchema, type RegisterInput } from "./schema";

export async function registerAdmin(data: RegisterInput) {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  await dbConnect();
  
  // Registration lock check
  // Since this is a single-vendor store, only one admin account is allowed.
  const count = await Admin.countDocuments();
  if (count > 0) {
    return { error: "Registration is locked. An admin already exists." };
  }

  try {
    const { name, email, password } = parsed.data;
    
    // The Admin schema pre-save hook handles bcrypt hashing
    await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
    });
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { error: "Email is already registered" };
    }
    return { error: "Failed to create admin" };
  }
}
