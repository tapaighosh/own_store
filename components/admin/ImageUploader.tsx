"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";
import { validateImageFile } from "@/lib/blob";

interface ImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export function ImageUploader({
  currentUrl,
  onUpload,
  label,
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processFile(file);
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    await processFile(file);
  };

  const processFile = async (file: File) => {
    setError(null);

    // Client-side validation
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      onUpload(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400
          ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed bg-zinc-50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800"
              : "cursor-pointer bg-zinc-50 border-zinc-300 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
          }
          ${error ? "border-red-500 bg-red-50 dark:bg-red-950/20" : ""}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading) {
            fileInputRef.current?.click();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && !isUploading) {
              fileInputRef.current?.click();
            }
          }
        }}
        role="button"
        tabIndex={disabled || isUploading ? -1 : 0}
        aria-label={label || "Upload image"}
        aria-disabled={disabled || isUploading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          aria-hidden="true"
        />

        {currentUrl && !isUploading ? (
          <div className="absolute inset-0 w-full h-full p-2">
            <div className="relative w-full h-full rounded-md overflow-hidden group">
              <Image
                src={currentUrl}
                alt="Uploaded preview"
                unoptimized
                fill
                className="object-contain bg-zinc-100 dark:bg-zinc-950"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-medium text-sm flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Replace
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500 dark:text-zinc-400">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 mb-3 animate-spin text-zinc-400" />
                <p className="text-sm font-medium">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 mb-3 text-zinc-400" />
                <p className="text-sm font-medium mb-1">
                  Click or drag to upload
                </p>
                <p className="text-xs">SVG, PNG, JPG or GIF (max. 4MB)</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}
