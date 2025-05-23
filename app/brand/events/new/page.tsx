"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/lib/schemas";
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

type FormValues = z.infer<typeof eventSchema>;

export default function NewsForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      is_virtual: false,
      tickets_url: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!uploadedImageName) {
      toast.info("Please upload an image for the event.");
      return;
    }

    try {
      // Generate the public URL for the uploaded image
      let displayImageUrl = "";
      if (uploadedImageName) {
        const { data } = supabase.storage
          .from(`events/${brandProfile?.id}`) // Bucket name
          .getPublicUrl(uploadedImageName);

        displayImageUrl = data.publicUrl;
      }

      // Create the event in the database
      const { error } = await supabase.from("events").insert([
        {
          title: data.title,
          slug: generateSlug(data.title),
          description: data.description,
          display_image: displayImageUrl,
          start_date: data.start_date,
          end_date: data.end_date,
          location: data.location,
          is_virtual: data.is_virtual,
          tickets_url: data.tickets_url,
        },
      ]);

      if (error) {
        toast.error("Failed to post events.");
        return;
      }

      toast.success("Event posted successfully!");
      router.push("/brand/events");
    } catch {
      toast.error("Failed to post event. Please try again.");
    } finally {
      form.reset();
    }
  };

  return (
    <Card className="bg-transparent dark:bg-transparent border-none xl:max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="px-0 pb-4 pt-0 text-center lg:text-left">
            <CardTitle className="text-4xl">Post new Event</CardTitle>
            <CardDescription className="text-lg">
              Fill in the details to post a new event
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-0 pb-6">
            <FormItem>
              <FormLabel>Display Image</FormLabel>
              <ImageUpload
                bucketName="events"
                path={brandProfile?.id || ""}
                maxFiles={1}
                maxFileSize={5 * 1000 * 1000} // 5 MB
                onUploadSuccess={(imageNames) =>
                  setUploadedImageName(imageNames[0])
                } // Capture the uploaded images names
              />
              <FormDescription>
                Upload an image for the event&apos;s display.
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
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
                      placeholder="Optional event description..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        type="datetime-local"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Event location or venue"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_virtual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Virtual?</FormLabel>
                  <FormControl>
                    <select
                      name={field.name}
                      ref={field.ref}
                      className="w-full p-2 border rounded-md"
                      value={
                        field.value === true
                          ? "true"
                          : field.value === false
                          ? "false"
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "true"
                            ? true
                            : e.target.value === "false"
                            ? false
                            : null
                        )
                      }
                      onBlur={field.onBlur}
                    >
                      <option value="">Select option</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tickets_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tickets URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://tickets.example.com"
                      {...field}
                      value={field.value ?? ""}
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
                  <Icons.spinner />
                  Posting
                </span>
              ) : (
                "Post Event"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
