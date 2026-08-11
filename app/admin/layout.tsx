"use client";

import { ProfileSidebar } from "@/components/Custom-UI/Sidebars/ProfileSidebar";
import { useAuth } from "@/components/Providers/AllProviders";
import { useIsAdmin } from "@/hooks/use-user-info";
import { Button } from "@/components/Shad-UI/button";
import { Icons } from "@/components/Custom-UI/icons";
import { supabase } from "@/lib/supabase/client";
import {
  ChartColumnBig,
  LogOut,
  Receipt,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import React from "react";

const AdminSidebarItems = [
  {
    id: 1,
    href: "/admin",
    title: "Overview",
    icon: <ChartColumnBig />,
  },
  {
    id: 2,
    href: "/admin/brands",
    title: "Brands",
    icon: <Store />,
  },
  {
    id: 3,
    href: "/admin/customers",
    title: "Customers",
    icon: <Users />,
  },
  {
    id: 4,
    href: "/admin/orders",
    title: "Orders",
    icon: <Receipt />,
  },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAuth();
  const { isAdmin, isLoading } = useIsAdmin(user?.id);

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.reload();
    }
  };

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2">
        <p className="text-2xl">Not authorized</p>
        <p className="opacity-70">This page is only for site admins.</p>
      </div>
    );
  }

  return (
    <div className="px-3 pt-16 pb-4 xl:pb-5 lg:h-screen lg:overflow-y-scroll flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row md:justify-between lg:items-center">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black">
            <ShieldCheck size={40} />
          </span>
          <h2 className="text-3xl md:text-4xl">Admin dashboard</h2>
        </div>

        <div className="flex gap-4">
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
          <ProfileSidebar
            items={AdminSidebarItems}
            className="overflow-scroll scrollbar-hide"
          />
        </aside>
        <div className="h-full overflow-y-scroll w-full">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
