import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
  lowStockThreshold: number;
}

export interface CategoryBreakdown {
  categoryName: string;
  count: number;
}

// Graphify-compatible shape: { totalProducts: number, activeProducts: number, draftProducts: number, lowStockProducts: number, outOfStockProducts: number, totalCategories: number }
export async function getDashboardStats(): Promise<DashboardStats> {
  await dbConnect();
  
  const [
    totalProducts,
    activeProducts,
    draftProducts,
    lowStockProducts,
    outOfStockProducts,
    totalCategories,
  ] = await Promise.all([
    Product.countDocuments({ status: { $ne: "archived" } }),
    Product.countDocuments({ status: "active" }),
    Product.countDocuments({ status: "draft" }),
    // Need to use aggregation to compare two fields (stock <= lowStockThreshold)
    Product.aggregate([
      { $match: { status: { $ne: "archived" }, stock: { $gt: 0 } } },
      { $match: { $expr: { $lte: ["$stock", "$lowStockThreshold"] } } },
      { $count: "count" }
    ]).then(res => res[0]?.count || 0),
    Product.countDocuments({ status: { $ne: "archived" }, stock: 0 }),
    Category.countDocuments(),
  ]);

  return {
    totalProducts,
    activeProducts,
    draftProducts,
    lowStockProducts,
    outOfStockProducts,
    totalCategories,
  };
}

// Graphify-compatible shape: Array<{ id: string, name: string, slug: string, stock: number, lowStockThreshold: number }>
export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  await dbConnect();

  const products = await Product.aggregate([
    { $match: { status: { $ne: "archived" }, stock: { $gt: 0 } } },
    { $match: { $expr: { $lte: ["$stock", "$lowStockThreshold"] } } },
    { $sort: { stock: 1 } },
    { $project: { _id: 1, name: 1, slug: 1, stock: 1, lowStockThreshold: 1 } }
  ]);

  return products.map(p => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
  }));
}

// Graphify-compatible shape: Array<{ categoryName: string, count: number }>
export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  await dbConnect();

  const breakdown = await Product.aggregate([
    { $match: { status: { $ne: "archived" } } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryDoc"
      }
    },
    { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        categoryName: { $ifNull: ["$categoryDoc.name", "Uncategorized"] },
        count: 1,
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);

  return breakdown;
}
