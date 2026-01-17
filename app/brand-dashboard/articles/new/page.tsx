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
import { Badge } from "@/components/Shad-UI/badge";
import { X } from "lucide-react";

type FormValues = z.infer<typeof articleSchema>;

export default function NewsForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      author: "",
      author_bio: "",
      content: "",
      description: "",
      reading_time_minutes: 5,
      title: "",
    },
  });

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

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
          author_bio: data.author_bio,
          content: data.content,
          description: data.description,
          display_image: displayImageUrl,
          reading_time_minutes: data.reading_time_minutes,
          slug: generateSlug(data.title),
          tags: tags.length > 0 ? tags : null,
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
      setTags([]);
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
                }
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
              name="author_bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief author biography..."
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    A short description about the author (optional)
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
              name="reading_time_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="5"
                      {...field}
                      value={field.value ?? 5}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 5)
                      }
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Estimated reading time in minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag (e.g., Technology, Audio)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={form.formState.isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={form.formState.isSubmitting}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormDescription>
                Add tags to categorize your article (press Enter to add)
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full article content in markdown format..."
                      className="min-h-40"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Write your article content in markdown format
                  </FormDescription>
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
