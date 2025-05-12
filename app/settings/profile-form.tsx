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
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { compareTwoObjects } from "@/lib/utils";
import { Icons } from "@/components/Custom-UI/icons";

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
  location: z
    .string()
    .min(2, {
      message: "Location must be at least 2 characters.",
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const customerProfile = useCustomerProfile();

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

  async function onSubmit(data: ProfileFormValues) {
    const noChanges = compareTwoObjects(defaultValues, data);

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

    setLoading(true);

    const { error } = await supabase.rpc("update_user_details", {
      _display_name: data.username === "N/A" ? "" : data.username ?? "",
      _email: data.email === "N/A" ? "" : data.email ?? "",
      _location: data.location === "N/A" ? "" : data.location ?? "",
      _supabase_user_id: customerProfile?.supabase_user_id ?? "",
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
              Updating
              <Icons.spinner />
            </span>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}
