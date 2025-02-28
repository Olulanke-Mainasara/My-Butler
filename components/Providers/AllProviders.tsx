"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Shared/UI/Cards/AppSidebar";
import { Link, ViewTransitions } from "next-view-transitions";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { BellDot } from "lucide-react";
import { usePathname } from "next/navigation";

export const authContext = React.createContext<User | null>(null);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User | null>(null);
  const pathname = usePathname();

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
            <main className="w-full relative">
              <div
                className={`flex justify-between items-center fixed z-40 top-0 right-0 ${
                  pathname === "/butler" && user
                    ? "w-full xl:w-[83.1%]"
                    : "w-full"
                } p-3 bg-lightBackground dark:bg-darkBackground`}
              >
                <SidebarTrigger />
                <Link href={"/?splashed=true"} className="text-2xl">
                  My{" "}
                  <span className="text-brandLight dark:text-brandDark ">
                    Butler
                  </span>
                </Link>
                <Link href={"/notifications"}>
                  <BellDot />
                </Link>
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
