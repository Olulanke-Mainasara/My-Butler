"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Shad-UI/button";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { Input } from "@/components/Shad-UI/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Shad-UI/form";
import { useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase/client";
import { Icons } from "@/components/Custom-UI/icons";
import { getURL } from "@/lib/utils";
import { ThirdPartySignIn } from "@/components/Custom-UI/Buttons/ThirdPartySignIn";
import { Provider } from "@supabase/supabase-js";
import LightSignupImg from "@/public/AuthImgs/signup-light.svg";
import DarkSignupImg from "@/public/AuthImgs/signup-dark.svg";
import { useTheme } from "next-themes";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { ROLE_CUSTOMER, ROLE_BRAND } from "@/lib/roles";
import { signupSchema } from "@/lib/schemas";

type SignupFormValues = {
  fname?: string;
  lname?: string;
  brandName?: string;
  brandDescription?: string;
  brandURL?: string;
  contactNumber?: string;
  brandLocation?: string;
  email: string;
  password: string;
};

export function SignupForm({ ...props }: React.ComponentProps<"div">) {
  const [role, setRole] = useState<"customer" | "brand">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const router = useTransitionRouter();

  const form = useForm<SignupFormValues>({
    defaultValues: {
      fname: "",
      lname: "",
      brandName: "",
      brandDescription: "",
      brandURL: "",
      contactNumber: "",
      brandLocation: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setError("");

    const result = signupSchema.safeParse(
      role === "customer"
        ? {
            role: "customer",
            fname: values.fname ?? "",
            lname: values.lname ?? "",
            email: values.email,
            password: values.password,
          }
        : {
            role: "brand",
            brandName: values.brandName ?? "",
            brandDescription: values.brandDescription ?? "",
            brandURL: values.brandURL ?? "",
            contactNumber: values.contactNumber ?? "",
            brandLocation: values.brandLocation,
            email: values.email,
            password: values.password,
          }
    );

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupFormValues;
        form.setError(field, { message: issue.message });
      }
      return;
    }

    setLoading(true);

    const data = result.data;
    const role_id = data.role === "customer" ? ROLE_CUSTOMER : ROLE_BRAND;

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      phone: data.role === "brand" ? data.contactNumber : undefined,
      options: {
        emailRedirectTo:
          role_id === ROLE_CUSTOMER
            ? `${getURL()}auth/email-verified`
            : `${getURL()}brand-dashboard`,
        data:
          data.role === "customer"
            ? {
                role_id,
                display_name: data.fname + " " + data.lname,
                full_name: data.fname + " " + data.lname,
                picture: "",
              }
            : {
                role_id,
                display_name: data.brandName,
                brand_name: data.brandName,
                brand_description: data.brandDescription,
                brand_url: data.brandURL,
                brand_location: data.brandLocation,
              },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/auth/verify-email");
  };

  const handleOAuthLogin = async (provider: Provider) => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: getURL() },
    });
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div {...props}>
      <Card>
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="overflow-scroll">
            <Form {...form}>
              <form
                className="p-6 md:p-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-6 max-w-md mx-auto">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                      Let&apos;s get cooking
                    </h1>
                    <p className="text-balance text-neutral-500 dark:text-neutral-400">
                      Create a new My Butler account
                    </p>
                  </div>

                  {/* Role Selection Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={role === "customer" ? "default" : "outline"}
                      onClick={() => setRole("customer")}
                      disabled={loading}
                      className="w-full"
                    >
                      Customer
                    </Button>
                    <Button
                      type="button"
                      variant={role === "brand" ? "default" : "outline"}
                      onClick={() => setRole("brand")}
                      disabled={loading}
                      className="w-full"
                    >
                      Brand
                    </Button>
                  </div>

                  {role === "brand" ? (
                    <>
                      <FormField
                        control={form.control}
                        name="brandName"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Brand Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Your Brand Name"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brandDescription"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Brand Description</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Describe your brand"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brandURL"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Brand URL</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Share your brand's main platform link"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="brandLocation"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Brand Location</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Share your brand's location"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem className="grid gap-2">
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Share your contact number"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="fname"
                        render={({ field }) => (
                          <FormItem className="grid gap-2 w-full">
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Clark"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lname"
                        render={({ field }) => (
                          <FormItem className="grid gap-2 w-full">
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Kent"
                                disabled={loading}
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Common Fields */}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>
                          {role === "brand" ? "Brand " : ""}Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            disabled={loading}
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={loading}
                            className="disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full text-base flex items-center gap-1 disabled:opacity-50"
                  >
                    {loading && (
                      <Icons.spinner className="w-6 h-6 animate-spin" />
                    )}
                    Signup
                  </Button>

                  {error && (
                    <div className="text-center text-red-600">
                      <p>{`${error}, please try again`}</p>
                    </div>
                  )}

                  {role === "customer" && (
                    <ThirdPartySignIn
                      loading={loading}
                      handleThirdPartyLogin={handleOAuthLogin}
                      google
                    />
                  )}

                  <div className="text-center text-sm flex gap-1 justify-center">
                    Already have an account?{""}
                    <Link
                      href="/auth/login"
                      className="underline underline-offset-4"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
          <div className="relative hidden bg-lightBackground md:block dark:bg-neutral-800">
            <Image
              fill
              src={theme === "dark" ? DarkSignupImg : LightSignupImg}
              alt="Image"
              suppressHydrationWarning
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
