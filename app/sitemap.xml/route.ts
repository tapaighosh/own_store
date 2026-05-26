import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";

export const revalidate = 3600;

export async function GET() {
  await dbConnect();
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const products = await Product.find({ status: "active" })
    .select("slug updatedAt")
    .lean();

  const productUrls = products.map((product) => `
    <url>
      <loc>${baseUrl}/products/${product.slug}</loc>
      <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>
  `).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}/</loc>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/products</loc>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${baseUrl}/contact</loc>
        <priority>0.7</priority>
      </url>
      ${productUrls}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
