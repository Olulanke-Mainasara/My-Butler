"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema } from "@/lib/schemas";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/Shad-UI/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/Shad-UI/card";

import { Input } from "@/components/Shad-UI/input";
import { Textarea } from "@/components/Shad-UI/textarea";
import { Button } from "@/components/Shad-UI/button";
import { toast } from "sonner";
import { Icons } from "@/components/Custom-UI/icons";
import { ImageUpload } from "@/components/Custom-UI/Cards/ImageUpload";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { generateSlug } from "@/lib/utils";

type FormValues = z.infer<typeof articleSchema>;

export default function NewsForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      author: "",
      content: "",
      description: "",
      title: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!uploadedImageName) {
      toast.info("Please upload an image for the article.");
      return;
    }

    try {
      // Generate the public URL for the uploaded image
      let displayImageUrl = "";
      if (uploadedImageName) {
        const { data } = supabase.storage
          .from(`news/${brandProfile?.id}`) // Bucket name
          .getPublicUrl(uploadedImageName);

        displayImageUrl = data.publicUrl;
      }

      // Create the article in the database
      const { error } = await supabase.from("news").insert([
        {
          author: data.author,
          content: data.content,
          description: data.description,
          display_image: displayImageUrl,
          slug: generateSlug(data.title),
          title: data.title,
        },
      ]);

      if (error) {
        toast.error("Failed to publish article.");
        return;
      }

      toast.success("Article published successfully!");
      router.push("/brand-dashboard/articles");
    } catch {
      toast.error("Failed to publish article. Please try again.");
    } finally {
      form.reset();
    }
  };

  return (
    <Card className="bg-transparent dark:bg-transparent border-none xl:max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="px-0 pb-4 pt-0 text-center lg:text-left">
            <CardTitle className="text-4xl">Publish new Article</CardTitle>
            <CardDescription className="text-lg">
              Fill in the details to publish a new article
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-0 pb-6">
            <FormItem>
              <FormLabel>Display Image</FormLabel>
              <ImageUpload
                bucketName="news"
                path={brandProfile?.id || ""}
                maxFiles={1}
                maxFileSize={5 * 1000 * 1000} // 5 MB
                onUploadSuccess={(imageNames) =>
                  setUploadedImageName(imageNames[0])
                } // Capture the uploaded images names
              />
              <FormDescription>
                Upload an image for the article&apos;s display.
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Article title"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Author name"
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
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
                      placeholder="Short summary"
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full article content..."
                      className="min-h-40"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  Publishing
                </span>
              ) : (
                "Publish Article"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
