"use client";

import { SidebarNav } from "@/components/Custom-UI/Sidebars/SidebarNav";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import {
  BookCopy,
  ImageIcon,
  Newspaper,
  PartyPopper,
  Pencil,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

const SidebarNavItems = [
  {
    id: 1,
    href: "/profile",
    title: "Products",
    icon: <ShoppingBag />,
  },
  {
    id: 2,
    href: "/profile/collections",
    title: "Collections",
    icon: <BookCopy />,
  },
  {
    id: 3,
    href: "/profile/articles",
    title: "Articles",
    icon: <Newspaper />,
  },
  {
    id: 4,
    href: "/profile/events",
    title: "Events",
    icon: <PartyPopper />,
  },
  {
    id: 5,
    href: "/profile/gallery",
    title: "Gallery",
    icon: <ImageIcon />,
  },
  {
    id: 6,
    href: "/settings",
    title: "Settings",
    icon: <Settings />,
  },
];

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const customerProfile = useCustomerProfile();

  return (
    <div className="px-4 xl:px-3 pt-16 pb-4 xl:pb-5 h-screen overflow-y-scroll flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between lg:items-center">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-2">
          <div className="flex items-center gap-2">
            {!customerProfile ? (
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-neutral-200" />
                <div className="space-y-2">
                  <div className="h-6 w-40 bg-neutral-200 rounded" />
                  <div className="h-4 w-32 bg-neutral-200 rounded opacity-70" />
                </div>
              </div>
            ) : (
              <>
                {customerProfile?.profile_picture ? (
                  <Image
                    src={customerProfile.profile_picture}
                    className="w-16 h-16 rounded-full"
                    alt="Profile picture"
                    width={40}
                    height={40}
                    quality={75}
                  />
                ) : (
                  <span className="p-2 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black">
                    <User size={40} />
                  </span>
                )}
                <div className="space-y-0.5">
                  <h2 className="text-3xl md:text-4xl">
                    {customerProfile?.display_name}
                  </h2>
                  <p className="opacity-70">{customerProfile?.email}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline" className="w-full md:w-fit">
            <Link href={"/settings"}>
              <Pencil />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row lg:space-y-0 h-full overflow-scroll">
        <aside className="lg:w-2/12">
          <SidebarNav
            items={SidebarNavItems}
            className="overflow-scroll scrollbar-hide"
          />
        </aside>
        <div className="h-full overflow-y-scroll w-full">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
