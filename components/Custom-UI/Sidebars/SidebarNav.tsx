"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/Shad-UI/button";
import Link from "next/link";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    id: number;
    href: string;
    title: string;
  }[];
  initialPath: string;
}

export function SidebarNav({
  className,
  items,
  initialPath,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
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
            pathname === initialPath && item.id === 1
              ? "bg-neutral-800 text-white"
              : pathname === item.href
              ? "bg-neutral-800 text-white"
              : "",
            "justify-start text-base hover:bg-neutral-800 hover:text-white"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
