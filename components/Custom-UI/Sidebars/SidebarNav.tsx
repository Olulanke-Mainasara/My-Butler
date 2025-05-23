"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/Shad-UI/button";
import { Link } from "next-view-transitions";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    id: number;
    href: string;
    title: string;
    icon: React.JSX.Element;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  // Get only the base path
  const basePath = pathname?.split("/").slice(0, 3).join("/");

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-3 scrollbar-none",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            basePath === item.href ? "bg-neutral-800 text-white" : "",
            "justify-start text-base hover:bg-neutral-500 dark:hover:bg-neutral-500 hover:text-white"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
