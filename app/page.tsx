"use client";

import Home from "@/components/Page-Components/Home";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<div></div>}>
      <Home />
    </Suspense>
  );
}
