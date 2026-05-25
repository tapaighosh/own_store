"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateInput,
} from "@/lib/validators/product";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: any;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form
  const form = useForm<ProductCreateInput>({
    resolver: zodResolver(mode === "create" ? productCreateSchema : productUpdateSchema) as any,
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category?._id || product?.category || "",
      images: product?.images || [],
      stock: product?.stock ?? 0,
      lowStockThreshold: product?.lowStockThreshold ?? 5,
      status: product?.status || "draft",
      featured: product?.featured || false,
    },
  });

  const watchName = form.watch("name");
  const watchDescription = form.watch("description");
  const watchImages = form.watch("images") || [];

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data) => setCategories(data.data || []))
      .catch((err) => {
        console.error(err);
        // We'll let it be empty; the user might need to add categories first
      });
  }, []);

  const handleImageChange = (index: number, url: string) => {
    const currentImages = [...watchImages];
    if (url) {
      currentImages[index] = url;
    } else {
      currentImages.splice(index, 1);
    }
    // Filter out any empty strings that might have snuck in and update form
    form.setValue(
      "images",
      currentImages.filter((img) => img),
      { shouldValidate: true }
    );
  };

  async function onSubmit(values: ProductCreateInput) {
    setIsSaving(true);
    try {
      const url = mode === "create" ? "/api/products" : `/api/products/${product._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      toast.success(mode === "create" ? "Product created!" : "Product updated!");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  // Live slug preview
  const slugPreview = watchName
    ? slugify(watchName, { lower: true, strict: true })
    : "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "create" ? "Add Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "Create a new product to sell in your store."
                : "Make changes to your existing product."}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            <div className="p-6 bg-white dark:bg-zinc-950 border rounded-lg space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Classic White T-Shirt" {...field} disabled={isSaving} />
                    </FormControl>
                    {slugPreview && (
                      <p className="text-xs text-muted-foreground mt-1">
                        URL: /products/<span className="font-medium text-foreground">{slugPreview}</span>
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-end">
                      <FormLabel>Description</FormLabel>
                      <span className={`text-xs ${(field.value?.length || 0) > 2000 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {field.value?.length || 0}/2000
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed product description..."
                        className="min-h-[150px] resize-y"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-6 bg-white dark:bg-zinc-950 border rounded-lg space-y-6">
              <h2 className="text-xl font-semibold">Images</h2>
              <FormDescription>
                Upload up to 4 images. The first image will be used as the main product image.
              </FormDescription>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Image {index + 1}</p>
                    <div className="aspect-square">
                      <ImageUploader
                        currentUrl={watchImages[index] || ""}
                        onUpload={(url) => handleImageChange(index, url)}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.images && (
                <p className="text-sm font-medium text-red-500">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>

            <div className="p-6 bg-white dark:bg-zinc-950 border rounded-lg space-y-6">
              <h2 className="text-xl font-semibold">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            disabled={isSaving}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Threshold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormDescription>Show warning below this number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="p-6 bg-white dark:bg-zinc-950 border rounded-lg space-y-6">
              <h2 className="text-xl font-semibold">Organization</h2>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isSaving}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-green-700 dark:text-green-400">
                            Active
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="draft" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-amber-700 dark:text-amber-400">
                            Draft
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isSaving}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {categories.length === 0 && "No categories available. Please add them first."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">Featured</FormLabel>
                      <FormDescription>
                        Show on homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
