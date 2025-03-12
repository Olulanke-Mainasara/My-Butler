"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Shad-UI/select";

import { Input } from "@/components/Shad-UI/input";
import { Textarea } from "@/components/Shad-UI/textarea";
import { useUserProfile } from "@/components/Providers/AllProviders";
import { industries } from "@/static-data/filter";
import { supabase } from "@/lib/supabase";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .optional(),
  email: z.string().email().optional(),
  bio: z
    .string()
    .max(160)
    .min(4, { message: "Bio must be at least 4 characters." })
    .optional(),
  url: z.string().url({ message: "Please enter a valid URL." }).optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  category: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [loading, setLoading] = React.useState(false);
  const userProfile = useUserProfile();

  const defaultValues: Partial<ProfileFormValues> = {
    username: userProfile?.display_name,
    email: userProfile?.email,
    bio: userProfile?.bio || "N/A",
    url: userProfile?.url || "N/A",
    location: userProfile?.location || "N/A",
    category: userProfile?.category || "N/A",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);

    const { error } = await supabase.rpc("update_user_details", {
      _bio: data.bio ?? "",
      _category: data.category ?? "",
      _display_name: data.username ?? "",
      _email: data.email ?? "",
      _location: data.location ?? "",
      _supabase_user_id: userProfile?.supabase_user_id ?? "",
      _url: data.url ?? "",
    });

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
      });
    } else {
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been successfully updated.",
      });
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder={userProfile?.display_name}
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
                  placeholder={userProfile?.email}
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    !userProfile?.bio || userProfile.bio === "N/A"
                      ? "Tell us a little about yourself"
                      : userProfile.bio
                  }
                  className="resize-none"
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                What do you want people to know about you? You have 160
                characters.
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
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    !userProfile?.url || userProfile.url === "N/A"
                      ? "Your website URL"
                      : userProfile.url
                  }
                  {...field}
                  value={field.value === "N/A" ? "" : field.value}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Add a link to your website, blog, or social media profile.
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
                  placeholder={
                    !userProfile?.location || userProfile.location === "N/A"
                      ? "Where are you located?"
                      : userProfile.location
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
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value === "N/A" ? "" : field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !userProfile?.category || userProfile.category === "N/A"
                          ? "Select a category"
                          : userProfile.category
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map((category, index) => (
                    <SelectItem key={index} value={category.value}>
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select what category you/your brand belong to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="text-base w-full md:w-fit">
          Update profile
        </Button>
      </form>
    </Form>
  );
}
