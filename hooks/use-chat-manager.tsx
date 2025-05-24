import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { getLocalStorage } from "@/lib/utils";
import { generateTitleFromUserMessage } from "@/app/butler/[chat]/action";

type ChatMessage = {
  id: string;
  role: "system" | "user" | "assistant" | "data";
  part: { type: string; text: string }[];
  content: string;
};

export const useChatManager = (scrollToBottom: () => void) => {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const hasAppended = useRef(false);
  const chatId = pathname.split("/").slice(-1)[0];
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  const {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    error,
    append,
    setMessages,
  } = useChat({
    experimental_throttle: 50,
    initialMessages,
    onFinish: async (message) => {
      if (messages.length === 0) {
        const localStorageInput = getLocalStorage("input");
        const chatTitle = await generateTitleFromUserMessage({
          message: { ...message, parts: message.parts ?? [] },
        });

        const { error } = await supabase.from("chats").insert({
          id: chatId,
          title: chatTitle,
          messages: [
            {
              role: "user",
              parts: [{ type: "text", text: localStorageInput || "" }],
              content: localStorageInput || "",
            },
            {
              role: message.role,
              content: message.content,
              parts: message.parts
                ? message.parts
                    .filter((part) => "text" in part)
                    .map((part) => ({
                      ...(part as { type: string; text: string }),
                    }))
                : [],
            },
          ],
        });

        if (error) {
          toast.error("Error inserting chat:");
        }

        localStorage.removeItem("input");
        return;
      }

      const serializableMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        parts: msg.parts
          ? msg.parts
              .filter((part) => "text" in part)
              .map((part) => ({ ...(part as { type: string; text: string }) }))
          : [],
      }));
      const { error } = await supabase
        .from("chats")
        .update({
          messages: [
            ...serializableMessages,
            {
              role: "user",
              parts: [{ type: "text", text: input }],
              content: input,
            },
            {
              ...message,
              parts: message.parts
                ? message.parts
                    .filter((part) => "text" in part)
                    .map((part) => ({
                      ...(part as { type: string; text: string }),
                    }))
                : [],
            },
          ],
        })
        .eq("id", chatId);

      if (error) {
        toast.error("Error updating chat:");
      }
    },
  });

  useEffect(() => {
    async function loadChat() {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .single();

      if (error) {
        toast.error("Error loading chat");
        router.push("/butler");
        return;
      }

      if (data?.messages?.length) {
        const filteredMessages = (data.messages as ChatMessage[]).filter(
          Boolean
        ) as {
          id: string;
          role: "system" | "user" | "assistant" | "data";
          content: string;
        }[];
        setMessages(filteredMessages);
        setInitialMessages(filteredMessages);
        const lastMessage = filteredMessages[filteredMessages.length - 1];
        if (lastMessage && lastMessage.role === "user") {
          append({ role: "user", content: lastMessage.content });
        }
      }
    }

    if (hasAppended.current) {
      return;
    }

    const localStorageInput = getLocalStorage("input");

    if (localStorageInput && !hasAppended.current) {
      hasAppended.current = true;
      append({
        role: "user",
        content: localStorageInput,
      });
      return;
    }

    hasAppended.current = true;
    loadChat();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, router]);

  useEffect(() => {
    if (status === "submitted") {
      scrollToBottom();
      setInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (messages.length !== 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    status,
    stop,
    error,
    append,
    setMessages,
    initialMessages,
    chatId,
    setInitialMessages,
    hasAppended,
  };
};
