"use client";

import { ProfileForm } from "@/app/settings/profile-form";
import { useUserProfile } from "@/components/Providers/AllProviders";
import React from "react";

const Settings = () => {
  const userProfile = useUserProfile();
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-medium">Profile</h3>
        <p className="opacity-70">
          This is how others will see you on the site.
        </p>
      </div>
      <hr />
      {userProfile ? (
        <ProfileForm />
      ) : (
        <div className="h-full flex items-center justify-center text-2xl grow">
          Fetching user info...
        </div>
      )}
    </div>
  );
};

export default Settings;
