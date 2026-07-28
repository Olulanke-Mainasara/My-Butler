import { cn } from "@/lib/utils";
import React from "react";

const LoadingSkeleton = ({
  length = 6,
  className,
  height,
}: {
  length?: number;
  className?: string;
  height?: string;
}) => {
  return (
    <div
      className={cn(
        "grid md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 w-full",
        className,
      )}
    >
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className={`w-full h-60 md:h-64 rounded-lg bg-gray-200 animate-pulse ${height}`}
        ></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
