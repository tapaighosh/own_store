import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ArrowRight
} from "lucide-react";

import { 
  getDashboardStats, 
  getLowStockProducts, 
  getCategoryBreakdown 
} from "@/lib/analytics";
import { StatCard } from "@/components/admin/charts/StatCard";
import { CategoryBar } from "@/components/admin/charts/CategoryBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/admin/login");
  }

  const [stats, lowStockProducts, categoryBreakdown] = await Promise.all([
    getDashboardStats(),
    getLowStockProducts(),
    getCategoryBreakdown()
  ]);

  const maxCategoryCount = Math.max(...categoryBreakdown.map(c => c.count), 1);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package />} 
        />
        <StatCard 
          title="Active Products" 
          value={stats.activeProducts} 
          icon={<CheckCircle />} 
          variant="success"
        />
        <StatCard 
          title="Low Stock" 
          value={stats.lowStockProducts} 
          icon={<AlertTriangle />} 
          variant="warning"
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStockProducts} 
          icon={<XCircle />} 
          variant="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alerts</CardTitle>
            {lowStockProducts.length > 0 && (
              <Button variant="ghost" size="sm" asChild className="-mr-3">
                <Link href="/admin/inventory">
                  Manage <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg border border-dashed">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                <p className="font-medium">All good — no low stock items!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your inventory levels are looking healthy.
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <span className="text-amber-600 dark:text-amber-500 font-mono">
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono">
                          {product.lowStockThreshold}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="link" size="sm" asChild>
                            <Link href="/admin/inventory">Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No categories found.
              </p>
            ) : (
              <div className="space-y-6">
                {categoryBreakdown.map((category) => (
                  <CategoryBar 
                    key={category.categoryName}
                    name={category.categoryName}
                    count={category.count}
                    percentage={(category.count / maxCategoryCount) * 100}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
