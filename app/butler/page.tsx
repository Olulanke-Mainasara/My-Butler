"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { ArrowUp, Stars } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { useLocalStorage } from "react-use";
import { generateUUID } from "@/lib/utils";

const Butler = () => {
  const [prompt, setPrompt] = useState("");
  const [, setInput] = useLocalStorage("input");
  const [loading, setLoading] = useState(false);
  const router = useTransitionRouter();

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    const chatId = generateUUID();
    setInput(prompt);
    router.push(`/butler/${chatId}`);
  }, [prompt, loading, setInput, router]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex flex-col w-full justify-center gap-4 lg:gap-8">
      <h1 className="text-center text-2xl lg:text-4xl">
        How can I be of service?
      </h1>
      <div className="flex justify-center">
        <div className="border border-black dark:border-white w-[93%] xl:w-3/5 max-w-3xl rounded-full flex items-center justify-center overflow-hidden px-2 pl-4 gap-4">
          <Stars
            className={`${
              loading ? "animate-pulse" : ""
            } text-brandLight dark:text-brandDark`}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Ask Butler"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
            className="py-4 w-full outline-none bg-transparent placeholder:text-neutral-600 placeholder:dark:text-neutral-400 disabled:opacity-50"
          />
          <button
            className="w-11 h-10 p-2 text-white bg-darkBackground hover:text-black hover:bg-lightBackground border border-black dark:bg-lightBackground dark:text-black dark:border-white dark:hover:bg-darkBackground dark:hover:text-white flex items-center justify-center transition-colors rounded-full disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            aria-label="Submit prompt"
          >
            <ArrowUp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Butler;
