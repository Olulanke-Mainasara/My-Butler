"use client";

import React, { useState } from "react";
import { Button } from "@/components/Shad-UI/button";
import { Card, CardContent } from "@/components/Shad-UI/card";
import { Input } from "@/components/Shad-UI/input";
import { Label } from "@/components/Shad-UI/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Icons } from "@/components/Custom-UI/icons";
import { getURL } from "@/lib/utils";
import { ThirdPartySignIn } from "@/components/Custom-UI/Buttons/ThirdPartySignIn";
import { Provider } from "@supabase/supabase-js";
import LightSignupImg from "@/public/AuthImgs/signup-light.svg";
import DarkSignupImg from "@/public/AuthImgs/signup-dark.svg";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

export function SignupForm({ ...props }: React.ComponentProps<"div">) {
  const [role, setRole] = useState<"customer" | "brand">("customer");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandURL, setBrandURL] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [brandLocation, setBrandLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const role_id = role === "customer" ? 2 : 4;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      phone: contactNumber,
      options: {
        emailRedirectTo:
          role_id === 2 ? `${getURL()}auth/email-verified` : `${getURL()}brand`,
        data:
          role_id === 2
            ? {
                role_id,
                display_name: fname + " " + lname,
                full_name: fname + " " + lname,
                picture: "",
              }
            : {
                role_id,
                display_name: brandName,
                brand_name: brandName,
                brand_description: brandDescription,
                brand_url: brandURL,
                brand_location: brandLocation,
              },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/auth/verify-email");
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
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 max-w-md mx-auto">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Let&apos;s get cooking</h1>
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
                    <div className="grid gap-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Your Brand Name"
                        required
                        minLength={2}
                        maxLength={100}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brandDescription">
                        Brand Description
                      </Label>
                      <Input
                        id="brandDescription"
                        type="text"
                        value={brandDescription}
                        onChange={(e) => setBrandDescription(e.target.value)}
                        placeholder="Describe your brand"
                        required
                        minLength={10}
                        maxLength={500}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brandURL">Brand URL</Label>
                      <Input
                        id="brandURL"
                        type="text"
                        value={brandURL}
                        onChange={(e) => setBrandURL(e.target.value)}
                        placeholder="Share your brand's main platform link"
                        required
                        minLength={10}
                        maxLength={500}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brandLocation">Brand Location</Label>
                      <Input
                        id="brandLocation"
                        type="text"
                        value={brandLocation}
                        onChange={(e) => setBrandLocation(e.target.value)}
                        placeholder="Share your brand's location"
                        minLength={10}
                        maxLength={500}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        type="text"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Share your contact number"
                        required
                        minLength={10}
                        maxLength={500}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <div className="grid gap-2 w-full">
                      <Label htmlFor="fname">First name</Label>
                      <Input
                        id="fname"
                        type="text"
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        placeholder="Clark"
                        required
                        minLength={2}
                        maxLength={50}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid gap-2 w-full">
                      <Label htmlFor="lname">Last name</Label>
                      <Input
                        id="lname"
                        type="text"
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        placeholder="Kent"
                        required
                        minLength={2}
                        maxLength={50}
                        disabled={loading}
                        className="disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Common Fields */}

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {role === "brand" ? "Brand " : ""}Email
                  </Label>
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
