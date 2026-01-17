"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  getCustomerProfile,
  getBrandProfile,
  getCartItems,
  getNotifications,
  getBookmarks,
  getChats,
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

function useUserRealtime(user: User | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime:user:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) &&
              query.queryKey.includes("notifications"),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}

function useCustomerProfile(user: User | null) {
  const query = useQuery(getCustomerProfile(user?.id || ""), {
    enabled: !!user && user.user_metadata.role_id === 2,
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
    enabled: !!user && user.user_metadata.role_id === 4,
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
