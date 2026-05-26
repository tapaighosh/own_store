"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Ban, Loader2, Save } from "lucide-react";
import { StockManager } from "@/components/admin/StockManager";

type InventoryProduct = {
  _id: string;
  name: string;
  slug: string;
  stock: number;
  lowStockThreshold: number;
  status: "active" | "draft";
  category?: { _id: string; name: string };
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryPage() {
  const { data: products, error, mutate, isLoading } = useSWR<InventoryProduct[]>(
    "/api/inventory",
    fetcher
  );

  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, { stock: number; lowStockThreshold: number }>
  >(new Map());
  const [isSaving, setIsSaving] = useState(false);

  if (error) {
    return <div className="p-8 text-red-500">Failed to load inventory</div>;
  }

  const handleStockChange = (id: string, field: "stock" | "lowStockThreshold", value: number) => {
    setPendingChanges((prev) => {
      const next = new Map(prev);
      const product = products?.find((p) => p._id === id);
      if (!product) return prev;

      const existingChange = next.get(id) || {
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
      };

      const newChange = { ...existingChange, [field]: value };
      
      // If the new values match the original values exactly, we can remove it from pending
      if (newChange.stock === product.stock && newChange.lowStockThreshold === product.lowStockThreshold) {
        next.delete(id);
      } else {
        next.set(id, newChange);
      }
      
      return next;
    });
  };

  const handleSave = async () => {
    if (pendingChanges.size === 0) return;
    
    setIsSaving(true);
    try {
      const updates = Array.from(pendingChanges.entries()).map(([id, changes]) => ({
        id,
        ...changes,
      }));

      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update inventory");
      }

      await mutate(); // Revalidate SWR data
      setPendingChanges(new Map());
      toast.success("Inventory updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products?.filter((product) => {
    // Determine effective stock values considering pending changes
    const effectiveStock = pendingChanges.get(product._id)?.stock ?? product.stock;
    const effectiveThreshold =
      pendingChanges.get(product._id)?.lowStockThreshold ?? product.lowStockThreshold;

    if (filter === "out") {
      return effectiveStock === 0;
    }
    if (filter === "low") {
      return effectiveStock > 0 && effectiveStock <= effectiveThreshold;
    }
    return true;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your stock levels and low stock alerts.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={pendingChanges.size === 0 || isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes {pendingChanges.size > 0 && `(${pendingChanges.size})`}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "low" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-900/50"
          onClick={() => setFilter("low")}
        >
          Low Stock
        </Button>
        <Button
          variant={filter === "out" ? "secondary" : "outline"}
          size="sm"
          className="rounded-full text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border-red-200 dark:border-red-900/50"
          onClick={() => setFilter("out")}
        >
          Out of Stock
        </Button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead className="w-[100px] text-center">Alert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mx-auto mb-2" />
                  <span className="text-sm text-zinc-500">Loading inventory...</span>
                </TableCell>
              </TableRow>
            ) : filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-zinc-500">
                  No products found matching the current filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((product) => {
                const pending = pendingChanges.get(product._id);
                const stock = pending?.stock ?? product.stock;
                const threshold = pending?.lowStockThreshold ?? product.lowStockThreshold;

                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock <= threshold;

                return (
                  <TableRow
                    key={product._id}
                    className={
                      isOutOfStock
                        ? "bg-red-950/10 dark:bg-red-950/30"
                        : isLowStock
                        ? "bg-amber-950/10 dark:bg-amber-950/30"
                        : ""
                    }
                  >
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {product.slug}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {product.category?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StockManager
                        productId={product._id}
                        field="stock"
                        value={stock}
                        onChange={handleStockChange}
                      />
                    </TableCell>
                    <TableCell>
                      <StockManager
                        productId={product._id}
                        field="lowStockThreshold"
                        value={threshold}
                        onChange={handleStockChange}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {isOutOfStock ? (
                          <Ban className="w-5 h-5 text-red-500" aria-label="Out of stock" />
                        ) : isLowStock ? (
                          <AlertTriangle className="w-5 h-5 text-amber-500" aria-label="Low stock" />
                        ) : (
                          <span className="text-zinc-300 dark:text-zinc-700">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
