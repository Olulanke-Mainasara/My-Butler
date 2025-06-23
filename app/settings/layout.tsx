"use client";

import { SidebarNav } from "@/components/Custom-UI/Sidebars/SidebarNav";
import { Button } from "@/components/Shad-UI/button";
import { SunMoon, User } from "lucide-react";
import { Link } from "next-view-transitions";
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
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
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
      </div>
    </div>
  );
};

export default SettingsLayout;
