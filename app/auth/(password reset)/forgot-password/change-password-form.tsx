"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Shad-UI/button";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { Input } from "@/components/Shad-UI/input";
import { Label } from "@/components/Shad-UI/label";
import Image from "next/image";
import { Icons } from "@/components/Custom-UI/icons";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import LightChangeImg from "@/public/AuthImgs/change-light.svg";
import DarkChangeImg from "@/public/AuthImgs/change-dark.svg";
import { useTransitionRouter } from "next-view-transitions";
import { useTheme } from "next-themes";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { theme } = useTheme();
  const router = useTransitionRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      toast.success("Password reset successfully");
      router.push("/?splashed=true");
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Alright, good as new</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Enter your new password and confirm it
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <p>{error && error}</p>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-lightBackground md:block dark:bg-neutral-800">
            <Image
              fill
              src={theme === "dark" ? DarkChangeImg : LightChangeImg}
              suppressHydrationWarning
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-neutral-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-neutral-900 dark:text-neutral-400 dark:hover:[&_a]:text-neutral-50">
        By clicking reset, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
