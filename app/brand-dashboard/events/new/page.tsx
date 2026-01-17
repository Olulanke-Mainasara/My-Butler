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
import { Checkbox } from "@/components/Shad-UI/checkbox";
import { toast } from "sonner";
import { Icons } from "@/components/Custom-UI/icons";
import { ImageUpload } from "@/components/Custom-UI/Cards/ImageUpload";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { generateSlug } from "@/lib/utils";
import { Badge } from "@/components/Shad-UI/badge";
import { X } from "lucide-react";

type FormValues = z.infer<typeof eventSchema>;

export default function EventForm() {
  const router = useTransitionRouter();
  const brandProfile = useBrandProfile();
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(
    null
  );
  const [expectations, setExpectations] = useState<string[]>([]);
  const [expectationInput, setExpectationInput] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      admission_price: 0,
      capacity: 100,
      description: "",
      duration_hours: 8,
      end_date: "",
      exhibitor_count: 0,
      featured_speakers_description: "",
      is_virtual: false,
      location: "",
      parking_available: false,
      registration_basis: "First come, first served basis",
      start_date: "",
      tickets_url: "",
      title: "",
    },
  });

  const handleAddExpectation = () => {
    const trimmed = expectationInput.trim();
    if (trimmed && !expectations.includes(trimmed)) {
      setExpectations([...expectations, trimmed]);
      setExpectationInput("");
    }
  };

  const handleRemoveExpectation = (item: string) => {
    setExpectations(expectations.filter((exp) => exp !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExpectation();
    }
  };

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
          .from(`events/${brandProfile?.id}`)
          .getPublicUrl(uploadedImageName);

        displayImageUrl = data.publicUrl;
      }

      // Create the event in the database
      const { error } = await supabase.from("events").insert([
        {
          admission_price: data.admission_price,
          capacity: data.capacity,
          description: data.description,
          display_image: displayImageUrl,
          duration_hours: data.duration_hours,
          end_date: data.end_date,
          exhibitor_count: data.exhibitor_count,
          featured_speakers_description: data.featured_speakers_description,
          is_virtual: data.is_virtual,
          location: data.location,
          parking_available: data.parking_available,
          registration_basis: data.registration_basis,
          slug: generateSlug(data.title),
          start_date: data.start_date,
          tickets_url: data.tickets_url,
          title: data.title,
          what_to_expect: expectations.length > 0 ? expectations : undefined,
        },
      ]);

      if (error) {
        toast.error("Failed to post event.");
        return;
      }

      toast.success("Event posted successfully!");
      router.push("/brand-dashboard/events");
    } catch {
      toast.error("Failed to post event. Please try again.");
    } finally {
      setExpectations([]);
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
                maxFileSize={5 * 1000 * 1000}
                onUploadSuccess={(imageNames) =>
                  setUploadedImageName(imageNames[0])
                }
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
                    <Input
                      placeholder="Event title"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description..."
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
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
                      <Input
                        type="datetime-local"
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
                        disabled={form.formState.isSubmitting}
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
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="100"
                        {...field}
                        value={field.value ?? 100}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 100)
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Expected attendance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="8"
                        {...field}
                        value={field.value ?? 8}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 8)
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Event duration</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exhibitor_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exhibitors</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="20"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Number of exhibitors</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="admission_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>0 for free events</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_virtual"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Virtual Event</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parking_available"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">
                    Parking Available On-Site
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registration_basis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Basis</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First come, first served basis"
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    How registration works for this event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>What to Expect</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add expectation (e.g., Live demonstrations)"
                    value={expectationInput}
                    onChange={(e) => setExpectationInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={form.formState.isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddExpectation}
                    disabled={form.formState.isSubmitting}
                  >
                    Add
                  </Button>
                </div>
                {expectations.length > 0 && (
                  <div className="space-y-2">
                    {expectations.map((exp) => (
                      <Badge
                        key={exp}
                        variant="secondary"
                        className="flex items-center justify-between w-full p-2"
                      >
                        <span className="flex-1">{exp}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExpectation(exp)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormDescription>
                Add bullet points about what attendees can expect (press Enter
                to add)
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="featured_speakers_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Speakers</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description of featured speakers or presenters..."
                      {...field}
                      value={field.value ?? ""}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of speakers or presenters (optional)
                  </FormDescription>
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
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    External ticketing URL (optional)
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
