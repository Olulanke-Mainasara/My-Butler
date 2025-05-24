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

import { useTransitionRouter } from "next-view-transitions";
import { Link } from "next-view-transitions";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function ChatSidebar() {
  const customerProfile = useCustomerProfile();
  const { toggleSidebar } = useSidebar();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = React.useState<
    { id: string; title: string }[] | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const handleEvents = (
    payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>
  ) => {
    console.log("Change received!", payload);
    if (payload.eventType === "DELETE") {
      setConversations((prev) =>
        prev ? prev.filter((convo) => convo.id !== payload.old.id) : null
      );
      return;
    } else if (payload.eventType === "INSERT") {
      setConversations((prev) =>
        prev
          ? [...prev, payload.new as { id: string; title: string }]
          : [payload.new as { id: string; title: string }]
      );
    } else if (payload.eventType === "UPDATE") {
      setConversations((prev) =>
        prev
          ? prev.map((convo) =>
              convo.id === payload.new.id
                ? (payload.new as { id: string; title: string })
                : convo
            )
          : null
      );
    }
  };

  const handleChatDelete = async (chatId: string) => {
    const { error } = await supabase.from("chats").delete().eq("id", chatId);
    if (error) {
      console.error("Error deleting chat", error);
    } else {
      toggleSidebar();
      toast.success("Chat deleted successfully");
      if (pathname.startsWith(`/butler/${chatId}`)) {
        router.push("/butler");
      }
    }
  };

  React.useEffect(() => {
    const fetchConversations = async () => {
      if (!customerProfile) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("id,title")
        .eq("user_id", customerProfile.id);

      if (error) {
        setError("Unable to fetch conversations");
      } else {
        setConversations(data);
      }

      setLoading(false);
    };

    fetchConversations();
  }, [customerProfile]);

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
            <SidebarGroup className="p-0 gap-0">
              <SidebarGroupLabel className="text-black dark:text-white">
                Conversations
              </SidebarGroupLabel>
              <SidebarGroupContent className="p-2">
                <SidebarMenu>
                  {conversations.map((convo) => (
                    <SidebarMenuItem key={convo.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/butler/${convo.id}`}
                        onClick={() => {
                          toggleSidebar();
                          router.push(`/butler/${convo.id}`);
                        }}
                      >
                        <Link href={`/butler/${convo.id}`}>
                          <span className="truncate text-sm">
                            {convo.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        onClick={() => handleChatDelete(convo.id)}
                        className="text-red-500"
                      >
                        <Trash2 /> <span className="sr-only">Delete chat</span>
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
