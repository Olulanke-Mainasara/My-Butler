"use client";

import { ProfileForm } from "./profile-form";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import React from "react";

const Settings = () => {
  const userProfile = useCustomerProfile();
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-medium">Profile</h3>
        <p className="opacity-70">This is how customers will see you.</p>
      </div>
      <hr />
      {userProfile ? (
        <ProfileForm />
      ) : (
        <div className="h-full flex flex-col gap-1 items-center justify-center text-2xl grow">
          <p>Your info is not available, please retry.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      )}
    </div>
  );
};

export default Settings;
