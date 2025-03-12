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
import { Link, useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import logoDark from "@/public/Logo/logoDark.png";
import logoLight from "@/public/Logo/logoLight.png";
import { groupedNavigation } from "@/static-data/navigation";
import { ChevronUp, LogIn } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/components/Providers/AllProviders";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const userProfile = useUserProfile();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      toggleSidebar();
      if (pathname !== "/") {
        router.push("/");
      }
    }
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
                      size={isMobile ? "default" : "sm"}
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
            {userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-12">
                    <Image
                      src={
                        userProfile.profile_picture
                          ? userProfile.profile_picture
                          : theme === "dark"
                          ? logoDark
                          : logoLight
                      }
                      className="w-8 h-8 rounded-full"
                      alt="logo"
                      width={40}
                      height={40}
                    />{" "}
                    {userProfile.display_name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      toggleSidebar();
                      router.push("/profile");
                    }}
                  >
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignout}>
                    <span>Sign out</span>
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
                className="h-10 rounded-full bg-darkBackground text-white dark:bg-white dark:text-black justify-center hover:bg-neutral-800 hover:text-white transition-colors dark:hover:bg-neutral-700 dark:hover:text-white"
              >
                <Link href="/auth/login">
                  <LogIn />
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
