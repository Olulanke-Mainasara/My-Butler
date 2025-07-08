"use client";

import React from "react";
import { ModelWithControls } from "@/app/combine/default/Womanincloths";

export default function Default() {
  if (typeof window === "undefined") {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex flex-col items-center h-screen"
      suppressHydrationWarning
    >
      <ModelWithControls />
    </div>
  );
}
