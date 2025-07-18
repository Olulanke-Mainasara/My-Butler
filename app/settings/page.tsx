"use client";

import { ProfileForm } from "./profile-form";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import { Link } from "next-view-transitions";
import React from "react";

const Settings = () => {
  const customerProfile = useCustomerProfile();
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-medium">Profile</h3>
        <p className="opacity-70">
          This is how others will see you on the site.
        </p>
      </div>
      <hr />
      {customerProfile ? (
        <ProfileForm />
      ) : (
        <div className="h-full flex flex-col gap-2 items-center justify-center text-xl text-center grow">
          <p>Your info is not available, please login or reload the page.</p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href={"/auth/login"}>Login</Link>
            </Button>
            <Button
              variant={"outline"}
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
