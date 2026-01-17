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
import { ChevronUp, LogIn, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function AppSidebar() {
  const customerProfile = useCustomerProfile();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const queryClient = useQueryClient();

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
      <SidebarContent className="sm:justify-center gap-0 px-0">
        {groupedNavigation.map((group) => (
          <SidebarGroup key={group.id} className="pt-0 px-2">
            <SidebarGroupLabel className="tracking-normal text-base text-neutral-500">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.links.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === link.url}
                      size={"default"}
                      onClick={() => {
                        toggleSidebar();
                        router.push(`${link.url}`);
                      }}
                    >
                      <Link href={link.url}>
                        <span className="text-brandLight dark:text-brandDark text-sm">
                          {React.cloneElement(link.icon, { size: 20 })}
                        </span>
                        <span>{link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {group.id !== "4" && (
              <SidebarSeparator className="bg-transparent dark:bg-transparent opacity-50" />
            )}
          </SidebarGroup>
        ))}
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
                        className="w-8 h-8 rounded-full"
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
                  className="w-[--radix-popper-anchor-width]"
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
