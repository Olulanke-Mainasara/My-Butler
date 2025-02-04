"use client";

import { BellIcon, Calendar, Home, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/Shad-UI/sidebar";
import { ThemeToggler } from "../Buttons/ThemeToggler";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/Shad-UI/sidebar";
import { useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase";
import { useContext } from "react";
import { authContext } from "@/components/Providers/AllProviders";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/?splashed=true",
    icon: Home,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: BellIcon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const user = useContext(authContext);
  const pathname = usePathname();
  const router = useTransitionRouter();
  const { toggleSidebar } = useSidebar();

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Error signing out:", error.message);
    } else {
      console.log("Sign out successful");
      router.push("/");
    }
  };

  return (
    <Sidebar className="opacity-100">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {pathname !== "/" ? (
              <p>
                My <span className="text-brand tracking-widest">Butler</span>
              </p>
            ) : (
              <p>
                Hi <span className="text-brand tracking-widest">Maina</span>
              </p>
            )}{" "}
            <ThemeToggler />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size={"lg"}>
                    <button
                      onClick={() => {
                        toggleSidebar();
                        router.push(`${item.url}`);
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size={"lg"}>
                    <button
                      onClick={() => {
                        toggleSidebar();
                        handleSignout();
                      }}
                    >
                      Sign out
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
