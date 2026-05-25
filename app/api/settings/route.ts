import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import ShopSettings, { getOrCreateSettings } from "@/models/ShopSettings";
import { settingsSchema } from "@/lib/validators/settings";

function sanitizeSettings(doc: any) {
  if (!doc) return doc;
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

export async function GET() {
  try {
    await dbConnect();
    // Use getOrCreateSettings to guarantee defaults exist
    const settingsDoc = await getOrCreateSettings();
    
    // Convert to plain object if it's a mongoose document
    const data = typeof settingsDoc.toObject === "function" 
      ? settingsDoc.toObject() 
      : settingsDoc;

    return NextResponse.json({ data: sanitizeSettings(data) }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      // You could map the Zod errors here to a string, but the user requested inline errors 
      // which we will handle on the client. For the API, we return a general error or the first issue.
      return NextResponse.json(
        { error: "Invalid configuration data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await ShopSettings.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ data: sanitizeSettings(updated) }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
