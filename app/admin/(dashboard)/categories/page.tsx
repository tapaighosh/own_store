"use client";

import { useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryCreateSchema, CategoryCreateInput } from "@/lib/validators/category";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoriesPage() {
  const { data: categories, error, mutate, isLoading } = useSWR<Category[]>("/api/categories", fetcher);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Delete State
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const addForm = useForm<CategoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<CategoryCreateInput>({
    resolver: zodResolver(categoryCreateSchema),
  });

  const onAdd = async (data: CategoryCreateInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create category");
      }

      await mutate();
      toast.success("Category created");
      setIsAdding(false);
      addForm.reset();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description || "",
    });
  };

  const onEdit = async (data: CategoryCreateInput) => {
    if (!editingCategory) return;
    setIsEditSubmitting(true);
    try {
      const res = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update category");
      }

      await mutate();
      toast.success("Category updated");
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deletingCategory._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete category");
      }

      await mutate();
      toast.success("Category deleted");
      setDeletingCategory(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return <div className="p-8 text-red-500">Failed to load categories</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={() => setIsAdding(!isAdding)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAdding && (
        <form
          onSubmit={addForm.handleSubmit(onAdd)}
          className="p-6 border rounded-xl bg-card space-y-4 shadow-sm"
        >
          <h2 className="text-lg font-medium">New Category</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                {...addForm.register("name")}
                placeholder="e.g. Summer Collection"
              />
              {addForm.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {addForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description (Optional)
              </label>
              <Textarea
                {...addForm.register("description")}
                placeholder="Short description of the category..."
                className="resize-none"
              />
              {addForm.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {addForm.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                addForm.reset();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Category
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : categories?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
          <FolderOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No categories yet</h2>
          <p className="text-zinc-500 mb-6 text-center max-w-sm">
            Add your first category to start organizing your products.
          </p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-zinc-500 font-mono text-sm">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-zinc-500 truncate max-w-[200px]">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell className="text-zinc-500">
                    {format(new Date(category.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(category)}
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={() => setDeletingCategory(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input
                {...editForm.register("name")}
                placeholder="e.g. Summer Collection"
              />
              {editForm.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Description (Optional)
              </label>
              <Textarea
                {...editForm.register("description")}
                placeholder="Short description of the category..."
                className="resize-none"
              />
              {editForm.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.description.message}
                </p>
              )}
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCategory(null)}
                disabled={isEditSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEditSubmitting}>
                {isEditSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deletingCategory?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              onClick={(e) => {
                e.preventDefault(); // Prevent closing immediately to show loading
                onDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
