import { POST } from "@/app/api/upload/route";
import { getServerSession } from "next-auth";
import * as blobLib from "@/lib/blob";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn()
}));

describe("Upload API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    
    const formData = new FormData();
    const req = new Request("http://localhost/api/upload", { method: "POST", body: formData });
    
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("validates MIME type (reject application/pdf)", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
    
    const formData = new FormData();
    // In Node test environment, File might not be fully standard, but we can simulate a Blob
    const file = new Blob(["pdf content"], { type: "application/pdf" });
    // @ts-ignore
    file.name = "test.pdf";
    
    formData.append("file", file as any);
    
    const req = new Request("http://localhost/api/upload", { method: "POST", body: formData });
    const res = await POST(req);
    const json = await res.json();
    
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Invalid file type/i);
  });

  it("validates file size (reject > 4MB)", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
    
    const formData = new FormData();
    // Simulate a 5MB file
    const largeContent = new Uint8Array(5 * 1024 * 1024);
    const file = new Blob([largeContent], { type: "image/jpeg" });
    // @ts-ignore
    file.name = "large.jpg";
    
    formData.append("file", file as any);
    
    const req = new Request("http://localhost/api/upload", { method: "POST", body: formData });
    const res = await POST(req);
    const json = await res.json();
    
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/File too large/i);
  });

  it("uploads successfully if valid", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { name: "Admin" } });
    
    // Mock the upload to bypass Vercel Blob
    jest.spyOn(blobLib, "uploadToBlob").mockResolvedValueOnce("http://example.com/uploaded.jpg");
    
    const formData = new FormData();
    const content = new Uint8Array(1024);
    const file = new Blob([content], { type: "image/jpeg" });
    // @ts-ignore
    file.name = "test.jpg";
    
    formData.append("file", file as any);
    
    const req = new Request("http://localhost/api/upload", { method: "POST", body: formData });
    const res = await POST(req);
    const json = await res.json();
    
    expect(res.status).toBe(200);
    expect(json.url).toBe("http://example.com/uploaded.jpg");
  });
});
