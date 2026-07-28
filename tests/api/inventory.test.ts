import { GET, PUT } from "@/app/api/inventory/route";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn()
}));

describe("Inventory API", () => {
  let prod1Id: string;
  let prod2Id: string;

  beforeEach(async () => {
    const p1 = await Product.create({ name: "P1", slug: "p1", price: 10, stock: 5, lowStockThreshold: 10, images: ["http://example.com/img.jpg"], description: "This is a valid test description", category: "000000000000000000000000", status: "active" });
    const p2 = await Product.create({ name: "P2", slug: "p2", price: 10, stock: 20, lowStockThreshold: 10, images: ["http://example.com/img.jpg"], description: "This is a valid test description", category: "000000000000000000000000", status: "draft" });
    await Product.create({ name: "P3", slug: "p3", price: 10, stock: 20, lowStockThreshold: 10, images: ["http://example.com/img.jpg"], description: "This is a valid test description", category: "000000000000000000000000", status: "archived" });
    
    prod1Id = p1._id.toString();
    prod2Id = p2._id.toString();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/inventory", () => {
    it("returns all non-archived products with stock fields", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const res = await GET();
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.length).toBe(2); // P1 and P2
      expect(json.find((p: any) => p.name === "P1")).toBeDefined();
      expect(json.find((p: any) => p.name === "P3")).toBeUndefined();
    });
  });

  describe("PUT /api/inventory", () => {
    it("updates multiple products in one call", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const payload = {
        updates: [
          { id: prod1Id, stock: 100, lowStockThreshold: 50 },
          { id: prod2Id, stock: 200, lowStockThreshold: 50 },
        ]
      };
      const req = new NextRequest("http://localhost/api/inventory", { method: "PUT", body: JSON.stringify(payload) });
      const res = await PUT(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.updated).toBe(2);
      
      const check = await Product.findById(prod1Id);
      expect(check?.stock).toBe(100);
    });

    it("rejects negative stock values", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const payload = {
        updates: [
          { id: prod1Id, stock: -5, lowStockThreshold: 50 },
        ]
      };
      const req = new NextRequest("http://localhost/api/inventory", { method: "PUT", body: JSON.stringify(payload) });
      const res = await PUT(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.details.updates).toBeDefined();
    });
  });
});
