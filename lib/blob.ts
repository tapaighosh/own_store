import { put, del } from "@vercel/blob";

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Uploads a file to Vercel Blob and returns its public URL.
 *
 * Validates:
 * - MIME type must be image/*
 * - File size must be ≤ 4MB
 *
 * @param file - The File object from FormData
 * @param folder - Optional folder prefix (e.g., "products", "logos")
 * @returns The Vercel Blob public URL
 * @throws Error if validation fails
 *
 * @example
 * const url = await uploadImage(file, "products");
 */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  // Validate MIME type
  if (!file.type.startsWith("image/")) {
    throw new Error(`Invalid file type: ${file.type}. Only images are allowed.`);
  }

  // Validate file size (4MB max)
  const MAX_SIZE = 4 * 1024 * 1024; // 4MB in bytes
  if (file.size > MAX_SIZE) {
    throw new Error(
      `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum is 4MB.`
    );
  }

  const filename = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Deletes a file from Vercel Blob by its URL.
 *
 * @param url - The Vercel Blob URL to delete
 * @example
 * await deleteImage("https://xxx.public.blob.vercel-storage.com/products/image.jpg");
 */
export async function deleteImage(url: string): Promise<void> {
  await del(url);
}
