"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/Shad-UI/avatar";
import { Stars, Square, ArrowUp } from "lucide-react";
import React, { useRef } from "react";
import { useTheme } from "next-themes";
import { Markdown } from "./markdown";
import { sanitizeText } from "@/lib/utils";
import { useChatManager } from "@/hooks/use-chat-manager";

export default function Chat() {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef(null);
  const { theme } = useTheme();

  function scrollToBottom() {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const { messages, input, setInput, handleSubmit, status, stop, error } =
    useChatManager(scrollToBottom);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <section className="w-full flex flex-col h-screen pt-16">
        <div className="overflow-hidden w-full grow px-3 xl:px-8">
          <div className="space-y-5 overflow-y-scroll h-full scrollbar-none max-w-screen-md m-auto px-1">
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <div
                  className={`flex ${
                    message?.role === "user" && "justify-end"
                  }`}
                >
                  <div className="flex gap-4">
                    <Avatar
                      className={`${
                        message.role === "user" ? "hidden" : "hidden md:flex"
                      }`}
                    >
                      <AvatarImage
                        src={
                          theme === "dark"
                            ? "/Logo/logoDark.png"
                            : "/Logo/logoLight.png"
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
                        className={`${
                          message.role === "user"
                            ? "px-4 py-3 bg-darkBackground text-white dark:bg-neutral-800 rounded-3xl rounded-tr-sm"
                            : ""
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div
                            className={`text-lg ${
                              index === messages.length - 1 ? "min-h-56" : ""
                            }`}
                            ref={index === messages.length - 1 ? textRef : null}
                          >
                            <Markdown>{sanitizeText(message.content)}</Markdown>
                          </div>
                        ) : (
                          <p className="text-lg">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
            {error && (
              <p className="text-right text-red-500 -translate-y-5">
                {error.message}
              </p>
            )}
            {status === "submitted" && (
              <div className="min-h-56">
                <div className="flex gap-4 items-center">
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
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} className="-scroll-mb-20" />
          </div>
        </div>

        <div className="p-4 pt-0 flex flex-col gap-4 items-center justify-center w-full">
          <div className="border border-black dark:border-white w-full xl:max-w-[800px] rounded-full flex items-center justify-center overflow-hidden px-4 gap-4 pr-2">
            <Stars
              className={`text-brandLight dark:text-brandDark ${
                status === "submitted" && "animate-pulse"
              }`}
            />
            <input
              type="text"
              placeholder="Ask Butler"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={status === "submitted"}
              className="py-4 w-full outline-none bg-transparent disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-neutral-500 dark:placeholder-neutral-400"
            />
            <button
              className="w-11 h-10 p-2 text-black bg-white hover:text-white hover:bg-black border border-black dark:border-white flex items-center justify-center transition-colors rounded-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
              onClick={status === "submitted" ? stop : handleSubmit}
              disabled={status === "submitted"}
            >
              {status === "submitted" || status === "streaming" ? (
                <Square className="bg-black" size={15} />
              ) : (
                <ArrowUp />
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
