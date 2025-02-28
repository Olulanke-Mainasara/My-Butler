"use client";

import Home from "@/components/Page-Components/Home";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 bg-lightBackground dark:bg-darkBackground"></div>
      }
    >
      <Home />
    </Suspense>
  );
}
