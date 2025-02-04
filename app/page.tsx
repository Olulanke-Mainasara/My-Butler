"use client";

import Home from "@/components/Page-Components/Home";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 bg-white dark:bg-background"></div>
      }
    >
      <Home />
    </Suspense>
  );
}
