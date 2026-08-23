"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/Shad-UI/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Shad-UI/dropdown-menu";
import { ThemeToggler } from "../Buttons/ThemeToggler";
import { useSidebar } from "@/components/Shad-UI/sidebar";
import { useTransitionRouter } from "next-view-transitions";
import { Link } from "next-view-transitions";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import logoDark from "@/public/Logo/logoDark.png";
import logoLight from "@/public/Logo/logoLight.png";
import { groupedNavigation } from "@/static-data/navigation";
import { ChevronUp, LogIn, LogOut, ShieldCheck, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { useAuth } from "@/components/Providers/AllProviders";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useIsAdmin } from "@/hooks/use-user-info";

export function AppSidebar() {
  const customerProfile = useCustomerProfile();
  const user = useAuth();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const queryClient = useQueryClient();

  // Admin status has nothing to do with role_id (customer vs brand) - it's
  // a separate `admins` table membership check, so this link only shows up
  // for accounts actually in that table, regardless of which profile
  // context they're otherwise using.
  const { isAdmin } = useIsAdmin(user?.id);

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }

    // 🔥 Clear all cached user data
    queryClient.clear();

    toggleSidebar();

    // Optional but recommended for App Router
    router.replace("/auth/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Image
            src={theme === "dark" ? logoDark : logoLight}
            className="w-10 h-10"
            alt="logo"
          />
          <p className="text-2xl">My Butler</p>
        </div>
        <div className="flex gap-5 items-center">
          <ThemeToggler />
        </div>
      </SidebarHeader>
      <SidebarSeparator className="bg-darkBackground dark:bg-lightBackground w-full ml-0" />
      <SidebarContent className="gap-0 px-0">
        {groupedNavigation.map((group) => (
          <SidebarGroup key={group.id} className="pt-0 px-2">
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-2 pt-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.links.map((link) => {
                  const active = pathname === link.url;
                  return (
                    <SidebarMenuItem key={link.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        size={"default"}
                        onClick={() => {
                          toggleSidebar();
                          router.push(`${link.url}`);
                        }}
                      >
                        <Link href={link.url}>
                          <span
                            className={`shrink-0 ${
                              active
                                ? "text-brandLight dark:text-brandDark"
                                : "text-neutral-500 dark:text-neutral-400"
                            }`}
                          >
                            {React.cloneElement(link.icon, { size: 20 })}
                          </span>
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {group.id !== "4" && (
              <SidebarSeparator className="bg-transparent dark:bg-transparent opacity-50" />
            )}
          </SidebarGroup>
        ))}

        {isAdmin && (
          <SidebarGroup className="pt-0 px-2">
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-2 pt-1">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/admin"}
                    size={"default"}
                    onClick={() => {
                      toggleSidebar();
                      router.push("/admin");
                    }}
                  >
                    <Link href="/admin">
                      <span
                        className={`shrink-0 ${
                          pathname === "/admin"
                            ? "text-brandLight dark:text-brandDark"
                            : "text-amber-600 dark:text-amber-500"
                        }`}
                      >
                        <ShieldCheck size={20} />
                      </span>
                      <span>Admin Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarSeparator className="bg-darkBackground dark:bg-lightBackground w-full ml-0" />
      <SidebarFooter className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {customerProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-12">
                    {customerProfile.profile_picture ? (
                      <Image
                        src={customerProfile.profile_picture}
                        className="w-8 h-8 object-cover rounded-full"
                        alt="logo"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <span className="p-1 rounded-full bg-darkBackground text-white dark:bg-lightBackground dark:text-black">
                        <User />
                      </span>
                    )}{" "}
                    {customerProfile.display_name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-(--radix-popper-anchor-width)"
                >
                  <DropdownMenuItem
                    onClick={handleSignout}
                    className="cursor-pointer"
                  >
                    <span className="flex gap-1 items-center">
                      <LogOut /> Sign out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                asChild
                size={"default"}
                variant={"outline"}
                onClick={() => {
                  toggleSidebar();
                  router.push("/auth/login");
                }}
                className="h-10 rounded-full bg-darkBackground text-white dark:bg-white dark:text-black justify-center hover:bg-neutral-800 hover:text-white transition-colors dark:hover:bg-neutral-700 dark:hover:text-white gap-1"
              >
                <Link href="/auth/login">
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
