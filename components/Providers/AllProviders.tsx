"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Custom-UI/Sidebars/AppSidebar";
import { Link, ViewTransitions } from "next-view-transitions";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { Toaster } from "../Shad-UI/toaster";
import NotificationsDrawerTrigger from "../Custom-UI/Buttons/NotificationsDrawerTrigger";
import CartDrawerTrigger from "../Custom-UI/Buttons/CartDrawerTrigger";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";
import { UserProfile } from "@/types/UserProfile";

const authContext = React.createContext<User | null>(null);
export const useAuth = () => React.useContext(authContext);

const userProfileContext = React.createContext<UserProfile | null>(null);
export const useUserProfile = () => React.useContext(userProfileContext);

const notificationsContext = React.createContext<Notification[] | null>(null);
export const useNotifications = () => React.useContext(notificationsContext);

const cartContext = React.createContext<CartItem[] | null>(null);
export const useCart = () => React.useContext(cartContext);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const [userSession, setUserSession] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(
    null
  );
  const [notifications, setNotifications] = React.useState<
    Notification[] | null
  >(null);
  const [cart, setCart] = React.useState<CartItem[] | null>(null);
  const pathname = usePathname();

  const fetchCartItems = async (userSession: User) => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userSession.id);

    if (error) {
      return;
    }

    setCart(data);
  };

  const fetchNotifications = async (userSession: User) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userSession.id)
      .order("created_at", { ascending: false });

    if (error) {
      return;
    }

    setNotifications(data);
  };

  const fetchUserProfile = async (userSession: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userSession.id)
      .single();

    if (error) {
      return;
    }

    setUserProfile(data);
  };

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUserSession(session.user);
        } else {
          setUserSession(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (userSession) {
      fetchUserProfile(userSession);
      fetchCartItems(userSession);
      fetchNotifications(userSession);
    } else {
      setUserProfile(null);
      setCart(null);
      setNotifications(null);
    }
  }, [userSession]);

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
                    <div className="flex justify-between items-center fixed z-40 top-0 right-0 w-full p-3 bg-lightBackground dark:bg-darkBackground">
                      <SidebarTrigger />
                      <Link href={"/?splashed=true"} className="text-2xl">
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
