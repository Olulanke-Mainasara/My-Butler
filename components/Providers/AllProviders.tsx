"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Custom-UI/Sidebars/AppSidebar";
import { ViewTransitions } from "next-view-transitions";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { Toaster } from "../Shad-UI/toaster";
import { Sonner } from "../Shad-UI/sonner";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";
import { useUserInfo } from "@/hooks/use-user-info";
import UserProvider from "./UserProvider";
import { Bookmark } from "@/types/Bookmark";
import NavBar from "../Custom-UI/NavBar";

const authContext = React.createContext<User | null>(null);
export const useAuth = () => React.useContext(authContext);

const notificationsContext = React.createContext<
  Notification[] | null | undefined
>(null);
export const useNotifications = () => React.useContext(notificationsContext);

const cartContext = React.createContext<CartItem[] | null | undefined>(null);
export const useCart = () => React.useContext(cartContext);

const bookmarksContext = React.createContext<Bookmark[] | null | undefined>(
  null,
);
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
                      <NavBar />
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
