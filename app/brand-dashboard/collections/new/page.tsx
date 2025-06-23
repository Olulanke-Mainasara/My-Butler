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
import { supabase } from "@/lib/supabase/client"; // Ensure you have a Supabase client instance
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { generateSlug } from "@/lib/utils";
import { collectionFormSchema } from "@/lib/schemas";

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export default function CollectionForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [loading, setLoading] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      display_image: "",
    },
  });

  async function onSubmit(data: CollectionFormValues) {
    setLoading(true);

    if (!uploadedImageName) {
      toast.info("Please upload an image for the collection.");
      setLoading(false);
      return;
    }

    try {
      // Generate the public URL for the uploaded image
      let displayImageUrl = "";
      if (uploadedImageName) {
        const { data } = supabase.storage
          .from(`collections/${brandProfile?.id}`) // Bucket name
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
            display_image: displayImageUrl,
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-transparent dark:bg-transparent border-none xl:max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="px-0 pb-4 pt-0 text-center lg:text-left">
            <CardTitle className="text-4xl">Add new Collection</CardTitle>
            <CardDescription className="text-lg">
              Fill in the details to create a new collection
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
                      placeholder="Enter collection name"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed for your collection.
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
                      placeholder="Enter collection description"
                      className="resize-none xl:text-base"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your collection.
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
                } // Capture the uploaded images names
              />
              <FormDescription>
                Upload an image for the collection&apos;s display.
              </FormDescription>
            </FormItem>
          </CardContent>

          <CardFooter className="flex justify-center lg:justify-start px-0">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Icons.spinner className="animate-spin" />
                  Adding
                </span>
              ) : (
                "Add Collection"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
