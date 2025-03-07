"use client";

import React from "react";
import { ArrowRight, Stars } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import logoLight from "@/public/Logo/logoLight.png";
import logoDark from "@/public/Logo/logoDark.png";
import { useTheme } from "next-themes";
import Chat from "@/components/Page-Components/Chat";
import { useAuth } from "@/components/Providers/AllProviders";

const Butler = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [anonymous, setAnonymous] = React.useState(false);
  const user = useAuth();
  const router = useTransitionRouter();
  const { theme } = useTheme();

  const handleSubmit = async () => {
    startChat({ role: "user", content: prompt });
  };

  const startChat = async (message: { role: string; content: string }) => {
    setError(null);
    setLoading(true);

    if (!user) {
      setLoading(false);
      setAnonymous(true);
      return;
    }

    const { role, content } = message;

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert({
          user_id: user.id,
          messages: [
            {
              role: role,
              content: content,
            },
          ],
        })
        .select();

      if (error) {
        setError("Error starting chat, please try again");
        setLoading(false);
      } else {
        setLoading(false);
        router.push(`/butler/${data[0].chat_id}`);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (anonymous) {
    return <Chat prompt={prompt} />;
  }

  return (
    <div className="flex flex-col w-full justify-center gap-4 lg:gap-8">
      <div className="flex items-center justify-center gap-2">
        <Image
          src={theme === "dark" ? logoDark : logoLight}
          className="w-10 h-10"
          alt="logo"
        />
        <h1 className="text-center text-2xl lg:text-4xl">
          How can I be of service?
        </h1>
      </div>

      <div className="flex justify-center">
        <div className="border border-black dark:border-white w-[93%] xl:w-3/5 max-w-3xl rounded-full flex items-center justify-center overflow-hidden px-2 pl-4 gap-4">
          <Stars
            className={`${
              loading ? "animate-pulse" : ""
            } text-brandLight dark:text-brandDark`}
          />
          <input
            type="text"
            placeholder="Ask Butler"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="py-4 w-full outline-none bg-transparent placeholder:text-neutral-600 placeholder:dark:text-neutral-400"
          />
          <button
            className="w-11 h-10 p-2 text-white bg-darkBackground hover:text-black hover:bg-lightBackground border border-black dark:bg-lightBackground dark:text-black dark:border-white dark:hover:bg-darkBackground dark:hover:text-white flex items-center justify-center transition-colors rounded-full"
            onClick={handleSubmit}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <p className="text-center text-lg">{error}</p>
    </div>
  );
};

export default Butler;
