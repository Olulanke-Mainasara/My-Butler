"use client";

import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/Shad-UI/avatar";
import { usePathname } from "next/navigation";
import { ArrowRight, Square, Stars } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Json } from "@/supabase";
import { authContext } from "@/components/Providers/AllProviders";
import { useTheme } from "next-themes";
import { useTransitionRouter } from "next-view-transitions";

type Message = {
  role: string;
  content: string;
};

const getAssistantResponse = async (
  messages: { role: string; content: string }[]
): Promise<{ role: string; content: string }[] | null> => {
  try {
    const response = await fetch(`/api/butler`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
      cache: "no-cache",
    });

    if (!response.ok) {
      return null;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
};

const formatResponseText = (text: string): string => {
  return text
    .replace(
      /--\s*(.*?)\s*--/g,
      '<h2 class="text-2xl font-bold text-white mt-4">$1</h2>'
    ) // Headers
    .replace(
      /###\s*(.*?)\s*\n/g,
      '<hr class="my-10"/><h3 class="text-lg font-semibold text-white">$1</h3>'
    ) // Subsections
    .replace(/-\s(.*?)\n/g, '<li class="text-base mb-2 pl-5">$1</li>') // Bullet points
    .replace(/\*\*(.*?)\*\*/g, '<strong class="mb-10">$1</strong>') // Bold text
    .replace(/\n\n/g, "<br/><br/>") // Paragraph spacing
    .trim();
};

export default function Chat({ prompt }: { prompt?: string }) {
  const [input, setInput] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>(
    prompt ? [{ role: "user", content: prompt }] : []
  );
  const [loading, setLoading] = React.useState(false);
  const [responseLoading, setResponseLoading] = React.useState(false);
  const [responseError, setResponseError] = React.useState<string | null>(null);
  const [userCount, setUserCount] = React.useState(0);
  const user = React.useContext(authContext);
  const router = useTransitionRouter();
  const pathname = usePathname();
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    // If a visitor hasn't logged in yet
    if (!user && prompt) {
      const fetchAnonymousMessages = async () => {
        setResponseError(null);
        setResponseLoading(true);
        try {
          const anonymousData = await getAssistantResponse([
            { role: "user", content: prompt },
          ]);
          if (!anonymousData) {
            setResponseError("Error fetching response");
          } else {
            setMessages((prevMessages) => [...prevMessages, ...anonymousData]);
          }
        } catch {
          setResponseError("Error fetching response");
        } finally {
          setResponseLoading(false);
          scrollToBottom();
        }
      };

      fetchAnonymousMessages();

      return;
    }

    if (userCount > 0) {
      return;
    }

    const fetchChatMessages = async () => {
      setLoading(true);
      const [chatId] = pathname.split("/").slice(-1);
      const { data, error: fetchError } = await supabase
        .from("chats")
        .select("messages")
        .eq("chat_id", chatId)
        .single();

      if (fetchError) {
        router.push("/butler");
        return;
      }

      const chatMessages = data?.messages.filter(
        (msg: Json): msg is Message => msg !== null
      );

      if (chatMessages.length === 0) {
        setLoading(false);
        return;
      }

      if (chatMessages[chatMessages.length - 1]?.role !== "assistant") {
        setMessages(chatMessages);
        setLoading(false);
        setResponseLoading(true);
        const assistantResponse = await getAssistantResponse(chatMessages);

        if (assistantResponse) {
          const { error: updateError } = await supabase
            .from("chats")
            .update({
              messages: chatMessages.concat(assistantResponse),
            })
            .eq("chat_id", chatId);

          if (updateError) {
            console.log("Error updating messages", updateError);
          }

          setMessages(chatMessages.concat(assistantResponse));
        } else {
          setResponseError("Error fetching response");
        }

        setResponseLoading(false);
      } else {
        setMessages(chatMessages);
        setLoading(false);
      }

      scrollToBottom();
    };

    setUserCount((prevCount) => prevCount + 1);

    fetchChatMessages();
  }, [pathname, prompt, router, user, userCount]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    scrollToBottom();

    setResponseError(null);
    setResponseLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: input },
    ]);
    setInput("");

    const [chatId] = pathname.split("/").slice(-1);

    try {
      const assistantResponse = await getAssistantResponse([
        ...messages,
        { role: "user", content: input },
      ]);

      if (assistantResponse) {
        const { error: updateError } = await supabase
          .from("chats")
          .update({
            messages: [
              ...messages,
              { role: "user", content: input },
              ...assistantResponse,
            ],
          })
          .eq("chat_id", chatId);

        if (updateError) {
          console.log("Error updating messages", updateError);
        }
        setMessages((prevMessages) => [...prevMessages, ...assistantResponse]);
      } else {
        setResponseError("Error fetching response");
      }
    } catch {
      setResponseError("Error fetching response");
    } finally {
      setResponseLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <section className="w-full flex flex-col h-screen pt-16">
        <div className="overflow-hidden w-full grow px-2 xl:px-8 pb-8">
          <div
            className="space-y-10 overflow-y-scroll h-full scrollbar-none max-w-screen-md m-auto"
            ref={chatContainerRef}
          >
            {loading ? (
              <div className={`flex flex-row-reverse gap-4`}>
                <Avatar className="animate-pulse">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gray-400 dark:bg-gray-400"></AvatarFallback>
                </Avatar>
                <div className="p-4 bg-gray-400 animate-pulse w-full md:w-2/5 h-20 rounded-xl max-w-xl"></div>
              </div>
            ) : (
              messages.map((message, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`flex flex-col ${
                      message?.role === "user" && "items-end"
                    } gap-2`}
                  >
                    <div
                      className={`flex ${
                        message.role === "user" && "flex-row-reverse"
                      } gap-4`}
                    >
                      <Avatar
                        className={`size-6 md:size-11 ${
                          message.role === "user" && "hidden md:flex"
                        }`}
                      >
                        <AvatarImage
                          src={
                            message.role !== "user" && theme === "dark"
                              ? "/LogoDark.png"
                              : message.role !== "user" && theme === "light"
                              ? "/logoLight.png"
                              : "https://github.com/shadcn.png"
                          }
                        />
                        <AvatarFallback>
                          {message.role == "assistant" ? "B" : "CN"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div
                          className={` ${
                            message.role === "user"
                              ? "px-4 py-3 bg-darkBackground text-white dark:bg-white/10 rounded-xl w-fit max-w-xl"
                              : ""
                          } `}
                        >
                          {message.role === "assistant" ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formatResponseText(message.content),
                              }}
                            />
                          ) : (
                            <p>{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p>{responseError}</p>
                  </div>
                </React.Fragment>
              ))
            )}
            {responseLoading && (
              <div className={`flex gap-4`}>
                <Avatar className="animate-pulse">
                  <AvatarImage
                    src={theme === "dark" ? "/LogoDark.png" : "/logoLight.png"}
                  />
                  <AvatarFallback className="bg-gray-400 dark:bg-gray-400"></AvatarFallback>
                </Avatar>
                <div className="p-4 bg-gray-400 animate-pulse w-full md:w-2/5 h-20 rounded-xl max-w-xl"></div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 xl:p-8 border-t flex items-center justify-center w-full">
          <div className="border w-full xl:w-3/5 rounded-full flex items-center justify-center overflow-hidden px-4 gap-4 pr-2">
            <Stars
              className={`opacity-70 ${
                loading || (responseLoading && "animate-pulse")
              }`}
            />
            <input
              type="text"
              placeholder="Ask Butler"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={loading || responseLoading}
              className="py-4 w-full outline-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              className="w-10 h-10 p-2 text-black bg-white hover:text-white hover:bg-black border border-black dark:border-white flex items-center justify-center transition-colors rounded-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              onClick={handleSubmit}
              disabled={loading || responseLoading}
            >
              {loading || responseLoading ? (
                <Square className="bg-black" size={15} />
              ) : (
                <ArrowRight />
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
