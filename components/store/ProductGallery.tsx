"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const displayImages = images && images.length > 0 ? images : [];

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-square relative bg-[var(--color-primary-100)] rounded-2xl overflow-hidden border border-[var(--color-primary-200)] shadow-sm">
        {displayImages[selectedImage] ? (
          <Image
            src={displayImages[selectedImage]}
            alt={`${name} - Image ${selectedImage + 1}`}
            fill
            className="object-cover transition-all duration-300"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-primary-400)] text-sm font-medium">
            No image available
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(idx)}
              className={cn(
                "relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                selectedImage === idx
                  ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20 scale-95"
                  : "border-[var(--color-primary-200)] opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
