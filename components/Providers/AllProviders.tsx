"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Custom-UI/Sidebars/AppSidebar";
import { Link, ViewTransitions } from "next-view-transitions";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { Toaster } from "../Shad-UI/toaster";
import { Sonner } from "../Shad-UI/sonner";
import NotificationsDrawerTrigger from "../Custom-UI/Buttons/NotificationsDrawerTrigger";
import CartDrawerTrigger from "../Custom-UI/Buttons/CartDrawerTrigger";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";
import { UserProfile } from "@/types/UserProfile";
import { useUserInfo } from "@/hooks/use-user-info";

const authContext = React.createContext<User | null>(null);
export const useAuth = () => React.useContext(authContext);

const userProfileContext = React.createContext<UserProfile | null>(null);
export const useUserProfile = () => React.useContext(userProfileContext);

const notificationsContext = React.createContext<Notification[] | null>(null);
export const useNotifications = () => React.useContext(notificationsContext);

const cartContext = React.createContext<CartItem[] | null>(null);
export const useCart = () => React.useContext(cartContext);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();

  const { userSession, userProfile, notifications, cart } = useUserInfo();

  return (
    <authContext.Provider value={userSession}>
      <userProfileContext.Provider value={userProfile}>
        <ViewTransitions>
          <SidebarProvider defaultOpen={false}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <notificationsContext.Provider value={notifications}>
                <cartContext.Provider value={cart}>
                  <AppSidebar />
                  <main className="w-full relative">
                    <div
                      className={`flex justify-between items-center fixed z-40 top-0 right-0 w-full p-3 ${
                        pathname !== "/camera" && pathname !== "/combine"
                          ? "bg-lightBackground dark:bg-darkBackground"
                          : "text-white"
                      } `}
                    >
                      <SidebarTrigger />
                      <Link
                        href={"/?splashed=true"}
                        className={`text-2xl ${
                          pathname === "/camera" ? "hidden" : ""
                        }`}
                      >
                        My{" "}
                        <span className="text-brandLight dark:text-brandDark ">
                          Butler
                        </span>
                      </Link>
                      {pathname !== "/notifications" ? (
                        <NotificationsDrawerTrigger />
                      ) : (
                        <CartDrawerTrigger />
                      )}
                    </div>
                    {children}
                  </main>
                  <Toaster />
                  <Sonner />
                </cartContext.Provider>
              </notificationsContext.Provider>
            </ThemeProvider>
          </SidebarProvider>
        </ViewTransitions>
      </userProfileContext.Provider>
    </authContext.Provider>
  );
};

export default AllProviders;
