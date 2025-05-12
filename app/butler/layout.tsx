"use client";

import React from "react";
import { ChatSidebar } from "@/components/Custom-UI/Sidebars/ChatSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { Sidebar } from "lucide-react";
import { useCustomerProfile } from "@/components/Providers/UserProvider";

export default function ButlerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customerProfile = useCustomerProfile();
  return (
    <SidebarProvider>
      {customerProfile && <ChatSidebar />}
      <main className="flex h-screen w-full">
        {children}
        {customerProfile && (
          <SidebarTrigger className="absolute top-4 right-14 bg-lightBackground dark:bg-darkBackground z-50">
            <Sidebar />
          </SidebarTrigger>
        )}
      </main>
    </SidebarProvider>
  );
}
