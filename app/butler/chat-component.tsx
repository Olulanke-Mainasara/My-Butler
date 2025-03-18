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
import { useTheme } from "next-themes";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { useUserProfile } from "@/components/Providers/AllProviders";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const getAssistantResponse = async (
  messages: Message[]
): Promise<Message[] | null> => {
  const response = await fetch(`/api/butler`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
    cache: "no-cache",
  });

  if (!response.ok) {
    console.error("Error fetching response");
    return null;
  }

  const responseData = await response.json();
  return responseData;
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
  const userProfile = useUserProfile();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    // Fetch the AI response on page load for a that visitor isn't logged in yet
    if (!userProfile && prompt) {
      const fetchAnonymousMessages = async () => {
        setResponseError(null);
        setResponseLoading(true);

        const anonymousResponseData = await getAssistantResponse([
          { role: "user", content: prompt },
        ]);

        if (!anonymousResponseData) {
          setResponseError("Error fetching response");
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            ...anonymousResponseData,
          ]);
        }

        setResponseLoading(false);
        scrollToBottom();
      };

      fetchAnonymousMessages();
      return;
    }

    // Keep the onStateFunction from re-running the code below, over and over
    if (userCount > 0) {
      return;
    }

    // Fetch the AI response on page load, for a visitor that is logged in
    const fetchChatMessages = async () => {
      setLoading(true);

      // Firstly, fetch the existing messages in the conversion, from the database
      const [chatId] = pathname.split("/").slice(-1);
      const { data, error: fetchError } = await supabase
        .from("chats")
        .select("messages")
        .eq("chat_id", chatId)
        .single();

      if (fetchError || data.messages.length === 0) {
        toast.error("Unable to fetch the conversation");
        router.push("/butler");
        return;
      }

      const chatMessages = data?.messages.filter(
        (msg: Json): msg is Message => msg !== null
      );
      setMessages(chatMessages);
      setLoading(false);

      // Fetch an AI response, if the last person to drop a message was the user
      if (chatMessages[chatMessages.length - 1]?.role !== "assistant") {
        setResponseLoading(true);
        const assistantResponse = await getAssistantResponse(chatMessages);

        if (assistantResponse) {
          // If a response was gotten, update the database
          const { error: updateError } = await supabase
            .from("chats")
            .update({
              messages: chatMessages.concat(assistantResponse),
            })
            .eq("chat_id", chatId);

          if (updateError) {
            console.error("Error updating messages: ", updateError);
          }

          setMessages(chatMessages.concat(assistantResponse));
        } else {
          setResponseError("Error fetching response");
        }

        setResponseLoading(false);
      }

      scrollToBottom();
    };

    setUserCount((prevCount) => prevCount + 1);

    fetchChatMessages();
  }, [pathname, prompt, router, userProfile, userCount]);

  // Fetch an AI response, after the user sends a new prompt
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

    // Fetch response to the user's prompt
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
        console.error("Error updating messages", updateError);
      }
      setMessages((prevMessages) => [...prevMessages, ...assistantResponse]);
    } else {
      setResponseError("Error fetching response");
    }

    setResponseLoading(false);
    scrollToBottom();
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <section className="w-full flex flex-col h-screen pt-16">
        <div className="overflow-hidden w-full grow px-4 xl:px-8">
          <div
            className="space-y-8 overflow-y-scroll h-full scrollbar-none max-w-screen-md m-auto scroll-py-96 pb-12"
            ref={chatContainerRef}
          >
            {loading ? (
              <div className={`flex justify-end `}>
                <div className="p-4 bg-gray-400 animate-pulse w-full md:w-2/5 h-20 rounded-xl max-w-xl"></div>
              </div>
            ) : (
              messages.map((message, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`flex ${
                      message?.role === "user" && "justify-end"
                    }`}
                  >
                    <div className="flex gap-4">
                      <Avatar
                        className={`size-6 md:size-8 ${
                          message.role === "user" ? "hidden" : ""
                        }`}
                      >
                        <AvatarImage
                          src={
                            theme === "dark"
                              ? "/Logo/logoDark.png"
                              : theme === "light"
                              ? "/Logo/logoLight.png"
                              : ""
                          }
                        />
                        <AvatarFallback className="bg-transparent text-black dark:text-white">
                          B
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`${
                          message.role === "user" ? "max-w-xs md:max-w-lg" : ""
                        }`}
                      >
                        <div
                          className={` ${
                            message.role === "user"
                              ? "px-4 py-3 bg-darkBackground text-white dark:bg-neutral-800 rounded-3xl rounded-tr-sm"
                              : ""
                          } `}
                        >
                          {message.role === "assistant" ? (
                            <div
                              className="text-lg"
                              dangerouslySetInnerHTML={{
                                __html: formatResponseText(message.content),
                              }}
                            />
                          ) : (
                            <p className="text-lg">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}
            {responseError && (
              <p className="text-right text-red-500 -translate-y-5">
                {responseError}
              </p>
            )}
            {responseLoading && (
              <div className={`flex gap-4 items-center`}>
                <Avatar>
                  <AvatarImage
                    src={
                      theme === "dark"
                        ? "/Logo/logoDark.png"
                        : "/Logo/logoLight.png"
                    }
                  />
                  <AvatarFallback className="bg-gray-400 dark:bg-gray-400 text-black">
                    B
                  </AvatarFallback>
                </Avatar>
                <p className="text-black dark:text-white animate-pulse text-lg">
                  Just a moment...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pt-0 flex flex-col gap-4 items-center justify-center w-full">
          <div className="border border-black dark:border-white w-full xl:max-w-[800px] rounded-full flex items-center justify-center overflow-hidden px-4 gap-4 pr-2">
            <Stars
              className={`text-brandLight dark:text-brandDark ${
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
              className="py-4 w-full outline-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-neutral-500 dark:placeholder-neutral-400"
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
          <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm">
            Butler could be wrong, please validate its responses.
          </p>
        </div>
      </section>
    </div>
  );
}
