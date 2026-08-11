"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  getCustomerProfile,
  getBrandProfile,
  getCartItems,
  getNotifications,
  getBookmarks,
  getChats,
  getIsAdmin,
} from "@/lib/fetches";
import { User } from "@supabase/supabase-js";
import React, { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { CustomerProfile } from "@/types/CustomerProfile";
import { BrandProfile } from "@/types/BrandProfile";
import { CartItem } from "@/types/CartItem";
import { Notification } from "@/types/Notification";
import { Bookmark } from "@/types/Bookmark";
import { useQueryClient } from "@tanstack/react-query";
import { ROLE_CUSTOMER, ROLE_BRAND } from "@/lib/roles";
import { invalidateTable } from "@/lib/utils";

function useUserRealtime(user: User | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime:user:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => invalidateTable(queryClient, "notifications")
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}

// Catalog data (what brands publish) has no per-user scope, so this
// subscribes regardless of auth state: a customer browsing signed out
// should still see a brand's new product without a hard refresh.
const CATALOG_TABLES = ["products", "collections", "events", "news", "brands"];

function useCatalogRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel("realtime:catalog");

    CATALOG_TABLES.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => invalidateTable(queryClient, table)
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

function useCustomerProfile(user: User | null) {
  const query = useQuery(getCustomerProfile(user?.id || ""), {
    enabled: !!user && user.user_metadata.role_id === ROLE_CUSTOMER,
  });

  return {
    ...query,
    data: query.data
      ? { ...query.data, role_id: user?.user_metadata.role_id || 0 }
      : query.data,
  };
}

function useBrandProfile(user: User | null) {
  const query = useQuery(getBrandProfile(user?.id || ""), {
    enabled: !!user && user.user_metadata.role_id === ROLE_BRAND,
  });

  return {
    ...query,
    data: query.data
      ? { ...query.data, role_id: user?.user_metadata.role_id || 0 }
      : query.data,
  };
}

function useCartItems(user: User | null) {
  return useQuery(getCartItems(user?.id || ""), {
    enabled: !!user,
  });
}

function useNotifications(user: User | null) {
  return useQuery(getNotifications(user?.id || ""), {
    enabled: !!user,
  });
}

function useBookmarks(user: User | null) {
  return useQuery(getBookmarks(user?.id || ""), {
    enabled: !!user,
  });
}

export function useChats(userId?: string) {
  return useQuery(getChats(userId || ""), {
    enabled: !!userId,
  });
}

// Admin status has nothing to do with role_id (customer vs brand) - it's a
// separate `admins` table membership check. Shared here since AppSidebar and
// the admin dashboard layout both need it.
export function useIsAdmin(userId?: string) {
  const { data, ...rest } = useQuery(getIsAdmin(userId || ""), {
    enabled: !!userId,
  });

  return { isAdmin: !!data, ...rest };
}

interface UseUserInfoReturn {
  userSession: User | null;
  customerProfile: CustomerProfile | null | undefined;
  brandProfile: BrandProfile | null | undefined;
  cart: CartItem[] | null | undefined;
  notifications: Notification[] | null | undefined;
  bookmarks: Bookmark[] | null | undefined;
}

export function useUserInfo(): UseUserInfoReturn {
  const [userSession, setUserSession] = React.useState<User | null>(null);

  useUserRealtime(userSession);
  useCatalogRealtime();

  // Use React Query hooks for all data
  const { data: customerProfile } = useCustomerProfile(userSession);
  const { data: brandProfile } = useBrandProfile(userSession);
  const { data: cart } = useCartItems(userSession);
  const { data: notifications } = useNotifications(userSession);
  const { data: bookmarks } = useBookmarks(userSession);

  React.useEffect(() => {
    // Auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "USER_UPDATED" ||
          event === "TOKEN_REFRESHED"
        ) {
          setUserSession(session?.user || null);
        } else if (event === "SIGNED_OUT") {
          setUserSession(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    userSession,
    customerProfile,
    brandProfile,
    cart,
    notifications,
    bookmarks,
  };
}
