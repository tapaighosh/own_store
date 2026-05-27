import { validateImageFile } from "@/lib/blob";

describe("Blob Library", () => {
  describe("validateImageFile", () => {
    it("rejects non-image MIME types", () => {
      const file = new Blob(["text"], { type: "text/plain" }) as File;
      Object.defineProperty(file, 'name', { value: 'test.txt' });
      
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Invalid file type/);
    });

    it("rejects application/pdf", () => {
      const file = new Blob(["pdf"], { type: "application/pdf" }) as File;
      Object.defineProperty(file, 'name', { value: 'test.pdf' });
      
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/Invalid file type/);
    });

    it("rejects files > 4MB", () => {
      const largeContent = new Uint8Array(5 * 1024 * 1024);
      const file = new Blob([largeContent], { type: "image/png" }) as File;
      Object.defineProperty(file, 'name', { value: 'large.png' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 });
      
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/File too large/i);
    });

    it("accepts valid image under 4MB", () => {
      const content = new Uint8Array(1024);
      const file = new Blob([content], { type: "image/jpeg" }) as File;
      Object.defineProperty(file, 'name', { value: 'good.jpg' });
      Object.defineProperty(file, 'size', { value: 1024 });
      
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });
  });
});
