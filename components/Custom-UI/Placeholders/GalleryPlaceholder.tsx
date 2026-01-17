import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import emptyGalleryDark from "@/public/Placeholders/Empty-Gallery/empty-gallery-dark.svg";
import emptyGalleryLight from "@/public/Placeholders/Empty-Gallery/empty-gallery-light.svg";

export function GalleryPlaceholder() {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col items-center justify-center h-full">
      <Image
        src={theme === "dark" ? emptyGalleryDark : emptyGalleryLight}
        alt="Empty cart"
        className="size-64 md:size-80"
      />
      <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
        No images
      </h2>
      <p className="text-neutral-500 mt-2 text-center max-w-xs">
        Your images will show up here when you take pictures
      </p>
    </section>
  );
}
