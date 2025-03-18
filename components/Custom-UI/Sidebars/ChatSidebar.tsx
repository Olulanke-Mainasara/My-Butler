"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/Shad-UI/sidebar";

import { Link, useTransitionRouter } from "next-view-transitions";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from "@/components/Providers/AllProviders";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

export function ChatSidebar() {
  const userProfile = useUserProfile();
  const { toggleSidebar } = useSidebar();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = React.useState<
    { chat_id: string; chat_title: string }[] | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);
    if (payload.eventType === "DELETE") {
      setConversations((prev) =>
        prev
          ? prev.filter((convo) => convo.chat_id !== payload.old.chat_id)
          : null
      );
      return;
    } else if (payload.eventType === "INSERT") {
      setConversations((prev) =>
        prev
          ? [...prev, payload.new as { chat_id: string; chat_title: string }]
          : [payload.new as { chat_id: string; chat_title: string }]
      );
    }
  };

  const handleChatDelete = async (chatId: string) => {
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("chat_id", chatId);
    if (error) {
      console.error("Error deleting chat", error);
    } else {
      toggleSidebar();
      router.push("/butler");
    }
  };

  React.useEffect(() => {
    const fetchConversations = async () => {
      if (!userProfile) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("chat_id,chat_title")
        .eq("user_id", userProfile.id);

      if (error) {
        setError("Unable to fetch conversations");
      } else {
        setConversations(data);
      }

      setLoading(false);
    };

    fetchConversations();
  }, [userProfile]);

  React.useEffect(() => {
    supabase
      .channel("chats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        (payload) => handleEvents(payload)
      )
      .subscribe();
  }, []);

  return (
    <Sidebar side="right">
      <SidebarHeader className="flex flex-row items-center justify-between pt-4">
        <p className="text-2xl">
          Butler <span className="text-brandLight dark:text-brandDark">AI</span>
        </p>
        <button
          onClick={() => {
            toggleSidebar();
            router.push("/butler");
          }}
        >
          <Edit size={20} />
        </button>
      </SidebarHeader>
      <SidebarSeparator className="bg-darkBackground dark:bg-lightBackground w-full ml-0" />
      <SidebarContent className="gap-0">
        <div>
          {!conversations || conversations.length === 0 ? (
            <p className="text-base p-3">No conversations available</p>
          ) : loading ? (
            <div className="space-y-3">
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
            </div>
          ) : conversations && !error ? (
            <SidebarGroup className="p-0">
              <SidebarGroupLabel>Conversations</SidebarGroupLabel>
              <SidebarGroupContent className="p-2">
                <SidebarMenu>
                  {conversations.map((convo) => (
                    <SidebarMenuItem key={convo.chat_id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/butler/${convo.chat_id}`}
                        onClick={() => {
                          toggleSidebar();
                          router.push(`/butler/${convo.chat_id}`);
                        }}
                      >
                        <Link href={`/butler/${convo.chat_id}`}>
                          <span>{convo.chat_title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        onClick={() => handleChatDelete(convo.chat_id)}
                      >
                        <Trash2 /> <span className="sr-only">Add Project</span>
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : error ? (
            <p>{error}</p>
          ) : null}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
