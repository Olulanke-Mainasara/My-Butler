"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/Shad-UI/sidebar";
import { AppSidebar } from "../Shared/UI/Sidebars/AppSidebar";
import { Link, ViewTransitions } from "next-view-transitions";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { Toaster } from "../Shad-UI/toaster";
import NotificationsDrawerTrigger from "../Shared/UI/Buttons/NotificationsDrawerTrigger";
import CartDrawerTrigger from "../Shared/UI/Buttons/CartDrawerTrigger";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";

const authContext = React.createContext<User | null>(null);
export const useAuth = () => React.useContext(authContext);

const notificationsContext = React.createContext<Notification[] | null>(null);
export const useNotifications = () => React.useContext(notificationsContext);

const cartContext = React.createContext<CartItem[] | null>(null);
export const useCart = () => React.useContext(cartContext);

const AllProviders = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [notifications, setNotifications] = React.useState<
    Notification[] | null
  >(null);
  const [cart, setCart] = React.useState<CartItem[] | null>(null);
  const pathname = usePathname();

  const fetchCartItems = async (user: User) => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return;
    }

    setCart(data);
  };

  const fetchNotifications = async (user: User) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return;
    }

    setNotifications(data);
  };

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchCartItems(user);
      fetchNotifications(user);
    }
  }, [user]);

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
    </authContext.Provider>
  );
};

export default AllProviders;
