"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/Shad-UI/avatar";
import { Stars, Square, ArrowRight } from "lucide-react";
import { formatResponseText } from "@/lib/utils";
import { useChatManager } from "@/hooks/use-chat-manager";
import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { animate, stagger } from "framer-motion";
import { splitText } from "motion-plus";

export default function Chat({ prompt }: { prompt?: string }) {
  const [input, setInput] = React.useState("");
  const { loading, responseLoading, responseError, messages, handleSubmit } =
    useChatManager({ prompt, input, setInput, scrollToBottom });

  const endOfMessagesRef = React.useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { theme } = useTheme();

  // ---------- Scroll Control ----------
  function scrollToBottom() {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role !== "assistant" || !textRef.current) return;

    const { lines } = splitText(textRef.current);
    animate(
      lines,
      { opacity: [0, 1], y: [10, 0] },
      {
        type: "spring",
        duration: 3,
        bounce: 0,
        delay: stagger(0.07),
      }
    );
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <section className="w-full flex flex-col h-screen pt-16">
        <div className="overflow-hidden w-full grow px-4 xl:px-8">
          <div className="space-y-8 overflow-y-scroll h-full scrollbar-none max-w-screen-md m-auto">
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
                        className={`${
                          message.role === "user" ? "hidden" : "hidden md:flex"
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
                              ref={
                                index === messages.length - 1 ? textRef : null
                              }
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
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-4 h-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
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
              className="w-11 h-10 p-2 text-black bg-white hover:text-white hover:bg-black border border-black dark:border-white flex items-center justify-center transition-colors rounded-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
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
