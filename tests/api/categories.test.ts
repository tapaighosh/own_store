import { GET, POST } from "@/app/api/categories/route";
import { PUT, DELETE } from "@/app/api/categories/[id]/route";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn()
}));

describe("Categories API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("returns all categories sorted by name", async () => {
      await Category.create([
        { name: "Zebra", slug: "zebra" },
        { name: "Apple", slug: "apple" },
        { name: "Mango", slug: "mango" },
      ]);

      const res = await GET();
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.length).toBe(3);
      expect(json[0].name).toBe("Apple");
      expect(json[1].name).toBe("Mango");
      expect(json[2].name).toBe("Zebra");
    });
  });

  describe("POST /api/categories", () => {
    it("creates with unique slug", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = { name: "New Category", description: "Test" };
      const req = new NextRequest("http://localhost/api/categories", { method: "POST", body: JSON.stringify(payload) });
      const res = await POST(req);
      const json = await res.json();
      
      expect(res.status).toBe(201);
      expect(json.name).toBe("New Category");
      expect(json.slug).toBe("new-category");
    });

    it("rejects invalid input (400)", async () => {
      (getServerSession as jest.Mock).mockResolvedValue({ user: { name: "Admin" } });
      
      const payload = { description: "Missing name" };
      const req = new NextRequest("http://localhost/api/categories", { method: "POST", body: JSON.stringify(payload) });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/categories/[id]", () => {
    it("fails with 400 if products reference this category", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const cat = await Category.create({ name: "Used Cat", slug: "used-cat" });
      await Product.create({ name: "Prod", slug: "prod", price: 10, category: cat._id, images: ["http://example.com/img.jpg"], description: "This is a valid test description" });
      
      const req = new NextRequest("http://localhost/api/categories/" + cat._id, { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: cat._id.toString() }) });
      
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Cannot delete");
    });

    it("succeeds if no products reference it", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const cat = await Category.create({ name: "Unused Cat", slug: "unused-cat" });
      
      const req = new NextRequest("http://localhost/api/categories/" + cat._id, { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: cat._id.toString() }) });
      
      expect(res.status).toBe(200);
      const check = await Category.findById(cat._id);
      expect(check).toBeNull();
    });
  });
});
