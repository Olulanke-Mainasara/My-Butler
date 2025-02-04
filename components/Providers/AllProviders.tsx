"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Shared/UI/Cards/AppSidebar";
import { ViewTransitions } from "next-view-transitions";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const authContext = React.createContext<User | null>(null);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <authContext.Provider value={user}>
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
              <div className="flex justify-end items-center absolute z-40 top-0 w-full p-3">
                <SidebarTrigger />
              </div>
              {children}
            </main>
          </ThemeProvider>
        </SidebarProvider>
      </ViewTransitions>
    </authContext.Provider>
  );
};

export default AllProviders;
