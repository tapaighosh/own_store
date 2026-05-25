import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/mongodb";
import Admin, { type IAdmin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Types } from "mongoose";

// ---------------------------------------------------------------------------
// Validation Schema
// ---------------------------------------------------------------------------

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ---------------------------------------------------------------------------
// NextAuth Config
// ---------------------------------------------------------------------------

/**
 * NextAuth configuration.
 *
 * Session strategy: JWT (stateless, stored in httpOnly cookie).
 * Session duration: 7 days.
 *
 * Usage in API routes (server-side):
 * ```ts
 * import { getServerSession } from "next-auth";
 * import { authOptions } from "@/lib/auth";
 *
 * const session = await getServerSession(authOptions);
 * if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 * ```
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate input
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = parsed.data;

        await dbConnect();

        // Explicitly select password (it has select: false in schema)
        // Type assertion needed because lean() with .select("+password") loses
        // the password field in TypeScript's view of the schema
        const admin = await Admin.findOne({ email: email.toLowerCase() })
          .select("+password")
          .lean() as (Omit<IAdmin, keyof Document> & { _id: Types.ObjectId; password: string }) | null;

        if (!admin) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

// ---------------------------------------------------------------------------
// NextAuth Type Extension
// ---------------------------------------------------------------------------

// Extend NextAuth's built-in types to include admin id on session.user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
