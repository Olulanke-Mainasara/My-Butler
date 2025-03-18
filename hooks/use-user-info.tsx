import React, { useCallback } from "react";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";
import { UserProfile } from "@/types/UserProfile";
import { RealtimePostgresChangesPayload, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useUserInfo() {
  const [userSession, setUserSession] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(
    null
  );
  const [userCount, setUserCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<
    Notification[] | null
  >(null);
  const [cart, setCart] = React.useState<CartItem[] | null>(null);

  const handleUserProfileEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);

    if (payload.eventType === "DELETE") {
      setUserProfile(null);
      return;
    } else if (
      payload.eventType === "INSERT" ||
      payload.eventType === "UPDATE"
    ) {
      setUserProfile(payload.new as UserProfile);
    }
  };

  const handleCartEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);

    if (payload.eventType === "DELETE") {
      setCart((prev) =>
        prev ? prev.filter((item) => item.id !== payload.old.id) : null
      );
      return;
    } else if (payload.eventType === "INSERT") {
      setCart((prev) =>
        prev ? [...prev, payload.new as CartItem] : [payload.new as CartItem]
      );
    }
  };

  const handleNotificationsEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);

    if (payload.eventType === "DELETE") {
      setNotifications((prev) =>
        prev
          ? prev.filter((notification) => notification.id !== payload.old.id)
          : null
      );
      return;
    } else if (payload.eventType === "INSERT") {
      setNotifications((prev) =>
        prev
          ? [...prev, payload.new as Notification]
          : [payload.new as Notification]
      );
    }
  };

  const fetchUserProfile = React.useCallback(async (userSession: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userSession.id)
      .single();

    if (error) {
      return null;
    }

    // Listen to changes in the cart table
    supabase
      .channel("users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => handleUserProfileEvents(payload)
      )
      .subscribe();

    return data;
  }, []);

  const fetchCartItems = useCallback(async (userSession: User) => {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userSession.id);

    if (error) {
      return null;
    }

    // Listen to changes in the cart table
    supabase
      .channel("cart")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart" },
        (payload) => handleCartEvents(payload)
      )
      .subscribe();

    return data;
  }, []);

  const fetchNotifications = useCallback(async (userSession: User) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userSession.id)
      .order("created_at", { ascending: false });

    if (error) {
      return null;
    }

    // Listen to changes in the notifications table
    supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => handleNotificationsEvents(payload)
      )
      .subscribe();

    return data;
  }, []);

  const setUserInfo = React.useCallback(async () => {
    if (userSession) {
      if (userCount > 0) {
        return;
      }

      const userProfileData = await fetchUserProfile(userSession);
      const cartData = await fetchCartItems(userSession);
      const notificationsData = await fetchNotifications(userSession);

      setUserProfile(userProfileData);
      setCart(cartData);
      setNotifications(notificationsData);
      setUserCount(userCount + 1);
    } else {
      setUserProfile(null);
      setCart(null);
      setNotifications(null);
    }
  }, [
    fetchCartItems,
    fetchNotifications,
    fetchUserProfile,
    userCount,
    userSession,
  ]);

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

  React.useEffect(() => {
    setUserInfo();
  }, [setUserInfo, userSession]);

  return { userSession, userProfile, cart, notifications };
}
