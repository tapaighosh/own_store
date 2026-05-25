import { dbConnect } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { redirect } from "next/navigation";
import { RegisterForm } from "./RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  await dbConnect();
  
  // Registration lock mechanism:
  // Since this is a single-vendor store, only one admin account should exist.
  // We check if any admins exist, and if so, we lock the registration page 
  // by redirecting to login. This prevents unauthorized users from 
  // navigating to /admin/register and taking over the store.
  const count = await Admin.countDocuments();
  if (count > 0) {
    redirect("/admin/login?message=Setup%20complete");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4">
      <RegisterForm />
    </div>
  );
}
