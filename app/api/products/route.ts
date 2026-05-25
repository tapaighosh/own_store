import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import slugify from "slugify";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import { productCreateSchema } from "@/lib/validators/product";

export async function GET() {
  try {
    await dbConnect();
    // In a real application with a Category model we would populate "category".
    // Using simple population here; ensure Category model exists if this errors.
    const products = await Product.find({ status: { $ne: "archived" } })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const baseSlug = slugify(parsed.data.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 2;

    // Handle slug collisions
    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await Product.create({ ...parsed.data, slug });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
