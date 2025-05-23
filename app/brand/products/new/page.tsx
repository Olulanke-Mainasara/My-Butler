"use client";

import { useEffect, useState } from "react";
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
import { ImageUpload } from "@/components/Custom-UI/Cards/ImageUpload";
import { supabase } from "@/lib/supabase/client"; // Ensure you have a Supabase client instance
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { generateSlug } from "@/lib/utils";
import { FeaturesInput } from "./features-input";
import { SpecificationsInput } from "./specifications-input";
import { Icons } from "@/components/Custom-UI/icons";
import { productFormSchema } from "@/lib/schemas";

type CollectionFormValues = z.infer<typeof productFormSchema>;

export default function CollectionForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    { id: number; name: string }[] | null
  >(null);
  const [uploadedImageNames, setUploadedImageNames] = useState<string[] | null>(
    null
  );

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: 0,
      features: [],
      specifications: {},
    },
  });

  // Function to handle form submission
  async function onSubmit(data: CollectionFormValues) {
    setLoading(true);

    if (!uploadedImageNames) {
      toast.error("Please upload an image for the collection.");
      setLoading(false);
      return;
    }

    try {
      // Generate the public URL for the uploaded images(5)
      const productImageUrls = uploadedImageNames.map((imageName) => {
        const { data } = supabase.storage
          .from(`products/${brandProfile?.id}`)
          .getPublicUrl(imageName);

        return data.publicUrl;
      });

      // Create the product in the database
      const { error } = await supabase
        .from("products")
        .insert([
          {
            name: data.name,
            slug: generateSlug(data.name),
            description: data.description,
            product_images: productImageUrls,
            price: data.price,
            stock_quantity: data.stock_quantity,
            category_id: data.category_id,
            features: data.features,
            specifications: data.specifications,
          },
        ])
        .select();

      if (error) {
        toast.error("Failed to add product. Please try again.");
        return;
      }

      toast.success("product added successfully!");
      router.push(`/brand/products`);
    } catch {
      toast.error("Failed to create collection. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) {
        toast.error("Failed to fetch categories.");
        return;
      }

      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form updated:", name, value, type);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card className="bg-transparent dark:bg-transparent border-none xl:max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="px-0 pb-4 pt-0 text-center lg:text-left">
            <CardTitle className="text-4xl">Add New Product</CardTitle>
            <CardDescription className="text-lg">
              Fill in the details to add a new product.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-0 pb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product name"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
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
                      placeholder="Enter product description"
                      className="min-h-32 xl:text-base"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormDescription>
                Upload images of the product (the first one will be the cover).
              </FormDescription>
              <ImageUpload
                bucketName="products"
                path={brandProfile?.id || ""}
                maxFiles={5}
                maxFileSize={5 * 1000 * 1000} // 5 MB
                onUploadSuccess={(imageNames) =>
                  setUploadedImageNames(imageNames)
                } // Capture the uploaded images names
              />
            </FormItem>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        placeholder="0"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Features</FormLabel>
                  <FormControl>
                    <FeaturesInput
                      value={field.value ?? null}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Add key features of the product.
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
                      {...field}
                      disabled={loading}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Specifications</FormLabel>
                  <FormControl>
                    <SpecificationsInput
                      value={field.value ?? {}}
                      onChange={(newSpecs) => field.onChange(newSpecs)}
                    />
                  </FormControl>
                  <FormDescription>
                    Add technical specifications as key-value pairs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-center lg:justify-start px-0">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Icons.spinner />
                  Adding
                </span>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
