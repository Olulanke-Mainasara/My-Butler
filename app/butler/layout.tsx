"use client";

import React from "react";
import { Edit, Search } from "lucide-react";
import { Button } from "@/components/Shad-UI/button";
import { Link } from "next-view-transitions";
import { useContext } from "react";
import { authContext } from "@/components/Providers/AllProviders";
import { supabase } from "@/lib/supabase";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useContext(authContext);
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
    <main className="flex h-screen">
      {user && (
        <div className="hidden md:block min-w-52 w-1/5 border-r pt-3 bg-white/10 px-3 z-30">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xl">Conversations</p>
              <div className="flex gap-2 items-center opacity-70">
                <button>
                  <Search size={20} />
                </button>
                <Link href="/butler">
                  <Edit size={20} />
                </Link>
              </div>
            </div>
            <hr />
            <div className="space-y-2 pt-4">
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
            </div>
          </div>
        </div>
      )}

      {children}
    </main>
  );
}
