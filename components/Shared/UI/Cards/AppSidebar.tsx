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
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

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
    url: "/calender",
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
  const pathname = usePathname();

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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
