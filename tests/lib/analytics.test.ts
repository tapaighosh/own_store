import { getDashboardStats, getLowStockProducts, getCategoryBreakdown } from "@/lib/analytics";
import Product from "@/models/Product";
import Category from "@/models/Category";

describe("Analytics Library", () => {
  let cat1Id: string;
  let cat2Id: string;

  beforeEach(async () => {
    const cat1 = await Category.create({ name: "Cat 1", slug: "cat-1" });
    const cat2 = await Category.create({ name: "Cat 2", slug: "cat-2" });
    
    cat1Id = cat1._id.toString();
    cat2Id = cat2._id.toString();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe("getDashboardStats", () => {
    it("returns correct counts with seeded data", async () => {
      await Product.create([
        { name: "P1", slug: "p1", price: 10, category: cat1Id, status: "active", stock: 10, lowStockThreshold: 5, images: ["i"], description: "test desc" },
        { name: "P2", slug: "p2", price: 10, category: cat1Id, status: "draft", stock: 3, lowStockThreshold: 5, images: ["i"], description: "test desc" },
        { name: "P3", slug: "p3", price: 10, category: cat2Id, status: "active", stock: 0, lowStockThreshold: 5, images: ["i"], description: "test desc" },
        { name: "P4", slug: "p4", price: 10, category: cat2Id, status: "archived", stock: 100, lowStockThreshold: 5, images: ["i"], description: "test desc" },
      ]);

      const stats = await getDashboardStats();
      
      expect(stats.totalProducts).toBe(3); // P1, P2, P3
      expect(stats.activeProducts).toBe(2); // P1, P3
      expect(stats.draftProducts).toBe(1); // P2
      expect(stats.lowStockProducts).toBe(1); // P2
      expect(stats.outOfStockProducts).toBe(1); // P3
      expect(stats.totalCategories).toBe(2);
    });
  });

  describe("getLowStockProducts", () => {
    it("returns only products at or below threshold", async () => {
      await Product.create([
        { name: "P1", slug: "p1", price: 10, category: cat1Id, status: "active", stock: 10, lowStockThreshold: 5, images: ["i"], description: "test desc" }, // ok
        { name: "P2", slug: "p2", price: 10, category: cat1Id, status: "active", stock: 5, lowStockThreshold: 5, images: ["i"], description: "test desc" }, // low
        { name: "P3", slug: "p3", price: 10, category: cat2Id, status: "active", stock: 0, lowStockThreshold: 5, images: ["i"], description: "test desc" }, // out of stock (ignored by getLowStockProducts if stock=0? The query says { stock: { $gt: 0 } }, let's check)
      ]);

      const lowStock = await getLowStockProducts();
      
      expect(lowStock.length).toBe(1);
      expect(lowStock[0].name).toBe("P2");
    });
  });

  describe("getCategoryBreakdown", () => {
    it("returns correct count per category", async () => {
      await Product.create([
        { name: "P1", slug: "p1", price: 10, category: cat1Id, status: "active", stock: 10, lowStockThreshold: 5, images: ["i"], description: "test desc" },
        { name: "P2", slug: "p2", price: 10, category: cat1Id, status: "active", stock: 5, lowStockThreshold: 5, images: ["i"], description: "test desc" },
        { name: "P3", slug: "p3", price: 10, category: cat2Id, status: "active", stock: 0, lowStockThreshold: 5, images: ["i"], description: "test desc" },
      ]);

      const breakdown = await getCategoryBreakdown();
      
      // Sorts by count -1
      expect(breakdown.length).toBe(2);
      expect(breakdown[0].categoryName).toBe("Cat 1");
      expect(breakdown[0].count).toBe(2);
      expect(breakdown[1].categoryName).toBe("Cat 2");
      expect(breakdown[1].count).toBe(1);
    });
  });
});
