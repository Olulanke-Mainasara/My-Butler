import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import emptyGalleryDark from "@/public/Empty-Gallery/empty-gallery-dark.svg";
import emptyGalleryLight from "@/public/Empty-Gallery/empty-gallery-light.svg";
import { Link } from "next-view-transitions";
import { Button } from "@/components/Shad-UI/button";

export function LoginPlaceholder({ info }: { info: string }) {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col items-center justify-center h-full">
      <Image
        src={theme === "dark" ? emptyGalleryDark : emptyGalleryLight}
        alt="Empty cart"
        className="size-60 md:size-72"
      />
      <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
        Hello, there
      </h2>
      <p className="text-neutral-500 mt-2 max-w-xs flex">
        You need to login before you can view {info}
        <Button asChild>
          <Link href={"/auth/login"}>Login</Link>
        </Button>
      </p>
    </section>
  );
}
