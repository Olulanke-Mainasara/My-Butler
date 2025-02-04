"use client";

import React from "react";
import { Button } from "@/components/Shad-UI/button";
import { Link } from "next-view-transitions";
import EmailLogo from "@/public/emailLogo.png";
import Image from "next/image";
import { authContext } from "@/components/Providers/AllProviders";

const VerifyEmail = () => {
  const user = React.useContext(authContext);

  return (
    <div className="h-screen flex items-center justify-center">
      {user?.confirmed_at ? (
        <div className="space-y-5 border p-4 rounded-lg text-white text-center">
          <div className="flex flex-col items-center">
            <Image src={EmailLogo} className="w-32 bg-black" alt="Email Logo" />
            <h1 className="text-4xl">Email verified</h1>
          </div>

          <div className="flex flex-col items-center">
            <p>
              Your email{" "}
              <span className="font-bold text-brand">{user?.email}</span> has
              been verified.
            </p>
            <p className="max-w-xl">
              You can return to your previous tab and close this one or go back
              to the home page
            </p>
          </div>

          <Button size={"lg"} asChild>
            <Link href={"/"}>Home</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5 border p-4 rounded-lg text-white text-center">
          <div className="flex flex-col items-center">
            <Image src={EmailLogo} className="w-32 bg-black" alt="Email Logo" />
            <h1 className="text-4xl">Verify your email address</h1>
          </div>

          <div className="flex flex-col items-center">
            <p>A verification email has been sent to your email.</p>
            <p className="max-w-xl">
              Please check your email and click the verification link.
            </p>
          </div>

          <Button size={"lg"} asChild>
            <Link href={"/"}>Home</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
