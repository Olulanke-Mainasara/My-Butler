import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import emptyGalleryDark from "@/public/Placeholders/Empty-Gallery/empty-gallery-dark.svg";
import emptyGalleryLight from "@/public/Placeholders/Empty-Gallery/empty-gallery-light.svg";
import { Button } from "@/components/Shad-UI/button";
import { useTransitionRouter } from "next-view-transitions";

export function LoginPlaceholder({
  info,
  close,
}: {
  info: string;
  close?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { theme } = useTheme();
  const router = useTransitionRouter();

  const handleLoginTransition = () => {
    if (close) {
      close(false);
    }
    router.push("/auth/login");
  };

  return (
    <section className="flex flex-col items-center justify-center h-full">
      <Image
        suppressHydrationWarning
        src={theme === "dark" ? emptyGalleryDark : emptyGalleryLight}
        alt="Empty cart"
        className="size-60 md:size-72"
      />
      <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
        Hello, there
      </h2>
      <p className="text-neutral-500 mt-2 max-w-xs flex">
        You need to login before you can view {info}
        <Button onClick={handleLoginTransition}>Login</Button>
      </p>
    </section>
  );
}
