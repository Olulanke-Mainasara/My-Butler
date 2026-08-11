"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

// next-themes renders its no-flash-of-wrong-theme script via a plain
// React.createElement("script", ...), which trips React 19's dev-only
// warning about script tags rendered inside components. The script still
// executes correctly (it's part of the raw SSR'd HTML) - this is a known
// false positive (github.com/pacocoursey/next-themes/issues/385) with no
// fixed release yet. Filter just this one message, dev-only.
if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  !(console.error as { __filtersNextThemes?: boolean }).__filtersNextThemes
) {
  const originalConsoleError = console.error;
  const filteredConsoleError = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Encountered a script tag while rendering React component"
      )
    ) {
      return;
    }
    originalConsoleError(...args);
  };
  filteredConsoleError.__filtersNextThemes = true;
  console.error = filteredConsoleError;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
