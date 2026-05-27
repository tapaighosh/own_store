import { GET, PUT } from "@/app/api/settings/route";
import ShopSettings from "@/models/ShopSettings";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn()
}));

describe("Settings API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/settings", () => {
    it("returns defaults if no settings exist", async () => {
      // getOrCreateSettings handles this internally.
      const res = await GET();
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.data.shopName).toBe("My Store");
      expect(json.data.primaryColor).toBe("zinc");
    });
  });

  describe("PUT /api/settings", () => {
    it("updates and returns updated doc", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        shopName: "New Shop Name",
        primaryColor: "slate",
        accentColor: "rose",
        font: "Geist",
        hero: {
          headline: "Welcome",
        },
        footer: {
          socialLinks: {}
        },
        seo: {}
      };
      const req = new Request("http://localhost/api/settings", { method: "PUT", body: JSON.stringify(payload) });
      const res = await PUT(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.data.shopName).toBe("New Shop Name");
      expect(json.data.primaryColor).toBe("slate");
    });

    it("rejects invalid primaryColor (not in enum)", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        shopName: "Store",
        primaryColor: "invalid_color",
        accentColor: "rose",
        font: "Geist",
        hero: { headline: "Hi" }
      };
      
      const req = new Request("http://localhost/api/settings", { method: "PUT", body: JSON.stringify(payload) });
      const res = await PUT(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.details.primaryColor).toBeDefined();
    });

    it("rejects invalid font (not in enum)", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
      
      const payload = {
        shopName: "Store",
        primaryColor: "zinc",
        accentColor: "rose",
        font: "ComicSans", // Invalid
        hero: { headline: "Hi" }
      };
      
      const req = new Request("http://localhost/api/settings", { method: "PUT", body: JSON.stringify(payload) });
      const res = await PUT(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.details.font).toBeDefined();
    });
  });
});
