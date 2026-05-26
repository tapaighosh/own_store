interface StockBadgeProps {
  stock: number;
  lowStockThreshold: number;
}

export function StockBadge({ stock, lowStockThreshold }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        Out of Stock
      </span>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
        Low Stock ({stock} left)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
      In Stock
    </span>
  );
}
