import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Category from "@/models/Category";
import { categoryCreateSchema } from "@/lib/validators/category";
import slugify from "slugify";

export async function GET() {
  try {
    await dbConnect();
    // Public route - no session required
    const categories = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = categoryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    // Auto-generate slug
    const baseSlug = slugify(parsed.data.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 2;

    while (await Category.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const category = await Category.create({
      ...parsed.data,
      slug,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Categories POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
