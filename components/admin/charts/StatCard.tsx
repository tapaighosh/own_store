// TODO: Replace with Graphify component in Phase 2
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({ title, value, icon, description, variant = "default" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="tracking-tight text-sm font-medium">{title}</p>
          <div className={cn(
            "w-4 h-4 text-muted-foreground",
            variant === "success" && "text-emerald-500",
            variant === "warning" && "text-amber-500",
            variant === "destructive" && "text-red-500"
          )}>
            {icon}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
