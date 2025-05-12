import React, { useCallback } from "react";
import { Notification } from "@/types/Notification";
import { CartItem } from "@/types/CartItem";
import { CustomerProfile } from "@/types/CustomerProfile";
import { RealtimePostgresChangesPayload, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { BrandProfile } from "@/types/BrandProfile";

export function useUserInfo() {
  const [userSession, setUserSession] = React.useState<User | null>(null);
  const [customerProfile, setCustomerProfile] =
    React.useState<CustomerProfile | null>(null);
  const [brandProfile, setBrandProfile] = React.useState<BrandProfile | null>(
    null
  );
  const hasFetched = React.useRef(false);
  const [notifications, setNotifications] = React.useState<
    Notification[] | null
  >(null);
  const [cart, setCart] = React.useState<CartItem[] | null>(null);

  const handleCustomerProfileEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);

    if (payload.eventType === "DELETE") {
      setCustomerProfile(null);
      return;
    } else if (
      payload.eventType === "INSERT" ||
      payload.eventType === "UPDATE"
    ) {
      setCustomerProfile(payload.new as CustomerProfile);
    }
  };

  const handleBrandProfileEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);

    if (payload.eventType === "DELETE") {
      setBrandProfile(null);
      return;
    } else if (
      payload.eventType === "INSERT" ||
      payload.eventType === "UPDATE"
    ) {
      setBrandProfile(payload.new as BrandProfile);
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

  const fetchCustomerProfile = React.useCallback(async (userSession: User) => {
    if (userSession.user_metadata.role_id !== 2) {
      return null;
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", userSession.id)
      .single();

    if (error) {
      return null;
    }

    // Listen to changes in the customers table
    supabase
      .channel("customers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        (payload) => handleCustomerProfileEvents(payload)
      )
      .subscribe();

    return {
      ...data,
      role_id: 2,
    };
  }, []);

  const fetchBrandProfile = useCallback(async (userSession: User) => {
    if (userSession.user_metadata.role_id !== 4) {
      return null;
    }

    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", userSession.id)
      .single();

    if (error) {
      return null;
    }

    // Listen to changes in the brands table
    supabase
      .channel("brands")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "brands" },
        (payload) => handleBrandProfileEvents(payload)
      )
      .subscribe();

    return {
      ...data,
      role_id: 4,
    };
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
    if (userSession && !hasFetched.current) {
      hasFetched.current = true;

      const [
        customerProfileData,
        brandProfileData,
        cartData,
        notificationsData,
      ] = await Promise.all([
        fetchCustomerProfile(userSession),
        fetchBrandProfile(userSession),
        fetchCartItems(userSession),
        fetchNotifications(userSession),
      ]);

      setCustomerProfile(customerProfileData);
      setBrandProfile(brandProfileData);
      setCart(cartData);
      setNotifications(notificationsData);
    } else if (!userSession) {
      hasFetched.current = false;
      setCustomerProfile(null);
      setBrandProfile(null);
      setCart(null);
      setNotifications(null);
    }
  }, [
    fetchCartItems,
    fetchNotifications,
    fetchCustomerProfile,
    fetchBrandProfile,
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

  return { userSession, customerProfile, brandProfile, cart, notifications };
}
