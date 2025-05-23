import React from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase/client";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { toast } from "sonner";
import { Json } from "@/supabase";
import { cleanTitle, getAssistantResponse } from "@/lib/utils";
import { Message } from "@/lib/utils";

export const useChatManager = ({
  prompt,
  input,
  setInput,
  scrollToBottom,
}: {
  prompt?: string;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  scrollToBottom: () => void;
}) => {
  // ---------- State ----------
  const [messages, setMessages] = React.useState<Message[]>(
    prompt ? [{ role: "user", content: prompt }] : []
  );
  const [chatTitle, setChatTitle] = React.useState("New Chat");
  const [loading, setLoading] = React.useState(false);
  const [responseLoading, setResponseLoading] = React.useState(false);
  const [responseError, setResponseError] = React.useState<string | null>(null);
  const [userCount, setUserCount] = React.useState(0);

  const customerProfile = useCustomerProfile();
  const router = useTransitionRouter();
  const pathname = usePathname();

  // ---------- Fetch Chat on Page Load ----------
  React.useEffect(() => {
    if (userCount > 0) return;

    const [chatId] = pathname.split("/").slice(-1);
    const isLoggedIn = Boolean(customerProfile);

    const fetchAnonymousResponse = async () => {
      setResponseError(null);
      setResponseLoading(true);

      const response = await getAssistantResponse(
        [{ role: "user", content: prompt! }],
        false
      );

      if (!response) {
        setResponseError("Error fetching response");
      } else {
        setMessages((prev) => [...prev, ...response]);
      }

      setResponseLoading(false);
      scrollToBottom();
    };

    const fetchUserChat = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("chat_id", chatId)
        .single();

      if (error || !data?.messages?.length) {
        toast.error("Unable to fetch the conversation");
        router.push("/butler");
        return;
      }

      const chatMessages = data.messages.filter(
        (msg: Json): msg is Message => msg !== null
      );

      setMessages(chatMessages);

      let getTitle = false;
      const lastMessage = chatMessages[chatMessages.length - 1];
      const originalPrompt = lastMessage.content;

      if (data.chat_title === "New Chat") {
        getTitle = true;
      } else {
        setChatTitle(data.chat_title);
      }

      if (lastMessage.role === "user") {
        setResponseLoading(true);

        const response = await getAssistantResponse(chatMessages, getTitle);

        if (response) {
          const [title, content] = getTitle
            ? response[0].content.split("-----").map((s) => s.trim())
            : [chatTitle, response[0].content];

          const updatedMessages: Message[] = [
            ...chatMessages.slice(0, -1),
            { role: "user", content: originalPrompt },
            { role: "assistant", content },
          ];

          const { error: updateError } = await supabase
            .from("chats")
            .update({
              messages: updatedMessages,
              chat_title: cleanTitle(title),
            })
            .eq("chat_id", chatId);

          if (!updateError) {
            setMessages(updatedMessages);
            setChatTitle(title);
          }
        } else {
          setResponseError("Error fetching response");
        }

        setResponseLoading(false);
      }

      setLoading(false);
      scrollToBottom();
    };

    setUserCount(1);

    if (prompt && !isLoggedIn) {
      fetchAnonymousResponse();
    } else {
      fetchUserChat();
    }
  }, [
    pathname,
    prompt,
    customerProfile,
    userCount,
    chatTitle,
    router,
    scrollToBottom,
  ]);

  // ---------- Send New Prompt ----------
  const handleSubmit = async () => {
    if (!input.trim()) return;

    setResponseError(null);
    setResponseLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    scrollToBottom();

    const [chatId] = pathname.split("/").slice(-1);
    const getTitle = chatTitle === "New Chat";

    const response = await getAssistantResponse(
      [...messages, { role: "user", content: input }],
      getTitle
    );

    if (!response) {
      setResponseError("Error fetching response");
      setResponseLoading(false);
      return;
    }

    const [title, content] = getTitle
      ? response[0].content.split("-----").map((s) => s.trim())
      : [chatTitle, response[0].content];

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
      { role: "assistant", content },
    ];

    const { error } = await supabase
      .from("chats")
      .update({ messages: updatedMessages, chat_title: cleanTitle(title) })
      .eq("chat_id", chatId);

    if (!error) {
      setMessages(updatedMessages);
      setChatTitle(title);
    }

    setResponseLoading(false);
    scrollToBottom();
  };

  return { loading, responseLoading, responseError, messages, handleSubmit };
};
