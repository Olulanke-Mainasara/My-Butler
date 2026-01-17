"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerProfile } from "@/lib/mutations";
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
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { supabase } from "@/lib/supabase/client";
import { useTransitionRouter } from "next-view-transitions";
import { compareTwoObjects } from "@/lib/utils";
import { Icons } from "@/components/Custom-UI/icons";
import { profileFormSchema } from "@/lib/schemas";
import { ProfilePictureUpload } from "@/components/Custom-UI/Cards/ProfilePictureUpload";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [profilePicture, setProfilePicture] = React.useState<string>("");
  const router = useTransitionRouter();
  const customerProfile = useCustomerProfile();
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: loading } = useMutation({
    mutationFn: (details: {
      supabase_user_id: string;
      display_name: string;
      profile_picture: string;
      email: string;
      location: string;
    }) => updateCustomerProfile(supabase, details),

    onSuccess: () => {
      toast.success("Profile updated successfully");

      // Invalidate customer profile query to refetch updated data
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("customers"),
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
    username: customerProfile?.display_name,
    email: customerProfile?.email,
    location: customerProfile?.location || "N/A",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleProfilePictureUpload = (picture: string) => {
    setProfilePicture(picture);
  };

  async function onSubmit(data: ProfileFormValues) {
    const noChanges = compareTwoObjects(
      {
        ...defaultValues,
        profile_picture: customerProfile?.profile_picture || "",
      },
      { ...data, profile_picture: profilePicture }
    );

    if (noChanges) {
      toast.info("No changes detected");
      return;
    }

    if (!customerProfile) {
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
      supabase_user_id: customerProfile.supabase_user_id,
      display_name: data.username === "N/A" ? "" : data.username ?? "",
      profile_picture: profilePicture,
      email: data.email === "N/A" ? "" : data.email ?? "",
      location: data.location === "N/A" ? "" : data.location ?? "",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <ProfilePictureUpload
          userId={customerProfile?.supabase_user_id || ""}
          currentImageUrl={customerProfile?.profile_picture || ""}
          onUpload={handleProfilePictureUpload}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder={customerProfile?.display_name}
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder={customerProfile?.email}
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>This is your contact email.</FormDescription>
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
                  placeholder={
                    !customerProfile?.location ||
                    customerProfile.location === "N/A"
                      ? "Where are you located?"
                      : customerProfile.location
                  }
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Could be your personal location or brand location.
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
              Updating
            </span>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
