"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Shad-UI/button";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { Input } from "@/components/Shad-UI/input";
import { Label } from "@/components/Shad-UI/label";
import Image from "next/image";
import { Link, useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase";
import { Icons, ThirdPartySignIn } from "@/components/Custom-UI/icons";
import getURL from "@/lib/getURL";
import { Provider } from "@supabase/supabase-js";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useTransitionRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/?splashed=true");
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
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-neutral-500 dark:text-neutral-400">
                  Login to your My Butler account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  disabled={loading}
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-base flex items-center gap-1 disabled:opacity-50"
              >
                {loading && <Icons.spinner className="w-6 h-6 animate-spin" />}
                Login
              </Button>
              <div className="text-center text-red-600">
                <p>{error && `${error}, please try again`}</p>
              </div>
              <ThirdPartySignIn
                loading={loading}
                handleThirdPartyLogin={(provider) => handleOAuthLogin(provider)}
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
          <div className="relative hidden bg-lightBackground md:block dark:bg-neutral-800">
            <Image
              fill
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
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
