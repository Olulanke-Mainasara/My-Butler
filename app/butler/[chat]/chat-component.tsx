"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUp, Stars } from "lucide-react";
import { Markdown } from "./markdown";
import { useLocalStorage } from "react-use";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Json } from "@/supabase";
import { Icons } from "@/components/Custom-UI/icons";
import { generateTitleFromUserMessage } from "./action";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatComponent() {
  const [input, setInput] = useState("");
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [prompt, , removePrompt] = useLocalStorage<string | undefined>(
    "input",
    undefined
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useTransitionRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const chatId = pathname.split("/")[2];
  const hasRendered = useRef(false);

  const { status, messages, sendMessage, setMessages } = useChat({
    onFinish: async (message) => {
      if (message.messages.length === 2) {
        // If it's the first user message and assistant response, create new chat
        const chatTitle = await generateTitleFromUserMessage(
          message.messages[0]
        );

        const { error } = await supabase.from("chats").insert({
          id: chatId,
          title: chatTitle,
          messages: message.messages as unknown as Json[],
        });

        if (error) {
          toast.error("Failed to save conversation.");
          return;
        }

        queryClient.invalidateQueries({
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey.includes("chats"),
        });

        queryClient.setQueryData([`chat:${chatId}`], {
          messages: message.messages,
        });

        return;
      }

      const { error } = await supabase
        .from("chats")
        .update({
          messages: message.messages as unknown as Json[],
        })
        .eq("id", chatId);

      if (error) {
        toast.error("Failed to save conversation.");
      }

      queryClient.setQueryData([`chat:${chatId}`], {
        messages: message.messages,
      });
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize conversation on mount
  useEffect(() => {
    const fetchOrStartConversation = async () => {
      if (!chatId) return;

      setIsLoadingConversation(true);

      // If we have a prompt, start a new conversation
      if (prompt) {
        sendMessage({ text: prompt });
        removePrompt();
      } else {
        // Check if conversation exists in the cache
        const cachedChat = queryClient.getQueryData<{ messages: UIMessage[] }>([
          `chat:${chatId}`,
        ]);

        if (cachedChat && cachedChat.messages) {
          setMessages(cachedChat.messages as unknown as UIMessage[]);
          setIsLoadingConversation(false);
          return;
        }

        // If not, fetch the conversation from supabase
        const { data, error } = await supabase
          .from("chats")
          .select("*")
          .eq("id", chatId)
          .single();

        if (error) {
          toast.error("Conversation not found.");
          router.push("/butler");
          return;
        }

        // If conversation exists in supabase, load its messages
        if (
          data.messages &&
          Array.isArray(data.messages) &&
          data.messages.length > 0
        ) {
          setMessages(data.messages as unknown as UIMessage[]);
          queryClient.setQueryData([`chat:${chatId}`], {
            messages: data.messages,
          });
        } else {
          toast.error("Conversation is empty.");
          router.push("/butler");
        }
      }

      setIsLoadingConversation(false);
    };

    if (hasRendered.current) {
      return;
    }

    hasRendered.current = true;
    fetchOrStartConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== "submitted") {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  // Loading state
  if (isLoadingConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <div className="flex items-center gap-3">
          <Stars
            className="text-brandLight dark:text-brandDark animate-pulse"
            size={32}
          />
          <p className="text-lg text-neutral-600 dark:text-neutral-400 flex items-center">
            Loading conversation{" "}
            <Icons.spinner className="inline-block ml-2 h-5 w-5 animate-spin" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-br h-screen pt-16 overflow-hidden w-full">
      <div className="flex-1 overflow-y-auto px-4 space-y-4 bg-background scrollbar-none w-full max-w-screen-md mx-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 ${
                message.role === "user"
                  ? "bg-darkBackground text-white dark:bg-neutral-800 rounded-3xl rounded-tr-sm max-w-xs lg:max-w-sm"
                  : ""
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <div key={`${message.id}-${i}`}>
                      <Markdown>{part.text}</Markdown>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {/* Loading Animation */}
        {status === "submitted" && (
          <div className="flex justify-start p-4">
            <div className="flex space-x-2">
              <div
                className="w-4 h-4 bg-black dark:bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-4 h-4 bg-black dark:bg-white rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-4 h-4 bg-black dark:bg-white rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pb-4 bg-background">
        <form
          onSubmit={handleSubmit}
          className="w-[97%] md:w-[93%] xl:w-3/5 max-w-3xl mx-auto rounded-full flex items-center px-2 pl-4 gap-4 border border-black dark:border-white"
        >
          <Stars
            className={`${
              status === "submitted" ? "animate-pulse" : ""
            } text-brandLight dark:text-brandDark`}
            aria-hidden="true"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Butler"
            disabled={status === "submitted"}
            className="py-4 w-full outline-none bg-transparent placeholder:text-neutral-600 placeholder:dark:text-neutral-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || status === "submitted"}
            className="w-11 h-10 p-2 text-white bg-darkBackground hover:text-black hover:bg-lightBackground border border-black dark:bg-lightBackground dark:text-black dark:border-white dark:hover:bg-darkBackground dark:hover:text-white flex items-center justify-center transition-colors rounded-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowUp />
          </button>
        </form>
        <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-3">
          Butler could be wrong, please validate its responses.
        </p>
      </div>
    </div>
  );
}
