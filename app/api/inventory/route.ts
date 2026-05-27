import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { z } from "zod";

const inventoryUpdateSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().min(1, "ID is required"),
      stock: z.number().int().min(0, "Stock cannot be negative"),
      lowStockThreshold: z.number().int().min(1, "Threshold must be positive"),
    })
  ),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Preload Category model to ensure it's registered before populate
    Category.init();

    const inventory = await Product.find({ status: { $ne: "archived" } })
      .select("name slug stock lowStockThreshold status category")
      .populate("category", "name")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Inventory GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = inventoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();

    const updates = parsed.data.updates;

    await Promise.all(
      updates.map((u) =>
        Product.findByIdAndUpdate(u.id, {
          stock: u.stock,
          lowStockThreshold: u.lowStockThreshold,
        })
      )
    );

    return NextResponse.json({ updated: updates.length });
  } catch (error) {
    console.error("Inventory PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to bulk update inventory" },
      { status: 500 }
    );
  }
}
