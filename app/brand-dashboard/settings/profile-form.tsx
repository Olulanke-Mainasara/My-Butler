"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrandProfile } from "@/lib/mutations";
import { toast } from "sonner";
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
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { supabase } from "@/lib/supabase/client";
import { useTransitionRouter } from "next-view-transitions";
import { compareTwoObjects } from "@/lib/utils";
import { Icons } from "@/components/Custom-UI/icons";
import { brandProfileFormSchema } from "@/lib/schemas";
import { ProfilePictureUpload } from "@/components/Custom-UI/Cards/ProfilePictureUpload";

type ProfileFormValues = z.infer<typeof brandProfileFormSchema>;

export function ProfileForm() {
  const [profilePicture, setProfilePicture] = React.useState<string>("");
  const router = useTransitionRouter();
  const userProfile = useBrandProfile();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: loading } = useMutation({
    mutationFn: (details: {
      supabase_user_id: string;
      name: string;
      email: string;
      location: string;
      url: string;
      contact: string;
      description: string;
      profile_picture: string;
    }) => updateBrandProfile(supabase, details),

    onSuccess: () => {
      toast.success("Profile updated successfully");

      // Invalidate brand profile query to refetch updated data
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("brands"),
      });

      router.push("/profile");
    },

    onError: (error: Error) => {
      toast.error("Error updating profile", {
        description: error.message,
      });
    },
  });

  const defaultValues: Partial<ProfileFormValues> = {
    name: userProfile?.name,
    email: userProfile?.email,
    location: userProfile?.location || "N/A",
    url: userProfile?.url || "N/A",
    contact: userProfile?.contact || "N/A",
    description: userProfile?.description || "N/A",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(brandProfileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleProfilePictureUpload = (picture: string) => {
    setProfilePicture(picture);
  };

  async function onSubmit(data: ProfileFormValues) {
    const noChanges = compareTwoObjects(
      { ...defaultValues, profile_picture: userProfile?.profile_picture || "" },
      { ...data, profile_picture: profilePicture }
    );

    if (noChanges) {
      toast.info("No changes detected");
      return;
    }

    if (!userProfile) {
      toast.info("You need to log in first", {
        action: {
          label: "Login",
          onClick: () => router.push("/auth/login"),
        },
      });
      return;
    }

    // Call the mutation
    updateProfile({
      supabase_user_id: userProfile.supabase_user_id,
      name: data.name === "N/A" ? "" : data.name ?? "",
      email: data.email === "N/A" ? "" : data.email ?? "",
      location: data.location === "N/A" ? "" : data.location ?? "",
      description: data.description === "N/A" ? "" : data.description ?? "",
      url: data.url === "N/A" ? "" : data.url ?? "",
      profile_picture: profilePicture,
      contact: data.contact === "N/A" ? "" : data.contact ?? "",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <div className="flex flex-col items-center gap-3">
          <ProfilePictureUpload
            userId={userProfile?.supabase_user_id || ""}
            currentImageUrl={userProfile?.profile_picture || ""}
            onUpload={handleProfilePictureUpload}
          />
          <p className="text-sm text-muted-foreground">
            Upload your brand logo or profile picture. Recommended size:
            400x400px. Max file size: 2MB.
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Acme Corp, TechBrand, Your Company"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                The official name of your brand as you want it displayed to
                customers.
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
              <FormLabel>Brand Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Leading provider of innovative tech solutions"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                A brief tagline or description that captures what your brand
                does. This will appear on your brand profile.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contact@yourbrand.com"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your primary business email address for customer inquiries and
                official communications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your business phone number where customers can reach you
                directly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., New York, USA or London, UK"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your brand&apos;s headquarters or primary business location.
                Helps customers know where you&apos;re based.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website or Social Media</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://www.yourbrand.com or @yourbrand"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your brand&apos;s website URL or main social media handle. This
                helps customers learn more about your brand.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="text-base w-full md:w-1/2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Icons.spinner className="animate-spin" />
              Updating Profile
            </span>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
