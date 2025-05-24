"use client";

import React from "react";
import { ArrowUp, Stars } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { generateUUID, setLocalStorage } from "@/lib/utils";

const Butler = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const router = useTransitionRouter();

  const handleSubmit = async () => {
    setLoading(true);

    const chatId = generateUUID();
    setLocalStorage("input", prompt);

    router.push(`/butler/${chatId}`);
  };

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
            <ArrowUp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Butler;
