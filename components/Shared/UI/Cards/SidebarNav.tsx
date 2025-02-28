"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/Shad-UI/button";

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
              ? "bg-darkBackground text-white"
              : pathname === item.href
              ? "bg-neutral-800"
              : "hover:bg-darkBackground",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
