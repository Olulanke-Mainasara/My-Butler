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
import { useUserInfo } from "@/hooks/use-user-info";
import UserProvider from "./UserProvider";
import { ThemeToggler } from "../Custom-UI/Buttons/ThemeToggler";
import { Bookmark } from "@/types/Bookmark";

const authContext = React.createContext<User | null>(null);
export const useAuth = () => React.useContext(authContext);

const notificationsContext = React.createContext<Notification[] | null>(null);
export const useNotifications = () => React.useContext(notificationsContext);

const cartContext = React.createContext<CartItem[] | null>(null);
export const useCart = () => React.useContext(cartContext);

const bookmarksContext = React.createContext<Bookmark[] | null>(null);
export const useBookmarks = () => React.useContext(bookmarksContext);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();

  const {
    userSession,
    customerProfile,
    brandProfile,
    notifications,
    cart,
    bookmarks,
  } = useUserInfo();

  return (
    <authContext.Provider value={userSession}>
      <UserProvider
        userSession={userSession}
        customerProfile={customerProfile}
        brandProfile={brandProfile}
      >
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
                  <bookmarksContext.Provider value={bookmarks}>
                    {!pathname.startsWith("/brand-dashboard") ? (
                      <AppSidebar />
                    ) : (
                      <></>
                    )}

                    <main className="w-full relative">
                      <div
                        suppressHydrationWarning
                        className={`flex justify-between items-center fixed z-40 top-0 right-0 w-full py-3 px-4 md:px-5 ${
                          pathname !== "/camera" &&
                          pathname !== "/combine" &&
                          pathname !== "/combine/personal"
                            ? "bg-lightBackground dark:bg-darkBackground"
                            : "text-white"
                        }`}
                      >
                        {!pathname.startsWith("/brand-dashboard") ? (
                          <SidebarTrigger />
                        ) : (
                          <></>
                        )}

                        <Link
                          href={
                            pathname.startsWith("/brand-dashboard")
                              ? "/brand-dashboard"
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
                        {pathname.startsWith("/brand-dashboard") ? (
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
                  </bookmarksContext.Provider>
                </cartContext.Provider>
              </notificationsContext.Provider>
            </ThemeProvider>
          </SidebarProvider>
        </ViewTransitions>
      </UserProvider>
    </authContext.Provider>
  );
};

export default AllProviders;
