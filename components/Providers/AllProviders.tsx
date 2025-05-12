"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Custom-UI/Sidebars/AppSidebar";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { Toaster } from "../Shad-UI/toaster";
import { Sonner } from "../Shad-UI/sonner";
import NotificationsDrawerTrigger from "../Custom-UI/Buttons/NotificationsDrawerTrigger";
import CartDrawerTrigger from "../Custom-UI/Buttons/CartDrawerTrigger";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";
import { useUserInfo } from "@/hooks/use-user-info";
import UserProvider from "./UserProvider";
import { ThemeToggler } from "../Custom-UI/Buttons/ThemeToggler";

const authContext = React.createContext<User | null>(null);
export const useAuth = () => React.useContext(authContext);

const notificationsContext = React.createContext<Notification[] | null>(null);
export const useNotifications = () => React.useContext(notificationsContext);

const cartContext = React.createContext<CartItem[] | null>(null);
export const useCart = () => React.useContext(cartContext);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();

  const { userSession, customerProfile, brandProfile, notifications, cart } =
    useUserInfo();

  return (
    <authContext.Provider value={userSession}>
      <UserProvider
        userSession={userSession}
        customerProfile={customerProfile}
        brandProfile={brandProfile}
      >
        <SidebarProvider defaultOpen={false}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <notificationsContext.Provider value={notifications}>
              <cartContext.Provider value={cart}>
                {!pathname.startsWith("/brand") ? <AppSidebar /> : <></>}

                <main className="w-full relative">
                  <div
                    suppressHydrationWarning
                    className={`flex justify-between items-center fixed z-40 top-0 right-0 w-full p-3 ${
                      pathname !== "/camera" &&
                      pathname !== "/combine" &&
                      pathname !== "/combine/personal"
                        ? "bg-lightBackground dark:bg-darkBackground"
                        : "text-white"
                    }`}
                  >
                    {!pathname.startsWith("/brand") ? (
                      <SidebarTrigger />
                    ) : (
                      <></>
                    )}

                    <Link
                      href={
                        pathname.startsWith("/brand")
                          ? "/brand"
                          : "/?splashed=true"
                      }
                      className={`text-2xl ${
                        pathname === "/camera" ||
                        pathname === "/combine/personal"
                          ? "hidden"
                          : ""
                      }`}
                    >
                      My{" "}
                      <span className="text-brandLight dark:text-brandDark ">
                        Butler
                      </span>
                    </Link>
                    {pathname.startsWith("/brand") ? (
                      <ThemeToggler />
                    ) : pathname !== "/notifications" ? (
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
      </UserProvider>
    </authContext.Provider>
  );
};

export default AllProviders;
