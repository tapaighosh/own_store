"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { settingsSchema, type SettingsInput } from "@/lib/validators/settings";

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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      shopName: "",
      logo: "",
      primaryColor: "zinc",
      accentColor: "rose",
      font: "Inter",
      hero: {
        headline: "",
        subheadline: "",
        backgroundImage: "",
      },
      footer: {
        description: "",
        email: "",
        phone: "",
        address: "",
        socialLinks: {
          instagram: "",
          facebook: "",
          twitter: "",
        },
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
      },
    },
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          form.reset(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        toast.error("Failed to load shop settings.");
      })
      .finally(() => setIsLoading(false));
  }, [form]);

  async function onSubmit(values: SettingsInput) {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      toast.success("Settings saved successfully.");
      form.reset(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-muted-foreground">
          Manage your storefront&apos;s configuration, appearance, and content.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Info</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shop Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUploader
                      currentUrl={field.value}
                      onUpload={(url) => field.onChange(url)}
                      disabled={isSaving}
                    />
                  </FormControl>
                  <FormDescription>Upload a transparent PNG or SVG logo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Theme */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Theme</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        disabled={isSaving}
                      >
                        {["slate", "stone", "zinc", "neutral", "warm-gray"].map((color) => (
                          <FormItem key={color} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={color} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize cursor-pointer">
                              {color.replace("-", " ")}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accentColor"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Accent Color</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        disabled={isSaving}
                      >
                        {["rose", "amber", "sky", "emerald"].map((color) => (
                          <FormItem key={color} className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={color} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize cursor-pointer">
                              {color}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="font"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Typography</FormLabel>
                    <Select
                      disabled={isSaving}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font family" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Inter", "Geist", "Nunito", "Lato"].map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Hero Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Hero Section</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="hero.headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="Welcome to our store" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero.subheadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subheadline</FormLabel>
                    <FormControl>
                      <Input placeholder="Discover amazing products..." {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="hero.backgroundImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      currentUrl={field.value}
                      onUpload={(url) => field.onChange(url)}
                      disabled={isSaving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Footer Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Footer & Contact</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="footer.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brief Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short description of your store..."
                        className="resize-none"
                        {...field}
                        disabled={isSaving}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="footer.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="support@example.com" type="email" {...field} disabled={isSaving} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="footer.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} disabled={isSaving} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="footer.address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Physical Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Store St, City, Country" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mt-4">
              <FormField
                control={form.control}
                name="footer.socialLinks.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/..." {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footer.socialLinks.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/..." {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="footer.socialLinks.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter / X URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} disabled={isSaving} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* SEO Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">SEO Settings</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="seo.metaTitle"
                render={({ field }) => {
                  const val = field.value || "";
                  return (
                    <FormItem>
                      <div className="flex justify-between items-end">
                        <FormLabel>Meta Title</FormLabel>
                        <span className={`text-xs ${val.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {val.length}/60
                        </span>
                      </div>
                      <FormControl>
                        <Input placeholder="Store Homepage Title" {...field} disabled={isSaving} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="seo.metaDescription"
                render={({ field }) => {
                  const val = field.value || "";
                  return (
                    <FormItem>
                      <div className="flex justify-between items-end">
                        <FormLabel>Meta Description</FormLabel>
                        <span className={`text-xs ${val.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {val.length}/160
                        </span>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description for search engines..."
                          className="resize-none"
                          {...field}
                          disabled={isSaving}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="min-w-32">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
