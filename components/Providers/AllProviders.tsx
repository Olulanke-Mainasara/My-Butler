"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Shared/UI/Cards/AppSidebar";
import { useTransitionRouter, ViewTransitions } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const router = useTransitionRouter();

  return (
    <ViewTransitions>
      <SidebarProvider defaultOpen={false}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppSidebar />
          <main className="w-full flex flex-col relative">
            <div
              className={`flex justify-between items-center absolute z-40 top-0 w-full ${
                pathname !== "/" ? "p-3" : "pr-3"
              }`}
            >
              {pathname !== "/" ? (
                <button
                  onClick={() => router.back()}
                  className="w-fit flex items-center text-xl"
                >
                  <ArrowLeft /> back
                </button>
              ) : (
                <div className="bg-background dark:border-4 rounded-br-2xl dark:border-l-0 dark:border-t-0">
                  <p className="text-3xl text-white p-4">
                    My{" "}
                    <span className="text-brand tracking-widest">Butler</span>
                  </p>
                </div>
              )}

              <SidebarTrigger />
            </div>
            {children}
          </main>
        </ThemeProvider>
      </SidebarProvider>
    </ViewTransitions>
  );
};

export default AllProviders;
