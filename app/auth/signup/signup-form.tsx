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
import { Icons } from "@/components/Shared/UI/icons";
import getURL from "@/lib/getURL";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useTransitionRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}/auth/email-verified`,
        data: {
          first_name: fname,
          last_name: lname,
          displayName: fname,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const supabaseUserId = data.user?.id;

      if (!supabaseUserId) {
        setError("Failed to retrieve user ID");
        setLoading(false);
        return;
      }
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: supabaseUserId,
          first_name: fname,
          last_name: lname,
          email: email,
          supabase_user_id: supabaseUserId,
        },
      ]);

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
      } else {
        router.push("/auth/verify-email");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Let&apos;s get cooking</h1>
                <p className="text-balance text-neutral-500 dark:text-neutral-400">
                  Create a new My Butler account
                </p>
              </div>
              <div className="flex gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fname">First name</Label>
                  <Input
                    id="fname"
                    type="text"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    placeholder="Clark"
                    required
                    disabled={loading}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lname">Last name</Label>
                  <Input
                    id="lname"
                    type="text"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    placeholder="Kent"
                    required
                    disabled={loading}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
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
                <Label htmlFor="password">Password</Label>
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
                className="w-full flex items-center gap-1 disabled:opacity-50"
              >
                {loading && <Icons.spinner className="w-6 h-6 animate-spin" />}
                Signup
              </Button>
              <div className="text-center text-red-600">
                <p>{error && `${error}, please try again`}</p>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-800">
                <span className="relative z-10 bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full disabled:opacity-50"
                >
                  <Icons.apple className="w-6 h-6" />
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full disabled:opacity-50"
                >
                  <Icons.google className="w-6 h-6" />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full disabled:opacity-50"
                >
                  <Icons.meta className="w-6 h-6" />
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </div>
              <div className="text-center text-sm">
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
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        {""}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
