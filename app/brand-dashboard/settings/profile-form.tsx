"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const [loading, setLoading] = React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState<string>("");
  const router = useTransitionRouter();
  const userProfile = useBrandProfile();

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

    setLoading(true);

    const { error } = await supabase.rpc("update_brand_details", {
      _name: data.name === "N/A" ? "" : data.name ?? "",
      _email: data.email === "N/A" ? "" : data.email ?? "",
      _location: data.location === "N/A" ? "" : data.location ?? "",
      _description: data.description === "N/A" ? "" : data.description ?? "",
      _url: data.url === "N/A" ? "" : data.url ?? "",
      _profile_picture: profilePicture,
      _contact: data.contact === "N/A" ? "" : data.contact ?? "",
      _supabase_user_id: userProfile?.supabase_user_id ?? "",
    });

    if (error) {
      toast.error("Error updating profile", {
        description: error.message,
      });
    } else {
      toast.success("Profile updated successfully");
      router.push("/profile");
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <ProfilePictureUpload
          userId={userProfile?.supabase_user_id || ""}
          currentImageUrl={userProfile?.profile_picture || ""}
          onUpload={handleProfilePictureUpload}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your brand name"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>Your brand&apos;s name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe your brand"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>Your brand&apos;s description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@brand.com"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Your brand&apos;s contact email.
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
              <FormLabel>Brand location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you located?"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>Your brand&apos;s location.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your website or social media link"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Could be your brand website or main social handle.
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
              <FormLabel>Brand Contact No</FormLabel>
              <FormControl>
                <Input
                  placeholder="How can you be contacted?"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>Your brand contact number.</FormDescription>
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
