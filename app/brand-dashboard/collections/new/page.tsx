"use client";

import { useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/Shad-UI/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Shad-UI/form";
import { Input } from "@/components/Shad-UI/input";
import { toast } from "sonner";
import { Textarea } from "@/components/Shad-UI/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Shad-UI/card";
import { Icons } from "@/components/Custom-UI/icons";
import { ImageUpload } from "@/components/Custom-UI/Cards/ImageUpload";
import { supabase } from "@/lib/supabase/client";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { generateSlug } from "@/lib/utils";
import { collectionFormSchema } from "@/lib/schemas";
import { getCategories } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export default function CollectionForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  const { data: categories } = useQuery(
    getCategories().eq("brand_id", brandProfile?.id || ""),
    {
      enabled: !!brandProfile?.id,
    }
  );

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: 0,
      display_image: "",
    },
  });

  async function onSubmit(data: CollectionFormValues) {
    if (!uploadedImageName) {
      toast.info("Please upload an image for the collection.");
      return;
    }

    try {
      // Generate the public URL for the uploaded image
      let displayImageUrl = "";
      if (uploadedImageName) {
        const { data } = supabase.storage
          .from(`collections/${brandProfile?.id}`)
          .getPublicUrl(uploadedImageName);

        displayImageUrl = data.publicUrl;
      }

      // Create the collection in the database
      const { data: collectionData, error } = await supabase
        .from("collections")
        .insert([
          {
            name: data.name,
            slug: generateSlug(data.name),
            description: data.description,
            category_id: data.category_id,
            display_image: displayImageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        toast.error("Failed to create collection. Please try again.");
        return;
      }

      toast.success("Collection created successfully!");
      router.push(
        `/brand-dashboard/products/new?collectionID=${
          generateSlug(collectionData.name) + "/" + collectionData.id
        }`
      );
    } catch {
      toast.error("Failed to create collection. Please try again.");
    }
  }

  return (
    <Card className="bg-transparent dark:bg-transparent border-none xl:max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="px-0 pb-4 pt-0 text-center lg:text-left">
            <CardTitle className="text-4xl">Add New Collection</CardTitle>
            <CardDescription className="text-lg">
              Create a new collection to organize and showcase your products
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-0 pb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Summer 2024, Premium Series, Best Sellers"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a descriptive name that represents this collection.
                    This will be displayed to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what makes this collection special, the theme, or the type of products it contains..."
                      className="resize-none min-h-24 xl:text-base"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a compelling description that helps customers
                    understand what this collection offers (optional but
                    recommended).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full bg-transparent rounded-md border border-neutral-600 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      disabled={form.formState.isSubmitting}
                    >
                      <option value={0}>Select a category</option>
                      {categories &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Choose the category that best fits this collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Display Image</FormLabel>
              <ImageUpload
                bucketName="collections"
                path={brandProfile?.id || ""}
                maxFiles={1}
                maxFileSize={5 * 1000 * 1000} // 5 MB
                onUploadSuccess={(imageNames) =>
                  setUploadedImageName(imageNames[0])
                }
              />
              <FormDescription>
                Upload a banner or hero image for this collection. Recommended
                size: 1200x600px or larger. Max file size: 5MB.
              </FormDescription>
            </FormItem>
          </CardContent>

          <CardFooter className="flex justify-center lg:justify-start px-0">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full md:w-1/2 text-lg"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Icons.spinner className="animate-spin" />
                  Creating Collection
                </span>
              ) : (
                "Create Collection"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
