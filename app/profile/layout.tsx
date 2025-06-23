"use client";

import { SidebarNav } from "@/components/Custom-UI/Sidebars/SidebarNav";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import {
  BookCopy,
  ImageIcon,
  LogOut,
  Newspaper,
  PartyPopper,
  Pencil,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import React from "react";
import { supabase } from "@/lib/supabase/client";

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
];

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const customerProfile = useCustomerProfile();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="px-4 xl:px-3 pt-16 pb-4 xl:pb-5 h-screen overflow-y-scroll flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between lg:items-center">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-2">
          <div className="flex items-center gap-2">
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
          </div>
        </div>

        <div className="flex gap-4">
          <Button asChild variant="outline" className="w-full md:w-fit">
            <Link href={"/settings"}>
              <Pencil />
              Edit Profile
            </Link>
          </Button>

          <Button
            onClick={handleSignout}
            variant="outline"
            className="w-full md:w-fit"
          >
            <span className="flex gap-1 items-center">
              <LogOut /> Sign out
            </span>
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
