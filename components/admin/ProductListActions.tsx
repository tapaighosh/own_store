"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductListActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async () => {
    if (!window.confirm("Are you sure you want to archive this product? It will be hidden from the store.")) return;

    setIsArchiving(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to archive product");
      }

      toast.success("Product archived successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/products/${productId}/edit`}>
        <Button variant="ghost" size="icon" title="Edit Product">
          <Edit className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          <span className="sr-only">Edit Product</span>
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleArchive}
        disabled={isArchiving}
        title="Archive Product"
        className="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
      >
        {isArchiving ? (
          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
        ) : (
          <Trash2 className="w-4 h-4 text-red-600" />
        )}
        <span className="sr-only">Archive Product</span>
      </Button>
    </div>
  );
}
