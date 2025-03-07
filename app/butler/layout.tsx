"use client";

import React from "react";
import { ChatSidebar } from "@/components/Shared/UI/Sidebars/ChatSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { Sidebar } from "lucide-react";
import { useAuth } from "@/components/Providers/AllProviders";

export default function ButlerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuth();
  return (
    <SidebarProvider>
      {user && <ChatSidebar />}
      <main className="flex h-screen w-full">
        {children}
        {user && (
          <SidebarTrigger className="absolute top-4 right-11 bg-lightBackground dark:bg-darkBackground z-50">
            <Sidebar />
          </SidebarTrigger>
        )}
      </main>
    </SidebarProvider>
  );
}
