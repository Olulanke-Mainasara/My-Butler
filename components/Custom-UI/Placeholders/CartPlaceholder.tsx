import React from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import emptyCartDark from "@/public/Placeholders/Empty-Cart/empty-cart-dark.svg";
import emptyCartLight from "@/public/Placeholders/Empty-Cart/empty-cart-light.svg";

export function CartPlaceholder() {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col items-center justify-center h-full">
      <Image
        src={theme === "dark" ? emptyCartDark : emptyCartLight}
        alt="Empty cart"
        className="size-64 md:size-80"
      />
      <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white">
        No cart items
      </h2>
      <p className="text-neutral-500 mt-2 text-center max-w-xs">
        Products, Food, and events will show up here when you add them to your
        cart
      </p>
    </section>
  );
}
