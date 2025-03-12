"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/Shad-UI/sidebar";

import { Link, useTransitionRouter } from "next-view-transitions";
import { Edit } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { supabase } from "@/lib/supabase";
import { useUserProfile } from "@/components/Providers/AllProviders";

export function ChatSidebar() {
  const userProfile = useUserProfile();
  const { toggleSidebar } = useSidebar();
  const router = useTransitionRouter();
  const [conversations, setConversations] = React.useState<
    { chat_id: string; chat_title: string }[] | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userProfile) {
      return;
    }

    const fetchConversations = async () => {
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

  return (
    <Sidebar side="right">
      <SidebarHeader className="flex flex-row items-center justify-between pt-4">
        <p className="text-2xl">Conversations</p>
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
      <SidebarContent className="gap-0 p-3 pt-2">
        <div>
          {!conversations || conversations.length === 0 ? (
            <p className="text-base">No conversations available</p>
          ) : loading ? (
            <div className="space-y-3">
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
            </div>
          ) : conversations && !error ? (
            conversations.map((convo) => (
              <div key={convo.chat_id} className="hover:bg-white/10 rounded-md">
                <Button
                  asChild
                  variant={"link"}
                  className="justify-start overflow-hidden w-[95%] px-2 hover:no-underline"
                >
                  <Link href={`/butler/${convo.chat_id}`}>
                    {convo.chat_title}
                  </Link>
                </Button>
              </div>
            ))
          ) : error ? (
            <p>{error}</p>
          ) : null}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
