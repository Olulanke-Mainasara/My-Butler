"use client";

import { useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";

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
import { generateSlug, invalidateTable } from "@/lib/utils";
import { collectionFormSchema } from "@/lib/schemas";
import { getCategories } from "@/lib/fetches";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Collection } from "@/types/Collection";

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export function CollectionForm({ initialData }: { initialData?: Collection }) {
  const isEditMode = !!initialData;
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const brandProfile = useBrandProfile();
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  // Categories are global (no brand_id column on the table) - unfiltered.
  const { data: categories } = useQuery(getCategories());

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? "",
          category_id: initialData.category_id ?? 0,
          display_image: initialData.display_image ?? "",
        }
      : {
          name: "",
          description: "",
          category_id: 0,
          display_image: "",
        },
  });

  async function onSubmit(data: CollectionFormValues) {
    if (!isEditMode && !uploadedImageName) {
      toast.info("Please upload an image for the collection.");
      return;
    }

    try {
      const displayImageUrl = uploadedImageName
        ? supabase.storage
            .from(`collections/${brandProfile?.id}`)
            .getPublicUrl(uploadedImageName).data.publicUrl
        : initialData?.display_image ?? "";

      const payload = {
        name: data.name,
        slug: generateSlug(data.name),
        description: data.description,
        category_id: data.category_id,
        display_image: displayImageUrl,
        updated_at: new Date().toISOString(),
      };

      const { data: collectionData, error } = isEditMode
        ? await supabase
            .from("collections")
            .update(payload)
            .eq("id", initialData.id)
            .select()
            .single()
        : await supabase
            .from("collections")
            .insert([{ ...payload, created_at: new Date().toISOString() }])
            .select()
            .single();

      if (error) {
        toast.error(
          isEditMode
            ? "Failed to update collection. Please try again."
            : "Failed to create collection. Please try again."
        );
        return;
      }

      invalidateTable(queryClient, "collections");

      if (isEditMode) {
        toast.success("Collection updated successfully!");
        router.push("/brand-dashboard/collections");
      } else {
        toast.success("Collection created successfully!");
        router.push(
          `/brand-dashboard/products/new?collectionID=${
            generateSlug(collectionData.name) + "/" + collectionData.id
          }`
        );
      }
    } catch {
      toast.error(
        isEditMode
          ? "Failed to update collection. Please try again."
          : "Failed to create collection. Please try again."
      );
    }
  }

  return (
    <Card className="bg-transparent dark:bg-transparent border-none xl:max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="px-0 pb-4 pt-0 text-center lg:text-left">
            <CardTitle className="text-4xl">
              {isEditMode ? "Edit Collection" : "Add New Collection"}
            </CardTitle>
            <CardDescription className="text-lg">
              {isEditMode
                ? "Update the details for this collection."
                : "Create a new collection to organize and showcase your products"}
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
              {isEditMode && !uploadedImageName && initialData.display_image && (
                <div className="w-full max-w-xs aspect-video rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={initialData.display_image}
                    alt={initialData.name}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
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
                {isEditMode
                  ? "Upload a new image to replace the current one. Recommended size: 1200x600px or larger. Max file size: 5MB."
                  : "Upload a banner or hero image for this collection. Recommended size: 1200x600px or larger. Max file size: 5MB."}
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
                  {isEditMode ? "Saving" : "Creating Collection"}
                </span>
              ) : isEditMode ? (
                "Save Changes"
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
