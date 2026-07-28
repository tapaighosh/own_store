import { GET, POST } from "@/app/api/products/route";
import { GET as GET_ONE, PUT, DELETE } from "@/app/api/products/[id]/route";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn()
}));

describe("Products API", () => {
  let categoryId: string;

  beforeEach(async () => {
    // Seed a category for testing
    const cat = await Category.create({ name: "Test Category", slug: "test-cat" });
    categoryId = cat._id.toString();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("returns active and draft products, ignoring archived", async () => {
      await Product.create([
        { name: "Active", slug: "act", price: 10, category: categoryId, images: ["http://example.com/img.jpg"], description: "This is a valid test description", status: "active" },
        { name: "Draft", slug: "drft", price: 10, category: categoryId, images: ["http://example.com/img.jpg"], description: "This is a valid test description", status: "draft" },
        { name: "Archived", slug: "arch", price: 10, category: categoryId, images: ["http://example.com/img.jpg"], description: "This is a valid test description", status: "archived" },
      ]);

      const res = await GET();
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.data.length).toBe(2);
      expect(json.data.find((p: any) => p.name === "Active")).toBeDefined();
      expect(json.data.find((p: any) => p.name === "Draft")).toBeDefined();
      expect(json.data.find((p: any) => p.name === "Archived")).toBeUndefined();
    });
  });

  describe("GET /api/products/[id]", () => {
    it("returns product with category populated", async () => {
      const p = await Product.create({ name: "Single", slug: "sngl", price: 10, category: categoryId, images: ["http://example.com/img.jpg"], description: "This is a valid test description" });
      
      const req = new Request("http://localhost/api/products/" + p._id);
      const res = await GET_ONE(req, { params: Promise.resolve({ id: p._id.toString() }) });
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.data.name).toBe("Single");
      expect(json.data.category.name).toBe("Test Category");
    });
  });

  describe("POST /api/products", () => {
    it("returns 401 when not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce(null);
      
      const req = new Request("http://localhost/api/products", { method: "POST", body: "{}" });
      const res = await POST(req);
      
      expect(res.status).toBe(401);
    });

    it("creates product with auto-generated slug", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        name: "New Product",
        description: "A great product description here",
        price: 99,
        category: categoryId,
        images: ["http://img.com/1.jpg"]
      };
      
      const req = new Request("http://localhost/api/products", { method: "POST", body: JSON.stringify(payload) });
      const res = await POST(req);
      const json = await res.json();
      
      expect(res.status).toBe(201);
      expect(json.data.name).toBe("New Product");
      expect(json.data.slug).toBe("new-product");
    });

    it("rejects missing name (Zod 400)", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        description: "A great product description here",
        price: 99,
        category: categoryId,
        images: ["http://img.com/1.jpg"]
      };
      
      const req = new Request("http://localhost/api/products", { method: "POST", body: JSON.stringify(payload) });
      const res = await POST(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.details.name).toBeDefined();
    });

    it("rejects price <= 0 (Zod 400)", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        name: "Cheap",
        description: "A great product description here",
        price: -5,
        category: categoryId,
        images: ["http://img.com/1.jpg"]
      };
      
      const req = new Request("http://localhost/api/products", { method: "POST", body: JSON.stringify(payload) });
      const res = await POST(req);
      
      expect(res.status).toBe(400);
    });

    it("rejects > 4 images (Zod 400)", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        name: "Many Images",
        description: "A great product description here",
        price: 50,
        category: categoryId,
        images: ["http://img.com/1.jpg", "http://img.com/2.jpg", "http://img.com/3.jpg", "http://img.com/4.jpg", "http://img.com/5.jpg"]
      };
      
      const req = new Request("http://localhost/api/products", { method: "POST", body: JSON.stringify(payload) });
      const res = await POST(req);
      
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/products/[id]", () => {
    it("updates product and returns updated doc", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const p = await Product.create({ name: "To Update", slug: "to-update", price: 10, category: categoryId, images: ["http://example.com/img.jpg"], description: "This is a valid test description" });
      
      const payload = { price: 25 };
      const req = new Request("http://localhost/api/products/" + p._id, { method: "PUT", body: JSON.stringify(payload) });
      const res = await PUT(req, { params: Promise.resolve({ id: p._id.toString() }) });
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.data.price).toBe(25);
      
      const check = await Product.findById(p._id);
      expect(check?.price).toBe(25);
    });
  });

  describe("DELETE /api/products/[id]", () => {
    it("sets status to archived, not hard delete", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      const p = await Product.create({ name: "To Delete", slug: "to-delete", price: 10, category: categoryId, images: ["http://example.com/img.jpg"], description: "This is a valid test description" });
      
      const req = new Request("http://localhost/api/products/" + p._id, { method: "DELETE" });
      const res = await DELETE(req, { params: Promise.resolve({ id: p._id.toString() }) });
      
      expect(res.status).toBe(200);
      
      const check = await Product.findById(p._id);
      expect(check).toBeDefined();
      expect(check?.status).toBe("archived");
    });
  });
});
