"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import Image from "next/image";
import { useTransitionRouter } from "next-view-transitions";
import { Link } from "next-view-transitions";
import { supabase } from "@/lib/supabase/client";
import { Icons } from "@/components/Custom-UI/icons";
import { ThirdPartySignIn } from "@/components/Custom-UI/Buttons/ThirdPartySignIn";
import { getURL } from "@/lib/utils";
import { Provider } from "@supabase/supabase-js";
import LightLoginImg from "@/public/AuthImgs/login-light.svg";
import DarkLoginImg from "@/public/AuthImgs/login-dark.svg";
import { useTheme } from "next-themes";
import { ROLE_CUSTOMER } from "@/lib/roles";
import { loginSchema } from "@/lib/schemas";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useTransitionRouter();
  const { theme } = useTheme();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user.user_metadata.role_id === ROLE_CUSTOMER) {
      router.replace("/");
    } else {
      router.replace("/brand-dashboard");
    }
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
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              className="p-6 md:p-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-6 max-w-96 mx-auto">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-neutral-500 dark:text-neutral-400">
                    Login to your My Butler account
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Email</FormLabel>
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
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
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
                  Login
                </Button>

                {error && (
                  <div className="text-center text-red-600">
                    <p>{`${error}, please try again`}</p>
                  </div>
                )}

                <ThirdPartySignIn
                  loading={loading}
                  handleThirdPartyLogin={(provider) =>
                    handleOAuthLogin(provider)
                  }
                  google
                />

                <div className="text-center text-sm flex gap-1 justify-center">
                  Don&apos;t have an account?{""}
                  <Link
                    href="/auth/signup"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="relative hidden bg-lightBackground md:block dark:bg-neutral-800">
            <Image
              fill
              src={theme === "dark" ? DarkLoginImg : LightLoginImg}
              alt="Image"
              suppressHydrationWarning
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-neutral-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-neutral-900 dark:text-neutral-400 dark:hover:[&_a]:text-neutral-50">
        By clicking login, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
