"use client";

import { SidebarNav } from "@/components/Custom-UI/Sidebars/SidebarNav";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import { Paperclip, SunMoon, User } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

const sidebarNavItems = [
  {
    id: 1,
    href: "/settings",
    title: "Profile",
    icon: <User />,
  },
  {
    id: 2,
    href: "/settings/appearance",
    title: "Appearance",
    icon: <SunMoon />,
  },
  {
    id: 3,
    href: "/settings/additional-resources",
    title: "Additional Resources",
    icon: <Paperclip />,
  },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const customerProfile = useCustomerProfile();
  return (
    <div className="px-4 xl:px-3 pt-16 pb-4 xl:pb-5 h-screen overflow-y-scroll flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between lg:items-center">
        <div>
          <h2 className="text-4xl">Settings</h2>
          <p className="opacity-70">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full md:w-fit">
          <Link href={"/profile"}>View Profile</Link>
        </Button>
      </div>
      <hr />
      <div className="flex flex-col gap-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-full overflow-scroll">
        <aside className="lg:w-2/12">
          <SidebarNav items={sidebarNavItems} className="overflow-scroll" />
        </aside>
        <div className="h-full overflow-y-scroll w-full">{children}</div>
        <aside className="lg:w-10/12 hidden xl:block rounded-lg p-4">
          <div className="space-y-4 h-1/2 flex flex-col">
            <h2 className="text-2xl">Profile picture</h2>
            <div className="border flex items-center justify-center grow rounded-lg relative group">
              {customerProfile?.profile_picture ? (
                <Image
                  src={customerProfile?.profile_picture}
                  alt="Profile picture"
                />
              ) : (
                <span className="p-2 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black">
                  <User size={60} />
                </span>
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-brightness-50 transition-opacity">
                <Button>Edit</Button>
              </div>
            </div>
          </div>
          <div></div>
        </aside>
      </div>
    </div>
  );
};

export default SettingsLayout;
