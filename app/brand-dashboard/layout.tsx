"use client";

import { SidebarNav } from "@/components/Custom-UI/Sidebars/SidebarNav";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import { supabase } from "@/lib/supabase/client";
import {
  BookCopy,
  ChartColumnBig,
  LogOut,
  Newspaper,
  PartyPopper,
  Pencil,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import NextLink from "next/link";
import React from "react";
import BrandLoadingSkeleton from "@/components/Custom-UI/Placeholders/BrandLoadingSkeleton";

const SidebarNavItems = [
  {
    id: 1,
    href: "/brand-dashboard",
    title: "Dashboard",
    icon: <ChartColumnBig />,
  },
  {
    id: 2,
    href: "/brand-dashboard/products",
    title: "Products",
    icon: <ShoppingBag />,
  },
  {
    id: 3,
    href: "/brand-dashboard/collections",
    title: "Collections",
    icon: <BookCopy />,
  },
  {
    id: 4,
    href: "/brand-dashboard/articles",
    title: "Articles",
    icon: <Newspaper />,
  },
  {
    id: 5,
    href: "/brand-dashboard/events",
    title: "Events",
    icon: <PartyPopper />,
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const brandProfile = useBrandProfile();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="px-3 pt-16 pb-4 xl:pb-5 lg:h-screen lg:overflow-y-scroll flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row md:justify-between lg:items-center">
        {!brandProfile ? (
          <BrandLoadingSkeleton />
        ) : (
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
            <div className="flex items-center gap-2">
              {brandProfile?.profile_picture ? (
                <Image
                  src={brandProfile.profile_picture}
                  className="w-14 h-14 rounded-full"
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
                <h2 className="text-3xl md:text-4xl">{brandProfile?.name}</h2>
                <p className="opacity-70">{brandProfile?.email}</p>
              </div>
            </div>
            <div className="md:flex">
              <div className="p-2 xl:px-6 border-l border-l-neutral-500">
                <p>{brandProfile?.description}</p>
              </div>
              <div className="p-2 xl:px-6 border-l border-l-neutral-500 hidden md:block">
                <NextLink
                  href={brandProfile?.url || ""}
                  prefetch={false}
                  target="_blank"
                >
                  {brandProfile?.url}
                </NextLink>
              </div>
              <div className="p-2 xl:px-6 border-l border-l-neutral-500 hidden md:block">
                <p>{brandProfile?.location}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button asChild variant="outline" className="w-full md:w-fit">
            <Link href={"/brand-dashboard/settings"}>
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

export default DashboardLayout;
