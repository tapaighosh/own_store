// TODO: Replace with Graphify component in Phase 2
import { cn } from "@/lib/utils";

interface CategoryBarProps {
  name: string;
  count: number;
  percentage: number;
}

export function CategoryBar({ name, count, percentage }: CategoryBarProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{name}</span>
        <span className="text-muted-foreground">{count} products</span>
      </div>
      <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
