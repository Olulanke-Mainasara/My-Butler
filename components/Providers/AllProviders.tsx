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
import { Notification } from "@/types/system-types/Notification";
import { CartItem } from "@/types/system-types/CartItem";
import { useUserInfo } from "@/hooks/use-user-info";
import UserProvider from "./UserProvider";
import { Bookmark } from "@/types/system-types/Bookmark";
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

// next-view-transitions (v0.3.5) never attaches a .catch() to the promises
// returned by document.startViewTransition() - including a "fire and
// forget" call in its popstate handler that doesn't even keep a reference to
// them. If a navigation interrupts a transition still settling (rapid
// clicks, or a proxy.ts redirect landing mid-transition - both routine
// here), the browser skips the older one and rejects those promises with
// AbortError "Transition was skipped." The navigation itself still succeeds
// - only the cross-fade animation is skipped - but with nothing attached to
// catch it, this reaches Next's dev overlay as a runtime error.
//
// A window "unhandledrejection" listener can't fix this: Next registers its
// own independent listener (next/dist/next-devtools/userspace/app/errors/
// use-error-handler.js) that reports the error regardless of any other
// listener calling preventDefault() - listeners don't suppress each other,
// only the browser's own default action. The only real fix is attaching a
// handler to the promise before it can go unhandled at all, which means
// patching the native API itself so every call - including ones next-view-
// transitions never reads the return value of - gets one.
if (typeof window !== "undefined" && "startViewTransition" in document) {
  type ViewTransition = {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
  type StartViewTransition = (
    callback: () => void | Promise<void>,
  ) => ViewTransition;

  const nativeStartViewTransition = document.startViewTransition.bind(
    document,
  ) as StartViewTransition;

  const silenceSkipped = (promise: Promise<void>) =>
    promise.catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      throw error;
    });

  (
    document as unknown as { startViewTransition: StartViewTransition }
  ).startViewTransition = (callback) => {
    const transition = nativeStartViewTransition(callback);
    silenceSkipped(transition.ready);
    silenceSkipped(transition.finished);
    silenceSkipped(transition.updateCallbackDone);
    return transition;
  };
}

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
