"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Shad-UI/button";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { Input } from "@/components/Shad-UI/input";
import { Label } from "@/components/Shad-UI/label";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Icons } from "@/components/Shared/UI/icons";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Don&apos;t worry, it happens
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Enter your email to reset your password
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
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-base flex items-center gap-1 disabled:opacity-50"
              >
                {loading && <Icons.spinner className="w-6 h-6 animate-spin" />}
                Reset
              </Button>
              <div className="text-center text-red-600">
                <p>{error && `${error}, please try again`}</p>
              </div>
              {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-800">
                <span className="relative z-10 bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full disabled:opacity-50 hover:bg-darkBackground hover:text-white dark:hover:bg-lightBackground dark:hover:text-black"
                >
                  <Icons.apple className="w-6 h-6" />
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full disabled:opacity-50 hover:bg-darkBackground hover:text-white dark:hover:bg-lightBackground dark:hover:text-black"
                >
                  <Icons.google className="w-6 h-6" />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  variant="outline"
                  disabled={loading}
                  className="w-full disabled:opacity-50 hover:bg-darkBackground hover:text-white dark:hover:bg-lightBackground dark:hover:text-black"
                >
                  <Icons.meta className="w-6 h-6" />
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </div> */}
              <div className="text-center text-sm flex gap-1 justify-center">
                Remember your password?{""}
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
