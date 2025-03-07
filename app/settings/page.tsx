import { ProfileForm } from "@/app/settings/profile-form";
import React from "react";

const page = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium">Profile</h3>
        <p className="opacity-70">
          This is how others will see you on the site.
        </p>
      </div>
      <hr />
      <ProfileForm />
    </div>
  );
};

export default page;
