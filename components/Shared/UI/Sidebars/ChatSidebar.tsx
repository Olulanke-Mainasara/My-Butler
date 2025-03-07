"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/Shad-UI/sidebar";

import { Link } from "next-view-transitions";
import { Edit } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/Providers/AllProviders";

export function ChatSidebar() {
  const user = useAuth();
  const [userCount, setUserCount] = React.useState(0);
  const [conversations, setConversations] = React.useState<
    { chat_id: string; chat_title: string }[] | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    if (userCount > 0) {
      return;
    }

    setUserCount((prev) => prev + 1);

    const fetchConversations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("chats")
        .select("chat_id,chat_title")
        .eq("user_id", user.id);

      if (error) {
        setConversations([]);
        setError("Unable to fetch conversations");
        setLoading(false);
      } else {
        setConversations(data);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, userCount]);

  return (
    <Sidebar side="right">
      <SidebarHeader className="flex flex-row items-center justify-between pt-4">
        <p className="text-2xl">Conversations</p>
        <Link href="/butler">
          <Edit size={20} />
        </Link>
      </SidebarHeader>
      <SidebarSeparator className="bg-darkBackground dark:bg-lightBackground w-full ml-0" />
      <SidebarContent className="sm:justify-center gap-0 px-0">
        <div className="flex flex-col gap-2 text-sm">
          <p className="pl-2 text-xs font-extrabold">Today</p>
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
                <div
                  key={convo.chat_id}
                  className="hover:bg-white/10 rounded-md"
                >
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
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
