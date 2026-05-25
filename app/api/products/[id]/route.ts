import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import slugify from "slugify";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { productUpdateSchema } from "@/lib/validators/product";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).populate("category").lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updateData: any = { ...parsed.data };

    // Regenerate slug if name is changed
    if (parsed.data.name) {
      const baseSlug = slugify(parsed.data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 2;

      // Ensure slug uniqueness excluding the current product
      while (await Product.exists({ slug, _id: { $ne: params.id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    const updated = await Product.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Soft delete by archiving
    const archived = await Product.findByIdAndUpdate(
      params.id,
      { $set: { status: "archived" } },
      { new: true }
    );

    if (!archived) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product archived successfully" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
