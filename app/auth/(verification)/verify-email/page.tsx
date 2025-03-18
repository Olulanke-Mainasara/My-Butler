"use client";

import React from "react";
import { Button } from "@/components/Shad-UI/button";
import { Link } from "next-view-transitions";
import { MailCheck, MailPlus } from "lucide-react";
import { useAuth } from "@/components/Providers/AllProviders";

const VerifyEmail = () => {
  const userSession = useAuth();

  return (
    <div className="h-screen flex items-center justify-center px-4">
      {userSession?.confirmed_at ? (
        <div className="space-y-4 border border-darkBackground dark:border-lightBackground p-4 rounded-lg dark:text-white text-center">
          <div className="flex flex-col items-center gap-3">
            <MailCheck
              size={70}
              className="text-brandLight dark:text-brandDark"
            />
            <h1 className="text-4xl">Email verified</h1>
          </div>

          <div className="flex flex-col items-center">
            <p>
              Your email{" "}
              <span className="font-bold text-brandLight dark:text-brandDark">
                {userSession?.email}
              </span>{" "}
              has been verified.
            </p>
            <p className="max-w-md">
              You can return to your previous tab and close this one or go back
              to the home page
            </p>
          </div>

          <Button size={"lg"} asChild>
            <Link href={"/?splashed=true"}>Home</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4 border border-darkBackground dark:border-lightBackground p-4 rounded-lg dark:text-white text-center">
          <div className="flex flex-col items-center gap-3">
            <MailPlus
              size={70}
              className="text-brandLight dark:text-brandDark"
            />
            <h1 className="text-4xl">Verify email address</h1>
          </div>

          <div className="flex flex-col items-center">
            <p>A verification email has been sent to your email.</p>
            <p className="max-w-md">
              Please check your email and click the verification link.
            </p>
          </div>

          <Button size={"lg"} asChild>
            <Link href={"/?splashed=true"}>Home</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
