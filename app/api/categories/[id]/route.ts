import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { categoryUpdateSchema } from "@/lib/validators/category";
import slugify from "slugify";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = categoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: any = { ...parsed.data };

    if (parsed.data.name) {
      const baseSlug = slugify(parsed.data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 2;

      // Check if slug exists but isn't the current category
      while (await Category.exists({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Category PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${productCount} product(s) use this category` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Category DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
