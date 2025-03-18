"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof Toaster>;

const Sonner = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Toaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          description:
            "group-[.toast]:text-neutral-500 dark:group-[.toast]:text-neutral-400",
          actionButton:
            "group-[.toast]:bg-neutral-900 group-[.toast]:text-neutral-50 dark:group-[.toast]:bg-neutral-50 dark:group-[.toast]:text-neutral-900",
          cancelButton:
            "group-[.toast]:bg-lightBackground group-[.toast]:text-neutral-500 dark:group-[.toast]:bg-neutral-800 dark:group-[.toast]:text-neutral-400",
        },
      }}
      position="top-center"
      richColors
      {...props}
    />
  );
};

export { Sonner };
