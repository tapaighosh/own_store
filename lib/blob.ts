import { put, del } from "@vercel/blob";

/**
 * Validates an image file for MIME type and size.
 *
 * @param file - The File object to validate
 * @returns An object indicating if the file is valid, and an error message if not
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Invalid file type. Only images are allowed." };
  }

  const MAX_SIZE = 4 * 1024 * 1024; // 4MB in bytes
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 4MB.`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a file to Vercel Blob and returns its public URL.
 *
 * @param file - The File or Buffer object to upload
 * @param filename - The original filename
 * @param folder - Folder prefix (e.g., "products", "logos")
 * @returns The Vercel Blob public URL
 */
export async function uploadToBlob(
  file: File | Buffer,
  filename: string,
  folder: string
): Promise<string> {
  const path = `${folder}/${Date.now()}-${filename.replace(/\s+/g, "-")}`;

  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url;
}

/**
 * Deletes a file from Vercel Blob by its URL.
 * Handles 404 gracefully if the file is already deleted or doesn't exist.
 *
 * @param url - The Vercel Blob URL to delete
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error: any) {
    // Vercel Blob throws an error if the blob is not found.
    // We catch it and ignore it to handle 404 gracefully.
    if (error.message && error.message.includes("BlobNotFoundError")) {
      console.warn(`Blob not found, skipping delete: ${url}`);
      return;
    }
    // Re-throw other unexpected errors
    throw error;
  }
}
